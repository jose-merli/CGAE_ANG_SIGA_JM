import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  Input
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

import { CheckboxModule } from "primeng/checkbox";

import { ParametroRequestDto } from "../../../../models/ParametroRequestDto";
import { ParametroDto } from "../../../../models/ParametroDto";
import { ParametroDeleteDto } from "../../../../models/ParametroDeleteDto";
import { ParametroUpdateDto } from "../../../../models/ParametroUpdateDto";

@Component({
  selector: "app-parametros-generales",
  templateUrl: "./parametros-generales.component.html",
  styleUrls: ["./parametros-generales.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ParametrosGenerales extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  modulos: any[];
  selectedModulo: String;
  valorCheckParametros: boolean = false;
  body: ParametroRequestDto = new ParametroRequestDto();
  bodyHistorico: ParametroRequestDto = new ParametroRequestDto();
  searchParametros: ParametroDto = new ParametroDto();
  historicoParametros: ParametroDto = new ParametroDto();
  datosBuscar: any[];
  datosHistorico: any[];
  filaSelecionadaTabla: any;
  buscar: boolean = false;
  selectedItem: number = 4;
  columnasTabla: any = [];
  rowsPerPage: any = [];
  eliminar: boolean = true;
  modificandoValorFila: any;
  valorActualFila: any;
  bodyDelete: ParametroDeleteDto = new ParametroDeleteDto();
  bodyUpdate: ParametroUpdateDto = new ParametroUpdateDto();
  historico: boolean = false;

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
    this.sigaServices.get("parametros_modulo").subscribe(
      n => {
        this.modulos = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.columnasTabla = [
      { field: "modulo", header: "Módulo" },
      { field: "parametro", header: "Parámetro" },
      { field: "valor", header: "Valor" }
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

  onChangeForm() {}

  confirmarBuscar() {
    if (this.selectedModulo != "") {
      this.isBuscar();
    }
  }

  isBuscar() {
    if (this.selectedModulo != undefined) {
      this.body.modulo = this.selectedModulo;
    } else this.body.modulo = "";

    if (this.valorCheckParametros == true) {
      this.body.parametrosGenerales = "S";
    } else {
      this.body.parametrosGenerales = "N";
    }

    this.sigaServices
      .postPaginado("parametros_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          console.log(data);

          this.searchParametros = JSON.parse(data["body"]);
          this.datosBuscar = this.searchParametros.parametrosItems;
        },
        err => {
          console.log(err);
        }
      );

    this.buscar = true;
    this.eliminar = true;
    this.historico = false;
  }

  isEliminar() {
    this.bodyDelete.modulo = this.filaSelecionadaTabla.modulo;
    this.bodyDelete.parametro = this.filaSelecionadaTabla.parametro;
    this.bodyDelete.valor = this.filaSelecionadaTabla.valor;
    this.bodyDelete.idInstitucion = this.filaSelecionadaTabla.idInstitucion;

    this.sigaServices.post("parametros_delete", this.bodyDelete).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      },
      () => {
        this.isBuscar();
        this.table.reset();
        this.eliminar = true;
      }
    );
  }

  isGuardar(event, dato) {
    this.bodyUpdate.idInstitucion = dato.idInstitucion;
    this.bodyUpdate.modulo = dato.modulo;
    this.bodyUpdate.parametro = dato.parametro;
    this.bodyUpdate.valor = event.target.value;
    this.bodyUpdate.idRecurso = dato.idRecurso;
    this.sigaServices.post("parametros_update", this.bodyUpdate).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      },
      () => {
        this.isBuscar();
        this.table.reset();
        this.eliminar = true;
      }
    );
  }

  isHistorico() {
    if (this.selectedModulo != undefined) {
      this.bodyHistorico.modulo = this.selectedModulo;
    } else this.bodyHistorico.modulo = "";

    if (this.valorCheckParametros == true) {
      this.bodyHistorico.parametrosGenerales = "S";
    } else {
      this.bodyHistorico.parametrosGenerales = "N";
    }

    this.sigaServices
      .postPaginado("parametros_historico", "?numPagina=1", this.bodyHistorico)
      .subscribe(
        data => {
          console.log(data);

          this.historicoParametros = JSON.parse(data["body"]);
          this.datosHistorico = this.historicoParametros.parametrosItems;
        },
        err => {
          console.log(err);
        },
        () => {
          this.buscar = false;
          this.historico = true;
          this.eliminar = true;
        }
      );
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onRowSelect(event) {
    if (event.data.idInstitucion != 0) {
      this.eliminar = false;
    } else this.eliminar = true;
  }

  isHabilitadoEliminar() {
    return this.eliminar;
  }

  almacenaValorEditandose(event) {
    this.modificandoValorFila = event.target.value;
  }

  almacenaValorActual(valorActual) {
    this.almacenaValorActual = valorActual;
  }
}

export class ComboItem {
  label: String;
  value: String;
  constructor() {}
}
