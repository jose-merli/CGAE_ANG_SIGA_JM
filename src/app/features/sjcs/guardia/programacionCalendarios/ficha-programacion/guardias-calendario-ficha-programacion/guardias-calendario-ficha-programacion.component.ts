import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { TranslateService } from '../../../../../../commons/translate';
import { Cell, Row, TablaResultadoOrderCGService } from '../../../../../../commons/tabla-resultado-order/tabla-resultado-order-cg.service';
import { GlobalGuardiasService } from '../../../guardiasGlobal.service';
import { Subscription } from 'rxjs';


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
  @Output() descargaLog= new EventEmitter<String>();
  @Input() tarjetaDatosGenerales= {
    'duplicar' : '',
    'tabla': [],
    'turno':'',
    'nombre': '',
    'generado': '',
    'numGuardias': '',
    'listaGuarias': {},
    'fechaDesde': '',
    'fechaHasta': '',
    'fechaProgramacion': null,
    'estado': '',
    'observaciones': '',
    'idCalendarioProgramado': '',
    'idTurno': '',
    'idGuardia': '',
  };
  @Input() datosTarjetaGuardiasCalendarioIni = []
  @Input() idCal;
  datosTarjetaGuardiasCalendario = []
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() disGen = new EventEmitter<Boolean>();
  @Output() fillDatosTarjetaGuardiasCalendario = new EventEmitter<any[]>();
  @Output() linkGuardiaColegiado2 = new EventEmitter<any>();
  @Output() searchGuardiasFromCal = new EventEmitter<any>();
  @Input() estado;
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
  suscription: Subscription;
  cabeceras = [
    {
      id: "orden",
      name: "administracion.informes.literal.orden"
    },
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
  idConjuntoGuardiaElegido: number;
  comboGuardiaConjunto = [];
  isDisabledNuevo;
  @Input() duplicar = false;
  constructor(private persistenceService: PersistenceService,
    private sigaService: SigaServices,
    private commonServices: CommonsService,
    private translateService: TranslateService,
    private trmService: TablaResultadoOrderCGService,
    private globalGuardiasService: GlobalGuardiasService,
    private cd: ChangeDetectorRef) { }


  ngOnInit() {
    if(this.permisoEscritura && (this.estado == "Pendiente" || this.estado == "Programada")){
      this.isDisabledNuevo = false;
    }else{
      this.isDisabledNuevo = true;
    }
    if (this.datosTarjetaGuardiasCalendarioIni.length != 0){
      //this.datosTarjetaGuardiasCalendario = Object.assign({},this.datosTarjetaGuardiasCalendarioIni);
      this.jsonToRow(false);
      this.dataReady = true;
    }else{
      this.dataReady = false;
    }
    this.suscription = this.globalGuardiasService.getConf().subscribe((confValue)=>{
      this.dataReady = false;
      this.idConjuntoGuardiaElegido = confValue.idConjuntoGuardia;
      if (this.idConjuntoGuardiaElegido != null){
        if (this.datosTarjetaGuardiasCalendarioIni.length == 0){
        this.datosTarjetaGuardiasCalendario = [];
        this.rowGroups = [];
        this.getGuardiasFromConjunto(this.idConjuntoGuardiaElegido, confValue.fromCombo);
        }else{
          if (this.idConjuntoGuardiaElegido != 0){
            this.datosTarjetaGuardiasCalendario = this.datosTarjetaGuardiasCalendarioIni.map(x => Object.assign({}, x));
            this.getGuardiasFromConjunto(this.idConjuntoGuardiaElegido, confValue.fromCombo);
          }else{
            this.datosTarjetaGuardiasCalendario = this.datosTarjetaGuardiasCalendarioIni.map(x => Object.assign({}, x));
            this.jsonToRow(confValue.fromCombo);
            this.dataReady = true;
          }
          
        }
        


        //this.jsonToRow(); //PROVISIONAL
 
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
      }else{
        this.dataReady = true;
      }
    });
      
  }
  ngOnDestroy(){
    this.suscription.unsubscribe();
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
        //console.log(err);
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
        //console.log(err);
      }
    );
  }
    ngOnChanges(changes){
      //console.log('changes ', changes)
    }
    getGuardiasFromConjunto(idConjunto, fromCombo) {
      this.dataReady = false;
      if (this.datosTarjetaGuardiasCalendario.length != this.datosTarjetaGuardiasCalendarioIni.length){
      this.datosTarjetaGuardiasCalendario = this.datosTarjetaGuardiasCalendarioIni.map(x => Object.assign({}, x));
      }
      this.progressSpinner = true;
      this.sigaService.getParam(
        "guardiaCalendario_guardiaFromConjunto", "?idConjunto=" + idConjunto).subscribe(
          response => {
            if (!fromCombo){
            this.datosTarjetaGuardiasCalendario = [];
            }
            if (response != null && response != undefined && response.length != 0){
              response.forEach((res, i) => {
                this.datosTarjetaGuardiasCalendario.push(res);
                if (i == response.length - 1){
                  this.jsonToRow(fromCombo);
                }
              })
            }else{
              this.datosTarjetaGuardiasCalendario = this.datosTarjetaGuardiasCalendarioIni.map(x => Object.assign({}, x));
              this.cd.detectChanges();
              this.dataReady = true;
              //console.log(this.rowGroups)
              //console.log(this.rowGroupsAux)
            }
           
            this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      },
      ()=>{
        this.progressSpinner = false;
        this.fillDatosTarjetaGuardiasCalendario.emit(this.datosTarjetaGuardiasCalendario);
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
          //console.log(err);
        }
      )

  }

  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.datosTarjetaGuardiasCalendario = this.datosTarjetaGuardiasCalendarioIni.map(x => Object.assign({}, x));
    this.jsonToRow(false);
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
          //console.log('err.error - ', err.error)
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
    let newList = [];
    indexToDelete.forEach(index => {
      toDelete.push(this.rowGroups[index]);
      this.rowGroups.splice(index, 1); 
    })

    toDelete.forEach(nrg => {
          let responseObject = (
            {
              'orden': nrg.cells[0].value,
              'turno': nrg.cells[1].value,
              'guardia': nrg.cells[2].value,
              'generado': nrg.cells[3].value,
              'idGuardia': nrg.cells[5].value,
              'idTurno': nrg.cells[6].value
            });
            if (nrg.cells[3].value != true && nrg.cells[3].value != "Si" && nrg.cells[3].value != 1){
              newList.push(responseObject);
            }else{
              this.showMessage("error", this.translateService.instant("No pueden eliminarse calendarios generados"), this.translateService.instant("No pueden eliminarse calendarios generados"));
            }
            
              
    })
    this.eliminarCal(newList);
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
    }

    //Elimina las guardias seleccionadas
      eliminarCal(lista){
        this.sigaService.postPaginado(
          "guardiaCalendario_eliminarGuardiaCalendar", "?idCalendar=" +this.idCal, lista).subscribe(
            data => {
              let dat = {
                'idCal': this.idCal,
                'fechaDesde' : this.tarjetaDatosGenerales.fechaDesde,
                'fechaHasta' : this.tarjetaDatosGenerales.fechaHasta
              }
              this.searchGuardiasFromCal.emit(dat);
            }, err => {
              //console.log(err);
            });
        
//to do
    }

jsonToRow(fromCombo){
  this.dataReady = false;
  this.progressSpinner = true;
 
  let arr: Row[] = [];
  let ord = 0;
    let i = 0;

    this.datosTarjetaGuardiasCalendario.forEach((dat, i) => { 
      if (fromCombo){
        ord = i + 1;
      }else{
        ord = dat.orden;
      }
    let objCells:Cell[] = [
    { type: 'input', value: ord , combo: null, hiddenValue:'', required : false},
    { type: 'text', value: dat.turno , combo: null, hiddenValue:'', required : false},
    { type: 'link', value: dat.guardia , combo: null, hiddenValue:'', required : false},
    { type: 'text', value: dat.generado, combo: null, hiddenValue:'', required : false},
    { type: 'link2', value:  this.datosTarjetaGuardiasCalendario.length , combo: null, hiddenValue:'', required : false},
    { type: 'invisible', value: dat.idGuardia, combo: null, hiddenValue:'', required : false},
    { type: 'invisible', value: dat.idTurno, combo: null, hiddenValue:'', required : false},
    { type: 'invisible', value: dat.idCalendarioGuardia, combo: null, hiddenValue:'', required : false}
    ];
    let obj:Row = {cells: objCells};
    arr.push(obj);
  })
   this.rowGroups = [];
  this.rowGroups = this.trmService.getTableData(arr);
  this.rowGroupsAux = [];
  this.rowGroupsAux = this.trmService.getTableData(arr);
  this.totalRegistros = this.rowGroups.length;
  this.dataReady = true;
  this.progressSpinner = false;

  this.sigaService.get("busquedaGuardia_turno").subscribe(
    n => {
      this.progressSpinner = false;
      let comboTurno = n.combooItems;
      this.cd.detectChanges();
      this.commonServices.arregloTildesCombo(comboTurno);

      this.rowGroups.forEach(rowG => {
        comboTurno.forEach(cT=> {
        if (cT.value == rowG.cells[1].value){
          rowG.cells[1].value = cT.label;
        }
      
        });
      });

      this.sigaService.getParam(
        "busquedaGuardia_guardia", "?idTurno=" + null).subscribe(
          data => {
            this.progressSpinner = false;
            let comboGuardia = data.combooItems;
            this.commonServices.arregloTildesCombo(comboGuardia);
            this.rowGroups.forEach(rowG => {
              comboGuardia.forEach(cG=> {
                 if (cG.value == rowG.cells[2].value){
                  rowG.cells[2].value = cG.label;
                }
                });
              });
          },
          err => {
            this.progressSpinner = false;
            //console.log(err);
          }
        )
    },
    err => {
      this.progressSpinner = false;
      //console.log(err);
    }
  );
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


updateGuardiasCalendario(event){
//HACER
}

setGuardiasCalendario(guardiaCalendario){
  let guardiaCalendarioModificadoSt = JSON.parse(JSON.stringify(guardiaCalendario));
  this.sigaService.post(
    "busquedaGuardias_updateCalendario", guardiaCalendarioModificadoSt).subscribe(
      data => {

      }, err => {
        //console.log(err);
      });
}


  guardarGuardiasEnConjunto(event){
    let event2 = {
      'newRowGroups': event.newRowGroups,
      'update': event.update
    }
    let newRowGroups : Row[] = event2.newRowGroups;
    let newList = [];
    newRowGroups.forEach(nrg => {
      let responseObject = (
        {
          'orden': nrg.cells[0].value,
          'turno': nrg.cells[1].value,
          'guardia': nrg.cells[2].value,
          'generado': nrg.cells[3].value,
          'idGuardia': nrg.cells[2].value,
          'nuevo': nrg.cells.length <= 5
        });
        newList.push(responseObject);
    })

    if (this.idConjuntoGuardiaElegido != 0){
      this.saveGuardiasConjunto(newList);  
    }else{
      this.saveGuardiasCalendario(newList, event2.update);  
    }
      
  }

  saveGuardiasConjunto(lista){
    this.sigaService.postPaginado(
      "guardiaCalendario_guardarGuardiaConjunto" ,"?idConjuntoGuardia=" + this.idConjuntoGuardiaElegido.toString() + "&fechaDesde=" + this.tarjetaDatosGenerales.fechaDesde + "&fechaHasta=" + this.tarjetaDatosGenerales.fechaHasta + "&idTurno=" + this.tarjetaDatosGenerales.idTurno + "&idGuardia=" + this.tarjetaDatosGenerales.idGuardia, lista, ).subscribe(
        data => {
          this.getGuardiasFromConjunto(this.idConjuntoGuardiaElegido, true);
        }, err => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No se ha podido insertar/actualizar correctamente");
          //console.log(err);
        });
  }
  saveGuardiasCalendario(lista, update){
    this.sigaService.postPaginado(
      "guardiaCalendario_guardarGuardiaCalendar", "?idCalendar=" +this.idCal + "&update=" + update , lista).subscribe(
        data => {
          let dat = {
            'idCal': this.idCal,
            'fechaDesde' : this.tarjetaDatosGenerales.fechaDesde,
            'fechaHasta' : this.tarjetaDatosGenerales.fechaHasta
          }
          this.searchGuardiasFromCal.emit(dat);
        }, err => {
          this.jsonToRow(false);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No se ha podido insertar/actualizar correctamente");
          //console.log(err);
        });
  }

  descargaLog1(event){
    if (event){
      this.descargaLog.emit(event);
    }
  }

  disableGen($event){
    this.disGen.emit($event);
  }
  linkGuardiaColegiado(event){
    this.linkGuardiaColegiado2.emit(event);
  }
}