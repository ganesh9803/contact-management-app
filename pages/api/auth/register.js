import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';
import { validateUser } from '@/app/middleware/validation';

const registerUser = async (req, res) => {
  console.log("Request body:", req.body);
  
  await validateUser(req, res, async () => {
    if (req.method === 'POST') {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        // Create the user in the database
        const user = await prisma.user.create({
          data: { name, email, password: hashedPassword },
        });

        if (!user || !user.id) {
          console.error("User creation failed or user ID is missing.");
          return res.status(500).json({ error: 'User creation failed' });
        }

        // Ensure JWT_SECRET is available
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          console.error("JWT_SECRET is not defined in environment variables.");
          return res.status(500).json({ error: 'Internal server error: JWT_SECRET missing' });
        }

        // Generate JWT token
        const payload = { userId: user.id };

        if (!payload || typeof payload !== 'object') {
          console.error("Invalid payload:", payload);
          return res.status(500).json({ error: 'Invalid JWT payload' });
        }

        let token;
        try {
          token = jwt.sign(payload, secret, { expiresIn: '24h' });
        } catch (tokenError) {
          console.error("Error generating JWT:", tokenError);
          return res.status(500).json({ error: 'Token generation failed' });
        }

        // Send the token in the response
        return res.status(201).json({ token });
      } catch (error) {
        // Handle unique constraint violations
        if (error.code === 'P2002') {
          return res.status(400).json({ message: 'Email already exists' });
        }
        console.error("Error during registration:", error);
        return res.status(500).json({ error: 'User registration failed' });
      }
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  });
};

export default registerUser;
