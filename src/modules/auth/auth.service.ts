// src/modules/auth/auth.service.ts

import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import UserModel from './auth.schema'; // Assuming we have a user model
import { AuthResponse } from './auth.types';
import { LoginInput, RegisterInput, ApproveUser, DeleteUser } from './auth.validators';
import { ObjectId } from 'mongoose';
import { config } from '../../config';
import { getUsersPipeline } from './auth.pipeline';

const JWT_SECRET = config.auth.jwtSecret;
const JWT_EXPIRES_IN = (config.auth.jwtExpiresIn || '1d') as SignOptions['expiresIn'];

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

  const token = jwt.sign(
    { id: (user._id as ObjectId).toString(), email: user.email, role: user.role },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );

  return {
    token,
    user: { id: (user._id as string).toString(), name: user.name, email: user.email },
  };
};

export const getAllUsers = async (): Promise<any[]> => {
  const users = await UserModel.aggregate(getUsersPipeline() as any);
  return users;
};

export const approveUser = async ({ userId, status }: ApproveUser): Promise<AuthResponse> => {
  const user = await UserModel.findByIdAndUpdate(userId, { isApproved: status }, { new: true });
  if (!user) {
    throw new Error('User not found');
  }

  return {
    message: 'User approved successfully',
    user,
  } as unknown as AuthResponse;
};

export const deleteUser = async (payload: DeleteUser): Promise<AuthResponse> => {
  const { userId } = payload;
  const userCheck = await UserModel.findById(userId);
  let user;
  if (!userCheck?.isApproved) {
    user = await UserModel.findByIdAndDelete(userId);
  } else {
    user = await UserModel.findByIdAndUpdate(userId, {
      deletedAt: new Date(),
    }).select('-password');
  }
  if (!user) {
    throw new Error('User not found');
  }

  return {
    message: 'User deleted successfully',
    user,
  } as unknown as AuthResponse;
};

// You can add more auth-related services as needed
