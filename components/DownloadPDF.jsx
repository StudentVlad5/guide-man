'use client';
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Link,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingVertical: 50,
    paddingLeft: 100,
    paddingRight: 50,
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 1.3,
    fontStyle: 'normal',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'right',
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
    paddingBottom: 10,
    fontSize: 16,
    textTransform: 'uppercase',
    textAlign: 'center',
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
  },
  sectionTitle: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 15,
    padding: 10,
    textAlign: 'center',
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
  },
  title: {
    fontSize: 16,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    textIndent: 20,
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
  appeal: {
    display: 'block',
    fontSize: 18,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  apps: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginTop: 50,
    paddingLeft: 60,
    paddingRight: 40,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  signature: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
    fontSize: 16,
  },
  img: {
    width: 50,
    height: 70,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

const getValue = (value, fallback = '') => value || fallback;
const PIB = value =>
  [value?.surname, value?.name, value?.fatherName || ''].join(' ');
const Passport = value => [value?.passportNum, 'виданий', 'від'].join(' ');

export const LawyersRequest = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerTitle}>
          <Image src={data.emblemBase64} style={styles.img} alt="emblem" />
          <Text style={styles.bold}>
            НАЦІОНАЛЬНА АСОЦІАЦІЯ АДВОКАТІВ УКРАЇНИ
          </Text>
          <Text style={styles.bold}>АДВОКАТ</Text>
          <Text style={styles.bold}>СТРОГИЙ ВАЛЕРІЙ ФЕДОРОВИЧ</Text>
        </View>
        <View style={styles.header}>
          <Text style={styles.italic}>
            адреса: м.Харків, вул.Клочківська,350, моб.тел. 095-642-94-14,
          </Text>
          <Text style={styles.italic}>
            ел.пошта{' '}
            <Link href="mailto:pcentr27@gmail.com">pcentr27@gmail.com</Link>{' '}
            свідоцтво №278 від 18 липня 2005 року
          </Text>
        </View>
        <View style={styles.address}>
          <View style={styles.section}>
            <Text style={styles.textNoIndent}>
              {getValue(data.dateCreating)}
            </Text>
          </View>
          <View style={[styles.section, { maxWidth: '50%' }]}>
            <Text style={styles.textNoIndent}>
              До {getValue(data.recipient?.name)}
            </Text>
            <Text style={styles.textNoIndent}>
              Адреса: {getValue(data.recipient?.address)}
            </Text>
          </View>
        </View>
        <View style={styles.sectionTitle}>
          <Text style={styles.title}>ЗАПИТ</Text>
          <Text style={styles.subtitle}>
            (в порядку статей 20, 24 Закону України «Про адвокатуру та
            адвокатську діяльність»)
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>
            Відповідно до ст. 24 ЗУ «Про адвокатуру та адвокатської діяльності»
            Орган державної влади, орган місцевого самоврядування, їх посадові
            та службові особи, керівники підприємств, установ, організацій,
            громадських об’єднань, яким направлено адвокатський запит,
            зобов’язані{' '}
            <Text style={styles.underline}>
              не пізніше п’яти робочих днів з дня отримання запиту{' '}
            </Text>{' '}
            надати адвокату відповідну інформацію, копії документів, крім
            інформації з обмеженим доступом і копій документів, в яких міститься
            інформація з обмеженим доступом (ч. 2).
          </Text>
        </View>

        <View style={styles.section}>{data.request?.ua.text || ''}</View>

        <View style={styles.section}>
          <Text style={styles.text}>
            Прошу надати зазначені документи та інформацію у вигляді засвідчених
            копій та направити їх за наступною адресою:{' '}
            <Text style={styles.boldItalic}>pcentr27@gmail.com.</Text>
          </Text>
          <Text style={styles.text}>
            Даний запит подається в інтересах {PIB(data)}, з його згодою на збір
            та обробку персональних даних відповідно до законодавства України.
          </Text>
        </View>
        <View style={styles.apps}>
          <Text style={styles.italic}>Додаток:{'   '} </Text>
          <View style={styles.list}>
            <Text style={styles.italic}>- копія ордеру </Text>
            <Text style={styles.italic}>
              - копія свідоцтва про право на заняття адвокатською діяльністю
            </Text>
            <Text style={styles.italic}>
              - згода на розголошення персональних даних
            </Text>
          </View>
        </View>
        <View style={styles.signature}>
          <Text style={styles.textNoIndent}>З повагою, адвокат</Text>
          <Text style={styles.textNoIndent}>(підпис)</Text>
          <Text style={styles.textNoIndent}>В.Ф.Строгий</Text>
        </View>
      </Page>
    </Document>
  );
};
