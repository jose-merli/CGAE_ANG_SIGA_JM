import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APP_BASE_HREF, DatePipe } from "@angular/common";
import { ValidationModule } from "./commons/validation/validation.module";
import { MenubarModule } from "primeng/menubar";
import { PanelMenuModule } from "primeng/panelmenu";
import { MenuItem } from "primeng/api";
import { DialogModule } from "primeng/dialog";

import { AuthGuard } from "./_guards/auth.guards";
import { OldSigaServices } from "./_services/oldSiga.service";
import { SigaServices } from "./_services/siga.service";
import { cardService } from "./_services/cardSearch.service";
import { CookieService } from "ngx-cookie-service";
// prueba
import { HeaderGestionEntidadService } from "./_services/headerGestionEntidad.service";
import { AuthenticationService } from "./_services/authentication.service";
import { JwtInterceptor } from "./_interceptor/jwt.interceptor";

// Componentes comunes
import { routing } from "./app.routing";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./commons/header/header.component";
import { MyIframeComponent } from "./commons/my-iframe/my-iframe.component";
import { MenuComponent } from "./commons/menu/menu.component";
import { HomeComponent } from "./features/home/home.component";
import { LoginComponent } from "./commons/login/login.component";
import { LoginDevelopComponent } from "./commons/login-develop/login-develop.component";
import { TranslatePipe, TranslateService } from "./commons/translate";
import { ImagePipe } from "./commons/image-pipe/image.pipe";
import { ConfirmDialogComponent } from "./commons/dialog/dialog.component";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { TreeModule } from "primeng/tree";
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
import { EditorModule } from "primeng/editor";
import { PickListModule } from "primeng/picklist";
import { FileUploadModule } from "primeng/fileupload";
// Modulo de censo
import { SearchColegiadosComponent } from "./features/censo/search-colegiados/search-colegiados.component";
import { SearchNoColegiadosComponent } from "./features/censo/search-no-colegiados/search-no-colegiados.component";
import { CertificadosAcaComponent } from "./features/censo/certificados-aca/certificados-aca.component";
import { ComisionesCargosComponent } from "./features/censo/comisiones-cargos/comisiones-cargos.component";
import { SolicitudesGenericasComponent } from "./features/censo/solicitudes-genericas/solicitudes-genericas.component";
import { SolicitudesEspecificasComponent } from "./features/censo/solicitudes-especificas/solicitudes-especificas.component";
import { SolicitudesIncorporacionComponent } from "./features/censo/solicitudes-incorporacion/solicitudes-incorporacion.component";
import { NuevaIncorporacionComponent } from "./features/censo/nueva-incorporacion/nueva-incorporacion.component";
import { DocumentacionSolicitudesComponent } from "./features/censo/documentacion-solicitudes/documentacion-solicitudes.component";
import { MantenimientoGruposFijosComponent } from "./features/censo/mantenimiento-grupos-fijos/mantenimiento-grupos-fijos.component";
import { MantenimientoMandatosComponent } from "./features/censo/mantenimiento-mandatos/mantenimiento-mandatos.component";
import { BusquedaSancionesComponent } from "./features/censo/busqueda-sanciones/busqueda-sanciones.component";
import { BusquedaColegiadosComponent } from "./features/censo/busqueda-colegiados/busqueda-colegiados.component";
import { BusquedaColegiadosComponentI } from "./features/censo/busqueda-colegiados-censoI/busqueda-colegiados.component";
import { FichaColegialComponent } from "./features/censo/ficha-colegial/ficha-colegial.component";
import { BusquedaLetradosComponent } from "./features/censo/busqueda-letrados/busqueda-letrados.component";
import { MantenimientoDuplicadosComponent } from "./features/censo/mantenimiento-duplicados/mantenimiento-duplicados.component";
import { ModificacionDatosComponent } from "./features/censo/modificacion-datos/modificacion-datos.component";
import { MediadoresComponent } from "./features/censo/mediadores/mediadores.component";
import { CargasPeriodicasComponent } from "./features/censo/cargas-periodicas/cargas-periodicas.component";
import { ConfigurarPerfilComponent } from "./features/censo/configurar-perfil/configurar-perfil.component";
import { CensoDocumentacionComponent } from "./features/censo/censo-documentacion/censo-documentacion.component";
import { GestionSubtiposCVComponent } from "./features/censo/gestion-subtiposCV/gestion-subtiposCV.component";
import { DatosPersonaJuridicaComponent } from "./features/censo/datosPersonaJuridica/datosPersonaJuridica.component";
import { BusquedaGeneralComponent } from "./features/censo/busqueda-general/busqueda-general.component";
import { CommonModule } from "@angular/common";
import { AccesoFichaPersonaComponent } from "./features/censo/datosPersonaJuridica/accesoFichaPersona/accesoFichaPersona.component";
import { DatosBancariosComponent } from "./features/censo/datosPersonaJuridica/datos-bancarios/datos-bancarios.component";
import { ConsultarDatosBancariosComponent } from "./features/censo/datosPersonaJuridica/datos-bancarios/consultar-datos-bancarios/consultar-datos-bancarios.component";
// import { DatosCuentaBancariaComponent } from "./features/censo/datos-cuenta-bancaria/datos-cuenta-bancaria.component";
// import { DatosMandatosComponent } from "./features/censo/datos-mandatos/datos-mandatos.component";
// import { ListadoFicherosAnexosComponent } from "./features/censo/listado-ficheros-anexos/listado-ficheros-anexos.component";
import { DatosIntegrantesComponent } from "./features/censo/datosPersonaJuridica/datos-integrantes/datos-integrantes.component";
import { DetalleIntegranteComponent } from "./features/censo/datosPersonaJuridica/datos-integrantes/detalleIntegrante/detalleIntegrante.component";
import { DatosDireccionesComponent } from "./features/censo/datosPersonaJuridica/datos-direcciones/datos-direcciones.component";
import { ConsultarDatosDireccionesComponent } from "./features/censo/datosPersonaJuridica/datos-direcciones/consultar-datos-direcciones/consultar-datos-direcciones.component";

// Modulo de administracion
import { CatalogosMaestros } from "./features/administracion/catalogos-maestros/catalogos-maestros.component";
import { EditarCatalogosMaestrosComponent } from "./features/administracion/catalogos-maestros/editarCatalogosMaestros/editarCatalogosMaestros.component";
import { GestionContadoresComponent } from "./features/administracion/contadores/gestion-contadores/gestion-contadores.component";
import { ContadoresComponent } from "./features/administracion/contadores/contadores.component";
import { PerfilesComponent } from "./features/administracion/perfiles/perfiles.component";
import { EditarPerfilesComponent } from "./features/administracion/perfiles/editarPerfiles/editarPerfiles.component";
import { EditarUsuarioComponent } from "./features/administracion/usuarios/editarUsuario/editarUsuario.component";
import { GruposUsuarios } from "./features/administracion/grupos-usuarios/grupos-usuarios.component";
import { Etiquetas } from "./features/administracion/gestion-multiidioma/etiquetas/etiquetas.component";
import { GestionEntidad } from "./features/administracion/gestion-entidad/gestion-entidad.component";
import { AuditoriaUsuarios } from "./features/administracion/auditoria/usuarios/auditoria-usuarios.component";
import { GestionAuditoriaComponent } from "./features/administracion/auditoria/usuarios/editarAuditoriaUsuarios/gestion-auditoria.component";
import { SeleccionarIdioma } from "./features/administracion/seleccionar-idioma/seleccionar-idioma.component";
import { Usuarios } from "./features/administracion/usuarios/usuarios.component";
import { ParametrosGenerales } from "./features/administracion/parametros/parametros-generales/parametros-generales.component";
import { Catalogos } from "./features/administracion/gestion-multiidioma/catalogos/catalogos.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { PermisosComponent } from "./features/administracion/permisos/permisos.component";

//Modulo de Certificados
import { ComunicacionInterprofesionalComponent } from "./features/certificados/comunicacion-interprofesional/comunicacion-interprofesional.component";
import { SolicitarCompraComponent } from "./features/certificados/solicitar-compra/solicitar-compra.component";
import { SolicitudCertificadosComponent } from "./features/certificados/solicitud-certificados/solicitud-certificados.component";
import { GestionSolicitudesComponent } from "./features/certificados/gestion-solicitudes/gestion-solicitudes.component";
import { MantenimientoCertificadosComponent } from "./features/certificados/mantenimiento-certificados/mantenimiento-certificados.component";

//Modulo de Facturacion
import { MantenimientoSufijosComponent } from "./features/facturacion/mantenimiento-sufijos/mantenimiento-sufijos.component";
import { FacturaPlantillasComponent } from "./features/facturacion/factura-plantillas/factura-plantillas.component";
import { GestionCuentasBancariasComponent } from "./features/facturacion/gestion-cuentas-bancarias/gestion-cuentas-bancarias.component";
import { SeriesFacturaComponent } from "./features/facturacion/series-factura/series-factura.component";
import { PrevisionesFacturaComponent } from "./features/facturacion/previsiones-factura/previsiones-factura.component";
import { ProgramarFacturaComponent } from "./features/facturacion/programar-factura/programar-factura.component";
import { GenerarFacturaComponent } from "./features/facturacion/generar-factura/generar-factura.component";
import { MantenimientoFacturaComponent } from "./features/facturacion/mantenimiento-factura/mantenimiento-factura.component";
import { EliminarFacturaComponent } from "./features/facturacion/eliminar-factura/eliminar-factura.component";
import { FacturasComponent } from "./features/facturacion/facturas/facturas.component";
import { FicherosAdeudosComponent } from "./features/facturacion/ficheros-adeudos/ficheros-adeudos.component";
import { FicherosDevolucionesComponent } from "./features/facturacion/devoluciones/ficheros-devoluciones/ficheros-devoluciones.component";
import { DevolucionManualComponent } from "./features/facturacion/devoluciones/devolucion-manual/devolucion-manual.component";
import { AbonosComponent } from "./features/facturacion/abonos/abonos.component";
import { FicherosTransferenciaComponent } from "./features/facturacion/ficheros-transferencia/ficheros-transferencia.component";
import { ContabilidadComponent } from "./features/facturacion/contabilidad/contabilidad.component";
import { CobrosRecobrosComponent } from "./features/facturacion/cobros-recobros/cobros-recobros.component";
import { FacturasEmitidasComponent } from "./features/facturacion/informes/facturas-emitidas/facturas-emitidas.component";

//Modulo de Productos y Servicios
import { CategoriasProductoComponent } from "./features/productosYServicios/categoriasProducto/categoriasProducto.component";
import { CategoriasServiciosComponent } from "./features/productosYServicios/categoriasServicios/categoriasServicios.component";
import { MantenimientoProductosComponent } from "./features/productosYServicios/mantenimientoProductos/mantenimientoProductos.component";
import { MantenimientoServiciosComponent } from "./features/productosYServicios/mantenimientoServicios/mantenimientoServicios.component";
import { GestionarSolicitudesComponent } from "./features/productosYServicios/gestionarSolicitudes/gestionarSolicitudes.component";
import { SolicitudCompraSubscripcionComponent } from "./features/productosYServicios/solicitudCompraSubscripcion/solicitudCompraSubscripcion.component";
import { SolicitudAnulacionComponent } from "./features/productosYServicios/solicitudAnulacion/solicitudAnulacion.component";
import { CargaComprasComponent } from "./features/productosYServicios/cargaCompras/cargaCompras.component";

//Modulo de Expedientes
import { TiposExpedientesComponent } from "./features/expedientes/tipos-expedientes/tipos-expedientes.component";
import { GestionarExpedientesComponent } from "./features/expedientes/gestionar-expedientes/gestionar-expedientes.component";
import { AlertasComponent } from "./features/expedientes/alertas/alertas.component";
import { NuevoExpedienteComponent } from "./features/expedientes/nuevo-expediente/nuevo-expediente.component";

//Modulo de Justicia Gratuita
import { DesignacionesComponent } from "./features/sjcs/oficio/designaciones/designaciones.component";
import { ZonasYSubzonasComponent } from "./features/sjcs/maestros/zonas-subzonas/zonas-subzonas.component";
import { AreasYMateriasComponent } from "./features/sjcs/maestros/areas-materias/areas-materias.component";
import { PartidasComponent } from "./features/sjcs/maestros/partidas/partidas.component";
import { PartidosJudicialesComponent } from "./features/sjcs/maestros/partidos-judiciales/partidos-judiciales.component";
import { RetencionesIRPFComponent } from "./features/sjcs/maestros/retenciones-IRPF/retenciones-IRPF.component";
import { MaestrosModulosComponent } from "./features/sjcs/maestros/maestros-modulos/maestros-modulos.component";
import { CalendarioLaboralComponent } from "./features/sjcs/maestros/calendarioLaboral/calendarioLaboral.component";
import { MantenimientoProcuradoresComponent } from "./features/sjcs/maestros/mantenimiento-procuradores/mantenimiento-procuradores.component";
import { MantenimientoPrisionesComponent } from "./features/sjcs/maestros/mantenimiento-prisiones/mantenimiento-prisiones.component";
import { MantenimientoComisariasComponent } from "./features/sjcs/maestros/mantenimiento-comisarias/mantenimiento-comisarias.component";
import { MantenimientoJuzgadosComponent } from "./features/sjcs/maestros/mantenimiento-juzgados/mantenimiento-juzgados.component";
import { DocumentacionEJGComponent } from "./features/sjcs/maestros/documentacion-ejg/documentacion-ejg.component";
import { MaestroPJComponent } from "./features/sjcs/maestros/maestro-pj/maestro-pj.component";
import { DestinatariosRetencionesComponent } from "./features/sjcs/maestros/destinatarios-retenciones/destinatarios-retenciones.component";
import { TiposAsistenciaComponent } from "./features/sjcs/maestros/tiposAsistencia/tiposAsistencia.component";
import { TurnosComponent } from "./features/sjcs/oficio/turnos/turnos.component";
import { SolicitudesTurnosGuardiasComponent } from "./features/sjcs/oficio/solicitudesTurnosGuardias/solicitudesTurnosGuardias.component";
import { BajasTemporalesComponent } from "./features/sjcs/oficio/bajas-temporales/bajas-temporales.component";
import { SaltosYCompensacionesComponent } from "./features/sjcs/oficio/saltos-compensaciones/saltos-compensaciones.component";
import { GuardiasSolicitudesTurnosComponent } from "./features/sjcs/guardia/solicitudes-turnos/solicitudes-turnos.component";
import { GuardiasIncompatibilidadesComponent } from "./features/sjcs/guardia/guardias-incompatibilidades/guardias-incompatibilidades.component";
import { ProgramacionCalendariosComponent } from "./features/sjcs/guardia/programacionCalendarios/programacionCalendarios.component";
import { GuardiasBajasTemporalesComponent } from "./features/sjcs/guardia/guardias-bajas-temporales/guardias-bajas-temporales.component";
import { GuardiasSaltosCompensacionesComponent } from "./features/sjcs/guardia/guardias-saltos-compensaciones/guardias-saltos-compensaciones.component";
import { DefinirListasGuardiasComponent } from "./features/sjcs/guardia/definir-listas-guardias/definir-listas-guardias.component";
import { GuardiasAsistenciasComponent } from "./features/sjcs/guardia/guardias-asistencias/guardias-asistencias.component";
import { GuardiasCentralitaComponent } from "./features/sjcs/guardia/guardias-centralita/guardias-centralita.component";
import { VolanteExpresComponent } from "./features/sjcs/guardia/volante-expres/volante-expres.component";
import { SOJComponent } from "./features/sjcs/soj/soj.component";
import { EJGComponent } from "./features/sjcs/ejg/ejg.component";
import { GestionActasComponent } from "./features/sjcs/gestion-actas/gestion-actas.component";
import { MantenimientoFacturacionComponent } from "./features/sjcs/facturacionSJCS/mantenimiento-facturacion/mantenimiento-facturacion.component";
import { PrevisionesComponent } from "./features/sjcs/facturacionSJCS/previsiones/previsiones.component";
import { MantenimientoPagosComponent } from "./features/sjcs/facturacionSJCS/mantenimiento-pagos/mantenimiento-pagos.component";
import { MovimientosVariosComponent } from "./features/sjcs/facturacionSJCS/movimientos-varios/movimientos-varios.component";
import { TramosLECComponent } from "./features/sjcs/facturacionSJCS/tramos-lec/tramos-lec.component";
import { RetencionesJudicialesComponent } from "./features/sjcs/facturacionSJCS/retenciones-judiciales/retenciones-judiciales.component";
import { BusquedaRetencionesAplicadasComponent } from "./features/sjcs/facturacionSJCS/busqueda-retenciones-aplicadas/busqueda-retenciones-aplicadas.component";
import { GenerarImpreso190Component } from "./features/sjcs/facturacionSJCS/generar-impreso190/generar-impreso190.component";
import { ResumenPagosComponent } from "./features/sjcs/facturacionSJCS/resumen-pagos/resumen-pagos.component";
import { EnvioReintegrosXuntaComponent } from "./features/sjcs/facturacionSJCS/envio-reintegros-xunta/envio-reintegros-xunta.component";
import { JustificacionLetradoComponent } from "./features/sjcs/informes/justificacion-letrado/justificacion-letrado.component";
import { InformeFacturacionComponent } from "./features/sjcs/informes/informe-facturacion/informe-facturacion.component";
import { InformeFacturacionMultipleComponent } from "./features/sjcs/informes/informe-facturacion-multiple/informe-facturacion-multiple.component";
import { InformeFacturacionPersonalizadoComponent } from "./features/sjcs/informes/informe-facturacion-personalizado/informe-facturacion-personalizado.component";
import { FichaFacturacionComponent } from "./features/sjcs/informes/ficha-facturacion/ficha-facturacion.component";
import { FichaPagoComponent } from "./features/sjcs/informes/ficha-pago/ficha-pago.component";
import { CartaPagosColegiadosComponent } from "./features/sjcs/informes/carta-pagos-colegiados/carta-pagos-colegiados.component";
import { CartaFacturaColegiadoComponent } from "./features/sjcs/informes/carta-factura-colegiado/carta-factura-colegiado.component";
import { CertificadosPagosComponent } from "./features/sjcs/informes/certificados-pagos/certificados-pagos.component";
import { CertificadosIrpfComponent } from "./features/sjcs/informes/certificados-irpf/certificados-irpf.component";
import { ComunicaPreparacionComponent } from "./features/sjcs/comunicaciones/comunica-preparacion/comunica-preparacion.component";
import { ComunicaRemesaEnvioComponent } from "./features/sjcs/comunicaciones/comunica-remesa-envio/comunica-remesa-envio.component";
import { ComunicaRemesaResultadoComponent } from "./features/sjcs/comunicaciones/comunica-remesa-resultado/comunica-remesa-resultado.component";
import { ComunicaEnvioActualizacionComponent } from "./features/sjcs/comunicaciones/comunica-envio-actualizacion/comunica-envio-actualizacion.component";
import { ComunicaInfoEconomicaComponent } from "./features/sjcs/comunicaciones/comunica-info-economica/comunica-info-economica.component";
import { ComunicaCargaComponent } from "./features/sjcs/comunicaciones/comunica-carga/comunica-carga.component";
import { ComunicaResolucionesComponent } from "./features/sjcs/comunicaciones/comunica-resoluciones/comunica-resoluciones.component";
import { ComunicaDesignacionesComponent } from "./features/sjcs/comunicaciones/comunica-designaciones/comunica-designaciones.component";

//Consultas
import { RecuperarConsultasComponent } from "./features/consultas/recuperar-consultas/recuperar-consultas.component";
import { ConsultasListasDinamicasComponent } from "./features/consultas/consultas-listas-dinamicas/consultas-listas-dinamicas.component";
import { NuevaConsultaComponent } from "./features/consultas/nueva-consulta/nueva-consulta.component";
import { NuevaConsultaExpertaComponent } from "./features/consultas/nueva-consulta-experta/nueva-consulta-experta.component";

//Comunicaciones
import { InformesGenericosComponent } from "./features/comunicaciones/informes-genericos/informes-genericos.component";
import { DefinirTipoPlantillaComponent } from "./features/comunicaciones/definir-tipo-plantilla/definir-tipo-plantilla.component";
import { ListaCorreosComponent } from "./features/comunicaciones/lista-correos/lista-correos.component";
import { BandejaSalidaComponent } from "./features/comunicaciones/bandeja-salida/bandeja-salida.component";
import { BandejaEntradaComponent } from "./features/comunicaciones/bandeja-entrada/bandeja-entrada.component";

/***NEW modules censo***/
import { BusquedaColegiadosComponentNew } from "./new-features/censo/busqueda-colegiados/busqueda-colegiados.component";
import { BusquedaPersonasJuridicas } from "./features/censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component";
import { DatosGenerales } from "./features/censo/datosPersonaJuridica/datos-generales/datos-generales.component";
import { DatosRegistralesComponent } from "./features/censo/datosPersonaJuridica/datos-registrales/datos-registrales.component";
import { DatosRetencionesComponent } from "./features/censo/datosPersonaJuridica/datos-retenciones/datos-retenciones.component";
import { ServiciosInteresComponent } from "./features/censo/datosPersonaJuridica/servicios-interes/servicios-interes.component";

//COOKIES
import { PoliticaCookiesComponent } from "./features/politica-cookies/politica-cookies.component";

@NgModule({
  declarations: [
    AppComponent,
    TranslatePipe,
    ImagePipe,

    MyIframeComponent,
    MenuComponent,
    LoginComponent,
    LoginDevelopComponent,
    HeaderComponent,
    HomeComponent,
    ConfirmDialogComponent,
    // Censo
    AccesoFichaPersonaComponent,
    SearchColegiadosComponent,
    BusquedaGeneralComponent,
    SearchNoColegiadosComponent,
    CertificadosAcaComponent,
    ComisionesCargosComponent,
    SolicitudesGenericasComponent,
    SolicitudesEspecificasComponent,
    SolicitudesIncorporacionComponent,
    NuevaIncorporacionComponent,
    DocumentacionSolicitudesComponent,
    MantenimientoGruposFijosComponent,
    MantenimientoMandatosComponent,
    BusquedaSancionesComponent,
    BusquedaColegiadosComponent,
    BusquedaColegiadosComponentI,
    FichaColegialComponent,
    BusquedaLetradosComponent,
    MantenimientoDuplicadosComponent,
    ModificacionDatosComponent,
    MediadoresComponent,
    CargasPeriodicasComponent,
    ConfigurarPerfilComponent,
    CensoDocumentacionComponent,
    GestionSubtiposCVComponent,
    BusquedaColegiadosComponentNew,
    BusquedaPersonasJuridicas,
    DatosGenerales,
    DatosRegistralesComponent,
    DatosPersonaJuridicaComponent,
    DatosRetencionesComponent,
    DetalleIntegranteComponent,
    ServiciosInteresComponent,
    //SJRS
    DesignacionesComponent,
    BajasTemporalesComponent,

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
    PartidasComponent,
    PartidosJudicialesComponent,
    RetencionesIRPFComponent,
    MaestrosModulosComponent,
    CalendarioLaboralComponent,
    MantenimientoProcuradoresComponent,
    MantenimientoPrisionesComponent,
    MantenimientoComisariasComponent,
    MantenimientoJuzgadosComponent,
    DocumentacionEJGComponent,
    MaestroPJComponent,
    DestinatariosRetencionesComponent,
    TiposAsistenciaComponent,
    TurnosComponent,
    SolicitudesTurnosGuardiasComponent,
    SaltosYCompensacionesComponent,
    GuardiasSolicitudesTurnosComponent,
    GuardiasIncompatibilidadesComponent,
    ProgramacionCalendariosComponent,
    GuardiasBajasTemporalesComponent,
    GuardiasSaltosCompensacionesComponent,
    DefinirListasGuardiasComponent,
    GuardiasAsistenciasComponent,
    GuardiasCentralitaComponent,
    VolanteExpresComponent,
    SOJComponent,
    EJGComponent,
    GestionActasComponent,
    MantenimientoFacturacionComponent,
    PrevisionesComponent,
    MantenimientoPagosComponent,
    MovimientosVariosComponent,
    TramosLECComponent,
    RetencionesJudicialesComponent,
    BusquedaRetencionesAplicadasComponent,
    GenerarImpreso190Component,
    ResumenPagosComponent,
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
    ConsultarDatosDireccionesComponent
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
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,

    RadioButtonModule,
    ConfirmDialogModule,
    ValidationModule,
    GrowlModule,
    CommonModule,
    CalendarModule,
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
    DialogModule
  ],
  providers: [
    // { provide: TranslationClass.TRANSLATIONS, useValue: TranslationClass.dictionary },
    TranslateService,
    ImagePipe,
    DatePipe,
    OldSigaServices,
    SigaServices,
    cardService,
    HeaderGestionEntidadService,
    MessageService,
    AuthenticationService,
    ConfirmationService,
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
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
