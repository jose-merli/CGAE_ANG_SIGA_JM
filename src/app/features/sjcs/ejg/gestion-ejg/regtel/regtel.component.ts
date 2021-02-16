import { Component, OnInit, Input, Output, ViewChild, SimpleChanges, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/api';
import { saveAs } from 'file-saver/FileSaver';
import { CommonsService } from '../../../../../_services/commons.service';
import { DocushareItem } from '../../../../../models/DocushareItem';
import { DataTable } from 'primeng/primeng';

@Component({
  selector: 'app-regtel',
  templateUrl: './regtel.component.html',
  styleUrls: ['./regtel.component.scss']
})
export class RegtelComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaRegtel: string;

  openFicha: boolean = false;
  nuevo;
  body: EJGItem;
  item: EJGItem;
  bodyInicial;
  rowsPerPage: any = [];
  cols;
  msgs;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  buscadores = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  nRegtel;

  idPersona: any;
  selectedDatosRegtel: DocushareItem;
  progressSpinner: boolean = false;
  resaltadoDatosGenerales: boolean = false;
  @ViewChild("table") table: DataTable;
  
  fichaPosible = {
    key: "regtel",
    activa: false
  }
  
  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Input() openTarjetaRegtel;


  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private commonsServices: CommonsService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.persistenceService.getDatos()) {
      this.nuevo = false;
      this.modoEdicion = true;
      this.body = this.persistenceService.getDatos();
      this.item = this.body;
      this.getRegtel(this.item);
      this.getCols();
    }else {
    this.nuevo = true;
    this.modoEdicion = false;
    this.item = new EJGItem();
  }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaRegtel == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  esFichaActiva(key) {

    return this.fichaPosible.activa;
  }
  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "regtel" &&
      !this.activacionTarjeta
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  getRegtel(selected) {
  //CAMBIAR
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getDocumentos", selected).subscribe(
    n => {
         let regtel = JSON.parse(n.body).ejgDocItems;
        // this.nRegtel = this.documentos.length;
        this.nRegtel = regtel.length;
        this.progressSpinner = false;
      },
      err => {
       console.log(err);
      }
    );
  }

  openTab(evento) {
  }
  getCols() {
      this.cols = [
        { field: "flimite_presentacion", header: "informesycomunicaciones.comunicaciones.documento.nombre", width: "25%" },
        { field: "presentador_persona", header: "censo.regtel.literal.resumen", width: "40%" },
        { field: "documentoDesc", header: "censo.datosDireccion.literal.fechaModificacion", width: "15%" },
        { field: "regEntrada", header: "censo.regtel.literal.tamanno", width: "20%" },
      ];
    this.cols.forEach(it => this.buscadores.push(""));

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
  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
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
  checkPermisosDownload(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.download();
    }
  }
  download(){
    this.progressSpinner = true;
    this.selectedDatosRegtel.idPersona = this.idPersona;
    let selectedRegtel = JSON.parse(JSON.stringify(this.selectedDatosRegtel));
    selectedRegtel.fechaModificacion = undefined;
    this.sigaServices
      .postDownloadFiles(
        "fichaColegialRegTel_downloadDoc",

        selectedRegtel
      )
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "application/octet-stream" });
          saveAs(blob, this.selectedDatosRegtel.originalFilename);
          //this.selectedDatosRegtel.fechaModificacion = fechaModificacionRegtel;
          this.progressSpinner = false;
        },
        err => {
          //this.selectedDatosRegtel.fechaModificacion = fechaModificacionRegtel;
          this.progressSpinner = false;
        }
      );
  }
  checkPermisosShowFolder(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      //this.showFolder();
    }
  }/*
  showFolder(){
    this.progressSpinner = true;
    if (this.atrasRegTel != this.selectedDatosRegtel.parent) {
      this.atrasRegTel = this.selectedDatosRegtel.parent;
    }
    this.selectedDatosRegtel.idPersona = this.idPersona;
    let selectedRegtel = JSON.parse(JSON.stringify(this.selectedDatosRegtel));
    selectedRegtel.fechaModificacion = undefined;
    if (this.esColegiado) {
      this.sigaServices
        .postPaginado(
          "fichaColegialRegTel_searchListDir",
          "?numPagina=1",
          selectedRegtel
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            //  this.bodyRegTel.forEach(element => {
            //   element.fechaModificacion = this.arreglarFechaRegtel(
            //     JSON.stringify(new Date(element.fechaModificacion))
            //   );
            // });

            if (this.atrasRegTel != "") {
              this.buttonVisibleRegtelAtras = false;
            } else {
              this.buttonVisibleRegtelAtras = true;
            }
            this.buttonVisibleRegtelCarpeta = true;
            this.buttonVisibleRegtelDescargar = true;
            this.progressSpinner = false;
            if (this.bodyRegTel.length != 0) {
              this.messageRegtel = this.bodyRegTel.length + "";
            } else {
              this.messageRegtel = this.translateService.instant(
                "general.message.no.registros"
              );
            }

          },
          err => {
            this.messageRegtel = this.translateService.instant(
              "general.message.no.registros"
            );
            this.progressSpinner = false;
          }
        );
    } else {
      this.sigaServices
        .postPaginado(
          "fichaColegialRegTel_searchListDirNoCol",
          "?numPagina=1",
          selectedRegtel
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.bodyRegTel = this.bodySearchRegTel.docuShareObjectVO;
            //  this.bodyRegTel.forEach(element => {
            //   element.fechaModificacion = this.arreglarFechaRegtel(
            //     JSON.stringify(new Date(element.fechaModificacion))
            //   );
            // });
            if (this.atrasRegTel != "") {
              this.buttonVisibleRegtelAtras = false;
            } else {
              this.buttonVisibleRegtelAtras = true;
            }
            this.buttonVisibleRegtelCarpeta = true;
            this.buttonVisibleRegtelDescargar = true;
            this.progressSpinner = false;
            if (this.bodyRegTel.length != 0) {
              this.messageRegtel = this.bodyRegTel.length + "";
            } else {
              this.messageRegtel = this.translateService.instant(
                "general.message.no.registros"
              );
            }

          },
          err => {
            this.messageRegtel = this.translateService.instant(
              "general.message.no.registros"
            );
            this.progressSpinner = false;
          }
        );
    }
  }*/
  
}