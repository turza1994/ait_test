import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { app } from '../src/app.js';
import { hashPassword } from '../src/utils/password.js';
import { db } from '../src/db/client.js';
import { users } from '../src/models/index.js';
import { eq } from 'drizzle-orm';

const BASE_URL = 'http://localhost:5000';

describe('Authentication Integration Tests', () => {
  let testUserId: number;
  const testUser = {
    email: 'test@example.com',
    password: 'testpassword123',
  };

  before(async () => {
    // Clean up any existing test user
    await db.delete(users).where(eq(users.email, testUser.email));
  });

  after(async () => {
    // Clean up test user
    await db.delete(users).where(eq(users.email, testUser.email));
  });

  test('should signup user successfully', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    assert.strictEqual(response.status, 201);

    const data = await response.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.user);
    assert.strictEqual(data.data.user.email, testUser.email);
    assert.ok(data.data.accessToken);

    testUserId = data.data.user.id;
  });

  test('should login with correct credentials', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    assert.strictEqual(response.status, 200);

    const data = await response.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data.user);
    assert.strictEqual(data.data.user.email, testUser.email);
    assert.ok(data.data.accessToken);
  });

  test('should fail login with incorrect credentials', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: 'wrongpassword',
      }),
    });

    assert.strictEqual(response.status, 400);

    const data = await response.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.message, 'Invalid credentials');
  });

  test('should refresh access token using cookies', async () => {
    // First login to get tokens and cookies
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    assert.strictEqual(loginResponse.status, 200);

    const loginData = await loginResponse.json();
    assert.strictEqual(loginData.success, true);
    assert.ok(loginData.data.accessToken);
    assert.ok(loginData.data.user);

    // Extract cookies from login response
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    assert.ok(setCookieHeader, 'Refresh token cookie should be set');

    // Parse cookie to get refresh token
    const cookies: { [key: string]: string } = {};
    setCookieHeader.split(',').forEach((cookie) => {
      const [nameValue] = cookie.trim().split(';');
      const [name, value] = nameValue.split('=');
      if (name && value) {
        cookies[name.trim()] = value.trim();
      }
    });

    const refreshToken = cookies['refresh_token'];
    assert.ok(refreshToken, 'Refresh token should be in cookies');

    const csrfToken = cookies['_csrf'];
    assert.ok(csrfToken, 'CSRF token should be in cookies');

    // Now test token refresh using the cookie
    const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
        Cookie: `refresh_token=${refreshToken}; _csrf=${csrfToken}`,
      },
    });

    assert.strictEqual(refreshResponse.status, 200);

    const refreshData = await refreshResponse.json();
    assert.strictEqual(refreshData.success, true);
    assert.ok(refreshData.data.accessToken);

    // Verify a new cookie was set (token rotation)
    const newSetCookieHeader = refreshResponse.headers.get('set-cookie');
    assert.ok(
      newSetCookieHeader,
      'New refresh token cookie should be set after rotation'
    );
  });

  test('should logout successfully and clear refresh token', async () => {
    // First login to get authenticated
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    assert.strictEqual(loginResponse.status, 200);

    const loginData = await loginResponse.json();
    const accessToken = loginData.data.accessToken;

    // Extract cookies from login response
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    assert.ok(setCookieHeader, 'Refresh token cookie should be set');

    // Parse cookie to get refresh token
    const cookies: { [key: string]: string } = {};
    setCookieHeader.split(',').forEach((cookie) => {
      const [nameValue] = cookie.trim().split(';');
      const [name, value] = nameValue.split('=');
      if (name && value) {
        cookies[name.trim()] = value.trim();
      }
    });

    const refreshToken = cookies['refresh_token'];
    const csrfToken = cookies['_csrf'];

    // Test logout
    const logoutResponse = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    assert.strictEqual(logoutResponse.status, 200);

    const logoutData = await logoutResponse.json();
    assert.strictEqual(logoutData.success, true);
    assert.strictEqual(logoutData.message, 'Logged out successfully');

    // Verify cookie was cleared
    const clearCookieHeader = logoutResponse.headers.get('set-cookie');
    if (clearCookieHeader) {
      assert.ok(
        clearCookieHeader.includes('Max-Age=0'),
        'Cookie should be cleared with Max-Age=0'
      );
    }

    // Verify refresh token no longer works
    const failedRefreshResponse = await fetch(
      `${BASE_URL}/api/auth/refresh-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
          Cookie: `refresh_token=${refreshToken}; _csrf=${csrfToken}`,
        },
      }
    );

    assert.strictEqual(failedRefreshResponse.status, 401);
    const failedData = await failedRefreshResponse.json();
    assert.strictEqual(failedData.success, false);
  });

  test('should prevent duplicate signup', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    assert.strictEqual(response.status, 400);

    const data = await response.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.message, 'Email already exists');
  });
});
