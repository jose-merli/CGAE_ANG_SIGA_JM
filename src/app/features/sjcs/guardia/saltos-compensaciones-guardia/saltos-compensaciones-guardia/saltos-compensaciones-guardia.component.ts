import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Message, SelectItem } from 'primeng/api';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { SaltoCompItem } from '../../../../../models/guardia/SaltoCompItem';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { FiltrosSaltosCompensacionesGuardiaComponent } from './filtros-saltos-compensaciones-guardia/filtros-saltos-compensaciones-guardia.component';
import { TablaResultadoMixSaltosCompGuardiaComponent } from './tabla-resultado-mix-saltos-comp-guardia/tabla-resultado-mix-saltos-comp-guardia.component';
import { Row, TablaResultadoMixSaltosCompService } from './tabla-resultado-mix-saltos-comp-guardia/tabla-resultado-mix-saltos-comp.service';

export interface Cabecera {
  id: string;
  name: string;
  width: string
}

@Component({
  selector: 'app-saltos-compensaciones-guardia',
  templateUrl: './saltos-compensaciones-guardia.component.html',
  styleUrls: ['./saltos-compensaciones-guardia.component.scss']
})
export class SaltosCompensacionesGuardiaComponent implements OnInit {

  isDisabled;
  seleccionarTodo = false;
  totalRegistros = 0;
  rowGroups: Row[];
  rowGroupsAux: Row[];
  rowGroupsInit: Row[];
  selectedRow: Row;
  cabeceras: Cabecera[] = [
    {
      id: "turno",
      name: "dato.jgr.guardia.saltcomp.turno",
      width: '15%'
    },
    {
      id: "guardia",
      name: "dato.jgr.guardia.saltcomp.guardia",
      width: '15%'
    },
    {
      id: "nColegiado",
      name: "dato.jgr.guardia.saltcomp.ncolegiadoGrupo",
      width: '15%'
    },
    {
      id: "letrado",
      name: "dato.jgr.guardia.saltcomp.letrados",
      width: '15%'
    },
    {
      id: "saltoCompensacion",
      name: "dato.jgr.guardia.saltcomp.tipo",
      width: '10%'
    },
    {
      id: "fecha",
      name: "dato.jgr.guardia.saltcomp.fecha",
      width: '7.5%'
    },
    {
      id: "motivo",
      name: "dato.jgr.guardia.saltcomp.motivos",
      width: '15%'
    },
    {
      id: "fechaUso",
      name: "dato.jgr.guardia.saltcomp.fechauso",
      width: '7.5%'
    }
  ];
  comboTurnos: SelectItem[];
  comboGuardias: SelectItem[];
  comboTipos = [
    {
      label: 'Salto',
      value: 'S'
    },
    {
      label: 'Compensación',
      value: 'C'
    }
  ];
  comboTiposGrupo = [
    {
      label: 'Salto para grupo',
      value: 'S'
    },
    {
      label: 'Compensación para grupo',
      value: 'C'
    }
  ];
  historico: boolean = false;
  datos;
  progressSpinner: boolean = false;
  msgs: Message[] = [];
  permisoEscritura;
  showResults: boolean = false;

  @ViewChild(FiltrosSaltosCompensacionesGuardiaComponent) filtros: FiltrosSaltosCompensacionesGuardiaComponent;
  @ViewChild(TablaResultadoMixSaltosCompGuardiaComponent) tabla: TablaResultadoMixSaltosCompGuardiaComponent;


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

    let filtrosModificados: SaltoCompItem = Object.assign({}, this.filtros.filtroAux);

    if (Array.isArray(filtrosModificados.idTurno)) {
      if (filtrosModificados.idTurno.length == 0) {
        delete filtrosModificados.idTurno;
      } else {
        filtrosModificados.idTurno = filtrosModificados.idTurno.toString();
      }
    }

    if (Array.isArray(filtrosModificados.idGuardia)) {
      if (filtrosModificados.idGuardia.length == 0) {
        delete filtrosModificados.idGuardia;
      } else {
        filtrosModificados.idGuardia = filtrosModificados.idGuardia.toString();
      }
    }

    this.progressSpinner = true;
    this.sigaServices.postPaginado("saltosCompensacionesGuardia_buscar", "?numPagina=1", filtrosModificados).subscribe(
      n => {

        this.datos = JSON.parse(n.body).saltosCompItems;
        console.log("file: saltos-compensaciones-guardia.component.ts ~ line 154 ~ SaltosCompensacionesGuardiaComponent ~ search ~  this.datos", this.datos)
        let error = JSON.parse(n.body).error;
        this.historico = event;
        this.jsonToRow();
        this.showResults = true;
        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMessage({ severity: "info", summary: this.translateService.instant("general.message.informacion"), msg: error.description });
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
        this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
      },
      () => {
        setTimeout(() => {
          this.tabla.tablaFoco.nativeElement.scrollIntoView();
        }, 5);
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

  modifyData(dato) {

    dato.fecha = this.formatDate(dato.fecha);

    if (dato.fechaUso != undefined && dato.fechaUso != null) {
      dato.fechaUso = this.formatDate(dato.fechaUso);
    }

    if (dato.grupo != undefined && dato.grupo != null) {
      dato.nColegiado = `${dato.letradosGrupo[0].colegiado}/${dato.grupo}`;
      dato.letrado = [];

      if (dato.letradosGrupo != undefined && dato.letradosGrupo != null) {
        dato.letradosGrupo.forEach(element => {
          dato.letrado.push(element.letrado);
        });
      }

    } else {
      dato.nColegiado = dato.colegiadoGrupo;
    }

    return dato;

  }

  jsonToRow() {
    let arr = [];
    this.datos.forEach((element, index) => {

      element = this.modifyData(element);

      let italic = (element.fechaUso != null || element.fechaAnulacion != null);

      let obj = [
        { type: 'text', value: element.turno, header: this.cabeceras[0].id, disabled: false },
        { type: 'text', value: element.guardia, header: this.cabeceras[1].id, disabled: false },
        { type: 'text', value: element.nColegiado, header: this.cabeceras[2].id, disabled: false },
        { type: element.grupo == null ? 'text' : 'arrayText', value: element.letrado, header: this.cabeceras[3].id, disabled: false },
        { type: 'select', combo: element.grupo == null ? this.comboTipos : this.comboTiposGrupo, value: element.saltoCompensacion, header: this.cabeceras[4].id, disabled: false },
        { type: 'datePicker', value: element.fecha, header: this.cabeceras[5].id, disabled: false },
        { type: 'textarea', value: element.motivo, header: this.cabeceras[6].id, disabled: false },
        { type: 'text', value: element.fechaUso, header: this.cabeceras[7].id, disabled: false }
      ];

      let superObj = {
        id: index,
        italic: italic,
        row: obj
      };

      arr.push(superObj);
    });

    this.rowGroups = [];
    this.rowGroups = this.trmService.getTableData(arr);
    this.rowGroupsAux = [];
    this.rowGroupsAux = this.trmService.getTableData(arr);
    this.rowGroupsInit = [];
    this.rowGroupsInit = [...this.rowGroups];
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