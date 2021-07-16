import { Component, OnInit, EventEmitter, ViewChild, Input, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FacturacionItem } from '../../../../../../models/sjcs/FacturacionItem';
import { ComboItem } from '../../../../../../models/ComboItem';
import { USER_VALIDATIONS } from '../../../../../../properties/val-properties';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { SigaWrapper } from "../../../../../../wrapper/wrapper.class";
import { ConfirmationService } from 'primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos-facturacion',
  templateUrl: './datos-facturacion.component.html',
  styleUrls: ['./datos-facturacion.component.scss']
})
export class DatosFacturacionComponent extends SigaWrapper implements OnInit {

  @Input() cerrada;
  @Input() idFacturacion;
  @Input() idEstadoFacturacion;
  @Input() modoEdicion;
  @Input() numCriterios;
  @Input() editingConceptos: boolean;

  @Output() changeCerrada = new EventEmitter<boolean>();
  @Output() changeModoEdicion = new EventEmitter<boolean>();
  @Output() changeEstadoFacturacion = new EventEmitter<String>();
  @Output() changeIdFacturacion = new EventEmitter<String>();

  permisos;
  showFichaFacturacion: boolean = true;
  progressSpinnerDatos: boolean = false;
  checkRegularizar: boolean = false;
  checkVisible: boolean = false;
  checkRegularizarInicial: boolean = false;
  checkVisibleInicial: boolean = false;
  selectedItem: number = 10;
  minDate: Date;

  body: FacturacionItem = new FacturacionItem();
  bodyAux: FacturacionItem = new FacturacionItem();

  partidaPresupuestaria: ComboItem;
  estadosFacturacion = [];
  cols;
  msgs;

  @ViewChild("table") tabla;

  constructor(private sigaService: SigaServices,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router) {
    super(USER_VALIDATIONS);
  }

  ngOnInit() {

    this.getCols();

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaFacTarjetaDatosFac).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.comboPartidasPresupuestarias();

      if (undefined == this.idFacturacion) {
        this.body = new FacturacionItem();
        this.bodyAux = new FacturacionItem();
        this.showFichaFacturacion = true;
      } else {
        this.cargaDatos();
        this.showFichaFacturacion = false;
      }

    }).catch(error => console.error(error));
  }

  cargaDatos() {
    this.progressSpinnerDatos = true;

    //datos de la facturación
    this.sigaService.getParam("facturacionsjcs_datosfacturacion", "?idFacturacion=" + this.idFacturacion).subscribe(
      data => {
        this.body = new FacturacionItem();

        if (undefined != data.facturacionItem && data.facturacionItem.length > 0) {
          let datos = data.facturacionItem[0];
          this.body = JSON.parse(JSON.stringify(datos));

          if (undefined != data.facturacionItem[0].fechaDesde) {
            this.body.fechaDesde = new Date(data.facturacionItem[0].fechaDesde);
          }

          if (undefined != data.facturacionItem[0].fechaHasta) {
            this.body.fechaHasta = new Date(data.facturacionItem[0].fechaHasta);
            this.minDate = new Date(data.facturacionItem[0].fechaDesde);
          }

          if (undefined != data.facturacionItem[0].fechaEstado) {
            this.body.fechaEstado = new Date(data.facturacionItem[0].fechaEstado);
          }

          if (undefined != data.facturacionItem[0].regularizacion) {
            if (data.facturacionItem[0].regularizacion == '1') {
              this.checkRegularizar = true;
              this.checkRegularizarInicial = true;
            } else {
              this.checkRegularizar = false;
              this.checkRegularizarInicial = false;
            }
          }

          if (undefined != data.facturacionItem[0].visible) {
            if (data.facturacionItem[0].visible == '1') {
              this.checkVisible = true;
              this.checkVisibleInicial = true;
            } else {
              this.checkVisible = false;
              this.checkVisibleInicial = false;
            }
          }

          this.bodyAux = new FacturacionItem();
          this.bodyAux = JSON.parse(JSON.stringify(datos));

          if (undefined != data.facturacionItem[0].fechaDesde) {
            this.bodyAux.fechaDesde = new Date(data.facturacionItem[0].fechaDesde);
          }

          if (undefined != data.facturacionItem[0].fechaHasta) {
            this.bodyAux.fechaHasta = new Date(data.facturacionItem[0].fechaHasta);
            this.minDate = new Date(data.facturacionItem[0].fechaDesde);
          }

          if (undefined != data.facturacionItem[0].fechaEstado) {
            this.bodyAux.fechaEstado = new Date(data.facturacionItem[0].fechaEstado);
          }
        }
        this.progressSpinnerDatos = false;
      },
      err => {
        if (null != err.error) {
          console.log(err.error);
        }
        this.progressSpinnerDatos = false;
      }
    );

    this.historicoEstados();
  }

  historicoEstados() {
    let idFac;

    if (this.modoEdicion) {
      idFac = this.idFacturacion;
    } else if (!this.modoEdicion && undefined != this.body.idFacturacion) {
      idFac = this.body.idFacturacion;
    }

    if (undefined != idFac) {
      this.progressSpinnerDatos = true;

      this.sigaService.getParam("facturacionsjcs_historicofacturacion", "?idFacturacion=" + idFac).subscribe(
        data => {
          this.estadosFacturacion = data.facturacionItem;
          this.progressSpinnerDatos = false;
        },
        err => {
          if (null != err.error) {
            console.log(err.error);
          }
          this.progressSpinnerDatos = false;
        }
      );
    }
  }

  comboPartidasPresupuestarias() {
    this.progressSpinnerDatos = true;

    this.sigaService.getParam("combo_partidasPresupuestarias", "?importe=1").subscribe(
      data => {
        this.partidaPresupuestaria = data.combooItems;
        this.commonsService.arregloTildesCombo(this.partidaPresupuestaria);
        this.progressSpinnerDatos = false;
      },
      err => {
        if (null != err.error) {
          console.log(err.error);
        }
        this.progressSpinnerDatos = false;
      }
    );
  }

  save() {
    let url = "";
    if ((!this.cerrada && JSON.stringify(this.body) != JSON.stringify(this.bodyAux) && this.body.nombre.trim() != "") || (this.checkRegularizar != this.checkRegularizarInicial) || (this.checkVisible != this.checkVisibleInicial)) {

      if ((undefined != this.body.nombre && this.body.nombre.trim() != "") && (undefined != this.body.idPartidaPresupuestaria) && (undefined != this.body.fechaDesde) && (undefined != this.body.fechaHasta)) {
        if (undefined == this.body.regularizacion) {
          this.body.regularizacion = "0";
        }

        if (this.checkRegularizar) {
          this.body.regularizacion = "1";
        } else {
          this.body.regularizacion = "0";
        }

        if (this.checkVisible) {
          this.body.visible = "1";
        } else {
          this.body.visible = "0";
        }

        if (undefined == this.body.visible) {
          this.body.regularizacion = "0";
        }

        if (!this.modoEdicion) {
          url = "facturacionsjcs_saveFacturacion";
          this.body.prevision = "0";
          this.callSaveService(url);
        } else {
          url = "facturacionsjcs_updateFacturacion";
          this.callSaveService(url);
        }
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
      }


    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    }
  }

  callSaveService(url) {
    this.progressSpinnerDatos = true;
    this.sigaService.post(url, this.body).subscribe(
      data => {
        if (!this.modoEdicion) {
          this.body.idFacturacion = JSON.parse(data.body).id;

          this.changeModoEdicion.emit(true);
        }

        this.checkRegularizarInicial = this.checkRegularizar;
        this.checkVisibleInicial = this.checkVisible;

        this.bodyAux = new FacturacionItem();
        this.bodyAux = JSON.parse(JSON.stringify(this.body));

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

        this.changeIdFacturacion.emit(this.body.idFacturacion);
        this.changeEstadoFacturacion.emit("10");
        this.changeCerrada.emit(false);
        this.historicoEstados();
        this.progressSpinnerDatos = false;
      },
      err => {
        this.progressSpinnerDatos = false;

        if (err.status == '403' || err.status == 403) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        } else {

          if (null != err.error && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }

        }
      }
    );
  }

  ejecutar() {
    if ((this.modoEdicion && this.idEstadoFacturacion == "10") || (this.modoEdicion && this.idEstadoFacturacion == "20")) {
      if (this.numCriterios == 0) {
        let mess = this.translateService.instant(
          "facturacionSJCS.facturacionesYPagos.mensaje.noConceptos"
        );
        let icon = "fa fa-edit";
        this.confirmationService.confirm({
          message: mess,
          icon: icon,
          accept: () => {
            this.callEjecutarService();
          },
          reject: () => {
            this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
          }
        });
      } else {
        this.callEjecutarService();
      }
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    }
  }

  callEjecutarService() {
    this.progressSpinnerDatos = true;

    this.sigaService.post("facturacionsjcs_ejecutarfacturacion", this.body.idFacturacion).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

        this.changeEstadoFacturacion.emit("50");
        this.changeCerrada.emit(true);
        this.historicoEstados();
        this.progressSpinnerDatos = false;
      },
      err => {

        this.progressSpinnerDatos = false;

        if (err.status == '403' || err.status == 403) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        } else {

          if (null != err.error && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }

        }
      },
    );
  }

  reabrir() {
    if (this.modoEdicion && this.idEstadoFacturacion == "20") {
      this.callReabrirService();
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    }
  }

  callReabrirService() {
    this.progressSpinnerDatos = true;

    this.sigaService.post("facturacionsjcs_reabrirfacturacion", this.body.idFacturacion).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

        this.historicoEstados();
        this.changeEstadoFacturacion.emit("10");
        this.changeCerrada.emit(false);
        this.progressSpinnerDatos = false;
      },
      err => {
        this.progressSpinnerDatos = false;

        if (err.status == '403' || err.status == 403) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        } else {

          if (JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }

        }
      }
    );
  }

  simular() {
    if (this.modoEdicion && this.idEstadoFacturacion == "10") {
      this.callSimularService();
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    }
  }

  callSimularService() {
    this.progressSpinnerDatos = true;

    this.sigaService.post("facturacionsjcs_simularfacturacion", this.body.idFacturacion).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

        this.historicoEstados();
        this.changeEstadoFacturacion.emit("50");
        this.changeCerrada.emit(true);
        this.progressSpinnerDatos = false;
      },
      err => {
        this.progressSpinnerDatos = false;

        if (err.status == '403' || err.status == 403) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        } else {

          if (null != err.error && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }

        }
      }
    );
  }
  disabledSimular() {
    if (this.modoEdicion && this.idEstadoFacturacion == "10" && !this.editingConceptos && this.disabledRestablecer()) {
      return false;
    } else {
      return true;
    }
  }

  disabledReabrir() {
    if ((this.modoEdicion && this.idEstadoFacturacion == "20") && this.disabledRestablecer()) {
      return false;
    } else {
      return true;
    }
  }

  disabledEjecutar() {
    if (((this.modoEdicion && this.idEstadoFacturacion == "10") || (this.modoEdicion && this.idEstadoFacturacion == "20")) && !this.editingConceptos && this.disabledRestablecer()) {
      return false;
    } else {
      return true;
    }
  }

  disabledSave() {
    if (this.modoEdicion) {

      if ((JSON.stringify(this.body) != JSON.stringify(this.bodyAux) || this.checkRegularizarInicial != this.checkRegularizar || this.checkVisibleInicial != this.checkVisible) && (undefined != this.body.nombre && this.body.nombre.trim() != "") && (undefined != this.body.idPartidaPresupuestaria) && (undefined != this.body.fechaDesde) && (undefined != this.body.fechaHasta) && (this.idEstadoFacturacion == "10" || this.idEstadoFacturacion == "50")) {
        return false;
      } else {
        return true;
      }
    } else {
      if ((undefined != this.body.nombre && this.body.nombre.trim() != "") && (undefined != this.body.idPartidaPresupuestaria) && (undefined != this.body.fechaDesde) && (undefined != this.body.fechaHasta)) {
        return false;
      } else {
        return true;
      }
    }
  }

  disabledRestablecer() {
    if (this.modoEdicion) {
      if ((JSON.stringify(this.body) != JSON.stringify(this.bodyAux) || this.checkRegularizarInicial != this.checkRegularizar || this.checkVisibleInicial != this.checkVisible) && (this.idEstadoFacturacion == "10" || this.idEstadoFacturacion == "50")) {
        return false;
      } else {
        return true;
      }
    } else {
      if ((undefined != this.body.nombre && this.body.nombre.trim() != "") || (undefined != this.body.idPartidaPresupuestaria) || (undefined != this.body.fechaDesde) || (undefined != this.body.fechaHasta || this.checkRegularizarInicial != this.checkRegularizar || this.checkVisibleInicial != this.checkVisible)) {
        return false;
      } else {
        return true;
      }
    }
  }

  restablecer() {
    if ((JSON.stringify(this.body) != JSON.stringify(this.bodyAux) || this.checkRegularizarInicial != this.checkRegularizar || this.checkVisibleInicial != this.checkVisible)) {
      if (!this.modoEdicion) {
        this.body = new FacturacionItem();
        this.checkRegularizar = false;
        this.checkVisible = false;
        this.estadosFacturacion = [];
        this.changeCerrada.emit(false);
      } else {
        if (this.idEstadoFacturacion == "10" || this.idEstadoFacturacion == "50") {
          this.body = JSON.parse(JSON.stringify(this.bodyAux));

          if (undefined != this.body) {

            if (undefined != this.body.fechaDesde) {
              this.body.fechaDesde = new Date(this.bodyAux.fechaDesde);
            }

            if (undefined != this.body.fechaHasta) {
              this.body.fechaHasta = new Date(this.bodyAux.fechaHasta);
              this.minDate = new Date(this.body.fechaDesde);
            }

            if (undefined != this.body.fechaEstado) {
              this.body.fechaEstado = new Date(this.bodyAux.fechaEstado);
            }

            if (undefined != this.body.regularizacion) {
              if (this.body.regularizacion == '1') {
                this.checkRegularizar = true;
              } else {
                this.checkRegularizar = false;
              }
            }

            if (undefined != this.body.visible) {
              if (this.body.visible == '1') {
                this.checkVisible = true;
              } else {
                this.checkVisible = false;
              }
            }
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
          }
        }
      }
    }
  }

  getCols() {
    this.cols = [
      { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado" },
      { field: "desEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado" },
      { field: "nombreUsuModificacion", header: "facturacionSJCS.facturacionesYPagos.usuario" },
    ];
  }

  onHideDatosGenerales() {
    this.showFichaFacturacion = !this.showFichaFacturacion;
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

  fillFechaDesde(event) {
    this.body.fechaDesde = event;
    if (this.body.fechaHasta < this.body.fechaDesde) {
      this.body.fechaHasta = undefined;
    }
    this.minDate = this.body.fechaDesde;
  }

  fillFechaHasta(event) {
    this.body.fechaHasta = event;
  }

  marcarObligatorio(tipoCampo: string, valor) {
    let resp = false;

    if (tipoCampo == 'input' && (valor == undefined || valor == null || valor.trim().length == 0)) {
      resp = true;
    }

    if (tipoCampo == 'select' && (valor == undefined || valor == null)) {
      resp = true;
    }

    if (tipoCampo == 'datePicker' && (valor == undefined || valor == null || valor == '')) {
      resp = true;
    }

    return resp;
  }

  getTextEstadoFac(): string {

    let resp: string;

    switch (this.idEstadoFacturacion) {
      case '10':
        resp = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado.abierta");
        break;
      case '20':
        resp = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado.ejecutada");
        break;
      case '30':
        resp = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado.cerrada");
        break;
      case '40':
        resp = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado.ejecucion");
        break;
      case '50':
        resp = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado.programada");
        break;
      case '60':
        resp = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado.valnocorrecta");
        break;
      case '70':
        resp = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado.envnoaceptado");
        break;
      case '80':
        resp = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado.envnodisponible");
        break;
      case '90':
        resp = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado.envenproceso");
        break;
      default: resp = '';
    }

    return resp;
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

}
