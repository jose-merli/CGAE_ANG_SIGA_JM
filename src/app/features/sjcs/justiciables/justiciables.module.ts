import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { MessageService } from "primeng/components/common/messageservice";
import { DialogModule } from "primeng/dialog";
import { FileUploadModule } from "primeng/fileupload";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, ConfirmationService, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, MultiSelectModule, PaginatorModule } from "primeng/primeng";
import { RadioButtonModule } from "primeng/radiobutton";
import { TableModule } from "primeng/table";
import { environment } from "../../../../environments/environment";
import { AuthGuard } from "../../../_guards/auth.guards";
import { JwtInterceptor } from "../../../_interceptor/jwt.interceptor";
import { AuthenticationService } from "../../../_services/authentication.service";
import { cardService } from "../../../_services/cardSearch.service";
import { CommonsService } from "../../../_services/commons.service";
import { HeaderGestionEntidadService } from "../../../_services/headerGestionEntidad.service";
import { SigaServices } from "../../../_services/siga.service";
import { FechaModule } from "../../../commons/fecha/fecha.module";
import { ImagePipe } from "../../../commons/image-pipe/image.pipe";
import { PrecioModule } from "../../../commons/precio/precio.module";
import { TarjetaResumenFijaModule } from "../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module";
import { PipeTranslationModule } from "../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../commons/trim-pipe/trim-pipe.pipe";
import { BusquedaJusticiablesComponent } from "./busqueda-justiciables/busqueda-justiciables.component";
import { FiltroJusticiablesComponent } from "./busqueda-justiciables/filtro-justiciables/filtro-justiciables.component";
import { TablaJusticiablesComponent } from "./busqueda-justiciables/tabla-justiciables/tabla-justiciables.component";
import { AsuntosComponent } from "./gestion-justiciables/asuntos/asuntos.component";
import { DatosAbogadoContrarioComponent } from "./gestion-justiciables/datos-abogado-contrario/datos-abogado-contrario.component";
import { DatosGeneralesComponent } from "./gestion-justiciables/datos-generales/datos-generales.component";
import { DatosPersonalesComponent } from "./gestion-justiciables/datos-personales/datos-personales.component";
import { DatosProcuradorContrarioComponent } from "./gestion-justiciables/datos-procurador-contrario/datos-procurador-contrario.component";
import { DatosRepresentanteComponent } from "./gestion-justiciables/datos-representante/datos-representante.component";
import { DatosSolicitudComponent } from "./gestion-justiciables/datos-solicitud/datos-solicitud.component";
import { DatosUnidadFamiliarComponent } from "./gestion-justiciables/datos-unidad-familiar/datos-unidad-familiar.component";
import { GestionJusticiablesComponent } from "./gestion-justiciables/gestion-justiciables.component";
import { routingJusticiables } from "./justiciables-routing.module";

@NgModule({
  imports: [CommonModule, routingJusticiables, DataTableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, TableModule, MultiSelectModule, PrecioModule, FechaModule, FileUploadModule, ConfirmDialogModule, DialogModule, TarjetaResumenFijaModule, RadioButtonModule],
  declarations: [BusquedaJusticiablesComponent, FiltroJusticiablesComponent, TablaJusticiablesComponent, GestionJusticiablesComponent, DatosGeneralesComponent, DatosRepresentanteComponent, AsuntosComponent, DatosSolicitudComponent, DatosAbogadoContrarioComponent, DatosProcuradorContrarioComponent, DatosPersonalesComponent, DatosUnidadFamiliarComponent],
  providers: [
    // { provide: TranslationClass.TRANSLATIONS, useValue: TranslationClass.dictionary },
    ImagePipe,
    DatePipe,
    TrimPipePipe,
    UpperCasePipe,
    SigaServices,
    CommonsService,
    cardService,
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
  exports: [AsuntosComponent],
})
export class JusticiablesModule {}
