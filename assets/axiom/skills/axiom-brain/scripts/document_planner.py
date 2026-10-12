"""No-write document helpers for a user-controlled Second Brain."""
from pathlib import Path, PurePosixPath
import hashlib
import re

FOLDERS = {
    'rechnung': 'Finanzen/Rechnungen',
    'vertrag': 'Dokumente/Vertraege',
    'zertifikat': 'Karriere/Zertifikate',
    'nachweis': 'Dokumente/Nachweise',
}


def suggest_document(text: str, filename: str, *, date_label: str | None = None) -> dict:
    s = (text or '').casefold()
    category = next((name for name in FOLDERS if name in s), 'unbekannt')
    label = re.sub(r'[^a-zA-Z0-9äöüÄÖÜ_-]+','-',Path(filename).stem).strip('-')[:80] or 'Dokument'
    proposed = f'{date_label}-{label}' if date_label else label
    suffix = Path(filename).suffix.lower()
    if suffix not in {'.pdf','.md','.txt','.png','.jpg','.jpeg'}:
        suffix = '.bin'
    return {'type':category,'suggested_subfolder':FOLDERS.get(category,None),
            'suggested_filename':proposed+suffix,'needs_approval':True}


def fingerprint(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def safe_relative_path(raw_path: str) -> str:
    """Reject traversal, absolute paths, separators bypass and hidden state paths."""
    if not raw_path or '\\' in raw_path or '\x00' in raw_path or ':' in raw_path:
        raise ValueError('unsafe path')
    p = PurePosixPath(raw_path)
    if p.is_absolute() or any(part in {'.','..'} for part in raw_path.split('/')) or not p.parts:
        raise ValueError('path traversal or absolute path')
    if any(part.startswith('.') for part in p.parts):
        raise ValueError('hidden/system path needs separate approval')
    return str(p)


def safe_local_destination(root: str | Path, relative: str) -> Path:
    """Resolve symlinks and confine destination to an EXISTING authorized root."""
    relative = safe_relative_path(relative)
    root_path = Path(root).resolve(strict=True)
    dest = (root_path / relative).resolve(strict=False)
    if not dest.is_relative_to(root_path) or dest == root_path:
        raise ValueError('destination escapes root')
    return dest
