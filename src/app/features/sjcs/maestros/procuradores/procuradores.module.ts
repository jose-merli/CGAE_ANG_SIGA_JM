import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF } from '@angular/common';
import { BusquedaProcuradoresComponent } from './busqueda-procuradores/busqueda-procuradores.component';
import { FiltrosProcuradoresComponent } from './busqueda-procuradores/filtros-procuradores/filtros-procuradores.component';
import { TablaProcuradoresComponent } from './busqueda-procuradores/tabla-procuradores/tabla-procuradores.component';
import { GestionProcuradoresComponent } from './busqueda-procuradores/gestion-procuradores/gestion-procuradores.component';
import { TrimPipePipe } from '../../../../commons/trim-pipe/trim-pipe.pipe';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { cardService } from '../../../../_services/cardSearch.service';
import { MessageService } from '../../../../../../node_modules/primeng/components/common/messageservice';
import { HeaderGestionEntidadService } from '../../../../_services/headerGestionEntidad.service';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { ConfirmationService } from '../../../../../../node_modules/primeng/api';
import { PersistenceService } from '../../../../_services/persistence.service';
import { AuthGuard } from '../../../../_guards/auth.guards';
import { environment } from '../../../../../environments/environment';
import { HTTP_INTERCEPTORS } from '../../../../../../node_modules/@angular/common/http';
import { JwtInterceptor } from '../../../../_interceptor/jwt.interceptor';
import { CookieService } from '../../../../../../node_modules/ngx-cookie-service';
import { PaginatorModule, ButtonModule, InputTextModule, DropdownModule, GrowlModule, MenubarModule, CheckboxModule, ConfirmDialogModule } from '../../../../../../node_modules/primeng/primeng';
import { TableModule } from '../../../../../../node_modules/primeng/table';
import { FormsModule } from '../../../../../../node_modules/@angular/forms';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { FechaModule } from '../../../../commons/fecha/fecha.module';
import { DatosGeneralesProcuradoresComponent } from './busqueda-procuradores/gestion-procuradores/datos-generales-procuradores/datos-generales-procuradores.component';
import { DatosDireccionesProcuradoresComponent } from './busqueda-procuradores/gestion-procuradores/datos-direcciones-procuradores/datos-direcciones-procuradores.component';
import { TooltipModule } from 'primeng/tooltip';

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
    TooltipModule
  ],
  declarations: [BusquedaProcuradoresComponent, FiltrosProcuradoresComponent, TablaProcuradoresComponent, GestionProcuradoresComponent, DatosGeneralesProcuradoresComponent, DatosDireccionesProcuradoresComponent],

  providers: [
    DatePipe,
    TrimPipePipe,
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
export class ProcuradoresModule { }
