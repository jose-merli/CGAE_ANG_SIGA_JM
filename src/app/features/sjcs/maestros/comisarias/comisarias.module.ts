import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF } from '@angular/common';
import { FiltroComisariasComponent } from './comisarias/filtro-comisarias/filtro-comisarias.component';
import { TablaComisariasComponent } from './comisarias/tabla-comisarias/tabla-comisarias.component';
import { ComisariasComponent } from './comisarias/comisarias.component';
import { TableModule } from '../../../../../../node_modules/primeng/table';
import { PaginatorModule, InputTextModule, DropdownModule, ButtonModule, GrowlModule, MenubarModule, CheckboxModule, ConfirmationService, ConfirmDialogModule, TooltipModule } from '../../../../../../node_modules/primeng/primeng';
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
import { GestionComisariasComponent } from './comisarias/gestion-comisarias/gestion-comisarias.component';
import { DatosGeneralesComisariaComponent } from './comisarias/gestion-comisarias/datos-generales-comisaria/datos-generales-comisaria.component';


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
    ComisariasComponent,
    FiltroComisariasComponent,
    TablaComisariasComponent,
    GestionComisariasComponent,
    DatosGeneralesComisariaComponent
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
export class ComisariasModule { }
