import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { FiltrosSaltosCompensacionesGuardiaComponent } from './filtros-saltos-compensaciones-guardia/filtros-saltos-compensaciones-guardia.component';
import { TablaResultadoMixSaltosCompGuardiaComponent } from './tabla-resultado-mix-saltos-comp-guardia/tabla-resultado-mix-saltos-comp-guardia.component';
import { Row, TablaResultadoMixSaltosCompService } from './tabla-resultado-mix-saltos-comp-guardia/tabla-resultado-mix-saltos-comp.service';
import { TablaSaltosCompensacionesGuardiaComponent } from './tabla-saltos-compensaciones-guardia/tabla-saltos-compensaciones-guardia.component';
@Component({
  selector: 'app-saltos-compensaciones-guardia',
  templateUrl: './saltos-compensaciones-guardia.component.html',
  styleUrls: ['./saltos-compensaciones-guardia.component.scss']
})
export class SaltosCompensacionesGuardiaComponent implements OnInit {

  // Varibles tabla nueva
  isDisabled;
  seleccionarTodo = false;
  totalRegistros = 0;
  rowGroups: Row[];
  rowGroupsAux: Row[];
  rowGroupsInit: Row[];
  selectedRow: Row;
  cabeceras = [
    {
      id: "turno",
      name: "dato.jgr.guardia.saltcomp.turno"
    },
    {
      id: "guardia",
      name: "dato.jgr.guardia.saltcomp.guardia"
    },
    {
      id: "nColegiado",
      name: "dato.jgr.guardia.saltcomp.ncolegiadoGrupo"
    },
    {
      id: "letrado",
      name: "dato.jgr.guardia.saltcomp.letrados"
    },
    {
      id: "saltoCompensacion",
      name: "dato.jgr.guardia.saltcomp.tipo"
    },
    {
      id: "fecha",
      name: "dato.jgr.guardia.saltcomp.fecha"
    },
    {
      id: "motivo",
      name: "dato.jgr.guardia.saltcomp.motivos"
    },
    {
      id: "fechaUso",
      name: "dato.jgr.guardia.saltcomp.fechauso"
    }
  ];
  comboTurnos: SelectItem[];
  comboGuardias: SelectItem[];
  opcionesTipo = [
    {
      label: 'Salto',
      value: 'S'
    },
    {
      label: 'Compensación',
      value: 'C'
    }
  ];
  datosIniciales;
  // Varibles tabla nueva

  buscar: boolean = false;
  historico: boolean = false;

  datos;

  progressSpinner: boolean = false;

  @ViewChild(FiltrosSaltosCompensacionesGuardiaComponent) filtros: FiltrosSaltosCompensacionesGuardiaComponent;
  @ViewChild(TablaResultadoMixSaltosCompGuardiaComponent) tabla: TablaResultadoMixSaltosCompGuardiaComponent;

  //comboPartidosJudiciales
  comboPJ;
  msgs;

  permisoEscritura;

  showResults: boolean = false;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router, private datepipe: DatePipe, private trmService: TablaResultadoMixSaltosCompService) { }


  ngOnInit() {

    this.commonsService.checkAcceso(procesos_guardia.saltos_compensaciones)
      .then(respuesta => {

        this.permisoEscritura = respuesta;

        this.persistenceService.setPermisos(this.permisoEscritura);

        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
      ).catch(error => console.error(error));

    this.getComboTurno();
  }

  getComboTurno() {

    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurnos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTurnos);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboGuardia(idTurno) {
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + idTurno).subscribe(
        data => {
          this.comboGuardias = data.combooItems;
          this.commonsService.arregloTildesCombo(this.comboGuardias);
        },
        err => {
          console.log(err);
        }
      );
  }

  isBuscar(event) {
    this.search(event);
  }

  searchHistory(event) {
    this.search(event);
  }

  search(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.postPaginado("saltosCompensacionesGuardia_buscar", "?numPagina=1", this.filtros.filtroAux).subscribe(
      n => {

        this.datos = JSON.parse(n.body).saltosCompItems;
        this.modifyData(this.datos);
        this.buscar = true;
        this.historico = event;

        let error = JSON.parse(n.body).error;

        if (error != null && error.description != null) {
          this.showMessage({ severity: "info", summary: this.translateService.instant("general.message.informacion"), msg: error.description });
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
        this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
      }
    );
  }

  resetSelect() {
    if (this.tabla != undefined) {
      // this.tabla.selectedDatos = [];
      // this.tabla.numSelected = 0;
      // this.tabla.selectMultiple = false;
      // this.tabla.selectAll = false;
    }
  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }

  clear() {
    this.msgs = [];
  }

  formatDate(date) {

    const pattern = 'dd/MM/yyyy';

    return this.datepipe.transform(date, pattern);

  }

  formatName(name: string) {
    const array = name.split(' ');
    let resp = '';

    switch (array.length) {
      case 1: resp = array[0];
        break;
      case 2: resp = `${array[1]}, ${array[0]}`;
        break;
      case 3: resp = `${array[1]} ${array[2]}, ${array[0]}`;
        break;
    }

    return resp;
  }

  modifyData(datos) {

    datos.forEach(dato => {

      dato.fecha = this.formatDate(dato.fecha);

      if (dato.fechaUso != undefined && dato.fechaUso != null) {
        dato.fechaUso = this.formatDate(dato.fechaUso);
      }

      if (dato.grupo != undefined && dato.grupo != null) {
        dato.nColegiado = dato.grupo;
        dato.letrado = '';

        if (dato.letradosGrupo != undefined && dato.letradosGrupo != null) {
          dato.letradosGrupo.forEach(element => {
            dato.letrado += element + '\n';
          });
        }

      } else {
        dato.nColegiado = dato.colegiadoGrupo;
      }

    });

    this.jsonToRow(datos);

  }

  // jsonToRow(datos) {
  //   let arr = [];
  //   datos.forEach((element, index) => {

  //     let italic = (element.fechaUso != null || element.fechaAnulacion != null);
  //     this.getComboGuardia(element.idTurno);
  //     let obj = [];

  //     setTimeout(() => {
  //       obj = [
  //         { type: 'select', combo: this.comboTurnos, value: element.idTurno, italic: italic },
  //         { type: 'select', combo: this.comboGuardias, value: element.idGuardia, italic: italic },
  //         { type: 'text', value: element.nColegiado },
  //         { type: 'text', value: element.letrado, italic: italic },
  //         { type: 'select', combo: this.opcionesTipo, value: element.saltoCompensacion, italic: italic },
  //         { type: 'datePicker', value: element.fecha, italic: italic },
  //         { type: 'textarea', value: element.motivo, italic: italic },
  //         { type: 'text', value: element.fechaUso, italic: italic }
  //       ];
  //       let superObj = {
  //         italic: italic,
  //         row: obj
  //       };
  //       arr.push(superObj);
  //       this.rowGroups = this.trmService.getTableData(arr);
  //       this.rowGroupsAux = this.trmService.getTableData(arr);
  //       this.totalRegistros = this.rowGroups.length;

  //       if ((index + 1) == datos.length) {
  //         this.showResults = true;
  //         this.progressSpinner = false;
  //         setTimeout(() => {
  //           this.tabla.tablaFoco.nativeElement.scrollIntoView();
  //           this.tabla.historico = this.historico;
  //           this.rowGroupsInit = [...this.rowGroups];
  //         }, 5);
  //       }
  //     }, 1000);

  //   });
  // }

  jsonToRow(datos) {
    let arr = [];
    datos.forEach((element, index) => {

      let italic = (element.fechaUso != null || element.fechaAnulacion != null);

      let obj = [
        { type: 'select', combo: this.comboTurnos, value: element.idTurno, italic: italic },
        { type: 'select', combo: this.comboGuardias, value: element.idGuardia, italic: italic },
        { type: 'text', value: element.nColegiado },
        { type: 'text', value: element.letrado, italic: italic },
        { type: 'select', combo: this.opcionesTipo, value: element.saltoCompensacion, italic: italic },
        { type: 'datePicker', value: element.fecha, italic: italic },
        { type: 'textarea', value: element.motivo, italic: italic },
        { type: 'text', value: element.fechaUso, italic: italic }
      ];

      let superObj = {
        italic: italic,
        row: obj
      };

      arr.push(superObj);

      if ((index + 1) == datos.length) {
        this.showResults = true;
        this.progressSpinner = false;
        setTimeout(() => {
          this.tabla.tablaFoco.nativeElement.scrollIntoView();
          this.tabla.historico = this.historico;
          this.rowGroupsInit = [...this.rowGroups];
        }, 5);
      }

    });


    this.rowGroups = this.trmService.getTableData(arr);
    this.rowGroupsAux = this.trmService.getTableData(arr);
    this.totalRegistros = this.rowGroups.length;

  }


  notifyAnySelected(event) {
    if (this.seleccionarTodo || event) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  checkSelectedRow(selected) {
    this.selectedRow = selected;
  }

  anular(event) {
    let array = [];

    event.forEach(element => {
      array.push(this.datos[element]);
    });

    this.sigaServices.post("saltosCompensacionesGuardia_anular", array).subscribe(
      result => {

        const resp = JSON.parse(result.body);

        if (resp.status == 'KO' || (resp.error != undefined && resp.error != null)) {
          this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
        }

        if (resp.status == 'OK') {
          this.search(false);
        }

      },
      error => {
        this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
      }
    );
  }

  delete(event) {
    let array = [];

    event.forEach(element => {
      array.push(this.datos[element]);
    });

    this.sigaServices.post("saltosCompensacionesGuardia_borrar", array).subscribe(
      result => {

        const resp = JSON.parse(result.body);

        if (resp.status == 'KO' || (resp.error != undefined && resp.error != null)) {
          this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
        }

        if (resp.status == 'OK') {
          this.search(false);
        }

      },
      error => {
        this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
      }
    );
  }

}