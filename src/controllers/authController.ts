import { Request, Response, NextFunction } from 'express';
import { AuthService, SignupInput, LoginInput } from '../services/authService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input: SignupInput = {
        tenantName: req.body.tenantName,
        tenantSlug: req.body.tenantSlug,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };

      const result = await this.authService.signup(input);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input: LoginInput = {
        email: req.body.email,
        password: req.body.password
      };

      const result = await this.authService.login(input);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getCurrentUser = (req: Request, res: Response) => {
    res.json(req.user);
  };
}
