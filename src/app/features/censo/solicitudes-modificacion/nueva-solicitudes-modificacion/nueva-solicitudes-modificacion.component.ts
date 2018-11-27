import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import { SolicitudesModificacionItem } from "../../../../models/SolicitudesModificacionItem";
import { SelectItem } from "primeng/components/common/api";
import { Location } from "@angular/common";
import { esCalendar } from "../../../../utils/calendar";
import { SigaServices } from "../../../../_services/siga.service";
import { DatosDireccionesObject } from "../../../../models/DatosDireccionesObject";
import { DatosDireccionesItem } from "../../../../models/DatosDireccionesItem";
import { SoliModiDireccionesItem } from "../../../../models/SoliModiDireccionesItem";
import { SoliModTableItem } from "../../../../models/SoliModiTableItem";
import { TranslateService } from "../../../../commons/translate/translation.service";

@Component({
  selector: "app-nueva-solicitudes-modificacion",
  templateUrl: "./nueva-solicitudes-modificacion.component.html",
  styleUrls: ["./nueva-solicitudes-modificacion.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NuevaSolicitudesModificacionComponent implements OnInit {
  body: SolicitudesModificacionItem = new SolicitudesModificacionItem();
  bodySoliModDirecciones: SoliModiDireccionesItem = new SoliModiDireccionesItem();
  bodyDirecciones: SoliModiDireccionesItem = new SoliModiDireccionesItem();
  es: any = esCalendar;

  disableButton: boolean = false;
  showCard: boolean = true;
  progressSpinner: boolean = false;

  tipo: SelectItem[];
  selectedTipo: any;

  estado: SelectItem[];
  selectedEstado: any;

  @ViewChild("table")
  table;
  selectedDatos;
  cols: any = [];
  rowsPerPage: any = [];
  data: SoliModTableItem[] = [];
  textAddressTranslations: String[];
  numSelected: number = 0;
  selectedItem: number = 10;

  constructor(
    private location: Location,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.getDataTable();

    if (sessionStorage.getItem("rowData") != null) {
      this.body = JSON.parse(sessionStorage.getItem("rowData"));

      if (this.body.estado == "REALIZADA" || this.body.estado == "DENEGADA") {
        this.disableButton = true;
      }

      // // Datos Direcciones
      if ((this.body.tipoModificacion = "30")) {
        // Llamar a los dos servicios y a un getTabla distinto
        this.getTranslationsForAddresses();
        this.getSolModAddresses(this.body);
      }
    }
  }

  // Métodos necesarios para la tabla
  getDataTable() {
    this.cols = [
      {
        field: "texto",
        header: "busquedaSanciones.detalleSancion.texto.literal"
      },
      {
        field: "estado",
        header: "censo.busquedaSolicitudesModificacion.literal.estado"
      },
      {
        field: "modificacion",
        header: "solicitudModificacion.especifica.modificacion.literal"
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

  // DIRECCIONES
  getTranslationsForAddresses() {
    this.textAddressTranslations = [
      "censo.datosDireccion.literal.pais2",
      "censo.datosDireccion.literal.provincia",
      "censo.consultaDirecciones.literal.poblacion",
      "solicitudModificacion.especifica.poblacionExtranjera.literal",
      "censo.ws.literal.codigopostal",
      "solicitudModificacion.especifica.domicilio.literal",
      "censo.ws.literal.telefono",
      "censo.ws.literal.fax",
      "censo.datosDireccion.literal.correo",
      "solicitudModificacion.especifica.paginaWeb.literal"
    ];
  }

  getSolModAddresses(idSolicitud) {
    this.sigaServices
      .postPaginado(
        "solicitudModificacion_searchSolModifDatosDireccionesDetail",
        "?numPagina=1",
        idSolicitud
      )
      .subscribe(
        data => {
          this.bodySoliModDirecciones = JSON.parse(data["body"]);
          console.log("SOL DIR", this.bodySoliModDirecciones);
        },
        err => {},
        () => {
          this.body.codigo = this.bodySoliModDirecciones.idDireccion;
          this.body.idPersona = this.bodySoliModDirecciones.idPersona;
          this.getDataAddressRequest(this.body);
        }
      );
  }

  getDataAddressRequest(body) {
    this.sigaServices
      .postPaginado(
        "solicitudModificacion_searchDirecciones",
        "?numPagina=1",
        body
      )
      .subscribe(
        data => {
          this.bodyDirecciones = JSON.parse(data["body"]);
          console.log("DIR", this.bodyDirecciones);
        },
        err => {},
        () => {
          this.data = [
            {
              texto: this.textAddressTranslations[0],
              estado: this.bodyDirecciones.pais,
              modificacion: this.bodySoliModDirecciones.pais
            },
            {
              texto: this.textAddressTranslations[1],
              estado: this.bodyDirecciones.provincia,
              modificacion: this.bodySoliModDirecciones.provincia
            },
            {
              texto: this.textAddressTranslations[2],
              estado: this.bodyDirecciones.poblacion,
              modificacion: this.bodySoliModDirecciones.poblacion
            },
            {
              texto: this.textAddressTranslations[3],
              estado: this.bodyDirecciones.poblacionExtranjera,
              modificacion: this.bodySoliModDirecciones.poblacionExtranjera
            },
            {
              texto: this.textAddressTranslations[4],
              estado: this.bodyDirecciones.codigoPostal,
              modificacion: this.bodySoliModDirecciones.codigoPostal
            },
            {
              texto: this.textAddressTranslations[5],
              estado: this.bodyDirecciones.domicilio,
              modificacion: this.bodySoliModDirecciones.domicilio
            },
            {
              texto: this.textAddressTranslations[6],
              estado: this.bodyDirecciones.telefono,
              modificacion: this.bodySoliModDirecciones.telefono
            },
            {
              texto: this.textAddressTranslations[7],
              estado: this.bodyDirecciones.movil,
              modificacion: this.bodySoliModDirecciones.movil
            },
            {
              texto: this.textAddressTranslations[8],
              estado: this.bodyDirecciones.fax,
              modificacion: this.bodySoliModDirecciones.fax
            },
            {
              texto: this.textAddressTranslations[9],
              estado: this.bodyDirecciones.correoElectronico,
              modificacion: this.bodySoliModDirecciones.correoElectronico
            },
            {
              texto: this.textAddressTranslations[10],
              estado: this.bodyDirecciones.paginaWeb,
              modificacion: this.bodySoliModDirecciones.paginaWeb
            }
          ];
        }
      );
  }

  onHideCard() {
    this.showCard = !this.showCard;
  }

  return() {
    this.location.back();
  }

  // PROCESS REQUEST AND DENY REQUEST
  processRequest() {
    if (this.body.tipoModificacion == "10") {
      this.updateRequestState(
        "solicitudModificacion_processSolModifDatosGenerales"
      );
    } else if (this.body.tipoModificacion == "20") {
      this.updateRequestState("solicitudModificacion_processSolModif");
    } else if (this.body.tipoModificacion == "30") {
      this.updateRequestState(
        "solicitudModificacion_processSolModifDatosDirecciones"
      );
    } else if (this.body.tipoModificacion == "35") {
      this.updateRequestState(
        "solicitudModificacion_processSolModifDatosUseFoto"
      );
    } else if (this.body.tipoModificacion == "40") {
      this.updateRequestState(
        "solicitudModificacion_processSolModifDatosBancarios"
      );
    } else if (this.body.tipoModificacion == "50") {
      this.updateRequestState(
        "solicitudModificacion_processSolModifDatosCurriculares"
      );
    } else if (this.body.tipoModificacion == "70") {
      this.updateRequestState(
        "solicitudModificacion_processSolModifDatosFacturacion"
      );
    } else if (this.body.tipoModificacion == "80") {
      this.updateRequestState("solicitudModificacion_processSolModif");
    } else if (this.body.tipoModificacion == "90") {
      this.updateRequestState(
        "solicitudModificacion_processSolModifDatosExpedientes"
      );
    } else if (this.body.tipoModificacion == "95") {
      this.updateRequestState("solicitudModificacion_processSolModif");
    }
  }

  denyRequest() {
    if (this.body.tipoModificacion == "10") {
      this.updateRequestState(
        "solicitudModificacion_denySolModifDatosGenerales"
      );
    } else if (this.body.tipoModificacion == "20") {
      this.updateRequestState("solicitudModificacion_denySolModif");
    } else if (this.body.tipoModificacion == "30") {
      this.updateRequestState(
        "solicitudModificacion_denySolModifDatosDirecciones"
      );
    } else if (this.body.tipoModificacion == "35") {
      this.updateRequestState("solicitudModificacion_denySolModifDatosUseFoto");
    } else if (this.body.tipoModificacion == "40") {
      this.updateRequestState(
        "solicitudModificacion_denySolModifDatosBancarios"
      );
    } else if (this.body.tipoModificacion == "50") {
      this.updateRequestState(
        "solicitudModificacion_denySolModifDatosCurriculares"
      );
    } else if (this.body.tipoModificacion == "70") {
      this.updateRequestState(
        "solicitudModificacion_denySolModifDatosFacturacion"
      );
    } else if (this.body.tipoModificacion == "80") {
      this.updateRequestState("solicitudModificacion_denySolModif");
    } else if (this.body.tipoModificacion == "90") {
      this.updateRequestState(
        "solicitudModificacion_denySolModifDatosExpedientes"
      );
    } else if (this.body.tipoModificacion == "95") {
      this.updateRequestState("solicitudModificacion_denySolModif");
    }
  }

  updateRequestState(path: string) {
    this.progressSpinner = true;

    this.sigaServices.post(path, this.body).subscribe(
      data => {
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.return();
      }
    );
  }

  // PARA LA TABLA
  enablePagination() {
    if (!this.data || this.data.length == 0) return false;
    else return true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
}
