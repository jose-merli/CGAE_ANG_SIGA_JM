import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { DataTable } from '../../../../../node_modules/primeng/primeng';
import { SigaServices } from '../../../_services/siga.service';
import { PersistenceService } from '../../../_services/persistence.service';
import { AsuntosJusticiableItem } from '../../../models/sjcs/AsuntosJusticiableItem';
import { CommonsService } from '../../../_services/commons.service';
import { Location } from '@angular/common';

@Component({ 
  selector: 'app-tabla-busqueda-asuntos',
  templateUrl: './tabla-busqueda-asuntos.component.html',
  styleUrls: ['./tabla-busqueda-asuntos.component.scss']
})
export class TablaBusquedaAsuntosComponent implements OnInit {

  rowsPerPage: any = [];
  cols = [];
  msgs;
  progressSpinner: boolean = false;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;

  permisoEscritura: boolean = true;
  datosInicio: boolean = false;
  datos=[];
  idPersona;
  showTarjetaPermiso: boolean = true;

  @ViewChild("table") table: DataTable;
  @Input() showTarjeta;
  @Input() body;
  @Input() modoEdicion;
  @Input() fromJusticiable;
  @Input() data: AsuntosJusticiableItem = null;


  constructor(private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService) { }

  ngOnInit() {

    // this.commonsService.checkAcceso(procesos_justiciables.tarjetaAsuntos)
    //   .then(respuesta => {

    //     this.permisoEscritura = respuesta;

    //     if (this.permisoEscritura == undefined) {
    //       this.showTarjetaPermiso = false;
    //     } else {
    //       this.showTarjetaPermiso = true;
    this.getCols();


    //     }
    //   }
    //   ).catch(error => console.error(error));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.body != undefined) {
      this.datos = this.body;
    } else {
      this.datos = [];
    }
  }

  getCols() {

    this.cols = [
      { field: "asunto", header: "justiciaGratuita.justiciables.literal.asuntos", width: "10%" },
      { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "10%" },
      { field: "turnoGuardia", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "25%" },
      { field: "letrado", header: "justiciaGratuita.justiciables.literal.colegiado", width: "20%" },
      { field: "interesado", header: "justiciaGratuita.justiciables.literal.interesados", width: "20%" },
      { field: "datosInteres", header: "justiciaGratuita.justiciables.literal.datosInteres", width: "15%" }

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

  search(event) {
    this.persistenceService.setBody(JSON.stringify(event));
    // this.progressSpinner = true;

    // this.sigaServices.post("gestionJusticiables_searchAsuntosJusticiable", this.body.idpersona).subscribe(
    //   n => {

    //     this.datos = JSON.parse(n.body).asuntosJusticiableItems;
    //     this.progressSpinner = false;

    //   },
    //   err => {
    //     this.progressSpinner = false;
    //     console.log(err);
    //   });

  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
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

  openTab() {

  }


  // getAsunto(event) {
  //   if (this.datos != null) {

  //     let asunto = event.data.asunto.split("/");

  //     let anoDesigna = asunto[0].split("D")[1];

  //     let turno = event.data.turnoGuardia.split("/")[0];

  //     let request = [anoDesigna, this.datos.annio, this.datos.tipoEJG,
  //       //, newDesigna.idTurno.toString(), newId.id, this.datosEJG.numero
  //       turno, asunto[1], this.datos.numero
  //     ];

  //     this.sigaServices.post("designacion_asociarEjgDesigna", request).subscribe(
  //       m => {

  //         if (JSON.parse(m.body).error.code == 200) this.showMessage("success", "Asociación con EJG realizada correctamente", "" );
  //         else this.showMessage("error", "Asociación con EJG fallida",  "" );
  //         sessionStorage.removeItem("EJG");
  //         this.location.back();
  //       },
  //       err => {
  //         this.showMessage("error",
  //           "No se ha asociado el EJG correctamente",
  //           ""
  //         );
  //         this.progressSpinner = false;
  //       }
  //     );

      
  //   }
  // }
}