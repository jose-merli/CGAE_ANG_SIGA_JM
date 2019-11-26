import { CommonModule, DatePipe, UpperCasePipe, APP_BASE_HREF } from '@angular/common';
import { BuscadorGuardiaComponent } from './buscador-guardia/buscador-guardia.component';
import { FiltrosGuardiaComponent } from './buscador-guardia/filtros-guardia/filtros-guardia.component';
import { TablaGuardiasComponent } from './buscador-guardia/tabla-guardias/tabla-guardias.component';
import { NgModule, LOCALE_ID } from '@angular/core';
import { DataTableModule, PaginatorModule, InputTextModule, CheckboxModule, DropdownModule, ButtonModule, GrowlModule, ConfirmationService, MenubarModule, TreeTable, TreeTableModule, PickList, PickListModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { TableModule, RowToggler } from 'primeng/table';
import { MultiSelectModule } from "primeng/multiselect";
import { PrecioModule } from '../../../../commons/precio/precio.module';
import { ImagePipe } from '../../../../commons/image-pipe/image.pipe';
import { TrimPipePipe } from '../../../../commons/trim-pipe/trim-pipe.pipe';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { MessageService } from '../../../../../../node_modules/primeng/components/common/messageservice';
import { HeaderGestionEntidadService } from '../../../../_services/headerGestionEntidad.service';
import { AuthGuard } from '../../../../_guards/auth.guards';
import { environment } from '../../../../../environments/environment';
import { HTTP_INTERCEPTORS } from '../../../../../../node_modules/@angular/common/http';
import { JwtInterceptor } from '../../../../_interceptor/jwt.interceptor';
import { CookieService } from '../../../../../../node_modules/ngx-cookie-service';
import { GestionGuardiaComponent } from './buscador-guardia/gestion-guardia/gestion-guardia.component';
import { DatosGeneralesGuardiasComponent } from './buscador-guardia/gestion-guardia/datos-generales-guardias/datos-generales-guardias.component';
import { TarjetaResumenFijaModule } from '../../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module';
import { TablaDinamicaModule } from '../../../../commons/tabla-dinamica/tabla-dinamica.module';
import { DatosCalendariosGuardiasComponent } from './buscador-guardia/gestion-guardia/datos-calendarios-guardias/datos-calendarios-guardias.component';
import { DatosBaremosComponent } from './buscador-guardia/gestion-guardia/datos-baremos/datos-baremos.component';
import { DatosConfColaComponent } from './buscador-guardia/gestion-guardia/datos-conf-cola/datos-conf-cola.component';

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

  ],
  declarations: [BuscadorGuardiaComponent, FiltrosGuardiaComponent, TablaGuardiasComponent, GestionGuardiaComponent, DatosGeneralesGuardiasComponent, DatosCalendariosGuardiasComponent, DatosBaremosComponent, DatosConfColaComponent],
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
  ]
})
export class BusquedaGuardiasModule { }
