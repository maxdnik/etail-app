import formidable from 'formidable';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    console.log('---- DEBUG FIELDS:', fields);
    console.log('---- DEBUG FILES:', files);

    if (err) {
      console.error('Error al parsear:', err);
      return res.status(500).json({ error: 'Error al procesar el formulario' });
    }

    const surname = fields.surname;
    let file = files.file;

    if (Array.isArray(file)) file = file[0];

    // USAR .filepath o .path, SEGÚN CUAL VENGA
    const tempPath = file.filepath || file.path;

    if (!surname || !file || !tempPath) {
      return res.status(400).json({ error: 'Falta apellido, archivo o path del archivo' });
    }

    const fileNameRaw = file.originalFilename || file.name || '';
    if (!fileNameRaw) {
      return res.status(400).json({ error: 'No se detectó el nombre del archivo' });
    }

    const ext = fileNameRaw.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${surname}_${timestamp}.${ext}`.replace(/\s+/g, '_');

    let fileContent;
    try {
      fileContent = fs.readFileSync(tempPath);
    } catch (readErr) {
      console.error('No se pudo leer el archivo:', readErr);
      return res.status(500).json({ error: 'No se pudo leer el archivo temporal.' });
    }

    try {
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `pasaportes/${fileName}`,
        Body: fileContent,
        ContentType: file.mimetype || file.type || 'application/octet-stream',
        
      };

      await s3.send(new PutObjectCommand(uploadParams));
      const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/pasaportes/${fileName}`;
      return res.status(200).json({ url });
    } catch (err) {
      console.error('Error al subir a S3:', err);
      return res.status(500).json({ error: 'Error al subir archivo a S3' });
    }
  });
}
