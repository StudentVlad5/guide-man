'use client';
import React from 'react';
import {
  Font,
  Document,
  Page,
  Text,
  View,
  Link,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import Emblem from '../public/gerb.png';

Font.registerHyphenationCallback(word => [word]);

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 50,
    fontFamily: 'Times-Roman',
    fontSize: 14,
    lineHeight: 1.5,
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
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
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
  italic: {
    fontStyle: 'Times-Italic',
  },
  bold: {
    fontFamily: 'Times-Bold',
    fontWeight: 'bold',
  },
  boldItalic: {
    fontFamily: 'Times-BoldItalic',
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
    marginTop: 50,
    paddingLeft: 60,
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

const getValue = (value, fallback = 'Не вказано') => value || fallback;

export const LawyersRequest = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerTitle}>
          <Image src={Emblem} style={styles.img} alt="emblem" />
          {/* <Text style={styles.bold}>
                        НАЦІОНАЛЬНА АСОЦІАЦІЯ АДВОКАТІВ УКРАЇНИ
                    </Text>
                    <Text style={styles.bold}>АДВОКАТ</Text>
                    <Text style={styles.bold}>СТРОГИЙ ВАЛЕРІЙ ФЕДОРОВИЧ</Text> */}
          <Text style={styles.bold}>
            NATIONAL ASSOCIATION OF LAWYERS OF UKRAINE
          </Text>
          <Text style={styles.bold}>LAWYER</Text>
          <Text style={styles.bold}>STROGIY VALERIY FEDOROVYCH</Text>
        </View>
        <View style={styles.header}>
          {/* <Text style={styles.italic}>
                        адреса: м.Харків, вул.Клочківська,350, моб.тел.
                        095-642-94-14,
                    </Text>
                    <Text style={styles.italic}>
                        ел.пошта <Link>pcentr27@gmail.com</Link> свідоцтво №278
                        від 18 липня 2005 року
                    </Text> */}
          <Text style={styles.italic}>
            address: Kharkiv, Klochkivska st., 350, mobile phone 095-642-94-14,
          </Text>
          <Text style={styles.italic}>
            e-mail <Link>pcentr27@gmail.com</Link> certificate №278 dated July
            18, 2005
          </Text>
        </View>
        <View style={styles.address}>
          <View style={styles.section}>
            <Text style={styles.text}>{getValue(data.dateCreating)}</Text>
          </View>
          <View style={styles.section}>
            {/* <Text style={styles.text}>
                            До {getValue(data.recipient?.name)}
                        </Text>
                        <Text style={styles.text}>
                            Адреса: {getValue(data.recipient?.address)}
                        </Text> */}
            <Text style={styles.text}>To {getValue(data.recipient?.name)}</Text>
            <Text style={styles.text}>
              Address: {getValue(data.recipient?.address)}
            </Text>
          </View>
        </View>
        <View style={styles.sectionTitle}>
          {/* <Text style={styles.title}>ЗАПИТ</Text>
                    <Text style={styles.subtitle}>
                        (в порядку статей 20, 24 Закону України «Про адвокатуру
                        та адвокатську діяльність»)
                    </Text> */}
          <Text style={styles.title}>REQUEST</Text>
          <Text style={styles.subtitle}>
            (in accordance with Articles 20, 24 of the Law of Ukraine “On the
            Bar and Advocacy”)
          </Text>
        </View>
        <View style={styles.section}>
          {/* <Text style={styles.text}>
                        Відповідно до ст. 24 ЗУ «Про адвокатуру та адвокатської
                        діяльності» Орган державної влади, орган місцевого
                        самоврядування, їх посадові та службові особи, керівники
                        підприємств, установ, організацій, громадських
                        об’єднань, яким направлено адвокатський запит,
                        зобов’язані{' '}
                        <Text style={styles.underline}>
                            не пізніше п’яти робочих днів з дня отримання запиту{' '}
                        </Text>{' '}
                        надати адвокату відповідну інформацію, копії документів,
                        крім інформації з обмеженим доступом і копій документів,
                        в яких міститься інформація з обмеженим доступом (ч. 2).
                    </Text> */}
          <Text style={styles.text}>
            According to Article 24 of the Law of Ukraine “On Advocacy and
            Advocacy Activities”, a state authority, a local self-government
            body, their officials and employees, heads of enterprises,
            institutions, organizations, public associations to whom a request
            for an attorney has been sent, are obliged to{' '}
            <Text style={styles.underline}>
              no later than five business days from the date of receipt of the
              request{' '}
            </Text>{' '}
            provide the lawyer with relevant information, copies of documents,
            except for restricted information and copies of documents,
            containing restricted information (part 2).
          </Text>
        </View>
        <View style={styles.section}>
          {/* <Text style={styles.text}>
                        Прошу надати зазначені документи та інформацію у вигляді
                        засвідчених копій та направити їх за наступною адресою:{' '}
                        <Text style={styles.boldItalic}>
                            pcentr27@gmail.com.
                        </Text>
                    </Text>
                    <Text style={styles.text}>
                        Даний запит подається в інтересах {getValue(data.name)},
                        з його згодою на збір та обробку персональних даних
                        відповідно до законодавства України.
                    </Text> */}
          <Text style={styles.text}>
            Please provide the above documents and information in the form of
            certified copies and send them to the following address:{' '}
            <Text style={styles.boldItalic}>pcentr27@gmail.com.</Text>
          </Text>
          <Text style={styles.text}>
            This request is submitted in the interests of {getValue(data.name)},
            with its consent to the collection and processing of personal data
            in accordance with the legislation of Ukraine.
          </Text>
        </View>
        <View style={styles.apps}>
          {/* <Text style={styles.italic}>Додаток: </Text>
                    <View style={styles.list}>
                        <Text style={styles.italic}>- копія ордеру </Text>
                        <Text style={styles.italic}>
                            - копія свідоцтва про право на заняття адвокатською
                            діяльністю
                        </Text>
                        <Text style={styles.italic}>
                            - згода на розголошення персональних даних
                        </Text>
                    </View> */}
          <Text style={styles.italic}>Addition: </Text>
          <View style={styles.list}>
            <Text style={styles.italic}>- copy of the order </Text>
            <Text style={styles.italic}>
              - copy of the certificate of the right to practice law
            </Text>
            <Text style={styles.italic}>
              - consent to the disclosure of personal data
            </Text>
          </View>
        </View>
        <View style={styles.signature}>
          {/* <Text style={styles.text}>З повагою, адвокат</Text>
                    <Text style={styles.text}>(підпис)</Text>
                    <Text style={styles.text}>В.Ф.Строгий</Text> */}
          <Text style={styles.text}>Sincerely, lawyer</Text>
          <Text style={styles.text}>(signature)</Text>
          <Text style={styles.text}>V.F.Strohy</Text>
        </View>
      </Page>
    </Document>
  );
};
