import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User, UserDocument } from '../models/User';
import { Company, CompanyDocument } from '../models/Company';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { verify } from '../middlewares/verification';

const router = express.Router();

// Signup endpoint
  router.post(
    '/signup',
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).isStrongPassword(),
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ message: 'User with this email already exists' });
        }

        const verificationToken = uuidv4();

        const newUser = new User({ name, email, password, verificationToken });
        await newUser.save();

        const verificationLink = `http://localhost:3000/auth/verify/${newUser.verificationToken}`;

        res.status(201).json({
          message: `User created successfully. Verify your account using the following link: ${verificationLink}`,
          user: {
          id: newUser._id,
          verificationToken: newUser.verificationToken,
          }
});


      } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  );

// Verify endpoint
router.get('/verify/:token', async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: 'Verification successful. You can now log in.' });
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login endpoint
router.post(
  '/login',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordMatch = bcrypt.compareSync(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const secretKey = process.env.JWT_SECRET_KEY || 'default-secret';

      if (!secretKey) {
        console.error('JWT_SECRET_KEY is not defined in the environment variables.');
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// Extend the Request interface to include the 'user' and 'company' properties
interface AuthenticatedUserRequest extends Request {
  user?: UserDocument;
}

interface AuthenticatedCompanyRequest extends Request {
  company?: CompanyDocument;
}

// Me endpoint for users - protected by verify middleware
router.get('/users/me', verify, (req: AuthenticatedUserRequest, res: Response) => {
  // The user is authenticated, and req.user contains the decoded token payload
  const user = req.user;
  res.json({ user });
});

// Update me endpoint for users - protected by verify middleware
router.put('/users/me', verify, [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).optional(),
], async (req: AuthenticatedUserRequest, res: Response) => {
  // The user is authenticated, and req.user contains the decoded token payload
  const user = req.user as UserDocument;

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Update user profile
  user.name = req.body.name;
  user.email = req.body.email;

  if (req.body.password) {
    // If a new password is provided, update the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    user.password = hash;
  }

  try {
    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Me endpoint for companies - protected by verify middleware
router.get('/companies/me', verify, (req: AuthenticatedCompanyRequest, res: Response) => {
  // The company is authenticated, and req.company contains the decoded token payload
  const company = req.company;
  res.json({ company });
});

// Update me endpoint for companies - protected by verify middleware
router.put('/companies/me', verify, [
  body('name').notEmpty().trim(),
  body('industry').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('address').notEmpty().trim(),
], async (req: AuthenticatedCompanyRequest, res: Response) => {
  // The company is authenticated, and req.company contains the decoded token payload
  const company = req.company as CompanyDocument;

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Update company profile
  company.name = req.body.name;
  company.industry = req.body.industry;
  company.email = req.body.email;
  company.address = req.body.address;

  try {
    await company.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;