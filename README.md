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

The suite exercises the DMoney API end-to-end in a single sequential run, chaining access tokens and IDs from one step into the next:

1. Admin Login
2. Store Admin access token
3. System Login
4. Store System access token
5. Create a Merchant
6. Login Merchant account
7. Verify Merchant OTP
8. Store Merchant access token
9. Store Merchant phone number and ID
10. Update Merchant status (activate)
11. Create an Agent
12. Login Agent account
13. Verify Agent OTP
14. Store Agent access token
15. Store Agent phone number and ID
16. Update Agent status (activate)
17. System deposits money to Agent
18. Create Customer01
19. Customer01 Login
20. Verify Customer01 OTP
21. Store Customer01 access token
22. Store Customer01 phone number and ID
23. Update Customer01 status (activate)
24. Create Customer02
25. Customer02 Login
26. Verify Customer02 OTP
27. Store Customer02 access token
28. Store Customer02 phone number and ID
29. Update Customer02 status (activate)
30. Agent deposits money to Customer01
31. Customer01 sends money to Customer02
32. Customer01 cashes out money via Agent
33. Customer02 makes a payment to Merchant
34. Validate the response of every API call above (status code, response body, and token/ID presence)

Each step asserts the HTTP response status and relevant response data (tokens, IDs, phone numbers) before proceeding to the next, so a failure at any step surfaces exactly where the flow broke.

### Flow Diagram

```
Admin Login
    ↓
System Login
    ↓
Create Merchant → Login + OTP → Activate
    ↓
Create Agent → Login + OTP → Activate
    ↓
System → Agent: Deposit 5,000 Tk
    ↓
Create Customer 1 → Login + OTP → Activate
    ↓
Create Customer 2 → Login + OTP → Activate
    ↓
Agent → Customer 1: Deposit 2,000 Tk
    ↓
Customer 1 → Customer 2: Send Money 1,000 Tk
    ↓
Customer 1 → Agent: Cash Out 500 Tk
    ↓
Customer 2 → Merchant: Payment 400 Tk
```

## Console Log Output

<img width="1183" height="538" alt="image" src="https://github.com/user-attachments/assets/a0dbce99-d996-44f4-a84c-d14d3491d910" />

<img width="1171" height="503" alt="image" src="https://github.com/user-attachments/assets/fff536fe-6bb9-4af2-9d26-693df020388b" />

## Bash Tool Output

<img width="1365" height="767" alt="image" src="https://github.com/user-attachments/assets/8732753d-b159-40b4-9906-e53a6f31c5be" />

