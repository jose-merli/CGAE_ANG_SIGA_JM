import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-asuntos',
  templateUrl: './asuntos.component.html',
  styleUrls: ['./asuntos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsuntosComponent implements OnInit, OnChanges {

  rowsPerPage: any = [];
  cols;
  msgs;
  progressSpinner: boolean = false;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;

  permisoEscritura: boolean = true;
  datos;

  idPersona;


  @ViewChild("table") table: DataTable;
  @Input() showTarjeta;
  @Input() body: JusticiableItem = new JusticiableItem();
  @Input() modoEdicion;
  @Input() fromJusticiable;


  constructor(private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
    this.getCols();

  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.idPersona != undefined && this.idPersona != null &&
      this.idPersona != this.body.idpersona) {
      this.showTarjeta = false;
      this.datos = undefined;
    }

    if (this.body != undefined && this.body.idpersona == undefined) {
      this.showTarjeta = false;
    } else {
      this.idPersona = this.body.idpersona;
    }


  }


  onHideTarjeta() {
    if (this.modoEdicion) {
      this.showTarjeta = !this.showTarjeta;

      if (this.datos == undefined || this.datos == null) {
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
      widthRol = "10%";
    } else {
      fieldRol = "interesado";
      headerRol = "justiciaGratuita.justiciables.literal.interesados";
      widthRol = "20%";

    }

    this.cols = [
      { field: "asunto", header: "justiciaGratuita.justiciables.literal.asuntos", width: "10%" },
      { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "10%" },
      { field: "turnoGuardia", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "20%" },
      { field: "letrado", header: "justiciaGratuita.justiciables.literal.colegiado", width: "20%" },
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

  onChangeSelectAll() {
    if (this.selectAll) {

      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechaBaja != undefined && dato.fechaBaja != null);
      } else {
        this.selectedDatos = this.datos;
      }

      if (this.selectedDatos != undefined && this.selectedDatos.length > 0) {
        this.selectMultiple = true;
        this.numSelected = this.selectedDatos.length;
      }

    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }

  }

  isSelectMultiple() {
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectAll = false;

      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
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
