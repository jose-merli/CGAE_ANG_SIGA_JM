import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { TestService } from './_services/test.service';
import { routing } from './app.routing';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
//import {MyDatePickerModule} from '../../node_modules/angular2-datepicker'; Problema de version

import { AppComponent } from './app.component';
import { MyIframeComponent } from './commons/my-iframe/my-iframe.component';
import { HomeComponent } from './commons/home/home.component';
import { LandpageComponent } from './commons/landpage/landpage.component';
import { SearchComponent } from './commons/search/search.component';
import { MenubarComponent } from './commons/menubar/menubar.component';
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

@NgModule({
  declarations: [
    AppComponent,
    MyIframeComponent,
    HomeComponent,
    LandpageComponent,
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
    BusquedaSancionesComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing,
    MenubarModule
  ],
  providers: [
    TestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
