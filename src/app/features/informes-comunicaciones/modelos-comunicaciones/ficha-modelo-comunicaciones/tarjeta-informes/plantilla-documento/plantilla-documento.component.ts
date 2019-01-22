import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
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
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-plantilla-documento',
  templateUrl: './plantilla-documento.component.html',
  styleUrls: ['./plantilla-documento.component.scss'],
  encapsulation: ViewEncapsulation.None

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
  informeItem: InformesModelosComItem = new InformesModelosComItem();
  consultasCombo: any[];
  consultasComboDatos: any[];
  consultasComboDestinatarios: any[];
  consultasComboMulti: any[];
  consultasComboCondicional: any[];

  consultas: any = [];
  textSelected: any;
  showHistorico: boolean = false;
  msgs: Message[];
  msgsSteps: Message[] = [];
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
  eliminarArrayPlantillas: any = [];
  nuevoDocumento: boolean = false;
  selectedIdioma: any;
  selectedSufijos: any = [];
  steps: MenuItem[];
  activeStep: number;

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

    this.getSteps();


    this.selectedItem = 10;

    this.cols = [
      { field: 'objetivo', header: 'Objetivo' },
      { field: 'idConsulta', header: 'Consulta' },
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
      { field: 'idioma', header: 'idioma' },
      { field: 'nombreDocumento', header: 'Plantilla' }
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

    this.getSessionStorage();

    if (this.body.idInforme != undefined) {
      this.getResultados();
    }
  }

  getSessionStorage() {
    if (sessionStorage.getItem("modelosSearch") != null) {
      this.modeloItem = JSON.parse(sessionStorage.getItem("modelosSearch"));
      this.body.idModeloComunicacion = this.modeloItem.idModeloComunicacion;
      this.body.idClaseComunicacion = this.modeloItem.idClaseComunicacion;
      this.body.idInstitucion = this.modeloItem.idInstitucion;
    }
    if (sessionStorage.getItem("modelosInformesSearch") != null) {

      this.informeItem = JSON.parse(sessionStorage.getItem("modelosInformesSearch"));
      this.body.idInforme = this.informeItem.idInforme;
      this.body.nombreFicheroSalida = this.informeItem.nombreFicheroSalida;
      this.body.formatoSalida = this.informeItem.idFormatoSalida;
      this.body.sufijos = this.informeItem.sufijos
      if (this.body.sufijos && this.body.sufijos.length > 0) {
        this.selectedSufijos = this.body.sufijos;
        console.log('body', this.selectedSufijos)
      }
    }
  }

  getComboFormatos() {
    this.sigaServices.get("plantillasDoc_combo_formatos").subscribe(
      n => {
        this.formatos = n.combooItems;

      },
      err => {
        console.log(err);
      }
    );
  }

  getComboSufijos() {
    this.sigaServices.get("plantillasDoc_combo_sufijos").subscribe(
      n => {
        this.sufijos = n.combooItems;
        this.getValoresSufijo();

        console.log(this.sufijos)
      },
      err => {
        console.log(err);
      }
    );
  }




  getConsultasDisponibles() {
    this.sigaServices
      .post("plantillasDoc_combo_consultas", this.body)
      .subscribe(
        data => {
          this.consultasComboDatos = JSON.parse(data["body"]).consultasDatos;
          this.consultasComboDestinatarios = JSON.parse(data["body"]).consultasDestinatarios;
          this.consultasComboMulti = JSON.parse(data["body"]).consultasMultidoc;
          this.consultasComboCondicional = JSON.parse(data["body"]).consultasCondicional;
        },
        err => {
          this.showFail('Error al cargar las consultas');
          console.log(err);
        }
      );
  }

  getPlantillas() {
    this.sigaServices
      .post("plantillasDoc_plantillas", this.body)
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
    this.sigaServices
      .post('plantillasDoc_plantillas', this.body)
      .subscribe(
        data => {
          this.documentos = JSON.parse(data["body"]).documentoPlantillaItem;
          this.documentos.map(e => {
            e.guardada = true;
          });
          this.body.plantillas = JSON.parse(JSON.stringify(this.documentos));
        },
        err => {
          this.showFail('Error al cargar las consultas');
          console.log(err);
        }
      );
  }

  restablecerDatosGenerales() {
    this.getSessionStorage();
    if (this.body.idInforme != undefined) {
      this.getResultados();
    }
  }

  getResultados() {
    let service = "plantillasDoc_consultas";
    if (this.showHistorico) {
      service = "plantillasDoc_consultas_historico";
    }
    this.sigaServices
      .post(service, this.body)
      .subscribe(
        data => {
          this.datos = JSON.parse(data["body"]).consultaItem;
          if (this.datos.length <= 0) {
            this.datos = [
              { idConsulta: '', finalidad: '', objetivo: 'Destinatario', idObjetivo: '1' },
              { idConsulta: '', finalidad: '', objetivo: 'Condicional', idObjetivo: '3' },
              { idConsulta: '', finalidad: '', objetivo: 'Multidocumento', idObjetivo: '2' },
              { idConsulta: '', finalidad: '', objetivo: 'Datos', idObjetivo: '4' },
            ]
          };
          this.datos.map(e => {
            return e.idConsultaAnterior = e.idConsulta;
          })
        },
        err => {
          this.showFail('Error al cargar las consultas');
          console.log(err);
        }
      );
  }

  uploadFile(event: any, dato) {
    let fileList: FileList = event.files;
    this.file = fileList[0];

    this.addFile(dato);
  }

  addFile(dato) {
    this.sigaServices.postSendContent("plantillasDoc_subirPlantilla", this.file).subscribe(
      data => {
        let plantilla = new PlantillaDocumentoItem();
        plantilla.nombreDocumento = data.nombreDocumento;
        plantilla.idIdioma = dato.idIdioma;
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
    this.sigaServices.post("plantillasDoc_guardar", this.body).subscribe(
      data => {
        this.showSuccess('La plantilla se ha guardado correctamente');
        this.body.idInforme = JSON.parse(data["body"]).data;
        sessionStorage.setItem("modelosInformesSearch",JSON.stringify(this.body));

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
    this.sigaServices.post("plantillasDoc_insertarPlantilla", plantilla).subscribe(
      data => {
        this.showSuccess('Plantilla subida correctamente');
        plantilla.idPlantillaDocumento = JSON.parse(data["body"]).idPlantillaDocumento;
        this.body.plantillas.push(plantilla);
        this.nuevoDocumento = false;
      },
      err => {
        this.showFail('Error al subir el documento');
        console.log(err);
      }
    );
  }

  guardarConsultas() {
    let destinatarios = this.datos.map(e => {
      if (e.idConsulta != '' && e.idObjetivo == '1') {
        return true;
      } else {
        return false;
      };
    })

    let condicional = this.datos.map(e => {
      if (e.idConsulta != '' && e.idObjetivo == '3') {
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
    this.body.consultas = [];
    this.datos.map(e => {
      let obj = {
        idConsulta: e.idConsulta,
        idConsultaAnterior: e.consultaAnterior,
        idObjetivo: e.idObjetivo
      }
      this.body.consultas.push(obj)
    })


    this.sigaServices.post("plantillasDoc_consultas_guardar", this.body).subscribe(
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

  showInfoSteps(mensaje: string) {
    this.msgsSteps.push({ severity: "info", summary: "", detail: mensaje });
  }


  clear() {
    this.msgs = [];
    this.msgsSteps = [];
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
            if (!dato.idConsulta && dato.idConsulta == id) {
              dato.idConsulta = id;
              dato.finalidad = this.finalidad;
            } else if (dato.idConsulta && dato.idConsulta == id) {
              dato.finalidad = this.finalidad;
            } else if (!dato.idConsulta && dato.idConsulta == '') {
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
        if (!dato.idConsulta && dato.idConsulta == id) {
          dato.idConsulta = id;
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
      message: '¿Está seguro de eliminar ' + dato.length + 'consultas seleccionadas?',
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
        idInstitucion: this.body.idInstitucion,
        idConsulta: element.idConsulta,
        idInforme: this.body.idInforme
      };
      this.eliminarArray.push(objEliminar);
    });
    this.sigaServices.post("plantillasDoc_consultas_borrar", this.eliminarArray).subscribe(
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

  eliminarPlantilla(dato) {
    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message: '¿Está seguro de eliminar ' + dato.length + 'plantillas seleccionadas?',
      icon: "fa fa-trash-alt",
      accept: () => {
        this.confirmarEliminarPlantilla(dato);
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

  confirmarEliminarPlantilla(dato) {
    this.eliminarArrayPlantillas = [];
    dato.forEach(element => {
      let objEliminar = {
        idModeloComunicacion: this.body.idModeloComunicacion,
        idPlantillaDocumento: element.idPlantillaDocumento,
        idInstitucion: this.body.idInstitucion,
        idInforme: element.idInforme
      };
      this.eliminarArrayPlantillas.push(objEliminar);
    });
    this.sigaServices.post("plantillasDoc_plantillas_borrar", this.eliminarArrayPlantillas).subscribe(
      data => {
        this.showSuccess('Se ha eliminado la plantilla correctamente');
      },
      err => {
        this.showFail('Error al eliminar la plantilla');
        console.log(err);
      },
      () => {
        this.getPlantillas();
      }
    );
  }



  onChangeSufijo(dato) {
    console.log(dato);
    this.selectedSufijos.map(e => {
      if (e.value == "1" && dato.itemValue.value == '1') {
        e.abr = 'A'
      } else if (e.value == "2" && dato.itemValue.value == '2') {
        e.abr = 'B'
      } else if (e.value == "3" && dato.itemValue.value == '3') {
        e.abr = 'C'
      }
      return e.abr;
    })
  }

  getValoresSufijo() {
    let valorCombo = this.sufijos.map(e => {
      return e.value;
    });
    for (let sel of this.selectedSufijos) {
      let index = valorCombo.indexOf(sel.idSufijo);
      if (index != -1) {
        this.sufijos.splice(1, 1);
      }
    }
    this.sufijos = [... this.sufijos];
  }

  getSteps() {
    this.steps = [{
      label: 'Datos',
      command: (event: any) => {
        this.activeStep = 0;
        this.showInfoSteps('Busque y añada a continuación las consultas que necesita para obtener los datos. Pídale ayuda a su soporte si no conoce las consultas que existen.');
      }
    },
    {
      label: 'Destinatarios',
      command: (event: any) => {
        this.activeStep = 1;
        this.showInfoSteps('Seleccione los destinatarios de este modelo. Esto hará que se comuniquen los documentos a las personas correspondientes en cada comunicación. Si no selecciona destinatarios, se generará un documento por cada comunicación solicitada. ');
      }
    },
    {
      label: 'Multidocumento',
      command: (event: any) => {
        this.activeStep = 2;
        this.showInfoSteps('Seleccione el modo de generación de varios documentos. Además de la generación por cada destinatario del paso anterior, puede hacer que se generen varios documentos, por ejemplo, si son para que el destinatario reparta copias personalizadas para otras personas. ');
      }
    },
    {
      label: 'Condicional',
      command: (event: any) => {
        this.activeStep = 3;
        this.showInfoSteps('Por último, puede seleccionar una condición para que se genere este documento al solicitar la comunicación. Esta selección se utiliza si va a incorporar varias plantillas en el mismo modelo y quiere que se use una u otra en función de una condición. Si siempre quiere que se genere, no seleccione nada. ');
      }
    }
    ];
  }


}
