import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Message, SortEvent } from 'primeng/api';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { ListaFacturasPeticionItem } from '../../../../models/ListaFacturasPeticionItem';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-factura-compra-suscripcion',
  templateUrl: './tarjeta-factura-compra-suscripcion.component.html',
  styleUrls: ['./tarjeta-factura-compra-suscripcion.component.scss']
})
export class TarjetaFacturaCompraSuscripcionComponent implements OnInit {

  msgs: Message[] = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga
  showTarjeta: boolean = false;
  
  selectedRows: any[] = [];
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = true; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  first = 0;
  buscadores = [];
  comboEstadosFac: ComboItem[];

  facturasTarjeta: ListaFacturasPeticionItem[] = [];

  
  @Input("ficha") ficha: FichaCompraSuscripcionItem;

  
  cols = [
    { field: "tipo", header: "facturacion.productos.tipo" },
    { field: "fechaFactura", header: "facturacion.productos.fechaFactura" },
    { field: "nFactura", header: "facturacion.productos.nFactura" },
    { field: "importe", header: "facturacionSJCS.facturacionesYPagos.importe" },
    { field: "desEstado", header: "justiciaGratuita.sjcs.designas.DatosIden.estado" }
  ];

  rowsPerPageSelectValues = [
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

  constructor(public sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private localStorageService: SigaStorageService,
    private router: Router) { }

  ngOnInit() {
    if(this.ficha.fechaAceptada != null){
      this.getComboEstadosFactura();
      this.getFacturasPeticion();
    }
  }

  ngOnChange(changes: SimpleChanges){
    //Se comprueba el estado de la peticion y si se ha buscado anteriormente las facturas
    if(this.ficha.fechaAceptada != null && this.ficha.facturas == null){
      this.getComboEstadosFactura();
      this.getFacturasPeticion();
    }
  }

  openTab(selectedRow) {
    //REVISAR
    // this.progressSpinner = true;
    // sessionStorage.setItem("FichaCompraSuscripcion", JSON.stringify(this.ficha));
    // sessionStorage.setItem("origin", "Compra");
    // this.router.navigate(["/fichaProductos"]); //Cambiar direccion a la ficha de facturas y añadir item con informacion necesaria para inicializar la ficha
    this.msgs = [
      {
        severity: "info",
        summary: "En proceso",
        detail: "Ficha no implementada actualmente"
      }
    ];
  }

  getFacturasPeticion(){
    this.sigaServices.getParam("PyS_getFacturasPeticion","?idPeticion="+this.ficha.nSolicitud).subscribe(
      listaFacturasPeticionDTO => {

        if (listaFacturasPeticionDTO.error != null) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          // this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.facturasTarjeta = listaFacturasPeticionDTO.listaFacturasPeticionItem;
          for(let factura of this.facturasTarjeta){
            let estado = this.comboEstadosFac.find(el =>
              el.value == factura.estado.toString()
            )
            factura.desEstado = estado.label.toString();
          }
          this.ficha.facturas = this.facturasTarjeta;
        }
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      });
  }

  //Metodo para obtener los valores del combo estadosFactura
  getComboEstadosFactura() {
    this.progressSpinner = true;

    this.sigaServices.get("PyS_comboEstadosFactura").subscribe(
      TipoSelectValues => {
        this.progressSpinner = false;

        this.comboEstadosFac = TipoSelectValues.combooItems;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }

  //Metodo activado al pulsar sobre el checkbox Seleccionar todo
  onChangeSelectAllRows() {
    if (this.selectAllRows === true) {
      this.selectedRows = this.facturasTarjeta;
      this.numSelectedRows = this.facturasTarjeta.length;

    } else {
      this.selectedRows = [];
      this.numSelectedRows = 0;
    }
  }
  
  onHideTarjeta(){
    this.showTarjeta = ! this.showTarjeta;
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
