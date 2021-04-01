import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message, SelectItem } from 'primeng/api';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { procesos_guardia } from '../../../../permisos/procesos_guarida';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { FiltrosSaltosCompensacionesOficioComponent } from './filtros-saltos-compensaciones-oficio/filtros-saltos-compensaciones-oficio.component';
import { TablaResultadoMixSaltosCompOficioComponent } from './tabla-resultado-mix-saltos-comp-oficio/tabla-resultado-mix-saltos-comp-oficio.component';
import { Row, TablaResultadoMixSaltosCompOficioService } from './tabla-resultado-mix-saltos-comp-oficio/tabla-resultado-mix-saltos-comp-oficio.service';

@Component({
  selector: 'app-saltos-compensaciones-oficio',
  templateUrl: './saltos-compensaciones-oficio.component.html',
  styleUrls: ['./saltos-compensaciones-oficio.component.scss']
})
export class SaltosCompensacionesOficioComponent implements OnInit {

  isDisabled;
  seleccionarTodo = false;
  totalRegistros = 0;
  rowGroups: Row[];
  rowGroupsAux: Row[];
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
      name: "censo.resultadosSolicitudesModificacion.literal.nColegiado"
    },
    {
      id: "letrado",
      name: "justiciaGratuita.sjcs.designas.colegiado"
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
  datos;
  progressSpinner: boolean = false;
  msgs: Message[] = [];
  permisoEscritura;
  showResults: boolean = false;
  emptyResults: boolean = false;
  historico: boolean = false;

  @ViewChild(FiltrosSaltosCompensacionesOficioComponent) filtros: FiltrosSaltosCompensacionesOficioComponent;
  @ViewChild(TablaResultadoMixSaltosCompOficioComponent) tabla: TablaResultadoMixSaltosCompOficioComponent;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router, private datepipe: DatePipe, private trmService: TablaResultadoMixSaltosCompOficioService) { }

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
      }).catch(error => console.error(error));

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
    let filtros = JSON.parse(sessionStorage.getItem("filtrosAuxSaltosCompOficio"));
    filtros.historico = event;
    sessionStorage.setItem("historicoSaltosCompOficio", event);

    if (filtros.idTurno != undefined && filtros.idTurno != null) {
      if (filtros.idTurno.length > 0) {
        filtros.idTurno = filtros.idTurno.toString();
      } else {
        filtros.idTurno = "";
      }
    }

    if (filtros.fechaHasta != undefined && filtros.fechaHasta != null) {
      filtros.fechaHasta = this.formatDate(filtros.fechaHasta);
    }

    if (filtros.fechaDesde != undefined && filtros.fechaDesde != null) {
      filtros.fechaDesde = this.formatDate(filtros.fechaDesde);
    }

    if (filtros.idGuardia != undefined && filtros.idGuardia != null) {
      if (filtros.idGuardia.length > 0) {
        filtros.idGuardia = filtros.idGuardia.toString();
      } else {
        filtros.idGuardia = "";
      }
    }

    sessionStorage.setItem("historicoSaltosCompOficio", event);
    this.progressSpinner = true;
    this.sigaServices.postPaginado("saltosCompensacionesOficio_buscar", "?numPagina=1", filtros).subscribe(
      n => {

        this.datos = JSON.parse(n.body).saltosCompItems;
        let error = JSON.parse(n.body).error;
        this.emptyResults = false;
        this.historico = event;

        if (this.datos.length == 0) {
          this.emptyResults = true;
          this.jsonToRowEmptyResults();
        } else {
          this.jsonToRow();
        }

        this.progressSpinner = false;
        this.showResults = true;

        if (error != null && error.description != null) {
          this.progressSpinner = false;
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

  modifyData(dato) {

    dato.fecha = this.formatDate(dato.fecha);

    if (dato.fechaUso != undefined && dato.fechaUso != null) {
      dato.fechaUso = this.formatDate(dato.fechaUso);
    }

    if (dato.colegiadoGrupo != undefined && dato.colegiadoGrupo != null) {
      dato.nColegiado = dato.colegiadoGrupo;
    }

    return dato;

  }

  jsonToRow() {
    let arr = [];
    this.datos.forEach((element, index) => {

      element = this.modifyData(element);

      let italic = (element.fechaUso != null || element.fechaAnulacion != null);
      let obj = [];

      if (italic) {

        obj = [
          { type: 'text', value: element.turno, header: this.cabeceras[0].id, disabled: false },
          { type: 'text', value: element.guardia, header: this.cabeceras[1].id, disabled: false },
          { type: 'text', value: element.nColegiado, header: this.cabeceras[2].id, disabled: false },
          { type: 'text', value: element.letrado, header: this.cabeceras[3].id, disabled: false },
          { type: 'text', value: this.comboTipos.find(el => el.value == element.saltoCompensacion).label, header: this.cabeceras[4].id, disabled: false },
          { type: 'text', value: element.fecha, header: this.cabeceras[5].id, disabled: false },
          { type: 'text', value: element.motivo, header: this.cabeceras[6].id, disabled: false },
          { type: 'text', value: element.fechaUso, header: this.cabeceras[7].id, disabled: false }
        ];

      } else {
        obj = [
          { type: 'select', combo: this.comboTurnos, value: element.idTurno, header: this.cabeceras[0].id, disabled: false },
          { type: 'select', combo: element.comboGuardia, value: element.idGuardia, header: this.cabeceras[1].id, disabled: false },
          { type: 'select', combo: element.comboColegiados, value: element.nColegiado, header: this.cabeceras[2].id, disabled: false },
          { type: 'text', value: element.letrado, header: this.cabeceras[3].id, disabled: false },
          { type: 'select', combo: this.comboTipos, value: element.saltoCompensacion, header: this.cabeceras[4].id, disabled: false },
          { type: 'datePicker', value: element.fecha, header: this.cabeceras[5].id, disabled: false },
          { type: 'textarea', value: element.motivo, header: this.cabeceras[6].id, disabled: false },
          { type: 'text', value: element.fechaUso, header: this.cabeceras[7].id, disabled: false }
        ];
      }



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

  jsonToRowEmptyResults() {

    let arr = [
      {
        id: 0,
        italic: false,
        row: [{ type: 'empty', value: 'No hay resultados' }]
      }
    ];

    this.rowGroups = [];
    this.rowGroups = this.trmService.getTableData(arr);
    this.rowGroupsAux = [];
    this.rowGroupsAux = this.trmService.getTableData(arr);
    this.totalRegistros = this.rowGroups.length;
  }

  anular(event) {
    let array = [];

    event.forEach(element => {
      array.push(this.datos[element]);
    });

    this.sigaServices.post("saltosCompensacionesOficio_anular", array).subscribe(
      result => {

        const resp = JSON.parse(result.body);

        if (resp.status == 'KO' || (resp.error != undefined && resp.error != null)) {
          this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
        }

        if (resp.status == 'OK') {
          this.showMessage({ severity: "success", summary: 'Operación realizada con éxito', msg: 'Los registros seleccionados han sido anulados' });
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

    this.sigaServices.post("saltosCompensacionesOficio_borrar", array).subscribe(
      result => {

        const resp = JSON.parse(result.body);

        if (resp.status == 'KO' || (resp.error != undefined && resp.error != null)) {
          this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
        }

        if (resp.status == 'OK') {
          this.showMessage({ severity: "success", summary: 'Operación realizada con éxito', msg: 'Los registros seleccionados han sido eliminados' });
          this.search(false);
        }

      },
      error => {
        this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
      }
    );
  }

}