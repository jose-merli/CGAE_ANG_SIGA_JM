import { Routes, RouterModule } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthGuard } from "./_guards/auth.guards";
import { LoginComponent } from "./commons/login/login.component";
import { LoginDevelopComponent } from "./commons/login-develop/login-develop.component";
import { LoginMultipleComponent } from "./commons/login-multiple/login-multiple.component";
import { HomeComponent } from "./features/home/home.component";
import { LogoutComponent } from "./commons/logout/logout.component";

// Censo
import { SearchColegiadosComponent } from './features/censo/search-colegiados/search-colegiados.component';
import { SearchNoColegiadosComponent } from './features/censo/search-no-colegiados/search-no-colegiados.component';
import { BusquedaNoColegiadosComponent } from './features/censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { CertificadosAcaComponent } from './features/censo/certificados-aca/certificados-aca.component';
import { ComisionesCargosComponent } from './features/censo/comisiones-cargos/comisiones-cargos.component';
import { SolicitudesGenericasComponent } from './features/censo/solicitudes-genericas/solicitudes-genericas.component';
import { SolicitudesEspecificasComponent } from './features/censo/solicitudes-especificas/solicitudes-especificas.component';
import { SolicitudesIncorporacionComponent } from './features/censo/solicitudes-incorporacion/solicitudes-incorporacion.component';
import { AlterMutuaComponent } from './features/censo/solicitudes-incorporacion/alter-mutua/alter-mutua.component';
import { AlterMutuaRetaComponent } from './features/censo/solicitudes-incorporacion/alter-mutua/alterMutuaReta/alter-mutua-reta.component';
import { AlterMutuaOfertasComponent } from './features/censo/solicitudes-incorporacion/alter-mutua/alterMutuaOfertas/alter-mutua-ofertas.component';
import { NuevaIncorporacionComponent } from './features/censo/solicitudes-incorporacion/nueva-incorporacion/nueva-incorporacion.component';
import { DocumentacionSolicitudesComponent } from './features/censo/documentacion-solicitudes/documentacion-solicitudes.component';
import { MantenimientoGruposFijosComponent } from './features/censo/mantenimiento-grupos-fijos/mantenimiento-grupos-fijos.component';
import { ModificacionDatosComponent } from './features/censo/modificacion-datos/modificacion-datos.component';
import { MantenimientoMandatosComponent } from './features/censo/mantenimiento-mandatos/mantenimiento-mandatos.component';
import { BusquedaSancionesComponent } from './features/censo/busqueda-sanciones/busqueda-sanciones.component';
import { BusquedaLetradosComponent } from './features/censo/busqueda-letrados/busqueda-letrados.component';
import { MantenimientoDuplicadosComponent } from './features/censo/mantenimiento-duplicados/mantenimiento-duplicados.component';
import { MediadoresComponent } from './features/censo/mediadores/mediadores.component';
import { CargasPeriodicasComponent } from './features/censo/cargas-periodicas/cargas-periodicas.component';
import { ConfigurarPerfilComponent } from './features/censo/configurar-perfil/configurar-perfil.component';
import { CensoDocumentacionComponent } from './features/censo/censo-documentacion/censo-documentacion.component';
import { TipoCurricularComponent } from './features/censo/gestion-subtiposCV/tipo-curricular.component';
import { BusquedaGeneralComponent } from './features/censo/busqueda-general/busqueda-general.component';
import { DetalleIntegranteComponent } from './features/censo/datosPersonaJuridica/datos-integrantes/detalleIntegrante/detalleIntegrante.component';
import { AccesoFichaPersonaComponent } from './features/censo/datosPersonaJuridica/accesoFichaPersona/accesoFichaPersona.component';
import { DatosBancariosComponent } from './features/censo/datosPersonaJuridica/datos-bancarios/datos-bancarios.component';
import { ConsultarDatosBancariosComponent } from './features/censo/datosPersonaJuridica/datos-bancarios/consultar-datos-bancarios/consultar-datos-bancarios.component';
import { DatosDireccionesComponent } from './features/censo/datosPersonaJuridica/datos-direcciones/datos-direcciones.component';
import { ConsultarDatosDireccionesComponent } from './features/censo/datosPersonaJuridica/datos-direcciones/consultar-datos-direcciones/consultar-datos-direcciones.component';
import { MutualidadAbogaciaPlanUniversal } from './features/censo/solicitudes-incorporacion/mutualidadDeLaAbogaciaPlanUniversal/mutualidad-abogacia-plan-universal.component';
import { BusquedaCensoGeneralComponent } from './features/censo/busqueda-censo-general/busqueda-censo-general.component';
import { FacturacionSociedadesCensoComponent } from './features/censo/facturacionSociedadesCenso/facturacion-sociedades-censo.component';
import { ComunicacionSociedadesComponent } from './features/censo/comunicacionSociedades/comunicacion-sociedades.component';
//Certificados
import { ComunicacionInterprofesionalComponent } from './features/certificados/comunicacion-interprofesional/comunicacion-interprofesional.component';
import { SolicitarCompraComponent } from './features/certificados/solicitar-compra/solicitar-compra.component';
import { SolicitudCertificadosComponent } from './features/certificados/solicitud-certificados/solicitud-certificados.component';
import { GestionSolicitudesComponent } from './features/certificados/gestion-solicitudes/gestion-solicitudes.component';
import { MantenimientoCertificadosComponent } from './features/certificados/mantenimiento-certificados/mantenimiento-certificados.component';

//Facturacion
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

//Productos y Servicios
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

//Justicia Gratuita
import { DevolucionComponent } from './features/sjcs/devolucion/devolucion.component';
import { JustificacionComponent } from './features/sjcs/justificacion/justificacion.component';
import { CertificacionComponent } from './features/sjcs/certificacion/certificacion.component';
import { ZonasYSubzonasComponent } from './features/sjcs/maestros/zonas-subzonas/zonas-subzonas.component';
import { AreasYMateriasComponent } from './features/sjcs/maestros/areas-materias/areas-materias.component';
import { PartidasComponent } from './features/sjcs/maestros/partidas/partidas.component';
import { RetencionesIRPFComponent } from './features/sjcs/maestros/retenciones-IRPF/retenciones-IRPF.component';
import { CalendarioLaboralComponent } from './features/sjcs/maestros/calendarioLaboral/calendarioLaboral.component';
import { MantenimientoProcuradoresComponent } from './features/sjcs/maestros/mantenimiento-procuradores/mantenimiento-procuradores.component';
import { MantenimientoPrisionesComponent } from './features/sjcs/maestros/mantenimiento-prisiones/mantenimiento-prisiones.component';
import { MantenimientoComisariasComponent } from './features/sjcs/maestros/mantenimiento-comisarias/mantenimiento-comisarias.component';
import { MantenimientoJuzgadosComponent } from './features/sjcs/maestros/mantenimiento-juzgados/mantenimiento-juzgados.component';
import { DocumentacionEJGComponent } from './features/sjcs/maestros/documentacion-ejg/documentacion-ejg.component';
import { MaestroPJComponent } from './features/sjcs/maestros/maestro-pj/maestro-pj.component';
import { DestinatariosRetencionesComponent } from './features/sjcs/maestros/destinatarios-retenciones/destinatarios-retenciones.component';
import { TiposAsistenciaComponent } from './features/sjcs/maestros/tiposAsistencia/tiposAsistencia.component';
import { SolicitudesTurnosGuardiasComponent } from './features/sjcs/oficio/solicitudesTurnosGuardias/solicitudesTurnosGuardias.component';
import { GuardiasSolicitudesTurnosComponent } from './features/sjcs/guardia/solicitudes-turnos/solicitudes-turnos.component';
import { ProgramacionCalendariosComponent } from './features/sjcs/guardia/programacionCalendarios/programacionCalendarios.component';
import { GuardiasBajasTemporalesComponent } from './features/sjcs/guardia/guardias-bajas-temporales/guardias-bajas-temporales.component';
import { GuardiasSaltosCompensacionesComponent } from './features/sjcs/guardia/guardias-saltos-compensaciones/guardias-saltos-compensaciones.component';
import { DefinirListasGuardiasComponent } from './features/sjcs/guardia/definir-listas-guardias/definir-listas-guardias.component';
import { GuardiasSolicitudesCentralitaComponent } from './features/sjcs/guardia/guardias-solicitudes-centralita/guardias-solicitudes-centralita.component';
import { VolanteExpresComponent } from './features/sjcs/guardia/volante-expres/volante-expres.component';
import { SOJComponent } from './features/sjcs/soj/soj.component';
import { EJGComponent } from './features/sjcs/ejg/ejg.component';
import { GestionActasComponent } from './features/sjcs/gestion-actas/gestion-actas.component';
import { MantenimientoFacturacionComponent } from './features/sjcs/facturacionSJCS/mantenimiento-facturacion/mantenimiento-facturacion.component';
import { PrevisionesComponent } from './features/sjcs/facturacionSJCS/previsiones/previsiones.component';
import { MantenimientoPagosComponent } from './features/sjcs/facturacionSJCS/mantenimiento-pagos/mantenimiento-pagos.component';
import { MovimientosVariosComponent } from './features/sjcs/facturacionSJCS/movimientos-varios/movimientos-varios.component';
import { TramosLECComponent } from './features/sjcs/facturacionSJCS/tramos-lec/tramos-lec.component';
import { RetencionesJudicialesComponent } from './features/sjcs/facturacionSJCS/retenciones-judiciales/retenciones-judiciales.component';
import { BusquedaRetencionesAplicadasComponent } from './features/sjcs/facturacionSJCS/busqueda-retenciones-aplicadas/busqueda-retenciones-aplicadas.component';
import { GenerarImpreso190Component } from './features/sjcs/facturacionSJCS/generar-impreso190/generar-impreso190.component';
import { ResumenPagosComponent } from './features/sjcs/facturacionSJCS/resumen-pagos/resumen-pagos.component';
import { EnvioReintegrosXuntaComponent } from './features/sjcs/facturacionSJCS/envio-reintegros-xunta/envio-reintegros-xunta.component';
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
import { DesignacionesComponent } from './features/sjcs/oficio/designaciones/designaciones.component';
import { CargasMasivasOficioComponent } from './features/sjcs/oficio/cargas-masivas-oficio/cargas-masivas-oficio.component';
import { FichaPreDesignacionComponent } from './features/sjcs/ejg/gestion-ejg/relaciones/ficha-pre-designacion/ficha-pre-designacion.component';

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
// Administracion
import { CatalogosMaestros } from './features/administracion/catalogos-maestros/catalogos-maestros.component';
import { CatalogosMaestrosComponent } from './features/administracion/catalogos-maestros-classique/catalogos-maestros-classique.component';
import { GruposUsuarios } from './features/administracion/grupos-usuarios/grupos-usuarios.component';
import { Etiquetas } from './features/administracion/gestion-multiidioma/etiquetas/etiquetas.component';
import { SeleccionarIdioma } from './features/administracion/seleccionar-idioma/seleccionar-idioma.component';
import { Usuarios } from './features/administracion/usuarios/usuarios.component';
import { UsingObservable } from 'rxjs/observable/UsingObservable';
import { EditarUsuarioComponent } from './features/administracion/usuarios/editarUsuario/editarUsuario.component';
import { ParametrosGenerales } from './features/administracion/parametros/parametros-generales/parametros-generales.component';
import { EditarCatalogosMaestrosComponent } from './features/administracion/catalogos-maestros/editarCatalogosMaestros/editarCatalogosMaestros.component';
import { GestionContadoresComponent } from './features/administracion/contadores/gestion-contadores/gestion-contadores.component';
import { ContadoresComponent } from './features/administracion/contadores/contadores.component'; //new censo
import { BusquedaColegiadosComponent } from './features/censo/busqueda-colegiados/busqueda-colegiados.component';
import { PerfilesComponent } from './features/administracion/perfiles/perfiles.component';
import { EditarPerfilesComponent } from './features/administracion/perfiles/editarPerfiles/editarPerfiles.component';
import { PermisosComponent } from './features/administracion/permisos/permisos.component';
import { Catalogos } from './features/administracion/gestion-multiidioma/catalogos/catalogos.component';
import { AuditoriaUsuarios } from './features/administracion/auditoria/usuarios/auditoria-usuarios.component';
import { GestionAuditoriaComponent } from './features/administracion/auditoria/usuarios/editarAuditoriaUsuarios/gestion-auditoria.component';
import { GestionEntidad } from './features/administracion/gestion-entidad/gestion-entidad.component';
import { BusquedaPersonasJuridicas } from './features/censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component';
import { DatosGenerales } from './features/censo/datosPersonaJuridica/datos-generales/datos-generales.component';
import { DatosPersonaJuridicaComponent } from './features/censo/datosPersonaJuridica/datosPersonaJuridica.component';
import { MutualidadAbogaciaSeguroAccidentes } from './features/censo/solicitudes-incorporacion/mutualidadAbogaciaSeguroAccidentes/mutualidad-abogacia-seguro-accidentes.component';
// CENSO II
import { EdicionCurricularesComponent } from './features/censo/ficha-colegial/edicionDatosCurriculares/edicionCurriculares.component';
//COOKIES
import { PoliticaCookiesComponent } from './features/politica-cookies/politica-cookies.component';
//ERROR
import { ErrorAccesoComponent } from './commons/error/error-acceso/error-acceso.component';
import { CargaEtiquetasComponent } from './features/censo/cargas-masivas/carga-etiquetas/carga-etiquetas.component';
import { DatosCvComponent } from './features/censo/cargas-masivas/datos-cv/datos-cv.component';
import { BusquedaCursosComponent } from './features/formacion/busqueda-cursos/busqueda-cursos.component';
import { FichaCalendarioComponent } from './features/agenda/ficha-calendario/ficha-calendario.component';
import { CargasMasivasComponent } from './features/censo/cargas-masivas/cargas-masivas.component';
import { SubtipoCurricularComponent } from './features/censo/gestion-subtiposCV/subtipo-curricular/subtipo-curricular.component';
import { AgendaComponent } from './features/agenda/agenda.component';
import { DatosNotificacionesComponent } from './features/agenda/datos-notificaciones/datos-notificaciones.component';
import { FichaEventosComponent } from './features/agenda/ficha-eventos/ficha-eventos.component';
import { FichaCursoComponent } from './features/formacion/ficha-curso/ficha-curso.component';
import { DetalleSancionComponent } from './features/censo/busqueda-sanciones/detalle-sancion/detalle-sancion.component';
import { FichaInscripcionComponent } from './features/formacion/ficha-inscripcion/ficha-inscripcion.component';
import { BusquedaInscripcionesComponent } from './features/formacion/busqueda-inscripciones/busqueda-inscripciones.component';
import { SolicitudesModificacionComponent } from './features/censo/solicitudes-modificacion/solicitudes-modificacion.component';
import { NuevaSolicitudesModificacionComponent } from './features/censo/solicitudes-modificacion/nueva-solicitudes-modificacion/nueva-solicitudes-modificacion.component';
import { ComunicacionesCensoComponent } from './features/censo/comunicacionesCenso/comunicaciones.component';
import { ExpedientesComponent } from './features/censo/expedientesCenso/expedientes.component';
import { RegtelComponent } from './features/censo/regtel/regtel.component';
import { TurnoOficioComponent } from './features/censo/turnoOficioCenso/turnoOficio.component';
import { AuditoriaComponent } from './features/censo/auditoria/auditoria.component';

//INFORMES Y COMUNICACIONES
import { PlantillasEnvioComponent } from './features/informes-comunicaciones/plantillas-envio/plantillas-envio.component';
import { ModelosComunicacionesComponent } from './features/informes-comunicaciones/modelos-comunicaciones/modelos-comunicaciones.component';
import { FichaModeloComunicacionesComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/ficha-modelo-comunicaciones.component';
import { PlantillaDocumentoComponent } from './features/informes-comunicaciones/modelos-comunicaciones/ficha-modelo-comunicaciones/tarjeta-informes/plantilla-documento/plantilla-documento.component';
import { DetallePlantillaEnvioComponent } from './features/informes-comunicaciones/plantillas-envio/detalle-plantilla-envio/detalle-plantilla-envio.component';
import { ConsultasComponent } from './features/informes-comunicaciones/consultas/consultas.component';
import { FichaConsultaComponent } from './features/informes-comunicaciones/consultas/ficha-consulta/ficha-consulta.component';

import { ComunicacionesComponent } from './features/informes-comunicaciones/comunicaciones/comunicaciones.component';



import { FichaRegistroComunicacionComponent } from './features/informes-comunicaciones/comunicaciones/ficha-registro-comunicacion/ficha-registro-comunicacion.component';
import { EnviosMasivosComponent } from './features/informes-comunicaciones/envios-masivos/envios-masivos.component';
import { FichaRegistroEnvioMasivoComponent } from './features/informes-comunicaciones/envios-masivos/ficha-registro-envio-masivo/ficha-registro-envio-masivo.component';
import { DialogoComunicacionesComponent } from './features/informes-comunicaciones/dialogo-comunicaciones/dialogo-comunicaciones.component';
import { FichaColegialGeneralComponent } from './features/censo/ficha-colegial/ficha-colegial-general/ficha-colegial-general.component';
import { MaestrosModulosComponent } from "./features/sjcs/maestros/maestros-modulos/busqueda-modulosybasesdecompensacion.component";
import { PartidosJudicialesComponent } from "./features/sjcs/maestros/partidos-judiciales/partidas-judiciales.component";
import { BajasTemporalesComponent } from "./features/sjcs/oficio/bajas-temporales/busqueda-bajas-temporales.component";
import { TurnosComponent } from "./features/sjcs/oficio/turnos/busqueda-turnos.component";
import { BuscadorColegiadosComponent } from "./commons/buscador-colegiados/buscador-colegiados.component";
import { BuscadorGuardiaIncompatibilidadesComponent } from "./features/sjcs/guardia/guardias-incompatibilidades/buscador-guardia-incompatibilidades/buscador-guardia-incompatibilidades.component";
import { AsistenciaExpresComponent } from "./features/sjcs/guardia/guardias-asistencias/asistencia-expres/asistencia-expres.component";
import { FichaAsistenciaComponent } from "./features/sjcs/guardia/guardias-asistencias/ficha-asistencia/ficha-asistencia.component";
import { BusquedaAsuntosComponent } from "./commons/busqueda-asuntos/busqueda-asuntos.component";
import { FichaActuacionAsistenciaComponent } from "./features/sjcs/guardia/guardias-asistencias/ficha-actuacion-asistencia/ficha-actuacion-asistencia.component";
import { FichaListaGuardiasComponent } from "./features/sjcs/guardia/definir-listas-guardias/ficha-lista-guardias/ficha-lista-guardias.component";
import { NuevoExpedienteExeaComponent } from "./features/expedientes-exea/nuevo-expediente-exea/nuevo-expediente-exea.component";
import { GestionExpedientesExeaComponent } from "./features/expedientes-exea/gestion-expedientes-exea/gestion-expedientes-exea.component";

const appRoutes: Routes = [
	{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'loginDefault', component: LoginComponent },
	{ path: 'loginDevelop', component: LoginDevelopComponent },
	{ path: "logout", component: LogoutComponent },
	{
		path: 'politicaCookies',
		component: PoliticaCookiesComponent,
		canActivate: [AuthGuard]
	},

	// Censo
	{
		path: 'busquedaGeneral',
		component: BusquedaGeneralComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaPersonaJuridica',
		component: DatosPersonaJuridicaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'busquedaColegiados',
		component: BusquedaColegiadosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaColegial',
		component: FichaColegialGeneralComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mutualidadSeguroAccidentes',
		component: MutualidadAbogaciaSeguroAccidentes,
		canActivate: [AuthGuard]
	},
	{
		path: 'edicionCurriculares',
		component: EdicionCurricularesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'editarUsuario',
		component: EditarUsuarioComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'MutualidadAbogaciaPlanUniversal',
		component: MutualidadAbogaciaPlanUniversal,
		canActivate: [AuthGuard]
	},
	{
		path: 'searchNoColegiados',
		component: BusquedaPersonasJuridicas,
		canActivate: [AuthGuard]
	},

	{
		path: 'busquedaNoColegiados',
		component: BusquedaNoColegiadosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'certificadosAca',
		component: CertificadosAcaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'comisionesCargos',
		component: ComisionesCargosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'solicitudesModificacion',
		component: SolicitudesModificacionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'solicitudesEspecificas',
		component: SolicitudesEspecificasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'solicitudesIncorporacion',
		component: SolicitudesIncorporacionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'alterMutua',
		component: AlterMutuaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'alterMutuaReta',
		component: AlterMutuaRetaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'alterMutuaOfertas',
		component: AlterMutuaOfertasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'nuevaIncorporacion',
		component: NuevaIncorporacionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'documentacionSolicitudes',
		component: DocumentacionSolicitudesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'modificacionDatos',
		component: ModificacionDatosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mantenimientoGruposFijos',
		component: MantenimientoGruposFijosComponent,
		canActivate: [AuthGuard]
	},

	{
		path: 'mantenimientoMandatos',
		component: MantenimientoMandatosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'busquedaSanciones',
		component: BusquedaSancionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'detalleSancion',
		component: DetalleSancionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'detalleIntegrante',
		component: DetalleIntegranteComponent,
		canActivate: [AuthGuard]
	},

	{
		path: 'busquedaLetrados',
		component: BusquedaLetradosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mantenimientoDuplicados',
		component: MantenimientoDuplicadosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'nuevaSolicitudesModificacion',
		component: NuevaSolicitudesModificacionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mediadores',
		component: MediadoresComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'cargasPeriodicas',
		component: CargasPeriodicasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'configurarPerfil',
		component: ConfigurarPerfilComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'busquedaCensoGeneral',
		component: BusquedaCensoGeneralComponent,
		canActivate: [AuthGuard]
	},
	{
		//CensoDocumentacionComponent
		path: 'cargasMasivas',
		component: CargasMasivasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'gestionSubtiposCV',
		component: TipoCurricularComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaNotario',
		component: AccesoFichaPersonaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'datosBancarios',
		component: DatosBancariosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'consultarDatosBancarios',
		component: ConsultarDatosBancariosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'datosDirecciones',
		component: DatosDireccionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'consultarDatosDirecciones',
		component: ConsultarDatosDireccionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'datosCv',
		component: DatosCvComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'informacionGestionSubtipoCV',
		component: SubtipoCurricularComponent,
		canActivate: [AuthGuard]
	},

	//Certificados
	{
		path: 'comunicacionInterprofesional',
		component: ComunicacionInterprofesionalComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'solicitarCompra',
		component: SolicitarCompraComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'solicitudCertificados',
		component: SolicitudCertificadosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'gestionSolicitudes',
		component: GestionSolicitudesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mantenimientoCertificados',
		component: MantenimientoCertificadosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'cargaEtiquetas',
		component: CargaEtiquetasComponent,
		canActivate: [AuthGuard]
	},

	//Facturacion
	{
		path: 'mantenimientoSufijos',
		component: MantenimientoSufijosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'facturaPlantillas',
		component: FacturaPlantillasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'gestionCuentasBancarias',
		component: GestionCuentasBancariasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'seriesFactura',
		component: SeriesFacturaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'previsionesFactura',
		component: PrevisionesFacturaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'programarFactura',
		component: ProgramarFacturaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'generarFactura',
		component: GenerarFacturaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mantenimientoFactura',
		component: MantenimientoFacturaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'eliminarFactura',
		component: EliminarFacturaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'facturas',
		component: FacturasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'facturasSociedad',
		component: FacturacionSociedadesCensoComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'comunicacionesSociedades',
		component: ComunicacionSociedadesComponent,
		canActivate: [AuthGuard]
	},

	{
		path: 'ficherosAdeudos',
		component: FicherosAdeudosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'ficherosDevoluciones',
		component: FicherosDevolucionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'devolucionManual',
		component: DevolucionManualComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'abonos',
		component: AbonosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'ficherosTransferencia',
		component: FicherosTransferenciaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'contabilidad',
		component: ContabilidadComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'cobrosRecobros',
		component: CobrosRecobrosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'facturasEmitidas',
		component: FacturasEmitidasComponent,
		canActivate: [AuthGuard]
	},

	//Productos y Servicios
	{
		path: 'categoriasProducto',
		component: CategoriasProductoComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'categoriasServicios',
		component: CategoriasServiciosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mantenimientoProductos',
		component: MantenimientoProductosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mantenimientoServicios',
		component: MantenimientoServiciosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'gestionarSolicitudes',
		component: GestionarSolicitudesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'solicitudCompraSubscripcion',
		component: SolicitudCompraSubscripcionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'solicitudAnulacion',
		component: SolicitudAnulacionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'cargaCompras',
		component: CargaComprasComponent,
		canActivate: [AuthGuard]
	},

	//Expedientes
	{
		path: 'tiposExpedientes',
		component: TiposExpedientesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'gestionarExpedientes',
		component: GestionarExpedientesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'alertas',
		component: AlertasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'nuevoExpediente',
		component: NuevoExpedienteComponent,
		canActivate: [AuthGuard]
	},

	//Justicia Gratuita
	{
		path: 'zonasYsubzonas',
		component: ZonasYSubzonasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'areasYMaterias',
		component: AreasYMateriasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'costesFijos',
		loadChildren: './features/sjcs/sjcs.module#SjcsModule'
	},
	{
		
		path: 'cargasMasivasOficio',
		component: CargasMasivasOficioComponent,
		canActivate: [ AuthGuard ]
	},
	{
		path: 'funcamentosCalificacion',
		loadChildren: './features/sjcs/sjcs.module#SjcsModule'
	},
	{
		path: 'fundamentosResolucion',
		loadChildren: './features/sjcs/sjcs.module#SjcsModule'
    },
	{
		path: 'partidas',
		component: PartidasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'partidosJudiciales',
		component: PartidosJudicialesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'retencionesIRPF',
		component: RetencionesIRPFComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'maestrosModulos',
		component: MaestrosModulosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'calendarioLaboral',
		component: CalendarioLaboralComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mantenimientoprocuradores',
		component: MantenimientoProcuradoresComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mantenimientoPrisiones',
		component: MantenimientoPrisionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mantenimientoComisarias',
		component: MantenimientoComisariasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mantenimientoJuzgados',
		component: MantenimientoJuzgadosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'documentacionEJG',
		component: DocumentacionEJGComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'maestroPJ',
		component: MaestroPJComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'destinatariosRetenciones',
		component: DestinatariosRetencionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'tiposActuacion',
		loadChildren: './features/sjcs/sjcs.module#SjcsModule'
    },
	{
		path: 'tiposAsistencia',
		component: TiposAsistenciaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'calendarioLaboralAgenda',
		loadChildren: './features/sjcs/sjcs.module#SjcsModule'
	},
	{
		path: 'procedimientos',
		loadChildren: './features/sjcs/sjcs.module#SjcsModule'
	},
	{
		path: 'justiciables',
		loadChildren: './features/sjcs/sjcs.module#SjcsModule'
    },
	{
		path: 'turnos',
		component: TurnosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'solicitudesTurnosGuardias',
		component: SolicitudesTurnosGuardiasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'bajasTemporales',
		component: BajasTemporalesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'guardiasSolicitudesTurnos',
		component: GuardiasSolicitudesTurnosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'guardiasIncompatibilidades',
		component: BuscadorGuardiaIncompatibilidadesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'programacionCalendarios',
		component: ProgramacionCalendariosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'guardiasBajasTemporales',
		component: GuardiasBajasTemporalesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'guardiasSaltosCompensaciones',
		component: GuardiasSaltosCompensacionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'definirListasGuardias',
		component: DefinirListasGuardiasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'guardiasSolicitudesCentralita',
		component: GuardiasSolicitudesCentralitaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaAsistencia',
		component: FichaAsistenciaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaActuacionAsistencia',
		component: FichaActuacionAsistenciaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaListaGuardias',
		component: FichaListaGuardiasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'volanteExpres',
		component: VolanteExpresComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'soj',
		component: SOJComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'ejg',
		component: EJGComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'ficha-pre-designacion',
		component: FichaPreDesignacionComponent,
		canActivate: [ AuthGuard ]
	},
	{
		path: 'gestionActas',
		component: GestionActasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mantenimientoFacturacion',
		component: MantenimientoFacturacionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'previsiones',
		component: PrevisionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'mantenimientoPagos',
		component: MantenimientoPagosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'movimientosVarios',
		component: MovimientosVariosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'tramosLEC',
		component: TramosLECComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'retencionesJudiciales',
		component: RetencionesJudicialesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'busquedaRetencionesAplicadas',
		component: BusquedaRetencionesAplicadasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'generarImpreso190',
		component: GenerarImpreso190Component,
		canActivate: [AuthGuard]
	},
	{
		path: 'resumenPagos',
		component: ResumenPagosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'envioReintegrosXunta',
		component: EnvioReintegrosXuntaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'justificacionLetrado',
		component: JustificacionLetradoComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'informeFacturacion',
		component: InformeFacturacionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'informeFacturacionMultiple',
		component: InformeFacturacionMultipleComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'informeFacturacionPersonalizado',
		component: InformeFacturacionPersonalizadoComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaFacturacion',
		component: FichaFacturacionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaPago',
		component: FichaPagoComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'cartaPagosColegiados',
		component: CartaPagosColegiadosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'cartaFacturaColegiado',
		component: CartaFacturaColegiadoComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'certificadosPagos',
		component: CertificadosPagosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'certificadosIrpf',
		component: CertificadosIrpfComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'comunicaPreparacion',
		component: ComunicaPreparacionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'comunicaRemesaEnvio',
		component: ComunicaRemesaEnvioComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'comunicaRemesaResultado',
		component: ComunicaRemesaResultadoComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'comunicaEnvioActualizacion',
		component: ComunicaEnvioActualizacionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'comunicaInfoEconomica',
		component: ComunicaInfoEconomicaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'comunicaCarga',
		component: ComunicaCargaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'comunicaResoluciones',
		component: ComunicaResolucionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'comunicaDesignaciones',
		component: ComunicaDesignacionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'designaciones',
		component: DesignacionesComponent,
		canActivate: [AuthGuard]
	},

	//Consultas
	{
		path: 'recuperarConsultas',
		component: RecuperarConsultasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'consultasListasDinamicas',
		component: ConsultasListasDinamicasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'nuevaConsulta',
		component: NuevaConsultaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'nuevaConsultaExperta',
		component: NuevaConsultaExpertaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'comunicacionesCenso',
		component: ComunicacionesCensoComponent,

		canActivate: [AuthGuard]
	},
	{
		path: 'expedientesCenso',
		component: ExpedientesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'regTel',
		component: RegtelComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'turnoOficioCenso',
		component: TurnoOficioComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'auditoria',
		component: AuditoriaComponent,
		canActivate: [AuthGuard]
	},

	//Comunicaciones
	{
		path: 'informesGenericos',
		component: InformesGenericosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'definirTipoPlantilla',
		component: DefinirTipoPlantillaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'listaCorreos',
		component: ListaCorreosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'bandejaSalida',
		component: BandejaSalidaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'bandejaEntrada',
		component: BandejaEntradaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'plantillasEnvio',
		component: PlantillasEnvioComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaPlantilla',
		component: DetallePlantillaEnvioComponent,
		canActivate: [AuthGuard]
	},

	{
		path: 'modelosComunicaciones',
		component: ModelosComunicacionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaModeloComunicaciones',
		component: FichaModeloComunicacionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaPlantillaDocumento',
		component: PlantillaDocumentoComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'consultas',
		component: ConsultasComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaConsulta',
		component: FichaConsultaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'comunicaciones',
		component: ComunicacionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaRegistroComunicacion',
		component: FichaRegistroComunicacionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'enviosMasivos',
		component: EnviosMasivosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaRegistroEnvioMasivo',
		component: FichaRegistroEnvioMasivoComponent,
		canActivate: [AuthGuard]
	},

	//Agenda
	{
		path: 'agenda',
		component: AgendaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'editarCalendario',
		component: FichaCalendarioComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'editarNotificacion',
		component: DatosNotificacionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaEventos',
		component: FichaEventosComponent,
		canActivate: [AuthGuard]
	},
	//Agenda
	{
		path: 'agenda',
		component: AgendaComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'editarCalendario',
		component: FichaCalendarioComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'editarNotificacion',
		component: DatosNotificacionesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaEventos',
		component: FichaEventosComponent,
		canActivate: [AuthGuard]
	},

	// Administracion
	{
		path: 'catalogosMaestros',
		component: CatalogosMaestrosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'EditarCatalogosMaestros',
		component: EditarCatalogosMaestrosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'contadores/:id/:modulo',
		component: ContadoresComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'gestionContadores',
		component: GestionContadoresComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'perfiles',
		component: PerfilesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'EditarPerfiles',
		component: EditarPerfilesComponent,
		canActivate: [AuthGuard]
	},

	{
		path: 'gruposUsuarios',
		component: GruposUsuarios,
		canActivate: [AuthGuard]
	},
	{
		path: 'etiquetas',
		component: Etiquetas
	},
	{
		path: 'usuarios',
		component: Usuarios,
		canActivate: [AuthGuard]
	},
	{
		path: 'seleccionarIdioma',
		component: SeleccionarIdioma,
		canActivate: [AuthGuard]
	},
	{
		path: 'parametrosGenerales',
		component: ParametrosGenerales,
		canActivate: [AuthGuard]
	},
	{
		path: 'gestionEntidad',
		component: GestionEntidad,
		canActivate: [AuthGuard]
	},
	{
		path: 'permisos',
		component: PermisosComponent,
		canActivate: [AuthGuard],
		data: { scrollReset: true }
	},
	{
		path: 'catalogos',
		component: Catalogos,
		canActivate: [AuthGuard]
	},
	{
		path: 'auditoriaUsuarios',
		component: AuditoriaUsuarios,
		canActivate: [AuthGuard]
	},
	{
		path: 'gestionAuditoria',
		component: GestionAuditoriaComponent,
		canActivate: [AuthGuard]
	},

	{
		path: 'errorAcceso',
		component: ErrorAccesoComponent
	},
	{
		path: 'buscarCursos',
		component: BusquedaCursosComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'fichaCurso',
		component: FichaCursoComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'buscarInscripciones',
		component: BusquedaInscripcionesComponent,
		canActivate: [AuthGuard]
	},

	{
		path: 'fichaInscripcion',
		component: FichaInscripcionComponent,
		canActivate: [AuthGuard]
	},

	{
		path: 'devolucion',
		component: DevolucionComponent,
		canActivate: [AuthGuard]
	},

	{
		path: 'justificacion',
		component: JustificacionComponent,
		canActivate: [AuthGuard]
	},

	{
		path: 'certificacion',
		component: CertificacionComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'dialogoComunicaciones',
		component: DialogoComunicacionesComponent
		//canActivate: [AuthGuard]
	},
	// {
	// 	path: 'guardias',
	// 	component: GuardiasComponent,
	// 	canActivate: [ AuthGuard ]
	// },

	{
		path: 'buscadorColegiados',
		component: BuscadorColegiadosComponent
	}, 
	{
		path: 'busquedaAsuntos',
		component: BusquedaAsuntosComponent 
	},
	{
		path: 'nuevoExpedienteEXEA',
		component: NuevoExpedienteExeaComponent 
	},
	{
		path: 'gestionExpedientesEXEA',
		component: GestionExpedientesExeaComponent
	},

	{ path: ' ', redirectTo: 'home' }
];
export const routing = RouterModule.forRoot(appRoutes);