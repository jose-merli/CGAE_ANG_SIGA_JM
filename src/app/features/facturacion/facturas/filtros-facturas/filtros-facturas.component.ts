import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MultiSelect } from 'primeng/multiselect';
import { TranslateService } from '../../../../commons/translate';
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

  @Output() busqueda = new EventEmitter<boolean>();

  progressSpinner: boolean = false;

  // variables para desplegar/minimizar secciones del componente
  showDatosGenerales: boolean = true;
  showDatosAgrupacion: boolean = true;
  showCliente: boolean = true;
  showComunicacionesCobrosRecobros: boolean = true;

  // crear combo para opciones en un dropdown
  comboSeriesFacturacion: ComboItem[] = [];
  comboContabilizado: ComboItem[] = [];
  comboFacturaciones: ComboItem[] = [];
  comboFormaCobroAbono: ComboItem[] = [];
  comboEstadosFacturas: ComboItem[] = [];

  msgs: any[] = [];

  fechaHoy = new Date();

  // crear un body con el item (después de haber creado el item)
  body: FacturasItem = new FacturasItem();

  constructor(
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService,
    private sigaServices: SigaServices,
    //private router: Router
  ) { }

  ngOnInit() {
    this.getCombos();

    this.body.fechaEmisionDesde = new Date( new Date().setFullYear(new Date().getFullYear()-2));
  }

  // Get combos
  getCombos() {
    this.getComboSeriesFacturacion();
    this.getComboContabilizado();
    this.getComboFacturaciones();
    this.getComboFormaCobroAbono();
    this.getComboEstadosFacturas();
  }
  

  // Combos
  getComboEstadosFacturas() {
    this.progressSpinner=true;

    this.sigaServices.get("facturacionPyS_comboEstadosFacturas").subscribe(
      n => {
        this.comboEstadosFacturas = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboEstadosFacturas);
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner=false;
      }
    );
  }

  getComboFormaCobroAbono() {
    this.progressSpinner=true;

    this.sigaServices.get("").subscribe(
      n => {
        this.comboFormaCobroAbono = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboFormaCobroAbono);
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        //this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner=false;
      }
    );
  }

  getComboSeriesFacturacion() {
    this.progressSpinner=true;

    this.sigaServices.get("facturacionPyS_comboSeriesFacturacion").subscribe(
      n => {
        this.comboSeriesFacturacion = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboSeriesFacturacion);
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner=false;
      }
    );
  }

  getComboFacturaciones() {
    this.progressSpinner=true;

    this.sigaServices.get("facturacionPyS_comboFacturaciones").subscribe(
      n => {
        this.comboFacturaciones = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboFacturaciones);
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner=false;
      }
    );
  }
  
  getComboContabilizado() {
    this.comboContabilizado.push({value: 'S', label: this.translateService.instant('messages.si') , local: undefined});
    this.comboContabilizado.push({value: 'N', label: this.translateService.instant('general.boton.no') , local: undefined});
  }

  // multiselect function
  focusInputField(someMultiselect: MultiSelect) {
    setTimeout(() => {
      someMultiselect.filterInputChild.nativeElement.focus();
    }, 300);
  }

  // rellenar fechas de campos de fecha emision
  fillFecha(event, campo) {
    if(campo==='emisionDesde')
      this.body.fechaEmisionDesde = event;
    else if(campo==='emisionHasta')
      this.body.fechaEmisionHasta = event;
  }


  // Mostrar u ocultar filtros de distintas secciones
  onHideDatosGenerales(): void {
    this.showDatosGenerales = !this.showDatosGenerales;
    }

  onShowDatosAgrupacion(): void {
    this.showDatosAgrupacion = !this.showDatosAgrupacion;
    }

  onShowCliente(): void {
    this.showCliente = !this.showCliente;
    }

  onShowComunicacionesCobrosRecobros(): void {
    this.showComunicacionesCobrosRecobros = !this.showComunicacionesCobrosRecobros;
    }

  // boton de busqueda
  isBuscar() {
    this.persistenceService.setFiltros(this.body);
    
    console.log(this.body);
    this.busqueda.emit();

  }

  clear() { 
    this.msgs = [];
  }

  // boton de limpiar
  clearFilters() {
    this.body = new FacturasItem();
    this.persistenceService.clearFiltros();

    this.showDatosGenerales = true;
    this.showDatosAgrupacion = true;
    this.showCliente = true;
    this.showComunicacionesCobrosRecobros = true;

    this.goTop();
  }

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
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
