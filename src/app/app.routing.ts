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

//Certificados
import { ComunicacionInterprofesionalComponent } from "./features/certificados/comunicacion-interprofesional/comunicacion-interprofesional.component";
import { SolicitarCompraComponent } from "./features/certificados/solicitar-compra/solicitar-compra.component";
import { SolicitudCertificadosComponent } from "./features/certificados/solicitud-certificados/solicitud-certificados.component";
import { GestionSolicitudesComponent } from "./features/certificados/gestion-solicitudes/gestion-solicitudes.component";
import { MantenimientoCertificadosComponent } from "./features/certificados/mantenimiento-certificados/mantenimiento-certificados.component";

//Facturacion
import { MantenimientoSufijosComponent } from "./features/facturacion/mantenimiento-sufijos/mantenimiento-sufijos.component";

//Productos y Servicios
import { CategoriasComponent } from "./features/productosYServicios/categorias/categorias.component";
import { CategoriasProductoComponent } from "./features/productosYServicios/categoriasProducto/categoriasProducto.component";
import { CategoriasServiciosComponent } from "./features/productosYServicios/categoriasServicios/categoriasServicios.component";

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

  { path: "politicaCookies", component: PoliticaCookiesComponent, canActivate: [AuthGuard] },

  // Censo
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
    component: SearchNoColegiadosComponent,
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
    path: "categorias",
    component: CategoriasComponent,
    canActivate: [AuthGuard]
  },
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
