// 'use server';
import fs from 'fs';
import path from 'path';
import { renderToStream, Font } from '@react-pdf/renderer';
import { addRequestToUser } from '../../../helpers/firebaseControl';
import { LawyersRequest } from '../../../components/DownloadPDF';

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
  console.log('Запит отримано:', req.method, req.body);

  if (req.method === 'POST') {
    console.log({ message: 'API працює!' });

    try {
      const data = req.body;
      console.log('Дані для створення PDF:', data);

      // Зчитуємо зображення як Base64
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
      const pdfStream = await renderToStream(<LawyersRequest data={data} />);
      console.log('pdfStream', pdfStream);

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

      const chunks = [];
      pdfStream.on('data', chunk => chunks.push(chunk));
      pdfStream.on('end', async () => {
        const pdfBuffer = Buffer.concat(chunks);

        // Конвертуємо PDF в Base64 для збереження
        const pdfBase64 = pdfBuffer.toString('base64');

        // Додаємо документ у Firestore
        const userId = data.userId || 'defaultUser';
        const userRef = doc(db, 'user', userId);

        const newRequest = {
          id: '',
          dateCreating: data.dateCreating || new Date().toISOString(),
          title: data.title || 'Запит',
          pdfDoc: pdfBase64,
          numberOrder: data.numberOrder || '',
        };

        await updateDoc(userRef, {
          requests: arrayUnion(newRequest),
        });

        res.status(200).json({
          message: 'PDF збережено успішно!',
          request: newRequest,
        });
      });

      pdfStream.on('error', err => {
        console.error('Помилка створення PDF або запису у базу:', err);
        res
          .status(500)
          .json({ error: 'Не вдалося створити PDF або зберегти у базу' });
      });
    } catch (error) {
      console.error('Помилка створення PDF або запису у базу:', error);
    }
  } else {
    res.status(405).json({ error: 'Метод не підтримується' });
  }
}
