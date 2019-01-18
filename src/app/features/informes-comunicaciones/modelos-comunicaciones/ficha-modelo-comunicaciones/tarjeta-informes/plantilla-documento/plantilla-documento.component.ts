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
import { TranslateService } from "../../../../../../commons/translate/translation.service";


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
  eliminarDisabled: boolean = false;
  eliminarArray: any = [];
  nuevoDocumento: boolean = false;
  selectedIdioma: any;

  @ViewChild('table') table: DataTable;
  selectedDatos


  @ViewChild('tableDocs') tableDocs: DataTable;
  selectedDocs

  constructor(private changeDetectorRef: ChangeDetectorRef, private location: Location, private sigaServices: SigaServices,
    private confirmationService: ConfirmationService, private translateService: TranslateService) {


  }

  ngOnInit() {
    this.textFilter = "Elegir";
    this.textSelected = "{0} ficheros seleccionadas";
    this.firstDocs = 0;

    this.getDatos();
    this.busquedaIdioma();
    this.getConsultasDisponibles();
    this.getDocumentos();

    this.selectedItem = 10;

    this.cols = [
      { field: 'consulta', header: 'Consulta' },
      { field: 'finalidad', header: 'Finalidad' },
      { field: 'objetivo', header: 'Objetivo' }
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
      { field: 'idioma', header: 'idioma' },
      { field: 'plantilla', header: 'Plantilla' }
    ]

    this.datos = [
      { consulta: '', finalidad: '', objetivo: 'Destinatario', idObjetivo: '1' },
      { consulta: '', finalidad: '', objetivo: 'Condicional', idObjetivo: '3' },
      { consulta: '', finalidad: '', objetivo: 'Multidocumento', idObjetivo: '2' },
      { consulta: '', finalidad: '', objetivo: 'Datos', idObjetivo: '4' },
    ]
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

  onSelectConsulta(dato) {
    console.log(dato)
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    } else if (this.selectMultiple && dato[0].idObjetivo != '4') {
      this.eliminarDisabled = true;
    } else if (this.selectMultiple && dato[0].idObjetivo == '4') {
      this.eliminarDisabled = false;
    }
  }

  onRowSelect(dato) {
    if (!this.selectMultipleDocs) {
      this.selectedDocs = [];
    }
  }
  addDocumento() {
    let obj = {
      plantilla: '',
      idioma: '',
      guardada: '',
      fileName: ''
    };
    this.nuevoDocumento = true;
    this.documentos.push(obj);
    this.documentos = [... this.documentos];
  }


  addConsulta() {
    let obj = {
      consulta: null,
      finalidad: null,
      objetivo: 'Datos',
      idObjetivo: 4
    };
    this.datos.push(obj);
    this.datos = [... this.datos];
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
      this.body.idModeloComunicacion = this.modeloItem.idModeloComunicacion;
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

  getPlantillas() {
    this.sigaServices
      .post("modelos_detalle_plantillas", this.body)
      .subscribe(
        data => {
          this.body.plantillas = JSON.parse(data["body"]).documentoPlantillaItem;
        },
        err => {
          this.showFail('Error al cargar las plantillas');
          console.log(err);
        }
      );
  }

  getDocumentos() {
    debugger;
    this.sigaServices
      .post('modelos_detalle_plantillas', this.body)
      .subscribe(
        data => {
          this.documentos = JSON.parse(data["body"]).documentoPlantillaItem;
          this.documentos.map(e => {
            e.guardada = true;
          });

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

          if (this.datos.length <= 0) {
            this.datos = [
              { consulta: '', finalidad: '', objetivo: 'Destinatario', idObjetivo: '1' },
              { consulta: '', finalidad: '', objetivo: 'Condicional', idObjetivo: '3' },
              { consulta: '', finalidad: '', objetivo: 'Multidocumento', idObjetivo: '2' },
              { consulta: '', finalidad: '', objetivo: 'Datos', idObjetivo: '4' },
            ]
          }
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
        let plantilla = new PlantillaDocumentoItem();
        plantilla.nombreDocumento = data.nombreDocumento;
        plantilla.idioma = 'ES';
        this.guardarDocumento(plantilla);
      },
      err => {

        if (err.error.error.code == 400) {
          this.showFail('Formato no permitido o tamaño maximo superado');
        } else {
          this.showFail('Error al subir el documento');
          console.log(err);
        }
      },
      () => {
      }
    );
  }
  guardarDatosGenerales() {
    sessionStorage.removeItem("crearNuevaPlantillaDocumento");
    this.sigaServices.post("modelos_detalle_guardarPlantillaDoc", this.body).subscribe(
      data => {
        this.showSuccess('La plantilla se ha guardado correctamente');

        sessionStorage.removeItem("crearNuevaPlantillaDocumento");
      },
      err => {
        this.showFail('Error al guardar la plantilla');
        console.log(err);
      },
      () => {
      }
    );
  }

  guardarDocumento(plantilla) {
    this.sigaServices.post("modelos_detalle_insertarPlantilla", plantilla).subscribe(
      data => {
        this.showSuccess('Plantilla subida correctamente');
        plantilla.idPlantillaDocumento = JSON.parse(data["body"]).idPlantillaDocumento;
        this.body.plantillas.push(plantilla);
        this.nuevoDocumento = false;
      },
      err => {
        this.showFail('Error al subir el documento');
        console.log(err);
      },
      () => {
        this.getDocumentos();
      }
    );
  }

  guardarConsultas() {
    let destinatarios = this.datos.map(e => {
      if (e.consulta != '' && e.idObjetivo == '1') {
        return true;
      } else {
        return false;
      };
    })

    let condicional = this.datos.map(e => {
      if (e.consulta != '' && e.idObjetivo == '3') {
        return true;
      } else {
        return false;
      };
    })

    if (destinatarios.indexOf(true) != -1 && condicional.indexOf(true) != -1) {
      this.guardarConsultasOk();
    } else {
      this.showFail('Seleccione una consulta para destinatarios y condicional');
    }
  }

  guardarConsultasOk() {
    this.datos.map(e => {
      let obj = {
        idConsulta: e.consulta,
        idConsultaAnterior: e.consultaAnterior,
      }
      this.body.consultas.push(obj)
    })


    this.sigaServices.post("modelos_plantilla_consultas_guardar", this.body).subscribe(
      data => {
        this.showSuccess('La consulta se ha guardado correctamente');
      },
      err => {
        this.showFail('Error al guardar la consulta');
        console.log(err);
      },
      () => {
        this.getResultados();
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

  onChangeIdioma(e) {
    console.log(e)
    this.selectedIdioma = e.value
  }

  getFinalidad(id) {
    this.sigaServices
      .post("plantillasEnvio_finalidadConsulta", id)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.finalidad = JSON.parse(data["body"]).finalidad;
          for (let dato of this.datos) {
            if (!dato.consulta && dato.consulta == id) {
              dato.consulta = id;
              dato.finalidad = this.finalidad;
            } else if (dato.consulta && dato.consulta == id) {
              dato.finalidad = this.finalidad;
            } else if (!dato.consulta && dato.consulta == '') {
              this.finalidad = '';
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
    if (id == "") {
      for (let dato of this.datos) {
        if (!dato.consulta && dato.consulta == id) {
          dato.consulta = id;
          dato.finalidad = '';
        }
      }
    } else {
      this.getFinalidad(id);
    }

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

  eliminar(dato) {

    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message: '¿Está seguro de cancelar los' + dato.length + 'envíos seleccionados',
      icon: "fa fa-trash-alt",
      accept: () => {
        this.confirmarEliminar(dato);
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


  confirmarEliminar(dato) {
    this.eliminarArray = [];
    dato.forEach(element => {
      let objEliminar = {
        idModeloComunicacion: this.body.idModeloComunicacion,
        idClaseComunicacion: element.idClaseComunicacion,
        idInstitucion: this.body.idInstitucion,
        idConsulta: dato.idConsulta
      };
      this.eliminarArray.push(objEliminar);
    });
    this.sigaServices.post("modelos_plantilla_consultas_borrar", this.eliminarArray).subscribe(
      data => {
        this.showSuccess('Se ha eliminado la consulta correctamente');
      },
      err => {
        this.showFail('Error al eliminar la consulta');
        console.log(err);
      },
      () => {
        this.getResultados();
      }
    );
  }




}
