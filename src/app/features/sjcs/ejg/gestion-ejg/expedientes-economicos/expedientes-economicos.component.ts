import { Component, OnInit, Input } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';

@Component({
  selector: 'app-expedientes-economicos',
  templateUrl: './expedientes-economicos.component.html',
  styleUrls: ['./expedientes-economicos.component.scss']
})
export class ExpedientesEconomicosComponent implements OnInit {
  @Input() modoEdicion;
  openFicha: boolean = true;
  permisoEscritura: boolean = false;
  nuevo;
  body;
  bodyInicial;

  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService, ) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined)
      // this.permisoEscritura = this.persistenceService.getPermisos()
      // De momento todo disabled, funcionalidades FAC. Cuando esté todo cambiar Permisos. 
      this.permisoEscritura = false;
    if (this.modoEdicion) {
      if (this.persistenceService.getDatos()) {
        this.nuevo = false;
        this.body = this.persistenceService.getDatos();
        // JSON.parse(n.body).ejgItems
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      }
    } else {
      this.nuevo = true;
      this.body = new EJGItem();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }
  }
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }
}
