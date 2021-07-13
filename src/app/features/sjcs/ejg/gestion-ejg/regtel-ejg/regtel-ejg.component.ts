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

@Component({
  selector: 'app-regtel-ejg',
  templateUrl: './regtel-ejg.component.html',
  styleUrls: ['./regtel-ejg.component.scss']
})
export class RegtelEjgComponent implements OnInit {
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
  nRegtel = 0;
  regtel = [];

  resaltadoDatosGenerales: boolean = false;
  progressSpinner: boolean;
  selectedDatosRegtel: DocushareItem;
  idPersona: any;

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
      if(this.item.identificadords != null) this.getRegtel();
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
    this.progressSpinner = true;
    
    this.sigaServices
        .getParam(
          'gestionejg_searchListDocEjg',
          '?anio='+this.item.annio+'&numero='+this.item.numero+'&idTipoEJG='+this.item.tipoEJG+'&identificadords='+this.item.identificadords
        )
        .subscribe(
          data => {
            let bodySearchRegTel = JSON.parse(data['body']);
            this.regtel = bodySearchRegTel.docuShareObjectVO;
            //this.generalBody.identificadords = bodySearchRegTel.identificadorDS;
            // this.bodyRegTel.forEach(element => {
            //   element.fechaModificacion = this.arreglarFechaRegtel(
            //     JSON.stringify(new Date(element.fechaModificacion))
            //   );
            // });
            this.nRegtel = this.regtel.length;
          },
          err => {
            this.progressSpinner = false;
            this.regtel = [];
            this.nRegtel = 0;
          },
      );
  }

  insertColl(){
    this.progressSpinner = true;
    this.sigaServices
        .post(
          'gestionejg_insertCollectionEjg',
          this.item
        )
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.item.identificadords = data.body;
            let mess = this.translateService.instant("messages.collectionCreated");
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          },
          err => {
            this.progressSpinner = false;
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
      this.showFolder();
    }
  }
  showFolder(){

  }
  
}