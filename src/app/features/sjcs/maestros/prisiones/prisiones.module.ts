import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF } from '@angular/common';
import { BusquedaPrisionesComponent } from './busqueda-prisiones/busqueda-prisiones.component';
import { FiltroPrisionesComponent } from './busqueda-prisiones/filtro-prisiones/filtro-prisiones.component';
import { TablaPrisionesComponent } from './busqueda-prisiones/tabla-prisiones/tabla-prisiones.component';
import { TableModule } from '../../../../../../node_modules/primeng/table';
import { PaginatorModule, InputTextModule, ButtonModule, DropdownModule, GrowlModule, MenubarModule, CheckboxModule, ConfirmationService, ConfirmDialogModule, TooltipModule } from '../../../../../../node_modules/primeng/primeng';
import { FormsModule } from '../../../../../../node_modules/@angular/forms';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { FechaModule } from '../../../../commons/fecha/fecha.module';
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
import { GestionPrisionesComponent } from './gestion-prisiones/gestion-prisiones.component';
import { DatosGeneralesPrisionComponent } from './gestion-prisiones/datos-generales-prision/datos-generales-prision.component';


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
  declarations: [
    BusquedaPrisionesComponent,
    FiltroPrisionesComponent,
    TablaPrisionesComponent,
    GestionPrisionesComponent,
    DatosGeneralesPrisionComponent
  ],
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
export class PrisionesModule { }
