import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { D } from '@angular/core/src/render3';
import { DataTable, Message } from 'primeng/primeng';
import { format } from 'util';
import { TranslateService } from '../../../../../../commons/translate';
import { ComboItem } from '../../../../../../models/ComboItem';
import { FacturaLineaItem } from '../../../../../../models/FacturaLineaItem';
import { FacturasItem } from '../../../../../../models/FacturasItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-lineas-abonos',
  templateUrl: './lineas-abonos.component.html',
  styleUrls: ['./lineas-abonos.component.scss']
})
export class LineasAbonosComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

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

  modificarDescripcion: boolean = false;
  modificarImporteUnitario: boolean = false;
  modificarIVA: boolean = false;

  openFicha: boolean = false;

  intro:boolean= false;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {

     // this.getComboTiposIVA();
      //this.getParametros();
    
   }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.bodyInicial != undefined && changes.bodyInicial.currentValue != undefined && !this.intro){
      this.intro = true;
      this.getComboTiposIVA();
      this.getParametros();
    }
    if (changes.bodyInicial != undefined && changes.bodyInicial.currentValue != undefined) {

        this.getLineasAbono();

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
      this.getColsAbono();


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

  getColsAbono() {
      this.cols = [
        { field: "descripcion", header: "general.description", width: "40%", editable: this.modificarDescripcion },
        { field: "precioUnitario", header: "facturacion.productos.precioUnitario", width: "10%", editable: this.modificarImporteUnitario },
        { field: "cantidad", header: "facturacionSJCS.facturacionesYPagos.cantidad", width: "10%", editable: false },
        { field: "importeNeto", header: "facturacion.productos.importeNeto", width: "10%", editable: false }
        // { field: "importeTotal", header: "Importe Total", width: "20%", editable: false },
      ];
  }



  // Obtener parametros de FACTURACION
  getParametros(): void {
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
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  guardarLineasAbono(linea: FacturaLineaItem): Promise<any> {
    return this.sigaServices.post("facturacionPyS_guardarLineasAbono", linea).toPromise().then(
      n => { 
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      },
      err => {
        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
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

    if (this.bodyInicial.tipo != "FACTURA" && this.datos.some(d => d.descripcion == undefined 
        || d.descripcion.trim().length == 0 
        || d.precioUnitario == undefined || d.precioUnitario == 0)) {
      this.showMessage("error", "Error", this.translateService.instant('general.message.camposObligatorios'));
      return false;
    }
    return true;
  }

  

  checkGuardar() {
    if (this.isValid() && !this.deshabilitarGuardado()) {
      this.guardarLineas();
    } else {
      this.resaltadoDatos = true;
    }
  }

  guardarLineas(): void {
    this.progressSpinner = true;

    let datosToUpdate: FacturaLineaItem[] = this.datos.filter(d1 => 
      !this.datosInit.some(d2 => d1.descripcion == d2.descripcion 
      && d1.precioUnitario == d2.precioUnitario && d1.cantidad == d2.cantidad && d1.idTipoIVA == d2.idTipoIVA && d1.importeTotal == d2.importeTotal));

    Promise.all(datosToUpdate.map(d => {
        return this.guardarLineasAbono(d);
    })).catch(error => {
      if (error != undefined) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    }).then(() => {
      this.progressSpinner = false;
    });
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

    if (this.datos[index].precioUnitario != undefined 
      && this.datos[index].cantidad != undefined && this.datos[index].cantidad.trim() != "") {
      this.datos[index].importeNeto = parseFloat((this.datos[index].precioUnitario * parseFloat(this.datos[index].cantidad)).toFixed(2));
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

  abreCierraFicha(): void {
    this.openFicha = !this.openFicha
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