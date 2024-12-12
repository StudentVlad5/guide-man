// 'use server';
import fs from 'fs';
import path from 'path';
import { renderToStream, Font } from '@react-pdf/renderer';
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
  console.log('Запит отримано:', req.method, req.body);

  if (req.method === 'POST') {
    console.log({ message: 'API працює!' });

    try {
      const data = req.body;
      console.log('Дані для створення PDF:', data);

      // Перевіряємо та створюємо папку, якщо вона не існує
      const documentsPath = path.resolve(process.cwd(), 'public', 'documents');
      console.log('documentsPath', documentsPath);

      if (!fs.existsSync(documentsPath)) {
        fs.mkdirSync(documentsPath, { recursive: true });
      }

      // Генеруємо PDF
      const pdfStream = await renderToStream(<LawyersRequest data={data} />);
      console.log('pdfStream', pdfStream);

      // Зберігаємо файл на сервері
      const fileName = `document-${Date.now()}.pdf`;
      const filePath = path.join(documentsPath, fileName);

      // Пишемо потік у файл
      const writeStream = fs.createWriteStream(filePath);
      pdfStream.pipe(writeStream);

      // Чекаємо завершення
      pdfStream.on('end', () => {
        const fileUrl = `/documents/${fileName}`;
        console.log('PDF створено за адресою:', fileUrl);
        return res.status(200).json({ fileUrl });
      });

      pdfStream.on('error', err => {
        console.error('Помилка запису PDF:', err);
        res.status(500).json({ error: 'Помилка запису PDF' });
      });

      // await renderToFile(<LawyersRequest data={data} />, filePath);

      // const fileUrl = `/documents/${fileName}`;
      // console.log('PDF створено за адресою:', fileUrl);
      // return res.status(200).json({ fileUrl });
    } catch (error) {
      console.error('Помилка створення PDF:', error);
      // res.status(500).json({ error: 'Не вдалося створити PDF' });
    }
  } else {
    res.status(405).json({ error: 'Метод не підтримується' });
  }
}
