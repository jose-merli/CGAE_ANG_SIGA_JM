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
import { PermisosComponent } from "./features/administracion/permisos/permisos.component";

const appRoutes: Routes = [
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },

  // Censo
  {
    path: "busquedaColegiados",
    component: BusquedaColegiadosComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: "fichaColegial/:id",
    component: FichaColegialComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: "editarUsuario",
    component: EditarUsuarioComponent
  },
  { path: "searchNoColegiados", component: SearchNoColegiadosComponent },
  { path: "certificadosAca", component: CertificadosAcaComponent },
  { path: "comisionesCargos", component: ComisionesCargosComponent },
  { path: "solicitudesGenericas", component: SolicitudesGenericasComponent },
  {
    path: "solicitudesEspecificas",
    component: SolicitudesEspecificasComponent
  },
  {
    path: "solicitudesIncorporacion",
    component: SolicitudesIncorporacionComponent
  },
  { path: "nuevaIncorporacion", component: NuevaIncorporacionComponent },
  {
    path: "documentacionSolicitudes",
    component: DocumentacionSolicitudesComponent
  },
  {
    path: "mantenimientoGruposFijos",
    component: MantenimientoGruposFijosComponent
  },
  { path: "mantenimientoMandatos", component: MantenimientoMandatosComponent },
  { path: "busquedaSanciones", component: BusquedaSancionesComponent },

  // Administracion
  { path: "catalogosMaestros", component: CatalogosMaestros },
  {
    path: "EditarCatalogosMaestros",
    component: EditarCatalogosMaestrosComponent
  },
  { path: "contadores/:id", component: ContadoresComponent },
  {
    path: "gestionContadores",
    component: GestionContadoresComponent
  },

  { path: "gruposUsuarios", component: GruposUsuarios },
  { path: "etiquetas", component: Etiquetas },
  { path: "usuarios", component: Usuarios },
  { path: "seleccionarIdioma", component: SeleccionarIdioma },
  { path: "parametrosGenerales", component: ParametrosGenerales },
  {
    path: "permisos",
    component: PermisosComponent,
    // canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "home" }
];
export const routing = RouterModule.forRoot(appRoutes);
