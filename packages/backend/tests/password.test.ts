import { test, describe } from 'node:test';
import assert from 'node:assert';
import { hashPassword, comparePassword } from '../src/utils/password.js';

describe('Password Utils', () => {
  test('hashPassword should hash a password', async () => {
    const password = 'testpassword123';
    const hash = await hashPassword(password);
    
    assert.ok(hash);
    assert.notStrictEqual(hash, password);
    assert.ok(hash.length > 50);
  });

  test('comparePassword should validate correct password', async () => {
    const password = 'testpassword123';
    const hash = await hashPassword(password);
    
    const isValid = await comparePassword(password, hash);
    assert.strictEqual(isValid, true);
  });

  test('comparePassword should reject incorrect password', async () => {
    const password = 'testpassword123';
    const wrongPassword = 'wrongpassword';
    const hash = await hashPassword(password);
    
    const isValid = await comparePassword(wrongPassword, hash);
    assert.strictEqual(isValid, false);
  });
});