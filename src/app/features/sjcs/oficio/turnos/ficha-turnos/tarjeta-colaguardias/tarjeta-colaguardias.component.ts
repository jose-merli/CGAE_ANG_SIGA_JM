import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { DatePipe, Location, UpperCasePipe } from "@angular/common";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Subject } from "rxjs/Subject";
import { DatosGeneralesConsultaItem } from '../../../../../../models/DatosGeneralesConsultaItem';
import { DestinatariosItem } from '../../../../../../models/DestinatariosItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PrisionItem } from '../../../../../../models/sjcs/PrisionItem';
import { TurnosItems } from '../../../../../../models/sjcs/TurnosItems';
import { TurnosObject } from '../../../../../../models/sjcs/TurnosObject';
import { PartidasObject } from '../../../../../../models/sjcs/PartidasObject';
import { MultiSelect } from '../../../../../../../../node_modules/primeng/primeng';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SaltoCompItem } from '../../../../../../models/guardia/SaltoCompItem';
import { TablaResultadoOrderComponent } from '../../../../../../commons/tabla-resultado-order/tabla-resultado-order.component';
import { Row, TablaResultadoOrderCGService } from '../../../../../../commons/tabla-resultado-order/tabla-resultado-order-cg.service';
import { ConfiguracionCola, GlobalGuardiasService } from '../../../../guardia/guardiasGlobal.service';
import { Subscription } from 'rxjs';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
@Component({
  selector: "app-tarjeta-colaguardias",
  templateUrl: "./tarjeta-colaguardias.component.html",
  styleUrls: ["./tarjeta-colaguardias.component.scss"]
})
export class TarjetaColaGuardias implements OnInit {


  openFicha: boolean = false;
  textSelected: String = "{label}";
  @Input() openColaGuardias;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  
  porGrupos = false;
  selectedItem: number = 10;
  selectedItemSaltosCompensaciones: number = 3;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  cols;
  colsCompensaciones;
  colsSaltos;
  cabeceras;
  nInscritos:String ="";
  configuracionCola: ConfiguracionCola = {
    'manual': true,
    'porGrupos': true,
    'idConjuntoGuardia': 0,
    "fromCombo": false,
    "minimoLetradosCola": 0
  };
  rowGroups: Row[];
  rowGroupsAux: Row[];
  processedData = [];
  totalRegistros = 0;
  manual: Boolean;
  suscription: Subscription;
  minimoLetrado = 0;
  editable: boolean = true;
  botActivos: boolean = true;
  guardiaComunicar : GuardiaItem;
  updateInscripciones = [];
  seleccionarTodo = false;
  isDisabled = true;
  rowGroupModified:Row[];
  selectedRow:Row;
  rowsPerPage;
  historico: boolean = false;
  datos: any[];
  datosSaltos: any[];
  datosCompensaciones: any[];
  listaTabla: TurnosItems = new TurnosItems();
  fechaActual;
  disableAll: boolean = false;
  comboJurisdicciones: any[] = [];
  bodyInicial: TurnosItems;
  apeyNombreUltimo;
  progressSpinner: boolean = false;
  msgs;
  body;
  guardias = [];
  nuevo: boolean = false;
  datosInicial = [];
  updateAreas = [];
  showTarjeta: boolean = true;
  ultimoLetrado;
  primerLetrado;
  permisosTarjeta: boolean = true;
  guardiasNombre;
  existenGuardias: boolean = false;
  nombreApellidosPrimerLetrado;
  overlayVisible: boolean = false;
  ordenacionManual: boolean = false;
  selectionMode: string = "multiple";
  pesosSeleccionadosTarjeta2;
  turnosItem2;
  visita;
  @Input() turnosItem: TurnosItems;
  @Input() modoEdicion;
  @Input() idTurno;
  @Input() tarjetaColaGuardias: string;
  @Input() permisoEscritura: boolean = false;
  updateCombo: boolean = false;
  updateTurnosItem: boolean = false;
  // @Input() pesosSeleccionadosTarjeta;
  //Resultados de la busqueda
  // @Input() modoEdicion: boolean = false;

  @ViewChild("table") table;
  @ViewChild("tableComp") tableComp;
  @ViewChild("tableSaltos") tableSaltos;
  @ViewChild("multiSelect") multiSelect: MultiSelect;
  @ViewChild(TablaResultadoOrderComponent) tablaOrder;
  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "configuracion",
      activa: false
    },
    {
      key: "tablacolaguardias",
      activa: false
    },
  ];
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices, private translateService: TranslateService,
    public datepipe: DatePipe, private globalGuardiasService: GlobalGuardiasService,
    private trmService: TablaResultadoOrderCGService, private upperCasePipe: UpperCasePipe,
    private persistenceService: PersistenceService, private confirmationService: ConfirmationService, private commonsService: CommonsService,
    private router: Router, private activatedRoute: ActivatedRoute, private cdRef: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    this.getCols();

    this.sigaServices.updateCombo$.subscribe(
      fecha => {
        this.updateCombo = fecha;
        this.actualizarComboGuardias();
      });

    this.sigaServices.newIdOrdenacion$.subscribe(
      fecha => {
        this.updateTurnosItem = fecha;
        this.actualizarTurnosItems();
      });
    if (this.turnosItem != undefined) {
      if (this.turnosItem.fechabaja != undefined) {
        this.disableAll = true;
      }
      if (this.persistenceService.getDatos() != undefined) {
        this.turnosItem = this.persistenceService.getDatos();
      }
      if (this.idTurno != undefined) {
        this.turnosItem.fechaActual = new Date();
        this.body = this.turnosItem;
        this.turnosItem.idturno = this.idTurno;
        this.sigaServices
          .getParam(
            "combossjcs_comboidGuardias",
            "?idTurno=" + this.idTurno
          )
          .subscribe(
            n => {
              this.guardias = n.combooItems;
            },
            err => {

            }, () => {
              this.guardiasNombre = "";
              if (this.guardias != undefined && this.guardias.length > 0) {
                if (this.guardias.length > 5) {
                  this.existenGuardias = true;
                  this.guardiasNombre += this.guardias[0].label + "," + this.guardias[1].label + ","
                    + this.guardias[2].label + "," + this.guardias[3].label + "," + this.guardias[4].label + "..."
                } else {
                  this.existenGuardias = true;
                  this.guardias.forEach(element => {
                    this.guardiasNombre += element.label + ","
                  });
                  this.guardiasNombre = this.guardiasNombre.substring(0, this.guardiasNombre.length - 1);
                }
                if (this.guardias != undefined && this.guardias.length > 0) {
                  this.turnosItem.idcomboguardias = this.guardias[0].value;

                  this.cargarTabla(this.turnosItem.idcomboguardias);
                  this.getCols();
                  //this.inicio();
                }
              } else {
                this.existenGuardias = false;
              }
            }
          );
        if (this.body.idturno == undefined) {
          this.modoEdicion = false;
        } else {
          this.modoEdicion = true;
        }
      } else {
        if (this.activatedRoute.snapshot.queryParamMap.get('idturno')) {
          this.idTurno = this.activatedRoute.snapshot.queryParamMap.get('idturno');
        }
      }
    } else {
      this.turnosItem = new TurnosItems();
    }
    // this.arreglaChecks();
    if (this.openColaGuardias == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('colaGuardias')
      }
    }
  }

  ngOnInit() {
    this.visita = 0;
    this.commonsService.checkAcceso(procesos_oficio.colaDeGuardia)
    .then(respuesta => {
      this.permisosTarjeta = respuesta;
      this.persistenceService.setPermisos(this.permisosTarjeta);
      if (this.permisosTarjeta == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem(
          "descError",
          this.translateService.instant("generico.error.permiso.denegado")
        );
        this.router.navigate(["/errorAcceso"]);
      }else if(this.persistenceService.getPermisos() != true){
        this.disableAll = true;
      }
    }
    ).catch(error => console.error(error));
    this.getCols();
    if (this.idTurno != undefined) {
      this.modoEdicion = true;
      this.actualizarComboGuardias();
    } else {
      this.modoEdicion = false;
    }
    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true
    }

    this.suscription = this.globalGuardiasService.getConf().subscribe((confValue)=>{
      this.configuracionCola = confValue;
      this.manual = confValue.manual;
      this.porGrupos= confValue.porGrupos;
      this.minimoLetrado = confValue.minimoLetradosCola;
    });
  }

  inicio(){
    this.visita = 0;

    this.datos = [];
      this.historico = this.persistenceService.getHistorico();
      this.sigaServices.datosRedy$.subscribe(
        data => {
          if (this.visita == 0){          
            if (data.body)
              data = JSON.parse(data.body)
    
            this.body.nombre = data.nombre;
    
            this.body.porGrupos = data.porGrupos;
            
            this.body.idOrdenacionColas = data.idOrdenacionColas;
            this.body.idGuardia = data.idGuardia;
            this.body.idTurno = data.idTurno;
            this.body.idPersonaUltimo = data.idPersonaUltimo;
            this.body.idGrupoUltimo = data.idGrupoUltimo;
            this.body.porGrupos = data.porGrupos == "1" ? true : false;
            this.body.letradosIns = new Date();
            
            if (this.configuracionCola.manual && this.configuracionCola.porGrupos){
              this.body.porGrupos = true;
              this.isOrdenacionManual();
            } else {
              this.body.porGrupos = false;
              this.isOrdenacionManual();
            }
            if (this.body.porGrupos) {
              this.ordenacionManual = true;
              this.botActivos = true;
            }
            this.sigaServices.get("institucionActual").subscribe(n => {
              if(this.body != undefined) this.body.idInstitucion = n.value;
              this.body.idturno = this.body.idTurno;
              this.guardiaComunicar = this.body;
            });
          }
          //console.log(this.visita); // Cada vez que se abre/cierra la tarjeta se incrementa el num de llamadas TT
          this.visita++;          
        });
  
  
  }

  isOrdenacionManual() {
    //this.progressSpinner = true;
    this.body.ordenacionManual = false;

    this.sigaServices
      .getParam("combossjcs_ordenCola", "?idordenacioncolas=" + this.body.idOrdenacionColas)
      .subscribe(
        n => {
          n.colaOrden.forEach(it => {
            if (it.por_filas == "ORDENACIONMANUAL" && + it.numero != 0)
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

  actualizarTurnosItems() {
    if (this.updateTurnosItem) {
      if (this.persistenceService.getDatos() != undefined) {
        this.turnosItem2 = this.persistenceService.getDatos();
        this.turnosItem.idordenacioncolas = this.turnosItem2.idordenacioncolas;
      }
    }

  }

  actualizarComboGuardias() {
    if (this.updateCombo) {
      this.sigaServices
        .getParam(
          "combossjcs_comboidGuardias",
          "?idTurno=" + this.idTurno
        )
        .subscribe(
          n => {
            this.guardias = n.combooItems;
          },
          err => {

          }, () => {
            this.guardiasNombre = "";
            if (this.guardias != undefined) {
              this.guardias.forEach(element => {
                this.guardiasNombre += element.label + ","
              });
              this.guardiasNombre = this.guardiasNombre.substring(0, this.guardiasNombre.length - 1);
            }

            this.cargarTabla(this.guardias[0]);

            //this.inicio();
          }
        );
    }
  }

  cargarTabla(event) {

    var datosColaGuardia = {
      idGuardia: this.turnosItem.idcomboguardias,
      idTurno: this.idTurno
    };

    
    this.sigaServices.post("busquedaGuardias_getGuardia", datosColaGuardia).subscribe(
      n => {
        this.datos = JSON.parse(n.body);
        if(this.datos != null && this.datos!= undefined){
          this.body.idpersona_ultimo = JSON.parse(n.body).idPersonaUltimo;
        }
        this.sigaServices.notifysendDatosRedy(n);

       // this.obtieneConfiguracionCola(n.body);
      }
    );
    

    if (event.value != null) {
      this.turnosItem.idcomboguardias = event.value;
    }

    if (this.turnosItem.idcomboguardias != undefined) {
      this.inicio();
    } else {
      this.datos = [];
      this.primerLetrado = "";
      this.nombreApellidosPrimerLetrado = "";
      this.ultimoLetrado = "";
      this.apeyNombreUltimo = "";
    }

  }

  transformaFecha(fecha) {
    if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(fecha);
      }
    } else {
      fecha = undefined;
    }

    return fecha;
  }
  fillFechaDesdeCalendar(event) {
    this.turnosItem.fechaActual = this.transformaFecha(event);
    this.getColaGuardia();
  }
  setItalic(dato) {
    if (dato.fechabajaguardia == null) return false;
    else return true;
  }
  searchHistorical() {
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.getColaGuardia();
    this.selectAll = false
  }
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  transformDate(fecha) {
    this.body.letradosIns = this.datepipe.transform(new Date(fecha), 'dd/MM/yyyy');
  }

  getColaGuardia() {
    if (this.body.letradosIns instanceof Date) // Se comprueba si es una fecha por si es necesario cambiar el formato.
      this.transformDate(this.body.letradosIns); // Si no es una fecha es que ya está formateada porque viene del back.
    this.progressSpinner = true;

    this.sigaServices.post(
      "busquedaGuardias_getColaGuardia", this.body).subscribe(
        data => {
          this.datos = JSON.parse(data.body).inscripcionesItem;
          this.datos = this.datos.map(it => {
            it.nombreApe = it.apellido1 + " " + it.apellido2 + " " + it.nombre;
            return it;
          });
          this.transformData();
          this.getSaltosYCompensaciones();
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          if (this.datos && this.datos.length > 0){


            this.primerLetrado = this.datos[0].nColegiado;
            this.nombreApellidosPrimerLetrado = this.datos[0].nombreApe; 
            if(this.body.idpersona_ultimo != null && this.body.idpersona_ultimo != undefined && this.body.idpersona_ultimo != ""){
              this.ultimoLetrado = this.datos[this.datos.length - 1].nColegiado;
              this.apeyNombreUltimo = this.datos[this.datos.length - 1].nombreApe;
            }else{
              this.ultimoLetrado = "";
              this.apeyNombreUltimo = "";
            }
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
      if (this.ordenacionManual == false){

        if (this.tablaOrder != null) {
          this.tablaOrder.toSlice = 5;
        }
        
        objArr.cells = [

          { type: 'text', value: datoObj.ordenCola },
          { type: 'text', value: datoObj.nColegiado },
          { type: 'text', value: datoObj.apellido1 + ' ' + datoObj.apellido2 + ', ' + datoObj.nombre},
          { type: 'text', value: datoObj.fechaValidacion },
          { type: 'text', value: datoObj.fechaBaja },
          { type: 'invisible', value: datoObj.idGrupoGuardiaColegiado},
          { type: 'invisible', value: datoObj.ordenCola },
          { type: 'invisible', value: datoObj.idturno },
          { type: 'invisible', value: datoObj.idGuardia },
          { type: 'invisible', value: datoObj.orden },
          { type: 'invisible', value: datoObj.fechaSuscripcion },
          { type: 'invisible', value: datoObj.idGrupoGuardia },
          { type: 'invisible', value: datoObj.idPersona },
          { type: 'invisible', value: datoObj.ultimoCola }
          
        ];
      } else {

        if (this.tablaOrder != null) {
          this.tablaOrder.toSlice = 6;
        }

        objArr.cells = [
         
          { type: 'input', value: nG },
          { type: 'position', value: datoObj.orden },
          { type: 'text', value: datoObj.nColegiado },
          { type: 'text', value: datoObj.apellido1 + ' ' + datoObj.apellido2 + ', ' + datoObj.nombre},
          { type: 'text', value: datoObj.fechaValidacion },
          { type: 'text', value: datoObj.fechaBaja },
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

  checkSelectedRow(selected){
    this.selectedRow = selected;
  }

  newMateria() {
    this.nuevo = true;
    this.seleccion = false;
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
    this.tableComp.sortOrder = 0;
    this.tableComp.sortField = '';
    this.tableComp.reset();
    this.tableSaltos.sortOrder = 0;
    this.tableSaltos.sortField = '';
    this.tableSaltos.reset();
    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let materia = {
      nombreMateria: "",
      contenido: "",
      jurisdicciones: "",
      jurisdiccion: "",
      idArea: this.idTurno,
      areaNueva: true
    };

    if (this.datos.length == 0) {
      this.datos.push(materia);
    } else {
      this.datos = [materia, ...this.datos];
    }

  }

  validateArea(e) {

    if (!this.nuevo) {
      let datoId = this.datos.findIndex(item => item.idMateria === this.selectedDatos[0].idMateria);

      let findDato = this.datos.filter(item => this.upperCasePipe.transform(item.nombreMateria) === this.upperCasePipe.transform(e.srcElement.value.trim()));

      if (findDato.length > 1) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.censo.nombreExiste"));
        this.progressSpinner = false;
        this.datos[datoId].nombreMateria = this.selectedDatos[0].nombreMateria;
      } else {
        let dato = this.datos[datoId];
        // this.editarMateria(dato);
      }

      // this.seleccion = false;
    }
  }

  editAreas(evento) {

    if (this.nuevo) {
      this.seleccion = false;
    } else {

      if (!this.selectAll && !this.selectMultiple) {

        this.datos.forEach(element => {
          element.editable = false;
          element.overlayVisible = false;
        });

        evento.data.editable = true;

        this.selectedDatos = [];
        this.selectedDatos.push(evento.data);

        this.seleccion = true;

      }

    }
  }

  editarMateria(dato) {

    let findDato = this.datosInicial.find(item => item.idMateria == dato.idMateria && item.idArea == dato.idArea);

    if (findDato != undefined) {
      if ((dato.nombreMateria != findDato.nombreMateria) || (dato.contenido != findDato.contenido)) {

        let findUpdate = this.updateAreas.find(item => item.idMateria == dato.idMateria && item.idArea == dato.idArea);

        if (findUpdate == undefined) {
          let dato2 = dato;
          dato2.jurisdicciones = "";
          this.updateAreas.push(dato2);
        }
      }
    }

  }

  editJurisdicciones(dato) {

    if (!this.nuevo) {

      // if (dato.jurisdicciones.length == 0) {
      //   this.showMessage("info", "Informacion", "Debe seleccionar al menos un partido judicial");
      //   let findUpdate = this.updateZonas.findIndex(item => item.idArea === dato.idArea && item.idMateria === dato.idMateria);

      //   if (findUpdate != undefined) {
      //     this.updateZonas.splice(findUpdate);
      //   }

      // } else {
      let findUpdate = this.updateAreas.find(item => item.idArea === dato.idArea && item.idMateria === dato.idMateria);

      if (findUpdate == undefined) {
        let dato2 = dato;
        let jurisdiccionesString = "";
        for (let i in dato2.jurisdiccionesReal) {
          jurisdiccionesString += ";" + dato2.jurisdiccionesReal[i].value;
        }

        dato2.jurisdiccion = jurisdiccionesString.substring(1, jurisdiccionesString.length);
        dato2.jurisdicciones = "";
        this.updateAreas.push(dato2);
      } else {
        let updateFind = this.updateAreas.findIndex(item => item.idArea === dato.idArea && item.idMateria === dato.idMateria);
        let jurisdiccionesString = "";
        for (let i in findUpdate.jurisdiccionesReal) {
          jurisdiccionesString += ";" + dato.jurisdiccionesReal[i].value;
        }
        this.updateAreas[updateFind].jurisdiccionesReal = dato.jurisdiccionesReal;
        this.updateAreas[updateFind].jurisdiccion = jurisdiccionesString.substring(1, jurisdiccionesString.length);
        this.updateAreas[updateFind].jurisdicciones = "";
      }
      // }
    } else {
      this.selectedDatos = [];
    }
  }

  delete(selectedDatos) {
    this.body = new TurnosObject();
    this.body.turnosItem = this.selectedDatos;
    this.body.turnosItem.forEach(element => {
      element.idcomboguardias = this.turnosItem.idcomboguardias;
    });
    this.sigaServices.post("turnos_eliminateColaGuardia", this.body).subscribe(
      data => {

        this.nuevo = false;
        this.selectedDatos = [];
        this.getColaGuardia();
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {//areasmaterias.materias.ficha.materiaEnUso

        if (err != undefined && JSON.parse(err.error).error.description != "") {
          if (JSON.parse(err.error).error.description == "areasmaterias.materias.ficha.materiaEnUso") {
            this.showMessage("warn", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          }
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.selectAll = false;
      }
    );
  }

  rest(rest) {
    if (rest) {
      if (this.datosInicial && this.datos) {
        this.datos = JSON.parse(JSON.stringify(this.datosInicial));
        this.transformData();

        this.updateInscripciones = [];
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
      if (!this.body.porGrupos && this.ordenacionManual) {
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

      this.sigaServices.post(
        "gestionGuardias_guardarCola", this.updateInscripciones).subscribe(
          data => {
            this.getColaGuardia();
            this.updateInscripciones = [];
            this.progressSpinner = false;
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          },
          err => {

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

  updateColaGuardia(event){
 
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
        ultimoCola : ""
      };
      
      if (this.ordenacionManual == true){
        let ordenCola = rg.cells[1];
        let grupo = rg.cells[0];
        let numCol = rg.cells[2];
        let idGGC = rg.cells[6];
        
        this.datos.forEach((dat, pos) => {
          
          if (dat.nColegiado == numCol.value && dat.idGrupoGuardiaColegiado == idGGC.value){
              datCopy = Object.assign({},dat);
              datCopy.orden = this.rowGroupModified[pos].cells[1].value;
              if (ordenCola.value != null){
              datCopy.ordenCola = ordenCola.value.toString();
              }else{
                datCopy.ordenCola = null;
                datCopy.orden = null;
                
              }
          
          }
        });
        if (grupo != null){
          datCopy.numeroGrupo = grupo.value;
          }else{
            datCopy.numeroGrupo = null;
          }

          if(datCopy.nColegiado == this.ultimoLetrado){
            datCopy.ultimoCola = "1";
          }else{
              datCopy.ultimoCola  = null;
            }
      }else{
        let ordenCola = rg.cells[0];
        let numCol = rg.cells[1];
        
        this.datos.forEach((dat, pos) => {
          
          if (dat.nColegiado == numCol.value ){ //&& dat.idGrupoGuardiaColegiado == idGGC.value){
              datCopy = Object.assign({},dat);
              datCopy.orden = this.rowGroupModified[pos].cells[0].value;
              if (ordenCola.value != null){
              datCopy.ordenCola = ordenCola.value.toString();
              }else{
                datCopy.ordenCola = null;
                datCopy.orden = null;
              }
          }
        });
        
        if(datCopy.nColegiado == this.ultimoLetrado){
            datCopy.ultimoCola = "1";
          }else{
              datCopy.ultimoCola  = null;
            }
        }
        
      datosModif.push(datCopy);
    })
    let colaGuardiaUpdated = { "inscripcionesItem": datosModif };
    this.setColaGuardia(colaGuardiaUpdated);
  }

  colaGuardiaOrdenada(event){
    
    let datosModif = [];
    let ultimo:boolean = false;
    this.rowGroupModified = event;

    //comprobamos si se ha pulsado marcar ultimo
    this.rowGroupModified.forEach(rg => {
      let totalCeldas = rg.cells.length;
      if(rg.cells[totalCeldas-1].value == "1"){
        ultimo = true;
      }
    });
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
      if (this.ordenacionManual == true){
        datCopy.apellido1 = rg.cells[3].value.split(",")[0];
        datCopy.apellido2 = rg.cells[3].value.split(",")[1];
        if (rg.cells[11] != undefined)
          datCopy.fechaSuscripcion = rg.cells[11].value;
        datCopy.fechaValidacion = rg.cells[4].value;
        datCopy.fechabaja = rg.cells[5].value;
        if (rg.cells[14] != undefined)
          datCopy.idGrupoGuardia = rg.cells[14].value;
        datCopy.idGrupoGuardiaColegiado = rg.cells[6].value;
        datCopy.idGuardia = rg.cells[9].value;
        if (rg.cells[13] != undefined)
          datCopy.idPersona = rg.cells[13].value;
        datCopy.idTurno = rg.cells[8].value;
        datCopy.nColegiado = rg.cells[2].value;
        datCopy.nombre = rg.cells[3].value.split(",")[2];
        datCopy.nombreApe = rg.cells[3].value;
        datCopy.numeroGrupo = rg.cells[0].value;
        datCopy.orden = rg.cells[1].value;
        datCopy.ordenCola = rg.cells[7].value;
        datCopy.ultimoCola = rg.cells[15].value;

        if(!ultimo && datCopy.nColegiado == this.ultimoLetrado){
          datCopy.ultimoCola = "1";
        }
      }else{
        datCopy.apellido1 = rg.cells[2].value.split(",")[0];
        datCopy.apellido2 = rg.cells[2].value.split(",")[1];
        if (rg.cells[10] != undefined)
          datCopy.fechaSuscripcion = rg.cells[10].value;
        datCopy.fechaValidacion = rg.cells[3].value;
        datCopy.fechabaja = rg.cells[4].value;
        if (rg.cells[11] != undefined)
          datCopy.idGrupoGuardia = rg.cells[11].value;
        datCopy.idGrupoGuardiaColegiado = rg.cells[5].value;
        datCopy.idGuardia = rg.cells[8].value;
        if (rg.cells[12] != undefined)
          datCopy.idPersona = rg.cells[12].value;
        datCopy.idTurno = rg.cells[7].value;
        datCopy.nColegiado = rg.cells[1].value;
        datCopy.nombre = rg.cells[2].value.split(",")[2];
        datCopy.nombreApe = rg.cells[2].value;
        datCopy.orden = rg.cells[9].value;
        datCopy.ordenCola = rg.cells[6].value;
        datCopy.ultimoCola = rg.cells[13].value;

        if(!ultimo){
          if(datCopy.nColegiado == this.ultimoLetrado){
            datCopy.ultimoCola = "1";
          }else{
            datCopy.ultimoCola = undefined;
          }
        }
      }
      
      datosModif.push(datCopy);
    });
    
    let colaGuardiaUpdated = {"inscripcionesItem": datosModif};
    this.setColaGuardia(colaGuardiaUpdated);
  }

  setColaGuardia(colaGuardiaModificado){
    this.progressSpinner = true;
    let colaGuardiaModificadoSt = JSON.parse(JSON.stringify(colaGuardiaModificado));
    this.sigaServices.post(
      "busquedaGuardias_updateColaGuardia", colaGuardiaModificadoSt).subscribe(
        data => {
          this.getColaGuardia();
          this.progressSpinner = false;
        }, err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        });
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  getCols() {
    if (this.ordenacionManual == false) {
      this.cols = [
        { field: "orden", header: "administracion.informes.literal.orden", width: "15%" },
        { field: "numerocolegiado", header: "censo.busquedaClientesAvanzada.literal.nCol", width: "15%" },
        { field: "nombreguardia", header: "administracion.parametrosGenerales.literal.nombre.apellidos.coma", width: "30%" },
        { field: "fechavalidacion", header: "justiciaGratuita.oficio.turnos.fechavalidacion", width: "22%" },
        { field: "fechabajaguardia", header: "justiciaGratuita.oficio.turnos.fechaBaja", width: "20%" },
      ];

      this.cabeceras = [
        {
          id: "orden",
          name: "dato.jgr.guardia.guardias.ordenCola"
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
    } else {
      this.cols = [
        { field: "orden", header: "administracion.informes.literal.orden", width: "15%" },
        { field: "numerocolegiado", header: "censo.busquedaClientesAvanzada.literal.nCol", width: "15%" },
        { field: "nombreguardia", header: "administracion.parametrosGenerales.literal.nombre.apellidos.coma", width: "30%" },
        { field: "fechavalidacion", header: "justiciaGratuita.oficio.turnos.fechavalidacion", width: "22%" },
        { field: "fechabajaguardia", header: "justiciaGratuita.oficio.turnos.fechaBaja", width: "20%" },
      ];

      this.cabeceras = [
        {
          id: "grupo",
          name: "dato.jgr.guardia.guardias.grupo"
        },
        {
          id: "orden",
          name: "dato.jgr.guardia.guardias.ordenCola"
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
    }

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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }


  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabajaguardia != undefined && dato.fechabajaguardia != null);
      } else {
        this.selectedDatos = this.datos;
      }
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }
  editElementDisabled() {
    this.datos.forEach(element => {
      element.editable = false
      element.overlayVisible = false;
    });
  }
  isSelectMultiple() {
    if (!this.disableAll) {
      this.selectAll = false;
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "single";
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "multiple";

      }
    }
  }
  openTab(evento) {
    if (!this.selectAll && !this.selectMultiple) {
      // this.progressSpinner = true;
      this.persistenceService.setDatos(evento.data);
      // this.router.navigate(["/gestionTurnos"], { queryParams: { idturno: evento.data.idturno } });
    } else {

      if (evento.data.fechabajaguardia == undefined && this.historico) {
        this.selectedDatos.pop();
      }

    }

    var datosColaGuardia = {
      idGuardia: this.turnosItem.idcomboguardias,
      idTurno: this.idTurno
    };

    this.persistenceService.setDatos(datosColaGuardia);

    this.inicio();
  }

  obtieneConfiguracionCola(guardia) {
    this.ordenacionManual = false;

    this.sigaServices
        .getParam("combossjcs_ordenCola", "?idordenacioncolas=" + this.body.idOrdenacionColas)
        .subscribe(
          n => {
            n.colaOrden.forEach(element => {
              if (element.por_filas != "ALFABETICOAPELLIDOS" && element.por_filas != "ANTIGUEDADCOLA" &&
                  element.por_filas != "NUMEROCOLEGIADO" && element.por_filas != "FECHANACIMIENTO" && element.numero > 0) {
                    
                  setTimeout(() => {
                    this.ordenacionManual = true;
                  }, 200);
              }
            });
          },
          err => {},
          () => {
            this.configuracionCola = {
              'manual': this.ordenacionManual,
              'porGrupos': JSON.parse(guardia).porGrupos,
              'idConjuntoGuardia': 0,
              "fromCombo": false,
              "minimoLetradosCola": JSON.parse(guardia).letradosGuardia
            };
            this.globalGuardiasService.emitConf(this.configuracionCola);
          }
        );
  }

  actualizaSeleccionados(selectedDatos) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
    }
  }
  
  clear() {
    this.msgs = [];
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
  /* abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  } */
  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (
      key == "colaGuardias" &&
      !this.modoEdicion
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.modoEdicion) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if(this.openFicha){
      this.opened.emit(this.openFicha);
      this.idOpened.emit(key);
    }    
  }

  saltoCompensacion(){
    this.progressSpinner = true;
    this.persistenceService.setDatos(this.selectedDatos[0]);
    sessionStorage.setItem("fromTurnoOficio", "true")
    this.router.navigate(["/guardiasSaltosCompensaciones"], { queryParams: { idturno: this.selectedDatos[0].idturno, idguardia: this.selectedDatos[0].idguardias, 'idpersona': this.selectedDatos[0].idpersona, 'numerocolegiado': this.selectedDatos[0].numerocolegiado, 'letrado': `${this.selectedDatos[0].alfabeticoapellidos}, ${this.selectedDatos[0].nombreguardia}` } });
  } 

  openMultiSelect(dato) {
    // //console.log(this.multiSelect);
    dato.onPanelShow;
    // this.multiSelect.show();
    // dato.overlayVisible = true;
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  confirmUltimo() {
    let mess = this.translateService.instant(
      "justiciaGratuita.oficio.turnos.messageultletrado"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: "confirmDialogColaOficio",
      message: mess,
      icon: icon,
      accept: () => {
        this.marcarUltimo();
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  marcarUltimo() {
    this.progressSpinner=true;

    let dato = new TurnosItems();
    dato = this.selectedDatos[0];
    dato.idguardias=this.turnosItem.idcomboguardias;

    this.sigaServices.post("turnos_updateUltimoGuardias", dato).subscribe(
      data => {

        var ultimaPosicion = this.datos[this.datos.length - 1];
        this.datos[this.datos.length - 1] = this.selectedDatos[0];
        this.selectedDatos[0] = ultimaPosicion;
        this.nuevo = false;
        this.selectedDatos = [];
        this.selectAll = false;

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        
        this.progressSpinner = false;
        this.getColaGuardia();
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          if (JSON.parse(err.error).error.description == "areasmaterias.materias.ficha.materiaEnUso") {
            this.showMessage("warn", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          }
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      }
    );
  }

  goToSaltosYComp() {
    this.router.navigate(["/saltosYCompensaciones"], { queryParams: { idturno: this.idTurno } });
  }

  getSaltosYCompensaciones() {
    let filtrosModificados: SaltoCompItem;
    filtrosModificados = new SaltoCompItem();
    filtrosModificados.idTurno = this.body.idTurno;
    filtrosModificados.idGuardia = this.body.idGuardia;

    this.sigaServices.postPaginado("saltosCompensacionesGuardia_buscar", "?numPagina=1", filtrosModificados).subscribe(
      n => {
        let datosSaltosYComp: SaltoCompItem[] = JSON.parse(n.body).saltosCompItems.filter(item => item.fechaUso === null);
        this.datosSaltos = datosSaltosYComp.filter(datos => datos.saltoCompensacion === 'S');
        this.datosCompensaciones = datosSaltosYComp.filter(datos => datos.saltoCompensacion === 'C');
        let error = JSON.parse(n.body).error;
      });
  }
}
