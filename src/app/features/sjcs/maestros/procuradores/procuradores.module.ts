import { APP_BASE_HREF, CommonModule, DatePipe } from "@angular/common";
import { LOCALE_ID, NgModule } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { HTTP_INTERCEPTORS } from "../../../../../../node_modules/@angular/common/http";
import { FormsModule } from "../../../../../../node_modules/@angular/forms";
import { CookieService } from "../../../../../../node_modules/ngx-cookie-service";
import { ConfirmationService } from "../../../../../../node_modules/primeng/api";
import { MessageService } from "../../../../../../node_modules/primeng/components/common/messageservice";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule } from "../../../../../../node_modules/primeng/primeng";
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
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";
import { BusquedaProcuradoresComponent } from "./busqueda-procuradores/busqueda-procuradores.component";
import { FiltrosProcuradoresComponent } from "./busqueda-procuradores/filtros-procuradores/filtros-procuradores.component";
import { DatosDireccionesProcuradoresComponent } from "./busqueda-procuradores/gestion-procuradores/datos-direcciones-procuradores/datos-direcciones-procuradores.component";
import { DatosGeneralesProcuradoresComponent } from "./busqueda-procuradores/gestion-procuradores/datos-generales-procuradores/datos-generales-procuradores.component";
import { GestionProcuradoresComponent } from "./busqueda-procuradores/gestion-procuradores/gestion-procuradores.component";
import { TablaProcuradoresComponent } from "./busqueda-procuradores/tabla-procuradores/tabla-procuradores.component";

@NgModule({
  imports: [CommonModule, TableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, CheckboxModule, FechaModule, ConfirmDialogModule, TooltipModule],
  declarations: [BusquedaProcuradoresComponent, FiltrosProcuradoresComponent, TablaProcuradoresComponent, GestionProcuradoresComponent, DatosGeneralesProcuradoresComponent, DatosDireccionesProcuradoresComponent],

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
    CookieService,
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
export class ProcuradoresModule {}
