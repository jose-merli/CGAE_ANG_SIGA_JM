import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import {
  Message,
  SelectItem,
  ConfirmationService
} from "primeng/components/common/api";
import { esCalendar } from "../../../utils/calendar";
import { SigaServices } from "../../../_services/siga.service";
import { SolicitudesModificacionItem } from "../../../models/SolicitudesModificacionItem";
import { TranslateService } from "../../../commons/translate/translation.service";
import { Router } from "@angular/router";
import { SolicitudesModificacionObject } from "../../../models/SolicitudesModificacionObject";

@Component({
  selector: "app-modificacion-datos",
  templateUrl: "./modificacion-datos.component.html",
  styleUrls: ["./modificacion-datos.component.scss"]
})
export class ModificacionDatosComponent implements OnInit {
  showCard: boolean = true;
  progressSpinner: boolean = false;
  selectMultiple: boolean = false;
  selectAll: boolean = false;
  isSearch: boolean = false;
  isNew: boolean = false;
  isNewMode: boolean = false;
  isOk: boolean = false;
  esColegiado: boolean = false;

  msgs: Message[];

  tipo: SelectItem[];

  estado: SelectItem[];

  es: any = esCalendar;

  @ViewChild("table")
  table;
  selectedDatos;
  cols: any = [];
  rowsPerPage: any = [];
  data: any[];
  dataNewElement: any[];
  numSelected: number = 0;
  selectedItem: number = 10;

  bodySearch: SolicitudesModificacionObject = new SolicitudesModificacionObject();
  body: SolicitudesModificacionItem = new SolicitudesModificacionItem();
  newBody: SolicitudesModificacionItem;

  fechaDesde: Date;
  fechaHasta: Date;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Hay que ver si es colegio o coelgiado
    this.esColegiado = false;
    // dummy
    this.body.fechaDesde = null;
    this.body.fechaHasta = null;
    // Llamada al rest de tipo modificación
    this.sigaServices.get("solicitudModificacion_tipoModificacion").subscribe(
      n => {
        this.tipo = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
    // Llamada al rest de estado
    this.sigaServices.get("solicitudModificacion_estado").subscribe(
      n => {
        this.estado = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    // Datos dummy
    // this.data = [
    //   {
    //     estado: "Activo",
    //     idSolicitud: "1",
    //     tipoModificacion: "Datos Bancarios",
    //     numColegiado: "049545",
    //     nombre: "Juanma",
    //     fecha: new Date(),
    //     motivo: "reasignación"
    //   },
    //   {
    //     estado: "No activo",
    //     idSolicitud: "2",
    //     tipoModificacion: "Datos Curriculares",
    //     numColegiado: "049904",
    //     nombre: "Mercedes",
    //     fecha: new Date(),
    //     motivo: "baja"
    //   }
    // ];

    this.getDataTable();
  }

  getDataTable() {
    this.cols = [
      {
        field: "estado",
        header: "censo.busquedaSolicitudesModificacion.literal.estado"
      },
      {
        field: "idSolicitud",
        header: "censo.resultadosSolicitudesModificacion.literal.idSolicitud"
      },
      {
        field: "tipoModificacion",
        header: "censo.resultadosSolicitudesTextoLibre.literal.tipoModificacion"
      },
      {
        field: "numColegiado",
        header: "censo.resultadosSolicitudesModificacion.literal.nColegiado"
      },
      {
        field: "nombre",
        header: "censo.resultadosSolicitudesModificacion.literal.Nombre"
      },
      {
        field: "fechaAlta",
        header: "censo.resultadosSolicitudesModificacion.literal.fecha"
      },
      {
        field: "motivo",
        header: "censo.resultadosSolicitudesModificacion.literal.descripcion"
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

  onHideCard() {
    this.showCard = !this.showCard;
  }

  // Métodos botones del filtro
  newElement() {
    this.isNewMode = true;
    sessionStorage.setItem("isNewMode", JSON.stringify(this.isNewMode));
    sessionStorage.setItem("esColegiado", JSON.stringify(this.esColegiado));

    this.router.navigate(["/nuevaSolicitudesModificacion"]);
  }

  search() {
    // Llamada al rest
    this.progressSpinner = true;
    this.isSearch = true;
    this.selectAll = false;
    this.selectMultiple = false;
    this.selectedDatos = "";

    this.body.fechaDesde = new Date(this.fechaDesde);
    this.body.fechaHasta = new Date(this.fechaHasta);

    this.sigaServices
      .postPaginado(
        "solicitudModificacion_searchModificationRequest",
        "?numPagina=1",
        this.body
      )
      .subscribe(
        data => {
          this.bodySearch = JSON.parse(data["body"]);
          this.data = this.bodySearch.solModificacionItems;
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
  }

  restore() {
    this.body.tipoModificacion = "";
    this.body.estado = "";
    this.fechaDesde = null;
    this.fechaHasta = null;
  }

  // Métodos para los mensajitos
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  // Métodos gestionar tabla
  enablePagination() {
    if (!this.data || this.data.length == 0) return false;
    else return true;
  }

  redirectTo(selectedDatos) {
    if (!this.selectMultiple) {
      this.isNewMode = false;
      sessionStorage.setItem("isNewMode", JSON.stringify(this.isNewMode));
      sessionStorage.setItem("rowData", JSON.stringify(selectedDatos));
      sessionStorage.setItem("esColegiado", JSON.stringify(this.esColegiado));

      this.router.navigate(["/nuevaSolicitudesModificacion"]);
    } else {
      this.numSelected = this.selectedDatos.length;
    }
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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  //Métodos gestionar datos tabla
  processRequest() {
    this.search();
  }

  refuseRequest() {
    let mess =
      "Va a denegar las solicitudes, ¿Está seguro que desea continuar?";

    this.confirmationService.confirm({
      message: mess,
      accept: () => {
        this.msgs = [
          {
            severity: "info",
            detail: this.translateService.instant(
              "general.message.accion.realizada"
            )
          }
        ];

        this.selectedDatos = [];
        this.selectMultiple = false;
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];

        this.selectedDatos = [];
        this.selectMultiple = false;
      }
    });
  }

  // Operaciones nuevo
  onChangeForm() {
    if (
      (this.body.estado == "" ||
        this.body.estado == undefined ||
        this.onlySpaces(this.body.estado)) &&
      (this.body.idSolicitud == undefined || this.body.idSolicitud == "") &&
      (this.body.tipoModificacion == undefined ||
        this.body.tipoModificacion == "" ||
        this.onlySpaces(this.body.tipoModificacion)) &&
      (this.body.numColegiado == "" || this.body.numColegiado == undefined) &&
      (this.body.nombre == "" ||
        this.body.nombre == undefined ||
        this.onlySpaces(this.body.nombre)) &&
      (this.body.fechaAlta == null || this.body.fechaAlta == undefined) &&
      (this.body.descripcion == "" ||
        this.body.descripcion == undefined ||
        this.onlySpaces(this.body.descripcion))
    ) {
      this.isOk = true;
    } else {
      this.isOk = false;
    }
  }

  onlySpaces(str) {
    let i = 0;
    var ret;
    ret = true;
    while (i < str.length) {
      if (str[i] != " ") {
        ret = false;
      }
      i++;
    }
    return ret;
  }

  cancelAction() {
    if (this.isSearch == true) {
      this.table.reset();
    }

    this.search();
  }
}
