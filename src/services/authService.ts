// import { User, Tenant } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export interface SignupInput {
  tenantName: string;
  tenantSlug: string;
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}

export class AuthService {
  private generateToken(userId: string, tenantId: string): string {
    return jwt.sign(
      { userId, tenantId },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
  }

  async signup(input: SignupInput): Promise<AuthResponse> {
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: input.tenantSlug }
    });

    if (existingTenant) {
      throw new AppError(400, 'Tenant slug already exists');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (existingUser) {
      throw new AppError(400, 'Email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const result = await prisma.$transaction(async (tx: any) => {
      const tenant = await tx.tenant.create({
        data: {
          name: input.tenantName,
          slug: input.tenantSlug
        }
      });

      const user = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash,
          role: 'ADMIN',
          tenantId: tenant.id
        }
      });

      return { tenant, user };
    });

    const token = this.generateToken(result.user.id, result.tenant.id);

    return {
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        tenantId: result.tenant.id
      },
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        slug: result.tenant.slug
      }
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { tenant: true }
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = this.generateToken(user.id, user.tenantId);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      },
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug
      }
    };
  }
}
