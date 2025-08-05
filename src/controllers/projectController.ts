import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService';
import { AppError } from '../middleware/errorHandler';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await this.projectService.findByTenant(req.user!.tenantId);
      res.json(projects);
    } catch (error) {
      next(error);
    }
  };

  createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body;
      const project = await this.projectService.create({
        name,
        description,
        tenantId: req.user!.tenantId,
        createdBy: req.user!.id
      });
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  };

  getProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.projectService.findOne(
        req.params.id,
        req.user!.tenantId
      );
      
      if (!project) {
        throw new AppError(404, 'Project not found');
      }

      res.json(project);
    } catch (error) {
      next(error);
    }
  };

  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body;
      const project = await this.projectService.update(
        req.params.id,
        req.user!.tenantId,
        { name, description }
      );
      res.json(project);
    } catch (error) {
      next(error);
    }
  };

  deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.projectService.delete(req.params.id, req.user!.tenantId);
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
