import { PageNavigation } from "../components/PageNavigation";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "../components/Layout";
import { useTranslation } from "next-i18next";

// import styles from "../styles/newsPage.module.scss";
import { getCollection } from "../helpers/firebaseControl";

import { BASE_URL } from "./sitemap.xml";
import { useRouter } from "next/router";
import { getRightURL } from "../helpers/rightData";
import SignDocumentForm from "../components/SignDocumentForm";
import StartOAuthFlow from "../components/StartOAuthFlow";

export default function SigninPDF() {
  const { t } = useTranslation();
  const { locale, pathname } = useRouter();

  return (
    <Layout
      type="service page"
      desctiption={`⭐${t("navbar.news")}⭐ ${t("head.home.description")}`}
      h1={t("navbar.news")}
      script={`
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
                    "name": "${t("navbar.news")}"
                  }
                }
              ]
          }`}
    >
      <div className="container">
        <PageNavigation />
      </div>

      <div className="page page-bigBottom">
        <div className="container">
          <StartOAuthFlow/>
          <SignDocumentForm />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: { ...(await serverSideTranslations(locale, ["common"])) },
    revalidate: 10,
  };
}
