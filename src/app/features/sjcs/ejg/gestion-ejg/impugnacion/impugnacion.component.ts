import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-impugnacion',
  templateUrl: './impugnacion.component.html',
  styleUrls: ['./impugnacion.component.scss']
})
export class ImpugnacionComponent implements OnInit {

  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = false;
  @Input() openTarjetaImpugnacion;
  @Output() guardadoSend = new EventEmitter<any>();

  openFicha: boolean = false;
  progressSpinner: boolean = false;
  checkmodificable: boolean = false;
  checkmodificableRT: boolean = false;
  isDisabledFundamentoImpug: boolean = false;
  resaltadoDatosGenerales: boolean = false;
  resaltadoDatos: boolean = false;
  activacionTarjeta: boolean = false;

  msgs = [];
  textFilter: string = "Seleccionar";
  fundImpugnacionDesc: String;
  datosIniciales: EJGItem = new EJGItem();
  comboFundamentoImpug = [];
  comboImpugnacion = [];

  constructor(private sigaServices: SigaServices, private commonsService: CommonsService, 
    private translateService: TranslateService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    if (this.datos.fechaAuto != undefined)
      this.datos.fechaAuto = new Date(this.datos.fechaAuto);
    if (this.datos.fechaPublicacion != undefined)
      this.datos.fechaPublicacion = new Date(this.datos.fechaPublicacion);
    this.datosIniciales = {...this.datos};
    this.getComboImpugnacion();
    this.getComboFundamentoImpug();
  }

  abreCierraFicha() {
    this.openTarjetaImpugnacion = !this.openTarjetaImpugnacion;
  }

  getComboImpugnacion() {
    this.sigaServices.get("filtrosejg_comboImpugnacion").subscribe(
      n => {
        this.comboImpugnacion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboImpugnacion);
        let impug = this.comboImpugnacion.find(
          item => item.value == this.datos.autoResolutorio
        );
        if (impug != undefined){
          this.datosIniciales.impugnacionDesc = impug.label;
          this.datos.impugnacionDesc = impug.label;
        }
      }
    );
  }
  onChangeImpugnacion() {
    this.comboFundamentoImpug = [];
    this.datos.sentidoAuto = null;
    if (this.datos.autoResolutorio != undefined) {
      this.isDisabledFundamentoImpug = false;
      let impugDes = this.comboImpugnacion.find(
        item => item.value == this.datos.autoResolutorio
      )
      this.datos.impugnacionDesc = impugDes.label;
      this.getComboFundamentoImpug();
    } else {
      this.isDisabledFundamentoImpug = true;
      this.datos.sentidoAuto = "";
      this.datos.impugnacionDesc = null;
    }
  }
  getComboFundamentoImpug() {
    this.sigaServices.get("filtrosejg_comboFundamentoImpug").subscribe(
      n => {
        this.comboFundamentoImpug = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboFundamentoImpug);
        let fundImpug = this.comboFundamentoImpug.find(
          item => item.value == this.datos.sentidoAuto
        )
        if (fundImpug != undefined)
          this.fundImpugnacionDesc = fundImpug.label;
      }
    );
  }

  save() {
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_guardarImpugnacion", this.datos).subscribe(
      n => {
        this.progressSpinner = false;
        if (JSON.parse(n.body).error.code == 200) {
          //Para que se actualicen los estados presentados en la tarjeta de estados
          this.guardadoSend.emit(this.datos);
          
          let fundImpug = this.comboFundamentoImpug.find(
            item => item.value == this.datos.sentidoAuto
          )
          if (fundImpug != undefined)
            this.fundImpugnacionDesc = fundImpug.label;
          else this.fundImpugnacionDesc = "";
          let impug = this.comboImpugnacion.find(
            item => item.value == this.datos.autoResolutorio
          );
          if (impug != undefined){
            this.datosIniciales.impugnacionDesc = impug.label;
            this.datos.impugnacionDesc = impug.label;
          }
          this.datosIniciales = {...this.datos};
          //Output para que actualice los datos de la tarjeta resumen
          this.guardadoSend.emit(this.datos);
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
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

  checkPermisosConfirmRest() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.confirmRest();
    }
  }

  confirmRest() {
    this.confirmationService.confirm({
      message: this.translateService.instant("justiciaGratuita.ejg.message.restablecerImpugnacion"),
      icon: "fa fa-edit",
      key: "rest",
      accept: () => {
        this.rest()
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancelar",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  rest() {
    this.datos = {...this.datosIniciales};
    if(this.datos.fechaAuto!= null && this.datos.fechaAuto!= undefined){
      this.datos.fechaAuto = new Date(this.datos.fechaAuto);
    }
    if(this.datos.fechaPublicacion!= null && this.datos.fechaPublicacion!= undefined){
      this.datos.fechaPublicacion = new Date(this.datos.fechaPublicacion);
    }
  }

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    }
    else if (this.disabledSave()) {
      this.muestraCamposObligatorios()
    }
    else this.save();
  }

  disabledSave() {
    if (this.datos.autoResolutorio == null || this.datos.fechaAuto == null) return true;
    else return false;
  }

  fillFechaAuto(event) {
    if(event != null && !isNaN(Date.parse(event)))this.datos.fechaAuto = new Date(event);
  }

  fillFechaPublicacion(event) {
    if(event != null && !isNaN(Date.parse(event)))this.datos.fechaPublicacion = new Date(event);
  }

  onChangeCheckBis(event) {
    this.datos.bis = event;
  }

  onChangeCheckRT(event) {
    this.datos.requiereTurn = event;
  }

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatos = true;
  }
}
