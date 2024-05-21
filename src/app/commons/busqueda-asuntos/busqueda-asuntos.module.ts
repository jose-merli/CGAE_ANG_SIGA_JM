import { APP_BASE_HREF, CommonModule, DatePipe } from "@angular/common";
import { LOCALE_ID, NgModule } from "@angular/core";
// import { BusquedaGeneralSJCSComponent } from './busqueda-generalSJCS/busqueda-generalSJCS.component';
// import { FiltrosGeneralSJCSComponent } from './busqueda-generalSJCS/filtros-generalSJCS/filtros-generalSJCS.component';
// import { TablaGeneralSJCSComponent } from './busqueda-generalSJCS/tabla-generalSJCS/tabla-generalSJCS.component';
import { TooltipModule } from "primeng/tooltip";
import { HTTP_INTERCEPTORS, HttpClientModule } from "../../../../node_modules/@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "../../../../node_modules/@angular/forms";
import { ConfirmationService } from "../../../../node_modules/primeng/api";
import { MessageService } from "../../../../node_modules/primeng/components/common/messageservice";
import { AutoCompleteModule, ButtonModule, CalendarModule, ChipsModule, ColorPickerModule, ConfirmDialogModule, DialogModule, DropdownModule, EditorModule, FileUploadModule, GrowlModule, InputTextModule, KeyFilterModule, ListboxModule, MultiSelectModule, PaginatorModule, PickListModule, ProgressSpinnerModule, RadioButtonModule, ScheduleModule, SelectButtonModule, StepsModule, TreeModule } from "../../../../node_modules/primeng/primeng";
import { TableModule } from "../../../../node_modules/primeng/table";
import { environment } from "../../../environments/environment";
import { AuthGuard } from "../../_guards/auth.guards";
import { JwtInterceptor } from "../../_interceptor/jwt.interceptor";
import { AuthenticationService } from "../../_services/authentication.service";
import { CardService } from "../../_services/cardSearch.service";
import { CommonsService } from "../../_services/commons.service";
import { PersistenceService } from "../../_services/persistence.service";
import { SigaServices } from "../../_services/siga.service";
import { FechaModule } from "../../commons/fecha/fecha.module";
import { PipeTranslationModule } from "../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../commons/trim-pipe/trim-pipe.pipe";
import { BusquedaColegiadoExpressModule } from "../busqueda-colegiado-express/busqueda-colegiado-express.module";
import { GeneralSJCSModule } from "../busqueda-generalSJCS/busqueda-generalSJCS.module";
import { PipeNumberModule } from "../number-pipe/number-pipe.module";
import { PrecioModule } from "../precio/precio.module";
import { ValidationModule } from "../validation/validation.module";
import { BusquedaAsuntosComponent } from "./busqueda-asuntos.component";
import { FiltrosBusquedaAsuntosComponent } from "./filtros-busqueda-asuntos/filtros-busqueda-asuntos.component";
import { TablaBusquedaAsuntosComponent } from "./tabla-busqueda-asuntos/tabla-busqueda-asuntos.component";

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
    EditorModule,
  ],
  declarations: [BusquedaAsuntosComponent, FiltrosBusquedaAsuntosComponent, TablaBusquedaAsuntosComponent],
  exports: [BusquedaAsuntosComponent],

  providers: [
    DatePipe,
    TrimPipePipe,
    SigaServices,
    CommonsService,
    CardService,
    MessageService,
    AuthenticationService,
    ConfirmationService,
    PersistenceService,
    AuthGuard,
    {
      provide: APP_BASE_HREF,
      useValue: environment.baseHref,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: "es-ES" },
  ],
})
export class BusquedaAsuntosModule {}
