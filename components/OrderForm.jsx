import React, { useState } from "react";
import styles from "../styles/orderForm.module.scss";

export const OrderForm = () => {
  const [formData, setFormData] = useState({
    citizenship: "",
    pib: "",
    birthday: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("data:", formData);
  };

  return (
    <div className={styles.orderForm}>
      <form onSubmit={handleSubmit} className={styles.orderForm__form}>
        <label className={styles.orderForm__form_lable}>
          <span className={styles.orderForm__form_span}>Громадянство:</span>
          <input
            className={styles.orderForm__form_input}
            // style={{ width: 617 }}
            placeholder="Виберіть громадягство"
            type="text"
            id="citizenship"
            name="citizenship"
            value={formData.citizenship}
            onChange={handleChange}
            required
          />
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
        <button type="submit" className={styles.orderForm__form_button}>Перейти до оплати</button>
      </form>
    </div>
  );
};
