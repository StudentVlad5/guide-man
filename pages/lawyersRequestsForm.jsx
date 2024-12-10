"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import axios from "axios";
import handler from "../api/save-pdf";

// Динамічне підключення PDF-компонента
const LawyersRequestPDF = dynamic(() => import("../components/DownloadPDF"), {
  ssr: false,
});

export default function DownloadPage() {
  const [formData, setFormData] = useState({
    name: "ПІБ",
    email: "example@example.com",
    dateCreating: "дд.мм.рррр",
    date: { start: "дд.мм.рррр", finish: "дд.мм.рррр" },
    requests: 1,
    order: "№12345",
    license: "45678",
    docs: "12",
    recipient: {
      name: "Держ орган",
      address: "повна адреса органу",
    },
  });
  const [downloadLink, setDownloadLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRecipientChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      recipient: { ...prev.recipient, [name]: value },
    }));
  };

  const generateAndSavePDF = async () => {
    setIsLoading(true);
    setError(null);
    handler({ method: "POST", body: formData });
    //     try {
    //       const response = await axios.post('/api/save-pdf', formData);
    // console.log(response.data);
    //       if (response.data.fileUrl) {
    //         setDownloadLink(response.data.fileUrl);
    //       } else {
    //         throw new Error('Відсутній URL файлу.');
    //       }
    //     } catch (error) {
    //       console.error('Помилка збереження PDF:', error);
    //       alert('Не вдалося зберегти PDF. Перевірте дані.');
    //       setError('Не вдалося зберегти PDF. Перевірте дані.');
    //     } finally {
    //       setIsLoading(false);
    //     }
  };

  return (
    <div>
      <h1>Сформувати адвокатський запит</h1>
      <div>
        <label>ПІБ:</label>
        <input name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label>Дата створення:</label>
        <input
          name="dateCreating"
          value={formData.dateCreating}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Отримувач:</label>
        <input
          name="name"
          value={formData.recipient?.name}
          onChange={handleRecipientChange}
          placeholder="Назва"
        />
        <input
          name="address"
          value={formData.recipient?.address}
          onChange={handleRecipientChange}
          placeholder="Адреса"
        />
      </div>
      <div>
        <label>Ел. пошта:</label>
        <input name="email" value={formData.email} onChange={handleChange} />
      </div>
      <button onClick={generateAndSavePDF} disabled={isLoading}>
        {isLoading ? "Зберігається..." : "Зберегти PDF"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {downloadLink && (
        <div>
          <p>Ваш файл готовий:</p>
          <a href={downloadLink} target="_blank" rel="noopener noreferrer">
            Завантажити PDF
          </a>
        </div>
      )}
    </div>
  );

  // useEffect(() => {
  //     async function getData() {
  //         setIsLoading(true);
  //         try {
  //             const { data } = await fetchData(`/`);
  //             if (!data) {
  //                 return onFetchError('Whoops, something went wrong');
  //             }
  //             setFormData(data);
  //         } catch (error) {
  //             setError(error);
  //         } finally {
  //             setIsLoading(false);
  //         }
  //     }
  //     getData();
  // }, []);

  // return (
  //     <div style={{ padding: '20px', textAlign: 'center' }}>
  //         <h1>Generate PDF with Data</h1>
  //         {data.length === 0 || isLoading ? (
  //             <p>Loading data...</p>
  //         ) : (
  //             <PDFDownloadLink
  //                 document={<LawyersRequest data={formData} />}
  //                 fileName="request.pdf"
  //             >
  //                 {({ loading }) =>
  //                     loading ? 'Preparing document...' : 'Download PDF'
  //                 }
  //             </PDFDownloadLink>
  //         )}
  //     </div>
  // );
}
