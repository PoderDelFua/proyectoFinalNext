// pages/api/actualizarComercio.js
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'commerces.json');

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const comercioId = req.body.id;
      const comercioData = req.body;

      const data = await readFile(filePath, 'utf8');
      let commerces = JSON.parse(data);

      const commerceIndex = commerces.findIndex((c) => c.id === comercioId);
      if (commerceIndex === -1) {
        res.status(404).json({ message: 'Comercio no encontrado' });
        return;
      }

      commerces[commerceIndex] = { ...commerces[commerceIndex], ...comercioData };

      await writeFile(filePath, JSON.stringify(commerces, null, 2));
      res.status(200).json({ message: 'Comercio actualizado con éxito', commerce: commerces[commerceIndex] });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el comercio', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
