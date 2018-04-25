// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  protocol: "",
  env: "",
  baseHref: "/ang/",
  // oldSigaUrl: 'https://7plus.demo.deloitte.es/SIGA/',
  oldSigaUrl: "http://vmdxdarsap028.cloud.es.deloitte.com/SIGA/",
  newSigaUrl: 'http://localhost:4200/siga-web-0.0.1-SNAPSHOT/'

  //provisional para que isa lo vea
  // newSigaUrl: 'http://vmcgaeap001.cloud.es.deloitte.com:7001/siga-web/'

  //newSigaUrl: "http://localhost:7001/siga-web/"
};
