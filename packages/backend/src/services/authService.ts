import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserRefreshToken,
} from '../repositories/userRepository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  type JwtPayload,
} from '../utils/jwt.js';

export async function signup(
  email: string,
  password: string,
  name: string,
  role: string
) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser(email, passwordHash, name, role);

  if (!user) {
    throw new Error('Failed to create user');
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const refreshTokenHash = await hashPassword(refreshToken);

  await updateUserRefreshToken(user.id, refreshTokenHash);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
}

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const refreshTokenHash = await hashPassword(refreshToken);

  await updateUserRefreshToken(user.id, refreshTokenHash);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshToken(refreshTokenString: string) {
  const payload = verifyRefreshToken(refreshTokenString);

  const user = await findUserById(payload.userId);
  if (!user?.refreshTokenHash) {
    throw new Error('Invalid refresh token');
  }

  const isValidRefreshToken = await comparePassword(
    refreshTokenString,
    user.refreshTokenHash
  );
  if (!isValidRefreshToken) {
    throw new Error('Invalid refresh token');
  }

  const newPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);
  const newRefreshTokenHash = await hashPassword(newRefreshToken);

  await updateUserRefreshToken(user.id, newRefreshTokenHash);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logout(userId: number) {
  await updateUserRefreshToken(userId, null);
}

export async function getMe(userId: number) {
  const user = await findUserById(userId);
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
