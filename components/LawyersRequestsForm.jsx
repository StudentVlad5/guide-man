'use client';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styles from '../styles/lawyersRequestForm.module.scss';

import countries from 'i18n-iso-countries';
import ukLocale from 'i18n-iso-countries/langs/uk.json';
import ruLocale from 'i18n-iso-countries/langs/ru.json';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(ukLocale);
countries.registerLocale(ruLocale);
countries.registerLocale(enLocale);

// Динамічне підключення PDF-компонента
const LawyersRequest = dynamic(() => import('./DownloadPDF'), {
  ssr: false,
});

export default function LawyersRequestForm({ currentLanguage }) {
  // const language = currentLanguage === "ua" ? "uk" : currentLanguage;
  const language = ukLocale;

  const [formData, setFormData] = useState({
    name: '', //АДПСУ, РАЦС, МОУ і ТЦК, ГУНП, ПФУ і ДПСУ, ВПО
    surnamme: '', //АДПСУ, РАЦС, МОУ і ТЦК, ГУНП, ПФУ і ДПСУ, ВПО
    fatherName: '', //АДПСУ, РАЦС, МОУ і ТЦК, ГУНП, ПФУ і ДПСУ, ВПО
    email: 'example@example.com', //????
    birthday: '', //АДПСУ, РАЦС, МОУ і ТЦК, ГУНП
    requesterBirthday: '', //РАЦС
    requesterName: '', //РАЦС
    requesterFile: '', //РАЦС
    deathDay: '', //РАЦС
    dateCreating: new Date() //ВСІ ФОРМИ
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
    recipient: {
      name: 'Держ орган',
      address: 'повна адреса органу',
    },
    citizenship: '', //АДПСУ,
    passportNum: '', //АДПСУ,
    dateBorderCrossingStart: '', //АДПСУ,
    dateBorderCrossingEnd: '', //АДПСУ,
    // ПІБ подружжя(тобто обох супругів)
    couplePIB1: '', //РАЦС
    couplePIB2: '', //РАЦС
    // (дату надання довідки про місце проживання)
    dateResidence: '', //РАЦС
    tckName: '', //МОУ і ТЦК
    tckAddress: '', //МОУ і ТЦК
    tckEmail: '', //МОУ і ТЦК
    eventDate: '', //ГУНП
    eventTime: '', //ГУНП
    eventPlace: '', //ГУНП
    ipn: '', //ПФУ і ДПСУ
    propertyAddress: '', //ВПО
  });
  const [downloadLink, setDownloadLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(formData);
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

  // const getCountriesByLanguage = (lang) => {
  //   return Object.entries(countries.getNames(lang)).map(([code, name]) => ({
  //     value: code,
  //     label: name,
  //   }));
  // };

  const getCountriesByLanguage = () => {
    const selectedLocale = ukLocale;
    const countryNames = selectedLocale.countries;
    return Object.entries(countryNames).map(([code, name]) => ({
      value: code,
      label: name,
    }));
  };

  const [countryList, setCountryList] = useState(
    getCountriesByLanguage(language)
  );

  useEffect(() => {
    setCountryList(getCountriesByLanguage(language));
  }, [language]);

  return (
    <>
      <h1>Сформувати адвокатський запит</h1>
      <div className={styles.orderForm}>
        <form onSubmit={handleSubmit} className={styles.orderForm__form}>
          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Громадянство:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <div className={styles.orderForm__form_selectWrapper}>
              <select
                className={styles.orderForm__form_select}
                name="citizenship"
                value={formData.citizenship}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  {language === 'uk'
                    ? 'Виберіть країну'
                    : language === 'ru'
                    ? 'Выберите страну'
                    : 'Select a country'}
                </option>
                {countryList.map(country => (
                  <option key={country.value} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Ім`я: <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              placeholder="Іванов Іван Іванович"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Прізвище:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              placeholder="Іванов Іван Іванович"
              type="text"
              id="surnamme"
              name="surnamme"
              value={formData.surnamme}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>По-батькові:</span>
            <input
              className={styles.orderForm__form_input}
              placeholder="Іванов Іван Іванович"
              type="text"
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              ПІБ (людина яка робить запит):{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              placeholder="Іванов Іван Іванович"
              type="text"
              id="requesterName"
              name="requesterName"
              value={formData.requesterName}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Документ який підтверджує рідство:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              type="file"
              id="requesterFile"
              name="requesterFile"
              value={formData.requesterFile}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Дата народження (людина яка робить запит):
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              type="date"
              name="requesterBirthday"
              id="requesterBirthday"
              value={formData.requesterBirthday}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Дата народження:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              type="date"
              name="birthday"
              id="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Дата смерті:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              type="date"
              name="deathDay"
              id="deathDay"
              value={formData.deathDay}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Серія та номер маспорту:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              placeholder="483/473465"
              type="text"
              id="passportNum"
              name="passportNum"
              value={formData.passportNum}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Дата початку перетину кордону:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              type="date"
              name="dateBorderCrossingStart"
              id="dateBorderCrossingStart"
              value={formData.dateBorderCrossingStart}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Дата закінчення перетину кордону:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              type="date"
              name="dateBorderCrossingEnd"
              id="dateBorderCrossingEnd"
              value={formData.dateBorderCrossingEnd}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              ПІБ подружжя (тобто обох супругів):{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              placeholder="Іванов Іван Іванович"
              type="text"
              id="couplePIB1"
              name="couplePIB1"
              value={formData.couplePIB1}
              onChange={handleChange}
              required
              style={{ marginBottom: 15 }}
            />
            <input
              className={styles.orderForm__form_input}
              placeholder="Іванов Вікторія Іванівна"
              type="text"
              id="couplePIB2"
              name="couplePIB2"
              value={formData.couplePIB2}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Дата надання довідки про місце проживання:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              type="date"
              name="dateResidence"
              id="dateResidence"
              value={formData.dateResidence}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Назава (район) ТЦК:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              placeholder="ТЦК Приклад"
              type="text"
              id="tckName"
              name="tckName"
              value={formData.tckName}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Адреса ТЦК:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              placeholder="м.Київ, вул.Вулиця 1"
              type="text"
              id="tckAddress"
              name="tckAddress"
              value={formData.tckAddress}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Електронна пошта ТЦК:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              placeholder="test@gmail.com"
              type="email"
              id="tckEmail"
              name="tckEmail"
              value={formData.tckEmail}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Дата події:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              type="date"
              name="eventDate"
              id="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Час події:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              type="time"
              name="eventTime"
              id="eventTime"
              value={formData.eventTime}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Місце події:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              type="text"
              placeholder="м.Київ, вул.Вулиця 1"
              name="eventPlace"
              id="eventPlace"
              value={formData.eventPlace}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              ІПН (єдрпоу):{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              type="text"
              placeholder="34543456"
              name="ipn"
              id="ipn"
              value={formData.ipn}
              onChange={handleChange}
              required
            />
          </label>

          <label className={styles.orderForm__form_lable}>
            <span className={styles.orderForm__form_span}>
              Адреса майна:{' '}
              <span className={styles.orderForm__form_required}>*</span>
            </span>
            <input
              className={styles.orderForm__form_input}
              type="text"
              placeholder="м.Київ, вул.Вулиця 1"
              name="propertyAddress"
              id="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              required
            />
          </label>

          <button
            onClick={generateAndSavePDF}
            disabled={isLoading}
            type="submit"
            className={styles.orderForm__form_button}
          >
            {isLoading ? 'Зберігається...' : 'Зберегти PDF'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {downloadLink && (
            <div className={styles.orderForm__form_file}>
              <p className={styles.orderForm__form_file_text}>
                Ваш файл готовий:
              </p>
              <a
                className={styles.orderForm__form_button}
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Завантажити PDF
              </a>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
