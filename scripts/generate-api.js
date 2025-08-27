import { generate } from 'openapi-typescript-codegen';

const isProd = process.argv.includes('--prod');

await generate({
  input: isProd
    ? 'https://api.yourdomain.com/openapi.json'
    : 'http://localhost:8000/openapi.json',
  output: 'src/generated-api',
  client: 'axios',
  useOptions: true,
  exportServices: true,
  separateModelsAndApi: true,
});
