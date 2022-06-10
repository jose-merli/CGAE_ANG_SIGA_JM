import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { D } from '@angular/core/src/render3';
import { DataTable, Message } from 'primeng/primeng';
import { format } from 'util';
import { TranslateService } from '../../../../../commons/translate';
import { ComboItem } from '../../../../../models/ComboItem';
import { FacturaLineaItem } from '../../../../../models/FacturaLineaItem';
import { FacturasItem } from '../../../../../models/FacturasItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-lineas-facturas',
  templateUrl: './lineas-facturas.component.html',
  styleUrls: ['./lineas-facturas.component.scss']
})
export class LineasFacturasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  @Input() openTarjetaLineas;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<FacturasItem>();
  @Output() refreshData = new EventEmitter<void>();

  @Input() bodyInicial: FacturasItem;

  // Elementos para la tabla
  @ViewChild("table") table: DataTable;
  rowsPerPage = [];
  selectedItem: number = 10;
  selectedDatos = [];
  cols = [];
  buscadores = [];
  selectAll: boolean;
  selectMultiple: boolean;
  datos: FacturaLineaItem[] = [];
  datosInit: FacturaLineaItem[] = [];

  comboTiposIVA: any[];
  resaltadoDatos: boolean = false;

  permisoEscritura: boolean = true;
  modificarDescripcion: boolean = false;
  modificarImporteUnitario: boolean = false;
  modificarIVA: boolean = false;

  FACTURA_ESTADO_EN_REVISION: string = "7";

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private localStorageService: SigaStorageService
  ) { }

  ngOnInit() {
    if (this.localStorageService.isLetrado)
      this.permisoEscritura = false;
    else
      this.permisoEscritura = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial != undefined && changes.bodyInicial.currentValue != undefined) {
      this.getParametrosFACTURACION();
      this.getComboTiposIVA();
      if (this.bodyInicial.tipo == "FACTURA") {
        this.getLineasFactura();
      } else {
        this.getLineasAbono();
      }
    }
      
  }

  // Combo de tipos IVA
  getComboTiposIVA() {
    this.sigaServices.getParam("facturacionPyS_comboTiposIVA", "?codBanco=" + this.bodyInicial.bancosCodigo).subscribe(
      n => {
        this.comboTiposIVA = n.combooItems;
        this.comboTiposIVA.forEach(c => c.label = c.label1);
        
        this.commonsService.arregloTildesCombo(this.comboTiposIVA);
      },
      err => {
        console.log(err);
      }
    );
  }

  // Definición de las columnas
  getCols(tipo: string) {
    if (tipo == "FACTURA") {
      this.getColsFactura();
    } else {
      this.getColsAbono();
    }

    this.cols.forEach(it => this.buscadores.push(""));
    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  facturaEnRevision(): boolean {
    return this.bodyInicial != undefined && this.bodyInicial != undefined && this.bodyInicial.idEstado == this.FACTURA_ESTADO_EN_REVISION;
  }

  getColsFactura() {
    this.cols = [
      { field: "descripcion", header: "general.description", width: "30%", editable: this.permisoEscritura && this.modificarDescripcion },
      { field: "precioUnitario", header: "facturacion.productos.precioUnitario", width: "10%", editable: this.permisoEscritura && this.modificarImporteUnitario && this.facturaEnRevision() },
      { field: "cantidad", header: "facturacionSJCS.facturacionesYPagos.cantidad", width: "10%", editable: false },
      { field: "importeNeto", header: "facturacion.productos.importeNeto", width: "10%", editable: false }, 
      { field: "tipoIVA", header: "facturacion.facturas.lineas.tipoIVA", width: "10%", editable: this.permisoEscritura && this.modificarIVA && this.facturaEnRevision() },
      { field: "importeIVA", header: "facturacion.productos.importeIva", width: "10%", editable: false },
      { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.importeTotal", width: "10%", editable: false },
      { field: "importeAnticipado", header: "facturacion.facturas.datosGenerales.impAnticipado", width: "10%", editable: false },
    ];
  }

  getColsAbono() {
    this.cols = [
      { field: "descripcion", header: "general.description", width: "40%", editable: this.permisoEscritura && this.modificarDescripcion },
      { field: "precioUnitario", header: "facturacion.productos.precioUnitario", width: "10%", editable: this.permisoEscritura && this.modificarImporteUnitario },
      { field: "cantidad", header: "facturacionSJCS.facturacionesYPagos.cantidad", width: "10%", editable: false },
      { field: "importeNeto", header: "facturacion.productos.importeNeto", width: "10%", editable: false }
      // { field: "importeTotal", header: "Importe Total", width: "20%", editable: false },
    ];
  }

  // Obtención de los datos

  getLineasFactura() {
    this.progressSpinner = true;
    this.sigaServices.getParam("facturacionPyS_getLineasFactura", "?idFactura=" + this.bodyInicial.idFactura).subscribe(
      n => {
        this.datos = n.facturasLineasItems;
        this.datos.forEach(d => d.modoEdicion = false);

        this.datosInit = JSON.parse(JSON.stringify(this.datos));
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  // Obtener parametros de FACTURACION
  getParametrosFACTURACION(): void {
    this.sigaServices.get("facturacionPyS_parametrosLINEAS").subscribe(
      n => {
        let items: ComboItem[] = n.combooItems;
        
        let modificarDescripcionItem: ComboItem = items.find(item => item.label == "MODIFICAR_DESCRIPCION");
        let modificarImporteUnitarioItem: ComboItem = items.find(item => item.label == "MODIFICAR_IMPORTE_UNITARIO");
        let modificarIVAItem: ComboItem = items.find(item => item.label == "MODIFICAR_IVA");

        if (modificarDescripcionItem)
          this.modificarDescripcion = modificarDescripcionItem.value == "1";
        if (modificarImporteUnitarioItem)
          this.modificarImporteUnitario = modificarImporteUnitarioItem.value == "1";
        if (modificarIVAItem)
          this.modificarIVA = modificarIVAItem.value == "1";
        
        // Obtenemos las columnas despues de comprobar cuales son editables
        this.getCols(this.bodyInicial.tipo);
      },
      err => {
        console.log(err);
      }
    );
  }

  // Funciones para el guardado

  getLineasAbono() {
    this.progressSpinner = true;
    this.sigaServices.getParam("facturacionPyS_getLineasAbono", "?idAbono=" + this.bodyInicial.idAbono).subscribe(
      n => {
        this.datos = n.facturasLineasItems;
        this.datos.forEach(d => d.modoEdicion = false);

        this.datosInit = JSON.parse(JSON.stringify(this.datos));
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  guardarLineasFactura(linea: FacturaLineaItem): Promise<any> {
    return this.sigaServices.post("facturacionPyS_guardarLineasFactura", linea).toPromise().then(
      n => { },
      err => {
        return Promise.reject(err);
      }
    );
  }

  guardarLineasAbono(linea: FacturaLineaItem): Promise<any> {
    return this.sigaServices.post("facturacionPyS_guardarLineasAbono", linea).toPromise().then(
      n => { },
      err => {
        return Promise.reject(err);
      }
    );
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.arraysEquals(this.datos, this.datosInit);
  }

  arraysEquals(a, b): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    for (let i = 0; i < a.length; ++i) {
      if (a[i].descripcion !== b[i].descripcion) return false;
      if (a[i].precioUnitario !== b[i].precioUnitario) return false;
      if (a[i].idTipoIVA !== b[i].idTipoIVA) return false;
    }

    return true;
  }

  // Guardar
  isValid(): boolean {
    if (this.bodyInicial.tipo == "FACTURA" && this.datos.some(d => d.descripcion == undefined 
        || d.descripcion.trim().length == 0 
        || d.precioUnitario == undefined || d.precioUnitario.trim().length == 0
        || d.idTipoIVA == undefined || d.idTipoIVA.trim().length == 0)) {
      this.showMessage("error", "Error", this.translateService.instant('general.message.camposObligatorios'));
      return false;
    }

    if (this.bodyInicial.tipo != "FACTURA" && this.datos.some(d => d.descripcion == undefined 
        || d.descripcion.trim().length == 0 
        || d.precioUnitario == undefined || d.precioUnitario.trim().length == 0)) {
      this.showMessage("error", "Error", this.translateService.instant('general.message.camposObligatorios'));
      return false;
    }

    return true;
  }

  

  checkGuardar() {
    if (this.permisoEscritura && this.isValid() && !this.deshabilitarGuardado()) {
      this.guardarLineas();
    } else {
      this.resaltadoDatos = true;
    }
  }

  guardarLineas(): void {
    this.progressSpinner = true;

    let datosToUpdate: FacturaLineaItem[] = this.datos.filter(d1 => 
      !this.datosInit.some(d2 => d1.descripcion == d2.descripcion 
      && d1.precioUnitario == d2.precioUnitario 
      && d1.cantidad == d2.cantidad && d1.idTipoIVA == d2.idTipoIVA && d1.importeTotal == d2.importeTotal));

    Promise.all(datosToUpdate.map(d => {
      if (this.bodyInicial.tipo == "FACTURA") {
        return this.guardarLineasFactura(d);
      } else if (this.bodyInicial.tipo == "ABONO") {
        return this.guardarLineasAbono(d);
      }
    })).then(() => {
      this.progressSpinner = false;
      this.guardadoSend.emit(this.bodyInicial);
    }).catch(error => {
      this.handleServerSideErrorMessage(error);
      this.progressSpinner = false;
    });
  }

  // Controlar errores del servidor  
  handleServerSideErrorMessage(err): void {
    let error = JSON.parse(err.error);
    if (error && error.error && error.error.message) {
      let message = this.translateService.instant(error.error.message);
  
      if (message && message.trim().length != 0) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), message);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error.error.message);
      }
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
    }
  }


  // Seleccionar fila

  onRowSelect(row: FacturaLineaItem) {
    for (let dato of this.datos) {
      if (dato === row) {
        dato.modoEdicion = true;
      } else {
        dato.modoEdicion = false;
      }
    }
  }

  // Calcular propiedades derivadas

  onChangeImportes(index: number) {
    if (this.bodyInicial.tipo == "FACTURA") {
      if (this.datos[index].precioUnitario != undefined && this.datos[index].precioUnitario.trim() != ""
        && this.datos[index].cantidad != undefined && this.datos[index].cantidad.trim() != ""
        && this.datos[index].idTipoIVA != undefined && this.datos[index].idTipoIVA.trim() != "") {
        this.datos[index].importeNeto = (parseFloat(this.datos[index].precioUnitario) * parseFloat(this.datos[index].cantidad)).toFixed(2).toString();

        // Obtiene el iva del combo
        let iva: number = parseFloat(this.comboTiposIVA.find(ti => ti.value === this.datos[index].idTipoIVA).label2);
        this.datos[index].importeIVA = (parseFloat(this.datos[index].importeNeto) * iva / 100.0).toFixed(2).toString();

        this.datos[index].importeTotal = (parseFloat(this.datos[index].importeNeto) + parseFloat(this.datos[index].importeIVA)).toFixed(2).toString();
      }
    } else {
      if (this.datos[index].precioUnitario != undefined && this.datos[index].precioUnitario.trim() != ""
        && this.datos[index].cantidad != undefined && this.datos[index].cantidad.trim() != "") {
        this.datos[index].importeNeto = (parseFloat(this.datos[index].precioUnitario) * parseFloat(this.datos[index].cantidad)).toFixed(2).toString();
      }
    }
    
  }

  // Restablecer

  restablecer(): void {
    this.datos =  JSON.parse(JSON.stringify(this.datosInit));
    this.resaltadoDatos = false;
  }

  // Resultados por página
  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  // Checkbox de seleccionar todo
  onChangeSelectAll(): void {
      if (this.selectAll) {
        this.selectMultiple = true;
        this.selectedDatos = this.datos;
      } else {
        this.selectedDatos = [];
        this.selectMultiple = false;
      }
  }

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaLineas;
  }

  abreCierraFicha(key): void {
    this.openTarjetaLineas = !this.openTarjetaLineas;
    this.opened.emit(this.openTarjetaLineas);
    this.idOpened.emit(key);
  }

  // Mensajes en pantalla

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

}
