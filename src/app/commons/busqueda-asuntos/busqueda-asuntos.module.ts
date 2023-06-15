import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF } from '@angular/common';
// import { BusquedaGeneralSJCSComponent } from './busqueda-generalSJCS/busqueda-generalSJCS.component';
// import { FiltrosGeneralSJCSComponent } from './busqueda-generalSJCS/filtros-generalSJCS/filtros-generalSJCS.component';
// import { TablaGeneralSJCSComponent } from './busqueda-generalSJCS/tabla-generalSJCS/tabla-generalSJCS.component';
import { TrimPipePipe } from '../../commons/trim-pipe/trim-pipe.pipe';
import { SigaServices } from '../../_services/siga.service';
import { CommonsService } from '../../_services/commons.service';
import { cardService } from '../../_services/cardSearch.service';
import { MessageService } from '../../../../node_modules/primeng/components/common/messageservice';
import { HeaderGestionEntidadService } from '../../_services/headerGestionEntidad.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { ConfirmationService } from '../../../../node_modules/primeng/api';
import { PersistenceService } from '../../_services/persistence.service';
import { AuthGuard } from '../../_guards/auth.guards';
import { environment } from '../../../environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '../../../../node_modules/@angular/common/http';
import { JwtInterceptor } from '../../_interceptor/jwt.interceptor';
import { CookieService } from '../../../../node_modules/ngx-cookie-service';
import { PaginatorModule, ButtonModule, InputTextModule, DropdownModule, GrowlModule, MenubarModule, CheckboxModule, ConfirmDialogModule, MultiSelectModule, AutoCompleteModule, ScheduleModule, CalendarModule, ListboxModule, ChipsModule, EditorModule, TreeModule, PickListModule, ProgressSpinnerModule, DialogModule, FileUploadModule, KeyFilterModule, StepsModule, SelectButtonModule, ColorPickerModule, RadioButtonModule, InputTextareaModule, DataTableModule, PanelMenuModule } from '../../../../node_modules/primeng/primeng';
import { TableModule } from '../../../../node_modules/primeng/table';
import { FormsModule, ReactiveFormsModule } from '../../../../node_modules/@angular/forms';
import { PipeTranslationModule } from '../../commons/translate/pipe-translation.module';
import { FechaModule } from '../../commons/fecha/fecha.module';
import { TooltipModule } from 'primeng/tooltip';
import { BusquedaAsuntosComponent } from './busqueda-asuntos.component';
import { PipeNumberModule } from '../number-pipe/number-pipe.module';
import { PrecioModule } from '../precio/precio.module';
import { BusquedaColegiadoExpressModule } from '../busqueda-colegiado-express/busqueda-colegiado-express.module';
import { GeneralSJCSModule } from '../busqueda-generalSJCS/busqueda-generalSJCS.module';
import { ValidationModule } from '../validation/validation.module';
import { routing } from '../../app.routing';
import { BrowserAnimationsModule } from '../../../../node_modules/@angular/platform-browser/animations/src/module';
import { BrowserModule } from '../../../../node_modules/@angular/platform-browser/src/browser';
import { FiltrosBusquedaAsuntosComponent } from "./filtros-busqueda-asuntos/filtros-busqueda-asuntos.component";
import { TablaBusquedaAsuntosComponent } from './tabla-busqueda-asuntos/tabla-busqueda-asuntos.component';

@NgModule({
  imports: [
    PaginatorModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    //routing,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    ConfirmDialogModule,
    ValidationModule,
    GrowlModule,
    CommonModule,
    CalendarModule,

    ScheduleModule,

    AutoCompleteModule,
    TooltipModule,
    ChipsModule,
    MultiSelectModule,
    TableModule,
    TreeModule,
    PickListModule,
    ListboxModule,
    ProgressSpinnerModule,
    FileUploadModule,
    DialogModule,
    PipeTranslationModule,
    PipeNumberModule,
    FechaModule,
    PrecioModule,
    KeyFilterModule,
    StepsModule,
    BusquedaColegiadoExpressModule,
    GeneralSJCSModule,
    SelectButtonModule,
    ColorPickerModule,
    EditorModule

  ],
  declarations: [BusquedaAsuntosComponent, FiltrosBusquedaAsuntosComponent, TablaBusquedaAsuntosComponent],
  exports: [BusquedaAsuntosComponent],

  providers: [
    DatePipe,
    TrimPipePipe,
    SigaServices,
    CommonsService,
    cardService,
    HeaderGestionEntidadService,
    MessageService,
    AuthenticationService,
    ConfirmationService,
    PersistenceService,
    AuthGuard,
    {
      provide: APP_BASE_HREF,
      useValue: environment.baseHref
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    CookieService,
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ]

})
export class BusquedaAsuntosModule { }

