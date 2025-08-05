import { Project, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export interface CreateProjectInput {
  name: string;
  description?: string;
  tenantId: string;
  createdBy: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}

export class ProjectService {
  async findByTenant(tenantId: string): Promise<Project[]> {
    return prisma.project.findMany({
      where: { tenantId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(data: CreateProjectInput): Promise<Project> {
    return prisma.project.create({
      data,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async findOne(id: string, tenantId: string): Promise<Project | null> {
    return prisma.project.findFirst({
      where: {
        id,
        tenantId
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async update(id: string, tenantId: string, data: UpdateProjectInput): Promise<Project> {
    const updated = await prisma.project.updateMany({
      where: {
        id,
        tenantId
      },
      data
    });

    if (updated.count === 0) {
      throw new AppError(404, 'Project not found');
    }

    const project = await this.findOne(id, tenantId);
    if (!project) {
      throw new AppError(404, 'Project not found');
    }

    return project;
  }

  async delete(id: string, tenantId: string): Promise<void> {
    const result = await prisma.project.deleteMany({
      where: {
        id,
        tenantId
      }
    });

    if (result.count === 0) {
      throw new AppError(404, 'Project not found');
    }
  }
}
