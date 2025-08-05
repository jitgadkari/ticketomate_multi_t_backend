import { PrismaClient, User, Role } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export interface CreateMemberInput {
  name: string;
  email: string;
  role?: Role;
  tenantId: string;
}

export class MemberService {
  async createMember(input: CreateMemberInput): Promise<Omit<User, 'passwordHash'>> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (existingUser) {
      throw new AppError(400, 'Email already exists');
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role || 'MEMBER',
        tenantId: input.tenantId
      }
    });

    // In a real application, send an email with the temporary password
    // For now, we'll return it with the response
    return {
      ...user,
      tempPassword
    };
  }

  async getMembers(tenantId: string) {
    return prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateMember(userId: string, tenantId: string, data: { name?: string; role?: Role }) {
    const user = await prisma.user.findFirst({
      where: { 
        id: userId,
        tenantId
      }
    });

    if (!user) {
      throw new AppError(404, 'Member not found');
    }

    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async deleteMember(userId: string, tenantId: string) {
    const user = await prisma.user.findFirst({
      where: { 
        id: userId,
        tenantId
      }
    });

    if (!user) {
      throw new AppError(404, 'Member not found');
    }

    if (user.role === 'ADMIN') {
      throw new AppError(400, 'Cannot delete admin user');
    }

    await prisma.user.delete({
      where: { id: userId }
    });
  }
}
