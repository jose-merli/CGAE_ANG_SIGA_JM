import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../../commons/translate';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-datos-adicionales-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-datos-adicionales-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-datos-adicionales-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDatosAdicionalesFichaDesignacionOficioComponent implements OnInit {

  msgs: Message[] = [];
  @Input() campos;
  nuevaDesigna: any;
  bloques = [
    {
      datePicker: 'Fecha Oficio Juzgado',
      valueDatePicker:"",
      textArea: 'Observaciones',
      value: ""
    },
    {
      datePicker: 'Fecha Recepción Colegio',
      valueDatePicker:"",
      textArea: 'Observaciones',
      value: ""
    },
    {
      datePicker: 'Fecha Juicio',
      valueDatePicker:"",
      time: true,
      textArea: 'Observaciones Defensa Jurídica',
      value: ""
    }
  ];

  constructor(private sigaServices: SigaServices,  private translateService: TranslateService, private router: Router) { }

  ngOnInit() {
    console.log(this.campos);
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    if(!this.nuevaDesigna){
        this.getDatosAdicionales(this.campos);
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

  getDatosAdicionales(datosDesigna) {

    this.sigaServices.post("designaciones_getDatosAdicionales",datosDesigna).subscribe(
      n => {
        console.log(n.body);
        if(n!=null){
          this.bloques[0].value = n.body.delitos;
          this.bloques[0].valueDatePicker = n.body.fechaOficioJuzgado;
          this.bloques[1].value = n.body.observaciones;
          this.bloques[1].valueDatePicker = n.body.fechaRecepcionColegio;
          this.bloques[2].value = n.body.defensaJuridica;
          this.bloques[2].valueDatePicker = n.body.fechaJuicio;
        }
      },
      err => {
        console.log(err);
      }, () => {
      }
    );
  }

}
