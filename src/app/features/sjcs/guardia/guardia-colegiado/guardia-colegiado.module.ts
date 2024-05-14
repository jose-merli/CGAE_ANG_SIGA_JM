import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, ConfirmationService, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, MultiSelectModule, PaginatorModule, PickListModule, TreeTableModule } from "primeng/primeng";
import { HTTP_INTERCEPTORS } from "../../../../../../node_modules/@angular/common/http";
import { CookieService } from "../../../../../../node_modules/ngx-cookie-service";
import { MessageService } from "../../../../../../node_modules/primeng/components/common/messageservice";
import { TableModule } from "../../../../../../node_modules/primeng/table";
import { environment } from "../../../../../environments/environment";
import { AuthGuard } from "../../../../_guards/auth.guards";
import { JwtInterceptor } from "../../../../_interceptor/jwt.interceptor";
import { AuthenticationService } from "../../../../_services/authentication.service";
import { CardService } from "../../../../_services/cardSearch.service";
import { CommonsService } from "../../../../_services/commons.service";
import { HeaderGestionEntidadService } from "../../../../_services/headerGestionEntidad.service";
import { SigaServices } from "../../../../_services/siga.service";
import { BusquedaColegiadoExpressModule } from "../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.module";
import { FechaModule } from "../../../../commons/fecha/fecha.module";
import { ImagePipe } from "../../../../commons/image-pipe/image.pipe";
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";

@NgModule({
  imports: [DialogModule, CommonModule, DataTableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, TableModule, MultiSelectModule, FechaModule, ConfirmDialogModule, BusquedaColegiadoExpressModule, PickListModule, TreeTableModule],
  declarations: [],
  providers: [
    ImagePipe,
    DatePipe,
    TrimPipePipe,
    UpperCasePipe,
    SigaServices,
    CommonsService,
    CardService,
    HeaderGestionEntidadService,
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
    CookieService,
    { provide: LOCALE_ID, useValue: "es-ES" },
  ],
})
export class GuardiaColegiadoModule {}
