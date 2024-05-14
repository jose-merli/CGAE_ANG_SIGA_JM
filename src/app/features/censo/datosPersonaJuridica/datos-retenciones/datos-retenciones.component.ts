import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService } from "primeng/api";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { esCalendar } from "../../../../utils/calendar";
import { SigaServices } from "./../../../../_services/siga.service";
/*** COMPONENTES ***/
import { EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { DataTable } from "../../../../../../node_modules/primeng/primeng";
import { DatosRetencionesItem } from "../../../../../app/models/DatosRetencionesItem";
import { DatosRetencionesObject } from "../../../../../app/models/DatosRetencionesObject";
import { ControlAccesoDto } from "../../../../models/ControlAccesoDto";
import { CardService } from "./../../../../_services/cardSearch.service";

export enum KEY_CODE {
  ENTER = 13,
}
@Component({
  selector: "app-datos-retenciones",
  templateUrl: "./datos-retenciones.component.html",
  styleUrls: ["./datos-retenciones.component.scss"],
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
  sortO: number = 1;
  sortF: string = "";
  camposDesactivados: boolean;
  es: any = esCalendar;
  selectedValue: string = "simple";
  textSelected: String = "{0} perfiles seleccionados";
  persona: String;
  // selectedDatos: any = []
  body: DatosRetencionesItem = new DatosRetencionesItem();
  bodyFecha: DatosRetencionesItem = new DatosRetencionesItem();
  retencionNow: DatosRetencionesItem = new DatosRetencionesItem();
  retencionActiveAnt: DatosRetencionesItem = new DatosRetencionesItem();
  newRetencion: DatosRetencionesItem = new DatosRetencionesItem();
  nuevafecha: any;
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
  fechaMinima: Date;
  @ViewChild("table")
  table: DataTable;
  selectedDatos;
  tipoCIF: String;
  openFicha: boolean = false;
  masFiltros: boolean = false;
  labelFiltros: string;
  progressSpinner: boolean = false;
  disabledAction: boolean = false;

  suscripcionBusquedaNuevo: Subscription;
  activacionEditar: boolean;
  ultimaFechaInicio: any;
  dateParts: any;

  tarjeta: string;
  @Input() openTarjeta;
  @Output() permisosEnlace = new EventEmitter<any>();

  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
  constructor(private formBuilder: FormBuilder, private changeDetectorRef: ChangeDetectorRef, private sigaServices: SigaServices, private confirmationService: ConfirmationService, private translateService: TranslateService, public datepipe: DatePipe, private cardService: CardService) {
    this.formBusqueda = this.formBuilder.group({
      cif: null,
      fechaNacimiento: new FormControl(null, Validators.required),
      fechaIncorporacion: new FormControl(null),
      fechaFacturacion: new FormControl(null),
    });
  }

  ngOnInit() {
    this.checkAcceso();
    this.persona = "f";
    this.suscripcionBusquedaNuevo = this.cardService.searchNewAnnounce$.subscribe((id) => {
      if (id !== null) {
        this.idPersona = id;
        this.search();
      }
    });
    this.colsFisicas = [
      {
        field: "fechaInicio",
        header: "administracion.auditoriaUsuarios.fechaDesde",
      },
      {
        field: "fechaFin",
        header: "administracion.auditoriaUsuarios.fechaHasta",
      },
      {
        field: "descripcionRetencion",
        header: "factSJCS.datosPagos.literal.tipoRetencion",
      },
      {
        field: "porcentajeRetencion",
        header: "factSJCS.datosPagos.literal.porcentajeRetencion",
      },
    ];

    this.rowsPerPage = [
      {
        label: 10,
        value: 10,
      },
      {
        label: 20,
        value: 20,
      },
      {
        label: 30,
        value: 30,
      },
      {
        label: 40,
        value: 40,
      },
    ];
    this.getTiposRetenciones();

    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    if (this.usuarioBody[0] != undefined) this.idPersona = this.usuarioBody[0].idPersona;
    this.checkStatusInit();
    this.search();
    if (sessionStorage.getItem("historicoSociedad") != null) {
      this.camposDesactivados = true;
      this.isCrear = true;
    }
    // this.nuevafecha = new Date();
    let event = { field: "fechaFin", order: 1, multisortmeta: undefined };
    this.changeSort(event);

    if (sessionStorage.getItem("disabledAction") == "true") {
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.openTarjeta == "retenciones") {
      this.openFicha = true;
    }
  }
  changeSort(event) {
    this.sortF = "fechaFin";
    this.sortO = 1;
    if (this.table != undefined) {
      this.table.sortField = this.sortF;
      //this.table.sortOrder = this.sortO;
    }

    // this.table.sortMultiple();
  }

  onChangeCalendar(event) {
    this.nuevafecha = event;
    this.isVolver = false;
    if (this.datos.length > 1) {
      this.datos.forEach((value: any, key: number) => {
        if (value.recursoRetencion == this.retencionActiveAnt.recursoRetencion && value.fechaInicio == this.retencionActiveAnt.fechaInicio) {
          this.datos[key].fechaFin = this.datepipe.transform(new Date(event - 86400000), "dd/MM/yyyy");

          // this.datos.forEach((value: any, key: number) => {
          //   if (value.fechaFin == null || value.fechaFin == undefined) {
          //     this.retencionActiveAnt = this.datos[key];
          //     this.datos[key].fechaFin = this.datepipe.transform(
          //       new Date(valur2 - 86400000),
          //       "dd/MM/yyyy"
          //     );
          //   }
          // });
        }
      });
    }

    if (this.newRetencion.descripcionRetencion != "" && this.newRetencion.descripcionRetencion != undefined) {
      this.isEditar = false;
      this.isCrear = true;
    }

    let evento = { field: "fechaFin", order: 1, multisortmeta: undefined };
    this.changeSort(evento);
  }

  activaGuardar() {
    if (this.nuevafecha > this.fechaMinima || this.fechaMinima == null || this.fechaMinima == undefined) {
      return this.isEditar;
    } else {
      return true;
    }
  }

  getTiposRetenciones() {
    this.sigaServices.get("retenciones_tipoRetencion").subscribe(
      (n) => {
        this.tiposRetenciones = n.maestroRetencionItem;
      },
      (err) => {
        //console.log(err);
      },
    );
  }

  isValidDNI(dni: String): boolean {
    return dni && typeof dni === "string" && /^[0-9]{8}([A-Za-z]{1})$/.test(dni) && dni.substr(8, 9).toUpperCase() === this.DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23);
  }
  isValidIBAN(iban: String): boolean {
    return iban && typeof iban === "string" && /ES\d{2}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}|ES\d{22}/.test(iban);
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
    return dni && typeof dni === "string" && /^[a-z]{3}[0-9]{6}[a-z]?$/i.test(dni);
  }
  isValidNIE(nie: String): boolean {
    return nie && typeof nie === "string" && /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(nie);
  }
  isValidCIF(cif: String): boolean {
    return cif && typeof cif === "string" && /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/.test(cif);
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
    this.fechaNoPermitida();
    this.isVolver = false;
    this.isCrear = true;
    this.isEliminar = true;
    // let valur2 = new Date().setMilliseconds(new Date().getMilliseconds());
    let valur2;
    if (this.fechaMinima == undefined || this.fechaMinima == null) {
      valur2 = new Date().setMilliseconds(new Date().getMilliseconds());
    } else {
      valur2 = this.fechaMinima;
    }
    if (this.datos == null || this.datos == undefined || this.datos.length == 0) {
      this.datos = [];
    } else {
      // let value = this.table.first;
      // this.createArrayEdit(dummy, value);
      this.datos.forEach((value: any, key: number) => {
        if (value.fechaFin == null || value.fechaFin == undefined) {
          this.retencionActiveAnt = this.datos[key];

          this.datos[key].fechaFin = this.datos[0].fechaInicio;

          // this.datepipe.transform(
          //   new Date(valur2 - 86400000),
          //   "dd/MM/yyyy"
          // );
        }
      });
    }

    // let dummy = {
    //   idPersona: this.idPersona,
    //   fechaInicio: this.datepipe.transform(new Date(valur2), "dd/MM/yyyy"),
    //   fechaFin: undefined,
    //   descripcionRetencion: "",
    //   porcentajeRetencion: ""
    // };

    let dummy = {
      idPersona: this.idPersona,
      fechaInicio: "",
      fechaFin: undefined,
      descripcionRetencion: "",
      porcentajeRetencion: "",
    };

    this.datos = [dummy, ...this.datos];

    // this.table.reset();
    let event = { field: "fechaFin", order: 1, multisortmeta: undefined };
    // this.changeSort(event);
  }
  confirmEdit() {
    // this.fechaNoPermitida();
    this.progressSpinner = true;
    this.newRetencion.descripcionRetencion = "";
    this.newRetencion.idRetencion = "";
    this.body.idPersona = this.idPersona;
    this.body.idInstitucion = "";
    this.body.idLenguaje = "";
    this.isCrear = false;
    this.datos.forEach((value: any, key: number) => {
      if (value.fechaFin == null || value.fechaFin == undefined) {
        this.datos[key].fechaInicio = this.datepipe.transform(new Date(this.nuevafecha), "dd/MM/yyyy");
      }
    });

    this.sigaServices.postPaginado("retenciones_update", "?idPersona=" + this.idPersona, this.datos).subscribe(
      (data) => {
        this.showSuccess();
        this.progressSpinner = false;
        let event = { field: "fechaFin", order: 1, multisortmeta: undefined };
        // this.changeSort(event);
      },
      (err) => {
        //console.log(err);
        this.progressSpinner = false;
        this.showFail();
        let event = { field: "fechaFin", order: 1, multisortmeta: undefined };
        // this.changeSort(event);
      },
      () => {
        this.volver();
        this.progressSpinner = false;
        this.isBuscar();

        //Al haber añadido uno nuevo, actualizamos la cabecera de la tarjeta con la nueva retención activa (lo que se verá con la tarjeta colapsada)
        if (this.datos.length > 0) {
          this.datos.forEach((value: any, key: number) => {
            //Si la fecha fin no viene informada, es la que está activa, es la que mostramos con la tarjeta colapsada
            if (value.fechaFin == undefined) {
              this.retencionNow = this.datos[key];
            }
          });
        }
      },
    );
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant("general.message.error.realiza.accion"),
    });
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada"),
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

    this.sigaServices.postPaginado("retenciones_update", "?idPersona=" + this.idPersona, datosDelete).subscribe(
      (data) => {},
      (err) => {
        //console.log(err);
      },
      () => {
        this.volver();
      },
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
            detail: this.translateService.instant("general.message.error.realiza.accion"),
          },
        ];
      },
    });
  }

  fechaNoPermitida() {
    this.bodyFecha.idPersona = this.idPersona;
    this.bodyFecha.idInstitucion = "";
    this.bodyFecha.idLenguaje = "";
    if (this.idPersona != undefined && this.idPersona != null) {
      this.sigaServices.postPaginado("retenciones_search", "?numPagina=1", this.bodyFecha).subscribe(
        (data) => {
          let unorderedDate;
          this.searchRetenciones = JSON.parse(data["body"]);
          if (this.searchRetenciones.retencionesItemList != null) {
            this.searchRetenciones.retencionesItemList.forEach((value: any, key: number) => {
              if (this.searchRetenciones.retencionesItemList[key].fechaFin == null || this.searchRetenciones.retencionesItemList[key].fechaFin == undefined) {
                unorderedDate = JSON.stringify(this.searchRetenciones.retencionesItemList[key].fechaInicio);
              }
            });

            let unorderedArray = unorderedDate.substring(1, unorderedDate.length - 1).split("/");
            let orderedDate = unorderedArray[1] + "-" + unorderedArray[0] + "-" + unorderedArray[2];
            this.fechaMinima = new Date(orderedDate);
            this.nuevafecha = new Date(this.fechaMinima.getTime() + 1000 * 60 * 60 * 24);
            this.nuevafecha.setHours(this.nuevafecha.getHours() + 4);
            this.fechaMinima = new Date(this.fechaMinima.getTime() + 1000 * 60 * 60 * 24);
            // this.nuevafecha = this.datepipe.transform(
            //   new Date(),
            //   "dd/MM/yyyy"
            // )
          }
          if (this.datos.length == 1) {
            this.fechaMinima = undefined;
            this.nuevafecha = new Date();
          }
        },
        (err) => {
          //console.log(err);
        },
      );
    }
  }

  search() {
    this.body.idPersona = this.idPersona;
    this.body.idInstitucion = "";
    this.body.idLenguaje = "";
    if (this.idPersona != undefined && this.idPersona != null) {
      this.sigaServices.postPaginado("retenciones_search", "?numPagina=1", this.body).subscribe(
        (data) => {
          this.searchRetenciones = JSON.parse(data["body"]);
          if (this.searchRetenciones.retencionesItemList != null) {
            this.datos = this.searchRetenciones.retencionesItemList;
            if (this.datos.length > 1) {
              this.retencionActiveAnt = this.datos[1];
            } else {
              this.retencionActiveAnt = this.datos[0];
            }
          } else {
            this.datos = [];
          }

          // this.getUltimaFechaInicio()
        },
        (err) => {
          //console.log(err);
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
        },
      );
    }
  }
  onChangeDrop(event) {
    let dat: any;
    this.newRetencion.descripcionRetencion = "";
    this.tiposRetenciones.forEach((value: any, key: number) => {
      if (value.value == event.value) {
        dat = value;
      }
    });

    this.datos.forEach((value: any, key: number) => {
      if (value.idRetencion == this.datos[0].idRetencion && event.value != "") {
        this.newRetencion.porcentajeRetencion = dat.porcentajeRetencion;
        this.newRetencion.descripcionRetencion = dat.value;
        value.porcentajeRetencion = dat.porcentajeRetencion;
        value.idRetencion = dat.value;
        value.descripcionRetencion = dat.label;
        this.isEditar = false;
        this.isCrear = true;
        this.table.reset();
      }
    });
  }

  isBuscar() {
    this.buscar = true;
  }

  irFichaColegial(id) {
    // // if (this.selectedDatos[0] == this.datos[0]) {
    // //console.log(this.selectedDatos)
    // //console.log(this.datos[0])
    // //console.log(id[0].fechaInicio);
    // if (id[0].fechaFin == null && id[0].fechaInicio != "") {
    //   this.isVolver = false;
    //   this.isCrear = true;
    //   this.nuevafecha = id[0].fechaInicio;
    //   id[0].fechaInicio = "";
    //   this.newRetencion.descripcionRetencion = id[0].idRetencion;
    //   // this.onChangeDrop(this.newRetencion.descripcionRetencion);
    //   id[0].descripcionRetencion = "";
    // } else {
    //   this.isVolver = true;
    // }
    // } else {
    //   //console.log('no')
    //   setTimeout(() => {
    //     this.selectedDatos = [];
    //     this.selectedDatos = [... this.selectedDatos];
    //   }, 100);
    // }
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
    if (sessionStorage.getItem("nuevoRegistro") == null) {
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

  // getUltimaFechaInicio() {
  //   if (this.datos.length > 0) {
  //     this.dateParts = this.datos[0].fechaInicio.split("/");
  //     let dia = parseInt(this.dateParts[0]) + 1;
  //     this.ultimaFechaInicio = new Date(this.dateParts[2], this.dateParts[1] - 1, dia);
  //   }
  // }

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "233";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      (data) => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjeta = permisosArray[0].derechoacceso;
      },
      (err) => {
        //console.log(err);
      },
      () => {
        if (this.tarjeta == "3" || this.tarjeta == "2") {
          let permisos = "retenciones";
          this.permisosEnlace.emit(permisos);
        }
      },
    );
  }
}
