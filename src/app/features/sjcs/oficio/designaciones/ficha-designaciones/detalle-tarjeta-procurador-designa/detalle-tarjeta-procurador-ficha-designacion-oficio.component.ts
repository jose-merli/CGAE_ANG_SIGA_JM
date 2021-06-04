import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Row, Cell} from './detalle-tarjeta-procurador-ficha-designaion-oficio.service';
import { Sort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { ProcuradoresItem } from '../../../../../../models/sjcs/ProcuradoresItem';
import { ProcuradorItem } from '../../../../../../models/sjcs/ProcuradorItem';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-detalle-tarjeta-procurador-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-procurador-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-procurador-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaProcuradorFichaDesignacionOficioComponent implements OnInit {

  @Input() cabeceras = [];
  msgs: Message[] = [];
  @Input() rowGroups: Row[];
  @Input() rowGroupsAux: Row[];
  @Input() seleccionarTodo = false;
  @Input() totalRegistros = 0;
  numCabeceras = 0;
  numColumnas = 0;
  numperPage = 10;
  @ViewChild('table') table: ElementRef;
  selected = false;
  selectedArray = [];
  from = 0;
  to = 10;
  searchText = [];
  enableGuardar = false;
  showModal: boolean = false;
  showModal2: boolean = false;
  showModal3: boolean = false;
  isLetrado: boolean = false;
  isDisabled: boolean = false;

  comboMotivo = [
    { label: "Vacaciones", value: "V" },
    { label: "Maternidad", value: "M" },
    { label: "Baja", value: "B" },
    { label: "Suspensión por sanción", value: "S" }
  ];
  
  @Output() modDatos = new EventEmitter<any>();
  @Output() mostrar = new EventEmitter<any>();
  @Output() restablecer = new EventEmitter<any>();
  @Output() anySelected = new EventEmitter<any>();
  @Output() nuevo = new EventEmitter<any>();
  datosProcurador: ProcuradorItem = new ProcuradorItem();
  progressSpinner: boolean = false;
  disabledSave: boolean = true;

  constructor(
    private renderer: Renderer2,
    private pipe: DatePipe, private sigaServices: SigaServices,
    private translateService: TranslateService,
    private commonServices: CommonsService) { 
    this.renderer.listen('window', 'click', (event: { target: HTMLInputElement; }) => {
    for (let i = 0; i < this.table.nativeElement.children.length; i++) {

      if (!event.target.classList.contains("selectedRowClass")) {
        this.selected = false;
        this.selectedArray = [];
      }
    }
  });}

  ngOnInit() {
    if(sessionStorage.getItem("datosProcurador") != null){
      let data =JSON.parse(sessionStorage.getItem("datosProcurador"));

      this.datosProcurador=data[0];
    }

    if(sessionStorage.getItem("compruebaProcurador")){
      this.disabledSave = false;
      sessionStorage.removeItem("compruebaProcurador");
    }

    if(sessionStorage.getItem("nuevoProcurador")){
      this.showModal = true;
    }

    this.numCabeceras = this.cabeceras.length;

    this.numColumnas = this.numCabeceras;

        // Si es un colegiado y es un letrado, no podrá guardar/restablecer datos de la inscripcion/personales
        if (sessionStorage.getItem("isLetrado") != null && sessionStorage.getItem("isLetrado") != undefined) {
          this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
        }

    sessionStorage.removeItem("nuevoProcurador");
  }

  mostrarDatos(){
    this.mostrar.emit();
  }
  selectedAll(evento){
    this.seleccionarTodo = evento;
  }
  fromReg(event){
    this.from = Number(event) - 1;
  }
  toReg(event){
    this.to = Number(event);
  }
  inputChange(event, i, z){
    this.enableGuardar = true;
  } 
  perPage(perPage){
    this.numperPage = perPage;
  }
  fillFecha(event, cell) {
    cell.value = this.pipe.transform(event, 'dd/MM/yyyy');
  }
  sortData(sort: Sort) {
    let data: Row[] = [];
    this.rowGroups = this.rowGroupsAux.filter((row) => {
      data.push(row);
    });
    data = data.slice();
    if (!sort.active || sort.direction === '') {
      this.rowGroups = data;
      return;
    }
    this.rowGroups = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      let resultado;
      for (let i = 0; i < a.cells.length; i++) {
        resultado = compare(a.cells[i].value, b.cells[i].value, isAsc);
      }
      return resultado;
    });
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;

  }

  isSelected(id) {
    if (this.selectedArray.includes(id)) {
      return true;
    } else {
      return false;
    }
  }

  isPar(numero): boolean {
    return numero % 2 === 0;
  }
  
  searchChange(j: any) {
    let isReturn = true;
    let isReturnArr = [];
    this.rowGroups = this.rowGroupsAux.filter((row) => {
      if (
        this.searchText[j] != " " &&
        this.searchText[j] != undefined &&
        !row.cells[j].value.toString().toLowerCase().includes(this.searchText[j].toLowerCase())
      ) {
        isReturn = false;
      } else {
        isReturn = true;
      }
      if (isReturn) {
        return row;
      }
    });
    this.totalRegistros = this.rowGroups.length;
    this.rowGroupsAux = this.rowGroups;
  }

  selectRow(rowId) {
    if (this.selectedArray.includes(rowId)) {
      const i = this.selectedArray.indexOf(rowId);
      this.selectedArray.splice(i, 1);
    } else {
      this.selectedArray.push(rowId);
    }
    if (this.selectedArray.length != 0) {
      this.anySelected.emit(true);
    } else {
      this.anySelected.emit(false);
    }
  }

  
  ngOnChanges(changes: SimpleChanges) {

    if (sessionStorage.getItem("rowGroupsInitProcurador")) {
      sessionStorage.removeItem("rowGroupsInitProcurador");
    }

    if (changes.rowGroups.currentValue) {
      sessionStorage.setItem("rowGroupsInitProcurador", JSON.stringify(changes.rowGroups.currentValue));
    }
  }
 
  checkGuardar(){
    this.modDatos.emit(this.rowGroups);
    this.totalRegistros = this.rowGroups.length;
  }

  checkRestablecer(){
    this.restablecer.emit();
    this.totalRegistros = this.rowGroups.length;
  }

  checkNuevo(){
    this.nuevo.emit();
    this.totalRegistros = this.rowGroups.length;
  }

  cerrarModal(){
    this.showModal = false;
  }

  restablecerProcurador(){
    this.datosProcurador.observaciones = "";
    this.datosProcurador.numerodesignacion = "";
    this.datosProcurador.fechaDesigna = "";
  }

  checkNuevoProcurador(){
      this.progressSpinner = true;
      console.log(this.datosProcurador);
  
      this.sigaServices.post("designaciones_nuevoProcurador", this.datosProcurador).subscribe(
        data => {
          let error = JSON.parse(data.body).error;
          this.showMessage("info", this.translateService.instant("general.message.correct"), error.description);
          this.progressSpinner = false;
        },
        err => {
          let error = JSON.parse(err.body).error;
          this.showMessage("info", this.translateService.instant("general.message.incorrect"), error.description);
          this.progressSpinner = false;
        }
      );
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
}
function compare(a: string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}