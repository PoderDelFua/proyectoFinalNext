// pages/api/comercios/[id].js
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'commerces.json');

export default async function handler(req, res) {
  const { query: { id } } = req;

  switch (req.method) {
    case 'PUT':
      try {
        const data = await readFile(filePath, 'utf8');
        let commerces = JSON.parse(data);

        const commerceIndex = commerces.findIndex((c) => c.id === id);
        if (commerceIndex === -1) {
          res.status(404).json({ message: 'Comercio no encontrado' });
          return;
        }

        const updatedCommerce = { ...commerces[commerceIndex], ...req.body };
        commerces[commerceIndex] = updatedCommerce;

        await writeFile(filePath, JSON.stringify(commerces, null, 2));
        res.status(200).json({ message: 'Comercio actualizado con éxito', commerce: updatedCommerce });
      } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el comercio', error: error.message });
      }
      break;
    case 'DELETE':
      try {
        const data = await readFile(filePath, 'utf8');
        let commerces = JSON.parse(data);

        const newCommerces = commerces.filter(comercio => comercio.id !== id);

        await writeFile(filePath, JSON.stringify(newCommerces, null, 2));
        res.status(200).json({ message: 'Comercio eliminado con éxito' });
      } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el comercio', error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
