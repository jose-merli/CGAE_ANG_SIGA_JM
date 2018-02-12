import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './commons/home/home.component';
import { LandpageComponent } from './commons/landpage/landpage.component';
import { SearchComponent } from './commons/search/search.component';
import { SearchColegiadosComponent } from './commons/search-colegiados/search-colegiados.component';
import { SearchNoColegiadosComponent } from './commons/search-no-colegiados/search-no-colegiados.component';
import { CertificadosAcaComponent } from './commons/certificados-aca/certificados-aca.component';
import { ComisionesCargosComponent } from './commons/comisiones-cargos/comisiones-cargos.component';
import { SolicitudesGenericasComponent } from './commons/solicitudes-genericas/solicitudes-genericas.component';
import { SolicitudesEspecificasComponent } from './commons/solicitudes-especificas/solicitudes-especificas.component';
import { SolicitudesIncorporacionComponent } from './commons/solicitudes-incorporacion/solicitudes-incorporacion.component';
import { NuevaIncorporacionComponent } from './commons/nueva-incorporacion/nueva-incorporacion.component';
import { DocumentacionSolicitudesComponent } from './commons/documentacion-solicitudes/documentacion-solicitudes.component';
import { MantenimientoGruposFijosComponent } from './commons/mantenimiento-grupos-fijos/mantenimiento-grupos-fijos.component';
import { MantenimientoMandatosComponent } from './commons/mantenimiento-mandatos/mantenimiento-mandatos.component';
import { BusquedaSancionesComponent } from './commons/busqueda-sanciones/busqueda-sanciones.component';

const appRoutes: Routes = [
    { path: 'landpage', component: LandpageComponent },
    { path: 'home', component: HomeComponent },
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
    //{ path: 'login', component: LoginComponent },
    //{ path: 'servicios', component: EntityComponent, data: { name: "servicios" } },
    //{ path: 'entity/:name', component: EntityComponent },
    //{ path: 'entity/:name/:id', component: RecordComponent },
    //{ path: 'entities', component: EntitiesComponent },
    //{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: "servicios" }

];
export const routing = RouterModule.forRoot(appRoutes);
