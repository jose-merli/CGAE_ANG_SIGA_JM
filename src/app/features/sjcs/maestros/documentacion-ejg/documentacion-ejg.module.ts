import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/components/common/messageservice";
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, ConfirmationService, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule } from "primeng/primeng";
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
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";
import { DocumentacionEJGComponent } from "./documentacion-ejg.component";
import { FiltrosdocumentacionejgComponent } from "./filtro-busqueda-ejg/filtros-documentacionejg.component";
import { GestionDocumentacionejgComponent } from "./gestion-documentacionejg/gestion-documentacionejg.component";
import { GestionDocumentosComponent } from "./gestion-documentacionejg/gestion-documentos/gestion-documentos.component";
import { GestionTipodocumentoComponent } from "./gestion-documentacionejg/gestion-tipodocumento/gestion-tipodocumento.component";
import { TablaDocumentacionejgComponent } from "./tabla-documentacionejg/tabla-documentacionejg.component";

@NgModule({
  imports: [CommonModule, DataTableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, FormsModule, GrowlModule, PipeTranslationModule, MenubarModule, TableModule, MultiSelectModule, FechaModule, ConfirmDialogModule],
  declarations: [FiltrosdocumentacionejgComponent, DocumentacionEJGComponent, TablaDocumentacionejgComponent, GestionDocumentacionejgComponent, GestionTipodocumentoComponent, GestionDocumentosComponent],
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
export class GestionDocumentacionEJGModule {}
