import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef, ChangeDetectorRef,SimpleChanges} from '@angular/core';
import { MovimientosVariosFacturacionItem } from '../MovimientosVariosFacturacionItem';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { ConfirmationService } from 'primeng/primeng';
import { SortEvent } from '../../../../../../../node_modules/primeng/api';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { MovimientosVariosService } from '../movimientos-varios.service';


@Component({
  selector: 'app-tabla-movimientos-varios',
  templateUrl: './tabla-movimientos-varios.component.html',
  styleUrls: ['./tabla-movimientos-varios.component.scss']
})
export class TablaMovimientosVariosComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  msgs;
  buscadores = [];
  selectedItem: number = 10;
  selectionMode: String = "multiple";

  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  selectAll: boolean = false;
  historico: boolean = false;
  datosFiltros: MovimientosVariosFacturacionItem;

  message;
  first = 0;
  initDatos;
  progressSpinner: boolean = false;

  @Input() datos;
  @Input() filtroSeleccionado;
  @Input() permisos;
  isLetrado : boolean = false;

  @Output() busqueda = new EventEmitter<MovimientosVariosFacturacionItem>();
  @Input() permisoEscritura;
  @Output() delete = new EventEmitter<MovimientosVariosFacturacionItem>();

  @ViewChild("tabla") tabla;
  @ViewChild("tablaFoco") tablaFoco: ElementRef;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService, 
    private sigaStorageService: SigaStorageService,
    private movimientosVariosService: MovimientosVariosService
    ) { }


  ngOnInit() {

    this.isLetrado = this.sigaStorageService.isLetrado;
    

    this.progressSpinner = true;

    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.persistenceService.clearPaginacion();

      this.first = paginacion.paginacion;
      this.selectedItem = paginacion.selectedItem;
    }

    this.getCols();

    this.initDatos = JSON.parse(JSON.stringify((this.datos)));

    this.progressSpinner = false;
  }

  selectDesSelectFila() {
    this.numSelected = this.selectedDatos.length;
  }

  openFicha(datos) {

    this.movimientosVariosService.modoEdicion = true;

    let paginacion = {
      paginacion: this.tabla.first,
      selectedItem: this.selectedItem
    };

    this.persistenceService.setPaginacion(paginacion);
    this.persistenceService.setDatos(datos); //devuelve bien los datos para mandarlo a la ficha así
    this.router.navigate(["/fichaMovimientosVarios"]);
    

  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
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

  clear() {
    this.msgs = [];
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

  getCols() {
      this.cols = [
        { field: "ncolegiado", header: "censo.nuevaSolicitud.numColegiado", width: "10%" },
        { field: "letrado", header: "busquedaSanciones.detalleSancion.letrado.literal", width: "10%" },
        { field: "descripcion", header: "enviosMasivos.literal.descripcion", width: "20%" },
        { field: "cantidad", header: "formacion.fichaCurso.tarjetaPrecios.importe", width: "10%" },
        { field: "cantidadAplicada", header: "facturacionSJCS.movimientosVarios.importeAplicado", width: "10%" },
        { field: "cantidadRestante", header: "facturacionSJCS.retenciones.importeRestante", width: "10%" },
        { field: "idAplicadoEnPago", header: "facturacionSJCS.movimientosVarios.aplicadoEnPago", width: "10%" }
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

  searchHistorical(){
    this.historico = !this.historico;
    this.datosFiltros = this.persistenceService.getFiltros();
    this.datosFiltros.historico=this.historico;
    this.busqueda.emit(this.datosFiltros);
  }



  confirmDelete() {

    let contadorLLENO=0;
    let contadorVACIO=0;

    if (undefined != this.selectedDatos && this.selectedDatos.length > 0) {

      let mess = this.translateService.instant(
        "facturacionSJCS.movimientosVarios.eliminarMovVario"
      );
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {

          //vamos a recorrer el SelectedDatos y revisar si la columna de Aplicado en Pago está rellena. Si está rellena no se podrá realizar la eliminación y se mostrará un mensaje.
          this.selectedDatos.forEach(element => {
            if(element.idAplicadoEnPago == null){
              contadorVACIO++;
            }else{
              contadorLLENO++;
            }
          });

          if(contadorLLENO>0){
            //cancelo la operación mandando el mensaje de que no se puede borrar.
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacionSJCS.movimientosVarios.errorEliminarMov"));
          }else{
            //puedo borrarlos
            this.progressSpinner = true;

            this.selectedDatos.forEach(element => {
              if(element.fechaAlta != null || element.fechaAlta != undefined){
                //  event.fechaAlta = new Date(event.fechaAlta).toLocaleDateString("es-ES");
                //  event.fechaAlta = this.transformaFecha(event.fechaAlta);
                //  console.log(event.fechaAlta) //4/17/2020
                element.fechaAlta=null;
              }
            });
        
        
              this.sigaServices.post("movimientosVarios_eliminarMovimiento", this.selectedDatos).subscribe(
                data => {
        
                  const resp: MovimientosVariosFacturacionItem = JSON.parse(data.body);
                  const error = JSON.parse(data.body).error;
        
                  if (error.status == 'KO' && error != null && error.description != null) {
                    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
                  } else {
                    this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("messages.deleted.success"));
                    this.busqueda.emit(this.datosFiltros);
                  }
        
                  this.progressSpinner = false;
                },
                err => {
                  this.progressSpinner = false;
                  if (err.status == '403' || err.status == 403) {
                    sessionStorage.setItem("codError", "403");
                    sessionStorage.setItem(
                      "descError",
                      this.translateService.instant("generico.error.permiso.denegado")
                    );
                    this.router.navigate(["/errorAcceso"]);
                  } else {
                    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("No se han podido borrar los movimientos varios"));
                  }
                }
              );
            
          }

        },
        reject: () => {
          this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
        }
      });

    }
  }

  setItalic (dato){
    if(dato.cantidadRestante == 0){
      return false;
    }else{
      return true;
    }
  }

  disabledEliminar() {
    if (undefined != this.selectedDatos && this.selectedDatos.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  actualizaSeleccionados(selectedDatos) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
    }
  }

}


