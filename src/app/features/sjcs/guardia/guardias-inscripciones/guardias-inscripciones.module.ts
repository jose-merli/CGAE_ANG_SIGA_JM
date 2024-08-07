import { CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatSortModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { FilterService, GridModule, GroupService, PageService, SortService } from "@syncfusion/ej2-angular-grids";
import { MultiSelectModule } from "primeng/multiselect";
import { ButtonModule, CheckboxModule, ConfirmDialogModule, ConfirmationService, DataTableModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule, PickListModule, RadioButtonModule, TreeTableModule } from "primeng/primeng";
import { TableModule } from "primeng/table";
import { MessageService } from "../../../../../../node_modules/primeng/components/common/messageservice";
import { AuthenticationService } from "../../../../_services/authentication.service";
import { CommonsService } from "../../../../_services/commons.service";
import { SigaServices } from "../../../../_services/siga.service";
import { BusquedaColegiadoExpressModule } from "../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.module";
import { FechaModule } from "../../../../commons/fecha/fecha.module";
import { ImagePipe } from "../../../../commons/image-pipe/image.pipe";
import { PaginadorModule } from "../../../../commons/paginador/paginador.module";
import { PrecioModule } from "../../../../commons/precio/precio.module";
import { SelectorModule } from "../../../../commons/selector/selector.module";
import { TablaDinamicaColaGuardiaModule } from "../../../../commons/tabla-dinamica-cola-guardia/tabla-dinamica-cola-guardia.module";
import { TablaDinamicaModule } from "../../../../commons/tabla-dinamica/tabla-dinamica.module";
import { TablaResultadoMixModule } from "../../../../commons/tabla-resultado-mix/tabla-resultado-mix.module";
import { TarjetaResumenFijaModule } from "../../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module";
import { PipeTranslationModule } from "../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../commons/trim-pipe/trim-pipe.pipe";
import { FichaGuardiasInscripcionesComponent } from "./ficha-guardias-inscripciones/ficha-guardias-inscripciones.component";
import { TarjetaColaComponent } from "./ficha-guardias-inscripciones/tarjeta-cola/tarjeta-cola.component";
import { TarjetaGestionInscripcionGuardiaComponent } from "./ficha-guardias-inscripciones/tarjeta-gestion-inscripcion-guardia/tarjeta-gestion-inscripcion-guardia.component";
import { TarjetaInscripcionGuardiaComponent } from "./ficha-guardias-inscripciones/tarjeta-inscripcion-guardia/tarjeta-inscripcion-guardia.component";
import { TarjetaLetradoComponent } from "./ficha-guardias-inscripciones/tarjeta-letrado/tarjeta-letrado.component";
import { TarjetaResumenComponent } from "./ficha-guardias-inscripciones/tarjeta-resumen/tarjeta-resumen.component";
import { GuardiasInscripcionesFiltrosComponent } from "./guardias-inscripciones-filtros/guardias-inscripciones-filtros.component";
import { GuardiasInscripcionesComponent } from "./guardias-inscripciones.component";

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
    BusquedaColegiadoExpressModule,
    SelectorModule,
    MatSortModule,
    FechaModule,
    PaginadorModule,
    TablaResultadoMixModule,
    BrowserModule,
    GridModule,
    RadioButtonModule,
  ],
  declarations: [
    GuardiasInscripcionesComponent,
    GuardiasInscripcionesFiltrosComponent,
    FichaGuardiasInscripcionesComponent,
    TarjetaResumenComponent,
    TarjetaLetradoComponent,
    TarjetaColaComponent,
    TarjetaInscripcionGuardiaComponent,
    TarjetaGestionInscripcionGuardiaComponent,
    //TablaResultadoMixComponent
  ],
  providers: [
    ImagePipe,
    DatePipe,
    TrimPipePipe,
    UpperCasePipe,
    SigaServices,
    CommonsService,
    MessageService,
    AuthenticationService,
    ConfirmationService,
    PageService,
    SortService,
    FilterService,
    GroupService,
    //TablaResultadoMixSaltosCompService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InscripcionesGuardiaModule {}
