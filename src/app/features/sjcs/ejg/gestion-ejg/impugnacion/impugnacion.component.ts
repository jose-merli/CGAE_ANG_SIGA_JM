import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
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
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaImpugnacion: string;

  openFicha: boolean = false;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  impugnacion: EJGItem;
  item: EJGItem;
  bodyInicial: EJGItem = new EJGItem();
  msgs = [];
  nuevo;
  comboFundamentoImpug = [];
  comboImpugnacion = [];
  checkmodificable: boolean = false;
  checkmodificableRT: boolean = false;
  
  fundImpugnacionDesc: String;
  isDisabledFundamentoImpug: boolean = false;

  resaltadoDatosGenerales: boolean = false;
  resaltadoDatos: boolean = false;

  fichaPosible = {
    key: "impugnacion",
    activa: false
  }

  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() newEstado = new EventEmitter();
  @Output() updateRes = new EventEmitter();
  @Input() openTarjetaImpugnacion;


  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    // this.getComboSentidoAuto();
    if (this.persistenceService.getDatos()) {
      this.nuevo = false;
      this.modoEdicion = true;
      this.impugnacion = this.persistenceService.getDatos();
      if (this.impugnacion.fechaAuto != undefined)
        this.impugnacion.fechaAuto = new Date(this.impugnacion.fechaAuto);
      if (this.impugnacion.fechaPublicacion != undefined)
        this.impugnacion.fechaPublicacion = new Date(this.impugnacion.fechaPublicacion);
      this.bodyInicial = JSON.parse(JSON.stringify(this.impugnacion));
    } else {
      this.nuevo = true;
      this.modoEdicion = false;
      this.impugnacion = new EJGItem();
    }
    this.getComboImpugnacion();
    this.getComboFundamentoImpug();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaImpugnacion == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  esFichaActiva(key) {

    return this.fichaPosible.activa;
  }
  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "impugnacion" &&
      !this.activacionTarjeta
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  getComboImpugnacion() {
    this.sigaServices.get("filtrosejg_comboImpugnacion").subscribe(
      n => {
        this.comboImpugnacion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboImpugnacion);
        let impug = this.comboImpugnacion.find(
          item => item.value == this.impugnacion.autoResolutorio
        );
        if (impug != undefined){
          this.bodyInicial.impugnacionDesc = impug.label;
          this.impugnacion.impugnacionDesc = impug.label;
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  onChangeImpugnacion() {
    this.comboFundamentoImpug = [];
    this.impugnacion.sentidoAuto = null;
    if (this.impugnacion.autoResolutorio != undefined) {
      this.isDisabledFundamentoImpug = false;
      let impugDes = this.comboImpugnacion.find(
        item => item.value == this.impugnacion.autoResolutorio
      )
      this.impugnacion.impugnacionDesc = impugDes.label;
      this.getComboFundamentoImpug();
    } else {
      this.isDisabledFundamentoImpug = true;
      this.impugnacion.sentidoAuto = "";
      this.impugnacion.impugnacionDesc = null;
    }
  }
  getComboFundamentoImpug() {
    this.sigaServices.get("filtrosejg_comboFundamentoImpug").subscribe(
      n => {
        this.comboFundamentoImpug = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboFundamentoImpug);
        let fundImpug = this.comboFundamentoImpug.find(
          item => item.value == this.impugnacion.sentidoAuto
        )
        if (fundImpug != undefined)
          this.fundImpugnacionDesc = fundImpug.label;
      },
      err => {
        console.log(err);
      }
    );
  }

  save() {
    this.progressSpinner = true;

    // this.impugnacion.nuevoEJG=!this.modoEdicion;

    this.sigaServices.post("gestionejg_guardarImpugnacion", this.impugnacion).subscribe(
      n => {
        this.progressSpinner = false;
        if (JSON.parse(n.body).error.code == 200) {
          //Para que se actualicen los estados presentados en la tarjeta de estados
          this.newEstado.emit(null);
          
          let fundImpug = this.comboFundamentoImpug.find(
            item => item.value == this.impugnacion.sentidoAuto
          )
          if (fundImpug != undefined)
            this.fundImpugnacionDesc = fundImpug.label;
          else this.fundImpugnacionDesc = "";
          let impug = this.comboImpugnacion.find(
            item => item.value == this.impugnacion.autoResolutorio
          );
          if (impug != undefined){
            this.bodyInicial.impugnacionDesc = impug.label;
            this.impugnacion.impugnacionDesc = impug.label;
          }
          this.bodyInicial = JSON.parse(JSON.stringify(this.impugnacion));
          this.persistenceService.setDatos(this.impugnacion);
          //Output para que actualice los datos de la tarjeta resumen
          this.updateRes.emit();
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }
        else {
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
    let mess = this.translateService.instant(
      "justiciaGratuita.ejg.message.restablecerImpugnacion"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
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
    this.impugnacion = JSON.parse(JSON.stringify(this.bodyInicial));
    this.impugnacion.fechaAuto = new Date(this.impugnacion.fechaAuto);
    this.impugnacion.fechaPublicacion = new Date(this.impugnacion.fechaPublicacion);
  }
  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    }
    else if (this.disabledSave()) {
      //this.msgs = this.commonsService.checkPermisoAccion();
      this.muestraCamposObligatorios()
    }
    else this.save();


  }

  disabledSave() {
    if (this.impugnacion.autoResolutorio == null || this.impugnacion.fechaAuto == null) return true;
    else return false;
  }

  fillFechaAuto(event) {
    if(event != null)this.impugnacion.fechaAuto = new Date(event);
  }
  fillFechaPublicacion(event) {
    if(event != null)this.impugnacion.fechaPublicacion = new Date(event);
  }
  onChangeCheckBis(event) {
    this.impugnacion.bis = event;
  }
  onChangeCheckRT(event) {
    this.impugnacion.requiereTurn = event;
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
