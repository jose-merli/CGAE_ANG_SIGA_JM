import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { FichaPlantillasDocument } from '../../../../../../models/FichaPlantillasDocumentoItem';
import { ConsultasSearchItem } from '../../../../../../models/ConsultasSearchItem';
import { ModelosComunicacionesItem } from '../../../../../../models/ModelosComunicacionesItem';
import { InformesModelosComItem } from '../../../../../../models/InformesModelosComunicacionesItem';
import { PlantillaDocumentoItem } from "../../../../../../models/PlantillaDocumentoItem";

import { SigaServices } from "./../../../../../../_services/siga.service";
import { Location } from "@angular/common";
import { Message, ConfirmationService } from "primeng/components/common/api";


@Component({
  selector: 'app-plantilla-documento',
  templateUrl: './plantilla-documento.component.html',
  styleUrls: ['./plantilla-documento.component.scss']
})

export class PlantillaDocumentoComponent implements OnInit {

  datos: any = [];
  cols: any = [];
  first: number = 0;
  firstDocs: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectAllDocs: boolean = false;
  selectMultiple: boolean = false;
  selectMultipleDocs: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  formatos: any[];
  sufijos: any[];
  textFilter: string;
  body: FichaPlantillasDocument = new FichaPlantillasDocument();
  consultaSearch: ConsultasSearchItem = new ConsultasSearchItem();
  modeloItem: ModelosComunicacionesItem = new ModelosComunicacionesItem();
  consultasCombo: any[];
  consultas: any = [];
  textSelected: any;
  showHistorico: boolean = false;
  msgs: Message[];
  documentos: any = [];
  colsDocumentos: any = [];
  idiomas: any = [];
  progressSpinner: boolean = false;
  finalidad: string;
  showDatosGenerales: boolean = true;
  showConsultas: boolean = false;
  file: any;

  @ViewChild('table') table: DataTable;
  selectedDatos


  @ViewChild('tableDocs') tableDocs: DataTable;
  selectedDocs

  constructor(private changeDetectorRef: ChangeDetectorRef, private location: Location, private sigaServices: SigaServices) {


  }

  ngOnInit() {
    this.textFilter = "Elegir";
    this.textSelected = "{0} ficheros seleccionadas";
    this.firstDocs = 0;

    this.getDatos();
    this.busquedaIdioma();
    this.getConsultasDisponibles();

    this.selectedItem = 4;

    this.cols = [
      { field: 'consulta', header: 'Consulta' },
      { field: 'finalidad', header: 'Finalidad' }
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

    this.colsDocumentos = [
      { field: 'plantilla', header: 'Plantilla' },
      { field: 'idioma', header: 'idioma' }
    ]

    this.datos = []

    // this.body.idConsulta = this.consultas[1].value;

  }

  busquedaIdioma() {
    this.sigaServices.get("etiquetas_lenguaje").subscribe(
      n => {
        this.idiomas = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
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

  isSelectMultipleDocs() {
    this.selectMultipleDocs = !this.selectMultipleDocs;
    if (!this.selectMultipleDocs) {
      this.selectedDocs = [];
    } else {
      this.selectAll = false;
      this.selectedDocs = [];
    }
  }

  onChangeSelectAll(key) {
    if (key != 'docs') {
      if (this.selectAll === true) {
        this.selectMultiple = false;
        this.selectedDatos = this.datos;
        this.numSelected = this.datos.length;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    } else {
      if (this.selectAllDocs === true) {
        this.selectMultipleDocs = false;
        this.selectedDocs = this.documentos;
      } else {
        this.selectedDocs = [];
      }
    }

  }

  onRowSelect() {
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    }
  }

  addDocumento() {
    let obj = {
      plantilla: '',
      idioma: '',
    };
    this.documentos.push(obj);
    this.documentos = [... this.documentos];
  }


  addConsulta() {
    let obj = {
      consulta: null,
      finalidad: null
    };
    this.datos.push(obj);
    // this.datos = [... this.datos];
  }


  backTo() {
    this.location.back();
  }

  getHistorico(key) {
    if (key == 'visible') {
      this.showHistorico = true;
    } else if (key == 'hidden') {
      this.showHistorico = false;
    }
    this.getResultados();
  }

  getDatos() {
    this.getComboFormatos();
    this.getComboSufijos();

    if (sessionStorage.getItem("modelosSearch") != null) {
      this.modeloItem = JSON.parse(sessionStorage.getItem("modelosSearch"));

      this.body.idClaseComunicacion = this.modeloItem.idClaseComunicacion;
      this.body.idInstitucion = this.modeloItem.idInstitucion;
      this.getResultados()
    }
  }

  getComboFormatos() {
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




  getConsultasDisponibles() {
    this.sigaServices

      .post("modelos_combo_consultas", this.body)
      .subscribe(
        data => {
          this.consultasCombo = JSON.parse(data["body"]).combooItems;
          console.log(this.consultasCombo)
        },
        err => {
          this.showFail('Error al cargar las consultas');
          console.log(err);
        }
      );
  }



  getResultados() {
    let service = "modelos_plantilla_consultas";
    if (this.showHistorico) {
      service = "modelos_plantilla_consultas_historico";
    }
    this.sigaServices
      .post(service, this.body)
      .subscribe(
        data => {
          this.datos = JSON.parse(data["body"]).consultaItem;
        },
        err => {
          this.showFail('Error al cargar las consultas');
          console.log(err);
        }
      );
  }

  uploadFile(event: any) {
    let fileList: FileList = event.files;
    this.file = fileList[0];

    this.addFile();
  }

  addFile() {
    this.sigaServices.postSendContent("modelos_detalle_subirPlantilla", this.file).subscribe(
      data => {   
        let plantilla = new PlantillaDocumentoItem ();
        plantilla.nombre = data.nombreDocumento;
        plantilla.idioma = 'ES';
        this.guardarDocumento(plantilla);
      },
      err => {

        if  (err.error.error.code  ==  400) {
          this.showFail('Formato no permitido o tamaño maximo superado');
        }  else  {
          this.showFail('Error al subir el documento');
          console.log(err);
        }
      },
      () => {
      }
    );
  }

  guardarDocumento(plantilla){
    this.sigaServices.post("modelos_detalle_insertarPlantilla", plantilla).subscribe(
      data => {   
        this.showSuccess('Plantilla subida correctamente');
        plantilla.idPlantillaDocumento = data.idPlantillaDocumento
        this.body.plantillas.push(plantilla);
      },
      err => {
        this.showFail('Error al subir el documento');
        console.log(err);
      },
      () => {
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

  onChangeIdioma() {

  }

  getFinalidad(id) {
    this.sigaServices
      .post("plantillasEnvio_finalidadConsulta", id)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.finalidad = JSON.parse(data["body"]).finalidad;
          for (let dato of this.datos) {
            if (!dato.idConsulta) {
              dato.idConsulta = id;
              dato.finalidad = this.finalidad;
            } else if (dato.idConsulta && dato.idConsulta == id) {
              dato.finalidad = this.finalidad;
            }
          }
          this.datos = [... this.datos];
          console.log(this.datos)
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => { }
      );
  }

  onChangeConsultas(e) {
    let id = e.value;
    this.getFinalidad(id);
    console.log(id)
  }

  onShowDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onShowConsultas() {
    if (sessionStorage.getItem("crearNuevaPlantillaDocumento") == null) {
      this.showConsultas = !this.showConsultas
    }

  }
}
