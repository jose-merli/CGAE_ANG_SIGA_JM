import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './commons/home/home.component';
import { SearchComponent } from './commons/search/search.component';
import { SearchColegiadosComponent } from './modules/search-colegiados/search-colegiados.component';
import { SearchNoColegiadosComponent } from './modules/search-no-colegiados/search-no-colegiados.component';
import { CertificadosAcaComponent } from './modules/certificados-aca/certificados-aca.component';
import { ComisionesCargosComponent } from './modules/comisiones-cargos/comisiones-cargos.component';
import { SolicitudesGenericasComponent } from './modules/solicitudes-genericas/solicitudes-genericas.component';
import { SolicitudesEspecificasComponent } from './modules/solicitudes-especificas/solicitudes-especificas.component';
import { SolicitudesIncorporacionComponent } from './modules/solicitudes-incorporacion/solicitudes-incorporacion.component';
import { NuevaIncorporacionComponent } from './modules/nueva-incorporacion/nueva-incorporacion.component';
import { DocumentacionSolicitudesComponent } from './modules/documentacion-solicitudes/documentacion-solicitudes.component';
import { MantenimientoGruposFijosComponent } from './modules/mantenimiento-grupos-fijos/mantenimiento-grupos-fijos.component';
import { MantenimientoMandatosComponent } from './modules/mantenimiento-mandatos/mantenimiento-mandatos.component';
import { BusquedaSancionesComponent } from './modules/busqueda-sanciones/busqueda-sanciones.component';
import { LoginComponent } from './commons/login/login.component';
import { AuthGuard } from './_guards/auth.guards'

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'search', component: SearchComponent },
    { path: 'searchColegiados', component: SearchColegiadosComponent },
    { path: 'searchNoColegiados', component: SearchNoColegiadosComponent },
    { path: 'certificadosAca', component: CertificadosAcaComponent },
    { path: 'comisionesCargos', component: ComisionesCargosComponent },
    { path: 'solicitudesGenericas', component: SolicitudesGenericasComponent },
    { path: 'solicitudesEspecificas', component: SolicitudesEspecificasComponent },
    { path: 'solicitudesIncorporacion', component: SolicitudesIncorporacionComponent },
    { path: 'nuevaIncorporacion', component: NuevaIncorporacionComponent },
    { path: 'documentacionSolicitudes', component: DocumentacionSolicitudesComponent },
    { path: 'mantenimientoGruposFijos', component: MantenimientoGruposFijosComponent },
    { path: 'mantenimientoMandatos', component: MantenimientoMandatosComponent },
    { path: 'busquedaSanciones', component: BusquedaSancionesComponent },
    //{ path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    //{ path: 'servicios', component: EntityComponent, data: { name: "servicios" } },
    //{ path: 'entity/:name', component: EntityComponent },
    //{ path: 'entity/:name/:id', component: RecordComponent },
    //{ path: 'entities', component: EntitiesComponent },
    { path: '**', redirectTo: 'home' }

];
export const routing = RouterModule.forRoot(appRoutes);
