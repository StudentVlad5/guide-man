'use client';
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
    page: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 30,
        fontSize: 12,
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 10,
        textAlign: 'center',
    },
    headerTitle: {
        paddingBottom: 10,
        textAlign: 'center',
        borderBottomColor: 'black',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
    },
    sectionTitle: {
        marginBottom: 15,
        padding: 10,
        flexGrow: 1,
        textAlign: 'center',
    },
    section: {
        margin: 5,
        paddingLeft: 20,
        flexGrow: 1,
    },
    address: {
        display: 'flex',
        flexDirection: 'row',
        margin: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    subtitle: {
        fontStyle: 'italic',
    },
    text: {
        fontStyle: 'normal',
        textIndent: 20,
        textAlign: 'justify',
    },
    bold: {
        fontWeight: 'bold',
    },
    appeal: {
        display: 'block',
        fontSize: 18,
        fontWeight: 700,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        margin: 5,
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        margin: 5,
        paddingLeft: 20,
    },
    apps: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        margin: 5,
        paddingLeft: 20,
    },
    signature: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
    },
});

// PDF Document Component
const data = {
    lawyer: {
        name: 'ЗАКУТЬКО КАТЕРИНА ЕДУАРДІВНА',
        initials: 'К.Е. Закутько',
        tel: '0661972832',
        email: 'ekaterinazakutko@ukr.net',
        certificate: 'Nº002201 від 07 березня 2018 року',
    },
    number: 'Nº01/11-02-22',
    date: 'від 11 лютого 2022 р.',
    recipient: {
        name: 'Державна прикордонна служба',
        address: 'вул. Володимирська, 26, м. Київ, 01601',
    },
    client: {
        name: 'DONOUKIS EVGENIOS',
        birthday: '04.12.1975',
        passport: 'серії AN Nº 6945129',
    },
};

// export const LawyersRequest = ({ data }) => {
export const LawyersRequest = () => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerTitle}>
                    <Text style={styles.title}>АДВОКАТ</Text>
                    <br />
                    <Text style={styles.title}>{data.lawyer.name}</Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>
                        моб.тел. {data.lawyer.tel}, ел.пошта:{data.lawyer.email}
                        , свідоцтво {data.lawyer.certificate}
                    </Text>
                </View>
                <View style={styles.address}>
                    <View style={styles.section}>
                        <Text style={styles.bold}>{data.number}</Text> <br />
                        <Text style={styles.bold}>{data.date}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.bold}>{data.recipient.name}</Text>
                        <br />
                        <Text style={styles.text}>
                            {data.recipient.address}
                        </Text>
                    </View>
                </View>
                <View style={styles.sectionTitle}>
                    <Text style={styles.title}>АДВОКАТСЬКИЙ ЗАПИТ</Text> <br />
                    <Text style={styles.subtitle}>
                        (в порядку статей 20, 24 Закону України «Про адвокатуру
                        та адвокатську діяльність»)
                    </Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.text}>
                        Я здійсною представництво інтересів громадянина Греції{' '}
                        {data.client.name}, {data.client.birthday} року
                        народження.
                    </Text>
                    <Text style={styles.text}>
                        03 грудня 2021 року прийняте рішення Nº 3 про відмову в
                        перетинанні державного кордону України іноземцю або
                        особі без громадянства з причини того, що у{' '}
                        {data.client.name} заборона вʼїзду.
                    </Text>
                    <Text style={styles.text}>
                        З метою захисту законних прав та інтересів клієнта та
                        керуючись ст. 24 Закону України «Про адвокатуру та
                        адвокатську діяльність»,
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.appeal}>ПРОШУ:</Text>
                    <View style={styles.list}>
                        <Text style={styles.item}>
                            1. Надати мені відомості про те, чи існує на цей час
                            заборона вʼїзду в Україну громадянину Греції{' '}
                            {data.client.name}, {data.client.birthday} року
                            народження, паспорт серії {data.client.passport}.
                            Якщо так, то прошу повідомити на якій підставі
                            заборонено вʼїзд в Україну.
                        </Text>
                    </View>

                    <Text style={styles.text}>
                        Відповідь на запит прошу надати мені протягом пʼяти
                        робочих днів, надіславши її на електронну пошту:
                        {data.lawyer.email} (засоби зв’язку: т.{' '}
                        {data.lawyer.tel}).
                    </Text>
                </View>
                <View style={styles.apps}>
                    <Text style={styles.text}>Додатки:</Text>
                    <Text style={styles.text}>
                        1. Копія свідоцтва про право на заняття адвокатською
                        діяльністю.
                    </Text>
                    <Text style={styles.text}>2. Копія ордера.</Text>
                </View>
                <View style={styles.signature}>
                    <Text style={styles.bold}>З повагою, адвокат</Text>
                    <Text style={styles.text}>(підпис)</Text>
                    <Text style={styles.text}>{data.lawyer.initials}</Text>
                </View>
            </Page>
        </Document>
    );
};

// ReactPDF.render(LawyersRequest);
