import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSortModule } from "@angular/material/sort";
import { ConfirmationService } from "primeng/api";
import { MessageService } from "primeng/components/common/messageservice";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule, CheckboxModule, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule, PickListModule, TooltipModule } from "primeng/primeng";
import { TableModule } from "primeng/table";
import { TreeTableModule } from "primeng/treetable";
import { environment } from "../../../../../environments/environment";
import { AuthGuard } from "../../../../_guards/auth.guards";
import { JwtInterceptor } from "../../../../_interceptor/jwt.interceptor";
import { AuthenticationService } from "../../../../_services/authentication.service";
import { CardService } from "../../../../_services/cardSearch.service";
import { CommonsService } from "../../../../_services/commons.service";
import { SigaServices } from "../../../../_services/siga.service";
import { BusquedaColegiadoExpressModule } from "../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.module";
import { FechaModule } from "../../../../commons/fecha/fecha.module";
import { ImagePipe } from "../../../../commons/image-pipe/image.pipe";
import { PrecioModule } from "../../../../commons/precio/precio.module";
import { TarjetaResumenFijaModule } from "../../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module";
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";
import { routingOficio } from "../oficio-routing.module";
import { BajasTemporalesComponent } from "./busqueda-bajas-temporales.component";
import { FiltrosBajasTemporales } from "./filtros-inscripciones/filtros-bajas-temporales.component";
import { GestionBajasTemporalesComponent } from "./gestion-bajas-temporales/gestion-bajas-temporales.component";
import { GestionBajasTemporalesService } from "./gestion-bajas-temporales/gestion-bajas-temporales.service";
import { Paginador2Module } from "./paginador2/paginador2.module";

@NgModule({
  imports: [CommonModule, routingOficio, DataTableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, TableModule, MultiSelectModule, PrecioModule, PickListModule, TooltipModule, TarjetaResumenFijaModule, ConfirmDialogModule, FechaModule, BusquedaColegiadoExpressModule, TreeTableModule, Paginador2Module, MatSortModule],
  declarations: [BajasTemporalesComponent, FiltrosBajasTemporales, GestionBajasTemporalesComponent],
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
    GestionBajasTemporalesService,
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
export class GestionBajasTemporalesModule {}
