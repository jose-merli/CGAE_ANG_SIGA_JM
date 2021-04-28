import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() refreshAditionalData = new EventEmitter<DesignaItem>();
  datosInicial: any;
  nuevaDesigna: any;
  horaInicial;
  minutoInicial;
  hora;
  minuto;
  progressSpinner: boolean;
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

  constructor(private sigaServices: SigaServices,  private translateService: TranslateService, private router: Router, private datepipe: DatePipe) { }

  ngOnInit() {
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    this.datosInicial = this.campos;
    if(!this.nuevaDesigna){
        // this.getDatosAdicionales(this.campos);
        this.bloques[0].value = this.campos.delitos;
        this.bloques[0].valueDatePicker = this.formatDate(this.campos.fechaOficioJuzgado);
        this.bloques[1].value = this.campos.observaciones;
        this.bloques[1].valueDatePicker = this.formatDate(this.campos.fechaRecepcionColegio);
        this.bloques[2].value = this.campos.defensaJuridica;
        this.bloques[2].valueDatePicker = this.formatDate(this.campos.fechaJuicio);
        let fecha = this.formatDateHM(this.campos.fechaJuicio);
        if(fecha != null){
          let fecha1 = fecha.split(" ");
          fecha = fecha1[1];
          let horaminutos = fecha.split(":");
          this.horaInicial = horaminutos[0];
          this.minutoInicial = horaminutos[1];
          this.hora = this.horaInicial;
          this.minuto = this.minutoInicial;
        }
        
    }
  }
  fillFechaHastaCalendar(event, nombre){
    if(nombre == "Fecha Oficio Juzgado"){
      this.bloques[0].valueDatePicker = event;
    }else if(nombre == "Fecha Recepción Colegio"){
      this.bloques[1].valueDatePicker = event;
    }else if(nombre == "Fecha Juicio"){
      this.bloques[2].valueDatePicker = event;
    }
  }
  showMsg(severity, summary, detail) {
    this.msgs = [];
    if(detail == "Restablecer"){
      this.progressSpinner=true;
        // this.getDatosAdicionales(this.campos);
        this.bloques[0].value = this.datosInicial.delitos;
        this.bloques[0].valueDatePicker = this.formatDate(this.datosInicial.fechaOficioJuzgado);
        this.bloques[1].value = this.datosInicial.observaciones;
        this.bloques[1].valueDatePicker =  this.formatDate(this.datosInicial.fechaRecepcionColegio);
        this.bloques[2].value = this.datosInicial.defensaJuridica;
        this.bloques[2].valueDatePicker = this.formatDate(this.datosInicial.fechaJuicio);
        this.hora = this.horaInicial;
        this.minuto = this.minutoInicial;
        this.progressSpinner=false;
    }else if(detail == "Guardar"){
      this.progressSpinner=true;
      // this.getDatosAdicionales(this.campos);
      let datosAdicionalesDesigna = new DesignaItem();
      datosAdicionalesDesigna.delitos = this.bloques[0].value;
      if(this.bloques[0].valueDatePicker!= null){
        datosAdicionalesDesigna.fechaOficioJuzgado =new Date(this.bloques[0].valueDatePicker);
      }
      if(this.bloques[1].valueDatePicker!= null){
        datosAdicionalesDesigna.fechaRecepcionColegio =new Date(this.bloques[1].valueDatePicker);
      }
      if(this.bloques[2].valueDatePicker!= null){
        datosAdicionalesDesigna.fechaJuicio =new Date(this.bloques[2].valueDatePicker);
        let horaNumber = Number(this.hora);
      let minutoNumber = Number(this.minuto);
      datosAdicionalesDesigna.fechaJuicio.setHours(horaNumber,minutoNumber);
      }
      datosAdicionalesDesigna.observaciones = this.bloques[1].value;
      // datosAdicionalesDesigna.fechaRecepcionColegio =new Date(this.bloques[1].valueDatePicker);
      datosAdicionalesDesigna.defensaJuridica = this.bloques[2].value;
      // datosAdicionalesDesigna.fechaJuicio =new Date(this.bloques[2].valueDatePicker);
      
      datosAdicionalesDesigna.idTurno = this.campos.idTurno;
      let anio = this.campos.ano.split("/");
      datosAdicionalesDesigna.ano = Number(anio[0].substring(1,5));
      datosAdicionalesDesigna.numero = this.campos.numero;
      this.sigaServices.post("designaciones_updateDatosAdicionales",datosAdicionalesDesigna).subscribe(
        n => {
          this.progressSpinner=false;
          console.log(n.body);
          this.refreshAditionalData.emit(datosAdicionalesDesigna);
            this.msgs.push({
              severity,
              summary,
              detail
            });
        },
        err => {
          this.progressSpinner=false;
          console.log(err);
        }, () => {
          this.progressSpinner=false;
        }
      );
     
  }
  }

  clear() {
    this.msgs = [];
  }

  formatDateHM(date) {
    const pattern = 'yyyy-MM-dd HH:mm:ss-SS';
    return this.datepipe.transform(date, pattern);
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }

  getDatosAdicionales(datosDesigna) {
    this.progressSpinner=true;
    let desginaAdicionales = new DesignaItem();
    desginaAdicionales.ano = datosDesigna.ano;
    desginaAdicionales.numero = datosDesigna.numero;
    desginaAdicionales.idTurno = datosDesigna.idTurno;
    this.sigaServices.post("designaciones_getDatosAdicionales",desginaAdicionales).subscribe(
      n => {
        this.progressSpinner=false;
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
        this.progressSpinner=false;
        console.log(err);
      }, () => {
        this.progressSpinner=false;
      }
    );
  }



}
