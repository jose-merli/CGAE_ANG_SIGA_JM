import { Component, Input, OnInit } from "@angular/core";
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
export class DatosAbogadoContrarioComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = true;
  @Input() showTarjeta: boolean = false;
  @Input() body: JusticiableItem;
  @Input() origen: string = "";

  progressSpinner: boolean = false;

  msgs = [];
  abogado: ColegiadoItem = new ColegiadoItem();

  constructor(private router: Router, private sigaServices: SigaServices, private translateService: TranslateService) {}

  ngOnInit() {
    this.progressSpinner = true;
    this.iniciarAbogado();
  }

  clear() {
    this.msgs = [];
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  search() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("origin", "Abogado" + this.origen);
      this.router.navigate(["/busquedaGeneral"]);
    }
  }

  disassociate() {
    if (!sessionStorage.getItem("EJGItem")) {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.idTurno, designa.numero, "", ""];
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
      let request = [sessionStorage.getItem("personaDesigna"), ejg.annio, ejg.numero, ejg.tipoEJG, "", ""];
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
    } else if (sessionStorage.getItem("idabogadoFicha")) {
      let idabogado = sessionStorage.getItem("idabogadoFicha");
      this.sigaServices.post("designaciones_searchAbogadoByIdPersona", idabogado).subscribe(
        (n) => {
          let data = JSON.parse(n.body).colegiadoItem;
          this.abogado.nombreColegio = data.colegioResultado;
          this.abogado.numColegiado = data.numColegiado;
          this.abogado.estadoColegial = data.estadoColegial;
          this.abogado.nombre = data.nombre;
          this.abogado.nif = data.nif;
          this.abogado.idPersona = data.idPersona;

          this.progressSpinner = false;
        },
        (err) => {
          this.progressSpinner = false;
        },
      );
    }
  }

  private associate() {
    let data = JSON.parse(sessionStorage.getItem("abogado"))[0];
    sessionStorage.removeItem("abogado");

    if (!sessionStorage.getItem("EJGItem")) {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.idTurno, designa.numero, data.idPersona, data.nombre];
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
      let request = [sessionStorage.getItem("personaDesigna"), ejg.annio, ejg.numero, ejg.tipoEJG, data.idPersona, data.nombre];
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
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }
}
