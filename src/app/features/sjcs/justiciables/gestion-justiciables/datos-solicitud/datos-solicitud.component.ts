
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AreasItem } from '../../../../../models/sjcs/AreasItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-datos-solicitud',
  templateUrl: './datos-solicitud.component.html',
  styleUrls: ['./datos-solicitud.component.scss']
})
export class DatosSolicitudComponent implements OnInit {

  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  msgs;
  generalBody: any;
  comboAutorizaEjg;
  comboAutorizaAvisotel;
  comboSolicitajg;

  @Output() modoEdicionSend = new EventEmitter<any>();

  //Resultados de la busqueda
  @Input() showTarjeta;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService) { }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  rest() {
    // if (this.modoEdicion) {
    //   if (this.bodyInicial != undefined) this.areasItem = JSON.parse(JSON.stringify(this.bodyInicial));
    // } else {
    //   this.areasItem = new AreasItem();
    // }
  }

  save() {
    this.progressSpinner = true;
    let url = "";
    if (!this.modoEdicion) {
      url = "fichaAreas_createAreas";
      this.callSaveService(url);
    } else {
      url = "fichaAreas_updateAreas";
      this.callSaveService(url);
    }

  }

  callSaveService(url) {


  }

  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  disabledSave() {
    // if (this.areasItem.nombreArea != undefined) this.areasItem.nombreArea = this.areasItem.nombreArea.trim();
    // if (this.areasItem.nombreArea != "" && (JSON.stringify(this.areasItem) != JSON.stringify(this.bodyInicial))) {
    //   return false;
    // } else {
    //   return true;
    // }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

}
