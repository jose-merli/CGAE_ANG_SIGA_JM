import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpResponse,
  HttpParams,
  HttpResponseBase,
  HttpHeaders,
  HttpBackend
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import "rxjs/add/operator/map";
import { environment } from "../../environments/environment";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { RequestOptions, Headers } from "@angular/http";
import { Subject } from "rxjs/Subject";

@Injectable()
export class SigaServices {
  items: MenuItem[];
  endpoints = {
    testDb: "db",
    login: "login",
    loginDevelop: "loginDevelop",
    validaInstitucion: "validaInstitucion",
    menu: "menu",
    entorno: "getEntorno",
    usuario: "usuario",
    usuario_logeado: "usuario/logeado",
    instituciones: "instituciones",
    institucionActual: "getInstitucionActual",
    perfiles: "perfiles",
    diccionarios: "diccionarios",
    usuarios_rol: "usuarios/rol",
    usuarios_perfil: "usuarios/perfil",
    usuarios_search: "usuarios/search",
    usuarios_delete: "usuarios/delete",
    usuarios_update: "usuarios/update",
    usuarios_insert: "usuarios/create",
    maestros_search: "catmaestros/search",
    maestros_rol: "catmaestros/tabla",
    maestros_update: "catmaestros/update",
    maestros_create: "catmaestros/create",
    maestros_delete: "catmaestros/delete",
    maestros_historico: "catmaestros/historico",
    parametros_modulo: "parametros/modulo",
    parametros_search: "parametros/search",
    parametros_delete: "parametros/delete",
    parametros_update: "parametros/update",
    parametros_historico: "parametros/historico",
    etiquetas_lenguaje: "etiquetas/lenguaje",
    etiquetas_lenguajeFiltrado: "etiquetas/lenguajeFiltrado",
    etiquetas_search: "etiquetas/search",
    etiquetas_update: "etiquetas/update",
    contadores_search: "contadores/search",
    contadores_update: "contadores/update",
    contadores_modo: "contadores/mode",
    contadores_module: "contadores/module",
    perfiles_search: "usuariosgrupos/search",
    perfiles_historico: "usuariosgrupos/historico",
    perfiles_delete: "usuariosgrupos/delete",
    perfiles_update: "usuariosgrupos/update",
    perfiles_insert: "usuariosgrupos/create",
    perfiles_default: "usuariosgrupos/updateGrupoDefecto",
    permisos_tree: "permisos",
    catalogos_lenguage: "catalogos/lenguaje",
    catalogos_entidad: "catalogos/entidad",
    catalogos_search: "catalogos/search",
    catalogos_update: "catalogos/update",
    auditoriaUsuarios_tipoAccion: "auditoriaUsuarios/tipoAccion",
    auditoriaUsuarios_search: "auditoriaUsuarios/search",
    auditoriaUsuarios_update: "auditoriaUsuarios/update",
    permisos_update: "permisos/update",
    acces_control: "/accesControl",
    entidad_lenguajeInstitucion: "entidad/lenguajeInstitucion",
    entidad_lenguaje: "entidad/lenguaje",
    entidad_uploadFile: "entidad/uploadFile",
    entidad_uploadLenguage: "entidad/uploadLenguage",
    header_logo: "/header/logo",
    busquedaPerJuridica_tipo: "busquedaPerJuridica/tipoSociedad",
    busquedaPerJuridica_etiquetas: "busquedaPerJuridica/etiquetas",
    busquedaPerJuridica_search: "busquedaPerJuridica/search",
    busquedaPerJuridica_delete: "busquedaPerJuridica/delete",
    busquedaPerJuridica_history: "busquedaPerJuridica/searchHistoric",
    busquedaPerJuridica_parametroColegio:
      "busquedaPerJuridica/parametroColegio",
    datosGenerales_update: "personaJuridica/update",
    datosGenerales_insert: "personaJuridica/create",
    datosGenerales_identificacion: "DatosGenerales/identificacion",
    busquedaPer_colegio: "busquedaPer/colegio",
    busquedaPer_searchJuridica: "busquedaPerJuridica/searchJuridica",
    busquedaPer_searchFisica: "busquedaPerJuridica/searchFisica",
    busquedaPerJuridica_etiquetasPersona:
      "busquedaPerJuridica/etiquetasPersona",
    personaJuridica_uploadFotografia: "personaJuridica/uploadFotografia",
    personaJuridica_cargarFotografia: "personaJuridica/cargarFotografia",
    busquedaPerJuridica_datosGeneralesSearch:
      "busquedaPerJuridica/datosGeneralesSearch",
    busquedaPerJuridica_create: "busquedaPerJuridica/create",
    accesoFichaPersona_search: "fichaPersona/search",
    accesoFichaPersona_desasociarPersona: "fichaPersona/desasociarPersona",
    accesoFichaPersona_guardar: "fichaPersona/guardar",
    fichaPersona_crearNotario: "fichaPersona/crearNotario",
    fichaPersona_tipoIdentificacionCombo:
      "fichaPersona/tipoIdentificacionCombo",
    busquedaPerJuridica_update: "busquedaPerJuridica/update",
    datosRegistrales_actividadesPersona:
      "perJuridicaDatosRegistrales/actividadProfesionalPer",
    datosRegistrales_actividadesDisponible:
      "perJuridicaDatosRegistrales/actividadProfesional",
    datosRegistrales_search: "perJuridicaDatosRegistrales/search",
    datosRegistrales_update: "perJuridicaDatosRegistrales/update",
    datosRegistrales_datosContador: "perJuridicaDatosRegistrales/datosContador",
    datosBancarios_search: "busquedaPerJuridica/datosBancariosSearch",
    datosBancarios_delete: "busquedaPerJuridica/datosBancariosDelete",
    datosCuentaBancaria_search:
      "busquedaPerJuridica/datosBancariosGeneralSearch",
    datosCuentaBancaria_update: "busquedaPerJuridica/datosBancariosUpdate",
    datosCuentaBancaria_insert: "busquedaPerJuridica/datosBancariosInsert",
    datosCuentaBancaria_BIC_BANCO: "busquedaPerJuridica/BanksSearch",
    datosMandatos_search: "busquedaPerJuridica/MandatosSearch",
    datosMandatos_insert: "busquedaPerJuridica/mandatosInsert",
    datosMandatos_comboEsquema: "busquedaPerJuridica/comboEsquema",
    anexos_search: "busquedaPerJuridica/AnexosSearch",
    anexos_update: "busquedaPerJuridica/updateAnexos",
    anexos_insert: "busquedaPerJuridica/insertAnexos",
    busquedaPerJuridica_uploadFile: "busquedaPerJuridica/uploadFile",
    busquedaPerJuridica_fileDownloadInformation:
      "busquedaPerJuridica/fileDownloadInformation",
    busquedaPerJuridica_downloadFile: "busquedaPerJuridica/downloadFile",
    retenciones_tipoRetencion: "retenciones/tipoRetencion",
    retenciones_search: "retenciones/search",
    retenciones_update: "retenciones/update",
    integrantes_search: "busquedaPerJuridica/datosIntegrantesSearch",
    integrantes_tipoColegio: "tarjetaIntegrantes/tipoColegio",
    integrantes_provincias: "tarjetaIntegrantes/provincias",
    integrantes_provinciaColegio: "tarjetaIntegrantes/provinciaColegio",
    integrantes_cargos: "tarjetaIntegrantes/cargos",
    direcciones_search: "busquedaPerJuridica/datosDireccionesSearch",
    direcciones_update: "tarjetaDirecciones/update",
    direcciones_insert: "tarjetaDirecciones/create",
    direcciones_remove: "tarjetaDirecciones/delete",
    direcciones_codigoPostal: "",
    direcciones_comboPoblacion: "tarjetaDirecciones/poblacion",
    direcciones_comboPais: "tarjetaDirecciones/pais",
    direcciones_comboTipoDireccion: "tarjetaDirecciones/tipoDireccion",
    integrantes_update: "tarjetaIntegrantes/update",
    integrantes_insert: "tarjetaIntegrantes/create",
    integrantes_delete: "tarjetaIntegrantes/delete",
    usuario_cambioIdioma: "usuario/cambioIdioma",
    fichaColegialOtrasColegiaciones_searchOtherCollegues:
      "fichaColegialOtrasColegiaciones/searchOtherCollegues",
    fichaColegialOtrasColegiaciones_getLabelColegios:
      "fichaColegialOtrasColegiaciones/getLabelColegios",
    enviosMasivos: 'enviosMasivos/enviosMasivos',
    enviosMasivos_search: 'enviosMasivos/search',
    enviosMasivos_estado: 'enviosMasivos/estadoEnvios',
    enviosMasivos_tipo: 'enviosMasivos/tipoEnvios',
    enviosMasivos_programar: 'enviosMasivos/programarEnvio',
    enviosMasivos_cancelar: 'enviosMasivos/cancelarEnvio',
    enviosMasivos_plantillas: 'enviosMasivos/detalle/plantillas',
    enviosMasivos_guardarConf: 'enviosMasivos/detalle/guardarConfiguracion',
    enviosMasivos_documentos: 'enviosMasivos/detalle/documentosEnvio',
    enviosMasivos_duplicar: 'enviosMasivos/detalle/duplicarEnvio ',
    enviosMasivos_etiquetas: 'enviosMasivos/detalle/etiquetas',
    enviosMasivos_etiquetasEnvio: 'enviosMasivos/detalle/etiquetasEnvio ',
    enviosMasivos_guardarEtiquetas: 'enviosMasivos/detalle/guardarEtiquetas',
    enviosMasivos_subirDocumento: 'enviosMasivos/detalle/subirDocumento',
    consultas_claseComunicaciones: 'consultas/claseComunicacion',
    enviosMasivos_guardarDocumento: 'enviosMasivos/detalle/guardarDocumentoEnvio',
    enviosMasivos_borrarDocumento: 'enviosMasivos/detalle/borrarDocumentoEnvio',
    enviosMasivos_descargarDocumento: 'enviosMasivos/detalle/descargarDocumento',
    consultas_comboObjetivos: 'consultas/objetivo',
    consultas_comboModulos: 'consultas/modulo',
    comunicaciones_claseComunicaciones: 'comunicaciones/clasesComunicacion',
    comunicaciones_search: 'comunicaciones/search',
    comunicaciones_guardarConf: 'comunicaciones/detalle/configuracion',
    comunicaciones_destinatarios: 'comunicaciones/detalle/destinatarios',
    consultas_search: 'consultas/search',
    consultas_borrar: 'consultas/borrarConsulta',
    consultas_listadoPlantillas: 'consultas/plantillasconsulta',
    consultas_guardarDatosGenerales: 'consultas/confGeneral',
    consultas_guardarConsulta: 'consultas/confConsulta',
    consultas_listadoModelos: 'consultas/modelosconsulta',
    consultas_ejecutarConsulta: 'consultas/ejecutarConsulta',
    plantillasEnvio_search: 'plantillasEnvio/plantillasEnvioSearch',
    plantillasEnvio_guardarDatosGenerales: 'plantillasEnvio/datosGenerales',
    modelos_search: 'modelos/search',
    modelos_search_historico: 'modelos/search/historico',
    modelos_duplicar: 'modelos/duplicar',
    modelos_borrar: 'modelos/borrar',
    modelos_detalle_datosGenerales: 'modelos/detalle/datosGenerales',
    modelos_detalle_perfiles: 'modelos/detalle/perfiles',
    modelos_detalle_perfilesModelo: 'modelos/detalle/perfilesModelo',
    modelos_detalle_guardarPerfiles: 'modelos/detalle/guardarPerfiles',
    modelos_detalle_informes: 'modelos/detalle/informes',
    modelo_detalle_informes: 'modelos/detalle/informes',
    modelos_detalle_plantillasEnvio: 'modelos/detalle/plantillasEnvio',
    modelos_detalle_plantillasHist: 'modelos/detalle/plantillasEnvioHist',
    modelos_detalle_borrarPlantilla: 'modelos/detalle/borrarPlantillaEnvio',
    modelos_detalle_guardarPlantilla: 'modelos/detalle/guardarPlantillaEnvio',

    plantillasEnvio_consultas: 'plantillasEnvio/consultasPlantillas',
    plantillasEnvio_borrar: 'plantillasEnvio/borrarPlantilla',
    plantillasEnvio_comboConsultas: 'plantillasEnvio/consultasDisp',
    plantillasEnvio_finalidadConsulta: 'plantillasEnvio/finalidadConsulta',
    plantillasEnvio_asociarConsulta: 'plantillasEnvio/asociarConsulta',

    plantillasEnvio_desaociarConsulta: 'plantillasEnvio/desasociarConsulta',
    plantillasEnvio_detalleRemitente: 'plantillasEnvio/detalleRemitente',
    plantillasEnvio_personaDireccion: 'plantillasEnvio/personaYdirecciones',
    plantillasEnvio_guardarRemitente: 'plantillasEnvio/guardarRemitente',

    plantillasDoc_combo_consultas: 'plantillasDoc/combo/consultas',
    plantillasDoc_combo_formatos: 'plantillasDoc/combo/formatos',
    plantillasDoc_combo_sufijos: 'plantillasDoc/combo/sufijos',
    plantillasDoc_consultas_guardar: 'plantillasDoc/consultas/guardar',
    plantillasDoc_consultas_borrar: 'plantillasDoc/consultas/borrar',
    plantillasDoc_consultas: 'plantillasDoc/consultas',
    plantillasDoc_consultas_historico: 'plantillasDoc/consultas/historico',
    plantillasDoc_plantillas: 'plantillasDoc/plantillas',
    plantillasDoc_guardar: 'plantillasDoc/guardar',
    plantillasDoc_insertarPlantilla: 'plantillasDoc/insertarPlantilla',
    plantillasDoc_subirPlantilla: 'plantillasDoc/subirPlantilla',

  };

  private menuToggled = new Subject<any>();
  menuToggled$ = this.menuToggled.asObservable();
  constructor(
    private http: HttpClient,
    handler: HttpBackend,
    private httpbackend: HttpClient
  ) {
    this.httpbackend = new HttpClient(handler);
  }

  get(service: string): Observable<any> {
    return this.http
      .get(environment.newSigaUrl + this.endpoints[service])
      .map(response => {
        return response;
      });
  }

  getParam(service: string, body: any): Observable<any> {
    return this.http
      .get(environment.newSigaUrl + this.endpoints[service] + body)
      .map(response => {
        return response;
      });
  }

  getBackend(service: string): Observable<any> {
    return this.httpbackend
      .get(environment.newSigaUrl + this.endpoints[service])
      .map(response => {
        return response;
      });
  }

  getNewSigaUrl() {
    return environment.newSigaUrl;
  }

  getServucePath(service: string) {
    return this.endpoints[service];
  }

  getPerfil(service: string, institucion: string): Observable<any> {
    return this.httpbackend
      .get(
        environment.newSigaUrl +
        this.endpoints[service] +
        "?institucion=" +
        institucion
      )
      .map(response => {
        return response;
      });
  }

  post(service: string, body: any): Observable<any> {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], body, {
        headers: headers,
        observe: "response",
        responseType: "text"
      })
      .map(response => {
        return response;
      });
  }

  postDownloadFiles(service: string, body: any): Observable<any> {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], body, {
        headers: headers,
        observe: "body", // si observe: "response" no sirve. Si se quita el observe sirve
        responseType: "blob"
      })
      .map(response => {
        return response;
      });
  }

  postSendContent(service: string, file: any): Observable<any> {
    let formData: FormData = new FormData();
    if (file != undefined) {
      formData.append("uploadFile", file, file.name);
    }
    let headers = new HttpHeaders();

    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");

    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], formData, {
        headers: headers
      })
      .map(response => {
        return response;
      });
  }

  postSendFileAndParameters(
    service: string,
    file: any,
    idPersona: any
  ): Observable<any> {
    let formData: FormData = new FormData();
    if (file != undefined) {
      formData.append("uploadFile", file, file.name);
    }

    // pasar parametros por la request
    formData.append("idPersona", idPersona);

    let headers = new HttpHeaders();

    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");

    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], formData, {
        headers: headers
      })
      .map(response => {
        return response;
      });
  }

  postSendFileAndParametersDataBank(
    service: string,
    file: any,
    idPersona: any,
    idCuenta: any,
    idMandato: any,
    idAnexo: any,
    tipoMandato: any
  ): Observable<any> {
    let formData: FormData = new FormData();
    if (file != undefined) {
      formData.append("uploadFile", file, file.name);
    }

    // pasar parametros por la request
    formData.append("idPersona", idPersona);
    formData.append("idCuenta", idCuenta);
    formData.append("idMandato", idMandato);
    formData.append("idAnexo", idAnexo);
    formData.append("tipoMandato", tipoMandato);

    let headers = new HttpHeaders();

    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");

    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], formData, {
        headers: headers
      })
      .map(response => {
        return response;
      });
  }

  postPaginado(service: string, param: string, body: any): Observable<any> {
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    return this.http
      .post(environment.newSigaUrl + this.endpoints[service] + param, body, {
        headers: headers,
        observe: "response",
        responseType: "text"
      })
      .map(response => {
        return response;
      });
  }

  notifyMenuToggled() {
    this.menuToggled.next();
  }
}
