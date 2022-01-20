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
import { MultiidiomaCatalogoDto } from "../../../../models/MultiidiomaCatalogoDto";
import { MultiidiomaCatalogoSearchDto } from "../../../../models/MultiidiomaCatalogoSearchDto";
import { MultiidiomaCatalogoUpdateDto } from "../../../../models/MultiidiomaCatalogoUpdateDto";
import { MultiidiomaCatalogoItem } from "../../../../models/MultiidiomaCatalogoItem";
import { ControlAccesoDto } from "../../../../../app/models/ControlAccesoDto";
import { DialogoComunicacionesItem } from "../../../../models/DialogoComunicacionItem";
import { Router } from "@angular/router";
import { esCalendar } from "./../../../../utils/calendar";
import { CommonsService } from '../../../../_services/commons.service';
export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-etiquetas",
  templateUrl: "./catalogos.component.html",
  styleUrls: ["./catalogos.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class Catalogos extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  selectedIdiomaBusqueda: any;
  selectedIdiomaTraduccion: any;
  selectedEntidad: any;
  idiomaBusqueda: any[];
  idiomaTraduccion: any[];
  entidad: any[];
  buscarSeleccionado: boolean = false;
  datosTraduccion: any[];
  columnasTabla: any = [];
  rowsPerPage: any = [];
  selectedItem: number = 10;
  valorDefecto: any;
  buscar: boolean = true;
  bodySearch: MultiidiomaCatalogoSearchDto = new MultiidiomaCatalogoSearchDto();
  searchParametros: MultiidiomaCatalogoDto = new MultiidiomaCatalogoDto();
  bodyUpdate: MultiidiomaCatalogoUpdateDto = new MultiidiomaCatalogoUpdateDto();
  msgs: Message[] = [];
  progressSpinner: boolean = false;

  bodySave: MultiidiomaCatalogoSearchDto = new MultiidiomaCatalogoSearchDto();
  elementosAGuardar: MultiidiomaCatalogoUpdateDto[] = [];

  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisos: any;
  permisosArray: any[];
  derechoAcceso: any;
  editar: boolean = false;
  habilitarBotones: boolean = false;
  local: String;
  es: any = esCalendar;




  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private router: Router
  ) {
    super(USER_VALIDATIONS);
  }

  @ViewChild("table") table;
  ngOnInit() {
    this.checkAcceso();
    this.sigaServices.get("catalogos_lenguage").subscribe(
      n => {
        this.idiomaBusqueda = n.combooItems;
        this.idiomaTraduccion = n.combooItems;

        let lenguaje = this.translateService.currentLang;

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

        this.valorDefecto = this.idiomaBusqueda.find(
          item => item.value === lenguaje
        );

        this.selectedIdiomaBusqueda = this.valorDefecto.value;
      },
      err => {
        //console.log(err);
      }
    );

    this.sigaServices.get("catalogos_entidad").subscribe(
      n => {
        this.entidad = n.combooItems;
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

  isBuscar() {
    this.progressSpinner = true;

    //this.bodySearch.nombreTabla = this.selectedEntidad;
    this.bodySearch.idiomaBusqueda = this.selectedIdiomaBusqueda;
    this.bodySearch.idiomaTraduccion = this.selectedIdiomaTraduccion;
    this.bodySave = this.bodySearch;
    this.sigaServices
      .postPaginado("catalogos_search", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          this.searchParametros = JSON.parse(data["body"]);
          this.datosTraduccion = this.searchParametros.multiidiomaCatalogoItem;
          this.progressSpinner = false;
          this.buscarSeleccionado = true;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          setTimeout(()=>{
            this.commonsService.scrollTablaFoco('tablaFoco');
          }, 5);
        }
      );
  }
  datos(event) {
     
    this.bodySearch.local = event.value;
    this.local = event.value;
    this.bodySearch.nombreTabla = event.originalEvent.srcElement.innerText.trim();
  }
  isRestablecer() {
    this.elementosAGuardar = [];
    this.habilitarBotones = false;
    this.bodySearch = this.bodySave;
    this.isBuscar();
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "99B";
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

  isHabilitadoBuscar() {
    if (
      this.selectedIdiomaBusqueda != "" &&
      this.selectedIdiomaBusqueda != undefined &&
      this.selectedIdiomaTraduccion != "" &&
      this.selectedIdiomaTraduccion != undefined &&
      this.selectedEntidad != "" &&
      this.selectedEntidad != undefined
    ) {
      this.buscar = false;
      return this.buscar;
    } else {
      this.buscar = true;
      return this.buscar;
    }
  }

  isHabilitadoGuardar() {
    if (
      this.elementosAGuardar == undefined ||
      this.elementosAGuardar.length == 0
    )
      this.habilitarBotones = false;
    else this.habilitarBotones = true;
  }

  obtenerRecurso(dato) {
    return dato.idRecurso;
  }

  Guardar(event, dato) {
    this.bodyUpdate = new MultiidiomaCatalogoUpdateDto();
    this.bodyUpdate.descripcion = event.target.value;
    this.bodyUpdate.idLenguaje = dato.idLenguajeTraducir;
    this.bodyUpdate.idRecurso = dato.idRecurso;
    this.bodyUpdate.local = this.local;
    this.datosTraduccion.forEach(
      (value: MultiidiomaCatalogoItem, key: number) => {
        if (value.idRecurso == dato.idRecurso) {
          value.editar = true;
        }
      }
    );
    this.elementosAGuardar.push(this.bodyUpdate);
    this.isHabilitadoGuardar();
  }

  isGuardar() {
    this.elementosAGuardar = [];
    this.datosTraduccion.forEach(
      (value: MultiidiomaCatalogoItem, key: number) => {
        if (value.editar == true) {
          this.bodyUpdate = new MultiidiomaCatalogoUpdateDto();
          this.bodyUpdate.descripcion = value.descripcionTraduccion.trim();
          this.bodyUpdate.idLenguaje = value.idLenguajeTraducir;
          this.bodyUpdate.idRecurso = value.idRecurso;
          this.bodyUpdate.local = this.local;
          this.bodyUpdate.nombreTabla = value.nombreTabla;
          this.elementosAGuardar.push(this.bodyUpdate);
        }
      }
    );
    this.elementosAGuardar.forEach(
      (value: MultiidiomaCatalogoUpdateDto, key: number) => {
        this.sigaServices.post("catalogos_update", value).subscribe(
          data => {
            this.showSuccessEdit();
          },
          err => {
            //console.log(err);
            this.showFail();
          },
          () => {
            if (key == this.elementosAGuardar.length - 1) {
              this.elementosAGuardar = [];
              this.isBuscar();
              this.table.reset();
              this.habilitarBotones = false;
            }
          }
        );
      }
    );
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  showSuccessEdit() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: this.translateService.instant(
        "general.message.registro.actualizado"
      )
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
