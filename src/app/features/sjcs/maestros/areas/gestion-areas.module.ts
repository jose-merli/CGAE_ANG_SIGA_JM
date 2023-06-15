import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF, UpperCasePipe } from '@angular/common';
// import { ZonaComponent } from './ficha-grupo-zona/zona/zona.component';
// import { GrupoZonaComponent } from './ficha-grupo-zona/grupo-zona/grupo-zona.component';
// import { FichaGrupoZonaComponent } from './ficha-grupo-zona/ficha-grupo-zona.component';
import { TablaBusquedaAreasComponent } from './tabla-busqueda-areas/tabla-busqueda-areas.component';
import { FiltroBusquedaAreasComponent } from './filtro-busqueda-areas/filtro-busqueda-areas.component';
import { BusquedaAreasComponent } from './busqueda-areas.component';
import { DataTableModule, PaginatorModule, InputTextModule, CheckboxModule, DropdownModule, ButtonModule, GrowlModule, ConfirmationService, MenubarModule, ConfirmDialogModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { ImagePipe } from '../../../../commons/image-pipe/image.pipe';
import { TrimPipePipe } from '../../../../commons/trim-pipe/trim-pipe.pipe';
import { SigaServices } from '../../../../_services/siga.service';
import { cardService } from '../../../../_services/cardSearch.service';
import { CommonsService } from '../../../../_services/commons.service';
import { HeaderGestionEntidadService } from '../../../../_services/headerGestionEntidad.service';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { AuthGuard } from '../../../../_guards/auth.guards';
import { environment } from '../../../../../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../../../../_interceptor/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { TableModule } from 'primeng/table';
import { EdicionAreasComponent } from './edicion-areas/gestion-areas/edicion-areas.component';
import { TablaMateriasComponent } from "./edicion-areas/gestion-materias/tabla-materias.component";
import { GestionAreasComponent } from './edicion-areas/gestion-areas.component';
import { MultiSelectModule } from "primeng/multiselect";
import { PrecioModule } from '../../../../commons/precio/precio.module';

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
    ConfirmDialogModule

    // FichaGrupoZonaModule

  ],
  declarations: [
    TablaBusquedaAreasComponent,
    FiltroBusquedaAreasComponent,
    BusquedaAreasComponent,
    EdicionAreasComponent,
    TablaMateriasComponent,
    GestionAreasComponent
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
    cardService,
    HeaderGestionEntidadService,
    MessageService,
    AuthenticationService,
    ConfirmationService,

    AuthGuard,
    {
      provide: APP_BASE_HREF,
      useValue: environment.baseHref
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    CookieService,
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ]
})
export class GestionAreasModule { }
