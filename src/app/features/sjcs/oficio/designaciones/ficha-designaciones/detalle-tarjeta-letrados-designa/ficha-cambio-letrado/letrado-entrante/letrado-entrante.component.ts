import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { CamposCambioLetradoItem } from '../../../../../../../../models/sjcs/CamposCambioLetradoItem';

@Component({
  selector: 'app-letrado-entrante',
  templateUrl: './letrado-entrante.component.html',
  styleUrls: ['./letrado-entrante.component.scss']
})
export class LetradoEntranteComponent implements OnInit {

  msgs: Message[] = [];
  body = new CamposCambioLetradoItem();
  datos;
  showTarjeta=true;
  progressSpinner = false;
  disableFechaDesignacion;
  disableCheck=false;

  @Input() saliente;

  @Output() fillEntrante = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  ngOnInit() {

    this.body.art27=false;
    if (sessionStorage.getItem("NewLetrado")) {
			let data = JSON.parse(sessionStorage.getItem("NewLetrado"));
			sessionStorage.removeItem("NewLetrado");
      this.body=data;
    }
    if (sessionStorage.getItem("abogado")) {
			let data = JSON.parse(sessionStorage.getItem("abogado"))[0];
			sessionStorage.removeItem("abogado");
      /* this.body=data; */
			this.body.numColegiado = data.numeroColegiado;
			this.body.nombre = data.nombre;
			/* this.body.apellidos = data.apellidos1 + " " + data.apellidos2; */
      this.body.apellidos = data.apellidos;
      this.body.idPersona = data.idPersona;
		}

    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    if(designa.art27=="Si") {
      this.body.art27=true;
      this.body.fechaDesignacion = this.saliente.fechaDesignacion;
      this.disableFechaDesignacion=true;
    }

    if(sessionStorage.getItem("isLetrado")=="true") this.disableCheck=true;
    
  }


  incluirSalto(){
  }

  changeMotivo(event){
    this.body.motivoRenuncia = event;
  }

  onHideTarjeta(){
    this.showTarjeta=!this.showTarjeta;
  }

  clear() {
    this.msgs=[];
  }

  fillFechaSolRenuncia(evento){
    this.body.fechaSolRenuncia=evento;
  }

  fillFechaDesignacion(evento){
    this.body.fechaDesignacion=evento;
  }

  search() {
			sessionStorage.setItem("origin", "AbogadoContrario");
      sessionStorage.setItem("Oldletrado",  JSON.stringify(this.saliente));
      sessionStorage.setItem("Newletrado",  JSON.stringify(this.body));
			this.router.navigate(['/busquedaGeneral']);
  }

  rest() {
    this.body.nombre="";
    this.body.numColegiado="";
    this.body.apellidos="";
  }

}
