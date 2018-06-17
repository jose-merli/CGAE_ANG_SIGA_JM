import { Routes, RouterModule } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthGuard } from "./_guards/auth.guards";
import { LoginComponent } from "./commons/login/login.component";
import { LoginDevelopComponent } from "./commons/login-develop/login-develop.component";
import { HomeComponent } from "./features/home/home.component";

// Censo
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
import { BusquedaLetradosComponent } from "./features/censo/busqueda-letrados/busqueda-letrados.component";
import { MantenimientoDuplicadosComponent } from "./features/censo/mantenimiento-duplicados/mantenimiento-duplicados.component";
import { ModificacionDatosComponent } from "./features/censo/modificacion-datos/modificacion-datos.component";
import { MediadoresComponent } from "./features/censo/mediadores/mediadores.component";
import { CargasPeriodicasComponent } from "./features/censo/cargas-periodicas/cargas-periodicas.component";
import { ConfigurarPerfilComponent } from "./features/censo/configurar-perfil/configurar-perfil.component";
import { CensoDocumentacionComponent } from "./features/censo/censo-documentacion/censo-documentacion.component";
import { GestionSubtiposCVComponent } from "./features/censo/gestion-subtiposCV/gestion-subtiposCV.component";
import { BusquedaGeneralComponent } from "./features/censo/busqueda-general/busqueda-general.component";
//Certificados
import { ComunicacionInterprofesionalComponent } from "./features/certificados/comunicacion-interprofesional/comunicacion-interprofesional.component";
import { SolicitarCompraComponent } from "./features/certificados/solicitar-compra/solicitar-compra.component";
import { SolicitudCertificadosComponent } from "./features/certificados/solicitud-certificados/solicitud-certificados.component";
import { GestionSolicitudesComponent } from "./features/certificados/gestion-solicitudes/gestion-solicitudes.component";
import { MantenimientoCertificadosComponent } from "./features/certificados/mantenimiento-certificados/mantenimiento-certificados.component";

//Facturacion
import { MantenimientoSufijosComponent } from "./features/facturacion/mantenimiento-sufijos/mantenimiento-sufijos.component";

//Productos y Servicios
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

//Justicia Gratuita
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

// Administracion
import { CatalogosMaestros } from "./features/administracion/catalogos-maestros/catalogos-maestros.component";
import { GruposUsuarios } from "./features/administracion/grupos-usuarios/grupos-usuarios.component";
import { Etiquetas } from "./features/administracion/gestion-multiidioma/etiquetas/etiquetas.component";
import { SeleccionarIdioma } from "./features/administracion/seleccionar-idioma/seleccionar-idioma.component";
import { Usuarios } from "./features/administracion/usuarios/usuarios.component";
import { UsingObservable } from "rxjs/observable/UsingObservable";
import { EditarUsuarioComponent } from "./features/administracion/usuarios/editarUsuario/editarUsuario.component";
import { ParametrosGenerales } from "./features/administracion/parametros/parametros-generales/parametros-generales.component";
import { EditarCatalogosMaestrosComponent } from "./features/administracion/catalogos-maestros/editarCatalogosMaestros/editarCatalogosMaestros.component";
import { GestionContadoresComponent } from "./features/administracion/contadores/gestion-contadores/gestion-contadores.component";
import { ContadoresComponent } from "./features/administracion/contadores/contadores.component"; //new censo
import { BusquedaColegiadosComponent } from "./features/censo/busqueda-colegiados/busqueda-colegiados.component";
import { FichaColegialComponent } from "./features/censo/ficha-colegial/ficha-colegial.component";
import { PerfilesComponent } from "./features/administracion/perfiles/perfiles.component";
import { EditarPerfilesComponent } from "./features/administracion/perfiles/editarPerfiles/editarPerfiles.component";
import { PermisosComponent } from "./features/administracion/permisos/permisos.component";
import { Catalogos } from "./features/administracion/gestion-multiidioma/catalogos/catalogos.component";
import { AuditoriaUsuarios } from "./features/administracion/auditoria/usuarios/auditoria-usuarios.component";
import { GestionAuditoriaComponent } from "./features/administracion/auditoria/usuarios/editarAuditoriaUsuarios/gestion-auditoria.component";
import { GestionEntidad } from "./features/administracion/gestion-entidad/gestion-entidad.component";
import { BusquedaPersonasJuridicas } from "./features/censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component";
import { DatosGenerales } from "./features/censo/datos-generales/datos-generales.component";
import { DatosPersonaJuridicaComponent } from "./features/censo/datosPersonaJuridica/datosPersonaJuridica.component";
//COOKIES
import { PoliticaCookiesComponent } from "./features/politica-cookies/politica-cookies.component";

const appRoutes: Routes = [
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },

  { path: "loginDevelop", component: LoginDevelopComponent },

  {
    path: "politicaCookies",
    component: PoliticaCookiesComponent,
    canActivate: [AuthGuard]
  },

  // Censo
  {
    path: "busquedaGeneral",
    component: BusquedaGeneralComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "fichaPersonaJuridica",
    component: DatosPersonaJuridicaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "busquedaColegiados",
    component: BusquedaColegiadosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "fichaColegial",
    component: FichaColegialComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "editarUsuario",
    component: EditarUsuarioComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "searchNoColegiados",
    //component: BusquedaPersonasJuridicas,
    component: SearchNoColegiadosComponent,
    // component: BusquedaPersonasJuridicas,
    canActivate: [AuthGuard]
  },
  {
    path: "certificadosAca",
    // component: CertificadosAcaComponent,
    component: CertificadosAcaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "comisionesCargos",
    component: ComisionesCargosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "solicitudesGenericas",
    component: SolicitudesGenericasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "solicitudesEspecificas",
    component: SolicitudesEspecificasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "solicitudesIncorporacion",
    component: SolicitudesIncorporacionComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "nuevaIncorporacion",
    component: NuevaIncorporacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "documentacionSolicitudes",
    component: DocumentacionSolicitudesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoGruposFijos",
    component: MantenimientoGruposFijosComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "mantenimientoMandatos",
    component: MantenimientoMandatosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "busquedaSanciones",
    component: BusquedaSancionesComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "busquedaLetrados",
    component: BusquedaLetradosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoDuplicados",
    component: MantenimientoDuplicadosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "modificacionDatos",
    component: ModificacionDatosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mediadores",
    component: MediadoresComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "cargasPeriodicas",
    component: CargasPeriodicasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "configurarPerfil",
    component: ConfigurarPerfilComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "censoDocumentacion",
    component: CensoDocumentacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionSubtiposCV",
    component: GestionSubtiposCVComponent,
    canActivate: [AuthGuard]
  },

  //Certificados
  {
    path: "comunicacionInterprofesional",
    component: ComunicacionInterprofesionalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "solicitarCompra",
    component: SolicitarCompraComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "solicitudCertificados",
    component: SolicitudCertificadosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionSolicitudes",
    component: GestionSolicitudesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoCertificados",
    component: MantenimientoCertificadosComponent,
    canActivate: [AuthGuard]
  },

  //Facturacion
  {
    path: "mantenimientoSufijos",
    component: MantenimientoSufijosComponent,
    canActivate: [AuthGuard]
  },

  //Productos y Servicios
  {
    path: "categoriasProducto",
    component: CategoriasProductoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "categoriasServicios",
    component: CategoriasServiciosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoProductos",
    component: MantenimientoProductosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoServicios",
    component: MantenimientoServiciosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionarSolicitudes",
    component: GestionarSolicitudesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "solicitudCompraSubscripcion",
    component: SolicitudCompraSubscripcionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "solicitudAnulacion",
    component: SolicitudAnulacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "cargaCompras",
    component: CargaComprasComponent,
    canActivate: [AuthGuard]
  },

  //Expedientes
  {
    path: "tiposExpedientes",
    component: TiposExpedientesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionarExpedientes",
    component: GestionarExpedientesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "alertas",
    component: AlertasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "nuevoExpediente",
    component: NuevoExpedienteComponent,
    canActivate: [AuthGuard]
  },

  //Justicia Gratuita
  {
    path: "zonasYsubzonas",
    component: ZonasYSubzonasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "areasYMaterias",
    component: AreasYMateriasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "partidas",
    component: PartidasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "partidosJudiciales",
    component: PartidosJudicialesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "retencionesIRPF",
    component: RetencionesIRPFComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "maestrosModulos",
    component: MaestrosModulosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "calendarioLaboral",
    component: CalendarioLaboralComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoprocuradores",
    component: MantenimientoProcuradoresComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoPrisiones",
    component: MantenimientoPrisionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoComisarias",
    component: MantenimientoComisariasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoJuzgados",
    component: MantenimientoJuzgadosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "documentacionEJG",
    component: DocumentacionEJGComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "maestroPJ",
    component: MaestroPJComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "destinatariosRetenciones",
    component: DestinatariosRetencionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "tiposAsistencia",
    component: TiposAsistenciaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "turnos",
    component: TurnosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "solicitudesTurnosGuardias",
    component: SolicitudesTurnosGuardiasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "bajasTemporales",
    component: BajasTemporalesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "saltosYCompensaciones",
    component: SaltosYCompensacionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "guardiasSolicitudesTurnos",
    component: GuardiasSolicitudesTurnosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "guardiasIncompatibilidades",
    component: GuardiasIncompatibilidadesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "programacionCalendarios",
    component: ProgramacionCalendariosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "guardiasBajasTemporales",
    component: GuardiasBajasTemporalesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "guardiasSaltosCompensaciones",
    component: GuardiasSaltosCompensacionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "definirListasGuardias",
    component: DefinirListasGuardiasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "guardiasAsistencias",
    component: GuardiasAsistenciasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "guardiasAceptadasCentralita",
    component: GuardiasCentralitaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "volanteExpres",
    component: VolanteExpresComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "soj",
    component: SOJComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "ejg",
    component: EJGComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionActas",
    component: GestionActasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoFacturacion",
    component: MantenimientoFacturacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "previsiones",
    component: PrevisionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoPagos",
    component: MantenimientoPagosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "movimientosVarios",
    component: MovimientosVariosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "tramosLEC",
    component: TramosLECComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "retencionesJudiciales",
    component: RetencionesJudicialesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "busquedaRetencionesAplicadas",
    component: BusquedaRetencionesAplicadasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "generarImpreso190",
    component: GenerarImpreso190Component,
    canActivate: [AuthGuard]
  },
  {
    path: "resumenPagos",
    component: ResumenPagosComponent,
    canActivate: [AuthGuard]
  }, {
    path: "envioReintegrosXunta",
    component: EnvioReintegrosXuntaComponent,
    canActivate: [AuthGuard]
  },

  // Administracion
  {
    path: "catalogosMaestros",
    component: CatalogosMaestros,
    canActivate: [AuthGuard]
  },
  {
    path: "EditarCatalogosMaestros",
    component: EditarCatalogosMaestrosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "contadores/:id",
    component: ContadoresComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionContadores",
    component: GestionContadoresComponent,
    canActivate: [AuthGuard]
  },
  { path: "perfiles", component: PerfilesComponent, canActivate: [AuthGuard] },
  {
    path: "EditarPerfiles",
    component: EditarPerfilesComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "gruposUsuarios",
    component: GruposUsuarios,
    canActivate: [AuthGuard]
  },
  {
    //path: "etiquetas", component: Etiquetas, canActivate: [AuthGuard] },
    path: "etiquetas",
    component: Etiquetas
  },
  {
    path: "usuarios",
    component: Usuarios,
    canActivate: [AuthGuard]
  },
  {
    path: "seleccionarIdioma",
    component: SeleccionarIdioma,
    canActivate: [AuthGuard]
  },
  {
    path: "parametrosGenerales",
    component: ParametrosGenerales,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionEntidad",
    // component: GestionEntidad,
    // canActivate: [AuthGuard]
    component: GestionEntidad
  },
  {
    path: "permisos",
    component: PermisosComponent,
    canActivate: [AuthGuard],
    data: { scrollReset: true }
  },

  { path: "catalogos", component: Catalogos, canActivate: [AuthGuard] },
  {
    path: "auditoriaUsuarios",
    component: AuditoriaUsuarios,
    canActivate: [AuthGuard]
  },
  {
    path: "gestionAuditoria",
    component: GestionAuditoriaComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "home" }
];
export const routing = RouterModule.forRoot(appRoutes);
