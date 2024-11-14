import { authMiddleware } from "@/app/middleware/auth";
import prisma from "@/lib/db";

const trashBinHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET': {
      // Fetch contacts in trash
      const trashContacts = await prisma.contact.findMany({
        where: { userId: req.user.id, isDeleted: true },
      });
      res.status(200).json(trashContacts);
      break;
    }

    case 'DELETE': {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Contact ID is required' });
      
      try {
        await prisma.contact.delete({
          where: { id },
        });
        res.status(200).json({ message: 'Contact permanently deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to permanently delete contact' });
      }
      break;
    }

    case 'PUT': {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Contact ID is required' });

      try {
        await prisma.contact.update({
          where: { id },
          data: { isDeleted: false },
        });
        res.status(200).json({ message: 'Contact restored successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to restore contact' });
      }
      break;
    }

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(trashBinHandler);
