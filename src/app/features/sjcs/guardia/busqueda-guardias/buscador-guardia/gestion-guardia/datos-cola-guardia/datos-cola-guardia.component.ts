import { Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { GuardiaItem } from '../../../../../../../models/guardia/GuardiaItem';
import { Router } from '@angular/router';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { DatePipe } from '../../../../../../../../../node_modules/@angular/common';
import { CommonsService } from '../../../../../../../_services/commons.service';
import { TranslateService } from '../../../../../../../commons/translate';
import { Row, TablaResultadoOrderCGService } from '../../../../../../../commons/tabla-resultado-order/tabla-resultado-order-cg.service';
import { TablaResultadoOrderComponent } from '../../../../../../../commons/tabla-resultado-order/tabla-resultado-order.component';
import { ConfiguracionCola, GlobalGuardiasService } from '../../../../guardiasGlobal.service';
import { Subscription } from 'rxjs';
import { SaltoCompItem } from '../../../../../../../models/guardia/SaltoCompItem';


@Component({
  selector: 'app-datos-cola-guardia',
  templateUrl: './datos-cola-guardia.component.html',
  styleUrls: ['./datos-cola-guardia.component.scss']
})
export class DatosColaGuardiaComponent implements OnInit, AfterViewInit {

  msgs = [];
  @Input() openFicha: boolean = false;
  permitirGuardar: boolean = false;
  rowsPerPage;
  cols = [];
  colsSaltos = [];
  colsCompensaciones = [];
  selectedDatos = [];
  numSelected = 0;
  fecha;
  datosInicial;
  body = new GuardiaItem();
  guardiaComunicar : GuardiaItem;
  datos: any[];
  datosSaltos: any[];
  datosCompensaciones: any[];
  idTurno: string;
  nuevo;
  historico: boolean = false;
  progressSpinner: boolean = false;
  updateInscripciones = [];
  selectionMode = "single";
  primerLetrado :String ="";
  nombreApellidosPrimerLetrado:String ="";
  ultimoLetrado:String ="";
  apeyNombreUltimo:String ="";
  nInscritos:String ="";
  botActivos: boolean = true;
  editable: boolean = true;
  rowGroups: Row[];
  rowGroupsAux: Row[];
  datosConfColaGuardias: any;
  selectedItem: number = 10;
  selectedItemSaltosCompensaciones: number = 3;
  cabeceras = [
    /*{
      id: "ordenCola",
      name: "dato.jgr.guardia.guardias.ordenCola"
    },*/
    {
      id: "grupo",
      name: "dato.jgr.guardia.guardias.grupo"
    },
    {
      id: "orden",
      name: "administracion.informes.literal.orden"
    },
    {
      id: "ncolegiado",
      name: "censo.busquedaClientesAvanzada.literal.nColegiado"
    },
    {
      id: "apellidosnombre",
      name: "administracion.parametrosGenerales.literal.nombre.apellidos"
    },
    {
      id: "fechavalidez",
      name: "dato.jgr.guardia.guardias.fechaValidez"
    },
    {
      id: "fechabaja",
      name: "dato.jgr.guardia.guardias.fechaBaja"
    }
  ];
  configuracionCola: ConfiguracionCola = {
    'manual': true,
    'porGrupos': true,
    'idConjuntoGuardia': 0,
    "fromCombo": false,
    "minimoLetradosCola": 0
};
  allSelected = false;
  isDisabled = true;
  seleccionarTodo = false;
  processedData = [];
  rowGroupModified:Row[];
  selectedRow:Row;
  totalRegistros = 0;
  suscription: Subscription;
  porGrupos = false;
  @Input() tarjetaColaGuardia;
  @Input() permisoEscritura: boolean = false;
  @Input() modoEdicion = false;
  @Input() modoVinculado = false;
  manual: Boolean;
  minimoLetrado = 0;
  //@ViewChild(TablaDinamicaColaGuardiaComponent) tabla;
  @ViewChild(TablaResultadoOrderComponent) tablaOrder;
  @ViewChild("table") table;
  @ViewChild("tableComp") tableComp;
  @ViewChild("tableSaltos") tableSaltos;

  @Input() dataConfColaGuardiaPadre: String;

  @Input() TarjetaInscripciones;
  filtroInscripciones = {
    idGuardia : '',
    idTurno : ''
  }
  //colaOrderConf : String;

  constructor(private sigaService: SigaServices,
    private persistenceService: PersistenceService,
    private router : Router,
    public datepipe: DatePipe,
    public commonsService: CommonsService,
    public translateService: TranslateService,
    private trmService: TablaResultadoOrderCGService,
    private globalGuardiasService: GlobalGuardiasService,
    private sigaServices: SigaServices,
    private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
      this.suscription = this.globalGuardiasService.getConf().subscribe((confValue)=>{
        this.configuracionCola = confValue;
        this.manual = confValue.manual;
        this.porGrupos= confValue.porGrupos;
        this.minimoLetrado = confValue.minimoLetradosCola
        //console.log("MANUAL: ", this.manual)
       
        //this.getColaGuardia();
      });
      this.inicio();
  }

  ngAfterViewInit(): void {
    this.initTablas();
  }

  goToInscripciones(){

    if(this.persistenceService.getDatos() && !this.modoVinculado){
      this.filtroInscripciones.idGuardia = this.persistenceService.getDatos().idGuardia != undefined ? this.persistenceService.getDatos().idGuardia : JSON.parse(this.persistenceService.getDatos()).idGuardia;
      this.filtroInscripciones.idTurno = this.persistenceService.getDatos().idTurno != undefined ? this.persistenceService.getDatos().idTurno : JSON.parse(this.persistenceService.getDatos()).idTurno;
      sessionStorage.setItem("filtroFromFichaGuardia",JSON.stringify(this.filtroInscripciones));
      this.router.navigate(["/inscripcionesGuardia"]);

    }

  }
 ngOnDestroy(){
  this.suscription.unsubscribe();
 }
inicio(){
  this.datos = [];
    this.historico = this.persistenceService.getHistorico();
    this.sigaService.datosRedy$.subscribe(
      data => {
        if (data.body)
          data = JSON.parse(data.body)

        this.body.nombre = data.nombre;

        this.body.porGrupos = data.porGrupos;
        // this.selectionMode = data.porGrupos ? "multiple" : "single"
        this.body.idOrdenacionColas = data.idOrdenacionColas;
        this.body.idGuardia = data.idGuardia;
        this.body.idTurno = data.idTurno;
        this.body.idPersonaUltimo = data.idPersonaUltimo;
        this.body.idGrupoUltimo = data.idGrupoUltimo;
        this.body.porGrupos = data.porGrupos == "1" ? true : false;
        this.body.letradosIns = new Date();
        
        if (this.configuracionCola.manual && this.configuracionCola.porGrupos){
          this.body.porGrupos = true;
          this.getColaGuardia();
        } else {
          this.body.porGrupos = false;
          this.getColaGuardia();
        }
        if (this.body.porGrupos) {
          this.body.ordenacionManual = true;
          this.editable = true;
          this.botActivos = true;
        }
        this.sigaService.get("institucionActual").subscribe(n => {
          if(this.body != undefined) this.body.idInstitucion = n.value;
          this.guardiaComunicar = this.body;
        });

        
      });


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
  abreCierraFicha() {
    if(this.modoVinculado){
      this.modoEdicion=false
  }
    if (this.modoEdicion)
      this.openFicha = !this.openFicha
  }

  disabledSave() {
    if (!this.permisoEscritura || this.historico || !this.updateInscripciones || this.updateInscripciones.length == 0) {
      return true;
    } else return false;
  }
  save() {
    if (this.permisoEscritura && !this.historico) {
      this.updateInscripciones = this.updateInscripciones.map(it => {
        it.orden = it.orden + "";
        it.numeroGrupo = it.numeroGrupo + "";
        return it;
      })
      this.updateInscripciones = this.updateInscripciones.filter(it => {
        if (it.ordenCola < 1 && (!it.orden || !it.numeroGrupo))
          return false;
        return true;    //Aqui quitamos todas las inscripciones duplicadas a las que le falten datos.
      });               //Estas inscripciones simplemente no se guardaran.
      this.datos = this.datos.filter(it => {
        if (it.ordenCola < 1 && (!it.orden || !it.numeroGrupo))
          return false;
        return true;
      });
      if (!this.body.porGrupos && this.body.ordenacionManual) {
        let repes = []
        this.datos.forEach(it => {
          if (repes.length <= 1)
            repes = this.datos.filter(element => {
              if (element.numeroGrupo == it.numeroGrupo && it.numeroGrupo)
                return true;
              return false;
            });
        });
        if (repes.length > 1)
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.guardia.gestion.errorRepiteGrupo"));
        else {
          this.datos = this.datos.map(it => {
            it.orden = 1;
            return it;
          });
          this.callSaveService();

        }
      } else {
        let repes = [];
        let mismoGrupo = [];
        let grupoUltimo = this.datos.filter(it => this.datos[this.datos.length - 1].numeroGrupo == it.numeroGrupo);
        let nuevoUltimo;
        let ceros: boolean = false;

        this.datos.forEach(it => {
          if (mismoGrupo.length <= 1 && repes.length < 1 && !ceros) {
            if (!it.numeroGrupo && it.orden || it.numeroGrupo && !it.orden) {
              mismoGrupo.push("Habia un campo vacio");
              mismoGrupo.push("Habia un campo vacio");
            } else {
              mismoGrupo = this.datos.filter(element => {
                if (element.numeroGrupo == it.numeroGrupo && element.idPersona == it.idPersona && it.numeroGrupo)
                  return true;
                return false;
              });
              repes = this.datos.filter(element => {
                if (element.numeroGrupo == it.numeroGrupo && element.orden == it.orden &&
                  element.numeroGrupo && it.numeroGrupo && element.idGrupoGuardiaColegiado != it.idGrupoGuardiaColegiado
                  && it.numeroGrupo)
                  return true;
                return false;
              })
              if (it.numeroGrupo == 0 || it.orden == 0)
                ceros = true;
            }
          }
        });

        if (mismoGrupo.length > 1 || repes.length >= 1 || ceros) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.guardia.gestion.errorRepiteGrupo"));
          this.updateInscripciones = this.updateInscripciones.map(it => {
            it.orden = +it.orden;
            it.numeroGrupo = +it.numeroGrupo;
            return it;
          })
        }
        else {
          if (grupoUltimo.length > 0) {
            nuevoUltimo = grupoUltimo[0]; // Por si uno del mmismo grupo que el ultimo tiene un orden mayor que el ultimo
            grupoUltimo.forEach(it => {
              if (it.orden > nuevoUltimo.orden)
                nuevoUltimo = it;
            })
            if (this.updateInscripciones.filter(it => nuevoUltimo.idGrupoGuardiaColegiado == it.idGrupoGuardiaColegiado).length > 0)
              this.ultimo(nuevoUltimo)
          }
          this.callSaveService();

        }
      }

      this.progressSpinner = false;
    }
  }
  callSaveService() {
    if (this.updateInscripciones && this.updateInscripciones.length > 0) {
      this.progressSpinner = true;

      this.sigaService.post(
        "gestionGuardias_guardarCola", this.updateInscripciones).subscribe(
          data => {
            this.getColaGuardia();
            this.updateInscripciones = [];
            this.progressSpinner = false;
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          },
          err => {
            //console.log(err);

            if (err.error != undefined && JSON.parse(err.error).error.description != "") {
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
  }

  changeGrupo(dato) {
    let findDato;
    if (dato.ordenCola > 0) {
      findDato = this.datosInicial.find(item => item.idPersona === dato.idPersona &&
        item.idGrupoGuardiaColegiado === dato.idGrupoGuardiaColegiado ||
        dato.ordenCola == item.ordenCola);

      if (findDato != undefined) {
        if (dato.numeroGrupo != findDato.numeroGrupo) {

          let findUpdate = this.updateInscripciones.find(item => item.idPersona === dato.idPersona &&
            item.idGrupoGuardiaColegiado === dato.idGrupoGuardiaColegiado ||
            dato.ordenCola == item.ordenCola);

          if (findUpdate == undefined) {
            this.updateInscripciones.push(dato);
          }
        }
      }
    }

  }

  changeOrden(dato) {
    let findDato;
    if (dato.ordenCola > 0) {
      findDato = this.datosInicial.find(item => item.idPersona === dato.idPersona && item.idGrupoGuardiaColegiado === dato.idGrupoGuardiaColegiado ||
        dato.ordenCola == item.ordenCola);

      if (findDato != undefined) {
        if (dato.orden != findDato.orden) {

          let findUpdate = this.updateInscripciones.find(item => item.idPersona === dato.idPersona && item.idGrupoGuardiaColegiado === dato.idGrupoGuardiaColegiado ||
            dato.ordenCola == item.ordenCola);

          if (findUpdate == undefined) {
            this.updateInscripciones.push(dato);
          }
        }
      }
    }

  }

  transformDate(fecha) {
    this.body.letradosIns = this.datepipe.transform(new Date(fecha), 'dd/MM/yyyy');
  }
  setColaGuardia(colaGuardiaModificado){
    this.progressSpinner = true;
    let colaGuardiaModificadoSt = JSON.parse(JSON.stringify(colaGuardiaModificado));
    this.sigaService.post(
      "busquedaGuardias_updateColaGuardia", colaGuardiaModificadoSt).subscribe(
        data => {
          this.getColaGuardia();
          this.progressSpinner = false;
          //console.log(data);
        }, err => {
          this.progressSpinner = false;
          //console.log(err);
        },
        () => {
          this.progressSpinner = false;
        });
  }

  getColaGuardia() {
    if (this.body.letradosIns instanceof Date) // Se comprueba si es una fecha por si es necesario cambiar el formato.
      this.transformDate(this.body.letradosIns); // Si no es una fecha es que ya está formateada porque viene del back.
    this.progressSpinner = true;
    //this.body.idTurno = 802; //borrar
    //this.body.idGuardia = 1441; //borrar
    //this.body.letradosIns = '09/12/10';
    this.sigaService.post(
      "busquedaGuardias_getColaGuardia", this.body).subscribe(
        data => {
          this.datos = JSON.parse(data.body).inscripcionesItem;
          this.datos = this.datos.map(it => {
            it.nombreApe = it.apellido1 + " " + it.apellido2 + " " + it.nombre;
            /*if (!this.body.porGrupos && !this.body.ordenacionManual) {
              it.numeroGrupo = "";
              it.orden = "";
            } else {
              it.numeroGrupo = +it.numeroGrupo
              it.order = +it.order
            }*/
            return it;
          });
          this.transformData();
          this.getSaltosYCompensaciones();
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          if (this.datos && this.datos.length > 0){


            this.primerLetrado = this.datos[0].nColegiado
            this.nombreApellidosPrimerLetrado = this.datos[0].nombreApe 
            this.ultimoLetrado = this.datos[this.datos.length - 1].nColegiado
            this.apeyNombreUltimo = this.datos[this.datos.length - 1].nombreApe;

            this.nInscritos = this.datos.length.toString();

          if (this.body.idPersonaUltimo && this.datos.length > 0)
            this.body.idGrupoUltimo = this.datos[this.datos.length - 1].idGrupoGuardia;
          }
          //this.rest();
          this.progressSpinner = false;
          
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }
  existenDatos(){
    if (this.datos != undefined) return this.datos.length > 0;
    else return false;
  }
  
  transformData(){
    let arr = [];
    let arrLast = [];
    this.datos.forEach(datoObj =>{
      let objArr = {cells:[]};
      let ordenValue = '';
      if (datoObj.orden != null){
        ordenValue = datoObj.orden;
      } else {
        ordenValue = '';
      }
      let nG;
      nG = datoObj.numeroGrupo;
      if (this.configuracionCola.porGrupos == false && this.configuracionCola.porGrupos == false){
        objArr.cells = [
          //{ type: 'text', value: datoObj.ordenCola },
         
          { type: 'text', value: nG },
          { type: 'text', value: datoObj.orden },
          { type: 'text', value: datoObj.nColegiado },
          { type: 'text', value: datoObj.apellido1 + ' ' + datoObj.apellido2 + ', ' + datoObj.nombre},
          { type: 'text', value: datoObj.fechaValidacion },
          { type: 'text', value: datoObj.fechabaja },
          { type: 'text', value: datoObj.idGrupoGuardiaColegiado},
          { type: 'invisible', value: datoObj.ordenCola },
          { type: 'invisible', value: datoObj.idturno },
          { type: 'invisible', value: datoObj.idGuardia },
          //{ type: 'invisible', value: datoObj.ordenBD },
          { type: 'invisible', value: datoObj.orden },
          { type: 'invisible', value: datoObj.fechaSuscripcion },
          { type: 'invisible', value: datoObj.idGrupoGuardia },
          { type: 'invisible', value: datoObj.idPersona },
          { type: 'invisible', value: datoObj.ultimoCola }
          
        ];
      } else {
        objArr.cells = [
          //{ type: 'text', value: datoObj.ordenCola },
         
          { type: 'input', value: nG },
          { type: 'position', value: datoObj.orden },
          { type: 'text', value: datoObj.nColegiado },
          { type: 'text', value: datoObj.apellido1 + ' ' + datoObj.apellido2 + ', ' + datoObj.nombre},
          { type: 'text', value: datoObj.fechaValidacion },
          { type: 'text', value: datoObj.fechabaja },
          { type: 'text', value: datoObj.idGrupoGuardiaColegiado},
          { type: 'invisible', value: datoObj.ordenCola },
          { type: 'invisible', value: datoObj.idturno },
          { type: 'invisible', value: datoObj.idGuardia },
          { type: 'invisible', value: datoObj.orden },
          { type: 'invisible', value: datoObj.fechaSuscripcion },
          { type: 'invisible', value: datoObj.idGrupoGuardia },
          { type: 'invisible', value: datoObj.idPersona },
          { type: 'invisible', value: undefined }//datoObj.ultimoCola }
        ];
      }
      if (datoObj.numeroGrupo == null){
        arrLast.push(objArr);
      }else{
        arr.push(objArr);
      }
    
    })
    for (let i = 0; i < arrLast.length; i++){
      arr.push(arrLast[i]);
    }
    this.processedData = arr;
    this.rowGroups = this.trmService.getTableData(this.processedData);
    this.rowGroupsAux = this.trmService.getTableData(this.processedData);
    this.totalRegistros = this.rowGroups.length;

    if (this.configuracionCola.manual) {
      this.manual = true;
    } else{
      this.manual = false;
    }

  }
  colaGuardiaOrdenada(event){
    
    let datosModif = [];
    this.rowGroupModified = event;

    this.rowGroupModified.forEach(rg => {

      let datCopy = {
        apellido1: "",
        apellido2: "",
        fechaSuscripcion: '',
        fechaValidacion: "",
        fechabaja: null,
        idGrupoGuardia: "",
        idGrupoGuardiaColegiado: "",
        idGuardia: "",
        idPersona: "",
        idTurno: "",
        nColegiado: "",
        nombre: "",
        nombreApe: "",
        numeroGrupo: '',
        orden: "",
        ordenCola: "",
        order: '',
        ultimoCola: ""
      };
      datCopy.apellido1 = rg.cells[3].value.split(",")[0];
      datCopy.apellido2 = rg.cells[3].value.split(",")[1];
      if (rg.cells[13] != undefined)
        datCopy.fechaSuscripcion = rg.cells[13].value;
      datCopy.fechaValidacion = rg.cells[4].value;
      datCopy.fechabaja = rg.cells[5].value;
      if (rg.cells[14] != undefined)
        datCopy.idGrupoGuardia = rg.cells[14].value;
      datCopy.idGrupoGuardiaColegiado = rg.cells[8].value;
      datCopy.idGuardia = rg.cells[11].value;
      if (rg.cells[15] != undefined)
        datCopy.idPersona = rg.cells[15].value;
      datCopy.idTurno = rg.cells[10].value;
      datCopy.nColegiado = rg.cells[2].value;
      datCopy.nombre = rg.cells[3].value.split(",")[2];
      datCopy.nombreApe = rg.cells[3].value;
      datCopy.numeroGrupo = rg.cells[0].value;
      datCopy.orden = rg.cells[1].value;
      datCopy.ordenCola = rg.cells[9].value;
      //datCopy.order = rg.cells[];
      //if (rg.cells[])
      if (rg.cells[16] != undefined){
        datCopy.ultimoCola = rg.cells[16].value;
      } /* else{
        datCopy.ultimoCola = rg.cells[12].value;
      } */
      

      datosModif.push(datCopy);
    });
    
    let colaGuardiaUpdated = {"inscripcionesItem": datosModif};
    this.setColaGuardia(colaGuardiaUpdated);
  }
  updateColaGuardia(event){
 
    let datosModif = [];
    this.rowGroupModified = event;
    this.rowGroupModified.forEach(row => {
      let datCopy = {
        apellido1: "",
        apellido2: "",
        fechaSuscripcion: '',
        fechaValidacion: "",
        fechabaja: null,
        idGrupoGuardia: "",
        idGrupoGuardiaColegiado: "",
        idGuardia: "",
        idPersona: "",
        idTurno: "",
        nColegiado: "",
        nombre: "",
        nombreApe: "",
        numeroGrupo: '',
        orden: "",
        ordenCola: "",
        order: '',
        ultimoCola : ""
      };
      let ordenCola = row.cells[1];
      let grupo = row.cells[0];
      //let orden = row.cells[2];
      let numCol = row.cells[2];
      let idGGC = row.cells[8];
      //let ultimoCola = row.cells[12];
      let ultimoCola2 = row.cells[16];
      this.datos.forEach((dat, pos) => {
        
        if (dat.nColegiado == numCol.value && dat.idGrupoGuardiaColegiado != datCopy.idGrupoGuardiaColegiado && dat.idGrupoGuardiaColegiado == idGGC.value){
            datCopy = Object.assign({},dat);
            datCopy.orden = this.rowGroupModified[pos].cells[1].value;
            if (ordenCola.value != null){
            datCopy.ordenCola = ordenCola.value.toString();
           // datCopy.orden = ordenCola.value.toString();
            }else{
              datCopy.ordenCola = null;
              datCopy.orden = null;
              
            }
           
            //datCopy.orden = orden.value.toString();
         
        }
      });
      if (grupo != null){
        datCopy.numeroGrupo = grupo.value;
        }else{
          datCopy.numeroGrupo = null;
        }

        /*
        if (ultimoCola != null && ultimoCola != undefined){
          datCopy.ultimoCola = ultimoCola.value;
        }else 
        */
        if(ultimoCola2!= null && ultimoCola2 != undefined){
          datCopy.ultimoCola = ultimoCola2.value;

        }else{
            datCopy.ultimoCola  = null;
          }
        
      datosModif.push(datCopy);
    })
    let colaGuardiaUpdated = { "inscripcionesItem": datosModif };
    this.setColaGuardia(colaGuardiaUpdated);
  }
  fillFecha(event) {
    this.body.letradosIns = event;
    this.getColaGuardia();
  }

  ultimo(selected) {
    /*if (this.permisoEscritura && !this.historico && selected.ordenCola > 0) {
      this.progressSpinner = true;
      this.body.idPersonaUltimo = selected.idPersona;
      this.body.idGrupoUltimo = selected.idGrupoUltimo;
      let grupo = this.datos.filter(it => selected.idGrupoGuardia == it.idGrupoGuardia);
      if (grupo.length > 1) {
        this.datos.forEach(it => {
          if (it.orden > selected.orden) {
            selected.orden = it.orden + 1;
            this.updateInscripciones.pop();
            this.updateInscripciones.push(selected)
          }
        });
        if (this.updateInscripciones.length > 0)
          this.save();
      }

      this.sigaService.post(
        "busquedaGuardias_getUltimo", this.body).subscribe(
          data => {
            this.getColaGuardia();
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
          }
        );
    }*/
  

  }

  isOrdenacionManual() {
    //this.progressSpinner = true;
    this.sigaService
      .getParam("combossjcs_ordenCola", "?idordenacioncolas=" + this.body.idOrdenacionColas)
      .subscribe(
        n => {
          n.colaOrden.forEach(it => {
            if (it.por_filas == "ORDENACIONMANUAL" && +it.numero != 0)
              this.body.ordenacionManual = true;
          });

          if (!this.body.ordenacionManual) {
            this.botActivos = false;
            this.editable = false;
          } else {
            this.botActivos = true;
            this.editable = true;
          }
          //getConfColaGuardias();
          this.getColaGuardia();
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        });

  }
  
  checkSelectedRow(selected){
    this.selectedRow = selected;
  }
  duplicar(duplicar) {
    if (duplicar){
    let datCopy;
    this.datos.forEach(dat => {
      if (dat.nColegiado == this.selectedRow.cells[2].value){
        datCopy = Object.assign({},dat);
        datCopy.numeroGrupo = Number(this.selectedRow.cells[0].value);
        datCopy.orden = "0"; // duplicados se identifican por orden <= 0
        datCopy.idGrupoGuardiaColegiado = null; // duplicados no tienen idGrupoGuardiaColegiado 
      } 
    });
    this.datos.push(datCopy);
    this.transformData();
  }
  }


  rest(rest) {
if (rest){
    if (this.datosInicial && this.datos) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
      this.transformData();
      /*this.tablaOrder.tabla.reset();
      this.tablaOrder.tabla.sortOrder = 0;
      this.tablaOrder.tabla.sortField = '';
      this.tablaOrder.selectedDatos = null;
      this.tablaOrder.buscadores = this.tablaOrder.buscadores.map(it => it = "");*/

      this.updateInscripciones = [];
      // this.tabla.buscadores = this.tabla.buscadores.map(it => it = ""); NO OLVIDAAAAAAAAR!!!!!
    }
  }
  }
  disabledBotones() {
    if (!this.botActivos || !this.tablaOrder || (!this.updateInscripciones || this.updateInscripciones.length == 0) || (!this.tablaOrder.selectedDatos || this.tablaOrder.selectedDatos.length == 0))
      return false;
    return true;
  }
  duplicarDisabled() {
    return this.isDisabled;
  }
  disabledUltimo() {
    return this.isDisabled;
  }

  clear() {
    this.msgs = [];
  }
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  getConfColaGuardias() {
    let datos = JSON.parse(JSON.stringify(this.persistenceService.getDatos()));
    this.sigaService.post("busquedaGuardias_resumenConfCola", datos)
      .subscribe(data => {
        if (data.body)
          data = JSON.parse(data.body);
        //this.numeroletradosguardia = data.letradosIns;
        this.datosConfColaGuardias = data.idOrdenacionColas;
        if (this.datosConfColaGuardias && this.datosConfColaGuardias.split(",").length > 4)
          this.datosConfColaGuardias = this.datosConfColaGuardias.substring(0, this.datosConfColaGuardias.lastIndexOf(","));
      },
        err => {
          //console.log(err);
        })
  }

  private initTablas(): void {
    this.getCols();
    this.cdRef.detectChanges();
    if (this.table) {
      this.table.sortOrder = 0;
      this.table.sortField = '';
      this.table.reset();
      this.tableComp.sortOrder = 0;
      this.tableComp.sortField = '';
      this.tableComp.reset();
      this.tableSaltos.sortOrder = 0;
      this.tableSaltos.sortField = '';
      this.tableSaltos.reset();
    }
  }

  private getCols(): void {

    this.colsCompensaciones = [
      { field: "colegiadoGrupo", header: "censo.busquedaClientesAvanzada.literal.nCol", width: "15%" },
      { field: "letrado", header: "administracion.parametrosGenerales.literal.nombre.apellidos.coma", width: "30%" },
      { field: "fecha", header: "justiciaGratuita.oficio.turnos.fechavalidacion", width: "22%" }
    ];

    this.colsSaltos = [
      { field: "colegiadoGrupo", header: "censo.busquedaClientesAvanzada.literal.nCol", width: "15%" },
      { field: "letrado", header: "administracion.parametrosGenerales.literal.nombre.apellidos.coma", width: "30%" },
      { field: "fecha", header: "justiciaGratuita.oficio.turnos.fechavalidacion", width: "22%" }
    ];

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  actualizaSeleccionados(selectedDatos) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
    }
  }

  getSaltosYCompensaciones() {
    let filtros: SaltoCompItem = new SaltoCompItem();
    if (sessionStorage.getItem("filtrosSaltosCompOficio")) {
      filtros = JSON.parse(sessionStorage.getItem("filtrosSaltosCompOficio"));
    }
    if (sessionStorage.getItem("saltos-compesacionesItem")) {
      filtros = JSON.parse(sessionStorage.getItem("saltos-compesacionesItem"));
    }
    filtros.idTurno = this.idTurno;
    this.sigaServices.postPaginado("saltosCompensacionesOficio_buscar", "?numPagina=1", filtros).subscribe(
      n => {
        let datosSaltosYComp: SaltoCompItem[] = JSON.parse(n.body).saltosCompItems.filter(item => item.fechaUso === null);
        this.datosSaltos = datosSaltosYComp.filter(datos => datos.saltoCompensacion === 'S');
        this.datosCompensaciones = datosSaltosYComp.filter(datos => datos.saltoCompensacion === 'C');
        let error = JSON.parse(n.body).error;
      });
  }
}
