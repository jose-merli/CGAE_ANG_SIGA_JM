import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
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
  datos: FichaPlantillasDocument[];
  cols: any[];
  formatoAccept : string;
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
  sufijos: SufijoItem[]; 
  idiomas: any[];
  selectedSufijos: any[]; 
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} etiquetas seleccionadas";
  progressSpinner: boolean = false;
  file: any;
  files: any[]=[];
  nombreCompletoArchivo: any;
  extensionArchivo: any;
  disabledGuardar: any;
  documentos: any = [];

  @ViewChild("table") table: DataTable;
  selectedDatos:FichaPlantillasDocument[];

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

  onChangeSufijo(dato) {
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

  getSessionStorage() {
    
    if (sessionStorage.getItem("modelosSearch") != null) {
      this.modelo = JSON.parse(sessionStorage.getItem("modelosSearch"));
      this.bodyFichaPlantillasDocument.idModeloComunicacion = this.modelo.idModeloComunicacion;
      this.bodyFichaPlantillasDocument.idClaseComunicacion = this.modelo.idClaseComunicacion;
      this.bodyFichaPlantillasDocument.idInstitucion = this.modelo.idInstitucion;
    }
    if (sessionStorage.getItem("modelosInformesSearch") != null) {
      this.informeItem = JSON.parse(
        sessionStorage.getItem("modelosInformesSearch")
      );
      this.bodyFichaPlantillasDocument.idInforme = this.informeItem.idInforme;
      this.bodyFichaPlantillasDocument.nombreFicheroSalida = this.informeItem.nombreFicheroSalida;
      this.bodyFichaPlantillasDocument.formatoSalida = this.informeItem.formatoSalida;
      this.bodyFichaPlantillasDocument.idFormatoSalida = this.informeItem.idFormatoSalida;

      if (this.bodyFichaPlantillasDocument.idFormatoSalida != undefined) {
        this.changeFormato();
      }

      this.bodyFichaPlantillasDocument.sufijos = this.bodyFichaPlantillasDocument.sufijos;
      if (this.bodyFichaPlantillasDocument.sufijos && this.bodyFichaPlantillasDocument.sufijos.length > 0) {
        this.selectedSufijos = this.bodyFichaPlantillasDocument.sufijos;
       // this.selectedSufijosInicial = JSON.parse(
        ////  JSON.stringify(this.selectedSufijos)
       // ); SUFIJO -TODO
      }
    }

    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
  }

  getComboSufijos() { 
    this.sigaServices.get("plantillasDoc_combo_sufijos").subscribe(
      n => {
        
        this.sufijos = JSON.parse(JSON.stringify( n.sufijos));
      },
      err => {
        //console.log(err);
      }
    );
  }

  getDatos() {
    this.getSessionStorage();
    if (sessionStorage.getItem("modelosSearch") != null) {
      this.modelo = JSON.parse(sessionStorage.getItem("modelosSearch"));
      this.getInformes();
    }
    
  }

  getInformes() {
    this.sigaServices.post("modelos_detalle_informes", this.modelo).subscribe(
      data => {
        let plantilla : PlantillaDocumentoItem = new PlantillaDocumentoItem();
        let listaPlantillas : PlantillaDocumentoItem[] = [];
        listaPlantillas.push(plantilla)
       
        this.datos = JSON.parse(data.body).plantillasModeloDocumentos as FichaPlantillasDocument[];
        this.datos.forEach(element => {
          element.idModeloComunicacion = this.modelo.idModeloComunicacion;
          element.idClaseComunicacion = this.modelo.idClaseComunicacion;
          element.idInstitucion = this.modelo.idInstitucion;
          element.plantillas = listaPlantillas;
    
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
    let plantilla : PlantillaDocumentoItem = new PlantillaDocumentoItem();
    let listaPlantillas : PlantillaDocumentoItem[] = [];
    listaPlantillas.push(plantilla)

    let datoNew = new FichaPlantillasDocument();
    datoNew.idModeloComunicacion = this.modelo.idModeloComunicacion;
    datoNew.idClaseComunicacion = this.modelo.idClaseComunicacion;
    datoNew.idInstitucion = this.modelo.idInstitucion;
    datoNew.plantillas = listaPlantillas;
 
    this.datos.push(datoNew);
    //Modificarlo para añadir un nuevo item.

  }

  eliminar(dato) {

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

  confirmarEliminar(dato) {
    this.progressSpinner = true;
    this.eliminarArray = [];
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
      },
      err => {
        //console.log(err);
      }
    );
  }

  uploadFile(event: any, dato) {
    let fileList: FileList = event.files;
    this.file = fileList[0];
    this.files.push(this.file)
    dato.nombreFichero = fileList[0].name;

  
    this.nombreCompletoArchivo = fileList[0].name;
    dato.nombreDocumento =  this.nombreCompletoArchivo;
    this.extensionArchivo = this.nombreCompletoArchivo.substring(
      this.nombreCompletoArchivo.lastIndexOf("."),
      this.nombreCompletoArchivo.length
    );



    // if (
    //   extensionArchivo == null ||
    //   extensionArchivo.trim() == "" ||
    //   (!/\.(xls|xlsx)$/i.test(extensionArchivo.trim().toUpperCase()) &&
    //     this.body.idFormatoSalida == "1")
    // ) {
    //   this.file = undefined;
    //   this.showMessage(
    //     "info",
    //     this.translateService.instant("general.message.informacion"),
    //     this.translateService.instant("formacion.mensaje.extesion.fichero.erronea")
    //   );
    // } else if (
    //   extensionArchivo == null ||
    //   extensionArchivo.trim() == "" ||
    //   (!/\.(doc|docx)$/i.test(extensionArchivo.trim().toUpperCase()) &&
    //     this.body.idFormatoSalida == "2")
    // ) {
    //   this.file = undefined;
    //   this.showMessage(
    //     "info",
    //     this.translateService.instant("general.message.informacion"),
    //     this.translateService.instant("formacion.mensaje.extesion.fichero.erronea")
    //   );
    // } else {
    this.validateSizeFile(dato);
    // }
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

  addFile(dato) {
    this.progressSpinner = true;
    this.sigaServices
      .postSendContentAndParameter("plantillasDoc_subirPlantilla", "?idClaseComunicacion=" + this.bodyFichaPlantillasDocument.idClaseComunicacion, this.file)
      .subscribe(
        data => {
          let plantilla = new PlantillaDocumentoItem();
          plantilla.nombreDocumento = data.nombreDocumento;
          plantilla.idIdioma = dato.idIdioma;
          this.guardarDocumento(plantilla,dato);
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          if (err.error.error.code == 400) {
            if (err.error.error.description != null) {
              this.showFail(err.error.error.description);
            } else {
              this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.formatoNoPermitido"));
            }
          } else {
            this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.errorSubirDocumento"));
            //console.log(err);
          }
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  guardarDocumento(plantilla,dato) {
    this.progressSpinner = true;
    this.sigaServices
      .post("plantillasDoc_insertarPlantilla", plantilla)
      .subscribe(
        data => {
          this.showInfo(this.translateService.instant("informesYcomunicaciones.modelosComunicaciones.plantillaDocumento.mensaje.plantillaCargada"));
          this.disabledGuardar = false;
          plantilla.idPlantillaDocumento = JSON.parse(
            data["body"]
          ).idPlantillaDocumento;
          this.bodyFichaPlantillasDocument.plantillas.push(plantilla);
          this.documentos = this.bodyFichaPlantillasDocument.plantillas;
          this.documentos = [...this.documentos];
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.errorSubirDocumento"));
          //console.log(err);
        }
      );
  }

  preGuarduar(){
    console.log("DATOS SELECCIONADOS.")
    console.log(this.selectedDatos)

    console.log("FILES")
    console.log(this.files)

    this.selectedDatos.forEach(element => {
      
    });

    console.log("DATOS seelcte dDESPUES")

    console.log(this.selectedDatos)

    console.log("DATOS PUROS")
    console.log(this.datos)
  }

  guardarData(){


      this.progressSpinner = true;

//plantillasDoc_guardar_datosSalida
      this.sigaServices.postSendFilesFichaPlantillas("plantillasDoc_guardar_plantillas", this.files,this.selectedDatos).subscribe(
        data => {
          this.showSuccess("Guardar datos de salida correctos");
          console.log("DEspues de insertar.")
          console.log(data)

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

        }
      );
    
  }

  guardarDatosGenerales() {
    this.progressSpinner = true;

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

        this.showSuccess(this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.ficha.correctPlantillaGuardada"));
       // this.nuevoDocumento = false;
        this.body.idInforme = JSON.parse(data["body"]).data;
        sessionStorage.setItem(
          "modelosInformesSearch",
          JSON.stringify(this.body)
        );
        sessionStorage.removeItem("crearNuevaPlantillaDocumento");
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
       // this.sufijosInicial = JSON.parse(JSON.stringify(this.sufijos));
        // this.selectedSufijosInicial = JSON.parse(
        //   JSON.stringify(this.selectedSufijos)
        // );
       // this.docsInicial = JSON.parse(JSON.stringify(this.documentos));
      },
      err => {
        this.showFail(this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.ficha.errorPlantillaGuardada"));
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {
      //  this.getDocumentos();
      }
    );
  }



  onSufijosChange(dato: any) {
    console.log('Sufijos Data1:', dato);


    // Puedes agregar aquí cualquier lógica adicional que necesites
    // para manejar los cambios en los sufijos seleccionados.
  }

}
