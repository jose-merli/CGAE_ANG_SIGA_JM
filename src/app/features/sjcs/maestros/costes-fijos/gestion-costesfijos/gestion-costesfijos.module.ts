import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { LOCALE_ID, NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "../../../../../../../node_modules/@angular/common/http";
import { FormsModule } from "../../../../../../../node_modules/@angular/forms";
import { CookieService } from "../../../../../../../node_modules/ngx-cookie-service";
import { MessageService } from "../../../../../../../node_modules/primeng/components/common/messageservice";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, ConfirmationService, DropdownModule, GrowlModule, InputTextModule, MenubarModule, MultiSelectModule, PaginatorModule } from "../../../../../../../node_modules/primeng/primeng";
import { TableModule } from "../../../../../../../node_modules/primeng/table";
import { environment } from "../../../../../../environments/environment";
import { AuthGuard } from "../../../../../_guards/auth.guards";
import { JwtInterceptor } from "../../../../../_interceptor/jwt.interceptor";
import { AuthenticationService } from "../../../../../_services/authentication.service";
import { CardService } from "../../../../../_services/cardSearch.service";
import { CommonsService } from "../../../../../_services/commons.service";
import { HeaderGestionEntidadService } from "../../../../../_services/headerGestionEntidad.service";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { ImagePipe } from "../../../../../commons/image-pipe/image.pipe";
import { PipeNumberModule } from "../../../../../commons/number-pipe/number-pipe.module";
import { PrecioModule } from "../../../../../commons/precio/precio.module";
import { PipeTranslationModule } from "../../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../../commons/trim-pipe/trim-pipe.pipe";
import { GestionCostesfijosComponent } from "./gestion-costesfijos.component";

@NgModule({
  imports: [CommonModule, TableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, MultiSelectModule, PrecioModule, ConfirmDialogModule, PipeNumberModule],
  declarations: [GestionCostesfijosComponent],
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
export class GestionCostesfijosModule {}
