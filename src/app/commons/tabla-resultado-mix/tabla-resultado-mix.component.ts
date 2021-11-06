import { ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Row, Cell } from './tabla-resultado-mix-incompatib.service';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { ValidationModule } from '../validation/validation.module';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { PersistenceService } from '../../_services/persistence.service';
import { RowGroup } from '../tabla-resultado-desplegable/tabla-resultado-desplegable-ae.service';
import { TranslateService } from '../translate/translation.service';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { DatePipe } from '@angular/common';
import { CalendarioProgramadoItem } from '../../models/guardia/CalendarioProgramadoItem';
import { SigaServices } from '../../_services/siga.service';
import { CommonsService } from '../../_services/commons.service';


/*interface Cabecera {
  id: string,
  name: string,
}*/

@Component({
  selector: 'app-tabla-resultado-mix',
  templateUrl: './tabla-resultado-mix.component.html',
  styleUrls: ['./tabla-resultado-mix.component.scss']
})
export class TablaResultadoMixComponent implements OnInit {
  
  info = new FormControl();
  msgs: Message[] = [];
  //@Input() cabeceras: Cabecera[] = [];
  @Input() cabeceras = [];
  @Input() rowGroups: Row[];
  @Input() rowGroupsAux: Row[];
  @Input() seleccionarTodo = false;
  @Input() comboGuardiasIncompatibles;
  @Input() calendarios;
  @Input() dataToDuplicate;
  @Input() inscripciones: boolean;
  @Input() incompatibilidades: boolean;
  @Input() isLetrado: boolean;
  @Input() permisoTotal: boolean;
  @Output() resultado = new EventEmitter<{}>();
  @Output() descargaLOG = new EventEmitter<any[]>();
  @Output() anySelected = new EventEmitter<any>();
  @Output() save = new EventEmitter<Row[]>();
  @Output() delete = new EventEmitter<any>();
  @Output() deleteFromCombo = new EventEmitter<any>();
  comboTipos = [
    {
      label: 'Salto',
      value: 'S'
    },
    {
      label: 'Compensación',
      value: 'C'
    }
  ];

  habilitadoValidar: boolean;
  habilitadoDenegar: boolean;
  habilitadoSolicitarBaja: boolean;
  habilitadoCambiarFecha: boolean;
  fechaHoy: Date;

  cabecerasMultiselect = [];
  modalStateDisplay = true;
  searchText = [];
  selectedHeader;
  positionsToDelete = [];
  numCabeceras = 0;
  numColumnas = 0;
  numColumnasChecked = 0;
  selected = false;
  selectedArray = [];
  RGid = "inicial";
  down = false;
  from = 0;
  to = 10;
  numperPage = 10;
  enableGuardar = false;
  multiselectValue = [];
  multiselectLabels = [];
  cell = [];
  selectedRowValue: Cell[] = [];
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} guardias seleccionadas";
  @Input() totalRegistros = 0;
  @ViewChild('table') table: ElementRef;
  comboTipo: any;
  fechaActual: Date;
  observaciones: string;
  infoParaElPadre: { fechasolicitudbajaSeleccionada: any; fechaActual: any; observaciones: any; id_persona: any; idturno: any, idinstitucion: any, idguardia: any,  fechasolicitud: any, fechavalidacion: any, fechabaja: any, observacionessolicitud: any, observacionesbaja: any, observacionesvalidacion: any, observacionesdenegacion: any, fechadenegacion: any, observacionesvalbaja: any, fechavaloralta: any, fechavalorbaja: any, validarinscripciones: any, estado: any} [];
  jsonParaEnviar: { tipoAccion:any, datos: any};
  
  infoHabilitado: { isLetrado: any; validarjustificaciones:any; estadoNombre:any};
  last;
  entra = false;
  comboTurnos = [];


  @Input() firstColumn: number = 0;
  @Input() lastColumn: number = 10;
  @Input() filtrosValues = new CalendarioProgramadoItem();
  constructor(
    
    private renderer: Renderer2,
    private router: Router,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private commonsService : CommonsService,
    private sigaServices : SigaServices

  ) {
    this.renderer.listen('window', 'click', (event: { target: HTMLInputElement; }) => {
      for (let i = 0; i < this.table.nativeElement.children.length; i++) {

        if(!event.target.classList.contains("selectedRowClass")){
          this.selected = false;
          this.selectedArray = [];
        }
      }
    });
  }

  ngOnInit(): void {

    console.log('AÑADIR DATA TO DUPLICATE: ', this.dataToDuplicate)
console.log('this.rowGroups: tabla ', this.rowGroups)
console.log("VALOR DE MI INPUT: ",this.inscripciones)
    let values = [];
    let labels = [];
    let arrayOfSelected = [];
      if(this.rowGroups != undefined){
         this.rowGroups.forEach((row, i) => {
          //selecteCombo = {label: ?, value: row.cells[7].value}
          //>>no está igual if (row.cells)
          values.push(row.cells[6].value);
        });
        this.totalRegistros = this.rowGroups.length;
      }
      if (this.comboGuardiasIncompatibles != undefined){
      this.comboGuardiasIncompatibles.forEach(combo => {
        values.forEach(v => {
          if (combo.value == v){
            labels.push(combo.label)
          }
        });
       });
      }
      values.forEach((v, i) => {
        let selecteCombo = {label: '', value: ''}
        selecteCombo.label = labels[i];
        selecteCombo.value = v;
        arrayOfSelected[i] = selecteCombo;
        this.multiselectValue[i] = arrayOfSelected[i];
      });
      this.multiselectLabels = labels;
    this.numCabeceras = this.cabeceras.length;
    this.numColumnas = this.numCabeceras;
    this.cabeceras.forEach(cab => {
      this.cabecerasMultiselect.push(cab.name);
    })
    console.log('this.rowGroups: ', this.rowGroups)
    console.log('this.totalRegistros: ', this.totalRegistros)
    if(this.incompatibilidades){
      this.getComboTurno();
    }
  }

  onChangeMulti(event, rowPosition, cell){
    let deseleccionado;
   
    let selected = event.itemValue;
    let arraySelected = event.value;
    let labelSelected;
    if (arraySelected.includes(selected)){
      deseleccionado = false;
    } else {
      deseleccionado = true;
    }
    let turno = this.rowGroups[rowPosition].cells[0];
    let idGuardia = this.rowGroups[rowPosition].cells[7];
    let idTurno = this.rowGroups[rowPosition].cells[8];
    let idTurnoIncompatible = this.rowGroups[rowPosition].cells[5];
    let idGuardiaIncompatible = this.rowGroups[rowPosition].cells[6];
    let nombreTurnoInc = this.rowGroups[rowPosition].cells[9];
    if (deseleccionado){
      //eliminar doble
      this.eliminarFromCombo(this.rowGroups[rowPosition])
    } else {
      //guardar doble
      
      this.comboGuardiasIncompatibles.forEach(comboObj => {
        if ( comboObj.value == selected){
          labelSelected = comboObj.label;
        }
      })
      let cellguardiaInc:  Cell = new Cell();
      cellguardiaInc.type = 'text';
      cellguardiaInc.value = labelSelected;
      this.rowGroups[rowPosition].cells[10].value.push(labelSelected);
      //this.nuevoFromCombo(turno, cellguardiaInc, idGuardia, idTurno, idTurnoIncompatible, idGuardiaIncompatible, nombreTurnoInc);
    }
  
  }
  getComboTurno() {
    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurnos = n.combooItems;
      },
      err => {
        console.log(err);
      },
      () => {
        this.commonsService.arregloTildesCombo(this.comboTurnos);
      }
    );
  }
  onChangeTurno(event, row : Row, cell){
    if(event){
      this.getComboGuardias(row, event.value);
      row.cells[8].value = event.value;
    }else{
      row.cells[1].combo = [];
      row.cells[8].value = '';
    }
  }
  onChangeGuardia(event, row : Row, cell){
    if(event){
      row.cells[7].value = event.value;
    }else{
      row.cells[7].value = '';
    }
  }
  getComboGuardias(row : Row, idTurno){
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + idTurno).subscribe(
        data => {
          row.cells[1].combo = data.combooItems;    
        },
        err => {
          console.log(err);
        },
        ()=>{
          this.commonsService.arregloTildesCombo(row.cells[1].combo);
        }
      );
  }
  nuevoFromCombo(turno, guardiaInc, idGuardia, idTurno, idTurnoIncompatible, idGuardiaIncompatible, nombreTurnoInc){
    this.enableGuardar = true;
    let labelSelected = '';
    let row: Row = new Row();
    let cell1: Cell = new Cell();
    let cell2: Cell = new Cell();
    let cellInvisible: Cell = new Cell();
    let cellMulti:  Cell = new Cell();
    let cellArr: Cell = new Cell();
    let idG;
    cell1.type = 'input';
    cell1.value = '';
    cell2.type = 'input';
    cell2.value = '0';
    cellInvisible.type = 'invisible';
    cellInvisible.value = nombreTurnoInc;
    cellMulti.combo = this.comboGuardiasIncompatibles;
    cellMulti.type = 'multiselect'; 
    cellMulti.value = [idGuardia.value];
    this.comboGuardiasIncompatibles.forEach(comboObj => {
      if ( comboObj.value == idGuardia.value){
        labelSelected = comboObj.label;
      }
    });
    cellArr.type = 'invisible';
    cellArr.value = [labelSelected];
    if (idGuardia.value != ''){
      this.comboGuardiasIncompatibles.push({ label: labelSelected, value: idGuardia.value})
    }
    if(turno.type == 'turnoSelect'){
      let turnoTextCell : Cell = new Cell();
      turnoTextCell.type = 'text';
      turnoTextCell.value = '';

      row.cells = [turnoTextCell, guardiaInc, cellMulti, cell1, cell2, idTurno, idGuardia, idGuardiaIncompatible, idTurnoIncompatible, cellInvisible, cellArr];
    }else{
      row.cells = [turno, guardiaInc, cellMulti, cell1, cell2, idTurno, idGuardia, idGuardiaIncompatible, idTurnoIncompatible, cellInvisible, cellArr];
    }
    if (idGuardia.value != ''){
    this.rowGroups.unshift(row);
    }
    this.totalRegistros = this.rowGroups.length;
    this.rowGroupsAux = this.rowGroups;
    this.to = this.totalRegistros;
  }
  validaCheck(texto) {
    return texto === 'Si';
  }

  selectRow(rowId, rowCells) {
 this.selectedRowValue = rowCells;
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

    if(!this.incompatibilidades){
      this.HabilitarBotones();
    }


  }
  isSelected(id) {
    if (this.selectedArray.includes(id)) {
      return true;
    } else {
      return false;
    }
  }
  sortData(sort: Sort) {
    console.log("entro en el método Sort con valor:"+ sort.active+","+sort.direction);
    let data: Row[] = [];
    this.rowGroups = this.rowGroups.filter((row) => {
      data.push(row);
    });
    data = data.slice();
    if (!sort.active || sort.direction === '') {
      this.rowGroups = data;
      return;
    }

    this.rowGroups = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      for (let i = 0; i < this.cabeceras.length; i++) {
        let nombreCabecera = this.cabeceras[i].id;
        if (nombreCabecera == sort.active){
          console.log("a.cells["+i+"].type:"+a.cells[i].type);

          if (a.cells[i].type=='datePickerFin' && b.cells[i].type=='datePickerFin'){
            return compareDate(a.cells[i].value[0], b.cells[i].value[0], isAsc);
          }else if (a.cells[i].type=='date' && b.cells[i].type=='date'){
            return compareDate(a.cells[i].value, b.cells[i].value, isAsc);
          }
          else if (a.cells[i].type=='dateTime' && b.cells[i].type=='dateTime'){
            return compareDateAndTime(a.cells[i].value.label, b.cells[i].value.label, isAsc);
          }

          let valorA = a.cells[i].value;
          let valorB = b.cells[i].value;
          if (valorA!=null && valorB!=null){
            if(isNaN(valorA)){ //Checked for numeric
              const dayA = valorA.substr(0, 2) ;
              const monthA = valorA.substr(3, 2);
              const yearA = valorA.substr(6, 10);
              console.log("fecha a:"+ yearA+","+monthA+","+dayA);
              var dt=new Date(yearA, monthA, dayA);
              if(!isNaN(dt.getTime())){ //Checked for date
                return compareDate(a.cells[i].value, b.cells[i].value, isAsc);
              }else{
              }
            } else{
            }
          }

          return compare(a.cells[i].value, b.cells[i].value, isAsc);
          
        }
      }
 
    });

  }


  getComboLabel(key: string){
    for (let i = 0; i < this.comboTipos.length; i++){
      if (this.comboTipos[i].value == key){
        return this.comboTipos[i].label;
      }
    }
    return "";
  }
  setMyStyles(size) {
    let styles = {
      'max-width': size + 'px',
    };
    return styles;
  }

  searchChange(x: any) {
    let isReturnArr = [];
    this.rowGroups = this.rowGroupsAux.filter((row) => {
      let isReturn = true;
      for(let j=0; j<this.cabeceras.length;j++){
        if (this.searchText[j] != " " &&  this.searchText[j]){
          console.log('row.cells[j].value: ', row.cells[j].value)
          if (row.cells[j].value){
             console.log('row.cells[j].value 2: ', row.cells[j].value)
            console.log("tipo de celda:"+row.cells[j].type);
            if(row.cells[j].type == 'select'){
              let labelCombo = this.getComboLabel(row.cells[j].value);
              console.log("valor de celda:"+labelCombo);
              if (!labelCombo.toLowerCase().includes(this.searchText[j].toLowerCase())){
                isReturn = false;
                break;
              }
            } else if (!row.cells[j].value.toString().toLowerCase().includes(this.searchText[j].toLowerCase())){
              isReturn = false;
              break;
			} 
          }else{
              if (this.searchText[j]!=""){
                isReturn = false;
                break;
              }
          }
       }else if(x == j){ //Si no hay nada escrito en la cabecera del filtro y es la cabecera correspondiente, devolvemos la fila
        isReturn = true;
      }
    }
      if (isReturn){
        return row;
      }

    });
    this.totalRegistros = this.rowGroups.length;
  }


  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  isPar(numero): boolean {
    return numero % 2 === 0;
  }
  isLast(numero):boolean {
    return numero == this.to - 1;
  }
  fromReg(event){
    this.from = Number(event) - 1;
  }
  toReg(event){
    this.to = Number(event);
    if (this.to > this.totalRegistros){
      this.to = this.totalRegistros;
    }
  }
  perPage(perPage){
    this.numperPage = perPage;
  }
  getValuesOMIndex(index){
    let toDelete:Row;
      toDelete = this.rowGroups[index];
    return toDelete;
  }
  descargarLOG(){
    let dataToSendArr = [];
    let selectedValuesArr:Row[] = [];
    if (this.selectedArray.length > 0){
      this.selectedArray.forEach(index => {
        let selectedValues:Row  = this.getValuesOMIndex(index);
        selectedValuesArr.push(selectedValues);
      })
        
        selectedValuesArr.forEach(selectedRowValue => {

        let dataToSend = {
          'duplicar': false,
          'tabla': this.rowGroups,
          'turno':selectedRowValue.cells[0].value,
          'nombre': selectedRowValue.cells[1].value,
          'generado': selectedRowValue.cells[8].value,
          'numGuardias': selectedRowValue.cells[9].value,
          'listaGuarias': selectedRowValue.cells[5].value,
          'fechaDesde': '',
          'fechaHasta': '',
          'fechaProgramacion': selectedRowValue.cells[4].value.label,
          'estado': selectedRowValue.cells[7].value,
          'observaciones': selectedRowValue.cells[6].value,
          'idCalendarioProgramado': selectedRowValue.cells[10].value,
          'idTurno': selectedRowValue.cells[11].value,
          'idGuardia': selectedRowValue.cells[12].value,
          'filtrosBusqueda' : this.filtrosValues
        }
          if( dataToSend.estado == "Generada"){
            dataToSendArr.push(dataToSend);
            this.descargaLOG.emit(dataToSendArr);
          }
          else{
             this.showMsg('info', 'Error. No puede descargar el log del calendario ' + dataToSend.idCalendarioProgramado + ' porque no está Generado' ,'')
            }
      })
    } else if (this.selectedRowValue[0] != undefined){
      
      let dataToSend = {
        'duplicar': false,
        'tabla': this.rowGroups,
        'turno':this.selectedRowValue[0].value,
        'nombre': this.selectedRowValue[1].value,
        'generado': this.selectedRowValue[8].value,
        'numGuardias': this.selectedRowValue[9].value,
        'listaGuarias': this.selectedRowValue[5].value,
        'fechaDesde': '',
        'fechaHasta': '',
        'fechaProgramacion': this.selectedRowValue[4].value.label,
        'estado': this.selectedRowValue[7].value,
        'observaciones': this.selectedRowValue[6].value,
        'idCalendarioProgramado': this.selectedRowValue[10].value,
        'idTurno': this.selectedRowValue[11].value,
        'idGuardia': this.selectedRowValue[12].value,
        'filtrosBusqueda' : this.filtrosValues
      }
       if( dataToSend.estado == "Generada"){
        dataToSendArr.push(dataToSend);
        this.descargaLOG.emit(dataToSendArr);
       }else{
        this.showMsg('info', 'Error. No puede descargar el log del calendario ' + dataToSend.idCalendarioProgramado + ' porque no está Generado' ,'')
       }
    }else{
      this.showMsg('error', 'Error. Debe seleccionar uno o más registros para poder descargar sus LOGs' ,'')
    }
  }
  duplicar2(){
    if (this.selectedRowValue.length != 0){
      console.log('this.selectedRowValue', this.selectedRowValue)
    this.enableGuardar = true;
    let row: Row = new Row();
      
      let cell1: Cell = this.selectedRowValue[0];
      let cell2: Cell = this.selectedRowValue[1];
      let cell3: Cell = this.selectedRowValue[2];
      let cell4: Cell = this.selectedRowValue[3];
      let cell5: Cell = this.selectedRowValue[4];
      let cell6: Cell = this.selectedRowValue[5];
      let cell7: Cell = this.selectedRowValue[6];
      let cell8: Cell = this.selectedRowValue[7];
      let cell9: Cell = this.selectedRowValue[8];
      let cell10: Cell = this.selectedRowValue[9];
    
    row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell10];
    console.log(row)
    this.rowGroups.unshift(row);
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
    }
  }

  openTab(row) {

   /* if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }*/

    let dataToSend = {
      'duplicar': false,
      'tabla': [],
      'turno':row.cells[0].value,
      'nombre': row.cells[1].value,
      'generado': row.cells[8].value,
      'numGuardias': row.cells[9].value,
      'listaGuarias': row.cells[5].value,
      'fechaDesde': row.cells[2].value,
      'fechaHasta': row.cells[3].value,
      'fechaProgramacion': row.cells[4].value.value,
      'estado': row.cells[7].value,
      'observaciones': row.cells[6].value,
      'idCalendarioProgramado': row.cells[10].value,
      'idTurno': row.cells[11].value,
      'idGuardia': row.cells[12].value,
      'filtrosBusqueda' : this.filtrosValues
    }


    //2012-01-02 00:00:00.0 to 2012-01-02
    if (!this.seleccionarTodo && this.selectedArray.length <= 1) {
      //this.progressSpinner = true;
      this.persistenceService.setDatos(dataToSend);
      //this.persistenceService.setHistorico(evento.fechabaja ? true : false);
      this.router.navigate(["/fichaProgramacion"]);

    } else {
      /*if (evento.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }*/
    }
  }
  changeDateFormat2(date1){
    // date1 dd/MM/yyyy
    let date1C = date1.split("/").reverse().join("-")
    return date1C;
  }
  datetoString(date) {
  const pattern = 'dd/MM/yyyy';
    return this.datePipe.transform(date, pattern);
  }

  llamarFicha(row) {

    /* if (this.persistenceService.getPermisos() != undefined) {
       this.permisoEscritura = this.persistenceService.getPermisos();
     }*/
     console.log('se envia fecha: ', row.cells[4].value.value)
     console.log("ROW:",row);
     let dataToSend = {
      // 'duplicar': false,
      // 'tabla': [],
      'nombreturno':row.cells[25].value,
       'nombre_turno':row.cells[25].value,
       'nombre_guardia': row.cells[26].value,
       'fechasolicitud': row.cells[4].value,
       'fechavalidacion': row.cells[5].value,
       'estadonombre': row.cells[8].value,
       'idpersona': row.cells[21].value,
       'idinstitucion': row.cells[9].value,
       'ncolegiado': row.cells[0].value,
       'cifnif': null,
       'abreviatura': row.cells[27].value,
       'accion': null,
       'afechade':null,
       'apellidos':row.cells[28].value,
       'apellidos2': row.cells[29].value,
       'apellidosnombre':row.cells[1].value,
       'descripcion_tipo_guardia':null,
       'estado':row.cells[24].value,
       'fechaActual': new Date(),
       'fechabaja':row.cells[7].value,
       'fechadenegacion':row.cells[17].value,
       'fechadesde':null,
       'fechahasta':null,
       'fechamodificacion':null,
       'fechasolicitudbaja':row.cells[6].value,
       'fechatabla':null,
       'fechavaloralta':row.cells[30].value,
       'fechavalorbaja':row.cells[31].value,
       'guardias':null,
       'historico':null,
       'idarea':null,
       'idguardia':row.cells[11].value,
       'idmateria':null,
       'idsubzona':null,
       'idturno':row.cells[10].value,
       'idzona':null,
       'movil':null,
       'nombre':null,
       'nombre_area':null,
       'nombre_zona':null,
       'nombre_materia':null,
       'nombre_subzona':null,
       'numerocolegiado':null,
       'obligatoriedad_inscripcion':null,
       'observaciones':null,
       'observacionesbaja':row.cells[14].value,
       'observacionesdenegacion':row.cells[16].value,
       'observacionessolicitud':row.cells[13].value,
       'observacionestabla':null,
       'observacionesvalbaja':row.cells[18].value,
       'observacionesvalidacion':row.cells[15].value,
       'orden':null,
       'telefono':null,
       'tipoguardias':row.cells[32].value,
       'usumodificacion':null,
       'validarinscripciones':row.cells[23].value

     }
 
 
     //2012-01-02 00:00:00.0 to 2012-01-02
     if (!this.seleccionarTodo && this.selectedArray.length <= 1) {
       //this.progressSpinner = true;
       this.persistenceService.setDatos(dataToSend);
       //this.persistenceService.setHistorico(evento.fechabaja ? true : false);
       this.router.navigate(["/fichaInscripcionesGuardia"]);
 
     } 
   }

  duplicar(){
    console.log('duplicar this.selectedRowValue: ', this.selectedRowValue)
       /* if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }*/
    //duplicar-> fechadesde = fechahastaanterios + 1 dia
    let fd = new Date (this.changeDateFormat2(this.selectedRowValue[3].value))
    fd.setDate(fd.getDate() + 1);
    //'fechaDesde': this.datetoString(fd),
    let dataToSend = {
      'duplicar': true,
      'tabla': this.rowGroups,
      'turno':this.selectedRowValue[0].value,
      'nombre': this.selectedRowValue[1].value,
      'generado': this.selectedRowValue[8].value,
      'numGuardias': this.selectedRowValue[9].value,
      'listaGuarias': this.selectedRowValue[5].value,
      'fechaDesde': '',
      'fechaHasta': '',
      'fechaProgramacion': this.selectedRowValue[4].value.value,
      'estado': this.selectedRowValue[7].value,
      'observaciones': this.selectedRowValue[6].value,
      'idCalendarioProgramado': this.selectedRowValue[10].value,
      'idTurno': this.selectedRowValue[11].value,
      'idGuardia': this.selectedRowValue[12].value,
      'filtrosBusqueda' : this.filtrosValues
    }


    //2012-01-02 00:00:00.0 to 2012-01-02
    if (!this.seleccionarTodo && this.selectedArray.length <= 1) {
      //this.progressSpinner = true;
      this.persistenceService.setDatos(dataToSend);
      //this.persistenceService.setHistorico(evento.fechabaja ? true : false);
      this.router.navigate(["/fichaProgramacion"]);

    } else {
      /*if (evento.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }*/
    }
  }

  nuevo(){
        /*{ type: 'text', value: res.nombreTurno },
    { type: 'text', value: res.nombreGuardia },
    { type: 'multiselect', combo: this.comboGuardiasIncompatibles, value: ArrComboValue },
    { type: 'input', value: res.motivos },
    { type: 'input', value: res.diasSeparacionGuardias },
    { type: 'invisible', value: res.idTurnoIncompatible },
    { type: 'invisible', value: res.idGuardiaIncompatible },
    { type: 'invisible', value: res.idGuardia },
    { type: 'invisible', value: res.idTurno },
    { type: 'invisible', value: res.nombreTurnoIncompatible },
    { type: 'invisible', value: res.nombreGuardiaIncompatible }]*/
    this.enableGuardar = true;
    let row: Row = new Row();
    
    let cell1: Cell = new Cell();
    let cell2: Cell = new Cell();
    let cell3: Cell = new Cell();
    let cell4: Cell = new Cell();
    let cell5: Cell = new Cell();
    let cell6: Cell = new Cell();
    let cell7: Cell = new Cell();
    let cell8: Cell = new Cell();
    let cell9: Cell = new Cell();
    let cell10: Cell = new Cell();
    let cellMulti:  Cell = new Cell();


    if(this.calendarios){
      cell1.type = 'input';
      cell1.value = '';
      cell2.type = 'input';
      cell2.value = '';
      cell3.type = 'datePicker';
      cell3.value = '';
      cell4.type = 'datePicker';
      cell4.value = '';
      cell5.type = 'datePicker';
      cell5.value = '';
      cell6.type = 'input';
      cell6.value = '';
      cell7.type = 'input';
      cell7.value = '';
      cell8.type = 'input';
      cell8.value = '';
      cell9.type = 'checkbox';
      cell9.value = '';
      cell10.type = 'input';
      cell10.value = '';
      row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell10];
    }else{
      cell1.type = 'turnoSelect';
      cell1.combo = JSON.parse(JSON.stringify(this.comboTurnos));
      cell1.value = '';
      cell2.type = 'guardiaSelect';
      cell2.value = '';
      cell3.type = 'input';
      cell3.value = '';
      cell4.type = 'input';
      cell4.value = '';
      cell5.type = 'invisible';
      cell5.value = '';
      cell6.type = 'invisible';
      cell6.value = '';
      cell7.type = 'invisible';
      cell7.value = '';
      cell8.type = 'invisible';
      cell8.value = '';
      cell9.type = 'invisible';
      cell9.value = '';
      cell10.type = 'invisible';
      cell10.value = [];
      cellMulti.combo = this.comboGuardiasIncompatibles;
      cellMulti.type = 'multiselect'; 
      row.cells = [cell1, cell2, cellMulti, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell10];
    }
    row.id = 0;
    this.rowGroups.map(row => row.id += 1);
    this.rowGroups.unshift(row);
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
    //this.to = this.totalRegistros;
  }
  inputChange(event, i, z, cell){
    this.enableGuardar = true;
  }

  guardar(){
    let anyEmptyArr = [];
    this.rowGroups.forEach(row =>{
      if(row.cells[0].value == '' ||  row.cells[0].value == null || row.cells[1].value == '' ||  row.cells[1].value == null || row.cells[2].value == '' ||  row.cells[2].value == null || row.cells[4].value == '' ||  row.cells[4].value == null){
        anyEmptyArr.push(true);
        return ;
      } else{
        anyEmptyArr.push(false);
      }
    })
    
    if (anyEmptyArr.includes(true)){
      this.showMsg('error', 'Error. Existen campos vacíos en la tabla.', '')
    }else{
      this.showMsg('success', 'Se ha guardado correctamente', '')
      this.save.emit( this.rowGroups);
      this.enableGuardar = false;
      this.totalRegistros = this.rowGroups.length;
    }
  }

  getLastCalendario(idTurno, idGuardia, fechaDesdeSelected, idGuardiaSelected){
    let datosEntrada = 
    { 'idTurno': idTurno,
      'idConjuntoGuardia': null,
     'idGuardia': idGuardia,
      'fechaCalendarioDesde': null,
      'fechaCalendarioHasta': null,
      'fechaProgramadaDesde': null,
      'fechaProgramadaHasta': null,
    };
    this.sigaServices.post(
      "guardiaUltimoCalendario_buscar", datosEntrada).subscribe(
        data => {
          console.log('data: ', data.body)
          let error = JSON.parse(data.body).error;
          let datos = JSON.parse(data.body);
          if(datos){

              this.last  = 
              {
                'duplicar': false,
                'turno': datos.turno,
                'nombre': datos.guardia,
                'tabla' : [],
                'idTurno': datos.idTurno,
                'idGuardia': datos.idGuardia,
                'observaciones': datos.observaciones,
                'fechaDesde': datos.fechaDesde.split("-")[2].split(" ")[0] +"/"+ datos.fechaDesde.split("-")[1] + "/"+ datos.fechaDesde.split("-")[0],
                'fechaHasta': datos.fechaHasta.split("-")[2].split(" ")[0] +"/"+ datos.fechaHasta.split("-")[1] + "/"+ datos.fechaHasta.split("-")[0],
                'fechaProgramacion': '',
                'estado': '' ,
                'generado': datos.generado,
                'numGuardias': datos.numGuardias,
                'idCalG': datos.idCalG,
                'listaGuarias': {value : ''},
                'idCalendarioProgramado': datos.idCalendarioProgramado,
                'facturado': datos.facturado,
                'asistenciasAsociadas': datos.asistenciasAsociadas
              };
              if (compareDate (this.last.fechaDesde, fechaDesdeSelected, true) == 1 && idGuardiaSelected == this.last.idGuardia){
                this.entra = true;
              }
          }

        },
        (error)=>{
          console.log(error);
        }
      );


  }
  eliminar(){
    let entra = false;
    if(!this.incompatibilidades){
      this.selectedArray.forEach((index) => {
          let fechaDesdeSelected = this.rowGroups[index].cells[2].value;
          let idTurnoSelected = this.rowGroups[index].cells[11].value;
          let idGuardiaSelected = this.rowGroups[index].cells[12].value;
          let facturadoSelected = this.rowGroups[index].cells[13].value;
          let asistenciasSelected = this.rowGroups[index].cells[14].value;
          this.rowGroups.forEach(rg => {
            let fechaDesde = rg.cells[2].value;
            let idGuardia = rg.cells[12].value;
            this.getLastCalendario(idTurnoSelected, idGuardiaSelected, fechaDesdeSelected, idGuardiaSelected);
            
          });
        
          if (entra || this.entra){
            //fechaDesde > fechaDesdeSelected: Calendarios seleccionados no son los últimos generados (por fecha desde) para la misma guardia.
            let errorcalPosterior = "No puede eliminarse el calendario con fecha desde " + fechaDesdeSelected + " , ya que existen calendarios posteriores para esta guardia";
              let mess = 'Se van a borrar ' + this.selectedArray.length + ' calendarios ya generados en la programación seleccionada. ¿Desea continuar?';
              this.confirmDelete(errorcalPosterior, mess);
          }else{
            this.eliminarCheck(facturadoSelected, asistenciasSelected);
          }
      })
    }else{
      this.eliminarCheck(false, false);
    }

    
  }

  eliminarCheck(facturado, asistencias){
      if (facturado){
        //existen guardias de colegiado facturadas en esos calendarios
        let errorFac = "No pueden eliminarse calendarios con guardias de colegiado facturadas";
        let mess = 'Se van a borrar ' + this.selectedArray.length + ' calendarios ya generados en la programación seleccionada. ¿Desea continuar?';
        this.confirmDelete(errorFac, mess);
      }else if (asistencias){
        //existen asistencias en las guardias de colegiado de esos calendarios
        let errorAs = "No pueden eliminarse calendarios cuyas guardias de colegiado tienen asistencias";
        let mess = 'Se van a borrar ' + this.selectedArray.length + ' calendarios ya generados en la programación seleccionada. ¿Desea continuar?';
        this.confirmDelete(errorAs, mess);
      }else{
        //borrado ok
        this.delete.emit(this.selectedArray);
        this.totalRegistros = this.rowGroups.length;
        this.rowGroupsAux = this.rowGroups;
      }
   
  }
  confirmDelete(error, mess) {
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      key: "eliminarCalendario",
      accept: () => {
        if (error != ""){
          this.showMsg('error', error, error);
        }
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
  eliminarFromCombo(rowToDelete){
    this.deleteFromCombo.emit(rowToDelete);
    this.rowGroupsAux = this.rowGroups;
  }
  selectedAll(evento){
    this.seleccionarTodo = evento;
  }

  changeDateFormat(date1){
    let year = date1.substring(0, 4)
    let month = date1.substring(5,7)
    let day = date1.substring(8, 10)
    let date2 = day + '/' + month + '/' + year;
    return date2;
  }
  

  //mirar el formato de fecha que necesito

  transformaFecha(fecha) {
    if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(fecha);
      }
    } else {
      fecha = undefined;
    }


    return fecha;
  }

  transformaFechaSol(fecha) {
    if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
        let [fechaMod,hora] = rawDate.split(" ");
        let arrayDate = fechaMod.split("/")[2] + "-" + fechaMod.split("/")[1] + "-" + fechaMod.split("/")[0];
        fecha = new Date((arrayDate += "T"+hora));
      
    } else {
      fecha = undefined;
    }


    return fecha;
  }

  changeFecha(event){
    this.fechaActual = event;
  }

  HabilitarBotones(){
    let validarjustificaciones = '';
    let estadoNombre = '';
    if (this.selectedRowValue[22] != undefined){
       validarjustificaciones = this.selectedRowValue[22].value;
    }
    if (this.selectedRowValue[8] != undefined){
      estadoNombre = this.selectedRowValue[8].value;
    }
    this.infoHabilitado= {
      isLetrado : this.isLetrado,
      validarjustificaciones: validarjustificaciones,
      estadoNombre: estadoNombre
 };    

    if(this.infoHabilitado.validarjustificaciones=="S" && (this.infoHabilitado.estadoNombre=="Pendiente de Alta" || this.infoHabilitado.estadoNombre=="Pendiente de Baja") && !this.isLetrado){
      this.habilitadoValidar=false;
    }else{
      this.habilitadoValidar=true;
    }

    if((this.infoHabilitado.estadoNombre=="Pendiente de Alta" || this.infoHabilitado.estadoNombre=="Pendiente de Baja")&& !this.isLetrado){
      this.habilitadoDenegar=false;
    }else{
      this.habilitadoDenegar=true;
    }


    if(this.infoHabilitado.estadoNombre=="Alta"){
      this.habilitadoSolicitarBaja=false;
    }else{
      this.habilitadoSolicitarBaja=true;

  }


  }

  validar(){
    this.infoParaElPadre = [];
    console.log("entra");
    console.log("observaciones:",this.observaciones);
    console.log("fecha:",this.fechaActual);

    this.selectedArray.forEach(el => {
      let obj = JSON.parse(JSON.stringify(this.rowGroups[el])).cells;
      this.infoParaElPadre.push( {
        'fechasolicitudbajaSeleccionada': this.transformaFecha(obj[6].value),
        'fechaActual': this.fechaActual,
        'observaciones': this.observaciones,
        'id_persona': obj[21].value,
        'idinstitucion' : obj[9].value,
        'idturno': obj[10].value,
        'idguardia': obj[11].value,
        'fechasolicitud': this.transformaFechaSol(obj[4].value),
        'fechavalidacion': this.transformaFecha(obj[5].value),
        'fechabaja': this.transformaFecha(obj[12].value),
        'observacionessolicitud': obj[13].value,
        'observacionesbaja': obj[14].value,
        'observacionesvalidacion': obj[15].value,
        'observacionesdenegacion': obj[16].value,
        'fechadenegacion': this.transformaFecha(obj[17].value),
        'observacionesvalbaja': obj[18].value,
        'fechavaloralta': obj[19].value,
        'fechavalorbaja': obj[20].value,
        'validarinscripciones': obj[23].value,
        'estado': obj[24].value


      });
      
    });

    this.jsonParaEnviar = 
    {'tipoAccion': "validar",
      'datos': this.infoParaElPadre}
      console.log(this.jsonParaEnviar);
    this.resultado.emit(this.jsonParaEnviar);
  }

  denegar(){

    this.infoParaElPadre = [];

    this.selectedArray.forEach(el => {
      let obj = JSON.parse(JSON.stringify(this.rowGroups[el])).cells;
      this.infoParaElPadre.push( {
        'fechasolicitudbajaSeleccionada': this.transformaFecha(obj[6].value),
        'fechaActual': this.fechaActual,
        'observaciones': this.observaciones,
        'id_persona': obj[21].value,
        'idinstitucion' : obj[9].value,
        'idturno': obj[10].value,
        'idguardia': obj[11].value,
        'fechasolicitud': this.transformaFechaSol(obj[4].value),
        'fechavalidacion': this.transformaFecha(obj[5].value),
        'fechabaja': this.transformaFecha(obj[12].value),
        'observacionessolicitud': obj[13].value,
        'observacionesbaja': obj[14].value,
        'observacionesvalidacion': obj[15].value,
        'observacionesdenegacion': obj[16].value,
        'fechadenegacion': this.transformaFecha(obj[17].value),
        'observacionesvalbaja': obj[18].value,
        'fechavaloralta': obj[19].value,
        'fechavalorbaja': obj[20].value,
        'validarinscripciones': obj[23].value,
        'estado': obj[24].value
      });
      
    });

    this.jsonParaEnviar = 
    {'tipoAccion': "denegar",
      'datos': this.infoParaElPadre}
    this.resultado.emit(this.jsonParaEnviar);  
  }

  solicitarBaja(){

    this.infoParaElPadre = [];

    this.selectedArray.forEach(el => {
      let obj = JSON.parse(JSON.stringify(this.rowGroups[el])).cells;
      this.infoParaElPadre.push( {
        'fechasolicitudbajaSeleccionada': this.transformaFecha(obj[6].value),
        'fechaActual': this.fechaActual,
        'observaciones': this.observaciones,
        'id_persona': obj[21].value,
        'idinstitucion' : obj[9].value,
        'idturno': obj[10].value,
        'idguardia': obj[11].value,
        'fechasolicitud': this.transformaFechaSol(obj[4].value),
        'fechavalidacion': this.transformaFecha(obj[5].value),
        'fechabaja': this.transformaFecha(obj[12].value),
        'observacionessolicitud': obj[13].value,
        'observacionesbaja': obj[14].value,
        'observacionesvalidacion': obj[15].value,
        'observacionesdenegacion': obj[16].value,
        'fechadenegacion': this.transformaFecha(obj[17].value),
        'observacionesvalbaja': obj[18].value,
        'fechavaloralta': obj[19].value,
        'fechavalorbaja': obj[20].value,
        'validarinscripciones': obj[23].value,
        'estado': obj[24].value


      });
      
    });


    this.jsonParaEnviar = 
    {'tipoAccion': "solicitarBaja",
      'datos': this.infoParaElPadre}
    this.resultado.emit(this.jsonParaEnviar);  
  }

  cambiarFecha(){

    this.infoParaElPadre = [];
    
    this.rowGroups.forEach(el => {
      let obj = JSON.parse(JSON.stringify(el.cells));
      this.infoParaElPadre.push( {
        'fechasolicitudbajaSeleccionada': this.transformaFecha(obj[6].value),
        'fechaActual': this.fechaActual,
        'observaciones': this.observaciones,
        'id_persona': obj[21].value,
        'idinstitucion' : obj[9].value,
        'idturno': obj[10].value,
        'idguardia': obj[11].value,
        'fechasolicitud': this.transformaFechaSol(obj[4].value),
        'fechavalidacion': this.transformaFecha(obj[5].value),
        'fechabaja': this.transformaFecha(obj[12].value),
        'observacionessolicitud': obj[13].value,
        'observacionesbaja': obj[14].value,
        'observacionesvalidacion': obj[15].value,
        'observacionesdenegacion': obj[16].value,
        'fechadenegacion': this.transformaFecha(obj[17].value),
        'observacionesvalbaja': obj[18].value,
        'fechavaloralta': obj[19].value,
        'fechavalorbaja': obj[20].value,
        'validarinscripciones': obj[23].value,
        'estado': obj[24].value


      });
      
    });

    this.jsonParaEnviar = 
    {'tipoAccion': "cambiarFecha",
      'datos': this.infoParaElPadre}
    this.resultado.emit(this.jsonParaEnviar);  
  }
}

function compareDateAndTime (date1:  any, date2:  any, isAsc: boolean){
  let objDate1 = null;
  let hour1 = null;
  let objDate2 = null;
  let hour2 = null;
  let fechaA1 = date1.split("/").join("-")
  let fechaA = fechaA1.split(" ")[0];
  let horaA = fechaA1.split(" ")[1].split(":").join("-");
  if (fechaA!=null && horaA!=null){
    const dayA = fechaA.substr(0, 2) ;
    const monthA = fechaA.substr(3, 2);
    const yearA = fechaA.substr(6, 10);
    const hourA = horaA.substr(0, 2);
    const minA = horaA.substr(3, 2);
    const segA = horaA.substr(6, 8);
    console.log("fecha a:"+ yearA+","+monthA+","+dayA +  "  " + hourA + ":" + minA + ":" + segA);
    objDate1= {  day: dayA,month: monthA, year: yearA};
    hour1={ hour: hourA,minute: minA,second: segA};
  }
  let fechaB1 = date2.split("/").join("-")
  let fechaB = fechaB1.split(" ")[0];
  let horaB = fechaB1.split(" ")[1].split(":").join("-");
  if (fechaB!=null){
    const dayB = fechaB.substr(0, 2) ;
    const monthB = fechaB.substr(3, 2);
    const yearB = fechaB.substr(6, 10);
    const hourB = horaB.substr(0, 2);
    const minB = horaB.substr(3, 2);
    const segB = horaB.substr(6, 8);
    console.log("fecha b:"+ yearB+","+monthB+","+dayB+  "  " + hourB + ":" + minB + ":" + segB);
    objDate2= {  day: dayB,month: monthB, year: yearB};
    hour2={ hour: hourB,minute: minB,second: segB};
  }

  console.log("comparacionDate isAsc:"+ isAsc+";");

  return  compareDateHour(objDate1, hour1, objDate2, hour2, isAsc);

}

function compareDateHour(dateObj1,hour1,dateObj2,hour2, isAsc){

  let objDate1=new Date(dateObj1.year+'-'+dateObj1.month+"-"+dateObj1.day+
  " "+ hour1.hour +":" + hour1.minute + ":" + hour1.second + ".000Z");
  let objDate2=new Date(dateObj2.year+'-'+dateObj2.month+"-"+dateObj2.day+
  " "+ hour2.hour +":" + hour2.minute + ":" + hour2.second + ".000Z");

  //return (objDate1.getTime() / 1000) > (objDate2.getTime() / 1000) ? true :false;
  return ((objDate1.getTime() / 1000) < (objDate2.getTime() / 1000) ? -1 : 1) * (isAsc ? 1 : -1);
}

function compareDate (fechaA:  any, fechaB:  any, isAsc: boolean){

  let dateA = null;
  let dateB = null;
  if (fechaA!=null){
    const dayA = fechaA.substr(0, 2) ;
    const monthA = fechaA.substr(3, 2);
    const yearA = fechaA.substr(6, 10);
    console.log("fecha a:"+ yearA+","+monthA+","+dayA);
    dateA = new Date(yearA, monthA, dayA);
  }

  if (fechaB!=null){
    const dayB = fechaB.substr(0, 2) ;
    const monthB = fechaB.substr(3, 2);
    const yearB = fechaB.substr(6, 10);
    console.log("fecha b:"+ yearB+","+monthB+","+dayB);
    dateB = new Date(yearB, monthB, dayB);
  }

  console.log("comparacionDate isAsc:"+ isAsc+";");

  return compare(dateA, dateB, isAsc);


}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  console.log("comparacion  a:"+ a+"; b:"+ b);

  if (typeof a === "string" && typeof b === "string") {
    console.log("comparacion  de cadenas");
    a = a.toLowerCase();
    b = b.toLowerCase();
  }

  console.log("compare isAsc:"+ isAsc+";");

  if (a==null && b!=null){
    return ( 1 ) * (isAsc ? 1 : -1);
  }
  if (a!=null && b==null){
    return ( -1 ) * (isAsc ? 1 : -1);
  }

  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}					   

