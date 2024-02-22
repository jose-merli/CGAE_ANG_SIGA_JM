import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { saveAs } from 'file-saver/FileSaver';
import { DocushareItem } from '../../../../../models/DocushareItem';
import { DataTable } from "primeng/datatable";
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/api';
import { DocushareObject } from '../../../../../models/DocushareObject';

@Component({
  selector: 'app-regtel-ejg',
  templateUrl: './regtel-ejg.component.html',
  styleUrls: ['./regtel-ejg.component.scss']
})
export class RegtelEjgComponent implements OnInit {

  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Input() openTarjetaRegtel;
  @Input() permisoEscritura: boolean = false;
  @Output() guardadoSend = new EventEmitter<any>();

  selectMultiple: boolean = false;
  seleccion: boolean = false;
  buttonVisibleRegtelCarpeta: boolean = true;
  buttonVisibleRegtelDescargar: boolean = true;
  buttonVisibleRegtelAtras: boolean = true;
  buttonVisibleEnvioDocumentacionAdicional: boolean = false;
  esIdentificadorPericlesDisponible: boolean = false;
  activacionTarjeta: boolean = false;

  msgs;
  messageRegtel: string;
  rowsPerPage: any = [];
  colsRegtel;
  selectedItemRegtel: number = 10;
  selectAll;
  buscadores = [];
  numSelected = 0;
  nRegtel = 0;
  regtel = [];
  atrasRegTel: String = '';
  numSelectedRegtel = 0;

  resaltadoDatosGenerales: boolean = false;
  progressSpinner: boolean;
  selectedDatosRegtel: DocushareItem;
  idPersona: any;

  bodySearchRegTel: DocushareObject = new DocushareObject();

  @ViewChild("table") table: DataTable;

  constructor(private sigaServices: SigaServices,
    private commonsServices: CommonsService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {

    //Se comprueba que se tiene una carpeta DocuShare creada mediante el atributo "identificadords"
    //que se actualizara correspondientemente en el servicio si tuviera una asociada.
    this.getRegtel();
    this.getCols();

    // Acción para el envío de documentación Adicional
    this.esColegioConfiguradoEnvioCAJG().then(value => this.buttonVisibleEnvioDocumentacionAdicional = value);
    this.esIdentificadorPericlesDisponible = this.datos.idExpedienteExt != undefined;
  }

  abreCierraFicha() {
    this.openTarjetaRegtel = !this.openTarjetaRegtel;
    //Si se cancela la creacion de una coleccion cuando se abra la tarjeta por primera vez, se le pregunta cada vez que la abra de nuevo.
    if (this.openTarjetaRegtel && this.datos != undefined && this.datos.identificadords == null && this.permisoEscritura) {
      this.callConfirmationServiceRegtel();
    }
  }

  getRegtel() {
    this.messageRegtel = this.translateService.instant('aplicacion.cargando');

    this.sigaServices.getParam('gestionejg_searchListDocEjg', '?anio=' + this.datos.annio + '&numero=' + this.datos.numero + '&idTipoEJG=' + this.datos.tipoEJG + '&identificadords=' + this.datos.identificadords).subscribe(
      data => {
        this.bodySearchRegTel = data;
        this.regtel = this.bodySearchRegTel.docuShareObjectVO;
        this.datos.identificadords = this.bodySearchRegTel.identificadorDS;
        this.nRegtel = this.regtel.length;
        if (this.nRegtel != 0) {
          this.messageRegtel = this.nRegtel + '';
        } else {
          this.messageRegtel = this.translateService.instant('general.message.no.registros');
        }
        if (this.nRegtel > 0) {
          this.atrasRegTel = this.regtel[0].parent;
        }
      },
      err => {
        this.messageRegtel = this.translateService.instant('justiciaGratuita.ejg.regtel.messageNoConfigurada');
        this.regtel = [];
        this.nRegtel = 0;
      },
    );
  }

  insertColl() {

    this.messageRegtel = this.translateService.instant('aplicacion.cargando');

    this.sigaServices.post('gestionejg_insertCollectionEjg', this.datos).subscribe(
      data => {
        this.datos.identificadords = data.body;
        //Se introduce el cambio en la capa de persistencia para evitar que pida crear una coleccion innecesariamente.
        this.messageRegtel = this.translateService.instant("messages.collectionCreated");
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.getRegtel();
      },
      err => {
        if (this.nRegtel != 0) {
          this.messageRegtel = this.nRegtel + '';
        } else {
          this.messageRegtel = this.translateService.instant('general.message.no.registros');
        }
        if (err.error == "Error al crear la colección en Regtel para el EJG" || err.error == "Error al actualizar el identificador para DocuShare del EJG") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), err.error);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      }
    );
  }

  callConfirmationServiceRegtel() {
    this.confirmationService.confirm({
      key: "regtelFicha",
      message: this.translateService.instant("messages.creaCollection"),
      icon: "fa fa-edit",
      accept: () => {
        this.insertColl();
      },
      reject: () => {
        this.showMessage("info", "Cancel", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

  getCols() {
    this.colsRegtel = [
      { field: 'title', header: 'censo.resultadosSolicitudesModificacion.literal.Nombre'},
      { field: 'summary', header: 'censo.regtel.literal.resumen'},
      { field: 'fechaModificacion', header: 'censo.datosDireccion.literal.fechaModificacion'},
      { field: 'sizeKB', header: 'censo.regtel.literal.tamanno'}
    ];

    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 }
    ];
  }

  onRowSelectedRegTel(selectedDatosRegtel) {
    this.numSelectedRegtel = 1;
    this.selectedDatosRegtel = selectedDatosRegtel;
    if (this.selectedDatosRegtel.tipo == "0") {
      this.buttonVisibleRegtelCarpeta = false;
      this.buttonVisibleRegtelDescargar = true;
    } else {
      this.buttonVisibleRegtelCarpeta = true;
      this.buttonVisibleRegtelDescargar = false;
    }
  }

  onRowDesselectedRegTel() {
    this.numSelectedRegtel = 0;
    this.buttonVisibleRegtelCarpeta = true;
    this.buttonVisibleRegtelDescargar = true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItemRegtel = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  actualizaSeleccionados(selectedDatosRegtel) {
    this.numSelected = selectedDatosRegtel.length;
    this.seleccion = false;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
  clear() {
    this.msgs = [];
  }
  checkPermisosDownload() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.download();
    }
  }

  download() {
    this.progressSpinner = true;
    this.selectedDatosRegtel.numero = this.datos.numero;
    this.selectedDatosRegtel.idTipoEjg = this.datos.tipoEJG;
    this.selectedDatosRegtel.anio = this.datos.annio;
    let selectedRegtel: DocushareItem = JSON.parse(JSON.stringify(this.selectedDatosRegtel));
    selectedRegtel.fechaModificacion = undefined;
    this.sigaServices.postDownloadFiles("fichaColegialRegTel_downloadDoc", selectedRegtel).subscribe(
      data => {
        const blob = new Blob([data], { type: "application/octet-stream" });
        saveAs(blob, selectedRegtel.originalFilename);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  checkPermisosShowFolder() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.showFolder();
    }
  }

  showFolder() {

    this.progressSpinner = true;
    if (this.atrasRegTel != this.selectedDatosRegtel.parent) {
      this.atrasRegTel = this.selectedDatosRegtel.parent;
    }

    this.selectedDatosRegtel.numero = this.datos.numero;
    this.selectedDatosRegtel.idTipoEjg = this.datos.tipoEJG;
    this.selectedDatosRegtel.anio = this.datos.annio;
    let selectedRegtel: DocushareItem = JSON.parse(JSON.stringify(this.selectedDatosRegtel));
    selectedRegtel.fechaModificacion = undefined;

    this.sigaServices.postPaginado("fichaColegialRegTel_searchListDir", "?numPagina=1", selectedRegtel).subscribe(
      data => {
        this.bodySearchRegTel = JSON.parse(data["body"]);
        this.regtel = this.bodySearchRegTel.docuShareObjectVO;
        this.nRegtel = this.regtel.length;
        if (this.atrasRegTel != "") {
          this.buttonVisibleRegtelAtras = false;
        } else {
          this.buttonVisibleRegtelAtras = true;
        }
        this.buttonVisibleRegtelCarpeta = true;
        this.buttonVisibleRegtelDescargar = true;
        this.progressSpinner = false;

        this.numSelectedRegtel = 0;
        if (this.nRegtel != 0) {
          this.messageRegtel = this.nRegtel + "";
        } else {
          this.messageRegtel = this.translateService.instant("general.message.no.registros");
        }
      },
      err => {
        this.messageRegtel = this.translateService.instant("general.message.no.registros");
        this.progressSpinner = false;
      }
    );
  }

  onClickAtrasRegtel() {
    this.progressSpinner = true;
    this.selectedDatosRegtel.id = this.selectedDatosRegtel.parent;
    this.selectedDatosRegtel.numero = this.datos.numero;
    this.selectedDatosRegtel.idTipoEjg = this.datos.tipoEJG;
    this.selectedDatosRegtel.anio = this.datos.annio;
    let selectedRegtel = JSON.parse(JSON.stringify(this.selectedDatosRegtel));
    selectedRegtel.fechaModificacion = undefined;

    this.sigaServices.postPaginado("fichaColegialRegTel_searchListDir", "?numPagina=1", selectedRegtel).subscribe(
      data => {
        this.bodySearchRegTel = JSON.parse(data["body"]);
        this.regtel = this.bodySearchRegTel.docuShareObjectVO;
        this.nRegtel = this.regtel.length;
        if (this.atrasRegTel != "") {
          this.buttonVisibleRegtelAtras = true;
        }
        this.buttonVisibleRegtelCarpeta = true;
        this.buttonVisibleRegtelDescargar = true;

        this.numSelectedRegtel = 0;
        if (this.nRegtel != 0) {
          this.messageRegtel = this.nRegtel + "";
        } else {
          this.messageRegtel = this.translateService.instant("general.message.no.registros");
        }
        this.progressSpinner = false;
      },
      err => {
        this.messageRegtel = this.translateService.instant("general.message.no.registros");
        this.progressSpinner = false;
      }
    );
  }

  setItalicRegtel(datoH) {
    if (datoH.tipo == 1) return false;
    else return true;
  }

  activarPaginacionRegTel() {
    if (!this.regtel || this.regtel.length == 0) return false;
    else return true;
  }

  async enviarDocumentacionAdicional() {
    try {
      if (this.buttonVisibleEnvioDocumentacionAdicional) {
        if (this.selectedDatosRegtel != undefined && this.selectedDatosRegtel.id != undefined && await this.confirmEnviarDocumentacionAdicional()) {
          let request = { identificadords: this.selectedDatosRegtel.id, annio: this.datos.annio, tipoEJG: this.datos.tipoEJG, numero: this.datos.numero };
          await this.accionEnviarDocumentacionAdicional(request);
          this.showMessage("info", "Info", this.translateService.instant("justiciaGratuita.ejg.listaIntercambios.peticionEnCurso"));
          this.guardadoSend.emit(this.datos);
        } else {
          this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
        }
      } else {
        this.showMessage("error", "Error", "La acción no se encuentra disponible");
      }
    } catch (error) {
      this.showMessage('error', 'Error', this.translateService.instant('general.mensaje.error.bbdd'));
    }
  }

  confirmEnviarDocumentacionAdicional(): Promise<boolean> {
    let mess = this.translateService.instant("justiciaGratuita.ejg.listaIntercambios.confirmEnviarDocAdicional");
    let icon = "fa fa-edit";
    return new Promise((accept1, reject1) => {
      this.confirmationService.confirm({
        key: "regtelFicha",
        message: mess,
        icon: icon,
        accept: () => accept1(true),
        reject: () => accept1(false)
      });
    })
  }

  accionEnviarDocumentacionAdicional(body): Promise<any> {
    this.progressSpinner = true;
    return this.sigaServices.post("gestionejg_enviaDocumentacionAdicionalRegtel", body).toPromise().then(
      n => {
        this.progressSpinner = false;
        const body = JSON.parse(n.body);
        if (body.error != undefined) {
          return Promise.reject(n.error);
        }
      },
      err => {
        this.progressSpinner = false;
        return Promise.reject();
      }
    );
  }

  esColegioConfiguradoEnvioCAJG(): Promise<boolean> {
    return this.sigaServices.get("gestionejg_esColegioConfiguradoEnvioCAJG").toPromise().then(
      n => {
        if (n.error != undefined) {
          return Promise.resolve(false);
        } else {
          const result = n.data === 'true';
          return Promise.resolve(result);
        }
      },
      err => {
        return Promise.resolve(false);
      }
    )
  }
}
