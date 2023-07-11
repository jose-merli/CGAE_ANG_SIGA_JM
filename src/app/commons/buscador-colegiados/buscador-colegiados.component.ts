import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { Message } from 'primeng/components/common/api';
import { PersistenceService } from '../../_services/persistence.service';
import { SigaServices } from '../../_services/siga.service';
import { ColegiadosSJCSItem } from '../../models/ColegiadosSJCSItem';
import { GuardiaItem } from '../../models/guardia/GuardiaItem';
import { TranslateService } from '../translate';
import { FiltroBuscadorColegiadosComponent } from './filtro-buscador-colegiados/filtro-buscador-colegiados.component';
import { TablaBuscadorColegiadosComponent } from './tabla-buscador-colegiados/tabla-buscador-colegiados.component';

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
  nuevaInscripcionGuardia:boolean = false;

  datos: ColegiadosSJCSItem = new ColegiadosSJCSItem();

  @ViewChild(FiltroBuscadorColegiadosComponent) filtro;
  
  @ViewChild(TablaBuscadorColegiadosComponent) tabla;

  @Input() volver;
  calendarioSelected = {
    'duplicar' : '',
    'tabla': [],
    'turno':'',
    'nombre': '',
    'generado': '',
    'numGuardias': '',
    'listaGuarias': {label: '', value: ''},
    'fechaDesde': '',
    'fechaHasta': '',
    'fechaProgramacion': null,
    'estado': '',
    'observaciones': '',
    'idCalendarioProgramado': '',
    'idTurno': '',
    'idGuardia': '',
    'orden' : '',
    'idConjunto': '',
    'idCalendarioGuardias': ''
  };
  constructor(private router: Router, private persistenceService: PersistenceService, private location: Location, private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {
    //console.log('sessionStorage.getItem("calendariosProgramados"): ', sessionStorage.getItem("calendariosProgramados"))
    if(sessionStorage.getItem("calendariosProgramados") ){
      this.calendarioSelected = JSON.parse(sessionStorage.getItem("calendarioSeleccinoado"));
      //console.log('calendarioSelected: ', this.calendarioSelected)
    }
    if (sessionStorage.getItem('usuarioBusquedaExpress')) {
      sessionStorage.removeItem('usuarioBusquedaExpress')
    }

    //Comprobar si viene del botón nuevo de busqueda de inscripciones
    if (sessionStorage.getItem("origin") =="newInscrip") {
      sessionStorage.removeItem('origin');
      this.nuevaInscripcion=true;
    }

     //Comprobar si viene del botón nuevo de busqueda de inscripciones
     if (sessionStorage.getItem("sesion") =="nuevaInscripcion") {
      sessionStorage.removeItem('sesion');
      this.nuevaInscripcionGuardia=true;
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
    sessionStorage.setItem("volver", "true");
    sessionStorage.setItem("buscadorColegiados", "");
    if(sessionStorage.getItem('filtroAsistencia')){
      sessionStorage.setItem("modoBusqueda","a");
    }
    this.location.back();
  }

  buscar(){
    sessionStorage.setItem("volver", "true");
    if(!sessionStorage.getItem("modoBusqueda")){
      sessionStorage.setItem("modoBusqueda","a");
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
          //console.log(error);
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

    } else if(this.nuevaInscripcionGuardia){
      this.persistenceService.setDatos(event);
      sessionStorage.setItem("sesion","nuevaInscripcion");
      this.router.navigate(["/fichaInscripcionesGuardia"]);
    
      //ir a la ficha de movimientos varios
    }else if(sessionStorage.getItem("nuevoMovimientoVarios") =="true") {
        sessionStorage.setItem("datosColegiado",JSON.stringify(event));
        this.router.navigate(["/fichaMovimientosVarios"]);
      
    }else   if(sessionStorage.getItem("calendariosProgramados")){
      sessionStorage.removeItem('calendariosProgramados')
      this.calendarioSelected = JSON.parse(sessionStorage.getItem("calendarioSeleccinoado"));
       //redirigimos a fichaGuardiasColegiado
      let guardia = new GuardiaItem()
      guardia.idGuardia = this.calendarioSelected.idGuardia;
      guardia.idTurno = this.calendarioSelected.idTurno;
      guardia.orden = this.calendarioSelected.orden;
      guardia.turno = this.calendarioSelected.turno;
      guardia.nombre = this.calendarioSelected.nombre;
      guardia.idPersona = event.idPersona;
      guardia.letradosGuardia = event.nombre;
      guardia.fechadesde = this.calendarioSelected.fechaDesde;
      guardia.fechahasta = this.calendarioSelected.fechaHasta;
      guardia.tipoTurno = this.calendarioSelected.turno;
      guardia.tipoGuardia = this.calendarioSelected.nombre;
      guardia.numColegiado = event.nColegiado;
      guardia.idCalendarioProgramado = this.calendarioSelected.idCalendarioProgramado;
      guardia.idConjuntoGuardia = this.calendarioSelected.idConjunto;
      guardia.observacionesAnulacion = "";
      guardia.idCalendarioGuardias = this.calendarioSelected.idCalendarioGuardias;
      /*estadoGuardia: "Facturada - 1er Trimestre 2010 - GUARDIAS / ASISTENCIAS"
      facturado: "1"
      fechadesde: 1265842800000
      fechahasta: 1265842800000
      historico: false
      idCalendarioGuardias: "1"
      idFacturacion: 4
      idGuardia: "769"
      idPersona: "2005003253"
      idTurno: "804"
      letradosGuardia: "UOSSLU PCZYHJD,EMILIO"
      numColegiado: "5896"
      ordenGrupo: "Sin Grupo"
      requeridaValidacion: false
      tipoDiasGuardia: "Sin dias en la Guardia."
      tipoGuardia: "G. Civil Villajoyosa"
      tipoTurno: "T.O PENAL BENIDORM"
      validada: "1"*/
      this.persistenceService.setDatos(guardia);
      sessionStorage.setItem("infoGuardiaColeg",JSON.stringify(guardia));
      sessionStorage.setItem("originGuardiaColeg","true");
      sessionStorage.setItem("crearGuardiaColegiado","true");
      this.router.navigate(['/gestionGuardiaColegiado']);
    }else if(sessionStorage.getItem("pantalla") == "designaciones"){
      sessionStorage.setItem("buscadorColegiados", JSON.stringify(event));
      sessionStorage.removeItem("pantalla");
      this.router.navigate(['/designaciones']);
    }else if(sessionStorage.getItem("pantalla") == "ejgexpress"){
      sessionStorage.setItem("buscadorColegiados", JSON.stringify(event));
      sessionStorage.setItem("vieneDeJE", "true");
      sessionStorage.removeItem("pantalla");
      this.router.navigate(['/designaciones']);
    }else{
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