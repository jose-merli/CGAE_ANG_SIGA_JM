import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable, Message } from 'primeng/primeng';
import { ListaGuardiasItem } from '../../../../../models/guardia/ListaGuardiasItem';

@Component({
  selector: 'app-resultado-lista-guardias',
  templateUrl: './resultado-lista-guardias.component.html',
  styleUrls: ['./resultado-lista-guardias.component.scss']
})
export class ResultadoListaGuardiasComponent implements OnInit {

  msgs : Message [] = [];
  rows : number = 10;
  rowsPerPage = [
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
  columnas = [];
  seleccionMultiple : boolean = false;
  seleccionarTodo : boolean = false;
  progressSpinner : boolean = false;
  numSeleccionado : number = 0;
  selectedDatos : ListaGuardiasItem [] = [];
  @Input() filtro : ListaGuardiasItem;
  @ViewChild("table") table: DataTable;
  @Input() listas : ListaGuardiasItem [] = [];
  @Input() permisosEscritura : boolean = false;
  constructor(private changeDetectorRef : ChangeDetectorRef,
    private router : Router) { }

  ngOnInit() {
  }

  onChangeRowsPerPages(event) {
    this.rows = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSeleccionMultiple(){
    if(this.table.selectionMode == 'single'){
      this.table.selectionMode = 'multiple';
      this.seleccionMultiple = true;
    }else{
      this.table.selectionMode = 'single';
      this.seleccionMultiple = false;
    }
    this.selectedDatos = [];
    this.numSeleccionado = 0;
  }

  onChangeSeleccionarTodo(){
    if(this.seleccionarTodo){
      this.selectedDatos = this.listas;
      this.numSeleccionado = this.selectedDatos.length;
    }else{
      this.selectedDatos = [];
      this.numSeleccionado = 0;

    }
  }

  onSelectRow(lista : ListaGuardiasItem){

    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 1;
      //REDIRECCION FICHA LISTA GUARDIA
      sessionStorage.setItem("filtroListaGuardia",JSON.stringify(this.filtro));
      sessionStorage.setItem("lista",JSON.stringify(lista));
      this.router.navigate(["/fichaListaGuardias"]);
    }else{
      this.numSeleccionado = this.selectedDatos.length;
    }
  }

  actualizaSeleccionados(){
    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 0;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
    }
  }

  clear() {
    this.msgs = [];
  }

  showMsg(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }
}
