import { Component, OnInit, Input } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { CalendariosDatosEntradaItem } from '../../../../programacionCalendarios/CalendariosDatosEntradaItem.model';
import { Router } from '@angular/router';
import { CommonsService } from '../../../../../../../_services/commons.service';
import * as moment from 'moment';
import { CalendarioProgramadoItem } from '../../../../../../../models/guardia/CalendarioProgramadoItem';

@Component({
  selector: 'app-calendarios',
  templateUrl: './calendarios.component.html',
  styleUrls: ['./calendarios.component.scss']
})
export class CalendariosComponent implements OnInit {

  @Input() tarjetaCalendarios;
  modoEdicion: boolean = false;
  openFicha;
  datos = {
    fechaDesde: "",
    fechaHasta: "",
    generado: ""
  };
   msgs;
  comboEstado = [
    { label: "Pendiente", value: "4" },
    { label: "Programada", value: "0" },
    { label: "En proceso", value: "1" },
    { label: "Procesada con Errores", value: "2" },
    { label: "Finalizada", value: "3" },
    { label: "Reprogramada", value: "5" }
  ];
  comboListaGuardias =[];
  progressSpinner = false;
  idTurno;
  idGuardia;
  responseObject = 
              {
                'duplicar': false,
                'turno': '',
                'nombre': '',
                'tabla' : [],
                'idTurno': '',
                'idGuardia': '',
                'observaciones': '',
                'fechaDesde': '',
                'fechaHasta': '',
                'fechaProgramacion': new Date(),
                'estado': '' ,
                'generado': '',
                'numGuardias': '',
                'idCalG': '',
                'listaGuarias': {},
                'idCalendarioProgramado': '',
                'facturado': '',
                'asistenciasAsociadas': ''
              };
    calendarioDisponible = false;
  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private router : Router,
    private commonsService : CommonsService) { }

  ngOnInit() {
    this.calendarioDisponible = false;
    this.sigaServices.datosRedy$.subscribe(
      data => {
        if (data.body) {
          data = JSON.parse(data.body)
          this.modoEdicion = true;
          this.idGuardia = data.idGuardia;
          this.idTurno = data.idTurno
          //this.getDatosCalendario();
          this.getCalProg();
        }
      });

      if(this.persistenceService.getDatos()){
        this.getComboConjuntoGuardia();
      }

  }

  getComboConjuntoGuardia() {
    this.sigaServices.get(
      "busquedaGuardia_conjuntoGuardia").subscribe(
        data => {
          this.comboListaGuardias = data.combooItems;
          this.commonsService.arregloTildesCombo(this.comboListaGuardias);
        },
        err => {
          //console.log(err);
        }
      )

  }

  getCalProg(){
    //this.progressSpinner = true;

    let datos = this.persistenceService.getDatos();
    
    if(datos.idGuardia == undefined || datos.idGuardia == null){
      datos = this.persistenceService.getDatos();
    }

    let datosEntrada = 
    { 'idTurno': datos.idTurno,
      'idConjuntoGuardia': null,
     'idGuardia': datos.idGuardia,
      'fechaCalendarioDesde': null,
      'fechaCalendarioHasta': null,
      'fechaProgramadaDesde': null,
      'fechaProgramadaHasta': null,
    };
    this.sigaServices.post(
      "guardiaUltimoCalendario_buscar", datosEntrada).subscribe(
        data => {
          let datos;
          //console.log('data: ', data.body)
          if(data.body){
            let error = JSON.parse(data.body).error;
          
            datos = JSON.parse(data.body);
          }
          if(datos){

              this.responseObject = 
              {
                'duplicar': false,
                'turno': datos.turno,
                'nombre': datos.guardia,
                'tabla' : [],
                'idTurno': datos.idTurno,
                'idGuardia': datos.idGuardia,
                'observaciones': datos.observaciones,
                'fechaDesde': datos.fechaDesde.split("-")[2].split(" ")[0] +"/"+ datos.fechaDesde.split("-")[1] + "/"+ datos.fechaDesde.split("-")[0],
                'fechaHasta': datos.fechaHasta.split("-")[2].split(" ")[0] +"/"+ datos.fechaHasta.split("-")[1] + "/"+ datos.fechaHasta.split("-")[0],
                'fechaProgramacion': moment(datos.fechaProgramacion,'DD/MM/YYYY HH:mm:ss').toDate(),
                'estado': this.comboEstado.find(comboItem => comboItem.value == datos.estado).label ,
                'generado': datos.generado,
                'numGuardias': datos.numGuardias,
                'idCalG': datos.idCalG,
                'listaGuarias': {value : this.comboListaGuardias.find(comboItem => comboItem.label == datos.listaGuardias).value},
                'idCalendarioProgramado': datos.idCalendarioProgramado,
                'facturado': datos.facturado,
                'asistenciasAsociadas': datos.asistenciasAsociadas,
                //'idCalendarioGuardias' : this.datosGenerales.idCalendarioGuardias
              };

              this.datos.fechaDesde = this.responseObject.fechaDesde;
              this.datos.fechaHasta = this.responseObject.fechaHasta;
              this.datos.generado = this.responseObject.generado;
              if (this.datos.fechaDesde != "" && this.datos.fechaDesde != undefined && this.datos.fechaDesde != null){
                this.calendarioDisponible = true;
              }
              this.persistenceService.setDatos(this.responseObject);
          }
          this.progressSpinner = false;
        },
        (error)=>{
          this.progressSpinner = false;
          this.showMessage("info", "No existen calendarios para esta guardia", "No existen calendarios para esta guardia");
          console.log(error);
        }
      );


  }

  goToCalendariosProgramados(){
    this.progressSpinner = false;
    let data :  CalendarioProgramadoItem = new CalendarioProgramadoItem();
    data.idGuardia = this.idGuardia
    data.idTurno = this.idTurno
    sessionStorage.setItem(
      "filtroGuardiaDesdeGuardias",JSON.stringify(data)
    );
    this.router.navigate(["/programacionCalendarios"]);
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  getDatosCalendario() {
    //let idGuardiaprovisional = 362; //borrar
    this.sigaServices.post(
      "busquedaGuardias_getCalendario", this.persistenceService.getDatos().idGuardia).subscribe(
       // "busquedaGuardias_getCalendario", idGuardiaprovisional).subscribe(
        data => {
          if (data.body)
            this.datos = JSON.parse(data.body);
        },
        err => {
          //console.log(err);
        }
      )
  }

  clear() {
    this.msgs = [];
  }
  
}
