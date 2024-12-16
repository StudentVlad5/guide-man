import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { PageNavigation } from '../components/PageNavigation';

import { ServisesDropdown } from '../components/ServisesDropdown';
import { ServisesButton } from '../components/ServisesButton';
import { getRightData, getRightURL } from '../helpers/rightData';

import requestsDescription from '../api/requestsDescription.json';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Layout } from '../components/Layout';

import Menu from '../public/menu.svg';
import Ukr from '../public/ukr.svg';
import Earth from '../public/earth.svg';
import Doc from '../public/doc.svg';

import styles from '../styles/servicesPage.module.scss';
import { getCollection } from '../helpers/firebaseControl';

import { BASE_URL } from './sitemap.xml';

export default function LawyersRequests({ requests }) {
  console.log('LawyersRequests ~ requests:', requests);
  const { t } = useTranslation();
  const { locale, pathname } = useRouter();

  const civilRegistryOffices = requests
    .filter(
      request =>
        request.requestType[locale] === t('requests.civilRegistryOffices')
    )
    .map(request => [getRightData(request, locale, 'title'), request.path]);

  const ministryOfInternalAffairs = requests
    .filter(
      request =>
        request.requestType[locale] === t('requests.ministryOfInternalAffairs')
    )
    .map(request => [getRightData(request, locale, 'title'), request.path]);

  const internallyDisplacedPersons = requests
    .filter(
      request =>
        request.requestType[locale] === t('requests.internallyDisplacedPersons')
    )
    .map(request => [getRightData(request, locale, 'title'), request.path]);

  const pensionFund = requests
    .filter(
      request => request.requestType[locale] === t('requests.pensionFund')
    )
    .map(request => [getRightData(request, locale, 'title'), request.path]);

  const ministryOfDefense = requests
    .filter(
      request => request.requestType[locale] === t('requests.ministryOfDefense')
    )
    .map(request => [getRightData(request, locale, 'title'), request.path]);

  const stateMigrationService = requests
    .filter(
      request =>
        request.requestType[locale] === t('requests.stateMigrationService')
    )
    .map(request => [getRightData(request, locale, 'title'), request.path]);

  const [isAllButtons, setIsAllButtons] = useState(false);
  const [filter, setFilter] = useState(t('requests.allRequests'));

  const openAllButtons = () => {
    setIsAllButtons(!isAllButtons);
  };

  const changeFilter = title => {
    setFilter(title);
    openAllButtons();
  };

  useEffect(() => {
    setFilter(t('requests.allRequests'));
  }, [t]);

  return (
    <Layout
      type="requests page"
      desctiption={`⭐${t('requests.button')}⭐ ${t('head.home.description')}`}
      h1={t('requests.button')}
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
                    "name": "${t('pageNavigation.main')}"
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "item":
                  {
                    "@id": "${getRightURL(locale, pathname)}",
                    "name": "${t('requests.button')}"
                  }
                }
              ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              ${requests
                // .filter(el => el.id !== '147406030952')
                .map(el => {
                  return `{
              "@type": "Question",
              "name": "${el.requestType[locale]}: ${getRightData(
                    el,
                    locale,
                    'title'
                  )}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "${
                  getRightData(el, locale, 'text').slice(0, 250) + '...'
                }"
              }
            }`;
                })}
             ]
          }
        ]`}
    >
      <div className="container">
        <PageNavigation />
      </div>

      <div className="page page-bigBottom">
        <div className="container">
          <div className={styles.servisesPage__content}>
            <div className={styles.servisesPage__section}>
              <ServisesButton
                Img={Menu}
                title={filter}
                onClick={openAllButtons}
              />
              {/* {isAllButtons && filter === t('requests.allRequests') && (
                <>
                  <ServisesButton
                    Img={Ukr}
                    title={t('requests.citizens')}
                    onClick={() => changeFilter(t('requests.citizens'))}
                  />
                  <ServisesButton
                    Img={Earth}
                    title={t('requests.foreigners')}
                    onClick={() => changeFilter(t('requests.foreigners'))}
                  />
                </>
              )}

              {isAllButtons && filter === t('requests.foreigners') && (
                <>
                  <ServisesButton
                    Img={Ukr}
                    title={t('services.citizens')}
                    onClick={() => changeFilter(t('requests.citizens'))}
                  />
                  <ServisesButton
                    Img={Menu}
                    title={t('requests.allRequests')}
                    onClick={() => changeFilter(t('requests.allRequests'))}
                  />
                </>
              )}

              {isAllButtons && filter === t('requests.citizens') && (
                <>
                  <ServisesButton
                    Img={Earth}
                    title={t('requests.foreigners')}
                    onClick={() => changeFilter(t('requests.foreigners'))}
                  />
                  <ServisesButton
                    Img={Menu}
                    title={t('requests.allRequests')}
                    onClick={() => changeFilter(t('requests.allRequests'))}
                  />
                </>
              )} */}
            </div>

            <div className={styles.servisesPage__section}>
              <ServisesDropdown
                Img={Doc}
                title={t('requests.civilRegistryOffices')}
                values={civilRegistryOffices}
              />

              <ServisesDropdown
                Img={Doc}
                title={t('requests.ministryOfInternalAffairs')}
                values={ministryOfInternalAffairs}
              />

              {/* {filter !== t('requests.citizens') && ( */}
              <ServisesDropdown
                Img={Doc}
                title={t('requests.internallyDisplacedPersons')}
                values={internallyDisplacedPersons}
              />
              {/* )} */}

              {/* {filter !== t('requests.citizens') && ( */}
              <ServisesDropdown
                Img={Doc}
                title={t('requests.pensionFund')}
                values={pensionFund}
              />
              {/* )} */}
            </div>

            <div className={styles.servisesPage__section}>
              {/* {filter !== t('requests.citizens') && ( */}
              <ServisesDropdown
                Img={Doc}
                title={t('requests.ministryOfDefense')}
                values={ministryOfDefense}
              />
              {/* )} */}

              <ServisesDropdown
                Img={Doc}
                title={t('requests.stateMigrationService')}
                values={stateMigrationService}
              />
            </div>
          </div>

          <div className={styles.ItemPage}>
            <h1 className={`page__title ${styles.itemPage__title}`}>
              {getRightData(requestsDescription, locale, 'title')}
            </h1>
            <article
              className={styles.itemPage__text}
              dangerouslySetInnerHTML={{
                __html: getRightData(requestsDescription, locale, 'text'),
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const requests = await getCollection('requests');
  return {
    props: { requests, ...(await serverSideTranslations(locale, ['common'])) },
    revalidate: 10,
  };
}
