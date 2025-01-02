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
  signature: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 80,
  },
});

const getValue = (value, fallback = '') => value || fallback;
const PIB = value =>
  [value?.surname, value?.name, value?.fatherName || ''].join(' ');

export const Agreement = ({ data }) => {
  const { user } = useContext(AppContext);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Text>До будь-якої заінтересованої установи</Text>
            <Text>(державного органу, организації)</Text>
          </View>
          <View style={styles.headerSubtitle}>
            <Text>Адвокату </Text>
            <Text>
              Строгому Валерію Федоровичу,
              <Text>
                Свідоцтво про право на зайняття адвокатською діяльністю №278 від
                18.07.2005 р.
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.sectionTitle}>
          <Text style={styles.text}>Заява</Text>
          <Text style={styles.boldItalic}>
            про надання дозволу/розголошення інформації з обмеженим доступом
            (конфіденційної інформації,персональних даних)
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>
            Я, громадянин Країна, {PIB(data)}, дата народження, закордонний
            паспорт/паспорт України/внж/ серія та номер /,відповідно до Закону
            Україні «Про захист персональних даних», надаю згоду адвокату
            Строгому Валерію Федоровичу на отримання від будь-яких органів
            державної влади України або місцевого самоврядування , підприємств,
            установ, організацій, фізичних осіб, а також на обробку, зберігання
            та розповсюдження (збирання, використання, тощо) моїх персональних
            даних, що відносяться до конфіденційної інформації/інформації з
            обмеженим доступом, в тому числі з баз персональних даних (стаття 14
            закону України «Про захист персональних даних»), з метою отримання
            інформації про виготовлення на моє ім’я внутрішнього паспорту (id
            карти) громадянина України.
          </Text>
          <Text style={styles.text}>
            З моїх слів надруковано вірно. Згоду надаю добровільно, повністю
            розуміючі значення своїх дії.
          </Text>
        </View>
        <View style={styles.signature}>
          <Text style={styles.textNoIndent}>{getValue(data.dateCreating)}</Text>
          <Text style={styles.italic}>{PIB(data)}</Text>
        </View>
      </Page>
    </Document>
  );
};
