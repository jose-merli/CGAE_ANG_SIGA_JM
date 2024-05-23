import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { EnviosMasivosItem } from "../../../../../models/EnviosMasivosItem";
import { EJGItem } from "../../../../../models/sjcs/EJGItem";

@Component({
  selector: "app-comunicaciones-ejg",
  templateUrl: "./comunicaciones-ejg.component.html",
  styleUrls: ["./comunicaciones-ejg.component.scss"],
})
export class ComunicacionesEJGComponent implements OnInit {
  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = false;
  @Input() openTarjetaComunicaciones;

  progressSpinner: boolean = false;

  msgs;
  cols;
  buscadores = [];
  rowsPerPage: any = [];
  selectedItem: number = 10;
  comunicaciones: EnviosMasivosItem[] = [];
  numComunicaciones: Number = 0;

  constructor(private router: Router, private sigaServices: SigaServices, private translateService: TranslateService) {}

  ngOnInit() {
    this.progressSpinner = true;
    this.getCols();
    this.getComunicaciones();
  }

  abreCierraFicha() {
    this.openTarjetaComunicaciones = !this.openTarjetaComunicaciones;
  }

  clear() {
    this.msgs = [];
  }

  private getCols() {
    this.cols = [
      { field: "claseComunicacion", header: "informesycomunicaciones.comunicaciones.busqueda.claseComunicacion" },
      { field: "destinatario", header: "informesycomunicaciones.comunicaciones.busqueda.destinatario" },
      { field: "fechaCreacion", header: "informesycomunicaciones.enviosMasivos.fechaCreacion" },
      { field: "fechaProgramada", header: "informesycomunicaciones.comunicaciones.busqueda.fechaProgramada" },
      { field: "tipoEnvio", header: "informesycomunicaciones.comunicaciones.busqueda.tipoEnvio" },
      { field: "estadoEnvio", header: "censo.nuevaSolicitud.estado" },
    ];

    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 },
    ];
  }

  navigateTo(dato) {
    if (dato.idEstado != 5) {
      sessionStorage.setItem("comunicacionesSearch", JSON.stringify(dato));
      this.router.navigate(["/fichaRegistroComunicacion"]);
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("informesycomunicaciones.comunicaciones.envioProcess"));
    }
  }

  private getComunicaciones() {
    this.sigaServices.post("gestionejg_getComunicaciones", this.datos).subscribe(
      (n) => {
        this.comunicaciones = JSON.parse(n.body).enviosMasivosItem;
        this.numComunicaciones = this.comunicaciones.length;
        this.progressSpinner = false;
      },
      (err) => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      },
    );
  }

  private showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }
}
