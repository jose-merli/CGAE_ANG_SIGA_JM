import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { EJGItem } from "../../../../../models/sjcs/EJGItem";
import { JusticiableItem } from "../../../../../models/sjcs/JusticiableItem";
import { ProcuradorItem } from "../../../../../models/sjcs/ProcuradorItem";

@Component({
  selector: "app-datos-procurador-contrario",
  templateUrl: "./datos-procurador-contrario.component.html",
  styleUrls: ["./datos-procurador-contrario.component.scss"],
})
export class DatosProcuradorContrarioComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = true;
  @Input() showTarjeta: boolean = false;
  @Input() body: JusticiableItem;
  @Input() origen: string = "";

  progressSpinner: boolean = false;

  msgs = [];
  procurador: ProcuradorItem = new ProcuradorItem();

  constructor(private router: Router, private sigaServices: SigaServices, private translateService: TranslateService) {}

  ngOnInit() {
    if (sessionStorage.getItem("datosProcurador")) {
      this.associate();
    } else {
      if (sessionStorage.getItem("contrarioEJG")) {
        /* Procede de ficha pre-designacion */
        let data = JSON.parse(sessionStorage.getItem("contrarioEJG"));
        if (data.idprocurador != null) {
          this.procurador.nColegiado = data.procurador.split(",")[0];
          this.procurador.nombre = data.procurador.split(",")[1].concat(",", data.procurador.split(",")[2]);
          this.procurador.idProcurador = data.idprocurador;
          this.procurador.idInstitucion = data.idInstitucionProc;
        }
        //this.contrarioEJG.emit(true);
      } else if (sessionStorage.getItem("contrarioDesigna")) {
        //Procede de gicha designacion
        let data = JSON.parse(sessionStorage.getItem("contrarioDesigna"));
        if (data.idprocurador != null) {
          this.procurador.nColegiado = data.procurador.split(",")[0];
          this.procurador.nombre = data.procurador.split(",")[1].concat(",", data.procurador.split(",")[2]);
          this.procurador.idProcurador = data.idprocurador;
          this.procurador.idInstitucion = data.idInstitucionProc;
        }
        //this.contrario.emit(true);
      }
    }

    this.progressSpinner = false;
  }

  search() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("nuevoProcurador", "true");
      sessionStorage.setItem("origin", this.origen);
      this.router.navigate(["/busquedaGeneral"]);
    }
  }

  disassociate() {
    if (!sessionStorage.getItem("EJGItem")) {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request: string[] = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.numero, designa.idTurno, null, null];
      this.sigaServices.post("designaciones_updateProcuradorContrario", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.procurador = new ProcuradorItem();
        },
        (err) => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.error"), this.translateService.instant("general.message.error.realiza.accion"));
        },
      );
    } else {
      let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
      let request: string[] = [ejg.idInstitucion, sessionStorage.getItem("personaDesigna"), ejg.annio, ejg.numero, ejg.tipoEJG, null, null];
      this.sigaServices.post("gestionejg_updateProcuradorContrarioEJG", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.procurador = new ProcuradorItem();
        },
        (err) => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.error"), this.translateService.instant("general.message.error.realiza.accion"));
        },
      );
    }
  }

  clear() {
    this.msgs = [];
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  private associate() {
    let data = JSON.parse(sessionStorage.getItem("datosProcurador"))[0];
    sessionStorage.removeItem("datosProcurador");

    if (!sessionStorage.getItem("EJGItem")) {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request: string[] = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.numero, designa.idTurno, data.idProcurador, data.idInstitucion];
      this.sigaServices.post("designaciones_updateProcuradorContrario", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.procurador = new ProcuradorItem();
          this.procurador.idProcurador = data.idProcurador;
          this.procurador.nColegiado = data.nColegiado;
          this.procurador.nombre = data.nombreApe;
          this.procurador.idInstitucion = data.idInstitucion;

          //let procurador: string = this.generalBody.nColegiado + "," + this.generalBody.nombreApe;
          //sessionStorage.setItem("procuradorFicha", procurador);
        },
        (err) => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.error"), this.translateService.instant("general.message.error.realiza.accion"));
        },
      );
    } else {
      let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
      let request: string[] = [ejg.idInstitucion, sessionStorage.getItem("personaDesigna"), ejg.annio, ejg.numero, ejg.tipoEJG, data.idProcurador, data.idInstitucion];
      this.sigaServices.post("gestionejg_updateProcuradorContrarioEJG", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.procurador = new ProcuradorItem();
          this.procurador.idProcurador = data.idProcurador;
          this.procurador.nColegiado = data.nColegiado;
          this.procurador.nombre = data.nombreApe;
          this.procurador.idInstitucion = data.idInstitucion;

          //let procurador: string = this.generalBody.nColegiado + "," + this.generalBody.nombreApe;
          //sessionStorage.setItem("procuradorFicha", procurador);
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
