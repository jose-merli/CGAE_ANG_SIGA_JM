import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule, CheckboxModule, ConfirmationService, ConfirmDialogModule, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule, PickListModule, TreeTableModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { MessageService } from '../../../../../../node_modules/primeng/components/common/messageservice';
import { BusquedaColegiadoExpressModule } from '../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.module';
import { FechaModule } from '../../../../commons/fecha/fecha.module';
import { ImagePipe } from '../../../../commons/image-pipe/image.pipe';
import { PrecioModule } from '../../../../commons/precio/precio.module';
import { TablaDinamicaColaGuardiaModule } from '../../../../commons/tabla-dinamica-cola-guardia/tabla-dinamica-cola-guardia.module';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { TrimPipePipe } from '../../../../commons/trim-pipe/trim-pipe.pipe';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { CommonsService } from '../../../../_services/commons.service';
import { HeaderGestionEntidadService } from '../../../../_services/headerGestionEntidad.service';
import { SigaServices } from '../../../../_services/siga.service';
import { MatSortModule } from '@angular/material';
import { MovimientosVariosComponent} from './movimientos-varios.component';
import {FiltrosMovimientosVariosComponent} from './filtros-movimientos-varios/filtros-movimientos-varios.component';
import { TablaMovimientosVariosComponent } from './tabla-movimientos-varios/tabla-movimientos-varios.component';
import { FichaMovimientosVariosComponent } from './ficha-movimientos-varios/ficha-movimientos-varios.component';
import { TarjetaResumenMovimientosComponent } from './ficha-movimientos-varios/tarjeta-resumen-movimientos/tarjeta-resumen-movimientos.component';
import { TarjetaDatosClienteComponent } from './ficha-movimientos-varios/tarjeta-datos-cliente/tarjeta-datos-cliente.component';
import { TarjetaDatosGeneralesComponent } from './ficha-movimientos-varios/tarjeta-datos-generales/tarjeta-datos-generales.component';
import { TarjetaCriteriosAplicacionComponent } from './ficha-movimientos-varios/tarjeta-criterios-aplicacion/tarjeta-criterios-aplicacion.component';
import { TarjetaListadoPagosComponent } from './ficha-movimientos-varios/tarjeta-listado-pagos/tarjeta-listado-pagos.component';

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
    PickListModule,
    TablaDinamicaColaGuardiaModule,
    ConfirmDialogModule,
    BusquedaColegiadoExpressModule,
    MatSortModule,
    FechaModule,
  ],
  declarations: [
    MovimientosVariosComponent,
    FiltrosMovimientosVariosComponent,
    TablaMovimientosVariosComponent,
    FichaMovimientosVariosComponent,
    TarjetaResumenMovimientosComponent,
    TarjetaDatosClienteComponent,
    TarjetaDatosGeneralesComponent,
    TarjetaCriteriosAplicacionComponent,
    TarjetaListadoPagosComponent
    
  ],exports: [ MovimientosVariosComponent,
    FiltrosMovimientosVariosComponent,
    TablaMovimientosVariosComponent,
    FichaMovimientosVariosComponent,
    TarjetaResumenMovimientosComponent,
    TarjetaDatosClienteComponent,
    TarjetaDatosGeneralesComponent,
    TarjetaCriteriosAplicacionComponent,
    TarjetaListadoPagosComponent],
  providers: [
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

  ],
})
export class MovimientosVariosModule { }