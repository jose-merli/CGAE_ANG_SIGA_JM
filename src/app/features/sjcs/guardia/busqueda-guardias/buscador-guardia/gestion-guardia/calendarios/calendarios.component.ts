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
  comboEstado = [
    { label: "Pendiente", value: "5" },
    { label: "Programada", value: "1" },
    { label: "En proceso", value: "2" },
    { label: "Procesada con Errores", value: "3" },
    { label: "Generada", value: "4" }
  ];
  comboListaGuardias =[];
  
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
          console.log(err);
        }
      )

  }

  goToFichaProgramacion(){
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
      "guardiaCalendario_buscar", datosEntrada).subscribe(
        data => {
          console.log('data: ', data.body)
          let error = JSON.parse(data.body).error;
          let datos = JSON.parse(data.body);
          if(datos && datos.length > 0){

              let responseObject = 
              {
                'duplicar': false,
                'turno': datos[0].turno,
                'nombre': datos[0].guardia,
                'tabla' : [],
                'idTurno': datos[0].idTurno,
                'idGuardia': datos[0].idGuardia,
                'observaciones': datos[0].observaciones,
                'fechaDesde': datos[0].fechaDesde.split("-")[2].split(" ")[0] +"/"+ datos[0].fechaDesde.split("-")[1] + "/"+ datos[0].fechaDesde.split("-")[0],
                'fechaHasta': datos[0].fechaHasta.split("-")[2].split(" ")[0] +"/"+ datos[0].fechaHasta.split("-")[1] + "/"+ datos[0].fechaHasta.split("-")[0],
                'fechaProgramacion': moment(datos[0].fechaProgramacion,'DD/MM/YYYY HH:mm:ss').toDate(),
                'estado': this.comboEstado.find(comboItem => comboItem.value == datos[0].estado).label ,
                'generado': datos[0].generado,
                'numGuardias': datos[0].numGuardias,
                'idCalG': datos[0].idCalG,
                'listaGuarias': {value : this.comboListaGuardias.find(comboItem => comboItem.label == datos[0].listaGuardias).value},
                'idCalendarioProgramado': datos[0].idCalendarioProgramado,
                'facturado': datos[0].facturado,
                'asistenciasAsociadas': datos[0].asistenciasAsociadas
              };

              this.persistenceService.setDatos(responseObject);
              this.router.navigate(["/fichaProgramacion"]);
          }

        },
        (error)=>{
          console.log(error);
        }
      );


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
          console.log(err);
        }
      )
  }

}
