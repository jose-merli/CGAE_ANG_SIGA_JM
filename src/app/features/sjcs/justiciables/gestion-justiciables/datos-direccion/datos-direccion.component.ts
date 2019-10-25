
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-datos-direccion',
  templateUrl: './datos-direccion.component.html',
  styleUrls: ['./datos-direccion.component.scss']
})
export class DatosDireccionComponent implements OnInit {

  body: any;
  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  msgs;
  showTarjeta: boolean = false;
  generalBody: any;
  comboTipo;
  datos: any[] = [];
  selectedDatos;
  cols;

  @Output() modoEdicionSend = new EventEmitter<any>();

  //Resultados de la busqueda
  @Input() item: any;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.item != undefined) {
      this.body = this.item;
      this.bodyInicial = JSON.parse(JSON.stringify(this.item));
    } else {
      // this.item = new item();
    }
    if (this.body == undefined) {
      this.modoEdicion = false;
    } else {
      this.modoEdicion = true;
    }
  }


  ngOnInit() {
    // if (this.item != undefined) {

    // this.item = new item();
    if (this.item != undefined) {
      this.body = this.item;
      this.bodyInicial = JSON.parse(JSON.stringify(this.item));
    } else {
      // this.item = new item();
    }
    if (this.body == undefined) {
      this.modoEdicion = false;
    } else {
      this.modoEdicion = true;
    }
    this.cols = [
      { field: 'tipo', header: this.translateService.instant("censo.busquedaClientesAvanzada.literal.tipoCliente") },
      { field: 'valor', header: this.translateService.instant("administracion.parametrosGenerales.literal.valor") }
    ]
  }

  ngAfterViewInit() {
  }

  rest() {
    // if (this.modoEdicion) {
    //   if (this.bodyInicial != undefined) this.item = JSON.parse(JSON.stringify(this.bodyInicial));
    // } else {
    //   this.item = new item();
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

  activarPaginacion() {
    if (!this.body || this.body.length == 0)
      return false;
    else return true;
  }

  callSaveService(url) {
    this.sigaServices.post(url, this.item).subscribe(
      data => {

        // if (!this.modoEdicion) {
        //   this.modoEdicion = true;
        //   let areas = JSON.parse(data.body);
        //   // this.item = JSON.parse(data.body);
        //   this.item = areas.id;
        //   let send = {
        //     modoEdicion: this.modoEdicion,
        //     idArea: this.item
        //   }
        //   this.modoEdicionSend.emit(send);
        // }

        this.bodyInicial = JSON.parse(JSON.stringify(this.item));
        this.persistenceService.setDatos(this.item);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );

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
    // if (this.item.nombreArea != undefined) this.item.nombreArea = this.item.nombreArea.trim();
    // if (this.item.nombreArea != "" && (JSON.stringify(this.item) != JSON.stringify(this.bodyInicial))) {
    //   return false;
    // } else {
    //   return true;
    // }
  }

  newData() {
    let dato = {
      tipo: "",
      valor: ""
    }
    this.datos.push(dato);
  }


  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

}
