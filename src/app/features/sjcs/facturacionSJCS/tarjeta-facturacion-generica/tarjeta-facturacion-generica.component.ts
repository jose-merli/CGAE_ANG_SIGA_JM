import { ChangeDetectorRef, Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Table } from 'primeng/table';
import { SigaServices } from '../../../../_services/siga.service';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { FacturacionesAsuntoDTO } from '../../../../models/sjcs/FacturacionesAsuntoDTO';
import { Actuacion } from '../../oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/detalle-tarjeta-actuaciones-designa.component';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TarjetaAsistenciaItem } from '../../../../models/guardia/TarjetaAsistenciaItem';
import { ActuacionAsistenciaItem } from '../../../../models/guardia/ActuacionAsistenciaItem';
import { EJGItem } from '../../../../models/sjcs/EJGItem';
import { GuardiaItem } from '../../../../models/guardia/GuardiaItem';
import { DatosMovimientoVarioDTO } from '../../../../models/sjcs/DatosMovimientoVarioDTO';
import { CommonsService } from '../../../../_services/commons.service';
import { procesos_facturacionSJCS } from '../../../../permisos/procesos_facturacionSJCS';

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
  cantidad: number;
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
  selectedDatos: any[] = [];
  datos: any[] = [];
  cols = [];
  rowsPerPage = [];
  selectedItem: number = 10;
  selectionMode: string = "multiple";
  ejecutado: boolean = false;

  totalFacturado: number = 0;
  totalPagado: number = 0;

  permisoEscritura: boolean = false;

  readonly TIPOFACTURACION: string = this.translateService.instant("facturacionSJCS.tarjGenFac.facturacion");
  readonly TIPOPAGO: string = this.translateService.instant("facturacionSJCS.tarjGenFac.pago");
  readonly TIPOMOVIMIENTO: string = this.translateService.instant("facturacionSJCS.tarjGenFac.movVario");

  @ViewChild("table") tabla: Table;

  @Input() pantalla: string;
  @Input() datosEntrada: any;
  @Input() disableButtons: boolean = false;
  @Input() showTarjeta: boolean = false;
  @Output() guardarDatos = new EventEmitter<any>();
  @Output() opened = new EventEmitter<boolean>();
  @Output() idOpened = new EventEmitter<string>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private commonsService: CommonsService) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.tarjetaFacFenerica).then(respuesta => {

      this.permisoEscritura = respuesta;

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.getCols();
    }).catch(error => console.error(error));

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
    this.opened.emit(this.showTarjeta);
    this.idOpened.emit('facturaciones');
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
    if (event.data.tipo != this.TIPOMOVIMIENTO) {
      this.selectedDatos.pop();
    }
  }

  isSeleccionado(rowData): boolean {
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

    if (datosEntrada && !datosEntrada.isNew && this.checkCampo(datosEntrada.actuacion.idTurno) && this.checkCampo(datosEntrada.actuacion.anio)
      && this.checkCampo(datosEntrada.actuacion.numero) && this.checkCampo(datosEntrada.actuacion.numeroAsunto)) {
      return true;
    }

    if (Object.keys(datosEntrada.actuacion).length > 0 && !datosEntrada.isNew) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
    }

    return false;
  }

  getDatosActuacionDesigna() {

    this.ejecutado = true;

    if (this.checkPayloadActuacionDesigna(this.datosEntrada)) {

      const payload = {
        numeroasunto: this.datosEntrada.actuacion.numeroAsunto,
        numero: this.datosEntrada.actuacion.numero,
        anio: this.datosEntrada.actuacion.anio,
        idturno: this.datosEntrada.actuacion.idTurno
      };

      this.callService("tarjGenFac_getFacturacionesPorAsuntoActuacionDesigna", payload);
    }
  }

  checkPayloadAsistencia(datosEntrada: { asistencia: TarjetaAsistenciaItem, isNew: boolean }): boolean {

    if (datosEntrada && !datosEntrada.isNew && this.checkCampo(datosEntrada.asistencia.anio) && this.checkCampo(datosEntrada.asistencia.numero)) {
      return true;
    }

    if (Object.keys(datosEntrada.asistencia).length > 0 && !datosEntrada.isNew) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
    }

    return false;
  }

  getDatosAsistencia() {

    if (this.checkPayloadAsistencia(this.datosEntrada)) {

      const payload = {
        anio: this.datosEntrada.asistencia.anio,
        numero: this.datosEntrada.asistencia.numero
      };

      this.callService("tarjGenFac_getFacturacionesPorAsuntoAsistencia", payload);
    }
  }

  checkPayloadActuacionAsistencia(datosEntrada: { asistencia: TarjetaAsistenciaItem, actuacion: ActuacionAsistenciaItem, isNew: boolean }): boolean {

    if (datosEntrada && !datosEntrada.isNew && this.checkCampo(datosEntrada.asistencia.anio) && this.checkCampo(datosEntrada.asistencia.numero)
      && this.checkCampo(datosEntrada.actuacion.idActuacion)) {
      return true;
    }

    if (Object.keys(datosEntrada.actuacion).length > 0 && Object.keys(datosEntrada.asistencia).length > 0 && !datosEntrada.isNew) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
    }

    return false;
  }

  getDatosActuacionAsistencia() {

    this.ejecutado = true;

    if (this.checkPayloadActuacionAsistencia(this.datosEntrada)) {

      const payload = {
        anio: this.datosEntrada.asistencia.anio,
        numero: this.datosEntrada.asistencia.numero,
        idactuacion: this.datosEntrada.actuacion.idActuacion
      };

      this.callService("tarjGenFac_getFacturacionesPorAsuntoActuacionAsistencia", payload);
    }
  }

  checkPayloadGuardia(datosEntrada: GuardiaItem): boolean {

    console.log(datosEntrada);

    if (datosEntrada && this.checkCampo(datosEntrada.idTurno) && this.checkCampo(datosEntrada.idGuardia) && this.checkCampo(datosEntrada.idPersona) && this.checkCampo(datosEntrada.fechadesde)) {
      return true;
    }

    if (Object.keys(datosEntrada).length > 0) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
    }

    return false;
  }

  getDatosGuardia() {

    this.ejecutado = true;

    if (this.checkPayloadGuardia(this.datosEntrada)) {

      const payload = {
        idturno: this.datosEntrada.idTurno,
        idguardia: this.datosEntrada.idGuardia,
        idpersona: this.datosEntrada.idPersona,
        fechainicio: this.datosEntrada.fechadesde
      };

      this.callService("tarjGenFac_getFacturacionesPorGuardia", payload);
    }
  }

  checkPayloadEJG(datosEntrada: { ejg: EJGItem, isNew: boolean }): boolean {

    if (datosEntrada && !datosEntrada.isNew && this.checkCampo(datosEntrada.ejg.tipoEJG) && this.checkCampo(datosEntrada.ejg.annio) && this.checkCampo(datosEntrada.ejg.numero)) {
      return true;
    }

    if (Object.keys(datosEntrada.ejg).length > 0 && !datosEntrada.isNew) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
    }

    return false;
  }

  getDatosEJG() {

    this.ejecutado = true;

    if (this.checkPayloadEJG(this.datosEntrada)) {

      const payload = {
        idtipoejg: this.datosEntrada.ejg.tipoEJG,
        anio: this.datosEntrada.ejg.annio,
        numero: this.datosEntrada.ejg.numero
      };

      this.callService("tarjGenFac_getFacturacionesPorEJG", payload);
    }
  }

  checkCampo(campo: any): boolean {

    if (campo && campo != null && campo.toString().trim().length > 0) {
      return true;
    }

    return false;
  }

  callService(url: string, payload: any) {

    this.progressSpinner = true;

    this.sigaServices.post(url, payload).subscribe(
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

  procesaDatos() {

    let contador = 0;
    this.datos.forEach(el => {
      el.id = contador;
      contador++;
      if (el.importe && el.importe.toString().trim().length > 0) {
        if (el.tipo == this.TIPOFACTURACION) {
          this.totalFacturado += parseFloat(el.importe);
          if (el.datosPagoAsuntoDTOList && el.datosPagoAsuntoDTOList != null && el.datosPagoAsuntoDTOList.length > 0) {
            el.datosPagoAsuntoDTOList.forEach(el => {
              if (el.importe && el.importe.toString().trim().length > 0) {
                this.totalPagado += parseFloat(el.importe);
              }
            });
          }
        }

        if (el.tipo == this.TIPOMOVIMIENTO) {
          this.totalFacturado += parseFloat(el.importe);
          this.totalPagado += parseFloat(el.importe);
        }
      }

    });
  }

  openFicha(rowData) {
    this.guardarDatos.emit(true);
    sessionStorage.setItem("datosEdicionMovimiento", JSON.stringify(rowData));
    this.router.navigate(["/fichaMovimientosVarios"]);
  }

  async nuevo() {

    if (this.permisoEscritura && !this.disableButtons) {

      this.guardarDatos.emit(true);

      let datos: DatosParaMovimiento = null;
      const facturaciones = this.datos.filter(el => el.tipo == this.TIPOFACTURACION);
      let idPartidaPresupuestaria = "";
      let idFacturacion = "";
      let idGrupoFacturacion = "";

      if (facturaciones.length > 0) {
        idFacturacion = facturaciones[0].idObjeto;
        if (facturaciones[0].idPartidaPresupuestaria != null) {
          idPartidaPresupuestaria = facturaciones[0].idPartidaPresupuestaria
        }
      }

      if (this.pantalla == PANTALLAS.ACTUACIONDESIGNA) {

        const actuacionDesigna: Actuacion = JSON.parse(JSON.stringify(this.datosEntrada));

        if (this.checkCampo(actuacionDesigna.actuacion.idTurno)) {
          idGrupoFacturacion = await this.getAgrupacionTurno(actuacionDesigna.actuacion.idTurno).then(data => data.valor).catch(err => { console.log(err); });
        }

        datos = {
          colegiado: actuacionDesigna.actuacion.idPersonaColegiado,
          descripcion: `Designación ${actuacionDesigna.actuacion.anio}/${actuacionDesigna.actuacion.numero}/${actuacionDesigna.actuacion.numeroAsunto}-${this.checkCampo(actuacionDesigna.actuacion.nombreModulo) ? actuacionDesigna.actuacion.nombreModulo : ''}`,
          cantidad: (-this.totalFacturado),
          criterios: {
            idFacturacion: idFacturacion,
            idGrupoFacturacion: idGrupoFacturacion,
            idConcepto: '10',
            idPartidaPresupuestaria: idPartidaPresupuestaria
          }
        };
      }

      if (this.pantalla == PANTALLAS.ASISTENCIA) {

        const asistencia: { asistencia: TarjetaAsistenciaItem, isNew: boolean } = JSON.parse(JSON.stringify(this.datosEntrada));

        if (this.checkCampo(asistencia.asistencia.idTurno)) {
          idGrupoFacturacion = await this.getAgrupacionTurno(asistencia.asistencia.idTurno).then(data => data.valor).catch(err => { console.log(err); });
        }

        datos = {
          colegiado: asistencia.asistencia.idLetradoGuardia,
          descripcion: `Asistencia ${asistencia.asistencia.anio}/${asistencia.asistencia.numero}`,
          cantidad: (-this.totalFacturado),
          criterios: {
            idFacturacion: idFacturacion,
            idGrupoFacturacion: idGrupoFacturacion,
            idConcepto: '20',
            idPartidaPresupuestaria: idPartidaPresupuestaria
          }
        };
      }

      if (this.pantalla == PANTALLAS.ACTUACIONASISTENCIA) {

        const actuacionAsistencia: { asistencia: TarjetaAsistenciaItem, actuacion: ActuacionAsistenciaItem, isNew: boolean } = JSON.parse(JSON.stringify(this.datosEntrada));

        if (this.checkCampo(actuacionAsistencia.asistencia.idTurno)) {
          idGrupoFacturacion = await this.getAgrupacionTurno(actuacionAsistencia.asistencia.idTurno).then(data => data.valor).catch(err => { console.log(err); });
        }

        datos = {
          colegiado: actuacionAsistencia.asistencia.idPersonaJg,
          descripcion: `Actuación de asistencia ${actuacionAsistencia.asistencia.anio}/${actuacionAsistencia.asistencia.numero}/${actuacionAsistencia.actuacion.idActuacion}`,
          cantidad: (-this.totalFacturado),
          criterios: {
            idFacturacion: idFacturacion,
            idGrupoFacturacion: idGrupoFacturacion,
            idConcepto: '20',
            idPartidaPresupuestaria: idPartidaPresupuestaria
          }
        };
      }

      if (this.pantalla == PANTALLAS.GUARDIA) {

        const guardia: GuardiaItem = JSON.parse(JSON.stringify(this.datosEntrada));

        if (this.checkCampo(guardia.idTurno)) {
          idGrupoFacturacion = await this.getAgrupacionTurno(guardia.idTurno).then(data => data.valor).catch(err => { console.log(err); });
        }

        datos = {
          colegiado: guardia.idPersona,
          descripcion: `Guardia ${guardia.fechadesde}.${guardia.turno}>${guardia.nombre}`,
          cantidad: (-this.totalFacturado),
          criterios: {
            idFacturacion: idFacturacion,
            idGrupoFacturacion: idGrupoFacturacion,
            idConcepto: '20',
            idPartidaPresupuestaria: idPartidaPresupuestaria
          }
        };
      }

      if (this.pantalla == PANTALLAS.EJG) {

        const ejg: { ejg: EJGItem, isNew: boolean } = JSON.parse(JSON.stringify(this.datosEntrada));

        if (this.checkCampo(ejg.ejg.idTurno)) {
          idGrupoFacturacion = await this.getAgrupacionTurno(ejg.ejg.idTurno).then(data => data.valor).catch(err => { console.log(err); });
        }

        datos = {
          colegiado: ejg.ejg.idPersona,
          descripcion: "",
          cantidad: (-this.totalFacturado),
          criterios: {
            idFacturacion: idFacturacion,
            idGrupoFacturacion: idGrupoFacturacion,
            idConcepto: '40',
            idPartidaPresupuestaria: idPartidaPresupuestaria
          }
        };
      }

      sessionStorage.setItem("datosNuevoMovimiento", JSON.stringify(datos));
      this.router.navigate(["/fichaMovimientosVarios"]);

    }
  }

  getAgrupacionTurno(idTurno: string) {
    return this.sigaServices.getParam("facturacionsjcs_getAgrupacionDeTurnosPorTurno", `?idTurno=${idTurno}`).toPromise();
  }

  comfirmacionEliminar() {

    if (this.permisoEscritura && !this.disableButtons) {

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
  }

  eliminar() {

    if (this.permisoEscritura && !this.disableButtons) {

      let deleteList: DatosMovimientoVarioDTO[] = [];
      let notDeleteList: DatosMovimientoVarioDTO[] = [];

      this.selectedDatos.forEach(el => {
        if (el.numAplicaciones > 0) {
          notDeleteList.push(el);
        } else {
          deleteList.push(el);
        }
      });

      if (notDeleteList.length > 0) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacionSJCS.movimientosVarios.errorEliminarMov"));
      }

      this.callDeleteService(deleteList);

    }

  }

  callDeleteService(deleteList: DatosMovimientoVarioDTO[]) {

    if (this.permisoEscritura && !this.disableButtons) {

      this.progressSpinner = true;

      this.sigaServices.post("movimientosVarios_eliminarMovimiento", deleteList).subscribe(
        data => {
          const error = JSON.parse(data.body).error;

          if (error.status == 'KO' && error != null && error.description != null) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("messages.deleted.success"));
            this.getDatos(this.pantalla);
          }

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        }
      );

    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.datosEntrada != undefined && changes.datosEntrada.currentValue /*&& !this.ejecutado*/) {
      this.getDatos(this.pantalla);
    }
  }

}
