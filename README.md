# DMoney API Integration Testing 

Integration tests for the DMoney API, covering the full user lifecycle and transaction flow — from admin/system login through merchant, agent, and customer onboarding, to money transfers between them.

## Tools & Frameworks

- **[Node.js](https://nodejs.org/)** — runtime (ES Modules, `"type": "module"` in `package.json`)
- **[Mocha](https://mochajs.org/)** — test framework/runner
- **[Chai](https://www.chaijs.com/)** — assertion library (`expect` style)
- **[Axios](https://axios-http.com/)** — HTTP client for calling the DMoney API
- **[dotenv](https://www.npmjs.com/package/dotenv)** — loads environment variables (e.g. `BASE_URL`) from a `.env` file

## Prerequisites

- Node.js installed (v18+ recommended)
- The DMoney API server running locally (default: `http://localhost:5000`)

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd "Integration Testing Assignment"
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the API base URL:

   ```env
   BASE_URL=http://localhost:5000
   ```

## Running the Tests

Make sure the DMoney API server is running, then execute:

```bash
npm test
```

This runs the Mocha suite in [`Integration-Test/dmoney.spec.js`](Integration-Test/dmoney.spec.js) and prints a pass/fail result for each step.

Alternatively, run Mocha directly:

```bash
npx mocha Integration-Test/dmoney.spec.js
```

## Test Flow

The suite exercises the DMoney API end-to-end in sequence, chaining access tokens and IDs between steps:

1. Admin & System login
2. Merchant creation, login, OTP verification, and activation
3. Agent creation, login, OTP verification, and activation
4. System deposit to Agent
5. Customer01 & Customer02 creation, login, OTP verification, and activation
6. Agent deposit to Customer01
7. Customer01 sends money to Customer02
8. Customer01 cashes out via Agent
9. Customer02 makes a payment to Merchant

Each step asserts the HTTP response status and relevant response data (tokens, IDs, phone numbers) before proceeding to the next.

## Console Log Output

<img width="1183" height="538" alt="image" src="https://github.com/user-attachments/assets/a0dbce99-d996-44f4-a84c-d14d3491d910" />

<img width="1171" height="503" alt="image" src="https://github.com/user-attachments/assets/fff536fe-6bb9-4af2-9d26-693df020388b" />

## Bash Tool Output

<img width="1365" height="767" alt="image" src="https://github.com/user-attachments/assets/8732753d-b159-40b4-9906-e53a6f31c5be" />

