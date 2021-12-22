import { Component, OnInit, ViewChild } from "@angular/core";
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { ModelosComunicacionesItem } from "../../../../../models/ModelosComunicacionesItem";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";

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
  editar: boolean = true;
  numeroPerfilesExistentes: number = 0;
  institucionActual: number;

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
    private translateService: TranslateService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {


    this.getInstitucionActual();
  }

  getInstitucionActual() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;

      // El modo de la pantalla viene por los permisos de la aplicación
      if (sessionStorage.getItem("soloLectura") == 'true') {
        this.soloLectura = true;
      }

      if (sessionStorage.getItem("esPorDefecto") == 'SI' && this.institucionActual != 2000) {
        this.soloLectura = true;
      } else {
        this.body = JSON.parse(sessionStorage.getItem('modelosSearch'));
        if (this.body != null && this.body != undefined && this.body.porDefecto == 'SI' && this.institucionActual != 2000) {
          if (
            sessionStorage.getItem("soloLectura") != null &&
            sessionStorage.getItem("soloLectura") != undefined &&
            sessionStorage.getItem("soloLectura") == "true"
          ) {
            this.soloLectura = true;
          }
        }
      }

      this.getDatos();

      this.sigaServices.deshabilitarEditar$.subscribe(() => {
        this.editar = false;
      });

      this.sigaServices.perfilesRefresh$.subscribe(() => {
        this.getDatos();
      });
    });
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
        this.numeroPerfilesExistentes = this.perfilesNoSeleccionados.length;
        this.perfilesNoSeleccionadosInicial = JSON.parse(
          JSON.stringify(this.perfilesNoSeleccionados)
        );
      },
      err => {
        //console.log(err);
      },
      () => {
        let i = 0;
        if (this.perfilesSeleccionados != undefined) {
          let perfilesFiltrados = this.perfilesNoSeleccionados;
          this.perfilesNoSeleccionados = [];
          perfilesFiltrados.forEach(element => {
            let find = this.perfilesSeleccionados.find(x => x.value == element.value);
            if (find != undefined) {
              // //console.log(perfilesFiltrados[i]);
            } else {
              this.perfilesNoSeleccionados.push(perfilesFiltrados[i]);
            }
            i++;
          });
        }
        this.progressSpinner = false;
      }
    );
  }

  getPerfilesSeleccionados() {
    
    if(this.body != null && this.body != undefined){

      this.body.idInstitucion = this.institucionActual.toString();
      this.sigaServices
        .post("modelos_detalle_perfilesModelo", this.body)
        .subscribe(
          n => {
            // coger etiquetas de una persona juridica
            this.perfilesSeleccionados = JSON.parse(n["body"]).combooItems;
            this.perfilesSeleccionadosInicial = JSON.parse(
              JSON.stringify(this.perfilesSeleccionados)
            );

            //por cada perfil seleccionado lo eliminamos de la lista de existentes
            if (this.perfilesSeleccionados && this.perfilesSeleccionados.length && this.perfilesNoSeleccionadosInicial) {
              this.perfilesSeleccionados.forEach(element => {
                let x = this.arrayObjectIndexOf(this.perfilesNoSeleccionados, element);
                if (x > -1) {
                  this.perfilesNoSeleccionados.splice(x, 1);
                }
              });
              this.perfilesNoSeleccionados = [...this.perfilesNoSeleccionados]
            }
          },
          err => {
            //console.log(err);
          }
        );
    
      }
    
  }

  guardar() {
    this.progressSpinner = true;
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
          this.showSuccess(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.correctGuardadoPerfiles"
            )
          );
          this.perfilesSeleccionadosInicial = JSON.parse(
            JSON.stringify(this.perfilesSeleccionados)
          );
          this.perfilesNoSeleccionadosInicial = JSON.parse(
            JSON.stringify(this.perfilesNoSeleccionados)
          );
        },
        err => {
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.errorGuardadoPerfiles"
            )
          );
          //console.log(err);
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
      this.getPerfilesExtistentes();
      this.getPerfilesSeleccionados();
    }
    this.getPerfilesSeleccionados();
  }

  restablecer() {
    this.progressSpinner = true;
    this.getDatos();
  }

  arrayObjectIndexOf(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value == obj.value) {
        return i;
      }
    };
    return -1;
  }
}
