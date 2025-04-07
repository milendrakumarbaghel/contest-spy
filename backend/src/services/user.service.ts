import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

export const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const updateUserProfile = async (
  userId: string,
  data: { username?: string; email?: string }
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const listUsers = async (page = 1, limit = 20, search = '') => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.user.count({
      where: {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      },
    }),
  ]);

  return {
    users,
    total,
    page,
    limit,
  };
};

export const uploadAvatar = async (userId: string, file: Express.Multer.File) => {
  const filename = `${uuidv4()}${path.extname(file.originalname)}`;
  const filepath = path.join(__dirname, '..', '..', 'public', 'avatars', filename);

  await fs.writeFile(filepath, file.buffer);

  const avatarUrl = `/avatars/${filename}`;
  await prisma.user.update({
    where: { id: userId },
    data: { avatar: avatarUrl },
  });

  return avatarUrl;
};

export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.password) throw new Error('User not found');

  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) throw new Error('Old password is incorrect');

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

  return true;
};

export const resetPassword = async (email: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { email }, data: { password: hashed } });

  return true;
};

export const banUser = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { isBanned: true },
  });
};

export const unbanUser = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { isBanned: false },
  });
};
