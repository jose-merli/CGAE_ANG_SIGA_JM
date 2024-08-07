import { DatePipe, Location } from "@angular/common";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CommonsService } from "../../../../../_services/commons.service";
import { TranslateService } from "../../../../../commons/translate";
import { RetencionItem } from "../../../../../models/sjcs/RetencionItem";
import { procesos_facturacionSJCS } from "../../../../../permisos/procesos_facturacionSJCS";
import { SigaStorageService } from "../../../../../siga-storage.service";
import { RetencionesService } from "../retenciones.service";
import { TarjetaAplicacionEnPagosComponent } from "./tarjeta-aplicacion-en-pagos/tarjeta-aplicacion-en-pagos.component";
import { Colegiado, TarjetaColegiadoComponent } from "./tarjeta-colegiado/tarjeta-colegiado.component";
import { TarjetaDatosRetencionComponent } from "./tarjeta-datos-retencion/tarjeta-datos-retencion.component";

export interface Enlace {
  id: string;
  ref: any;
}

@Component({
  selector: "app-ficha-retencion-judicial",
  templateUrl: "./ficha-retencion-judicial.component.html",
  styleUrls: ["./ficha-retencion-judicial.component.scss"],
})
export class FichaRetencionJudicialComponent implements OnInit, AfterViewInit {
  tarjetaFija = {
    nombre: "facturacionSJCS.facturacionesYPagos.inforesumen",
    icono: "fas fa-clipboard",
    imagen: "",
    detalle: false,
    fixed: true,
    campos: [
      {
        key: this.translateService.instant("facturacionSJCS.retenciones.nColegiado"),
        value: "",
      },
      {
        key: this.translateService.instant("facturacionSJCS.retenciones.nombreCol"),
        value: "",
      },
      {
        key: this.translateService.instant("facturacionSJCS.retenciones.tipo"),
        value: "",
      },
      {
        key: this.translateService.instant("facturacionSJCS.retenciones.importe"),
        value: "",
      },
      {
        key: this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado"),
        value: "",
      },
      {
        key: this.translateService.instant("facturacionSJCS.retenciones.fechaNoti"),
        value: "",
      },
      {
        key: this.translateService.instant("facturacionSJCS.retenciones.destinatario"),
        value: "",
      },
    ],
    enlaces: [
      { id: "facSJCSFichaRetCol", nombre: this.translateService.instant("facturacionSJCS.retenciones.ficha.colegiado"), ref: null },
      { id: "facSJCSFichaRetDatRetJud", nombre: this.translateService.instant("facturacionSJCS.retenciones.ficha.datRetJud"), ref: null },
      { id: "facSJCSFichaRetAplEnPag", nombre: this.translateService.instant("facturacionSJCS.retenciones.opcion.aplicacion"), ref: null },
    ],
  };
  isLetrado: boolean = false;
  msgs;
  retencionSinLetrado: boolean = false;
  colegiado: Colegiado;
  permisoEscrituraDatosRetencion: boolean;
  desactivarBotonesColegiado: boolean = false;
  @ViewChild(TarjetaColegiadoComponent) tarjetaColegiado: TarjetaColegiadoComponent;
  @ViewChild(TarjetaDatosRetencionComponent) tarjetaDatosRetJud: TarjetaDatosRetencionComponent;
  @ViewChild(TarjetaAplicacionEnPagosComponent) tarjetaAplEnPag: TarjetaAplicacionEnPagosComponent;
  retencionDesdeTabla: boolean = false;

  constructor(private translateService: TranslateService, private location: Location, private sigaStorageService: SigaStorageService, private retencionesService: RetencionesService, private datePipe: DatePipe, private commonsService: CommonsService, private router: Router) {}

  ngOnInit() {
    if (sessionStorage.getItem("retencionSinLetrado")) {
      this.retencionSinLetrado = true;
      sessionStorage.removeItem("retencionSinLetrado");
    }
    if (sessionStorage.getItem("retencionDesdeTabla")) {
      this.retencionDesdeTabla = true;
      sessionStorage.removeItem("retencionDesdeTabla");
    }
    this.commonsService
      .checkAcceso(procesos_facturacionSJCS.busquedaRetenciones)
      .then((respuesta) => {
        const permisoEscritura = respuesta;
        this.permisoEscrituraDatosRetencion = permisoEscritura;

        if (permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
          this.router.navigate(["/errorAcceso"]);
        }

        this.isLetrado = this.sigaStorageService.isLetrado;
      })
      .catch((error) => console.error(error));
  }

  isOpenReceive(event) {
    if (this.retencionesService.modoEdicion) {
      switch (event) {
        case "facSJCSFichaRetCol":
          this.tarjetaColegiado.showTarjeta = true;
          break;
        case "facSJCSFichaRetDatRetJud":
          this.tarjetaDatosRetJud.showTarjeta = true;
          break;
        case "facSJCSFichaRetAplEnPag":
          this.tarjetaAplEnPag.showTarjeta = true;
          break;
      }
    }
  }

  ngAfterViewInit() {
    this.goTop();
  }

  goTop() {
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  volver() {
    this.location.back();
  }

  addEnlace(enlace: Enlace) {
    this.tarjetaFija.enlaces.find((el) => el.id == enlace.id).ref = enlace.ref;
  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.detail,
    });
  }

  clear() {
    this.msgs = [];
  }

  setColegiado(event: Colegiado) {
    this.colegiado = event;
    this.tarjetaFija.campos[0].value = event.numColeiado;
    this.tarjetaFija.campos[1].value = `${event.apellidos2} ${event.apellidos1}, ${event.nombre}`;
  }

  setRetencion(event: RetencionItem) {
    this.tarjetaFija.campos[2].value = event.tipoRetencion;
    this.tarjetaFija.campos[3].value = event.importe;
    this.tarjetaFija.campos[4].value = event.estado;
    this.tarjetaFija.campos[5].value = this.datePipe.transform(event.fechainicio, "dd/MM/yyyy");
    this.tarjetaFija.campos[6].value = event.idDestinatario;
    this.activarDesactivarBtn(event.estado);
  }

  activarDesactivarBtn(estado: string) {
    if (estado == "Aplicado parcialmente") {
      this.desactivarBotonesColegiado = true;
    } else if (estado == "Aplicado totalmente") {
      this.desactivarBotonesColegiado = true;
    } else if (estado == "Sin aplicar") {
      this.desactivarBotonesColegiado = false;
    }
  }
}
