import formidable from "formidable";
import fs from "fs/promises";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const config = {
  api: { bodyParser: false },
};

function asString(v) {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método no permitido" });
  }

  // Validación env AWS (evita 500 “misterioso”)
  const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET } = process.env;
  if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_S3_BUCKET) {
    return res.status(500).json({
      ok: false,
      error: "Faltan variables de entorno AWS (REGION/KEY/SECRET/BUCKET)",
    });
  }

  const s3 = new S3Client({
    region: AWS_REGION,
    credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY },
  });

  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error("formidable parse error:", err);
        return res.status(500).json({ ok: false, error: "Error al procesar el formulario" });
      }

      // OJO: tu input name debe coincidir con "file"
      let file = files.file;
      if (Array.isArray(file)) file = file[0];

      const surname = asString(fields.surname);
      const tempPath = file?.filepath || file?.path;

      if (!surname || !file || !tempPath) {
        return res.status(400).json({
          ok: false,
          error: "Falta surname, file o filepath. Revisar nombre del campo en el formData.",
        });
      }

      const original = file.originalFilename || file.name || "";
      const ext = (original.split(".").pop() || "pdf").toLowerCase();
      const safeSurname = String(surname).trim().replace(/\s+/g, "_");
      const fileName = `${safeSurname}_${Date.now()}.${ext}`;

      const fileContent = await fs.readFile(tempPath);

      await s3.send(
        new PutObjectCommand({
          Bucket: AWS_S3_BUCKET,
          Key: `pasaportes/${fileName}`,
          Body: fileContent,
          ContentType: file.mimetype || file.type || "application/octet-stream",
        })
      );

      // Limpieza del tmp (opcional pero sano)
      try { await fs.unlink(tempPath); } catch {}

      const url = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/pasaportes/${fileName}`;
      return res.status(200).json({ ok: true, url });
    } catch (e) {
      console.error("upload-passport error:", e);
      return res.status(500).json({ ok: false, error: "Error al subir archivo a S3" });
    }
  });
}