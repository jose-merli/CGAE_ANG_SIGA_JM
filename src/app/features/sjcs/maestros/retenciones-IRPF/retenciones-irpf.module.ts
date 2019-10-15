import { FiltrosRetencionesIrpfComponent } from './filtros-retenciones-irpf/filtros-retenciones-irpf.component';
import { TablaRetencionesIrpfComponent } from './tabla-retenciones-irpf/tabla-retenciones-irpf.component';
import { RetencionesIRPFComponent } from './retenciones-IRPF.component';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF } from '@angular/common';
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
import { PaginatorModule, ButtonModule, InputTextModule, DropdownModule, GrowlModule, MenubarModule, CheckboxModule } from '../../../../../../node_modules/primeng/primeng';
import { TableModule } from '../../../../../../node_modules/primeng/table';
import { FormsModule } from '../../../../../../node_modules/@angular/forms';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { FechaModule } from '../../../../commons/fecha/fecha.module';
import { PrecioModule } from '../../../../commons/precio/precio.module';

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
    PrecioModule,

  ],
  declarations: [FiltrosRetencionesIrpfComponent, TablaRetencionesIrpfComponent, RetencionesIRPFComponent],
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
export class RetencionesIrpfModule { }
