import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class AuthService {
  async register({ username, email, password }: any) {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existingUser) {
      return { status: 400, message: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    const token = this.generateToken(user.id);
    return { status: 201, token, user: { id: user.id, username: user.username, email: user.email } };
  }

  async login({ email, password }: any) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { status: 401, message: 'Invalid credentials' };
    }

    const token = this.generateToken(user.id);
    return { status: 200, token, user: { id: user.id, username: user.username, email: user.email } };
  }

  private generateToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  }
}
