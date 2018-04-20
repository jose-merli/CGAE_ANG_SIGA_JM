import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APP_BASE_HREF } from "@angular/common";
import { ValidationModule } from "./commons/validation/validation.module";
import { MenubarModule } from "primeng/menubar";
import { PanelMenuModule } from "primeng/panelmenu";
import { MenuItem } from "primeng/api";

import { AuthGuard } from "./_guards/auth.guards";
import { OldSigaServices } from "./_services/oldSiga.service";
import { SigaServices } from "./_services/siga.service";
import { AuthenticationService } from "./_services/authentication.service";
import { JwtInterceptor } from "./_interceptor/jwt.interceptor";

// Componentes comunes
import { routing } from "./app.routing";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./commons/header/header.component";
import { MyIframeComponent } from "./commons/my-iframe/my-iframe.component";
import { MenuComponent } from "./commons/menu/menu.component";
import { HomeComponent } from "./features/home/home.component";
import { LoginComponent } from "./commons/login/login.component";
import { TranslatePipe, TranslateService } from "./commons/translate";
import { ConfirmDialogComponent } from "./commons/dialog/dialog.component";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
//PRIMENG
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { DataTableModule } from "primeng/datatable";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { GrowlModule } from "primeng/growl";
import { MultiSelectModule } from "primeng/multiSelect";
// Modulo de censo
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

import { CommonModule } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { AutoCompleteModule } from "primeng/autocomplete";
import { TooltipModule } from "primeng/tooltip";
import { ChipsModule } from "primeng/chips";
import { EditorModule } from "primeng/editor";
import { EditarUsuarioComponent } from "./features/administracion/usuarios/editarUsuario/editarUsuario.component";
// Modulo de administracion
import { CatalogosMaestros } from "./features/administracion/catalogos-maestros/catalogos-maestros.component";
import { EditarCatalogosMaestrosComponent } from "./features/administracion/catalogos-maestros/editarCatalogosMaestros/editarCatalogosMaestros.component";
import { GruposUsuarios } from "./features/administracion/grupos-usuarios/grupos-usuarios.component";
import { Etiquetas } from "./features/administracion/etiquetas/etiquetas.component";
import { SeleccionarIdioma } from "./features/administracion/seleccionar-idioma/seleccionar-idioma.component";
import { Usuarios } from "./features/administracion/usuarios/usuarios.component";
import { ParametrosGenerales } from "./features/administracion/parametros/parametros-generales/parametros-generales.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

/***NEW modules censo***/
import { BusquedaColegiadosModule } from "./new-features/censo/busqueda-colegiados/busqueda-colegiados.module";
import { FichaColegialModule } from "./new-features/censo/ficha-colegial/ficha-colegial.module";

@NgModule({
  declarations: [
    AppComponent,
    TranslatePipe,
    MyIframeComponent,
    MenuComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    ConfirmDialogComponent,
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
    EditarUsuarioComponent,
    EditarCatalogosMaestrosComponent,
    // Administracion
    CatalogosMaestros,
    GruposUsuarios,
    Etiquetas,
    SeleccionarIdioma,
    Usuarios,
    ParametrosGenerales
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
    BusquedaColegiadosModule,
    FichaColegialModule,
    DropdownModule,
    ButtonModule,
    DataTableModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    RadioButtonModule,
    ConfirmDialogModule,
    ValidationModule,
    GrowlModule,
    CommonModule,
    CalendarModule,
    AutoCompleteModule,
    TooltipModule,
    ChipsModule,
    EditorModule,
    MultiSelectModule
  ],
  providers: [
    // { provide: TranslationClass.TRANSLATIONS, useValue: TranslationClass.dictionary },
    TranslateService,
    OldSigaServices,
    SigaServices,
    MessageService,
    AuthenticationService,
    ConfirmationService,
    AuthGuard,
    {
      provide: APP_BASE_HREF,
      useValue: environment.baseHref
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
