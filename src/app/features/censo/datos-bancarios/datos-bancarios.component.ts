import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { DataTable } from "primeng/datatable";

import { ConfirmationService, Message } from "primeng/components/common/api";
import { TranslateService } from "../../../commons/translate/translation.service";

import { SigaServices } from "./../../../_services/siga.service";

import { DatosBancariosItem } from "./../../../../app/models/DatosBancariosItem";
import { DatosBancariosObject } from "./../../../../app/models/DatosBancariosObject";

@Component({
  selector: "app-datos-bancarios",
  templateUrl: "./datos-bancarios.component.html",
  styleUrls: ["./datos-bancarios.component.scss"]
})
export class DatosBancariosComponent implements OnInit {
  openFicha: boolean = false;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  progressSpinner: boolean = false;
  historico: boolean = false;

  msgs: Message[];

  usuarioBody: any[];
  cols: any = [];
  rowsPerPage: any = [];

  body: DatosBancariosItem = new DatosBancariosItem();
  bodySearch: DatosBancariosObject = new DatosBancariosObject();

  numSelected: number = 0;
  selectedItem: number = 10;

  idPersona: String;
  customLabel: String;
  nif: String;

  @ViewChild("table") table: DataTable;
  selectedDatos;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    this.idPersona = this.usuarioBody[0].idPersona;
    this.nif = this.usuarioBody[0].nif;

    this.body.idPersona = this.idPersona;
    this.body.nifTitular = this.nif;

    this.cargarDatosBancarios();

    this.cols = [
      {
        field: "titular",
        header: "Titular"
      },
      {
        field: "iban",
        header: "Código de cuenta (IBAN)"
      },
      {
        field: "bic",
        header: "Banco (BIC)"
      },
      {
        field: "uso",
        header: "Uso"
      },
      {
        field: "fechaFirmaServicios",
        header: "Fecha firma del mandato de servicios"
      },
      {
        field: "fechaFirmaProductos",
        header: "Fecha firma del mandato de productos"
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

  cargarDatosBancarios() {
    this.historico = false;

    if (this.body == undefined) {
      this.body = new DatosBancariosItem();
    }

    this.body.historico = false;
    this.body.idPersona = this.idPersona;
    this.body.nifTitular = this.nif;

    this.buscarDatosBancarios();

    if (!this.historico) {
      this.selectMultiple = false;
      this.selectAll = false;
    }
  }

  cargarHistorico() {
    this.historico = true;

    if (this.body == undefined) {
      this.body = new DatosBancariosItem();
    }

    this.body.historico = true;
    this.body.idPersona = this.idPersona;

    this.buscarDatosBancarios();
  }

  buscarDatosBancarios() {
    this.sigaServices
      .postPaginado("datosBancarios_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodySearch = JSON.parse(data["body"]);
          this.body = this.bodySearch.datosBancariosItem[0];
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodySearch.error.description));
          console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  activarPaginacion() {
    if (
      !this.bodySearch.datosBancariosItem ||
      this.bodySearch.datosBancariosItem.length == 0
    )
      return false;
    else return true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.numSelected = this.bodySearch.datosBancariosItem.length;
      this.selectMultiple = false;
      this.selectedDatos = this.bodySearch.datosBancariosItem;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.numSelected = 0;
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  redireccionar(dato) {
    if (!this.selectMultiple && !this.historico) {
      var enviarDatos = null;
      if (dato && dato.length > 0) {
        enviarDatos = dato[0];
        sessionStorage.setItem("idCuenta", enviarDatos.idCuenta);
        sessionStorage.setItem("editar", "true");
      } else {
        sessionStorage.setItem("editar", "false");
      }

      this.router.navigate(["/consultarDatosBancarios"]);
    } else {
      this.numSelected = this.selectedDatos.length;
    }
  }

  confirmarEliminar(selectedDatos) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";
    console.log("AQUI");
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.eliminarRegistro(selectedDatos);
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

  eliminarRegistro(selectedDatos) {
    this.progressSpinner = true;

    let item = new DatosBancariosItem();

    item.idCuentas = [];
    item.idPersona = this.idPersona;

    selectedDatos.forEach(element => {
      item.idCuentas.push(element.idCuenta);
    });

    // item.idPersona = this.idPersona;
    // item.datosBancariosItem.forEach(
    //   (value: DatosBancariosItem, key: number) => {
    //     value.idPersona = this.idPersona;
    //   }
    // );

    this.sigaServices.post("datosBancarios_delete", item).subscribe(
      data => {
        this.progressSpinner = false;
        if (selectedDatos.length == 1) {
          this.showSuccess(
            this.translateService.instant("messages.deleted.success")
          );
        } else {
          this.showSuccess(
            selectedDatos.length +
              " " +
              this.translateService.instant("messages.deleted.selected.success")
          );
        }
      },
      error => {
        console.log(error);
        this.progressSpinner = false;
      },
      () => {
        this.historico = true;
        this.cargarDatosBancarios();
      }
    );
  }

  abrirFicha() {
    this.openFicha = !this.openFicha;
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }
}
