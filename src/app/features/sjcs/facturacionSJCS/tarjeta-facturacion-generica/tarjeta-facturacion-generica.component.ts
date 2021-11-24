import { ChangeDetectorRef, Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Table } from 'primeng/table';
import { SigaServices } from '../../../../_services/siga.service';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { FacturacionesAsuntoDTO } from '../../../../models/sjcs/FacturacionesAsuntoDTO';
import { Actuacion } from '../../oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/detalle-tarjeta-actuaciones-designa.component';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

export enum PANTALLAS {
  ACTUACIONDESIGNA = "ACTUACIONDESIGNA",
  ASISTENCIA = "ASISTENCIA",
  ACTUACIONASISTENCIA = "ACTUACIONASISTENCIA",
  GUARDIA = "GUARDIA",
  EJG = "EJG"
}

export interface DatosParaMovimiento {
  colegiado: string;
  descripcion: string;
  cantidad: string;
  criterios: any;
}

@Component({
  selector: 'app-tarjeta-facturacion-generica',
  templateUrl: './tarjeta-facturacion-generica.component.html',
  styleUrls: ['./tarjeta-facturacion-generica.component.scss']
})
export class TarjetaFacturacionGenericaComponent implements OnInit, OnChanges {

  msgs: any[] = [];
  progressSpinner: boolean = false;
  showTarjeta: boolean = false;
  selectedDatos: any[] = [];
  datos: any[] = [];
  cols = [];
  rowsPerPage = [];
  selectedItem: number = 10;
  selectionMode: string = "multiple";

  totalFacturado: number = 0;
  totalPagado: number = 0;

  @ViewChild("table") tabla: Table;

  @Input() pantalla: string;
  @Input() datosEntrada: any;
  @Input() payload: any;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit() {
    this.getCols();
  }

  getCols() {

    this.cols = [
      { field: "id", header: "facturacionSJCS.tarjGenFac.facPagMov", width: '10%' },
      { field: "tipo", header: "facturacionSJCS.tarjGenFac.tipo", width: '10%' },
      { field: "importe", header: "facturacionSJCS.tarjGenFac.importe", width: '10%' }
    ];

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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
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

  seleccionarFila(event) {
    if (event.data.tipo != "Movimiento vario") {
      this.selectedDatos.pop();
    }
  }

  isSeleccionado(rowData) {
    if (this.selectedDatos && this.selectedDatos != null && this.selectedDatos.find(el => el.id === rowData.id)) {
      return true;
    }
    return false;
  }

  getDatos(pantalla: string) {
    switch (pantalla) {
      case PANTALLAS.ACTUACIONDESIGNA:
        this.getDatosActuacionDesigna();
        break;
      case PANTALLAS.ASISTENCIA:
        this.getDatosAsistencia();
        break;
      case PANTALLAS.ACTUACIONASISTENCIA:
        this.getDatosActuacionAsistencia();
        break;
      case PANTALLAS.GUARDIA:
        this.getDatosGuardia();
        break;
      case PANTALLAS.EJG:
        this.getDatosEJG();
        break;
    }
  }

  checkPayloadActuacionDesigna(datosEntrada: Actuacion): boolean {

    if (datosEntrada && !datosEntrada.isNew && datosEntrada.actuacion.idTurno && datosEntrada.actuacion.idTurno != null && datosEntrada.actuacion.idTurno.toString().trim().length > 0
      && datosEntrada.actuacion.anio && datosEntrada.actuacion.anio != null && datosEntrada.actuacion.anio.toString().trim().length > 0
      && datosEntrada.actuacion.numero && datosEntrada.actuacion.numero != null && datosEntrada.actuacion.numero.toString().trim().length > 0
      && datosEntrada.actuacion.numeroAsunto && datosEntrada.actuacion.numeroAsunto != null && datosEntrada.actuacion.numeroAsunto.toString().trim().length > 0) {
      return true;
    }

    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));

    return false;
  }

  getDatosActuacionDesigna() {

    if (this.checkPayloadActuacionDesigna(this.datosEntrada)) {

      this.progressSpinner = true;

      const payload = {
        numeroasunto: this.datosEntrada.actuacion.numeroAsunto,
        numero: this.datosEntrada.actuacion.numero,
        anio: this.datosEntrada.actuacion.anio,
        idturno: this.datosEntrada.actuacion.idTurno
      };

      this.sigaServices.post("tarjGenFac_getFacturacionesPorAsuntoActuacionDesigna", payload).subscribe(
        data => {
          const resp: FacturacionesAsuntoDTO = JSON.parse(data.body);

          if (resp.error && resp.error != null && resp.error.description != null) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(resp.error.description.toString()));
          } else {
            if (resp.datosFacturacionAsuntoDTOList.length > 0) {
              this.datos = JSON.parse(JSON.stringify(resp.datosFacturacionAsuntoDTOList));
            }
            if (resp.datosMovimientoVarioDTO != null) {
              if (resp.datosFacturacionAsuntoDTOList.length > 0) {
                this.datos = this.datos.concat(JSON.parse(JSON.stringify(resp.datosMovimientoVarioDTO)));
              } else {
                this.datos = JSON.parse(JSON.stringify(resp.datosMovimientoVarioDTO));
              }
            }
            this.procesaDatos();
          }

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
  }

  checkPayloadAsistencia(): boolean {

    if (this.payload && this.payload.anio && this.payload.numero) {
      return true;
    }

    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));

    return false;
  }

  getDatosAsistencia() {

    if (this.checkPayloadAsistencia()) {

      this.progressSpinner = true;

      this.sigaServices.post("tarjGenFac_getFacturacionesPorAsuntoAsistencia", this.payload).subscribe(
        data => {
          const resp: FacturacionesAsuntoDTO = JSON.parse(data.body);

          if (resp.error && resp.error != null && resp.error.description != null) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(resp.error.description.toString()));
          } else {
            console.log("getDatosAsistencia() -> ", resp);
          }

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
  }

  checkPayloadActuacionAsistencia(): boolean {

    if (this.payload && this.payload.anio && this.payload.numero && this.payload.idactuacion) {
      return true;
    }

    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));

    return false;
  }

  getDatosActuacionAsistencia() {

    if (this.checkPayloadActuacionAsistencia()) {

      this.progressSpinner = true;

      this.sigaServices.post("tarjGenFac_getFacturacionesPorAsuntoActuacionAsistencia", this.payload).subscribe(
        data => {
          const resp: FacturacionesAsuntoDTO = JSON.parse(data.body);

          if (resp.error && resp.error != null && resp.error.description != null) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(resp.error.description.toString()));
          } else {
            console.log("getDatosActuacionAsistencia() -> ", resp);
          }

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
  }

  checkPayloadGuardia(): boolean {

    if (this.payload && this.payload.idturno && this.payload.idguardia && this.payload.idpersona && this.payload.fechainicio) {
      return true;
    }

    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));

    return false;
  }

  getDatosGuardia() {

    if (this.checkPayloadGuardia()) {

      this.progressSpinner = true;

      this.sigaServices.post("tarjGenFac_getFacturacionesPorGuardia", this.payload).subscribe(
        data => {
          const resp: FacturacionesAsuntoDTO = JSON.parse(data.body);

          if (resp.error && resp.error != null && resp.error.description != null) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(resp.error.description.toString()));
          } else {
            console.log("getDatosGuardia() -> ", resp);
          }

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
  }

  checkPayloadEJG(): boolean {

    if (this.payload && this.payload.idtipoejg && this.payload.anio && this.payload.numero) {
      return true;
    }

    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));

    return false;
  }

  getDatosEJG() {

    if (this.checkPayloadEJG()) {

      this.progressSpinner = true;

      this.sigaServices.post("tarjGenFac_getFacturacionesPorEJG", this.payload).subscribe(
        data => {
          const resp: FacturacionesAsuntoDTO = JSON.parse(data.body);

          if (resp.error && resp.error != null && resp.error.description != null) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(resp.error.description.toString()));
          } else {
            console.log("getDatosEJG() -> ", resp);
          }

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
  }

  procesaDatos() {

    let contador = 0;
    this.datos.forEach(el => {
      el.id = contador;
      contador++;
      if (el.importe && el.importe.toString().trim().length > 0) {
        if (el.tipo == 'Facturación') {
          this.totalFacturado += parseFloat(el.importe);
          if (el.datosPagoAsuntoDTOList && el.datosPagoAsuntoDTOList != null && el.datosPagoAsuntoDTOList.length > 0) {
            el.datosPagoAsuntoDTOList.forEach(el => {
              if (el.importe && el.importe.toString().trim().length > 0) {
                this.totalPagado += parseFloat(el.importe);
              }
            });
          }
        }

        if (el.tipo == 'Movimiento vario') {
          this.totalFacturado += parseFloat(el.importe);
          this.totalPagado += parseFloat(el.importe);
        }
      }

    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.datosEntrada != undefined && changes.datosEntrada.currentValue) {
      this.getDatos(this.pantalla);
    }
  }

  nuevo() {
    console.log("nuevo");
    this.router.navigate([""]);
  }

  openFicha() {


    let datos: DatosParaMovimiento = null;

    if (this.pantalla == PANTALLAS.ACTUACIONDESIGNA) {

      const actuacionDesigna: Actuacion = JSON.parse(JSON.stringify(this.datosEntrada));

      datos = {
        colegiado: actuacionDesigna.actuacion.idPersonaColegiado,
        descripcion: `Designación ${actuacionDesigna.actuacion.anio}/${actuacionDesigna.actuacion.numero}/${actuacionDesigna.actuacion.numeroAsunto}-${actuacionDesigna.actuacion.nombreModulo}`,
        cantidad: this.totalFacturado.toString(),
        criterios: ""
      };
    }

    sessionStorage.setItem("datosNuevoMovimiento", JSON.stringify(datos));
    this.router.navigate([""]);
  }

  comfirmacionEliminar() {
    let mess = this.translateService.instant(
      "messages.deleteConfirmation"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.eliminar();
      },
      reject: () => {
        this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

  eliminar() {

  }

}
