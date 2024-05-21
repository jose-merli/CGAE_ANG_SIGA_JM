import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/components/common/messageservice";
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, ConfirmationService, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule } from "primeng/primeng";
import { TableModule } from "primeng/table";
import { environment } from "../../../../../environments/environment";
import { AuthGuard } from "../../../../_guards/auth.guards";
import { JwtInterceptor } from "../../../../_interceptor/jwt.interceptor";
import { AuthenticationService } from "../../../../_services/authentication.service";
import { CardService } from "../../../../_services/cardSearch.service";
import { CommonsService } from "../../../../_services/commons.service";
import { PersistenceService } from "../../../../_services/persistence.service";
import { SigaServices } from "../../../../_services/siga.service";
import { ImagePipe } from "../../../../commons/image-pipe/image.pipe";
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";
import { FichaGrupoZonaComponent } from "./ficha-grupo-zona/ficha-grupo-zona.component";
import { GrupoZonaComponent } from "./ficha-grupo-zona/grupo-zona/grupo-zona.component";
import { ZonaComponent } from "./ficha-grupo-zona/zona/zona.component";
import { FiltroGestionZonasComponent } from "./filtro-gestion-zonas/filtro-gestion-zonas.component";
import { GestionZonasComponent } from "./gestion-zonas.component";
import { TablaGestionZonasComponent } from "./tabla-gestion-zonas/tabla-gestion-zonas.component";

@NgModule({
  imports: [CommonModule, TableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, MultiSelectModule, ConfirmDialogModule],
  declarations: [GestionZonasComponent, FiltroGestionZonasComponent, TablaGestionZonasComponent, FichaGrupoZonaComponent, GrupoZonaComponent, ZonaComponent],
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
    { provide: LOCALE_ID, useValue: "es-ES" },
  ],
})
export class GestionZonasModule {}
