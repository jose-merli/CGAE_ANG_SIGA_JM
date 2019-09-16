import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AreasItem } from '../../../../../../models/sjcs/AreasItem';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';

@Component({
  selector: 'app-edicion-areas',
  templateUrl: './edicion-areas.component.html',
  styleUrls: ['./edicion-areas.component.scss']
})
export class EdicionAreasComponent implements OnInit {

  body: AreasItem = new AreasItem();
  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  msgs;

  @Output() modoEdicionSend = new EventEmitter<any>();

  //Resultados de la busqueda
  @Input() areasItem: AreasItem;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService) { }
  ngOnInit() {
    // if (this.areasItem != undefined) {

    // this.areasItem = new AreasItem();
    if (this.areasItem != undefined) {
      this.body = this.areasItem;
      this.bodyInicial = JSON.parse(JSON.stringify(this.areasItem));
    } else {
      this.areasItem = new AreasItem();
    }
    if (this.body.idArea == undefined) {
      this.modoEdicion = false;
    } else {
      this.modoEdicion = true;
    }
  }

  ngAfterViewInit() {
    // if (this.areasItem != undefined) {
    //   this.body = this.areasItem;
    //   this.bodyInicial = JSON.parse(JSON.stringify(this.areasItem));
    // } else {
    //   this.areasItem = new AreasItem();
    // }
    // if (this.body.idArea == undefined) {
    //   this.modoEdicion = false;
    // } else {
    //   this.modoEdicion = true;
    // }
  }

  // getGrupoZona() {
  //   this.progressSpinner = true;
  //   this.sigaServices
  //     .getParam("fichaZonas_searchGroupZone", "?idZona=" + this.idZona)
  //     .subscribe(
  //       n => {
  //         this.body = n;
  //         this.bodyInicial = JSON.parse(JSON.stringify(this.body));
  //         this.progressSpinner = false;
  //       },
  //       err => {
  //         console.log(err);
  //         this.progressSpinner = false;
  //       },
  //       () => {
  //       }
  //     );
  // }

  rest() {
    if (this.modoEdicion) {
      this.areasItem = JSON.parse(JSON.stringify(this.bodyInicial));
    } else {
      this.areasItem = new AreasItem();
    }
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
    this.sigaServices.post(url, this.areasItem).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          let areas = JSON.parse(data.body);
          // this.areasItem = JSON.parse(data.body);
          this.areasItem.idArea = areas.id;
          let send = {
            modoEdicion: this.modoEdicion,
            idArea: this.areasItem.idArea
          }
          this.modoEdicionSend.emit(send);
        }

        this.bodyInicial = JSON.parse(JSON.stringify(this.areasItem));

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
    if (this.areasItem.nombreArea != "" && (JSON.stringify(this.areasItem) != JSON.stringify(this.bodyInicial))) {
      return false;
    } else {
      return true;
    }
  }
}
