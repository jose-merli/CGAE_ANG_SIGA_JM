import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import * as moment from 'moment';
import { CalendarioProgramadoItem } from '../../../../../../models/guardia/CalendarioProgramadoItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { DatePipe } from '@angular/common';

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
  { label: "Finalizada", value: "3" },
  { label: "Reprogramada", value: "5" }
];
comboListaGuardias =[];
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private router: Router,
    private commonsService : CommonsService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    //this.progressSpinner = true;
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
    //this.progressSpinner = true
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
  formatDate2(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }
  getCalendarioInfo() {
    //this.progressSpinner = true
    let datosEntrada =
      {
        'idTurno': this.calendarioBody.idTurno,
        'idConjuntoGuardia': null,
        'idGuardia': this.calendarioBody.idGuardia,
        'fechaCalendarioDesde': this.calendarioBody.fechadesde != null ? this.calendarioBody.fechadesde.toString().length > 10 ?  this.formatDate2(this.calendarioBody.fechadesde) : this.calendarioBody.fechadesde  : null ,
        'fechaCalendarioHasta': this.calendarioBody.fechahasta != null ? this.calendarioBody.fechahasta.toString().length > 10 ?  this.formatDate2(this.calendarioBody.fechahasta) : this.calendarioBody.fechahasta  : null ,
        'fechaProgramadaDesde': null,
        'fechaProgramadaHasta': null,
        'idCalendarioProgramado' : this.calendarioBody.idCalendarioProgramado != null ? this.calendarioBody.idCalendarioProgramado : null ,
      };

    this.sigaServices.post(
      "guardiaCalendario_buscar", datosEntrada).subscribe(
        data => {
          if(data.body){
            let error = JSON.parse(data.body).error;
          };
          this.calendarioItem = JSON.parse(data.body)[0];
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
              'fechaDesde': this.calendarioItem.fechaDesde.toString().split("-")[2].split(" ")[0] +"/"+ this.calendarioItem.fechaDesde.toString().split("-")[1] + "/"+ this.calendarioItem.fechaDesde.toString().split("-")[0],
              'fechaHasta': this.calendarioItem.fechaHasta.toString().split("-")[2].split(" ")[0] +"/"+ this.calendarioItem.fechaHasta.toString().split("-")[1] + "/"+ this.calendarioItem.fechaHasta.toString().split("-")[0],
              // 'fechaDesde': this.calendarioItem.fechaDesde,
              //'fechaHasta': this.calendarioItem.fechaHasta,
              'fechaProgramacion':this.calendarioItem.fechaProgramacion,
              //'fechaProgramacion': moment(this.calendarioItem.fechaProgramacion, 'DD/MM/YYYY HH:mm:ss').toDate(),
              'estado':this.calendarioItem.estado,
              'generado': this.calendarioItem.generado,
              'numGuardias': this.calendarioItem.numGuardias,
              'idInstitucion': this.calendarioItem.idInstitucion,
              'idCalG': this.calendarioItem.idCalG,
              'listaGuarias':   {label: null, value: null},
              'idCalendarioProgramado': this.calendarioItem.idCalendarioProgramado,
              'facturado': this.calendarioItem.facturado,
              'asistenciasAsociadas': this.calendarioItem.asistenciasAsociadas,
              'estadoProgramacion' : this.calendarioItem.estado,
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
    sessionStorage.setItem('desdeGC','true');
    this.router.navigate(["/fichaProgramacion"]);


  }

  clear() {
    this.msgs = []
  }


}
