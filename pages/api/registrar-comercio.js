import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs'; // Importar existsSync correctamente
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    const filePath = path.join(process.cwd(), 'data', 'commerces.json');
    
    try {
      let commerces = [];
      // Leer el archivo actual de comercios si existe
      if (existsSync(filePath)) { // Utilizar existsSync correctamente
        const fileData = await readFile(filePath, 'utf8');
        commerces = JSON.parse(fileData);
      }
      
      // Agregar el nuevo comercio
      commerces.push(data);

      // Guardar la nueva lista de comercios
      await writeFile(filePath, JSON.stringify(commerces));
      res.status(201).json({ message: 'Comercio registrado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar el comercio' });
    }
  } else {
    res.status(405).end(); // Método no permitido
  }
}
