"""Axiom notification deduplication. Does not deliver Push or create a scheduler.

Stores only hashes/labels, never raw mail/attachment content. A persistent store is
optional and must be chosen and authorized separately by the user.
"""
import hashlib
import json
import os
import tempfile
from dataclasses import dataclass
from pathlib import Path

PRIORITIES = frozenset({'P1', 'P2', 'P3'})


@dataclass(frozen=True)
class Event:
    provider: str
    source_id: str
    kind: str
    revision: str
    priority: str

    def __post_init__(self):
        if self.priority not in PRIORITIES:
            raise ValueError('unknown priority')
        if not all((self.provider, self.source_id, self.kind, self.revision)):
            raise ValueError('stable source and revision required')

    def key(self) -> str:
        payload = json.dumps([self.provider, self.source_id, self.kind], ensure_ascii=False)
        return hashlib.sha256(payload.encode()).hexdigest()

    def revision_hash(self) -> str:
        return hashlib.sha256(self.revision.encode()).hexdigest()


def decide(event: Event, history: dict, *, push_available: bool = False) -> dict:
    prev = history.get(event.key())
    if prev == event.revision_hash():
        return {'action': 'suppress_duplicate', 'reason': 'same_event_revision'}
    # A new revision of an already-seen event can be reported again.
    history[event.key()] = event.revision_hash()
    if event.priority == 'P3':
        return {'action': 'digest', 'reason': 'informational'}
    if push_available:
        return {'action': 'notify', 'reason': 'new_or_changed'}
    return {'action': 'report_in_chat_or_scheduled_run', 'reason': 'push_unavailable'}


def read_history(path: str | Path | None) -> dict:
    if path is None:
        return {}
    p = Path(path)
    if not p.is_file():
        return {}
    data = json.loads(p.read_text(encoding='utf-8'))
    if not isinstance(data, dict) or not all(isinstance(k, str) and isinstance(v,str) for k,v in data.items()):
        raise ValueError('invalid notification history')
    return data


def save_history(path: str | Path, history: dict) -> None:
    """Only after explicit persistent-state authorization; atomic replacement."""
    p = Path(path)
    if not p.parent.is_dir() or p.is_symlink():
        raise ValueError('unsafe/unavailable history destination')
    fd, temp = tempfile.mkstemp(dir=str(p.parent), prefix='.axiom-notify-', text=True)
    try:
        with os.fdopen(fd,'w', encoding='utf-8') as f:
            os.fchmod(f.fileno(), 0o600)
            json.dump(history, f, sort_keys=True)
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp,p)
        if read_history(p)!=history:
            raise IOError('read-back mismatch')
    finally:
        if os.path.exists(temp):
            os.unlink(temp)
