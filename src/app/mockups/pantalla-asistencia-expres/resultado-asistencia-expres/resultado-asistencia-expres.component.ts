import { Component, OnInit } from '@angular/core';
import { RowGroup, TablaResultadoDesplegableAEService } from '../../tabla-resultado-desplegable/tabla-resultado-desplegable-ae.service';

@Component({
  selector: 'app-resultado-asistencia-expres',
  templateUrl: './resultado-asistencia-expres.component.html',
  styleUrls: ['./resultado-asistencia-expres.component.scss']
})
export class ResultadoAsistenciaExpresComponent implements OnInit {
  rowGroups: RowGroup[];
  rowGroupsAux: RowGroup[];
  showDatos: boolean = false;
  modoBusqueda: string = 'b';
  modoBusquedaB: boolean = true;
  show = true;
  titulo = "Asistencias";
  cabeceras = [
    {
      id: "asistencia", 
      name: "Asistencia"
    },
    {
      id: "idApNombreSexo", 
      name: "Nº Identificación - Apellido 1 Apellido 2, Nombre - Sexo"
    },
    {
      id: "delitosYobservaciones", 
      name: "Delitos / Observaciones"
    },
    {
      id: "ejg", 
      name: "EJG"
    },
    {
      id: "actuacion", 
      name: "Fecha Actuación"
    },
    {
      id: "lugar", 
      name: "Lugar"
    },
    {
      id: "diligencia", 
      name: "Nª Diligencia"
    }
];
  constructor(
    private trdService: TablaResultadoDesplegableAEService,
  ) { }

  ngOnInit(): void {
    this.rowGroups = this.trdService.getTableData();
    this.rowGroupsAux = this.trdService.getTableData();
  }
  showResponse(){
    this.show = true;
  }
  onHideDatos() {
    this.showDatos = !this.showDatos;
  }

  changeTab() {
    if (this.modoBusqueda === 'b') {
      this.modoBusquedaB = true;
    } else if (this.modoBusqueda === 'a') {
      this.modoBusquedaB = false;
    }
  }
}
