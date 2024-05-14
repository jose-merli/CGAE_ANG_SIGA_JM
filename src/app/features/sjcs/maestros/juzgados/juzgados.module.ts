import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { LOCALE_ID, NgModule } from "@angular/core";
import { CheckboxModule } from "primeng/checkbox";
import { HTTP_INTERCEPTORS } from "../../../../../../node_modules/@angular/common/http";
import { FormsModule } from "../../../../../../node_modules/@angular/forms";
import { CookieService } from "../../../../../../node_modules/ngx-cookie-service";
import { MessageService } from "../../../../../../node_modules/primeng/components/common/messageservice";
import { ButtonModule, ConfirmDialogModule, ConfirmationService, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule } from "../../../../../../node_modules/primeng/primeng";
import { TableModule } from "../../../../../../node_modules/primeng/table";
import { environment } from "../../../../../environments/environment";
import { AuthGuard } from "../../../../_guards/auth.guards";
import { JwtInterceptor } from "../../../../_interceptor/jwt.interceptor";
import { AuthenticationService } from "../../../../_services/authentication.service";
import { CardService } from "../../../../_services/cardSearch.service";
import { CommonsService } from "../../../../_services/commons.service";
import { HeaderGestionEntidadService } from "../../../../_services/headerGestionEntidad.service";
import { PersistenceService } from "../../../../_services/persistence.service";
import { SigaServices } from "../../../../_services/siga.service";
import { FechaModule } from "../../../../commons/fecha/fecha.module";
import { ImagePipe } from "../../../../commons/image-pipe/image.pipe";
import { PipeNumberModule } from "../../../../commons/number-pipe/number-pipe.module";
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";
import { BusquedaJuzgadosComponent } from "./busqueda-juzgados.component";
import { FiltroJuzgadosComponent } from "./filtro-juzgados/filtro-juzgados.component";
import { DatosGeneralesJuzgadoComponent } from "./gestion-juzgados/datos-generales-juzgado/datos-generales-juzgado.component";
import { DireccionJuzComponent } from "./gestion-juzgados/direccion-juzgado/direccion-juz.component";
import { GestionJuzgadosComponent } from "./gestion-juzgados/gestion-juzgados.component";
import { ProcedimientosJuzgadoComponent } from "./gestion-juzgados/procedimientos-juzgado/procedimientos-juzgado.component";
import { TablaJuzgadosComponent } from "./tabla-juzgados/tabla-juzgados.component";

@NgModule({
  imports: [CommonModule, DataTableModule, TableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, CheckboxModule, FechaModule, ConfirmDialogModule, PipeNumberModule],
  declarations: [BusquedaJuzgadosComponent, TablaJuzgadosComponent, FiltroJuzgadosComponent, GestionJuzgadosComponent, DatosGeneralesJuzgadoComponent, ProcedimientosJuzgadoComponent, DireccionJuzComponent],
  providers: [
    // { provide: TranslationClass.TRANSLATIONS, useValue: TranslationClass.dictionary },
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
export class JuzgadosModule {}
