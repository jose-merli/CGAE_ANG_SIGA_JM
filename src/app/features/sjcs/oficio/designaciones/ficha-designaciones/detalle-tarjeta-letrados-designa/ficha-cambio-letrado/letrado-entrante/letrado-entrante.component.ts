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
  showTarjeta = true;
  progressSpinner = false;
  disableFechaDesignacion;
  disableCheck = false;
  isLetrado: boolean;
  // minDateDesigna: any;
  @Input() entrante;
  @Input() saliente;
  @Output() fillEntrante = new EventEmitter<boolean>();

  constructor(private router: Router, private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {
    this.body.art27 = false;
    if (sessionStorage.getItem("NewLetrado")) {
      let data = JSON.parse(sessionStorage.getItem("NewLetrado"));
      sessionStorage.removeItem("NewLetrado");
      this.body = data;

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
    // Busqueda por Colegiados sin Art 27-38
    }else if(sessionStorage.getItem("buscadorColegiados")) {
      let data = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
      // Se comprueba si se a elegido el mismo letrado saliente
      // Si es el mismo, saldrá un mensaje de error y no se seleccionará
      if (data.nColegiado == this.saliente.body.numColegiado) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designaciones.mensaje.error.mismoLetradoDesignado"));
      } else {
        this.body.numColegiado = data.nColegiado;
        this.body.nombre = data.nombre;
        this.body.apellidos = data.apellidos;
        this.body.idPersona = data.idPersona;
      }

      sessionStorage.removeItem("buscadorColegiados");
    }

    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    //SIGARNV-3125 INICIO
    // this.minDateDesigna = new Date(this.entrante.fechaDesignacion.split('/').reverse().join('-'));
    //SIGARNV-3125 FIN
    if (designa.art27 == "Si" || designa.art27 == 1) {
      this.body.art27 = true;
      this.entrante.body = this.body.art27;
      this.body.fechaDesignacion = this.entrante.fechaDesignacion;
      this.disableFechaDesignacion = true;
    } else {
      this.body.art27 = false;
      if(sessionStorage.getItem("entranteFechaDesignacion") != null && sessionStorage.getItem("entranteFechaDesignacion") != undefined){
          this.body.fechaDesignacion = new Date (sessionStorage.getItem("entranteFechaDesignacion"));
          sessionStorage.removeItem("entranteFechaDesignacion");
      }else{
        this.body.fechaDesignacion = null;
      }
    }

    if (sessionStorage.getItem("isLetrado") == "true") this.disableCheck = true;

    this.sigaServices.get('getLetrado').subscribe(
      (data) => {
        if (data.value == 'S') {
          this.isLetrado = true;
        } else {
          this.isLetrado = false;
        }
      }
    );
  }

  changeMotivo(event) {
    this.body.motivoRenuncia = event;
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
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

  compruebaEstaLetradoEnTurno(): Observable<boolean> {
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
    this.msgs = [];
  }

  fillFechaDesignacion(evento) {
    this.body.fechaDesignacion = evento;
  }

  setFechaDesignacion(evento) {
    if(evento != null){
      this.body.fechaDesignacion = evento;
    }else{
      this.body.fechaDesignacion = null;
    }
  }

  search() {
    if(sessionStorage.getItem("designaItemLink")){
      let designaTurno = JSON.parse(sessionStorage.getItem("designaItemLink"));
      sessionStorage.setItem("turnoDesigna", JSON.stringify(designaTurno.idTurno));
    }
    // Comprobar Art 27-28
    sessionStorage.setItem("origin", "AbogadoContrario");
    sessionStorage.setItem("Oldletrado", JSON.stringify(this.entrante));
    sessionStorage.setItem("Newletrado", JSON.stringify(this.body));
    if(this.body.fechaDesignacion != null || this.body.fechaDesignacion != undefined){
      sessionStorage.setItem("entranteFechaDesignacion", this.body.fechaDesignacion.toJSON());
    }
    if (this.body.art27) {//BUSQUEDA GENERAL
      this.router.navigate(["/busquedaGeneral"]);
    } else {//BUSQUEDA SJCS
      this.router.navigate(["/buscadorColegiados"]);
    }
  }

  rest() {
    this.body.nombre = "";
    this.body.numColegiado = "";
    this.body.apellidos = "";
  }
}
