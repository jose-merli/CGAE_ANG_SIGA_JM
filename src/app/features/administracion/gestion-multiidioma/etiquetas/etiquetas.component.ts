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
  selectedItem: number = 4;
  buscarSeleccionado: boolean = false;
  columnasTabla: any = [];
  rowsPerPage: any = [];
  bodySearch: EtiquetaSearchDto = new EtiquetaSearchDto();
  searchParametros: EtiquetaDto = new EtiquetaDto();
  bodyUpdate: EtiquetaUpdateDto = new EtiquetaUpdateDto();
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
    this.sigaServices.get("etiquetas_lenguaje").subscribe(
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
    this.bodySearch.descripcion = this.descripcion;
    this.bodySearch.idiomaBusqueda = this.selectedIdiomaBusqueda;
    this.bodySearch.idiomaTraduccion = this.selectedIdiomaTraduccion;

    this.sigaServices
      .postPaginado("etiquetas_search", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          console.log(data);
          this.searchParametros = JSON.parse(data["body"]);
          this.datosTraduccion = this.searchParametros.etiquetaItem;
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

  isGuardar(event, dato) {
    this.bodyUpdate.descripcion = event.target.value;
    this.bodyUpdate.idLenguaje = dato.idLenguajeTraducir;
    this.bodyUpdate.idRecurso = dato.idRecurso;
    this.sigaServices.post("etiquetas_update", this.bodyUpdate).subscribe(
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

  obtenerRecurso(dato) {
    return dato.idRecurso;
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
