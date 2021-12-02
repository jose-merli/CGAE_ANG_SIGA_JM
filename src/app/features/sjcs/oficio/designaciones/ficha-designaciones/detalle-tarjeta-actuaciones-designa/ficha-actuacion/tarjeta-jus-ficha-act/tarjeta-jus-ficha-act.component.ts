import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Actuacion } from '../../detalle-tarjeta-actuaciones-designa.component';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../../../commons/translate/translation.service';
import { DatePipe } from '@angular/common';
import { procesos_oficio } from '../../../../../../../../permisos/procesos_oficio';
import { CommonsService } from '../../../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { UsuarioLogado } from '../ficha-actuacion.component';

@Component({
  selector: 'app-tarjeta-jus-ficha-act',
  templateUrl: './tarjeta-jus-ficha-act.component.html',
  styleUrls: ['./tarjeta-jus-ficha-act.component.scss']
})
export class TarjetaJusFichaActComponent implements OnInit, OnChanges, OnDestroy {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  isAnulada: boolean = false;
  @Output() isAnuladaEvent = new EventEmitter<boolean>();
  @Output() changeDataEvent = new EventEmitter<any>();
  @Output() buscarActuacionEvent = new EventEmitter<any>();
  @Input() actuacionDesigna: Actuacion;
  @Input() isColegiado;
  @Input() usuarioLogado: UsuarioLogado;
  // Este modo lectura se produce cuando:
  // - Es colegiado y la actuación está validada y el turno no permite la modificación o la actuación no pertenece al colegiado
  // - La actuación está facturada
  @Input() modoLectura2: boolean = false;
  modoLectura: boolean;
  disableAll: boolean = false;
  fechaActuacion: Date;

  estado: string = '';
  fechaJusti: any;
  observaciones: string = '';

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private router: Router,
    private datePipe: DatePipe,
    private persistenceService: PersistenceService) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_oficio.designaTarjetaActuacionesJustificacion)
      .then(respuesta => {
        let permisoEscritura = respuesta;

        if (permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }

        if (!permisoEscritura) {
          this.modoLectura = true;
        }

        this.cargaInicial();

      }
      ).catch(error => console.error(error));

  }

  cargaInicial() {

    if (this.actuacionDesigna.isNew) {
      this.establecerValoresIniciales();
    } else {
      this.establecerDatosInicialesEditAct();
    }

    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true
    }

    sessionStorage.setItem("datosIniActuDesignaJust", JSON.stringify(this.actuacionDesigna));
  }

  fillFecha(event) {
    this.fechaJusti = event;
  }

  validar() {

    this.progressSpinner = true;

    let fechaTarjetaPlegada = null;

    let fechaJustiRequest = null;

    if (this.fechaJusti == undefined || this.fechaJusti == null || this.fechaJusti.length == 0) {
      this.fechaJusti = new Date();
      fechaJustiRequest = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
      fechaTarjetaPlegada = this.datePipe.transform(new Date(), 'dd/MM/yyyy');;
    } else {
      fechaJustiRequest = this.datePipe.transform(this.fechaJusti, 'dd/MM/yyyy');
    }

    const actuacionesRequest = {
      numero: this.actuacionDesigna.actuacion.numero,
      numeroAsunto: this.actuacionDesigna.actuacion.numeroAsunto,
      idTurno: this.actuacionDesigna.actuacion.idTurno,
      anio: this.actuacionDesigna.actuacion.anio,
      fechaJustificacion: fechaJustiRequest
    };

    this.sigaServices.post("actuaciones_designacion_validar", actuacionesRequest).subscribe(
      data => {
        this.progressSpinner = false;
        const resp = JSON.parse(data.body);

        if (resp.status == 'OK') {
          this.actuacionDesigna.actuacion.validada = true;
          this.estado = 'Validada';

          if (fechaTarjetaPlegada != null) {
            this.actuacionDesigna.actuacion.fechaJustificacion = fechaTarjetaPlegada;
          }

          this.buscarActuacionEvent.emit(this.actuacionDesigna.actuacion.numeroAsunto);
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', this.translateService.instant(resp.error.descripcion));
        }

      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );

  }

  desvalidar() {

    this.progressSpinner = true;

    const actuacionesRequest = {
      numero: this.actuacionDesigna.actuacion.numero,
      numeroAsunto: this.actuacionDesigna.actuacion.numeroAsunto,
      idTurno: this.actuacionDesigna.actuacion.idTurno,
      anio: this.actuacionDesigna.actuacion.anio
    };

    this.sigaServices.post("actuaciones_designacion_desvalidar", actuacionesRequest).subscribe(
      data => {
        this.progressSpinner = false;
        const resp = JSON.parse(data.body);

        if (resp.status == 'OK') {
          this.actuacionDesigna.actuacion.validada = false;
          this.estado = '';
          this.buscarActuacionEvent.emit(this.actuacionDesigna.actuacion.numeroAsunto);
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', this.translateService.instant(resp.error.descripcion));
        }

      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );

  }

  establecerValoresIniciales() {
    this.estado = this.actuacionDesigna.actuacion.validada ? 'Validada' : '';

    this.observaciones = this.actuacionDesigna.actuacion.observacionesJusti;

    if (this.isColegiado) {
      this.fechaJusti = new Date();
    } else {
      this.fechaJusti = '';
      this.fechaActuacion = new Date(this.actuacionDesigna.actuacion.fechaActuacion.split('/').reverse().join('-'));
    }
  }

  establecerDatosInicialesEditAct() {
    this.estado = this.actuacionDesigna.actuacion.validada ? 'Validada' : '';
    this.observaciones = this.actuacionDesigna.actuacion.observacionesJusti;
    if (this.actuacionDesigna.actuacion.fechaJustificacion != undefined && this.actuacionDesigna.actuacion.fechaJustificacion != null && this.actuacionDesigna.actuacion.fechaJustificacion != '') {
      this.fechaJusti = new Date(this.actuacionDesigna.actuacion.fechaJustificacion.split('/').reverse().join('-'));
    } else {
      this.fechaJusti = null;
    }

    this.fechaActuacion = new Date(this.actuacionDesigna.actuacion.fechaActuacion.split('/').reverse().join('-'));
  }

  restablecer() {

    if (sessionStorage.getItem("datosIniActuDesignaJust")) {
      this.actuacionDesigna = JSON.parse(sessionStorage.getItem("datosIniActuDesignaJust"));
      if (this.actuacionDesigna.isNew) {
        this.establecerValoresIniciales();
      } else {
        this.establecerDatosInicialesEditAct();
      }
      this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));

    }
  }

  anular() {

    this.progressSpinner = true;

    const actuacionesRequest = [{
      numero: this.actuacionDesigna.actuacion.numero,
      numeroAsunto: this.actuacionDesigna.actuacion.numeroAsunto,
      idTurno: this.actuacionDesigna.actuacion.idTurno,
      anio: this.actuacionDesigna.actuacion.anio
    }];

    this.sigaServices.post("actuaciones_designacion_anular", actuacionesRequest).subscribe(
      data => {
        this.progressSpinner = false;
        const resp = JSON.parse(data.body);

        if (resp.status == 'OK') {
          this.actuacionDesigna.actuacion.anulada = true;
          this.isAnulada = true;
          this.isAnuladaEvent.emit(true);
          sessionStorage.setItem("datosIniActuDesignaJust", JSON.stringify(this.actuacionDesigna));
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', this.translateService.instant(resp.error.descripcion));
        }

      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );

  }

  reactivar() {

    this.progressSpinner = true;

    const actuacionesRequest = [{
      numero: this.actuacionDesigna.actuacion.numero,
      numeroAsunto: this.actuacionDesigna.actuacion.numeroAsunto,
      idTurno: this.actuacionDesigna.actuacion.idTurno,
      anio: this.actuacionDesigna.actuacion.anio
    }];

    this.sigaServices.post("actuaciones_designacion_reactivar", actuacionesRequest).subscribe(
      data => {
        this.progressSpinner = false;
        const resp = JSON.parse(data.body);

        if (resp.status == 'OK') {
          this.actuacionDesigna.actuacion.anulada = false;
          this.isAnulada = false;
          this.isAnuladaEvent.emit(false);
          sessionStorage.setItem("datosIniActuDesignaJust", JSON.stringify(this.actuacionDesigna));
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', this.translateService.instant(resp.error.descripcion));
        }

      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );

  }

  updateDatosJustificacion() {

    this.progressSpinner = true;

    let fechaJustiRequest = '';
    if (this.fechaJusti != null && this.fechaJusti != '') {
      fechaJustiRequest = this.datePipe.transform(new Date(this.fechaJusti), 'dd/MM/yyyy');
    }

    const actuacionesRequest = {
      numero: this.actuacionDesigna.actuacion.numero,
      numeroAsunto: this.actuacionDesigna.actuacion.numeroAsunto,
      idTurno: this.actuacionDesigna.actuacion.idTurno,
      anio: this.actuacionDesigna.actuacion.anio,
      fechaJustificacion: fechaJustiRequest,
      observacionesJusti: this.observaciones
    };

    this.sigaServices.post("actuaciones_designacion_updateJustiActDesigna", actuacionesRequest).subscribe(
      data => {
        this.progressSpinner = false;
        const resp = JSON.parse(data.body);

        if (resp.status == 'OK') {
          this.actuacionDesigna.actuacion.observacionesJusti = this.observaciones;
          this.actuacionDesigna.actuacion.fechaJustificacion = this.fechaJusti;
          this.buscarActuacionEvent.emit(this.actuacionDesigna.actuacion.numeroAsunto);
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', this.translateService.instant(resp.error.descripcion));
        }

      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );

  }


  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.actuacionDesigna != undefined && changes.actuacionDesigna.currentValue) {

      sessionStorage.setItem("datosIniActuDesignaJust", JSON.stringify(this.actuacionDesigna));

      if (!this.actuacionDesigna.isNew) {
        this.establecerDatosInicialesEditAct();
      }

    }

  }

  ngOnDestroy(): void {
    sessionStorage.removeItem("datosIniActuDesignaJust");
  }

}
