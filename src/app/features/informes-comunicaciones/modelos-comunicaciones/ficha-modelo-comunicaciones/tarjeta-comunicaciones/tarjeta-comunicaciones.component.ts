import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { ControlAccesoDto } from "./../../../../../../app/models/ControlAccesoDto";
import { SigaServices } from "./../../../../../_services/siga.service";

@Component({
  selector: 'app-tarjeta-comunicaciones',
  templateUrl: './tarjeta-comunicaciones.component.html',
  styleUrls: ['./tarjeta-comunicaciones.component.scss']
})
export class TarjetaComunicacionesComponent implements OnInit {

  openFicha: boolean = false;
  activacionEditar: boolean = true;
  derechoAcceso: any;
  permisos: any;
  permisosArray: any[];
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  idiomas: any[];
  formatos: any[];
  sufijos: any[];

  @ViewChild('table') table: DataTable;
  selectedDatos;

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "informes",
      activa: false
    },
    {
      key: "comunicacion",
      activa: false
    }
  ];

  constructor(private changeDetectorRef: ChangeDetectorRef, private sigaServices: SigaServices) { }

  ngOnInit() {

    this.selectedItem = 10;

    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'tipoEnvio', header: 'Tipo de envío' },
    ];

    this.datos = [
      { id: '1', nombre: 'prueba', tipoEnvio: 'prueba' },
      { id: '2', nombre: 'prueba', tipoEnvio: 'prueba' }
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
  }

  abreCierraFicha() {
    // let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.activacionEditar == true) {
      // fichaPosible.activa = !fichaPosible.activa;
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

  onRowSelect() {
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    }
  }




}
