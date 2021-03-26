import { Component, OnInit,Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-gestion-designaciones',
  templateUrl: './gestion-designaciones.component.html',
  styleUrls: ['./gestion-designaciones.component.scss']
})
export class GestionDesignacionesComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  buscadores = [];
  selectedItem: number = 10;
  initDatos;
  datosInicial = [];
  selectedDatos: any[] = [];
  isLetrado:boolean = false;
  first = 0;
  progressSpinner: boolean = false;
  
  //Resultados de la busqueda
  @Input() datos;

  @Output() searchPartidas = new EventEmitter<boolean>();

  @ViewChild("table") tabla: Table;

  constructor(private persistenceService: PersistenceService) { }

  ngOnInit() {
    if (
      sessionStorage.getItem("isLetrado") != null &&
      sessionStorage.getItem("isLetrado") != undefined
    ) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
    this.selectedDatos = [];
    // this.datos.fechaActual = new Date();
    this.getCols();
    // this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    // this.initDatos = JSON.parse(JSON.stringify((this.datos)));
    // if (this.persistenceService.getPaginacion() != undefined) {
    //   let paginacion = this.persistenceService.getPaginacion();
    //   this.first = paginacion.paginacion;
    //   this.selectedItem = paginacion.selectedItem;
    // }
    this.progressSpinner = false;
  }

  getCols(){

    this.cols = [
      { field: "turno", header: "justiciaGratuita.sjcs.designas.DatosIden.turno" },
      { field: "anonum", header: "justiciaGratuita.ejg.datosGenerales.annioNum" },
      { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha" },
      { field: "estado", header: "censo.nuevaSolicitud.estado" },
      { field: "ncolegiado", header: "facturacionSJCS.facturacionesYPagos.numColegiado" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre.apellidos" },
      { field: "interesados", header: "justiciaGratuita.justiciables.literal.interesados" },
      { field: "validada", header: "general.boton.validar" },
    ];
    this.cols.forEach(element => {
      this.buscadores.push("");
    });

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

}
