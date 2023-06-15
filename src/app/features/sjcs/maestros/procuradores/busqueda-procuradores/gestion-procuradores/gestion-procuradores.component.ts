import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcuradoresItem } from '../../../../../../models/sjcs/ProcuradoresItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Location } from '@angular/common';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { DatosGeneralesProcuradoresComponent } from './datos-generales-procuradores/datos-generales-procuradores.component';
import { DatosDireccionesProcuradoresComponent } from './datos-direcciones-procuradores/datos-direcciones-procuradores.component';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-gestion-procuradores',
  templateUrl: './gestion-procuradores.component.html',
  styleUrls: ['./gestion-procuradores.component.scss']
})
export class GestionProcuradoresComponent implements OnInit {

  disableSave: boolean;
  fichasPosibles;
  datos
  modoEdicion: boolean = true;
  progressSpinner: boolean = false;
  body: ProcuradoresItem = new ProcuradoresItem();
  bodyInicial: ProcuradoresItem = new ProcuradoresItem();
  idProcuradores;
  historico: boolean = false;
  validDir: boolean = true;
  permisoEscritura: boolean = true;
  msgs = []

  @ViewChild(DatosGeneralesProcuradoresComponent) generales;
  @ViewChild(DatosDireccionesProcuradoresComponent) direcciones;

  constructor(private persistenceService: PersistenceService, private location: Location, private sigaServices: SigaServices,
    private translateService: TranslateService, private commonsService: CommonsService) { }

  ngOnInit() {


    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()

    }
    if (this.persistenceService.getDatos() != undefined) {
      this.datos = this.persistenceService.getDatos();
      this.body = this.datos;
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      if (this.datos.fechabaja != null || this.datos.institucionVal != undefined) {
        this.historico = true;
      } else {
        this.historico = false;
      }
      this.modoEdicion = true;

    } else {
      this.datos = new ProcuradoresItem();
      this.body = new ProcuradoresItem();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.modoEdicion = false;
    }


  }


  backTo() {
    this.location.back();
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.datos.idProcurador = event.idProcurador;
  }

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disabledSave()) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.save();
      }
    }
  }

  save() {
    this.progressSpinner = true;
    let url = "";

    if (!this.modoEdicion) {
      url = "gestionProcuradores_createProcurador";
      this.callSaveService(url);

    } else {
      url = "gestionProcuradores_updateProcurador";
      this.callSaveService(url);
    }

  }


  callSaveService(url) {
    this.body = Object.assign(this.generales.body, this.direcciones.body);
    if (this.generales.body.nombre != undefined)
      this.generales.body.nombre = this.generales.body.nombre.trim();
    if (this.generales.body.apellido1 != undefined)
      this.generales.body.apellido1 = this.generales.body.apellido1.trim();
    if (this.generales.body.nColegiado != undefined)
      this.generales.body.nColegiado = this.generales.body.nColegiado.trim();
    if (this.generales.body.codigoExt != undefined)
      this.generales.body.codigoExt = this.generales.body.codigoExt.trim();
    if (this.generales.body.apellido2 != undefined)
      this.generales.body.apellido2 = this.generales.body.apellido2.trim();
    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.idProcuradores = JSON.parse(data.body).id;
          let send = {
            modoEdicion: this.modoEdicion,
            idProcuradores: this.idProcuradores
          }
          this.body.idProcurador = this.idProcuradores
          this.persistenceService.setDatos(this.body);
          this.modoEdicionSend(send);
        }

        this.direcciones.bodyInicial = JSON.parse(JSON.stringify(this.direcciones.body));
        this.generales.bodyInicial = JSON.parse(JSON.stringify(this.generales.body));

        this.bodyInicial = JSON.parse(JSON.stringify(this.body));

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
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

  disabledSave() {


    if ((this.generales.body.idColProcurador != undefined && this.generales.body.idColProcurador != null && this.generales.body.nombre != undefined && this.generales.body.nombre != null && this.generales.body.apellido1 != undefined &&
      this.generales.body.apellido1 != null && this.generales.body.nColegiado != undefined && this.generales.body.nColegiado != null)
      && (this.direcciones.validDir || this.direcciones.validDir == null || this.direcciones.validDir == undefined) &&
      this.permisoEscritura && ((JSON.stringify(this.direcciones.body) != JSON.stringify(this.direcciones.bodyInicial))
        || (JSON.stringify(this.generales.body) != JSON.stringify(this.generales.bodyInicial)))) {
      if (this.generales.body.apellido1.trim() != "" && this.generales.body.nombre.trim() != "" && this.generales.body.nColegiado.trim() && this.generales.body.idColProcurador.trim()) {
        return false;
      } else { return true; }

    } else {
      return true;
    }
  }

  checkPermisosRest() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
  }

  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.validateEmail();
    this.direcciones.validDir = true
    this.direcciones.tlf1Valido = true
    this.direcciones.tlf2Valido = true
    this.direcciones.faxValido = true
  }


  validateEmail() {
    if (this.commonsService.validateEmail(this.body.email) && this.body.email != null && this.body.email != '') {
      this.direcciones.emailValido = true;
      this.direcciones.avisoMail = false;
    } else {

      if (this.body.email != null && this.body.email != '' && this.body.email != undefined) {
        this.direcciones.emailValido = false;
        this.direcciones.avisoMail = true;
      } else {
        this.direcciones.emailValido = true;
        this.direcciones.avisoMail = false;
      }
    }
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