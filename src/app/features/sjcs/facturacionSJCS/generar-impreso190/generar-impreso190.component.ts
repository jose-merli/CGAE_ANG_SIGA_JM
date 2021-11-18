import { Component, OnInit, ViewChild } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'
import { SigaServices } from '../../../../_services/siga.service';
import { FiltroGenerarImpreso190Component } from './filtro-generar-impreso190/filtro-generar-impreso190.component';
import { TablaGenerarImpreso190Component } from './tabla-generar-impreso190/tabla-generar-impreso190.component';


@Component({
  selector: 'app-generar-impreso190',
  templateUrl: './generar-impreso190.component.html',
  styleUrls: ['./generar-impreso190.component.scss'],

})
export class GenerarImpreso190Component implements OnInit {


  progressSpinner;
  msgs;
  datos


  @ViewChild(FiltroGenerarImpreso190Component) filtros: FiltroGenerarImpreso190Component;
  @ViewChild(TablaGenerarImpreso190Component) tabla: TablaGenerarImpreso190Component;
  buscar: boolean;

  constructor(
    private sigaServices: SigaServices) {

  }

  ngOnInit() {
  }

  getImpresos(event){
    if(event == true){
      this.buscar = true;
      console.log(this.filtros.anio);
    }
    
  }

  generarImpreso() {
    this.progressSpinner = true
    let impreso190;
    this.sigaServices.post("impreso190_generar", impreso190).subscribe(
      data => {
        console.log(data);
        this.progressSpinner = false;
      }
    )
    this.progressSpinner = false;

  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }


}
