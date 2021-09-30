import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, SelectItem } from 'primeng/api';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { SaltoCompItem } from '../../../../models/guardia/SaltoCompItem';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { FiltrosSaltosCompensacionesOficioComponent } from './filtros-saltos-compensaciones-oficio/filtros-saltos-compensaciones-oficio.component';
import { TablaResultadoMixSaltosCompOficioComponent } from './tabla-resultado-mix-saltos-comp-oficio/tabla-resultado-mix-saltos-comp-oficio.component';
import { Cell, Row, TablaResultadoMixSaltosCompOficioService } from './tabla-resultado-mix-saltos-comp-oficio/tabla-resultado-mix-saltos-comp-oficio.service';
import { ControlAccesoDto } from '../../../../models/ControlAccesoDto';
import { procesos_oficio } from '../../../../permisos/procesos_oficio';
import { DISABLED } from '@angular/forms/src/model';

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
  comboTurnos;
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
  comboColegiados = [];
  activacionEditar: boolean = false;
  showFilters: boolean = false;

  @ViewChild(FiltrosSaltosCompensacionesOficioComponent) filtros: FiltrosSaltosCompensacionesOficioComponent;
  @ViewChild(TablaResultadoMixSaltosCompOficioComponent) tabla: TablaResultadoMixSaltosCompOficioComponent;

  constructor(
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private datepipe: DatePipe,
    private trmService: TablaResultadoMixSaltosCompOficioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {

    this.checkAcceso();

    this.getComboTurno();

  }

  async getComboTurno() {

    let asyncResult = await this.sigaServices.get("inscripciones_comboTurnos").toPromise();

    this.comboTurnos = asyncResult.combooItems;
    this.commonsService.arregloTildesCombo(this.comboTurnos);

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

      if (italic || this.historico || !this.activacionEditar) {

        obj = [
          { type: 'text', value: element.turno, header: this.cabeceras[0].id, disabled: false },
          { type: 'text', value: element.nColegiado, header: this.cabeceras[1].id, disabled: false },
          { type: 'text', value: element.letrado, header: this.cabeceras[2].id, disabled: false },
          { type: 'text', value: this.comboTipos.find(el => el.value == element.saltoCompensacion).label, header: this.cabeceras[3].id, disabled: false },
          { type: 'text', value: element.fecha, header: this.cabeceras[4].id, disabled: false },
          { type: 'text', value: element.motivo, header: this.cabeceras[5].id, disabled: false },
          { type: 'text', value: element.fechaUso, header: this.cabeceras[6].id, disabled: false },
          { type: 'invisible', value: element.idSaltosTurno, header: 'idSaltosTurno', disabled: false },
          { type: 'invisible', value: element.idTurno, header: 'idTurno', disabled: false },
          { type: 'invisible', value: element.idPersona, header: 'idPersona', disabled: false }
        ];

      } else {
        obj = [
          { type: 'text', value: element.turno, header: this.cabeceras[0].id, disabled: false },
          { type: 'text', value: element.nColegiado, header: this.cabeceras[1].id, disabled: false },
          { type: 'text', value: element.letrado, header: this.cabeceras[2].id, disabled: false },
          { type: 'select', combo: this.comboTipos, value: element.saltoCompensacion, header: this.cabeceras[3].id, disabled: false },
          { type: 'datePicker', value: element.fecha, header: this.cabeceras[4].id, disabled: false },
          { type: 'textarea', value: element.motivo, header: this.cabeceras[5].id, disabled: false },
          { type: 'text', value: element.fechaUso, header: this.cabeceras[6].id, disabled: false },
          { type: 'invisible', value: element.idSaltosTurno, header: 'idSaltosTurno', disabled: false },
          { type: 'invisible', value: element.idTurno, header: 'idTurno', disabled: false },
          { type: 'invisible', value: element.idPersona, header: 'idPersona', disabled: false }
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
        }if (index == 3) {
          salto.saltoCompensacion = cell.value;
        }
        if (index == 4) {
          salto.fecha = cell.value;
        }
        if (index == 5) {
          salto.motivo = cell.value;
        }
        if (index == 7) {
          salto.idSaltosTurno = cell.value;
        }
        if (index == 8 && cell.value != '') {
          salto.idTurno = cell.value;
        }
        if (index == 9) {
          if(cell.value == null || cell.value == undefined || cell.value == ''){
            salto.idPersona = row.cells[1].value;
          }else{
            salto.idPersona = cell.value;
          }
        }

      });

      //if (row.cells[7].value == '') {
      //  salto.idTurno = row.cells[0].value;
        //salto.idPersona = row.cells[1].value;
      //}

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
      let cell9: Cell = new Cell();
      let cell10: Cell = new Cell();

      cell1.type = 'select';
      cell1.combo = this.comboTurnos;
      cell1.value = data.idturno;
      cell1.header = this.cabeceras[0].id;
      cell1.disabled = true;

      cell2.type = 'select';
      cell2.value = data.idpersona;
      cell2.combo = [];
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
      cell8.header = 'idSaltosTurno';

      cell9.type = 'invisible';
      cell9.value = '';
      cell9.header = 'idTurno';

      cell10.type = 'invisible';
      cell10.value = '';
      cell10.header = 'idPersona';

      row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell10];
      row.id = this.totalRegistros == 0 ? 0 : this.totalRegistros;
      row.italic = false;
      this.getComboColegiados(row);

      if (this.rowGroups != undefined && this.rowGroups != null) {
        this.rowGroups.unshift(row);
      } else {
        this.rowGroups = [row];
      }
      this.rowGroupsAux = this.rowGroups;
      this.totalRegistros = this.rowGroups.length;

      this.showResults = true;
  }

  getComboColegiados(row: Row) {

    this.comboColegiados = [];
    let params = new SaltoCompItem();
    params.idTurno = row.cells[0].value;

    this.sigaServices.post(
      "saltosCompensacionesOficio_comboColegiados", params).subscribe(
        data => {
          let comboColegiados = JSON.parse(data.body).combooItems;
          let error = JSON.parse(data.body).error;
          this.comboColegiados = comboColegiados;
        },
        err => {
        },
        () => {
          this.rowGroups.find(el => el.id == row.id).cells[1].combo = this.comboColegiados;
          if(this.isNewFromOtherPage){
            this.comboColegiados.forEach(comboItem =>{
              if(comboItem.label.includes(this.isNewFromOtherPageObject.numerocolegiado)){
                this.rowGroups.find(el => el.id == row.id).cells[1].value = comboItem.value;
                let letrado = comboItem.label.split(')')[1].trim();
                this.rowGroups.find(el => el.id == row.id).cells[2].value = letrado;
              }
            });
          }
        }
      );
  }

  checkAcceso() {
    this.progressSpinner = true;
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = procesos_oficio.saltosCompensaciones;

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        const permisos = JSON.parse(data.body);
        const permisosArray = permisos.permisoItems;
        const derechoAcceso = permisosArray[0].derechoacceso;

        if (derechoAcceso == 3) {
          this.activacionEditar = true;
        } else if (derechoAcceso == 2) {
          this.activacionEditar = false;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.showFilters = true;
      }
    );

  }

  backTo() {
    this.location.back();
  }
  

}
