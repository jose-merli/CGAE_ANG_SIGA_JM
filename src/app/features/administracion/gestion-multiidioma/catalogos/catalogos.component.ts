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

import { MultiidiomaCatalogoDto } from "../../../../models/MultiidiomaCatalogoDto";
import { MultiidiomaCatalogoSearchDto } from "../../../../models/MultiidiomaCatalogoSearchDto";
import { MultiidiomaCatalogoUpdateDto } from "../../../../models/MultiidiomaCatalogoUpdateDto";
import { MultiidiomaCatalogoItem } from "../../../../models/MultiidiomaCatalogoItem";

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
  selectedItem: number = 4;
  valorDefecto: any;
  buscar: boolean = true;
  bodySearch: MultiidiomaCatalogoSearchDto = new MultiidiomaCatalogoSearchDto();
  searchParametros: MultiidiomaCatalogoDto = new MultiidiomaCatalogoDto();
  bodyUpdate: MultiidiomaCatalogoUpdateDto = new MultiidiomaCatalogoUpdateDto();
  msgs: Message[] = [];

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
    this.sigaServices.get("catalogos_lenguage").subscribe(
      n => {
        this.idiomaBusqueda = n.combooItems;
        this.idiomaTraduccion = n.combooItems;

        let lenguaje = this.translateService.currentLang;
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
        label: 4,
        value: 4
      },
      {
        label: 6,
        value: 6
      },
      {
        label: 8,
        value: 8
      },
      {
        label: 10,
        value: 10
      }
    ];
  }
  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  isBuscar() {
    this.bodySearch.nombreTabla = this.selectedEntidad;
    this.bodySearch.idiomaBusqueda = this.selectedIdiomaBusqueda;
    this.bodySearch.idiomaTraduccion = this.selectedIdiomaTraduccion;

    this.sigaServices
      .postPaginado("catalogos_search", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          console.log(data);
          this.searchParametros = JSON.parse(data["body"]);
          this.datosTraduccion = this.searchParametros.multiidiomaCatalogoItem;
          this.buscarSeleccionado = true;
        },
        err => {
          console.log(err);
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
  obtenerRecurso(dato) {
    return dato.idRecurso;
  }

  isGuardar(event, dato) {
    this.bodyUpdate.descripcion = event.target.value;
    this.bodyUpdate.idLenguaje = dato.idLenguajeTraducir;
    this.bodyUpdate.idRecurso = dato.idRecurso;
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
        this.isBuscar();
        this.table.reset();
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
}
