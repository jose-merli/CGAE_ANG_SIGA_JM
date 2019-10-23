import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe, APP_BASE_HREF } from '@angular/common';
import { BusquedaJusticiablesComponent } from './busqueda-justiciables/busqueda-justiciables.component';
import { FiltroJusticiablesComponent } from './busqueda-justiciables/filtro-justiciables/filtro-justiciables.component';
import { GestionJusticiablesComponent } from './gestion-justiciables/gestion-justiciables.component';
import { DatosGeneralesComponent } from './gestion-justiciables/datos-generales/datos-generales.component';
import { TablaJusticiablesComponent } from './busqueda-justiciables/tabla-justiciables/tabla-justiciables.component';
import { DataTableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, GrowlModule, MenubarModule, MultiSelectModule, ConfirmationService } from '../../../../../node_modules/primeng/primeng';
import { FormsModule } from '../../../../../node_modules/@angular/forms';
import { PipeTranslationModule } from '../../../commons/translate/pipe-translation.module';
import { TableModule } from '../../../../../node_modules/primeng/table';
import { PrecioModule } from '../../../commons/precio/precio.module';
import { ImagePipe } from '../../../commons/image-pipe/image.pipe';
import { TrimPipePipe } from '../../../commons/trim-pipe/trim-pipe.pipe';
import { SigaServices } from '../../../_services/siga.service';
import { CommonsService } from '../../../_services/commons.service';
import { cardService } from '../../../_services/cardSearch.service';
import { HeaderGestionEntidadService } from '../../../_services/headerGestionEntidad.service';
import { MessageService } from '../../../../../node_modules/primeng/components/common/messageservice';
import { AuthenticationService } from '../../../_services/authentication.service';
import { AuthGuard } from '../../../_guards/auth.guards';
import { environment } from '../../../../environments/environment';
import { HTTP_INTERCEPTORS } from '../../../../../node_modules/@angular/common/http';
import { JwtInterceptor } from '../../../_interceptor/jwt.interceptor';
import { CookieService } from '../../../../../node_modules/ngx-cookie-service';
import { FechaModule } from '../../../commons/fecha/fecha.module';

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
    FechaModule,

  ],
  declarations: [
    BusquedaJusticiablesComponent,
    FiltroJusticiablesComponent,
    TablaJusticiablesComponent,
    GestionJusticiablesComponent,
    DatosGeneralesComponent
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
export class JusticiablesModule { }
