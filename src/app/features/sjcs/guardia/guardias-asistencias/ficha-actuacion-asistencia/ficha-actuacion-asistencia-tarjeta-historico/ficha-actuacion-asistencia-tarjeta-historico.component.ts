import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { HistoricoActuacionAsistenciaItem } from '../../../../../../models/guardia/HistoricoActuacionAsistenciaItem';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-actuacion-asistencia-tarjeta-historico',
  templateUrl: './ficha-actuacion-asistencia-tarjeta-historico.component.html',
  styleUrls: ['./ficha-actuacion-asistencia-tarjeta-historico.component.scss']
})
export class FichaActuacionAsistenciaTarjetaHistoricoComponent implements OnInit, OnChanges {

  progressSpinner : boolean;
  @Input() idAsistencia : string;
  @Input() idActuacion : string;
  historicoItems : HistoricoActuacionAsistenciaItem [] = [];
  selectedDatos : HistoricoActuacionAsistenciaItem [] = [];
  rows : number = 10;
  rowsPerPage = [
    {
      label: 10,
      value: 10
    },
    {
      label: 20,
      value: 20
    },
    {
      label: 30,
      value: 30
    },
    {
      label: 40,
      value: 40
    }
  ];

  @ViewChild("table") table : DataTable;
  constructor(private changeDetectorRef : ChangeDetectorRef,
    private sigaServices : SigaServices) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.idAsistencia
      && changes.idActuacion
      && changes.idAsistencia.currentValue
      && changes.idActuacion.currentValue){
        this.getHistorico();
      }
  }

  getHistorico(){
    this.progressSpinner = true;
    this.sigaServices.getParam("actuaciones_searchHistorico","?anioNumero="+this.idAsistencia+"&idActuacion="+this.idActuacion).subscribe(
      n => {
        this.historicoItems = n.historicoActuacionAsistenciaItem;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      }
    );
  }

  onChangeRowsPerPages(event) {
    this.rows = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

}
