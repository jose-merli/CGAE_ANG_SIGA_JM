import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/components/common/messageservice";
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, ConfirmationService, DataTableModule, DialogModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule } from "primeng/primeng";
import { RadioButtonModule } from "primeng/radiobutton";
import { SpinnerModule } from "primeng/spinner";
import { TableModule } from "primeng/table";
import { environment } from "../../../../../environments/environment";
import { AuthGuard } from "../../../../_guards/auth.guards";
import { JwtInterceptor } from "../../../../_interceptor/jwt.interceptor";
import { AuthenticationService } from "../../../../_services/authentication.service";
import { CardService } from "../../../../_services/cardSearch.service";
import { CommonsService } from "../../../../_services/commons.service";
import { SigaServices } from "../../../../_services/siga.service";
import { FechaModule } from "../../../../commons/fecha/fecha.module";
import { ImagePipe } from "../../../../commons/image-pipe/image.pipe";
import { PipeNumberModule } from "../../../../commons/number-pipe/number-pipe.module";
import { PrecioModule } from "../../../../commons/precio/precio.module";
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";
import { MaestrosModulosComponent } from "./busqueda-modulosybasesdecompensacion.component";
import { EdicionModulosComponent } from "./edicion-modulos/gestion-modulos/edicion-modulos.component";
import { GestionModulosYBasesComponent } from "./edicion-modulos/gestion-modulosybasesdecompensacion.component";
import { TablaAcreditacionesComponent } from "./edicion-modulos/tabla-acreditaciones/tabla-acreditaciones.component";
import { FiltrosModulosComponent } from "./filtro-busqueda-modulos/filtros-modulos.component";
import { TablaModulosComponent } from "./tabla-modulos/tabla-modulos.component";

@NgModule({
  imports: [CommonModule, DataTableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, TableModule, MultiSelectModule, FechaModule, SpinnerModule, PrecioModule, ConfirmDialogModule, PipeNumberModule, DialogModule, RadioButtonModule],
  declarations: [FiltrosModulosComponent, MaestrosModulosComponent, TablaModulosComponent, GestionModulosYBasesComponent, EdicionModulosComponent, TablaAcreditacionesComponent],
  providers: [
    ImagePipe,
    DatePipe,
    TrimPipePipe,
    UpperCasePipe,
    SigaServices,
    CommonsService,
    CardService,
    MessageService,
    AuthenticationService,
    ConfirmationService,
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
export class GestionModulosModule {}
