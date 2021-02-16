import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF, UpperCasePipe } from '@angular/common';
import { DataTableModule, PaginatorModule, InputTextModule, CheckboxModule, DropdownModule, ButtonModule, GrowlModule, ConfirmationService, MenubarModule, ConfirmDialogModule, MultiSelectModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeTranslationModule } from '../../../commons/translate/pipe-translation.module';
import { TableModule } from '../../../../../node_modules/primeng/table';
import { FechaModule } from '../../../commons/fecha/fecha.module';
import { ImagePipe } from '../../../commons/image-pipe/image.pipe';
import { TrimPipePipe } from '../../../commons/trim-pipe/trim-pipe.pipe';
import { SigaServices } from '../../../_services/siga.service';
import { CommonsService } from '../../../_services/commons.service';
import { cardService } from '../../../_services/cardSearch.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { MessageService } from '../../../../../node_modules/primeng/components/common/messageservice';
import { HeaderGestionEntidadService } from '../../../_services/headerGestionEntidad.service';
import { AuthGuard } from '../../../_guards/auth.guards';
import { environment } from '../../../../environments/environment';
import { HTTP_INTERCEPTORS } from '../../../../../node_modules/@angular/common/http';
import { JwtInterceptor } from '../../../_interceptor/jwt.interceptor';
import { CookieService } from '../../../../../node_modules/ngx-cookie-service';

//EJG
import { EjgComponent } from './ejg.component';
import { EmptyAccordionComponent } from '../../../commons/empty-accordion/empty-accordion.component';
import { FiltroBusquedaEJGComponent } from './busqueda/filtro-busqueda-ejg/filtro-busqueda-ejg.component';
import { TablaBusquedaEJGComponent } from './busqueda/tabla-busqueda-ejg/tabla-busqueda-ejg.component';
import { BusquedaEjgComponent } from './busqueda/busqueda-ejg.component';
import { TarjetaDatosGeneralesComponent } from './ficha/tarjeta-datos-generales/tarjeta-datos-generales.component';
import { TarjetaDictamenComponent } from './ficha/tarjeta-dictamen/tarjeta-dictamen.component';
import { TarjetaDocumentacionComponent } from './ficha/tarjeta-documentacion/tarjeta-documentacion.component';
import { TarjetaExpedientesEconomicosComponent } from './ficha/tarjeta-expedientes-economicos/tarjeta-expedientes-economicos.component';
import { TarjetaImpugnacionComponent } from './ficha/tarjeta-impugnacion/tarjeta-impugnacion.component';
import { TarjetaResolucionComponent } from './ficha/tarjeta-resolucion/tarjeta-resolucion.component';
import { TarjetaServiciosTramitacionComponent } from './ficha/tarjeta-servicios-tramitacion/tarjeta-servicios-tramitacion.component';
import { TarjetaUnidadFamiliarComponent } from './ficha/tarjeta-unidad-familiar/tarjeta-unidad-familiar.component';
import { FichaEjgsComponent } from './ficha/ficha-ejgs.component';

import { BusquedaColegiadoExpressModule } from '../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.module';
import { TarjetaResumenFijaModule } from '../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module';

import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { SelectorComponent } from '../../../commons/selector/selector.component';
import { BuscadorColegialComponent } from '../../../commons/buscadorColegial/buscador-colegial.component';
import { TablaResultadoComponent } from '../../../commons/tabla-resultado/tabla-resultado.component';
import { PaginadorComponent } from '../../../commons/paginador/paginador.component';
import { MigasDePanComponent } from '../../../commons/migas-de-pan/migas-de-pan.component';
import { TablaSimpleComponent } from '../../../commons/tabla-simple/tabla-simple.component';
import { InputDivididoComponent } from '../../../commons/input-dividido/input-dividido.component';
import { DatePickerRangeComponent } from '../../../commons/date-picker-range/date-picker-range.component';
import { TarjetaComponent } from '../../../commons/tarjeta/tarjeta.component';

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
    ReactiveFormsModule, 
    GrowlModule,
    PipeTranslationModule,
    MenubarModule,
    TableModule,
    MultiSelectModule,
    FechaModule,
    ConfirmDialogModule,
    BusquedaColegiadoExpressModule,
    TarjetaResumenFijaModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule
  ],
  declarations: [
    EjgComponent,
    EmptyAccordionComponent,
    FiltroBusquedaEJGComponent,
    TablaBusquedaEJGComponent,
    BusquedaEjgComponent,
    TarjetaDatosGeneralesComponent,
    TarjetaDictamenComponent,
    TarjetaDocumentacionComponent,
    TarjetaExpedientesEconomicosComponent,
    TarjetaImpugnacionComponent,
    TarjetaResolucionComponent,
    TarjetaServiciosTramitacionComponent,
    TarjetaUnidadFamiliarComponent,
    FichaEjgsComponent,
		SelectorComponent,
    BuscadorColegialComponent,
    EmptyAccordionComponent,
    TablaResultadoComponent,
    PaginadorComponent,
    MigasDePanComponent,
    TablaSimpleComponent,
    InputDivididoComponent,
    TarjetaComponent,
    DatePickerRangeComponent
  ],
  providers: [
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
export class EJGModule { }