import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-detalle-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-detalle-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-detalle-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDetalleFichaDesignacionOficioComponent implements OnInit {

  msgs: Message[] = [];
  nuevaDesigna: any;
  estado: any;
  @Input() campos;
  inputs = [
    {nombre:'NIG', value: ""},
    {nombre:'Nº Procedimiento', value:""}
  ];

  datePickers = ['Fecha estado', 'Fecha cierre'];

  selectores = [
    {
      nombre: 'Estado',
      opciones: [
        {label:'Activo', value:'V'},
        {label:'Finalizada', value:'F'},
        {label:'Anulada', value:'A'}
      ]
    },
    {
      nombre: 'Juzgado',
      opciones: [
        
      ]
    },
    {
      nombre: 'Procedimiento',
      opciones: [
        { label: 'XXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXXX', value: 3 }
      ]
    },
    {
      nombre: 'Módulo',
      opciones: [
        { label: 'XXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXXX', value: 3 }
      ]
    },
    {
      nombre: 'Delitos',
      opciones: [
        { label: 'XXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXXX', value: 3 }
      ]
    }
  ];

  constructor(private sigaServices: SigaServices) { }

  ngOnInit() {
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    if(!this.nuevaDesigna){
      this.inputs[0].value = this.campos.nig;
      this.inputs[1].value = this.campos.numProcedimiento;
      // this.estado = this.campos.art27;
      this.selectores[0].opciones =[ {label: this.campos.art27, value: this.campos.sufijo} ]; 
      this.selectores[1].opciones=[{label: this.campos.nombreJuzgado, value: ''}];
    }else{
      this.selectores[0].opciones =[ 
      {label:'Activo', value:'V'},
      {label:'Finalizada', value:'F'},
      {label:'Anulada', value:'A'}];
      this.getComboJuzgados();
    }
    
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

  getComboJuzgados() {

    this.sigaServices.get("combo_comboJuzgadoDesignaciones").subscribe(
      n => {
        this.selectores[1].opciones = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.arregloTildesCombo(this.selectores[1].opciones);
      }
    );
  }
  arregloTildesCombo(combo) {
    if (combo != undefined)
      combo.map(e => {
        let accents =
          "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
        let accentsOut =
          "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        let i;
        let x;
        for (i = 0; i < e.label.length; i++) {
          if ((x = accents.indexOf(e.label[i])) != -1) {
            e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
            return e.labelSinTilde;
          }
        }
      });
  }

}
