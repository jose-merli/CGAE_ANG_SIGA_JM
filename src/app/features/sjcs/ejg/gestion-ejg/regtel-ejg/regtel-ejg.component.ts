import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
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
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaRegtel: string;

  messageRegtel :string;
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
  nRegtel = 0;
  regtel = [];
  atrasRegTel: String = '';

  buttonVisibleRegtelCarpeta:boolean = false;
  buttonVisibleRegtelDescargar:boolean = false;
  buttonVisibleRegtelAtras:boolean = true;

  resaltadoDatosGenerales: boolean = false;
  progressSpinner: boolean;
  selectedDatosRegtel: DocushareItem;
  idPersona: any;

  bodySearchRegTel: DocushareObject = new DocushareObject();

  @ViewChild("table")
  table: DataTable;
  
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
    private commonsServices: CommonsService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    if (this.persistenceService.getDatos()) {
      this.nuevo = false;
      this.modoEdicion = true;
      this.body = this.persistenceService.getDatos();
      this.item = this.body;
      //Se comprueba que se tiene una carpeta DocuShare creada mediante el atributo "identificadords"
      //que se actualizara correspondientemente en el servicio si tuviera una asociada.
      this.getRegtel();
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
        //Si se cancela la creacion de una coleccion cuando se abra la tarjeta por primera vez,
        //se le pregunta cada vez que la abra de nuevo.
        if(this.openFicha && this.item!= undefined && this.item.identificadords == null) this.callConfirmationServiceRegtel();
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
    //Si se cancela la creacion de una coleccion cuando se abra la tarjeta por primera vez,
    //se le pregunta cada vez que la abra de nuevo.
    if(this.openFicha && this.item!= undefined && this.item.identificadords == null) this.callConfirmationServiceRegtel();
  }

  getRegtel() {
    this.messageRegtel = this.translateService.instant('aplicacion.cargando');

    this.sigaServices
        .getParam(
          'gestionejg_searchListDocEjg',
          '?anio='+this.item.annio+'&numero='+this.item.numero+'&idTipoEJG='+this.item.tipoEJG+'&identificadords='+this.item.identificadords
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.regtel = this.bodySearchRegTel.docuShareObjectVO;
            this.item.identificadords = this.bodySearchRegTel.identificadorDS;
            // this.bodyRegTel.forEach(element => {
            //   element.fechaModificacion = this.arreglarFechaRegtel(
            //     JSON.stringify(new Date(element.fechaModificacion))
            //   );
            // });
            this.nRegtel = this.regtel.length;
            if (this.nRegtel != 0) {
              this.messageRegtel = this.nRegtel + '';
            } else {
              this.messageRegtel = this.translateService.instant(
                'general.message.no.registros'
              );
            }
            if (this.nRegtel > 0) {
              this.atrasRegTel = this.regtel[0].parent;
            }
          },
          err => {
            
        this.messageRegtel = this.translateService.instant(
          'general.message.no.registros'
        );
            this.regtel = [];
            this.nRegtel = 0;
          },
      );
  }

  insertColl(){

    this.messageRegtel = this.translateService.instant('aplicacion.cargando');
    
    this.sigaServices
        .post(
          'gestionejg_insertCollectionEjg',
          this.item
        )
        .subscribe(
          data => {
            this.item.identificadords = data.body;
            //Se introduce el cambio en la capa de persistencia para evitar que pida crear una coleccion innecesariamente.
            this.persistenceService.setDatos(this.item);
            let mess = this.translateService.instant("messages.collectionCreated");
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            // if (this.nRegtel != 0) {
            //   this.messageRegtel = this.nRegtel + '';
            // } else {
            //   this.messageRegtel = this.translateService.instant(
            //     'general.message.no.registros'
            //   );
            // }
            this.getRegtel();
          },
          err => {
            if (this.nRegtel != 0) {
              this.messageRegtel = this.nRegtel + '';
            } else {
              this.messageRegtel = this.translateService.instant(
                'general.message.no.registros'
              );
            }
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          },
      );
  }

  openTab(evento) {
  }

  callConfirmationServiceRegtel() {
    let mess = this.translateService.instant("messages.creaCollection");
    let icon = "fa fa-edit";
    let keyConfirmation = "regtelFicha";

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mess,
      icon: icon,
      accept: () => {
        this.insertColl();
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
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
    let selectedRegtel: DocushareItem = JSON.parse(JSON.stringify(this.selectedDatos));
    selectedRegtel.fechaModificacion = undefined;
    selectedRegtel.numero = this.item.numero;
    selectedRegtel.idTipoEjg = this.item.tipoEJG;
    selectedRegtel.anio = this.item.annio;
    this.sigaServices
      .postDownloadFiles(
        "fichaColegialRegTel_downloadDoc",
        selectedRegtel
      )
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "application/octet-stream" });
          saveAs(blob, selectedRegtel.originalFilename);
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
      this.showFolder();
    }
  }
  showFolder(){

    this.progressSpinner = true;
    if (this.atrasRegTel != this.selectedDatosRegtel.parent) {
      this.atrasRegTel = this.selectedDatosRegtel.parent;
    }

    let selectedRegtel: DocushareItem = JSON.parse(JSON.stringify(this.selectedDatos));
    selectedRegtel.fechaModificacion = undefined;
    selectedRegtel.numero = this.item.numero;
    selectedRegtel.idTipoEjg = this.item.tipoEJG;
    selectedRegtel.anio = this.item.annio;

    this.sigaServices
    .postPaginado(
      "gestionejg_searchListDirEjg",
      "?numPagina=1",
      selectedRegtel
    )
    .subscribe(
      data => {
        this.bodySearchRegTel = JSON.parse(data["body"]);
        this.regtel = this.bodySearchRegTel.docuShareObjectVO;
        this.nRegtel = this.regtel.length;
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
        if (this.nRegtel != 0) {
          this.messageRegtel = this.nRegtel + "";
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
  
  onClickAtrasRegtel() {
    this.progressSpinner = true;
    this.selectedDatosRegtel.id = this.selectedDatosRegtel.parent;
    let selectedRegtel = JSON.parse(JSON.stringify(this.selectedDatosRegtel));
    selectedRegtel.fechaModificacion = undefined;
    selectedRegtel.numero = this.item.numero;
    selectedRegtel.idTipoEjg = this.item.tipoEJG;
    selectedRegtel.anio = this.item.annio;
    selectedRegtel.fechaModificacion = undefined;
      this.sigaServices
        .postPaginado(
          "gestionejg_searchListDirEjg",
          "?numPagina=1",
          selectedRegtel
        )
        .subscribe(
          data => {
            this.bodySearchRegTel = JSON.parse(data["body"]);
            this.regtel = this.bodySearchRegTel.docuShareObjectVO;
            this.nRegtel = this.regtel.length;
            // this.bodyRegTel.forEach(element => {
            //   element.fechaModificacion = this.arreglarFechaRegtel(
            //     JSON.stringify(new Date(element.fechaModificacion))
            //   );
            // });

            if (this.atrasRegTel != "") {
              this.buttonVisibleRegtelAtras = true;
            }
            this.buttonVisibleRegtelCarpeta = true;
            this.buttonVisibleRegtelDescargar = true;
            if (this.nRegtel != 0) {
              this.messageRegtel = this.nRegtel + "";
            } else {
              this.messageRegtel = this.translateService.instant(
                "general.message.no.registros"
              );
            }
            this.progressSpinner = false;
          },
          err => {
            this.messageRegtel = this.translateService.instant(
              "general.message.no.registros"
            );
            this.progressSpinner = false;
          }
        );
  }

  
  setItalic(datoH) {
		if (datoH.tipo == 1) return false;
		else return true;
	}
}