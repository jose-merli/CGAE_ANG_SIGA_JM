import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import * as moment from 'moment';
import { CalendarioProgramadoItem } from '../../../../../../models/guardia/CalendarioProgramadoItem';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-calendario-gestion-guardia-colegiado',
  templateUrl: './calendario-gestion-guardia-colegiado.component.html',
  styleUrls: ['./calendario-gestion-guardia-colegiado.component.scss']
})
export class CalendarioGestionGuardiaColegiadoComponent implements OnInit {

  msgs;
  progressSpinner;
  calendarioItem;
  calendarioBody: GuardiaItem;
  idConjuntoGuardia;
  responseObject
 dataRecived:boolean;
 comboEstado = [
  { label: "Pendiente", value: "4" },
  { label: "Programada", value: "0" },
  { label: "En proceso", value: "1" },
  { label: "Procesada con Errores", value: "2" },
  { label: "Generada", value: "3" },
  { label: "Reprogramada", value: "5" }
];
comboListaGuardias =[];
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private router: Router,
    private commonsService : CommonsService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;
    if (this.persistenceService.getDatos()) {
      this.calendarioBody = this.persistenceService.getDatos();
      this.getComboConjuntoGuardia();
      if(this.comboListaGuardias != null || this.comboListaGuardias != undefined){
        this.getCalendarioInfo();
      }
      
    }
    this.progressSpinner = false
  }

  getComboConjuntoGuardia() {
    this.progressSpinner = true
    this.sigaServices.get(
      "busquedaGuardia_conjuntoGuardia").subscribe(
        data => {
          this.comboListaGuardias = data.combooItems;
          this.commonsService.arregloTildesCombo(this.comboListaGuardias);
          this.progressSpinner = false
        },
        err => {
          //console.log(err);
          this.progressSpinner = false
        }
      )

  }

  getCalendarioInfo() {

    this.progressSpinner = true
    let datosEntrada =
    {
      'idTurno': this.calendarioBody.idTurno,
      'idConjuntoGuardia': null,
      'idGuardia': this.calendarioBody.idGuardia,
      'fechaCalendarioDesde': null,
      'fechaCalendarioHasta': null,
      'fechaProgramadaDesde': null,
      'fechaProgramadaHasta': null,
    };
    this.sigaServices.post(
      "guardiaUltimoCalendario_buscar", datosEntrada).subscribe(
        data => {
          let error = JSON.parse(data.body).error;
          this.calendarioItem = JSON.parse(data.body);
          if(this.calendarioItem){
            this.responseObject =
            {
              'duplicar': false,
              'turno': this.calendarioItem.turno,
              'nombre': this.calendarioItem.guardia,
              'tabla': [],
              'idTurno': this.calendarioItem.idTurno,
              'idGuardia': this.calendarioItem.idGuardia,
              'observaciones': this.calendarioItem.observaciones,
              'fechaDesde': this.calendarioItem.fechaDesde.split("-")[2].split(" ")[0] +"/"+ this.calendarioItem.fechaDesde.split("-")[1] + "/"+ this.calendarioItem.fechaDesde.split("-")[0],
              'fechaHasta': this.calendarioItem.fechaHasta.split("-")[2].split(" ")[0] +"/"+ this.calendarioItem.fechaHasta.split("-")[1] + "/"+ this.calendarioItem.fechaHasta.split("-")[0],
              'fechaProgramacion': moment(this.calendarioItem.fechaProgramacion, 'DD/MM/YYYY HH:mm:ss').toDate(),
              'estado': this.comboEstado.find(comboItem => comboItem.value == this.calendarioItem.estado).label,
              'generado': this.calendarioItem.generado,
              'numGuardias': this.calendarioItem.numGuardias,
              'idCalG': this.calendarioItem.idCalG,
              'listaGuarias':   {value : this.comboListaGuardias.find(comboItem => comboItem.label == this.calendarioItem.listaGuardias).value},
              'idCalendarioProgramado': this.calendarioItem.idCalendarioProgramado,
              'facturado': this.calendarioItem.facturado,
              'asistenciasAsociadas': this.calendarioItem.asistenciasAsociadas,
              //'idCalendarioGuardias' : this.datosGenerales.idCalendarioGuardias
            };
          this.dataRecived = true;
          }else{

          }
          this.progressSpinner = false
        },
        (error) => {
          //console.log(error);
          this.progressSpinner = false
          this.showMessage("error", "No existen calendarios para esta guardia", "No existen calendarios para esta guardia");
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


  navigateToFichaGuardia() {
    sessionStorage.setItem('guardiaColegiadoData',JSON.stringify(this.responseObject));
    this.router.navigate(["/fichaProgramacion"]);


  }

  clear() {
    this.msgs = []
  }


}
