import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routingMaestros } from './maestros-routing.module';
import { GestionZonasModule } from './gestion-zonas/gestion-zonas.module';
import { GestionAreasModule } from './areas/gestion-areas.module';
import { GestionModulosModule } from './maestros-modulos/maestros-modulos.module';

import { MenubarModule } from 'primeng/menubar';
import { JuzgadosModule } from './juzgados/juzgados.module';
import { GestionCostesfijosModule } from './costes-fijos/gestion-costesfijos/gestion-costesfijos.module';
import { FundamentosResolucionModule } from './fundamentos-resolucion/fundamentos-resolucion.module';
import { PrisionesModule } from './prisiones/prisiones.module';
import { FundamentosCalificacionModule } from './fundamentos-calificacion/fundamentos-calificacion.module';

import { GestionPartidasJudicialesModule} from './partidos-judiciales/partidas-judiciales.module';
import { ComisariasModule } from './comisarias/comisarias.module';
import { CalendarioLaboralAgendaModule } from './calendario-laboral-agenda/calendario-laboral-agenda.module';
import { GestionTiposAsistenciaModule } from './tiposAsistencia/tiposAsistencia.module';
import { ProcuradoresModule } from './procuradores/procuradores.module';
import { GestionDocumentacionEJGModule } from './documentacion-ejg/documentacion-ejg.module';
import { GestionTiposActuacionModule } from './tiposActuacion/tiposActuacion.module';
import { ProcedimientosModule } from './procedimientos/procedimientos.module';
import { ConfirmDialogModule, DropdownModule, GrowlModule, SpinnerModule } from '../../../../../node_modules/primeng/primeng';
import { RetencionesIrpfModule } from './retenciones-IRPF/retenciones-irpf.module';
import { TableModule } from 'primeng/table';
import { PartidasModule } from './partidas/partidas.module';
import { DestinatariosRetencionesComponent } from './destinatarios-retenciones/destinatarios-retenciones.component';
import { DestinatariosModule } from './destinatarios-retenciones/destinatarios.module';
import { TablaDestinatariosComponent } from './destinatarios-retenciones/gestion-retenciones/gestion-retenciones.component';
import { FiltrosRetenciones } from './destinatarios-retenciones/filtros-retenciones/filtrosretenciones.component';
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from '@angular/forms';
import { PipeTranslationModule } from '../../../commons/translate/pipe-translation.module';
@NgModule({
        declarations: [DestinatariosRetencionesComponent, TablaDestinatariosComponent, FiltrosRetenciones],
        imports: [
                CommonModule,
                routingMaestros,
                GestionZonasModule,
                MenubarModule,
                JuzgadosModule,
                GestionAreasModule,
                GestionCostesfijosModule,
                FundamentosResolucionModule,
                GestionModulosModule,
                PrisionesModule,
                FundamentosCalificacionModule,
                ProcuradoresModule,
                GestionDocumentacionEJGModule,
                ComisariasModule,
                CalendarioLaboralAgendaModule,
                ProcedimientosModule,
                GestionTiposAsistenciaModule,
                RetencionesIrpfModule,
                SpinnerModule,
                GestionTiposActuacionModule,
                ConfirmDialogModule,
                TableModule,
                PartidasModule,
                GestionPartidasJudicialesModule,
                GrowlModule,
                CheckboxModule,
                DropdownModule,
                FormsModule,
                PipeTranslationModule
        ],

        providers: []
})
export class MaestrosModule { }
