import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { LOCALE_ID, NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "../../../../../../node_modules/@angular/common/http";
import { FormsModule } from "../../../../../../node_modules/@angular/forms";
import { CookieService } from "../../../../../../node_modules/ngx-cookie-service";
import { MessageService } from "../../../../../../node_modules/primeng/components/common/messageservice";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, ConfirmationService, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule } from "../../../../../../node_modules/primeng/primeng";
import { TableModule } from "../../../../../../node_modules/primeng/table";
import { environment } from "../../../../../environments/environment";
import { AuthGuard } from "../../../../_guards/auth.guards";
import { JwtInterceptor } from "../../../../_interceptor/jwt.interceptor";
import { AuthenticationService } from "../../../../_services/authentication.service";
import { CardService } from "../../../../_services/cardSearch.service";
import { CommonsService } from "../../../../_services/commons.service";
import { PersistenceService } from "../../../../_services/persistence.service";
import { SigaServices } from "../../../../_services/siga.service";
import { FechaModule } from "../../../../commons/fecha/fecha.module";
import { ImagePipe } from "../../../../commons/image-pipe/image.pipe";
import { PipeNumberModule } from "../../../../commons/number-pipe/number-pipe.module";
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";
import { BusquedaFundamentosresolucionComponent } from "./busqueda-fundamentosresolucion/busqueda-fundamentosresolucion.component";
import { FiltrosFundamentosresolucionComponent } from "./busqueda-fundamentosresolucion/filtros-fundamentosresolucion/filtros-fundamentosresolucion.component";
import { DatosGeneralesFundamentosComponent } from "./busqueda-fundamentosresolucion/gestion-fundamentosresolucion/datos-generales-fundamentos/datos-generales-fundamentos.component";
import { GestionFundamentosresolucionComponent } from "./busqueda-fundamentosresolucion/gestion-fundamentosresolucion/gestion-fundamentosresolucion.component";
import { TablaFundamentosresolucionComponent } from "./busqueda-fundamentosresolucion/tabla-fundamentosresolucion/tabla-fundamentosresolucion.component";

@NgModule({
  imports: [CommonModule, TableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, CheckboxModule, FechaModule, ConfirmDialogModule, PipeNumberModule],
  declarations: [BusquedaFundamentosresolucionComponent, FiltrosFundamentosresolucionComponent, TablaFundamentosresolucionComponent, GestionFundamentosresolucionComponent, DatosGeneralesFundamentosComponent],
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
    CookieService,
    { provide: LOCALE_ID, useValue: "es-ES" },
  ],
})
export class FundamentosResolucionModule {}
