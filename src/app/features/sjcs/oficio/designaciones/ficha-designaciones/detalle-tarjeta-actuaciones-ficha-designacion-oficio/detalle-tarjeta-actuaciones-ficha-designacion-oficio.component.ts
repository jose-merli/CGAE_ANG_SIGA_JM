import { Component, Input, OnInit } from '@angular/core';
import { ActuacionDesignaObject } from '../../../../../../models/sjcs/ActuacionDesignaObject';
import { SigaServices } from '../../../../../../_services/siga.service';
import { ActuacionDesignaItem } from '../../../../../../models/sjcs/ActuacionDesignaItem';
import { DatePipe } from '@angular/common';

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
      field: 'numero',
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
      field: 'validada',
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

  constructor(private sigaServices: SigaServices, private datepipe: DatePipe) { }

  ngOnInit() {

    this.getActuacionesDesigna();
  }

  getActuacionesDesigna(historico = false) {

    const params = {
      anio: this.campos.ano.split('/')[0].replace('D', ''),
      idTurno: this.campos.idTurno,
      numero: this.campos.codigo,
      historico: historico
    };

    this.sigaServices.post("actuaciones_designacion", params).subscribe(
      data => {
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
        console.log(err);
      }
    );
  }

  modifyData() {
    this.actuacionesDesignaItems.forEach(el => {
      el.validada = el.validada ? 'Sí' : 'No'
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

}
