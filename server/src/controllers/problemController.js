const { pool } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

const getProblems = async (req, res, next) => {
  try {
    const { difficulty, topic } = req.query;
    let query = 'SELECT * FROM problems';
    const params = [];
    let paramCount = 1;

    if (difficulty || topic) {
      query += ' WHERE';
      if (difficulty) {
        query += ` difficulty = $${paramCount}`;
        params.push(difficulty);
        paramCount++;
      }
      if (topic) {
        if (difficulty) query += ' AND';
        query += ` topic = $${paramCount}`;
        params.push(topic);
      }
    }

    const result = await pool.query(query, params);

    res.json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

const getProblemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM problems WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      throw new AppError('Problem not found', 404);
    }

    res.json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const submitSolution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { solution } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Here you would typically:
    // 1. Validate the solution
    // 2. Run the solution against test cases
    // 3. Store the submission
    // 4. Update user progress

    // For now, we'll just store the submission
    const result = await pool.query(
      `INSERT INTO submissions (user_id, problem_id, solution, status)
       VALUES ($1, $2, $3, 'submitted')
       RETURNING *`,
      [userId, id, solution]
    );

    res.json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProblems,
  getProblemById,
  submitSolution
}; 