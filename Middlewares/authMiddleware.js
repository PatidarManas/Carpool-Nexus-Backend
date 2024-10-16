import bcrypt from 'bcryptjs';

// Middleware to validate signup inputs


// Middleware to validate login inputs
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Both email and password are required' });
  }

  next();
};

// Middleware to hash password before saving user
export const hashPassword = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error hashing password', error });
  }
};
