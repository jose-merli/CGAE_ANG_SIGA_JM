import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { USER_VALIDATIONS } from '../../../../../../properties/val-properties';
import { SigaWrapper } from '../../../../../../wrapper/wrapper.class';
import { ComboItem } from '../../../../../../models/ComboItem';
import { ConfirmationService } from 'primeng/primeng';
import { Error } from '../../../../../../models/Error';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { Router } from '@angular/router';
import { Enlace } from '../gestion-facturacion.component'

@Component({
  selector: 'app-conceptos-facturacion',
  templateUrl: './conceptos-facturacion.component.html',
  styleUrls: ['./conceptos-facturacion.component.scss']
})
export class ConceptosFacturacionComponent extends SigaWrapper implements OnInit, AfterViewInit {

  progressSpinnerConceptos: boolean = false;
  cols;
  msgs;
  showFichaConceptos: boolean = false;
  rowsPerPage: any = [];
  buscadores = [];
  selectedItem: number = 10;
  selectedDatos = [];
  numSelected = 0;
  selectAll: boolean = false;
  selectionMode: string = "multiple";
  numCriterios: number = 0;

  body = [];
  bodyAux = [];
  bodyUpdate = new Set();

  importeTotal;
  importePendiente;

  permisos;

  //COMBOS
  conceptos: ComboItem;
  grupoTurnos: ComboItem;

  @Input() cerrada;
  @Input() idFacturacion;
  @Input() idEstadoFacturacion;
  @Input() modoEdicion;

  @Output() changeNumCriterios = new EventEmitter<number>();
  @Output() editing = new EventEmitter<boolean>();
  @Output() addEnlace = new EventEmitter<Enlace>();

  @ViewChild("tabla") tabla;

  constructor(private sigaService: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonsService: CommonsService,
    private confirmationService: ConfirmationService,
    private persistenceService: PersistenceService,
    private router: Router) {
    super(USER_VALIDATIONS);
  }

  ngOnInit() {

    this.progressSpinnerConceptos = false;

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaFacTarjetaConceptosFac).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.comboConceptos();
      this.comboGruposTurnos();
      this.cargaDatos();
      this.getCols();

    }).catch(error => console.error(error));

  }

  comboConceptos() {
    this.progressSpinnerConceptos = true;

    this.sigaService.get("combo_comboFactConceptos").subscribe(
      data => {
        this.conceptos = data.combooItems;
        this.commonsService.arregloTildesCombo(this.conceptos);
        this.progressSpinnerConceptos = false;
      },
      err => {
        console.log(err);
        this.progressSpinnerConceptos = false;
      }
    );
  }

  comboGruposTurnos() {
    this.progressSpinnerConceptos = true;

    this.sigaService.get("combo_grupoFacturacion").subscribe(
      data => {
        this.grupoTurnos = data.combooItems;
        this.commonsService.arregloTildesCombo(this.grupoTurnos);
        this.progressSpinnerConceptos = false;
      },
      err => {
        console.log(err);
        this.progressSpinnerConceptos = false;
      }
    );
  }

  cargaDatos() {
    if (undefined != this.idFacturacion) {
      this.progressSpinnerConceptos = true;
      //datos de la facturación
      this.sigaService.getParam("facturacionsjcs_tarjetaConceptosfac", "?idFacturacion=" + this.idFacturacion).subscribe(
        data => {
          let datos = data.facturacionItem;
          let importeTotal = 0;
          let importePendiente = 0;
          const importesConHitosNoRepetidos: { idConcepto: string, importeTotal: number, importePendiente: number }[] = [];

          if (undefined != data.facturacionItem && data.facturacionItem.length > 0) {

            datos.forEach(element => {
              if (element.importeTotal != undefined) {
                element.importeTotalFormat = element.importeTotal.replace(".", ",");

                if (element.importeTotalFormat[0] == '.' || element.importeTotalFormat[0] == ',') {
                  element.importeTotalFormat = "0".concat(element.importeTotalFormat)
                }
              } else {
                element.importeTotalFormat = 0;
              }

              if (element.importePendiente != undefined) {
                element.importePendienteFormat = element.importePendiente.replace(".", ",");

                if (element.importePendienteFormat[0] == '.' || element.importePendienteFormat[0] == ',') {
                  element.importePendienteFormat = "0".concat(element.importePendienteFormat)
                }
              } else {
                element.importePendienteFormat = 0;
              }

              element.idGrupoOld = element.idGrupo;
              element.idConceptoOld = element.idConcepto;


              if (importesConHitosNoRepetidos.find(el => el.idConcepto == element.idConcepto) == undefined) {
                importesConHitosNoRepetidos.push({
                  idConcepto: element.idConcepto,
                  importeTotal: (element.importeTotal && element.importeTotal.length > 0) ? parseFloat(element.importeTotal) : 0,
                  importePendiente: (element.importePendiente && element.importePendiente.length > 0) ? parseFloat(element.importePendiente) : 0
                });
              }

            });
          }

          importesConHitosNoRepetidos.forEach(el => {
            importeTotal += el.importeTotal;
            importePendiente += el.importePendiente;
          });

          this.body = JSON.parse(JSON.stringify(datos));
          this.bodyAux = JSON.parse(JSON.stringify(datos));
          this.bodyUpdate = new Set();
          this.numCriterios = datos.length;
          this.importeTotal = importeTotal;
          this.importePendiente = importePendiente;
          this.changeNumCriterios.emit(this.numCriterios);
          this.progressSpinnerConceptos = false;
        },
        err => {
          console.log(err);
          this.progressSpinnerConceptos = false;
        }
      );
    }
  }

  seleccionaFila(evento) {

    if (undefined == evento.data.idConcepto || undefined == evento.data.idGrupo || null == evento.data.idConcepto || null == evento.data.idGrupo || this.idEstadoFacturacion != '10' || (undefined != evento.data.nuevo && evento.data.nuevo)) {
      this.selectedDatos.pop()
    }

    this.numSelected = this.selectedDatos.length;

  }

  disabled() {
    if (this.modoEdicion && this.idEstadoFacturacion == '10') {
      return false;
    } else {
      return true;
    }
  }

  eliminar() {
    if (!this.cerrada && undefined != this.selectedDatos && this.selectedDatos.length > 0) {
      let mess = this.translateService.instant(
        "messages.deleteConfirmation"
      );
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.callServiceEliminar();
        },
        reject: () => {
          this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
        }
      });
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    }
  }

  callServiceEliminar() {
    this.progressSpinnerConceptos = true;

    if (undefined != this.selectedDatos && this.selectedDatos.length > 0) {
      this.sigaService.post("facturacionsjcs_deleteConceptosFac", this.selectedDatos).subscribe(
        data => {

          this.progressSpinnerConceptos = false;

          const resp = JSON.parse(data.body);
          const error: Error = resp.error;

          if (resp.status == 'KO') {

            if (undefined != error && null != error && null != error.description != null) {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            }

          } else if (resp.status == 'OK') {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }

          this.selectedDatos = [];
          this.selectAll = false;
          this.cargaDatos();
          this.progressSpinnerConceptos = false;
        },
        err => {
          this.progressSpinnerConceptos = false;

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
  }

  disabledEliminar() {
    if (this.modoEdicion && this.idEstadoFacturacion == '10') {
      if (!this.hayModificaciones() && (this.selectedDatos.length > 0 || this.selectAll)) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  restablecer() {
    if (this.modoEdicion && this.idEstadoFacturacion == '10' && this.hayModificaciones()) {
      this.body = JSON.parse(JSON.stringify(this.bodyAux));
      this.bodyUpdate = new Set();

      this.tabla.sortOrder = 0;
      this.tabla.sortField = '';
      this.tabla.reset();
      this.buscadores = this.buscadores.map(it => it = "");
      this.selectedDatos = [];
      this.numSelected = this.selectedDatos.length;
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    }
  }

  disabledRestablecer() {
    if (this.modoEdicion && this.idEstadoFacturacion == '10' && this.hayModificaciones()) {
      return false;
    } else {
      return true;
    }
  }

  guardar() {

    let error = false;
    let nuevos = this.body.filter(el => undefined != el.nuevo && el.nuevo);
    let arrayNews = [];
    let arrayUpdate = [];

    // Comprobamos que los datos obligatorios de los nuevos registros esten completados
    if (nuevos) {

      if (Array.isArray(nuevos)) {
        arrayNews = nuevos.slice();
      } else {
        arrayNews.push(JSON.parse(JSON.stringify(nuevos)));
      }

      arrayNews.forEach(element => {
        if (undefined == element.idConcepto || null == element.idConcepto || undefined == element.idGrupo || null == element.idGrupo) {
          error = true;
        }
      });
    }

    // Comprobamos que los datos obligatorios de los registros editados esten completados
    if (!error && this.bodyUpdate) {
      arrayUpdate = Array.from(this.bodyUpdate);

      if (arrayUpdate) {
        arrayUpdate.forEach(element => {
          if (undefined == element.idConcepto || null == element.idConcepto || undefined == element.idGrupo || null == element.idGrupo) {
            error = true;
          }
        });
      }
    }

    if (error) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacionSJCS.facturacionesYPagos.fichaFac.error.criterios"));
    } else {

      if (arrayNews.length > 0) {
        this.callServiceGuardar("facturacionsjcs_saveConceptosFac", arrayNews);
      }

      if (arrayUpdate.length > 0) {
        this.callServiceGuardar("facturacionsjcs_updateConceptosFac", arrayUpdate);
      }

    }
  }

  callServiceGuardar(url, data) {
    this.progressSpinnerConceptos = true;

    this.sigaService.post(url, data).subscribe(
      data => {

        const resp = JSON.parse(data.body);
        const error: Error = resp.error;

        if (resp.status == 'KO') {

          if (undefined != error && null != error && null != error.description != null) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }

        } else if (resp.status == 'OK') {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }

        this.cargaDatos();

        this.progressSpinnerConceptos = false;
      },
      err => {
        this.progressSpinnerConceptos = false;

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

  disabledGuardar() {
    if (this.modoEdicion && this.idEstadoFacturacion == '10' && this.hayModificaciones()) {
      return false;
    } else {
      return true;
    }
  }

  nuevo() {
    if (this.modoEdicion && this.idEstadoFacturacion == '10') {
      this.tabla.sortOrder = 0;
      this.tabla.sortField = '';
      this.tabla.reset();

      if (undefined == this.body || null == this.body || this.body.length < 1) {
        this.body = [];
      }

      let concepto = {
        idConcepto: undefined,
        idGrupo: undefined,
        importeTotal: "0",
        importePendiente: "0",
        nuevo: true,
        idFacturacion: this.idFacturacion
      };

      if (this.body.length == 0) {
        this.body.push(concepto);
      } else {
        this.body = [concepto, ...this.body];
      }

    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    }
  }

  disabledNuevo() {
    if (this.modoEdicion && this.idEstadoFacturacion == '10') {
      return false;
    } else {
      return true;
    }
  }

  changeCombo(dato) {

    if (undefined == dato.nuevo) {
      this.bodyUpdate.add(dato);
    }
  }

  onHideDatosGenerales() {

    if (this.modoEdicion) {
      this.showFichaConceptos = !this.showFichaConceptos;
    }

    if (undefined != this.persistenceService.getPermisos()) {
      this.permisos = this.persistenceService.getPermisos();
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
  }

  onChangeSelectAll() {
    if (this.selectAll === true && !this.disabled()) {
      this.selectedDatos = this.body;
      this.numSelected = this.body.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
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

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {
    this.cols = [
      { field: "descConcepto", header: "facturacionSJCS.facturacionesYPagos.conceptos" },
      { field: "descGrupo", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.grupoTurnos" },
      { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.importe" },
      { field: "importePendiente", header: "facturacionSJCS.facturacionesYPagos.importePendiente" }
    ];

    this.cols.forEach(it => this.buscadores.push(""));
    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  hayModificaciones() {

    if (JSON.stringify(this.body) === JSON.stringify(this.bodyAux)) {
      this.editing.emit(false);
      return false;
    }
    this.editing.emit(true);
    return true;
  }

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaFactConceptosFac',
      ref: document.getElementById('facSJCSFichaFactConceptosFac')
    };

    this.addEnlace.emit(enlace);
  }

}
