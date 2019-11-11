import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF, UpperCasePipe } from '@angular/common';
import { DataTableModule, PaginatorModule, InputTextModule, CheckboxModule, DropdownModule, ButtonModule, GrowlModule, ConfirmationService, MenubarModule, ConfirmDialogModule, MultiSelectModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { PipeTranslationModule } from '../../../commons/translate/pipe-translation.module';
import { TableModule } from '../../../../../node_modules/primeng/table';
import { FechaModule } from '../../../commons/fecha/fecha.module';
import { ImagePipe } from '../../../commons/image-pipe/image.pipe';
import { TrimPipePipe } from '../../../commons/trim-pipe/trim-pipe.pipe';
import { SigaServices } from '../../../_services/siga.service';
import { CommonsService } from '../../../_services/commons.service';
import { cardService } from '../../../_services/cardSearch.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { MessageService } from '../../../../../node_modules/primeng/components/common/messageservice';
import { HeaderGestionEntidadService } from '../../../_services/headerGestionEntidad.service';
import { AuthGuard } from '../../../_guards/auth.guards';
import { environment } from '../../../../environments/environment';
import { HTTP_INTERCEPTORS } from '../../../../../node_modules/@angular/common/http';
import { JwtInterceptor } from '../../../_interceptor/jwt.interceptor';
import { CookieService } from '../../../../../node_modules/ngx-cookie-service';
import { FiltrosEjgComponent } from './filtros-busqueda-ejg/filtros-ejg.component';
import { TablaEjgComponent } from './tabla-ejg/tabla-ejg.component';
import { EJGComponent } from './ejg.component';

// import { GestionModulosYBasesComponent } from './edicion-modulos/gestion-modulosybasesdecompensacion.component';
// import { MaestrosModulosComponent } from './busqueda-modulosybasesdecompensacion.component';
// import { EdicionModulosComponent } from './edicion-modulos/gestion-modulos/edicion-modulos.component';
// import { TablaAcreditacionesComponent } from './edicion-modulos/tabla-acreditaciones/tabla-acreditaciones.component';



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
    FiltrosEjgComponent,
    TablaEjgComponent,
    EJGComponent


  ],
  providers: [
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
export class EJGModule { }
