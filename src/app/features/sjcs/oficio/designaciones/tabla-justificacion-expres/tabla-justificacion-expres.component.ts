import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { Cell, Row, RowGroup, TablaResultadoDesplegableJEService } from '../../../../../commons/tabla-resultado-desplegable/tabla-resultado-desplegable-je.service';
import { TranslateService } from '../../../../../commons/translate';
import { ParametroDto } from '../../../../../models/ParametroDto';
import { ParametroRequestDto } from '../../../../../models/ParametroRequestDto';
import { JustificacionExpressItem } from '../../../../../models/sjcs/JustificacionExpressItem';
import { ModulosItem } from '../../../../../models/sjcs/ModulosItem';
import { procesos_ejg } from '../../../../../permisos/procesos_ejg';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-tabla-justificacion-expres',
  templateUrl: './tabla-justificacion-expres.component.html',
  styleUrls: ['./tabla-justificacion-expres.component.scss']
})

export class TablaJustificacionExpresComponent implements OnInit {

  progressSpinner: boolean = false;
  seleccionarTodo: boolean = false;
  dataReady = false;
  @Input() datosJustificacion;
  @Input() colegiado;
  @Input() isLetrado;
  @Input() permisosFichaAct;
  permisosEJG = false;
  fechaFiltro;
  totalRegistros = 0;
  
  datosJustificacionAux: JustificacionExpressItem = new JustificacionExpressItem();

  rutas = ['SJCS', 'Designaciones'];
  msgs: Message[] = [];
  rowGroups: RowGroup[];
  rowGroupsAux: RowGroup[];
  numDesignas = 0;
  totalDesignas = 0;
  totalActuaciones = 0;
  modoBusqueda: string = 'b';
  numDesignasModificadas = 0;
  numActuacionesModificadas = 0;
  from = 0;
  to = 10;
  numperPage = 10;
  complementoModulo;

  cabeceras = [
    {
      id: "anio",
      name: "Designación",
      size: 200
    },
    {
      id: 'ejgs',
      name: "EJGs",
      size: 200
    },
    {
      id: 'clientes',
      name: 'Interesados',
      size: 400
    },
    {
      id: 'finalizado',
      name: 'Fin.',
      size: 120
    },
    {
      id: 'juzgado',
      name: 'Juzgado',
      size: 400
    },
    {
      id: 'nig',
      name: 'NIG',
      size: 200
    },
    {
      id: 'nproced',
      name: 'Nº Proc',
      size: 200
    },
    {
      id: "modulo",
      name: "Módulo",
      size: 400
    },
    {
      id: "actuacion",
      name: "F. Actuación",
      size: 200
    },
    {
      id: "justificacion",
      name: "Justificación",
      size: 200
    },
    {
      id: "acreditacion",
      name: "Acreditación",
      size: 200
    },
    {
      id: "validar",
      name: "Valid",
      size: 80
    }
  ];
  
  comboModulos: any [];
  comboJuzgados: any [];
  comboAcreditacionesPorModulo: any [];
  comboJuzgadosPorInstitucion: any [];
  idInstitucion: String;
  actuacionesToDelete = [];
  actuacionToAdd: Row;
  dataToUpdate: RowGroup[];
  actuacionesItem = {};
  arrNuevo = [];
  @Output() actuacionesToDleteArrEmit = new EventEmitter<any[]>(); // para enviar a backend - ELIMINAR
  @Output() newActuacionItemEmit = new EventEmitter<{}>();// para enviar a backend -  NUEVO
  @Output() dataToUpdateArrEmit = new EventEmitter<any[]>(); // para enviar a backend -  GUARDAR

  actuacionesToDleteArr = []; // para enviar a backend - ELIMINAR
  newActuacionItem = {}; // para enviar a backend -  NUEVO
  dataToUpdateArr = []; // para enviar a backend -  GUARDAR
  permisoEscritura;
  justActivarDesigLetrado: string = "0"; // Permiso para editar designaciones
  noInsertarMasActuaciones: boolean = false;

  constructor(private trdService: TablaResultadoDesplegableJEService, private datepipe: DatePipe,
    private commonsService: CommonsService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
		private router: Router,
    private translateService: TranslateService,) 
  { }

  async ngOnInit(): Promise<void> {
    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify([]));
    this.progressSpinner=true;

    this.datosJustificacionAux = this.datosJustificacion;

    // Cargamos la fecha de justificación
    this.fechaFiltro = this.formatDate(new Date());
    await this.getJuzgados();
    await this.getParams("JUSTIFICACION_EDITAR_DESIGNA_LETRADOS");

    this.sigaServices.get("combo_comboModulos").subscribe(
      async n => {
        this.comboModulos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboModulos);
        await this.cargaInicial();
        this.progressSpinner = false;
       
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );

    this.checkPermisos();
    this.checkAccesoFichaActuacion();
    this.checkAccesoEJG();
  }

  getParams(param){
    let parametro = new ParametroRequestDto();
    let institucionActual;
    return this.sigaServices.get("institucionActual").toPromise().then(n => {
      institucionActual = n.value;
      parametro.idInstitucion = institucionActual;
      parametro.modulo = "SCS";
      parametro.parametrosGenerales = param;
      return this.sigaServices
          .postPaginado("parametros_search", "?numPagina=1", parametro)
          .toPromise().then(
            data => {
              let searchParametros = JSON.parse(data["body"]);
              let datosBuscar = searchParametros.parametrosItems;
              datosBuscar.forEach(element => {
                if (element.parametro == param && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)) {
                  const valorParametro = element.valor;
                  if (param == "JUSTIFICACION_EDITAR_DESIGNA_LETRADOS"){
                    this.justActivarDesigLetrado = valorParametro;
                }
            }
        });
      });
    });
  }

  checkAccesoFichaActuacion() {
    this.commonsService.checkAcceso(procesos_oficio.designasActuaciones)
      .then(respuesta => {
        if (respuesta != undefined) {
          this.permisosFichaAct = true;
        }
      }
      ).catch(error => console.error(error));

  }

  checkAccesoEJG() {
    this.commonsService.checkAcceso(procesos_ejg.ejg)
      .then(respuesta => {
        if (respuesta != undefined) {
          this.permisosEJG = true;
        }
      }
      ).catch(error => console.error(error));

  }

  checkPermisos(){
    this.commonsService.checkAcceso(procesos_oficio.je)
      .then(respuesta => {
        this.permisoEscritura = respuesta;
        //console.log('JE  this.permisoEscritura: ',  this.permisoEscritura)
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
  }
  /*loadJuzgados(event){
    if (event == true){
      this.getJuzgados();
    }
  }*/
  async getJuzgados(){
    this.progressSpinner = true;

    return this.sigaServices.post("combo_comboJuzgadoDesignaciones",'0').toPromise().then(
      n => {
        this.comboJuzgados = JSON.parse(n.body).combooItems;
        this.commonsService.arregloTildesCombo(this.comboJuzgados);
        this.progressSpinner = false;
        //this.cargaModulosPorJuzgado(this.comboJuzgados[0].value);
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  cargaAcreditacionesPorModulo($event){
    this.progressSpinner = true;

    return this.sigaServices.getParam("combo_comboAcreditacionesPorModulo", `?idModulo=${$event[0]}&idTurno=${$event[1]}`).toPromise().then(
      n => {
        this.comboAcreditacionesPorModulo = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboAcreditacionesPorModulo);
        this.progressSpinner = false;
        
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  getAcreditacionesPorModulo($event){
    return this.sigaServices.getParam("combo_comboAcreditacionesPorModulo", `?idModulo=${$event[0]}&idTurno=${$event[1]}`).toPromise().then(
      n => { return Promise.resolve(n.combooItems); },
      err => { return Promise.resolve([]); }
    );
  }

  cargaModulosPorJuzgado($event){
    this.progressSpinner = true;
    this.sigaServices.getParam("combo_comboModulosConJuzgado", "?idJuzgado="+$event).subscribe(
      n => {
        this.comboModulos = JSON.parse(n.body).combooItems;
        this.commonsService.arregloTildesCombo(this.comboModulos);
        this.cargaAcreditacionesPorModulo(this.comboModulos[0].value); //mal
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  cargaAllModulos(event){
    if (event){
      this.progressSpinner = true;
      this.sigaServices.get("combo_comboModulos").subscribe(
        n => {
          this.comboModulos = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboModulos);
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }
      );
    }
  }

  cargaJuzgadosPorInstitucion($event){
    this.progressSpinner = true;
    this.sigaServices.post("combo_comboJuzgadoPorInstitucion", $event).subscribe(
      n => {
        this.comboJuzgadosPorInstitucion = JSON.parse(n.body).combooItems;
        this.commonsService.arregloTildesCombo(this.comboJuzgadosPorInstitucion);
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  async cargaInicial(){
    //console.log('datosJustificacion', this.datosJustificacion)
    this.progressSpinner=true;
    this.dataReady = false;
    let resultModified = {};
    let data = [];
    let dataObj = {};
    let expedientes = "";
    let estados = "";
    let listaCliente = "";
    let listaClienteAct = "";
    let arr1 = [];
    let obj1 = {};
    let validada;
    let finalizada;
    //console.log('this.datosJustificacion: ', this.datosJustificacion)

    const datosJustificacionArray = this.datosJustificacion.map((designacion, i) => ({designacion, i}));
    for (const {designacion, i} of datosJustificacionArray) {
      
      let letra = (i + 10).toString(36).toUpperCase()
      let arr2 = [];
      let cod = designacion.codigoDesignacion + '\n' + "("+this.formatDate(designacion.fechaDesignacion)+")";
      let estadoDesignacion = designacion.estado;
     
      this.complementoModulo = '';
      if (designacion.idProcedimiento != null) {
        this.getComplementoProcedimiento(designacion.idProcedimiento);
      }
      
      arr1 = [];
      obj1 = {};
      
      /* if ( estadoDesignacion == 'V'){
        validada = true; // activa
        finalizada = false;
      }else if ( estadoDesignacion == 'F'){
        finalizada = true; // finalizada
        validada = false;
      } else {
        finalizada = false; 
        validada = false;
      } */

      let numActuacionesValidas = 0;
      if(designacion.actuaciones != undefined || designacion.actuaciones != null){

        designacion.actuaciones.forEach(actuacion => {
          if ( actuacion.validada == "1"){
            numActuacionesValidas++;
          } 
        });
  
        if(numActuacionesValidas == designacion.actuaciones.length){
          validada = true;
        }else{
          validada = false;
        }
      }else{
        validada = false
      }
      
      

      if ( estadoDesignacion == 'V'){
        finalizada = false;
      }else if ( estadoDesignacion == 'F'){
        finalizada = true; // finalizada
      } else {
        finalizada = false;
      }

      if (designacion.expedientes != null){
      /*designacion.expedientes.forEach(exp =>{
       // expedientes += '\n' + exp;
       expedientes +=  exp + '\n';
       })*/
       
        expedientes = Object.keys(designacion.expedientes)[0];
        estados = Object.values(designacion.expedientes)[0].toString();
      }else{
        expedientes = "";
      }
      let listaClienteType = 'text';
      let listaClienteCombo = null;
      if (designacion.nombreJuzgado != null && designacion.nombreJuzgado != ""){
        /*designacion.nombreJuzgado.forEach(cliente =>{
         listaCliente +=  cliente + '\n';
         })*/
        listaCliente = designacion.nombreJuzgado;
        listaClienteType = 'text';
        listaClienteCombo = null;
      }else{
        listaCliente = designacion.nombreJuzgado;
        listaClienteType = 'select';
        listaClienteCombo = this.comboJuzgados;
      }
      
      let id2 = expedientes;
      let estadoEx = estados;
      let id3 = designacion.cliente;
      let resolucionDesignacion = designacion.resolucionDesignacion;

      let moduleSelector =
      {
        nombre: designacion.procedimiento,
        opciones: [
          { label: designacion.procedimiento, value: designacion.procedimiento }
        ]
      };
      let numProcType = 'input';
      let nigType = 'input';
      let moduloType = "select";
      let moduloValue = "";
      let moduloCombo = [];
      if((this.isLetrado && this.justActivarDesigLetrado != "1") || finalizada){
        numProcType = 'text';
        nigType = 'text';
        moduloType = 'tooltip';
        moduloValue = designacion.categoriaProcedimiento;
        moduloCombo = designacion.procedimiento;
        
      }else{
        numProcType = 'input';
        nigType = 'input';
        moduloType = 'select';
        moduloValue = designacion.idProcedimiento;
        moduloCombo = this.comboModulos;
      }

      
      let juzgadoType;
      let juzgadoValue;
      let juzgadoCombo;

      if ((this.isLetrado && this.justActivarDesigLetrado != "1") || finalizada) {
        juzgadoType = "tooltip";
        juzgadoValue = designacion.categoriaJuzgado;
        juzgadoCombo = designacion.nombreJuzgado;
      } else {
        juzgadoType = "select";
        juzgadoValue = designacion.idJuzgado;
        juzgadoCombo = this.comboJuzgados;
      }

      let numJuzType = 'multiselect1';

      let arrDesignacion = [];
      if (!this.colegiado){
      arrDesignacion = 
      [
      { type: 'checkboxPermisos', value: [finalizada, ""], size: 120, combo: finalizada},
      //{ type: listaClienteType, value: listaCliente, size: 400, combo: listaClienteCombo },
      { type: juzgadoType, value: juzgadoValue, size: 400 , combo: juzgadoCombo }, //moduloç
      //{ type: numJuzType, value: designacion.idJuzgado, size: 200 , combo: null},
      { type: nigType, value: designacion.nig, size: 200, combo: null},
      { type: numProcType, value: designacion.numProcedimiento, size: 200 , combo: null},
      { type: moduloType, value: moduloValue, size: 400 , combo: moduloCombo }, //moduloç
     
     // { type: juzgadoType, value: juzgadoValue, size: 400 , combo: juzgadoCombo }, //moduloç
      { type: 'invisible', value: this.formatDate(designacion.fechaActuacion), size: 200 , combo: null},
      { type: 'invisible', value: '' , size: 200, combo: null},
      { type: 'invisible', value: designacion.tipoAcreditacion , size: 200, combo: null},
      { type: 'invisible', value: validada, size: 80 , combo: null},
      { type: 'invisible', value: this.formatDate(designacion.fechaDesignacion) , size: 200, combo: null},
      { type: 'invisible', value: designacion.anioDesignacion , size: 0, combo: null},
      { type: 'invisible', value: designacion.anioProcedimiento , size: 0, combo: null},
      { type: 'invisible', value: designacion.art27 , size: 0, combo: null},
      { type: 'invisible', value: designacion.idInstitucion , size: 0, combo: null},
      { type: 'invisible', value: designacion.idInstitucionJuzgado , size: 0, combo: null},
      { type: 'invisible', value: designacion.idJuzgado , size: 0, combo: null},
      { type: 'invisible', value: designacion.idPersona , size: 0, combo: null},
      { type: 'invisible', value: designacion.idTurno , size: 0, combo: null},
      { type: 'invisible', value: designacion.muestraPendiente , size: 0, combo: null},
      { type: 'invisible', value: designacion.numDesignacion , size: 0, combo: null},
      { type: 'invisible', value: designacion.resolucionDesignacion , size: 0, combo: null},
      { type: 'invisible', value: designacion.idProcedimiento , size: 0, combo: null},
      { type: 'invisible', value: designacion.fechaJustificacion , size: 0, combo: null},
      { type: 'invisible', value: designacion.ejgs , size: 0, combo: null},
      { type: 'invisible', value: designacion.designacionHasta , size: 0, combo: null},
      { type: 'invisible', value: designacion.designacionDesde , size: 0, combo: null},
      { type: 'invisible', value: designacion.resolucionPTECAJG , size: 0, combo: null},
      { type: 'invisible', value: designacion.ejgSinResolucion , size: 0, combo: null},
      { type: 'invisible', value: designacion.conEJGNoFavorables , size: 0, combo: null},
      { type: 'invisible', value: designacion.sinEJG , size: 0, combo: null},
      { type: 'invisible', value: designacion.actuacionesValidadas , size: 0, combo: null},
      { type: 'invisible', value: designacion.justificacionHasta , size: 0, combo: null},
      { type: 'invisible', value: designacion.justificacionDesde , size: 0, combo: null},
      { type: 'invisible', value: designacion.restriccionesVisualizacion , size: 0, combo: null},
      { type: 'invisible', value: designacion.numEJG , size: 0, combo: null},
      { type: 'invisible', value: designacion.anioEJG , size: 0, combo: null},
      { type: 'invisible', value: designacion.apellidos , size: 0, combo: null},
      { type: 'invisible', value: designacion.nombre , size: 0, combo: null},
      { type: 'invisible', value: designacion.nColegiado , size: 0, combo: null},
      { type: 'invisible', value: designacion.validarjustificaciones , size: 0, combo: null},
      { type: 'invisible', value: designacion.letradoActuaciones , size: 0, combo: null}
    ];
  }else{
    arrDesignacion = 
    [
    { type: 'checkboxPermisos', value: [finalizada, ""], size: 120, combo: null},
    { type: juzgadoType, value: juzgadoValue, size: 400, combo: juzgadoCombo },
    { type: nigType, value: designacion.nig, size: 200, combo: null},
    { type: numProcType, value: designacion.numProcedimiento, size: 200 , combo: null},
    { type: moduloType, value: moduloValue, size: 400 , combo: moduloCombo }, //modulo
    { type: 'invisible', value: this.formatDate(designacion.fechaActuacion), size: 200 , combo: null},
    { type: 'invisible', value: '' , size: 200, combo: null},
    { type: 'invisible', value: designacion.tipoAcreditacion , size: 200, combo: null},
    { type: 'invisible', value: validada, size: 80 , combo: null},
    { type: 'invisible', value: this.formatDate(designacion.fechaDesignacion) , size: 200, combo: null},
    { type: 'invisible', value: designacion.anioDesignacion , size: 0, combo: null},
    { type: 'invisible', value: designacion.anioProcedimiento , size: 0, combo: null},
    { type: 'invisible', value: designacion.art27 , size: 0, combo: null},
    { type: 'invisible', value: designacion.idInstitucion , size: 0, combo: null},
    { type: 'invisible', value: designacion.idInstitucionJuzgado , size: 0, combo: null},
    { type: 'invisible', value: designacion.idJuzgado , size: 0, combo: null},
    { type: 'invisible', value: designacion.idPersona , size: 0, combo: null},
    { type: 'invisible', value: designacion.idTurno , size: 0, combo: null},
    { type: 'invisible', value: designacion.muestraPendiente , size: 0, combo: null},
    { type: 'invisible', value: designacion.numDesignacion , size: 0, combo: null},
    { type: 'invisible', value: designacion.resolucionDesignacion , size: 0, combo: null},
    { type: 'invisible', value: designacion.idProcedimiento , size: 0, combo: null},
    { type: 'invisible', value: designacion.fechaJustificacion , size: 0, combo: null},
    { type: 'invisible', value: designacion.ejgs , size: 0, combo: null},
    { type: 'invisible', value: designacion.designacionHasta , size: 0, combo: null},
    { type: 'invisible', value: designacion.designacionDesde , size: 0, combo: null},
    { type: 'invisible', value: designacion.resolucionPTECAJG , size: 0, combo: null},
    { type: 'invisible', value: designacion.ejgSinResolucion , size: 0, combo: null},
    { type: 'invisible', value: designacion.conEJGNoFavorables , size: 0, combo: null},
    { type: 'invisible', value: designacion.sinEJG , size: 0, combo: null},
    { type: 'invisible', value: designacion.actuacionesValidadas , size: 0, combo: null},
    { type: 'invisible', value: designacion.justificacionHasta , size: 0, combo: null},
    { type: 'invisible', value: designacion.justificacionDesde , size: 0, combo: null},
    { type: 'invisible', value: designacion.restriccionesVisualizacion , size: 0, combo: null},
    { type: 'invisible', value: designacion.numEJG , size: 0, combo: null},
    { type: 'invisible', value: designacion.anioEJG , size: 0, combo: null},
    { type: 'invisible', value: designacion.apellidos , size: 0, combo: null},
    { type: 'invisible', value: designacion.nombre , size: 0, combo: null},
    { type: 'invisible', value: designacion.nColegiado , size: 0, combo: null},
    { type: 'invisible', value: designacion.validarjustificaciones , size: 0, combo: null},
    { type: 'invisible', value: designacion.letradoActuaciones , size: 0, combo: null}
  ];
  }

    let key = letra + 1;
    obj1 =  { [key] : arrDesignacion, position: 'noCollapse'};
    arr2.push(Object.assign({},obj1));
    arrDesignacion = [];

    designacion.actuaciones.forEach((actuacion, index) =>{
      let acreditacionPorcentaje =actuacion.numAsunto + " - " + actuacion.descripcion + " " + actuacion.porcentaje + "%";
      let validaAct = false;
      let moduleSelector =
      {
        nombre: actuacion.procedimiento,
        opciones: [
          { label: actuacion.procedimiento, value: actuacion.procedimiento }
        ]
      };
        if (actuacion.validada == "1"){
          validaAct = true;
        }else {
          validaAct = false;
        }

        let fechaJustType;
        let fechaActType;
        let fechaJust;
        let linkOrText = 'text';

        if(actuacion.fechaJustificacion != null){
          fechaJust = actuacion.fechaJustificacion;
          if (!validaAct){
            fechaJustType = 'datePicker';
          }else{
            fechaJustType = 'text';
          }
          
        } else{
          fechaJust = false;
          fechaJustType = 'datePicker';
        }
        if(this.permisosFichaAct){
          linkOrText = 'link';
        }else {
          linkOrText = 'text';
        }

        if (!validaAct){
          fechaActType = 'datePicker';
        }else{
          fechaActType = 'text';
        }

        let moduloValue2 = actuacion.idProcedimiento;
        let moduloCombo2 = this.comboModulos;

        if (finalizada) {
          arr1 = [
            { type: 'checkboxPermisos', value: [undefined, actuacion.numAsunto], size: 120, combo: null },
            { type: 'select', value: actuacion.idJuzgado, size: 400 , combo: this.comboJuzgados },
            { type: 'text', value: actuacion.nig, size: 200, combo: null},
            { type: 'text', value: actuacion.numProcedimiento, size: 200 , combo: null},
            { type: 'tooltip', value: actuacion.categoriaProcedimiento, size: 400 , combo: actuacion.procedimiento,}, //modulo
            { type: 'text', value:  this.formatDate(actuacion.fecha), size: 200 , combo: null},
            { type: 'text', value:  fechaJust , size: 200, combo: null},
            { type: linkOrText, value: acreditacionPorcentaje , size: 200, combo: null},
            { type: 'checkbox', value: validaAct, size: 80 , combo: finalizada },
            { type: 'invisible', value:  actuacion.numDesignacion , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.idAcreditacion , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.tipoAcreditacion , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.idTipoAcreditacion , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.porcentaje , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.tipoAcreditacion , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.categoriaProcedimiento , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.idJurisdiccion , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.complemento , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.permitirAniadirLetrado , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.numAsunto , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.idProcedimiento , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.idJuzgado , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.nombreJuzgado , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.fechaJustificacion , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.validada , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.idFacturacion , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.anioProcedimiento , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.descripcionFacturacion , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.docJustificacion , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.anulacion , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.nigNumProcedimiento , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.permitirLetrado , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.anio , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.idTurno , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.idInstitucion , size: 0, combo: null},
            { type: 'invisible', value:  actuacion.facturado , size: 0, combo: null}
          ];
        } else if (!this.colegiado){
         arr1 = 
          [
          { type: 'checkboxPermisos', value: [undefined, actuacion.numAsunto], size: 120, combo: null },
          { type: 'select', value: actuacion.idJuzgado, size: 400 , combo: this.comboJuzgados },
          { type: 'input', value: actuacion.nig, size: 200, combo: null},
          { type: numProcType, value: actuacion.numProcedimiento, size: 200 , combo: null},
          { type: moduloType, value: moduloValue2, size: 400 , combo: moduloCombo2 }, //modulo
          { type: fechaActType, value:  this.formatDate(actuacion.fecha), size: 200 , combo: null},
          { type: fechaJustType, value:  fechaJust , size: 200, combo: null},
          { type: linkOrText, value: acreditacionPorcentaje , size: 200, combo: null},
          { type: 'checkbox', value: validaAct, size: 80 , combo: null },
          { type: 'invisible', value:  actuacion.numDesignacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.tipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idTipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.porcentaje , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.tipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.categoriaProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idJurisdiccion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.complemento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.permitirAniadirLetrado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.numAsunto , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idJuzgado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.nombreJuzgado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.fechaJustificacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.validada , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idFacturacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.anioProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.descripcionFacturacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.docJustificacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.anulacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.nigNumProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.permitirLetrado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.anio , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idTurno , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idInstitucion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.facturado , size: 0, combo: null}
        ];

      } else{
        arr1 = 
        [
        { type: 'checkboxPermisos', value: [undefined, actuacion.numAsunto], size: 120, combo: null },
        { type: 'select', value: actuacion.idJuzgado, size: 400 , combo: this.comboJuzgados },
        { type: 'text', value: actuacion.nig, size: 200, combo: null},
        { type: 'text', value: actuacion.numProcedimiento, size: 200 , combo: null},
        { type: 'tooltip', value: actuacion.categoriaProcedimiento, size: 400 , combo: actuacion.procedimiento,}, //modulo
        { type: fechaActType, value:  this.formatDate(actuacion.fecha), size: 200 , combo: null},
        { type: fechaJustType, value:  fechaJust , size: 200, combo: null},
        { type: linkOrText, value: acreditacionPorcentaje , size: 200, combo: null},
        { type: 'checkbox', value: validaAct, size: 80 , combo: null },
        { type: 'invisible', value:  actuacion.numDesignacion , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.idAcreditacion , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.tipoAcreditacion , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.idTipoAcreditacion , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.porcentaje , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.tipoAcreditacion , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.categoriaProcedimiento , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.idJurisdiccion , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.complemento , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.permitirAniadirLetrado , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.numAsunto , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.idProcedimiento , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.idJuzgado , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.nombreJuzgado , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.fechaJustificacion , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.validada , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.idFacturacion , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.anioProcedimiento , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.descripcionFacturacion , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.docJustificacion , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.anulacion , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.nigNumProcedimiento , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.permitirLetrado , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.anio , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.idTurno , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.idInstitucion , size: 0, combo: null},
        { type: 'invisible', value:  actuacion.facturado , size: 0, combo: null}
      ];
      }
       /* }else{
          arr1 = 
          [
          { type: 'checkboxPermisos', value: finalizada, size: 50, combo: null },
          { type: 'text', value: actuacion.nombreJuzgado, size: 153 , combo: null},
          { type: 'input', value: actuacion.nig, size: 153, combo: null},
          { type: numProcType, value: actuacion.numProcedimiento, size: 153 , combo: null},
          { type: 'text', value: actuacion.procedimiento, size: 153 , combo: null}, //modulo
          { type: 'datePicker', value:  this.formatDate(actuacion.fecha), size: 153 , combo: null},
          { type: fechaJustType, value:  fechaJust , size: 153, combo: null},
          { type: 'invisible', value: actuacion.descripcion , size: 153, combo: null},
          { type: 'checkbox', value: validaAct, size: 50 , combo: null },
          { type: 'invisible', value:  actuacion.numDesignacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.tipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idTipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.porcentaje , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.tipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.categoriaProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idJurisdiccion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.complemento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.permitirAniadirLetrado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.numAsunto , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idJuzgado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.nombreJuzgado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.fechaJustificacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.validada , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idFacturacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.anioProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.descripcionFacturacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.docJustificacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.anulacion , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.nigNumProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.permitirLetrado , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.anio , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idTurno , size: 0, combo: null},
          { type: 'invisible', value:  actuacion.idInstitucion , size: 0, combo: null}
        ];
      }*/

          let num = index + 2;
          let key = letra + num;
          // this.totalActuaciones = this.totalActuaciones + 1;
          obj1 =  { [key] : arr1, position: 'collapse'};
          arr1 = [];    
        arr2.push(Object.assign({},obj1));
        obj1 = null;
       
     })
//console.log('designacion.actuaciones: ', designacion.actuaciones)
    //if (actuacion.permitirAniadirLetrado == "1"){ 

    let porcentajeTotal = 0;

    designacion.actuaciones.forEach(element => {
      porcentajeTotal += Number(element.porcentaje);
    });

    this.noInsertarMasActuaciones = false;

    if (porcentajeTotal >= 100) {
      this.noInsertarMasActuaciones = true;
    }

    if ((!this.isLetrado || designacion.letradoActuaciones == "1") && !this.noInsertarMasActuaciones && designacion.idProcedimiento != undefined && designacion.idProcedimiento.length != 0 && !finalizada) {
      
      let validaAct = false;
      if (designacion.validada == "1"){
        validaAct = true;
      }else {
        validaAct = false;
      }

      let fechaJustType;
      let fechaActType;
      let fechaJust;
      let linkOrText = 'text';

      if(this.permisosFichaAct){
        linkOrText = 'link';
      }else {
        linkOrText = 'text';
      }

      if (!validaAct){
        fechaActType = 'datePicker';
      }else{
        fechaActType = 'text';
      }
      

      let moduloValue2 = "";
      let moduloCombo2 = [];
      if(this.isLetrado){
        moduloValue2 = designacion.categoriaProcedimiento;
        moduloCombo2 = designacion.procedimiento;
        
      }else{
        moduloValue2 = designacion.idProcedimiento;
        moduloCombo2 = this.comboModulos;
      }

      let numProcType2 = 'input';
      if(this.isLetrado){
        numProcType2 = 'text';
      }else{
        numProcType2 = 'input';
      }
      
      // Obtenemos las acreditaciones disponibles para el turno y módulo de la designación
      const acreditaciones = await this.getAcreditacionesPorModulo([designacion.idProcedimiento, designacion.idTurno]);
      acreditaciones.forEach(acreditacion => {
        arr1 = [
          { type: 'checkboxPermisos', value: [undefined, designacion.numAsunto], size: 120, combo: null },
          { type: 'tooltip', value: designacion.categoriaJuzgado, size: 400, combo: designacion.nombreJuzgado },
          { type: 'input', value: designacion.nig, size: 200, combo: null},
          { type: numProcType, value: designacion.numProcedimiento, size: 200 , combo: null},
          { type: 'tooltip', value: designacion.categoriaProcedimiento, size: 400 , combo: designacion.procedimiento }, //modulo
          { type: fechaActType, value:  this.formatDate(new Date()), size: 200 , combo: null},
          { type: 'checkboxDate', value:  false, size: 200, combo: null},
          { type: "text", value: acreditacion.label, size: 200, combo: null},
          { type: 'checkbox', value: validaAct, size: 80 , combo: null },
          { type: 'invisible', value:  designacion.numDesignacion , size: 0, combo: null},
          { type: 'invisible', value:  acreditacion.value, size: 0, combo: null},
          { type: 'invisible', value:  designacion.tipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  designacion.idTipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  designacion.porcentaje , size: 0, combo: null},
          { type: 'invisible', value:  designacion.tipoAcreditacion , size: 0, combo: null},
          { type: 'invisible', value:  designacion.categoriaProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  designacion.idJurisdiccion , size: 0, combo: null},
          { type: 'invisible', value:  designacion.complemento , size: 0, combo: null},
          { type: 'invisible', value:  designacion.permitirAniadirLetrado , size: 0, combo: null},
          { type: 'invisible', value:  designacion.numAsunto , size: 0, combo: null},
          { type: 'invisible', value:  designacion.idProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  designacion.idJuzgado , size: 0, combo: null},
          { type: 'invisible', value:  designacion.nombreJuzgado , size: 0, combo: null},
          { type: 'invisible', value:  designacion.fechaJustificacion , size: 0, combo: null},
          { type: 'invisible', value:  designacion.validada , size: 0, combo: null},
          { type: 'invisible', value:  designacion.idFacturacion , size: 0, combo: null},
          { type: 'invisible', value:  designacion.anioProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  designacion.descripcionFacturacion , size: 0, combo: null},
          { type: 'invisible', value:  designacion.docJustificacion , size: 0, combo: null},
          { type: 'invisible', value:  designacion.anulacion , size: 0, combo: null},
          { type: 'invisible', value:  designacion.nigNumProcedimiento , size: 0, combo: null},
          { type: 'invisible', value:  designacion.permitirLetrado , size: 0, combo: null},
          { type: 'invisible', value:  designacion.anioDesignacion , size: 0, combo: null},
          { type: 'invisible', value:  designacion.idTurno , size: 0, combo: null},
          { type: 'invisible', value:  designacion.idInstitucion , size: 0, combo: null},
          { type: 'invisible', value:  designacion.facturado , size: 0, combo: null}
        ];
  
        let lastNum = designacion.actuaciones.length + 2;
        let lastKey = letra + lastNum;
        let objnew =  { [lastKey] : arr1, position: 'collapse'};
        //console.log('objnew: ', objnew)

        if (designacion.actuaciones.find(item => item.descripcion + ' (' + item.porcentaje + '%)' == acreditacion.label) == undefined) {
          arr2.splice(1, 0, Object.assign({},objnew));
        }
        
        objnew = null;
      });
      
    }

    if ((!this.isLetrado || designacion.letradoActuaciones == "1") && !finalizada && this.complementoModulo != '0') {
      let numProcType2 = 'input';
      if(this.isLetrado){
        numProcType2 = 'text';
      }else{
        numProcType2 = 'input';
      }
    this.arrNuevo = [
      { type: 'checkboxPermisos', value: [undefined, 'Nuevo'], size: 120, combo: null },
      { type: 'invisible', value: '', size: 400 , combo: null},
      { type: 'invisible', value: '', size: 200, combo: null},
      { type: 'invisible', value: '', size: 200 , combo: null},
      { type: 'invisible', value: '', size: 400 , combo: null}, //modulo
      { type: 'invisible', value:  '', size: 200 , combo: null},
      { type: 'invisible', value:  false , size: 200, combo: null},
      { type: 'invisible', value: '' , size: 200, combo: null},
      { type: 'invisible', value: false, size: 80 , combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null},
      { type: 'invisible', value:  '' , size: 0, combo: null}
    ];

     let lastNum = designacion.actuaciones.length + 2;
    //  this.totalActuaciones = this.totalActuaciones + 1;
     let lastKey = letra + lastNum;
     let objnew =  { [lastKey] : this.arrNuevo, position: 'collapse'};
     //console.log('objnew: ', objnew)
     arr2.push(Object.assign({},objnew));
     objnew = null;
   // }
  }


     //arr2.push(Object.assign({},obj1));
      dataObj = { [cod]  : arr2, [id2] : "" , [id3] : "", [estadoDesignacion] : "", [estadoEx] : "", [resolucionDesignacion]:""};
      data.push(Object.assign({},dataObj));
      arr2 = [];
      expedientes = "";
    }
    
    resultModified = Object.assign({},{'data': data});
//console.log('resultModified: ', resultModified)
    this.rowGroups = [];
    this.rowGroups = this.trdService.getTableData(resultModified);
    this.rowGroupsAux = [];
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
    this.totalDesignas = this.totalRegistros;

    // Cuento las actuaciones ignorando la línea del botón Nuevo y restando la línea de la designación
    if (this.rowGroups != undefined) {
      this.totalActuaciones = this.rowGroups
        .map(group => group.rows.filter(row => Array.isArray(row.cells[0].value) && row.cells[0].value[1] != 'Nuevo').length - 1)
        .reduce((a, b) => a + b, 0);
    } else {
      this.totalActuaciones = 0;
    }
    this.numActuacionesModificadas = 0;

    this.dataReady = true;
    this.progressSpinner=false;
    }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  getComplementoProcedimiento(idProcedimiento) {
    let modulo: ModulosItem = new ModulosItem;
    modulo.idProcedimiento = idProcedimiento;

    this.sigaServices.post("modulosybasesdecompensacion_getComplementoProcedimiento", modulo).subscribe(
      n => {
        this.complementoModulo = JSON.parse(n.body).valor;
      },
      err => {}
    );
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }

  clear() {
    this.msgs = [];
  }
  
  getActuacionToAdd(event){
    this.actuacionToAdd = event;
    this.tableDataToJson2(this.actuacionToAdd);
  }
  
  tableDataToJson2(actuacionesToAdd){
    let newActuaciones = actuacionesToAdd.map(a => this.actCellToJson(a.cells));
    this.newActuacionItemEmit.emit(newActuaciones);
}
  getActuacionesToDelete(event){
    this.progressSpinner=true;
    this.actuacionesToDelete = event;
    this.tableDataToJson();
    this.progressSpinner=false;
  }
  
  tableDataToJson(){
    this.actuacionesToDelete.forEach(actObj => {
    let actuacionesCells : Cell[];
    actuacionesCells = actObj;
    this.actuacionesItem = this.actCellToJson(actuacionesCells);
    this.actuacionesToDleteArr.push(this.actuacionesItem);
  });
  this.actuacionesToDleteArrEmit.emit(this.actuacionesToDleteArr);
}

getDataToUpdate(event){

this.dataToUpdate = event;
  this.dataToUpdate.forEach(rowGroup => {
    let designa = rowGroup.rows[0].cells;
    let codigoDesignacion = rowGroup.id;
    let expedientesDesignacion = rowGroup.id2;
    let clientesDesignacion =  rowGroup.id3;
    let state;
    if (rowGroup.rows[0].cells[0].value[0] == true){
      state = "F";
    }else{
      state = rowGroup.estadoDesignacion;
    }
    let estadoDesignacion = state;
    let actuaciones = rowGroup.rows.slice(1);

    let actJsonArr = [];
    actuaciones.forEach(act =>{
      let actuacionesJson = this.actCellToJson(act.cells);
      actJsonArr.push(actuacionesJson);
      
    })
  
    let designaToUpdateJSON = this.desigCellToJson(designa, codigoDesignacion, expedientesDesignacion, clientesDesignacion, estadoDesignacion, actJsonArr);
 
    this.dataToUpdateArr.push(designaToUpdateJSON);
  })

  this.dataToUpdateArrEmit.emit(this.dataToUpdateArr);
  this.dataToUpdateArr = [];
}

actCellToJson(actuacionesCells){
  let validada = "0";
  let numDesignacion = actuacionesCells[9].value;
  let idAcreditacion = actuacionesCells[10].value;
  let descripcion = actuacionesCells[7].value;
  let idTipoAcreditacion = actuacionesCells[12].value;
  let porcentaje = actuacionesCells[13].value;
  let tipoAcreditacion = actuacionesCells[11].value;
  let procedimiento = actuacionesCells[4].value;
  let categoriaProcedimiento = actuacionesCells[15].value;
  let idJurisdiccion = actuacionesCells[16].value;
  let complemento = actuacionesCells[17].value;
  let permitirAniadirLetrado = actuacionesCells[18].value;
  let numAsunto = actuacionesCells[19].value;
  let idProcedimiento = actuacionesCells[20].value;
  let idJuzgado = actuacionesCells[1].value;
  let nombreJuzgado;
  if (typeof actuacionesCells[1].combo === 'string') {
    nombreJuzgado = actuacionesCells[1].combo;
  } else {
    nombreJuzgado = actuacionesCells[1].combo.find(item => item.value == idJuzgado).label;
  }
  let fechaJustificacion = actuacionesCells[6].value;
  if (actuacionesCells[8].value == true){
    validada = "1";
  }else{
    validada = "0";
  }
 
  let idFacturacion = actuacionesCells[25].value;
  let numProcedimiento = actuacionesCells[3].value;
  let anioProcedimiento = actuacionesCells[26].value;
  let descripcionFacturacion = actuacionesCells[27].value;
  let docJustificacion = actuacionesCells[28].value;
  let anulacion = actuacionesCells[29].value;
  let nigNumProcedimiento = actuacionesCells[30].value;
  let nig = actuacionesCells[2].value;
  let fecha = actuacionesCells[5].value;
  let permitirLetrado = actuacionesCells[31].value;
  let anio = actuacionesCells[32].value;
  let idTurno = actuacionesCells[33].value;
  let idInstitucion = actuacionesCells[34].value;
 
  let actuacionesItem = (
    { 'numDesignacion': numDesignacion,
      'idAcreditacion': idAcreditacion,
      'descripcion': descripcion,
      'idTipoAcreditacion': idTipoAcreditacion,
      'porcentaje': porcentaje,
      'tipoAcreditacion': tipoAcreditacion,
      'procedimiento': procedimiento,
      'categoriaProcedimiento': categoriaProcedimiento,
      'idJurisdiccion': idJurisdiccion,
      'complemento': complemento,
      'permitirAniadirLetrado': permitirAniadirLetrado,
      'numAsunto': numAsunto,
      'idProcedimiento': idProcedimiento,
      'idJuzgado': idJuzgado,
      'nombreJuzgado': nombreJuzgado,
      'fechaJustificacion': fechaJustificacion,
      'validada': validada,
      'idFacturacion': idFacturacion,
      'numProcedimiento': numProcedimiento,
      'anioProcedimiento': anioProcedimiento,
      'descripcionFacturacion': descripcionFacturacion,
      'docJustificacion': docJustificacion,
      'anulacion': anulacion,
      'nigNumProcedimiento': nigNumProcedimiento,
      'nig': nig,
      'fecha': fecha,
      'permitirLetrado': permitirLetrado,
      'anio': anio,
      'idTurno': idTurno,
      'idInstitucion': idInstitucion
    }  );

    return actuacionesItem;
}

desigCellToJson(designacionesCells, codigoDesignacionParam, expedientesDesignacion, clientesDesignacion, estadoDesignacion, actuacionesJson){
  
  let procedimiento = designacionesCells[4].value;
  let actuaciones = actuacionesJson;
  let expedientes = expedientesDesignacion;
  let idProcedimiento = designacionesCells[21].value;
  let idPersona = designacionesCells[16].value;//
  let idTurno = designacionesCells[17].value;//
  let idInstitucion = designacionesCells[13].value;//
  let resolucionDesignacion = designacionesCells[20].value;//
  let fechaDesignacion = designacionesCells[12].value;//
  let fechaActuacion = designacionesCells[5].value;//
  let fechaJustificacion = designacionesCells[22].value;
  let numProcedimiento = designacionesCells[3].value;//
  let anioProcedimiento = designacionesCells[10].value;//
  let idInstitucionJuzgado = designacionesCells[14].value;//
  let idJuzgado = designacionesCells[15].value;//
  let nombreJuzgado = designacionesCells[1].value;//
  let nig = designacionesCells[2].value;//
  let art27 = designacionesCells[11].value;//
  let cliente = clientesDesignacion;
  let ejgs = designacionesCells[23].value;
  let codigoDesignacion = codigoDesignacionParam;
  let numDesignacion = designacionesCells[19].value;//
  let anioDesignacion = designacionesCells[10].value;//
  let designacionHasta = designacionesCells[24].value;
  let designacionDesde = designacionesCells[25].value;
  let resolucionPTECAJG = designacionesCells[26].value;
  let ejgSinResolucion = designacionesCells[27].value;
  let conEJGNoFavorables = designacionesCells[28].value;
  let sinEJG = designacionesCells[29].value;
  let actuacionesValidadas = designacionesCells[30].value;
  let estado = estadoDesignacion;
  let justificacionHasta = designacionesCells[31].value;
  let justificacionDesde = designacionesCells[32].value;
  let restriccionesVisualizacion = designacionesCells[33].value;
  let muestraPendiente = designacionesCells[18].value;//
  let numEJG = designacionesCells[34].value;
  let anioEJG = designacionesCells[35].value;
  let apellidos = designacionesCells[36].value;
  let nombre = designacionesCells[37].value;
  let nColegiado = designacionesCells[38].value;

  let fecha = fechaDesignacion;
  let fechaDes = new Date(fecha);

  fecha = fechaActuacion;
  let fechaAct = new Date(fecha);
  
  let designacionesItem = (
    { 'nColegiado': nColegiado,
      'nombre': nombre,
      'apellidos': apellidos,
      'anioEJG': anioEJG,
      'numEJG': numEJG,
      'muestraPendiente': muestraPendiente,
      'restriccionesVisualizacion': restriccionesVisualizacion,
      'justificacionDesde': justificacionDesde,
      'justificacionHasta': justificacionHasta,
      'estado': estado,
      'actuacionesValidadas': actuacionesValidadas,
      'sinEJG': sinEJG,
      'conEJGNoFavorables': conEJGNoFavorables,
      'ejgSinResolucion': ejgSinResolucion,
      'resolucionPTECAJG': resolucionPTECAJG,
      'designacionDesde': designacionDesde,
      'designacionHasta': designacionHasta,
      'anioDesignacion': anioDesignacion,
      'numDesignacion': numDesignacion,
      'codigoDesignacion': codigoDesignacion,
      'ejgs': ejgs,
      'cliente': cliente,
      'art27': art27,
      'nig': nig,
      'nombreJuzgado': nombreJuzgado,
      'idJuzgado': idJuzgado,
      'idInstitucionJuzgado': idInstitucionJuzgado,
      'actuaciones': actuaciones,
      //'expedientes': expedientes,
      'idProcedimiento': idProcedimiento,
      'idPersona': idPersona,
      'idTurno': idTurno,
      'idInstitucion': idInstitucion,
      'resolucionDesignacion': resolucionDesignacion,
      'fechaDesignacion': fechaDes,
      'fechaActuacion': fechaAct,
      'fechaJustificacion': fechaJustificacion,
      'numProcedimiento': numProcedimiento,
      'anioProcedimiento': anioProcedimiento,
      'procedimiento': procedimiento
    }  );

    return designacionesItem;
  }

  setNumActuacionesModificadas(event){
      this.numActuacionesModificadas = Number(event);
  }

  setnumDesignasModificadas(event){
    this.numDesignasModificadas = Number(event);
  }

  settotalActuaciones(event){
    this.totalActuaciones = Number(event);
  }

  getrefreshData(event){
    if (event){
      this.cargaInicial();
    }
  }

  fillFechaFiltro(event){
    this.fechaFiltro = this.formatDate(event);
    this.cargaInicial();
  }

}