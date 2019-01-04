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
import { RequestOptions, Headers, ResponseContentType } from "@angular/http";
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
    busquedaPerJuridica_informacionEtiqueta:
      "/busquedaPerJuridica/informacionEtiqueta",
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
    accesoFichaPersona_searchPersona: "fichaPersona/searchPersona",
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

    datosCuentaBancaria_insert: "fichaDatosBancarios/datosBancariosInsert",
    datosCuentaBancaria_BIC_BANCO: "fichaDatosBancarios/BanksSearch",
    datosMandatos_search: "fichaDatosBancarios/MandatosSearch",
    datosMandatos_insert: "fichaDatosBancarios/mandatosInsert",
    datosMandatos_comboEsquema: "fichaDatosBancarios/comboEsquema",
    anexos_search: "fichaDatosBancarios/AnexosSearch",
    anexos_update: "fichaDatosBancarios/updateAnexos",
    anexos_insert: "fichaDatosBancarios/insertAnexos",
    datosCuentaBancaria_getLengthCodCountry:
      "busquedaPerJuridica/getLengthCodCountry",
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
    // censoII

    fichaDatosDirecciones_datosDireccionesSearch:
      "fichaDatosDirecciones/datosDireccionesSearch",
    busquedaColegiados_situacion: "busquedaColegiados/situacion",
    busquedaColegiados_estadoCivil: "busquedaColegiados/estadoCivil",
    busquedaColegiados_categoriaCurricular:
      "busquedaColegiados/categoriaCurricular",
    busquedaColegiados_poblacion: "/busquedaColegiados/poblacion",
    busquedaColegiados_provincias: "busquedaColegiados/provincias",
    busquedaColegiados_tipoDireccion: "busquedaColegiados/tipoDireccion",
    busquedaColegiados_searchColegiado: "/busquedaColegiado/searchColegiado",
    busquedaColegiado_etiquetas: "/busquedaColegiado/etiquetas",
    busquedaNoColegiados_estadoCivil: "/busquedaNoColegiados/estadoCivil",
    busquedaNoColegiados_provincias: "/busquedaNoColegiados/provincias",
    busquedaNoColegiados_poblacion: "/busquedaNoColegiados/poblacion",
    busquedaNoColegiados_tipoDireccion: "/busquedaNoColegiados/tipoDireccion",
    busquedaNoColegiados_categoriaCurricular:
      "/busquedaNoColegiados/categoriaCurricular",
    busquedaNoColegiados_searchNoColegiado:
      "/busquedaNocolegiado/searchNoColegiado",
    busquedaNocolegiado_deleteNoColegiado:
      "/busquedaNocolegiado/deleteNoColegiado",
    busquedaNoColegiados_searchHistoric: "busquedaNocolegiado/searchHistoric",
    solicitudIncorporacion_tipoSolicitud:
      "/solicitudIncorporacion/tipoSolicitud",
    solicitudIncorporacion_estadoSolicitud:
      "/solicitudIncorporacion/estadoSolicitud",
    solicitudIncorporacion_searchSolicitud:
      "/solicitudIncorporacion/searchSolicitud",

    fichaColegialGenerales_tratamiento: "fichaDatosGenerales/tratamiento",
    fichaColegialGenerales_estadoCivil: "fichaDatosGenerales/estadoCivil",
    fichaColegialGenerales_pais: "fichaDatosColegiales/pais",
    fichaDatosCurriculares_search: "fichaDatosCurriculares/search",
    solicitudIncorporacion_tratamiento: "solicitudIncorporacion/tratamiento",
    solicitudIncorporacion_estadoCivil: "solicitudIncorporacion/estadoCivil",
    solicitudIncorporacion_pais: "solicitudIncorporacion/pais",
    solicitudIncorporacion_tipoIdentificacion:
      "solicitudIncorporacion/tipoIdentificacion",
    solicitudIncorporacion_tipoColegiacion:
      "solicitudIncorporacion/tipoColegiacion",
    solicitudIncorporacion_modalidadDocumentacion:
      "solicitudIncorporacion/modalidadDocumentacion",
    solicitudIncorporacion_nuevaSolicitud:
      "solicitudIncorporacion/nuevaSolicitud",
    solicitudIncorporacion_aprobarSolicitud:
      "solicitudIncorporacion/aprobarSolicitud",
    solicitudIncorporacion_denegarSolicitud:
      "solicitudIncorporacion/denegarSolicitud",
    fichaDatosBancarios_datosBancariosSearch:
      "fichaDatosBancarios/datosBancariosSearch",
    fichaDatosColegiales_tipoSeguro: "fichaDatosColegiales/tipoSeguro",
    fichaDatosGenerales_Update: "fichaDatosGenerales/datosGeneralesUpdate",
    fichaDatosGenerales_CreateNoColegiado:
      "fichaDatosGenerales/datosGeneralesCreateNoColegiado",
    cargaMasivaDatosCurriculares_generateExcelCV:
      "cargaMasivaDatosCurriculares/generateExcelCV",
    cargaMasivaDatosCurriculares_uploadFile:
      "cargaMasivaDatosCurriculares/uploadFile",
    cargaMasivaDatosCurriculares_searchCV:
      "cargaMasivaDatosCurriculares/searchCV",
    cargaMasivaDatosCurriculares_downloadOriginalFile:
      "cargaMasivaDatosCurriculares/downloadOriginalFile",
    cargaMasivaDatosCurriculares_downloadLogFile:
      "cargaMasivaDatosCurriculares/downloadLogFile",
    cargasMasivas_descargarEtiquetas: "cargasMasivas/descargarEtiquetas",
    cargasMasivas_searchEtiquetas: "cargasMasivas/searchEtiquetas",
    cargasMasivasEtiquetas_uploadFile: "cargasMasivasEtiquetas/uploadFile",
    cargasMasivas_downloadOriginalFile: "cargasMasivas/downloadOriginalFile",
    cargasMasivas_downloadLogFile: "cargasMasivas/downloadLogFile",

    //Formación
    busquedaCursos_visibilidadCursos: "busquedaCursos/visibilidadCursos",
    busquedaCursos_estadosCursos: "busquedaCursos/estadosCursos",
    busquedaCursos_temasCursos: "busquedaCursos/temasCursos",
    busquedaCursos_search: "busquedaCursos/search",
    busquedaCursos_archivar: "busquedaCursos/archivar",
    busquedaCursos_desarchivar: "busquedaCursos/desarchivar",
    fichaCursos_getRolesTrainers: "fichaCursos/getRolesTrainers",
    fichaCursos_getTypeCostTrainers: "fichaCursos/getTypeCostTrainers",
    fichaCursos_updateTrainersCourse: "fichaCursos/updateTrainersCourse",
    fichaCursos_saveTrainersCourse: "fichaCursos/saveTrainersCourse",
    fichaCursos_getSessionsCourse: "fichaCursos/getSessionsCourse",
    fichaCursos_saveCourse: "fichaCursos/saveCourse",
    fichaCursos_updateCourse: "fichaCursos/updateCourse",
    fichaCursos_releaseOrAnnounceCourse: "fichaCursos/releaseOrAnnounceCourse",
    fichaCursos_searchCourse: "fichaCursos/searchCourse",
    fichaCursos_getServicesCourse: "fichaCursos/getServicesCourse",
    fichaCursos_getServicesSpecificCourse:
      "fichaCursos/getServicesSpecificCourse",
    fichaCursos_getCountIncriptions: "fichaCursos/getCountIncriptions",
    fichaCursos_downloadTemplateFile: "fichaCursos/downloadTemplateFile",
    fichaCursos_uploadFile: "fichaCursos/uploadFile",
    fichaCursos_getMassiveLoadInscriptions:
      "fichaCursos/getMassiveLoadInscriptions",

    busquedaInscripciones_estadosInscripciones:
      "busquedaInscripciones/estadosInscripciones",
    busquedaInscripciones_search: "busquedaInscripciones/search",
    busquedaInscripciones_calificacionesEmitidas:
      "busquedaInscripciones/calificacionesEmitidas",
    busquedaInscripciones_updateEstado: "busquedaInscripciones/updateEstado",
    busquedaInscripciones_updateCalificacion:
      "busquedaInscripciones/updateCalificacion",
    busquedaInscripciones_searchPersona: "busquedaInscripciones/searchPersona",
    busquedaInscripciones_isAdministrador:
      "busquedaInscripciones/isAdministrador",

    //Agenda
    fichaCalendario_getCalendarType: "fichaCalendario/getCalendarType",
    fichaCalendario_profiles: "fichaCalendario/profiles",
    fichaCalendario_updatePermissions: "fichaCalendario/updatePermissions",
    fichaCalendario_saveCalendar: "fichaCalendario/saveCalendar",
    fichaCalendario_updateCalendar: "fichaCalendario/updateCalendar",
    fichaCalendario_getCalendar: "fichaCalendario/getCalendar",
    fichaCalendario_getProfilesPermissions:
      "fichaCalendario/getProfilesPermissions",
    fichaCalendario_getCalendarNotifications:
      "fichaCalendario/getCalendarNotifications",
    fichaCalendario_deleteNotification: "fichaCalendario/deleteNotification",
    fichaCalendario_getHistoricCalendarNotifications:
      "fichaCalendario/getHistoricCalendarNotifications",
    fichaEventos_getTrainersLabels: "fichaEventos/getTrainersLabels",
    fichaEventos_downloadTemplateFile: "fichaEventos/downloadTemplateFile",
    fichaEventos_getCalendars: "fichaEventos/getCalendars",
    fichaEventos_getTypeEvent: "fichaEventos/getTypeEvent",
    fichaEventos_getEventStates: "fichaEventos/getEventStates",
    fichaEventos_getRepeatEvery: "fichaEventos/getRepeatEvery",
    fichaEventos_getDaysWeek: "fichaEventos/getDaysWeek",
    fichaEventos_saveEventCalendar: "fichaEventos/saveEventCalendar",
    fichaEventos_updateEventCalendar: "fichaEventos/updateEventCalendar",
    fichaEventos_deleteEvent: "fichaEventos/deleteEventCalendar",
    fichaEventos_getJudicialDistrict: "fichaEventos/getJudicialDistrict",
    fichaEventos_getEventNotifications: "fichaEventos/getEventNotifications",
    fichaEventos_getHistoricEventNotifications:
      "fichaEventos/getHistoricEventNotifications",
    fichaEventos_searchEvent: "fichaEventos/searchEvent",
    fichaCursos_getTrainersCourse: "fichaCursos/getTrainersCourse",
    fichaCursos_deleteTrainersCourse: "fichaCursos/deleteTrainersCourse",
    fichaCursos_deleteInscriptionsCourse:
      "fichaCursos/deleteInscriptionsCourse",
    fichaCursos_autovalidateInscriptionsCourse:
      "fichaCursos/autovalidateInscriptionsCourse",
    fichaCursos_getTopicsCourse: "fichaCursos/getTopicsCourse",
    fichaCursos_getTopicsSpecificCourse: "fichaCursos/getTopicsSpecificCourse",
    datosNotificaciones_getTypeNotifications:
      "datosNotificaciones/getTypeNotifications",
    datosNotificaciones_getMeasuredUnit: "datosNotificaciones/getMeasuredUnit",
    datosNotificaciones_saveNotification:
      "datosNotificaciones/saveNotification",
    datosNotificaciones_updateNotification:
      "datosNotificaciones/updateNotification",
    datosNotificaciones_getTypeWhere: "datosNotificaciones/getTypeWhere",
    datosNotificaciones_getTemplates: "datosNotificaciones/getTemplates",
    datosNotificaciones_getTypeSend: "datosNotificaciones/getTypeSend",

    fichaColegialSociedades_searchSocieties:
      "fichaColegialSociedades/searchSocieties",
    fichaColegialOtrasColegiaciones_searchOtherCollegues:
      "fichaColegialOtrasColegiaciones/searchOtherCollegues",
    fichaDatosGenerales_partidoJudicialSearch:
      "/fichaDatosGenerales/partidoJudicialSearch",
    fichaDatosColegiales_datosColegialesSearch:
      "/fichaDatosColegiales/datosColegialesSearch",
    fichaColegialColegiales_search:
      "fichaDatosColegiales/searchDatosColegiales",
    alterMutua_estadoSolicitud: "alterMutua/estadoSolicitud",
    alterMutua_estadoColegiado: "alterMutua/estadoColegiado",
    alterMutua_propuestas: "alterMutua/propuestas",
    alterMutua_tarifaSolicitud: "alterMutua/tarifaSolicitud",
    alterMutua_solicitudAlter: "alterMutua/solicitudAlter",
    mutualidad_getEnums: "mutualidad/enums",
    solicitudModificacion_tipoModificacion:
      "solicitudModificacion/tipoModificacion",
    solicitudModificacion_estado: "solicitudModificacion/estado",
    // Solicitud Modificacion
    // GENERAL
    solicitudModificacion_searchModificationRequest:
      "solicitudModificacion/searchModificationRequest",
    solicitudModificacion_processGeneralModificationRequest:
      "solicitudModificacion/processGeneralModificationRequest",
    solicitudModificacion_denyGeneralModificationRequest:
      "solicitudModificacion/denyGeneralModificationRequest",
    solicitudModificacion_insertGeneralModificationRequest:
      "solicitudModificacion/insertGeneralModificationRequest",
    // ESPECÍFICA
    solicitudModificacion_searchSolModif:
      "solicitudModificacion/searchSolModif",
    solicitudModificacion_processSolModif:
      "solicitudModificacion/processSolModif",
    solicitudModificacion_denySolModif: "solicitudModificacion/denySolModif",
    solicitudModificacion_searchSolModifDatosBancarios:
      "solicitudModificacion/searchSolModifDatosBancarios",
    solicitudModificacion_searchDatosBancariosDetail:
      "solicitudModificacion/searchDatosBancariosDetail",
    solicitudModificacion_searchSolModifDatosBancariosDetail:
      "solicitudModificacion/searchSolModifDatosBancariosDetail",
    solicitudModificacion_processSolModifDatosBancarios:
      "solicitudModificacion/processSolModifDatosBancarios",
    solicitudModificacion_denySolModifDatosBancarios:
      "solicitudModificacion/denySolModifDatosBancarios",
    solicitudModificacion_searchSolModifDatosCurriculares:
      "solicitudModificacion/searchSolModifDatosCurriculares",
    solicitudModificacion_searchDatosCurricularesDetail:
      "solicitudModificacion/searchDatosCurricularesDetail",
    solicitudModificacion_searchSolModifDatosCurricularesDetail:
      "solicitudModificacion/searchSolModifDatosCurricularesDetail",
    solicitudModificacion_processSolModifDatosCurriculares:
      "solicitudModificacion/processSolModifDatosCurriculares",
    solicitudModificacion_denySolModifDatosCurriculares:
      "solicitudModificacion/denySolModifDatosCurriculares",
    // SOL. DIRECCIONES
    solicitudModificacion_searchSolModifDatosDirecciones:
      "solicitudModificacion/searchSolModifDatosDirecciones",
    solicitudModificacion_searchDirecciones:
      "solicitudModificacion/searchDirecciones",
    solicitudModificacion_searchSolModifDatosDireccionesDetail:
      "solicitudModificacion/searchSolModifDatosDireccionesDetail",
    solicitudModificacion_processSolModifDatosDirecciones:
      "solicitudModificacion/processSolModifDatosDirecciones",
    solicitudModificacion_denySolModifDatosDirecciones:
      "solicitudModificacion/denySolModifDatosDirecciones",
    solicitudModificacion_searchSolModifDatosExpedientes:
      "solicitudModificacion/searchSolModifDatosExpedientes",
    solicitudModificacion_processSolModifDatosExpedientes:
      "solicitudModificacion/processSolModifDatosExpedientes",
    solicitudModificacion_denySolModifDatosExpedientes:
      "solicitudModificacion/denySolModifDatosExpedientes",
    solicitudModificacion_searchSolModifDatosFacturacion:
      "solicitudModificacion/searchSolModifDatosFacturacion",
    solicitudModificacion_processSolModifDatosFacturacion:
      "solicitudModificacion/processSolModifDatosFacturacion",
    solicitudModificacion_denySolModifDatosFacturacion:
      "solicitudModificacion/denySolModifDatosFacturacion",
    solicitudModificacion_searchSolModifDatosGenerales:
      "solicitudModificacion/searchSolModifDatosGenerales",
    solicitudModificacion_processSolModifDatosGenerales:
      "solicitudModificacion/processSolModifDatosGenerales",
    solicitudModificacion_denySolModifDatosGenerales:
      "solicitudModificacion/denySolModifDatosGenerales",
    solicitudModificacion_searchSolModifDatosGeneralesDetail:
      "solicitudModificacion/searchSolModifDatosGeneralesDetail",
    solicitudModificacion_searchDatosGeneralesDetail:
      "solicitudModificacion/searchDatosGeneralesDetail",
    // FOTO
    solicitudModificacion_searchSolModifDatosUseFoto:
      "solicitudModificacion/searchSolModifDatosUseFoto",
    solicitudModificacion_searchDatosUseFotoDetail:
      "solicitudModificacion/searchDatosUseFotoDetail",
    solicitudModificacion_searchSolModifDatosUseFotoDetail:
      "solicitudModificacion/searchSolModifDatosUseFotoDetail",
    solicitudModificacion_processSolModifDatosUseFoto:
      "solicitudModificacion/processSolModifDatosUseFoto",
    solicitudModificacion_denySolModifDatosUseFoto:
      "solicitudModificacion/denySolModifDatosUseFoto",

    solicitudModificacionEspecifica_searchSpecificRequest:
      "solicitudModificacionEspecifica/searchSpecificRequest",
    solicitudModificacion_searchDatosDirecciones:
      "solicitudModificacion/searchDatosDirecciones",
    tipoCurricular_categoriaCurricular: "tipoCurricular/categoriaCurricular",
    tipoCurricular_searchTipoCurricular: "tipoCurricular/searchTipoCurricular",
    tipoCurricular_createTipoCurricular: "tipoCurricular/createTipoCurricular",
    tipoCurricular_updateTipoCurricular: "tipoCurricular/updateTipoCurricular",
    tipoCurricular_deleteTipoCurricular: "tipoCurricular/deleteTipoCurricular",
    tipoCurricular_historyTipoCurricular:
      "tipoCurricular/historyTipoCurricular",
    subtipoCurricular_searchSubtipoCurricular:
      "subtipoCurricular/searchSubtipoCurricular",
    subtipoCurricular_createSubtipoCurricular:
      "subtipoCurricular/createSubtipoCurricular",
    subtipoCurricular_updateSubtipoCurricular:
      "subtipoCurricular/updateSubtipoCurricular",
    subtipoCurricular_deleteSubtipoCurricular:
      "subtipoCurricular/deleteSubtipoCurricular",
    subtipoCurricular_historySubtipoCurricular:
      "subtipoCurricular/historySubtipoCurricular",
    fichaDatosCurriculares_delete: "fichaDatosCurriculares/delete",
    fichaDatosCertificados_datosCertificadosSearch:
      "fichaDatosCertificados/datosCertificadosSearch",

    //Agenda calendario
    agendaCalendario_getEventosByIdCalendario:
      "agendaCalendario/getEventosByIdCalendario",

    agendaCalendario_getCalendarios: "agendaCalendario/getCalendarios",
    tipoCurricular_comboTipoCurricular: "tipoCurricular/comboTipoCurricular",
    subtipoCurricular_comboSubtipoCurricular:
      "subtipoCurricular/comboSubtipoCurricular",
    fichaDatosCurriculares_update: "fichaDatosCurriculares/update",
    fichaDatosCurriculares_insert: "/fichaDatosCurriculares/insert",

    //Sanciones
    busquedaSanciones_searchBusquedaSanciones:
      "busquedaSanciones/searchBusquedaSanciones",
    busquedaSanciones_comboTipoSancion: "busquedaSanciones/comboTipoSancion",
    busquedaSanciones_comboTipo: "busquedaSanciones/comboTipo",
    busquedaSanciones_comboEstado: "busquedaSanciones/comboEstado",
    busquedaSanciones_comboOrigen: "busquedaSanciones/comboOrigen",
    busquedaSanciones_updateSanction: "busquedaSanciones/updateSanction",
    busquedaSanciones_insertSanction: "busquedaSanciones/insertSanction",
    fichaDatosGenerales_etiquetasPersona:
      "fichaDatosGenerales/etiquetasPersona",
    getLetrado: "/getLetrado",
    fichaDatosCurriculares_solicitudUpdate:
      "fichaDatosCurriculares/solicitudUpdate",
    fichaDatosDirecciones_solicitudCreate:
      "fichaDatosDirecciones/solicitudCreate",
    fichaDatosGenerales_datosGeneralesSolicitudModificación:
      "/fichaDatosGenerales/datosGeneralesSolicitudModificación",
    personaJuridica_solicitudUploadFotografia:
      "personaJuridica/solicitudUploadFotografia",
    busquedaPerJuridica_datosBancariosInsert:
      "busquedaPerJuridica/datosBancariosInsert",
    busquedaPerJuridica_solicitudInsertBanksData:
      "busquedaPerJuridica/solicitudInsertBanksData",
    fichaDatosColegiales_datosColegialesUpdate:
      "/fichaDatosColegiales/datosColegialesUpdate",
    fichaColegialRegTel_searchListDoc: "fichaColegialRegTel/searchListDoc",
    usuario_cambioIdioma: "usuario/cambioIdioma",
    fichaColegialOtrasColegiaciones_getLabelColegios:
      "fichaColegialOtrasColegiaciones/getLabelColegios"
  };

  private menuToggled = new Subject<any>();
  private iframeRemove = new Subject<any>();
  menuToggled$ = this.menuToggled.asObservable();
  iframeRemove$ = this.iframeRemove.asObservable();

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

  getOldSigaUrl() {
    return environment.oldSigaUrl;
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

  postSendFileAndBody(
    service: string,
    file: any,
    idPersona: any,
    motivo: any
  ): Observable<any> {
    let formData: FormData = new FormData();
    if (file != undefined) {
      formData.append("uploadFile", file, file.name);
    }

    // pasar parametros por la request
    formData.append("idPersona", idPersona);

    formData.append("motivo", motivo);

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

  postSendContentAndParameter(
    service: string,
    param: string,
    file: any
  ): Observable<any> {
    let formData: FormData = new FormData();
    if (file != undefined) {
      formData.append("uploadFile", file, file.name);
    }
    let headers = new HttpHeaders();

    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");

    return this.http
      .post(
        environment.newSigaUrl + this.endpoints[service] + param,
        formData,
        {
          headers: headers
        }
      )
      .map(response => {
        return response;
      });
  }
}
