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
import { ComboItem } from "../../../models/ComboItem";
@Component({
  selector: "app-solicitudes-modificacion",
  templateUrl: "./solicitudes-modificacion.component.html",
  styleUrls: ["./solicitudes-modificacion.component.scss"]
})
export class SolicitudesModificacionComponent implements OnInit {
  showCard: boolean = true;
  isLetrado: boolean;
  isSearch: boolean = false;
  displayGeneralRequest: boolean = false;
  disableButton: boolean = false;
  disableNew: boolean = true;
  isNew: boolean = false;
  progressSpinner: boolean = false;

  tipo: SelectItem[];
  tipoSolGeneral: SelectItem[];
  estado: SelectItem[];

  es: any = esCalendar;

  tipoModificacionSolGeneral: String;
  motivoSolGeneral: String;

  bodySearch: SolicitudesModificacionObject = new SolicitudesModificacionObject();
  body: SolicitudesModificacionItem = new SolicitudesModificacionItem();

  @ViewChild("table")
  table;
  selectedDatos;
  cols: any = [];
  rowsPerPage: any = [];
  data: any[] = [];
  selectedItem: number = 10;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    // Comprobamos si es colegiado o no
    this.getLetrado();

    // Llamada al rest de tipo modificación
    this.sigaServices.get("solicitudModificacion_tipoModificacion").subscribe(
      n => {
        this.tipo = n.combooItems;
        this.tipoSolGeneral = n.combooItems;
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

    this.getDataTable();

    if (sessionStorage.getItem("search") != null) {
      this.isSearch = true;
      this.data = JSON.parse(sessionStorage.getItem("search"));
      sessionStorage.removeItem("search");
    }
  }

  onHideCard() {
    this.showCard = !this.showCard;
  }

  getLetrado() {
    let isLetrado: ComboItem;
    this.sigaServices.get("getLetrado").subscribe(
      data => {
        isLetrado = data;
        if (isLetrado.value == "S") {
          sessionStorage.setItem("isLetrado", "true");
          this.isLetrado = true;
        } else {
          sessionStorage.setItem("isLetrado", "false");
          this.isLetrado = false;
        }
      },
      err => {
        sessionStorage.setItem("isLetrado", "true");
        this.isLetrado = true;
        console.log(err);
      }
    );
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

  // Métodos botones del filtro
  newElement() {
    this.displayGeneralRequest = true;
    this.isNew = true;
    this.disableNew = false;
  }

  // SEARCH
  search() {
    if (
      (this.body.tipoModificacion == null &&
        this.body.tipoModificacion == undefined) ||
      this.body.tipoModificacion == ""
    ) {
      this.searchRequest("solicitudModificacion_searchModificationRequest");
    } else if (this.body.tipoModificacion == "10") {
      this.searchRequest("solicitudModificacion_searchSolModifDatosGenerales");
    } else if (this.body.tipoModificacion == "20") {
      this.searchRequest("solicitudModificacion_searchSolModif");
    } else if (this.body.tipoModificacion == "30") {
      this.searchRequest(
        "solicitudModificacion_searchSolModifDatosDirecciones"
      );
    } else if (this.body.tipoModificacion == "35") {
      this.searchRequest("solicitudModificacion_searchSolModifDatosUseFoto");
    } else if (this.body.tipoModificacion == "40") {
      this.searchRequest("solicitudModificacion_searchSolModifDatosBancarios");
    } else if (this.body.tipoModificacion == "50") {
      this.searchRequest(
        "solicitudModificacion_searchSolModifDatosCurriculares"
      );
    } else if (this.body.tipoModificacion == "70") {
      this.searchRequest(
        "solicitudModificacion_searchSolModifDatosFacturacion"
      );
    } else if (this.body.tipoModificacion == "80") {
      this.searchRequest("solicitudModificacion_searchSolModif");
    } else if (this.body.tipoModificacion == "90") {
      this.searchRequest(
        "solicitudModificacion_searchSolModifDatosExpedientes"
      );
    } else if (this.body.tipoModificacion == "99") {
      this.searchRequest("solicitudModificacion_searchSolModif");
    }
  }

  searchRequest(path: string) {
    this.progressSpinner = true;
    this.isSearch = true;

    this.sigaServices.postPaginado(path, "?numPagina=1", this.body).subscribe(
      data => {
        this.bodySearch = JSON.parse(data["body"]);
        this.data = this.bodySearch.solModificacionItems;

        // Almacenamos los resultados de la búsqueda
        sessionStorage.setItem("search", JSON.stringify(this.data));
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  // PROCESS REQUEST AND DENY REQUEST
  processRequest(selectedDatos) {
    this.body.idSolicitud = selectedDatos.idSolicitud;
    this.updateRequestState(
      "solicitudModificacion_processGeneralModificationRequest"
    );
  }

  denyRequest(selectedDatos) {
    this.body.idSolicitud = selectedDatos.idSolicitud;
    this.updateRequestState(
      "solicitudModificacion_denyGeneralModificationRequest"
    );
  }

  updateRequestState(path: string) {
    this.progressSpinner = true;
    this.isSearch = true;

    this.sigaServices.post(path, this.body).subscribe(
      data => {
        this.progressSpinner = false;
        this.search();
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.closeDialog();
      }
    );
  }

  restore() {
    this.body.tipoModificacion = "";
    this.body.estado = "";
    this.body.fechaDesde = null;
    this.body.fechaHasta = null;
  }

  // Métodos gestionar tabla
  enablePagination() {
    if (!this.data || this.data.length == 0) return false;
    else return true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onSelectRow(selectedDatos) {
    if (selectedDatos.especifica == "1") {
      sessionStorage.setItem("rowData", JSON.stringify(selectedDatos));
      this.router.navigate(["/nuevaSolicitudesModificacion"]);
    } else {
      // abrir popup MODO CONSULTA
      this.displayGeneralRequest = true;
      this.isNew = false;

      // Rellenamos los datos
      this.tipoModificacionSolGeneral = selectedDatos.tipoModificacion;
      this.tipoSolGeneral = [
        {
          label: selectedDatos.tipoModificacion,
          value: selectedDatos.idTipoModificacion
        }
      ];

      this.motivoSolGeneral = selectedDatos.motivo;
      if (selectedDatos.estado == "PENDIENTE") {
        this.disableButton = false;
      } else {
        this.disableButton = true;
      }
    }
  }

  // POPUP
  closeDialog() {
    this.displayGeneralRequest = false;

    if (this.isNew) {
      this.tipoModificacionSolGeneral = "";
      this.motivoSolGeneral = "";
    }
  }

  saveData() {
    this.progressSpinner = true;

    this.body.idTipoModificacion = this.tipoModificacionSolGeneral;
    this.body.motivo = this.motivoSolGeneral;
    this.sigaServices
      .post("solicitudModificacion_insertGeneralModificationRequest", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.search();
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.closeDialog();
          this.isNew = false;
        }
      );
  }
}
