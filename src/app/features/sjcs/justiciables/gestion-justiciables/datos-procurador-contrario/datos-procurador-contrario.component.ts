import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
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
export class DatosProcuradorContrarioComponent implements OnInit, OnChanges {
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = true;
  @Input() showTarjeta: boolean = false;
  @Input() body: JusticiableItem;
  @Input() origen: string = "";
  @Input() contrario: any;
  @Output() notificacion = new EventEmitter<any>();

  progressSpinner: boolean = false;

  procurador: ProcuradorItem = new ProcuradorItem();

  constructor(private router: Router, private sigaServices: SigaServices, private translateService: TranslateService) {}

  ngOnInit() {
    this.progressSpinner = true;
  }

  ngOnChanges() {
    if (this.progressSpinner) {
      this.iniciarProcurador();
    }
  }

  search() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("justiciable", JSON.stringify(this.body));
      sessionStorage.setItem("nuevoProcurador", "true");
      sessionStorage.setItem("origin", this.origen);
      this.router.navigate(["/busquedaGeneral"]);
    }
  }

  disassociate() {
    if (!sessionStorage.getItem("EJGItem")) {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request: string[] = [designa.idInstitucion, this.body.idpersona, designa.ano, designa.numero, designa.idTurno, null, null];
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
      let request: string[] = [ejg.idInstitucion, this.body.idpersona, ejg.annio, ejg.numero, ejg.tipoEJG, null, null];
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

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  private iniciarProcurador() {
    if (sessionStorage.getItem("datosProcurador")) {
      this.procurador = JSON.parse(sessionStorage.getItem("datosProcurador"))[0];
      sessionStorage.removeItem("datosProcurador");
      this.associate();
    } else {
      if (this.contrario != undefined) {
        if (this.contrario.idprocurador != undefined && this.contrario.idprocurador != null) {
          let procuradorItem: ProcuradorItem = new ProcuradorItem();
          procuradorItem.idProcurador = this.contrario.idprocurador;
          this.sigaServices.post("busquedaProcuradores_searchProcuradores", procuradorItem).subscribe(
            (n) => {
              this.progressSpinner = false;
              let procuradores = JSON.parse(n.body).procuradorItems;
              if (procuradores.length > 0) {
                this.procurador = procuradores[0];
              }
            },
            (err) => {
              this.progressSpinner = false;
            },
          );
        } else {
          this.progressSpinner = false;
        }
      } else {
        this.progressSpinner = false;
      }
    }
  }

  private associate() {
    if (!sessionStorage.getItem("EJGItem")) {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request: string[] = [designa.idInstitucion, this.body.idpersona, designa.ano, designa.numero, designa.idTurno, this.procurador.idProcurador, this.procurador.idInstitucion];
      this.sigaServices.post("designaciones_updateProcuradorContrario", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        },
        (err) => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.error"), this.translateService.instant("general.message.error.realiza.accion"));
        },
      );
    } else {
      let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
      let request: string[] = [ejg.idInstitucion, this.body.idpersona, ejg.annio, ejg.numero, ejg.tipoEJG, this.procurador.idProcurador, this.procurador.idInstitucion];
      this.sigaServices.post("gestionejg_updateProcuradorContrarioEJG", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
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
