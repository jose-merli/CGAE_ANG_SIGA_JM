import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { esCalendar } from "../../../utils/calendar";
import { Location } from "@angular/common";
import { ConfirmationService, Message } from "primeng/components/common/api";
import { TranslateService } from "./../../../commons/translate/translation.service";
import { DataTable } from "primeng/datatable";
import { SigaServices } from "./../../../_services/siga.service";
import { Router } from "@angular/router";
//import "rxjs/Rx";
import { saveAs } from "file-saver/FileSaver";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";
import { DatosGeneralesComponent } from "./../../../new-features/censo/ficha-colegial/datos-generales/datos-generales.component";
// BODYS IMPORT
import { FichaColegialGeneralesItem } from "./../../../../app/models/FichaColegialGeneralesItem";
import { FichaColegialGeneralesObject } from "./../../../../app/models/FichaColegialGeneralesObject";
import { FichaColegialColegialesItem } from "./../../../../app/models/FichaColegialColegialesItem";
import { FichaColegialColegialesObject } from "./../../../../app/models/FichaColegialColegialesObject";

@Component({
  selector: "app-ficha-colegial",
  templateUrl: "./ficha-colegial.component.html",
  styleUrls: ["./ficha-colegial.component.scss"]
})
export class FichaColegialComponent implements OnInit {
  //fichasPosibles: any[];

  // Bodys
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  openFicha: boolean = false;
  es: any = esCalendar;
  progressSpinner: boolean = false;
  editar: boolean = false;
  blockCrear: boolean = true;

  selectAll: boolean = false;
  selectMultiple: boolean = false;

  msgs: Message[];

  colsColegiales: any = [];
  colsColegiaciones: any = [];
  colsCertificados: any = [];
  colsSociedades: any = [];
  colsCurriculares: any = [];

  rowsPerPage: any = [];
  tipoCuenta: any[] = [];
  selectedTipo: any[] = [];
  uploadedFiles: any[] = [];
  numSelected: number = 0;
  activacionEditar: boolean = false;
  selectedItem: number = 10;
  camposDesactivados: boolean = false;
  datos: any[];

  file: File = undefined;
  ocultarMotivo: boolean = undefined;

  @ViewChild("table")
  table: DataTable;
  selectedDatos;

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "colegiaciones",
      activa: false
    },
    {
      key: "colegiales",
      activa: false
    },
    {
      key: "certificados",
      activa: false
    },
    {
      key: "sanciones",
      activa: false
    },
    {
      key: "sociedades",
      activa: false
    },
    {
      key: "curriculares",
      activa: false
    },
    {
      key: "direcciones",
      activa: false
    },
    {
      key: "bancarios",
      activa: false
    },
    {
      key: "interes",
      activa: false
    }
  ];
  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  constructor(
    private location: Location,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAcceso();

    this.colsColegiales = [
      {
        field: "fecha",
        header: "censo.consultaDatosGenerales.literal.fechaIncorporacion"
      },
      {
        field: "Estado",
        header: "censo.fichaIntegrantes.literal.estado"
      },
      {
        field: "Residente",
        header: "censo.ws.literal.residente"
      },
      {
        field: "Observaciones",
        header: "gratuita.mantenimientoLG.literal.observaciones"
      }
    ];

    this.colsColegiaciones = [
      {
        field: "numIdentificacion",
        header: "censo.consultaDatosColegiacion.literal.numIden"
      },
      {
        field: "nombreApellidos",
        header: "administracion.usuarios.literal.nombre"
      },
      {
        field: "numColegiado",
        header: "censo.busquedaClientesAvanzada.literal.nColegiado"
      },
      {
        field: "Estado",
        header: "censo.fichaIntegrantes.literal.estado"
      },
      {
        field: "Residente",
        header: "censo.ws.literal.residente"
      },
      {
        field: "fNacimiento",
        header: "censo.consultaDatosColegiacion.literal.fechaNac"
      },
      {
        field: "correoElectronico",
        header: "censo.datosDireccion.literal.correo"
      },
      {
        field: "telFijo",
        header: "censo.datosDireccion.literal.telefonoFijo"
      },
      {
        field: "telMovil",
        header: "censo.datosDireccion.literal.telefonoMovil"
      }
    ];

    this.colsCertificados = [
      {
        field: "numCertificado",
        header: "menu.certificados"
      },
      {
        field: "descripcion",
        header: "general.description"
      }
    ];

    this.colsSociedades = [
      {
        field: "tipo",
        header: "censo.busquedaClientesAvanzada.literal.tipoCliente"
      },
      { field: "nif", header: "administracion.usuarios.literal.NIF" },
      {
        field: "denominacion",
        header: "censo.consultaDatosGenerales.literal.denominacion"
      },
      {
        field: "fechaConstitucion",
        header: "censo.general.literal.FechaConstitucion"
      },
      {
        field: "abreviatura",
        header: "gratuita.definirTurnosIndex.literal.abreviatura"
      },
      {
        field: "numeroIntegrantes",
        header: "censo.general.literal.numeroIntegrantes"
      }
    ];

    this.colsCurriculares = [
      {
        field: "fechaInicio",
        header: "facturacion.seriesFacturacion.literal.fInicio"
      },
      {
        field: "fechaFin",
        header: "censo.consultaDatos.literal.fechaFin"
      },
      {
        field: "categoriaCurricular",
        header: "censo.busquedaClientesAvanzada.literal.categoriaCV"
      },
      {
        field: "subtipoCurricular",
        header: "censo.busquedaClientesAvanzada.literal.subtiposCV"
      },
      {
        field: "descripcion",
        header: "general.description"
      }
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

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.activacionEditar == true) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
  }
  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
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

  // PENDIENTE AÑADIR IDPROCESO PROPIO DE FICHA COLEGIAL
  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "120";
    let derechoAcceso;
    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisosTree = JSON.parse(data.body);
        let permisosArray = permisosTree.permisoItems;
        derechoAcceso = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        if (derechoAcceso >= 2) {
          this.activacionEditar = true;
          if (derechoAcceso == 2) {
            this.camposDesactivados = true;
          }
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
        this.continueOnInit();
      }
    );
  }

  continueOnInit() {}
  // abrirFichaDatosMandatos() {
  //   this.openFichaDatosMandatos = !this.openFichaDatosMandatos;
  // }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.numSelected = 0;
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onlySpaces(str) {
    let i = 0;
    var ret;
    ret = true;
    while (i < str.length) {
      if (str[i] != " ") {
        ret = false;
      }
      i++;
    }
    return ret;
  }

  // Métodos comunes

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "",
      detail: this.translateService.instant(mensaje)
    });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  backTo() {
    this.location.back();
  }

  uploadFile(event: any) {
    console.log("Event", event);
    // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
    let fileList: FileList = event.target.files;

    let nombreCompletoArchivo = fileList[0].name;
    let extensionArchivo = nombreCompletoArchivo.substring(
      nombreCompletoArchivo.lastIndexOf("."),
      nombreCompletoArchivo.length
    );

    if (extensionArchivo == null) {
      // Mensaje de error de formato de imagen y deshabilitar boton guardar
      this.file = undefined;

      this.showFailUploadedImage();
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
    }
  }

  showFailUploadedImage() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: "Error al adjuntar la imagen"
    });
  }

  clear() {
    this.msgs = [];
  }
}
