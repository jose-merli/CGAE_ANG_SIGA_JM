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
    menu: "menu",
    entorno: "getEntorno",
    usuario: "usuario",
    usuario_logeado: "usuario/logeado",
    instituciones: "instituciones",
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
    datosGenerales_update: "/personaJuridica/update",
    datosGenerales_insert: "/personaJuridica/create",
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
    busquedaPerJuridica_update: "busquedaPerJuridica/update",
    datosRegistrales_actividadesPersona:
      "perJuridicaDatosRegistrales/actividadProfesionalPer",
    datosRegistrales_actividadesDisponible:
      "perJuridicaDatosRegistrales/actividadProfesional",
    datosRegistrales_search: "perJuridicaDatosRegistrales/search",
    datosRegistrales_update: "perJuridicaDatosRegistrales/update",
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
    retenciones_tipoRetencion: "retenciones/tipoRetencion",
    retenciones_search: "retenciones/search",
    retenciones_update: "retenciones/update",
    integrantes_search: "busquedaPerJuridica/datosIntegrantesSearch",
    integrantes_tipoColegio: "tarjetaIntegrantes/tipoColegio",
    integrantes_provincias: "tarjetaIntegrantes/provincias",
    integrantes_cargos: "tarjetaIntegrantes/cargos"
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
