import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_justiciables } from '../../../../../permisos/procesos_justiciables';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate/translation.service';

@Component({
  selector: 'app-asuntos',
  templateUrl: './asuntos.component.html',
  styleUrls: ['./asuntos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsuntosComponent implements OnInit, OnChanges {

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
  datos = [];
  datosInicio: boolean = false;

  idPersona;

  @ViewChild("table") table: DataTable;
  @Input() showTarjeta;
  @Input() body: JusticiableItem = new JusticiableItem();
  @Input() modoEdicion;
  @Input() fromJusticiable;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private commonsService: CommonsService) { }

  ngOnInit() {
    this.getCols();
  }

  ngOnChanges(changes: SimpleChanges) {

    //Se comprueba si es el justiciable que cargado al principio, si no es la misma se vuelve a restablecer los valores 
    if (this.idPersona != undefined && this.idPersona != null &&
      this.idPersona != this.body.idpersona) {
      this.showTarjeta = false;
      this.datos = undefined;
      this.datosInicio = undefined;
    }

    //Se almacena el idpersona del justiciable cargado en la ficha de justiciable
    if (this.body != undefined && this.body.idpersona == undefined) {
      this.showTarjeta = false;
    } else if (this.body == undefined) {
      this.showTarjeta = false;
      this.body = new JusticiableItem();
    } else {
      this.idPersona = this.body.idpersona;
    }

  }

  onHideTarjeta() {
    if (this.modoEdicion) {
      this.showTarjeta = !this.showTarjeta;

      if (!this.datosInicio) {
        this.datosInicio = true;
        this.search();
      }
    }
  }

  getCols() {

    let headerRol = "";
    let fieldRol = "";
    let widthRol = "";

    if (this.fromJusticiable) {
      fieldRol = "rol";
      headerRol = "administracion.usuarios.literal.rol";
      widthRol = "5%";
    } else {
      fieldRol = "interesado";
      headerRol = "justiciaGratuita.justiciables.literal.interesados";
      widthRol = "20%";

    }

    this.cols = [
      { field: "asunto", header: "justiciaGratuita.justiciables.literal.asuntos", width: "5%" },
      { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "5%" },
      { field: "turnoGuardia", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "10%" },
      { field: "letrado", header: "justiciaGratuita.justiciables.literal.colegiado", width: "15%" },
      { field: fieldRol, header: headerRol, width: widthRol },
      { field: "datosInteres", header: "justiciaGratuita.justiciables.literal.datosInteres", width: "20%" }

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

  search() {
    this.progressSpinner = true;

    this.sigaServices.post("gestionJusticiables_searchAsuntosJusticiable", this.body.idpersona).subscribe(
      n => {

        this.datos = JSON.parse(n.body).asuntosJusticiableItems;
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      });
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
}
