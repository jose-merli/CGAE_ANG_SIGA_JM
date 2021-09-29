import { APP_BASE_HREF, CommonModule, DatePipe } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { routingOficio } from '../oficio-routing.module';
import { SaltosCompensacionesOficioComponent } from './saltos-compensaciones-oficio.component';
import { FiltrosSaltosCompensacionesOficioComponent } from './filtros-saltos-compensaciones-oficio/filtros-saltos-compensaciones-oficio.component';
import { TablaResultadoMixSaltosCompOficioComponent } from './tabla-resultado-mix-saltos-comp-oficio/tabla-resultado-mix-saltos-comp-oficio.component';
import { ButtonModule, CheckboxModule, ConfirmationService, ConfirmDialogModule, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, MultiSelectModule, PaginatorModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { TableModule } from 'primeng/table';
import { FechaModule } from '../../../../commons/fecha/fecha.module';
import { BusquedaColegiadoExpressModule } from '../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.module';
import { MatSortModule } from '@angular/material';
import { Paginador2Module } from '../bajas-temporales/paginador2/paginador2.module';
import { AuthGuard } from '../../../../_guards/auth.guards';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../../../../_interceptor/jwt.interceptor';
import { environment } from '../../../../../environments/environment';
import { TablaResultadoMixSaltosCompOficioService } from './tabla-resultado-mix-saltos-comp-oficio/tabla-resultado-mix-saltos-comp-oficio.service';

@NgModule({
  imports: [
    CommonModule,
    routingOficio,
    CommonModule,
    routingOficio,
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
    ConfirmDialogModule,
    FechaModule,
    BusquedaColegiadoExpressModule,
    Paginador2Module,
    MatSortModule
  ],
  declarations: [
    SaltosCompensacionesOficioComponent,
    FiltrosSaltosCompensacionesOficioComponent,
    TablaResultadoMixSaltosCompOficioComponent,
  ],
  providers: [
    TablaResultadoMixSaltosCompOficioService,
    DatePipe,
    SigaServices,
    CommonsService,
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
export class SaltosCompensacionesOficioModule { }
