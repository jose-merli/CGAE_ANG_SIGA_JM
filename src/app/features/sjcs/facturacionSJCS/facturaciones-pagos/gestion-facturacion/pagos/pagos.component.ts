import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {
  progressSpinnerPagos: boolean = false;
  cols;
  msgs; 
  rowsPerPage: any = [];
  buscadores = [];
  body = [];
  selectedItem: number = 10;
  showFichaPagos: boolean = false;
  numPagos: number = 0;
  
  @Input() cerrada;
  @Input() idFacturacion;
  @Input() idEstadoFacturacion;
  @Input() modoEdicion;
  @Input() permisos;

  @ViewChild("tabla") tabla;
  
  constructor(private changeDetectorRef: ChangeDetectorRef,
  private sigaService: SigaServices) { }

  ngOnInit() {   
    this.progressSpinnerPagos = false;
    this.cargaDatos();
    this.getCols();
  }

  cargaDatos(){
    if(undefined!=this.idFacturacion){
      this.progressSpinnerPagos = true;

      //datos de la facturación
      this.sigaService.getParam("facturacionsjcs_datospagos", "?idFacturacion=" + this.idFacturacion).subscribe(
        data => {
          this.progressSpinnerPagos = false;

          if(undefined != data.pagosjgItem && data.pagosjgItem.length>0){
            let datos=data.pagosjgItem;

            datos.forEach(element => {
              if(element.importePagado!=undefined){
                element.importePagadoFormat = element.importePagado.replace(".", ",");
              
                if (element.importePagadoFormat[0] == '.' || element.importePagadoFormat[0] == ','){
                  element.importePagadoFormat = "0".concat(element.importePagadoFormat)
                }
              }else{
                element.importePagadoFormat = 0;
              }				
            });
            this.body = JSON.parse(JSON.stringify(datos));
            this.numPagos = datos.length;
          }
        },	  
        err => {
          console.log(err);
          this.progressSpinnerPagos = false;
        }
      );
    }
  }

  nuevo(){

  }

  disabledNuevo(){
    return true;
  }

  onHideDatosGenerales() {
    this.showFichaPagos = !this.showFichaPagos;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
  }

  seleccionaFila(evento){
    console.debug(evento.data.nombre);
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

  getCols() {
    this.cols = [
      { field: "nombre", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre", width: "30%" },
      { field: "desConcepto", header: "facturacionSJCS.facturacionesYPagos.conceptos", width: "25%" },
      { field: "porcentaje", header: "facturacionSJCS.facturacionesYPagos.porcentaje", width: "10%" },
      { field: "importePagado", header: "facturacionSJCS.facturacionesYPagos.cantidad", width: "10%" },
      { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado", width: "15%" },
       { field: "desEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "10%" }
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
}
