
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { AreasItem } from '../../../../../models/sjcs/AreasItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_justiciables } from '../../../../../permisos/procesos_justiciables';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos-solicitud',
  templateUrl: './datos-solicitud.component.html',
  styleUrls: ['./datos-solicitud.component.scss']
})
export class DatosSolicitudComponent implements OnInit, OnChanges {

  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  msgs;
  generalBody: any;
  comboAutorizaEjg;
  comboAutorizaAvisotel;
  comboSolicitajg;

  selectedAutorizaavisotel;
  selectedAsistidosolicitajg;
  selectedAsistidoautorizaeejg;
  permisoEscritura;
  showTarjetaPermiso: boolean = false;


  @Output() modoEdicionSend = new EventEmitter<any>();

  @Input() showTarjeta;
  @Input() body: JusticiableItem;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private router: Router) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_justiciables.tarjetaDatosSolicitud)
      .then(respuesta => {

        this.permisoEscritura = respuesta;

        if (this.permisoEscritura == undefined) {
          this.showTarjetaPermiso = false;

        } else {
          this.showTarjetaPermiso = true;

          if (this.body != undefined && this.body.idpersona != undefined) {
            this.bodyInicial = JSON.parse(JSON.stringify(this.body));

            this.tratamientoDescripcionesTarjeta();

          } else {
            this.body = new JusticiableItem();
          }

          if (this.body.idpersona == undefined) {
            this.modoEdicion = false;
          } else {
            this.modoEdicion = true;
          }

          this.getCombos();

          this.sigaServices.guardarDatosGeneralesJusticiable$.subscribe((data) => {
            this.body = data;
            this.modoEdicion = true;

          });
        }
      }
      ).catch(error => console.error(error));

  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.body != undefined && this.body.idpersona != undefined) {
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));

      this.tratamientoDescripcionesTarjeta();

    } else {
      this.body = new JusticiableItem();
    }

    if (this.body.idpersona == undefined) {
      this.modoEdicion = false;

    } else {
      this.modoEdicion = true;
    }
  }

  tratamientoDescripcionesTarjeta() {

    if (this.body.autorizaavisotelematico != undefined && this.body.autorizaavisotelematico != null) {
      if (this.body.autorizaavisotelematico == "0") {
        this.selectedAutorizaavisotel = "NO";
      } else {
        this.selectedAutorizaavisotel = "SI";
      }
    }

    if (this.body.asistidosolicitajg != undefined && this.body.asistidosolicitajg != null) {
      if (this.body.asistidosolicitajg == "0") {
        this.selectedAsistidosolicitajg = "NO";
      } else {
        this.selectedAsistidosolicitajg = "SI";
      }
    }

    if (this.body.asistidoautorizaeejg != undefined && this.body.asistidoautorizaeejg != null) {
      if (this.body.asistidoautorizaeejg == "0") {
        this.selectedAsistidoautorizaeejg = "NO";
      } else {
        this.selectedAsistidoautorizaeejg = "SI";
      }
    }
  }

  rest() {
    if (this.bodyInicial != undefined) this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  getCombos() {
    this.getComboAutorizaAvisotel();
    this.getComboAutorizaEjg();
    this.getComboSolicitajg();
  }

  getComboAutorizaAvisotel() {
    this.comboAutorizaAvisotel = [
      { label: "No", value: "0" },
      { label: "Sí", value: "1" }
    ];

    this.commonsService.arregloTildesCombo(this.comboAutorizaAvisotel);
  }

  getComboAutorizaEjg() {
    this.comboAutorizaEjg = [
      { label: "No", value: "0" },
      { label: "Sí", value: "1" }
    ];

    this.commonsService.arregloTildesCombo(this.comboAutorizaEjg);
  }

  getComboSolicitajg() {
    this.comboSolicitajg = [
      { label: "No", value: "0" },
      { label: "Sí", value: "1" }
    ];

    this.commonsService.arregloTildesCombo(this.comboSolicitajg);
  }

  onChangeAutorizaAvisoTelematico() {
    if (!(this.body.correoelectronico != undefined && this.body.correoelectronico != "")) {
      if (this.body.autorizaavisotelematico == "1") {
        this.body.autorizaavisotelematico = undefined;
        this.showMessage("info", this.translateService.instant("general.message.informacion"), "Es necesario tener un correo electronico para poder recibir notificaciones");
      }
    }
  }

  save() {
    if (!(this.body.correoelectronico != undefined && this.body.correoelectronico != "")) {
      if (this.body.autorizaavisotelematico == "1") {
        this.showMessage("info", this.translateService.instant("general.message.informacion"), "Es necesario tener un correo electronico para poder recibir notificaciones");
      } else {
        this.callServiceSave();
      }
    } else {
      this.callServiceSave();
    }
  }

  callServiceSave() {

    this.progressSpinner = true;
    let url = "gestionJusticiables_updateDatosSolicitudJusticiable";

    this.sigaServices.post(url, this.body).subscribe(
      data => {

        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.tratamientoDescripcionesTarjeta();
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

  onHideTarjeta() {
    if (this.modoEdicion) {
      this.showTarjeta = !this.showTarjeta;
    }
  }

}
