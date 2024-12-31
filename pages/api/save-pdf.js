// 'use server';
import fs from 'fs';
import path from 'path';
import { renderToStream, Font } from '@react-pdf/renderer';
import { db } from '../../firebase';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { generatePDFBuffer } from '../../helpers/pdf';
import {
  saveRequestToFirestore,
  uploadPDFToStorage,
} from '../../helpers/firebaseControl';
import { LawyersRequest } from '../../components/DownloadPDF';

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

      // Генеруємо PDF
      const pdfBuffer = await generatePDFBuffer(data);
      console.log('handler ~ data:', data);

      // Зберігаємо запит у Firestore
      const fileName = `documents/document-${Date.now()}.pdf`;
      const fileRef = ref(storage, fileName);
      await uploadBytes(fileRef, pdfBuffer);

      const pdfDocUrl = await getDownloadURL(fileRef);
      console.log('PDF saved at:', pdfDocUrl);
      const pdfStream = await uploadPDFToStorage(pdfBuffer, fileName, storage);
      // console.log('handler ~ pdfStream:', pdfStream);

      const newRequest = await saveRequestToFirestore(
        db,
        userUID,
        data,
        pdfDocUrl,
        pdfStream
      );

      res.status(200).json({
        message: 'PDF saved successfully!',
        request: newRequest,
        pdfDocUrl,
        // pdfBase64: pdfBuffer.toString('base64'),
      });
    } catch (error) {
      console.error('Error creating PDF or recording in DB:', error);
      res.status(500).json({ error: 'Failed to create PDF or save to DB' });
    }
  } else {
    res.status(405).json({ error: 'Method not supported' });
  }
}
