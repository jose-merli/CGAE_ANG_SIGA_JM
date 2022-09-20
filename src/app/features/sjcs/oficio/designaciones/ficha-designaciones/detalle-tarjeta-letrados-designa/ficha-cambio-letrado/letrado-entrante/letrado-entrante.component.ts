import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { CamposCambioLetradoItem } from '../../../../../../../../models/sjcs/CamposCambioLetradoItem';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';

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
  isLetrado: boolean;
  minDateDesigna: any;
  @Input() entrante;
  @Output() fillEntrante = new EventEmitter<boolean>();

  constructor(private router: Router,private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {
    this.body.art27=false;
    if (sessionStorage.getItem("NewLetrado")) {
			let data = JSON.parse(sessionStorage.getItem("NewLetrado"));
			sessionStorage.removeItem("NewLetrado");
      this.body=data;
      
      // Lanza un mensaje de advertencia si el letrado seleccionado no se encuentra en el turno
      this.advertenciaLetradoNoInscritoEnTurno();
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

      // Lanza un mensaje de advertencia si el letrado seleccionado no se encuentra en el turno
      this.advertenciaLetradoNoInscritoEnTurno();
		}

    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    this.minDateDesigna = new Date(this.entrante.fechaDesignacion.split('/').reverse().join('-'));
    if(designa.art27=="Si") {
      this.body.art27=true;
      this.body.fechaDesignacion = this.entrante.fechaDesignacion;
      this.disableFechaDesignacion=true;
    }

    if(sessionStorage.getItem("isLetrado")=="true") this.disableCheck=true;
    

    this.sigaServices.get('getLetrado').subscribe(
      (data) => {
        if (data.value == 'S') {
          this.isLetrado = true;
        } else {
          this.isLetrado = false;
        }
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  incluirSalto(){
  }

  changeMotivo(event){
    this.body.motivoRenuncia = event;
  }

  onHideTarjeta(){
    this.showTarjeta=!this.showTarjeta;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  advertenciaLetradoNoInscritoEnTurno() {
    this.progressSpinner = true;
    this.compruebaEstaLetradoEnTurno().subscribe(value => {
      this.progressSpinner = false;
      if (!value) {
        this.showMessage("warn", this.translateService.instant("general.message.warn"), 
          this.translateService.instant("justiciaGratuita.oficio.designas.cambioLetrado.avisoNoEnTurno"));
      }
    }, err => this.progressSpinner = false);
  }

  compruebaEstaLetradoEnTurno(): Observable<boolean>  {
    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    let request = { idturno: designa.idTurno, idinstitucion: designa.idInstitucion, idpersona: this.body.idPersona };
    return this.sigaServices.post("designaciones_compruebaLetradoInscritoEnTurno", request).map(
      n => {
        const body = JSON.parse(n.body);
        return body.data === "true";
      }
    );
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
      sessionStorage.setItem("Oldletrado",  JSON.stringify(this.entrante));
      sessionStorage.setItem("Newletrado",  JSON.stringify(this.body));
			this.router.navigate(['/busquedaGeneral']);
  }

  rest() {
    this.body.nombre="";
    this.body.numColegiado="";
    this.body.apellidos="";
  }

}
