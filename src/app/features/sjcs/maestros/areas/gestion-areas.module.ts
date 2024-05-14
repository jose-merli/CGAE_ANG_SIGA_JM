import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { LOCALE_ID, NgModule } from "@angular/core";
// import { ZonaComponent } from './ficha-grupo-zona/zona/zona.component';
// import { GrupoZonaComponent } from './ficha-grupo-zona/grupo-zona/grupo-zona.component';
// import { FichaGrupoZonaComponent } from './ficha-grupo-zona/ficha-grupo-zona.component';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
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
import { HeaderGestionEntidadService } from "../../../../_services/headerGestionEntidad.service";
import { SigaServices } from "../../../../_services/siga.service";
import { ImagePipe } from "../../../../commons/image-pipe/image.pipe";
import { PrecioModule } from "../../../../commons/precio/precio.module";
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";
import { BusquedaAreasComponent } from "./busqueda-areas.component";
import { GestionAreasComponent } from "./edicion-areas/gestion-areas.component";
import { EdicionAreasComponent } from "./edicion-areas/gestion-areas/edicion-areas.component";
import { TablaMateriasComponent } from "./edicion-areas/gestion-materias/tabla-materias.component";
import { FiltroBusquedaAreasComponent } from "./filtro-busqueda-areas/filtro-busqueda-areas.component";
import { TablaBusquedaAreasComponent } from "./tabla-busqueda-areas/tabla-busqueda-areas.component";

// import { FichaGrupoZonaModule } from './ficha-grupo-zona/ficha-grupo-zona.module';

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    PaginatorModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    FormsModule,
    GrowlModule,
    PipeTranslationModule,
    MenubarModule,
    TableModule,
    MultiSelectModule,
    PrecioModule,
    ConfirmDialogModule,

    // FichaGrupoZonaModule
  ],
  declarations: [
    TablaBusquedaAreasComponent,
    FiltroBusquedaAreasComponent,
    BusquedaAreasComponent,
    EdicionAreasComponent,
    TablaMateriasComponent,
    GestionAreasComponent,
    // TablaGestionZonasComponent
  ],
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
export class GestionAreasModule {}
