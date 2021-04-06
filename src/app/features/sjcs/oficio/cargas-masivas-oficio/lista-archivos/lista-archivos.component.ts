import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-lista-archivos',
  templateUrl: './lista-archivos.component.html',
  styleUrls: ['./lista-archivos.component.scss']
})
export class ListaArchivosComponent implements OnInit {

  @Input() datos: any[];
  @Input() buscar: boolean = false;

  msgs: any[];
  table;
  selectedDatos;
  cols: any = [];
  rowsPerPage: any = [];
  numSelected: number = 0;
  selectedItem: number = 10;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,) { }

  ngOnInit() {
  }

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
  clear() {
    this.msgs = [];
  }
}
