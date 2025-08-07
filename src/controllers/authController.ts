import { Request, Response, NextFunction } from 'express';
import { AuthService, SignupInput, LoginInput } from '../services/authService';
import { AppError } from '../middleware/errorHandler';

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
      
      const cookieOptions: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        path: '/'
      };
  
      // Only set domain for production
      if (process.env.NODE_ENV === 'production') {
        cookieOptions.domain = '.yourdomain.com';
      }
      
      res.cookie('token', result.token, cookieOptions);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getCurrentUser = async (req: Request, res: Response) => {
    try {
      // Get the user ID from the request (set by auth middleware)
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }
      const result = await this.authService.getCurrentUser(userId);
      res.json(result);
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  public logout = async (req: Request, res: Response): Promise<Response> => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });

      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ message: 'Internal server error during logout' });
    }
  };
}
