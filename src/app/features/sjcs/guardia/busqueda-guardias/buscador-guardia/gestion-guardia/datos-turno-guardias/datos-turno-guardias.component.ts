import { Component, OnInit, Input } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { TurnosItems } from '../../../../../../../models/sjcs/TurnosItems';
import { TranslateService } from '../../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../../_services/persistence.service';

@Component({
  selector: 'app-datos-turno-guardias',
  templateUrl: './datos-turno-guardias.component.html',
  styleUrls: ['./datos-turno-guardias.component.scss']
})
export class DatosTurnoGuardiasComponent implements OnInit {

  body: TurnosItems = new TurnosItems();
  progressSpinner: boolean = false;

  @Input() modoEdicion: boolean = false;

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.sigaServices.datosRedy$.subscribe(
      data => {
        this.modoEdicion = true;
        this.getResumen();

      });
  }

  getResumen() {
    this.progressSpinner = true;
    this.sigaServices.post("gestionGuardias_resumenTurno", this.persistenceService.getDatos().idTurno).subscribe(
      data => {
        this.body = JSON.parse(data.body).turnosItem[0];
        this.progressSpinner = false;
      },

      () => {
        this.progressSpinner = false;
      }
    );
  }
}


