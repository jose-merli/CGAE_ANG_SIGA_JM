import { Component, OnInit, Input } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { CalendariosDatosEntradaItem } from '../../../../programacionCalendarios/CalendariosDatosEntradaItem.model';
import { Router } from '@angular/router';
import { CommonsService } from '../../../../../../../_services/commons.service';
import * as moment from 'moment';

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
    { label: "Generada", value: "3" },
    { label: "Reprogramada", value: "5" }
  ];
  comboListaGuardias =[];
  progressSpinner = false;
  
  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private router : Router,
    private commonsService : CommonsService) { }

  ngOnInit() {
    this.sigaServices.datosRedy$.subscribe(
      data => {
        if (data.body) {
          data = JSON.parse(data.body)
          this.modoEdicion = true;
          this.getDatosCalendario();
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

  goToFichaProgramacion(){
    this.progressSpinner = true;
    let datosEntrada = 
    { 'idTurno': this.persistenceService.getDatos().idTurno,
      'idConjuntoGuardia': null,
     'idGuardia': this.persistenceService.getDatos().idGuardia,
      'fechaCalendarioDesde': null,
      'fechaCalendarioHasta': null,
      'fechaProgramadaDesde': null,
      'fechaProgramadaHasta': null,
    };
    this.sigaServices.post(
      "guardiaUltimoCalendario_buscar", datosEntrada).subscribe(
        data => {
          //console.log('data: ', data.body)
          let error = JSON.parse(data.body).error;
          let datos = JSON.parse(data.body);
          if(datos){

              let responseObject = 
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

              this.persistenceService.setDatos(responseObject);
              this.progressSpinner = false;
              this.router.navigate(["/fichaProgramacion"]);
          }

        },
        (error)=>{
          this.progressSpinner = false;
          this.showMessage("error", "No existen calendarios para esta guardia", "No existen calendarios para esta guardia");
          console.log(error);
        }
      );


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
