import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Location } from "@angular/common";
import { SigaServices } from "./../../../../../_services/siga.service";
import { esCalendar } from "../../../../../utils/calendar";
import { DataTable } from "primeng/datatable";
import { DocumentosEnviosMasivosItem } from '../../../../../models/DocumentosEnviosMasivosItem';


@Component({
  selector: 'app-documentos-envio-masivo',
  templateUrl: './documentos-envio-masivo.component.html',
  styleUrls: ['./documentos-envio-masivo.component.scss']
})
export class DocumentosEnvioMasivoComponent implements OnInit {

  openFicha: boolean = false;
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  body: DocumentosEnviosMasivosItem = new DocumentosEnviosMasivosItem();


  @ViewChild('table') table: DataTable;
  selectedDatos

  fichasPosibles = [
    {
      key: "configuracion",
      activa: false
    },
    {
      key: "programacion",
      activa: false
    },
    {
      key: "destinatarios",
      activa: false
    },
    {
      key: "documentos",
      activa: false
    },

  ];

  constructor(
    // private router: Router,
    // private translateService: TranslateService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.getDatos();

    this.selectedItem = 10;
    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'enlaceDescarga', header: 'Enlace de descarga' }
    ]

    this.datos = [
      { id: 1, nombre: 'prueba', enlaceDescarga: 'prueba' }

    ]
  }

  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevoEnvio") == null) {
      this.openFicha = !this.openFicha;
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }




  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  getDatos() {
    if (sessionStorage.getItem("enviosMasivosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
    }
  }

}
