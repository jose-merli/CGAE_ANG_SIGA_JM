import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/components/common/messageservice";
import { DialogModule } from "primeng/dialog";
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, ConfirmationService, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule, PickListModule, TooltipModule } from "primeng/primeng";
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
import { PrecioModule } from "../../../../commons/precio/precio.module";
import { TablaResultadoOrderModule } from "../../../../commons/tabla-resultado-order/tabla-resultado-order.module";
import { TarjetaResumenFijaModule } from "../../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module";
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";
import { routingOficio } from "../oficio-routing.module";
import { TurnosComponent } from "./busqueda-turnos.component";
import { ConfiguracionColaOficioComponent } from "./ficha-turnos/configuracion-colaoficio/configuracion-colaoficio.component";
import { ConfiguracionTurnosComponent } from "./ficha-turnos/configuracion-turnos/configuracion-turnos.component";
import { DatosGeneralesTurnosComponent } from "./ficha-turnos/datos-generales-consulta/datos-generales-consulta.component";
import { FichaTurnosComponent } from "./ficha-turnos/ficha-turnos.component";
import { TarjetaColaGuardias } from "./ficha-turnos/tarjeta-colaguardias/tarjeta-colaguardias.component";
import { TarjetaColaOficio } from "./ficha-turnos/tarjeta-colaoficio/tarjeta-colaoficio.component";
import { TarjetaGuardias } from "./ficha-turnos/tarjeta-guardias/tarjeta-guardias.component";
import { TarjetaInscripciones } from "./ficha-turnos/tarjeta-inscripciones/tarjeta-inscripciones.component";
import { FiltrosTurnos } from "./filtros-turnos/filtros-turnos.component";
import { TablaTurnosComponent } from "./gestion-turnos/gestion-turnos.component";

@NgModule({
  imports: [DialogModule, CommonModule, routingOficio, DataTableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, TableModule, MultiSelectModule, PrecioModule, PickListModule, TooltipModule, TarjetaResumenFijaModule, ConfirmDialogModule, FechaModule, TablaResultadoOrderModule],
  declarations: [TurnosComponent, FiltrosTurnos, TablaTurnosComponent, FichaTurnosComponent, DatosGeneralesTurnosComponent, ConfiguracionTurnosComponent, ConfiguracionColaOficioComponent, TarjetaColaOficio, TarjetaColaGuardias, TarjetaGuardias, TarjetaInscripciones],
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
export class GestionTurnosModule {}
