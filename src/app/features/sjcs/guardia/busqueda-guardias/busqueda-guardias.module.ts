import { APP_BASE_HREF, CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule, CheckboxModule, ConfirmationService, ConfirmDialogModule, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule, PickListModule, TreeTableModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { HTTP_INTERCEPTORS } from '../../../../../../node_modules/@angular/common/http';
import { CookieService } from '../../../../../../node_modules/ngx-cookie-service';
import { MessageService } from '../../../../../../node_modules/primeng/components/common/messageservice';
import { environment } from '../../../../../environments/environment';
import { FechaModule } from '../../../../commons/fecha/fecha.module';
import { ImagePipe } from '../../../../commons/image-pipe/image.pipe';
import { PrecioModule } from '../../../../commons/precio/precio.module';
import { TablaDinamicaColaGuardiaModule } from '../../../../commons/tabla-dinamica-cola-guardia/tabla-dinamica-cola-guardia.module';
import { TablaDinamicaModule } from '../../../../commons/tabla-dinamica/tabla-dinamica.module';
import { TarjetaResumenFijaModule } from '../../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { TrimPipePipe } from '../../../../commons/trim-pipe/trim-pipe.pipe';
import { AuthGuard } from '../../../../_guards/auth.guards';
import { JwtInterceptor } from '../../../../_interceptor/jwt.interceptor';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { CommonsService } from '../../../../_services/commons.service';
import { HeaderGestionEntidadService } from '../../../../_services/headerGestionEntidad.service';
import { SigaServices } from '../../../../_services/siga.service';
import { BuscadorGuardiaComponent } from './buscador-guardia/buscador-guardia.component';
import { FiltrosGuardiaComponent } from './buscador-guardia/filtros-guardia/filtros-guardia.component';
import { CalendariosComponent } from './buscador-guardia/gestion-guardia/calendarios/calendarios.component';
import { DatosBaremosComponent } from './buscador-guardia/gestion-guardia/datos-baremos/datos-baremos.component';
import { DatosCalendariosGuardiasComponent } from './buscador-guardia/gestion-guardia/datos-calendarios-guardias/datos-calendarios-guardias.component';
import { DatosColaGuardiaComponent } from './buscador-guardia/gestion-guardia/datos-cola-guardia/datos-cola-guardia.component';
import { DatosConfColaComponent } from './buscador-guardia/gestion-guardia/datos-conf-cola/datos-conf-cola.component';
import { DatosGeneralesGuardiasComponent } from './buscador-guardia/gestion-guardia/datos-generales-guardias/datos-generales-guardias.component';
import { DatosIncompatibilidadesComponent } from './buscador-guardia/gestion-guardia/datos-incompatibilidades/datos-incompatibilidades.component';
import { GestionGuardiaComponent } from './buscador-guardia/gestion-guardia/gestion-guardia.component';
import { TablaGuardiasComponent } from './buscador-guardia/tabla-guardias/tabla-guardias.component';
import { DatosIncripcionesGuardiasComponent } from './buscador-guardia/gestion-guardia/datos-incripciones-guardias/datos-incripciones-guardias.component';
import { DatosTurnoGuardiasComponent } from './buscador-guardia/gestion-guardia/datos-turno-guardias/datos-turno-guardias.component';
import { TablaResultadoOrderModule } from '../../../../commons/tabla-resultado-order/tabla-resultado-order.module';

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
    TreeTableModule,
    MultiSelectModule,
    PrecioModule,
    TarjetaResumenFijaModule,
    TablaDinamicaModule,
    PickListModule,
    TablaDinamicaColaGuardiaModule,
    ConfirmDialogModule,
    FechaModule,
    TablaResultadoOrderModule


  ],
  declarations: [BuscadorGuardiaComponent, FiltrosGuardiaComponent, TablaGuardiasComponent, GestionGuardiaComponent, DatosGeneralesGuardiasComponent, DatosCalendariosGuardiasComponent, DatosBaremosComponent, DatosConfColaComponent, DatosColaGuardiaComponent, DatosIncompatibilidadesComponent, CalendariosComponent, DatosIncripcionesGuardiasComponent, DatosTurnoGuardiasComponent],
  providers: [
    // { provide: TranslationClass.TRANSLATIONS, useValue: TranslationClass.dictionary },
    ImagePipe,
    DatePipe,
    TrimPipePipe,
    UpperCasePipe,
    SigaServices,
    CommonsService,
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
  ], schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class BusquedaGuardiasModule { }
