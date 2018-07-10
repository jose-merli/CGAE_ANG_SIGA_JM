import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { esCalendar } from "../../../../utils/calendar";
import { SigaServices } from "./../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { ConfirmationService } from "primeng/api";
import { DatePipe } from "@angular/common";
/*** COMPONENTES ***/
import { DatosRetencionesObject } from "../../../../../app/models/DatosRetencionesObject";
import { DatosRetencionesItem } from "../../../../../app/models/DatosRetencionesItem";

import { cardService } from "./../../../../_services/cardSearch.service";
import { Subscription } from "rxjs/Subscription";

export enum KEY_CODE {
  ENTER = 13
}
@Component({
  selector: "app-datos-retenciones",
  templateUrl: "./datos-retenciones.component.html",
  styleUrls: ["./datos-retenciones.component.scss"]
})
export class DatosRetencionesComponent implements OnInit {
  formBusqueda: FormGroup;
  cols: any = [];
  colsFisicas: any = [];
  colsJuridicas: any = [];
  tiposRetenciones: any[];
  colegios_seleccionados: any[];
  datos: any[];
  select: any[];

  es: any = esCalendar;
  selectedValue: string = "simple";
  textSelected: String = "{0} perfiles seleccionados";
  persona: String;
  // selectedDatos: any = []
  body: DatosRetencionesItem = new DatosRetencionesItem();
  retencionNow: DatosRetencionesItem = new DatosRetencionesItem();
  newRetencion: DatosRetencionesItem = new DatosRetencionesItem();

  searchRetenciones: DatosRetencionesObject = new DatosRetencionesObject();
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  isVolver: boolean = true;
  isCrear: boolean = false;
  isEditar: boolean = true;
  isEliminar: boolean = true;
  rowsPerPage: any = [];
  selectMultiple: boolean = false;
  progressSpinner: boolean = false;
  textFilter: String = "Elegir";
  buscar: boolean = false;
  selectAll: boolean = false;
  msgs: any[];
  usuarioBody: any[];
  selectedItem: number = 10;
  idPersona: String;

  @ViewChild("table") table;
  selectedDatos;
  tipoCIF: String;
  openFicha: boolean = false;
  masFiltros: boolean = false;
  labelFiltros: string;

  suscripcionBusquedaNuevo: Subscription;
  activacionEditar: boolean;
  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    public datepipe: DatePipe,
    private cardService: cardService
  ) {
    this.formBusqueda = this.formBuilder.group({
      cif: null,
      fechaNacimiento: new FormControl(null, Validators.required),
      fechaIncorporacion: new FormControl(null),
      fechaFacturacion: new FormControl(null)
    });
  }

  ngOnInit() {
    // this.checkAcceso();
    this.persona = "f";
    this.suscripcionBusquedaNuevo = this.cardService.searchNewAnnounce$.subscribe(
      id => {
        if (id !== null) {
          this.idPersona = id;
          this.search();
        }
      }
    );
    this.colsFisicas = [
      {
        field: "fechaInicio",
        header: "administracion.auditoriaUsuarios.fechaDesde"
      },
      {
        field: "fechaFin",
        header: "administracion.auditoriaUsuarios.fechaHasta"
      },
      {
        field: "descripcionRetencion",
        header: "factSJCS.datosPagos.literal.tipoRetencion"
      },
      {
        field: "porcentajeRetencion",
        header: "factSJCS.datosPagos.literal.porcentajeRetencion"
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
    this.getTiposRetenciones();

    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    if (this.usuarioBody[0] != undefined)
      this.idPersona = this.usuarioBody[0].idPersona;
    this.checkStatusInit();
    this.search();
  }

  // checkAcceso() {
  //   let controlAcceso = new ControlAccesoDto();
  //   controlAcceso.idProceso = "";
  //   let derechoAcceso;
  //   this.sigaServices.post("acces_control", controlAcceso).subscribe(
  //     data => {
  //       let permisosTree = JSON.parse(data.body);
  //       let permisosArray = permisosTree.permisoItems;
  //       derechoAcceso = permisosArray[0].derechoacceso;
  //     },
  //     err => {
  //       console.log(err);
  //     },
  //     () => {
  //       if (derechoAcceso == 3) {
  //         this.activacionEditar = true;
  //       } else {
  //         this.activacionEditar = false;
  //       }
  //     }
  //   );
  // }

  getTiposRetenciones() {
    this.sigaServices.get("retenciones_tipoRetencion").subscribe(
      n => {
        this.tiposRetenciones = n.maestroRetencionItem;
        console.log(n.maestroRetencionItem);
      },
      err => {
        console.log(err);
      }
    );
  }
  onChangeForm() {
    console.log("AQUI LLEGA");
  }
  isValidDNI(dni: String): boolean {
    return (
      dni &&
      typeof dni === "string" &&
      /^[0-9]{8}([A-Za-z]{1})$/.test(dni) &&
      dni.substr(8, 9).toUpperCase() ===
        this.DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23)
    );
  }
  isValidIBAN(iban: String): boolean {
    return (
      iban &&
      typeof iban === "string" &&
      /ES\d{2}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}|ES\d{22}/.test(iban)
    );
  }
  checkTypeCIF(value: String): boolean {
    if (this.isValidDNI(value)) {
      this.tipoCIF = "10";
      return true;
    } else if (this.isValidNIE(value)) {
      this.tipoCIF = "40";
      return true;
    } else if (this.isValidPassport(value)) {
      this.tipoCIF = "30";
      return true;
    } else {
      this.tipoCIF = "50";
      return false;
    }
  }
  isValidPassport(dni: String): boolean {
    return (
      dni && typeof dni === "string" && /^[a-z]{3}[0-9]{6}[a-z]?$/i.test(dni)
    );
  }
  isValidNIE(nie: String): boolean {
    return (
      nie &&
      typeof nie === "string" &&
      /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(nie)
    );
  }
  isValidCIF(cif: String): boolean {
    return (
      cif &&
      typeof cif === "string" &&
      /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/.test(cif)
    );
  }

  checkStatusInit() {
    this.cols = this.colsFisicas;
  }
  volver() {
    this.search();
    this.isVolver = true;
    this.isCrear = false;
    this.isEditar = true;
    this.isEliminar = false;
  }
  crear() {
    this.isVolver = false;
    this.isCrear = true;
    this.isEliminar = true;
    let valur2 = new Date().setMilliseconds(new Date().getMilliseconds());
    if (
      this.datos == null ||
      this.datos == undefined ||
      this.datos.length == 0
    ) {
      this.datos = [];
    } else {
      let value = this.table.first;
      // this.createArrayEdit(dummy, value);
      this.datos.forEach((value: any, key: number) => {
        if (value.fechaFin == null || value.fechaFin == undefined) {
          if (
            this.datos[key].fechaInicio ==
            this.datepipe.transform(new Date(valur2), "dd/MM/yyyy")
          ) {
            this.datos[key].fechaFin = this.datepipe.transform(
              new Date(valur2),
              "dd/MM/yyyy"
            );
          } else {
            this.datos[key].fechaFin = this.datepipe.transform(
              new Date(valur2 - 86400000),
              "dd/MM/yyyy"
            );
          }
        }
      });
    }

    // let dummy = new DatosRetencionesItem();
    // dummy.fechaInicio = this.datepipe.transform(new Date(valur2), "dd-MM-yyyy");
    // dummy.fechaFin = undefined;
    // dummy.descripcionRetencion = "";
    // dummy.porcentajeRetencion = "";
    let dummy = {
      idPersona: this.idPersona,
      fechaInicio: this.datepipe.transform(new Date(valur2), "dd/MM/yyyy"),
      fechaFin: undefined,
      descripcionRetencion: "",
      porcentajeRetencion: ""
    };
    this.datos = [dummy, ...this.datos];

    console.log(this.datos);
    this.table.reset();
  }
  confirmEdit() {
    this.progressSpinner = true;
    this.body.idPersona = this.idPersona;
    this.body.idInstitucion = "";
    this.body.idLenguaje = "";
    this.datos[0].fechaFin = "";

    this.sigaServices
      .postPaginado(
        "retenciones_update",
        "?idPersona=" + this.idPersona,
        this.datos
      )
      .subscribe(
        data => {
          console.log(data);
          // this.searchRetenciones = JSON.parse(data["body"]);
          // this.datos = this.searchRetenciones.retencionesItemList;
          this.progressSpinner = false;
          // console.log("DATOS: " + this.datos.toString);
          // this.searchCatalogo = JSON.parse(data["body"]);
          // this.datosEdit = this.searchCatalogo.catalogoMaestroItem;
          // this.datosHist = this.searchCatalogo.catalogoMaestroItem;
        },
        err => {
          console.log(err);
        },
        () => {
          this.volver();

          //Al haber añadido uno nuevo, actualizamos la cabecera de la tarjeta con la nueva retención activa (lo que se verá con la tarjeta colapsada)
          if (this.datos.length > 0) {
            this.datos.forEach((value: any, key: number) => {
              //Si la fecha fin no viene informada, es la que está activa, es la que mostramos con la tarjeta colapsada
              if (value.fechaFin == undefined) {
                this.retencionNow = this.datos[key];
              }
            });
          }
        }
      );
  }

  borrar() {
    this.progressSpinner = true;
    this.body.idPersona = this.idPersona;
    this.body.idInstitucion = "";
    this.body.idLenguaje = "";
    let datosDelete = [];

    this.datos.forEach((value: DatosRetencionesItem, key: number) => {
      if (key != 0) {
        if (key == 1) {
          value.fechaFin = undefined;
        }
        datosDelete.push(value);
      }
    });

    this.sigaServices
      .postPaginado(
        "retenciones_update",
        "?idPersona=" + this.idPersona,
        datosDelete
      )
      .subscribe(
        data => {
          console.log(data);
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
        },
        () => {
          this.volver();
        }
      );
  }

  confirmarBorrar() {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.borrar();
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.error.realiza.accion"
            )
          }
        ];
      }
    });
  }

  search() {
    this.progressSpinner = true;
    this.body.idPersona = this.idPersona;
    this.body.idInstitucion = "";
    this.body.idLenguaje = "";
    if (this.idPersona != undefined && this.idPersona != null) {
      this.sigaServices
        .postPaginado("retenciones_search", "?numPagina=1", this.body)
        .subscribe(
          data => {
            console.log(data);
            this.searchRetenciones = JSON.parse(data["body"]);
            if (this.searchRetenciones.retencionesItemList != null) {
              this.datos = this.searchRetenciones.retencionesItemList;
            } else {
              this.datos = [];
            }
            this.progressSpinner = false;
          },
          err => {
            console.log(err);
          },
          () => {
            if (this.datos.length > 0) {
              this.isEliminar = false;
              this.datos.forEach((value: any, key: number) => {
                //Si la fecha fin no viene informada, es la que está activa, es la que mostramos con la tarjeta colapsada
                if (value.fechaFin == undefined) {
                  this.retencionNow = this.datos[key];
                }
              });
            }
          }
        );
    }
  }
  // transformarFecha(fecha) {
  //   let jsonDate = JSON.stringify(fecha);
  //   let rawDate = jsonDate.slice(1, -1);
  //   if (rawDate.length < 14) {
  //     let splitDate = rawDate.split("-");
  //     let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
  //     fecha = new Date((arrayDate += "T23:59:59.001Z"));
  //   } else {
  //     fecha = new Date(fecha);
  //   }
  //   return fecha;
  // }
  onChangeDrop(event) {
    console.log(event);
    this.newRetencion.descripcionRetencion = "";
    this.tiposRetenciones.forEach((value: any, key: number) => {
      if (value.value == event.value) {
        if (value.value == "") {
          this.newRetencion.porcentajeRetencion = "-";
          this.datos[0].porcentajeRetencion = "-";
          this.isEditar = true;
        } else {
          this.newRetencion.porcentajeRetencion = value.porcentajeRetencion;
          this.newRetencion.descripcionRetencion = value.descripcionRetencion;
          this.datos[0].porcentajeRetencion = value.porcentajeRetencion;
          this.datos[0].idRetencion = value.value;
          this.isEditar = false;
          console.log(this.newRetencion);
          this.table.reset();
        }
      }
    });
  }

  isBuscar() {
    this.buscar = true;
  }

  irFichaColegial(id) {
    console.log(id);
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
    }
  }

  verMasFiltros() {
    this.masFiltros = !this.masFiltros;
  }

  abrirFicha() {
    // if (this.activacionEditar == true) {
    this.openFicha = !this.openFicha;
    // }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
    } else {
      this.selectedDatos = [];
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }
}
