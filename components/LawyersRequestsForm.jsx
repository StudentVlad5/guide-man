"use client";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "./AppProvider";
import styles from "../styles/lawyersRequestForm.module.scss";

import countries from "i18n-iso-countries";
import ukLocale from "i18n-iso-countries/langs/uk.json";
import ruLocale from "i18n-iso-countries/langs/ru.json";
import enLocale from "i18n-iso-countries/langs/en.json";
import { useTranslation } from "react-i18next";
import { uploadFile } from "../helpers/firebaseControl";

countries.registerLocale(ukLocale);
countries.registerLocale(ruLocale);
countries.registerLocale(enLocale);

// Динамічне підключення PDF-компонента
const LawyersRequest = dynamic(() => import("./DownloadPDF"), {
  ssr: false,
});

export default function LawyersRequestForm({ currentLanguage, request }) {
  const language = currentLanguage === "ua" ? "uk" : currentLanguage;
  const { t } = useTranslation();
  const { user } = useContext(AppContext);
  const requestEn = request.requestType.ua;

  const [formData, setFormData] = useState({
    name: "", //АДПСУ, РАЦС, МОУ і ТЦК, ГУНП, ПФУ і ДПСУ, ВПО
    surname: "", //АДПСУ, РАЦС, МОУ і ТЦК, ГУНП, ПФУ і ДПСУ, ВПО
    fatherName: "", //АДПСУ, РАЦС, МОУ і ТЦК, ГУНП, ПФУ і ДПСУ, ВПО
    email: "example@example.com", //????
    birthday: "", //АДПСУ, РАЦС, МОУ і ТЦК, ГУНП
    requesterBirthday: "", //РАЦС
    requesterName: "", //РАЦС
    requesterFile: "", //РАЦС
    deathDay: "", //РАЦС
    dateCreating: new Date() //ВСІ ФОРМИ
      .toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    date: { start: "", finish: "" },
    recipient: {
      name: "Держ орган",
      address: "повна адреса органу",
    },
    citizenship: "", //АДПСУ,
    // ПАСПОРТИ
    abroadPassnum: "", //АДПСУ
    passportNum: "", //АДПСУ,
    pmjNum: "", //АДПСУ,

    dateBorderCrossingStart: "", //АДПСУ,
    dateBorderCrossingEnd: "", //АДПСУ,
    // ПІБ подружжя(тобто обох супругів)
    couplePIB1: "", //РАЦС
    couplePIB2: "", //РАЦС
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
    uid: user?.uid || "",
    request: request,
  });
  const [downloadLink, setDownloadLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestTypeMap = {
    РАЦС: [
      "name",
      "surname",
      "fatherName",
      "requesterBirthday",
      "requesterName",
      "requesterFile",
      "birthday",
      "deathDay",
      "couplePIB1",
      "couplePIB2",
      "dateResidence",
    ],
    АДПСУ: [
      "name",
      "surname",
      "fatherName",
      "birthday",
      "citizenship",
      "passportNum",
      "abroadPassnum",
      "pmjNum",
      "dateBorderCrossingStart",
      "dateBorderCrossingEnd",
    ],
    "МОУ і ТЦК": [
      "name",
      "surname",
      "fatherName",
      "birthday",
      "tckName",
      "tckAddress",
      "tckEmail",
    ],
    МВС: [
      "name",
      "surname",
      "fatherName",
      "birthday",
      "eventDate",
      "eventTime",
      "eventPlace",
    ],
    "ПФУ і ДПСУ": ["name", "surname", "fatherName", "ipn"],
    ВПО: ["name", "surname", "fatherName", "propertyAddress"],
  };

  const requestNameToKeyMap = {
    "Запити до органів ДРАЦС (реєстрація актів цивільного стану)": "РАЦС",
    "Запити до Державної міграційної служби України (ДМСУ) та адміністрації ДПСУ":
      "АДПСУ",
    "Запити до Міністерства оборони України (МОУ) та територіальних центрів комплектування (ТЦК)":
      "МОУ і ТЦК",
    "Запити до Міністерства внутрішніх справ України (МВС)": "МВС",
    "Запити до Пенсійного фонду України (ПФУ) та Державної прикордонної служби України (ДПСУ)":
      "ПФУ і ДПСУ",
    "Запити, пов’язані з внутрішньо переміщеними особами (ВПО)": "ВПО",
  };

  const filterFieldsByRequestType = (requestEn) => {
    const typeKey = requestNameToKeyMap[requestEn] || "";
    return requestTypeMap[typeKey] || [];
  };
  const visibleFields = filterFieldsByRequestType(requestEn);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeForFile = async (e) => {
    const { name, files } = e.target;

    if (name === "requesterFile" && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        dataToSend.append(key, value, value.name);
      } else {
        dataToSend.append(key, value);
      }
    });

    fetch("/submit", {
      method: "POST",
      body: dataToSend,
    })
      .then((response) => response.json())
      .then((data) => console.log("success", data))
      .catch((error) => console.error("Error", error));
  };

  // const openFile = () => {
  //   const file = formData.requesterFile;

  //   if (file) {
  //     const fileURL = URL.createObjectURL(file);
  //     window.open(fileURL, "_blank");
  //   } else {
  //     alert("Файл не завантажений.");
  //   }
  // };

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
    // console.log(formData);

    try {
      const response = await axios.post("/api/save-pdf", formData);
      // console.log(response.data);
      if (response.data.pdfDocUrl) {
        setDownloadLink(response.data.pdfDocUrl);
      }
      if (response.data.pdfBase64) {
        const pdfData = `data:application/pdf;base64,${response.data.pdfBase64}`;
        const pdfWindow = window.open(pdfData, "_blank");
        if (!pdfWindow) {
          throw new Error("Unable to open PDF.");
        }
      }
    } catch (error) {
      console.error("Error saving PDF:", error);
      alert("Failed to save PDF. Verify the data.");
      setError("Failed to save PDF. Verify the data.");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <>
      <div className={styles.orderForm}>
        <form onSubmit={handleSubmit} className={styles.orderForm__form}>
          <h1>
            {language === "uk"
              ? "Сформувати адвокатський запит:"
              : language === "ru"
              ? "Сформировать адвокатский запрос:"
              : "Create a lawyer request:"}
          </h1>

          {/* {visibleFields.includes("citizenship") && ( */}
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Громадянство:"
                  : language === "ru"
                  ? "Гражданство:"
                  : "Citizenship:"}
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
          {/* )} */}

          {visibleFields.includes("surname") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Прізвище:"
                  : language === "ru"
                  ? "Фамилия:"
                  : "Surname:"}
                <span className={styles.orderForm__form_required}>*</span>
              </span>
              <input
                className={styles.orderForm__form_input}
                placeholder="Степаненко"
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </label>
          )}

          {visibleFields.includes("name") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Ім`я:"
                  : language === "ru"
                  ? "Имя:"
                  : "Name:"}
                <span className={styles.orderForm__form_required}>*</span>
              </span>
              <input
                className={styles.orderForm__form_input}
                placeholder="Степан"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
          )}

          {visibleFields.includes("fatherName") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "По-батькові:"
                  : language === "ru"
                  ? "Отчество:"
                  : "Patronymic:"}
              </span>
              <input
                className={styles.orderForm__form_input}
                placeholder="Степанович"
                type="text"
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
              />
            </label>
          )}

          {visibleFields.includes("birthday") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Дата народження:"
                  : language === "ru"
                  ? "Дата рождения:"
                  : "Birthday:"}
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
          )}

          {visibleFields.includes("requesterName") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "ПІБ (людина, яка робить запит):"
                  : language === "ru"
                  ? "ФИО (человек, делающий запрос):"
                  : "Full name (person making the request):"}
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
          )}

          {visibleFields.includes("requesterFile") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Документ який підтверджує рідство:"
                  : language === "ru"
                  ? "Документ подтверждающий родство:"
                  : "Document confirming kinship:"}
                <span className={styles.orderForm__form_required}>*</span>
              </span>
              <input
                className={styles.orderForm__form_input}
                type="file"
                id="requesterFile"
                name="requesterFile"
                // value={formData.requesterFile}
                onChange={handleChangeForFile}
                required
              />
            </label>
          )}

          {visibleFields.includes("requesterBirthday") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Дата народження (людина, яка робить запит):"
                  : language === "ru"
                  ? "Дата рождения (человек, делающий запрос):"
                  : "Date of birth (person making the request):"}
                <span className={styles.orderForm__form_required}>*</span>
              </span>
              <input
                className={styles.orderForm__form_input}
                type="date"
                id="requesterBirthday"
                name="requesterBirthday"
                value={formData.requesterBirthday}
                onChange={handleChange}
                required
              />
            </label>
          )}

          {visibleFields.includes("deathDay") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Дата смерті:"
                  : language === "ru"
                  ? "Дата смерти:"
                  : "Date of death:"}
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
          )}

          {(formData.citizenship === "Україна" ||
            formData.citizenship === "Украина" ||
            formData.citizenship === "Ukraine") &&
            visibleFields.includes("passportNum") && (
              <label className={styles.orderForm__form_lable}>
                <span className={styles.orderForm__form_span}>
                  {language === "uk"
                    ? "Серія та номер паспорту:"
                    : language === "ru"
                    ? "Серия и номер паспорта:"
                    : "Passport series and number:"}
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
            )}

          {visibleFields.includes("abroadPassnum") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Серія та номер закордонного паспорту:"
                  : language === "ru"
                  ? "Серия и номер загранпаспорта:"
                  : "Series and number of the international passport:"}
              </span>
              <input
                className={styles.orderForm__form_input}
                placeholder="483/473465"
                type="text"
                id="abroadPassnum"
                name="abroadPassnum"
                value={formData.abroadPassnum}
                onChange={handleChange}
              />
            </label>
          )}

          {formData.citizenship !== "Україна" &&
            formData.citizenship !== "Украина" &&
            formData.citizenship !== "Ukraine" &&
            visibleFields.includes("pmjNum") && (
              <label className={styles.orderForm__form_lable}>
                <span className={styles.orderForm__form_span}>
                  {language === "uk"
                    ? "Посвідка на проживання:"
                    : language === "ru"
                    ? "Вид на жительство:"
                    : "Residence permit:"}
                  <span className={styles.orderForm__form_required}>*</span>
                </span>
                <input
                  className={styles.orderForm__form_input}
                  placeholder="483/473465"
                  type="text"
                  id="pmjNum"
                  name="pmjNum"
                  value={formData.pmjNum}
                  onChange={handleChange}
                  required
                />
              </label>
            )}

          {visibleFields.includes("dateBorderCrossingStart") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Дата початку перетину кордону:"
                  : language === "ru"
                  ? "Дата начала пересечения границы:"
                  : "Border crossing start date:"}
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
          )}

          {visibleFields.includes("dateBorderCrossingEnd") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Дата закінчення перетину кордону:"
                  : language === "ru"
                  ? "Дата окончания пересечения границы:"
                  : "End date of border crossing:"}
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
          )}

          {visibleFields.includes("couplePIB1") &&
            visibleFields.includes("couplePIB2") && (
              <label className={styles.orderForm__form_lable}>
                <span className={styles.orderForm__form_span}>
                  {language === "uk"
                    ? "ПІБ подружжя (тобто обох супругів):"
                    : language === "ru"
                    ? "ФИО супругов (то есть обоих супругов):"
                    : "Spouse's full name (i.e. both spouses):"}
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
            )}

          {visibleFields.includes("dateResidence") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Дата надання довідки про місце проживання:"
                  : language === "ru"
                  ? "Дата предоставления справки о месте жительства:"
                  : "Date of issuance of residence certificate:"}
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
          )}

          {visibleFields.includes("tckName") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Назва (район) ТЦК:"
                  : language === "ru"
                  ? "Название (район) ТЦК:"
                  : "Name (district) of the Territorial Recruitment Centers:"}
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
          )}

          {visibleFields.includes("tckAddress") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Адреса ТЦК:"
                  : language === "ru"
                  ? "Адрес ТЦК:"
                  : "Address of the Territorial Recruitment Centers:"}
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
          )}

          {visibleFields.includes("tckEmail") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Електронна пошта ТЦК:"
                  : language === "ru"
                  ? "Электронная почта ТЦК:"
                  : "Email of the Territorial Recruitment Centers:"}
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
          )}

          {visibleFields.includes("eventDate") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Дата події:"
                  : language === "ru"
                  ? "Дата события:"
                  : "Event date:"}
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
          )}

          {visibleFields.includes("eventTime") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Час події:"
                  : language === "ru"
                  ? "Время события:"
                  : "Event time:"}
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
          )}

          {visibleFields.includes("eventPlace") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Місце події:"
                  : language === "ru"
                  ? "Место события:"
                  : "Event location:"}
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
          )}

          {visibleFields.includes("ipn") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "ІПН (єдрпоу):"
                  : language === "ru"
                  ? "ИНН (едрпоу):"
                  : "TIN (Edrpou):"}
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
          )}

          {visibleFields.includes("propertyAddress") && (
            <label className={styles.orderForm__form_lable}>
              <span className={styles.orderForm__form_span}>
                {language === "uk"
                  ? "Адреса майна:"
                  : language === "ru"
                  ? "Адрес имущества:"
                  : "Property address:"}
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
          )}

          <button
            onClick={(e) => {
              handleSubmit(e), generateAndSavePDF();
            }}
            disabled={isLoading}
            type="submit"
            className={styles.orderForm__form_button}
          >
            {isLoading
              ? language === "uk"
                ? "Формується..."
                : language === "ru"
                ? "Формируется..."
                : "Generating..."
              : language === "uk"
              ? "Сформовано PDF"
              : language === "ru"
              ? "Сформировано PDF"
              : "PDF generated"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {downloadLink && (
            <div className={styles.orderForm__form_file}>
              <p className={styles.orderForm__form_file_text}>
                {language === "uk"
                  ? "Ваш файл готовий:"
                  : language === "ru"
                  ? "Ваш файл готов:"
                  : "Your file is ready:"}
              </p>
              <a
                className={styles.orderForm__form_download}
                style={{ textDecoration: "none" }}
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {language === "uk"
                  ? "Завантажити PDF"
                  : language === "ru"
                  ? "Скачать PDF"
                  : "Download PDF"}
              </a>
            </div>
          )}

          {/* {formData.requesterFile && (
            <div>
              <p>Файл завантажено: {formData.requesterFile.name}</p>
              <button type="button" onClick={openFile}>
                Відкрити файл
              </button>
            </div>
          )} */}

          <button type="button" className={styles.orderForm__form_button}>
            Далі
          </button>
        </form>
      </div>
    </>
  );
}

LawyersRequestForm.propType = {
  request: PropTypes.object.isRequired,
  currentLanguage: PropTypes.string,
};
