import { Component, OnInit, ViewChild } from "@angular/core";
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { ModelosComunicacionesItem } from "../../../../../models/ModelosComunicacionesItem";
import { Message, ConfirmationService } from "primeng/components/common/api";

@Component({
  selector: "app-perfiles-ficha",
  templateUrl: "./perfiles-ficha.component.html",
  styleUrls: ["./perfiles-ficha.component.scss"]
})
export class PerfilesFichaComponent implements OnInit {
  openFicha: boolean = false;
  openDestinatario: boolean;
  perfilesSeleccionados: any[];
  perfilesNoSeleccionados: any[];
  body: ModelosComunicacionesItem = new ModelosComunicacionesItem();
  msgs: Message[];
  etiquetasPersonaJuridica: any[];
  perfilesSeleccionadosInicial: any[];
  perfilesNoSeleccionadosInicial: any[];
  progressSpinner: boolean = false;
  soloLectura: boolean = false;

  @ViewChild("table") table: DataTable;
  selectedDatos;

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "perfiles",
      activa: false
    },
    {
      key: "informes",
      activa: false
    },
    {
      key: "comunicacion",
      activa: false
    }
  ];

  constructor(
    // private router: Router,
    // private translateService: TranslateService,
    private sigaServices: SigaServices
  ) {}

  ngOnInit() {
    this.getDatos();

    if (
      sessionStorage.getItem("soloLectura") != null &&
      sessionStorage.getItem("soloLectura") != undefined &&
      sessionStorage.getItem("soloLectura") == "true"
    ) {
      this.soloLectura = true;
    }
  }

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }

  getPerfilesExtistentes() {
    this.progressSpinner = true;
    this.sigaServices.get("modelos_detalle_perfiles").subscribe(
      n => {
        // coger etiquetas de una persona juridica
        this.perfilesNoSeleccionados = n.combooItems;
        this.perfilesNoSeleccionadosInicial = JSON.parse(
          JSON.stringify(this.perfilesNoSeleccionados)
        );
      },
      err => {
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  getPerfilesSeleccionados() {
    this.sigaServices
      .post("modelos_detalle_perfilesModelo", this.body)
      .subscribe(
        n => {
          // coger etiquetas de una persona juridica
          this.perfilesSeleccionados = JSON.parse(n["body"]).combooItems;
          this.perfilesSeleccionadosInicial = JSON.parse(
            JSON.stringify(this.perfilesSeleccionados)
          );
        },
        err => {
          console.log(err);
        }
      );
  }

  guardar() {
    if (
      sessionStorage.getItem("modelosSearch") != null &&
      this.body.idModeloComunicacion == undefined
    ) {
      this.body.idModeloComunicacion = JSON.parse(
        sessionStorage.getItem("modelosSearch")
      ).idModeloComunicacion;
    }

    let array: any[] = [];
    let arrayNoSel: any[] = [];
    this.perfilesSeleccionados.forEach(element => {
      array.push(element.value);
    });
    this.perfilesNoSeleccionados.forEach(element => {
      arrayNoSel.push(element.value);
    });

    let objPerfiles = {
      perfilesSeleccionados: array,
      perfilesNoSeleccionados: arrayNoSel,
      idModeloComunicacion: this.body.idModeloComunicacion
    };

    this.sigaServices
      .post("modelos_detalle_guardarPerfiles", objPerfiles)
      .subscribe(
        n => {
          this.showSuccess("Se han guardado los perfiles correctamente");
          this.perfilesSeleccionadosInicial = JSON.parse(
            JSON.stringify(this.perfilesSeleccionados)
          );
          this.perfilesNoSeleccionadosInicial = JSON.parse(
            JSON.stringify(this.perfilesNoSeleccionados)
          );
        },
        err => {
          this.showFail("Error al guardar los perfiles");
          console.log(err);
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevoModelo") == null) {
      this.openFicha = !this.openFicha;
      if (this.openFicha) {
        this.getDatos();
      }
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  onOpenDestinatario(d) {
    d.open = !d.open;
  }

  getDatos() {
    if (sessionStorage.getItem("modelosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("modelosSearch"));
      this.getPerfilesSeleccionados();
      this.getPerfilesExtistentes();
    }
    this.getPerfilesSeleccionados();
  }

  restablecer() {
    this.getDatos();
  }
}
