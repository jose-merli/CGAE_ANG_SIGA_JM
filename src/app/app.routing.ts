import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SearchComponent } from './features/search/search.component';
import { HomeComponent } from './features/home/home.component';
import { SearchColegiadosComponent } from './features/search-colegiados/search-colegiados.component';
import { SearchNoColegiadosComponent } from './features/search-no-colegiados/search-no-colegiados.component';
import { CertificadosAcaComponent } from './features/certificados-aca/certificados-aca.component';
import { ComisionesCargosComponent } from './features/comisiones-cargos/comisiones-cargos.component';
import { SolicitudesGenericasComponent } from './features/solicitudes-genericas/solicitudes-genericas.component';
import { SolicitudesEspecificasComponent } from './features/solicitudes-especificas/solicitudes-especificas.component';
import { SolicitudesIncorporacionComponent } from './features/solicitudes-incorporacion/solicitudes-incorporacion.component';
import { NuevaIncorporacionComponent } from './features/nueva-incorporacion/nueva-incorporacion.component';
import { DocumentacionSolicitudesComponent } from './features/documentacion-solicitudes/documentacion-solicitudes.component';
import { MantenimientoGruposFijosComponent } from './features/mantenimiento-grupos-fijos/mantenimiento-grupos-fijos.component';
import { MantenimientoMandatosComponent } from './features/mantenimiento-mandatos/mantenimiento-mandatos.component';
import { BusquedaSancionesComponent } from './features/busqueda-sanciones/busqueda-sanciones.component';
import { LoginComponent } from './features/login/login.component';
import { AuthGuard } from './_guards/auth.guards'

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent},//, canActivate: [AuthGuard] },
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
