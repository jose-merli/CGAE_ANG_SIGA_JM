import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { ProgEnviosMasivosItem } from '../../../../../models/ProgramacionEnviosMasivosItem';
import { Location } from "@angular/common";
import { SigaServices } from "./../../../../../_services/siga.service";
import { esCalendar } from "../../../../../utils/calendar";

@Component({
  selector: 'app-programacion-envio-masivo',
  templateUrl: './programacion-envio-masivo.component.html',
  styleUrls: ['./programacion-envio-masivo.component.scss']
})
export class ProgramacionEnvioMasivoComponent implements OnInit {


  openFicha: boolean = false;
  activacionEditar: boolean = true;
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  body: ProgEnviosMasivosItem = new ProgEnviosMasivosItem();
  modulos: any[];
  objetivos: any[];
  clasesComunicaciones: any[];
  es: any = esCalendar;

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
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    private sigaServices: SigaServices
  ) {



  }

  ngOnInit() {

    this.body.fechaProgramada = null;

    this.getDatos();

    this.selectedItem = 4;

    this.objetivos = [
      {
        label: 'seleccione..', value: null
      },
      {
        label: 'Destinatarios', value: '1'
      },
      {
        label: 'Condicional', value: '2'
      }
    ]


    this.cols = [
      { field: 'consulta', header: 'Consulta' },
      { field: 'finalidad', header: 'Finalidad' },
      { field: 'tipoEjecucion', header: 'Tipo de ejecución' }
    ];

    this.datos = [
      { id: '1', consulta: 'prueba', finalidad: 'prueba', tipoEjecucion: 'prueba' },
      { id: '2', consulta: 'prueba', finalidad: 'prueba', tipoEjecucion: 'prueba' }
    ];


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

    // this.body.idConsulta = this.consultas[1].value;
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

  onRowSelect() {
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    }
  }

  addConsulta() {
    let obj = {
      consulta: null,
      finalidad: null,
      tipoEjecucion: null
    };
    this.datos.push(obj);
    this.datos = [... this.datos];
  }


  backTo() {
    this.location.back();
  }

  getDatos() {
    if (sessionStorage.getItem("enviosMasivosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
      // let fechaCreacion = new Date(this.body.fechaCreacion)
    }
  }

}
