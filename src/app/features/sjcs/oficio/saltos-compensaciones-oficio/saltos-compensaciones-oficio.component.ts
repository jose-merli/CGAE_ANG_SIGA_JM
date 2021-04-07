import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message, SelectItem } from 'primeng/api';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { SaltoCompItem } from '../../../../models/guardia/SaltoCompItem';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { FiltrosSaltosCompensacionesOficioComponent } from './filtros-saltos-compensaciones-oficio/filtros-saltos-compensaciones-oficio.component';
import { TablaResultadoMixSaltosCompOficioComponent } from './tabla-resultado-mix-saltos-comp-oficio/tabla-resultado-mix-saltos-comp-oficio.component';
import { Cell, Row, TablaResultadoMixSaltosCompOficioService } from './tabla-resultado-mix-saltos-comp-oficio/tabla-resultado-mix-saltos-comp-oficio.service';

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
  showResults: boolean = false;
  emptyResults: boolean = false;
  historico: boolean = false;
  isNewFromOtherPage: boolean = false;
  isNewFromOtherPageObject: any;

  @ViewChild(FiltrosSaltosCompensacionesOficioComponent) filtros: FiltrosSaltosCompensacionesOficioComponent;
  @ViewChild(TablaResultadoMixSaltosCompOficioComponent) tabla: TablaResultadoMixSaltosCompOficioComponent;

  constructor(
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private datepipe: DatePipe,
    private trmService: TablaResultadoMixSaltosCompOficioService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.getComboTurno();

    let params = this.activatedRoute.snapshot.queryParams;
    if (params.idturno) {

      let data = {
        idpersona: params.idpersona,
        idturno: params.idturno,
        nombreTurno: params.nombreTurno,
        numerocolegiado: params.numerocolegiado,
        letrado: params.letrado
      }
      this.isNewFromOtherPage = true;
      this.isNewFromOtherPageObject = data;
      this.search(false);
    }
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
    this.isNewFromOtherPage = false;
    this.search(event);
  }

  searchHistory(event) {
    this.isNewFromOtherPage = false;
    this.search(event);
  }

  search(event) {

    let filtros = JSON.parse(sessionStorage.getItem("filtrosAuxSaltosCompOficio"));

    if (this.isNewFromOtherPage) {
      filtros = {};
      filtros.idTurno = this.isNewFromOtherPageObject.idturno;
      filtros.colegiadoGrupo = this.isNewFromOtherPageObject.numerocolegiado;
    }

    filtros.historico = event;
    sessionStorage.setItem("historicoSaltosCompOficio", event);

    if (filtros.idTurno != undefined && filtros.idTurno != null) {
      if (filtros.idTurno.length > 0) {
        filtros.idTurno = filtros.idTurno.toString();
      } else {
        filtros.idTurno = "";
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

        if (this.datos.length == 0 && !this.isNewFromOtherPage) {
          this.emptyResults = true;
          this.jsonToRowEmptyResults();
        } else if (this.datos.length > 0) {
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
        if (this.isNewFromOtherPage) {
          this.newSalCompFromOtherPage();
        }
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

      if (italic || this.historico) {

        obj = [
          { type: 'text', value: element.turno, header: this.cabeceras[0].id, disabled: false },
          { type: 'text', value: element.nColegiado, header: this.cabeceras[1].id, disabled: false },
          { type: 'text', value: element.letrado, header: this.cabeceras[2].id, disabled: false },
          { type: 'text', value: this.comboTipos.find(el => el.value == element.saltoCompensacion).label, header: this.cabeceras[3].id, disabled: false },
          { type: 'text', value: element.fecha, header: this.cabeceras[4].id, disabled: false },
          { type: 'text', value: element.motivo, header: this.cabeceras[5].id, disabled: false },
          { type: 'text', value: element.fechaUso, header: this.cabeceras[6].id, disabled: false },
          { type: 'invisible', value: element.idSaltosTurno, header: 'invisible', disabled: false }
        ];

      } else {
        obj = [
          { type: 'select', combo: this.comboTurnos, value: element.idTurno, header: this.cabeceras[0].id, disabled: false },
          { type: 'select', combo: element.comboColegiados, value: element.idPersona, header: this.cabeceras[1].id, disabled: false },
          { type: 'text', value: element.letrado, header: this.cabeceras[2].id, disabled: false },
          { type: 'select', combo: this.comboTipos, value: element.saltoCompensacion, header: this.cabeceras[3].id, disabled: false },
          { type: 'datePicker', value: element.fecha, header: this.cabeceras[4].id, disabled: false },
          { type: 'textarea', value: element.motivo, header: this.cabeceras[5].id, disabled: false },
          { type: 'text', value: element.fechaUso, header: this.cabeceras[6].id, disabled: false },
          { type: 'invisible', value: element.idSaltosTurno, header: 'invisible', disabled: false }
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
          this.isNewFromOtherPage = false;
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
          this.isNewFromOtherPage = false;
          this.search(false);
        }

      },
      error => {
        this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
      }
    );
  }

  guardar(event: Row[]) {

    let arraySaltos: SaltoCompItem[] = [];

    event.forEach(row => {
      let salto = new SaltoCompItem();
      row.cells.forEach((cell, index) => {
        if (index == 0) {
          salto.idTurno = cell.value;
        }
        if (index == 1) {
          salto.idGuardia = cell.value;
        }
        if (index == 2) {
          salto.idPersona = cell.value;
        }
        if (index == 4) {
          salto.saltoCompensacion = cell.value;
        }
        if (index == 5) {
          salto.fecha = cell.value;
        }
        if (index == 6) {
          salto.motivo = cell.value;
        }
        if (index == 8 && cell.value != null && cell.value != '') {
          salto.idSaltosTurno = cell.value;
        }
        if (index == 9 && cell.value != null && cell.value != '') {
          salto.idPersona = cell.value;
        }
      });
      arraySaltos.push(salto);
    });

    this.sigaServices.post("saltosCompensacionesOficio_guardar", arraySaltos).subscribe(
      result => {

        const resp = JSON.parse(result.body);

        if (resp.status == 'KO' || (resp.error != undefined && resp.error != null)) {
          this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
        }

        if (resp.status == 'OK') {
          this.showMessage({ severity: "success", summary: 'Operación realizada con éxito', msg: 'Los registros seleccionados han sido guardados' });
          this.isNewFromOtherPage = false;
          this.search(false);
        }

      },
      error => {
        this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
      }
    );

  }

  newSalCompFromOtherPage() {

    let data = this.isNewFromOtherPageObject;

    let row: Row = new Row();

    let cell1: Cell = new Cell();
    let cell2: Cell = new Cell();
    let cell3: Cell = new Cell();
    let cell4: Cell = new Cell();
    let cell5: Cell = new Cell();
    let cell6: Cell = new Cell();
    let cell7: Cell = new Cell();
    let cell8: Cell = new Cell();

    cell1.type = 'text';
    cell1.value = data.nombreTurno;
    cell1.header = this.cabeceras[0].id;
    cell1.disabled = false;

    cell2.type = 'text';
    cell2.value = data.numerocolegiado;
    cell2.header = this.cabeceras[1].id;
    cell2.disabled = false;

    cell3.type = 'text';
    cell3.value = data.letrado;
    cell3.header = this.cabeceras[2].id;
    cell3.disabled = false;

    cell4.type = 'select';
    cell4.combo = this.comboTipos;
    cell4.value = '';
    cell4.header = this.cabeceras[3].id;
    cell4.disabled = false;

    cell5.type = 'datePicker';
    cell5.value = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    cell5.header = this.cabeceras[4].id;
    cell5.disabled = false;

    cell6.type = 'textarea';
    cell6.value = '';
    cell6.header = this.cabeceras[5].id;
    cell6.disabled = false;

    cell7.type = 'text';
    cell7.value = '';
    cell7.header = this.cabeceras[6].id;
    cell7.disabled = false;

    cell8.type = 'invisible';
    cell8.value = '';
    cell8.header = 'invisible';
    cell8.disabled = false;

    row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8];
    row.id = this.totalRegistros == 0 ? 0 : this.totalRegistros;
    row.italic = false;

    if (this.rowGroups != undefined && this.rowGroups != null) {
      this.rowGroups.unshift(row);
    } else {
      this.rowGroups = [row];
    }
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;

    this.showResults = true;
  }
}
