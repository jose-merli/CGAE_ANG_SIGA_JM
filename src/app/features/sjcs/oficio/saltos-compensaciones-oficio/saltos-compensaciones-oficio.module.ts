import { APP_BASE_HREF, CommonModule, DatePipe } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSortModule } from "@angular/material";
import { MessageService } from "primeng/components/common/messageservice";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, ConfirmationService, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, MultiSelectModule, PaginatorModule } from "primeng/primeng";
import { TableModule } from "primeng/table";
import { environment } from "../../../../../environments/environment";
import { AuthGuard } from "../../../../_guards/auth.guards";
import { JwtInterceptor } from "../../../../_interceptor/jwt.interceptor";
import { AuthenticationService } from "../../../../_services/authentication.service";
import { CommonsService } from "../../../../_services/commons.service";
import { SigaServices } from "../../../../_services/siga.service";
import { BusquedaColegiadoExpressModule } from "../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.module";
import { FechaModule } from "../../../../commons/fecha/fecha.module";
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { Paginador2Module } from "../bajas-temporales/paginador2/paginador2.module";
import { routingOficio } from "../oficio-routing.module";
import { FiltrosSaltosCompensacionesOficioComponent } from "./filtros-saltos-compensaciones-oficio/filtros-saltos-compensaciones-oficio.component";
import { SaltosCompensacionesOficioComponent } from "./saltos-compensaciones-oficio.component";
import { TablaResultadoMixSaltosCompOficioComponent } from "./tabla-resultado-mix-saltos-comp-oficio/tabla-resultado-mix-saltos-comp-oficio.component";
import { TablaResultadoMixSaltosCompOficioService } from "./tabla-resultado-mix-saltos-comp-oficio/tabla-resultado-mix-saltos-comp-oficio.service";

@NgModule({
  imports: [CommonModule, routingOficio, CommonModule, routingOficio, DataTableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, TableModule, MultiSelectModule, ConfirmDialogModule, FechaModule, BusquedaColegiadoExpressModule, Paginador2Module, MatSortModule],
  declarations: [SaltosCompensacionesOficioComponent, FiltrosSaltosCompensacionesOficioComponent, TablaResultadoMixSaltosCompOficioComponent],
  providers: [
    TablaResultadoMixSaltosCompOficioService,
    DatePipe,
    SigaServices,
    CommonsService,
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
export class SaltosCompensacionesOficioModule {}
