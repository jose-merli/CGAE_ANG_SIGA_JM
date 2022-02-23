import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe, APP_BASE_HREF } from '@angular/common';
import { BusquedaJuzgadosComponent } from './busqueda-juzgados.component';
import { TablaJuzgadosComponent } from './tabla-juzgados/tabla-juzgados.component';
import { FiltroJuzgadosComponent } from './filtro-juzgados/filtro-juzgados.component';
import { TableModule } from '../../../../../../node_modules/primeng/table';
import { DataTableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, MenubarModule, GrowlModule, ConfirmationService, ConfirmDialogModule } from '../../../../../../node_modules/primeng/primeng';
import { FormsModule } from '../../../../../../node_modules/@angular/forms';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { ImagePipe } from '../../../../commons/image-pipe/image.pipe';
import { TrimPipePipe } from '../../../../commons/trim-pipe/trim-pipe.pipe';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
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
import { CheckboxModule } from 'primeng/checkbox';
import { GestionJuzgadosComponent } from './gestion-juzgados/gestion-juzgados.component';
import { DatosGeneralesJuzgadoComponent } from './gestion-juzgados/datos-generales-juzgado/datos-generales-juzgado.component';
import { ProcedimientosJuzgadoComponent } from './gestion-juzgados/procedimientos-juzgado/procedimientos-juzgado.component';
import { FechaModule } from '../../../../commons/fecha/fecha.module';
import { PipeNumberModule } from '../../../../commons/number-pipe/number-pipe.module';
import { DireccionJuzComponent } from './gestion-juzgados/direccion-juzgado/direccion-juz.component';

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
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
  declarations: [
    BusquedaJuzgadosComponent,
    TablaJuzgadosComponent,
    FiltroJuzgadosComponent,
    GestionJuzgadosComponent,
    DatosGeneralesJuzgadoComponent,
    ProcedimientosJuzgadoComponent,
    DireccionJuzComponent
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
export class JuzgadosModule { }
