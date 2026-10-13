# SMS Security Test Harness

This is a **local-only simulator** for testing an application's SMS workflows without contacting phone numbers or an SMS provider. It is designed for authorized development and QA.

## What it covers

The harness models consent gating, opt-out handling, E.164-like number validation, per-number rate limits, OTP issuance, and a delivery report. Every accepted message is marked `simulated: true` and stored in memory only.

## Example

```js
import { SmsTestHarness } from './index.js';

const lab = new SmsTestHarness({ maxPerWindow: 3 });
lab.setConsent('+15551234567');
const result = lab.issueOtp('+15551234567', { code: '654321' });
console.log(result); // simulated message; no network call
```

Run its tests from the project root with `npm test -- sms-lab`.

This module intentionally has no provider SDK, network transport, bulk-send loop, or target discovery. Use a provider's official sandbox only when you own the account and have explicit authorization.
