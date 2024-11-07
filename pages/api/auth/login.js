// pages/api/auth/login.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';
import { validateUser } from '@/app/middleware/validation';

const loginHandler = async (req, res) => {
    await validateUser(req, res, async () => {
      if (req.method === 'POST') {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
  
        // Check if user exists
        if (!user) {
          return res.status(401).json({ message: 'Invalid username' });
        }
  
        // Check if password matches
        if (!(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: 'Invalid password' });
        }
  
        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ token });
      } else {
        res.status(405).json({ message: 'Method not allowed' });
      }
    });
  };
  
  export default loginHandler;