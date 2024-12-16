'use client';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import axios from 'axios';

// Динамічне підключення PDF-компонента
const LawyersRequest = dynamic(() => import('../components/DownloadPDF'), {
  ssr: false,
});

export default function DownloadPage() {
  const [formData, setFormData] = useState({
    name: 'ПІБ',
    email: 'example@example.com',
    dateCreating: new Date()
      // .toISOString()
      // .slice(0, 10)
      // .split('-')
      // .reverse()
      // .join('.'),
      .toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    date: { start: '', finish: '' },
    requests: 1,
    order: '',
    license: '',
    docs: '',
    recipient: {
      name: 'Держ орган',
      address: 'повна адреса органу',
    },
  });
  const [downloadLink, setDownloadLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRecipientChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      recipient: { ...prev.recipient, [name]: value },
    }));
  };

  const generateAndSavePDF = async () => {
    setIsLoading(true);
    setError(null);
    console.log(formData);

    try {
      const response = await axios.post('/api/save-pdf', formData);
      console.log(response.data);
      if (response.data.fileUrl) {
        setDownloadLink(response.data.fileUrl);
      } else {
        throw new Error('Відсутній URL файлу.');
      }
    } catch (error) {
      console.error('Помилка збереження PDF:', error);
      alert('Не вдалося зберегти PDF. Перевірте дані.');
      setError('Не вдалося зберегти PDF. Перевірте дані.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Сформувати адвокатський запит</h1>
      <div>
        <label>ПІБ:</label>
        <input name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label>Електронна пошта:</label>
        <input name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <label>Дата створення:</label>
        <input
          name="dateCreating"
          type="date"
          value={formData.dateCreating}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Період початку:</label>
        <input
          name="start"
          type="date"
          value={formData.date.start}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              date: { ...prev.date, start: e.target.value },
            }))
          }
        />
      </div>
      <div>
        <label>Період закінчення:</label>
        <input
          name="finish"
          type="date"
          value={formData.date.finish}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              date: { ...prev.date, finish: e.target.value },
            }))
          }
        />
      </div>
      <div>
        <label>Кількість запитів:</label>
        <input
          name="requests"
          type="number"
          value={formData.requests}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Номер замовлення:</label>
        <input name="order" value={formData.order} onChange={handleChange} />
      </div>
      <div>
        <label>Ліцензія:</label>
        <input
          name="license"
          value={formData.license}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Кількість документів:</label>
        <input
          name="docs"
          type="number"
          value={formData.docs}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Отримувач (назва):</label>
        <input
          name="name"
          value={formData.recipient.name}
          onChange={handleRecipientChange}
        />
      </div>
      <div>
        <label>Отримувач (адреса):</label>
        <input
          name="address"
          value={formData.recipient.address}
          onChange={handleRecipientChange}
        />
      </div>
      <button onClick={generateAndSavePDF} disabled={isLoading}>
        {isLoading ? 'Зберігається...' : 'Зберегти PDF'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
}
