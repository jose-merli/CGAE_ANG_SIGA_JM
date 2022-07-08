import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Message, SelectItem } from 'primeng/api';
import { ActivatedRoute, Router } from '../../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { SaltoCompItem } from '../../../../../models/guardia/SaltoCompItem';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { FiltrosSaltosCompensacionesGuardiaComponent } from './filtros-saltos-compensaciones-guardia/filtros-saltos-compensaciones-guardia.component';
import { TablaResultadoMixSaltosCompGuardiaComponent } from './tabla-resultado-mix-saltos-comp-guardia/tabla-resultado-mix-saltos-comp-guardia.component';
import { Row, Cell, TablaResultadoMixSaltosCompService, Combo } from './tabla-resultado-mix-saltos-comp-guardia/tabla-resultado-mix-saltos-comp.service';

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
      name: "menu.justiciaGratuita.GuardiaMenu",
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
  isNewFromOtherPage: boolean = false;
  isNewFromOtherPageObject: any;
  comboColegiados = [];
  dataFilterFromColaGuardia = { 'turno': 0,
                                'guardia': 0,
                                'colegiado': 0,
                                'grupo': 0};
  @ViewChild(FiltrosSaltosCompensacionesGuardiaComponent) filtros: FiltrosSaltosCompensacionesGuardiaComponent;
  @ViewChild(TablaResultadoMixSaltosCompGuardiaComponent) tabla: TablaResultadoMixSaltosCompGuardiaComponent;


  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datepipe: DatePipe,
    private trmService: TablaResultadoMixSaltosCompService
) { }


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

    this.dataFilterFromColaGuardia = JSON.parse(sessionStorage.getItem("itemSaltosCompColaGuardia"));
  }

  getComboTurno() {

    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurnos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTurnos);

        let params = this.activatedRoute.snapshot.queryParams;
        if (params.idturno) {
          let data = {
            idpersona: params.idpersona,
            idturno: params.idturno,
            idguardia: params.idguardia,
            nombreTurno: params.nombreTurno,
            numerocolegiado: params.numerocolegiado,
            letrado: params.letrado,
            grupo: params.grupo
          }
          this.isNewFromOtherPage = true;
          this.isNewFromOtherPageObject = data;
          this.search(false);
        }
      },
      err => {
        //console.log(err);
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
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);

    let filtrosModificados: SaltoCompItem = Object.assign({}, this.filtros.filtroAux);

    if (this.isNewFromOtherPage) {
      filtrosModificados = new SaltoCompItem();
      filtrosModificados.idTurno = this.isNewFromOtherPageObject.idturno;
      filtrosModificados.idGuardia = this.isNewFromOtherPageObject.idGuardia;
      filtrosModificados.colegiadoGrupo = this.isNewFromOtherPageObject.numerocolegiado;
    }

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
    this.showResults = false;
    this.progressSpinner = true;
    this.sigaServices.postPaginado("saltosCompensacionesGuardia_buscar", "?numPagina=1", filtrosModificados).subscribe(
      n => {

        this.datos = JSON.parse(n.body).saltosCompItems;
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
        //console.log(err);
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
    
    if (dato.grupo != undefined && dato.grupo != null && dato.letradosGrupo != undefined && dato.letradosGrupo != null) {
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
        { type: 'text', value: element.fechaUso, header: this.cabeceras[7].id, disabled: false },
	      { type: 'invisible', value: element.idSaltosTurno, header: 'idSaltosTurno', disabled: false },
	      { type: 'invisible', value: element.idTurno, header: 'idTurno', disabled: false },
	      { type: 'invisible', value: element.idPersona, header: 'idPersona', disabled: false },
        { type: 'invisible', value: element.idGuardia, header: 'idGuardia', disabled: false },
        { type: 'invisible', value: element.grupo, header: 'grupo', disabled: false },
        { type: 'invisible', value: element.colegiadoGrupo, header: 'numeroColegiado', disabled: false }
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
    this.rowGroupsInit = this.trmService.getTableData(arr);
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

    let anyElementDeleted = array.find(element => element.fechaUso != null || element.fechaAnulacion != null);

    this.sigaServices.post("saltosCompensacionesGuardia_borrar", array).subscribe(
      result => {

        const resp = JSON.parse(result.body);

        if (resp.status == 'KO' || (resp.error != undefined && resp.error != null)) {
          this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
        }

        if(anyElementDeleted){
          this.showMessage({ severity: "info", summary: "Info", msg: 'Algunos registros seleccionados no se han podido eliminar al estar ya eliminados' });
        }

        if (resp.status == 'OK') {
          this.showMessage({ severity : "success", summary : this.translateService.instant("general.message.correct"), msg: this.translateService.instant("general.message.accion.realizada")});
          this.isNewFromOtherPage = false;
          this.search(false);
        }

      },
      error => {
        this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
      }
    );
  }

  guardar(event){
    this.progressSpinner = true;
    let arraySaltos: SaltoCompItem[] = [];

    event.forEach(row => {
      let salto = new SaltoCompItem();
      row.cells.forEach((cell, index) => {
        if (index == 4) {
          salto.saltoCompensacion = cell.value;
        }
        if (index == 5) {
          salto.fecha = cell.value;
        }
        if (index == 6) {
          salto.motivo = cell.value;
        }
        if (index == 8) {
          salto.idSaltosTurno = cell.value;
        }
        if (index == 9) {
          salto.idTurno = cell.value;
        }
        if (index == 10) {
          salto.idPersona = cell.value;
        }
        if (index == 11) {
          salto.idGuardia = cell.value;
        }
        if (index == 12){
          salto.grupo = cell.value;
        }
        if (index == 13){
          salto.colegiadoGrupo = cell.value;
        }

      });

      if (row.cells[7].value == '') {
        salto.idTurno = row.cells[0].value;
        salto.idGuardia = row.cells[1].value;
        salto.idPersona = row.cells[2].value[0];
      }
      arraySaltos.push(salto);
    });
    
    this.sigaServices.post("saltosCompensacionesGuardia_guardar", arraySaltos).subscribe(
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
        this.progressSpinner = false;
      },
      error => {
        this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
        this.progressSpinner = false;
      }
    );
  }

  //TODO Este metodo añade nueva linea, falta llamarlo
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
    let cell11: Cell = new Cell();
    let cell12: Cell = new Cell();
    let cell13: Cell = new Cell();
    let cell14: Cell = new Cell();

    if(data.grupo){
      cell1.type = 'select-grupo';
      cell1.combo = this.comboTurnos as Combo[];
      cell1.value = data.idturno;
      cell1.header = this.cabeceras[0].id;
      cell1.disabled = true;
  
      cell2.type = 'select-grupo';
      cell2.value = data.idguardia;
      cell2.combo = [];
      cell2.header = this.cabeceras[1].id;
      cell2.disabled = true;
  
      cell3.type = 'text';
      cell3.value = data.numerocolegiado + "/" + data.grupo;
      cell3.header = this.cabeceras[2].id;
      cell3.disabled = false;

      cell4.type = 'text';
      cell4.value = data.letrado;
      cell4.header = this.cabeceras[3].id;
      cell4.disabled = false;
    } else{
      cell1.type = 'select';
      cell1.combo = this.comboTurnos as Combo[];
      cell1.value = data.idturno;
      cell1.header = this.cabeceras[0].id;
      cell1.disabled = true;
  
      cell2.type = 'select';
      cell2.value = data.idguardia;
      cell2.combo = [];
      cell2.header = this.cabeceras[1].id;
      cell2.disabled = true;
  
      cell3.type = 'text';
      cell3.value = data.numerocolegiado;
      cell3.header = this.cabeceras[2].id;
      cell3.disabled = false;

      cell4.type = 'text';
      cell4.value = data.letrado;
      cell4.header = this.cabeceras[3].id;
      cell4.disabled = false;
    }

    cell5.type = 'select';
    cell5.combo = ((data.grupo == null || data.grupo.trim().length == 0) ? this.comboTipos : this.comboTiposGrupo) as Combo[];
    cell5.value = '';
    cell5.header = this.cabeceras[4].id;
    cell5.disabled = false;

    cell6.type = 'datePicker';
    cell6.value = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    cell6.header = this.cabeceras[5].id;
    cell6.disabled = false;

    cell7.type = 'textarea';
    cell7.value = '';
    cell7.header = this.cabeceras[6].id;
    cell7.disabled = false;

    cell8.type = 'text';
    cell8.value = '';
    cell8.header = this.cabeceras[7].id;

    cell9.type = 'invisible';
    cell9.value = '';
    cell9.header = 'idSaltosTurno';

    cell10.type = 'invisible';
    cell10.value = data.idturno;
    cell10.header = 'idTurno';

    cell11.type = 'invisible';
    cell11.value = data.idpersona;
    cell11.header = 'idPersona';
  
    cell12.type = 'invisible';
    cell12.value = data.idguardia;
    cell12.header = 'idGuardia';

    cell13.type = 'invisible';
    cell13.value = data.grupo;
    cell13.header = 'grupo';

    cell14.type = 'invisible';
    cell14.value = data.numerocolegiado;
    cell14.header = 'numeroColegiado';

    row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell10, cell11, cell12, cell13, cell14];
    row.id = this.totalRegistros == 0 ? 0 : this.totalRegistros;
    row.italic = false;
    this.getComboGuardia(data.idturno, row, data.grupo);
    this.getComboColegiados(row, data.grupo);

    if (this.rowGroups != undefined && this.rowGroups != null) {
      this.rowGroups.unshift(row);
    } else {
      this.rowGroups = [row];
    }
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;

    this.showResults = true;
  }

  getComboGuardia(idTurno, row, grupo) {
    this.comboGuardias = [];
    let url;
    if (grupo){
      url = "busquedaGuardia_grupo";
    }else {
      url = "busquedaGuardia_noGrupo";
    }
    this.sigaServices.getParam(
      url, "?idTurno=" + idTurno).subscribe(
        data => {
          let comboGuardias = data.combooItems;
          this.commonsService.arregloTildesCombo(comboGuardias);
          this.comboGuardias = comboGuardias;
        },
        err => {
          //console.log(err);
        },
        () => {
          row.cells[1].combo = this.comboGuardias;
        }
      );
  }

  getComboColegiados(row: Row, grupo) {
    this.comboColegiados = [];
    let params = new SaltoCompItem();
    params.idTurno = row.cells[0].value;
    params.idGuardia = row.cells[1].value;
    this.sigaServices.post(
      "saltosCompensacionesGuardia_comboColegiados", params).subscribe(
      data => {
        let comboColegiados = JSON.parse(data.body).letradosGuardiaItem;
        let error = JSON.parse(data.body).error;
        comboColegiados.forEach(combo => {
          if (grupo){
            this.comboColegiados.push({
              label:"["+combo.grupo+"]"+"("+combo.numeroColegiado+") "+combo.apellidos1+combo.apellidos2+", "+combo.nombre,
              value:combo.grupo+"/"+combo.numeroColegiado});
          }else{
            this.comboColegiados.push({
              label:"("+combo.numeroColegiado+") "+combo.apellidos1+combo.apellidos2+", "+combo.nombre,
              value:combo.numeroColegiado});
          }
        });
      },
      err => {
      },
      () => {
        this.rowGroups.find(el => el.id == row.id).cells[2].combo = this.comboColegiados;
      }
    );
  }
}
