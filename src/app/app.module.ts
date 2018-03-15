import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';

import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

import { AuthGuard } from './_guards/auth.guards';
import { OldSigaServices } from './_services/oldSiga.service';
import { SigaServices } from './_services/siga.service';
import { AuthenticationService } from './_services/authentication.service';
import { JwtInterceptor } from './_interceptor/jwt.interceptor'

// Componentes comunes
import { routing } from './app.routing';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HeaderComponent } from './commons/header/header.component';
import { MyIframeComponent } from './commons/my-iframe/my-iframe.component';
import { MenubarComponent } from './commons/menubar/menubar.component';
import { MenuComponent } from './commons/menu/menu.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './commons/login/login.component';

// Modulo de censo
import { SearchColegiadosComponent } from './features/censo/search-colegiados/search-colegiados.component';
import { SearchNoColegiadosComponent } from './features/censo/search-no-colegiados/search-no-colegiados.component';
import { CertificadosAcaComponent } from './features/censo/certificados-aca/certificados-aca.component';
import { ComisionesCargosComponent } from './features/censo/comisiones-cargos/comisiones-cargos.component';
import { SolicitudesGenericasComponent } from './features/censo/solicitudes-genericas/solicitudes-genericas.component';
import { SolicitudesEspecificasComponent } from './features/censo/solicitudes-especificas/solicitudes-especificas.component';
import { SolicitudesIncorporacionComponent } from './features/censo/solicitudes-incorporacion/solicitudes-incorporacion.component';
import { NuevaIncorporacionComponent } from './features/censo/nueva-incorporacion/nueva-incorporacion.component';
import { DocumentacionSolicitudesComponent } from './features/censo/documentacion-solicitudes/documentacion-solicitudes.component';
import { MantenimientoGruposFijosComponent } from './features/censo/mantenimiento-grupos-fijos/mantenimiento-grupos-fijos.component';
import { MantenimientoMandatosComponent } from './features/censo/mantenimiento-mandatos/mantenimiento-mandatos.component';
import { BusquedaSancionesComponent } from './features/censo/busqueda-sanciones/busqueda-sanciones.component';


// Modulo de administracion
import { CatalogosMaestros } from './features/administracion/catalogos-maestros/catalogos-maestros.component';
import { GruposUsuarios } from './features/administracion/grupos-usuarios/grupos-usuarios.component';
import { Etiquetas } from './features/administracion/etiquetas/etiquetas.component';
import { SeleccionarIdioma } from './features/administracion/seleccionar-idioma/seleccionar-idioma.component';
import { Usuarios } from './features/administracion/usuarios/usuarios.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


/***NEW modules censo***/
import { BusquedaColegiadosModule } from './content/censo/busqueda-colegiados/busqueda-colegiados.module';

@NgModule({
  declarations: [
    AppComponent,
    MyIframeComponent,
    MenubarComponent,
    MenuComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,

    // Censo
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

    // Administracion
    CatalogosMaestros,
    GruposUsuarios,
    Etiquetas,
    SeleccionarIdioma,
    Usuarios
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    MenubarModule,
    PanelMenuModule,
    BusquedaColegiadosModule
  ],
  providers: [
    OldSigaServices,
    SigaServices,
    AuthenticationService,
    AuthGuard,
    {
      provide: APP_BASE_HREF,
      useValue: environment.baseHref
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
