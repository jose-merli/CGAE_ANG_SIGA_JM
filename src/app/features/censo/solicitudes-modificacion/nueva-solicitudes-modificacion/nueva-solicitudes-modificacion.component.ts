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
import { SoliModifFotoChangeItem } from "../../../../models/SoliModifFotoChangeItem";
import { SoliModifDatosBasicosItem } from "../../../../models/SoliModifDatosBasicosItem";
import { SolModifDatosCurricularesItem } from "../../../../models/SolModifDatosCurricularesItem";
import { SolModifDatosBancariosItem } from "../../../../models/SolModifDatosBancariosItem";
import { DomSanitizer } from "./../../../../../../node_modules/@angular/platform-browser";
import { DatosGeneralesItem } from "../../../../models/DatosGeneralesItem";

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

  // CHECK FOTO
  bodySolModiFoto: SoliModifFotoItem = new SoliModifFotoItem();
  bodyFoto: SoliModifFotoItem = new SoliModifFotoItem();

  // FOTO CAMBIO
  bodySolModiChangeFoto: SoliModifFotoChangeItem = new SoliModifFotoChangeItem();
  bodyChangeFoto: SoliModifFotoChangeItem = new SoliModifFotoChangeItem();

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
  isLetrado: boolean = false;
  imagenAnterior: any;
  msgs: any;

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

  mostrarAuditoria: boolean = false;
  showGuardarAuditoria: boolean = false;
  displayAuditoria: boolean = false;
  motivoAuditoria: string;
  solicitudFoto: boolean = false;
  constructor(
    private location: Location,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.progressSpinner = true;
    this.getDataTable();

    if (sessionStorage.getItem("rowData") != null) {
      this.body = JSON.parse(sessionStorage.getItem("rowData"));

      if (
        sessionStorage.getItem("isLetrado") != null &&
        sessionStorage.getItem("isLetrado") != undefined
      ) {
        this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
      }

      if (this.body.estado == "PENDIENTE" && !this.isLetrado) {
        this.disableButton = false;
      } else {
        this.disableButton = true;
      }

      if (this.body.idTipoModificacion == "30") {
        // Llamar a los dos servicios y a un getTabla distinto
        this.getTranslationsForAddresses();
        this.getSolModAddresses(this.body);
      } else if (
        this.body.idTipoModificacion == "35"
      ) {
        this.getTranslationsForPhoto();
        this.getSolModPhoto(this.body);
      } else if (
        this.body.idTipoModificacion == "60"
      ) {
        this.solicitudFoto = true;
        // solicitudModificacion_searchSolModifDatosCambiarFotoDetail
        this.getTranslationsForPhoto();
        this.getSolModChangePhoto(this.body);
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

    this.obtenerMostrarAuditoria();
  }

  ngOnDestroy(): void {
    if (sessionStorage.getItem("search") != null) {
      sessionStorage.removeItem("search");
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
      "censo.datosDireccion.literal.movil",
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
        },
        err => { },
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
        },
        err => {
          this.progressSpinner = false;
        },
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

          this.progressSpinner = false;
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
        },
        err => { },
        () => {
          this.body.idPersona = this.bodySolModiFoto.idPersona;
          this.getPhotoRequest(this.body);
        }
      );
  }

  getTranslationsForChangePhoto() {
    this.textPhotoTranslations = [
      "solicitudModificacion.especifica.exportarFoto.literal"
    ];
  }

  getSolModChangePhoto(idSolicitud) {
    let datosParaImagen: DatosGeneralesItem = new DatosGeneralesItem();
    datosParaImagen.idPersona = idSolicitud.idPersona;

    this.sigaServices
      .postDownloadFiles("personaJuridica_cargarFotografia", datosParaImagen)
      .subscribe(data => {
        const blob = new Blob([data], { type: "text/csv" });
        if (blob.size == 0) {
        } else {
          let urlCreator = window.URL;
          this.imagenAnterior = this.sanitizer.bypassSecurityTrustUrl(
            urlCreator.createObjectURL(blob)
          );
        }
      });

    this.sigaServices
      .postDownloadFiles("solicitudModificacion_searchSolModifDatosCambiarFotoDetail", idSolicitud)
      .subscribe(data => {
        const blob = new Blob([data], { type: "text/csv" });
        if (blob.size == 0) {
        } else {
          let urlCreator = window.URL;
          this.bodySolModiChangeFoto.fotografia = this.sanitizer.bypassSecurityTrustUrl(
            urlCreator.createObjectURL(blob)
          );
        }
      });
    this.progressSpinner = false;
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
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.data = [
            {
              texto: this.textPhotoTranslations[0],
              estado: this.bodyFoto.expFoto,
              modificacion: this.bodySolModiFoto.expFoto
            }
          ];
          this.progressSpinner = false;

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
        },
        err => { },
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
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.data = [
            {
              texto: this.textBasicDataTranslations[0],
              estado: this.bodyDatosBasicos.idioma,
              modificacion: this.bodySolDatosBasicos.idioma
            }
          ];
          this.progressSpinner = false;

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
        },
        err => { },
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
        },
        err => {
          this.progressSpinner = false;
        },
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

          this.progressSpinner = false;
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
        },
        err => { },
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
        },
        err => {
          this.progressSpinner = false;
        },
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

          this.progressSpinner = false;

        }
      );
  }

  onHideCard() {
    this.showCard = !this.showCard;
  }

  return() {
    sessionStorage.removeItem("rowData");
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
    } else if (this.body.idTipoModificacion == "60") {
      this.updateRequestState(
        "solicitudModificacion_processSolModifDatosCambiarFoto"
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
    } else if (this.body.idTipoModificacion == "60") {
      this.updateRequestState("solicitudModificacion_denySolModifDatosCambiarFoto");
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
        if (this.mostrarAuditoria) {
          let motivoBackup = this.body.motivo;
          this.body.motivo = this.motivoAuditoria;

          this.sigaServices
            .post("solicitudModificacion_insertAuditoria", this.body)
            .subscribe(
              data => {
                this.progressSpinner = false;
                this.showSuccess();
              },
              err => {
                this.progressSpinner = false;
                this.showFail();
              },
              () => {
                this.progressSpinner = false;
              }
            );

          this.body.motivo = motivoBackup;
        }
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

  comprobarAuditoria() {
    // mostrar la auditoria depende de un parámetro que varía según la institución

    if (!this.mostrarAuditoria) {
      this.processRequest();
    } else {
      this.displayAuditoria = true;
      this.showGuardarAuditoria = false;
    }
  }

  cerrarAuditoria() {
    this.displayAuditoria = false;
  }

  comprobarCampoMotivo() {
    if (
      this.motivoAuditoria != undefined &&
      this.motivoAuditoria != "" &&
      this.motivoAuditoria.trim() != ""
    ) {
      this.showGuardarAuditoria = true;
    } else {
      this.showGuardarAuditoria = false;
    }
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  obtenerMostrarAuditoria() {
    let parametro = {
      valor: "OCULTAR_MOTIVO_MODIFICACION"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          let parametroOcultarMotivo = JSON.parse(data.body);
          if (parametroOcultarMotivo.parametro == "S" || parametroOcultarMotivo.parametro == "s") {
            this.mostrarAuditoria = false;
          } else if (parametroOcultarMotivo.parametro == "N" || parametroOcultarMotivo.parametro == "n") {
            this.mostrarAuditoria = true;
          } else {
            this.mostrarAuditoria = undefined;
          }
        },
        err => {
          //console.log(err);
        }
      );
  }

  clear() {
    this.msgs = [];
  }

  fillFechaAlta(event) {
    this.body.fechaAlta = event;
  }
}
