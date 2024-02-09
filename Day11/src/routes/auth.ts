import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/User";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";


const router = express.Router();

// Signup endpoint
router.post(
  "/signup",
  body("name").notEmpty().trim(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }). isStrongPassword(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }

      
      const verificationToken = uuidv4();

      const newUser = new User({ name, email, password, verificationToken });
      await newUser.save();

      
      sendVerificationEmail(newUser.email, verificationToken);

      res.status(201).json({ message: "User created successfully. Check your email for verification." });
    } catch (error) {
      console.error("Error during signup:", error)
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Verify endpoint
router.get("/verify/:token", async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

   
    user.isVerified = true;
    user.verificationToken = null; 
    await user.save();

    res.json({ message: "Verification successful. You can now log in." });
  } catch (error) {
    console.error("Error during verification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASSWORD)

// Function to send verification email
const sendVerificationEmail = (to: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Account Verification",
    html: `<p>Click <a href="http://localhost:3000/auth/verify/${token}">here</a> to verify your account.</p>`,
  });
};

// Login endpoint
router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordMatch =  bcrypt.compareSync(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      

      res.json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
