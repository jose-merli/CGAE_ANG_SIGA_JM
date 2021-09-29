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
import { TablaDinamicaModule } from '../../../../commons/tabla-dinamica/tabla-dinamica.module';
import { TarjetaResumenFijaModule } from '../../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { TrimPipePipe } from '../../../../commons/trim-pipe/trim-pipe.pipe';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { CommonsService } from '../../../../_services/commons.service';
import { HeaderGestionEntidadService } from '../../../../_services/headerGestionEntidad.service';
import { SigaServices } from '../../../../_services/siga.service';
import { FiltrosSaltosCompensacionesGuardiaComponent } from './saltos-compensaciones-guardia/filtros-saltos-compensaciones-guardia/filtros-saltos-compensaciones-guardia.component';
import { SaltosCompensacionesGuardiaComponent } from './saltos-compensaciones-guardia/saltos-compensaciones-guardia.component';
import { TablaSaltosCompensacionesGuardiaComponent } from './saltos-compensaciones-guardia/tabla-saltos-compensaciones-guardia/tabla-saltos-compensaciones-guardia.component';

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
    BusquedaColegiadoExpressModule
  ],
  declarations: [
    SaltosCompensacionesGuardiaComponent,
    TablaSaltosCompensacionesGuardiaComponent,
    FiltrosSaltosCompensacionesGuardiaComponent],
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
  ], schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class SaltosCompensacionesGuardiaModule { }
