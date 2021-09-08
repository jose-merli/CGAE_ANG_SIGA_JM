import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpResponse,
	HttpParams,
	HttpResponseBase,
	HttpHeaders,
	HttpBackend,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { endpoints_maestros } from "../utils/endpoints_maestros";
import { endpoints_justiciables } from "../utils/endpoints_justiciables";
import { endpoints_guardia } from "../utils/endpoints_guardia";
import { endpoints_oficio } from "../utils/endpoints_oficio";
import { endpoints_componentes } from "../utils/endpoints_components";
import { endpoints_EJG } from "../utils/endpoints_EJG";
import { endpoints_facturacionsjcs } from "../utils/endpoints_facturacionsjcs";
import { endpoints_generales } from "../utils/endpoints_generales";
import { Documento } from '../features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/ficha-actuacion/tarjeta-doc-ficha-act/tarjeta-doc-ficha-act.component';
import { ActuacionDesignaItem } from '../models/sjcs/ActuacionDesignaItem';
import { DocumentoDesignaItem } from '../models/sjcs/DocumentoDesignaItem';

@Injectable()
export class SigaServices {
	items: MenuItem[];
	endpoints = {
		testDb: 'db',
		login: 'login',
		loginDevelop: 'loginDevelop',
		validaInstitucion: 'validaInstitucion',
		institucionesUsuario: 'institucionesUsuario',
		rolesColegioUsuario: 'rolesColegioUsuario',
		perfilesColegioRol: 'perfilesColegioRol',
		validaUsuario: 'validaUsuario',
		getTokenOldSiga: '/getTokenOldSiga',
		eliminaCookie: 'eliminaCookie',
		menu: 'menu',
		entorno: 'getEntorno',
		environmentInfo: 'getEnvParams',
		usuario: 'usuario',
		recuperarApiKey: 'recuperarApiKey',
		usuario_logeado: 'usuario/logeado',
		instituciones: 'instituciones',
		institucionActual: 'getInstitucionActual',
		perfiles: 'perfiles',
		diccionarios: 'diccionarios',
		usuarios_rol: 'usuarios/rol',
		usuarios_perfil: 'usuarios/perfil',
		usuarios_search: 'usuarios/search',
		usuarios_delete: 'usuarios/delete',
		usuarios_update: 'usuarios/update',
		usuarios_insert: 'usuarios/create',
		maestros_search: 'catmaestros/search',
		maestros_rol: 'catmaestros/tabla',
		maestros_update: 'catmaestros/update',
		maestros_create: 'catmaestros/create',
		maestros_delete: 'catmaestros/delete',
		maestros_activate: 'catmaestros/activate',
		maestros_historico: 'catmaestros/historico',
		parametros_modulo: 'parametros/modulo',
		parametros_search: 'parametros/search',
		parametros_delete: 'parametros/delete',
		parametros_update: 'parametros/update',
		parametros_historico: 'parametros/historico',
		etiquetas_lenguaje: 'etiquetas/lenguaje',
		etiquetas_lenguajeFiltrado: 'etiquetas/lenguajeFiltrado',
		etiquetas_search: 'etiquetas/search',
		etiquetas_update: 'etiquetas/update',
		contadores_search: 'contadores/search',
		contadores_update: 'contadores/update',
		contadores_modo: 'contadores/mode',
		contadores_module: 'contadores/module',
		perfiles_search: 'usuariosgrupos/search',
		perfiles_historico: 'usuariosgrupos/historico',
		perfiles_delete: 'usuariosgrupos/delete',
		perfiles_update: 'usuariosgrupos/update',
		perfiles_insert: 'usuariosgrupos/create',
		perfiles_default: 'usuariosgrupos/updateGrupoDefecto',
		permisos_tree: 'permisos',
		catalogos_lenguage: 'catalogos/lenguaje',
		catalogos_entidad: 'catalogos/entidad',
		catalogos_search: 'catalogos/search',
		catalogos_update: 'catalogos/update',
		auditoriaUsuarios_tipoAccion: 'auditoriaUsuarios/tipoAccion',
		auditoriaUsuarios_search: 'auditoriaUsuarios/search',
		auditoriaUsuarios_update: 'auditoriaUsuarios/update',
		permisos_update: 'permisos/update',
		acces_control: '/accesControl',
		acces_controls: '/accesControls',
		acces_controlUrl: '/accesControlUrl',
		entidad_lenguajeInstitucion: 'entidad/lenguajeInstitucion',
		entidad_lenguaje: 'entidad/lenguaje',
		entidad_uploadFile: 'entidad/uploadFile',
		entidad_uploadLenguage: 'entidad/uploadLenguage',
		header_logo: '/header/logo',
		busquedaPerJuridica_tipo: 'busquedaPerJuridica/tipoSociedad',
		busquedaPerJuridica_etiquetas: 'busquedaPerJuridica/etiquetas',
		busquedaPerJuridica_informacionEtiqueta: '/busquedaPerJuridica/informacionEtiqueta',
		busquedaPerJuridica_search: 'busquedaPerJuridica/search',
		busquedaPerJuridica_delete: 'busquedaPerJuridica/delete',
		busquedaPerJuridica_history: 'busquedaPerJuridica/searchHistoric',
		busquedaPerJuridica_parametroColegio: 'busquedaPerJuridica/parametroColegio',
		datosGenerales_update: 'personaJuridica/update',
		datosGenerales_insert: 'personaJuridica/create',
		datosGenerales_identificacion: 'DatosGenerales/identificacion',
		busquedaPer_colegio: 'busquedaPer/colegio',
		busquedaCol_colegio: 'busquedaCol/colegio',
		busquedaPer: 'busquedaPer',
		busquedaPer_institucion: 'busquedaPerInstitucion',
		busquedaPer_searchJuridica: 'busquedaPerJuridica/searchJuridica',
		busquedaPer_searchFisica: 'busquedaPerJuridica/searchFisica',
		busquedaPerJuridica_etiquetasPersona: 'busquedaPerJuridica/etiquetasPersona',
		personaJuridica_uploadFotografia: 'personaJuridica/uploadFotografia',
		personaJuridica_cargarFotografia: 'personaJuridica/cargarFotografia',
		busquedaPerJuridica_datosGeneralesSearch: 'busquedaPerJuridica/datosGeneralesSearch',
		busquedaPerJuridica_create: 'busquedaPerJuridica/create',
		accesoFichaPersona_search: 'fichaPersona/search',
		accesoFichaPersona_searchPersona: 'fichaPersona/searchPersona',
		accesoFichaPersona_desasociarPersona: 'fichaPersona/desasociarPersona',
		accesoFichaPersona_guardar: 'fichaPersona/guardar',
		fichaPersona_crearNotario: 'fichaPersona/crearNotario',
		fichaPersona_tipoIdentificacionCombo: 'fichaPersona/tipoIdentificacionCombo',
		busquedaPerJuridica_update: 'busquedaPerJuridica/update',
		datosRegistrales_actividadesPersona: 'perJuridicaDatosRegistrales/actividadProfesionalPer',
		datosRegistrales_actividadesDisponible: 'perJuridicaDatosRegistrales/actividadProfesional',
		datosRegistrales_search: 'perJuridicaDatosRegistrales/search',
		datosRegistrales_update: 'perJuridicaDatosRegistrales/update',
		datosRegistrales_datosContador: 'perJuridicaDatosRegistrales/datosContador',
		datosBancarios_search: 'busquedaPerJuridica/datosBancariosSearch',
		datosBancarios_delete: 'busquedaPerJuridica/datosBancariosDelete',
		datosCuentaBancaria_search: 'busquedaPerJuridica/datosBancariosGeneralSearch',
		datosCuentaBancaria_update: 'busquedaPerJuridica/datosBancariosUpdate',

		datosCuentaBancaria_insert: 'fichaDatosBancarios/datosBancariosInsert',
		datosCuentaBancaria_BIC_BANCO: 'fichaDatosBancarios/BanksSearch',
		datosMandatos_search: 'fichaDatosBancarios/MandatosSearch',
		datosMandatos_insert: 'fichaDatosBancarios/mandatosInsert',
		datosMandatos_comboEsquema: 'fichaDatosBancarios/comboEsquema',
		anexos_search: 'fichaDatosBancarios/AnexosSearch',
		anexos_update: 'fichaDatosBancarios/updateAnexos',
		anexos_insert: 'fichaDatosBancarios/insertAnexos',
		datosCuentaBancaria_getLengthCodCountry: 'busquedaPerJuridica/getLengthCodCountry',
		busquedaPerJuridica_uploadFile: 'busquedaPerJuridica/uploadFile',
		busquedaPerJuridica_fileDownloadInformation: 'busquedaPerJuridica/fileDownloadInformation',
		dialogo_nombredoc: 'dialogoComunicacion/nombredoc',
		busquedaPerJuridica_downloadFile: 'busquedaPerJuridica/downloadFile',
		retenciones_tipoRetencion: 'retenciones/tipoRetencion',
		retenciones_search: 'retenciones/search',
		retenciones_update: 'retenciones/update',
		integrantes_search: 'busquedaPerJuridica/datosIntegrantesSearch',
		integrantes_tipoColegio: 'tarjetaIntegrantes/tipoColegio',
		integrantes_provincias: 'tarjetaIntegrantes/provincias',
		integrantes_provinciaColegio: 'tarjetaIntegrantes/provinciaColegio',
		integrantes_cargos: 'tarjetaIntegrantes/cargos',
		direcciones_search: 'busquedaPerJuridica/datosDireccionesSearch',
		direcciones_update: 'tarjetaDirecciones/update',
		direcciones_insert: 'tarjetaDirecciones/create',
		direcciones_duplicate: 'tarjetaDirecciones/duplicate',
		direcciones_remove: 'tarjetaDirecciones/delete',
		direcciones_codigoPostal: '',
		direcciones_comboPoblacion: 'tarjetaDirecciones/poblacion',
		direcciones_comboPais: 'tarjetaDirecciones/pais',
		direcciones_comboTipoDireccion: 'tarjetaDirecciones/tipoDireccion',
		integrantes_update: 'tarjetaIntegrantes/update',
		integrantes_insert: 'tarjetaIntegrantes/create',
		integrantes_delete: 'tarjetaIntegrantes/delete',
		// censoII

		fichaDatosDirecciones_datosDireccionesSearch: 'fichaDatosDirecciones/datosDireccionesSearch',
		busquedaColegiados_situacion: 'busquedaColegiados/situacion',
		busquedaColegiados_estadoCivil: 'busquedaColegiados/estadoCivil',
		busquedaColegiados_categoriaCurricular: 'busquedaColegiados/categoriaCurricular',
		busquedaColegiados_poblacion: '/busquedaColegiados/poblacion',
		busquedaColegiados_provincias: 'busquedaColegiados/provincias',
		busquedaColegiados_tipoDireccion: 'busquedaColegiados/tipoDireccion',
		busquedaColegiados_searchColegiado: '/busquedaColegiado/searchColegiado',
		busquedaColegiados_searchColegiadoFicha: '/busquedaColegiado/searchColegiadoFicha',
		busquedaColegiados_generarExcel: 'busquedaColegiados/generarExcel',
		busquedaColegiado_etiquetas: '/busquedaColegiado/etiquetas',
		busquedaNoColegiados_estadoCivil: '/busquedaNoColegiados/estadoCivil',
		busquedaNoColegiados_provincias: '/busquedaNoColegiados/provincias',
		busquedaNoColegiados_poblacion: '/busquedaNoColegiados/poblacion',
		busquedaNoColegiados_tipoDireccion: '/busquedaNoColegiados/tipoDireccion',
		busquedaNoColegiados_categoriaCurricular: '/busquedaColegiados/categoriaCurricular',
		busquedaColegiados_getCurricularTypeCombo: 'busquedaColegiados/getCurricularTypeCombo',
		busquedaColegiados_getCurricularSubtypeCombo: 'busquedaColegiados/getCurricularSubtypeCombo',
		busquedaNoColegiados_searchNoColegiado: '/busquedaNocolegiado/searchNoColegiado',
		busquedaCensoGeneral_searchCliente: 'busquedaCensoGeneral/searchCliente',
		busquedaCensoGeneral_searchColegiado: 'busquedaCensoGeneral/searchColegiado',
		busquedaNocolegiado_deleteNoColegiado: '/busquedaNocolegiado/deleteNoColegiado',
		busquedaNoColegiados_searchHistoric: 'busquedaNocolegiado/searchHistoric',
		busquedaNoColegiados_getCurricularTypeCombo: 'busquedaNoColegiados/getCurricularTypeCombo',
		busquedaNoColegiados_getCurricularSubtypeCombo: 'busquedaNoColegiados/getCurricularSubtypeCombo',
		solicitudIncorporacion_tipoSolicitud: '/solicitudIncorporacion/tipoSolicitud',
		solicitudIncorporacion_estadoSolicitud: '/solicitudIncorporacion/estadoSolicitud',
		solicitudIncorporacion_searchSolicitud: '/solicitudIncorporacion/searchSolicitud',
		solicitudIncorporacion_searchNumColegiado: '/solicitudIncorporacion/searchNumColegiado',
		solicitudIncorporacion_searchNifExistente: '/solicitudIncorporacion/searchNifExistente',

		fichaColegialGenerales_tratamiento: 'fichaDatosGenerales/tratamiento',
		fichaColegialGenerales_estadoCivil: 'fichaDatosGenerales/estadoCivil',
		fichaColegialGenerales_pais: 'fichaDatosColegiales/pais',
		fichaColegialGenerales_temas: 'fichaDatosGenerales/getTopicsSpecificPerson',
		fichaDatosCurriculares_search: 'fichaDatosCurriculares/search',
		solicitudIncorporacion_tratamiento: 'solicitudIncorporacion/tratamiento',
		solicitudIncorporacion_estadoCivil: 'solicitudIncorporacion/estadoCivil',
		solicitudIncorporacion_pais: 'solicitudIncorporacion/pais',
		solicitudIncorporacion_tipoIdentificacion: 'solicitudIncorporacion/tipoIdentificacion',
		solicitudIncorporacion_tipoColegiacion: 'solicitudIncorporacion/tipoColegiacion',
		solicitudIncorporacion_modalidadDocumentacion: 'solicitudIncorporacion/modalidadDocumentacion',
		solicitudIncorporacion_nuevaSolicitud: 'solicitudIncorporacion/nuevaSolicitud',
		solicitudIncorporacion_aprobarSolicitud: 'solicitudIncorporacion/aprobarSolicitud',
		solicitudIncorporacion_denegarSolicitud: 'solicitudIncorporacion/denegarSolicitud',
		fichaDatosBancarios_datosBancariosSearch: 'fichaDatosBancarios/datosBancariosSearch',
		fichaDatosColegiales_tipoSeguro: 'fichaDatosColegiales/tipoSeguro',
		fichaDatosGenerales_Update: 'fichaDatosGenerales/datosGeneralesUpdate',
		fichaDatosGenerales_CreateNoColegiado: 'fichaDatosGenerales/datosGeneralesCreateNoColegiado',
		cargaMasivaDatosCurriculares_generateExcelCV: 'cargaMasivaDatosCurriculares/generateExcelCV',
		cargaMasivaDatosCurriculares_uploadFile: 'cargaMasivaDatosCurriculares/uploadFile',
		cargaMasivaDatosCurriculares_searchCV: 'cargaMasivaDatosCurriculares/searchCV',
		cargaMasivaDatosCurriculares_downloadOriginalFile: 'cargaMasivaDatosCurriculares/downloadOriginalFile',
		cargaMasivaDatosCurriculares_downloadLogFile: 'cargaMasivaDatosCurriculares/downloadLogFile',
		cargasMasivas_descargarEtiquetas: 'cargasMasivas/descargarEtiquetas',
		cargasMasivas_searchEtiquetas: 'cargasMasivas/searchEtiquetas',
		cargasMasivasEtiquetas_uploadFile: 'cargasMasivasEtiquetas/uploadFile',
		cargasMasivas_downloadOriginalFile: 'cargasMasivas/downloadOriginalFile',
		cargasMasivas_downloadLogFile: 'cargasMasivas/downloadLogFile',

		busquedaCensoGeneral_search: 'busquedaCensoGeneral/search',
		busquedaCensoGeneral_searchExact: 'busquedaCensoGeneral/searchExact',

		//Formación
		busquedaCursos_visibilidadCursos: 'busquedaCursos/visibilidadCursos',
		busquedaCursos_estadosCursos: 'busquedaCursos/estadosCursos',
		busquedaCursos_temasCursos: 'busquedaCursos/temasCursos',
		busquedaCursos_search: 'busquedaCursos/search',
		busquedaCursos_archivar: 'busquedaCursos/archivar',
		busquedaCursos_desarchivar: 'busquedaCursos/desarchivar',
		busquedaCursos_duplicateCourse: 'busquedaCursos/duplicateCourse',
		fichaCursos_getRolesTrainers: 'fichaCursos/getRolesTrainers',
		fichaCursos_getTypeCostTrainers: 'fichaCursos/getTypeCostTrainers',
		fichaCursos_updateTrainersCourse: 'fichaCursos/updateTrainersCourse',
		fichaCursos_saveTrainersCourse: 'fichaCursos/saveTrainersCourse',
		fichaCursos_getSessionsCourse: 'fichaCursos/getSessionsCourse',
		fichaCursos_saveCourse: 'fichaCursos/saveCourse',
		fichaCursos_updateCourse: 'fichaCursos/updateCourse',
		fichaCursos_releaseOrAnnounceCourse: 'fichaCursos/releaseOrAnnounceCourse',
		fichaCursos_releaseCourse: 'fichaCursos/releaseCourse',
		fichaCursos_announceCourse: 'fichaCursos/announceCourse',
		fichaCursos_searchCourse: 'fichaCursos/searchCourse',
		fichaCursos_getServicesCourse: 'fichaCursos/getServicesCourse',
		fichaCursos_getServicesSpecificCourse: 'fichaCursos/getServicesSpecificCourse',
		fichaCursos_getCountIncriptions: 'fichaCursos/getCountIncriptions',
		fichaCursos_downloadFile: 'fichaCursos/downloadFile',
		fichaCursos_downloadTemplateFile: 'fichaCursos/downloadTemplateFile',
		fichaCursos_uploadFile: 'fichaCursos/uploadFile',
		fichaCursos_getMassiveLoadInscriptions: 'fichaCursos/getMassiveLoadInscriptions',
		fichaCursos_getHistoricMassiveLoadInscriptions: 'fichaCursos/getHistoricMassiveLoadInscriptions',
		fichaCursos_cancelCourse: 'fichaCursos/cancelCourse',
		fichaCursos_finishCourse: 'fichaCursos/finishCourse',
		fichaCursos_getPricesCourse: 'fichaCursos/getPricesCourse',
		fichaCursos_getQualificationsCourse: 'fichaCursos/getQualificationsCourse',
		fichaCursos_getTypesCertificatesCourse: 'fichaCursos/getTypesCertificatesCourse',
		fichaCursos_getCertificatesCourse: 'fichaCursos/getCertificatesCourse',
		fichaCursos_saveCertificateCourse: 'fichaCursos/saveCertificateCourse',
		fichaCursos_updateCertificatesCourse: 'fichaCursos/updateCertificatesCourse',
		fichaCursos_deleteCertificatesCourse: 'fichaCursos/deleteCertificatesCourse',
		fichaCursos_duplicateSessionsCourse: 'fichaCursos/duplicateSessionsCourse',
		fichaCursos_cancelSessionsCourse: 'fichaCursos/cancelSessionsCourse',
		fichaCursos_getTrainersCourse: 'fichaCursos/getTrainersCourse',
		fichaCursos_deleteTrainersCourse: 'fichaCursos/deleteTrainersCourse',
		fichaCursos_deleteInscriptionsCourse: 'fichaCursos/deleteInscriptionsCourse',
		fichaCursos_autovalidateInscriptionsCourse: 'fichaCursos/autovalidateInscriptionsCourse',
		fichaCursos_getTopicsCourse: 'fichaCursos/getTopicsCourse',
		fichaCursos_getTopicsSpecificCourse: 'fichaCursos/getTopicsSpecificCourse',
		fichaCursos_getTopicsSpecificPerson: 'fichaCursos/getTopicsSpecificPerson',
		fichaCursos_getCodeCourse: 'fichaCursos/getCodeCourse',

		busquedaInscripciones_estadosInscripciones: 'busquedaInscripciones/estadosInscripciones',
		fichaInscripcion_getPaymentMode: 'fichaInscripcion/getPaymentMode',
		busquedaInscripciones_search: 'busquedaInscripciones/search',
		busquedaInscripciones_calificacionesEmitidas: 'busquedaInscripciones/calificacionesEmitidas',
		busquedaInscripciones_updateEstado: 'busquedaInscripciones/updateEstado',
		busquedaInscripciones_updateCalificacion: 'busquedaInscripciones/updateCalificacion',
		busquedaInscripciones_searchPersona: 'busquedaInscripciones/searchPersona',
		busquedaInscripciones_isAdministrador: 'busquedaInscripciones/isAdministrador',
		busquedaInscripciones_selectInscripcionByPrimaryKey: 'busquedaInscripciones/selectInscripcionByPrimaryKey',

		fichaInscripcion_searchCourse: 'fichaInscripcion/searchCourse',
		fichaInscripcion_saveInscripcion: 'fichaInscripcion/saveInscripcion',
		fichaInscripcion_updateInscripcion: 'fichaInscripcion/updateInscripcion',
		fichaInscripcion_guardarPersona: 'fichaInscripcion/guardarPersona',
		fichaInscripcion_generarSolicitudCertificados: 'fichaInscripcion/generarSolicitudCertificados',
		fichaInscripcion_checkMinimaAsistencia: 'fichaInscripcion/checkMinimaAsistencia',
		inscripcionescomprobantepago_uploadFile: 'fichaInscripcion/uploadFile',
		inscripcionescomprobantepago_downloadFile: 'fichaInscripcion/downloadFile',
		inscripcion_fileDownloadInformation: 'fichaInscripcion/fileDownloadInformation',

		inscripcion_downloadFile: 'fichaInscripcion/downloadFile',

		//Agenda
		fichaCalendario_getCalendarType: 'fichaCalendario/getCalendarType',
		fichaCalendario_profiles: 'fichaCalendario/profiles',
		fichaCalendario_updatePermissions: 'fichaCalendario/updatePermissions',
		fichaCalendario_saveCalendar: 'fichaCalendario/saveCalendar',
		fichaCalendario_updateCalendar: 'fichaCalendario/updateCalendar',
		fichaCalendario_getCalendar: 'fichaCalendario/getCalendar',
		fichaCalendario_getProfilesPermissions: 'fichaCalendario/getProfilesPermissions',
		fichaCalendario_getCalendarNotifications: 'fichaCalendario/getCalendarNotifications',
		fichaCalendario_deleteNotification: 'fichaCalendario/deleteNotification',
		fichaCalendario_getHistoricCalendarNotifications: 'fichaCalendario/getHistoricCalendarNotifications',
		fichaEventos_getTrainersLabels: 'fichaEventos/getTrainersLabels',
		fichaEventos_downloadTemplateFile: 'fichaEventos/downloadTemplateFile',
		fichaEventos_getCalendars: 'fichaEventos/getCalendars',
		fichaEventos_getTypeEvent: 'fichaEventos/getTypeEvent',
		fichaEventos_getEventStates: 'fichaEventos/getEventStates',
		fichaEventos_getRepeatEvery: 'fichaEventos/getRepeatEvery',
		fichaEventos_getDaysWeek: 'fichaEventos/getDaysWeek',
		fichaEventos_saveEventCalendar: 'fichaEventos/saveEventCalendar',
		fichaEventos_updateEventCalendar: 'fichaEventos/updateEventCalendar',
		fichaEventos_deleteEvent: 'fichaEventos/deleteEventCalendar',
		fichaEventos_getJudicialDistrict: 'fichaEventos/getJudicialDistrict',
		fichaEventos_getEventNotifications: 'fichaEventos/getEventNotifications',
		fichaEventos_getHistoricEventNotifications: 'fichaEventos/getHistoricEventNotifications',
		fichaEventos_getEntryListCourse: 'fichaEventos/getEntryListCourse',
		fichaEventos_searchEvent: 'fichaEventos/searchEvent',
		fichaEventos_searchEventByIdEvento: 'fichaEventos/searchEventByIdEvento',
		fichaEventos_saveAssistancesCourse: 'fichaEventos/saveAssistancesCourse',
		fichaEventos_saveFormadorEvent: 'fichaEventos/saveFormadorEvent',
		fichaEventos_updateFormadorEvent: 'fichaEventos/updateFormadorEvent',
		fichaEventos_getTrainersSession: 'fichaEventos/getTrainersSession',
		fichaEventos_uploadFile: 'fichaEventos/uploadFile',
		fichaEventos_getRepeteadEvents: 'fichaEventos/getRepeteadEvents',

		datosNotificaciones_getTypeNotifications: 'datosNotificaciones/getTypeNotifications',
		fichaCalendario_getNotificationTypeCalendarTraining: 'fichaCalendario/getNotificationTypeCalendarTraining',
		datosNotificaciones_getMeasuredUnit: 'datosNotificaciones/getMeasuredUnit',
		datosNotificaciones_saveNotification: 'datosNotificaciones/saveNotification',
		datosNotificaciones_updateNotification: 'datosNotificaciones/updateNotification',
		datosNotificaciones_getTypeWhere: 'datosNotificaciones/getTypeWhere',
		datosNotificaciones_getTemplates: 'datosNotificaciones/getTemplates',
		datosNotificaciones_getTypeSend: 'datosNotificaciones/getTypeSend',
		datosNotificaciones_getPlantillas: 'datosNotificaciones/getPlantillas',

		fichaColegialSociedades_searchSocieties: 'fichaColegialSociedades/searchSocieties',
		fichaColegialOtrasColegiaciones_searchOtherCollegues: 'fichaColegialOtrasColegiaciones/searchOtherCollegues',
		fichaDatosGenerales_partidoJudicialSearch: '/fichaDatosGenerales/partidoJudicialSearch',
		fichaDatosGenerales_tipoidentificacion: '/fichaDatosGenerales/getTipoIdentificacion',
		fichaDatosColegiales_datosColegialesSearch: '/fichaDatosColegiales/datosColegialesSearch',

		fichaDatosColegiales_datosColegialesSearchActual: '/fichaDatosColegiales/datosColegialesSearchActual',

		fichaColegialColegiales_search: 'fichaDatosColegiales/searchDatosColegiales',
		fichaDatosColegiales_getNumColegiado: '/fichaDatosColegiales/getNumColegiado',
		alterMutua_estadoSolicitud: 'alterMutua/estadoSolicitud',
		alterMutua_estadoColegiado: 'alterMutua/estadoColegiado',
		alterMutua_propuestas: 'alterMutua/propuestas',
		alterMutua_tarifaSolicitud: 'alterMutua/tarifaSolicitud',
		alterMutua_solicitudAlter: 'alterMutua/solicitudAlter',
		mutualidad_getEnums: 'mutualidad/enums',
		mutualidad_estadoMutualista: 'mutualidad/estadoMutualista',
		mutualidad_estadoSolicitud: 'mutualidad/estadoSolicitud',
		mutualidad_searchSolicitud: 'mutualidad/searchSolicitud',
		mutualidad_obtenerCuotaYCapObjetivo: 'mutualidad/obtenerCuotaYCapObjetivo',
		mutualidad_solicitudPolizaProfesional: 'mutualidad/solicitudPolizaProfesional',
		mutualidad_solicitudPolizaAccuGratuitos: 'mutualidad/solicitudPolizaAccuGratuitos',

		solicitudModificacion_tipoModificacion: 'solicitudModificacion/tipoModificacion',
		solicitudModificacion_estado: 'solicitudModificacion/estado',
		// Solicitud Modificacion
		solicitudModificacion_verifyPerson: 'solicitudModificacion/verifyPerson',
		// GENERAL
		solicitudModificacion_searchModificationRequest: 'solicitudModificacion/searchModificationRequest',
		solicitudModificacion_processGeneralModificationRequest:
			'solicitudModificacion/processGeneralModificationRequest',
		solicitudModificacion_denyGeneralModificationRequest: 'solicitudModificacion/denyGeneralModificationRequest',
		solicitudModificacion_insertGeneralModificationRequest:
			'solicitudModificacion/insertGeneralModificationRequest',
		// ESPECÍFICA
		solicitudModificacion_searchSolModif: 'solicitudModificacion/searchSolModif',
		solicitudModificacion_processSolModif: 'solicitudModificacion/processSolModif',
		solicitudModificacion_denySolModif: 'solicitudModificacion/denySolModif',
		solicitudModificacion_searchSolModifDatosBancarios: 'solicitudModificacion/searchSolModifDatosBancarios',
		solicitudModificacion_searchSolModifDatosCambiarFoto: 'solicitudModificacion/searchSolModifDatosCambiarFoto',
		solicitudModificacion_searchDatosBancariosDetail: 'solicitudModificacion/searchDatosBancariosDetail',
		solicitudModificacion_searchSolModifDatosBancariosDetail:
			'solicitudModificacion/searchSolModifDatosBancariosDetail',
		solicitudModificacion_processSolModifDatosBancarios: 'solicitudModificacion/processSolModifDatosBancarios',
		solicitudModificacion_denySolModifDatosBancarios: 'solicitudModificacion/denySolModifDatosBancarios',
		solicitudModificacion_searchSolModifDatosCurriculares: 'solicitudModificacion/searchSolModifDatosCurriculares',
		solicitudModificacion_searchDatosCurricularesDetail: 'solicitudModificacion/searchDatosCurricularesDetail',
		solicitudModificacion_searchSolModifDatosCurricularesDetail:
			'solicitudModificacion/searchSolModifDatosCurricularesDetail',
		solicitudModificacion_processSolModifDatosCurriculares:
			'solicitudModificacion/processSolModifDatosCurriculares',
		solicitudModificacion_denySolModifDatosCurriculares: 'solicitudModificacion/denySolModifDatosCurriculares',
		// SOL. DIRECCIONES
		solicitudModificacion_searchSolModifDatosDirecciones: 'solicitudModificacion/searchSolModifDatosDirecciones',
		solicitudModificacion_searchDirecciones: 'solicitudModificacion/searchDirecciones',
		solicitudModificacion_searchSolModifDatosDireccionesDetail:
			'solicitudModificacion/searchSolModifDatosDireccionesDetail',
		solicitudModificacion_processSolModifDatosDirecciones: 'solicitudModificacion/processSolModifDatosDirecciones',
		solicitudModificacion_denySolModifDatosDirecciones: 'solicitudModificacion/denySolModifDatosDirecciones',
		solicitudModificacion_searchSolModifDatosExpedientes: 'solicitudModificacion/searchSolModifDatosExpedientes',
		solicitudModificacion_processSolModifDatosExpedientes: 'solicitudModificacion/processSolModifDatosExpedientes',
		solicitudModificacion_denySolModifDatosExpedientes: 'solicitudModificacion/denySolModifDatosExpedientes',
		solicitudModificacion_searchSolModifDatosFacturacion: 'solicitudModificacion/searchSolModifDatosFacturacion',
		solicitudModificacion_processSolModifDatosFacturacion: 'solicitudModificacion/processSolModifDatosFacturacion',
		solicitudModificacion_denySolModifDatosFacturacion: 'solicitudModificacion/denySolModifDatosFacturacion',
		solicitudModificacion_searchSolModifDatosGenerales: 'solicitudModificacion/searchSolModifDatosGenerales',
		solicitudModificacion_processSolModifDatosGenerales: 'solicitudModificacion/processSolModifDatosGenerales',
		solicitudModificacion_denySolModifDatosGenerales: 'solicitudModificacion/denySolModifDatosGenerales',
		solicitudModificacion_searchSolModifDatosGeneralesDetail:
			'solicitudModificacion/searchSolModifDatosGeneralesDetail',
		solicitudModificacion_searchSolModifDatosCambiarFotoDetail:
			'solicitudModificacion/searchSolModifDatosCambiarFotoDetail',
		solicitudModificacion_searchDatosGeneralesDetail: 'solicitudModificacion/searchDatosGeneralesDetail',
		// FOTO
		solicitudModificacion_searchSolModifDatosUseFoto: 'solicitudModificacion/searchSolModifDatosUseFoto',
		solicitudModificacion_searchDatosUseFotoDetail: 'solicitudModificacion/searchDatosUseFotoDetail',
		solicitudModificacion_searchSolModifDatosUseFotoDetail:
			'solicitudModificacion/searchSolModifDatosUseFotoDetail',
		solicitudModificacion_processSolModifDatosUseFoto: 'solicitudModificacion/processSolModifDatosUseFoto',
		solicitudModificacion_processSolModifDatosCambiarFoto: 'solicitudModificacion/processSolModifDatosCambiarFoto',
		solicitudModificacion_denySolModifDatosUseFoto: 'solicitudModificacion/denySolModifDatosUseFoto',
		solicitudModificacion_denySolModifDatosCambiarFoto: 'solicitudModificacion/denySolModifDatosCambiarFoto',
		solicitudModificacionEspecifica_searchSpecificRequest: 'solicitudModificacionEspecifica/searchSpecificRequest',
		solicitudModificacion_searchDatosDirecciones: 'solicitudModificacion/searchDatosDirecciones',
		solicitudModificacion_insertAuditoria: 'solicitudModificacion/insertAuditoria',

		tipoCurricular_categoriaCurricular: 'tipoCurricular/categoriaCurricular',
		tipoCurricular_searchTipoCurricular: 'tipoCurricular/searchTipoCurricular',
		tipoCurricular_createTipoCurricular: 'tipoCurricular/createTipoCurricular',
		tipoCurricular_updateTipoCurricular: 'tipoCurricular/updateTipoCurricular',
		tipoCurricular_deleteTipoCurricular: 'tipoCurricular/deleteTipoCurricular',
		tipoCurricular_historyTipoCurricular: 'tipoCurricular/historyTipoCurricular',
		subtipoCurricular_searchSubtipoCurricular: 'subtipoCurricular/searchSubtipoCurricular',
		subtipoCurricular_createSubtipoCurricular: 'subtipoCurricular/createSubtipoCurricular',
		subtipoCurricular_updateSubtipoCurricular: 'subtipoCurricular/updateSubtipoCurricular',
		subtipoCurricular_deleteSubtipoCurricular: 'subtipoCurricular/deleteSubtipoCurricular',
		subtipoCurricular_historySubtipoCurricular: 'subtipoCurricular/historySubtipoCurricular',
		fichaDatosCurriculares_delete: 'fichaDatosCurriculares/delete',
		fichaDatosCertificados_datosCertificadosSearch: 'fichaDatosCertificados/datosCertificadosSearch',

		//Agenda calendario
		agendaCalendario_getEventosByIdCalendario: 'agendaCalendario/getEventosByIdCalendario',

		agendaCalendario_getCalendarios: 'agendaCalendario/getCalendarios',
		tipoCurricular_getCurricularTypeCombo: 'tipoCurricular/getCurricularTypeCombo',
		subtipoCurricular_getCurricularSubtypeCombo: 'subtipoCurricular/getCurricularSubtypeCombo',
		fichaDatosCurriculares_update: 'fichaDatosCurriculares/update',
		fichaDatosCurriculares_insert: '/fichaDatosCurriculares/insert',

		//Sanciones
		busquedaSanciones_searchBusquedaSanciones: 'busquedaSanciones/searchBusquedaSanciones',
		busquedaSanciones_searchBusquedaSancionesBBDD: 'busquedaSanciones/searchBusquedaSancionesBBDD',
		busquedaSanciones_comboTipoSancion: 'busquedaSanciones/comboTipoSancion',
		busquedaSanciones_comboTipo: 'busquedaSanciones/comboTipo',
		busquedaSanciones_comboEstado: 'busquedaSanciones/comboEstado',
		busquedaSanciones_comboOrigen: 'busquedaSanciones/comboOrigen',
		busquedaSanciones_updateSanction: 'busquedaSanciones/updateSanction',
		busquedaSanciones_insertSanction: 'busquedaSanciones/insertSanction',
		fichaDatosGenerales_etiquetasPersona: 'fichaDatosGenerales/etiquetasPersona',
		getLetrado: '/getLetrado',
		fichaDatosCurriculares_solicitudUpdate: 'fichaDatosCurriculares/solicitudUpdate',
		fichaDatosDirecciones_solicitudCreate: 'fichaDatosDirecciones/solicitudCreate',
		fichaDatosDirecciones_solicitudUpdate: 'fichaDatosDirecciones/solicitudUpdate',
		fichaDatosGenerales_datosGeneralesSolicitudModificación:
			'/fichaDatosGenerales/datosGeneralesSolicitudModificación',
		personaJuridica_solicitudUploadFotografia: 'personaJuridica/solicitudUploadFotografia',
		busquedaPerJuridica_datosBancariosInsert: 'busquedaPerJuridica/datosBancariosInsert',
		busquedaPerJuridica_solicitudInsertBanksData: 'busquedaPerJuridica/solicitudInsertBanksData',
		fichaDatosColegiales_datosColegialesUpdate: '/fichaDatosColegiales/datosColegialesUpdate',
		fichaDatosColegiales_datosColegialesUpdateMasivo:'/fichaDatosColegiales/datosColegialesUpdateMasivo',
		fichaDatosColegiales_datosColegialesInsertEstado: '/fichaDatosColegiales/datosColegialesInsertEstado',
		fichaDatosColegiales_datosColegialesUpdateEstados: '/fichaDatosColegiales/datosColegialesUpdateEstados',
		fichaDatosColegiales_datosColegialesDeleteEstado: '/fichaDatosColegiales/datosColegialesDeleteEstado',
		fichaDatosColegiales_searchTurnosGuardias: '/fichaDatosColegiales/searchTurnosGuardias',
		fichaColegialRegTel_permisos: 'fichaColegialRegTel/permisos',
		fichaColegialRegTel_searchListDoc: 'fichaColegialRegTel/searchListDoc',
		fichaColegialRegTel_searchListDir: 'fichaColegialRegTel/searchListDir',
		fichaColegialRegTel_searchListDocNoCol: 'fichaColegialRegTel/searchListDocNoCol',
		fichaColegialRegTel_searchListDirNoCol: 'fichaColegialRegTel/searchListDirNoCol',
		fichaColegialRegTel_downloadDoc: 'fichaColegialRegTel/downloadDoc',
		fichaColegialRegTel_insertCollection: 'fichaColegialRegTel/insertCollection',
		fichaColegialRegTel_insertCollectionNoCol: 'fichaColegialRegTel/insertCollectionNoCol',
		usuario_cambioIdioma: 'usuario/cambioIdioma',
		fichaColegialOtrasColegiaciones_getLabelColegios: 'fichaColegialOtrasColegiaciones/getLabelColegios',
		enviosMasivos: 'enviosMasivos/enviosMasivos',
		enviosMasivos_enviar: 'enviosMasivos/enviar',
		enviosMasivos_search: 'enviosMasivos/search',
		enviosMasivos_searchBusqueda: 'enviosMasivos/searchBusqueda',
		enviosMasivos_estado: 'enviosMasivos/estadoEnvios',
		enviosMasivos_tipo: 'enviosMasivos/tipoEnvios',
		enviosMasivos_programar: 'enviosMasivos/programarEnvio',
		enviosMasivos_cancelar: 'enviosMasivos/cancelarEnvio',
		enviosMasivos_plantillas: 'enviosMasivos/detalle/plantillas',
		enviosMasivos_guardarConf: 'enviosMasivos/detalle/guardarConfiguracion',
		enviosMasivos_documentos: 'enviosMasivos/detalle/documentosEnvio',
		enviosMasivos_duplicar: 'enviosMasivos/duplicarEnvio ',
		enviosMasivos_etiquetas: 'enviosMasivos/detalle/etiquetas',
		enviosMasivos_etiquetasEnvio: 'enviosMasivos/detalle/etiquetasEnvio ',
		enviosMasivos_consultasDestAsociadas: 'enviosMasivos/detalle/ConsultasEnvAsociadas',
		enviosMasivos_consultasDestDisp: 'enviosMasivos/detalle/consultasDestinatariosDisp',
		enviosMasivos_consultasDestinatarios: 'enviosMasivos/detalle/consultasDest',
		enviosMasivos_asociarConsulta: 'enviosMasivos/detalle/asociarConsulta',
		enviosMasivos_desAsociarConsulta: 'enviosMasivos/detalle/desAsociarConsulta',
		enviosMasivos_destinatariosIndv: 'enviosMasivos/detalle/destinatariosIndv',
		enviosMasivos_asociarDestinatariosIndv: 'enviosMasivos/detalle/asociarDestinatariosIndv',
		enviosMasivos_desAsociarDestinatariosIndv: 'enviosMasivos/detalle/desAsociarDestinatarioIndv',
		enviosMasivos_direccionesDestinatarioIndv: 'enviosMasivos/detalle/direccionesDestinatarioIndv',
		enviosMasivos_guardarEtiquetas: 'enviosMasivos/detalle/guardarEtiquetas',
		enviosMasivos_subirDocumento: 'enviosMasivos/detalle/subirDocumento',
		enviosMasivos_detallePlantilla: 'enviosMasivos/detalle/detallePlantilla',
		enviosMasivos_obtenerDestinatarios: 'enviosMasivos/obtenerDestinatarios',
		consultas_claseComunicaciones: 'consultas/claseComunicacion',
		consultas_claseComunicacionesByModulo: 'consultas/claseComunicacionByModulo',
		enviosMasivos_guardarDocumento: 'enviosMasivos/detalle/guardarDocumentoEnvio',
		enviosMasivos_borrarDocumento: 'enviosMasivos/detalle/borrarDocumentoEnvio',
		enviosMasivos_descargarDocumento: 'enviosMasivos/detalle/descargarDocumento',
		enviosMasivos_nombreFicheroLog: 'enviosMasivos/detalle/nombreFicheroLog',
		enviosMasivos_descargarLog: 'enviosMasivos/detalle/descargarLog',
		consultas_comboObjetivos: 'consultas/objetivo',
		consultas_comboModulos: 'consultas/modulo',
		comunicaciones_claseComunicaciones: 'comunicaciones/clasesComunicacion',
		comunicaciones_modelosComunicacion: 'comunicaciones/modelosComunicacion',
		comunicaciones_search: 'comunicaciones/search',
		comunicaciones_guardarConf: 'comunicaciones/detalle/configuracion',
		comunicaciones_destinatarios: 'comunicaciones/detalle/destinatarios',
		comunicaciones_descargarDocumento: 'comunicaciones/detalle/descargarDocumento',
		comunicaciones_descargarCertificado: 'comunicaciones/detalle/descargarCertificado',
		consultas_search: 'consultas/search',
		consultas_borrar: 'consultas/borrarConsulta',
		consultas_listadoPlantillas: 'consultas/plantillasconsulta',
		consultas_guardarDatosGenerales: 'consultas/confGeneral',
		consultas_guardarConsulta: 'consultas/confConsulta',
		consultas_listadoModelos: 'consultas/modelosconsulta',
		consultas_ejecutarConsulta: 'consultas/ejecutarConsulta',
		consultas_duplicar: 'consultas/duplicarConsulta',
		consultas_obtenerCamposDinamicos: 'consultas/obtenerCamposDinamicos',
		plantillasEnvio_search: 'plantillasEnvio/plantillasEnvioSearch',
		plantillasEnvio_guardarDatosGenerales: 'plantillasEnvio/datosGenerales',
		modelos_search: 'modelos/search',
		modelos_searchModelo: 'modelos/searchModelo',
		modelos_search_historico: 'modelos/search/historico',
		modelos_duplicar: 'modelos/duplicar',
		modelos_borrar: 'modelos/borrar',
		modelos_rehabilitar: 'modelos/rehabilitar',
		modelos_detalle_datosGenerales: 'modelos/detalle/datosGenerales',
		modelos_detalle_datosGeneralesComprobarNom: 'modelos/detalle/datosGenerales/comprobarNom',
		modelos_detalle_perfiles: 'modelos/detalle/perfiles',
		modelos_detalle_perfilesModelo: 'modelos/detalle/perfilesModelo',
		modelos_detalle_guardarPerfiles: 'modelos/detalle/guardarPerfiles',
		modelos_detalle_informes: 'modelos/detalle/informes',
		modelos_detalle_informes_borrar: 'modelos/detalle/informes/borrar',
		modelos_detalle_plantillasEnvio: 'modelos/detalle/plantillasEnvio',
		modelos_detalle_plantillasHist: 'modelos/detalle/plantillasEnvioHist',
		modelos_detalle_borrarPlantilla: 'modelos/detalle/borrarPlantillaEnvio',
		modelos_detalle_guardarPlantilla: 'modelos/detalle/guardarPlantillaEnvio',
		modelos_colegio: 'modelos/colegiosModelo',
		modelos_detalle_plantillasComunicacion: 'modelos/detalle/plantillasComunicacion',
		modelos_detalle_plantillasComunicacionByIdClase: 'modelos/detalle/plantillasComunicacionByIdClase',
		modelos_detalle_tipoEnvioPlantilla: 'modelos/detalle/tipoEnvioPlantilla',

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
		plantillasDoc_consulta: 'plantillasDoc/consulta',
		plantillasDoc_consultas_historico: 'plantillasDoc/consultas/historico',
		plantillasDoc_plantillas: 'plantillasDoc/plantillas',
		plantillasDoc_guardar: 'plantillasDoc/guardar',
		plantillasDoc_guardar_datosSalida: 'plantillasDoc/guardar/datosSalida',
		plantillasDoc_borrar: 'plantillasDoc/borrar',
		plantillasDoc_insertarPlantilla: 'plantillasDoc/insertarPlantilla',
		plantillasDoc_subirPlantilla: 'plantillasDoc/subirPlantilla',
		plantillasDoc_sizeFichero: 'plantillasDoc/consulta/sizeFichero',
		plantillasDoc_plantillas_borrar: 'plantillasDoc/borrar',
		plantillasDoc_descargarPlantilla: 'plantillasDoc/descargarPlantilla',

        //Diálogo comunicación
		dialogo_claseComunicaciones: 'dialogoComunicacion/clasesComunicacion',
		dialogo_claseComunicacion: 'dialogoComunicacion/claseComunicacion',
		dialogo_fechaProgramada: 'dialogoComunicacion/fechaProgramada',
		dialogo_modelosComunicacion: 'dialogoComunicacion/modelosSearch',
		dialogo_plantillasEnvio: 'dialogoComunicacion/plantillasEnvio',
		dialogo_tipoEnvios: 'dialogoComunicacion/tipoEnvios',
		dialogo_enviar: 'dialogoComunicacion/enviar',
		dialogo_descargar: 'dialogoComunicacion/descargar',
		dialogo_generarEnvios: 'dialogoComunicacion/generarEnvios',
		dialogo_keys: 'dialogoComunicacion/keys',
		dialogo_obtenerCamposDinamicos: 'dialogoComunicacion/obtenerCamposDinamicos',
		dialogo_envioTest: 'dialogoComunicacion/envioTest',
        dialogo_maxModelos: 'dialogoComunicacion/maxModelos',

        //endpoints
        ...endpoints_EJG,
        ...endpoints_facturacionsjcs,
        ...endpoints_componentes,
         ...endpoints_generales,
        ...endpoints_justiciables,
        ...endpoints_oficio,
        ...endpoints_maestros,
    };

	private menuToggled = new Subject<any>();
	private iframeRemove = new Subject<any>();
	private consultasRefresh = new Subject<any>();
  private updateCombo = new Subject<any>();
  private newIdOrdenacion = new Subject<any>();
  private deshabilitarEditar = new Subject<any>();
  private perfilesRefresh = new Subject<any>();
  private modelosRefresh = new Subject<any>();
  private habilitarDocs = new Subject<any>();
  private desHabilitarDocs = new Subject<any>();
  private sendFechaBaja = new Subject<any>();
  private sendSelectedDatos = new Subject<any>();
  private sendDatosRedy = new Subject<any>();

  menuToggled$ = this.menuToggled.asObservable();
  iframeRemove$ = this.iframeRemove.asObservable();
  consultasRefresh$ = this.consultasRefresh.asObservable();
  updateCombo$ = this.updateCombo.asObservable();
  sendSelectedDatos$ = this.sendSelectedDatos.asObservable();
  newIdOrdenacion$ = this.newIdOrdenacion.asObservable();
  deshabilitarEditar$ = this.deshabilitarEditar.asObservable();
  perfilesRefresh$ = this.perfilesRefresh.asObservable();
  modelosRefresh$ = this.modelosRefresh.asObservable();
  habilitarDocs$ = this.habilitarDocs.asObservable();
  desHabilitarDocs$ = this.desHabilitarDocs.asObservable();

  sendFechaBaja$ = this.sendFechaBaja.asObservable();
  datosRedy$ = this.sendDatosRedy.asObservable();

  private guardarDatosGeneralesJusticiable = new Subject<any>();
  guardarDatosGeneralesJusticiable$ = this.guardarDatosGeneralesJusticiable.asObservable();

  private guardarDatosGeneralesRepresentante = new Subject<any>();
  guardarDatosGeneralesRepresentante$ = this.guardarDatosGeneralesRepresentante.asObservable();

  private guardarDatosSolicitudJusticiable = new Subject<any>();
  guardarDatosSolicitudJusticiable$ = this.guardarDatosSolicitudJusticiable.asObservable();

  private createJusticiable = new Subject<any>();
  createJusticiable$ = this.createJusticiable.asObservable();

  constructor(private http: HttpClient, handler: HttpBackend, private httpbackend: HttpClient) {
    this.httpbackend = new HttpClient(handler);
  }

  get(service: string): Observable<any> {
    return this.http.get(environment.newSigaUrl + this.endpoints[service]).map((response) => {
      return response;
    });
  }

  getParam(service: string, body: any): Observable<any> {
    return this.http.get(environment.newSigaUrl + this.endpoints[service] + body).map((response) => {
      return response;
    });
  }

  getBackend(service: string): Observable<any> {
    return this.httpbackend.get(environment.newSigaUrl + this.endpoints[service]).map((response) => {
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
      .get(environment.newSigaUrl + this.endpoints[service] + '?institucion=' + institucion)
      .map((response) => {
        return response;
      });
  }

  postBackend(service: string, body: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpbackend
      .post(environment.newSigaUrl + this.endpoints[service], body, {
        headers: headers,
        observe: 'response',
        responseType: 'text'
      })
      .map((response) => {
        return response;
      });
  }

  post(service: string, body: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], body, {
        headers: headers,
        observe: 'response',
        responseType: 'text'
      })
      .map((response) => {
        return response;
      });
  }

  parseErrorBlob(err: HttpErrorResponse): Observable<any> {
    const reader: FileReader = new FileReader();

    const obs = Observable.create((observer: any) => {
      reader.onloadend = (e) => {
        observer.error(JSON.parse(reader.result as string));
        observer.complete();
      };
    });
    reader.readAsText(err.error);
    return obs;
  }

  postDownloadFiles(service: string, body: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], body, {
        headers: headers,
        observe: 'body', // si observe: "response" no sirve. Si se quita el observe sirve
        responseType: 'blob'
      })
      .map((response) => {
        return response;
      })
      .catch((response) => {
        return this.parseErrorBlob(response);
      });
  }

  postSendContent(service: string, file: any): Observable<any> {
    let formData: FormData = new FormData();
    if (file != undefined) {
      formData.append('uploadFile', file, file.name);
    }
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], formData, {
        headers: headers
      })
      .map((response) => {
        return response;
      });
  }

  postSendFileAndParameters(service: string, file: any, idPersona: any): Observable<any> {
    let formData: FormData = new FormData();
    if (file != undefined) {
      formData.append('uploadFile', file, file.name);
    }

    // pasar parametros por la request
    formData.append('idPersona', idPersona);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], formData, {
        headers: headers
      })
      .map((response) => {
        return response;
      });
  }

  postSendFileAndBody(service: string, file: any, idPersona: any, motivo: any): Observable<any> {
    let formData: FormData = new FormData();
    if (file != undefined) {
      formData.append('uploadFile', file, file.name);
    }

    // pasar parametros por la request
    formData.append('idPersona', idPersona);

    formData.append('motivo', motivo);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], formData, {
        headers: headers
      })
      .map((response) => {
        return response;
      });
  }

  postSendFileAndActuacion(service: string, documentos: Documento[], actuacion: ActuacionDesignaItem): Observable<any> {
    let formData: FormData = new FormData();

    let documentosActualizar = [];

    documentos.forEach((el, i) => {

      if (el.file != undefined && el.file != null) {
        let doc = new DocumentoDesignaItem();

        doc.anio = el.anio;
        doc.numero = el.numero;
        doc.idTurno = el.idTurno;
        doc.idActuacion = el.idActuacion;
        doc.observaciones = el.observaciones;
        doc.idTipodocumento = '1';
		doc.usuModificacion = el.usuModificacion;

        formData.append(`uploadFile${i}`, el.file, el.file.name + ';' + JSON.stringify(doc));
      } else {
        let doc = new DocumentoDesignaItem();

        doc.idDocumentaciondes = el.idDocumentaciondes;
        doc.idTipodocumento = '1';
        doc.idFichero = el.idFichero;
        doc.idInstitucion = el.idInstitucion;
        doc.anio = el.anio;
        doc.numero = el.numero;
        doc.idTurno = el.idTurno;
        doc.idActuacion = el.idActuacion;
        doc.observaciones = el.observaciones;
		doc.usuModificacion = el.usuModificacion;
        documentosActualizar.push(doc);
      }
    });

    formData.append('documentosActualizar', JSON.stringify(documentosActualizar));

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], formData, {
        headers: headers
      })
      .map((response) => {
        return response;
      });
  }

  postSendFileAndDesigna(service: string, documentos: any[], designa: any): Observable<any> {
    let formData: FormData = new FormData();

    let documentosActualizar = [];

    documentos.forEach((el, i) => {

      if (el.cells[5].value && el.cells[3].value != undefined && el.cells[3].value != null) {
        let doc = new DocumentoDesignaItem();
        doc.anio = designa.ano;
        doc.numero = designa.numero;
        doc.idTurno = designa.idTurno;
        doc.idActuacion = el.cells[1].value == '0' ? null : el.cells[1].value;
        doc.observaciones = el.cells[4].value;
        doc.idTipodocumento = el.cells[2].value;

        formData.append(`uploadFile${i}`, el.cells[3].value, el.cells[3].value.name + ';' + JSON.stringify(doc));
      } else {
        let doc = new DocumentoDesignaItem();
        doc.anio = designa.ano;
        doc.numero = designa.numero;
        doc.idTurno = designa.idTurno;
        doc.observaciones = el.cells[4].value;
        doc.idDocumentaciondes = el.cells[6].value;
        documentosActualizar.push(doc);
      }
    });

    formData.append('documentosActualizar', JSON.stringify(documentosActualizar));

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], formData, {
        headers: headers
      })
      .map((response) => {
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
      formData.append('uploadFile', file, file.name);
    }

    // pasar parametros por la request
    formData.append('idPersona', idPersona);
    formData.append('idCuenta', idCuenta);
    formData.append('idMandato', idMandato);
    formData.append('idAnexo', idAnexo);
    formData.append('tipoMandato', tipoMandato);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], formData, {
        headers: headers
      })
      .map((response) => {
        return response;
      });
  }

  postSendFileAndParametersComprobantePago(
    service: string,
    file: any,
    idPersona: any,
    idInscripcion: any
  ): Observable<any> {
    let formData: FormData = new FormData();
    if (file != undefined) {
      formData.append('uploadFile', file, file.name);
    }

    // pasar parametros por la request
    formData.append('idPersona', idPersona);
    formData.append('idInscripcion', idInscripcion);

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http
      .post(environment.newSigaUrl + this.endpoints[service], formData, {
        headers: headers
      })
      .map((response) => {
        return response;
      });
  }

  postPaginado(service: string, param: string, body: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http
      .post(environment.newSigaUrl + this.endpoints[service] + param, body, {
        headers: headers,
        observe: 'response',
        responseType: 'text'
      })
      .map((response) => {
        return response;
      });
  }

  notifyMenuToggled() {
    this.menuToggled.next();
  }

  notifyRefreshConsulta() {
    this.consultasRefresh.next();
  }

  notifyupdateCombo(send) {
    this.updateCombo.next(send);
  }

  notifynewIdOrdenacion(send) {
    this.newIdOrdenacion.next(send);
  }

  notifysendSelectedDatos(send) {
    this.sendSelectedDatos.next(send);
  }

  notifyRefreshModelos() {
    this.modelosRefresh.next();
  }

  notifyRefreshEditar() {
    this.deshabilitarEditar.next();
  }

  notifyRefreshPerfiles() {
    this.perfilesRefresh.next();
  }

  notifyHabilitarDocumentos() {
    this.habilitarDocs.next();
  }

  notifyDesHabilitarDocumentos() {
    this.desHabilitarDocs.next();
  }

  notifyGuardarDatosGeneralesRepresentante(data) {
    this.guardarDatosGeneralesRepresentante.next(data);
  }

  notifyGuardarDatosGeneralesJusticiable(data) {
    this.guardarDatosGeneralesJusticiable.next(data);
  }

  notifyGuardarDatosSolicitudJusticiable(data) {
    this.guardarDatosSolicitudJusticiable.next(data);
  }

  notifyCreateJusticiable(data) {
    this.createJusticiable.next(data);
  }

  notifysendFechaBaja(fecha) {
    this.sendFechaBaja.next(fecha);
  }

  notifysendDatosRedy(datos) {
    this.sendDatosRedy.next(datos);
  }

  postSendContentAndParameter(
    service: string,
    param: string,
    file: any
  ): Observable<any> {
    let formData: FormData = new FormData();
    if (file != undefined) {
      formData.append('uploadFile', file, file.name);
    }
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http
      .post(environment.newSigaUrl + this.endpoints[service] + param, formData, {
        headers: headers
      })
      .map((response) => {
        return response;
      });
  }
}