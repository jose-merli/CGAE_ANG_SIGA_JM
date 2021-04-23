import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Actuacion } from '../../detalle-tarjeta-actuaciones-designa.component';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../../../commons/translate/translation.service';

@Component({
  selector: 'app-tarjeta-jus-ficha-act',
  templateUrl: './tarjeta-jus-ficha-act.component.html',
  styleUrls: ['./tarjeta-jus-ficha-act.component.scss']
})
export class TarjetaJusFichaActComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  @Input() actuacionDesigna: Actuacion;
  @Output() changeDataEvent = new EventEmitter<any>();

  estado: string = '';
  fechaJusti: any;
  observaciones: string = '';

  constructor(private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {

    this.establecerValoresIniciales();
    sessionStorage.setItem("datosIniActuDesignaJust", JSON.stringify(this.actuacionDesigna));
  }

  fillFecha(event) {
    this.fechaJusti = event;
  }

  validar() {

    this.progressSpinner = true;

    const actuacionesRequest = {
      numero: this.actuacionDesigna.actuacion.numero,
      numeroAsunto: this.actuacionDesigna.actuacion.numeroAsunto,
      idTurno: this.actuacionDesigna.actuacion.idTurno,
      anio: this.actuacionDesigna.actuacion.anio
    };

    this.sigaServices.post("actuaciones_designacion_validar", actuacionesRequest).subscribe(
      data => {
        this.progressSpinner = false;
        const resp = JSON.parse(data.body);

        if (resp.status == 'OK') {
          this.actuacionDesigna.actuacion.validada = true;
          this.estado = 'Validada';
          sessionStorage.setItem("datosIniActuDesignaJust", JSON.stringify(this.actuacionDesigna));
          this.changeDataEvent.emit({ tarjeta: 'sjcsDesigActuaOfiJustifi', fechaJusti: this.actuacionDesigna.actuacion.fechaJustificacion, estado: this.estado });
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', resp.error.descripcion);
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
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
          sessionStorage.setItem("datosIniActuDesignaJust", JSON.stringify(this.actuacionDesigna));
          this.changeDataEvent.emit({ tarjeta: 'sjcsDesigActuaOfiJustifi', fechaJusti: this.actuacionDesigna.actuacion.fechaJustificacion, estado: 'Pendiente de validar' });
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', resp.error.descripcion);
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );

  }

  establecerValoresIniciales() {
    this.estado = this.actuacionDesigna.actuacion.validada ? 'Validada' : '';
    this.fechaJusti = this.actuacionDesigna.actuacion.fechaJustificacion;
    this.observaciones = this.actuacionDesigna.actuacion.observacionesJusti;
  }

  restablecer() {

    if (sessionStorage.getItem("datosIniActuDesignaJust")) {
      this.actuacionDesigna = JSON.parse(sessionStorage.getItem("datosIniActuDesignaJust"));
      this.establecerValoresIniciales();
      this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));

    }
  }

  anular() {

    this.progressSpinner = true;

    const actuacionesRequest = {
      numero: this.actuacionDesigna.actuacion.numero,
      numeroAsunto: this.actuacionDesigna.actuacion.numeroAsunto,
      idTurno: this.actuacionDesigna.actuacion.idTurno,
      anio: this.actuacionDesigna.actuacion.anio
    };

    this.sigaServices.post("actuaciones_designacion_anular", actuacionesRequest).subscribe(
      data => {
        this.progressSpinner = false;
        const resp = JSON.parse(data.body);

        if (resp.status == 'OK') {
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', resp.error.descripcion);
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );

  }

  reactivar() {

    this.progressSpinner = true;

    const actuacionesRequest = {
      numero: this.actuacionDesigna.actuacion.numero,
      numeroAsunto: this.actuacionDesigna.actuacion.numeroAsunto,
      idTurno: this.actuacionDesigna.actuacion.idTurno,
      anio: this.actuacionDesigna.actuacion.anio
    };

    this.sigaServices.post("actuaciones_designacion_reactivar", actuacionesRequest).subscribe(
      data => {
        this.progressSpinner = false;
        const resp = JSON.parse(data.body);

        if (resp.status == 'OK') {
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', resp.error.descripcion);
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
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

}
