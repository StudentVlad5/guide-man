import { renderToStream } from '@react-pdf/renderer';
import { LawyersRequest } from '../components/DownloadPDF';

export const generatePDFBuffer = async data => {
  const pdfStream = await renderToStream(<LawyersRequest data={data} />);
  const chunks = [];
  return new Promise((resolve, reject) => {
    pdfStream.on('data', chunk => chunks.push(chunk));
    pdfStream.on('end', () => resolve(Buffer.concat(chunks)));
    pdfStream.on('error', reject);
  });
};
