// 'use server';
import fs from 'fs';
import path from 'path';
import { renderToStream, Font } from '@react-pdf/renderer';
import { db } from '../../firebase';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { generatePDFBuffer } from '../../helpers/pdf';
import { saveRequestToFirestore } from '../../helpers/firebaseControl';

Font.registerHyphenationCallback(word => [word]);
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf'),
      fontWeight: 'normal',
    },
    {
      src: path.join(process.cwd(), 'public', 'fonts', 'Roboto-Bold.ttf'),
      fontWeight: 'bold',
    },
    {
      src: path.join(process.cwd(), 'public', 'fonts', 'Roboto-Italic.ttf'),
      fontStyle: 'italic',
    },
    {
      src: path.join(process.cwd(), 'public', 'fonts', 'Roboto-BoldItalic.ttf'),
      fontStyle: 'italic',
      fontWeight: 'bold',
    },
  ],
});

export default async function handler(req, res) {
  console.log('Request received:', req.method, req.body);

  if (req.method === 'POST') {
    console.log({ message: 'The API is working!' });

    try {
      const data = req.body;
      console.log('Data for creating PDF:', data);
      const userUID = data?.uid;
      if (!userUID) {
        console.error('Cannot save the file, please log in');
        throw new Error('UID is required to save the request');
      }

      // Зчитуємо зображення логотипу як Base64
      const imagePath = path.resolve(
        process.cwd(),
        'public',
        'images',
        'gerb.png'
      );
      const imageBuffer = fs.readFileSync(imagePath);
      const emblemBase64 = `data:image/png;base64,${imageBuffer.toString(
        'base64'
      )}`;

      // Додаємо Base64-рядок у дані
      data.emblemBase64 = emblemBase64;

      // // Генеруємо PDF
      // const pdfStream = await renderToStream(<LawyersRequest data={data} />);
      // console.log('pdfStream', pdfStream);

      // // Перевіряємо та створюємо папку для документів PDF, якщо вона не існує
      // const documentsPath = path.resolve(process.cwd(), 'public', 'documents');
      // console.log('documentsPath', documentsPath);

      // if (!fs.existsSync(documentsPath)) {
      //   fs.mkdirSync(documentsPath, { recursive: true });
      // }

      // // Зберігаємо файл PDF на сервері
      // const fileName = `document-${Date.now()}.pdf`;
      // const filePath = path.join(documentsPath, fileName);

      // // Пишемо потік у файл
      // const writeStream = fs.createWriteStream(filePath);
      // pdfStream.pipe(writeStream);

      // // Чекаємо завершення
      // pdfStream.on('end', () => {
      //   const fileUrl = `/documents/${fileName}`;
      //   console.log('PDF створено за адресою:', fileUrl);
      //   return res.status(200).json({ fileUrl });
      // });

      // Генеруємо PDF
      const pdfBuffer = await generatePDFBuffer(data);

      // // Конвертуємо PDF у Base64
      // const pdfBase64 = pdfBuffer.toString('base64');

      // Зберігаємо запит у Firestore

      const fileName = `documents/document-${Date.now()}.pdf`;
      const fileRef = ref(storage, fileName);
      await uploadBytes(fileRef, pdfBuffer);

      const pdfDocUrl = await getDownloadURL(fileRef);
      console.log('PDF saved at:', pdfDocUrl);

      const newRequest = await saveRequestToFirestore(
        db,
        userUID,
        data,
        pdfDocUrl
      );

      res.status(200).json({
        message: 'PDF saved successfully!',
        request: newRequest,
        // fileUrl: `data:application/pdf;base64,${pdfBase64}`,
        pdfDocUrl,
      });

      // pdfStream.on('error', err => {
      //   console.error('Error creating PDF or recording in DB:', err);
      //   res.status(500).json({ error: 'Failed to create PDF or save to DB' });
      // });
    } catch (error) {
      console.error('Error creating PDF or recording in DB:', error);
      res.status(500).json({ error: 'Failed to create PDF or save to DB' });
    }
  } else {
    res.status(405).json({ error: 'Method not supported' });
  }
}
