import { Component, OnInit, Input } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../../_services/persistence.service';

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
  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.sigaServices.datosRedy$.subscribe(
      data => {
        if (data.body) {
          data = JSON.parse(data.body)
          this.modoEdicion = true;
          this.getDatosCalendario();
        }
      });

  }


  getDatosCalendario() {
    this.sigaServices.post(
      "busquedaGuardias_getCalendario", this.persistenceService.getDatos().idGuardia).subscribe(
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
