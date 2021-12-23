import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import { SigaServices } from "./../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../../properties/val-properties";
import { SigaWrapper } from "../../../../wrapper/wrapper.class";
import { Message } from "primeng/components/common/api";
import { EtiquetaUpdateDto } from "../../../../models/EtiquetaUpdateDto";
import { EtiquetaSearchDto } from "../../../../models/EtiquetaSearchDto";
import { EtiquetaDto } from "../../../../models/EtiquetaDto";
import { ControlAccesoDto } from "../../../../../app/models/ControlAccesoDto";
import { Router } from "@angular/router";
export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-etiquetas",
  templateUrl: "./etiquetas.component.html",
  styleUrls: ["./etiquetas.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class Etiquetas extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  selectedIdiomaBusqueda: any;
  selectedIdiomaTraduccion: String;
  idiomaBusqueda: any[];
  idiomaTraduccion: any[];
  valorDefecto: any;
  buscar: boolean = true;
  descripcion: any;
  datosTraduccion: any[];
  selectedItem: number = 10;
  buscarSeleccionado: boolean = false;
  columnasTabla: any = [];
  rowsPerPage: any = [];
  bodySearch: EtiquetaSearchDto = new EtiquetaSearchDto();
  searchParametros: EtiquetaDto = new EtiquetaDto();
  bodyUpdate: EtiquetaUpdateDto = new EtiquetaUpdateDto();
  msgs: Message[] = [];
  paginacion: boolean = false;

  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisos: any;
  permisosArray: any[];
  derechoAcceso: any;
  editar: boolean = false;
  bodySave: EtiquetaSearchDto = new EtiquetaSearchDto();
  elementosAGuardar: EtiquetaUpdateDto[] = [];
  habilitarBotones: boolean = false;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private router: Router
  ) {
    super(USER_VALIDATIONS);
  }

  @ViewChild("table") table;
  ngOnInit() {
    this.checkAcceso();
    this.sigaServices.get("etiquetas_lenguaje").subscribe(
      n => {
        this.idiomaBusqueda = n.combooItems;
        this.idiomaTraduccion = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.idiomaBusqueda.map(e => {
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

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.idiomaTraduccion.map(e => {
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

        let lenguaje = this.translateService.currentLang;
        this.valorDefecto = this.idiomaBusqueda.find(
          item => item.value === lenguaje
        );

        if (this.valorDefecto.value != undefined)
          this.selectedIdiomaBusqueda = this.valorDefecto.value;
      },
      err => {
        //console.log(err);
      }
    );

    this.columnasTabla = [
      {
        field: "descripcionBusqueda",
        header:
        "administracion.multidioma.etiquetas.literal.descripcionInstitucion"
      },
      {
        field: "descripcionTraduccion",
        header:
        "administracion.multidioma.etiquetas.literal.descripcionIdiomaSeleccionado"
      }
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

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "99A";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        //console.log(err);
      },
      () => {
        if (this.derechoAcceso == 3) {
          this.editar = true;
        } else if (this.derechoAcceso == 2) {
          this.editar = false;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
          this.router.navigate(["/errorAcceso"]);
        }
      }
    );
  }

  isBuscar() {
    this.bodySearch.descripcion = this.descripcion;
    this.bodySearch.idiomaBusqueda = this.selectedIdiomaBusqueda;
    this.bodySearch.idiomaTraduccion = this.selectedIdiomaTraduccion;
    this.bodySave = this.bodySearch;
    this.sigaServices
      .postPaginado("etiquetas_search", "?numPagina=1", this.bodySearch)
      .subscribe(
      data => {
        this.searchParametros = JSON.parse(data["body"]);
        this.datosTraduccion = this.searchParametros.etiquetaItem;
        this.buscarSeleccionado = true;

        if (this.datosTraduccion.length == 0) this.paginacion = false;
        else this.paginacion = true;
      },
      err => {
        //console.log(err);
      }
      );
  }

  isRestablecer() {
    this.elementosAGuardar = [];
    this.habilitarBotones = false;
    this.bodySearch = this.bodySave;
    this.isBuscar();
  }

  isHabilitadoBuscar() {
    if (
      this.selectedIdiomaBusqueda != "" &&
      this.selectedIdiomaBusqueda != undefined &&
      this.selectedIdiomaTraduccion != "" &&
      this.selectedIdiomaTraduccion != undefined &&
      this.descripcion != "" &&
      this.descripcion != undefined
    ) {
      this.buscar = false;
      return this.buscar;
    } else {
      this.buscar = true;
      return this.buscar;
    }
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  generarRecursos() {
    this.translateService.updateTranslations(this.sigaServices);
    this.showSuccess();
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  Guardar(event, dato) {
    this.bodyUpdate = new EtiquetaUpdateDto();
    this.bodyUpdate.descripcion = event.target.value.trim();
    this.bodyUpdate.idLenguaje = dato.idLenguajeTraducir;
    this.bodyUpdate.idRecurso = dato.idRecurso;
    this.elementosAGuardar.push(this.bodyUpdate);
    this.isHabilitadoGuardar();
  }

  isGuardar() {
    for (let i in this.elementosAGuardar) {
      this.sigaServices
        .post("etiquetas_update", this.elementosAGuardar[i])
        .subscribe(
        data => {
        },
        err => {
          //console.log(err);
          this.showFail();
        },
        () => {
          this.elementosAGuardar = [];
          this.isBuscar();
          this.table.reset();
        }
        );
    }
    this.showSuccessEdit();
    this.habilitarBotones = false;
  }

  obtenerRecurso(dato) {
    return dato.idRecurso;
  }

  showSuccessEdit() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: this.translateService.instant("general.message.accion.cancelada")
    });
  }

  activarPaginacion() {
    return this.paginacion;
  }
  isHabilitadoGuardar() {
    if (
      this.elementosAGuardar == undefined ||
      this.elementosAGuardar.length == 0
    )
      this.habilitarBotones = false;
    else this.habilitarBotones = true;
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER && !this.buscar) {
      this.isBuscar();
    }
  }

  clear() {
    this.msgs = [];
  }
}
