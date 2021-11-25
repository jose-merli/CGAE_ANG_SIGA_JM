import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, SimpleChanges,Output, EventEmitter } from '@angular/core';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-tarjeta-listado-pagos',
  templateUrl: './tarjeta-listado-pagos.component.html',
  styleUrls: ['./tarjeta-listado-pagos.component.scss']
})
export class TarjetaListadoPagosComponent implements OnInit {

  showFichaListadoPagos: boolean = false;
  @Input() openListadoPagos;

  	@Output() opened = new EventEmitter<Boolean>();
  	@Output() idOpened = new EventEmitter();

  rowsPerPage;
  cols;
  progressSpinner: boolean = false;
  msgs;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectedItem: number = 10;
  selectMultiple: boolean = false;
  @ViewChild("table") table: Table;
  buscadores: any;
  tamListado;

  @Input() permisoEscritura;
  @Input() datos;
  @Input() datos2;

  constructor(private sigaServices: SigaServices, private persistenceService: PersistenceService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
		if (this.openListadoPagos == true) {
			if (this.showFichaListadoPagos == false) {
			  this.onHideListadoPagos();
			}
		}
	}

  ngOnInit() {


    this.getCols();

    // if(this.datos == null || this.datos == undefined){
    //   this.datos=new MovimientosVariosFacturacionItem();
    // }else{
    //   this.getPagos();
    // }

    //  if(!this.permisoEscritura){
    //   this.datos2 = [];
    //mirar lo de selectionMode=false;
    // selectedDatos=[];
    // numSelected = 0;
    //  }

  }

  onHideListadoPagos() {
    let key = "tarjetaListadoPagos";

    this.showFichaListadoPagos = !this.showFichaListadoPagos;

		this.opened.emit(this.showFichaListadoPagos);
		this.idOpened.emit(key);

  }

  getCols() {

    this.cols = [
      { field: "fechaModificacion", header: "facturacionSJCS.facturacionesYPagos.fecha" },
      { field: "nombrePago", header: "facturacionSJCS.retenciones.pago" },
      { field: "cantidad", header: "facturacionSJCS.retenciones.importe" },
      { field: "cantidadRestante", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente" }
    ];

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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  actualizaSeleccionados(selectedDatos) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos2;
      this.numSelected = this.datos2.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  clear() {
    this.msgs = [];
  }

}

