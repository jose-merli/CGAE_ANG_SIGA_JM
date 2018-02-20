import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TestService } from './_services/test.service';
import { AuthenticationService } from './_services/authentication.service';
import { routing } from './app.routing';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
//import {MyDatePickerModule} from '../../node_features/angular2-datepicker'; Problema de version

import { AppComponent } from './app.component';
import { MyIframeComponent } from './commons/my-iframe/my-iframe.component';
import { SearchComponent } from './features/search/search.component';
import { MenubarComponent } from './features/menubar/menubar.component';
import { TieredMenuComponent } from './features/tieredMenu/tieredMenu.component';
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
import { AuthGuard } from './_guards/auth.guards';
import { Globals } from './_services/globals.service'
import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../environments/environment';
import { MainComponent } from './commons/main-component/main-component.component';

@NgModule({
  declarations: [
    AppComponent,
    MyIframeComponent,
    HomeComponent,
    SearchComponent,
    MenubarComponent,
    TieredMenuComponent,
    SearchColegiadosComponent,
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
    LoginComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    MenubarModule,
    TieredMenuModule
  ],
  providers: [
    TestService,
    AuthenticationService,
    AuthGuard,
    Globals,
    {
      provide: APP_BASE_HREF,
      useValue: environment.baseHref
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
