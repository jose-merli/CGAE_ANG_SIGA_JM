import { Component, OnInit, Input, Output, EventEmitter,  ChangeDetectorRef, ViewChild, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { ControlAccesoDto } from "../../../../../models/ControlAccesoDto";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { InformesModelosComItem } from "../../../../../models/InformesModelosComunicacionesItem";
import { ModelosComunicacionesItem } from "../../../../../models/ModelosComunicacionesItem";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { FichaPlantillasDocument } from "../../../../../models/FichaPlantillasDocumentoItem";
import { SufijoItem } from "../../../../../models/SufijoItem";
import { PlantillaDocumentoItem } from "../../../../../models/PlantillaDocumentoItem";
import { FileAux } from "../../../../../models/sjcs/FileAux";
import { DatosGeneralesFicha } from "../../../../../models/DatosGeneralesFichaItem";

@Component({
  selector: "app-tarjeta-plantillas-documentos",
  templateUrl: "./tarjeta-plantillas-documentos.component.html",
  styleUrls: ["./tarjeta-plantillas-documentos.component.scss"]
})
export class TarjetaPlantillasDocumentosComponent implements OnInit {
  openFicha: boolean = false;
  activacionEditar: boolean = true;
  derechoAcceso: any;
  permisos: any;
  permisosArray: any[];
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  clasesComunicaciones: any[];
  datos: FichaPlantillasDocument[] = [];
  cols: any[];
  formatoAccept: string;
  formatos: any[];
  first: number = 0;
  selectedItem: number;
  institucionActual: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  body: InformesModelosComItem = new InformesModelosComItem();
  bodyFichaPlantillasDocument: FichaPlantillasDocument = new FichaPlantillasDocument();
  modelo: ModelosComunicacionesItem = new ModelosComunicacionesItem();
  informeItem: InformesModelosComItem = new InformesModelosComItem();
  bodyInicial: any = [];
  msgs: Message[];
  eliminarArray: any[];
  soloLectura: boolean = false;
  continuar: boolean;
  editar: boolean = true;
  sufijos= [];
  idiomas: any[];
  idiomasDisponibles: any[];
  selectedSufijos: any[];
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} etiquetas seleccionadas";
  progressSpinner: boolean = false;
  file: any;
  files: FileAux[] = [];
  nombreCompletoArchivo: any;
  extensionArchivo: any;
  disabledGuardar: any;
  documentos: any = [];
  @Input() datoRecargar: DatosGeneralesFicha;

  @ViewChild("table") table: DataTable;
  selectedDatos: FichaPlantillasDocument[] = [];

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "perfiles",
      activa: false
    },
    {
      key: "informes",
      activa: false
    },
    {
      key: "comunicacion",
      activa: false
    },
    {
      key: "plantillaDocumentos",
      activa: true
    }
  ];
  isNew: Boolean = false;
  @Output() activaInformes = new EventEmitter<void>();
  constructor(
    private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {

    this.getComboFormatos();
    this.getComboSufijos();
    this.busquedaIdioma();
    this.getDatos();
    this.sigaServices.deshabilitarEditar$.subscribe(() => {
      this.editar = false;
    });

    this.selectedItem = 10;
    this.cols = [
      { field: "idioma", header: "censo.usuario.labelIdioma" },
      { field: 'nombreDocumento', header: 'informesycomunicaciones.consultas.ficha.plantilla' },
      { field: "nombreFicheroSalida", header: "informesycomunicaciones.modelosdecomunicacion.fichaModeloComuncaciones.ficheroSalida" },
      { field: "sufijo", header: "administracion.parametrosGenerales.literal.sufijo" },
      { field: "formatoSalida", header: "informesycomunicaciones.modelosdecomunicacion.fichaModeloComuncaciones.formatoSalida" }
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

    this.getInstitucionActual();
  }

  getInstitucionActual() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;

      // El modo de la pantalla viene por los permisos de la aplicación
      if (sessionStorage.getItem("soloLectura") == 'true') {
        this.soloLectura = true;
      }

      if (sessionStorage.getItem("esPorDefecto") == 'SI' && this.institucionActual != 2000) {
        this.soloLectura = true;
      } else {
        this.modelo = JSON.parse(sessionStorage.getItem('modelosSearch'));
        if (this.modelo != undefined && this.modelo != null && this.modelo.porDefecto == 'SI' && this.institucionActual != 2000) {
          if (
            sessionStorage.getItem("soloLectura") != null &&
            sessionStorage.getItem("soloLectura") != undefined &&
            sessionStorage.getItem("soloLectura") == "true"
          ) {
            this.soloLectura = true;
          }
        }
      }
    });
  }

  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevoModelo") == null) {
      this.openFicha = !this.openFicha;
      if (this.openFicha) {
        this.getDatos();
      }
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "110";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        //console.log(err);
      },
      () => {
        // if (this.derechoAcceso == 3) {
        //   this.activacionEditar = true;
        // } else if (this.derechoAcceso == 2) {
        //   this.activacionEditar = false;
        // } else {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        //   this.router.navigate(["/errorAcceso"]);
        // }
      }
    );
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isSelectMultiple() {
    if (!this.soloLectura) {
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

  controlDuplicados(): boolean {
    let idiomasUnicos = new Set();
    let tieneDuplicados = this.datos.some(dato => {
      let yaExiste = idiomasUnicos.has(dato.idIdioma);
      idiomasUnicos.add(dato.idIdioma);
      return yaExiste;
    });
    return !tieneDuplicados;
  }

  getSessionStorage() {

    if (sessionStorage.getItem("modelosSearch") != null) {
      this.modelo = JSON.parse(sessionStorage.getItem("modelosSearch"));
      this.bodyFichaPlantillasDocument.idModeloComunicacion = this.modelo.idModeloComunicacion;
      this.bodyFichaPlantillasDocument.idClaseComunicacion = this.modelo.idClaseComunicacion;
      this.bodyFichaPlantillasDocument.idInstitucion = this.modelo.idInstitucion;
    }
    if (this.isNew) {
      this.modelo.idModeloComunicacion = this.datoRecargar.idModeloComunicacion;
      this.modelo.idClaseComunicacion = this.datoRecargar.idClaseComunicacion;
      this.modelo.idInstitucion = this.datoRecargar.idInstitucion;

    }

    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
  }

  getComboSufijos() {
    this.sigaServices.get("plantillasDoc_combo_sufijos_agrupados").subscribe(
      n => {

        this.sufijos = JSON.parse(JSON.stringify(n.sufijos));
        this.sufijos = this.sufijos.map(sufijo => ({
          label: sufijo.nombreSufijo, // Usamos 'nombreSufijo' como la etiqueta visible
          value: sufijo.idSufijo // Usamos 'idSufijo' como el valor asociado
        }));
      },
      err => {
        //console.log(err);
      }
    );
  }

  getDatos() {
    //this.getSessionStorage();
    if (sessionStorage.getItem("modelosSearch") != null) {
      this.modelo = JSON.parse(sessionStorage.getItem("modelosSearch"));
      this.getInformes();
    }

  }

  getInformes() {
    this.sigaServices.post("modelos_detalle_informes", this.modelo).subscribe(
      data => {
        let plantilla: PlantillaDocumentoItem = new PlantillaDocumentoItem();
        let listaPlantillas: PlantillaDocumentoItem[] = [];
        listaPlantillas.push(plantilla)

        this.datos = JSON.parse(data.body).plantillasModeloDocumentos as FichaPlantillasDocument[];

        if(this.datos.length > 0) this.activaInformes.emit();
        
        this.datos.forEach(element => {
          element.idModeloComunicacion = this.modelo.idModeloComunicacion;
          element.idClaseComunicacion = this.modelo.idClaseComunicacion;
          element.idInstitucion = this.modelo.idInstitucion;
          element.plantillas = listaPlantillas;
          element.idSufijo = element.sufijo
        });


        console.log("DATO")
        console.log(this.datos)
        this.changeDetectorRef.detectChanges();

      },
      err => {
        //console.log(err);
      }
    );
  }

  changeFormato() {
    if (this.body.idFormatoSalida == "2") {
      this.formatoAccept = ".doc,.docx,.fo";
    } else if (this.body.idFormatoSalida == "1") {
      this.formatoAccept = ".xls,.xlsx,.fo";
    }
  }

  getComboFormatos() {
    this.sigaServices.get("plantillasDoc_combo_formatos").subscribe(
      n => {
        this.formatos = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  addInforme() {
    let plantilla: PlantillaDocumentoItem = new PlantillaDocumentoItem();
    let listaPlantillas: PlantillaDocumentoItem[] = [];
    listaPlantillas.push(plantilla)

    let datoNew = new FichaPlantillasDocument();
    datoNew.idModeloComunicacion = this.modelo.idModeloComunicacion;
    datoNew.idClaseComunicacion = this.modelo.idClaseComunicacion;
    datoNew.idInstitucion = this.modelo.idInstitucion;
    datoNew.plantillas = listaPlantillas;

    this.datos.push(datoNew);
    //Modificarlo para añadir un nuevo item.

  }

 eliminar( dato) {

    let keyConfirmation = "deletePlantillaDoc";

    this.confirmationService.confirm({
      key: keyConfirmation,
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message: this.translateService.instant('informesycomunicaciones.modelosdecomunicacion.ficha.mensajeEliminar') + ' ' + dato.length + ' ' + this.translateService.instant('informesycomunicaciones.modelosdecomunicacion.ficha.informesSeleccionados'),
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

  confirmarEliminar(dato) { //dato = this.selectedDatos.

    let conIdPlantilla = this.selectedDatos.filter(dato => dato.idPlantillas !== undefined);
    let sinIdPlantilla = this.selectedDatos.filter(dato => dato.idPlantillas === undefined);

    this.datos = this.datos.filter(dato => !sinIdPlantilla.includes(dato));

    if (conIdPlantilla.length > 0) {
      this.progressSpinner = true;
      this.eliminarArray = [];
      this.eliminarArray = [...conIdPlantilla];

      dato.forEach(element => {
        let objEliminar = {
          idModeloComunicacion: this.modelo.idModeloComunicacion,
          idInstitucion: this.modelo.idInstitucion,
          idInforme: element.idInforme
        };
        this.eliminarArray.push(objEliminar);
      });
      this.sigaServices.post("modelos_detalle_informes_borrar", this.eliminarArray).subscribe(
        data => {
          this.progressSpinner = false;
          this.selectedDatos = [];
          this.showSuccess(this.translateService.instant('informesycomunicaciones.modelosdecomunicacion.ficha.correctInformeEliminado'));
        },
        err => {
          let error = JSON.parse(err.error).description;
          this.progressSpinner = false;

          if (error == "ultimo")
            this.showFail(
              this.translateService.instant(
                "censo.modelosComunicaciones.gestion.errorUltimaPlantilla"
              )
            );
          else {
            this.showFail(this.translateService.instant('informesycomunicaciones.modelosdecomunicacion.ficha.errorInformeEliminado'));
            //console.log(err);
          }

        },
        () => {
          this.progressSpinner = false;
          this.getInformes();
        }
      );
    }else{
      this.selectedDatos = [];
      this.getInformes();
    }

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

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  busquedaIdioma() {
    this.sigaServices.get("etiquetas_lenguaje").subscribe(
      n => {
        this.idiomas = n.combooItems;
        this.idiomasDisponibles = this.idiomas;
      },
      err => {
        //console.log(err);
      }
    );
  }

  uploadFile(event: any, dato) {

    let fileList: FileList = event.files;
    this.file = fileList[0];

    let fileAux: FileAux = new FileAux();
    fileAux.file = this.file;
    fileAux.idIdioma = dato.idIdioma;

    this.files.push(fileAux)
    dato.nombreFichero = fileList[0].name;


    this.nombreCompletoArchivo = fileList[0].name;
    dato.nombreDocumento = this.nombreCompletoArchivo;
    this.extensionArchivo = this.nombreCompletoArchivo.substring(
      this.nombreCompletoArchivo.lastIndexOf("."),
      this.nombreCompletoArchivo.length
    );

    this.validateSizeFile(dato);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.datoRecargar && !changes.datoRecargar.firstChange) {
      console.log(this.datoRecargar);
      this.isNew = true;
      this.ngOnInit();
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
            // this.addFile(dato);
            this.showInfo("Fichero Enlazado.");
            this.progressSpinner = false;
          } else {
            this.showFail(this.translateService.instant("informesYcomunicaciones.modelosComunicaciones.plantillaDocumento.mensaje.error.cargarArchivo") + tam + " MB");
            this.progressSpinner = false;
          }
        });
  }

  guardarData() {
    if(this.controlDuplicados()){
      this.progressSpinner = true;

      let filesFiltrados: FileAux[] = [];
  
      this.files.forEach((fileAux) => {
        this.selectedDatos.forEach((ficha) => {
          if (fileAux.idIdioma === ficha.idIdioma) {
            filesFiltrados.push(fileAux);
          }
        });
      });
  
      //plantillasDoc_guardar_datosSalida
      this.sigaServices.postSendFilesFichaPlantillas("plantillasDoc_guardar_plantillas", filesFiltrados, this.selectedDatos).subscribe(
        data => {
          this.showSuccess("Guardar datos de salida correctos");
          
  
          // this.body.idInforme = JSON.parse(data["body"]).data;
          //   this.getDocumentos();
  
          // this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          /////   this.sufijosInicial = JSON.parse(JSON.stringify(this.sufijos));
          // this.selectedSufijosInicial = JSON.parse(
          //    JSON.stringify(this.selectedSufijos)
          //  );
  
          this.progressSpinner = false;
  
        },
        err => {
          this.showFail("Error guardar datos Salida");
          //console.log(err);
          this.progressSpinner = false;
  
        },
        () => {
          this.progressSpinner = false;
          this.files = [];
          this.selectedDatos = [];
          this.getInformes();
  
        }
      );
    }else{
      ///Mostrar mensaje error duplicado.
      this.showFail("Idiomas duplicados");
    }

   

  }


}
