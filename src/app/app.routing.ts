import { Routes, RouterModule } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthGuard } from "./_guards/auth.guards";
import { LoginComponent } from "./commons/login/login.component";
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
import { BusquedaColegiadosComponent } from "./new-features/censo/busqueda-colegiados/busqueda-colegiados.component";
import { FichaColegialComponent } from "./new-features/censo/ficha-colegial/ficha-colegial.component";
import { PerfilesComponent } from "./features/administracion/perfiles/perfiles.component";
import { EditarPerfilesComponent } from "./features/administracion/perfiles/editarPerfiles/editarPerfiles.component";
import { PermisosComponent } from "./features/administracion/permisos/permisos.component";
import { Catalogos } from "./features/administracion/gestion-multiidioma/catalogos/catalogos.component";
import { AuditoriaUsuarios } from "./features/administracion/auditoria/usuarios/auditoria-usuarios.component";

const appRoutes: Routes = [
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },

  // Censo
  {
    path: "busquedaColegiados",
    component: BusquedaColegiadosComponent, canActivate: [AuthGuard]
    // canActivate: [AuthGuard]
  },
  {
    path: "fichaColegial/:id",
    component: FichaColegialComponent, canActivate: [AuthGuard]
    // canActivate: [AuthGuard]
  },
  {
    path: "editarUsuario",
    component: EditarUsuarioComponent, canActivate: [AuthGuard]
  },
  { path: "searchNoColegiados", component: SearchNoColegiadosComponent, canActivate: [AuthGuard] },
  { path: "certificadosAca", component: CertificadosAcaComponent, canActivate: [AuthGuard] },
  { path: "comisionesCargos", component: ComisionesCargosComponent, canActivate: [AuthGuard] },
  { path: "solicitudesGenericas", component: SolicitudesGenericasComponent, canActivate: [AuthGuard] },
  {
    path: "solicitudesEspecificas",
    component: SolicitudesEspecificasComponent, canActivate: [AuthGuard]
  },
  {
    path: "solicitudesIncorporacion",
    component: SolicitudesIncorporacionComponent, canActivate: [AuthGuard]
  },
  { path: "nuevaIncorporacion", component: NuevaIncorporacionComponent, canActivate: [AuthGuard] },
  {
    path: "documentacionSolicitudes",
    component: DocumentacionSolicitudesComponent, canActivate: [AuthGuard]
  },
  {
    path: "mantenimientoGruposFijos",
    component: MantenimientoGruposFijosComponent, canActivate: [AuthGuard]
  },
  { path: "mantenimientoMandatos", component: MantenimientoMandatosComponent, canActivate: [AuthGuard] },
  { path: "busquedaSanciones", component: BusquedaSancionesComponent, canActivate: [AuthGuard] },

  // Administracion
  { path: "catalogosMaestros", component: CatalogosMaestros, canActivate: [AuthGuard] },
  {
    path: "EditarCatalogosMaestros",
    component: EditarCatalogosMaestrosComponent, canActivate: [AuthGuard]
  },
  { path: "contadores/:id", component: ContadoresComponent, canActivate: [AuthGuard] },
  {
    path: "gestionContadores",
    component: GestionContadoresComponent, canActivate: [AuthGuard]
  },
  { path: "perfiles", component: PerfilesComponent, canActivate: [AuthGuard] },
  {
    path: "EditarPerfiles",
    component: EditarPerfilesComponent, canActivate: [AuthGuard]
  },

  { path: "gruposUsuarios", component: GruposUsuarios, canActivate: [AuthGuard] },
  { path: "etiquetas", component: Etiquetas, canActivate: [AuthGuard] },
  { path: "usuarios", component: Usuarios, canActivate: [AuthGuard] },
  { path: "seleccionarIdioma", component: SeleccionarIdioma, canActivate: [AuthGuard] },
  { path: "parametrosGenerales", component: ParametrosGenerales, canActivate: [AuthGuard] },
  {
    path: "permisos",
    component: PermisosComponent, canActivate: [AuthGuard]
    // canActivate: [AuthGuard]
  },
  { path: "catalogos", component: Catalogos, canActivate: [AuthGuard] },
  { path: "auditoriaUsuarios", component: AuditoriaUsuarios, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "home" }
];
export const routing = RouterModule.forRoot(appRoutes);
