import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DataTable, Message } from 'primeng/primeng';
import { format } from 'util';
import { TranslateService } from '../../../../../commons/translate';
import { ComboItem } from '../../../../../models/ComboItem';
import { FacturaLineaItem } from '../../../../../models/FacturaLineaItem';
import { FacturasItem } from '../../../../../models/FacturasItem';
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

  comboTiposIVA: ComboItem[];
  resaltadoDatos: boolean = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.getComboTiposIVA();
   }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial != undefined) {
      this.getCols(this.bodyInicial.tipo);

      if (this.bodyInicial.tipo == "FACTURA") {
        this.getLineasFactura();
      } else {
        this.getLineasAbono();
      }
    }
      
  }

  // Combo de tipos IVA
  getComboTiposIVA() {
    this.sigaServices.getParam("facturacionPyS_comboTiposIVA", "?codBanco=" + this.bodyInicial.idFactura).subscribe(
      n => {
        this.comboTiposIVA = n.combooItems;
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

  getColsFactura() {
    this.cols = [
      { field: "descripcion", header: "general.description", width: "30%", editable: true },
      { field: "precioUnitario", header: "Precio Unitario", width: "10%", editable: true },
      { field: "cantidad", header: "Cantidad", width: "10%", editable: false },
      { field: "importeNeto", header: "Importe Neto", width: "10%", editable: false }, 
      { field: "tipoIVA", header: "Tipo IVA", width: "10%", editable: true },
      { field: "importeIVA", header: "Importe IVA", width: "10%", editable: false },
      { field: "importeTotal", header: "Importe Total", width: "10%", editable: false },
      { field: "importeAnticipado", header: "Importe Anticip.", width: "10%", editable: false },
    ];
  }

  getColsAbono() {
    this.cols = [
      { field: "descripcion", header: "general.description", width: "40%", editable: true },
      { field: "precioUnitario", header: "Precio Unitario", width: "10%", editable: true },
      { field: "cantidad", header: "Cantidad", width: "10%", editable: false },
      { field: "importeNeto", header: "Importe Neto", width: "10%", editable: false }, 
      { field: "importeTotal", header: "Importe Total", width: "20%", editable: false },
    ];
  }

  // Obtención de los datos

  getLineasFactura() {
    this.sigaServices.getParam("facturacionPyS_getLineasFactura", "?idFactura=" + this.bodyInicial.idFactura).subscribe(
      n => {
        console.log(n);
        this.datos = n.facturasLineasItems;
        this.datos.forEach(d => d.modoEdicion = false);

        this.datosInit = JSON.parse(JSON.stringify(this.datos));
      },
      err => {
        console.log(err);
      }
    );
  }

  // Funciones para el guardado

  getLineasAbono() {
    this.sigaServices.getParam("facturacionPyS_getLineasAbono", "?idAbono=" + this.bodyInicial.idFactura).subscribe(
      n => {
        console.log(n);
        this.datos = n.facturasLineasItems;
        this.datos.forEach(d => d.modoEdicion = false);

        this.datosInit = JSON.parse(JSON.stringify(this.datos));
      },
      err => {
        console.log(err);
      }
    );
  }

  guardarLineasFactura(linea: FacturaLineaItem): Promise<any> {
    return this.sigaServices.post("facturacionPyS_guardarLineasFactura", linea).toPromise().then(
      n => { },
      err => {
        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  guardarLineasAbono(linea: FacturaLineaItem): Promise<any> {
    return this.sigaServices.post("facturacionPyS_guardarLineasAbono", linea).toPromise().then(
      n => { },
      err => {
        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  // Guardar

  guardarLineas(): void {
    this.progressSpinner = true;

    let datosToUpdate: FacturaLineaItem[] = this.datos.filter(d1 => 
      !this.datosInit.some(d2 => d1.descripcion == d2.descripcion 
      && d1.precioUnitario == d2.precioUnitario && d1.cantidad == d2.cantidad && d1.idTipoIVA == d2.idTipoIVA && d1.importeTotal == d2.importeTotal));
    console.log(datosToUpdate);

    Promise.all(datosToUpdate.map(d => {
      if (this.bodyInicial.tipo == "FACTURA") {
        return this.guardarLineasFactura(d);
      } else if (this.bodyInicial.tipo == "ABONO") {
        return this.guardarLineasAbono(d);
      }
    })).catch(error => {
      if (error != undefined) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    }).then(() => this.progressSpinner = false);
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
    if (this.datos[index].precioUnitario != undefined && this.datos[index].precioUnitario.trim() != ""
      && this.datos[index].cantidad != undefined && this.datos[index].cantidad.trim() != ""
      && this.datos[index].idTipoIVA != undefined && this.datos[index].idTipoIVA.trim() != "") {
      this.datos[index].importeNeto = (parseFloat(this.datos[index].precioUnitario) * parseFloat(this.datos[index].cantidad)).toFixed(2).toString();
      this.datos[index].importeIVA = (parseFloat(this.datos[index].importeNeto) * 0.1).toFixed(2).toString();
      this.datos[index].importeTotal = (parseFloat(this.datos[index].importeNeto) + parseFloat(this.datos[index].importeIVA)).toFixed(2).toString();
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
