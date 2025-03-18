import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      'SELECT id, email, username, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    res.json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { username, email } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      );

      if (emailCheck.rows.length > 0) {
        throw new AppError('Email already in use', 400);
      }
    }

    const result = await pool.query(
      `UPDATE users 
       SET username = COALESCE($1, username),
           email = COALESCE($2, email),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, username, email, created_at, updated_at`,
      [username, email, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    res.json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    // Get user's solved problems count
    const solvedCount = await pool.query(
      `SELECT COUNT(*) as count 
       FROM submissions 
       WHERE user_id = $1 AND status = 'accepted'`,
      [userId]
    );

    // Get user's progress by difficulty
    const progressByDifficulty = await pool.query(
      `SELECT p.difficulty, COUNT(*) as solved
       FROM submissions s
       JOIN problems p ON s.problem_id = p.id
       WHERE s.user_id = $1 AND s.status = 'accepted'
       GROUP BY p.difficulty`,
      [userId]
    );

    // Get user's progress by topic
    const progressByTopic = await pool.query(
      `SELECT p.topic, COUNT(*) as solved
       FROM submissions s
       JOIN problems p ON s.problem_id = p.id
       WHERE s.user_id = $1 AND s.status = 'accepted'
       GROUP BY p.topic`,
      [userId]
    );

    res.json({
      status: 'success',
      data: {
        totalSolved: parseInt(solvedCount.rows[0].count),
        progressByDifficulty: progressByDifficulty.rows,
        progressByTopic: progressByTopic.rows,
      },
    });
  } catch (error) {
    next(error);
  }
}; 