import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { ProgEnviosMasivosItem } from '../../../../../models/ProgramacionEnviosMasivosItem';
import { Location } from "@angular/common";
import { SigaServices } from "./../../../../../_services/siga.service";
import { esCalendar } from "../../../../../utils/calendar";
import { Message } from "primeng/components/common/api";

@Component({
  selector: 'app-programacion-envio-masivo',
  templateUrl: './programacion-envio-masivo.component.html',
  styleUrls: ['./programacion-envio-masivo.component.scss']
})
export class ProgramacionEnvioMasivoComponent implements OnInit {


  openFicha: boolean = false;
  body: ProgEnviosMasivosItem = new ProgEnviosMasivosItem();
  bodyInicial: ProgEnviosMasivosItem = new ProgEnviosMasivosItem();
  es: any = esCalendar;
  fecha: Date;
  msgs: Message[];
  arrayProgramar: any[];
  currentDate: Date = new Date();
  estados: any[];



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
    if (sessionStorage.getItem("crearNuevoEnvio") == null) {
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


  backTo() {
    this.location.back();
  }

  getDatos() {
    if (sessionStorage.getItem("enviosMasivosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
      console.log(this.body)
      this.body.fechaProgramada = this.body.fechaProgramada ? new Date(this.body.fechaProgramada) : null;
      // this.body.fechaCreacion = this.body.fechaCreacion ? new Date(this.body.fechaCreacion) : null;
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }
    this.body.fechaProgramada = this.body.fechaProgramada ? new Date(this.body.fechaProgramada) : null;
    // this.body.fechaCreacion = this.body.fechaCreacion ? new Date(this.body.fechaCreacion) : null;

  }


  restablecer() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    if (this.body.fechaProgramada != null) {
      this.body.fechaProgramada = new Date(this.body.fechaProgramada)
    }

  }

  guardar() {
    debugger;
    this.arrayProgramar = [];
    let objProgramar = {
      idEnvio: this.body.idEnvio,
      idInstitucion: this.body.idInstitucion,
      fechaProgramada: new Date(this.body.fechaProgramada),
      idEstado: this.body.idEstado,
      idTipoEnvio: this.body.idTipoEnvio,
      idPlantillasEnvio: this.body.idPlantillasEnvio,
      descripcion: this.body.descripcion

    }
    this.arrayProgramar.push(objProgramar);
    this.sigaServices.post("enviosMasivos_programar", this.arrayProgramar).subscribe(
      data => {
        this.showSuccess('Se ha programado el envío correctamente');
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
        console.log(this.estados)
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
