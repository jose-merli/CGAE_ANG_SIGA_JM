import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../../commons/translate';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-datos-adicionales-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-datos-adicionales-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-datos-adicionales-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDatosAdicionalesFichaDesignacionOficioComponent implements OnInit {

  msgs: Message[] = [];
  @Input() campos;
  datosInicial: any;
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
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    this.datosInicial = this.campos;
    if(!this.nuevaDesigna){
        // this.getDatosAdicionales(this.campos);
        this.bloques[0].value = this.campos.delitos;
        this.bloques[0].valueDatePicker = this.campos.fechaOficioJuzgado;
        this.bloques[1].value = this.campos.observaciones;
        this.bloques[1].valueDatePicker = this.campos.fechaRecepcionColegio;
        this.bloques[2].value = this.campos.defensaJuridica;
        this.bloques[2].valueDatePicker = this.campos.fechaJuicio;
    }
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    if(detail == "Restablecer"){
        // this.getDatosAdicionales(this.campos);
        this.bloques[0].value = this.datosInicial.delitos;
        this.bloques[0].valueDatePicker = this.datosInicial.fechaOficioJuzgado;
        this.bloques[1].value = this.datosInicial.observaciones;
        this.bloques[1].valueDatePicker = this.datosInicial.fechaRecepcionColegio;
        this.bloques[2].value = this.datosInicial.defensaJuridica;
        this.bloques[2].valueDatePicker = this.datosInicial.fechaJuicio;
    }else if(detail == "Guardar"){
      // this.getDatosAdicionales(this.campos);
      let datosAdicionalesDesigna = new DesignaItem();
      datosAdicionalesDesigna.delitos = this.bloques[0].textArea;
      // datosAdicionalesDesigna.fechaOficioJuzgado =this.bloques[0].datePicker;
      datosAdicionalesDesigna.observaciones = this.bloques[2].textArea;
      // datosAdicionalesDesigna.fechaRecepcionColegio =this.bloques[0].datePicker
      datosAdicionalesDesigna.defensaJuridica = this.bloques[2].textArea;
      // datosAdicionalesDesigna.fechaJuicio =this.bloques[0].datePicker
      datosAdicionalesDesigna.idTurno = this.campos.idTurno;
      let anio = this.campos.ano.split("/");
      datosAdicionalesDesigna.ano = Number(anio[0].substring(1,5));
      datosAdicionalesDesigna.numero = this.campos.numero;
      this.sigaServices.post("designaciones_updateDatosAdicionales",datosAdicionalesDesigna).subscribe(
        n => {
          console.log(n.body);
          if(n!=null){
            this.bloques[0].value = n.body.delitos;
            this.bloques[0].valueDatePicker = n.body.fechaOficioJuzgado;
            this.bloques[1].value = n.body.observaciones;
            this.bloques[1].valueDatePicker = n.body.fechaRecepcionColegio;
            this.bloques[2].value = n.body.defensaJuridica;
            this.bloques[2].valueDatePicker = n.body.fechaJuicio;
            this.msgs.push({
              severity,
              summary,
              detail
            });
          }
        },
        err => {
          console.log(err);
        }, () => {
        }
      );
     
  }
  }

  clear() {
    this.msgs = [];
  }

  getDatosAdicionales(datosDesigna) {
    let desginaAdicionales = new DesignaItem();
    desginaAdicionales.ano = datosDesigna.ano;
    desginaAdicionales.numero = datosDesigna.numero;
    desginaAdicionales.idTurno = datosDesigna.idTurno;
    this.sigaServices.post("designaciones_getDatosAdicionales",desginaAdicionales).subscribe(
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
