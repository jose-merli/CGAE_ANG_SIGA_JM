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
  modelo: ModelosComunicacionesItem = new ModelosComunicacionesItem();
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

  @ViewChild("table") table: DataTable;
  selectedDatos;

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
    if (sessionStorage.getItem("modelosSearch") != null) {
      this.modelo = JSON.parse(sessionStorage.getItem("modelosSearch"));
      this.getInformes();
    }
    
  }

  getInformes() {
    this.sigaServices.post("modelos_detalle_informes", this.modelo).subscribe(
      data => {

       
        this.datos = JSON.parse(data.body).plantillasModeloDocumentos as FichaPlantillasDocument[];

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
    let datoNew = new FichaPlantillasDocument();

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


  onSufijosChange(dato: any) {
    console.log('Sufijos Data1:', dato);


    // Puedes agregar aquí cualquier lógica adicional que necesites
    // para manejar los cambios en los sufijos seleccionados.
  }

}
