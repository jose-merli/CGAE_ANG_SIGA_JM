import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { MovimientosVariosFacturacionItem } from '../../MovimientosVariosFacturacionItem';
import { Table } from 'primeng/table';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

@Component({
  selector: 'app-tarjeta-listado-pagos',
  templateUrl: './tarjeta-listado-pagos.component.html',
  styleUrls: ['./tarjeta-listado-pagos.component.scss']
})
export class TarjetaListadoPagosComponent implements OnInit {

  showFichaListadoPagos: boolean = false;
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

  // ngOnChanges(changes: SimpleChanges) {
  //   this.getCols();
  //   if (this.datos != undefined) {
  //     this.body = this.datos;
  //     this.getInscripciones();
  //   }
  ngOnInit() {

    //this.tamListado=this.datos2.length;

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
    this.showFichaListadoPagos = !this.showFichaListadoPagos;
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

  // getPagos(){
  //   this.progressSpinner = true;
  //   this.datos.fechaAlta = null;

  //   this.sigaServices.post("movimientosVarios_getListadoPagos", this.datos).subscribe(
  //     n => {
  //       this.datos2 = JSON.parse(n.body).facturacionItem;
  //       this.progressSpinner=false;
  //     },
  //     err => {
  //       console.log(err);
  //       this.progressSpinner = false;
  //     }, () => {
  //       this.progressSpinner = false;
  //     }
  //   );
  // }

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

