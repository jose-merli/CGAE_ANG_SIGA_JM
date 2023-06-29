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
import { TurnosComponent } from './busqueda-turnos.component';
import { FiltrosTurnos } from './filtros-turnos/filtros-turnos.component';
import { TablaTurnosComponent } from './gestion-turnos/gestion-turnos.component';
import { FichaTurnosComponent } from './ficha-turnos/ficha-turnos.component';
import { DatosGeneralesTurnosComponent } from './ficha-turnos/datos-generales-consulta/datos-generales-consulta.component';
import { ConfiguracionTurnosComponent } from './ficha-turnos/configuracion-turnos/configuracion-turnos.component';
import { ConfiguracionColaOficioComponent } from './ficha-turnos/configuracion-colaoficio/configuracion-colaoficio.component';
import { TarjetaColaOficio } from './ficha-turnos/tarjeta-colaoficio/tarjeta-colaoficio.component';
import { TarjetaResumenFijaModule } from '../../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module';
import { FechaComponent } from '../../../../commons/fecha/fecha.component';
import { FechaModule } from '../../../../commons/fecha/fecha.module';
import { TarjetaColaGuardias } from './ficha-turnos/tarjeta-colaguardias/tarjeta-colaguardias.component';
import { TarjetaGuardias } from './ficha-turnos/tarjeta-guardias/tarjeta-guardias.component';
import { routingOficio } from '../oficio-routing.module';
import { TarjetaInscripciones } from './ficha-turnos/tarjeta-inscripciones/tarjeta-inscripciones.component';
import {DialogModule} from 'primeng/dialog';
@NgModule({
  imports: [
    DialogModule,
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
    FechaModule

  ],
  declarations: [
    TurnosComponent,
    FiltrosTurnos,
    TablaTurnosComponent,
    FichaTurnosComponent,
    DatosGeneralesTurnosComponent,
    ConfiguracionTurnosComponent,
    ConfiguracionColaOficioComponent,
    TarjetaColaOficio,
    TarjetaColaGuardias,
    TarjetaGuardias,
    TarjetaInscripciones
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
export class GestionTurnosModule { }
