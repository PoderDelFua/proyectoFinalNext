// pages/api/filterCommerces.js
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'commerces.json');

export default async function handler(req, res) {
  const { city, activity, id } = req.query;
  try {
    const data = await fs.readFile(filePath, 'utf8');
    let commerces = JSON.parse(data);

    if (id) {
      commerces = commerces.filter(comercio => comercio.id === id);
    } else {
      if (city) {
        commerces = commerces.filter(comercio => comercio.ciudad.toLowerCase() === city.toLowerCase());
      }
      if (activity) {
        commerces = commerces.filter(comercio => comercio.actividad.toLowerCase() === activity.toLowerCase());
      }
    }

    res.status(200).json(commerces);
  } catch (error) {
    console.error('Error al obtener los comercios:', error);
    res.status(500).json({ message: 'Error al obtener los comercios' });
  }
}
