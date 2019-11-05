import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe, APP_BASE_HREF } from '@angular/common';
import { BusquedaFundamentosresolucionComponent } from './busqueda-fundamentosresolucion/busqueda-fundamentosresolucion.component';
import { FiltrosFundamentosresolucionComponent } from './busqueda-fundamentosresolucion/filtros-fundamentosresolucion/filtros-fundamentosresolucion.component';
import { TablaFundamentosresolucionComponent } from './busqueda-fundamentosresolucion/tabla-fundamentosresolucion/tabla-fundamentosresolucion.component';
import { TableModule } from '../../../../../../node_modules/primeng/table';
import { PaginatorModule, InputTextModule, ButtonModule, DropdownModule, GrowlModule, MenubarModule, CheckboxModule, ConfirmationService, ConfirmDialogModule } from '../../../../../../node_modules/primeng/primeng';
import { FormsModule } from '../../../../../../node_modules/@angular/forms';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { FechaModule } from '../../../../commons/fecha/fecha.module';
import { ImagePipe } from '../../../../commons/image-pipe/image.pipe';
import { TrimPipePipe } from '../../../../commons/trim-pipe/trim-pipe.pipe';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { cardService } from '../../../../_services/cardSearch.service';
import { HeaderGestionEntidadService } from '../../../../_services/headerGestionEntidad.service';
import { MessageService } from '../../../../../../node_modules/primeng/components/common/messageservice';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { AuthGuard } from '../../../../_guards/auth.guards';
import { environment } from '../../../../../environments/environment';
import { HTTP_INTERCEPTORS } from '../../../../../../node_modules/@angular/common/http';
import { JwtInterceptor } from '../../../../_interceptor/jwt.interceptor';
import { CookieService } from '../../../../../../node_modules/ngx-cookie-service';
import { GestionFundamentosresolucionComponent } from './busqueda-fundamentosresolucion/gestion-fundamentosresolucion/gestion-fundamentosresolucion.component';
import { DatosGeneralesFundamentosComponent } from './busqueda-fundamentosresolucion/gestion-fundamentosresolucion/datos-generales-fundamentos/datos-generales-fundamentos.component';
import { PipeNumberModule } from '../../../../commons/number-pipe/number-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    GrowlModule,
    PipeTranslationModule,
    MenubarModule,
    CheckboxModule,
    FechaModule,
    ConfirmDialogModule,
    PipeNumberModule
  ],
  declarations: [BusquedaFundamentosresolucionComponent, FiltrosFundamentosresolucionComponent, TablaFundamentosresolucionComponent, GestionFundamentosresolucionComponent, DatosGeneralesFundamentosComponent],
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
    PersistenceService,


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
export class FundamentosResolucionModule { }
