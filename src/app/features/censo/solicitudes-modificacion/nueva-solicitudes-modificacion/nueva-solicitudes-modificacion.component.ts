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
import { SoliModiDireccionesItem } from "../../../../models/SoliModiDireccionesItem";
import { SoliModTableItem } from "../../../../models/SoliModiTableItem";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { SoliModifFotoItem } from "../../../../models/SoliModifFotoItem";
import { SoliModifDatosBasicosItem } from "../../../../models/SoliModifDatosBasicosItem";
import { SolModifDatosCurricularesItem } from "../../../../models/SolModifDatosCurricularesItem";
import { SolModifDatosBancariosItem } from "../../../../models/SolModifDatosBancariosItem";

@Component({
  selector: "app-nueva-solicitudes-modificacion",
  templateUrl: "./nueva-solicitudes-modificacion.component.html",
  styleUrls: ["./nueva-solicitudes-modificacion.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NuevaSolicitudesModificacionComponent implements OnInit {
  body: SolicitudesModificacionItem = new SolicitudesModificacionItem();

  // DIRECCIONES
  bodySoliModDirecciones: SoliModiDireccionesItem = new SoliModiDireccionesItem();
  bodyDirecciones: SoliModiDireccionesItem = new SoliModiDireccionesItem();

  // FOTO
  bodySolModiFoto: SoliModifFotoItem = new SoliModifFotoItem();
  bodyFoto: SoliModifFotoItem = new SoliModifFotoItem();

  //DATOS BÁSICOS
  bodySolDatosBasicos: SoliModifDatosBasicosItem = new SoliModifDatosBasicosItem();
  bodyDatosBasicos: SoliModifDatosBasicosItem = new SoliModifDatosBasicosItem();

  // DATOS CURRICULARES
  bodySolDatosCV: SolModifDatosCurricularesItem = new SolModifDatosCurricularesItem();
  bodyDatosCV: SolModifDatosCurricularesItem = new SolModifDatosCurricularesItem();

  // DATOS BANCARIOS
  bodySolDatosBancarios: SolModifDatosBancariosItem = new SolModifDatosBancariosItem();
  bodyDatosBancarios: SolModifDatosBancariosItem = new SolModifDatosBancariosItem();

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
  textPhotoTranslations: String[];
  textBasicDataTranslations: String[];
  textCVDataTranslations: String[];
  textBankDataTranslations: String[];
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
      console.log("BODY", this.body);
      if (this.body.estado == "REALIZADA" || this.body.estado == "DENEGADA") {
        this.disableButton = true;
      }

      if (this.body.idTipoModificacion == "30") {
        // Llamar a los dos servicios y a un getTabla distinto
        this.getTranslationsForAddresses();
        this.getSolModAddresses(this.body);
      } else if (this.body.idTipoModificacion == "35") {
        this.getTranslationsForPhoto();
        this.getSolModPhoto(this.body);
      } else if (this.body.idTipoModificacion == "10") {
        this.getTranslationsForBasicData();
        this.getSolModBasicData(this.body);
      } else if (this.body.idTipoModificacion == "40") {
        this.getTranslationsForBankData();
        this.getSolModBankData(this.body);
      } else if (this.body.idTipoModificacion == "50") {
        this.getTranslationsForCVData();
        this.getSolModCVData(this.body);
      }

      //  sessionStorage.removeItem("rowData");
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

  // FOTO
  getTranslationsForPhoto() {
    this.textPhotoTranslations = [
      "solicitudModificacion.especifica.exportarFoto.literal"
    ];
  }

  getSolModPhoto(idSolicitud) {
    this.sigaServices
      .postPaginado(
        "solicitudModificacion_searchSolModifDatosUseFotoDetail",
        "?numPagina=1",
        idSolicitud
      )
      .subscribe(
        data => {
          this.bodySolModiFoto = JSON.parse(data["body"]);
          console.log("SOL FOTO", this.bodySolModiFoto);
        },
        err => {},
        () => {
          this.body.idPersona = this.bodySolModiFoto.idPersona;
          this.getPhotoRequest(this.body);
        }
      );
  }

  getPhotoRequest(body) {
    this.sigaServices
      .postPaginado(
        "solicitudModificacion_searchDatosUseFotoDetail",
        "?numPagina=1",
        body
      )
      .subscribe(
        data => {
          this.bodyFoto = JSON.parse(data["body"]);
          console.log("FOTO", this.bodyFoto);
        },
        err => {},
        () => {
          this.data = [
            {
              texto: this.textPhotoTranslations[0],
              estado: this.bodyFoto.expFoto,
              modificacion: this.bodySolModiFoto.expFoto
            }
          ];
        }
      );
  }

  // DATOS BÁSICOS
  getTranslationsForBasicData() {
    this.textBasicDataTranslations = [
      "censo.fichaCliente.situacion.idiomaPref"
    ];
  }

  getSolModBasicData(idSolicitud) {
    this.sigaServices
      .postPaginado(
        "solicitudModificacion_searchSolModifDatosGeneralesDetail",
        "?numPagina=1",
        idSolicitud
      )
      .subscribe(
        data => {
          this.bodySolDatosBasicos = JSON.parse(data["body"]);
          console.log("SOL BASICOS", this.bodySolDatosBasicos);
        },
        err => {},
        () => {
          this.body.idPersona = this.bodySolDatosBasicos.idPersona;
          this.getBasicDataRequest(this.body);
        }
      );
  }

  getBasicDataRequest(body) {
    this.sigaServices
      .postPaginado(
        "solicitudModificacion_searchDatosGeneralesDetail",
        "?numPagina=1",
        body
      )
      .subscribe(
        data => {
          this.bodyDatosBasicos = JSON.parse(data["body"]);
          console.log("DATOS BASICOS", this.bodyDatosBasicos);
        },
        err => {},
        () => {
          this.data = [
            {
              texto: this.textBasicDataTranslations[0],
              estado: this.bodyDatosBasicos.idioma,
              modificacion: this.bodySolDatosBasicos.idioma
            }
          ];
        }
      );
  }

  // DATOS CURRICULARES
  getTranslationsForCVData() {
    this.textCVDataTranslations = [
      "censo.busquedaClientesAvanzada.literal.categoriaCV",
      "censo.tipoCurricular.descripcion.literal",
      "censo.busquedaClientesAvanzada.literal.subtiposCV",
      "censo.busquedaSolicitudesTextoLibre.literal.fechaDesde",
      "censo.busquedaSolicitudesTextoLibre.literal.fechaHasta",
      "general.description"
    ];
  }

  getSolModCVData(idSolicitud) {
    this.sigaServices
      .postPaginado(
        "solicitudModificacion_searchSolModifDatosCurricularesDetail",
        "?numPagina=1",
        idSolicitud
      )
      .subscribe(
        data => {
          this.bodySolDatosCV = JSON.parse(data["body"]);
          console.log("SOL CV", this.bodySolDatosCV);
        },
        err => {},
        () => {
          this.body.idPersona = this.bodySolDatosCV.idPersona;
          this.body.codigo = this.bodySolDatosCV.idCv;
          this.getDataCVRequest(this.body);
        }
      );
  }

  getDataCVRequest(body) {
    this.sigaServices
      .postPaginado(
        "solicitudModificacion_searchDatosCurricularesDetail",
        "?numPagina=1",
        body
      )
      .subscribe(
        data => {
          this.bodyDatosCV = JSON.parse(data["body"]);
          console.log("DATOS CV", this.bodyDatosCV);
        },
        err => {},
        () => {
          this.data = [
            {
              texto: this.textCVDataTranslations[0],
              estado: this.bodyDatosCV.categoriaCurricular,
              modificacion: this.bodySolDatosCV.categoriaCurricular
            },
            {
              texto: this.textCVDataTranslations[1],
              estado: this.bodyDatosCV.tipoCurricular,
              modificacion: this.bodySolDatosCV.tipoCurricular
            },
            {
              texto: this.textCVDataTranslations[2],
              estado: this.bodyDatosCV.subtiposCurriculares,
              modificacion: this.bodySolDatosCV.subtiposCurriculares
            },
            {
              texto: this.textCVDataTranslations[3],
              estado: this.bodyDatosCV.fechaDesde,
              modificacion: this.bodySolDatosCV.fechaDesde
            },
            {
              texto: this.textCVDataTranslations[4],
              estado: this.bodyDatosCV.fechaHasta,
              modificacion: this.bodySolDatosCV.fechaHasta
            },
            {
              texto: this.textCVDataTranslations[5],
              estado: this.bodyDatosCV.descripcion,
              modificacion: this.bodySolDatosCV.descripcion
            }
          ];
        }
      );
  }

  // DATOS BANCARIOS
  getTranslationsForBankData() {
    this.textBankDataTranslations = [
      "solicitudModificacion.especifica.abonoCargo.literal",
      "solicitudModificacion.especifica.digitoControl.literal",
      "solicitudModificacion.especifica.abonoJCS.literal",
      "solicitudModificacion.especifica.iban.literal",
      "solicitudModificacion.especifica.codigoSucursal.literal",
      "censo.alterMutua.literal.numeroCuenta",
      "facturacion.devolucionManual.titularDomiciliacion"
    ];
  }

  getSolModBankData(idSolicitud) {
    this.sigaServices
      .postPaginado(
        "solicitudModificacion_searchSolModifDatosBancariosDetail",
        "?numPagina=1",
        idSolicitud
      )
      .subscribe(
        data => {
          this.bodySolDatosBancarios = JSON.parse(data["body"]);
          console.log("SOL BANCARIOS", this.bodySolDatosBancarios);
        },
        err => {},
        () => {
          this.body.idPersona = this.bodySolDatosBancarios.idPersona;
          this.body.codigo = this.bodySolDatosBancarios.idCuenta;
          this.getBankDataRequest(this.body);
        }
      );
  }

  getBankDataRequest(body) {
    this.sigaServices
      .postPaginado(
        "solicitudModificacion_searchDatosBancariosDetail",
        "?numPagina=1",
        body
      )
      .subscribe(
        data => {
          this.bodyDatosBancarios = JSON.parse(data["body"]);
          console.log("DATOS BANCARIOS", this.bodyDatosBancarios);
        },
        err => {},
        () => {
          this.data = [
            {
              texto: this.textBankDataTranslations[0],
              estado: this.bodyDatosBancarios.abonoCargo,
              modificacion: this.bodySolDatosBancarios.abonoCargo
            },
            {
              texto: this.textBankDataTranslations[1],
              estado: this.bodyDatosBancarios.abonoJCS,
              modificacion: this.bodySolDatosBancarios.abonoJCS
            },
            {
              texto: this.textBankDataTranslations[2],
              estado: this.bodyDatosBancarios.codigoSucursal,
              modificacion: this.bodySolDatosBancarios.codigoSucursal
            },
            {
              texto: this.textBankDataTranslations[3],
              estado: this.bodyDatosBancarios.digitoControl,
              modificacion: this.bodySolDatosBancarios.digitoControl
            },
            {
              texto: this.textBankDataTranslations[4],
              estado: this.bodyDatosBancarios.iban,
              modificacion: this.bodySolDatosBancarios.iban
            },
            {
              texto: this.textBankDataTranslations[5],
              estado: this.bodyDatosBancarios.numeroCuenta,
              modificacion: this.bodySolDatosBancarios.numeroCuenta
            },
            {
              texto: this.textBankDataTranslations[6],
              estado: this.bodyDatosBancarios.titular,
              modificacion: this.bodySolDatosBancarios.titular
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
    if (this.body.idTipoModificacion == "10") {
      this.updateRequestState(
        "solicitudModificacion_processSolModifDatosGenerales"
      );
    } else if (this.body.idTipoModificacion == "30") {
      this.updateRequestState(
        "solicitudModificacion_processSolModifDatosDirecciones"
      );
    } else if (this.body.idTipoModificacion == "35") {
      this.updateRequestState(
        "solicitudModificacion_processSolModifDatosUseFoto"
      );
    } else if (this.body.idTipoModificacion == "40") {
      this.updateRequestState(
        "solicitudModificacion_processSolModifDatosBancarios"
      );
    } else if (this.body.idTipoModificacion == "50") {
      this.updateRequestState(
        "solicitudModificacion_processSolModifDatosCurriculares"
      );
    }
  }

  denyRequest() {
    if (this.body.idTipoModificacion == "10") {
      this.updateRequestState(
        "solicitudModificacion_denySolModifDatosGenerales"
      );
    } else if (this.body.idTipoModificacion == "30") {
      this.updateRequestState(
        "solicitudModificacion_denySolModifDatosDirecciones"
      );
    } else if (this.body.idTipoModificacion == "35") {
      this.updateRequestState("solicitudModificacion_denySolModifDatosUseFoto");
    } else if (this.body.idTipoModificacion == "40") {
      this.updateRequestState(
        "solicitudModificacion_denySolModifDatosBancarios"
      );
    } else if (this.body.idTipoModificacion == "50") {
      this.updateRequestState(
        "solicitudModificacion_denySolModifDatosCurriculares"
      );
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
        sessionStorage.setItem("processingPerformed", "true");
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
