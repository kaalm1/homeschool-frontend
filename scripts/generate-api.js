import { generate } from 'openapi-typescript-codegen';

await generate({
  input: 'http://localhost:8000/openapi.json',
  output: 'src/generated-api',
  client: 'axios',
  useOptions: true,
  exportServices: true,
  separateModelsAndApi: true,
});
