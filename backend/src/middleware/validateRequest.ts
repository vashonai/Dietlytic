import { NextFunction, Request, Response } from 'express';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  // Check if request has a body
  if (!req.body) {
    res.status(400).json({
      success: false,
      error: 'Request body is required'
    });
    return;
  }

  // Check content type
  if (req.get('Content-Type') !== 'application/json') {
    res.status(400).json({
      success: false,
      error: 'Content-Type must be application/json'
    });
    return;
  }

  next();
};
