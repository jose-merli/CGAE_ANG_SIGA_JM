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
  camposDesactivados: boolean;
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
    if (sessionStorage.getItem("historicoSociedad") != null) {
      this.camposDesactivados = true;
      this.isCrear = true;
    }
  }

  getTiposRetenciones() {
    this.sigaServices.get("retenciones_tipoRetencion").subscribe(
      n => {
        this.tiposRetenciones = n.maestroRetencionItem;
      },
      err => {
        console.log(err);
      }
    );
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
    if (this.camposDesactivados == true) {
      this.isVolver = true;
      this.isCrear = true;
      this.isEditar = true;
      this.isEliminar = true;
    } else {
      this.isVolver = true;
      this.isCrear = false;
      this.isEditar = true;
      this.isEliminar = false;
    }
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

    let dummy = {
      idPersona: this.idPersona,
      fechaInicio: this.datepipe.transform(new Date(valur2), "dd/MM/yyyy"),
      fechaFin: undefined,
      descripcionRetencion: "",
      porcentajeRetencion: ""
    };
    this.datos = [dummy, ...this.datos];

    this.table.reset();
  }
  confirmEdit() {
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
          this.showSuccess();
        },
        err => {
          console.log(err);
          this.showFail();
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

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  borrar() {
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
        data => {},
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
    this.body.idPersona = this.idPersona;
    this.body.idInstitucion = "";
    this.body.idLenguaje = "";
    if (this.idPersona != undefined && this.idPersona != null) {
      this.sigaServices
        .postPaginado("retenciones_search", "?numPagina=1", this.body)
        .subscribe(
          data => {
            this.searchRetenciones = JSON.parse(data["body"]);
            if (this.searchRetenciones.retencionesItemList != null) {
              this.datos = this.searchRetenciones.retencionesItemList;
            } else {
              this.datos = [];
            }
          },
          err => {
            console.log(err);
          },
          () => {
            if (this.datos.length > 0) {
              if (this.camposDesactivados != true) {
                this.isEliminar = false;
              }
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
  onChangeDrop(event) {
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
          this.table.reset();
        }
      }
    });
  }

  isBuscar() {
    this.buscar = true;
  }

  irFichaColegial(id) {}

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
    if (sessionStorage.getItem("crearnuevo") == null) {
      this.openFicha = !this.openFicha;
    }
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
  clear() {
    this.msgs = [];
  }
}
