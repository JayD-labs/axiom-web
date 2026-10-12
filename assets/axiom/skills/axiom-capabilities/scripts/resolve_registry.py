"""Merge Axiom v2.1 canonical capabilities and v2.2 least-privilege overlay.
Requires PyYAML, which the existing release already uses in tests/validation.
No arbitrary code execution or connector calls.
"""
from copy import deepcopy
from pathlib import Path
import yaml

ROOT = Path(__file__).parents[1] / 'references'


def resolve_registry(base_path: Path | None = None, overlay_path: Path | None = None) -> dict:
    base = yaml.safe_load((base_path or ROOT/'capabilities.yaml').read_text(encoding='utf-8'))
    overlay = yaml.safe_load((overlay_path or ROOT/'capabilities-v22.yaml').read_text(encoding='utf-8'))
    if base['schema_version'] != 3 or overlay['schema_version'] != 1:
        raise ValueError('unsupported capability schema')
    caps = deepcopy(base['capabilities'])
    for name, definition in overlay.get('additions', {}).items():
        if name in caps:
            raise ValueError(f'overlapping capability {name}')
        caps[name] = definition
    allowed = {'connectors', 'preference_order', 'runtimes'}
    for name, changes in overlay.get('connector_mappings', {}).items():
        if name not in caps or set(changes) - allowed:
            raise ValueError(f'unsafe mapping change {name}')
        caps[name].update(changes)
    for name, c in caps.items():
        required = {'domain','action_class','permission','connectors','preference_order','runtimes','verification','retry_policy','evidence_ttl_seconds'}
        if not required <= c.keys():
            raise ValueError(f'incomplete capability {name}')
        if c['action_class']=='READ' and c['retry_policy']!='safe_read_retry':
            raise ValueError(f'invalid READ retry policy {name}')
        if c['action_class']!='READ' and c['retry_policy']=='safe_read_retry':
            raise ValueError(f'unsafe mutator retry policy {name}')
        if name.startswith('mail.') and name.rsplit('.',1)[-1] in {'send','forward','delete'}:
            raise ValueError(f'forbidden mail capability: {name}')
    return {'schema_version': base['schema_version'], 'capabilities': caps, 'defaults': base['defaults']}

if __name__ == '__main__':
    registry = resolve_registry()
    print(f"Axiom effective capabilities: {len(registry['capabilities'])}")
