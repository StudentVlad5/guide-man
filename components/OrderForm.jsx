import React, { useEffect, useState } from "react";
import styles from "../styles/orderForm.module.scss";
import countries from "i18n-iso-countries";
import ukLocale from "i18n-iso-countries/langs/uk.json";
import ruLocale from "i18n-iso-countries/langs/ru.json";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(ukLocale);
countries.registerLocale(ruLocale);
countries.registerLocale(enLocale);

export const OrderForm = ({ currentLanguage }) => {
  const language = currentLanguage === "ua" ? "uk" : currentLanguage;

  const [formData, setFormData] = useState({
    dateFormStart: "", //ВСІ ФОРМИ
    pib: "", //АДПСУ, РАЦС, МОУ і ТЦК, ГУНП, ПФУ і ДПСУ, ВПО
    birthday: "", //АДПСУ, РАЦС, МОУ і ТЦК, ГУНП
    deathDay: "", //РАЦС
    citizenship: "", //АДПСУ,
    passportNum: "", //АДПСУ,
    dateBorderCrossingStart: "", //АДПСУ,
    dateBorderCrossingEnd: "", //АДПСУ,
    // ПІБ подружжя(тобто обох супругів)
    couplePIB: "", //РАЦС
    // (дату надання довідки про місце проживання)
    dateResidence: "", //РАЦС
    tckName: "", //МОУ і ТЦК
    tckAddress: "", //МОУ і ТЦК
    tckEmail: "", //МОУ і ТЦК
    eventDate: "", //ГУНП
    eventTime: "", //ГУНП
    eventPlace: "", //ГУНП
    ipn: "", //ПФУ і ДПСУ
    propertyAddress: "", //ВПО
  });

  const getCountriesByLanguage = (lang) => {
    return Object.entries(countries.getNames(lang)).map(([code, name]) => ({
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

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setFormData((prevData) => ({
      ...prevData,
      dateFormStart: currentDate,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className={styles.orderForm}>
      <form onSubmit={handleSubmit} className={styles.orderForm__form}>
        <label className={styles.orderForm__form_lable}>
          <span className={styles.orderForm__form_span}>Громадянство:</span>
          <div className={styles.orderForm__form_selectWrapper}>
            <select
              className={styles.orderForm__form_select}
              name="citizenship"
              value={formData.citizenship}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                {language === "uk"
                  ? "Виберіть країну"
                  : language === "ru"
                  ? "Выберите страну"
                  : "Select a country"}
              </option>
              {countryList.map((country) => (
                <option key={country.value} value={country.label}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className={styles.orderForm__form_lable}>
          <span className={styles.orderForm__form_span}>ПІБ:</span>
          <input
            className={styles.orderForm__form_input}
            placeholder="Іванов Іван Іванович"
            type="text"
            id="pib"
            name="pib"
            value={formData.pib}
            onChange={handleChange}
            required
          />
        </label>

        <label className={styles.orderForm__form_lable}>
          <span className={styles.orderForm__form_span}>Дата народження:</span>
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
          <span className={styles.orderForm__form_span}>Дата смерті:</span>
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
            Серія та номер маспорту:
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
            Дата початку перетину кордону:
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
            Дата закінчення перетину кордону:
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
            ПІБ подружжя (тобто обох супругів):
          </span>
          <input
            className={styles.orderForm__form_input}
            placeholder="Іванов Іванова"
            type="text"
            id="couplePIB"
            name="couplePIB"
            value={formData.couplePIB}
            onChange={handleChange}
            required
          />
        </label>

        <label className={styles.orderForm__form_lable}>
          <span className={styles.orderForm__form_span}>
            Дата надання довідки про місце проживання:
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
            Назава (район) ТЦК:
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
          <span className={styles.orderForm__form_span}>Адреса ТЦК:</span>
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
            Електронна пошта ТЦК:
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
          <span className={styles.orderForm__form_span}>Дата події:</span>
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
          <span className={styles.orderForm__form_span}>Час події:</span>
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
          <span className={styles.orderForm__form_span}>Місце події:</span>
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
          <span className={styles.orderForm__form_span}>ІПН (єдрпоу):</span>
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
          <span className={styles.orderForm__form_span}>Адреса майна:</span>
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

        <button type="submit" className={styles.orderForm__form_button}>
          Перейти до оплати
        </button>
      </form>
    </div>
  );
};
