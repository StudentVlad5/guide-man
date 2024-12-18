import { getCollection } from '../helpers/firebaseControl';
import { format } from 'date-fns';
import { BASE_URL } from './sitemap.xml';

const Sitemap_RU = () => {
  return null;
};

export const getServerSideProps = async ({ res }) => {
  const staticPaths = [
    [`${BASE_URL}/ru/about`, 'about'],
    [`${BASE_URL}/ru/chat`, 'chat'],
    [`${BASE_URL}/ru/explanations`, 'explanations'],
    [`${BASE_URL}/ru/`, 'index'],
    [`${BASE_URL}/ru/news`, 'news'],
    [`${BASE_URL}/ru/services`, 'services'],
    [`${BASE_URL}/ru/services/requests`, 'requests'],
  ];

  const news = await getCollection('news');
  const questions = await getCollection('questions');
  const explanations = await getCollection('explanations');
  const services = await getCollection('services');
  const citizenship = await getCollection('citizenship');
  const requests = await getCollection('requests');

  const dynamicPathsNews = news.map(el => {
    return [`${BASE_URL}/ru/news/${el.path}`, el.dateCreating];
  });
  const dynamicPathsQuestions = questions.map(el => {
    return [`${BASE_URL}/ru/questions/${el.path}`, el.dateCreating];
  });
  const dynamicPathsExplanations = explanations.map(el => {
    return [`${BASE_URL}/ru/explanations/${el.path}`, el.dateCreating];
  });
  const dynamicPathsServices = services.map(el => {
    return [`${BASE_URL}/ru/services/${el.path}`, el.dateCreating];
  });
  const dynamicPathsCitizenship = citizenship.map(el => {
    return [`${BASE_URL}/ru/services/citizenship/${el.path}`, el.dateCreating];
  });
  const dynamicPathsRequests = requests.map(el => {
    return [`${BASE_URL}/ru/services/requests/${el.path}`, el.dateCreating];
  });

  const allDinamicPaths = [
    ...dynamicPathsNews,
    ...dynamicPathsQuestions,
    ...dynamicPathsExplanations,
    ...dynamicPathsServices,
    ...dynamicPathsCitizenship,
    ...dynamicPathsRequests,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPaths
      .map(url => {
        const getLastMode = () => {
          switch (url[1]) {
            case 'index':
              return [...explanations, ...questions]
                .map(el => el.dateCreating)
                .sort((a, b) => b - a)[0]
                .split(' ')
                .slice(0, 1)
                .join('');

            case 'services':
              return services
                .map(el => el.dateCreating)
                .sort((a, b) => b - a)[0]
                .split(' ')
                .slice(0, 1)
                .join('');

            case 'requests':
              return requests
                .map(el => el.dateCreating)
                .sort((a, b) => b - a)[0]
                .split(' ')
                .slice(0, 1)
                .join('');

            case 'explanations':
              return explanations
                .map(el => el.dateCreating)
                .sort((a, b) => b - a)[0]
                .split(' ')
                .slice(0, 1)
                .join('');

            case 'news':
              return news
                .map(el => el.dateCreating)
                .sort((a, b) => b - a)[0]
                .split(' ')
                .slice(0, 1)
                .join('');

            case 'questions':
              return questions
                .map(el => el.dateCreating)
                .sort((a, b) => b - a)[0]
                .split(' ')
                .slice(0, 1)
                .join('');

            case 'about':
            case 'chat':
              return format(new Date(), 'yyyy-MM-dd');
          }
        };

        const getChangefreq = () => {
          switch (url[1]) {
            case 'index':
              return 'always';

            case 'services':
            case 'explanations':
            case 'news':
            case 'questions':
              return 'hourly';

            case 'about':
            case 'chat':
              return 'monthly';
          }
        };
        return `<url>
          <loc>${url[0]}</loc>
          <lastmod>${getLastMode()}</lastmod>
          <changefreq>${getChangefreq()}</changefreq>
        </url>`;
      })
      .join('')}
    ${allDinamicPaths
      .map(
        url =>
          `<url>
        <loc>${url[0]}</loc>
        <lastmod>${url[1].split(' ').slice(0, 1).join('')}</lastmod>
        <changefreq>hourly</changefreq>
      </url>`
      )
      .join('')}
  </urlset>
`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap_RU;
