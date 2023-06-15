import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, SortEvent } from 'primeng/components/common/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { FichaMonederoItem } from '../../../../models/FichaMonederoItem';
import { ListaMonederosItem } from '../../../../models/ListaMonederosItem';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { TarjetaFiltroMonederosComponent } from '../tarjeta-filtro-monederos/tarjeta-filtro-monederos.component';

@Component({
  selector: 'app-tarjeta-lista-monederos',
  templateUrl: './tarjeta-lista-monederos.component.html',
  styleUrls: ['./tarjeta-lista-monederos.component.scss']
})
export class TarjetaListaMonederosComponent implements OnInit {

  msgs: Message[] = [];

  estadosCompraObject: ComboItem[] = [];

  @Output() actualizarLista = new EventEmitter<Boolean>();
  @Input("listaMonederos") listaMonederos: ListaMonederosItem[];
  @Input("filtrosBusqueda") filtrosBusqueda: TarjetaFiltroMonederosComponent;
  @Input("listaMonederosActivos") listaMonederosActivos: ListaMonederosItem[];
  @ViewChild("monederosTable") monederosTable: DataTable;

  cols = [
    {field: "fecha", header: "informesycomunicaciones.enviosMasivos.fechaCreacion"},
    {field: "nifCif", header: "administracion.usuarios.literal.NIFCIF"},
    {field: "nombreCompleto", header: "justiciaGratuita.oficio.designas.interesados.apellidosnombre"},
    {field: "descripcion", header: "general.description"},
    {field: "importeInicial", header: "facturacion.monedero.impInicial"},
    {field: "importeRestante", header: "facturacionSJCS.retenciones.importeRestante"},
    {field: "importeUsado", header: "facturacion.monedero.impUsado"}
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

  selectedRows: ListaMonederosItem[] = []; //Datos de las filas seleccionadas.
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = false; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  first = 0;
  buscadores = [];

  progressSpinner: boolean = false;
  esColegiado: boolean = this.localStorageService.isLetrado;
  historico: boolean = false;
  permisoLiquidarMonederos: boolean = false;

  constructor(
    private sigaServices: SigaServices, private translateService: TranslateService,
    private commonsService: CommonsService, private router: Router,
    private localStorageService: SigaStorageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getPermisoLiquidarMonederos();
  }


  openTab(rowData: ListaMonederosItem) {
    this.progressSpinner = true;
    let monedero = new FichaMonederoItem();
    monedero.idAnticipo = rowData.idAnticipo;
    monedero.idPersona = rowData.idPersona;
    sessionStorage.setItem("FichaMonedero", JSON.stringify(monedero));
    sessionStorage.setItem("filtrosMonedero", JSON.stringify(this.filtrosBusqueda.filtrosMonederoItem));
    this.router.navigate(["/fichaMonedero"]);
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }



  //Metodo activado al pulsar sobre el checkbox Seleccionar todo
  onChangeSelectAllRows() {
    if (this.selectAllRows === true) {
      this.selectedRows = this.listaMonederos;
      this.numSelectedRows = this.listaMonederos.length;

    } else {
      this.selectedRows = [];
      this.numSelectedRows = 0;
    }
  }

  checkLiquidar(){
    /* this.msgs = [
      {
        severity: "info",
        summary: "En proceso",
        detail: "Boton no funcional actualmente"
      }
    ]; */
     
    let msg = this.commonsService.checkPermisos(this.permisoLiquidarMonederos, undefined);

    if (msg != null) {
      this.msgs = msg;
    } 
    else {
      this.liquidarMonederos();
    }
  }

  liquidarMonederos(){

    let peticion : ListaMonederosItem[] = []; 

    //Se envian al back unicamente aquellos monederos que 
    //todavia tengan saldo
    this.selectedRows.forEach(el => {
      if(el.importeRestante != 0){
        peticion.push(el);
      }
    });

    let keyConfirmation = "deletePlantillaDoc";
    let mensaje;
  
    if(peticion.length > 1){
      mensaje = this.translateService.instant("facturacion.productosyservicios.monedero.dialogconfirmarliquidacionvarios");
    }else if(peticion.length == 1){
      mensaje = this.translateService.instant("facturacion.productosyservicios.monedero.dialogconfirmarliquidacionunico") + peticion[0].importeRestante + "€ ?";
    }

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mensaje,
      icon: "fa fa-trash-alt",
      accept: () => {
        this.sigaServices.post("PyS_liquidarMonederos", peticion).subscribe(
          n => {

            this.selectedRows = [];

            if (n.status == 500) {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            } else {
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

              this.actualizarLista.emit();
            }

            this.progressSpinner = false;

          },
          err => {
            this.progressSpinner = false;
          });
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  //Metodo para aplicar logica al deseleccionar filas
  onRowUnselect() {
    this.numSelectedRows = this.selectedRows.length;
  }
  //Metodo para aplicar logica al seleccionar filas
  onRowSelect() {
    this.numSelectedRows = this.selectedRows.length;
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

  onChangeRowsPerPages(event) {
    this.rowsPerPage = event.value;
    this.monederosTable.reset();
  }

  searchHistorical() {
    this.historico = !this.historico;
    this.selectedRows = [];
    if (this.historico) {
      this.numSelectedRows = 0;
      this.listaMonederosActivos = JSON.parse(JSON.stringify(this.listaMonederos));
    } else {
      this.listaMonederosActivos = this.listaMonederos.filter(
        (dato) => dato.importeRestante != 0);
    }
  }

  isLiquidado(rowData: ListaMonederosItem){
    if(rowData.importeRestante != 0){
      return false;
    }
    else{
      return true;
    }
  }

  getPermisoLiquidarMonederos() {
    this.commonsService
    .checkAcceso(procesos_PyS.liquidarMonederos)
      .then((respuesta) => {
        this.permisoLiquidarMonederos = respuesta;
      })
      .catch((error) => console.error(error));
  }
  
  //Borra el mensaje de notificacion p-growl mostrado en la esquina superior derecha cuando pasas el puntero del raton sobre el
  clear() {
    this.msgs = [];
  }
}
