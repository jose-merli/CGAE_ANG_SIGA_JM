import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ControlAccesoDto } from "./../../../../../../app/models/ControlAccesoDto";
import { TranslateService } from "./../../../../../commons/translate/translation.service";
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { InformesModelosComItem } from '../../../../../models/InformesModelosComunicacionesItem';
import { ModelosComunicacionesItem } from '../../../../../models/ModelosComunicacionesItem';


@Component({
  selector: 'app-tarjeta-informes',
  templateUrl: './tarjeta-informes.component.html',
  styleUrls: ['./tarjeta-informes.component.scss']
})
export class TarjetaInformesComponent implements OnInit {

  openFicha: boolean = false;
  activacionEditar: boolean = true;
  derechoAcceso: any;
  permisos: any;
  permisosArray: any[];
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  clasesComunicaciones: any[];
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  body: InformesModelosComItem = new InformesModelosComItem;
  modelo: ModelosComunicacionesItem = new ModelosComunicacionesItem;

  @ViewChild('table') table: DataTable;
  selectedDatos

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "perfiles",
      activa: false
    },
    {
      key: "informes",
      activa: false
    },
    {
      key: "comunicacion",
      activa: false
    },

  ];

  constructor(private router: Router, private translateService: TranslateService,
    private sigaServices: SigaServices, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.getDatos();

    this.selectedItem = 10;
    this.cols = [
      { field: 'idioma', header: 'Idioma' },
      // { field: 'fechaAsociacion', header: 'Fecha asociación' },
      { field: 'ficheroSalida', header: 'Fichero salida' },
      { field: 'sufijo', header: 'Sufijo' },
      { field: 'formatoSalida', header: 'Formato salida' },
      { field: 'destinatarios', header: 'Destinatarios' },
      { field: 'condicion', header: 'Condición' },
      { field: 'multiDocumento', header: 'Multi-documento' },
      { field: 'datos', header: 'Datos' }
    ]

    this.datos = [
      { id: 1, idioma: 'prueba', ficheroSalida: 'prueba' }

    ]
  }

  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevoModelo") == null) {
      this.openFicha = !this.openFicha;
      if (this.openFicha) {
        this.getDatos();
      }
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


  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "110";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        // if (this.derechoAcceso == 3) {
        //   this.activacionEditar = true;
        // } else if (this.derechoAcceso == 2) {
        //   this.activacionEditar = false;
        // } else {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        //   this.router.navigate(["/errorAcceso"]);
        // }
      }
    );
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

  navigateTo(dato) {
    let id = dato[0].id;
    if (!this.selectMultiple) {
      this.router.navigate(['/fichaPlantillaDocumento']);
      sessionStorage.setItem("modelosInformesSearch", JSON.stringify(this.body));
    }

  }

  getDatos(){
    if (sessionStorage.getItem("modelosSearch") != null) {
      this.modelo = JSON.parse(sessionStorage.getItem("modelosSearch"));
    }    
    this.getInformes();
  }
  getInformes() {
    this.sigaServices.post("modelos_detalle_informes", this.modelo).subscribe(
      data => {
        this.datos = JSON.parse(data.body).plantillasDocumentos;
      },
      err => {
        console.log(err);
      }
    );
  }

  addInforme() {
    this.router.navigate(['/fichaPlantillaDocumento']);
  }


}
