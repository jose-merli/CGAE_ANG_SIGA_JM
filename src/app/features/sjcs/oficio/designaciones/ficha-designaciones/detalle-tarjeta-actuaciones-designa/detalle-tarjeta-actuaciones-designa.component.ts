import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { ActuacionDesignaItem } from '../../../../../../models/sjcs/ActuacionDesignaItem';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { Router } from '@angular/router';
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';

export interface Col {
  field: string,
  header: string,
  width: string
}

export class Actuacion {
  isNew: boolean;
  designaItem: any;
  actuacion: ActuacionDesignaItem;
  relaciones: any;
}

@Component({
  selector: 'app-detalle-tarjeta-actuaciones-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-actuaciones-designa.component.html',
  styleUrls: ['./detalle-tarjeta-actuaciones-designa.component.scss']
})
export class DetalleTarjetaActuacionesFichaDesignacionOficioComponent implements OnInit {

  @Input() campos;
  @Input() actuacionesDesignaItems: ActuacionDesignaItem[];
  @Input() relaciones: any;
  @Input() permiteTurno: boolean;

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
  isLetrado: boolean;
  modoLectura: boolean = false;

  constructor
    (
      private sigaServices: SigaServices,
      private translateService: TranslateService,
      private router: Router,
      private localStorageService: SigaStorageService,
      private commonsService: CommonsService
    ) { }

  ngOnInit() {
    
    this.commonsService.checkAcceso(procesos_oficio.designasActuaciones)
    .then(respuesta => {
      let permisoEscritura = respuesta;
      
      if (permisoEscritura == undefined || !permisoEscritura) {
        this.modoLectura = true;
      }

    })
    .catch(err => console.log(err));
    
    this.isLetrado = this.localStorageService.isLetrado;
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

    if ((this.historico && !event.data.anulada) || !event.data.permiteModificacion) {
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
            this.showMessage({ severity: 'error', summary: 'Error', detail: this.translateService.instant(resp.error.descripcion) });
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
            this.showMessage({ severity: 'error', summary: 'Error', detail: this.translateService.instant(resp.error.descripcion) });
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

        if (this.isLetrado && (el.validada || !this.permiteTurno)) {
          error = true;
        }

        if (!error && !el.facturado) {
          actuacionesRequest.push(el);
        } else {
          error = true;
        }
      });

      if (error) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: 'Alguno de los elementos seleccionados no puede eliminarse porque se encuentra facturado o validado' });
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

            if (resp.error.code == '500') this.showMessage({ severity: 'error', summary: 'Error', detail: this.translateService.instant(resp.error.descripcion) });
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
      actuacion: new ActuacionDesignaItem(),
      relaciones: this.relaciones
    }
    sessionStorage.setItem("actuacionDesigna", JSON.stringify(actuacion));
    this.router.navigate(['/fichaActDesigna']);
  }

  editarActuacion(act: ActuacionDesignaItem) {

    let actuacion: Actuacion = {
      isNew: false,
      designaItem: this.campos,
      actuacion: act,
      relaciones: this.relaciones
    };

    sessionStorage.setItem("actuacionDesigna", JSON.stringify(actuacion));
    this.router.navigate(['/fichaActDesigna']);

  }

}
