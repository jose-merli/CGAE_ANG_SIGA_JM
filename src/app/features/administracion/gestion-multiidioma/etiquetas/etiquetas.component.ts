import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef
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

import { EtiquetaUpdateDto } from "../../../../models/EtiquetaUpdateDto";
import { EtiquetaSearchDto } from "../../../../models/EtiquetaSearchDto";
import { EtiquetaDto } from "../../../../models/EtiquetaDto";
import { EtiquetaItem } from "../../../../models/EtiquetaItem";
import { ControlAccesoDto } from "../../../../../app/models/ControlAccesoDto";

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
  comparacion: boolean;
  editar: boolean = false;
  bodySave: EtiquetaSearchDto = new EtiquetaSearchDto();
  elementosAGuardar: EtiquetaUpdateDto[] = [];
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
    this.sigaServices.get("etiquetas_lenguaje").subscribe(
      n => {
        this.idiomaBusqueda = n.combooItems;
        this.idiomaTraduccion = n.combooItems;

        let lenguaje = this.translateService.currentLang;
        this.valorDefecto = this.idiomaBusqueda.find(
          item => item.value === lenguaje
        );

        if (this.valorDefecto.value != undefined)
          this.selectedIdiomaBusqueda = this.valorDefecto.value;
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

  isBuscar() {
    this.bodySearch.descripcion = this.descripcion;
    this.bodySearch.idiomaBusqueda = this.selectedIdiomaBusqueda;
    this.bodySearch.idiomaTraduccion = this.selectedIdiomaTraduccion;
    this.bodySave = this.bodySearch;
    this.sigaServices
      .postPaginado("etiquetas_search", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          console.log(data);
          this.searchParametros = JSON.parse(data["body"]);
          this.datosTraduccion = this.searchParametros.etiquetaItem;
          this.buscarSeleccionado = true;

          if (this.datosTraduccion.length == 0) this.paginacion = false;
          else this.paginacion = true;
        },
        err => {
          console.log(err);
        }
      );
  }

  isRestablecer() {
    this.elementosAGuardar = [];
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

  generarRecursos() {
    this.translateService.updateTranslations(this.sigaServices);
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  Guardar(event, dato) {
    this.bodyUpdate = new EtiquetaUpdateDto();
    this.bodyUpdate.descripcion = event.target.value;
    this.bodyUpdate.idLenguaje = dato.idLenguajeTraducir;
    this.bodyUpdate.idRecurso = dato.idRecurso;
    this.elementosAGuardar.push(this.bodyUpdate);
  }

  isGuardar() {
    for (let i in this.elementosAGuardar) {
      this.sigaServices
        .post("etiquetas_update", this.elementosAGuardar[i])
        .subscribe(
          data => {
            console.log(data);
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
    this.showSuccessEdit();
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
    if (this.elementosAGuardar == undefined) return true;
    else {
      if (this.elementosAGuardar.length == 0) return true;
      else return false;
    }
  }
}
