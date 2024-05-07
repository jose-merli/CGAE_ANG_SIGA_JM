import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { ColegiadoItem } from "../../../../../models/ColegiadoItem";
import { EJGItem } from "../../../../../models/sjcs/EJGItem";
import { JusticiableItem } from "../../../../../models/sjcs/JusticiableItem";

@Component({
  selector: "app-datos-abogado-contrario",
  templateUrl: "./datos-abogado-contrario.component.html",
  styleUrls: ["./datos-abogado-contrario.component.scss"],
})
export class DatosAbogadoContrarioComponent implements OnInit, OnChanges {
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = true;
  @Input() showTarjeta: boolean = false;
  @Input() body: JusticiableItem;
  @Input() origen: string = "";
  @Input() contrario: any;
  @Output() notificacion = new EventEmitter<any>();

  progressSpinner: boolean = false;

  abogado: ColegiadoItem = new ColegiadoItem();

  constructor(private router: Router, private sigaServices: SigaServices, private translateService: TranslateService) {}

  ngOnInit() {
    this.progressSpinner = true;
  }

  ngOnChanges() {
    if (this.progressSpinner) {
      this.iniciarAbogado();
    }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  search() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("justiciable", JSON.stringify(this.body));
      sessionStorage.setItem("origin", "Abogado" + this.origen);
      this.router.navigate(["/busquedaGeneral"]);
    }
  }

  disassociate() {
    if (!sessionStorage.getItem("EJGItem")) {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request = [designa.idInstitucion, this.body.idpersona, designa.ano, designa.idTurno, designa.numero, "", ""];
      this.sigaServices.post("designaciones_updateAbogadoContrario", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.abogado = new ColegiadoItem();
        },
        (err) => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.error"), this.translateService.instant("general.message.error.realiza.accion"));
        },
      );
    } else {
      let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
      let request = [this.body.idpersona, ejg.annio, ejg.numero, ejg.tipoEJG, "", ""];
      this.sigaServices.post("gestionejg_updateAbogadoContrarioEJG", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.abogado = new ColegiadoItem();
        },
        (err) => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.error"), this.translateService.instant("general.message.error.realiza.accion"));
        },
      );
    }
  }

  private iniciarAbogado() {
    if (sessionStorage.getItem("abogado")) {
      this.associate();
    } else {
      if (this.contrario != undefined) {
        if (this.contrario.idabogadocontrario != undefined && this.contrario.idabogadocontrario != null) {
          this.sigaServices.post("designaciones_searchAbogadoByIdPersona", this.contrario.idabogadocontrario).subscribe(
            (n) => {
              this.progressSpinner = false;
              let data = JSON.parse(n.body).colegiadoItem;
              this.abogado.nombreColegio = data.colegioResultado;
              this.abogado.numColegiado = data.numColegiado;
              this.abogado.estadoColegial = data.estadoColegial;
              this.abogado.nombre = data.nombre;
              this.abogado.nif = data.nif;
              this.abogado.idPersona = data.idPersona;
            },
            (err) => {
              this.progressSpinner = false;
            },
          );

          this.progressSpinner = false;
        } else {
          this.progressSpinner = false;
        }
      } else {
        this.progressSpinner = false;
      }
    }
  }

  private associate() {
    let data = JSON.parse(sessionStorage.getItem("abogado"))[0];
    let nombre = data.nombre + " " + data.apellidos;
    sessionStorage.removeItem("abogado");

    if (!sessionStorage.getItem("EJGItem")) {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request = [designa.idInstitucion, this.body.idpersona, designa.ano, designa.idTurno, designa.numero, data.idPersona, nombre];
      this.sigaServices.post("designaciones_updateAbogadoContrario", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.abogado.nombreColegio = data.colegio;
          this.abogado.numColegiado = data.numeroColegiado;
          this.abogado.estadoColegial = data.situacion;
          this.abogado.nombre = data.nombre;
          this.abogado.nif = data.nif;
          this.abogado.idPersona = data.idPersona;
        },
        (err) => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.error"), this.translateService.instant("general.message.error.realiza.accion"));
        },
      );
    } else {
      let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
      let request = [this.body.idpersona, ejg.annio, ejg.numero, ejg.tipoEJG, data.idPersona, nombre];
      this.sigaServices.post("gestionejg_updateAbogadoContrarioEJG", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.abogado.nombreColegio = data.colegio;
          this.abogado.numColegiado = data.numeroColegiado;
          this.abogado.estadoColegial = data.situacion;
          this.abogado.nombre = data.nombre;
          this.abogado.nif = data.nif;
          this.abogado.idPersona = data.idPersona;
        },
        (err) => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.error"), this.translateService.instant("general.message.error.realiza.accion"));
        },
      );
    }
  }

  private showMessage(severity, summary, msg) {
    this.notificacion.emit({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }
}
