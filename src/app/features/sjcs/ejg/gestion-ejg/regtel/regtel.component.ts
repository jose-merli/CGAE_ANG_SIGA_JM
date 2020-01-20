import { Component, OnInit, Input } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-regtel',
  templateUrl: './regtel.component.html',
  styleUrls: ['./regtel.component.scss']
})
export class RegtelComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  openFicha: boolean = false;
  nuevo;
  body: EJGItem;
  item: EJGItem;
  bodyInicial;
  [x: string]: any;
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

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService) { }

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
  getRegtel(selected) {
  //CAMBIAR
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getDocumentos", selected).subscribe(
    n => {
        this.regtel = JSON.parse(n.body).ejgDocItems;
        this.nRegtel = this.documentos.length;
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
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
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