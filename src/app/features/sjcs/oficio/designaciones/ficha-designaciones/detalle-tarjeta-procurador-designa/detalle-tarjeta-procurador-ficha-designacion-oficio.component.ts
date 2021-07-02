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
import { Router } from '@angular/router';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';

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
  @Input() procuradores;
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
  nuevoProcurador: boolean = false;

  comboMotivo = [
    { label: "Vacaciones", value: "V" },
    { label: "Maternidad", value: "M" },
    { label: "Baja", value: "B" },
    { label: "Suspensión por sanción", value: "S" }
  ];
  
  @Output() mostrar = new EventEmitter<any>();
  @Output() restablecer = new EventEmitter<any>();
  @Output() anySelected = new EventEmitter<any>();

  datosProcurador: ProcuradorItem = new ProcuradorItem();
  progressSpinner: boolean = false;
  //disabledSave: boolean = true;

  fechaDesigna: Date = new Date();

  constructor(
    private renderer: Renderer2,
    private pipe: DatePipe, private sigaServices: SigaServices,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private router: Router) { 
    this.renderer.listen('window', 'click', (event: { target: HTMLInputElement; }) => {
    for (let i = 0; i < this.table.nativeElement.children.length; i++) {

      if (!event.target.classList.contains("selectedRowClass")) {
        this.selected = false;
        this.selectedArray = [];
      }
    }
  });}

  ngOnInit() {
    //En el caso que se traiga un procurador desde la pantalla de busqueda de procuradores
    if (sessionStorage.getItem("datosProcurador")) {
      //Para mover el scroll a la tajeta si se selecciona un procurador nuevo
      let proc = document.getElementById("procurador");
      if (proc) {
        setTimeout(() => {
        proc.scrollIntoView();
        proc = null;
      }, 15);
      }

      let data =JSON.parse(sessionStorage.getItem("datosProcurador"));
      sessionStorage.removeItem("datosProcurador");

      this.nuevoProcurador = true;

      this.datosProcurador=data[0];
    }
    //Reasignamos las fechas al traerse del back en formato string
    //No se realiza directamente ya que la conversion de new Date con strings se realiza desde MM/DD/YYYY y se nos devuelve DD/MM/YYY desde el back
    else{
      //Fecha designacion
      var dateString = this.rowGroups[0].cells[0].value; 

      var dateParts = dateString.split("/");

      // month is 0-based, that's why we need dataParts[1] - 1
      this.fechaDesigna = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      this.rowGroups[0].cells[0].value = this.fechaDesigna;


      //Fecha solicitud de renuncia
      if(this.rowGroups[0].cells[6].value){
      var dateString = this.rowGroups[0].cells[6].value; 

      var dateParts = dateString.split("/");

      // month is 0-based, that's why we need dataParts[1] - 1
      this.rowGroups[0].cells[6].value = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      }

      this.datosProcurador = this.procuradores[0];
    }

    this.numCabeceras = this.cabeceras.length;

    this.numColumnas = this.numCabeceras;

        // Si es un colegiado y es un letrado, no podrá guardar/restablecer datos de la inscripcion/personales
        if (sessionStorage.getItem("isLetrado") != null && sessionStorage.getItem("isLetrado") != undefined) {
          this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
        }

    sessionStorage.removeItem("nuevoProcurador");
  }

  numberOnly(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode >= 48 && charCode <= 57) {
			return true;
		}
		else {
			return false;

		}
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
    cell.value = event;
  }
  fillFechaDesigna(event, cell) {
    cell.value = event;
    this.fechaDesigna = event;
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

  disableGuardar(){
    //Se revisa la primera fila que es la editable.
    //Campos respectivamente: "Fecha designaicon", "Numero Designacion" y "Observaciones"
    if(this.rowGroups[0].cells[0].value !=null 
      //&& this.rowGroups[0].cells[1].value !=null 
      && this.rowGroups[0].cells[5].value !=null){
      return false;
    }
    else return true;
  }
 
  checkGuardar(){
    if(this.disableGuardar()){
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    }
    else{
      this.comprobarFechaProcurador();
    }
  }

  guardarProc(){
    this.progressSpinner = true;

    let array = [];
    let array2 = [];

    this.rowGroups.forEach(element => {
      element.cells.forEach(dato => {
        array.push(dato.value);
      });
      array2.push(array);
      array = [];
    });

    let procuradorPeticion : ProcuradorItem = new ProcuradorItem();

    //Se asignan los datos traidos de la pantalla de busqueda.
    procuradorPeticion.idInstitucion = this.datosProcurador.idInstitucion;
    procuradorPeticion.idProcurador = this.datosProcurador.idProcurador;

    //Se asignan los valores de la designa.
    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"))
    procuradorPeticion.idTurno = designa.idTurno.toString();
    procuradorPeticion.anio = designa.anio;
    procuradorPeticion.numero = designa.numero.toString();

    //Se asignan los valores asignados en la tabla.
    procuradorPeticion.fechaDesigna = this.rowGroups[0].cells[0].value;
    procuradorPeticion.numerodesignacion = this.rowGroups[0].cells[1].value;
    procuradorPeticion.motivosRenuncia = this.rowGroups[0].cells[4].value;
    procuradorPeticion.observaciones = this.rowGroups[0].cells[5].value;
    procuradorPeticion.fecharenunciasolicita = this.rowGroups[0].cells[6].value;

    //Para que el back sepa si se trata de la actualizacion de un procurador existente o la introducion de uno nuevo.
    procuradorPeticion.numeroTotalProcuradores = this.rowGroups.length.toString(); 


    this.sigaServices.post("designaciones_guardarProcurador", procuradorPeticion).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.mostrarDatos();
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  checkRestablecer(){
    this.restablecer.emit();
    this.totalRegistros = this.rowGroups.length;
  }

  checkNuevo(){
    sessionStorage.setItem("nuevoProcurador", "true");
		this.router.navigate(['/busquedaGeneral']);
  }

  cerrarModal(){
    this.showModal = false;
  }

  restablecerProcurador(){
    this.datosProcurador.observaciones = "";
    this.datosProcurador.numerodesignacion = "";
    this.datosProcurador.fechaDesigna = null;
  }

  styleObligatorio(evento) {
    if (evento == undefined || evento == null || evento == "") {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  guardarProcuradorEJG(proc) {
    this.progressSpinner = true;

    this.sigaServices.post("designaciones_guardarProcuradorEJG", proc).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
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

  // modDatos(event) {
  //   let array = [];
  //   let array2 = [];
  //     event.forEach(element => {
  //       element.cells.forEach(dato => {
  //         array.push(dato.value);
  //       });
  //       array2.push(array);
  //       array = [];
  //     });
  //     this.compruebaProcurador(array2[0]);
    
  // }

  // compruebaProcurador(event) {
  //   this.progressSpinner = true;

    

  //   this.sigaServices.post("designaciones_comprobarProcurador", procuradorPeticion).subscribe(
  //     data => {

  //       if (JSON.parse(data.body).procuradorItems[0] != undefined) {
  //         this.showModal2 = true;
  //       } else {
  //         this.comprobarFechaProcurador();
  //       }
  //       this.progressSpinner = false;
  //     },
  //     err => {
  //       this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
  //       this.progressSpinner = false;
  //     }
  //   );
  // }

  checkEJGDesignas(){
    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"))

    this.sigaServices.post("gestionejg_getEjgDesigna", designa).subscribe(
      n => {
        let ejgDesignas = JSON.parse(n.body).ejgDesignaItems;
        // if(ejgDesignas.length==0) this.isAssociated = false;
        // else this.isAssociated = true;
      }
    );
  }

  comprobarFechaProcurador() {
    this.progressSpinner = true;

    let procuradorPeticion : ProcuradorItem = new ProcuradorItem();

    //Se asignan los valores de la designa.
    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"))
    procuradorPeticion.idTurno = designa.idTurno.toString();
    procuradorPeticion.anio = designa.anio;
    procuradorPeticion.numero = designa.numero.toString();

    //Se asignan los valores asignados en la tabla.
    procuradorPeticion.fechaDesigna = this.rowGroups[0].cells[0].value;

    this.sigaServices.post("designaciones_comprobarFechaProcurador", procuradorPeticion).subscribe(
      data => {

        //Se comprueba si se ha devuelto algún procurador que tenga la misma fecha de designacion
        if (!JSON.parse(data.body).procuradorItems.isEmpty()) {
          this.showModal3 = true;
        } else {
          this.guardarProc();
        }
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  actualizarProcurador() {
    this.progressSpinner = true;
    let array = [];
      this.rowGroups[0].cells.forEach(dato => {
        array.push(dato.value);
      });
    this.sigaServices.post("designaciones_actualizarProcurador", array).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  disableEdition(){
    return this.rowGroups.length == 0;
  }

}
function compare(a: string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}