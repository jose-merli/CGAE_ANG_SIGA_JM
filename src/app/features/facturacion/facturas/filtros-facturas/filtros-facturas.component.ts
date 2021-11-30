import { Component, OnInit } from '@angular/core';
import { ComboItem } from '../../../../models/ComboItem';
import { FacturasItem } from '../../../../models/FacturasItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-filtros-facturas',
  templateUrl: './filtros-facturas.component.html',
  styleUrls: ['./filtros-facturas.component.scss']
})
export class FiltrosFacturasComponent implements OnInit {


  // variables para desplegar/minimizar secciones del componente
  showDatosGenerales: boolean = true;
  showDatosAgrupacion: boolean = true;
  showCliente: boolean = true;
  showComunicacionesCobrosRecobros: boolean = true;

  // crear combo para opciones en un dropdown
  comboSeriesFacturacion: ComboItem[] = [];

  // crear un body con el item (después de haber creado el item)
  body: FacturasItem = new FacturasItem();

  constructor(
    //private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService,
    private sigaServices: SigaServices,
    //private router: Router
  ) { }

  ngOnInit() {
    this.getComboSeriesFacturacion();
  }

  // Get combos
  /*
  getCombos() {
    this.getComboSeriesFacturacion();
  }
  */

  // Combos
  getComboSeriesFacturacion() {
    this.sigaServices.get("facturacionPyS_comboSeriesFacturacion").subscribe(
      n => {
        this.comboSeriesFacturacion = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboSeriesFacturacion);
      },
      err => {
        console.log(err);
      }
    );
  }


  // Mostrar u ocultar filtros de datos generales
  onHideDatosGenerales(): void {
    this.showDatosGenerales = !this.showDatosGenerales;
    }

  // Mostrar u ocultar filtros de datos de agrupacion
  onShowDatosAgrupacion(): void {
    this.showDatosAgrupacion = !this.showDatosAgrupacion;
    }

  // Mostrar u ocultar filtros de datos de agrupacion
  onShowCliente(): void {
    this.showCliente = !this.showCliente;
    }

  // Mostrar u ocultar filtros de datos de agrupacion
  onShowComunicacionesCobrosRecobros(): void {
    this.showComunicacionesCobrosRecobros = !this.showComunicacionesCobrosRecobros;
    }

}
