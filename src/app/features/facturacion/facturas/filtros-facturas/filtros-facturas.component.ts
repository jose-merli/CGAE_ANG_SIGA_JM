import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MultiSelect } from 'primeng/multiselect';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { FacturasItem } from '../../../../models/FacturasItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { KEY_CODE } from '../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';

@Component({
  selector: 'app-filtros-facturas',
  templateUrl: './filtros-facturas.component.html',
  styleUrls: ['./filtros-facturas.component.scss']
})
export class FiltrosFacturasComponent implements OnInit {

  @Output() buscarFacturas = new EventEmitter<boolean>();

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
  comboEstadosFacturas: any[];
  estadosSelect: any[] = [];

  msgs: any[] = [];

  fechaHoy = new Date();

  // crear un body con el item (después de haber creado el item)
  body: FacturasItem = new FacturasItem();
  comboColegios : ComboItem[] = [];
  institucionGeneral : boolean = true;

  institucionActual;

  constructor(
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService,
    private sigaServices: SigaServices,
    //private router: Router
  ) { }

  ngOnInit() {
    this.getCombos();

    if (sessionStorage.getItem("mensaje") && sessionStorage.getItem("volver")) {
      let message: Message = JSON.parse(sessionStorage.getItem("mensaje"));
      if (message)
        this.showMessage(message.severity, message.summary, message.detail);
      sessionStorage.removeItem("mensaje");
      sessionStorage.removeItem("volver");
    } else if(this.persistenceService.getFiltros() && sessionStorage.getItem("volver")){
      this.body = this.persistenceService.getFiltros();
      this.persistenceService.clearFiltros();

      sessionStorage.removeItem("volver");

      this.body.fechaEmisionDesde = this.transformDate(this.body.fechaEmisionDesde);
      this.body.fechaEmisionHasta = this.transformDate(this.body.fechaEmisionHasta);

      this.isBuscar();
    } else if(!sessionStorage.getItem("idFichero")) {
        this.body.fechaEmisionDesde = new Date( new Date().setFullYear(new Date().getFullYear()-2));     
    } else if(sessionStorage.getItem("idFichero")) {
      if (sessionStorage.getItem("tipoFichero") =='T') {
				this.body.identificadorTransferencia = sessionStorage.getItem("idFichero");
			} else if (sessionStorage.getItem("tipoFichero") =='A') {
				this.body.identificadorAdeudos = sessionStorage.getItem("idFichero");
			} else if (sessionStorage.getItem("tipoFichero") =='D') {
				this.body.identificadorDevolucion = sessionStorage.getItem("idFichero");
			}
      sessionStorage.removeItem("idFichero");
			sessionStorage.removeItem("tipoFichero");
      this.isBuscar();
    }

  }

  // Get combos
  getCombos() {
    this.getComboSeriesFacturacion();
    this.getComboContabilizado();
    this.getComboFacturaciones();
    this.getComboFormaCobroAbono();
    this.getComboEstadosFacturas();
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      this.getColegios();
    });
  }
  

  // Combos
  getComboEstadosFacturas() {
    this.progressSpinner=true;

    this.sigaServices.get("facturacionPyS_comboEstadosFacturas").subscribe(
      n => {
        this.comboEstadosFacturas = n.combooItems;
        //console.log(this.comboEstadosFacturas);

        //this.commonServices.arregloTildesCombo(this.comboEstadosFacturas);
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner=false;
      }
    );
  }

  getColegios() {
    this.progressSpinner = true;

    this.sigaServices.getParam("busquedaCol_colegio", "?idInstitucion=" + this.institucionActual).subscribe(
      n => {
        this.comboColegios = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboColegios);

        if (this.institucionActual == "2000") {
          this.institucionGeneral = true;
        }

        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  getComboFormaCobroAbono() {
    this.comboFormaCobroAbono.push({value: 'E', label: this.translateService.instant('facturacion.facturas.efectivo') , local: undefined});
    this.comboFormaCobroAbono.push({value: 'B', label: this.translateService.instant('censo.tipoAbono.banco') , local: undefined});
    this.comboFormaCobroAbono.push({value: 'A', label: this.translateService.instant('fichaEventos.datosRepeticion.tipoDiasRepeticion.ambos') , local: undefined});
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
    
    if(this.estadosSelect.length>0){
      this.body.estadosFiltroFac = [];
      this.body.estadosFiltroAb = [];
      for(let i=0; this.estadosSelect.length>i; i++){
        if(this.estadosSelect[i].label2=="FACTURA"){
          this.body.estadosFiltroFac.push(this.estadosSelect[i].value);
        }else{
          this.body.estadosFiltroAb.push(this.estadosSelect[i].value);
        }
      }
    }

    this.persistenceService.setFiltros(this.body);
    this.buscarFacturas.emit();

  }

  // Transformar fecha
  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    else
      fecha = null;
    // fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
    return fecha;
  }

  clear() { 
    this.msgs = [];
  }

  // boton de limpiar
  clearFilters() {
    
    this.estadosSelect = [];
    this.body = new FacturasItem();
    this.persistenceService.clearFiltros();

    this.showDatosGenerales = true;
    this.showDatosAgrupacion = true;
    this.showCliente = true;
    this.showComunicacionesCobrosRecobros = true;

    sessionStorage.removeItem("numColegiado");

    this.goTop();
  }

  // Búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
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
