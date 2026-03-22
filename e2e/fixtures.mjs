export const mockSubjects = {
  'Front-End': [
    { name: 'awesome-react', repo: 'enaqx/awesome-react', cate: 'Front-End' },
    { name: 'awesome-vue', repo: 'vuejs/awesome-vue', cate: 'Front-End' },
  ],
  'Back-End': [
    { name: 'awesome-nodejs', repo: 'sindresorhus/awesome-nodejs', cate: 'Back-End' },
    { name: 'awesome-python', repo: 'vinta/awesome-python', cate: 'Back-End' },
  ],
};

export const AWESOME_JSON_URL = 'https://raw.githubusercontent.com/lockys/awesome.json/master/awesome/awesome.json';
export const mockReadme = '<h1>Awesome Node.js</h1><p>A curated list of Node.js packages.</p>';

export async function mockAwesomeJson(page) {
  await page.route(AWESOME_JSON_URL, (route) =>
    route.fulfill({ json: mockSubjects })
  );
}
