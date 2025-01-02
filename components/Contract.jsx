'use client';
import React, { useContext } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { AppContext } from './AppProvider';

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingVertical: 50,
    paddingLeft: 100,
    paddingRight: 50,
    fontFamily: 'Roboto',
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 1.3,
    letterSpacing: '-0.35px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  headerTitle: {
    paddingBottom: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
  },
  headerSubtitle: {
    paddingTop: 10,
    fontStyle: 'italic',
    lineHeight: 0.9,
    letterSpacing: '-0.75px',
    textAlign: 'left',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
  },
  address: {
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 1,
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
    paddingRight: 50,
    fontSize: 14,
  },
  sectionTitle: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  title: {
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  text: {
    textIndent: 30,
    textAlign: 'justify',
  },
  textNoIndent: {
    textAlign: 'justify',
  },
  italic: {
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: 'bold',
  },
  boldItalic: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  underline: {
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  apps: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
  },
  signature: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 80,
  },
  img: {
    width: 50,
    height: 55,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

const getValue = (value, fallback = '') => value || fallback;
const PIB = value =>
  [value?.surname, value?.name, value?.fatherName || ''].join(' ');

export const Contract = ({ data }) => {
  const { user } = useContext(AppContext);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionTitle}>
          <Text style={styles.title}>ДОГОВІР</Text>
          <Text style={styles.title}>
            ПРО НАДАННЯ ПРАВНИЧОЇ (ПРАВОВОЇ) ДОПОМОГИ м. Київ
          </Text>
          <Text style={styles.subtitle}>{getValue(data.dateCreating)}</Text>
        </View>
        <View style={styles.section}>
          АДВОКАТ, член Національної асоціації Адвокатів України, СТРОГИЙ
          ВАЛЕРІЙ ФЕДОРОВИЧ, який діє на підставі Свідоцтва про право на заняття
          адвокатською діяльністю №278 яке видане 18 липня 2005 року Радою
          адвокатів Чернігівської області, з одного боку, КЛІЄНТ {PIB(data)},
          зареєстрований за адресою: {getValue(data.address)}, з другого боку,
          уклали цей договір про таке:
        </View>
        <Text style={styles.title}> 1. ПРЕДМЕТ ДОГОВОРУ </Text>
        <Text style={styles.textNoIndent}>
          1.1. КЛІЄНТ доручає, а АДВОКАТ, відповідно до чинного законодавства
          України бере на себе обов’язок надати КЛІЄНТУ професійну правничу
          (правову) допомогу у всіх інстанціях (суди, правоохоронні органи,
          підприємства, установи, організації незалежно від форми власності).
          КЛІЄНТ зобов’язується оплатити гонорар АДВОКАТУ в порядку та розмірах,
          передбачених цим Договором.
        </Text>
        <Text style={styles.textNoIndent}>
          1.2. КЛІЄНТ зобов’язується надати АДВОКАТУ необхідну для виконання
          умов Договору інформацію та документацію, інформувати про всі суттєві
          зміни в процесі надання правової допомоги, які можуть вплинути на
          результат їх надання.
        </Text>
        <Text style={styles.textNoIndent}>
          1.3. АДВОКАТ уповноважений здійснювати дії, передбачені ст. 20 ЗУ «Про
          адвокатуру та адвокатську діяльність», а також будь-які інші необхідні
          дії, не заборонені чинним законодавством України та цим Договором.
        </Text>
        <Text style={styles.textNoIndent}>
          1.4. Обсяг повноважень АДВОКАТА для надання правничої (правової)
          допомоги за цим Договором визначається в Ордері, виданому АДВОКАТОМ.
          Застереження щодо повноважень: без обмежень.
        </Text>
        <Text style={styles.title}>2. ГОНОРАР. ПОРЯДОК РОЗРАХУНКІВ </Text>
        <Text style={styles.textNoIndent}>
          2.1. Гонорар АДВОКАТА – винагорода за надання правничої (правової)
          допомоги за цим Договором, розмір якого та порядок оплати узгоджується
          Сторонами окремо.
        </Text>
        <Text style={styles.title}>3. ВІДПОВІДАЛЬНІСТЬ СТОРІН </Text>
        <Text style={styles.textNoIndent}>
          3.1. При невиконанні чи неналежному виконанні зобов`язань за цим
          Договором Сторони несуть відповідальність, передбачену чинним
          законодавством України.
        </Text>
        d
        <Text style={styles.textNoIndent}>
          3.2. АДВОКАТ не несе відповідальності за наслідки, які пов’язані з
          наданням КЛІЄНТОМ документів, які не відповідають дійсності.d
        </Text>
        <Text style={styles.textNoIndent}>
          d 3.3. Усі спори, що виникають з цього Договору або пов`язані із ним,
          у тому числі пов`язані із дійсністю, укладенням, виконанням, зміною чи
          припиненням цього Договору, тлумаченням його умов, визначенням
          наслідків недійсності або порушення Договору, вирішуються шляхом
          переговорів між представниками Сторін.
        </Text>
        <Text style={styles.textNoIndent}>
          3.4. Якщо відповідний спір неможливо вирішити шляхом переговорів, він
          вирішується в судовому порядку за встановленою підвідомчістю та
          підсудністю такого спору відповідно до чинного законодавства України.
        </Text>
        <Text style={styles.title}>
          4. СТРОК ДІЇ ДОГОВОРУ ТА УМОВИ ЙОГО РОЗІРВАННЯ
        </Text>
        <Text style={styles.textNoIndent}>
          4.1. Цей Договір набирає чинності з моменту підписання і діє до
          повного виконання Сторонами своїх зобов’язань за цим Договором.
        </Text>
        <Text style={styles.textNoIndent}>
          4.2. Договір може бути достроково припинений за взаємною згодою сторін
          або розірваний на вимогу однієї із Сторін. При цьому КЛІЄНТ
          зобов’язаний оплатити АДВОКАТУ гонорар за всю роботу, що була виконана
          чи підготовлена до виконання, а АДВОКАТ зобов’язаний повідомити
          КЛІЄНТА про можливі наслідки та ризики, пов’язані з достроковим
          припиненням (розірванням) договору.
        </Text>
        <Text style={styles.title}>5. ІНШІ УМОВИ </Text>
        <Text style={styles.textNoIndent}>
          5.1. Зміст цього Договору є предметом адвокатської таємниці, за
          виключенням повноважень, наданих АДВОКАТУ КЛІЄНТОМ для виконання
          доручення.
        </Text>
        <Text style={styles.textNoIndent}>
          5.2. Будь-які побажання, прохання або вказівки КЛІЄНТА, спрямовані на
          порушення закону, або суперечитимуть загальним засадам суспільства, не
          можуть бути виконані АДВОКАТОМ.
        </Text>
        <Text style={styles.textNoIndent}>
          5.3. КЛІЄНТ не має права вимагати від АДВОКАТА засобів, способів і
          методів представництва, які заборонені законом, не відповідають
          правилам адвокатської етики, можуть зашкодити інтересам КЛІЄНТА.
        </Text>
        <Text style={styles.textNoIndent}>
          5.4. Будь-які зміни і доповнення до договору мають силу тільки в тому
          випадку, якщо вони оформлені в письмовому вигляді і підписані обома
          Сторонами. У разі зміни характеру та обсягу послуг виконуваних
          АДВОКАТОМ за Договором, Сторони повинні провести переговори про зміну
          умов Договору і укласти додаткову угоду до Договору.
        </Text>
        <Text style={styles.textNoIndent}>
          5.5. Питання, що не врегульовані цим Договором регулюються чинним
          законодавством України.
        </Text>
        <Text style={styles.textNoIndent}>
          5.6. Цей Договір складено у двох автентичних примірниках для кожної із
          Сторін.
        </Text>
        <Text style={styles.title}>6. РЕКВІЗИТИ СТОРІН</Text>
        <Text style={styles.textNoIndent}>Клієнт {PIB(data)} (підпис)</Text>
        <Text style={styles.textNoIndent}>
          Адвокат Строгий Валерій Федорович
        </Text>
      </Page>
    </Document>
  );
};
