// pages/api/comercios.js
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'commerces.json');

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const data = await readFile(filePath, 'utf8');
        const commerces = JSON.parse(data);
        res.status(200).json(commerces);
      } catch (error) {
        res.status(500).json({ message: 'Error al obtener los comercios' });
      }
      break;
    case 'POST':
      // Aquí iría el código para agregar un nuevo comercio.
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
