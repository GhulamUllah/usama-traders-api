// src/modules/auth/auth.service.ts

import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import UserModel from './auth.schema'; // Assuming we have a user model
import { AuthResponse } from './auth.types';
import { LoginInput, RegisterInput } from './auth.validators';
import { ObjectId } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn'];

export const registerUser = async (data: RegisterInput): Promise<AuthResponse> => {
  const { name, email, password } = data;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ name, email, password: hashedPassword });

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: { id: (user._id as string).toString(), name: user.name, email: user.email },
  };
};

export const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
  const { email, password } = data;

  const user = await UserModel.findOne({ email }).select('+password +isApproved');
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  if (!user.isApproved) {
    throw new Error('User is not Approved by admin yet.');
  }

  const token = jwt.sign({ id: (user._id as ObjectId).toString(), email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: { id: (user._id as string).toString(), name: user.name, email: user.email },
  };
};
