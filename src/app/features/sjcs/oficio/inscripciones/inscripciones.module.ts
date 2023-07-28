import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF, UpperCasePipe } from '@angular/common';
import { DataTableModule, PaginatorModule, InputTextModule, CheckboxModule, DropdownModule, ButtonModule, GrowlModule, ConfirmationService, MenubarModule, PickListModule, TooltipModule, ConfirmDialogModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { ImagePipe } from '../../../../commons/image-pipe/image.pipe';
import { TrimPipePipe } from '../../../../commons/trim-pipe/trim-pipe.pipe';
import { SigaServices } from '../../../../_services/siga.service';
import { cardService } from '../../../../_services/cardSearch.service';
import { CommonsService } from '../../../../_services/commons.service';
import { HeaderGestionEntidadService } from '../../../../_services/headerGestionEntidad.service';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { AuthGuard } from '../../../../_guards/auth.guards';
import { environment } from '../../../../../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../../../../_interceptor/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { TableModule } from 'primeng/table';

import { MultiSelectModule } from "primeng/multiselect";
import { PrecioModule } from '../../../../commons/precio/precio.module';
import { TarjetaResumenFijaModule } from '../../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module';
import { FechaComponent } from '../../../../commons/fecha/fecha.component';
import { FechaModule } from '../../../../commons/fecha/fecha.module';
import { routingOficio } from '../oficio-routing.module';
import { InscripcionesComponent } from './busqueda-inscripciones.component';
import { TablaInscripcionesComponent } from './gestion-inscripciones/gestion-inscripciones.component';
import { FiltrosInscripciones } from './filtros-inscripciones/filtros-inscripciones.component';
import { BusquedaColegiadoExpressModule } from '../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.module';
import { FichaInscripcionesComponent } from './ficha-inscripciones/ficha-inscripciones.component';
import { TarjetaLetradoComponent } from './ficha-inscripciones/tarjeta-letrado/tarjeta-letrado.component';
import { TarjetaInscripcion } from './ficha-inscripciones/tarjeta-inscripciones/tarjeta-inscripcion.component';
import {TreeTableModule} from 'primeng/treetable';
import {TreeNode} from 'primeng/api';
import { TarjetaColaFijaComponent } from './ficha-inscripciones/tarjeta-cola-fija/tarjeta-cola-fija.component';
import { TarjetaGestionInscripcion } from './ficha-inscripciones/tarjeta-gestion-inscripciones/tarjeta-gestion-inscripcion.component';
import { RadioButtonModule } from 'primeng/primeng';
@NgModule({
  imports: [
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
    PrecioModule,
    PickListModule,
    TooltipModule,
    TarjetaResumenFijaModule,
    ConfirmDialogModule,
    FechaModule,
    BusquedaColegiadoExpressModule,
    TreeTableModule,
    RadioButtonModule,
  ],
  declarations: [
    InscripcionesComponent,
    TablaInscripcionesComponent,
    FiltrosInscripciones,
    FichaInscripcionesComponent,
    TarjetaLetradoComponent,
    TarjetaInscripcion,
    TarjetaColaFijaComponent,
    TarjetaGestionInscripcion
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
export class GestionInscripcionesModule { }
