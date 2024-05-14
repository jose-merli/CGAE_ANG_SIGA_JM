import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { MessageService } from "primeng/components/common/messageservice";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, ConfirmationService, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule, PickListModule, TooltipModule } from "primeng/primeng";
import { TableModule } from "primeng/table";
import { environment } from "../../../../../environments/environment";
import { AuthGuard } from "../../../../_guards/auth.guards";
import { JwtInterceptor } from "../../../../_interceptor/jwt.interceptor";
import { AuthenticationService } from "../../../../_services/authentication.service";
import { CardService } from "../../../../_services/cardSearch.service";
import { CommonsService } from "../../../../_services/commons.service";
import { HeaderGestionEntidadService } from "../../../../_services/headerGestionEntidad.service";
import { SigaServices } from "../../../../_services/siga.service";
import { ImagePipe } from "../../../../commons/image-pipe/image.pipe";
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";

import { MultiSelectModule } from "primeng/multiselect";
import { TreeTableModule } from "primeng/treetable";
import { FechaModule } from "../../../../commons/fecha/fecha.module";
import { PrecioModule } from "../../../../commons/precio/precio.module";
import { TarjetaResumenFijaModule } from "../../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module";

@NgModule({
  imports: [CommonModule, DataTableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, TableModule, MultiSelectModule, PrecioModule, PickListModule, TooltipModule, TarjetaResumenFijaModule, ConfirmDialogModule, FechaModule, TreeTableModule],
  declarations: [],
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
export class GestionCargasMasivasGuardiaModule {}
