import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { ControlAccesoDto } from "./../../../../../../app/models/ControlAccesoDto";
import { SigaServices } from "./../../../../../_services/siga.service";
import { ComunicacionesModelosComItem } from '../../../../../models/ComunicacionesModelosComunicacionesItem';
import { Message, ConfirmationService } from "primeng/components/common/api";
import { ModelosComunicacionesItem } from '../../../../../models/ModelosComunicacionesItem';

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
  msgs: Message[];
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  formatos: any[];
  sufijos: any[];
  body: ModelosComunicacionesItem = new ModelosComunicacionesItem();


  @ViewChild('table') table: DataTable;
  selectedDatos;

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

  constructor(private changeDetectorRef: ChangeDetectorRef, private sigaServices: SigaServices) { }

  ngOnInit() {
    this.getDatos();

    this.selectedItem = 10;

    this.cols = [
      { field: 'nombrePlantilla', header: 'Nombre' },
      { field: 'tipoEnvio', header: 'Tipo de envío' },
      { field: 'porDefecto', header: 'Por defecto' }
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

  onRowSelect() {
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    }
  }

  getDatos() {
    if (sessionStorage.getItem("modelosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("modelosSearch"));

      this.sigaServices.post("modelos_detalle_plantillasEnvios", this.body.idModeloComunicacion).subscribe(result => {
        debugger;
        let data = JSON.parse(result.body);
        this.datos = data.plantillas;
      }, error => {

      }, () => {

      })
    }
  }


  addComunicacion() {
    let nuevaPlantillaComunicacion = {
      idModeloComunicacion: this.body.idModeloComunicacion,
      idPlantillaEnvios: this.body.idPlantillaEnvios
    }
    this.selectedDatos = [];

    this.sigaServices.post("modelos_detalle_guardarPlantilla", nuevaPlantillaComunicacion).subscribe(result => {

    }, error => {
      console.log(error);
    }, () => {

    })
  }

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }


}
