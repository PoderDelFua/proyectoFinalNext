import { promises as fs, existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'commerces.json');

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const { city, activity } = req.query;
        const data = await fs.readFile(filePath, 'utf8');
        let commerces = JSON.parse(data);

        // Filtra por ciudad si el parámetro está presente
        if (city) {
          commerces = commerces.filter(commerce => commerce.ciudad.toLowerCase() === city.toLowerCase());
        }

        // Filtra por actividad si el parámetro está presente
        if (activity) {
          commerces = commerces.filter(commerce => commerce.actividad && commerce.actividad.toLowerCase() === activity.toLowerCase());
        }

        res.status(200).json(commerces);
      } catch (error) {
        console.error('Error al obtener los comercios:', error);
        res.status(500).json({ message: 'Error al obtener los comercios' });
      }
      break;
      
      case 'POST':
        try {
          let commerces = [];
          const newCommerce = { ...req.body, id: uuidv4(), password: req.body.password };

          // Revisa si el archivo existe y tiene contenido antes de leerlo
          if (existsSync(filePath)) {
            const data = await fs.readFile(filePath, 'utf8');
            if (data) {
              commerces = JSON.parse(data);  // Solo analiza si hay datos
            }
          }
          
          commerces.push(newCommerce);
          await fs.writeFile(filePath, JSON.stringify(commerces, null, 2));
          res.status(201).json({ message: 'Comercio registrado con éxito', commerce: newCommerce });
        } catch (error) {
          console.error('Error en POST:', error);
          res.status(500).json({ message: 'Error al registrar el comercio', error: error.message });
        }
        break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
