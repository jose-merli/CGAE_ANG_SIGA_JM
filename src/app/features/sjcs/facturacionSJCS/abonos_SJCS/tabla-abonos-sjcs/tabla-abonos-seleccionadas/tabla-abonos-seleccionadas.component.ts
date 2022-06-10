import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { D } from '@angular/core/src/render3';
import { Item } from '@syncfusion/ej2-splitbuttons';
import { DataTable, Message } from 'primeng/primeng';
import { element } from 'protractor';
import { format } from 'util';
import { TranslateService } from '../../../../../../commons/translate';
import { ComboItem } from '../../../../../../models/ComboItem';
import { FacturaLineaItem } from '../../../../../../models/FacturaLineaItem';
import { FacturasItem } from '../../../../../../models/FacturasItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { from } from 'rxjs/observable/from';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { isPlatformWorkerApp } from '@angular/common';
import { FacturaSeleccionada } from '../../../../../../models/FacturaSelecionada';
import { FacAbonoItem } from '../../../../../../models/sjcs/FacAbonoItem';
@Component({
  selector: 'app-tabla-abonos-seleccionadas',
  templateUrl: './tabla-abonos-seleccionadas.component.html',
  styleUrls: ['./tabla-abonos-seleccionadas.component.scss']
})

export class TablaAbonosSeleccionadasComponent implements OnInit,OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  @Input() bodyInicial: FacAbonoItem[];
  itemsGeneral:FacAbonoItem[]=[];
  // Elementos para la tabla
  @ViewChild("table") table: DataTable;
  rowsPerPage = [];
  selectedItem: number = 10;
  selectedDatos = [];
  cols = [];
  buscadores = [];
  selectAll: boolean;
  selectMultiple: boolean;
  datos:FacturaSeleccionada[] = [];
  datosInit: FacturaLineaItem[] = [];

  comboTiposIVA: any[];
  resaltadoDatos: boolean = false;

  modificarDescripcion: boolean = false;
  modificarImporteUnitario: boolean = false;
  modificarIVA: boolean = false;
  grupos: any[];
  openFicha: boolean = false;

  total:number;
  totalPendiente:number;
  intro:boolean= false;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.bodyInicial != undefined && this.bodyInicial.length>0){
      this.datos = [];
      this.total=0
      this.totalPendiente = 0;
      /*this.bodyInicial.forEach(element =>{
        let item:FacturaSeleccionada=new FacturaSeleccionada();
        item.estado = element.idEstado;
        item.formaPago = element.nombreFormaPago;
        this.datos.push(item)
      });
      */
     from(this.bodyInicial).pipe(
      groupBy(ep => ep.estado),
      mergeMap(group => group.reduce((acc, cur) => {
          acc.values.push(cur);
          return acc;
        }, { key: group.key, values: [], activo: true })
      ),
      toArray()
    ).subscribe(grupos => this.grupos = grupos);
    //console.log(this.grupos)

    this.grupos.forEach(element => {
      let item:FacturaSeleccionada=new FacturaSeleccionada();
      let grupitos:FacAbonoItem[] = element.values;
      //console.log(grupitos)
      item.total = 0;
      item.totalPendiente = 0;
      item.numFacturas = 0; 
      grupitos.forEach(grup =>{
        item.estado = grup.estadoNombre.toString();
        if(grup.importeTotal !=null ){
          item.total += Number(grup.importeTotal);
        this.total += Number(grup.importeTotal);
        }
        this.totalPendiente += Number(grup.importePendientePorAbonar)
        item.formaPago = grup.nombrePago.toString();
        item.totalPendiente += Number(grup.importePendientePorAbonar)
        item.numFacturas++;
      });
      item.totalPendiente = Math.round(item.totalPendiente * 100) / 100;
      item.total = Math.round(item.total * 100) / 100;
      this.datos.push(item)
    })

    this.totalPendiente = Math.round(this.totalPendiente * 100) / 100;
    this.total = Math.round(this.total * 100) / 100;
    }
  }
 
  ngOnInit() {
    //console.log(this.bodyInicial)
    this.getCols();
   }





  // Definición de las columnas
  getCols() {
    this.cols = [
      { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "20%" },
      { field: "formaPago", header: "facturacion.productos.formapago", width: "20%" },
      { field: "numFacturas", header: "facturacion.factProgramadas.serieFactu.numFactu", width: "10%"},
      { field: "total", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.total", width: "10%" }, 
      { field: "totalPendiente", header: "facturacion.factProgramadas.serieFactu.totalPendiente", width: "10%"},
    ];
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
