import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { ValidationModule } from './commons/validation/validation.module';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { DialogModule } from "primeng/dialog";
import { StepsModule } from 'primeng/steps';
import * as $ from 'jquery'

import { AuthGuard } from './_guards/auth.guards';
import { OldSigaServices } from './_services/oldSiga.service';
import { SigaServices } from './_services/siga.service';
import { cardService } from './_services/cardSearch.service';
import { CookieService } from 'ngx-cookie-service';

import { ConfirmationService } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";

import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { ChipsModule } from "primeng/chips";

// Componentes comunes
import { routing } from './app.routing';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HeaderComponent } from './commons/header/header.component';
import { MyIframeComponent } from './commons/my-iframe/my-iframe.component';
import { MenuComponent } from './commons/menu/menu.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './commons/login/login.component';
import { LoginDevelopComponent } from './commons/login-develop/login-develop.component';
import { LoginMultipleComponent } from './commons/login-multiple/login-multiple.component';
import { LogoutComponent } from './commons/logout/logout.component';
import { ImagePipe } from './commons/image-pipe/image.pipe';
import { CheckPermissionDirective } from './commons/directives/check-permission.directive';
import { MessageService } from 'primeng/components/common/messageservice';
import { TreeModule } from 'primeng/tree';
import { BusquedaColegiadoExpressModule } from './commons/busqueda-colegiado-express/busqueda-colegiado-express.module';

//PRIMENG

import { DropdownModule } from "primeng/dropdown";
import { DataTableModule } from "primeng/datatable";
import { ListboxModule } from "primeng/listbox";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { RadioButtonModule } from "primeng/radiobutton";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { GrowlModule } from "primeng/growl";
import { MultiSelectModule } from "primeng/multiselect";
import { InputSwitchModule } from 'primeng/inputswitch';


import { PickListModule } from "primeng/picklist";
import {OrderListModule} from 'primeng/orderlist';
import { ProgressSpinnerModule } from "primeng/progressspinner";




import { TooltipModule } from "primeng/tooltip";
import { FileUploadModule } from "primeng/fileupload";
import { KeyFilterModule } from 'primeng/keyfilter';
import { EditorModule } from '@tinymce/tinymce-angular';

// Modulo de censo
import { SearchColegiadosComponent } from './features/censo/search-colegiados/search-colegiados.component';
import { SearchNoColegiadosComponent } from './features/censo/search-no-colegiados/search-no-colegiados.component';

























// Modulo de administracion
import { CatalogosMaestros } from './features/administracion/catalogos-maestros/catalogos-maestros.component';
import { EditarCatalogosMaestrosComponent } from './features/administracion/catalogos-maestros/editarCatalogosMaestros/editarCatalogosMaestros.component';
import { ContadoresComponent } from './features/administracion/contadores/contadores.component';
import { GestionContadoresComponent } from './features/administracion/contadores/gestion-contadores/gestion-contadores.component';
import { GestionEntidad } from './features/administracion/gestion-entidad/gestion-entidad.component';
import { Catalogos } from './features/administracion/gestion-multiidioma/catalogos/catalogos.component';
import { Etiquetas } from './features/administracion/gestion-multiidioma/etiquetas/etiquetas.component';
import { GruposUsuarios } from './features/administracion/grupos-usuarios/grupos-usuarios.component';
import { ParametrosGenerales } from './features/administracion/parametros/parametros-generales/parametros-generales.component';
import { EditarPerfilesComponent } from './features/administracion/perfiles/editarPerfiles/editarPerfiles.component';
import { PerfilesComponent } from './features/administracion/perfiles/perfiles.component';
import { PermisosComponent } from './features/administracion/permisos/permisos.component';
import { SeleccionarIdioma } from './features/administracion/seleccionar-idioma/seleccionar-idioma.component';
import { EditarUsuarioComponent } from './features/administracion/usuarios/editarUsuario/editarUsuario.component';
import { Usuarios } from './features/administracion/usuarios/usuarios.component';




import { AuditoriaComponent } from './features/censo/auditoria/auditoria.component';
import { BusquedaCensoGeneralComponent } from './features/censo/busqueda-censo-general/busqueda-censo-general.component';
import { BusquedaColegiadosComponentI } from './features/censo/busqueda-colegiados-censoI/busqueda-colegiados.component';
import { BusquedaColegiadosComponent } from './features/censo/busqueda-colegiados/busqueda-colegiados.component';
import { BusquedaGeneralComponent } from './features/censo/busqueda-general/busqueda-general.component';
import { BusquedaLetradosComponent } from './features/censo/busqueda-letrados/busqueda-letrados.component';
import { BusquedaNoColegiadosComponent } from './features/censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { BusquedaPersonasJuridicas } from './features/censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component';
import { BusquedaSancionesComponent } from './features/censo/busqueda-sanciones/busqueda-sanciones.component';
import { DetalleSancionComponent } from './features/censo/busqueda-sanciones/detalle-sancion/detalle-sancion.component';




import { CargasPeriodicasComponent } from './features/censo/cargas-periodicas/cargas-periodicas.component';
import { CensoDocumentacionComponent } from './features/censo/censo-documentacion/censo-documentacion.component';
import { CertificadosAcaComponent } from './features/censo/certificados-aca/certificados-aca.component';
import { ComisionesCargosComponent } from './features/censo/comisiones-cargos/comisiones-cargos.component';
import { SolicitudesGenericasComponent } from './features/censo/solicitudes-genericas/solicitudes-genericas.component';
import { SolicitudesEspecificasComponent } from './features/censo/solicitudes-especificas/solicitudes-especificas.component';
import { SolicitudesIncorporacionComponent } from './features/censo/solicitudes-incorporacion/solicitudes-incorporacion.component';
import { NuevaIncorporacionComponent } from './features/censo/solicitudes-incorporacion/nueva-incorporacion/nueva-incorporacion.component';
import { DocumentacionSolicitudesComponent } from './features/censo/documentacion-solicitudes/documentacion-solicitudes.component';
import { ModificacionDatosComponent } from './features/censo/modificacion-datos/modificacion-datos.component';
import { MantenimientoGruposFijosComponent } from './features/censo/mantenimiento-grupos-fijos/mantenimiento-grupos-fijos.component';
import { MantenimientoMandatosComponent } from './features/censo/mantenimiento-mandatos/mantenimiento-mandatos.component';
import { EdicionCurricularesComponent } from './features/censo/ficha-colegial/edicionDatosCurriculares/edicionCurriculares.component';
import { MantenimientoDuplicadosComponent } from './features/censo/mantenimiento-duplicados/mantenimiento-duplicados.component';
import { MediadoresComponent } from './features/censo/mediadores/mediadores.component';
import { ConfigurarPerfilComponent } from './features/censo/configurar-perfil/configurar-perfil.component';

import { TipoCurricularComponent } from './features/censo/gestion-subtiposCV/tipo-curricular.component';
import { SubtipoCurricularComponent } from './features/censo/gestion-subtiposCV/subtipo-curricular/subtipo-curricular.component';
import { DatosPersonaJuridicaComponent } from './features/censo/datosPersonaJuridica/datosPersonaJuridica.component';
import { CommonModule } from '@angular/common';


import { AccesoFichaPersonaComponent } from './features/censo/datosPersonaJuridica/accesoFichaPersona/accesoFichaPersona.component';

import { DatosBancariosComponent } from './features/censo/datosPersonaJuridica/datos-bancarios/datos-bancarios.component';
import { ConsultarDatosBancariosComponent } from './features/censo/datosPersonaJuridica/datos-bancarios/consultar-datos-bancarios/consultar-datos-bancarios.component';
// import { DatosCuentaBancariaComponent } from "./features/censo/datos-cuenta-bancaria/datos-cuenta-bancaria.component";
// import { DatosMandatosComponent } from "./features/censo/datos-mandatos/datos-mandatos.component";
// import { ListadoFicherosAnexosComponent } from "./features/censo/listado-ficheros-anexos/listado-ficheros-anexos.component";
import { DatosIntegrantesComponent } from './features/censo/datosPersonaJuridica/datos-integrantes/datos-integrantes.component';
import { DetalleIntegranteComponent } from './features/censo/datosPersonaJuridica/datos-integrantes/detalleIntegrante/detalleIntegrante.component';
import { DatosDireccionesComponent } from './features/censo/datosPersonaJuridica/datos-direcciones/datos-direcciones.component';
import { ConsultarDatosDireccionesComponent } from './features/censo/datosPersonaJuridica/datos-direcciones/consultar-datos-direcciones/consultar-datos-direcciones.component';























import { MutualidadAbogaciaPlanUniversal } from './features/censo/solicitudes-incorporacion/mutualidadDeLaAbogaciaPlanUniversal/mutualidad-abogacia-plan-universal.component';
import { FacturacionSociedadesCensoComponent } from './features/censo/facturacionSociedadesCenso/facturacion-sociedades-censo.component';
import { ComunicacionSociedadesComponent } from './features/censo/comunicacionSociedades/comunicacion-sociedades.component';

// Modulo de administracion
import { CatalogosMaestrosComponent } from './features/administracion/catalogos-maestros-classique/catalogos-maestros-classique.component';
import { AuditoriaUsuarios } from './features/administracion/auditoria/usuarios/auditoria-usuarios.component';
import { GestionAuditoriaComponent } from './features/administracion/auditoria/usuarios/editarAuditoriaUsuarios/gestion-auditoria.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

//Modulo de Certificados
import { ComunicacionInterprofesionalComponent } from './features/certificados/comunicacion-interprofesional/comunicacion-interprofesional.component';


import { SolicitarCompraComponent } from './features/certificados/solicitar-compra/solicitar-compra.component';
import { SolicitudCertificadosComponent } from './features/certificados/solicitud-certificados/solicitud-certificados.component';
import { GestionSolicitudesComponent } from './features/certificados/gestion-solicitudes/gestion-solicitudes.component';
import { MantenimientoCertificadosComponent } from './features/certificados/mantenimiento-certificados/mantenimiento-certificados.component';

//Modulo de Facturacion
import { MantenimientoSufijosComponent } from './features/facturacion/mantenimiento-sufijos/mantenimiento-sufijos.component';

import { BandejaEntradaComponent } from './features/comunicaciones/bandeja-entrada/bandeja-entrada.component';
import { BandejaSalidaComponent } from './features/comunicaciones/bandeja-salida/bandeja-salida.component';
import { DefinirTipoPlantillaComponent } from './features/comunicaciones/definir-tipo-plantilla/definir-tipo-plantilla.component';
//Comunicaciones
import { InformesGenericosComponent } from './features/comunicaciones/informes-genericos/informes-genericos.component';
import { ListaCorreosComponent } from './features/comunicaciones/lista-correos/lista-correos.component';
import { ConsultasListasDinamicasComponent } from './features/consultas/consultas-listas-dinamicas/consultas-listas-dinamicas.component';
import { NuevaConsultaExpertaComponent } from './features/consultas/nueva-consulta-experta/nueva-consulta-experta.component';
import { NuevaConsultaComponent } from './features/consultas/nueva-consulta/nueva-consulta.component';
//Consultas
import { RecuperarConsultasComponent } from './features/consultas/recuperar-consultas/recuperar-consultas.component';



//Modulo de Expedientes

import { AbonosComponent } from './features/facturacion/abonos/abonos.component';
import { CobrosRecobrosComponent } from './features/facturacion/cobros-recobros/cobros-recobros.component';
import { ContabilidadComponent } from './features/facturacion/contabilidad/contabilidad.component';
import { DevolucionManualComponent } from './features/facturacion/devoluciones/devolucion-manual/devolucion-manual.component';
import { FicherosDevolucionesComponent } from './features/facturacion/devoluciones/ficheros-devoluciones/ficheros-devoluciones.component';
import { EliminarFacturaComponent } from './features/facturacion/eliminar-factura/eliminar-factura.component';
import { FacturaPlantillasComponent } from './features/facturacion/factura-plantillas/factura-plantillas.component';
import { GestionCuentasBancariasComponent } from './features/facturacion/gestion-cuentas-bancarias/gestion-cuentas-bancarias.component';
import { SeriesFacturaComponent } from './features/facturacion/series-factura/series-factura.component';
import { PrevisionesFacturaComponent } from './features/facturacion/previsiones-factura/previsiones-factura.component';
import { ProgramarFacturaComponent } from './features/facturacion/programar-factura/programar-factura.component';
import { GenerarFacturaComponent } from './features/facturacion/generar-factura/generar-factura.component';
import { MantenimientoFacturaComponent } from './features/facturacion/mantenimiento-factura/mantenimiento-factura.component';
import { FacturasComponent } from './features/facturacion/facturas/facturas.component';
import { FicherosAdeudosComponent } from './features/facturacion/ficheros-adeudos/ficheros-adeudos.component';
import { FicherosTransferenciaComponent } from './features/facturacion/ficheros-transferencia/ficheros-transferencia.component';


import { FacturasEmitidasComponent } from './features/facturacion/informes/facturas-emitidas/facturas-emitidas.component';

import { FiltrosExportacionesContabilidadComponent } from './features/facturacion/contabilidad/filtros-exportaciones-contabilidad/filtros-exportaciones-contabilidad.component';

//Modulo de Facturacion

import { BusquedaInscripcionesComponent } from './features/formacion/busqueda-inscripciones/busqueda-inscripciones.component';
import { FichaCursoComponent } from './features/formacion/ficha-curso/ficha-curso.component';
import { FichaInscripcionComponent } from './features/formacion/ficha-inscripcion/ficha-inscripcion.component';

import { ComunicacionesComponent } from './features/informes-comunicaciones/comunicaciones/comunicaciones.component';
import { ConfiguracionComponent } from './features/informes-comunicaciones/comunicaciones/ficha-registro-comunicacion/configuracion/configuracion.component';
import { DestinatariosComponent } from './features/informes-comunicaciones/comunicaciones/ficha-registro-comunicacion/destinatarios/destinatarios.component';
import { DocumentosComponent } from './features/informes-comunicaciones/comunicaciones/ficha-registro-comunicacion/documentos/documentos.component';
import { FichaRegistroComunicacionComponent } from './features/informes-comunicaciones/comunicaciones/ficha-registro-comunicacion/ficha-registro-comunicacion.component';
import { ProgramacionComponent } from './features/informes-comunicaciones/comunicaciones/ficha-registro-comunicacion/programacion/programacion.component';
import { ConsultasComponent } from './features/informes-comunicaciones/consultas/consultas.component';
import { ConsultaComponent } from './features/informes-comunicaciones/consultas/ficha-consulta/consulta/consulta.component';
import { DatosGeneralesConsultaComponent } from './features/informes-comunicaciones/consultas/ficha-consulta/datos-generales-consulta/datos-generales-consulta.component';

import { ModelosComunicacionesConsultaComponent } from './features/informes-comunicaciones/consultas/ficha-consulta/modelos-comunicaciones-consulta/modelos-comunicaciones-consulta.component';
import { PlantillasEnviosConsultasComponent } from './features/informes-comunicaciones/consultas/ficha-consulta/plantillas-envios-consultas/plantillas-envios-consultas.component';
import { DialogoComunicacionesComponent } from './features/informes-comunicaciones/dialogo-comunicaciones/dialogo-comunicaciones.component';
import { EnviosMasivosComponent } from './features/informes-comunicaciones/envios-masivos/envios-masivos.component';
import { ConfiguracionEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/configuracion-envio-masivo/configuracion-envio-masivo.component';
import { DestinatarioIndvEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/destinatario-indv-envio-masivo/destinatario-indv-envio-masivo.component';
import { DestinatariosEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/destinatarios-etiquetas-envio-masivo/destinatarios-etiquetas-envio-masivo.component';
import { DestinatarioListEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/destinatarios-list-envio-masivo/destinatarios-list-envio-masivo.component';
import { DocumentosEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/documentos-envio-masivo/documentos-envio-masivo.component';
import { FichaRegistroEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/ficha-registro-envio-masivo.component';
import { ProgramacionEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/programacion-envio-masivo/programacion-envio-masivo.component';
import { DatosGeneralesFichaComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/datos-generales-ficha/datos-generales-ficha.component';
import { FichaModeloComunicacionesComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/ficha-modelo-comunicaciones.component';
import { PerfilesFichaComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/perfiles-ficha/perfiles-ficha.component';
import { TarjetaComunicacionesComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/tarjeta-comunicaciones/tarjeta-comunicaciones.component';
import { PlantillaDocumentoComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/tarjeta-informes/plantilla-documento/plantilla-documento.component';
import { TarjetaInformesComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/tarjeta-informes/tarjeta-informes.component';
import { ModelosComunicacionesComponent } from './features/informes-comunicaciones/modelos-comunicaciones/modelos-comunicaciones.component';
import { ConsultasPlantillasComponent } from './features/informes-comunicaciones/plantillas-envio/detalle-plantilla-envio/consultas-plantillas/consultas-plantillas.component';
import { DatosGeneralesPlantillaComponent } from './features/informes-comunicaciones/plantillas-envio/detalle-plantilla-envio/datos-generales-plantilla/datos-generales-plantilla.component';
import { DetallePlantillaEnvioComponent } from './features/informes-comunicaciones/plantillas-envio/detalle-plantilla-envio/detalle-plantilla-envio.component';
import { RemitentePlantillaComponent } from './features/informes-comunicaciones/plantillas-envio/detalle-plantilla-envio/remitente-plantilla/remitente-plantilla.component';
//INFORMES Y COMUNICACIONES
import { PlantillasEnvioComponent } from './features/informes-comunicaciones/plantillas-envio/plantillas-envio.component';



//Modulo de Productos y Servicios
import { CategoriasProductoComponent } from './features/productosYServicios/categoriasProducto/categoriasProducto.component';
import { CategoriasServiciosComponent } from './features/productosYServicios/categoriasServicios/categoriasServicios.component';

import { MantenimientoProductosComponent } from './features/productosYServicios/mantenimientoProductos/mantenimientoProductos.component';
import { MantenimientoServiciosComponent } from './features/productosYServicios/mantenimientoServicios/mantenimientoServicios.component';

import { GestionarSolicitudesComponent } from './features/productosYServicios/gestionarSolicitudes/gestionarSolicitudes.component';
import { SolicitudCompraSubscripcionComponent } from './features/productosYServicios/solicitudCompraSubscripcion/solicitudCompraSubscripcion.component';
import { SolicitudAnulacionComponent } from './features/productosYServicios/solicitudAnulacion/solicitudAnulacion.component';
import { CargaComprasComponent } from './features/productosYServicios/cargaCompras/cargaCompras.component';
import { FichaCompraSuscripcionComponent } from './features/facturacion/ficha-compra-suscripcion/ficha-compra-suscripcion.component';

//Modulo de Expedientes
import { TiposExpedientesComponent } from './features/expedientes/tipos-expedientes/tipos-expedientes.component';
import { GestionarExpedientesComponent } from './features/expedientes/gestionar-expedientes/gestionar-expedientes.component';
import { AlertasComponent } from './features/expedientes/alertas/alertas.component';
import { NuevoExpedienteComponent } from './features/expedientes/nuevo-expediente/nuevo-expediente.component';

import { CertificacionComponent } from './features/sjcs/certificacion/certificacion.component';
import { ComunicaCargaComponent } from './features/sjcs/comunicaciones/comunica-carga/comunica-carga.component';
import { ComunicaDesignacionesComponent } from './features/sjcs/comunicaciones/comunica-designaciones/comunica-designaciones.component';
import { ComunicaEnvioActualizacionComponent } from './features/sjcs/comunicaciones/comunica-envio-actualizacion/comunica-envio-actualizacion.component';
import { ComunicaInfoEconomicaComponent } from './features/sjcs/comunicaciones/comunica-info-economica/comunica-info-economica.component';
import { ComunicaPreparacionComponent } from './features/sjcs/comunicaciones/comunica-preparacion/comunica-preparacion.component';
import { ComunicaRemesaEnvioComponent } from './features/sjcs/comunicaciones/comunica-remesa-envio/comunica-remesa-envio.component';
import { ComunicaRemesaResultadoComponent } from './features/sjcs/comunicaciones/comunica-remesa-resultado/comunica-remesa-resultado.component';
import { ComunicaResolucionesComponent } from './features/sjcs/comunicaciones/comunica-resoluciones/comunica-resoluciones.component';

//Modulo de Justicia Gratuita
import { DevolucionComponent } from './features/sjcs/devolucion/devolucion.component';

import { JustificacionComponent } from './features/sjcs/justificacion/justificacion.component';
import { ZonasYSubzonasComponent } from './features/sjcs/maestros/zonas-subzonas/zonas-subzonas.component';
import { AreasYMateriasComponent } from './features/sjcs/maestros/areas-materias/areas-materias.component';
import { RetencionesIRPFComponent } from './features/sjcs/maestros/retenciones-IRPF/retenciones-IRPF.component';
import { CalendarioLaboralComponent } from './features/sjcs/maestros/calendarioLaboral/calendarioLaboral.component';
import { MantenimientoProcuradoresComponent } from './features/sjcs/maestros/mantenimiento-procuradores/mantenimiento-procuradores.component';
import { MantenimientoPrisionesComponent } from './features/sjcs/maestros/mantenimiento-prisiones/mantenimiento-prisiones.component';
import { MantenimientoComisariasComponent } from './features/sjcs/maestros/mantenimiento-comisarias/mantenimiento-comisarias.component';
import { MantenimientoJuzgadosComponent } from './features/sjcs/maestros/mantenimiento-juzgados/mantenimiento-juzgados.component';
import { MaestroPJComponent } from './features/sjcs/maestros/maestro-pj/maestro-pj.component';
import { DestinatariosRetencionesComponent } from './features/sjcs/maestros/destinatarios-retenciones/destinatarios-retenciones.component';

import { SolicitudesTurnosGuardiasComponent } from './features/sjcs/oficio/solicitudesTurnosGuardias/solicitudesTurnosGuardias.component';

import { SjcsModule } from './features/sjcs/sjcs.module';
import { SOJComponent } from './features/sjcs/soj/soj.component';
/***NEW modules censo***/
import { BusquedaColegiadosComponentNew } from './new-features/censo/busqueda-colegiados/busqueda-colegiados.component';


import { JwtInterceptor } from './_interceptor/jwt.interceptor';
import { AuthenticationService } from './_services/authentication.service';

import { CommonsService } from './_services/commons.service';
// prueba
import { HeaderGestionEntidadService } from './_services/headerGestionEntidad.service';

import { PersistenceService } from './_services/persistence.service';

import { DetalleTarjetaDatosAdicionalesFichaDesignacionOficioComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-datos-adicionales-designa/detalle-tarjeta-datos-adicionales-ficha-designacion-oficio.component';
import { DetalleTarjetaContrariosFichaDesignacionOficioComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-contrarios-designa/detalle-tarjeta-contrarios-ficha-designacion-oficio.component';
import { DetalleTarjetaInteresadosFichaDesignacionOficioComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-interesados-designa/detalle-tarjeta-interesados-ficha-designacion-oficio.component';
import { DetalleTarjetaLetradosDesignaComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-letrados-designa/detalle-tarjeta-letrados-designa.component';

import { GuardiasSolicitudesTurnosComponent } from './features/sjcs/guardia/solicitudes-turnos/solicitudes-turnos.component';
import { GuardiasIncompatibilidadesComponent } from './features/sjcs/guardia/guardias-incompatibilidades/guardias-incompatibilidades.component';
import { ProgramacionCalendariosComponent } from './features/sjcs/guardia/programacionCalendarios/programacionCalendarios.component';
import { GuardiasBajasTemporalesComponent } from './features/sjcs/guardia/guardias-bajas-temporales/guardias-bajas-temporales.component';
import { GuardiasSaltosCompensacionesComponent } from './features/sjcs/guardia/guardias-saltos-compensaciones/guardias-saltos-compensaciones.component';
import { DefinirListasGuardiasComponent } from './features/sjcs/guardia/definir-listas-guardias/definir-listas-guardias.component';
import { GuardiasAsistenciasComponent } from './features/sjcs/guardia/guardias-asistencias/guardias-asistencias.component';
import { VolanteExpresComponent } from './features/sjcs/guardia/volante-expres/volante-expres.component';
import { JustificacionLetradoComponent } from './features/sjcs/informes/justificacion-letrado/justificacion-letrado.component';
import { InformeFacturacionComponent } from './features/sjcs/informes/informe-facturacion/informe-facturacion.component';
import { InformeFacturacionMultipleComponent } from './features/sjcs/informes/informe-facturacion-multiple/informe-facturacion-multiple.component';
import { InformeFacturacionPersonalizadoComponent } from './features/sjcs/informes/informe-facturacion-personalizado/informe-facturacion-personalizado.component';
import { FichaFacturacionComponent } from './features/sjcs/informes/ficha-facturacion/ficha-facturacion.component';
import { FichaPagoComponent } from './features/sjcs/informes/ficha-pago/ficha-pago.component';
import { CartaPagosColegiadosComponent } from './features/sjcs/informes/carta-pagos-colegiados/carta-pagos-colegiados.component';
import { CartaFacturaColegiadoComponent } from './features/sjcs/informes/carta-factura-colegiado/carta-factura-colegiado.component';
import { CertificadosPagosComponent } from './features/sjcs/informes/certificados-pagos/certificados-pagos.component';
import { CertificadosIrpfComponent } from './features/sjcs/informes/certificados-irpf/certificados-irpf.component';
import { MutualidadAbogaciaSeguroAccidentes } from './features/censo/solicitudes-incorporacion/mutualidadAbogaciaSeguroAccidentes/mutualidad-abogacia-seguro-accidentes.component';
import { AlterMutuaRetaComponent } from './features/censo/solicitudes-incorporacion/alter-mutua/alterMutuaReta/alter-mutua-reta.component';
import { AlterMutuaComponent } from './features/censo/solicitudes-incorporacion/alter-mutua/alter-mutua.component';
import { AlterMutuaOfertasComponent } from './features/censo/solicitudes-incorporacion/alter-mutua/alterMutuaOfertas/alter-mutua-ofertas.component';
import { CargasMasivasOficioComponent } from './features/sjcs/oficio/cargas-masivas-oficio/cargas-masivas-oficio.component';

/***NEW modules censo***/
import { DatosGenerales } from './features/censo/datosPersonaJuridica/datos-generales/datos-generales.component';
import { DatosRegistralesComponent } from './features/censo/datosPersonaJuridica/datos-registrales/datos-registrales.component';
import { DatosRetencionesComponent } from './features/censo/datosPersonaJuridica/datos-retenciones/datos-retenciones.component';
import { ServiciosInteresComponent } from './features/censo/datosPersonaJuridica/servicios-interes/servicios-interes.component';

import { GestionActasComponent } from './features/sjcs/actas/gestion-actas/gestion-actas.component';


//COOKIES
import { PoliticaCookiesComponent } from './features/politica-cookies/politica-cookies.component';
import { ErrorAccesoComponent } from './commons/error/error-acceso/error-acceso.component';
import { TrimPipePipe } from './commons/trim-pipe/trim-pipe.pipe';
import { FormacionComponent } from './features/formacion/formacion.component';
import { BusquedaCursosComponent } from './features/formacion/busqueda-cursos/busqueda-cursos.component';
import { CargaEtiquetasComponent } from './features/censo/cargas-masivas/carga-etiquetas/carga-etiquetas.component';
import { DatosCvComponent } from './features/censo/cargas-masivas/datos-cv/datos-cv.component';
import { CargaEtiquetasComponent2 } from './features/censo/cargaEtiquetas/cargaEtiquetas.component';
import { DatosCVComponent2 } from './features/censo/datosCV/datosCV.component';
import { AgendaComponent } from './features/agenda/agenda.component';

import { SelectButtonModule, ColorPickerModule, OverlayPanelModule, PaginatorModule, ScrollPanel, ScrollPanelModule, SliderModule} from 'primeng/primeng';

import { FichaCalendarioComponent } from './features/agenda/ficha-calendario/ficha-calendario.component';
import { CargasMasivasComponent } from './features/censo/cargas-masivas/cargas-masivas.component';
import { DatosNotificacionesComponent } from './features/agenda/datos-notificaciones/datos-notificaciones.component';
import { FichaEventosComponent } from './features/agenda/ficha-eventos/ficha-eventos.component';


//Calendario
import { ScheduleModule } from 'primeng/schedule';
import { SolicitudesModificacionComponent } from './features/censo/solicitudes-modificacion/solicitudes-modificacion.component';
import { NuevaSolicitudesModificacionComponent } from './features/censo/solicitudes-modificacion/nueva-solicitudes-modificacion/nueva-solicitudes-modificacion.component';
import { ComunicacionesCensoComponent } from './features/censo/comunicacionesCenso/comunicaciones.component';

import { ExpedientesComponent } from './features/censo/expedientesCenso/expedientes.component';
import { RegtelComponent } from './features/censo/regtel/regtel.component';
import { TurnoOficioComponent } from './features/censo/turnoOficioCenso/turnoOficio.component';

registerLocaleData(es);

//INFORMES Y COMUNICACIONES
import { FichaConsultaComponent } from './features/informes-comunicaciones/consultas/ficha-consulta/ficha-consulta.component';
import { PipeNumberModule } from './commons/number-pipe/number-pipe.module';

import { TranslateService } from './commons/translate/translation.service';
import { FechaModule } from './commons/fecha/fecha.module';
import { PrecioModule } from './commons/precio/precio.module';
import { DialogoModule } from './commons/dialog/dialogo.module';
import { BuscadorProcuradoresComponent } from './commons/buscador-procuradores/buscador-procuradores.component';
import { FiltroBuscadorProcuradorComponent } from './commons/buscador-procuradores/filtro/filtro.component';
import { TablaBuscadorProcuradorComponent } from './commons/buscador-procuradores/tabla/tabla.component';
import { GeneralSJCSModule } from './commons/busqueda-generalSJCS/busqueda-generalSJCS.module';
import { TurnosComponent } from './features/sjcs/oficio/turnos/busqueda-turnos.component';
import { BusquedaAsuntosModule } from './commons/busqueda-asuntos/busqueda-asuntos.module';

import { OficioModule } from './features/sjcs/oficio/oficio.module';

import { DescripcionEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/descripcion-envio-masivo/descripcion-envio-masivo.component';
import { FichaColegialGeneralComponent } from './features/censo/ficha-colegial/ficha-colegial-general/ficha-colegial-general.component';
import { DatosGeneralesFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/datos-generales-ficha-colegial/datos-generales-ficha-colegial.component';
import { DatosColegialesFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/datos-colegiales-ficha-colegial/datos-colegiales-ficha-colegial.component';
import { CertificadosFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/certificados-ficha-colegial/certificados-ficha-colegial.component';
import { SancionesFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/sanciones-ficha-colegial/sanciones-ficha-colegial.component';
import { SociedadesFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/sociedades-ficha-colegial/sociedades-ficha-colegial.component';
import { DatosCurricularesFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/datos-curriculares-ficha-colegial/datos-curriculares-ficha-colegial.component';
import { DireccionesFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/direcciones-ficha-colegial/direcciones-ficha-colegial.component';
import { DatosBancariosFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/datos-bancarios-ficha-colegial/datos-bancarios-ficha-colegial.component';
import { RegtelFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/regtel-ficha-colegial/regtel-ficha-colegial.component';
import { AlterMutuaFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/alter-mutua-ficha-colegial/alter-mutua-ficha-colegial.component';
import { MutualidadAbogaciaFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/mutualidad-abogacia-ficha-colegial/mutualidad-abogacia-ficha-colegial.component';
import { OtrasColegiacionesFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/otras-colegiaciones-ficha-colegial/otras-colegiaciones-ficha-colegial.component';
import { ServiciosInteresFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/servicios-interes-ficha-colegial/servicios-interes-ficha-colegial.component';
import { TarjetaResumenFijaModule } from './commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module';
import { PipeTranslationModule } from './commons/translate/pipe-translation.module';
import { EnvioReintegrosXuntaComponent } from './features/sjcs/facturacionSJCS/envio-reintegros-xunta/envio-reintegros-xunta.component';
import { GenerarImpreso190Component } from './features/sjcs/facturacionSJCS/generar-impreso190/generar-impreso190.component';


import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FacturacionesYPagosComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/facturaciones-pagos.component';
import { FiltroBusquedaFacturacionComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/filtro-busqueda-facturacion/filtro-busqueda-facturacion.component';
import { TablaBusquedaFacturacionComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/tabla-busqueda-facturacion/tabla-busqueda-facturacion.component';
import { GestionFacturacionComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/gestion-facturacion/gestion-facturacion.component';
import { DatosFacturacionComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/gestion-facturacion/datos-facturacion/datos-facturacion.component';
import { ConceptosFacturacionComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/gestion-facturacion/conceptos-facturacion/conceptos-facturacion.component';
import { BaremosComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/gestion-facturacion/baremos/baremos.component';
import { PagosComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/gestion-facturacion/pagos/pagos.component';
import { CartasFacturacionComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/gestion-facturacion/cartas-facturacion/cartas-facturacion.component';
import { GestionPagosComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/gestion-pagos/gestion-pagos.component';
import { DatosPagosComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/gestion-pagos/datos-pagos/datos-pagos.component';
import { ConfiguracionFicherosComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/gestion-pagos/configuracion-ficheros/configuracion-ficheros.component';
import { CartasPagoComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/gestion-pagos/cartas-pago/cartas-pago.component';
import { CompensacionFacturaComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/gestion-pagos/compensacion-factura/compensacion-factura.component';
import { ConceptosPagosComponent } from './features/sjcs/facturacionSJCS/facturaciones-pagos/gestion-pagos/conceptos-pagos/conceptos-pagos.component';
import { SiNoPipe } from './commons/sino-pipe/si-no.pipe';
import { PaginadorComponent } from './commons/paginador/paginador.component';
import { SelectorComponent } from './commons/selector/selector.component';
import { TablaResultadoComponent } from './commons/tabla-resultado/tabla-resultado.component';
import { BuscadorColegiadosComponent } from './commons/buscador-colegiados/buscador-colegiados.component';
import { FiltroBuscadorColegiadosComponent } from './commons/buscador-colegiados/filtro-buscador-colegiados/filtro-buscador-colegiados.component';
import { TablaBuscadorColegiadosComponent } from './commons/buscador-colegiados/tabla-buscador-colegiados/tabla-buscador-colegiados.component';
import { MigasDePanComponent } from './commons/migas-de-pan/migas-de-pan.component';
import { FormularioBusquedaComponent } from './features/sjcs/oficio/cargas-masivas-oficio/formulario-busqueda/formulario-busqueda.component';
import { FormularioSubidaComponent } from './features/sjcs/oficio/cargas-masivas-oficio/formulario-subida/formulario-subida.component';
import { ListaArchivosComponent } from './features/sjcs/oficio/cargas-masivas-oficio/lista-archivos/lista-archivos.component';

import { DatePickerRangeComponent } from './commons/date-picker-range/date-picker-range.component';
import { HoraComponent } from './commons/hora/hora.component';
import { InputDivididoComponent } from './commons/input-dividido/input-dividido.component';
import { TablaResultadoMixComponent } from './commons/tabla-resultado-mix/tabla-resultado-mix.component';
import { Paginador3Module } from './commons/paginador3/paginador3.module'
import {MatTooltipModule} from '@angular/material/tooltip';

//OFICIO
import { TablaResultadoDesplegableComponent } from './commons/tabla-resultado-desplegable/tabla-resultado-desplegable.component';
import { TablaResultadoDesplegableAEService } from './commons/tabla-resultado-desplegable/tabla-resultado-desplegable-ae.service';
import { TablaResultadoDesplegableJEService } from './commons/tabla-resultado-desplegable/tabla-resultado-desplegable-je.service';

//OFICIO > DESIGNACIONES
import { FichaDesignacionesComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/ficha-designaciones.component';
import { DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-datos-facturacion-designa/detalle-tarjeta-datos-facturacion-ficha-designacion-oficio.component';
import { DetalleTarjetaDatosGeneralesFichaDesignacionOficioComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-datos-generales-designa/detalle-tarjeta-datos-generales-ficha-designacion-oficio.component';
import { DetalleTarjetaDetalleFichaDesignacionOficioComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-detalle-designa/detalle-tarjeta-detalle-ficha-designacion-oficio.component';
import { DetalleTarjetaDocumentacionFichaDesignacionOficioComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-documentacion-designa/detalle-tarjeta-documentacion-ficha-designacion-oficio.component';
import { TablaSimpleComponent } from './commons/tabla-simple/tabla-simple.component';

import { TablaJustificacionExpresComponent } from './features/sjcs/oficio/designaciones/tabla-justificacion-expres/tabla-justificacion-expres.component';
import { GestionDesignacionesComponent } from './features/sjcs/oficio/designaciones/gestion-designaciones/gestion-designaciones.component'
import { FiltroDesignacionesComponent } from './features/sjcs/oficio/designaciones/filtro-designaciones/filtro-designaciones.component';
import { DesignacionesComponent } from './features/sjcs/oficio/designaciones/designaciones.component';
import { DetalleTarjetaActuacionesFichaDesignacionOficioComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/detalle-tarjeta-actuaciones-designa.component';
import { DetalleTarjetaProcuradorFichaDesignacionOficioComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-procurador-designa/detalle-tarjeta-procurador-ficha-designacion-oficio.component';
import { Paginador2Module } from './features/sjcs/oficio/designaciones/ficha-designaciones/paginador2/paginador2.module';
import { FichaActuacionComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/ficha-actuacion/ficha-actuacion.component';
import { TarjetaDatosGenFichaActComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/ficha-actuacion/tarjeta-datos-gen-ficha-act/tarjeta-datos-gen-ficha-act.component';
import { TarjetaJusFichaActComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/ficha-actuacion/tarjeta-jus-ficha-act/tarjeta-jus-ficha-act.component';
import { TarjetaDatosFactFichaActComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/ficha-actuacion/tarjeta-datos-fact-ficha-act/tarjeta-datos-fact-ficha-act.component';
import { TarjetaDocFichaActComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/ficha-actuacion/tarjeta-doc-ficha-act/tarjeta-doc-ficha-act.component';
import { TarjetaHisFichaActComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/ficha-actuacion/tarjeta-his-ficha-act/tarjeta-his-ficha-act.component';
import { TarjetaRelFichaActComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/ficha-actuacion/tarjeta-rel-ficha-act/tarjeta-rel-ficha-act.component';
import { DetalleTarjetaRelacionesDesignaComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-relaciones-designa/detalle-tarjeta-relaciones-designa.component';
import { DetalleTarjetaComunicacionesDesignaComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-comunicaciones-designa/detalle-tarjeta-comunicaciones-designa.component';
import { TablaResultadoMixDocDesigService } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-documentacion-designa/tabla-resultado-mix-doc-desig.service';

//EJG
import { ImpugnacionComponent } from './features/sjcs/ejg/gestion-ejg/impugnacion/impugnacion.component';
import { ResolucionComponent } from './features/sjcs/ejg/gestion-ejg/resolucion/resolucion.component';
import { InformeCalificacionComponent } from './features/sjcs/ejg/gestion-ejg/informe-calificacion/informe-calificacion.component';
import { DocumentacionComponent } from './features/sjcs/ejg/gestion-ejg/documentacion/documentacion.component';
import { EstadosComponent } from './features/sjcs/ejg/gestion-ejg/estados/estados.component';
import { RelacionesComponent } from './features/sjcs/ejg/gestion-ejg/relaciones/relaciones.component';
import { ExpedientesEconomicosComponent } from './features/sjcs/ejg/gestion-ejg/expedientes-economicos/expedientes-economicos.component';
import { ServiciosTramitacionComponent } from './features/sjcs/ejg/gestion-ejg/servicios-tramitacion/servicios-tramitacion.component';
import { UnidadFamiliarComponent } from './features/sjcs/ejg/gestion-ejg/unidad-familiar/unidad-familiar.component';
import { DatosGeneralesEjgComponent } from './features/sjcs/ejg/gestion-ejg/datos-generales-ejg/datos-generales-ejg.component';
import { EJGComponent } from './features/sjcs/ejg/ejg.component';
import { TablaEjgComponent } from './features/sjcs/ejg/tabla-ejg/tabla-ejg.component';
import { FiltrosEjgComponent } from './features/sjcs/ejg/filtros-busqueda-ejg/filtros-ejg.component';
import { GestionEjgComponent } from './features/sjcs/ejg/gestion-ejg/gestion-ejg.component';
import { AddExpedienteComponent } from './features/sjcs/ejg/gestion-ejg/datos-generales-ejg/add-expediente/add-expediente.component';
import { ComunicacionesEJGComponent } from './features/sjcs/ejg/gestion-ejg/comunicaciones/comunicaciones-ejg.component';
import { RegtelEjgComponent } from './features/sjcs/ejg/gestion-ejg/regtel-ejg/regtel-ejg.component';
import { ProcuradorPreDesignacionComponent } from './features/sjcs/ejg/gestion-ejg/procurador-pre-designacion/procurador-pre-designacion.component';
import { ContrariosPreDesignacionComponent } from './features/sjcs/ejg/gestion-ejg/contrarios-pre-designacion/contrarios-pre-designacion.component';
import { DefensaJuridicaComponent } from './features/sjcs/ejg/gestion-ejg/defensa-juridica/defensa-juridica.component';


import { SigaStorageService } from './siga-storage.service';
import { FichaCambioLetradoComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-letrados-designa/ficha-cambio-letrado/ficha-cambio-letrado.component';
import { LetradoEntranteComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-letrados-designa/ficha-cambio-letrado/letrado-entrante/letrado-entrante.component';
import { LetradoSalienteComponent } from './features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-letrados-designa/ficha-cambio-letrado/letrado-saliente/letrado-saliente.component';

//PRODUCTOS Y SERVICIOS
import { TiposProductosComponent } from './features/facturacion/maestros/tipos-productos/tipos-productos.component';
import { TiposServiciosComponent } from './features/facturacion/maestros/tipos-servicios/tipos-servicios.component';
import { ProductosComponent } from './features/facturacion/productos/productos.component';
import { FiltrosProductosComponent } from './features/facturacion/productos/filtros-productos/filtros-productos.component';
import { GestionProductosComponent } from './features/facturacion/productos/gestion-productos/gestion-productos.component';
import { FichaProductosComponent } from './features/facturacion/productos/ficha-productos/ficha-productos.component';
import { DigitDecimaNumberDirective } from './commons/directives/digit-decima-number.directive';
import { DetalleTarjetaDatosGeneralesFichaProductosFacturacionComponent } from './features/facturacion/productos/ficha-productos/detalle-tarjeta-datos-generales-ficha-productos-facturacion/detalle-tarjeta-datos-generales-ficha-productos-facturacion.component';
import { DetalleTarjetaFormasPagosFichaProductoFacturacionComponent } from './features/facturacion/productos/ficha-productos/detalle-tarjeta-formas-pagos-ficha-producto-facturacion/detalle-tarjeta-formas-pagos-ficha-producto-facturacion.component';
import { ServiciosComponent } from './features/facturacion/servicios/servicios.component';
import { FiltrosServiciosComponent } from './features/facturacion/servicios/filtros-servicios/filtros-servicios.component';
import { GestionServiciosComponent } from './features/facturacion/servicios/gestion-servicios/gestion-servicios.component';
import { TarjetaClienteCompraSuscripcionComponent } from './features/facturacion/ficha-compra-suscripcion/tarjeta-cliente-compra-suscripcion/tarjeta-cliente-compra-suscripcion.component';
import { FichaServiciosComponent } from './features/facturacion/servicios/ficha-servicios/ficha-servicios.component';
import { DetalleTarjetaDatosGeneralesFichaServiciosFacturacionComponent } from './features/facturacion/servicios/ficha-servicios/detalle-tarjeta-datos-generales-ficha-servicios-facturacion/detalle-tarjeta-datos-generales-ficha-servicios-facturacion.component';
import { DetalleTarjetaFormasPagosFichaServiciosFacturacionComponent } from './features/facturacion/servicios/ficha-servicios/detalle-tarjeta-formas-pagos-ficha-servicios-facturacion/detalle-tarjeta-formas-pagos-ficha-servicios-facturacion.component';
import { TarjetaSolicitudCompraSuscripcionComponent } from './features/facturacion/ficha-compra-suscripcion/tarjeta-solicitud-compra-suscripcion/tarjeta-solicitud-compra-suscripcion.component';
import { FichaCuentaBancariaComponent } from './features/facturacion/gestion-cuentas-bancarias/ficha-cuenta-bancaria/ficha-cuenta-bancaria.component';
 import { FiltrosSeriesFacturaComponent } from './features/facturacion/series-factura/filtros-series-factura/filtros-series-factura.component';
 import { TablaSeriesFacturaComponent } from './features/facturacion/series-factura/tabla-series-factura/tabla-series-factura.component';
import { GestionSeriesFacturaComponent } from './features/facturacion/series-factura/gestion-series-factura/gestion-series-factura.component';
import { CompraProductosComponent } from './features/facturacion/compra-productos/compra-productos.component';
import { TarjetaFiltroCompraProductosComponent } from './features/facturacion/compra-productos/tarjeta-filtro-compra-productos/tarjeta-filtro-compra-productos.component';
import { TarjetaListaCompraProductosComponent } from './features/facturacion/compra-productos/tarjeta-lista-compra-productos/tarjeta-lista-compra-productos.component';
import { DetalleTarjetaPrecioFichaServiciosFacturacionComponent } from './features/facturacion/servicios/ficha-servicios/detalle-tarjeta-precio-ficha-servicios-facturacion/detalle-tarjeta-precio-ficha-servicios-facturacion.component';
import { TarjetaProductosCompraSuscripcionComponent } from './features/facturacion/ficha-compra-suscripcion/tarjeta-productos-compra-suscripcion/tarjeta-productos-compra-suscripcion.component';
import { TarjetaFacturaCompraSuscripcionComponent } from './features/facturacion/ficha-compra-suscripcion/tarjeta-factura-compra-suscripcion/tarjeta-factura-compra-suscripcion.component';
import { QueryBuilderModule } from '@syncfusion/ej2-angular-querybuilder';
import { enableRipple } from '@syncfusion/ej2-base';
import { MatSlideToggleModule } from '@angular/material';
import { DatosGeneralesSeriesFacturaComponent } from './features/facturacion/series-factura/gestion-series-factura/datos-generales-series-factura/datos-generales-series-factura.component';
import { DestinatariosIndividualesSeriesFacturaComponent } from './features/facturacion/series-factura/gestion-series-factura/destinatarios-individuales-series-factura/destinatarios-individuales-series-factura.component';
import { DestinatariosEtiquetasSeriesFacturaComponent } from './features/facturacion/series-factura/gestion-series-factura/destinatarios-etiquetas-series-factura/destinatarios-etiquetas-series-factura.component';
import { ObservacionesSeriesFacturaComponent } from './features/facturacion/series-factura/gestion-series-factura/observaciones-series-factura/observaciones-series-factura.component';
import { DestinatariosListaSeriesFacturaComponent } from './features/facturacion/series-factura/gestion-series-factura/destinatarios-lista-series-factura/destinatarios-lista-series-factura.component';
import { PagoAutomaticoSeriesFacturaComponent } from './features/facturacion/series-factura/gestion-series-factura/pago-automatico-series-factura/pago-automatico-series-factura.component';
import { ExportacionSeriesFacturaComponent } from './features/facturacion/series-factura/gestion-series-factura/exportacion-series-factura/exportacion-series-factura.component';
import { TraspasoSeriesFacturaComponent } from './features/facturacion/series-factura/gestion-series-factura/traspaso-series-factura/traspaso-series-factura.component';
import { ContadorSeriesFacturaComponent } from './features/facturacion/series-factura/gestion-series-factura/contador-series-factura/contador-series-factura.component';
import { ContadorRectSeriesFacturaComponent } from './features/facturacion/series-factura/gestion-series-factura/contador-rect-series-factura/contador-rect-series-factura.component';
import { GeneracionSeriesFacturaComponent } from './features/facturacion/series-factura/gestion-series-factura/generacion-series-factura/generacion-series-factura.component';
import { EnvioSeriesFacturaComponent } from './features/facturacion/series-factura/gestion-series-factura/envio-series-factura/envio-series-factura.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { RadioButtonModule as RadioButtonEJSModule} from '@syncfusion/ej2-angular-buttons';
import { TarjetaDescuentosAnticiposCompraSuscripcionComponent } from './features/facturacion/ficha-compra-suscripcion/tarjeta-descuentos-anticipos-compra-suscripcion/tarjeta-descuentos-anticipos-compra-suscripcion.component';
import { ConstructorConsultasComponent } from './features/informes-comunicaciones/consultas/ficha-consulta/constructor-consultas/constructor-consultas.component';
import { FiltrosBusquedaAdeudosComponent } from './features/facturacion/ficheros-adeudos/filtros-busqueda-adeudos/filtros-busqueda-adeudos.component';
import { TablaAdeudosComponent } from './features/facturacion/ficheros-adeudos/tabla-adeudos/tabla-adeudos.component';
import { GestionAdeudosComponent } from './features/facturacion/ficheros-adeudos/gestion-adeudos/gestion-adeudos.component';
import { DatosGeneralesCuentaBancariaComponent } from './features/facturacion/gestion-cuentas-bancarias/ficha-cuenta-bancaria/datos-generales-cuenta-bancaria/datos-generales-cuenta-bancaria.component';
import { ComisionCuentaBancariaComponent } from './features/facturacion/gestion-cuentas-bancarias/ficha-cuenta-bancaria/comision-cuenta-bancaria/comision-cuenta-bancaria.component';
import { ConfiguracionCuentaBancariaComponent } from './features/facturacion/gestion-cuentas-bancarias/ficha-cuenta-bancaria/configuracion-cuenta-bancaria/configuracion-cuenta-bancaria.component';
import { UsoFicherosCuentaBancariaComponent } from './features/facturacion/gestion-cuentas-bancarias/ficha-cuenta-bancaria/uso-ficheros-cuenta-bancaria/uso-ficheros-cuenta-bancaria.component';
import { UsosSufijosCuentaBancariaComponent } from './features/facturacion/gestion-cuentas-bancarias/ficha-cuenta-bancaria/usos-sufijos-cuenta-bancaria/usos-sufijos-cuenta-bancaria.component';
import { DatosGeneracionAdeudosComponent } from './features/facturacion/ficheros-adeudos/gestion-adeudos/datos-generacion-adeudos/datos-generacion-adeudos.component';
import { CuentaEntidadAdeudosComponent } from './features/facturacion/ficheros-adeudos/gestion-adeudos/cuenta-entidad-adeudos/cuenta-entidad-adeudos.component';
import { FacturasAdeudosComponent } from './features/facturacion/ficheros-adeudos/gestion-adeudos/facturas-adeudos/facturas-adeudos.component';
import { FacturacionAdeudosComponent } from './features/facturacion/ficheros-adeudos/gestion-adeudos/facturacion-adeudos/facturacion-adeudos.component';
import { CuotasSuscripcionesComponent } from './features/facturacion/cuotas-suscripciones/cuotas-suscripciones.component';
import { TarjetaFiltroCuotasSuscripcionesComponent } from './features/facturacion/cuotas-suscripciones/tarjeta-filtro-cuotas-suscripciones/tarjeta-filtro-cuotas-suscripciones.component';
import { TarjetaListaCuotasSuscripcionesComponent } from './features/facturacion/cuotas-suscripciones/tarjeta-lista-cuotas-suscripciones/tarjeta-lista-cuotas-suscripciones.component';
import { TarjetaServiciosCompraSuscripcionComponent } from './features/facturacion/ficha-compra-suscripcion/tarjeta-servicios-compra-suscripcion/tarjeta-servicios-compra-suscripcion.component';
import { FactProgramadasComponent } from './features/facturacion/fact-programadas/fact-programadas.component';
import { FiltrosFactProgramadasComponent } from './features/facturacion/fact-programadas/filtros-fact-programadas/filtros-fact-programadas.component';
import { TablaFactProgramadasComponent } from './features/facturacion/fact-programadas/tabla-fact-programadas/tabla-fact-programadas.component';
import { FichaFactProgramadasComponent } from './features/facturacion/fact-programadas/ficha-fact-programadas/ficha-fact-programadas.component';
import { DatosGeneralesFactProgramadasComponent } from './features/facturacion/fact-programadas/ficha-fact-programadas/datos-generales-fact-programadas/datos-generales-fact-programadas.component';
import { GenAdeudosFactProgramadasComponent } from './features/facturacion/fact-programadas/ficha-fact-programadas/gen-adeudos-fact-programadas/gen-adeudos-fact-programadas.component';
import { GenFacturaFactProgramadasComponent } from './features/facturacion/fact-programadas/ficha-fact-programadas/gen-factura-fact-programadas/gen-factura-fact-programadas.component';
import { EnvioFactProgramadasComponent } from './features/facturacion/fact-programadas/ficha-fact-programadas/envio-fact-programadas/envio-fact-programadas.component';
import { TraspasoFactProgramadasComponent } from './features/facturacion/fact-programadas/ficha-fact-programadas/traspaso-fact-programadas/traspaso-fact-programadas.component';
import { SerieFacturaFactProgramadasComponent } from './features/facturacion/fact-programadas/ficha-fact-programadas/serie-factura-fact-programadas/serie-factura-fact-programadas.component';
import { InfoFacturaFactProgramadasComponent } from './features/facturacion/fact-programadas/ficha-fact-programadas/info-factura-fact-programadas/info-factura-fact-programadas.component';
import { FiltrosBusquedaTransferenciasComponent } from './features/facturacion/ficheros-transferencia/filtros-busqueda-transferencias/filtros-busqueda-transferencias.component';
import { TablaFicherosTransferenciasComponent } from './features/facturacion/ficheros-transferencia/tabla-ficheros-transferencias/tabla-ficheros-transferencias.component';
import { GestionFicherosTransferenciasComponent } from './features/facturacion/ficheros-transferencia/gestion-ficheros-transferencias/gestion-ficheros-transferencias.component';
import { DatosGeneracionFichTransferenciasComponent } from './features/facturacion/ficheros-transferencia/gestion-ficheros-transferencias/datos-generacion-fich-transferencias/datos-generacion-fich-transferencias.component';
import { CargasMasivasComprasComponent } from './features/facturacion/cargas-masivas-compras/cargas-masivas-compras.component';
import { TarjetaFicheroModeloCmcComponent } from './features/facturacion/cargas-masivas-compras/tarjeta-fichero-modelo-cmc/tarjeta-fichero-modelo-cmc.component';
import { TarjetaSubidaFicheroCmcComponent } from './features/facturacion/cargas-masivas-compras/tarjeta-subida-fichero-cmc/tarjeta-subida-fichero-cmc.component';
import { TarjetaBusquedaCmcComponent } from './features/facturacion/cargas-masivas-compras/tarjeta-busqueda-cmc/tarjeta-busqueda-cmc.component';
import { TarjetaListadoCmcComponent } from './features/facturacion/cargas-masivas-compras/tarjeta-listado-cmc/tarjeta-listado-cmc.component';
import { MonederoComponent } from './features/facturacion/monederos/monederos.component';
import { TarjetaListaMonederosComponent } from  './features/facturacion/monederos/tarjeta-lista-monederos/tarjeta-lista-monederos.component';
import { TarjetaFiltroMonederosComponent } from './features/facturacion/monederos/tarjeta-filtro-monederos/tarjeta-filtro-monederos.component';
import { FichaMonederoComponent } from './features/facturacion/monederos/ficha-monedero/ficha-monedero.component';
import { DatosGeneralesMonederoComponent } from './features/facturacion/monederos/ficha-monedero/datos-generales-monedero/datos-generales-monedero.component';
import { MovimientosMonederoComponent } from './features/facturacion/monederos/ficha-monedero/movimientos-monedero/movimientos-monedero.component';
import { ServiciosAsociadosMonederoComponent } from './features/facturacion/monederos/ficha-monedero/servicios-asociados-monedero/servicios-asociados-monedero.component';
import { TablaFicherosDevolucionesComponent } from './features/facturacion/devoluciones/ficheros-devoluciones/tabla-ficheros-devoluciones/tabla-ficheros-devoluciones.component';
import { FiltrosFicherosDevolucionesComponent } from './features/facturacion/devoluciones/ficheros-devoluciones/filtros-ficheros-devoluciones/filtros-ficheros-devoluciones.component';
import { FichaFicherosDevolucionesComponent } from './features/facturacion/devoluciones/ficheros-devoluciones/ficha-ficheros-devoluciones/ficha-ficheros-devoluciones.component';
import { FiltrosFacturasComponent } from './features/facturacion/facturas/filtros-facturas/filtros-facturas.component';
import { TablaFacturasComponent } from './features/facturacion/facturas/tabla-facturas/tabla-facturas.component';
import { GestionFacturasComponent } from './features/facturacion/facturas/gestion-facturas/gestion-facturas.component';
import { DatosCargaDevolucionesComponent } from './features/facturacion/devoluciones/ficheros-devoluciones/ficha-ficheros-devoluciones/datos-carga-devoluciones/datos-carga-devoluciones.component';
import { ObservacionesFacturasComponent } from './features/facturacion/facturas/gestion-facturas/observaciones-facturas/observaciones-facturas.component';
import { DatosGeneralesFacturasComponent } from './features/facturacion/facturas/gestion-facturas/datos-generales-facturas/datos-generales-facturas.component';
import { EstadosPagosFacturasComponent } from './features/facturacion/facturas/gestion-facturas/estados-pagos-facturas/estados-pagos-facturas.component';
import { ObservacionesRectificativaFacturasComponent } from './features/facturacion/facturas/gestion-facturas/observaciones-rectificativa-facturas/observaciones-rectificativa-facturas.component';
import { LineasFacturasComponent } from './features/facturacion/facturas/gestion-facturas/lineas-facturas/lineas-facturas.component';
import { ComunicacionesFacturasComponent } from './features/facturacion/facturas/gestion-facturas/comunicaciones-facturas/comunicaciones-facturas.component';
import { ClienteFacturasComponent } from './features/facturacion/facturas/gestion-facturas/cliente-facturas/cliente-facturas.component';
import { DeudorFacturasComponent } from './features/facturacion/facturas/gestion-facturas/deudor-facturas/deudor-facturas.component';
import { FacturacionFacturasComponent } from './features/facturacion/facturas/gestion-facturas/facturacion-facturas/facturacion-facturas.component';
import { TablaExportacionesContabilidadComponent} from './features/facturacion/contabilidad/tabla-exportaciones-contabilidad/tabla-exportaciones-contabilidad.component';
import { AbonosSCJSComponent } from './features/sjcs/facturacionSJCS/abonos_SJCS/abonos-sjcs.component';
import { FiltrosAbonosSCJSComponent } from './features/sjcs/facturacionSJCS/abonos_SJCS/filtros-abonos-sjcs/filtros-abonos-sjcs.component';
import { TablaAbonosSCJSComponent } from './features/sjcs/facturacionSJCS/abonos_SJCS/tabla-abonos-sjcs/tabla-abonos-sjcs.component';
import { FichaAbonosSCJSComponent } from './features/sjcs/facturacionSJCS/abonos_SJCS/ficha-abonos-sjcs/ficha-abonos-sjcs.component';

enableRipple(true);

import { GuardiaModule } from './features/sjcs/guardia/guardia.module';
import { RetencionesComponent } from './features/sjcs/facturacionSJCS/retenciones/retenciones.component';
import { FiltroBusquedaRetencionesComponent } from './features/sjcs/facturacionSJCS/retenciones/filtro-busqueda-retenciones/filtro-busqueda-retenciones.component';
import { TablaBusquedaRetencionesComponent } from './features/sjcs/facturacionSJCS/retenciones/tabla-busqueda-retenciones/tabla-busqueda-retenciones.component';
import { TablaBusquedaRetencionesAplicadasComponent } from './features/sjcs/facturacionSJCS/retenciones/tabla-busqueda-retenciones-aplicadas/tabla-busqueda-retenciones-aplicadas.component';
import { TablaAplicacionRetencionesComponent } from './features/sjcs/facturacionSJCS/retenciones/tabla-busqueda-retenciones-aplicadas/tabla-aplicacion-retenciones/tabla-aplicacion-retenciones.component';
import { FichaRetencionJudicialComponent } from './features/sjcs/facturacionSJCS/retenciones/ficha-retencion-judicial/ficha-retencion-judicial.component';
import { TarjetaColegiadoComponent } from './features/sjcs/facturacionSJCS/retenciones/ficha-retencion-judicial/tarjeta-colegiado/tarjeta-colegiado.component';
import { TarjetaDatosRetencionComponent } from './features/sjcs/facturacionSJCS/retenciones/ficha-retencion-judicial/tarjeta-datos-retencion/tarjeta-datos-retencion.component'
import { TarjetaAplicacionEnPagosComponent } from './features/sjcs/facturacionSJCS/retenciones/ficha-retencion-judicial/tarjeta-aplicacion-en-pagos/tarjeta-aplicacion-en-pagos.component';
import { RetencionesService } from './features/sjcs/facturacionSJCS/retenciones/retenciones.service';
import { BaremosDeGuardiaComponent } from './features/sjcs/facturacionSJCS/baremos-de-guardia/baremos-de-guardia.component';
import { FiltroBusquedaBaremosComponent } from './features/sjcs/facturacionSJCS/baremos-de-guardia/filtro-busqueda-baremos/filtro-busqueda-baremos.component';
import { CertificacionFacComponent } from './features/sjcs/facturacionSJCS/certificacion-fac/certificacion-fac.component';
import { FichaCertificacionFacComponent } from './features/sjcs/facturacionSJCS/certificacion-fac/ficha-certificacion-fac/ficha-certificacion-fac.component';
import { TablaCertificacionFacComponent } from './features/sjcs/facturacionSJCS/certificacion-fac/tabla-certificacion-fac/tabla-certificacion-fac.component';
import { FiltroCertificacionFacComponent } from './features/sjcs/facturacionSJCS/certificacion-fac/filtro-certificacion-fac/filtro-certificacion-fac.component';
import { TarjetaFacturacionComponent } from './features/sjcs/facturacionSJCS/certificacion-fac/ficha-certificacion-fac/tarjeta-facturacion/tarjeta-facturacion.component';
import { TarjetaMovimientosVariosAsociadosComponent } from './features/sjcs/facturacionSJCS/certificacion-fac/ficha-certificacion-fac/tarjeta-movimientos-varios-asociados/tarjeta-movimientos-varios-asociados.component';
import { TarjetaMovimientosVariosAplicadosComponent } from './features/sjcs/facturacionSJCS/certificacion-fac/ficha-certificacion-fac/tarjeta-movimientos-varios-aplicados/tarjeta-movimientos-varios-aplicados.component';
import { FichaBaremosDeGuardiaComponent } from './features/sjcs/facturacionSJCS/baremos-de-guardia/ficha-baremos-de-guardia/ficha-baremos-de-guardia.component';
import { FichaBarDatosGeneralesComponent } from './features/sjcs/facturacionSJCS/baremos-de-guardia/ficha-baremos-de-guardia/ficha-bar-datos-generales/ficha-bar-datos-generales.component';
import { FichaBarConfiFacComponent } from './features/sjcs/facturacionSJCS/baremos-de-guardia/ficha-baremos-de-guardia/ficha-bar-confi-fac/ficha-bar-confi-fac.component';
import { FichaBarConfiAdiComponent } from './features/sjcs/facturacionSJCS/baremos-de-guardia/ficha-baremos-de-guardia/ficha-bar-confi-adi/ficha-bar-confi-adi.component';
import { TablaGenerarImpreso190Component } from './features/sjcs/facturacionSJCS/generar-impreso190/tabla-generar-impreso190/tabla-generar-impreso190.component';
import { FiltroGenerarImpreso190Component } from './features/sjcs/facturacionSJCS/generar-impreso190/filtro-generar-impreso190/filtro-generar-impreso190.component';
import { BuscadorListaGuardiasComponent } from './features/sjcs/guardia/definir-listas-guardias/buscador-lista-guardias/buscador-lista-guardias.component';
import { CargasMasivasGuardiaComponent } from './features/sjcs/guardia/cargas-masivas-guardia/cargas-masivas-guardia.component';
import { FormularioBusquedaGuardiaComponent } from './features/sjcs/guardia/cargas-masivas-guardia/formulario-busqueda-guardia/formulario-busqueda-guardia.component';
import { FormularioSubidaGuardiaComponent } from './features/sjcs/guardia/cargas-masivas-guardia/formulario-subida-guardia/formulario-subida-guardia.component';
import { ListaArchivosGuardiaComponent } from './features/sjcs/guardia/cargas-masivas-guardia/lista-archivos-guardia/lista-archivos-guardia.component';
import { FichaListaGuardiasTarjetaDatosGeneralesComponent } from './features/sjcs/guardia/definir-listas-guardias/ficha-lista-guardias/ficha-lista-guardias-tarjeta-datos-generales/ficha-lista-guardias-tarjeta-datos-generales.component';
import { FichaListaGuardiasTarjetaGuardiasComponent } from './features/sjcs/guardia/definir-listas-guardias/ficha-lista-guardias/ficha-lista-guardias-tarjeta-guardias/ficha-lista-guardias-tarjeta-guardias.component';
import { FichaListaGuardiasComponent } from './features/sjcs/guardia/definir-listas-guardias/ficha-lista-guardias/ficha-lista-guardias.component';
import { ResultadoListaGuardiasComponent } from './features/sjcs/guardia/definir-listas-guardias/resultado-lista-guardias/resultado-lista-guardias.component';
import { FiltrosGuardiaColegiadoComponent } from './features/sjcs/guardia/guardia-colegiado/filtros-guardia-colegiado/filtros-guardia-colegiado.component';

import { EjgComisionComponent } from './features/sjcs/ejg-comision/ejg-comision.component';
import { EjgComisionBusquedaComponent } from './features/sjcs/ejg-comision/ejg-comision-busqueda/ejg-comision-busqueda.component';
import { TablaEjgComisionComponent } from './features/sjcs/ejg-comision/tabla-ejg-comision/tabla-ejg-comision.component';
import { RemesasComponent } from './features/sjcs/remesas/remesas.component';
import { FiltroRemesasComponent } from './features/sjcs/remesas/filtro-remesas/filtro-remesas.component';
import { TablaRemesasComponent } from './features/sjcs/remesas/tabla-remesas/tabla-remesas.component';
import { FichaRemesasComponent } from './features/sjcs/remesas/ficha-remesas/ficha-remesas.component';
import { TarjetaDatosGeneralesComponent } from './features/sjcs/remesas/ficha-remesas/tarjeta-datos-generales/tarjeta-datos-generales.component';
import { TarjetaEjgsComponent } from './features/sjcs/remesas/ficha-remesas/tarjeta-ejgs/tarjeta-ejgs.component';
import { ActasComponent } from './features/sjcs/actas/actas.component';
import { FiltroActasComponent } from './features/sjcs/actas/filtro-actas/filtro-actas.component';
import { TablaActasComponent } from './features/sjcs/actas/tabla-actas/tabla-actas.component';

import { DatosGeneralesActasComponent } from './features/sjcs/actas/gestion-actas/datos-generales-actas/datos-generales-actas.component';
import { TarjetaListadoEjgsComponent } from './features/sjcs/actas/gestion-actas/tarjeta-listado-ejgs/tarjeta-listado-ejgs.component';
import { SelectorModule } from './commons/selector/selector.module';
import { AsistenciaExpresComponent } from './features/sjcs/guardia/guardias-asistencias/asistencia-expres/asistencia-expres.component';
import { BuscadorAsistenciaExpresComponent } from './features/sjcs/guardia/guardias-asistencias/asistencia-expres/buscador-asistencia-expres/buscador-asistencia-expres.component';
import { ResultadoAsistenciaExpresComponent } from './features/sjcs/guardia/guardias-asistencias/resultado-asistencia-expres/resultado-asistencia-expres.component';
import { BuscadorSolicitudesCentralitaComponent } from './features/sjcs/guardia/guardias-solicitudes-centralita/buscador-solicitudes-centralita/buscador-solicitudes-centralita.component';
import { ResultadoSolicitudesCentralitaComponent } from './features/sjcs/guardia/guardias-solicitudes-centralita/resultado-solicitudes-centralita/resultado-solicitudes-centralita.component';
import { FichaPreasistenciasComponent } from './features/sjcs/guardia/guardias-solicitudes-centralita/ficha-preasistencias/ficha-preasistencias.component';
import { AsistenciasFichaPreasistenciasComponent } from './features/sjcs/guardia/guardias-solicitudes-centralita/ficha-preasistencias/asistencias-ficha-preasistencias/asistencias-ficha-preasistencias.component';
import { FichaAsistenciaComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-asistencia/ficha-asistencia.component';
import { FichaAsistenciaTarjetaDatosGeneralesComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-asistencia/ficha-asistencia-tarjeta-datos-generales/ficha-asistencia-tarjeta-datos-generales.component';
import { FichaAsistenciaTarjetaAsistidoComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-asistencia/ficha-asistencia-tarjeta-asistido/ficha-asistencia-tarjeta-asistido.component';
import { FichaAsistenciaTarjetaContrariosComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-asistencia/ficha-asistencia-tarjeta-contrarios/ficha-asistencia-tarjeta-contrarios.component';
import { FichaAsistenciaTarjetaDefensaJuridicaComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-asistencia/ficha-asistencia-tarjeta-defensa-juridica/ficha-asistencia-tarjeta-defensa-juridica.component';
import { FichaAsistenciaTarjetaObservacionesComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-asistencia/ficha-asistencia-tarjeta-observaciones/ficha-asistencia-tarjeta-observaciones.component';
import { FichaAsistenciaTarjetaRelacionesComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-asistencia/ficha-asistencia-tarjeta-relaciones/ficha-asistencia-tarjeta-relaciones.component';

import { RemesasResultadosComponent } from './features/sjcs/remesas-resultados/remesas-resultados.component';
import { FiltroRemesasResultadosComponent } from './features/sjcs/remesas-resultados/filtro-remesas-resultados/filtro-remesas-resultados.component';
import { TablaRemesasResultadosComponent } from './features/sjcs/remesas-resultados/tabla-remesas-resultados/tabla-remesas-resultados.component';
import { FichaRemesasResultadosComponent } from './features/sjcs/remesas-resultados/ficha-remesas-resultados/ficha-remesas-resultados.component';
import { TarjetaDatosGeneralesRemesasResultadosComponent } from './features/sjcs/remesas-resultados/ficha-remesas-resultados/tarjeta-datos-generales-remesas-resultados/tarjeta-datos-generales-remesas-resultados.component';
import { TarjetaRemesasEnvioComponent } from './features/sjcs/remesas-resultados/ficha-remesas-resultados/tarjeta-remesas-envio/tarjeta-remesas-envio.component';
import { CargaMasivaProcuradoresComponent } from './features/sjcs/intercambios/carga-masiva-procuradores/carga-masiva-procuradores.component';
import { CargaDesignaProcuradorComponent } from './features/sjcs/intercambios/carga-designa-procurador/carga-designa-procurador.component';
import { TarjetaDatosCurricularesComponent } from './features/sjcs//intercambios/carga-masiva-procuradores/tarjta-datos-curriculares/tarjeta-datos-curriculares.component';
import { TarjetaListadoComponent } from './features/sjcs/intercambios/carga-masiva-procuradores/tarjeta-listado/tarjeta-listado.component';
import { RemesasResolucionesComponent } from './features/sjcs/remesas-resoluciones/remesas-resoluciones.component';
import { TablaRemesasResolucionesComponent } from './features/sjcs/remesas-resoluciones/tabla-remesas-resoluciones/tabla-remesas-resoluciones.component';
import { FiltroRemesasResolucionesComponent } from './features/sjcs/remesas-resoluciones/filtro-remesas-resoluciones/filtro-remesas-resoluciones.component';
import { FichaRemesasResolucionesComponent } from './features/sjcs/remesas-resoluciones/ficha-remesas-resoluciones/ficha-remesas-resoluciones.component';
import { TarjetaDatosGeneralesRemesasResolucionesComponent } from './features/sjcs/remesas-resoluciones/ficha-remesas-resoluciones/tarjeta-datos-generales-remesas-resoluciones/tarjeta-datos-generales-remesas-resoluciones.component';
import { FiltroCargaDesignaProcuradorComponent} from './features/sjcs/intercambios/carga-designa-procurador/filtro-carga-designa-procurador/filtro-carga-designa-procurador.component';
import { TablaCargaDesignaProcuradorComponent } from './features/sjcs/intercambios/carga-designa-procurador/tabla-carga-designa-procurador/tabla-carga-designa-procurador.component';
import { FichaCargaDesignaProcuradorComponent } from './features/sjcs/intercambios/carga-designa-procurador/ficha-carga-designa-procurador/ficha-carga-designa-procurador.component';
import { TarjetaDatosCargaDesignaProcuradorComponent } from './features/sjcs/intercambios/carga-designa-procurador/ficha-carga-designa-procurador/tarjeta-datos-carga-designa-procurador/tarjeta-datos-carga-designa-procurador.component';
import { ComunicacionesEntrantesComponent } from './features/informes-comunicaciones/comunicaciones-entrantes/comunicaciones-entrantes.component';
import { FichaAsistenciaTarjetaDocumentacionComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-asistencia/ficha-asistencia-tarjeta-documentacion/ficha-asistencia-tarjeta-documentacion.component';
import { FichaAsistenciaTarjetaCaracteristicasComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-asistencia/ficha-asistencia-tarjeta-caracteristicas/ficha-asistencia-tarjeta-caracteristicas.component';
import { FichaAsistenciaTarjetaActuacionesComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-asistencia/ficha-asistencia-tarjeta-actuaciones/ficha-asistencia-tarjeta-actuaciones.component';
import { FichaActuacionAsistenciaComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-actuacion-asistencia/ficha-actuacion-asistencia.component';
import { FichaActuacionAsistenciaTarjetaDatosGeneralesComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-actuacion-asistencia/ficha-actuacion-asistencia-tarjeta-datos-generales/ficha-actuacion-asistencia-tarjeta-datos-generales.component';
import { FichaActuacionAsistenciaTarjetaJustificacionComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-actuacion-asistencia/ficha-actuacion-asistencia-tarjeta-justificacion/ficha-actuacion-asistencia-tarjeta-justificacion.component';
import { FichaActuacionAsistenciaTarjetaHistoricoComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-actuacion-asistencia/ficha-actuacion-asistencia-tarjeta-historico/ficha-actuacion-asistencia-tarjeta-historico.component';
import { FichaActuacionAsistenciaTarjetaDocumentacionComponent } from './features/sjcs/guardia/guardias-asistencias/ficha-actuacion-asistencia/ficha-actuacion-asistencia-tarjeta-documentacion/ficha-actuacion-asistencia-tarjeta-documentacion.component';
import { BuscadorAsistenciasComponent } from './features/sjcs/guardia/guardias-asistencias/asistencia-expres/buscador-asistencias/buscador-asistencias.component';
import { ResultadoAsistenciasComponent } from './features/sjcs/guardia/guardias-asistencias/resultado-asistencias/resultado-asistencias.component';

import { GuardiaColegiadoComponent } from './features/sjcs/guardia/guardia-colegiado/guardia-colegiado.component';
import { GestionGuardiaColegiadoComponent } from './features/sjcs/guardia/guardia-colegiado/gestion-guardia-colegiado/gestion-guardia-colegiado.component';

import { TablaGuardiaColegiadoComponent } from './features/sjcs/guardia/guardia-colegiado/tabla-guardia-colegiado/tabla-guardia-colegiado.component';

import { CalendarioGestionGuardiaColegiadoComponent } from './features/sjcs/guardia/guardia-colegiado/gestion-guardia-colegiado/calendario-gestion-guardia-colegiado/calendario-gestion-guardia-colegiado.component';
import { ColegiadoGestionGuardiaColegiadoComponent } from './features/sjcs/guardia/guardia-colegiado/gestion-guardia-colegiado/colegiado-gestion-guardia-colegiado/colegiado-gestion-guardia-colegiado.component';
import { DatosGeneralesGestionGuardiaColegiadoComponent } from './features/sjcs/guardia/guardia-colegiado/gestion-guardia-colegiado/datos-generales-gestion-guardia-colegiado/datos-generales-gestion-guardia-colegiado.component';
import { GuardiaGestionGuardiaColegiadoComponent } from './features/sjcs/guardia/guardia-colegiado/gestion-guardia-colegiado/guardia-gestion-guardia-colegiado/guardia-gestion-guardia-colegiado.component';
import { PermutasGestionGuardiaColegiadoComponent } from './features/sjcs/guardia/guardia-colegiado/gestion-guardia-colegiado/permutas-gestion-guardia-colegiado/permutas-gestion-guardia-colegiado.component';
import { SustitucionesGestionGuardiaColegiadoComponent } from './features/sjcs/guardia/guardia-colegiado/gestion-guardia-colegiado/sustituciones-gestion-guardia-colegiado/sustituciones-gestion-guardia-colegiado.component';
import { TurnoGestionGuardiaColegiadoComponent } from './features/sjcs/guardia/guardia-colegiado/gestion-guardia-colegiado/turno-gestion-guardia-colegiado/turno-gestion-guardia-colegiado.component';
import { GuardiasSolicitudesCentralitaComponent } from './features/sjcs/guardia/guardias-solicitudes-centralita/guardias-solicitudes-centralita.component';
import { PartidosJudicialesComponent } from './features/sjcs/maestros/partidos-judiciales/partidas-judiciales.component';

import { TarjetaModule } from './commons/tarjeta/tarjeta.module';
import { TablaResultadoOrderModule } from './commons/tabla-resultado-order/tabla-resultado-order.module';
import { MovimientosVariosService } from './features/sjcs/facturacionSJCS/movimientos-varios/movimientos-varios.service';
import { MovimientosVariosModule } from './features/sjcs/facturacionSJCS/movimientos-varios/movimientos-varios.module';
import { TarjetaFacturacionGenericaModule } from './features/sjcs/facturacionSJCS/tarjeta-facturacion-generica/tarjeta-facturacion-generica.module';
import { RetencionesIrpfColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/retenciones-irpf-colegial/retenciones-irpf-colegial.component';
import { TablaBusquedaBaremosModule } from './features/sjcs/facturacionSJCS/baremos-de-guardia/tabla-busqueda-baremos/tabla-busqueda-baremos.module';
import { TiposAsistenciaComponent } from './features/sjcs/maestros/tiposAsistencia/tiposAsistencia.component';
import { TiposActuacionComponent } from './features/sjcs/maestros/tiposActuacion/tiposActuacion.component';
import { PaginadorModule } from './commons/paginador/paginador.module';
import { BusquedaRetencionesAplicadasComponent } from './features/sjcs/facturacionSJCS/busqueda-retenciones-aplicadas/busqueda-retenciones-aplicadas.component';
import { TarjetaDatosGeneralesCertificacionComponent } from './features/sjcs/facturacionSJCS/certificacion-fac/ficha-certificacion-fac/tarjeta-datos-generales/tarjeta-datos-generales-certificacion.component';
import { MaestrosModule } from './features/sjcs/maestros/maestros.module';
import { DatosGeneralesAbonosSJCSComponent } from './features/sjcs/facturacionSJCS/abonos_SJCS/ficha-abonos-sjcs/datos-generales-abonos-sjcs/datos-generales-abonos-sjcs.component';
import { SociedadAbonosSJCSComponent } from './features/sjcs/facturacionSJCS/abonos_SJCS/ficha-abonos-sjcs/socidad-abonos-sjcs/sociedad-abonos-sjcs.component';
import { PagoAbonosSJCSComponent } from './features/sjcs/facturacionSJCS/abonos_SJCS/ficha-abonos-sjcs/pago-abonos-sjcs/pago-abonos-sjcs.component';
import { ColegiadoAbonosSJCSComponent } from './features/sjcs/facturacionSJCS/abonos_SJCS/ficha-abonos-sjcs/colegiado-abonos-sjcs/colegiado-abonos-sjcs.component';
import { DestinatariosModule } from './features/sjcs/maestros/destinatarios-retenciones/destinatarios.module';
import { LineasAbonosComponent } from './features/sjcs/facturacionSJCS/abonos_SJCS/ficha-abonos-sjcs/lineas-abonos/lineas-abonos.component';
import { ObservacionesAbonosSJCSComponent } from './features/sjcs/facturacionSJCS/abonos_SJCS/ficha-abonos-sjcs/observaciones-abonos-sjcs/observaciones-abonos-sjcs.component';
import { EstadosPagosAbonosSJCSComponent } from './features/sjcs/facturacionSJCS/abonos_SJCS/ficha-abonos-sjcs/estados-pagos-abonos/estados-pagos-abonos-sjcs.component';

import { GestionExpedientesExeaComponent } from './features/expedientes-exea/gestion-expedientes-exea/gestion-expedientes-exea.component';
import { NuevoExpedienteExeaComponent } from './features/expedientes-exea/nuevo-expediente-exea/nuevo-expediente-exea.component';
import { ExpedientesFichaColegialComponent } from './features/censo/ficha-colegial/ficha-colegial-general/expedientes-ficha-colegial/expedientes-ficha-colegial.component';
import { SigaNoInterceptorServices } from './_services/sigaNoInterceptor.service';
import { FichaExpedienteExeaComponent } from './features/expedientes-exea/ficha-expediente-exea/ficha-expediente-exea.component';
import { FichaExpExeaDatosGeneralesComponent } from './features/expedientes-exea/ficha-expediente-exea/ficha-exp-exea-datos-generales/ficha-exp-exea-datos-generales.component';
import { FichaExpExeaDocumentacionComponent } from './features/expedientes-exea/ficha-expediente-exea/ficha-exp-exea-documentacion/ficha-exp-exea-documentacion.component';
import { FichaExpExeaHistoricoComponent } from './features/expedientes-exea/ficha-expediente-exea/ficha-exp-exea-historico/ficha-exp-exea-historico.component';
import { TablaFacturasSeleccionadasComponent } from './features/facturacion/facturas/tabla-facturas/tabla-facturas-seleccionadas/tabla-facturas-seleccionadas.component';
import { TablaAbonosSeleccionadasComponent } from './features/sjcs/facturacionSJCS/abonos_SJCS/tabla-abonos-sjcs/tabla-abonos-seleccionadas/tabla-abonos-seleccionadas.component';
import { FichaEnvioCamComponent } from './features/sjcs/facturacionSJCS/certificacion-fac/ficha-certificacion-fac/ficha-envio-cam/ficha-envio-cam.component';
import { DetalleSOJComponent } from './features/sjcs/soj/detalle-soj/detalle-soj.component';
import { ListaIntercambiosAltaEjgComponent } from './features/sjcs/ejg/gestion-ejg/lista-intercambios-alta-ejg/lista-intercambios-alta-ejg.component';
import { ListaIntercambiosDocumentacionEjgComponent } from './features/sjcs/ejg/gestion-ejg/lista-intercambios-documentacion-ejg/lista-intercambios-documentacion-ejg.component';
import { DatosGeneralesDetalleSojComponent } from './features/sjcs/soj/detalle-soj/datos-generales-detalle-soj/datos-generales-detalle-soj.component';
import { ServiciosTramitacionDetalleSojComponent } from './features/sjcs/soj/detalle-soj/servicios-tramitacion-detalle-soj/servicios-tramitacion-detalle-soj.component';
import { SolicitanteDetalleSojComponent } from './features/sjcs/soj/detalle-soj/solicitante-detalle-soj/solicitante-detalle-soj.component';
import { DocumentacionDetalleSojComponent } from './features/sjcs/soj/detalle-soj/documentacion-detalle-soj/documentacion-detalle-soj.component';

//classique
import { ContabilidadClassiqueComponent } from './features/facturacionClassique/contabilidad/contabilidad.component';
import { DevolucionManualClassiqueComponent } from './features/facturacionClassique/devoluciones/devolucion-manual/devolucion-manual.component';
import { FicherosDevolucionesClassiqueComponent } from './features/facturacionClassique/devoluciones/ficheros-devoluciones/ficheros-devoluciones.component';
import { FacturasClassiqueComponent } from './features/facturacionClassique/facturas/facturas.component';
import { FicherosAdeudosClassiqueComponent } from './features/facturacionClassique/ficheros-adeudos/ficheros-adeudos.component';
import { FicherosTransferenciaClassiqueComponent } from './features/facturacionClassique/ficheros-transferencia/ficheros-transferencia.component';
import { GestionCuentasBancariasClassiqueComponent } from './features/facturacionClassique/gestion-cuentas-bancarias/gestion-cuentas-bancarias.component';
import { SeriesFacturaClassiqueComponent } from './features/facturacionClassique/series-factura/series-factura.component';

import { GenerarImpreso190ClassiqueComponent } from './features/sjcsClassique/facturacionSJCS/generar-impreso190-Classique/generar-impreso190-Classique.component';
import { MantenimientoFacturacionComponent } from './features/sjcsClassique/facturacionSJCS/mantenimiento-facturacion/mantenimiento-facturacion.component';
import { PrevisionesComponent } from './features/sjcsClassique/facturacionSJCS/previsiones/previsiones.component';
import { MantenimientoPagosComponent } from './features/sjcsClassique/facturacionSJCS/mantenimiento-pagos/mantenimiento-pagos.component';
import { MovimientosVariosComponentClassique } from './features/sjcsClassique/facturacionSJCS/movimientos-varios-Classique/movimientos-varios-Classique.component';
import { TramosLECComponent } from './features/sjcsClassique/facturacionSJCS/tramos-lec/tramos-lec.component';
import { RetencionesJudicialesComponent } from './features/sjcsClassique/facturacionSJCS/retenciones-judiciales/retenciones-judiciales.component';
import { ResumenPagosComponent } from './features/sjcsClassique/facturacionSJCS/resumen-pagos/resumen-pagos.component';


import { EJGClassiqueComponent } from './features/sjcsClassique/ejgClassique/ejgClassique.component';
import { GestionActasClassiqueComponent } from './features/sjcsClassique/gestion-actas/gestion-actas.component';
import { DefinirListasGuardiasClassiqueComponent } from './features/sjcsClassique/guardiaClassique/definir-listas-guardias/definir-listas-guardias.component';
import { GuardiasAsistenciasClassiqueComponent } from './features/sjcsClassique/guardiaClassique/guardias-asistencias/guardias-asistencias.component';
import { GuardiasBajasTemporalesClassiqueComponent } from './features/sjcsClassique/guardiaClassique/guardias-bajas-temporales/guardias-bajas-temporales.component';
import { GuardiasCentralitaClassiqueComponent } from './features/sjcsClassique/guardiaClassique/guardias-centralita/guardias-centralita.component';
import { GuardiasIncompatibilidadesClassiqueComponent } from './features/sjcsClassique/guardiaClassique/guardias-incompatibilidades/guardias-incompatibilidades.component';
import { GuardiasSaltosCompensacionesClassiqueComponent } from './features/sjcsClassique/guardiaClassique/guardias-saltos-compensaciones/guardias-saltos-compensaciones.component';
import { ProgramacionCalendariosClassiqueComponent } from './features/sjcsClassique/guardiaClassique/programacionCalendarios/programacionCalendarios.component';
import { GuardiasSolicitudesTurnosClassiqueComponent } from './features/sjcsClassique/guardiaClassique/solicitudes-turnos/solicitudes-turnos.component';
import { VolanteExpresClassiqueComponent } from './features/sjcsClassique/guardiaClassique/volante-expres/volante-expres.component';
import { AreasYMateriasClassiqueComponent } from './features/sjcsClassique/maestros/areas-materias/areas-materias.component';
import { CalendarioLaboralClassiqueComponent } from './features/sjcsClassique/maestros/calendarioLaboral/calendarioLaboral.component';
import { DestinatariosRetencionesClassiqueComponent } from './features/sjcsClassique/maestros/destinatarios-retenciones/destinatarios-retenciones.component';
import { DocumentacionEJGClassiqueComponent } from './features/sjcsClassique/maestros/documentacion-ejg/documentacion-ejg.component';
import { MaestroPJClassiqueComponent } from './features/sjcsClassique/maestros/maestro-pj/maestro-pj.component';
import { MaestrosModulosClassiqueComponent } from './features/sjcsClassique/maestros/maestros-modulos/maestros-modulos.component';
import { MantenimientoComisariasClassiqueComponent } from './features/sjcsClassique/maestros/mantenimiento-comisarias/mantenimiento-comisarias.component';
import { MantenimientoJuzgadosClassiqueComponent } from './features/sjcsClassique/maestros/mantenimiento-juzgados/mantenimiento-juzgados.component';
import { MantenimientoPrisionesClassiqueComponent } from './features/sjcsClassique/maestros/mantenimiento-prisiones/mantenimiento-prisiones.component';
import { MantenimientoProcuradoresClassiqueComponent } from './features/sjcsClassique/maestros/mantenimiento-procuradores/mantenimiento-procuradores.component';
import { PartidasClassiqueComponent } from './features/sjcsClassique/maestros/partidas/partidas.component';
import { PartidosJudicialesClassiqueComponent } from './features/sjcsClassique/maestros/partidos-judiciales/partidos-judiciales.component';
import { RetencionesIRPFClassiqueComponent } from './features/sjcsClassique/maestros/retenciones-IRPF/retenciones-IRPF.component';
import { TiposAsistenciaClassiqueComponent } from './features/sjcsClassique/maestros/tiposAsistencia/tiposAsistencia.component';
import { ZonasYSubzonasClassiqueComponent } from './features/sjcsClassique/maestros/zonas-subzonas/zonas-subzonas.component';
import { BajasTemporalesClassiqueComponent } from './features/sjcsClassique/oficioClassique/bajas-temporales/bajas-temporales.component';
import { DesignacionesClassiqueComponent } from './features/sjcsClassique/oficioClassique/designaciones/designaciones.component';
import { SaltosYCompensacionesClassiqueComponent } from './features/sjcsClassique/oficioClassique/saltos-compensaciones/saltos-compensaciones.component';
import { SolicitudesTurnosGuardiasClassiqueComponent } from './features/sjcsClassique/oficioClassique/solicitudesTurnosGuardias/solicitudesTurnosGuardias.component';
import { TurnosClassiqueComponent } from './features/sjcsClassique/oficioClassique/turnos/turnos.component';
import { Paginador4Module } from './commons/paginador4/paginador4.module';


@NgModule({
	declarations: [
		GestionActasComponent,
		TarjetaDatosGeneralesCertificacionComponent,
		TablaResultadoDesplegableComponent,
		TablaJustificacionExpresComponent,
		GestionDesignacionesComponent,
		FiltroDesignacionesComponent,
		DesignacionesComponent,
		AppComponent,
		ImagePipe,
		DatePickerRangeComponent,
		HoraComponent,
		InputDivididoComponent,
		TablaSimpleComponent,

		MyIframeComponent,
		MenuComponent,
		LoginComponent,
		LoginDevelopComponent,
		LoginMultipleComponent,
		LogoutComponent,
		HeaderComponent,
		HomeComponent,
		CheckPermissionDirective,
		// Censo
		AuditoriaComponent,
		AccesoFichaPersonaComponent,
		MutualidadAbogaciaPlanUniversal,
		SearchColegiadosComponent,
		BusquedaGeneralComponent,
		SearchNoColegiadosComponent,
		BusquedaNoColegiadosComponent,
		CertificadosAcaComponent,
		ComisionesCargosComponent,
		SolicitudesGenericasComponent,
		SolicitudesEspecificasComponent,
		SolicitudesIncorporacionComponent,
		MutualidadAbogaciaSeguroAccidentes,
		AlterMutuaComponent,
		AlterMutuaRetaComponent,
		AlterMutuaOfertasComponent,
		NuevaIncorporacionComponent,
		ModificacionDatosComponent,
		DocumentacionSolicitudesComponent,
		MantenimientoGruposFijosComponent,
		MantenimientoMandatosComponent,
		BusquedaSancionesComponent,
		BusquedaColegiadosComponent,
		BusquedaColegiadosComponentI,
		EdicionCurricularesComponent,
		BusquedaLetradosComponent,
		MantenimientoDuplicadosComponent,
		MediadoresComponent,
		CargasPeriodicasComponent,
		ConfigurarPerfilComponent,
		CensoDocumentacionComponent,
		TipoCurricularComponent,
		SubtipoCurricularComponent,
		BusquedaColegiadosComponentNew,
		BusquedaPersonasJuridicas,
		DatosGenerales,
		DatosRegistralesComponent,
		DatosPersonaJuridicaComponent,
		DatosRetencionesComponent,
		DetalleIntegranteComponent,
		ServiciosInteresComponent,
		FacturacionSociedadesCensoComponent,
		ComunicacionSociedadesComponent,

		//Certificados
		ComunicacionInterprofesionalComponent,
		SolicitarCompraComponent,
		SolicitudCertificadosComponent,
		GestionSolicitudesComponent,
		MantenimientoCertificadosComponent,

		//Facturacion
		MantenimientoSufijosComponent,
		MonederoComponent,
		TarjetaListaMonederosComponent,
        TarjetaFiltroMonederosComponent,
		FacturaPlantillasComponent,
		GestionCuentasBancariasComponent,
		SeriesFacturaComponent,
		PrevisionesFacturaComponent,
		ProgramarFacturaComponent,
		GenerarFacturaComponent,
		MantenimientoFacturaComponent,
		EliminarFacturaComponent,
		FacturasComponent,
		FicherosAdeudosComponent,
		FicherosDevolucionesComponent,
		DevolucionManualComponent,
		AbonosComponent,
		FicherosTransferenciaComponent,
		ContabilidadComponent,
		CobrosRecobrosComponent,
		FacturasEmitidasComponent,

		//Productos y Servicios
		CategoriasProductoComponent,
		CategoriasServiciosComponent,
		MantenimientoProductosComponent,
		MantenimientoServiciosComponent,
		GestionarSolicitudesComponent,
		SolicitudCompraSubscripcionComponent,
		SolicitudAnulacionComponent,
		CargaComprasComponent,
		FichaCompraSuscripcionComponent,
		DetalleTarjetaFormasPagosFichaServiciosFacturacionComponent,
		TarjetaSolicitudCompraSuscripcionComponent,
		CompraProductosComponent,
		TarjetaFiltroCompraProductosComponent,
		TarjetaListaCompraProductosComponent,
		DetalleTarjetaPrecioFichaServiciosFacturacionComponent,
		TarjetaProductosCompraSuscripcionComponent,
		ConstructorConsultasComponent,
		TarjetaFacturaCompraSuscripcionComponent,
		TarjetaDescuentosAnticiposCompraSuscripcionComponent,
		CuotasSuscripcionesComponent,
		TarjetaFiltroCuotasSuscripcionesComponent,
		TarjetaListaCuotasSuscripcionesComponent,
		TarjetaServiciosCompraSuscripcionComponent,
		CargasMasivasComprasComponent,
		TarjetaFicheroModeloCmcComponent,
		TarjetaSubidaFicheroCmcComponent,
		TarjetaBusquedaCmcComponent,
		TarjetaListadoCmcComponent,

		//Expedientes
		TiposExpedientesComponent,
		GestionarExpedientesComponent,
		AlertasComponent,
		NuevoExpedienteComponent,

		//Justicia Gratuita
		ZonasYSubzonasComponent,
		AreasYMateriasComponent,
		CalendarioLaboralComponent,
		MantenimientoProcuradoresComponent,
		MantenimientoPrisionesComponent,
		MantenimientoComisariasComponent,
		MantenimientoJuzgadosComponent,
		MaestroPJComponent,
		SolicitudesTurnosGuardiasComponent,
		DetalleTarjetaDatosAdicionalesFichaDesignacionOficioComponent,
		DetalleTarjetaContrariosFichaDesignacionOficioComponent,
		DetalleTarjetaInteresadosFichaDesignacionOficioComponent,
		DetalleTarjetaLetradosDesignaComponent,
		FichaDesignacionesComponent,
		FichaCambioLetradoComponent,
		LetradoSalienteComponent,
		LetradoEntranteComponent,
		DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent,
		DetalleTarjetaDatosGeneralesFichaDesignacionOficioComponent,
		DetalleTarjetaDetalleFichaDesignacionOficioComponent,
		DetalleTarjetaDocumentacionFichaDesignacionOficioComponent,
		DetalleTarjetaActuacionesFichaDesignacionOficioComponent,
		GuardiasSolicitudesTurnosComponent,
		GuardiasBajasTemporalesComponent,
		GuardiasSaltosCompensacionesComponent,
		DefinirListasGuardiasComponent,
		GuardiasAsistenciasComponent,
		GuardiasSolicitudesCentralitaComponent,
		AsistenciaExpresComponent,
		BuscadorAsistenciaExpresComponent,
		ResultadoAsistenciaExpresComponent,
		VolanteExpresComponent,
		SOJComponent,
		DetalleSOJComponent,
		DatosGeneralesDetalleSojComponent,
		ServiciosTramitacionDetalleSojComponent,
		SolicitanteDetalleSojComponent,
		DocumentacionDetalleSojComponent,
		//Guardia Colegiado
		GuardiaColegiadoComponent,
		GestionGuardiaColegiadoComponent,
		FiltrosGuardiaColegiadoComponent,
		TablaGuardiaColegiadoComponent,
		CalendarioGestionGuardiaColegiadoComponent,
		ColegiadoGestionGuardiaColegiadoComponent,
		DatosGeneralesGestionGuardiaColegiadoComponent,
		GuardiaGestionGuardiaColegiadoComponent,
		PermutasGestionGuardiaColegiadoComponent,
		SustitucionesGestionGuardiaColegiadoComponent,
		TurnoGestionGuardiaColegiadoComponent,

		//EJG
		// EJGComponent,
		FiltrosEjgComponent,
		TablaEjgComponent,
		EJGComponent,
		GestionEjgComponent,
		DatosGeneralesEjgComponent,
		ServiciosTramitacionComponent,
		UnidadFamiliarComponent,
		ExpedientesEconomicosComponent,
		RelacionesComponent,
		EstadosComponent,
		DocumentacionComponent,
		InformeCalificacionComponent,
		ResolucionComponent,
		ImpugnacionComponent,
		EjgComisionComponent,
		/* RegtelComponent, */
		ComunicacionesComponent,
		AddExpedienteComponent,
		ComunicacionesEJGComponent,
		RegtelEjgComponent,
		BusquedaRetencionesAplicadasComponent,
		EnvioReintegrosXuntaComponent,
		JustificacionLetradoComponent,
		InformeFacturacionComponent,
		InformeFacturacionMultipleComponent,
		InformeFacturacionPersonalizadoComponent,
		FichaFacturacionComponent,
		FichaPagoComponent,
		CartaPagosColegiadosComponent,
		CartaFacturaColegiadoComponent,
		CertificadosPagosComponent,
		CertificadosIrpfComponent,
		ComunicaPreparacionComponent,
		ComunicaRemesaEnvioComponent,
		ComunicaRemesaResultadoComponent,
		ComunicaEnvioActualizacionComponent,
		ComunicaInfoEconomicaComponent,
		ComunicaCargaComponent,
		ComunicaResolucionesComponent,
		ComunicaDesignacionesComponent,
		CargasMasivasOficioComponent,
		CargasMasivasGuardiaComponent,
		DetalleTarjetaProcuradorFichaDesignacionOficioComponent,

		//Consultas
		RecuperarConsultasComponent,
		ConsultasListasDinamicasComponent,
		NuevaConsultaComponent,
		NuevaConsultaExpertaComponent,

		//Comunicaciones
		InformesGenericosComponent,
		DefinirTipoPlantillaComponent,
		ListaCorreosComponent,
		BandejaSalidaComponent,
		BandejaEntradaComponent,

		// Administracion
		CatalogosMaestros,
		CatalogosMaestrosComponent,
		GruposUsuarios,
		Etiquetas,
		AuditoriaUsuarios,
		GestionContadoresComponent,
		Catalogos,
		SeleccionarIdioma,
		Usuarios,
		GestionEntidad,
		ParametrosGenerales,
		EditarUsuarioComponent,
		EditarCatalogosMaestrosComponent,
		ContadoresComponent,
		GestionContadoresComponent,
		GestionAuditoriaComponent,
		PerfilesComponent,
		EditarPerfilesComponent,
		PermisosComponent,
		PoliticaCookiesComponent,
		DatosIntegrantesComponent,
		DatosBancariosComponent,
		ConsultarDatosBancariosComponent,
		// DatosCuentaBancariaComponent,
		// DatosMandatosComponent,
		// ListadoFicherosAnexosComponent,
		DatosDireccionesComponent,
		ConsultarDatosDireccionesComponent,
		ErrorAccesoComponent,
		TrimPipePipe,
		CargaEtiquetasComponent,
		DatosCvComponent,
		CargaEtiquetasComponent2,
		DatosCVComponent2,
		FormacionComponent,
		BusquedaCursosComponent,

		// Administracion
		CatalogosMaestros,
		CatalogosMaestrosComponent,
		GruposUsuarios,
		Etiquetas,
		AuditoriaUsuarios,
		GestionContadoresComponent,
		Catalogos,
		SeleccionarIdioma,
		Usuarios,
		GestionEntidad,
		ParametrosGenerales,
		EditarUsuarioComponent,
		EditarCatalogosMaestrosComponent,
		ContadoresComponent,
		GestionContadoresComponent,
		GestionAuditoriaComponent,
		PerfilesComponent,
		EditarPerfilesComponent,
		PermisosComponent,
		PoliticaCookiesComponent,
		DatosIntegrantesComponent,
		DatosBancariosComponent,
		ConsultarDatosBancariosComponent,
		// DatosCuentaBancariaComponent,
		// DatosMandatosComponent,
		// ListadoFicherosAnexosComponent,
		DatosDireccionesComponent,
		ConsultarDatosDireccionesComponent,
		ErrorAccesoComponent,
		PlantillasEnvioComponent,
		ModelosComunicacionesComponent,
		FichaModeloComunicacionesComponent,
		DatosGeneralesFichaComponent,
		TarjetaInformesComponent,
		PlantillaDocumentoComponent,
		DetallePlantillaEnvioComponent,
		TarjetaComunicacionesComponent,
		ConsultasComponent,
		FichaConsultaComponent,
		DatosGeneralesConsultaComponent,
		ModelosComunicacionesConsultaComponent,
		PlantillasEnviosConsultasComponent,
		ConsultaComponent,
		ComunicacionesCensoComponent,
		FichaRegistroComunicacionComponent,
		ConfiguracionComponent,
		ProgramacionComponent,
		DocumentosComponent,
		DestinatariosComponent,
		DestinatarioListEnvioMasivoComponent,
		EnviosMasivosComponent,
		FichaRegistroEnvioMasivoComponent,
		ConfiguracionEnvioMasivoComponent,
		DescripcionEnvioMasivoComponent,
		DocumentosEnvioMasivoComponent,
		DestinatariosEnvioMasivoComponent,
		ProgramacionEnvioMasivoComponent,
		RemitentePlantillaComponent,
		DatosGeneralesPlantillaComponent,
		ConsultasPlantillasComponent,
		PerfilesFichaComponent,
		DialogoComunicacionesComponent,

		AgendaComponent,
		FichaCalendarioComponent,
		CargasMasivasComponent,
		DatosNotificacionesComponent,
		FichaEventosComponent,
		FichaCursoComponent,
		DetalleSancionComponent,
		BusquedaInscripcionesComponent,
		FichaInscripcionComponent,
		SolicitudesModificacionComponent,
		NuevaSolicitudesModificacionComponent,
		ComunicacionesComponent,
		ExpedientesComponent,
		RegtelComponent,
		TurnoOficioComponent,
		BusquedaCensoGeneralComponent,
		DestinatarioIndvEnvioMasivoComponent,
		DevolucionComponent,
		JustificacionComponent,
		CertificacionComponent,
		BuscadorProcuradoresComponent,
		FiltroBuscadorProcuradorComponent,
		TablaBuscadorProcuradorComponent,
		FichaColegialGeneralComponent,
		DatosGeneralesFichaColegialComponent,
		DatosColegialesFichaColegialComponent,
		CertificadosFichaColegialComponent,
		SancionesFichaColegialComponent,
		SociedadesFichaColegialComponent,
		DatosCurricularesFichaColegialComponent,
		DireccionesFichaColegialComponent,
		DatosBancariosFichaColegialComponent,
		RegtelFichaColegialComponent,
		AlterMutuaFichaColegialComponent,
		MutualidadAbogaciaFichaColegialComponent,
		DatosColegialesFichaColegialComponent,
		OtrasColegiacionesFichaColegialComponent,
		ServiciosInteresFichaColegialComponent,
		//TarjetaResumenFijaComponent
		BuscadorColegiadosComponent,
		TablaBuscadorColegiadosComponent,
		FiltroBuscadorColegiadosComponent,
		TablaResultadoComponent,
		MigasDePanComponent,
		FormularioBusquedaComponent,
		FormularioSubidaComponent,
		ListaArchivosComponent,
		FormularioBusquedaGuardiaComponent,
		FormularioSubidaGuardiaComponent,
		ListaArchivosGuardiaComponent,
		FichaActuacionComponent,
		TarjetaDatosGenFichaActComponent,
		TarjetaJusFichaActComponent,
		TarjetaRelFichaActComponent,
		TarjetaDatosFactFichaActComponent,
		TarjetaDocFichaActComponent,
		TarjetaHisFichaActComponent,
		DetalleTarjetaRelacionesDesignaComponent,
		DetalleTarjetaComunicacionesDesignaComponent,
		EjgComisionBusquedaComponent,
		TablaEjgComisionComponent,
		RemesasComponent,
		FiltroRemesasComponent,
		TablaRemesasComponent,
		ActasComponent,
		FiltroActasComponent,
		TablaActasComponent,
		FichaRemesasComponent,
		TarjetaDatosGeneralesComponent,
		TarjetaEjgsComponent,
		RemesasResultadosComponent,
		FiltroRemesasResultadosComponent,
		TablaRemesasResultadosComponent,
		FichaRemesasResultadosComponent,
		TarjetaDatosGeneralesRemesasResultadosComponent,
		TarjetaRemesasEnvioComponent,
		RemesasResolucionesComponent,
		TablaRemesasResolucionesComponent,
		FiltroRemesasResolucionesComponent,
		FichaRemesasResolucionesComponent,
		TarjetaDatosGeneralesRemesasResolucionesComponent,
		CargaMasivaProcuradoresComponent,
		CargaDesignaProcuradorComponent,
		TarjetaDatosCurricularesComponent,
		TarjetaListadoComponent,
		FiltroCargaDesignaProcuradorComponent,
		TablaCargaDesignaProcuradorComponent,
		FichaCargaDesignaProcuradorComponent,
		TarjetaDatosCargaDesignaProcuradorComponent,
		DatosGeneralesActasComponent,
		TarjetaListadoEjgsComponent,
		ComunicacionesEntrantesComponent,

		PartidosJudicialesComponent,
		BuscadorSolicitudesCentralitaComponent,
		ResultadoSolicitudesCentralitaComponent,
		FichaPreasistenciasComponent,
		AsistenciasFichaPreasistenciasComponent,
		FichaAsistenciaComponent,
		FichaAsistenciaTarjetaDatosGeneralesComponent,
		FichaAsistenciaTarjetaAsistidoComponent,
		FichaAsistenciaTarjetaContrariosComponent,
		FichaAsistenciaTarjetaDefensaJuridicaComponent,
		FichaAsistenciaTarjetaObservacionesComponent,
		FichaAsistenciaTarjetaRelacionesComponent,
		FichaAsistenciaTarjetaDocumentacionComponent,
		FichaAsistenciaTarjetaCaracteristicasComponent,
		FichaAsistenciaTarjetaActuacionesComponent,
		FichaActuacionAsistenciaComponent,
		FichaActuacionAsistenciaTarjetaDatosGeneralesComponent,
		FichaActuacionAsistenciaTarjetaJustificacionComponent,
		FichaActuacionAsistenciaTarjetaHistoricoComponent,
		FichaActuacionAsistenciaTarjetaDocumentacionComponent,
		BuscadorAsistenciasComponent,
		ResultadoAsistenciasComponent,
		BuscadorListaGuardiasComponent,
		ResultadoListaGuardiasComponent,
		FichaListaGuardiasComponent,
		FichaListaGuardiasTarjetaDatosGeneralesComponent,
		FichaListaGuardiasTarjetaGuardiasComponent,
	
		TablaResultadoDesplegableComponent,
		TablaJustificacionExpresComponent,
		GestionDesignacionesComponent,
		FiltroDesignacionesComponent,
		DesignacionesComponent,
		AppComponent,
		ImagePipe,
		DatePickerRangeComponent,
		HoraComponent,
		InputDivididoComponent,
		TablaSimpleComponent,

		MyIframeComponent,
		MenuComponent,
		LoginComponent,
		LoginDevelopComponent,
		LoginMultipleComponent,
		LogoutComponent,
		HeaderComponent,
		HomeComponent,
		BuscadorListaGuardiasComponent,
		BuscadorAsistenciaExpresComponent,
		ResultadoAsistenciaExpresComponent,
		BuscadorAsistenciasComponent,
		ResultadoAsistenciasComponent,
		AsistenciaExpresComponent,
		AsistenciasFichaPreasistenciasComponent,
		FichaPreasistenciasComponent,
		FiltrosGuardiaColegiadoComponent,
		FormularioBusquedaGuardiaComponent,
		CargasMasivasGuardiaComponent,
		PartidosJudicialesComponent,
		FormularioSubidaGuardiaComponent,
		ListaArchivosGuardiaComponent,
		FichaListaGuardiasComponent,
		FichaListaGuardiasTarjetaDatosGeneralesComponent,
		FichaListaGuardiasTarjetaGuardiasComponent,
		ResultadoListaGuardiasComponent,
		CalendarioGestionGuardiaColegiadoComponent,
		ColegiadoGestionGuardiaColegiadoComponent,
		DatosGeneralesGestionGuardiaColegiadoComponent,
		GuardiaGestionGuardiaColegiadoComponent,
		PermutasGestionGuardiaColegiadoComponent,
		SustitucionesGestionGuardiaColegiadoComponent,
		TurnoGestionGuardiaColegiadoComponent,
		FichaActuacionAsistenciaTarjetaHistoricoComponent,
		FichaActuacionAsistenciaComponent,
		FichaActuacionAsistenciaTarjetaDatosGeneralesComponent,
		FichaActuacionAsistenciaTarjetaDocumentacionComponent,
		FichaActuacionAsistenciaTarjetaJustificacionComponent,
		FichaAsistenciaTarjetaDatosGeneralesComponent,
		FichaAsistenciaComponent,
		FichaAsistenciaTarjetaActuacionesComponent,
		FichaAsistenciaTarjetaAsistidoComponent,
		FichaAsistenciaTarjetaCaracteristicasComponent,
		FichaAsistenciaTarjetaContrariosComponent,
		FichaAsistenciaTarjetaDefensaJuridicaComponent,
		FichaAsistenciaTarjetaDocumentacionComponent,
		FichaAsistenciaTarjetaObservacionesComponent,
		FichaAsistenciaTarjetaRelacionesComponent,
		BuscadorSolicitudesCentralitaComponent,
		GuardiasSolicitudesCentralitaComponent,
		ResultadoSolicitudesCentralitaComponent,
		// Censo
		AuditoriaComponent,
		AccesoFichaPersonaComponent,
		MutualidadAbogaciaPlanUniversal,
		SearchColegiadosComponent,
		BusquedaGeneralComponent,
		SearchNoColegiadosComponent,
		BusquedaNoColegiadosComponent,
		CertificadosAcaComponent,
		ComisionesCargosComponent,
		SolicitudesGenericasComponent,
		SolicitudesEspecificasComponent,
		SolicitudesIncorporacionComponent,
		MutualidadAbogaciaSeguroAccidentes,
		AlterMutuaComponent,
		AlterMutuaRetaComponent,
		AlterMutuaOfertasComponent,
		NuevaIncorporacionComponent,
		ModificacionDatosComponent,
		DocumentacionSolicitudesComponent,
		MantenimientoGruposFijosComponent,
		MantenimientoMandatosComponent,
		BusquedaSancionesComponent,
		BusquedaColegiadosComponent,
		BusquedaColegiadosComponentI,
		EdicionCurricularesComponent,
		BusquedaLetradosComponent,
		MantenimientoDuplicadosComponent,
		MediadoresComponent,
		CargasPeriodicasComponent,
		ConfigurarPerfilComponent,
		CensoDocumentacionComponent,
		TipoCurricularComponent,
		SubtipoCurricularComponent,
		BusquedaColegiadosComponentNew,
		BusquedaPersonasJuridicas,
		DatosGenerales,
		DatosRegistralesComponent,
		DatosPersonaJuridicaComponent,
		DatosRetencionesComponent,
		DetalleIntegranteComponent,
		ServiciosInteresComponent,
		FacturacionSociedadesCensoComponent,
		ComunicacionSociedadesComponent,
		TablaGuardiaColegiadoComponent,
		GuardiaColegiadoComponent,
		GestionGuardiaColegiadoComponent,

		//Certificados
		ComunicacionInterprofesionalComponent,
		SolicitarCompraComponent,
		SolicitudCertificadosComponent,
		GestionSolicitudesComponent,
		MantenimientoCertificadosComponent,

		//Facturacion
		MantenimientoSufijosComponent,
		FacturaPlantillasComponent,
		PrevisionesFacturaComponent,
		ProgramarFacturaComponent,
		GenerarFacturaComponent,
		MantenimientoFacturaComponent,
		EliminarFacturaComponent,
		AbonosComponent,
		CobrosRecobrosComponent,
		FacturasEmitidasComponent,

		//Classique

		GestionCuentasBancariasClassiqueComponent,
		SeriesFacturaClassiqueComponent,
		FacturasClassiqueComponent,
		FicherosAdeudosClassiqueComponent,
		FicherosDevolucionesClassiqueComponent,
		DevolucionManualClassiqueComponent,
		FicherosTransferenciaClassiqueComponent,
		ContabilidadClassiqueComponent,

		GenerarImpreso190ClassiqueComponent,
		MantenimientoFacturacionComponent,
		PrevisionesComponent,
		MantenimientoPagosComponent,
		MovimientosVariosComponentClassique,
		TramosLECComponent,
		RetencionesJudicialesComponent,
		ResumenPagosComponent,
		
		EJGClassiqueComponent,
		GestionActasClassiqueComponent,
		DefinirListasGuardiasClassiqueComponent,
		GuardiasAsistenciasClassiqueComponent,
		GuardiasBajasTemporalesClassiqueComponent,
		GuardiasCentralitaClassiqueComponent,
		GuardiasIncompatibilidadesClassiqueComponent,
		GuardiasSaltosCompensacionesClassiqueComponent,
		ProgramacionCalendariosClassiqueComponent,
		GuardiasSolicitudesTurnosClassiqueComponent,
		VolanteExpresClassiqueComponent,
		AreasYMateriasClassiqueComponent,
		CalendarioLaboralClassiqueComponent,
		DestinatariosRetencionesClassiqueComponent,
		DocumentacionEJGClassiqueComponent,
		MaestroPJClassiqueComponent,
		MaestrosModulosClassiqueComponent,
		MantenimientoComisariasClassiqueComponent,
		MantenimientoJuzgadosClassiqueComponent,
		MantenimientoPrisionesClassiqueComponent,
		MantenimientoProcuradoresClassiqueComponent,
		PartidasClassiqueComponent,
		PartidosJudicialesClassiqueComponent,
		RetencionesIRPFClassiqueComponent,
		TiposAsistenciaClassiqueComponent,
		ZonasYSubzonasClassiqueComponent,
		BajasTemporalesClassiqueComponent,
		DesignacionesClassiqueComponent,
		SaltosYCompensacionesClassiqueComponent,
		SolicitudesTurnosGuardiasClassiqueComponent,
		TurnosClassiqueComponent,

		//Productos y Servicios
		CategoriasProductoComponent,
		CategoriasServiciosComponent,
		MantenimientoProductosComponent,
		MantenimientoServiciosComponent,
		GestionarSolicitudesComponent,
		SolicitudCompraSubscripcionComponent,
		SolicitudAnulacionComponent,
		CargaComprasComponent,

		//Expedientes
		TiposExpedientesComponent,
		GestionarExpedientesComponent,
		AlertasComponent,
		NuevoExpedienteComponent,

		//Justicia Gratuita
		ZonasYSubzonasComponent,
		AreasYMateriasComponent,
		CalendarioLaboralComponent,
		MantenimientoProcuradoresComponent,
		MantenimientoPrisionesComponent,
		MantenimientoComisariasComponent,
		MantenimientoJuzgadosComponent,
		MaestroPJComponent,
		SolicitudesTurnosGuardiasComponent,
		DetalleTarjetaDatosAdicionalesFichaDesignacionOficioComponent,
		DetalleTarjetaContrariosFichaDesignacionOficioComponent,
		DetalleTarjetaInteresadosFichaDesignacionOficioComponent,
		DetalleTarjetaLetradosDesignaComponent,
		FichaDesignacionesComponent,
		FichaCambioLetradoComponent,
		LetradoSalienteComponent,
		LetradoEntranteComponent,
		DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent,
		DetalleTarjetaDatosGeneralesFichaDesignacionOficioComponent,
		DetalleTarjetaDetalleFichaDesignacionOficioComponent,
		DetalleTarjetaDocumentacionFichaDesignacionOficioComponent,
		DetalleTarjetaActuacionesFichaDesignacionOficioComponent,
		GuardiasSolicitudesTurnosComponent,
		GuardiasIncompatibilidadesComponent,
		GuardiasBajasTemporalesComponent,
		GuardiasSaltosCompensacionesComponent,
		DefinirListasGuardiasComponent,
		GuardiasAsistenciasComponent,
		VolanteExpresComponent,
		//EJG
		// EJGComponent,
		FiltrosEjgComponent,
		TablaEjgComponent,
		EJGComponent,
		GestionEjgComponent,
		DatosGeneralesEjgComponent,
		ServiciosTramitacionComponent,
		UnidadFamiliarComponent,
		ExpedientesEconomicosComponent,
		RelacionesComponent,
		EstadosComponent,
		DocumentacionComponent,
		InformeCalificacionComponent,
		ResolucionComponent,
		ImpugnacionComponent,
		ComunicacionesComponent,
		AddExpedienteComponent,
		ComunicacionesEJGComponent,
		RegtelEjgComponent,
		DefensaJuridicaComponent,
		ProcuradorPreDesignacionComponent,
 		ContrariosPreDesignacionComponent,
		GestionActasComponent,
		ListaIntercambiosAltaEjgComponent,
		ListaIntercambiosDocumentacionEjgComponent,






		AbonosSCJSComponent,
		FiltrosAbonosSCJSComponent,
		TablaAbonosSCJSComponent,
		FichaAbonosSCJSComponent,


		BusquedaRetencionesAplicadasComponent,
		GenerarImpreso190Component,

		EnvioReintegrosXuntaComponent,
		JustificacionLetradoComponent,
		InformeFacturacionComponent,
		InformeFacturacionMultipleComponent,
		InformeFacturacionPersonalizadoComponent,
		FichaFacturacionComponent,
		FichaPagoComponent,
		CartaPagosColegiadosComponent,
		CartaFacturaColegiadoComponent,
		CertificadosPagosComponent,
		CertificadosIrpfComponent,
		ComunicaPreparacionComponent,
		ComunicaRemesaEnvioComponent,
		ComunicaRemesaResultadoComponent,
		ComunicaEnvioActualizacionComponent,
		ComunicaInfoEconomicaComponent,
		ComunicaCargaComponent,
		ComunicaResolucionesComponent,
		ComunicaDesignacionesComponent,
		CargasMasivasOficioComponent,

		DetalleTarjetaProcuradorFichaDesignacionOficioComponent,

		//Consultas
		RecuperarConsultasComponent,
		ConsultasListasDinamicasComponent,
		NuevaConsultaComponent,
		NuevaConsultaExpertaComponent,

		//Comunicaciones
		InformesGenericosComponent,
		DefinirTipoPlantillaComponent,
		ListaCorreosComponent,
		BandejaSalidaComponent,
		BandejaEntradaComponent,

		// Administracion
		CatalogosMaestros,
		CatalogosMaestrosComponent,
		GruposUsuarios,
		Etiquetas,
		AuditoriaUsuarios,
		GestionContadoresComponent,
		Catalogos,
		SeleccionarIdioma,
		Usuarios,
		GestionEntidad,
		ParametrosGenerales,
		EditarUsuarioComponent,
		EditarCatalogosMaestrosComponent,
		ContadoresComponent,
		GestionContadoresComponent,
		GestionAuditoriaComponent,
		PerfilesComponent,
		EditarPerfilesComponent,
		PermisosComponent,
		PoliticaCookiesComponent,
		DatosIntegrantesComponent,
		DatosBancariosComponent,
		ConsultarDatosBancariosComponent,
		// DatosCuentaBancariaComponent,
		// DatosMandatosComponent,
		// ListadoFicherosAnexosComponent,
		DatosDireccionesComponent,
		ConsultarDatosDireccionesComponent,
		ErrorAccesoComponent,
		TrimPipePipe,
		CargaEtiquetasComponent,
		DatosCvComponent,
		CargaEtiquetasComponent2,
		DatosCVComponent2,
		FormacionComponent,
		BusquedaCursosComponent,

		// Administracion
		CatalogosMaestros,
		CatalogosMaestrosComponent,
		GruposUsuarios,
		Etiquetas,
		AuditoriaUsuarios,
		GestionContadoresComponent,
		Catalogos,
		SeleccionarIdioma,
		Usuarios,
		GestionEntidad,
		ParametrosGenerales,
		EditarUsuarioComponent,
		EditarCatalogosMaestrosComponent,
		ContadoresComponent,
		GestionContadoresComponent,
		GestionAuditoriaComponent,
		PerfilesComponent,
		EditarPerfilesComponent,
		PermisosComponent,
		PoliticaCookiesComponent,
		DatosIntegrantesComponent,
		DatosBancariosComponent,
		ConsultarDatosBancariosComponent,
		// DatosCuentaBancariaComponent,
		// DatosMandatosComponent,
		// ListadoFicherosAnexosComponent,
		DatosDireccionesComponent,
		ConsultarDatosDireccionesComponent,
		ErrorAccesoComponent,
		PlantillasEnvioComponent,
		ModelosComunicacionesComponent,
		FichaModeloComunicacionesComponent,
		DatosGeneralesFichaComponent,
		TarjetaInformesComponent,
		PlantillaDocumentoComponent,
		DetallePlantillaEnvioComponent,
		TarjetaComunicacionesComponent,
		ConsultasComponent,
		FichaConsultaComponent,
		DatosGeneralesConsultaComponent,
		ModelosComunicacionesConsultaComponent,
		PlantillasEnviosConsultasComponent,
		ConsultaComponent,
		ComunicacionesCensoComponent,
		FichaRegistroComunicacionComponent,
		ConfiguracionComponent,
		ProgramacionComponent,
		DocumentosComponent,
		DestinatariosComponent,
		DestinatarioListEnvioMasivoComponent,
		EnviosMasivosComponent,
		FichaRegistroEnvioMasivoComponent,
		ConfiguracionEnvioMasivoComponent,
		DescripcionEnvioMasivoComponent,
		DocumentosEnvioMasivoComponent,
		DestinatariosEnvioMasivoComponent,
		ProgramacionEnvioMasivoComponent,
		RemitentePlantillaComponent,
		DatosGeneralesPlantillaComponent,
		ConsultasPlantillasComponent,
		PerfilesFichaComponent,
		DialogoComunicacionesComponent,

		AgendaComponent,
		FichaCalendarioComponent,
		CargasMasivasComponent,
		DatosNotificacionesComponent,
		FichaEventosComponent,
		FichaCursoComponent,
		DetalleSancionComponent,
		BusquedaInscripcionesComponent,
		FichaInscripcionComponent,
		SolicitudesModificacionComponent,
		NuevaSolicitudesModificacionComponent,
		ComunicacionesComponent,
		ExpedientesComponent,
		RegtelComponent,
		TurnoOficioComponent,
		BusquedaCensoGeneralComponent,
		DestinatarioIndvEnvioMasivoComponent,
		DevolucionComponent,
		JustificacionComponent,
		CertificacionComponent,
		BuscadorProcuradoresComponent,
		FiltroBuscadorProcuradorComponent,
		TablaBuscadorProcuradorComponent,
		FichaColegialGeneralComponent,
		DatosGeneralesFichaColegialComponent,
		DatosColegialesFichaColegialComponent,
		CertificadosFichaColegialComponent,
		SancionesFichaColegialComponent,
		SociedadesFichaColegialComponent,
		DatosCurricularesFichaColegialComponent,
		DireccionesFichaColegialComponent,
		DatosBancariosFichaColegialComponent,
		RegtelFichaColegialComponent,
		AlterMutuaFichaColegialComponent,
		MutualidadAbogaciaFichaColegialComponent,
		DatosColegialesFichaColegialComponent,
		OtrasColegiacionesFichaColegialComponent,
		ServiciosInteresFichaColegialComponent,
		//TarjetaResumenFijaComponent
		BuscadorColegiadosComponent,
		TablaBuscadorColegiadosComponent,
		FiltroBuscadorColegiadosComponent,
		TablaResultadoComponent,
		MigasDePanComponent,
		FormularioBusquedaComponent,
		FormularioSubidaComponent,
		ListaArchivosComponent,



		FichaActuacionComponent,
		TarjetaDatosGenFichaActComponent,
		TarjetaJusFichaActComponent,
		TarjetaRelFichaActComponent,
		TarjetaDatosFactFichaActComponent,
		TarjetaDocFichaActComponent,
		TarjetaHisFichaActComponent,
		DetalleTarjetaRelacionesDesignaComponent,
		DetalleTarjetaComunicacionesDesignaComponent,
		TiposProductosComponent,
		TiposServiciosComponent,
		ProductosComponent,
		FiltrosProductosComponent,
		GestionProductosComponent,
		FichaProductosComponent,
		//Otros
		DigitDecimaNumberDirective,
		DetalleTarjetaDatosGeneralesFichaProductosFacturacionComponent,
		DetalleTarjetaFormasPagosFichaProductoFacturacionComponent,
		ServiciosComponent,
		FiltrosServiciosComponent,
		GestionServiciosComponent,
		FichaCompraSuscripcionComponent,
		TarjetaClienteCompraSuscripcionComponent,
		FichaServiciosComponent,
		DetalleTarjetaDatosGeneralesFichaServiciosFacturacionComponent,
		FichaCompraSuscripcionComponent,
		DetalleTarjetaFormasPagosFichaServiciosFacturacionComponent,
		TarjetaSolicitudCompraSuscripcionComponent,
		FichaCuentaBancariaComponent,
		FiltrosSeriesFacturaComponent,
		TablaSeriesFacturaComponent,
		GestionSeriesFacturaComponent,
		CompraProductosComponent,
		TarjetaFiltroCompraProductosComponent,
		TarjetaListaCompraProductosComponent,
		DetalleTarjetaPrecioFichaServiciosFacturacionComponent,
		TarjetaProductosCompraSuscripcionComponent,
		TarjetaFacturaCompraSuscripcionComponent,
		DatosGeneralesSeriesFacturaComponent,
		ObservacionesSeriesFacturaComponent,
		DestinatariosIndividualesSeriesFacturaComponent,
		DestinatariosEtiquetasSeriesFacturaComponent,
		DestinatariosListaSeriesFacturaComponent,
		PagoAutomaticoSeriesFacturaComponent,
		ExportacionSeriesFacturaComponent,
		TraspasoSeriesFacturaComponent,
		ContadorSeriesFacturaComponent,
		ContadorRectSeriesFacturaComponent,
		GeneracionSeriesFacturaComponent,
		EnvioSeriesFacturaComponent,
		ConstructorConsultasComponent,
		TarjetaFacturaCompraSuscripcionComponent,
		TarjetaDescuentosAnticiposCompraSuscripcionComponent,
		FiltrosBusquedaAdeudosComponent,
		TablaAdeudosComponent,
		GestionAdeudosComponent,
		DatosGeneralesCuentaBancariaComponent,
		ComisionCuentaBancariaComponent,
		ConfiguracionCuentaBancariaComponent,
		UsoFicherosCuentaBancariaComponent,
		UsosSufijosCuentaBancariaComponent,
		DatosGeneracionAdeudosComponent,
		CuentaEntidadAdeudosComponent,
		FacturasAdeudosComponent,
		FacturacionAdeudosComponent,
		FactProgramadasComponent,
		FiltrosFactProgramadasComponent,
		TablaFactProgramadasComponent,
		FichaFactProgramadasComponent,
		CuotasSuscripcionesComponent,
		TarjetaFiltroCuotasSuscripcionesComponent,
		TarjetaListaCuotasSuscripcionesComponent,
		TarjetaServiciosCompraSuscripcionComponent,
		DatosGeneralesFactProgramadasComponent,
		GenAdeudosFactProgramadasComponent,
		GenFacturaFactProgramadasComponent,
		EnvioFactProgramadasComponent,
		TraspasoFactProgramadasComponent,
		SerieFacturaFactProgramadasComponent,
		InfoFacturaFactProgramadasComponent,
		FiltrosBusquedaTransferenciasComponent,
		TablaFicherosTransferenciasComponent,
		GestionFicherosTransferenciasComponent,
		DatosGeneracionFichTransferenciasComponent,
		FichaMonederoComponent,
		DatosGeneralesMonederoComponent,
		MovimientosMonederoComponent,
		ServiciosAsociadosMonederoComponent,
		TablaFicherosDevolucionesComponent,
		FiltrosFicherosDevolucionesComponent,
		FichaFicherosDevolucionesComponent,
		FiltrosFacturasComponent,
		TablaFacturasComponent,
		GestionFacturasComponent,
		DatosCargaDevolucionesComponent,
		ObservacionesFacturasComponent,
		DatosGeneralesFacturasComponent,
		EstadosPagosFacturasComponent,
		ObservacionesRectificativaFacturasComponent,
		LineasFacturasComponent,
		ComunicacionesFacturasComponent,
		ClienteFacturasComponent,
		DeudorFacturasComponent,
		FacturacionFacturasComponent,
		FacturacionesYPagosComponent,
		FichaEnvioCamComponent,
		FiltroBusquedaFacturacionComponent,
		TablaBusquedaFacturacionComponent,
		GestionFacturacionComponent,
		DatosFacturacionComponent,
		ConceptosFacturacionComponent,
		BaremosComponent,
		PagosComponent,
		CartasFacturacionComponent,
		GestionPagosComponent,
		DatosPagosComponent,
		ConfiguracionFicherosComponent,
		CartasPagoComponent,
		CompensacionFacturaComponent,
		ConceptosPagosComponent,
		SiNoPipe,
		RetencionesComponent,
		FiltroBusquedaRetencionesComponent,
		TablaBusquedaRetencionesComponent,
		TablaBusquedaRetencionesAplicadasComponent,
		TablaAplicacionRetencionesComponent,
		FichaRetencionJudicialComponent,
		TarjetaColegiadoComponent,
		TarjetaDatosRetencionComponent,
		TarjetaAplicacionEnPagosComponent,
		BaremosDeGuardiaComponent,
		FiltroBusquedaBaremosComponent,
		FichaBaremosDeGuardiaComponent,
		FichaBarDatosGeneralesComponent,
		FichaBarConfiFacComponent,
		FichaBarConfiAdiComponent,
		//certificacion de facturacion
		CertificacionFacComponent,
		FichaCertificacionFacComponent,
		TablaCertificacionFacComponent,
		FiltroCertificacionFacComponent,
		TarjetaFacturacionComponent,
		TarjetaMovimientosVariosAsociadosComponent,
		TarjetaMovimientosVariosAplicadosComponent,
		//Impreso 190
		FiltroGenerarImpreso190Component,
		TablaGenerarImpreso190Component,
		RetencionesIrpfColegialComponent,
		TiposAsistenciaComponent,
		TiposActuacionComponent,
		FiltrosExportacionesContabilidadComponent,
		TablaExportacionesContabilidadComponent,
		EjgComisionBusquedaComponent,
		TablaEjgComisionComponent,
		RemesasComponent,
		FiltroRemesasComponent,
		TablaRemesasComponent,
		ActasComponent,
		FiltroActasComponent,
		TablaActasComponent,
		FichaRemesasComponent,
		TarjetaDatosGeneralesComponent,
		TarjetaEjgsComponent,
		RemesasResultadosComponent,
		FiltroRemesasResultadosComponent,
		TablaRemesasResultadosComponent,
		FichaRemesasResultadosComponent,
		TarjetaDatosGeneralesRemesasResultadosComponent,
		TarjetaRemesasEnvioComponent,
		RemesasResolucionesComponent,
		TablaRemesasResolucionesComponent,
		FiltroRemesasResolucionesComponent,
		FichaRemesasResolucionesComponent,
		TarjetaDatosGeneralesRemesasResolucionesComponent,
		CargaMasivaProcuradoresComponent,
		CargaDesignaProcuradorComponent,
		TarjetaDatosCurricularesComponent,
		TarjetaListadoComponent,
		FiltroCargaDesignaProcuradorComponent,
		TablaCargaDesignaProcuradorComponent,
		FichaCargaDesignaProcuradorComponent,
		TarjetaDatosCargaDesignaProcuradorComponent,
		DatosGeneralesActasComponent,
		TarjetaListadoEjgsComponent,
		ComunicacionesEntrantesComponent,
		PartidosJudicialesComponent,
		BuscadorSolicitudesCentralitaComponent,
		ResultadoSolicitudesCentralitaComponent,
		FichaPreasistenciasComponent,
		AsistenciasFichaPreasistenciasComponent,
		FichaAsistenciaComponent,
		FichaAsistenciaTarjetaDatosGeneralesComponent,
		FichaAsistenciaTarjetaAsistidoComponent,
		FichaAsistenciaTarjetaContrariosComponent,
		FichaAsistenciaTarjetaDefensaJuridicaComponent,
		FichaAsistenciaTarjetaObservacionesComponent,
		FichaAsistenciaTarjetaRelacionesComponent,
		FichaAsistenciaTarjetaDocumentacionComponent,
		FichaAsistenciaTarjetaCaracteristicasComponent,
		FichaAsistenciaTarjetaActuacionesComponent,
		FichaActuacionAsistenciaComponent,
		FichaActuacionAsistenciaTarjetaDatosGeneralesComponent,
		FichaActuacionAsistenciaTarjetaJustificacionComponent,
		FichaActuacionAsistenciaTarjetaHistoricoComponent,
		FichaActuacionAsistenciaTarjetaDocumentacionComponent,
		BuscadorAsistenciasComponent,
		ResultadoAsistenciasComponent,
		BuscadorListaGuardiasComponent,
		ResultadoListaGuardiasComponent,
		FichaListaGuardiasComponent,
		FichaListaGuardiasTarjetaDatosGeneralesComponent,
		FichaListaGuardiasTarjetaGuardiasComponent,
		DatosGeneralesAbonosSJCSComponent,
		SociedadAbonosSJCSComponent,
		PagoAbonosSJCSComponent,
		ColegiadoAbonosSJCSComponent,
		LineasAbonosComponent,
		ObservacionesAbonosSJCSComponent,
		EstadosPagosAbonosSJCSComponent,
		
		GestionExpedientesExeaComponent,
		NuevoExpedienteExeaComponent,
		ExpedientesFichaColegialComponent,
		FichaExpedienteExeaComponent,
		FichaExpExeaDatosGeneralesComponent,
		FichaExpExeaDocumentacionComponent,
		FichaExpExeaHistoricoComponent,
		TablaFacturasSeleccionadasComponent,
		TablaAbonosSeleccionadasComponent
	],
	imports: [

		SelectorModule,
		Paginador3Module,
		Paginador4Module,
		BrowserModule,
		MatTooltipModule,

		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		routing,
		MenubarModule,
		PanelMenuModule,
		DropdownModule,
		ButtonModule,
		DataTableModule,
		TableModule,
		InputTextModule,
		InputTextareaModule,
		CheckboxModule,
		DialogModule,
		RadioButtonModule,
		ConfirmDialogModule,
		ValidationModule,
		GrowlModule,
		CommonModule,
		CalendarModule,
		OverlayPanelModule,
		ScheduleModule,
		PipeTranslationModule,
		AutoCompleteModule,
		TooltipModule,
		ListboxModule,
		ChipsModule,

		MultiSelectModule,
		InputSwitchModule,
		TableModule,
		TreeModule,
		PickListModule,
		ListboxModule,
		ProgressSpinnerModule,
		FileUploadModule,
		DialogModule,
		PipeTranslationModule,
		PipeNumberModule,
		FechaModule,
		PaginadorModule,
		DialogoModule,
		PrecioModule,
		KeyFilterModule,
		StepsModule,
		BusquedaColegiadoExpressModule,
		GeneralSJCSModule,
		TarjetaResumenFijaModule,

		SelectButtonModule,
		ColorPickerModule,
		// BusquedaAsuntosModule,
		MatExpansionModule,
		MatCheckboxModule,
		MatInputModule,
		MatSortModule,
		MatSelectModule,
		MatTableModule,
		MatPaginatorModule,
		MatDatepickerModule,
		MatNativeDateModule,
		PaginatorModule,
		GuardiaModule,
		SjcsModule,
		OficioModule,
		BusquedaAsuntosModule,
		Paginador2Module,
		TablaResultadoOrderModule,
		TarjetaModule,
		DestinatariosModule,
		MaestrosModule,
		Paginador3Module,
		Paginador4Module,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		routing,
		MenubarModule,
		PanelMenuModule,
		DropdownModule,
		ButtonModule,
		DataTableModule,
		TableModule,
		InputTextModule,
		InputTextareaModule,
		CheckboxModule,
		DialogModule,
		RadioButtonModule,
		ConfirmDialogModule,
		ValidationModule,
		GrowlModule,
		CommonModule,
		CalendarModule,
		OverlayPanelModule,
		ScheduleModule,
		PipeTranslationModule,
		AutoCompleteModule,
		ListboxModule,
		ChipsModule,
		MultiSelectModule,
		InputSwitchModule,
		TableModule,
		TreeModule,
		PickListModule,
		ListboxModule,
		ProgressSpinnerModule,
		FileUploadModule,
		DialogModule,
		PipeTranslationModule,
		PipeNumberModule,
		DialogoModule,
		PrecioModule,
		KeyFilterModule,
		StepsModule,
		BusquedaColegiadoExpressModule,
		GeneralSJCSModule,
		TarjetaResumenFijaModule,

		SelectButtonModule,
		ColorPickerModule,
		// BusquedaAsuntosModule,
		EditorModule,



		MatExpansionModule,
		MatCheckboxModule,
		MatInputModule,
		MatSortModule,
		MatSelectModule,
		MatTableModule,
		MatPaginatorModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatSlideToggleModule,
		PaginatorModule,
		GuardiaModule,
		SjcsModule,
		OficioModule,
		BusquedaAsuntosModule,
		Paginador2Module,
		QueryBuilderModule,
		OrderListModule,
		SliderModule,
		DropDownListModule,
		RadioButtonEJSModule,
		TarjetaModule,
		TablaResultadoOrderModule,
		MovimientosVariosModule,
		TarjetaFacturacionGenericaModule,
		TablaBusquedaBaremosModule,
		ScrollPanelModule,
		TablaResultadoOrderModule,
		TarjetaModule,
		DestinatariosModule,
		MaestrosModule
		
	],

	exports: [DigitDecimaNumberDirective],
	providers: [
	
		// { provide: TranslationClass.TRANSLATIONS, useValue: TranslationClass.dictionary },
		ImagePipe,
		DatePipe,
		OldSigaServices,
		SigaServices,
		CommonsService,
		SigaStorageService,
		cardService,
		HeaderGestionEntidadService,
		MessageService,
		AuthenticationService,
		ConfirmationService,
		PersistenceService,
		TrimPipePipe,
		TablaResultadoDesplegableJEService,
		TablaResultadoDesplegableAEService,
		TablaResultadoMixDocDesigService,

	
	
		// { provide: TranslationClass.TRANSLATIONS, useValue: TranslationClass.dictionary },
		ImagePipe,
		DatePipe,
		OldSigaServices,
		SigaServices,
		CommonsService,
		SigaStorageService,
		cardService,
		HeaderGestionEntidadService,
		MessageService,
		AuthenticationService,
		ConfirmationService,

		PersistenceService,

		TrimPipePipe,
		TablaResultadoDesplegableJEService,
		TablaResultadoDesplegableAEService,
		TablaResultadoMixDocDesigService,
		SigaNoInterceptorServices,
		RetencionesService,
		MovimientosVariosService,

		AuthGuard,
		{
			provide: APP_BASE_HREF,
			useValue: environment.baseHref
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: JwtInterceptor,
			multi: true
		},
		CookieService,
		{ provide: LOCALE_ID, useValue: 'es-ES' }
	],


	bootstrap: [AppComponent]

})
export class AppModule { }
