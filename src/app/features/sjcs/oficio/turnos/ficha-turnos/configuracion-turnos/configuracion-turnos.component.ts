import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, Input } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { Location } from "@angular/common";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Subject } from "rxjs/Subject";
import { DatosGeneralesConsultaItem } from '../../../../../../models/DatosGeneralesConsultaItem';
import { DestinatariosItem } from '../../../../../../models/DestinatariosItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PrisionItem } from '../../../../../../models/sjcs/PrisionItem';
import { TurnosItems } from '../../../../../../models/sjcs/TurnosItems';
@Component({
  selector: "app-configuracion-turnos",
  templateUrl: "./configuracion-turnos.component.html",
  styleUrls: ["./configuracion-turnos.component.scss"]
})
export class ConfiguracionTurnosComponent implements OnInit {

  //Resultados de la busqueda
  @Input() turnosItem: TurnosItems;
  modoEdicion: boolean = false;
  @Output() modoEdicionSend = new EventEmitter<any>();

  openFicha: boolean = false;
  msgs = [];
  historico: boolean = false;

  provinciaSelecionada: string;

  idTurno;
  body: TurnosItems;
  bodyInicial: TurnosItems;
  idPrision;
  isDisabledProvincia: boolean = true;

  comboProvincias;
  comboPoblacion;
  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones;
  codigoPostalValido: boolean = true;

  permisoEscritura: boolean = true;
  movilCheck: boolean = false

  visibleMovilValue: boolean = false;
  esDecanoValue: boolean = false;
  isCodigoEjisValue: boolean = false;

  progressSpinner: boolean = false;
  avisoMail: boolean = false

  emailValido: boolean = false;
  tlf1Valido: boolean = true;
  tlf2Valido: boolean = true;
  faxValido: boolean = true;
  mvlValido: boolean = true;
  edicionEmail: boolean = false;

  @ViewChild("mailto") mailto;

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "configuracion",
      activa: false
    },
  ];

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private translateService: TranslateService, private commonsServices: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()

    }
    this.getComboProvincias();

    this.validateHistorical();

    if (this.modoEdicion) {
      this.body = this.turnosItem;
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));

      // if (this.body != undefined && this.datos.nombrePoblacion != null) {
      //   this.getComboPoblacion(this.body.nombrePoblacion);
      // } else {
      //   this.progressSpinner = false;
      // }

    } else {
      this.body = new TurnosItems();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.edicionEmail = true;

    }
  }


  validateHistorical() {
    if (this.persistenceService.getDatos() != undefined) {

      if (this.persistenceService.getDatos().fechaBaja != null) {
        this.historico = true;
      } else {
        this.historico = false;
      }
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  getComboProvincias() {
    this.progressSpinner = true;

    this.sigaServices.get("busquedaPrisiones_provinces").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboProvincias);
        this.progressSpinner = false;

      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
      }
    );
  }
  save() {
    this.progressSpinner = true;
    let url = "";

    if (!this.modoEdicion) {
      url = "gestionPrisiones_createPrision";
      this.callSaveService(url);

    } else {
      url = "gestionPrisiones_updatePrision";
      this.callSaveService(url);
    }

  }

  callSaveService(url) {
    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          let turnos = JSON.parse(data.body);
          // this.modulosItem = JSON.parse(data.body);
          this.turnosItem.idturno = turnos.idturno;
          let send = {
            modoEdicion: this.modoEdicion,
            idturno: this.turnosItem.idturno
          }
          this.body.idturno = this.idPrision
          this.persistenceService.setDatos(this.body);
          this.modoEdicionSend.emit(send);
        }

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

  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.emailValido = false
    this.edicionEmail = true
    this.tlf1Valido = true
    this.tlf2Valido = true
    this.faxValido = true

  }

  editEmail() {
    if (this.edicionEmail)
      this.edicionEmail = false;
    else this.edicionEmail = true;
  }

  openOutlook(dato) {
    let correo = dato.email;
    this.commonsServices.openOutlook(correo);
  }

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  }
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  // changeEmail() {
  //   if (this.commonsServices.validateEmail(this.body.email) && this.body.email != null && this.body.email != "") {
  //     this.emailValido = true
  //     this.avisoMail = false
  //   }
  //   else {
  //     this.emailValido = false
  //     this.avisoMail = false

  //     if (this.body.email != null && this.body.email != "")
  //       this.avisoMail = true
  //   }
  // }

  disabledSave() {
    if (!this.historico && this.permisoEscritura && (JSON.stringify(this.body) != JSON.stringify(this.bodyInicial))) {
      return false;
    } else {
      return true;
    }
  }

  clear() {
    this.msgs = [];
  }
}
