"""Reference state machine for safe mutator retries and verified outcomes."""
from enum import Enum

class Outcome(str, Enum):
    VERIFIED='verified'
    FAILED='failed'
    PARTIAL='partial'
    UNCERTAIN='uncertain'


def result_after_tool(*, executed: bool, timed_out: bool = False, permission_denied: bool = False,
                      target_confirmed: bool = False, partial_confirmed: bool = False) -> Outcome:
    if permission_denied:
        return Outcome.FAILED
    if target_confirmed:
        return Outcome.VERIFIED
    if partial_confirmed:
        return Outcome.PARTIAL
    if timed_out and executed:
        return Outcome.UNCERTAIN
    return Outcome.FAILED if not executed else Outcome.UNCERTAIN


def may_retry(action_class: str, *, execution_started: bool,
              no_effect_proved: bool = False) -> bool:
    if action_class=='READ':
        return True  # limited idempotent provider fallback, not unbounded retries
    if action_class in {'EXTERNAL_ACTION','DESTRUCTIVE','PRIVILEGED'}:
        return not execution_started  # prior to execution only
    if action_class=='WRITE':
        return not execution_started or no_effect_proved
    raise ValueError('unknown action class')
