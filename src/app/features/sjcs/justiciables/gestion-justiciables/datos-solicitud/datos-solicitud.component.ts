
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AreasItem } from '../../../../../models/sjcs/AreasItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_justiciables } from '../../../../../permisos/procesos_justiciables';
import { Router } from '@angular/router';
import { ConfirmationService } from '../../../../../../../node_modules/primeng/api';
import { Dialog } from '../../../../../../../node_modules/primeng/dialog';
import { EventoItem } from '../../../../../models/EventoItem';

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

  @ViewChild("cdSolicitud") cdSolicitud: Dialog;

  @Output() modoEdicionSend = new EventEmitter<any>();
  @Output() createJusticiableByUpdateSolicitud = new EventEmitter<any>();
  @Input() showTarjeta;
  @Input() body: JusticiableItem;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef) { }

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
            this.selectedAutorizaavisotel = undefined;
            this.selectedAsistidosolicitajg = undefined;
            this.selectedAsistidoautorizaeejg = undefined;
            this.showTarjeta = false;

          } else {
            this.modoEdicion = true;
          }

          this.getCombos();

          this.sigaServices.guardarDatosGeneralesJusticiable$.subscribe((data) => {
            let asistidoautorizaeejg = this.body.asistidoautorizaeejg;
            let asistidosolicitajg = this.body.asistidosolicitajg;
            let autorizaavisotelematico = this.body.autorizaavisotelematico;
            this.body = data;
            this.body.asistidoautorizaeejg = asistidoautorizaeejg;
            this.body.asistidosolicitajg = asistidosolicitajg;
            this.body.autorizaavisotelematico = autorizaavisotelematico;
            this.modoEdicion = true;
            this.bodyInicial = JSON.parse(JSON.stringify(this.body));
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
      this.selectedAutorizaavisotel = undefined;
      this.selectedAsistidosolicitajg = undefined;
      this.selectedAsistidoautorizaeejg = undefined;
      this.showTarjeta = false;
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
        if (!this.permisoEscritura){
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No tiene permisos para realizar esta acción");
    }else
    {
    if (this.bodyInicial != undefined) this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    }
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

  save() {
    if (!this.permisoEscritura){
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No tiene permisos para realizar esta acción");
    }else
    {
    if (!(this.bodyInicial.correoelectronico != undefined && this.bodyInicial.correoelectronico != "")) {
      if (this.body.autorizaavisotelematico == "1") {
        this.changeDetectorRef.detectChanges();
        this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.justiciables.message.necesarioCorreoElectronico.recibirNotificaciones"));
      } else {
        this.callConfirmationUpdate();
      }
    } else {
      this.callConfirmationUpdate();
    }
  }
  }

  callServiceSave() {

    this.progressSpinner = true;
    let url = "gestionJusticiables_updateDatosSolicitudJusticiable";

    this.sigaServices.post(url, this.body).subscribe(
      data => {

        this.bodyInicial.autorizaavisotelematico = this.body.autorizaavisotelematico;
        this.bodyInicial.asistidoautorizaeejg = this.body.asistidoautorizaeejg;
        this.bodyInicial.asistidosolicitajg = this.body.asistidosolicitajg;
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

  callConfirmationUpdate() {
    this.progressSpinner = false;

    this.confirmationService.confirm({
      key: "cdSolicitud",
      message: "¿Desea actualizar el registro del justiciable para todos los asuntos en los que está asociado?",
      icon: "fa fa-search ",
      accept: () => {
        this.callServiceSave();
      },
      reject: () => {

      }
    });
  }

  reject() {
    this.cdSolicitud.hide();
    this.progressSpinner = false;
    //Ya estavalidada la repeticion y puede crear al justiciable
    this.body.validacionRepeticion = true;
    this.body.asociarRepresentante = true;
    let url = "gestionJusticiables_createJusticiable";
    this.sigaServices.post(url, this.body).subscribe(
      data => {

        let idJusticiable = JSON.parse(data.body).id;
        this.body.idpersona = idJusticiable;

        this.createJusticiableByUpdateSolicitud.emit(this.body);

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
