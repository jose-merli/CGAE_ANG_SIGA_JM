import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { FichaPlantillasDocument } from '../../../../../../models/FichaPlantillasDocumentoItem';
import { ConsultasSearchItem } from '../../../../../../models/ConsultasSearchItem';
import { ModelosComunicacionesItem } from '../../../../../../models/ModelosComunicacionesItem';
import { SigaServices } from "./../../../../../../_services/siga.service";
import { Location } from "@angular/common";
import { Message, ConfirmationService } from "primeng/components/common/api";


@Component({
  selector: 'app-plantilla-documento',
  templateUrl: './plantilla-documento.component.html',
  styleUrls: ['./plantilla-documento.component.scss']
})

export class PlantillaDocumentoComponent implements OnInit {

  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  formatos: any[];
  sufijos: any[];
  textFilter: string;
  body: FichaPlantillasDocument = new FichaPlantillasDocument();
  consultaSearch: ConsultasSearchItem = new ConsultasSearchItem();
  modeloItem: ModelosComunicacionesItem = new ModelosComunicacionesItem();
  consultasCombo: any[];
  consultas: any[];
  finalidad: any[];
  tipoEjecucion: any[];
  textSelected: any;
  showHistorico: boolean = false;
  msgs: Message[];

  @ViewChild('table') table: DataTable;
  selectedDatos

  constructor(private changeDetectorRef: ChangeDetectorRef, private location: Location, private sigaServices: SigaServices) {


  }

  ngOnInit() {
    this.textFilter = "Elegir";

    this.getDatos();

    this.selectedItem = 4;

    this.cols = [
      { field: 'consulta', header: 'Consulta' },
      { field: 'finalidad', header: 'Finalidad' },
      { field: 'tipoEjecucion', header: 'Tipo de ejecución' }
    ];

    this.datos = [
      { id: '1', consulta: 'prueba', finalidad: 'prueba', tipoEjecucion: 'prueba' },
      { id: '2', consulta: 'prueba', finalidad: 'prueba', tipoEjecucion: 'prueba' }
    ];

    this.consultas = [
      { label: 'Seleccione una consulta', value: null },
      { label: 'A', value: '1' },
      { label: 'B', value: '2' },
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

    // this.body.idConsulta = this.consultas[1].value;

  }


  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }


  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onRowSelect() {
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    }
  }

  addConsulta() {
    let obj = {
      consulta: null,
      finalidad: null,
      tipoEjecucion: null
    };
    this.datos.push(obj);
    this.datos = [... this.datos];
  }


  backTo() {
    this.location.back();
  }

  getDatos() {
    this.getComboFormatos();
    this.getComboSufijos();

    if (sessionStorage.getItem("modelosSearch") != null) {
      this.modeloItem = JSON.parse(sessionStorage.getItem("modelosSearch"));

      this.body.idClaseComunicacion = this.modeloItem.idClaseComunicacion;
      this.body.idInstitucion = this.modeloItem.idInstitucion;
      this.getConsultasPlantilla();
    }
  }

  getComboFormatos(){
    this.sigaServices.get("modelos_plantilla_formatos").subscribe(
      n => {
        this.formatos = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboSufijos() {
    this.sigaServices.get("modelos_plantilla_sufijos").subscribe(
      n => {
        this.sufijos = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboObjetivos() {
    this.sigaServices.get("consultas_comboObjetivos").subscribe(
      n => {
        this.finalidad = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }
  

  getConsultasDisponibles(){
    this.sigaServices
      .post("modelos_combo_consultas", this.body)
      .subscribe(
        data => {
          this.consultasCombo = JSON.parse(data["body"]);
        },
        err => {
          this.showFail('Error al cargar las consultas');
          console.log(err);
        }
      );
  }

  getConsultasPlantilla(){
    this.sigaServices
      .post("modelos_plantilla_consultas", this.body)
      .subscribe(
        data => {
          this.consultas = JSON.parse(data["body"]);
        },
        err => {
          this.showFail('Error al cargar las consultas');
          console.log(err);
        }
      );
  }

  getConsultasPlantillaHistorico(){
    this.sigaServices
      .post("modelos_plantilla_consultas_historico", this.body)
      .subscribe(
        data => {
          this.consultas = JSON.parse(data["body"]);
        },
        err => {
          this.showFail('Error al cargar las consultas');
          console.log(err);
        }
      );
  }

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }
}
