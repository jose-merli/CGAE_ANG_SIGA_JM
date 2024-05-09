import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService, Message } from "primeng/primeng";
import { CommonsService } from "../../../../../_services/commons.service";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { FichaSojItem } from "../../../../../models/sjcs/FichaSojItem";
import { JusticiableBusquedaItem } from "../../../../../models/sjcs/JusticiableBusquedaItem";
import { JusticiableItem } from "../../../../../models/sjcs/JusticiableItem";
import { JusticiableObject } from "../../../../../models/sjcs/JusticiableObject";

@Component({
  selector: "app-solicitante-detalle-soj",
  templateUrl: "./solicitante-detalle-soj.component.html",
  styleUrls: ["./solicitante-detalle-soj.component.scss"],
})
export class SolicitanteDetalleSojComponent implements OnInit, OnChanges {
  msgs: Message[] = [];
  idAsistencia: string;
  asistido: JusticiableItem = new JusticiableItem();
  comboTipoPersona = [];
  body: any = new FichaSojItem();
  progressSpinner: boolean = false;
  showJusticiableDialog: boolean = false;
  camposSoliDisabled: boolean = true;

  constructor(private sigaServices: SigaServices, private commonServices: CommonsService, private persistenceService: PersistenceService, private translate: TranslateService, private confirmationService: ConfirmationService, private router: Router) {}

  @Input() bodyInicial;
  @Input() permisoEscritura: boolean;

  ngOnInit() {
    this.progressSpinner = true;
    this.getComboTipoPersona();
  }

  ngOnChanges() {
    if (this.progressSpinner) {
      if (this.bodyInicial != undefined) {
        if (this.bodyInicial.idPersonaJG) {
          if (this.bodyInicial.numero == null) {
            this.permisoEscritura = false;
          } else {
            this.permisoEscritura = true;
          }
          this.asistido.idpersona = this.bodyInicial.idPersonaJG;
          this.getAsistidoData();
        }
      }
    }
  }

  getAsistidoData() {
    this.progressSpinner = true;
    this.sigaServices.post("gestionJusticiables_getJusticiableByIdPersona", this.asistido).subscribe(
      (n) => {
        this.progressSpinner = false;
        this.asistido = JSON.parse(n.body).justiciable;
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  /*
  setAsistidoPersistenceData() {
    let asistidoBusqueda = new JusticiableBusquedaItem();
    asistidoBusqueda.idpersona = this.idPersonaAsistido;
    this.progressSpinner = true;
    this.sigaServices.post("busquedaJusticiables_searchJusticiables", asistidoBusqueda).subscribe(
      (n) => {
        this.progressSpinner = false;
        let datos = JSON.parse(n.body).justiciableBusquedaItems;
        let error = JSON.parse(n.body).error;
        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMsg("info", this.translate.instant("general.message.informacion"), error.description);
        }
        sessionStorage.setItem("idAsistencia", this.idAsistencia);
      },
      (err) => {
        this.progressSpinner = false;
      }
    );
  }
  */

  onClickSearch() {
    if (this.asistido.nif) {
      if (this.commonServices.isValidDNI(this.asistido.nif) || this.commonServices.isValidCIF(this.asistido.nif) || this.commonServices.isValidNIE(this.asistido.nif) || this.commonServices.isValidPassport(this.asistido.nif)) {
        let justiciableItem: JusticiableBusquedaItem = new JusticiableBusquedaItem();
        justiciableItem.nif = this.asistido.nif;

        this.sigaServices.post("gestionJusticiables_getJusticiableByNif", justiciableItem).subscribe(
          (n) => {
            this.progressSpinner = false;
            let justiciableDTO: JusticiableObject = JSON.parse(n["body"]);
            let justiciableItem: JusticiableItem = justiciableDTO.justiciable;
            if (justiciableItem.idpersona) {
              this.asistido.nif = justiciableItem.nif;
              this.asistido.nombre = justiciableItem.nombre;
              this.asistido.apellido1 = justiciableItem.apellido1;
              this.asistido.apellido2 = justiciableItem.apellido2;
              this.asistido.idpersona = justiciableItem.idpersona;
              this.asistido.idinstitucion = justiciableItem.idinstitucion;
              this.asistido.tipopersonajg = justiciableItem.tipopersonajg;
            } else {
              // si no se encuentra por busqueda rapida ofrecemos crear uno nuevo

              this.confirmationService.confirm({
                key: "confirmNewJusticiable",
                message: "No se ha encontrado ningún justiciable con dicho número de identificación, ¿desea crear un nuevo justiciable?",
                icon: "fa fa-question-circle",
                accept: () => {
                  this.persistenceService.clearDatos();
                  sessionStorage.setItem("origin", "newSoj");
                  sessionStorage.setItem("Nuevo", "true");
                  this.router.navigate(["/gestionJusticiables"]);
                },
                reject: () => {
                  this.showMsg("info", "Cancel", this.translate.instant("general.message.accion.cancelada"));
                },
              });
            }
          },
          (err) => {
            this.progressSpinner = false;
          },
        );
      } else {
        this.showMsg("error", "Error", "Introduzca un documento de identificación válido");
      }
    } else {
      this.showMsg("error", "Error", "Introduzca un documento de identificación");
    }
  }

  getComboTipoPersona() {
    this.comboTipoPersona = [
      { label: "Física", value: "F" },
      { label: "Jurídica", value: "J" },
    ];
    this.commonServices.arregloTildesCombo(this.comboTipoPersona);
  }

  clear() {
    this.msgs = [];
  }

  showMsg(severityParam: string, summaryParam: string, detailParam: string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam,
    });
  }

  guardarJusticiable() {
    if (this.checkDatosObligatorios()) {
      this.showJusticiableDialog = true;
    } else {
      this.showMsg("error", this.translate.instant("general.message.error.realiza.accion"), this.translate.instant("general.message.camposObligatorios"));
    }
  }

  asociarJusticiable(actualiza: boolean) {
    let itemSojJusticiable = new FichaSojItem();
    let justiciable = new JusticiableItem();
    // Justiciable Existente
    if (justiciable != undefined || justiciable != null) {
      justiciable = this.asistido;
      itemSojJusticiable.justiciable = justiciable;
    }
    itemSojJusticiable.anio = this.bodyInicial.anio;
    itemSojJusticiable.idTipoSoj = this.bodyInicial.idTipoSoj;
    itemSojJusticiable.numero = this.bodyInicial.numero;
    // Actualizar Datos.
    itemSojJusticiable.actualizaDatos = actualiza ? "S" : "N"; // Modificar = S ||  Nuevo = N
    // Quitar Dialogo.
    this.showJusticiableDialog = false;
    this.progressSpinner = true;
    // Asociar SOJ
    this.sigaServices.post("gestionSoj_asociarSOJ", itemSojJusticiable).subscribe(
      (data) => {
        let result = JSON.parse(data["body"]);
        if (result.error) {
          this.showMsg("error", this.translate.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
        } else {
          this.showMsg("success", this.translate.instant("general.message.accion.realizada"), "");
        }

        this.progressSpinner = false;
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  desasociarJusticiable() {
    this.progressSpinner = true;

    this.sigaServices.post("gestionSoj_desasociarSOJ", this.bodyInicial).subscribe(
      (data) => {
        this.progressSpinner = false;
        let result = JSON.parse(data["body"]);
        if (result.error) {
          this.showMsg("error", this.translate.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
        } else {
          this.asistido = new JusticiableItem();
          this.showMsg("success", this.translate.instant("general.message.accion.realizada"), "");
        }
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  searchJusticiable() {
    sessionStorage.setItem("origin", "newSoj");
    if (this.bodyInicial) {
      sessionStorage.setItem("sojAsistido", JSON.stringify(this.bodyInicial));
    }
    this.router.navigate(["/justiciables"]);
  }

  checkDatosObligatorios() {
    let ok: boolean = false;
    if (this.asistido.nif && this.asistido.tipopersonajg) {
      ok = true;
    }
    return ok;
  }

  styleObligatorio(evento) {
    if (evento == undefined || evento == null || evento == "") {
      return this.commonServices.styleObligatorio(evento);
    }
  }

  goToCard() {
    // Enviar para la gestion de la tarjeta.
    this.persistenceService.setDatos(this.asistido);
    sessionStorage.setItem("origin", "Soj");
    sessionStorage.setItem("sojAsistido", JSON.stringify(this.bodyInicial));
    this.router.navigate(["/gestionJusticiables"]);
  }
}
