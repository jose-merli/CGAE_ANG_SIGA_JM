import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/components/common/messageservice";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, ConfirmationService, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule, PickListModule, TooltipModule } from "primeng/primeng";
import { TableModule } from "primeng/table";
import { environment } from "../../../../../environments/environment";
import { AuthGuard } from "../../../../_guards/auth.guards";
import { JwtInterceptor } from "../../../../_interceptor/jwt.interceptor";
import { AuthenticationService } from "../../../../_services/authentication.service";
import { CardService } from "../../../../_services/cardSearch.service";
import { CommonsService } from "../../../../_services/commons.service";
import { SigaServices } from "../../../../_services/siga.service";
import { ImagePipe } from "../../../../commons/image-pipe/image.pipe";
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";

import { MultiSelectModule } from "primeng/multiselect";
import { RadioButtonModule } from "primeng/primeng";
import { TreeTableModule } from "primeng/treetable";
import { BusquedaColegiadoExpressModule } from "../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.module";
import { FechaModule } from "../../../../commons/fecha/fecha.module";
import { PrecioModule } from "../../../../commons/precio/precio.module";
import { TarjetaResumenFijaModule } from "../../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module";
import { routingOficio } from "../oficio-routing.module";
import { InscripcionesComponent } from "./busqueda-inscripciones.component";
import { FichaInscripcionesComponent } from "./ficha-inscripciones/ficha-inscripciones.component";
import { TarjetaColaFijaComponent } from "./ficha-inscripciones/tarjeta-cola-fija/tarjeta-cola-fija.component";
import { TarjetaGestionInscripcion } from "./ficha-inscripciones/tarjeta-gestion-inscripciones/tarjeta-gestion-inscripcion.component";
import { TarjetaInscripcion } from "./ficha-inscripciones/tarjeta-inscripciones/tarjeta-inscripcion.component";
import { TarjetaLetradoComponent } from "./ficha-inscripciones/tarjeta-letrado/tarjeta-letrado.component";
import { FiltrosInscripciones } from "./filtros-inscripciones/filtros-inscripciones.component";
import { TablaInscripcionesComponent } from "./gestion-inscripciones/gestion-inscripciones.component";

@NgModule({
  imports: [CommonModule, routingOficio, DataTableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, TableModule, MultiSelectModule, PrecioModule, PickListModule, TooltipModule, TarjetaResumenFijaModule, ConfirmDialogModule, FechaModule, BusquedaColegiadoExpressModule, TreeTableModule, RadioButtonModule],
  declarations: [InscripcionesComponent, TablaInscripcionesComponent, FiltrosInscripciones, FichaInscripcionesComponent, TarjetaLetradoComponent, TarjetaInscripcion, TarjetaColaFijaComponent, TarjetaGestionInscripcion],
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
export class GestionInscripcionesModule {}
