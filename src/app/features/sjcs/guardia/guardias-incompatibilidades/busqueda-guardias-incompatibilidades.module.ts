import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, ConfirmationService, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule, PickListModule, TreeTableModule } from "primeng/primeng";
import { TableModule } from "primeng/table";
import { HTTP_INTERCEPTORS } from "../../../../../../node_modules/@angular/common/http";
import { CookieService } from "../../../../../../node_modules/ngx-cookie-service";
import { MessageService } from "../../../../../../node_modules/primeng/components/common/messageservice";
import { environment } from "../../../../../environments/environment";
import { AuthGuard } from "../../../../_guards/auth.guards";
import { JwtInterceptor } from "../../../../_interceptor/jwt.interceptor";
import { AuthenticationService } from "../../../../_services/authentication.service";
import { CommonsService } from "../../../../_services/commons.service";
import { SigaServices } from "../../../../_services/siga.service";
import { FechaModule } from "../../../../commons/fecha/fecha.module";
import { ImagePipe } from "../../../../commons/image-pipe/image.pipe";
import { PrecioModule } from "../../../../commons/precio/precio.module";
import { TablaDinamicaColaGuardiaModule } from "../../../../commons/tabla-dinamica-cola-guardia/tabla-dinamica-cola-guardia.module";
import { TablaDinamicaModule } from "../../../../commons/tabla-dinamica/tabla-dinamica.module";
import { TablaResultadoMixModule } from "../../../../commons/tabla-resultado-mix/tabla-resultado-mix.module";
import { TablaResultadoOrderModule } from "../../../../commons/tabla-resultado-order/tabla-resultado-order.module";
import { TarjetaResumenFijaModule } from "../../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module";
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";
import { BuscadorGuardiaIncompatibilidadesComponent } from "./buscador-guardia-incompatibilidades/buscador-guardia-incompatibilidades.component";
import { FiltrosGuardiaIncompatibilidadesComponent } from "./buscador-guardia-incompatibilidades/filtros-guardia-incompatibilidades/filtros-guardia-incompatibilidades.component";

@NgModule({
  imports: [CommonModule, DataTableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, TableModule, TreeTableModule, MultiSelectModule, PrecioModule, TarjetaResumenFijaModule, TablaDinamicaModule, PickListModule, TablaDinamicaColaGuardiaModule, ConfirmDialogModule, FechaModule, TablaResultadoOrderModule, TablaResultadoMixModule],
  declarations: [BuscadorGuardiaIncompatibilidadesComponent, FiltrosGuardiaIncompatibilidadesComponent],
  providers: [
    ImagePipe,
    DatePipe,
    TrimPipePipe,
    UpperCasePipe,
    SigaServices,
    CommonsService,
    MessageService,
    AuthenticationService,
    ConfirmationService,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BusquedaGuardiasIncompatibilidadesModule {}
