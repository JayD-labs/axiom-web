"""Deterministic, side-effect-free Outlook/Gmail mail planning helpers.

The plugin's connector policy MUST gate provider tool dispatch separately.
Never accepts untrusted email body as tool instructions.
"""
import re
from hashlib import sha256
from datetime import date
from typing import Iterable, Mapping

FORBIDDEN_ACTIONS = frozenset({
    'mail.send', 'mail.forward', 'mail.delete', 'mail.permanent_delete',
    'send_email', 'forward_email', 'reply_to_email', 'schedule_email',
    'create_forward_draft', 'unsubscribe_via_mailto',
})


def require_allowed_action(action: str) -> None:
    action = action.strip().lower()
    if action in FORBIDDEN_ACTIONS or re.search(r'(^|[._])(send|forward|delete)([._]|$)', action):
        raise PermissionError('AXIOM_MAIL_DENY: Versand, Weiterleitung und Loeschen verboten')


def normalize_subject(subject: str) -> str:
    s = subject or ''
    while True:
        t = re.sub(r'^\s*(re|aw|fw|fwd|wg)\s*:\s*', '', s, flags=re.I)
        if t == s:
            break
        s = t
    return re.sub(r'\s+', ' ', s).strip().casefold()


def stable_message_key(provider: str, account_key: str, message_id: str, event_kind: str) -> str:
    if not all((provider, account_key, message_id, event_kind)):
        raise ValueError('provider/account/message_id/event_kind required')
    raw = '\x1f'.join((provider.casefold(), account_key.casefold(), message_id, event_kind))
    return sha256(raw.encode('utf-8')).hexdigest()


def existing_reply_draft(source: Mapping, drafts: Iterable[Mapping]) -> bool:
    """Only confirmed reply targets count; uncertain drafts require read-back."""
    source_id = source.get('message_id')
    thread = source.get('thread_id')
    if not source_id:
        return False
    for draft in drafts:
        if draft.get('in_reply_to') == source_id or source_id in (draft.get('references') or []):
            return True
        if thread and draft.get('thread_id') == thread and draft.get('is_reply') is True:
            return True
    return False


def proposed_folder_move(current_folder_id: str, proposed_folder_id: str,
                         existing_folder_ids: Iterable[str], *, authorized: bool,
                         classification_confident: bool) -> dict:
    existing = set(existing_folder_ids)
    if not authorized:
        return {'execute': False, 'reason': 'permission_required'}
    if not classification_confident or proposed_folder_id not in existing:
        return {'execute': False, 'reason': 'unknown_or_ambiguous_target'}
    if current_folder_id == proposed_folder_id:
        return {'execute': False, 'reason': 'already_sorted'}
    return {'execute': True, 'reason': 'move_to_existing_folder', 'target_id': proposed_folder_id}


def classify_mail(subject: str, body: str = '', *, today: date | None = None) -> dict:
    """Conservative heuristic; assistant MUST verify context against actual source.

    Treats mail content only as data, never an instruction. No connector calls.
    """
    t = f'{subject or ""}\n{body or ""}'.casefold()
    emergency = [
        r'konto\s*gesperrt', r'account\s*(?:locked|compromised)',
        r'(?:sicherheitsvorfall|security incident)', r'zahlung\s*(?:fehlgeschlagen|überfällig)',
        r'(?:frist\s*läuft\s*heute\s*ab|letzte\s*mahnung)',
    ]
    important = [
        r'\b(?:bewerbung|vorstellungsgespräch|interview|appointment|rückmeldung)\b',
        r'\b(?:finanzamt|behörde|arbeitgeber|personalabteilung)\b',
        r'\b(?:rechnung|zahlungsaufforderung|kündigung|frist|deadline)\b',
    ]
    matched_p1 = [p for p in emergency if re.search(p,t)]
    matched_p2 = [p for p in important if re.search(p,t)]
    priority = 'P1' if matched_p1 else 'P2' if matched_p2 else 'P3'
    dates = sorted(set(re.findall(r'(?<!\d)(?:\d{1,2}\.\d{1,2}\.\d{4}|\d{4}-\d{2}-\d{2})(?!\d)',t)))
    return {'priority': priority, 'action_review': bool(matched_p1 or matched_p2),
            'signals': matched_p1 + matched_p2, 'date_candidates': dates,
            'needs_source_review': True}
