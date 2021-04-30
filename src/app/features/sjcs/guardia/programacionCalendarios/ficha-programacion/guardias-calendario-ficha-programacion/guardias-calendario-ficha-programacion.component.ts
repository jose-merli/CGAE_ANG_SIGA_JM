import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { TranslateService } from '../../../../../../commons/translate';
import { Cell, Row, TablaResultadoOrderCGService } from '../../../../../../commons/tabla-resultado-order/tabla-resultado-order-cg.service';


@Component({
  selector: 'app-guardias-calendario-ficha-programacion',
  templateUrl: './guardias-calendario-ficha-programacion.component.html',
  styleUrls: ['./guardias-calendario-ficha-programacion.component.scss']
})
export class GuardiasCalendarioFichaProgramacionComponent implements OnInit {

  body: GuardiaItem = new GuardiaItem();
  bodyInicial: GuardiaItem = new GuardiaItem();

  @Input() modoEdicion: boolean = false;
  @Input() permisoEscritura: boolean;
  @Output() modoEdicionSend = new EventEmitter<any>();
  @Input() tarjetaDatosGenerales;
  @Input() datosTarjetaGuardiasCalendario = {
                                              'duplicar': false,
                                              'tabla': [],
                                              'turno':'',
                                              'nombre': '',
                                              'generado': '',
                                              'numGuardias': '',
                                              'listaGuarias': {},
                                              'fechaDesde': '',
                                              'fechaHasta': '',
                                              'fechaProgramacion': '',
                                              'estado': '',
                                              'observaciones': '',
                                              'idCalendarioProgramado': '',
                                              'idTurno': '',
                                              'idGuardia': '',
                                            };
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  dataReady = false;
  tipoGuardiaResumen = {
    label: "",
    value: "",
  };
  @Input() openFicha: boolean = true;
  historico: boolean = false;
  isDisabledGuardia: boolean = true;
  datos = [];
  cols;
  comboTipoGuardia = [];
  comboGuardia = [];
  comboTurno = [];
  progressSpinner;
  msgs;
  resaltadoDatos: boolean = false;
  rowGroups: Row[];
  rowGroupsAux: Row[];
  totalRegistros = 0;
  selectedRow: Row;
  cabeceras = [
    {
      id: "turno",
      name: "dato.jgr.guardia.guardias.turno"
    },
    {
      id: "guardia",
      name: "dato.jgr.guardia.guardias.guardia"
    },
    {
      id: "generado",
      name: "justiciaGratuita.Calendarios.Generado"
    },
    {
      id: "numGuardias",
      name: "justiciaGratuita.Calendarios.NumGuardias"
    }
  ];
  allSelected = false;
  isDisabled = true;
  seleccionarTodo = false;
  duplicar = false;
  constructor(private persistenceService: PersistenceService,
    private sigaService: SigaServices,
    private commonServices: CommonsService,
    private translateService: TranslateService,
    private trmService: TablaResultadoOrderCGService,) { }


  ngOnInit() {
      this.jsonToRow(); //PROVISIONAL
 
    this.duplicar = this.datosTarjetaGuardiasCalendario.duplicar;




    this.resaltadoDatos=true;

    this.getCols();
    this.historico = this.persistenceService.getHistorico()
    this.getComboTipoGuardia();

    this.getComboTurno();

    // this.progressSpinner = true;
    this.sigaService.datosRedy$.subscribe(
      data => {
        data = JSON.parse(data.body);
        this.body.idGuardia = data.idGuardia;
        this.body.descripcionFacturacion = data.descripcionFacturacion;
        this.body.descripcion = data.descripcion;
        this.body.descripcionPago = data.descripcionPago;
        this.body.idTipoGuardia = data.idTipoGuardia;
        this.body.idTurno = data.idTurno;
        this.body.nombre = data.nombre;
        this.body.envioCentralita = data.envioCentralita;
        //Informamos de la guardia de la que hereda si existe.
        if (data.idGuardiaPrincipal && data.idTurnoPrincipal)
          this.datos.push({
            vinculacion: 'Principal',
            turno: data.idTurnoPrincipal,
            guardia: data.idGuardiaPrincipal
          })
        if (data.idGuardiaVinculada && data.idTurnoVinculada) {
          let guardias = data.idGuardiaVinculada.split(",");
          let turno = data.idTurnoVinculada.split(",");
          this.datos = guardias.map(function (x, i) {
            return { vinculacion: "Vinculada", guardia: x, turno: turno[i] }
          });
          this.datos.pop()
        }
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.progressSpinner = false;
      });
  }

  checkSelectedRow(selected) {
    this.selectedRow = selected;
  }
  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento==undefined || evento==null || evento=="")){
      return this.commonServices.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios(){
    this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios')}];
    this.resaltadoDatos=true;
  }

  abreCierraFicha(key) {
    this.openFicha = !this.openFicha;

    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }


  disabledSave() {
    if (this.permisoEscritura){
      /*if (!this.historico && (this.body.nombre && this.body.nombre.trim())
        && (this.body.descripcion && this.body.descripcion.trim()) && !(this.body.idTurnoPrincipal && !this.body.idGuardiaPrincipal)
        && (this.body.idTurno) && (JSON.stringify(this.body) != JSON.stringify(this.bodyInicial))) {*/
          if (!this.historico && (this.body.nombre && this.body.nombre.trim())
        && (this.body.descripcion && this.body.descripcion.trim()) && !(this.body.idTurnoPrincipal && !this.body.idGuardiaPrincipal)
        && (this.body.idTurno)) {
        return false;
      } else return true;
    }
    else
      return true;
  }

  getCols() {
    if (!this.modoEdicion)
      this.cols = [
        { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
        { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      ];
    else
      this.cols = [
        { field: "vinculacion", header: "justiciaGratuita.guardia.gestion.vinculacion" },
        { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
        { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      ];
  }


  getComboTipoGuardia() {
    this.sigaService.get("busquedaGuardia_tiposGuardia").subscribe(
      n => {
        this.comboTipoGuardia = n.combooItems;

        this.commonServices.arregloTildesCombo(this.comboTipoGuardia);
        this.resumenTipoGuardiaResumen();

      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTurno() {
    this.sigaService.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurno);
      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeTurno() {
    this.body.idGuardia = "";
    this.comboGuardia = [];

    if (this.body.idTurnoPrincipal) {
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
    }
  }

  getComboGuardia() {
    this.sigaService.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + this.body.idTurnoPrincipal).subscribe(
        data => {
          this.isDisabledGuardia = false;
          this.comboGuardia = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardia);
        },
        err => {
          console.log(err);
        }
      )

  }

  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }


  callSaveService(url) {
    if (this.body.descripcion != undefined) this.body.descripcion = this.body.descripcion.trim();
    if (this.body.nombre != undefined) this.body.nombre = this.body.nombre.trim();
    if (this.body.envioCentralita == undefined) this.body.envioCentralita = false;
    this.sigaService.post(url, this.body).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.getCols();
          this.body.idGuardia = JSON.parse(data.body).id;
          this.persistenceService.setDatos({
            idGuardia: this.body.idGuardia,
            idTurno: this.body.idTurno
          })
          this.modoEdicionSend.emit(true);
          this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.guardia.gestion.guardiaCreadaDatosPred"));
        } else this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

        this.resumenTipoGuardiaResumen();
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));

        this.progressSpinner = false;
      },
      err => {

        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
          console.log('err.error - ', err.error)
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );

  }

  save() {
    if(!this.disabledSave()){
      if (this.permisoEscritura && !this.historico) {
        this.progressSpinner = true;
        let url = "";

        if (!this.modoEdicion && this.permisoEscritura) {
          url = "busquedaGuardias_createGuardia";
          this.callSaveService(url);

        } else if (this.permisoEscritura) {
          url = "busquedaGuardias_updateGuardia";
          this.callSaveService(url);
        }
      }
    }else{
      this.muestraCamposObligatorios();
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  resumenTipoGuardiaResumen() {
    this.tipoGuardiaResumen = this.comboTipoGuardia.filter(it => it.value == this.body.idTipoGuardia)[0]
  }

  clear() {
    this.msgs = [];
  }
  delete(indexToDelete){
    let idGuardia;
    let idTurno;
    let toDelete:Row[] = [];
    indexToDelete.forEach(index => {
      toDelete.push(this.rowGroups[index]);
      this.rowGroups.splice(index, 1); 
    })

    toDelete.forEach(row => {
      row.cells.forEach((c, index) => {
 
        if (index == 7){
          idGuardia = c.value;
        }
        if (index == 8){
          idTurno = c.value;
        }
      })
      this.eliminarCal(idGuardia, idTurno)

    })
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
    }

    //Elimina las guarduas seleccionadas
      eliminarCal(idGuardia, idTurno){
//to do
    }

jsonToRow(){
  console.log('jsonToRow')
  console.log('this.datosTarjetaGuardiasCalendario: ', this.datosTarjetaGuardiasCalendario)
  let arr: Row[] = [];

    let i = 0;
    let objCells:Cell[] = [
    { type: 'text', value: this.datosTarjetaGuardiasCalendario.turno , combo: null},
    { type: 'text', value: this.datosTarjetaGuardiasCalendario.nombre , combo: null},
    { type: 'text', value: this.datosTarjetaGuardiasCalendario.generado, combo: null},
    { type: 'text', value: this.datosTarjetaGuardiasCalendario.numGuardias , combo: null}
    ];
console.log('objCells: ', objCells)
    let obj:Row = {cells: objCells};
    arr.push(obj);
console.log('ar: ', arr)
   this.rowGroups = [];
  this.rowGroups = this.trmService.getTableData(arr);
  this.rowGroupsAux = [];
  this.rowGroupsAux = this.trmService.getTableData(arr);
  this.totalRegistros = this.rowGroups.length;
  this.dataReady = true;
  console.log('rowGroups: ', this.rowGroups)
}

selectedAll(event) {
  this.seleccionarTodo = event;
  this.isDisabled = !event;
}
notifyAnySelected(event) {
  if (this.seleccionarTodo || event) {
    this.isDisabled = false;
  } else {
    this.isDisabled = true;
  }
}
}