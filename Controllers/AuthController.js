import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';  // Assuming your model is in models/userModel


//islogin 
export const isLogin = async (req, res) => {
  try {
      // Extract token from Authorization header
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
          return res.status(401).json({ message: 'No token provided.' });
      }

      // Verify JWT token (replace 'your_jwt_secret' with your actual secret)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Find the user in MongoDB by the ID stored in the token
      const user = await User.findById(decoded.id);
      if (!user) {
          return res.status(401).json({ isAuthenticated: false, user: ""});
      }

      // User is authenticated
      return res.status(200).json({ isAuthenticated: true, user });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ isAuthenticated: false, message: 'Server error.' });
  }
};

// Signup function
export const signup = async (req, res) => {
  const { name, title , email, password, dob, phone, isWhatsapp } = req.body;

  console.log(email)
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      name,
      title,
      email,
      password,
      dob,
      phone, 
      isWhatsapp
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

// Login function
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    // Compare entered password with the stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1y' }
    );

    res.status(200).json({token});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong', error });
  }
};
