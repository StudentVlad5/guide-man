import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { PageNavigation } from '../components/PageNavigation';

import { ServisesDropdown } from '../components/ServisesDropdown';
import { ServisesButton } from '../components/ServisesButton';
import { getRightData, getRightURL } from '../helpers/rightData';

import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Layout } from '../components/Layout';

import Menu from '../public/menu.svg';
import Control from '../public/control.svg';
import Muto from '../public/muto.svg';
import Ban from '../public/ban.svg';
import Ukr from '../public/ukr.svg';
import Earth from '../public/earth.svg';
import Dep from '../public/dep.svg';
import Leg from '../public/leg.svg';
import Doc from '../public/doc.svg';
import Monitor from '../public/monitor.svg';

import styles from '../styles/servicesPage.module.scss';
import { getCollection } from '../helpers/firebaseControl';

import { BASE_URL } from './sitemap.xml';

export default function Payment() {
  const { t } = useTranslation();
  const { locale, pathname } = useRouter();

  return (
    <Layout
      type="signature page"
      desctiption={`⭐${t("navbar.services")}⭐ ${t("head.home.description")}`}
      h1={t("navbar.services")}
      script={`[
        {
            "@context": "http://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement":
              [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "item":
                  {
                    "@id": "${BASE_URL}",
                    "name": "${t("pageNavigation.main")}"
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "item":
                  {
                    "@id": "${getRightURL(locale, pathname)}",
                    "name": "${t("navbar.services")}"
                  }
                }
              ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": []
          }
        ]`}
    >
      <div className="container">
        <PageNavigation pageType={"servises"} />
      </div>

      <div className="page page-bigBottom">
        <div className="container">
          <div className={styles.servisesPage__content}>
            <h2>Payment</h2>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// export async function getStaticProps({ locale }) {

//   const services = await getCollection('services');
//   return { props: { services,
//     ...await serverSideTranslations(locale, ['common'])
//   },
//   revalidate: 10,
//  };
// };