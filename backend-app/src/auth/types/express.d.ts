import { RequestUser } from '../auth/types/request-user.type';

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export {};
