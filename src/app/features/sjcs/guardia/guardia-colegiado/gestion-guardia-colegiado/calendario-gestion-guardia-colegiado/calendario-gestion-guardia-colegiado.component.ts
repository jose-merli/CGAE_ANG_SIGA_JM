import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import * as moment from 'moment';
import { CalendarioProgramadoItem } from '../../../../../../models/guardia/CalendarioProgramadoItem';

@Component({
  selector: 'app-calendario-gestion-guardia-colegiado',
  templateUrl: './calendario-gestion-guardia-colegiado.component.html',
  styleUrls: ['./calendario-gestion-guardia-colegiado.component.scss']
})
export class CalendarioGestionGuardiaColegiadoComponent implements OnInit {

  msgs;
  progressSpinner;
  calendarioItem;
  calendarioItemSend;
  calendarioBody: GuardiaItem;
  idConjuntoGuardia;
  responseObject
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.progressSpinner = true;
    if (this.persistenceService.getDatos()) {
      this.calendarioBody = this.persistenceService.getDatos();
      this.getCalendarioInfo();
    }
    this.progressSpinner = false
  }

  getCalendarioInfo() {


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
      "guardiaCalendario_buscar", datosEntrada).subscribe(
        data => {
          console.log('data: ', data.body)
          let error = JSON.parse(data.body).error;
          let datos = JSON.parse(data.body);
          if (datos && datos.length > 0) {

            this.responseObject =
            {
              'duplicar': false,
              'turno': datos[0].turno,
              'nombre': datos[0].guardia,
              'tabla': [],
              'idTurno': datos[0].idTurno,
              'idGuardia': datos[0].idGuardia,
              'observaciones': datos[0].observaciones,
              'fechaDesde': datos[0].fechaDesde.split("-")[2].split(" ")[0] + "/" + datos[0].fechaDesde.split("-")[1] + "/" + datos[0].fechaDesde.split("-")[0],
              'fechaHasta': datos[0].fechaHasta.split("-")[2].split(" ")[0] + "/" + datos[0].fechaHasta.split("-")[1] + "/" + datos[0].fechaHasta.split("-")[0],
              'fechaProgramacion': moment(datos[0].fechaProgramacion, 'DD/MM/YYYY HH:mm:ss').toDate().toString(),
              'estado': datos[0].estado,
              'generado': {value: datos[0].generado},
              'numGuardias': datos[0].numGuardias,
              'idCalG': datos[0].idCalG,
              'listaGuarias': { value: datos[0].listaGuardias },
              'idCalendarioProgramado': datos[0].idCalendarioProgramado,
              'facturado': datos[0].facturado,
              'asistenciasAsociadas': datos[0].asistenciasAsociadas,
              'filtrosBusqueda' : new CalendarioProgramadoItem()
            };
            

          }

        },
        (error) => {
          console.log(error);
        }
      );
  }



  navigateToFichaGuardia() {
    sessionStorage.setItem('guardiaColegiadoData', JSON.stringify(this.responseObject));
    this.router.navigate(["/fichaProgramacion"]);


  }

  clear() {
    this.msgs = []
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
