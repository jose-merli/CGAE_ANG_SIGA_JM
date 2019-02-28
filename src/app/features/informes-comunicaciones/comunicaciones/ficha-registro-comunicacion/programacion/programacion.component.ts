import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { ProgComunicacionItem } from '../../../../../models/ProgramacionComunicacionItem';
import { SigaServices } from "./../../../../../_services/siga.service";
import { esCalendar } from "../../../../../utils/calendar";
import { Message } from "primeng/components/common/api";


@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.scss']
})
export class ProgramacionComponent implements OnInit {


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
  body: ProgComunicacionItem = new ProgComunicacionItem();
  bodyInicial: ProgComunicacionItem = new ProgComunicacionItem();
  modulos: any[];
  objetivos: any[];
  clasesComunicaciones: any[];
  es: any = esCalendar;
  msgs: Message[];
  arrayProgramar: any[];
  currentDate: Date = new Date();
  estados: any = [];
  editar: boolean = false;

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
    private sigaServices: SigaServices
  ) {



  }

  ngOnInit() {


    this.getEstadosEnvios();

    this.getDatos();


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



  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevaCom") == null) {
      this.openFicha = !this.openFicha;
      if (!this.body.fechaProgramada) {
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



  getDatos() {
    if (sessionStorage.getItem("comunicacionesSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("comunicacionesSearch"));
      this.body.fechaProgramada = this.body.fechaProgramada ? new Date(this.body.fechaProgramada) : null;
      this.body.fechaCreacion = this.body.fechaCreacion ? new Date(this.body.fechaCreacion) : null;
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      if (this.body.idEstado != '1' && this.body.idEstado != '4') {
        this.editar = true;
      }
    }else{
      this.editar = false;
    }
    this.body.fechaProgramada = this.body.fechaProgramada ? new Date(this.body.fechaProgramada) : null;
    this.body.fechaCreacion = this.body.fechaCreacion ? new Date(this.body.fechaCreacion) : null;

  }


  restablecer() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    if (this.body.fechaProgramada != null) {
      this.body.fechaProgramada = new Date(this.body.fechaProgramada)
    }

  }

  guardar() {
    this.arrayProgramar = [];
    let objProgramar = {
      idEnvio: this.body.idEnvio,
      idInstitucion: this.body.idInstitucion,
      fechaProgramada: new Date(this.body.fechaProgramada),
      idEstado: this.body.idEstado,
      idTipoEnvios: this.body.idTipoEnvios,
      idPlantillaEnvios: this.body.idPlantillaEnvios,
      descripcion: this.body.descripcion

    }
    this.arrayProgramar.push(objProgramar);
    this.sigaServices.post("enviosMasivos_programar", this.arrayProgramar).subscribe(
      data => {
        this.showSuccess('Se ha programado el envío correctamente');
        this.body.fechaProgramada = objProgramar.fechaProgramada;
        sessionStorage.setItem("comunicacionesSearch", JSON.stringify(this.body));
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      },
      err => {
        this.showFail('Error al programar el envío');
        console.log(err);
      },
      () => {
      }
    );
  }

  getEstadosEnvios() {
    this.sigaServices.get("enviosMasivos_estado").subscribe(
      data => {
        this.estados = data.combooItems;
        this.estados.unshift({ label: 'Seleccionar', value: '' });
      },
      err => {
        console.log(err);
      }
    );
  }


  isGuardarDisabled() {
    if (this.body.fechaProgramada != null) {
      return false;
    }
    return true;
  }

}
