import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ViewEncapsulation
} from "@angular/core";
import { DataTable } from "primeng/datatable";
import { FichaPlantillasDocument } from "../../../../../../models/FichaPlantillasDocumentoItem";
import { ConsultasSearchItem } from "../../../../../../models/ConsultasSearchItem";
import { ModelosComunicacionesItem } from "../../../../../../models/ModelosComunicacionesItem";
import { InformesModelosComItem } from "../../../../../../models/InformesModelosComunicacionesItem";
import { PlantillaDocumentoItem } from "../../../../../../models/PlantillaDocumentoItem";
import { SigaServices } from "./../../../../../../_services/siga.service";
import { Location } from "@angular/common";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../../commons/translate/translation.service";
import { MenuItem } from "primeng/api";
import { Router } from "@angular/router";
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: "app-plantilla-documento",
  templateUrl: "./plantilla-documento.component.html",
  styleUrls: ["./plantilla-documento.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PlantillaDocumentoComponent implements OnInit {
  datos: any = [];
  datosInicial: any = [];
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
  consulta: any;

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
  bodyInicial: any = [];
  sufijosInicial: any = [];
  selectedSufijosInicial: any = [];
  docsInicial: any = [];
  formatoAccept: string;
  institucionActual: number;
  consultasGuardadas: boolean = true;
  esPorDefecto: boolean = false;

  @ViewChild("table") table: DataTable;
  selectedDatos;

  @ViewChild("tableDocs") tableDocs: DataTable;
  selectedDocs;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {

    if (sessionStorage.getItem("esPorDefecto") == 'SI') {
      this.esPorDefecto = true;
    } else {
      this.esPorDefecto = false;
    }

    //sessionStorage.removeItem('esPorDefecto');
    this.getInstitucionActual();
    this.textFilter = "Elegir";
    this.textSelected = "{0} ficheros seleccionadas";
    this.firstDocs = 0;

    this.getDatos();
    this.busquedaIdioma();
    this.getConsultasDisponibles();

    this.getSteps();

    this.selectedItem = 10;

    this.cols = [
      { field: "objetivo", header: "Objetivo" },
      { field: "idConsulta", header: "Consulta" },
      { field: "region", header: "Region" }
    ];

    this.consultas = [
      { label: "Seleccione una consulta", value: null },
      { label: "A", value: "1" },
      { label: "B", value: "2" }
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
      { field: "idioma", header: "Idioma" },
      { field: "nombreDocumento", header: "Plantilla" }
    ];

    this.datos = [
      { consulta: "", finalidad: "", objetivo: "Condicional", idObjetivo: "3" },
      {
        consulta: "",
        finalidad: "",
        objetivo: "Destinatario",
        idObjetivo: "1",
        idInstitucion: ""
      },
      {
        consulta: "",
        finalidad: "",
        objetivo: "Multidocumento",
        idObjetivo: "2",
        idInstitucion: ""
      },
      { consulta: "", finalidad: "", objetivo: "Datos", idObjetivo: "4" }
    ];
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

    if (!this.esPorDefecto) {
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
  }

  isSelectMultipleDocs() {
    if (!this.esPorDefecto) {
      this.selectMultipleDocs = !this.selectMultipleDocs;
      if (!this.selectMultipleDocs) {
        this.selectedDocs = [];
      } else {
        this.selectAll = false;
        this.selectedDocs = [];
      }
    }
  }

  onChangeSelectAll(key) {
    if (key != "docs") {
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

  onSelectConsulta(event, dato) {
    console.log(dato);
    if (!this.esPorDefecto) {
      if (!this.selectMultiple && event.originalEvent.target != null && event.originalEvent.target.className.indexOf("dropdown") == -1 && event.originalEvent.target.parentElement.className.indexOf("dropdown") == -1
      ) {
        this.navigateTo(dato);
      } else if (this.selectMultiple && dato[0].idObjetivo != "4") {
        this.eliminarDisabled = true;
      } else if (
        this.selectMultiple &&
        dato[0].idObjetivo == "4" &&
        dato[0].idConsulta != "" &&
        dato[0].idConsulta != null
      ) {
        this.eliminarDisabled = false;
      } else if (
        this.selectMultiple &&
        dato[0].idObjetivo == "4" &&
        (dato[0].idConsulta == "" || dato[0].idConsulta == null)
      ) {
        this.eliminarDisabled = true;
      }
    }
  }

  onRowSelect(dato) {

    if (!this.selectMultipleDocs) {
      this.selectedDocs = [];
    }

  }
  addDocumento() {
    let obj = {
      plantilla: "",
      idioma: "",
      guardada: "",
      nombreDocumento: ""
    };
    this.nuevoDocumento = true;
    this.documentos.push(obj);
    this.documentos = [...this.documentos];
  }

  addConsulta() {
    let obj = {
      consulta: null,
      finalidad: null,
      objetivo: "DATOS",
      idObjetivo: 4,
      idInstitucion: ""
    };
    this.datos.push(obj);
    this.datos = [...this.datos];
  }

  backTo() {
    this.location.back();
  }

  getHistorico(key) {
    if (key == "visible") {
      this.showHistorico = true;
    } else if (key == "hidden") {
      this.showHistorico = false;
    }
    this.getResultados();
  }

  getDatos() {
    this.getComboFormatos();
    this.getComboSufijos();

    this.getSessionStorage();

    if (this.body.idInforme != undefined && this.body.idInforme != null) {
      this.getResultados();
      this.getDocumentos();
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
      this.informeItem = JSON.parse(
        sessionStorage.getItem("modelosInformesSearch")
      );
      this.body.idInforme = this.informeItem.idInforme;
      this.body.nombreFicheroSalida = this.informeItem.nombreFicheroSalida;
      this.body.formatoSalida = this.informeItem.formatoSalida;
      this.body.idFormatoSalida = this.informeItem.idFormatoSalida;

      if (this.body.idFormatoSalida != undefined) {
        this.changeFormato();
      }

      this.body.sufijos = this.informeItem.sufijos;
      if (this.body.sufijos && this.body.sufijos.length > 0) {
        this.selectedSufijos = this.body.sufijos;
        this.selectedSufijosInicial = JSON.parse(
          JSON.stringify(this.selectedSufijos)
        );
      }
    }

    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
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
        this.sufijos = n.sufijos;
        this.getValoresSufijo();
        this.sufijosInicial = JSON.parse(JSON.stringify(this.sufijos));
      },
      err => {
        console.log(err);
      }
    );
  }

  changeFormato() {
    console.log(this.body.idFormatoSalida);
    if (this.body.idFormatoSalida == "2") {
      this.formatoAccept = ".doc,.docx";
    } else if (this.body.idFormatoSalida == "1") {
      this.formatoAccept = ".xls,.xlsx";
    }
  }

  getConsultasDisponibles() {
    this.sigaServices
      .post("plantillasDoc_combo_consultas", this.body)
      .subscribe(
        data => {
          this.consultasComboDatos = JSON.parse(data["body"]).consultasDatos;
          this.consultasComboDestinatarios = JSON.parse(
            data["body"]
          ).consultasDestinatarios;
          this.consultasComboMulti = JSON.parse(data["body"]).consultasMultidoc;
          this.consultasComboCondicional = JSON.parse(
            data["body"]
          ).consultasCondicional;
        },
        err => {
          this.showFail("Error al cargar las consultas");
          console.log(err);
        }
      );
  }

  getDocumentos() {
    this.progressSpinner = true;
    this.sigaServices.post("plantillasDoc_plantillas", this.body).subscribe(
      data => {
        this.progressSpinner = false;
        this.documentos = JSON.parse(data["body"]).documentoPlantillaItem;
        this.documentos.map(e => {
          e.guardada = true;
        });
        this.body.plantillas = JSON.parse(JSON.stringify(this.documentos));
        this.docsInicial = JSON.parse(JSON.stringify(this.documentos));
      },
      err => {
        this.showFail("Error al cargar las consultas");
        console.log(err);
      }
    );
  }

  restablecerDatosGenerales() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.sufijos = JSON.parse(JSON.stringify(this.sufijosInicial));
    this.selectedSufijos = JSON.parse(
      JSON.stringify(this.selectedSufijosInicial)
    );
    this.documentos = JSON.parse(JSON.stringify(this.docsInicial));

    this.body.consultas = this.datos;
    this.nuevoDocumento = false;
  }

  getResultados() {
    let service = "plantillasDoc_consultas";
    if (this.showHistorico) {
      service = "plantillasDoc_consultas_historico";
    }
    this.sigaServices.post(service, this.body).subscribe(
      data => {
        this.datos = JSON.parse(data["body"]).consultaItem;
        if (this.datos.length <= 0) {
          this.datos = [
            {
              idConsulta: "",
              finalidad: "",
              objetivo: "Destinatario",
              idObjetivo: "1",
              idInstitucion: ""
            },
            {
              idConsulta: "",
              finalidad: "",
              objetivo: "Condicional",
              idObjetivo: "3",
              idInstitucion: ""
            },
            {
              idConsulta: "",
              finalidad: "",
              objetivo: "Multidocumento",
              idObjetivo: "2",
              idInstitucion: ""
            },
            {
              idConsulta: "",
              finalidad: "",
              objetivo: "Datos",
              idObjetivo: "4",
              idInstitucion: ""
            }
          ];
        } else {
          let multidocumento = this.datos.map(e => {
            if (e.idObjetivo == "2") {
              return true;
            } else {
              return false;
            }
          });

          let datos = this.datos.map(e => {
            if (e.idObjetivo == "4") {
              return true;
            } else {
              return false;
            }
          });
          let dest = this.datos.map(e => {
            if (e.idObjetivo == "1") {
              return true;
            } else {
              return false;
            }
          });
          let condicional = this.datos.map(e => {
            if (e.idObjetivo == "3") {
              return true;
            } else {
              return false;
            }
          });
          if (multidocumento.indexOf(true) == -1) {
            this.datos.push({
              idConsulta: "",
              finalidad: "",
              objetivo: "Multidocumento",
              idObjetivo: "2",
              idInstitucion: ""
            });
          }
          if (datos.indexOf(true) == -1) {
            this.datos.push({
              idConsulta: "",
              finalidad: "",
              objetivo: "Datos",
              idObjetivo: "4",
              idInstitucion: ""
            });
          }
          if (dest.indexOf(true) == -1) {
            this.datos.push({
              idConsulta: "",
              finalidad: "",
              objetivo: "Destinatario",
              idObjetivo: "1",
              idInstitucion: ""
            });
          }
          if (condicional.indexOf(true) == -1) {
            this.datos.push({
              idConsulta: "",
              finalidad: "",
              objetivo: "Condicional",
              idObjetivo: "3",
              idInstitucion: ""
            });
          }
        }

        this.datos.sort(function (a, b) {
          if (a.idObjetivo == 3) {
            return -1;
          } else if (a.idObjetivo == 4) {
            return 1;
          } else {
            if (a.idObjetivo > b.idObjetivo) {
              return 1;
            }
            if (a.idObjetivo < b.idObjetivo) {
              return -1;
            }
            return 0;
          }
        });

        this.datos.map(e => {
          return (e.idConsultaAnterior = e.idConsulta);
        });
        this.datosInicial = JSON.parse(JSON.stringify(this.datos));
      },
      err => {
        this.showFail("Error al cargar las consultas");
        console.log(err);
      }
    );
  }

  uploadFile(event: any, dato) {
    let fileList: FileList = event.files;
    this.file = fileList[0];

    let nombreCompletoArchivo = fileList[0].name;
    let extensionArchivo = nombreCompletoArchivo.substring(
      nombreCompletoArchivo.lastIndexOf("."),
      nombreCompletoArchivo.length
    );

    if (
      extensionArchivo == null ||
      extensionArchivo.trim() == "" ||
      (!/\.(xls|xlsx)$/i.test(extensionArchivo.trim().toUpperCase()) &&
        this.body.idFormatoSalida == "1")
    ) {
      this.file = undefined;
      this.showMessage(
        "info",
        "Información",
        "La extensión del fichero no es correcta."
      );
    } else if (
      extensionArchivo == null ||
      extensionArchivo.trim() == "" ||
      (!/\.(doc|docx)$/i.test(extensionArchivo.trim().toUpperCase()) &&
        this.body.idFormatoSalida == "2")
    ) {
      this.file = undefined;
      this.showMessage(
        "info",
        "Información",
        "La extensión del fichero no es correcta."
      );
    } else {
      this.validateSizeFile(dato);
    }
  }

  validateSizeFile(dato) {
    this.progressSpinner = true;
    this.sigaServices.get("plantillasDoc_sizeFichero")
      .subscribe(
        response => {
          let tam = response.combooItems[0].value;
          let tamBytes = tam * 1024 * 1024;
          if (this.file.size < tamBytes) {
            this.addFile(dato);
          } else {
            this.showFail("Error al cargar el archivo. El tamaño del archivo no puede exceder de " + tam + " MB");
            this.progressSpinner = false;
          }
        });
  }

  addFile(dato) {
    this.sigaServices
      .postSendContentAndParameter("plantillasDoc_subirPlantilla", "?idClaseComunicacion=" + this.body.idClaseComunicacion, this.file)
      .subscribe(
        data => {
          let plantilla = new PlantillaDocumentoItem();
          plantilla.nombreDocumento = data.nombreDocumento;
          plantilla.idIdioma = dato.idIdioma;
          this.guardarDocumento(plantilla);
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          if (err.error.error.code == 400) {
            if (err.error.error.description != null) {
              this.showFail(err.error.error.description);
            } else {
              this.showFail("Formato no permitido o tamaño maximo superado");
            }
          } else {
            this.showFail("Error al subir el documento");
            console.log(err);
          }
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }
  guardarDatosGenerales() {

    this.body.sufijos = [];
    let orden: number = 1;
    this.selectedSufijos.forEach(element => {
      let ordenString = orden.toString();
      let objSufijo = {
        idSufijo: element.idSufijo,
        orden: ordenString,
        nombreSufijo: element.nombreSufijo
      };
      this.body.sufijos.push(objSufijo);
      orden = orden + 1;
    });

    this.sigaServices.post("plantillasDoc_guardar", this.body).subscribe(
      data => {
        this.showSuccess("La plantilla se ha guardado correctamente");
        this.nuevoDocumento = false;
        this.body.idInforme = JSON.parse(data["body"]).data;
        sessionStorage.setItem(
          "modelosInformesSearch",
          JSON.stringify(this.body)
        );
        sessionStorage.removeItem("crearNuevaPlantillaDocumento");
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.sufijosInicial = JSON.parse(JSON.stringify(this.sufijos));
        this.selectedSufijosInicial = JSON.parse(
          JSON.stringify(this.selectedSufijos)
        );
        this.docsInicial = JSON.parse(JSON.stringify(this.documentos));
      },
      err => {
        this.showFail("Error al guardar la plantilla");
        console.log(err);
      },
      () => {
        this.getDocumentos();
      }
    );
  }

  guardarDocumento(plantilla) {
    this.sigaServices
      .post("plantillasDoc_insertarPlantilla", plantilla)
      .subscribe(
        data => {
          this.showInfo("Plantilla cargada, no olvide pulsar en guardar para asociar la plantilla correctamente");
          plantilla.idPlantillaDocumento = JSON.parse(
            data["body"]
          ).idPlantillaDocumento;
          this.body.plantillas.push(plantilla);
          this.documentos = this.body.plantillas;
          this.documentos = [...this.documentos];
        },
        err => {
          this.showFail("Error al subir el documento");
          console.log(err);
        }
      );
  }

  guardarConsultas() {
    let destinatarios = this.datos.map(e => {
      if (typeof e.idConsulta != "undefined" && e.idConsulta != "" && e.idObjetivo == "1") {
        return true;
      } else {
        return false;
      }
    });

    if (destinatarios.indexOf(true) != -1 || this.body.idClaseComunicacion == "5") {
      this.guardarConsultasOk();
    } else {
      this.showFail("Seleccione una consulta para destinatarios");
    }
  }

  guardarConsultasOk() {
    this.body.consultas = [];
    this.datos.map(e => {
      let obj = {
        idConsulta: e.idConsulta,
        idConsultaAnterior: e.idConsultaAnterior,
        idObjetivo: e.idObjetivo,
        idInstitucion: e.idInstitucion,
        idClaseComunicacion: this.body.idClaseComunicacion,
        region: e.region
      };
      this.body.consultas.push(obj);
    });

    this.sigaServices
      .post("plantillasDoc_consultas_guardar", this.body)
      .subscribe(
        data => {
          this.showSuccess("La consulta se ha guardado correctamente");
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        },
        err => {
          this.showFail("Error al guardar la consulta");
          console.log(err);
        },
        () => {
          this.getResultados();
          this.consultasGuardadas = true;
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
    this.selectedIdioma = e.value;
  }

  getFinalidad(id) {
    this.sigaServices.post("plantillasEnvio_finalidadConsulta", id).subscribe(
      data => {
        this.progressSpinner = false;
        this.finalidad = JSON.parse(data["body"]).finalidad;
        for (let dato of this.datos) {
          if (!dato.idConsulta && dato.idConsulta == id) {
            dato.idConsulta = id;
            dato.finalidad = this.finalidad;
          } else if (dato.idConsulta && dato.idConsulta == id) {
            dato.finalidad = this.finalidad;
          } else if (!dato.idConsulta && dato.idConsulta == "") {
            this.finalidad = "";
          }
        }
        this.datos = [...this.datos];
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () => { }
    );
  }

  getInstitucion(id, comboConsultas) {
    for (let dato of this.datos) {
      if (dato.idConsulta && dato.idConsulta != "" && dato.idConsulta == id) {
        dato.idConsulta = id;
        let continua = true;
        comboConsultas.forEach(element => {
          if (continua && element.value == id) {
            dato.idInstitucion = element.idInstitucion;
            continua = false;
          }
        });
      }
    }
    this.datos = [...this.datos];
  }

  onChangeConsultas(e, comboConsultas) {
    let id = e.value;
    if (id == "") {
      for (let dato of this.datos) {
        if (!dato.idConsulta && dato.idConsulta == id) {
          dato.idConsulta = id;
          dato.finalidad = "";
          dato.idInstitucion = "";
        }
      }
    } else {
      this.getInstitucion(id, comboConsultas);
      //this.getFinalidad(id);
    }
    this.consultasGuardadas = false;
  }

  onShowDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onShowConsultas() {
    if (sessionStorage.getItem("crearNuevaPlantillaDocumento") == null) {
      this.showConsultas = !this.showConsultas;
    }
  }

  eliminar(dato) {
    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message:
        "¿Está seguro de eliminar " + dato.length + " consultas seleccionadas?",
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
    this.sigaServices
      .post("plantillasDoc_consultas_borrar", this.eliminarArray)
      .subscribe(
        data => {
          this.showSuccess("Se ha eliminado la consulta correctamente");
          this.selectedDatos = [];
        },
        err => {
          this.showFail("Error al eliminar la consulta");
          console.log(err);
        },
        () => {
          this.getResultados();
        }
      );
  }

  isPlantillaUnica() {
    let isUnica = true;
    if (this.body.plantillas != null) {
      if (this.body.plantillas.length == 1) {
        isUnica = true;
      } else {
        this.body.plantillas.forEach(element => {
          if (isUnica && element.guardada) {
            isUnica = false;
          }
        });
      }
    }
    return isUnica;
  }

  eliminarPlantilla(dato) {
    if (this.isPlantillaUnica()) {
      this.showFail("La plantilla de documento ha de tener al menos una plantilla física");
    } else {
      this.confirmationService.confirm({
        // message: this.translateService.instant("messages.deleteConfirmation"),
        message:
          "¿Está seguro de eliminar " +
          dato.length +
          " plantillas seleccionadas?",
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
    this.sigaServices
      .post("plantillasDoc_plantillas_borrar", this.eliminarArrayPlantillas)
      .subscribe(
        data => {
          this.showSuccess("Se ha eliminado la plantilla correctamente");
        },
        err => {
          this.showFail("Error al eliminar la plantilla");
          console.log(err);
        },
        () => {
          this.getDocumentos();
        }
      );
  }

  onChangeSufijo(dato) {
    console.log(dato);
    this.selectedSufijos.map(e => {
      if (e.value == "1" && dato.itemValue.value == "1") {
        e.abr = "A";
      } else if (e.value == "2" && dato.itemValue.value == "2") {
        e.abr = "B";
      } else if (e.value == "3" && dato.itemValue.value == "3") {
        e.abr = "C";
      }
      return e.abr;
    });
  }

  getValoresSufijo() {
    // for (let sel of this.selectedSufijos) {
    // this.sufijos.map(e => {
    //   if (sel.idSufijo == e.idSufijo) {
    // e.removeItem;
    let i = 0;
    if (this.selectedSufijos != undefined) {
      let perfilesFiltrados = this.sufijos;
      this.sufijos = [];
      perfilesFiltrados.forEach(element => {
        let find = this.selectedSufijos.find(x => x.idSufijo == element.idSufijo);
        if (find != undefined) {
          // console.log(perfilesFiltrados[i]);
        } else {
          this.sufijos.push(perfilesFiltrados[i]);
        }
        i++;
        return element.idSufijo;

      });
    }
    // }
    // });
    this.sufijos = [...this.sufijos];
  }

  getSteps() {
    this.steps = [
      {
        label: "Datos",
        command: (event: any) => {
          this.activeStep = 0;
          this.msgsSteps = [];
          this.showInfoSteps(
            "Busque y añada a continuación las consultas que necesita para obtener los datos. Pídale ayuda a su soporte si no conoce las consultas que existen."
          );
        }
      },
      {
        label: "Destinatarios",
        command: (event: any) => {
          this.activeStep = 1;
          this.msgsSteps = [];
          this.showInfoSteps(
            "Seleccione los destinatarios de este modelo. Esto hará que se comuniquen los documentos a las personas correspondientes en cada comunicación. Si no selecciona destinatarios, se generará un documento por cada comunicación solicitada. "
          );
        }
      },
      {
        label: "Multidocumento",
        command: (event: any) => {
          this.activeStep = 2;
          this.msgsSteps = [];
          this.showInfoSteps(
            "Seleccione el modo de generación de varios documentos. Además de la generación por cada destinatario del paso anterior, puede hacer que se generen varios documentos, por ejemplo, si son para que el destinatario reparta copias personalizadas para otras personas. "
          );
        }
      },
      {
        label: "Condicional",
        command: (event: any) => {
          this.activeStep = 3;
          this.msgsSteps = [];
          this.showInfoSteps(
            "Por último, puede seleccionar una condición para que se genere este documento al solicitar la comunicación. Esta selección se utiliza si va a incorporar varias plantillas en el mismo modelo y quiere que se use una u otra en función de una condición. Si siempre quiere que se genere, no seleccione nada. "
          );
        }
      }
    ];
  }

  restablecerConsultas() {
    this.datos = JSON.parse(JSON.stringify(this.datosInicial));
  }

  isGuardarDisabled() {
    if (
      this.body.idFormatoSalida != "" &&
      this.body.idFormatoSalida != null &&
      this.body.nombreFicheroSalida != "" &&
      this.body.nombreFicheroSalida != null &&
      this.documentos &&
      this.documentos.length > 0 && !this.esPorDefecto
    ) {
      return false;
    } else {
      return true;
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

  navigateTo(dato) {
    if (this.consultasGuardadas) {
      this.confirmarNavegar(dato);
    } else {
      this.confirmationService.confirm({
        // message: this.translateService.instant("messages.deleteConfirmation"),
        message:
          "Si continúa perderá los datos no guardados. ¿Desea continuar?",
        icon: "fa fa-trash-alt",
        accept: () => {
          this.confirmarNavegar(dato);
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
  }

  confirmarNavegar(dato) {
    let idConsulta = dato[0].idConsulta;
    console.log(dato);
    if (!this.selectMultiple && idConsulta) {
      if (!dato[0].sentencia || dato[0].sentencia == null || dato[0].sentencia == "") {
        // Obtenemos la consulta para ir a ella
        this.getConsulta(dato[0]);
      } else {
        if (
          dato[0].generica == "No" ||
          (this.institucionActual == 2000 && dato[0].generica == "Si")
        ) {
          sessionStorage.setItem("consultaEditable", "S");
        } else {
          sessionStorage.setItem("consultaEditable", "N");
        }
        sessionStorage.setItem("consultasSearch", JSON.stringify(dato[0]));
        this.router.navigate(["/fichaConsulta"]);
      }
    }
    this.numSelected = this.selectedDatos.length;
  }

  getConsulta(consulta) {
    this.progressSpinner = true;
    let objConsulta = {
      idConsulta: consulta.idConsulta,
      idInstitucion: consulta.idInstitucion
    }
    this.sigaServices
      .post("plantillasDoc_consulta", objConsulta)
      .subscribe(
        data => {
          let consultaNavegar = JSON.parse(data["body"]).consultaItem[0];

          if (consultaNavegar.generica == "No" || (this.institucionActual == 2000 && consultaNavegar.generica == "Si")) {
            sessionStorage.setItem("consultaEditable", "S");
          } else {
            sessionStorage.setItem("consultaEditable", "N");
          }
          sessionStorage.setItem("consultasSearch", JSON.stringify(consultaNavegar));
          this.router.navigate(["/fichaConsulta"]);
        },
        err => {
          this.showFail("Error al ir a la consulta");
          console.log(err);
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  getInstitucionActual() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });
  }

  downloadDocumento(dato) {
    let objDownload = {
      idPlantillaDocumento: dato[0].idPlantillaDocumento,
      idClaseComunicacion: this.body.idClaseComunicacion
    };
    this.progressSpinner = true;
    this.sigaServices
      .postDownloadFiles("plantillasDoc_descargarPlantilla", objDownload)
      .subscribe(data => {
        const blob = new Blob([data], { type: "application/octet-stream" });
        if (blob.size == 0) {
          this.showFail(
            this.translateService.instant(
              "messages.general.error.ficheroNoExiste"
            )
          );
        } else {
          saveAs(data, dato[0].nombreDocumento);
        }
        this.selectedDatos = [];
      },
        err => {
          console.log(err);
          this.showFail(this.translateService.instant("messages.general.error.ficheroNoExiste")
          );
        }, () => {
          this.progressSpinner = false
        });
  }
}
