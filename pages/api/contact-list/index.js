//pages/api/contact-list/index.js
import { authMiddleware } from "@/app/middleware/auth";
import prisma from "@/lib/db"; // Adjust the path to match your project structure


const handler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'POST': {
      const contacts = req.body; // Expect an array of contacts

      if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
        return res.status(400).json({ error: 'Invalid input: must be a non-empty array of contacts' });
      }

      // Other checks can be added here
      try {
        const emailExists = await prisma.contact.findFirst({
          where: { email: contacts[0].email, userId: req.user.id }
        });

        if (emailExists) {
          return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
        }

        const newContacts = await prisma.contact.createMany({
          data: contacts.map(contact => ({
            ...contact,
            userId: req.user.id
          })),
        });
        res.status(201).json({ message: 'Contacts created successfully', newContacts });
      } catch (error) {
        console.error('Error creating contacts:', error);
        res.status(500).json({ error: 'Failed to create contacts' });
      }
      break;
    }
    
    case 'PUT': {
      const contacts = req.body;

      if (!Array.isArray(contacts) || contacts.length === 0) {
        return res.status(400).json({ error: 'Invalid input: must be a non-empty array of contacts' });
      }

      try {
        const updatedContacts = await Promise.all(
          contacts.map(contact => {
            if (!contact.id) {
              throw new Error(`Contact ID is required for contact: ${JSON.stringify(contact)}`);
            }

            return prisma.contact.update({
              where: { id: contact.id },
              data: {
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                address: contact.address,
                timezone: contact.timezone,
              },
            });
          })
        );
        res.status(200).json({ message: 'Contacts updated successfully', updatedContacts });
      } catch (error) {
        console.error('Error updating contacts:', error);
        res.status(500).json({ error: 'Failed to update contacts' });
      }
      break;
    }

    case 'GET': {
      const contacts = await prisma.contact.findMany({
        where: { userId: req.user.id, isDeleted: false },
      });
      res.status(200).json(contacts);
      break;
    }

    case 'DELETE': {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Contact ID is required' });
      }
      try {
        await prisma.contact.update({
          where: { id },
          data: { isDeleted: true },
        });
        res.status(200).json({ message: 'Contact moved to trash' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete contact' });
      }
      break;
    }

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler);
