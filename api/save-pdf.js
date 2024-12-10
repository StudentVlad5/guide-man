import fs from 'fs';
import path from 'path';
import { renderToStream } from '@react-pdf/renderer';
import { LawyersRequest } from '../components/DownloadPDF';

export default async function handler(req, res) {
  console.log('Запит отримано:', req.method, req.body);

  if (req.method === 'POST') {
    console.log({ message: 'API працює!' });

    try {
      const data = req.body;
      console.log('Дані для створення PDF:', data);

      // Перевіряємо та створюємо папку, якщо вона не існує
      const documentsPath = path.resolve('public', 'documents');

      if (!fs.existsSync(documentsPath)) {
        fs.mkdirSync(documentsPath, { recursive: true });
      }

      // Генеруємо PDF
      const pdfStream = await renderToStream(<LawyersRequest data={data} />);

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
    } catch (error) {
      console.error('Помилка створення PDF:', error);
      // res.status(500).json({ error: 'Не вдалося створити PDF' });
    }
  } else {
    res.status(405).json({ error: 'Метод не підтримується' });
  }
}
