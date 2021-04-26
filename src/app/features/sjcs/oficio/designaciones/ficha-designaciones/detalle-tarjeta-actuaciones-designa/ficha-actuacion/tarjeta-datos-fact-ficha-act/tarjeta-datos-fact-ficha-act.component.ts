import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../../../_services/commons.service';
import { Actuacion } from '../../detalle-tarjeta-actuaciones-designa.component';

@Component({
  selector: 'app-tarjeta-datos-fact-ficha-act',
  templateUrl: './tarjeta-datos-fact-ficha-act.component.html',
  styleUrls: ['./tarjeta-datos-fact-ficha-act.component.scss']
})
export class TarjetaDatosFactFichaActComponent implements OnInit {

  selector =
    {
      nombre: "Partida Presepuestaria",
      opciones: [],
      value: ''
    };

  msgs: Message[] = [];
  @Input() isAnulada: boolean;
  @Input() actuacionDesigna: Actuacion;
  progressSpinner: boolean = false;

  constructor(private sigaServices: SigaServices, private commonsService: CommonsService) { }

  ngOnInit() {
    this.getComboPartidaPresupuestaria();
    this.selector.value = this.actuacionDesigna.actuacion.idFacturacion;
  }

  getComboPartidaPresupuestaria() {

    this.progressSpinner = true;

    this.sigaServices.get("designaciones_comboPartidaPresupuestaria").subscribe(
      n => {
        this.selector.opciones = n.combooItems;
        this.commonsService.arregloTildesCombo(this.selector.opciones);
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        this.progressSpinner = false;
      }
    );
  }


  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

}
