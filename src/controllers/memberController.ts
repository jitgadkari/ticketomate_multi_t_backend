import { Request, Response, NextFunction } from 'express';
import { MemberService } from '../services/memberService';
import { AppError } from '../middleware/errorHandler';

export class MemberController {
  private memberService: MemberService;

  constructor() {
    this.memberService = new MemberService();
  }

  getMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const members = await this.memberService.getMembers(req.user!.tenantId);
      res.json(members);
    } catch (error) {
      next(error);
    }
  };

  createMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user!.role !== 'ADMIN') {
        throw new AppError(403, 'Only admins can create members');
      }

      const { name, email, role } = req.body;
      const member = await this.memberService.createMember({
        name,
        email,
        role,
        tenantId: req.user!.tenantId
      });

      res.status(201).json(member);
    } catch (error) {
      next(error);
    }
  };

  updateMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user!.role !== 'ADMIN') {
        throw new AppError(403, 'Only admins can update members');
      }

      const { name, role } = req.body;
      const member = await this.memberService.updateMember(
        req.params.id,
        req.user!.tenantId,
        { name, role }
      );

      res.json(member);
    } catch (error) {
      next(error);
    }
  };

  deleteMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user!.role !== 'ADMIN') {
        throw new AppError(403, 'Only admins can delete members');
      }

      await this.memberService.deleteMember(req.params.id, req.user!.tenantId);
      res.json({ message: 'Member deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
