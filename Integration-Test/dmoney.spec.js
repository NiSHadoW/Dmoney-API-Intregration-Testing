import { expect } from "chai";
import { describe, it } from "mocha";
import axios from "axios";

//process.loadEnvFile(new URL("../.env", import.meta.url));
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.BASE_URL;
//const BASE_URL = process.env.BASE_URL;

const SECRET_KEY = "ROADTOSDET";

// Generates a unique 11-digit BD-style phone number so reruns don't collide with existing users
function generateUniquePhoneNumber() {
  const random = Math.floor(10000000 + Math.random() * 90000000);
  return `013${random}`.slice(0, 11);
}

function generateUniqueEmail(tag) {
  return `iffatnishat54+b19+${tag}${Date.now()}${Math.floor(
    Math.random() * 1000,
  )}@gmail.com`;
}

describe("DMoney Full Integration Test", function () {
  this.timeout(30000);

  let admin_token;
  let system_token;

  let merchant_token;
  let merchant_phone;
  let merchant_id;

  let agent_token;
  let agent_phone;
  let agent_id;

  let customer01_token;
  let customer01_phone;
  let customer01_id;

  let customer02_token;
  let customer02_phone;
  let customer02_id;

  // 1 & 2. Admin Login
  it("1. Admin should login successfully", async function () {
    const response = await axios.post(`${BASE_URL}/user/login`, {
      email: "admin@dmoney.com",
      password: "1234",
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("token");

    admin_token = response.data.token;

    expect(admin_token).to.be.a("string").and.not.empty;
  });

  // 3 & 4. System Login
  it("2. System should login successfully", async function () {
    const response = await axios.post(`${BASE_URL}/user/login`, {
      email: "system@dmoney.com",
      password: "1234",
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("token");

    system_token = response.data.token;

    expect(system_token).to.be.a("string").and.not.empty;
  });

  // 5. Create Merchant
  it("3. Admin should create Merchant", async function () {
    const response = await axios.post(
      `${BASE_URL}/user/create`,
      {
        name: "Lindsay Walter",
        email: generateUniqueEmail("merchant"),
        password: "1234",
        phone_number: generateUniquePhoneNumber(),
        nid: "9876543210",
        role: "Merchant",
      },
      {
        headers: {
          Authorization: `Bearer ${admin_token}`,
          "X-AUTH-SECRET-KEY": SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).to.equal(201);
    expect(response.data).to.have.property("user");

    // 9. Store Merchant PhoneNumber and Merchant ID
    merchant_id = response.data.user.id;
    merchant_phone = response.data.user.phone_number;

    expect(merchant_id).to.exist;
    expect(merchant_phone).to.be.a("string").and.not.empty;
  });

  // 6. Login Merchant
  it("4. Merchant should login successfully", async function () {
    const response = await axios.post(`${BASE_URL}/user/login?env=dev`, {
      email: `${merchant_phone}`,
      password: "1234",
    });

    expect(response.status).to.equal(200);
  });

  // 7 & 8. Verify Merchant OTP
  it("5. Merchant OTP should be verified", async function () {
    const response = await axios.post(`${BASE_URL}/user/verify-otp?env=dev`, {
      identifier: `${merchant_phone}`,
      otp: "0000",
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("token");

    merchant_token = response.data.token;

    expect(merchant_token).to.be.a("string").and.not.empty;
  });

  // 10. Update Merchant Status
  it("6. Admin should update Merchant status", async function () {
    const response = await axios.patch(
      `${BASE_URL}/user/update/${merchant_id}`,
      {
        status: "active",
      },
      {
        headers: {
          Authorization: `Bearer ${admin_token}`,
          "X-AUTH-SECRET-KEY": SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).to.equal(200);
  });

  // 11. Create Agent
  it("7. Admin should create Agent", async function () {
    const response = await axios.post(
      `${BASE_URL}/user/create`,
      {
        name: "Homer Casper",
        email: generateUniqueEmail("agent"),
        password: "1234",
        phone_number: generateUniquePhoneNumber(),
        nid: "9876543210",
        role: "Agent",
      },
      {
        headers: {
          Authorization: `Bearer ${admin_token}`,
          "X-AUTH-SECRET-KEY": SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).to.equal(201);
    expect(response.data).to.have.property("user");

    // 15. Store Agent PhoneNumber and Agent ID
    agent_id = response.data.user.id;
    agent_phone = response.data.user.phone_number;

    expect(agent_id).to.exist;
    expect(agent_phone).to.be.a("string").and.not.empty;
  });

  // 12. Login Agent
  it("8. Agent should login successfully", async function () {
    const response = await axios.post(`${BASE_URL}/user/login?env=dev`, {
      email: `${agent_phone}`,
      password: "1234",
    });

    expect(response.status).to.equal(200);
  });

  // 13 & 14. Verify Agent OTP
  it("9. Agent OTP should be verified", async function () {
    const response = await axios.post(`${BASE_URL}/user/verify-otp?env=dev`, {
      identifier: `${agent_phone}`,
      otp: "0000",
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("token");

    agent_token = response.data.token;

    expect(agent_token).to.be.a("string").and.not.empty;
  });

  // 16. Update Agent Status
  it("10. Admin should update Agent status", async function () {
    const response = await axios.patch(
      `${BASE_URL}/user/update/${agent_id}`,
      {
        status: "active",
      },
      {
        headers: {
          Authorization: `Bearer ${admin_token}`,
          "X-AUTH-SECRET-KEY": SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).to.equal(200);
  });

  // 17. System Deposit to Agent
  it("11. System should deposit money to Agent", async function () {
    const response = await axios.post(
      `${BASE_URL}/transaction/deposit`,
      {
        from_account: "SYSTEM",
        to_account: `${agent_phone}`,
        amount: 5000,
      },
      {
        headers: {
          Authorization: `Bearer ${system_token}`,
          "X-AUTH-SECRET-KEY": SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).to.equal(201);
  });

  // 18. Create Customer01
  it("12. Admin should create Customer01", async function () {
    const response = await axios.post(
      `${BASE_URL}/user/create`,
      {
        name: "Stacy Watsica",
        email: generateUniqueEmail("customer01"),
        password: "1234",
        phone_number: generateUniquePhoneNumber(),
        nid: "9876543210",
        role: "Customer",
      },
      {
        headers: {
          Authorization: `Bearer ${admin_token}`,
          "X-AUTH-SECRET-KEY": SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).to.equal(201);
    expect(response.data).to.have.property("user");

    // 22. Store Customer01 PhoneNumber and Customer01 ID
    customer01_id = response.data.user.id;
    customer01_phone = response.data.user.phone_number;

    expect(customer01_id).to.exist;
    expect(customer01_phone).to.be.a("string").and.not.empty;
  });

  // 19. Customer01 Login
  it("13. Customer01 should login successfully", async function () {
    const response = await axios.post(`${BASE_URL}/user/login?env=dev`, {
      email: `${customer01_phone}`,
      password: "1234",
    });

    expect(response.status).to.equal(200);
  });

  // 20 & 21. Verify Customer01 OTP
  it("14. Customer01 OTP should be verified", async function () {
    const response = await axios.post(`${BASE_URL}/user/verify-otp?env=dev`, {
      identifier: `${customer01_phone}`,
      otp: "0000",
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("token");

    customer01_token = response.data.token;

    expect(customer01_token).to.be.a("string").and.not.empty;
  });

  // 23. Update Customer01 Status
  it("15. Admin should update Customer01 status", async function () {
    const response = await axios.patch(
      `${BASE_URL}/user/update/${customer01_id}`,
      {
        status: "active",
      },
      {
        headers: {
          Authorization: `Bearer ${admin_token}`,
          "X-AUTH-SECRET-KEY": SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).to.equal(200);
  });

  // 24. Create Customer02
  it("16. Admin should create Customer02", async function () {
    const response = await axios.post(
      `${BASE_URL}/user/create`,
      {
        name: "William Muller",
        email: generateUniqueEmail("customer02"),
        password: "1234",
        phone_number: generateUniquePhoneNumber(),
        nid: "9876543210",
        role: "Customer",
      },
      {
        headers: {
          Authorization: `Bearer ${admin_token}`,
          "X-AUTH-SECRET-KEY": SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).to.equal(201);
    expect(response.data).to.have.property("user");

    // 27. Store Customer02 PhoneNumber and Customer02 ID
    customer02_id = response.data.user.id;
    customer02_phone = response.data.user.phone_number;

    expect(customer02_id).to.exist;
    expect(customer02_phone).to.be.a("string").and.not.empty;
  });

  // 25. Customer02 Login
  it("17. Customer02 should login successfully", async function () {
    const response = await axios.post(`${BASE_URL}/user/login?env=dev`, {
      email: `${customer02_phone}`,
      password: "1234",
    });

    expect(response.status).to.equal(200);
  });

  // 26 & 28. Verify Customer02 OTP
  it("18. Customer02 OTP should be verified", async function () {
    const response = await axios.post(`${BASE_URL}/user/verify-otp?env=dev`, {
      identifier: `${customer02_phone}`,
      otp: "0000",
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property("token");

    customer02_token = response.data.token;

    expect(customer02_token).to.be.a("string").and.not.empty;
  });

  // 29. Update Customer02 Status
  it("19. Admin should update Customer02 status", async function () {
    const response = await axios.patch(
      `${BASE_URL}/user/update/${customer02_id}`,
      {
        status: "active",
      },
      {
        headers: {
          Authorization: `Bearer ${admin_token}`,
          "X-AUTH-SECRET-KEY": SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).to.equal(200);
  });

  // 30. Agent Deposit to Customer01
  it("20. Agent should deposit money to Customer01", async function () {
    const response = await axios.post(
      `${BASE_URL}/transaction/deposit`,
      {
        from_account: `${agent_phone}`,
        to_account: `${customer01_phone}`,
        amount: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${agent_token}`,
          "X-AUTH-SECRET-KEY": SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).to.equal(201);
  });

  // 31. Customer01 Send Money to Customer02
  it("21. Customer01 should send money to Customer02", async function () {
    const response = await axios.post(
      `${BASE_URL}/transaction/sendmoney`,
      {
        from_account: `${customer01_phone}`,
        to_account: `${customer02_phone}`,
        amount: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${customer01_token}`,
          "X-AUTH-SECRET-KEY": SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).to.equal(201);
  });

  // 32. Customer01 Cashout Money from Agent
  it("22. Customer01 should cashout from Agent", async function () {
    const response = await axios.post(
      `${BASE_URL}/transaction/withdraw`,
      {
        from_account: `${customer01_phone}`,
        to_account: `${agent_phone}`,
        amount: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${customer01_token}`,
          "X-AUTH-SECRET-KEY": SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).to.equal(201);
  });

  // 33. Customer02 Payment to Merchant
  it("23. Customer02 should make payment to Merchant", async function () {
    const response = await axios.post(
      `${BASE_URL}/transaction/payment`,
      {
        from_account: `${customer02_phone}`,
        to_account: `${merchant_phone}`,
        amount: 400,
      },
      {
        headers: {
          Authorization: `Bearer ${customer02_token}`,
          "X-AUTH-SECRET-KEY": SECRET_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).to.equal(201);
  });
});
