import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';
import { validateUser } from '@/app/middleware/validation';

const registerUser = async (req, res) => {
  await validateUser(req, res, async () => {
    if (req.method === 'POST') {
      const { name, email, password } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        // Create the user in the database
        const user = await prisma.user.create({
          data: { name, email, password: hashedPassword },
        });

        // Generate JWT token
        let token;
        try {
          token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        } catch (tokenError) {
          console.error("Error generating JWT:", tokenError);
          return res.status(500).json({ error: 'Token generation failed' });
        }

        // Send the token in the response
        res.status(201).json({ token });
      } catch (error) {
        // Handle unique constraint violations
        if (error.code === 'P2002') {
          return res.status(400).json({ message: 'Email already exists' });
        }
        console.error("Error during registration:", error);
        res.status(500).json({ error: 'User registration failed' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
};

export default registerUser;
