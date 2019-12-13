import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GuardiaItem } from '../../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../../_services/commons.service';
import { endpoints_guardia } from '../../../../../../../utils/endpoints_guardia';
import { TranslateService } from '../../../../../../../commons/translate';

@Component({
  selector: 'app-datos-generales-guardias',
  templateUrl: './datos-generales-guardias.component.html',
  styleUrls: ['./datos-generales-guardias.component.scss']
})
export class DatosGeneralesGuardiasComponent implements OnInit {

  body: GuardiaItem = new GuardiaItem();
  bodyInicial: GuardiaItem = new GuardiaItem();

  @Input() modoEdicion: boolean = false;
  @Input() permisoEscritura: boolean;
  @Output() modoEdicionSend = new EventEmitter<any>();

  openFicha: boolean = true;
  historico: boolean = false;
  isDisabledGuardia: boolean = true;
  datos = [];
  cols;
  comboTipoGuardia = [];
  comboGuardia = [];
  comboTurno = [];
  progressSpinner;
  msgs;
  constructor(private persistenceService: PersistenceService,
    private sigaService: SigaServices,
    private commonServices: CommonsService,
    private translateService: TranslateService) { }


  ngOnInit() {
    this.getCols();
    this.historico = this.persistenceService.getHistorico()
    this.getComboTipoGuardia();

    this.getComboTurno();

    if (this.persistenceService.getDatos()) {
      this.progressSpinner = true;
      this.sigaService.datosRedy$.subscribe(
        data => {
          data = JSON.parse(data.body)
          this.body.idGuardia = data.idGuardia
          this.body.descripcionFacturacion = data.descripcionFacturacion
          this.body.descripcion = data.descripcion
          this.body.descripcionPago = data.descripcionPago
          this.body.idTipoGuardia = data.idTipoGuardia
          this.body.idTurno = data.idTurno
          this.body.nombre = data.nombre
          this.body.envioCentralita = data.envioCentralita

          //Informamos de la guardia de la que hereda si existe.
          if (data.idGuardiaPrincipal && data.idTurnoPrincipal)
            this.datos.push({
              vinculacion: 'Principal',
              turno: data.idTurnoPrincipal,
              guardia: data.idGuardiaPrincipal
            })
          if (data.idGuardiaVinculada && data.idTurnoVinculada) {
            let guardias = data.idGuardiaVinculada.split(",");
            let turno = data.idTurnoVinculada.split(",");
            this.datos = guardias.map(function (x, i) {
              return { vinculacion: "Vinculada", guardia: x, turno: turno[i] }
            });
            this.datos.pop()
          }
          this.bodyInicial = JSON.parse(JSON.stringify(this.body));

          this.progressSpinner = false;
        });
    }
  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }


  disabledSave() {
    if (!this.modoEdicion)
      if (!this.historico && (this.body.nombre && this.body.nombre.trim())
        && (this.body.descripcion && this.body.descripcion.trim())
        && (this.body.idTurno) && (JSON.stringify(this.body) != JSON.stringify(this.bodyInicial))) {
        return false;
      } else return true;
    else
      return false;
  }

  getCols() {
    if (!this.modoEdicion)
      this.cols = [
        { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
        { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      ];
    else
      this.cols = [
        { field: "vinculacion", header: "justiciaGratuita.guardia.gestion.vinculacion" },
        { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
        { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      ];
  }


  getComboTipoGuardia() {
    this.sigaService.get("busquedaGuardia_tiposGuardia").subscribe(
      n => {
        this.comboTipoGuardia = n.combooItems;

        this.commonServices.arregloTildesCombo(this.comboTipoGuardia);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTurno() {
    this.sigaService.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurno);
      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeTurno() {
    this.body.idGuardia = "";
    this.comboGuardia = [];

    if (this.body.idTurnoPrincipal) {
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
    }
  }

  getComboGuardia() {

    this.sigaService.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + this.body.idTurnoPrincipal).subscribe(
        data => {
          this.isDisabledGuardia = false;
          this.comboGuardia = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardia);
        },
        err => {
          console.log(err);
        }
      )

  }

  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial))
  }


  callSaveService(url) {
    if (this.body.descripcion != undefined) this.body.descripcion = this.body.descripcion.trim();
    if (this.body.nombre != undefined) this.body.nombre = this.body.nombre.trim();
    if (this.body.envioCentralita == undefined) this.body.envioCentralita = false;
    this.sigaService.post(url, this.body).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.getCols();
          this.body.idGuardia = JSON.parse(data.body).id;

          this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.guardia.gestion.guardiaCreadaDatosPred"));
        } else this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));


        this.bodyInicial = JSON.parse(JSON.stringify(this.body));

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

  save() {
    this.progressSpinner = true;
    let url = "";

    if (!this.modoEdicion) {
      url = "busquedaGuardias_createGuardia";
      this.callSaveService(url);

    } else {
      url = "busquedaGuardias_updateGuardia";
      this.callSaveService(url);
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