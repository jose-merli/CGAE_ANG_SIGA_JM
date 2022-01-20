import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF } from '@angular/common';

import { routingSjcs } from './sjcs-routing.module';
import { MaestrosModule } from './maestros/maestros.module';
import { TranslateService } from '../../commons/translate';
import { ImagePipe } from '../../commons/image-pipe/image.pipe';
import { TrimPipePipe } from '../../commons/trim-pipe/trim-pipe.pipe';
import { SigaServices } from '../../_services/siga.service';
import { CommonsService } from '../../_services/commons.service';
import { cardService } from '../../_services/cardSearch.service';
import { HeaderGestionEntidadService } from '../../_services/headerGestionEntidad.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { AuthenticationService } from '../../_services/authentication.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { AuthGuard } from '../../_guards/auth.guards';
import { environment } from '../../../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../../_interceptor/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { TranslatePipe } from '../../commons/translate';
import { PipeTranslationModule } from '../../commons/translate/pipe-translation.module';
import { JusticiablesModule } from './justiciables/justiciables.module';
import { FacturacionSJCSModule } from './facturacionSJCS/facturacionsjcs.module';
import { OficioModule } from './oficio/oficio.module';
import { EJGModule } from './ejg/ejg.module';
import { ConfirmDialogModule, DropdownModule, GrowlModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from "primeng/checkbox";
import { GuardiaModule } from './guardia/guardia.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaestrosModule,
    OficioModule,
    JusticiablesModule,
    GuardiaModule,
    ConfirmDialogModule,
    TableModule,
    GrowlModule,
    CheckboxModule,
    DropdownModule,
    routingSjcs,
    FacturacionSJCSModule,
    EJGModule,
    routingSjcs
  ],
  providers: []
})
export class SjcsModule { }
