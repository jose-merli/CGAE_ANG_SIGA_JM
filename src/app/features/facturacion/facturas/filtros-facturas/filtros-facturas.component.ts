import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MultiSelect } from 'primeng/multiselect';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { FacturasItem } from '../../../../models/FacturasItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { KEY_CODE } from '../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { BuscadorColegiadosExpressComponent } from '../../../../commons/buscador-colegiados-express/buscador-colegiados-express.component';
import {InputSwitchModule} from 'primeng/inputswitch';

@Component({
  selector: 'app-filtros-facturas',
  templateUrl: './filtros-facturas.component.html',
  styleUrls: ['./filtros-facturas.component.scss']
})
export class FiltrosFacturasComponent implements OnInit {
  
  progressSpinner: boolean = false;

  // variables para desplegar/minimizar secciones del componente
  showDatosGenerales: boolean = true;
  showDatosAgrupacion: boolean = false;
  showCliente: boolean = false;
  showComunicacionesCobrosRecobros: boolean = false;
  
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

  //isLetrado : boolean = false;

  @ViewChild('inputNum') inputNum: ElementRef;
  @ViewChild(BuscadorColegiadosExpressComponent) buscadorColegiadoExpress;

  @Input() idPersona;
  @Output() buscarFacturas = new EventEmitter<boolean>();

  checked1: boolean = true;
  checked2: boolean = false;
  @ViewChild('estados') estadosMultiSelect: MultiSelect;

  nodes: any[];

  selectedNode: any;

  comboEstadosFacturasRespaldo : any[] = [];

  constructor(
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService,
    private sigaServices: SigaServices
  ) {}

  ngOnInit() {

    this.progressSpinner = true;

    //this.isLetrado = this.sigaStorageService.isLetrado;

    this.getCombos();

    if (sessionStorage.getItem("mensaje") && sessionStorage.getItem("volver")) {
      let message: Message = JSON.parse(sessionStorage.getItem("mensaje"));
      if (message) {
        this.showMessage(message.severity, message.summary, message.detail);
      }
      sessionStorage.removeItem("mensaje");
      sessionStorage.removeItem("volver");
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
    }


    setTimeout(() => {
      this.inputNum.nativeElement.focus();  
    }, 300);

    if (sessionStorage.getItem("datosColegiado")) {
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("datosColegiado"));
      sessionStorage.removeItem("datosColegiado");
      if(busquedaColegiado.idPersona != null) {
        this.sigaServices.post("designaciones_searchAbogadoByIdPersona", busquedaColegiado.idPersona).subscribe(
          n => {
            let data = JSON.parse(n.body).colegiadoItem;
            if(data != null && data.length == 1){
              this.buscadorColegiadoExpress.setClienteSession(data[0]);
            }
          },() => {
            this.isBuscar();
          });
      } else {
          this.isBuscar();
      }
    } else{
      this.progressSpinner = false;
    }
  }

  handleChangeFac2()   {
    this.estadosSelect = [];

    if (this.checked1) {
      this.estadosSelect = this.comboEstadosFacturasRespaldo
        .filter(item => item.label2 === 'FACTURA')
        //.map(item => item.value);
    }
    if (this.checked2) {
      this.estadosSelect = this.estadosSelect.concat(
        this.comboEstadosFacturasRespaldo
          .filter(item => item.label2 === 'ABONO')
      );
    }
  
  }


handleChangeFac(e) {

  if (this.checked1) {

    let estadosFacturas = this.comboEstadosFacturasRespaldo.filter(e => e.label2=="FACTURA");

    estadosFacturas.forEach((element: any) => {
      this.estadosSelect.push(element);
    });
  }else{
    this.estadosSelect = this.estadosSelect.filter(e => e.label2=="ABONO");
  }

  this.estadosMultiSelect.updateLabel();
}

handleChangeFacRect(e) {

  if (this.checked2) {

    let estadosFacturas = this.comboEstadosFacturasRespaldo.filter(e => e.label2=="ABONO");

    estadosFacturas.forEach((element: any) => {
      this.estadosSelect.push(element);
    });
  }else{
    this.estadosSelect = this.estadosSelect.filter(e => e.label2=="FACTURA");
  }

  this.estadosMultiSelect.updateLabel();
}

/*
    if (this.checked1) {
      if (this.checked2) {        
        this.estadosSelect=this.comboEstadosFacturasRespaldo;
      }else{
        this.estadosSelect=this.comboEstadosFacturasRespaldo.filter(e => e.label2=="FACTURA");
      }

    }else{
      if (this.checked2) {        
        this.estadosSelect=this.comboEstadosFacturasRespaldo.filter(e => e.label2=="ABONO");
      }else{
        this.estadosSelect=this.comboEstadosFacturasRespaldo;
      }
    }
*/




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
    this.sigaServices.get("facturacionPyS_comboEstadosFacturas").subscribe(
      n => {
        this.comboEstadosFacturas = n.combooItems;
        //console.log(this.comboEstadosFacturas);

        //this.commonServices.arregloTildesCombo(this.comboEstadosFacturas);
        this.progressSpinner=false;
        this.comboEstadosFacturasRespaldo= this.comboEstadosFacturas;
        this.estadosSelect=this.comboEstadosFacturasRespaldo.filter(e => e.label2=="FACTURA");

      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );


  }

  comboEstadosFacturasChange(event){
    //this.estadosSelect = event.value
    let copiaestados = this.estadosSelect
    if (copiaestados.filter (e => e.label2=="FACTURA").length==0) {
      this.checked1=false;
    }else{
      this.checked1=true;
    }
    if (copiaestados.filter (e => e.label2=="ABONO").length==0) {
      this.checked2=false;
    }else{
      this.checked2=true;
    }

  }

  getComboFormaCobroAbono() {
    this.comboFormaCobroAbono.push({value: 'E', label: this.translateService.instant('facturacion.facturas.efectivo') , local: undefined});
    this.comboFormaCobroAbono.push({value: 'B', label: this.translateService.instant('censo.tipoAbono.banco') , local: undefined});
    this.comboFormaCobroAbono.push({value: 'A', label: this.translateService.instant('fichaEventos.datosRepeticion.tipoDiasRepeticion.ambos') , local: undefined});
  }

  getComboSeriesFacturacion() {
    this.sigaServices.get("facturacionPyS_comboSeriesFacturacion").subscribe(
      n => {
        this.comboSeriesFacturacion = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboSeriesFacturacion);
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  getComboFacturaciones() {
    this.sigaServices.get("facturacionPyS_comboFacturaciones").subscribe(
      n => {
        this.comboFacturaciones = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboFacturaciones);
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }
  
  getComboContabilizado() {
    this.comboContabilizado.push({value: 'S', label: this.translateService.instant('messages.si') , local: undefined});
    this.comboContabilizado.push({value: 'N', label: this.translateService.instant('general.boton.no') , local: undefined});
  }

  // multiselect function
  focusInputField(someMultiselect: MultiSelect) {
    setTimeout(() => {someMultiselect.filterInputChild.nativeElement.focus();}, 300);
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
    this.body.estadosFiltroFac = [];
    this.body.estadosFiltroAb = [];
    if(this.estadosSelect.length>0){
      for(let i = 0; i < this.estadosSelect.length; i++){
        if(this.estadosSelect[i].label2=="FACTURA"){
          this.body.estadosFiltroFac.push(this.estadosSelect[i].value);
        }else{
          this.body.estadosFiltroAb.push(this.estadosSelect[i].value);
        }
      }
    }

    if (this.buscadorColegiadoExpress != undefined) {
      this.body.idCliente = this.buscadorColegiadoExpress.idPersona;
      if (this.body.idCliente == "") {
        this.body.idCliente = null;
      }
      
      this.body.numeroColegiado = this.buscadorColegiadoExpress.clientForm.get('numeroColegiadoCliente').value;
      if (this.body.numeroColegiado == "") {
        this.body.numeroColegiado = null;
      }
    }

    this.persistenceService.setFiltros(this.body);
    this.buscarFacturas.emit();
  }

  // Transformar fecha
  transformDate(fecha) {
    if (fecha != undefined){
            fecha = new Date(fecha);
    } else {
      fecha = null;
    }
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
    this.buscadorColegiadoExpress.limpiarCliente(true);

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