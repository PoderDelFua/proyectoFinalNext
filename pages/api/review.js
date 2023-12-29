// pages/api/commerces/review.js
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'commerces.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { commerceId, review, rating } = req.body;

    try {
      const data = await fs.readFile(filePath, 'utf8');
      let commerces = JSON.parse(data);

      const commerceIndex = commerces.findIndex(commerce => commerce.id === commerceId);
      if (commerceIndex === -1) {
        res.status(404).json({ message: 'Comercio no encontrado' });
        return;
      }

      const commerce = commerces[commerceIndex];
      commerce.reviews = commerce.reviews || [];
      commerce.reviews.push({ review, rating, date: new Date().toISOString() });

      await fs.writeFile(filePath, JSON.stringify(commerces, null, 2));
      res.status(200).json({ message: 'Reseña añadida con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al añadir la reseña', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
