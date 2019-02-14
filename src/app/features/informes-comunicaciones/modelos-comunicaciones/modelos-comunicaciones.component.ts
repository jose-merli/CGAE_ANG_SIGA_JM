import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import { DataTable } from "primeng/datatable";
import { ModelosComunicacionesItem } from "../../../models/ModelosComunicacionesItem";
import { TranslateService } from "../../../commons/translate/translation.service";
import { SigaServices } from "../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Router } from "@angular/router";
export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-modelos-comunicaciones",
  templateUrl: "./modelos-comunicaciones.component.html",
  styleUrls: ["./modelos-comunicaciones.component.scss"],
  host: {
    "(document:keypress)": "onKeyPress($event)"
  }
})
export class ModelosComunicacionesComponent implements OnInit {
  body: ModelosComunicacionesItem = new ModelosComunicacionesItem();
  bodySearch: ModelosComunicacionesItem = new ModelosComunicacionesItem();
  colegios: any[];
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  showResultados: boolean = false;
  showHistorico: boolean = false;
  msgs: Message[];
  clasesComunicaciones: any[];
  progressSpinner: boolean = false;
  institucionActual: string;
  preseleccionar: any = [];
  visible: any = [];
  fichaBusqueda: boolean = false;

  @ViewChild("table") table: DataTable;
  selectedDatos;

  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getInstitucion();
    this.getComboColegios();
    this.bodySearch.visible = 1;

    sessionStorage.removeItem("crearNuevoModelo");

    if (sessionStorage.getItem("filtrosModelos") != null) {
      this.bodySearch = JSON.parse(sessionStorage.getItem("filtrosModelos"));
      this.buscar();
    }

    this.selectedItem = 10;

    this.getComboClases();
    // this.body.visible = true;

    this.preseleccionar = [
      { label: "", value: "" },
      { label: "Sí", value: "SI" },
      { label: "No", value: "NO" }
    ];

    this.visible = [
      { label: "", value: "" },
      { label: "Sí", value: 1 },
      { label: "No", value: 0 }
    ];

    this.cols = [
      { field: "claseComunicacion", header: "Clase comunicación" },
      { field: "nombre", header: "Nombre" },
      { field: "institucion", header: "Institución" },
      { field: "orden", header: "Orden" },
      { field: "preseleccionar", header: "Preseleccionado", width: "20%" },
      { field: "porDefecto", header: "Por defecto" }
    ];

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
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

  getComboColegios() {
    this.sigaServices.get("modelos_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;
        this.colegios.unshift({ label: "", value: "" });
        if (this.institucionActual != "2000") {
          for (let e of this.colegios) {
            if (e.value == "2000") {
              e.value = "0";
              e.label = "POR DEFECTO";
            }
          }
        } else {
          this.colegios.unshift({ label: "POR DEFECTO", value: "0" });
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboClases() {
    this.sigaServices.get("comunicaciones_claseComunicaciones").subscribe(
      n => {
        this.clasesComunicaciones = n.combooItems;
        this.clasesComunicaciones.unshift({ label: "", value: "" });
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.clasesComunicaciones.map(e => {
          let accents =
            "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
          let accentsOut =
            "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  buscar() {
    this.showResultados = true;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    sessionStorage.removeItem("modelosSearch");
    sessionStorage.removeItem("filtrosModelos");
    this.getResultados();
  }

  getResultados() {
    let service = "modelos_search";
    if (this.showHistorico) {
      service = "modelos_search_historico";
    }
    this.sigaServices
      .postPaginado(service, "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          this.progressSpinner = false;
          let object = JSON.parse(data["body"]);
          this.datos = object.modelosComunicacionItem;
        },
        err => {
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.errorResultados"
            )
          );
          console.log(err);
        },
        () => {
          this.table.reset();
        }
      );
  }

  getResultadosHistorico() {
    this.sigaServices
      .postPaginado("modelos_search_historico", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          this.progressSpinner = false;
          let object = JSON.parse(data["body"]);
          this.datos = object.modelosComunicacionItem;
        },
        err => {
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.errorEnvio"
            )
          );
          console.log(err);
        },
        () => {
          this.table.reset();
        }
      );
  }

  isButtonDisabled() {
    if (this.body.nombre != "" && this.body.nombre != null) {
      return false;
    }
    return true;
  }

  getHistorico(key) {
    if (key == "visible") {
      this.showHistorico = true;
    } else if (key == "hidden") {
      this.showHistorico = false;
    }
    this.getResultados();
  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      this.bodySearch.idInstitucion = this.institucionActual;
    });
  }

  onDuplicar(dato) {
    this.progressSpinner = true;

    let modelo = {
      idModeloComunicacion: this.selectedDatos[0].idModeloComunicacion,
      idInstitucion: this.selectedDatos[0].idInstitucion
    };

    this.sigaServices.post("modelos_duplicar", modelo).subscribe(
      data => {
        this.showSuccess(
          this.translateService.instant(
            "informesycomunicaciones.modelosdecomunicacion.correctDuplicado"
          )
        );
        // this.router.navigate(["/fichaModeloComunicaciones"]);
        // sessionStorage.setItem("modelosSearch", JSON.stringify(this.body));
        // sessionStorage.setItem(
        //   "filtrosModelos",
        //   JSON.stringify(this.bodySearch)
        // );
        this.progressSpinner = false;
      },
      err => {
        this.showFail(
          this.translateService.instant(
            "informesycomunicaciones.modelosdecomunicacion.errorDuplicado"
          )
        );
        console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.getResultados();
        this.progressSpinner = false;
      }
    );
  }

  onBorrar(dato) {
    this.confirmationService.confirm({
      message: this.translateService.instant("messages.deleteConfirmation"),
      icon: "fa fa-trash-alt",
      accept: () => {
        this.onConfirmarBorrar(dato);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  onConfirmarBorrar(dato) {
    if (!this.selectAll) {
      this.sigaServices.post("modelos_borrar", dato).subscribe(
        data => {
          this.showSuccess(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.correctBorrado"
            )
          );
        },
        err => {
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.errorBorrado"
            )
          );
          console.log(err);
        },
        () => {
          this.getResultados();
        }
      );

      //let x = this.datos.indexOf(dato);
      //this.datos.splice(x, 1);
      this.selectedDatos = [];
      this.selectMultiple = false;
      this.showSuccess(
        this.translateService.instant(
          "informesycomunicaciones.modelosdecomunicacion.correctBorrado"
        )
      );
    } else {
      this.selectedDatos = [];
      this.showSuccess(
        this.translateService.instant(
          "informesycomunicaciones.modelosdecomunicacion.correctEliminadoDestinatarios"
        )
      );
    }
  }

  rehabilitar(dato) {
    this.confirmationService.confirm({
      message: this.translateService.instant(
        "general.message.confirmar.rehabilitacion"
      ),
      icon: "fa fa-check",
      accept: () => {
        this.confirmarRehabilitar(dato);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  confirmarRehabilitar(dato) {
    this.progressSpinner = true;
    this.sigaServices.post("modelos_rehabilitar", dato).subscribe(
      data => {
        this.progressSpinner = false;
        this.showSuccess(
          this.translateService.instant("general.message.rehabilitado")
        );
      },
      err => {
        this.showFail(
          this.translateService.instant("general.message.error.rehabilitado")
        );
        console.log(err);
      },
      () => {
        this.getResultados();
        this.progressSpinner = false;
      }
    );

    //let x = this.datos.indexOf(dato);
    //this.datos.splice(x, 1);
    this.selectedDatos = [];
    this.selectMultiple = false;
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.buscar();
    }
  }

  navigateTo(dato) {
    let id = dato[0].id;
    this.body = dato[0];
    console.log(dato);
    if (!this.selectMultiple) {
      if (dato[0].fechaBaja) {
        sessionStorage.setItem("soloLectura", "true");
      }

      this.router.navigate(["/fichaModeloComunicaciones"]);
      sessionStorage.setItem("modelosSearch", JSON.stringify(this.body));
      sessionStorage.setItem("filtrosModelos", JSON.stringify(this.bodySearch));
    }
  }

  addModelo() {
    this.router.navigate(["/fichaModeloComunicaciones"]);
    sessionStorage.removeItem("modelosSearch");
    sessionStorage.setItem("crearNuevoModelo", JSON.stringify("true"));
  }

  limpiar() {
    this.bodySearch = new ModelosComunicacionesItem();
    this.datos = [];
  }

  abreCierraFicha() {
    this.fichaBusqueda = !this.fichaBusqueda;
  }
}
