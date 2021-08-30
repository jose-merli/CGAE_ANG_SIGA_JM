import { Component, OnInit, ViewChild, Input,Output, EventEmitter} from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Location } from '@angular/common';
import { FiltroBuscadorColegiadosComponent } from './filtro-buscador-colegiados/filtro-buscador-colegiados.component';
import { SigaServices } from '../../_services/siga.service';
import { TranslateService } from '../translate';
import { ColegiadosSJCSItem } from '../../models/ColegiadosSJCSItem';
import { TablaBuscadorColegiadosComponent } from './tabla-buscador-colegiados/tabla-buscador-colegiados.component';
import { Router } from "@angular/router";
import { PersistenceService } from '../../_services/persistence.service';

@Component({
  selector: 'app-buscador-colegiados',
  templateUrl: './buscador-colegiados.component.html',
  styleUrls: ['./buscador-colegiados.component.scss']
})
export class BuscadorColegiadosComponent implements OnInit {
  progressSpinner: boolean = false;
  msgs: Message[] = [];
  show = false;
  nuevaInscripcion:boolean = false;

  datos: ColegiadosSJCSItem = new ColegiadosSJCSItem();

  @ViewChild(FiltroBuscadorColegiadosComponent) filtro;
  
  @ViewChild(TablaBuscadorColegiadosComponent) tabla;

  @Input() volver;
  calendarioSelected;

  constructor(private router: Router, private persistenceService: PersistenceService, private location: Location, private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {
    console.log('sessionStorage.getItem("calendariosProgramados"): ', sessionStorage.getItem("calendariosProgramados"))
    if(sessionStorage.getItem("calendariosProgramados") == "true"){
      this.calendarioSelected = sessionStorage.getItem("calendarioSeleccinoado");
      console.log('calendarioSelected: ', this.calendarioSelected)
    }
    if (sessionStorage.getItem('usuarioBusquedaExpress')) {
      sessionStorage.removeItem('usuarioBusquedaExpress')
    }
    //Comprobar si viene del botón nuevo de busqueda de inscripciones
    if (sessionStorage.getItem("origin") =="newInscrip") {
      sessionStorage.removeItem('origin');
      this.nuevaInscripcion=true;
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

  showResponse() {
    this.show = true;
  }

  hideResponse() {
    this.show = false;
  }

  goBack() {
    this.location.back();
  }

  buscar(){
    if(sessionStorage.getItem("calendariosProgramados") == "true"){
      let calendarioSelected = sessionStorage.getItem("calendarioSeleccinoado");
      this.router.navigate(["/fichaGuardiasColegiado"]); // TO DO
    }
    let guardia = "";
    let turno = "";

    // if(this.filtro.filtro.idGuardia != null && this.filtro.filtro.idGuardia != "" &&  this.filtro.filtro.idGuardia instanceof Array){
    //   this.filtro.filtro.idGuardia = this.filtro.filtro.idGuardia.toString();
    //   // this.filtro.filtro.idGuardia.forEach(element => {
    //   //   guardia+=element + ",";
    //   // });
    // }

    // if(this.filtro.filtro.idTurno != null && this.filtro.filtro.idGuardia != "" &&  this.filtro.filtro.idTurno instanceof Array){
     
    //   this.filtro.filtro.idTurno = this.filtro.filtro.idTurno.toString();
    //   // this.filtro.filtro.idTurno.forEach(element => {
    //   //   turno+=element + ",";
    //   // });
    // }

    // THIS.FILTRO.FILTRO.IDGUARDIA = GUARDIA;
    // THIS.FILTRO.FILTRO.IDTURNO = TURNO;

    if(this.filtro.filtro.length!=0){
      this.progressSpinner = true;
      
      this.sigaServices.post("componenteGeneralJG_busquedaColegiadoEJG", this.filtro.filtro).subscribe(
        data => {
          this.progressSpinner = false;
          this.show=true;
          this.datos = JSON.parse(data.body).colegiadosSJCSItem;
          let error = JSON.parse(data.body).error;

          if (this.tabla != null && this.tabla != undefined) {
            this.tabla.table.sortOrder = 0;
            this.tabla.table.sortField = '';
            this.tabla.table.reset();
            this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
          }

          if (error != null && error.description != null) {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
          }
        },
        error => {
          this.progressSpinner = false;
          console.log(error);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    }
  }

  getColegiado(event){
    if(this.nuevaInscripcion){
      this.persistenceService.setDatos(event);
      //sessionStorage.setItem("turno", JSON.stringify(event));
      sessionStorage.setItem("origin","newInscrip");
      this.router.navigate(["/gestionInscripciones"]);
    } else{
      sessionStorage.setItem("buscadorColegiados", JSON.stringify(event));

      sessionStorage.getItem('nuevo');
      
      this.location.back();
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}