# @thinking-cap/tally-client

Tally routing intelligence client. Ask Tally which model to use, report results back.

## Install

```bash
npm install github:thinking-cap/tally-client
```

## Usage

```typescript
import { TallyClient, buildEnvelope } from '@thinking-cap/tally-client';

const tally = new TallyClient();
// Uses TALLY_API_URL (default: http://localhost:5000) and TALLY_API_KEY env vars

// Before your model call:
const envelope = buildEnvelope({ contextChars: 12000, turnCount: 4 });

const recommendation = await tally.routeSafe({
  semantic_envelope: envelope,
  available_models:  ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001'],
});

const model = recommendation?.recommended_model ?? 'claude-sonnet-4-6';

// After your model call:
tally.report({
  id:               crypto.randomUUID(),
  semantic_envelope: envelope,
  model_used:        model,
  tokens_input:      usage.input_tokens,
  tokens_output:     usage.output_tokens,
  duration_ms:       elapsed,
  success:           true,
});
```

## Config

| Env var         | Default                  | Description              |
|-----------------|--------------------------|--------------------------|
| `TALLY_API_URL` | `http://localhost:5000`  | Tally API base URL       |
| `TALLY_API_KEY` | _(none)_                 | API key from portal      |

## `buildEnvelope(opts)` options

| Option                 | Default     | Description                            |
|------------------------|-------------|----------------------------------------|
| `contextChars`         | `0`         | Total context length in characters     |
| `estimatedOutputChars` | `4000`      | Expected output size in characters     |
| `turnCount`            | `1`         | Conversation depth                     |
| `toolCount`            | `0`         | Number of available tools              |
| `hasMutatingTools`     | `false`     | Whether any tools write/mutate         |
| `taskType`             | `'agentic'` | Override task type                     |
| `determinismRequired`  | `false`     | Whether deterministic output needed    |
| `capabilityTags`       | `[]`        | Extra tags (e.g. `['json_output']`)    |
