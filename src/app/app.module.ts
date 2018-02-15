import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TestService } from './_services/test.service';
import { AuthenticationService } from './_services/authentication.service';
import { routing } from './app.routing';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
//import {MyDatePickerModule} from '../../node_modules/angular2-datepicker'; Problema de version

import { AppComponent } from './app.component';
import { MyIframeComponent } from './commons/my-iframe/my-iframe.component';
import { HomeComponent } from './commons/home/home.component';
import { SearchComponent } from './commons/search/search.component';
import { MenubarComponent } from './modules/menubar/menubar.component';
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
import { MainComponent } from './commons/main/main.component';
import { LoginComponent } from './commons/login/login.component';
import { AuthGuard } from './_guards/auth.guards';
import { Globals } from './_services/globals.service'

@NgModule({
  declarations: [
    AppComponent,
    MyIframeComponent,
    HomeComponent,
    SearchComponent,
    MenubarComponent,
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
    MainComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    MenubarModule
  ],
  providers: [
    TestService,
    AuthenticationService,
    AuthGuard,
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
