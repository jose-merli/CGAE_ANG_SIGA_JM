import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { RetencionesRequestDto } from '../../../../../../models/sjcs/RetencionesRequestDTO';
import { Enlace } from '../ficha-retencion-judicial.component'
import { SigaServices } from '../../../../../../_services/siga.service';
import { RetencionesService } from '../../retenciones.service';
import { RetencionObject } from '../../../../../../models/sjcs/RetencionObject';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { RetencionItem } from '../../../../../../models/sjcs/RetencionItem';
import { SelectItem } from 'primeng/primeng';
import { CommonsService } from '../../../../../../_services/commons.service';
import { Colegiado } from '../tarjeta-colegiado/tarjeta-colegiado.component';
import { DatePipe } from '@angular/common';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { Router } from '@angular/router';
import { SigaStorageService } from '../../../../../../siga-storage.service';

@Component({
  selector: 'app-tarjeta-datos-retencion',
  templateUrl: './tarjeta-datos-retencion.component.html',
  styleUrls: ['./tarjeta-datos-retencion.component.scss']
})
export class TarjetaDatosRetencionComponent implements OnInit, AfterViewInit {

  showTarjeta: boolean = false;
  comboTiposRetencion: SelectItem[] = [];
  comboDestinatarios: SelectItem[] = [];
  body: RetencionItem = new RetencionItem();
  bodyAux: RetencionItem = new RetencionItem();
  progressSpinner: boolean = false;
  expRegImporte: RegExp = /^\d{1,10}(\.\d{1,2})?$/;
  expRegPorcentaje: RegExp = /^\d{1,2}(\.\d{1,2})?$/;
  disabledImporte: boolean = true;
  minDate: Date;
  permisoEscritura: boolean;

  @Input() colegiado: Colegiado;

  @Output() addEnlace = new EventEmitter<Enlace>();
  @Output() showMessage = new EventEmitter<any>();
  @Output() retencionEvent = new EventEmitter<RetencionItem>();

  disableEliminar:boolean = false;
  isLetrado: boolean = false;
  constructor(private sigaServices: SigaServices,
    private retencionesService: RetencionesService,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private datePipe: DatePipe,
    private router: Router,
    private sigaStorageService: SigaStorageService) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaRetTarjetaDatosRetencion).then(respuesta => {

      this.permisoEscritura = respuesta;

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.getComboTiposRetencion();
      this.getComboDestinatarios();

    }).catch(error => console.error(error));

    this.isLetrado = this.sigaStorageService.isLetrado;
console.log(this.showTarjeta);
 console.log(this.permisoEscritura);
 console.log(this.isLetrado);
  }

  getDataInicial() {
    if (this.retencionesService.modoEdicion) {
      this.getRetencion(this.retencionesService.retencion.idRetencion);
    } else {
      this.showTarjeta = true;
    }
  }

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaRetDatRetJud',
      ref: document.getElementById('facSJCSFichaRetDatRetJud')
    };

    this.addEnlace.emit(enlace);
  }

  onHideTarjeta() {
    if (this.retencionesService.modoEdicion) {
      this.showTarjeta = !this.showTarjeta;
    } else {
      this.showTarjeta = true;
    }
  }

  getRetencion(idRetencion: string) {
    const retencionesRequestDto: RetencionesRequestDto = new RetencionesRequestDto();
    retencionesRequestDto.idRetenciones = idRetencion;
    this.sigaServices.post("retenciones_buscarRetencion", retencionesRequestDto).subscribe(
      data => {
        const res: RetencionObject = JSON.parse(data.body);

        if (res.error && null != res.error && null != res.error.description) {
          this.showMessage.emit({
            severity: "error",
            summary: this.translateService.instant("general.message.incorrect"),
            detail: this.translateService.instant(res.error.description.toString())
          });
        } else {
          Object.assign(this.body, res.retencion);
          Object.assign(this.bodyAux, res.retencion);

          const datosRetencionTarjetaFija = new RetencionItem();
          datosRetencionTarjetaFija.tiporetencion = this.getTextoTipoRetencion();
          datosRetencionTarjetaFija.importe = this.getTextoImporte();
          datosRetencionTarjetaFija.fechainicio = res.retencion.fechainicio;
          datosRetencionTarjetaFija.iddestinatario = this.getTextoDestinatario();

          this.retencionEvent.emit(datosRetencionTarjetaFija);

          if (undefined != res.retencion.fechainicio && null != res.retencion.fechainicio) {
            this.body.fechainicio = new Date(res.retencion.fechainicio);
            this.bodyAux.fechainicio = new Date(res.retencion.fechainicio);
          }

          if (undefined != res.retencion.fechafin && null != res.retencion.fechafin) {
            this.body.fechafin = new Date(res.retencion.fechafin);
            this.bodyAux.fechafin = new Date(res.retencion.fechafin);
          }

          if (this.body.tiporetencion && this.body.tiporetencion.length == 1) {
            this.disabledImporte = false;
          } else {
            this.disabledImporte = true;
          }

          if(this.body.fechafin && (Date.now() >= Number(this.body.fechafin))) {
            this.disableEliminar = true;
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTiposRetencion() {
    this.comboTiposRetencion = [
      {
        label: this.translateService.instant("facturacionSJCS.retenciones.porcentual"),
        value: 'P'
      },
      {
        label: this.translateService.instant("facturacionSJCS.retenciones.importeFijo"),
        value: 'F'
      },
      {
        label: this.translateService.instant("facturacionSJCS.retenciones.tramosLEC"),
        value: 'L'
      }
    ];
  }

  getComboDestinatarios() {

    this.progressSpinner = true;

    this.sigaServices.get("retenciones_comboDestinatarios").subscribe(
      data => {
        if (data.error != null && data.error.description != null) {
          this.showMessage.emit({
            severity: "error",
            summary: this.translateService.instant("general.message.incorrect"),
            detail: this.translateService.instant(data.error.description.toString())
          });
        } else {
          this.comboDestinatarios = data.combooItems;
          this.commonsService.arregloTildesCombo(this.comboDestinatarios);
        }
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.getDataInicial();
      }
    );

  }

  fillFechaNoti(event) {
    this.body.fechainicio = event;

    if (this.body.fechafin < this.body.fechainicio) {
      this.body.fechafin = undefined;
    }
    this.minDate = this.body.fechainicio;
  }

  fillFechaFin(event) {
    this.body.fechafin = event;
  }

  isDisabledRestablecer() {
    if(this.isLetrado){
      return true;
    }else if(this.permisoEscritura){
      return false;
    }else{
      return true;
    }
  }

  restablecer() {
    if (this.permisoEscritura) {
      this.progressSpinner = true;
      Object.assign(this.body, this.bodyAux);
      this.progressSpinner = false;
    }
  }

  compruebaCamposObligatorios() {
    if ((this.body.tiporetencion && this.body.tiporetencion.trim().length == 1) &&
      (this.body.importe && this.body.importe != null && this.body.importe.toString().length > 0) &&
      (this.body.fechainicio && this.body.fechainicio != null) &&
      (this.body.iddestinatario && this.body.iddestinatario.toString().trim().length > 0) &&
      (this.colegiado && this.colegiado != null)) {
      return true;
    }
    this.showMessage.emit({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant("general.message.camposObligatorios")
    });
    return false;
  }

  guardar() {

    if (this.permisoEscritura && this.compruebaCamposObligatorios()) {

      this.body.idpersona = this.colegiado.idPersona;

      this.progressSpinner = true;

      this.sigaServices.post("retenciones_saveOrUpdateRetencion", this.body).subscribe(
        data => {
          const res = JSON.parse(data.body);

          if (res.status == 'KO' && res.error != null && res.error.description != null) {
            this.showMessage.emit({
              severity: "error",
              summary: this.translateService.instant("general.message.incorrect"),
              detail: this.translateService.instant(res.error.description.toString())
            });
          } else {
            if (this.retencionesService.modoEdicion) {
              this.getRetencion(this.body.idretencion);
            } else {
              this.getRetencion(res.id);
              this.retencionesService.modoEdicion = true;
            }
            this.showMessage.emit({
              severity: "success",
              summary: this.translateService.instant("general.message.correct"),
              detail: this.translateService.instant("general.message.accion.realizada")
            });
          }

          Object.assign(this.bodyAux, this.body);
          this.progressSpinner = false;
        }
      );
    }

  }
  marcarObligatorio(tipoCampo: string, valor) {
    let resp = false;

    if (tipoCampo == 'inputNumber' && (valor == undefined || valor == null || valor.toString().length == 0)) {
      resp = true;
    }

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

  onChangeTipoDeReten() {
    this.body.importe = '';
    if (this.body.tiporetencion && this.body.tiporetencion.length == 1) {
      this.disabledImporte = false;
    } else {
      this.disabledImporte = true;
    }
  }

  compruebaImporte(valid: boolean) {
    if (!valid) {
      this.body.importe = '';
    }
  }

  getTextoTipoRetencion() {
    let cadena = '';

    if (this.body.tiporetencion && this.body.tiporetencion.toString().length == 1) {
      cadena = this.comboTiposRetencion.find(el => el.value == this.body.tiporetencion).label;
    }

    return cadena;
  }

  getTextoImporte() {
    let cadena = '';

    if (this.body.importe && this.body.importe != null && this.body.importe.toString().length > 0) {
      if (this.body.tiporetencion == 'F' || this.body.tiporetencion == 'L') {
        cadena = `${this.body.importe.toString()} €`;
      } else if (this.body.tiporetencion == 'P') {
        cadena = `${this.body.importe.toString()} %`;
      }
    }

    return cadena;
  }

  getTextoFechaDeNoti() {
    let cadena = '';

    if (this.body.fechainicio && this.body.fechainicio != null) {
      cadena = this.datePipe.transform(this.body.fechainicio, 'dd/MM/yyyy');
    }

    return cadena;
  }

  getTextoFechaFin() {
    let cadena = '';

    if (this.body.fechafin && this.body.fechafin != null) {
      cadena = this.datePipe.transform(this.body.fechafin, 'dd/MM/yyyy');
    }

    return cadena;
  }

  getTextoDestinatario() {
    let cadena = '';

    if (this.comboDestinatarios && this.comboDestinatarios.length > 0 && this.body.iddestinatario && this.body.iddestinatario != null
      && this.body.iddestinatario.toString().length > 0) {
      cadena = this.comboDestinatarios.find(el => el.value == this.body.iddestinatario).label;
    }

    return cadena;
  }

}