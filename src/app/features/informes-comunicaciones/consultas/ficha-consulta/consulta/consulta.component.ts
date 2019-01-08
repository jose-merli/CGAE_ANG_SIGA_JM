import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ControlAccesoDto } from "./../../../../../../app/models/ControlAccesoDto";
import { TranslateService } from "./../../../../../commons/translate/translation.service";
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { ConsultaConsultasItem } from '../../../../../models/ConsultaConsultasItem';
import { Message } from "primeng/components/common/api";



@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {

  openFicha: boolean = false;
  activacionEditar: boolean = true;
  derechoAcceso: any;
  permisos: any;
  permisosArray: any[];
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  cuerpo: String;
  showAyuda: boolean = false;
  showValores: boolean = false;
  body: ConsultaConsultasItem = new ConsultaConsultasItem();
  bodyInicial: ConsultaConsultasItem = new ConsultaConsultasItem();
  saltoLinea: string = '';
  msgs: Message[];
  valores: any[];
  consultaEditada: boolean = false;

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

  constructor(private router: Router, private translateService: TranslateService,
    private sigaServices: SigaServices, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
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
    if (sessionStorage.getItem("crearNuevaConsulta") == null) {
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

  onShowAyuda() {
    this.showAyuda = !this.showAyuda;
  }

  onShowValores() {
    // si la consulta requiere valores
    // /crear condicional según lo que traiga el back
    // si los requiere es true y sale el popUp, si no es false y se ejecuta directamente
    this.showValores = true;

  }

  getDatos() {
    if (sessionStorage.getItem("consultasSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("consultasSearch"));
      if (this.body.sentencia != 'undefined' && this.body.sentencia != null) {
        this.body.sentencia = this.body.sentencia.replace(new RegExp(",", "g"), ",\n");
      }
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }
  }

  guardar() {

    this.sigaServices.post("consultas_guardarConsulta", this.body).subscribe(
      data => {
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.showSuccess('Se ha guardado la consulta correctamente');
        this.consultaEditada = false;
        this.valores = [
          { clave: 'clave1', valor: '' },
          { clave: 'clave2', valor: '' }
        ];
      },
      err => {
        this.showFail('Error al guardar la consulta');
        console.log(err);
      },
      () => {

      }
    );

  }

  ejecutar() {

    this.showValores = false;
    this.sigaServices.post("consultas_guardarConsulta", this.body).subscribe(
      data => {
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.showSuccess('Se ha ejecutado la consulta correctamente');
      },
      err => {
        this.showFail('Error al ejecutar la consulta');
        console.log(err);
      },
      () => {

      }
    );

  }

  isButtonDisabled() {
    if (this.consultaEditada) {
      return true;
    }
    return false;
  }

  restablecer() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  onChangeConsulta() {
    this.consultaEditada = true;
  }


}
