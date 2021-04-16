import { Component, Input, OnInit } from '@angular/core';
import { ActuacionDesignaObject } from '../../../../../../models/sjcs/ActuacionDesignaObject';
import { SigaServices } from '../../../../../../_services/siga.service';
import { ActuacionDesignaItem } from '../../../../../../models/sjcs/ActuacionDesignaItem';
import { DatePipe } from '@angular/common';
import { Message } from 'primeng/api';

export interface Col {
  field: string,
  header: string,
  width: string
}

@Component({
  selector: 'app-detalle-tarjeta-actuaciones-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-actuaciones-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-actuaciones-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaActuacionesFichaDesignacionOficioComponent implements OnInit {

  @Input() campos;

  actuacionesDesignaItems: ActuacionDesignaItem[];
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

  constructor(private sigaServices: SigaServices, private datepipe: DatePipe) { }

  ngOnInit() {

    this.getActuacionesDesigna();
  }

  getActuacionesDesigna(historico = false) {

    this.progressSpinner = true;

    const params = {
      anio: this.campos.ano.split('/')[0].replace('D', ''),
      idTurno: this.campos.idTurno,
      numero: this.campos.codigo,
      historico: historico
    };

    this.sigaServices.post("actuaciones_designacion", params).subscribe(
      data => {
        this.progressSpinner = false;

        let object: ActuacionDesignaObject = JSON.parse(data.body);

        if (object.error != null) {
          console.log('Se ha producido un error');
          console.log(object.error);
        } else {
          this.actuacionesDesignaItems = object.actuacionesDesignaItems;
          console.log("file: detalle-tarjeta-actuaciones-ficha-designacion-oficio.component.ts ~ line 87 ~ DetalleTarjetaActuacionesFichaDesignacionOficioComponent ~ getActuacionesDesigna ~ actuacionesDesignaItems", this.actuacionesDesignaItems)
          this.modifyData();
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );
  }

  modifyData() {
    this.actuacionesDesignaItems.forEach(el => {
      el.validadaTexto = el.validada ? 'Sí' : 'No'
      el.fechaActuacion = this.datepipe.transform(el.fechaActuacion, 'dd/MM/yyyy');
      el.fechaJustificacion = this.datepipe.transform(el.fechaJustificacion, 'dd/MM/yyyy');
    });
  }

  toogleHistory(value: boolean) {
    this.getActuacionesDesigna(value);
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
      const accionesRequest = [];

      this.actuacionesSeleccionadas.forEach(el => {
        if (!el.facturado) {
          accionesRequest.push(el);
        } else {
          error = true;
        }
      });

      if (error) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: 'Alguno de los elementos seleccionados no puede anularse porque se encuentra facturado' });
      }

      this.sigaServices.post("actuaciones_designacion_anular", this.actuacionesSeleccionadas).subscribe(
        data => {
          this.progressSpinner = false;
          const resp = JSON.parse(data.body);

          if (resp.status == 'OK') {
            this.getActuacionesDesigna();
          }

        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        }
      );

    }

  }

}
