import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF, UpperCasePipe } from '@angular/common';
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
import { FiltrosdocumentacionejgComponent } from './filtro-busqueda-ejg/filtros-documentacionejg.component';
import { DocumentacionEJGComponent } from './documentacion-ejg.component';
// import { GestionModulosYBasesComponent } from './edicion-modulos/gestion-modulosybasesdecompensacion.component';
// import { MaestrosModulosComponent } from './busqueda-modulosybasesdecompensacion.component';
// import { EdicionModulosComponent } from './edicion-modulos/gestion-modulos/edicion-modulos.component';
// import { TablaAcreditacionesComponent } from './edicion-modulos/tabla-acreditaciones/tabla-acreditaciones.component';
import { FechaModule } from '../../../../commons/fecha/fecha.module';

// import { TablaMateriasComponent } from "./edicion-areas/gestion-materias/tabla-materias.component";
import { MultiSelectModule } from "primeng/multiselect";
import { PartidasComponent } from '../partidas/partidas.component';
import { TablaDocumentacionejgComponent } from './tabla-documentacionejg/tabla-documentacionejg.component';
import { GestionDocumentacionejgComponent } from './gestion-documentacionejg/gestion-documentacionejg.component';
import { GestionTipodocumentoComponent } from './gestion-documentacionejg/gestion-tipodocumento/gestion-tipodocumento.component';
import { GestionDocumentosComponent } from './gestion-documentacionejg/gestion-documentos/gestion-documentos.component';

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
    FechaModule,
    ConfirmDialogModule,
    // FichaGrupoZonaModule

  ],
  declarations: [
    FiltrosdocumentacionejgComponent,
    DocumentacionEJGComponent,
    TablaDocumentacionejgComponent,
    GestionDocumentacionejgComponent,
    GestionTipodocumentoComponent,
    GestionDocumentosComponent,
    // MaestrosModulosComponent,
    // TablaModulosComponent,
    // GestionModulosYBasesComponent, 
    // EdicionModulosComponent,
    // TablaAcreditacionesComponent
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
export class GestionDocumentacionEJGModule { }
