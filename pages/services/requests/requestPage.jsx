import Link from "next/link";
import PropTypes from "prop-types";
import { getRightData } from "../../../helpers/rightData";
import { useRouter } from "next/router";

import styles from "../../../styles/itemPage.module.scss";
import { ButtonUp } from "../../../components/ButtonUp";
import { useTranslation } from "next-i18next";

import { QRCode } from "react-qrcode-logo";
import { useState } from "react";
import LawyersRequestForm from "../../../components/LawyersRequestsForm";

export default function LawyersRequestPage({ item, buttonName, linkPath }) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [isActiveForm, setIsActiveForm] = useState(false);

  const handleOpenForm = () => {
    setIsActiveForm((prevState) => !prevState);
  };
  console.log(item);

  return (
    <div className={styles.itemPage}>
      <div className={styles.itemPage__body}>
        <h1 className={`page__title ${styles.itemPage__title}`}>
          {item.type === "requests"
            ? `${item.requestType[locale]}: ${getRightData(
                item,
                locale,
                "title"
              )}`
            : getRightData(item, locale, "title")}
        </h1>
        <article
          className={styles.itemPage__text}
          dangerouslySetInnerHTML={{
            __html: getRightData(item, locale, "preview"),
          }}
        />

        <div className={styles.buttonDiv}>
          <button
            type="button"
            onClick={handleOpenForm}
            className={`${styles.buttonDiv__button} ${
              isActiveForm ? styles.buttonDiv__button_active : ""
            }`}
          >
            {isActiveForm ? (
              <span className={styles.buttonDiv__button_text}>Закрити</span>
            ) : (
              <span className={styles.buttonDiv__button_text}>Замовити</span>
            )}
          </button>
          {isActiveForm && (

            <div style={{ marginTop: 60, marginBottom: 60 }}>
              <LawyersRequestForm currentLanguage={locale} />
            </div>
          )}
        </div>

        <div className={styles.itemPage__iconsWrap}>
          <a href="https://t.me/emigrant_helper_bot" alt="">
            <QRCode
              value="https://t.me/emigrant_helper_bot"
              logoImage="../telegram-icon.svg"
              size={200}
            />
          </a>
        </div>

        <button className="button-extension button-extension--down">
          <Link href={linkPath}>
            <p>{buttonName}</p>
          </Link>
        </button>
      </div>
      <ButtonUp />
    </div>
  );
}

LawyersRequestPage.propType = {
  item: PropTypes.object.isRequired,
  buttonName: PropTypes.string,
  linkPath: PropTypes.string,
};
