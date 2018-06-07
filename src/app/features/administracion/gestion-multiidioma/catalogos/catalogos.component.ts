import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";

import { SigaServices } from "./../../../../_services/siga.service";
import { Router } from "@angular/router";
import { MessageService } from "primeng/components/common/messageservice";
import { ConfirmationService } from "primeng/api";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../../properties/val-properties";
import { SigaWrapper } from "../../../../wrapper/wrapper.class";

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { InputTextModule } from "primeng/inputtext";
import { Message } from "primeng/components/common/api";
import { TooltipModule } from "primeng/tooltip";

import { MultiidiomaCatalogoDto } from "../../../../models/MultiidiomaCatalogoDto";
import { MultiidiomaCatalogoSearchDto } from "../../../../models/MultiidiomaCatalogoSearchDto";
import { MultiidiomaCatalogoUpdateDto } from "../../../../models/MultiidiomaCatalogoUpdateDto";
import { MultiidiomaCatalogoItem } from "../../../../models/MultiidiomaCatalogoItem";
import { ControlAccesoDto } from "../../../../../app/models/ControlAccesoDto";


export enum KEY_CODE {
  ENTER = 13,
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
  comparacion: boolean;
  editar: boolean = false;
  habilitarBotones: boolean = false;

  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
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
          e.labelSinTilde = e.label.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          return e.labelSinTilde;
        });

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.idiomaTraduccion.map(e => {
          e.labelSinTilde = e.label.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          return e.labelSinTilde;
        });

        this.valorDefecto = this.idiomaBusqueda.find(
          item => item.value === lenguaje
        );

        this.selectedIdiomaBusqueda = this.valorDefecto.value;
      },
      err => {
        console.log(err);
      }
    );

    this.sigaServices.get("catalogos_entidad").subscribe(
      n => {
        this.entidad = n.combooItems;
      },
      err => {
        console.log(err);
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

    this.bodySearch.nombreTabla = this.selectedEntidad;
    this.bodySearch.idiomaBusqueda = this.selectedIdiomaBusqueda;
    this.bodySearch.idiomaTraduccion = this.selectedIdiomaTraduccion;
    this.bodySave = this.bodySearch;
    this.sigaServices
      .postPaginado("catalogos_search", "?numPagina=1", this.bodySearch)
      .subscribe(
      data => {
        console.log(data);
        this.searchParametros = JSON.parse(data["body"]);
        this.datosTraduccion = this.searchParametros.multiidiomaCatalogoItem;
        this.progressSpinner = false;
        this.buscarSeleccionado = true;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
      );
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
        console.log(err);
      },
      () => {
        if (this.derechoAcceso == 3) {
          this.editar = true;
        } else {
          this.editar = false;
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
    this.elementosAGuardar.push(this.bodyUpdate);
    this.isHabilitadoGuardar();
  }

  isGuardar() {
    for (let i in this.elementosAGuardar) {
      this.sigaServices.post("catalogos_update", this.bodyUpdate).subscribe(
        data => {
          console.log(data);
          this.showSuccessEdit();
        },
        err => {
          console.log(err);
          this.showFail();
        },
        () => {
          this.elementosAGuardar = [];
          this.isBuscar();
          this.table.reset();
        }
      );
    }
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
  @HostListener('document:keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER && !this.buscar) {
      this.isBuscar();
    }
  }
}
