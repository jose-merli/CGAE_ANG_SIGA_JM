// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  protocol: "",
  env: "",
  baseHref: "/ang/",

  //oldSigaUrl: "http://vmcgaeap002.cloud.es.deloitte.com:7001/SIGA/",
  oldSigaUrl: "https://sigaint.redabogacia.org/SIGA/",
  //newSigaUrl: "http://localhost:8280/siga-web-1.1.0-SNAPSHOT/"
  //newSigaUrl: "http://localhost:7001/siga-web/"

  // oldSigaUrl: '/SIGA/',
  newSigaUrl: "http://localhost:8080/siga-web-1.1.0-SNAPSHOT/"
  //newSigaUrl: "https://localhost/siga-web/"

  // newSigaUrl: '/siga-web/'
  
};
