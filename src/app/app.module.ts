import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { ValidationModule } from './commons/validation/validation.module';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { DialogModule } from "primeng/dialog";
import { StepsModule } from 'primeng/steps';


import { AuthGuard } from './_guards/auth.guards';
import { OldSigaServices } from './_services/oldSiga.service';
import { SigaServices } from './_services/siga.service';
import { cardService } from './_services/cardSearch.service';
import { CookieService } from 'ngx-cookie-service';
// prueba
import { HeaderGestionEntidadService } from './_services/headerGestionEntidad.service';
import { AuthenticationService } from './_services/authentication.service';
import { JwtInterceptor } from './_interceptor/jwt.interceptor';


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
import { MessageService } from 'primeng/components/common/messageservice';
import { TreeModule } from 'primeng/tree';
import { BusquedaColegiadoExpressModule } from './commons/busqueda-colegiado-express/busqueda-colegiado-express.module';

//PRIMENG

import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { DataTableModule } from "primeng/datatable";
import { ListboxModule } from "primeng/listbox";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { GrowlModule } from "primeng/growl";
import { MultiSelectModule } from "primeng/multiselect";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { CalendarModule } from "primeng/calendar";
import { AutoCompleteModule } from "primeng/autocomplete";
import { TooltipModule } from "primeng/tooltip";
import { ChipsModule } from "primeng/chips";
// import { EditorModule } from "primeng/editor";
import { PickListModule } from "primeng/picklist";
import { FileUploadModule } from "primeng/fileupload";
import { KeyFilterModule } from 'primeng/keyfilter';
import { EditorModule } from '@tinymce/tinymce-angular';


// Modulo de censo
import { SearchColegiadosComponent } from './features/censo/search-colegiados/search-colegiados.component';
import { SearchNoColegiadosComponent } from './features/censo/search-no-colegiados/search-no-colegiados.component';
import { BusquedaNoColegiadosComponent } from './features/censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
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
import { BusquedaSancionesComponent } from './features/censo/busqueda-sanciones/busqueda-sanciones.component';
import { BusquedaColegiadosComponent } from './features/censo/busqueda-colegiados/busqueda-colegiados.component';
import { BusquedaColegiadosComponentI } from './features/censo/busqueda-colegiados-censoI/busqueda-colegiados.component';
import { EdicionCurricularesComponent } from './features/censo/ficha-colegial/edicionDatosCurriculares/edicionCurriculares.component';
import { BusquedaLetradosComponent } from './features/censo/busqueda-letrados/busqueda-letrados.component';
import { MantenimientoDuplicadosComponent } from './features/censo/mantenimiento-duplicados/mantenimiento-duplicados.component';
import { MediadoresComponent } from './features/censo/mediadores/mediadores.component';
import { CargasPeriodicasComponent } from './features/censo/cargas-periodicas/cargas-periodicas.component';
import { ConfigurarPerfilComponent } from './features/censo/configurar-perfil/configurar-perfil.component';
import { CensoDocumentacionComponent } from './features/censo/censo-documentacion/censo-documentacion.component';
import { TipoCurricularComponent } from './features/censo/gestion-subtiposCV/tipo-curricular.component';
import { SubtipoCurricularComponent } from './features/censo/gestion-subtiposCV/subtipo-curricular/subtipo-curricular.component';
import { DatosPersonaJuridicaComponent } from './features/censo/datosPersonaJuridica/datosPersonaJuridica.component';
import { BusquedaGeneralComponent } from './features/censo/busqueda-general/busqueda-general.component';
import { CommonModule } from '@angular/common';
import { AccesoFichaPersonaComponent } from './features/censo/datosPersonaJuridica/accesoFichaPersona/accesoFichaPersona.component';
import { DatosBancariosComponent } from './features/censo/datosPersonaJuridica/datos-bancarios/datos-bancarios.component';
import { ConsultarDatosBancariosComponent } from './features/censo/datosPersonaJuridica/datos-bancarios/consultar-datos-bancarios/consultar-datos-bancarios.component';
import { AuditoriaComponent } from './features/censo/auditoria/auditoria.component';
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
import { CatalogosMaestros } from './features/administracion/catalogos-maestros/catalogos-maestros.component';
import { CatalogosMaestrosComponent } from './features/administracion/catalogos-maestros-classique/catalogos-maestros-classique.component';
import { EditarCatalogosMaestrosComponent } from './features/administracion/catalogos-maestros/editarCatalogosMaestros/editarCatalogosMaestros.component';
import { GestionContadoresComponent } from './features/administracion/contadores/gestion-contadores/gestion-contadores.component';
import { ContadoresComponent } from './features/administracion/contadores/contadores.component';
import { PerfilesComponent } from './features/administracion/perfiles/perfiles.component';
import { EditarPerfilesComponent } from './features/administracion/perfiles/editarPerfiles/editarPerfiles.component';
import { EditarUsuarioComponent } from './features/administracion/usuarios/editarUsuario/editarUsuario.component';
import { GruposUsuarios } from './features/administracion/grupos-usuarios/grupos-usuarios.component';
import { Etiquetas } from './features/administracion/gestion-multiidioma/etiquetas/etiquetas.component';
import { GestionEntidad } from './features/administracion/gestion-entidad/gestion-entidad.component';
import { AuditoriaUsuarios } from './features/administracion/auditoria/usuarios/auditoria-usuarios.component';
import { GestionAuditoriaComponent } from './features/administracion/auditoria/usuarios/editarAuditoriaUsuarios/gestion-auditoria.component';
import { SeleccionarIdioma } from './features/administracion/seleccionar-idioma/seleccionar-idioma.component';
import { Usuarios } from './features/administracion/usuarios/usuarios.component';
import { ParametrosGenerales } from './features/administracion/parametros/parametros-generales/parametros-generales.component';
import { Catalogos } from './features/administracion/gestion-multiidioma/catalogos/catalogos.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PermisosComponent } from './features/administracion/permisos/permisos.component';

//Modulo de Certificados
import { ComunicacionInterprofesionalComponent } from './features/certificados/comunicacion-interprofesional/comunicacion-interprofesional.component';
import { SolicitarCompraComponent } from './features/certificados/solicitar-compra/solicitar-compra.component';
import { SolicitudCertificadosComponent } from './features/certificados/solicitud-certificados/solicitud-certificados.component';
import { GestionSolicitudesComponent } from './features/certificados/gestion-solicitudes/gestion-solicitudes.component';
import { MantenimientoCertificadosComponent } from './features/certificados/mantenimiento-certificados/mantenimiento-certificados.component';

//Modulo de Facturacion
import { MantenimientoSufijosComponent } from './features/facturacion/mantenimiento-sufijos/mantenimiento-sufijos.component';
import { FacturaPlantillasComponent } from './features/facturacion/factura-plantillas/factura-plantillas.component';
import { GestionCuentasBancariasComponent } from './features/facturacion/gestion-cuentas-bancarias/gestion-cuentas-bancarias.component';
import { SeriesFacturaComponent } from './features/facturacion/series-factura/series-factura.component';
import { PrevisionesFacturaComponent } from './features/facturacion/previsiones-factura/previsiones-factura.component';
import { ProgramarFacturaComponent } from './features/facturacion/programar-factura/programar-factura.component';
import { GenerarFacturaComponent } from './features/facturacion/generar-factura/generar-factura.component';
import { MantenimientoFacturaComponent } from './features/facturacion/mantenimiento-factura/mantenimiento-factura.component';
import { EliminarFacturaComponent } from './features/facturacion/eliminar-factura/eliminar-factura.component';
import { FacturasComponent } from './features/facturacion/facturas/facturas.component';
import { FicherosAdeudosComponent } from './features/facturacion/ficheros-adeudos/ficheros-adeudos.component';
import { FicherosDevolucionesComponent } from './features/facturacion/devoluciones/ficheros-devoluciones/ficheros-devoluciones.component';
import { DevolucionManualComponent } from './features/facturacion/devoluciones/devolucion-manual/devolucion-manual.component';
import { AbonosComponent } from './features/facturacion/abonos/abonos.component';
import { FicherosTransferenciaComponent } from './features/facturacion/ficheros-transferencia/ficheros-transferencia.component';
import { ContabilidadComponent } from './features/facturacion/contabilidad/contabilidad.component';
import { CobrosRecobrosComponent } from './features/facturacion/cobros-recobros/cobros-recobros.component';
import { FacturasEmitidasComponent } from './features/facturacion/informes/facturas-emitidas/facturas-emitidas.component';

//Modulo de Productos y Servicios
import { CategoriasProductoComponent } from './features/productosYServicios/categoriasProducto/categoriasProducto.component';
import { CategoriasServiciosComponent } from './features/productosYServicios/categoriasServicios/categoriasServicios.component';
import { MantenimientoProductosComponent } from './features/productosYServicios/mantenimientoProductos/mantenimientoProductos.component';
import { MantenimientoServiciosComponent } from './features/productosYServicios/mantenimientoServicios/mantenimientoServicios.component';
import { GestionarSolicitudesComponent } from './features/productosYServicios/gestionarSolicitudes/gestionarSolicitudes.component';
import { SolicitudCompraSubscripcionComponent } from './features/productosYServicios/solicitudCompraSubscripcion/solicitudCompraSubscripcion.component';
import { SolicitudAnulacionComponent } from './features/productosYServicios/solicitudAnulacion/solicitudAnulacion.component';
import { CargaComprasComponent } from './features/productosYServicios/cargaCompras/cargaCompras.component';

//Modulo de Expedientes
import { TiposExpedientesComponent } from './features/expedientes/tipos-expedientes/tipos-expedientes.component';
import { GestionarExpedientesComponent } from './features/expedientes/gestionar-expedientes/gestionar-expedientes.component';
import { AlertasComponent } from './features/expedientes/alertas/alertas.component';
import { NuevoExpedienteComponent } from './features/expedientes/nuevo-expediente/nuevo-expediente.component';

//Modulo de Justicia Gratuita
import { DevolucionComponent } from './features/sjcs/devolucion/devolucion.component';
import { JustificacionComponent } from './features/sjcs/justificacion/justificacion.component';
import { CertificacionComponent } from './features/sjcs/certificacion/certificacion.component';
import { ZonasYSubzonasComponent } from './features/sjcs/maestros/zonas-subzonas/zonas-subzonas.component';
import { AreasYMateriasComponent } from './features/sjcs/maestros/areas-materias/areas-materias.component';
import { CalendarioLaboralComponent } from './features/sjcs/maestros/calendarioLaboral/calendarioLaboral.component';
import { MantenimientoProcuradoresComponent } from './features/sjcs/maestros/mantenimiento-procuradores/mantenimiento-procuradores.component';
import { MantenimientoPrisionesComponent } from './features/sjcs/maestros/mantenimiento-prisiones/mantenimiento-prisiones.component';
import { MantenimientoComisariasComponent } from './features/sjcs/maestros/mantenimiento-comisarias/mantenimiento-comisarias.component';
import { MantenimientoJuzgadosComponent } from './features/sjcs/maestros/mantenimiento-juzgados/mantenimiento-juzgados.component';
import { MaestroPJComponent } from './features/sjcs/maestros/maestro-pj/maestro-pj.component';
import { SOJComponent } from './features/sjcs/soj/soj.component';
import { GestionActasComponent } from './features/sjcs/gestion-actas/gestion-actas.component';
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
import { ComunicaPreparacionComponent } from './features/sjcs/comunicaciones/comunica-preparacion/comunica-preparacion.component';
import { ComunicaRemesaEnvioComponent } from './features/sjcs/comunicaciones/comunica-remesa-envio/comunica-remesa-envio.component';
import { ComunicaRemesaResultadoComponent } from './features/sjcs/comunicaciones/comunica-remesa-resultado/comunica-remesa-resultado.component';
import { ComunicaEnvioActualizacionComponent } from './features/sjcs/comunicaciones/comunica-envio-actualizacion/comunica-envio-actualizacion.component';
import { ComunicaInfoEconomicaComponent } from './features/sjcs/comunicaciones/comunica-info-economica/comunica-info-economica.component';
import { ComunicaCargaComponent } from './features/sjcs/comunicaciones/comunica-carga/comunica-carga.component';
import { ComunicaResolucionesComponent } from './features/sjcs/comunicaciones/comunica-resoluciones/comunica-resoluciones.component';
import { ComunicaDesignacionesComponent } from './features/sjcs/comunicaciones/comunica-designaciones/comunica-designaciones.component';
import { MutualidadAbogaciaSeguroAccidentes } from './features/censo/solicitudes-incorporacion/mutualidadAbogaciaSeguroAccidentes/mutualidad-abogacia-seguro-accidentes.component';
import { AlterMutuaRetaComponent } from './features/censo/solicitudes-incorporacion/alter-mutua/alterMutuaReta/alter-mutua-reta.component';
import { AlterMutuaComponent } from './features/censo/solicitudes-incorporacion/alter-mutua/alter-mutua.component';
import { AlterMutuaOfertasComponent } from './features/censo/solicitudes-incorporacion/alter-mutua/alterMutuaOfertas/alter-mutua-ofertas.component';

//Consultas
import { RecuperarConsultasComponent } from './features/consultas/recuperar-consultas/recuperar-consultas.component';
import { ConsultasListasDinamicasComponent } from './features/consultas/consultas-listas-dinamicas/consultas-listas-dinamicas.component';
import { NuevaConsultaComponent } from './features/consultas/nueva-consulta/nueva-consulta.component';
import { NuevaConsultaExpertaComponent } from './features/consultas/nueva-consulta-experta/nueva-consulta-experta.component';

//Comunicaciones
import { InformesGenericosComponent } from './features/comunicaciones/informes-genericos/informes-genericos.component';
import { DefinirTipoPlantillaComponent } from './features/comunicaciones/definir-tipo-plantilla/definir-tipo-plantilla.component';
import { ListaCorreosComponent } from './features/comunicaciones/lista-correos/lista-correos.component';
import { BandejaSalidaComponent } from './features/comunicaciones/bandeja-salida/bandeja-salida.component';
import { BandejaEntradaComponent } from './features/comunicaciones/bandeja-entrada/bandeja-entrada.component';

/***NEW modules censo***/
import { BusquedaColegiadosComponentNew } from './new-features/censo/busqueda-colegiados/busqueda-colegiados.component';
import { BusquedaPersonasJuridicas } from './features/censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component';
import { DatosGenerales } from './features/censo/datosPersonaJuridica/datos-generales/datos-generales.component';
import { DatosRegistralesComponent } from './features/censo/datosPersonaJuridica/datos-registrales/datos-registrales.component';
import { DatosRetencionesComponent } from './features/censo/datosPersonaJuridica/datos-retenciones/datos-retenciones.component';
import { ServiciosInteresComponent } from './features/censo/datosPersonaJuridica/servicios-interes/servicios-interes.component';

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
import { SelectButtonModule, ColorPickerModule, OverlayPanelModule } from 'primeng/primeng';
import { FichaCalendarioComponent } from './features/agenda/ficha-calendario/ficha-calendario.component';
import { CargasMasivasComponent } from './features/censo/cargas-masivas/cargas-masivas.component';
import { DatosNotificacionesComponent } from './features/agenda/datos-notificaciones/datos-notificaciones.component';
import { FichaEventosComponent } from './features/agenda/ficha-eventos/ficha-eventos.component';

//Calendario
import { ScheduleModule } from 'primeng/schedule';
import { FichaCursoComponent } from './features/formacion/ficha-curso/ficha-curso.component';
import { DetalleSancionComponent } from './features/censo/busqueda-sanciones/detalle-sancion/detalle-sancion.component';
import { BusquedaInscripcionesComponent } from './features/formacion/busqueda-inscripciones/busqueda-inscripciones.component';
import { FichaInscripcionComponent } from './features/formacion/ficha-inscripcion/ficha-inscripcion.component';
import { SolicitudesModificacionComponent } from './features/censo/solicitudes-modificacion/solicitudes-modificacion.component';
import { NuevaSolicitudesModificacionComponent } from './features/censo/solicitudes-modificacion/nueva-solicitudes-modificacion/nueva-solicitudes-modificacion.component';
import { ComunicacionesCensoComponent } from './features/censo/comunicacionesCenso/comunicaciones.component';

import { ExpedientesComponent } from './features/censo/expedientesCenso/expedientes.component';
import { RegtelComponent } from './features/censo/regtel/regtel.component';
import { TurnoOficioComponent } from './features/censo/turnoOficioCenso/turnoOficio.component';
import { BusquedaCensoGeneralComponent } from './features/censo/busqueda-censo-general/busqueda-censo-general.component';

registerLocaleData(es);



//INFORMES Y COMUNICACIONES
import { PlantillasEnvioComponent } from './features/informes-comunicaciones/plantillas-envio/plantillas-envio.component';
import { ModelosComunicacionesComponent } from './features/informes-comunicaciones/modelos-comunicaciones/modelos-comunicaciones.component';
import { FichaModeloComunicacionesComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/ficha-modelo-comunicaciones.component';
import { DatosGeneralesFichaComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/datos-generales-ficha/datos-generales-ficha.component';
import { TarjetaInformesComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/tarjeta-informes/tarjeta-informes.component';
import { PlantillaDocumentoComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/tarjeta-informes/plantilla-documento/plantilla-documento.component';
import { PerfilesFichaComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/perfiles-ficha/perfiles-ficha.component';
import { DetallePlantillaEnvioComponent } from './features/informes-comunicaciones/plantillas-envio/detalle-plantilla-envio/detalle-plantilla-envio.component';
import { ConsultasPlantillasComponent } from './features/informes-comunicaciones/plantillas-envio/detalle-plantilla-envio/consultas-plantillas/consultas-plantillas.component';
import { DatosGeneralesPlantillaComponent } from './features/informes-comunicaciones/plantillas-envio/detalle-plantilla-envio/datos-generales-plantilla/datos-generales-plantilla.component';
import { RemitentePlantillaComponent } from './features/informes-comunicaciones/plantillas-envio/detalle-plantilla-envio/remitente-plantilla/remitente-plantilla.component';
import { TarjetaComunicacionesComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/tarjeta-comunicaciones/tarjeta-comunicaciones.component';
import { ConsultasComponent } from './features/informes-comunicaciones/consultas/consultas.component';
import { FichaConsultaComponent } from './features/informes-comunicaciones/consultas/ficha-consulta/ficha-consulta.component';
import { DatosGeneralesConsultaComponent } from './features/informes-comunicaciones/consultas/ficha-consulta/datos-generales-consulta/datos-generales-consulta.component';
import { ModelosComunicacionesConsultaComponent } from './features/informes-comunicaciones/consultas/ficha-consulta/modelos-comunicaciones-consulta/modelos-comunicaciones-consulta.component';
import { PlantillasEnviosConsultasComponent } from './features/informes-comunicaciones/consultas/ficha-consulta/plantillas-envios-consultas/plantillas-envios-consultas.component';
import { ConsultaComponent } from './features/informes-comunicaciones/consultas/ficha-consulta/consulta/consulta.component';
import { ComunicacionesComponent } from './features/informes-comunicaciones/comunicaciones/comunicaciones.component';
import { FichaRegistroComunicacionComponent } from './features/informes-comunicaciones/comunicaciones/ficha-registro-comunicacion/ficha-registro-comunicacion.component';
import { ConfiguracionComponent } from './features/informes-comunicaciones/comunicaciones/ficha-registro-comunicacion/configuracion/configuracion.component';
import { ProgramacionComponent } from './features/informes-comunicaciones/comunicaciones/ficha-registro-comunicacion/programacion/programacion.component';
import { DocumentosComponent } from './features/informes-comunicaciones/comunicaciones/ficha-registro-comunicacion/documentos/documentos.component';
import { DestinatariosComponent } from './features/informes-comunicaciones/comunicaciones/ficha-registro-comunicacion/destinatarios/destinatarios.component';
import { DestinatarioListEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/destinatarios-list-envio-masivo/destinatarios-list-envio-masivo.component';
import { EnviosMasivosComponent } from './features/informes-comunicaciones/envios-masivos/envios-masivos.component';
import { FichaRegistroEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/ficha-registro-envio-masivo.component';
import { ConfiguracionEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/configuracion-envio-masivo/configuracion-envio-masivo.component'
import { ProgramacionEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/programacion-envio-masivo/programacion-envio-masivo.component'
import { DocumentosEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/documentos-envio-masivo/documentos-envio-masivo.component'
import { DestinatariosEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/destinatarios-etiquetas-envio-masivo/destinatarios-etiquetas-envio-masivo.component'
import { DialogoComunicacionesComponent } from './features/informes-comunicaciones/dialogo-comunicaciones/dialogo-comunicaciones.component';
import { DestinatarioIndvEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/destinatario-indv-envio-masivo/destinatario-indv-envio-masivo.component';
import { CommonsService } from './_services/commons.service';
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
import { SjcsModule } from './features/sjcs/sjcs.module';
import { PipeNumberModule } from './commons/number-pipe/number-pipe.module';

import { PersistenceService } from './_services/persistence.service';
import { FechaModule } from './commons/fecha/fecha.module';
import { PrecioModule } from './commons/precio/precio.module';
import { DialogoModule } from './commons/dialog/dialogo.module';
import { BuscadorProcuradoresComponent } from './commons/buscador-procuradores/buscador-procuradores.component';
import { FiltroBuscadorProcuradorComponent } from './commons/buscador-procuradores/filtro/filtro.component';
import { TablaBuscadorProcuradorComponent } from './commons/buscador-procuradores/tabla/tabla.component';
import { GeneralSJCSModule } from './commons/busqueda-generalSJCS/busqueda-generalSJCS.module';

import { BusquedaAsuntosModule } from './commons/busqueda-asuntos/busqueda-asuntos.module';
import { PipeTranslationModule } from './commons/translate/pipe-translation.module';

//angular material
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@NgModule({
	declarations: [
		AppComponent,
		ImagePipe,

		MyIframeComponent,
		MenuComponent,
		LoginComponent,
		LoginDevelopComponent,
		LoginMultipleComponent,
		LogoutComponent,
		HeaderComponent,
		HomeComponent,
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
		SOJComponent,
		GestionActasComponent,
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
		BuscadorProcuradoresComponent,
		FiltroBuscadorProcuradorComponent,
		TablaBuscadorProcuradorComponent,
	],
	imports: [
		BrowserModule,
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
		TooltipModule,
		ListboxModule,
		ChipsModule,
		EditorModule,
		MultiSelectModule,
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
		DialogoModule,
		PrecioModule,
		KeyFilterModule,
		StepsModule,
		TarjetaResumenFijaModule,

		BusquedaColegiadoExpressModule,
		GeneralSJCSModule,
		SelectButtonModule,
		ColorPickerModule,
		// BusquedaAsuntosModule,
		EditorModule,
		SjcsModule,
		BusquedaAsuntosModule,
		MatSelectModule,
		MatSortModule,
		MatTableModule,
		MatExpansionModule,
		MatPaginatorModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule
	],

	exports: [],
	providers: [
		// { provide: TranslationClass.TRANSLATIONS, useValue: TranslationClass.dictionary },
		ImagePipe,
		DatePipe,
		OldSigaServices,
		SigaServices,
		CommonsService,
		cardService,
		HeaderGestionEntidadService,
		MessageService,
		AuthenticationService,
		ConfirmationService,

		PersistenceService,

		TrimPipePipe,

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
