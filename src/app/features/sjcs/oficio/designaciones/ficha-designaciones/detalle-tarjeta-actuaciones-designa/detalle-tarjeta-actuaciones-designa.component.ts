import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { ActuacionDesignaItem } from '../../../../../../models/sjcs/ActuacionDesignaItem';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { Router } from '@angular/router';

export interface Col {
  field: string,
  header: string,
  width: string
}

export interface Actuacion {
  isNew: boolean,
  designaItem: any,
  actuacion: ActuacionDesignaItem
}

@Component({
  selector: 'app-detalle-tarjeta-actuaciones-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-actuaciones-designa.component.html',
  styleUrls: ['./detalle-tarjeta-actuaciones-designa.component.scss']
})
export class DetalleTarjetaActuacionesFichaDesignacionOficioComponent implements OnInit {

  @Input() campos;
  @Input() actuacionesDesignaItems: ActuacionDesignaItem[];

  @Output() buscarEvent = new EventEmitter<boolean>();

  cols: Col[] = [
    {
      field: 'fechaActuacion',
      header: 'justiciaGratuita.oficio.designas.actuaciones.fechaActuacion',
      width: '14.29%'
    },
    {
      field: 'numeroAsunto',
      header: 'justiciaGratuita.oficio.designas.actuaciones.nActuacion',
      width: '14.29%'
    },
    {
      field: 'modulo',
      header: 'justiciaGratuita.oficio.designas.actuaciones.modulo',
      width: '14.29%'
    },
    {
      field: 'acreditacion',
      header: 'justiciaGratuita.oficio.designas.actuaciones.acreditacion',
      width: '14.29%'
    },
    {
      field: 'fechaJustificacion',
      header: 'justiciaGratuita.oficio.designas.actuaciones.fechaJustificacion',
      width: '14.29%'
    },
    {
      field: 'validadaTexto',
      header: 'justiciaGratuita.oficio.designas.actuaciones.validada',
      width: '14.29%'
    },
    {
      field: 'facturacion',
      header: 'justiciaGratuita.oficio.designas.actuaciones.facturacion',
      width: '14.29%'
    }
  ];
  historico: boolean = false;
  progressSpinner: boolean = false;
  actuacionesSeleccionadas: ActuacionDesignaItem[] = [];
  msgs: Message[] = [];

  constructor
    (
      private sigaServices: SigaServices,
      private translateService: TranslateService,
      private router: Router
    ) { }

  ngOnInit() {
  }

  toogleHistory(value: boolean) {
    this.actuacionesSeleccionadas = [];
    this.buscarEvent.emit(value);
    this.historico = value;
  }

  isItalic(dato) {
    return dato.anulada;
  }


  isAnySelected() {
    return this.actuacionesSeleccionadas.length > 0;
  }

  onRowSelected(event) {

    if (this.historico && !event.data.anulada) {
      this.actuacionesSeleccionadas.pop();
    }

  }

  clear() {
    this.msgs = [];
  }

  showMessage(msg: Message) {
    this.msgs = [];
    this.msgs.push({
      severity: msg.severity,
      summary: msg.summary,
      detail: msg.detail
    });
  }

  anular() {

    this.progressSpinner = true;
    let error = false;

    if (this.actuacionesSeleccionadas.length > 0) {
      let actuacionesRequest = [];

      this.actuacionesSeleccionadas.forEach(el => {
        if (!el.facturado) {
          actuacionesRequest.push(el);
        } else {
          error = true;
        }
      });

      if (error) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: 'Alguno de los elementos seleccionados no puede anularse porque se encuentra facturado' });
      }

      this.sigaServices.post("actuaciones_designacion_anular", actuacionesRequest).subscribe(
        data => {
          this.progressSpinner = false;
          const resp = JSON.parse(data.body);

          if (resp.status == 'OK') {
            this.actuacionesSeleccionadas = [];
            this.buscarEvent.emit(false);
          }

          if (resp.error != null && resp.error.descripcion != null) {
            this.showMessage({ severity: 'error', summary: 'Error', detail: resp.error.descripcion });
          }

        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        }
      );

    }

  }

  reactivar() {
    this.progressSpinner = true;
    let error = false;

    if (this.actuacionesSeleccionadas.length > 0) {

      let actuacionesRequest = [];

      this.actuacionesSeleccionadas.forEach(el => {
        if (!el.facturado) {
          actuacionesRequest.push(el);
        } else {
          error = true;
        }
      });

      if (error) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: 'Alguno de los elementos seleccionados no puede reactivarse porque se encuentra facturado' });
      }

      this.sigaServices.post("actuaciones_designacion_reactivar", actuacionesRequest).subscribe(
        data => {
          this.progressSpinner = false;
          const resp = JSON.parse(data.body);

          if (resp.status == 'OK') {
            this.actuacionesSeleccionadas = [];
            this.buscarEvent.emit(true);
          }

          if (resp.error != null && resp.error.descripcion != null) {
            this.showMessage({ severity: 'error', summary: 'Error', detail: resp.error.descripcion });
          }

        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        }
      );

    }

  }

  eliminar() {
    this.progressSpinner = true;
    let error = false;

    if (this.actuacionesSeleccionadas.length > 0) {
      let actuacionesRequest = [];

      this.actuacionesSeleccionadas.forEach(el => {
        if (!el.facturado) {
          actuacionesRequest.push(el);
        } else {
          error = true;
        }
      });

      if (error) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: 'Alguno de los elementos seleccionados no puede anularse porque se encuentra facturado' });
      }

      this.sigaServices.post("actuaciones_designacion_eliminar", actuacionesRequest).subscribe(
        data => {
          this.progressSpinner = false;
          const resp = JSON.parse(data.body);

          if (resp.status == 'OK') {
            this.actuacionesSeleccionadas = [];
            this.buscarEvent.emit(false);
          }

          if (resp.error != null && resp.error.descripcion != null) {

            if (resp.error.code == '500') this.showMessage({ severity: 'error', summary: 'Error', detail: resp.error.descripcion });
            if (resp.error.code == '200') this.showMessage({ severity: 'success', summary: 'Correcto', detail: this.translateService.instant(resp.error.descripcion) });

          }

        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        }
      );

    }

  }

  nuevo() {

    let actuacion: Actuacion = {
      isNew: true,
      designaItem: this.campos,
      actuacion: null
    }

    sessionStorage.setItem("actuacionDesigna", JSON.stringify(actuacion));
    this.router.navigate(['/fichaActDesigna']);
  }

  editarActuacion(act: ActuacionDesignaItem) {

    let actuacion: Actuacion = {
      isNew: false,
      designaItem: this.campos,
      actuacion: act 
    };

    sessionStorage.setItem("actuacionDesigna", JSON.stringify(actuacion));
    this.router.navigate(['/fichaActDesigna']);

  }

}
