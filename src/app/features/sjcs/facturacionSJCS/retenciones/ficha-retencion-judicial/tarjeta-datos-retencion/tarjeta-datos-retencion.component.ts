import { CurrencyPipe, DatePipe } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { SelectItem } from "primeng/primeng";
import { CommonsService } from "../../../../../../_services/commons.service";
import { SigaServices } from "../../../../../../_services/siga.service";
import { TranslateService } from "../../../../../../commons/translate/translation.service";
import { FcsRetencionesJudicialesItem } from "../../../../../../models/sjcs/FcsRetencionesJudicialesItem";
import { RetencionItem } from "../../../../../../models/sjcs/RetencionItem";
import { RetencionObject } from "../../../../../../models/sjcs/RetencionObject";
import { RetencionesRequestDto } from "../../../../../../models/sjcs/RetencionesRequestDTO";
import { procesos_facturacionSJCS } from "../../../../../../permisos/procesos_facturacionSJCS";
import { SigaStorageService } from "../../../../../../siga-storage.service";
import { RetencionesService } from "../../retenciones.service";
import { Enlace } from "../ficha-retencion-judicial.component";
import { Colegiado } from "../tarjeta-colegiado/tarjeta-colegiado.component";

@Component({
  selector: "app-tarjeta-datos-retencion",
  templateUrl: "./tarjeta-datos-retencion.component.html",
  styleUrls: ["./tarjeta-datos-retencion.component.scss"],
})
export class TarjetaDatosRetencionComponent implements OnInit, AfterViewInit {
  showTarjeta: boolean = false;
  comboTiposRetencion: SelectItem[] = [];
  comboDestinatarios: SelectItem[] = [];
  body: RetencionItem = new RetencionItem();
  bodyAux: RetencionItem = new RetencionItem();
  progressSpinner: boolean = false;
  expRegImporte: RegExp = /^\d{1,10}(\.\d{1,2})?$/;
  expRegPorcentaje: RegExp = /^\d{1,2}(\.\d{1,2})?$/;
  disabledImporte: boolean = true;
  disableEliminar: boolean = false;
  disablePorEstado: boolean = false;
  minDate: Date;
  permisoEscritura: boolean;

  @Input() colegiado: Colegiado;

  @Input() permisoEscrituraDatosRetencion: boolean;

  @Output() addEnlace = new EventEmitter<Enlace>();
  @Output() showMessage = new EventEmitter<any>();
  @Output() retencionEvent = new EventEmitter<RetencionItem>();

  isLetrado: boolean = false;
  nuevaRetencionSinLetrado: boolean;
  constructor(private sigaServices: SigaServices, private retencionesService: RetencionesService, private translateService: TranslateService, private commonsService: CommonsService, private datePipe: DatePipe, private router: Router, private sigaStorageService: SigaStorageService, private currencyPipe: CurrencyPipe) {}

  ngOnInit() {
    this.commonsService
      .checkAcceso(procesos_facturacionSJCS.fichaRetTarjetaDatosRetencion)
      .then((respuesta) => {
        this.permisoEscritura = respuesta;

        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
          this.router.navigate(["/errorAcceso"]);
        }

        this.getComboTiposRetencion();
        this.getComboDestinatarios();
      })
      .catch((error) => console.error(error));
    /*
    this.permisoEscritura = this.permisoEscrituraDatosRetencion;
    if (this.permisoEscrituraDatosRetencion == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
          this.router.navigate(["/errorAcceso"]);
    }
    */
    this.isLetrado = this.sigaStorageService.isLetrado;
    if (sessionStorage.getItem("nuevaRetencionSinLetrado")) {
      this.nuevaRetencionSinLetrado = true;
      sessionStorage.removeItem("nuevaRetencionSinLetrado");
    }
  }

  getDataInicial() {
    if (this.retencionesService.modoEdicion) {
      this.getRetencion(this.retencionesService.retencion.idRetencion);
    } else {
      this.showTarjeta = true;
    }
  }

  ngAfterViewInit() {
    const enlace: Enlace = {
      id: "facSJCSFichaRetDatRetJud",
      ref: document.getElementById("facSJCSFichaRetDatRetJud"),
    };

    this.addEnlace.emit(enlace);
  }

  onHideTarjeta() {
    if (this.retencionesService.modoEdicion) {
      this.showTarjeta = !this.showTarjeta;
    } else {
      this.showTarjeta = true;
    }
  }

  getRetencion(idRetencion: string) {
    const retencionesRequestDto: RetencionesRequestDto = new RetencionesRequestDto();
    retencionesRequestDto.idRetenciones = idRetencion;
    this.sigaServices.post("retenciones_buscarRetencion", retencionesRequestDto).subscribe(
      (data) => {
        const res: RetencionObject = JSON.parse(data.body);

        if (res.error && null != res.error && null != res.error.description) {
          this.showMessage.emit({
            severity: "error",
            summary: this.translateService.instant("general.message.incorrect"),
            detail: this.translateService.instant(res.error.description.toString()),
          });
        } else {
          Object.assign(this.body, res.retencion);
          Object.assign(this.bodyAux, res.retencion);
          let estadoRetencion = this.getEstadoTexto(this.body.importe, this.body.restante);

          const datosRetencionTarjetaFija = new RetencionItem();
          datosRetencionTarjetaFija.tipoRetencion = this.getTextoTipoRetencion();
          datosRetencionTarjetaFija.importe = this.getTextoImporte();
          datosRetencionTarjetaFija.fechainicio = res.retencion.fechainicio;
          datosRetencionTarjetaFija.estado = this.getEstadoTexto(res.retencion.importe, res.retencion.restante);
          datosRetencionTarjetaFija.idDestinatario = this.getTextoDestinatario();

          this.retencionEvent.emit(datosRetencionTarjetaFija);

          if (undefined != res.retencion.fechainicio && null != res.retencion.fechainicio) {
            this.body.fechainicio = new Date(res.retencion.fechainicio);
            this.bodyAux.fechainicio = new Date(res.retencion.fechainicio);
          }

          if (undefined != res.retencion.fechaFin && null != res.retencion.fechaFin) {
            this.body.fechaFin = new Date(res.retencion.fechaFin);
            this.bodyAux.fechaFin = new Date(res.retencion.fechaFin);
          }

          if (this.body.tipoRetencion && this.body.tipoRetencion.length == 1) {
            this.disabledImporte = false;
          } else {
            this.disabledImporte = true;
          }

          if (this.body.fechaFin && Date.now() >= Number(this.body.fechaFin)) {
            this.disableEliminar = true;
          }

          if (estadoRetencion == "Aplicado parcialmente" || estadoRetencion == "Aplicado totalmente") {
            this.disablePorEstado = true;
          } else {
            this.disablePorEstado = false;
          }
        }
      },
      (err) => {
        console.log(err);
      },
    );
  }

  getComboTiposRetencion() {
    this.comboTiposRetencion = [
      {
        label: this.translateService.instant("facturacionSJCS.retenciones.porcentual"),
        value: "P",
      },
      {
        label: this.translateService.instant("facturacionSJCS.retenciones.importeFijo"),
        value: "F",
      },
      {
        label: this.translateService.instant("facturacionSJCS.retenciones.tramosLEC"),
        value: "L",
      },
    ];
  }

  getComboDestinatarios() {
    this.progressSpinner = true;

    this.sigaServices.get("retenciones_comboDestinatarios").subscribe(
      (data) => {
        if (data.error != null && data.error.description != null) {
          this.showMessage.emit({
            severity: "error",
            summary: this.translateService.instant("general.message.incorrect"),
            detail: this.translateService.instant(data.error.description.toString()),
          });
        } else {
          this.comboDestinatarios = data.combooItems;
          this.commonsService.arregloTildesCombo(this.comboDestinatarios);
        }
        this.progressSpinner = false;
      },
      (err) => {
        this.progressSpinner = false;
      },
      () => {
        this.getDataInicial();
      },
    );
  }

  fillFechaNoti(event) {
    this.body.fechainicio = event;

    if (this.body.fechaFin < this.body.fechainicio) {
      this.body.fechaFin = undefined;
    }
    this.minDate = this.body.fechainicio;
  }

  fillFechaFin(event) {
    this.body.fechaFin = event;
  }

  isDisabledRestablecer() {
    if (this.isLetrado) {
      return true;
    } else if (this.permisoEscritura) {
      return false;
    } else {
      return true;
    }
  }

  restablecer() {
    if (this.permisoEscritura) {
      this.progressSpinner = true;
      Object.assign(this.body, this.bodyAux);
      this.progressSpinner = false;
    }
  }

  compruebaCamposObligatorios() {
    if (this.body.tipoRetencion && this.body.tipoRetencion.trim().length == 1 && this.body.importe && this.body.importe != null && this.body.importe.toString().length > 0 && this.body.fechainicio && this.body.fechainicio != null && this.body.idDestinatario && this.body.idDestinatario.toString().trim().length > 0 && this.colegiado && this.colegiado != null) {
      return true;
    } else if (this.nuevaRetencionSinLetrado && this.body.tipoRetencion && this.body.tipoRetencion.trim().length == 1 && this.body.importe && this.body.importe != null && this.body.importe.toString().length > 0 && this.body.fechainicio && this.body.fechainicio != null && this.body.idDestinatario && this.body.idDestinatario.toString().trim().length > 0) {
      return true;
    }

    this.showMessage.emit({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant("general.message.camposObligatorios"),
    });
    return false;
  }

  parseToObjectRest(event: RetencionItem) {
    let item: FcsRetencionesJudicialesItem = new FcsRetencionesJudicialesItem();
    item.idretencion = event.idRetencion;
    item.idpersona = event.idPersona;
    item.iddestinatario = event.idDestinatario;
    item.fechaalta = event.fechaAlta;
    item.fechainicio = event.fechainicio;
    item.fechafin = event.fechaFin;
    item.tiporetencion = event.tipoRetencion;
    item.importe = parseFloat(event.importe);
    item.observaciones = event.observaciones;
    item.descdestinatario = event.descDestinatario;

    return item;
  }

  guardar() {
    if (this.permisoEscritura && this.compruebaCamposObligatorios()) {
      if (this.colegiado?.idPersona) {
        this.body.idPersona = this.colegiado.idPersona;
      }

      this.progressSpinner = true;
      let objectoRest: FcsRetencionesJudicialesItem = this.parseToObjectRest(this.body);

      this.sigaServices.post("retenciones_saveOrUpdateRetencion", objectoRest).subscribe((data) => {
        const res = JSON.parse(data.body);

        if (res.status == "KO" && res.error != null && res.error.description != null) {
          this.showMessage.emit({
            severity: "error",
            summary: this.translateService.instant("general.message.incorrect"),
            detail: this.translateService.instant(res.error.description.toString()),
          });
        } else {
          if (this.retencionesService.modoEdicion) {
            this.getRetencion(this.body.idRetencion);
          } else {
            this.getRetencion(res.id);
            this.retencionesService.modoEdicion = true;
          }
          this.showMessage.emit({
            severity: "success",
            summary: this.translateService.instant("general.message.correct"),
            detail: this.translateService.instant("general.message.accion.realizada"),
          });
        }

        Object.assign(this.bodyAux, this.body);
        this.progressSpinner = false;
      });
    }
  }
  marcarObligatorio(tipoCampo: string, valor) {
    let resp = false;

    if (tipoCampo == "inputNumber" && (valor == undefined || valor == null || valor.toString().length == 0)) {
      resp = true;
    }

    if (tipoCampo == "input" && (valor == undefined || valor == null || valor.trim().length == 0)) {
      resp = true;
    }

    if (tipoCampo == "select" && (valor == undefined || valor == null)) {
      resp = true;
    }

    if (tipoCampo == "datePicker" && (valor == undefined || valor == null || valor == "")) {
      resp = true;
    }

    return resp;
  }

  onChangeTipoDeReten() {
    this.body.importe = "";
    if (this.body.tipoRetencion && this.body.tipoRetencion.length == 1) {
      this.disabledImporte = false;
    } else {
      this.disabledImporte = true;
    }
  }

  compruebaImporte(valid: boolean) {
    if (!valid) {
      this.body.importe = "";
    }
  }

  getTextoTipoRetencion() {
    let cadena = "";

    if (this.body.tipoRetencion && this.body.tipoRetencion.toString().length == 1) {
      cadena = this.comboTiposRetencion.find((el) => el.value == this.body.tipoRetencion).label;
    }

    return cadena;
  }

  getTextoImporte() {
    let cadena = "";

    if (this.body.importe && this.body.importe != null && this.body.importe.toString().length > 0) {
      if (this.body.tipoRetencion == "F" || this.body.tipoRetencion == "L") {
        cadena = this.currencyPipe.transform(this.body.importe, "EUR");
      } else if (this.body.tipoRetencion == "P") {
        cadena = this.body.importe + "%";
      }
    }
    return cadena;
  }

  getTextoFechaDeNoti() {
    let cadena = "";

    if (this.body.fechainicio && this.body.fechainicio != null) {
      cadena = this.datePipe.transform(this.body.fechainicio, "dd/MM/yyyy");
    }

    return cadena;
  }

  getTextoFechaFin() {
    let cadena = "";

    if (this.body.fechaFin && this.body.fechaFin != null) {
      cadena = this.datePipe.transform(this.body.fechaFin, "dd/MM/yyyy");
    }

    return cadena;
  }

  getTextoDestinatario() {
    let cadena = "";
    if (this.comboDestinatarios && this.comboDestinatarios.length > 0 && this.body.idDestinatario && this.body.idDestinatario != null && this.body.idDestinatario.toString().length > 0) {
      cadena = this.comboDestinatarios.find((el) => el.value == this.body.idDestinatario).label;
    }
    return cadena;
  }

  getEstadoTexto(importe, restante) {
    let estado = "";

    if (restante == importe) {
      estado = "Sin aplicar";
    } else if (restante > importe) {
      estado = "Aplicado parcialmente";
    } else if (restante == "0") {
      estado = "Aplicado totalmente";
    }

    return estado;
  }
}
