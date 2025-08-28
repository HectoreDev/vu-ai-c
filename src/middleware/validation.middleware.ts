import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateBody = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues.map((err: any) => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

export const validateParams = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedParams = schema.parse(req.params);
      req.params = validatedParams as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid parameters',
          errors: error.issues.map((err: any) => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

export const validateQuery = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = schema.parse(req.query);
      req.query = validatedQuery as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: error.issues.map((err: any) => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};
