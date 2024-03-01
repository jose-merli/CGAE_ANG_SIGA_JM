import { Component, OnInit, OnChanges, Input,ViewChild, ChangeDetectorRef, SimpleChanges } from "@angular/core";
import { DataTable } from "primeng/datatable";
import { ControlAccesoDto } from "../../../../../models/ControlAccesoDto";
import { SigaServices } from "../../../../../_services/siga.service";
import { Message, ConfirmationService, MenuItem } from "primeng/components/common/api";
import { ModelosComunicacionesItem } from "../../../../../models/ModelosComunicacionesItem";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { Identifiers } from "@angular/compiler";
import { FichaPlantillasDocument } from "../../../../../models/FichaPlantillasDocumentoItem";
import { InformesModelosComItem } from "../../../../../models/InformesModelosComunicacionesItem";
import { DatosGeneralesFicha } from "../../../../../models/DatosGeneralesFichaItem";

@Component({
  selector: "app-tarjeta-consultas",
  templateUrl: "./tarjeta-consultas.component.html",
  styleUrls: ["./tarjeta-consultas.component.scss"]
})
export class TarjetaConsultasComponent implements OnInit {
  openFicha: boolean = false;
  activacionEditar: boolean = true;
  derechoAcceso: any;
  permisos: any;
  permisosArray: any[];
  msgs: Message[];
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  datos: any = [];
  cols: any = [];
  bodyInicial: any = [];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  formatos: any = [];
  sufijos: any = [];
  plantillas: any = [];
  body: FichaPlantillasDocument = new FichaPlantillasDocument();
  tiposEnvio: any = [];
  nuevaPlantilla: boolean = false;
  idPlantillaEnvios: string;
  idTipoEnvios: string;
  porDefecto: boolean = false;
  eliminarArray: any = [];
  showHistorico: boolean = false;
  datosInicial: any = [];
  consultas: any = [];
  soloLectura: boolean = false;
  isNuevo: boolean = false;
  isGuardar: boolean = false;
  progressSpinner: boolean = false;
  editar: boolean = true;
  isNew: boolean = false;
  showConsultas: boolean = false;
  @ViewChild("table") table: DataTable;
  selectedDatos;
  consultasGuardadas: boolean = true;
  msgsSteps: Message[] = [];
  activeStep: number;
  steps: MenuItem[];
  
  modeloItem: ModelosComunicacionesItem = new ModelosComunicacionesItem();
  informeItem: InformesModelosComItem = new InformesModelosComItem();

  consultasCombo: any[];
  consultasComboDatos: any[];
  consultasComboDestinatarios: any[];
  consultasComboMulti: any[];
  consultasComboCondicional: any[];
  consultasComboPlantillas: any[];
  esPorDefecto: boolean = false;
  consultaPrimerRegistro: string = "";
  @Input() datoRecargar: DatosGeneralesFicha;
  @Input() botonActivo: boolean = false;
  @Input() getInforme: boolean = false;
  institucionActual: number;
  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "perfiles",
      activa: false
    },
    {
      key: "informes",
      activa: false
    },
    {
      key: "comunicacion",
      activa: false
    },
    {
      key: "consultas",
      activa: false
    },
    {
      key: "plantillaDocumentos",
      activa: true
    }
  ];
  contadorIdObjetivo = { "1": 0, "2": 0, "3": 0, "4": 0 };


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    //this.getDatos();
    //this.getResultados()
    this.getSessionStorage();
    this.getPlantillas();
    this.getConsultasDisponibles()

    this.getResultados();
   //// if (this.body.idInforme != undefined && this.body.idInforme != null) {
     // this.getResultados();
     // this.getDocumentos();
   // }
   // this.getConsultasDisponibles()

    this.getSteps();

    this.getInstitucionActual()

    this.sigaServices.deshabilitarEditar$.subscribe(() => {
      this.editar = false;
    });

    this.selectedItem = 10;


    this.cols = [
      { field: "plantillas", header: "informesycomunicaciones.consultas.ficha.plantilla" },
      { field: "objetivo", header: "informesycomunicaciones.consultas.objetivo" },
      { field: "idConsulta", header: "menu.informesYcomunicaciones.consultas.fichaConsulta.consulta" },
      { field: "region", header: "informesYcomunicaciones.modelosComunicaciones.plantillaDocumento.region" }
    ];

    this.consultas = [
      { label: "Seleccione una consulta", value: null },
      { label: "A", value: "1" },
      { label: "B", value: "2" }
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

    if (
      sessionStorage.getItem("soloLectura") != null &&
      sessionStorage.getItem("soloLectura") != undefined &&
      sessionStorage.getItem("soloLectura") == "true"
    ) {
      this.soloLectura = true;
    }

    this.datos = [
      {
        consulta: "",
        finalidad: "",
        objetivo: "Destinatario",
        idObjetivo: "1",
        idInstitucion: ""
      },
      { consulta: "", finalidad: "", objetivo: "Datos", idObjetivo: "4" },
      {
        consulta: "",
        finalidad: "",
        objetivo: "Multidocumento",
        idObjetivo: "2",
        idInstitucion: ""
      },
      { consulta: "", finalidad: "", objetivo: "Condicional", idObjetivo: "3" }
  
     
     
    ];
    // this.body.idConsulta = this.consultas[1].value;

    this.datosInicial = JSON.parse(JSON.stringify(this.datos));

  }

 

  getSessionStorage() {
    if (sessionStorage.getItem("modelosSearch") != null) {
      this.modeloItem = JSON.parse(sessionStorage.getItem("modelosSearch"));
      this.body.idModeloComunicacion = this.modeloItem.idModeloComunicacion;
      this.body.idClaseComunicacion = this.modeloItem.idClaseComunicacion;
      this.body.idInstitucion = this.modeloItem.idInstitucion;
    }

    if(this.isNew){
      this.body.idModeloComunicacion = this.datoRecargar.idModeloComunicacion;
      this.body.idClaseComunicacion = this.datoRecargar.idClaseComunicacion;
      this.body.idInstitucion = this.datoRecargar.idInstitucion;
    }
    /*if (sessionStorage.getItem("modelosInformesSearch") != null) {
      this.informeItem = JSON.parse(
        sessionStorage.getItem("modelosInformesSearch")
      );
      this.body.idInforme = this.informeItem.idInforme;
      this.body.nombreFicheroSalida = this.informeItem.nombreFicheroSalida;
      this.body.formatoSalida = this.informeItem.formatoSalida;
      this.body.idFormatoSalida = this.informeItem.idFormatoSalida;

   
    }*/

    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
  }

  getSteps() {
    this.steps = [
      {
        label: this.translateService.instant("enviosMasivos.literal.destinatarios" ) + " (" +this.contadorIdObjetivo["1"] + ")",
        command: (event: any) => {
          this.activeStep = 0;
          this.msgsSteps = [];
          this.showInfoSteps(this.translateService.instant("infoYcom.modelosComunicaciones.plantillaDocumento.steps.uno")); 
        }
      },
      {
       
        label: this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.fichaModeloComuncaciones.datos") + " (" +this.contadorIdObjetivo["4"] + ")",
        command: (event: any) => {
          this.activeStep = 1;
          this.msgsSteps = [];
          this.showInfoSteps(this.translateService.instant("infoYcom.modelosComunicaciones.plantillaDocumento.steps.dos") );
        }
      },
      {
        label: this.translateService.instant("informesYcomunicaciones.modelosComunicaciones.plantillaDocumento.multidocumento")+ " (" +this.contadorIdObjetivo["2"] + ")",
        command: (event: any) => {
          this.activeStep = 2;
          this.msgsSteps = [];
          this.showInfoSteps(this.translateService.instant("infoYcom.modelosComunicaciones.plantillaDocumento.steps.tres"));
        }
      },
      {
        label: this.translateService.instant("informesYcomunicaciones.modelosComunicaciones.plantillaDocumento.condicional") + " (" +this.contadorIdObjetivo["3"] + ")",
        command: (event: any) => {
          this.activeStep = 3;
          this.msgsSteps = [];
          this.showInfoSteps(this.translateService.instant("infoYcom.modelosComunicaciones.plantillaDocumento.steps.cuatro") );
        }
      }
    ];
  }

  getConsultasDisponibles() {
    this.sigaServices
      .post("plantillasDoc_combo_consultas", this.body)
      .subscribe(
        data => {
          this.consultasComboDatos = JSON.parse(data["body"]).consultasDatos;
          this.consultasComboDestinatarios = JSON.parse(
            data["body"]
          ).consultasDestinatarios;
          if(this.datos.length > 0 && this.consultasComboDestinatarios.length > 0){
            let consultaPrimerRegistroObj = this.consultasComboDestinatarios.find(consulta => consulta.value === this.datos[0].idConsulta);
             this.consultaPrimerRegistro = consultaPrimerRegistroObj ? consultaPrimerRegistroObj.label : "";
          }
          this.consultasComboMulti = JSON.parse(data["body"]).consultasMultidoc;
          this.consultasComboCondicional = JSON.parse(
            data["body"]
          ).consultasCondicional;
        },
        err => {
          this.showFail("Error al cargar las consultas");
          //console.log(err);
        }
      );
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  showInfoSteps(mensaje: string) {
    this.msgsSteps.push({ severity: "info", summary: "", detail: mensaje });
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

  getResultados() {
    if(this.body.idClaseComunicacion != null){
    let service = "plantillasDoc_consultas";
    if (this.showHistorico) {
      service = "plantillasDoc_consultas_historico";
    }
    this.sigaServices.post(service, this.body).subscribe(
      data => {
        this.datos = JSON.parse(data["body"]).consultaItem;
        if (this.datos.length <= 0) {
          this.datos = [
            {
              idConsulta: "",
              finalidad: "",
              objetivo: "Destinatario",
              idObjetivo: "1",
              idInstitucion: ""
            },
            {
              idConsulta: "",
              finalidad: "",
              objetivo: "Datos",
              idObjetivo: "4",
              idInstitucion: ""
            },
            {
              idConsulta: "",
              finalidad: "",
              objetivo: "Multidocumento",
              idObjetivo: "2",
              idInstitucion: ""
            },
            {
              idConsulta: "",
              finalidad: "",
              objetivo: "Condicional",
              idObjetivo: "3",
              idInstitucion: ""
            }
        
         
          ];
        } else {


          let multidocumento = this.datos.map(e => {
            if (e.idObjetivo == "2") {
              return true;
            } else {
              return false;
            }
          });

          let datos = this.datos.map(e => {
            if (e.idObjetivo == "4") {
              return true;
            } else {
              return false;
            }
          });
          let dest = this.datos.map(e => {
            if (e.idObjetivo == "1") {
              return true;
            } else {
              return false;
            }
          });
          let condicional = this.datos.map(e => {
            if (e.idObjetivo == "3") {
              return true;
            } else {
              return false;
            }
          });
          if (multidocumento.indexOf(true) == -1) {
            this.datos.push({
              idConsulta: "",
              finalidad: "",
              objetivo: "Multidocumento",
              idObjetivo: "2",
              idInstitucion: ""
            });
          }
          if (datos.indexOf(true) == -1) {
            this.datos.push({
              idConsulta: "",
              finalidad: "",
              objetivo: "Datos",
              idObjetivo: "4",
              idInstitucion: ""
            });
          }
          if (dest.indexOf(true) == -1) {
            this.datos.push({
              idConsulta: "",
              finalidad: "",
              objetivo: "Destinatario",
              idObjetivo: "1",
              idInstitucion: ""
            });
          }
          if (condicional.indexOf(true) == -1) {
            this.datos.push({
              idConsulta: "",
              finalidad: "",
              objetivo: "Condicional",
              idObjetivo: "3",
              idInstitucion: ""
            });
          }
        }

        this.datos.sort(function (a, b) {
         let order = { "1": 1, "4" : 2, "2":3, "3":4 }
         let rankA = order[a.idObjetivo]
         let rankB = order[b.idObjetivo]
         if(rankA < rankB){
          return -1;
         }
        else if(rankA > rankB){
          return 1;
        }
          return 0;
        });

        this.datos.map(e => {
          return (e.idConsultaAnterior = e.idConsulta);
        });
        this.datos.forEach(element => {
          if(element.idiomasPlantillas != null){
            element.plantillas = element.idiomasPlantillas.map((nombreA:string) =>{
              let index = nombreA.lastIndexOf('.');
              if(index === -1) return nombreA;
              return nombreA.substring(0,index);
            });
            element.plantillas = element.plantillas.join(', ')
          }
        });

        if(this.datos.length > 0 &&  this.consultasComboDestinatarios && this.consultasComboDestinatarios.length > 0){
          let consultaPrimerRegistroObj = this.consultasComboDestinatarios.find(consulta => consulta.value === this.datos[0].idConsulta);
           this.consultaPrimerRegistro = consultaPrimerRegistroObj ? consultaPrimerRegistroObj.label : "";
        }
        this.contadorIdObjetivo = { "1": 0, "2": 0, "3": 0, "4": 0 };
        this.datos.forEach(e => {
          if (e.idConsulta.length > 0 && this.contadorIdObjetivo.hasOwnProperty(e.idObjetivo)) {
            this.contadorIdObjetivo[e.idObjetivo]++;
          }
        });
        this.getSteps()
        this.datosInicial = JSON.parse(JSON.stringify(this.datos));
      },
      err => {
        this.showFail(this.translateService.instant("informesYcomunicaciones.modelosComunicaciones.plantillaDocumento.mensaje.error.cargaConsulta"));
        //console.log(err);
      }
    );
  }
}

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "110";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        //console.log(err);
      },
      () => {
        // if (this.derechoAcceso == 3) {
        //   this.activacionEditar = true;
        // } else if (this.derechoAcceso == 2) {
        //   this.activacionEditar = false;
        // } else {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        //   this.router.navigate(["/errorAcceso"]);
        // }
      }
    );
  }

  getInstitucionActual() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;

      // El modo de la pantalla viene por los permisos de la aplicación
      if (sessionStorage.getItem("permisoModoLectura") == 'true' || sessionStorage.getItem("soloLectura") == 'true') {
        this.esPorDefecto = true;
      }

      if (sessionStorage.getItem("esPorDefecto") != undefined) {
        if (sessionStorage.getItem("esPorDefecto") == 'SI' && this.institucionActual != 2000 || sessionStorage.getItem("soloLectura") === 'true') {
          this.esPorDefecto = true;
        } else {
          this.esPorDefecto = false;
        }
      } else {
        this.modeloItem = JSON.parse(sessionStorage.getItem('modelosSearch'));
        if (this.modeloItem != null 
          && this.modeloItem.porDefecto != null 
          && this.modeloItem.porDefecto == "SI" 
          && this.institucionActual != 2000){
          if (
            sessionStorage.getItem("soloLectura") != null &&
            sessionStorage.getItem("soloLectura") != undefined &&
            sessionStorage.getItem("soloLectura") == "true"
          ) {
            this.esPorDefecto = true;
          }
        }
      }
    });
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
  onChangeConsultas(e, comboConsultas) {
    let id = e.value;
    if (id == "") {
      for (let dato of this.datos) {
        if (!dato.idConsulta && dato.idConsulta == id) {
          dato.idConsulta = id;
          dato.finalidad = "";
          dato.idInstitucion = "";
        }
      }
    } else {
      this.getInstitucion(id, comboConsultas);
      //this.getFinalidad(id);
    }
    if(this.datos.length > 0 && this.consultasComboDestinatarios.length > 0){
      let consultaPrimerRegistroObj = this.consultasComboDestinatarios.find(consulta => consulta.value === this.datos[0].idConsulta);
       this.consultaPrimerRegistro = consultaPrimerRegistroObj ? consultaPrimerRegistroObj.label : "";
    }
    this.consultasGuardadas = false;
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  getInstitucion(id, comboConsultas) {
    for (let dato of this.datos) {
      if (dato.idConsulta && dato.idConsulta != "" && dato.idConsulta == id) {
        dato.idConsulta = id;
        let continua = true;
        comboConsultas.forEach(element => {
          if (continua && element.value == id) {
            dato.idInstitucion = element.idInstitucion;
            continua = false;
          }
        });
      }
    }
    this.datos = [...this.datos];
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onRowSelect(dato) {
    // if (!this.selectMultiple) {
    //   this.selectedDatos = [];
    // } else {
    //   return dato[0].selected = true;
    // }
    this.numSelected = this.selectedDatos.length;
    return (dato[0].selected = true);
  }
  onRowUnselect(dato) {
    this.numSelected = this.selectedDatos.length;

    // if (this.selectMultiple && !dato[0].nueva) {
    //   return (dato[0].selected = false);
    // }
  }

  addConsulta() {
    let obj = {
      consulta: null,
      finalidad: null,
      objetivo: "DATOS",
      idObjetivo: "4",
      idInstitucion: ""
    };
    this.datos.push(obj);
    this.datos = [...this.datos];
  }

 

  guardarConsultas() {
    let destinatarios = this.datos.map(e => {
      if (typeof e.idConsulta != "undefined" && e.idConsulta != "") {
        return true;
      } else {
        return false;
      }
    });

    if (destinatarios.indexOf(true) != -1 || this.body.idClaseComunicacion == "5") {
      this.guardarConsultasOk();
    }
  }

  guardarConsultasOk() {

    this.progressSpinner = true;
    this.body.consultas = [];
    this.datos.map(e => {
      let obj = {
        idConsulta: e.idConsulta,
        idConsultaAnterior: e.idConsultaAnterior,
        idObjetivo: e.idObjetivo,
        idInstitucion: e.idInstitucion,
        idClaseComunicacion: this.body.idClaseComunicacion,
        region: e.region
      };
      this.body.consultas.push(obj);
    });

    this.sigaServices
      .post("plantillasDoc_consultas_guardar", this.body)
      .subscribe(
        data => {
          this.showSuccess(this.translateService.instant("informesycomunicaciones.consultas.ficha.correctGuardadoConsulta"));
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          this.progressSpinner = false;
        },
        err => {
          this.showFail(this.translateService.instant("informesycomunicaciones.consultas.ficha.errorGuardadoConsulta"));
          this.progressSpinner = false;
          //console.log(err);
        },
        () => {
          this.progressSpinner = false;
          this.getResultados();
          this.consultasGuardadas = true;
        }
      );
  }

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }

 




  getHistorico(key) {
    if (key == "visible") {
      this.showHistorico = true;
    } else if (key == "hidden") {
      this.showHistorico = false;
    }
    this.getResultados();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.datoRecargar && !changes.datoRecargar.firstChange) {
      this.isNew = true;
      this.ngOnInit();
    }
    if(changes.getInforme){
      this.getInforme = false;
      this.ngOnInit();
    }
  }

  getPlantillas() {
    this.sigaServices.get("modelos_detalle_plantillasComunicacion").subscribe(
      data => {
        this.plantillas = data.combooItems;
        // this.plantillas.unshift({ label: "Seleccionar", value: "" });
      },
      err => {
        //console.log(err);
      },
      () => { }
    );
  }

  addPlantilla() {
    let newPlantilla = {
      idPlantillaEnvios: "",
      tipoEnvio: "",
      idTipoEnvios: "",
      porDefecto: false,
      nueva: true
    };
    this.idPlantillaEnvios = "";
    this.nuevaPlantilla = true;
    this.datos.push(newPlantilla);
    this.datos = [...this.datos];

    // Controlamos que solo se puedan añadir filas de una en una, una vez guardada la anterior
    this.isNuevo = !this.isNuevo;
    this.isGuardar = true;

    this.selectedDatos = [];
    this.selectMultiple = false;
  }


  // onChangePorDefecto(e) {

  //   //console.log(e)
  //   if (e == true) {
  //     this.porDefecto = 'Si';
  //   } else {
  //     this.porDefecto = 'No';
  //   }
  // }
  onChangePorDefecto(e, dato) {
    if (dato.fechaBaja == null || dato.fechaBaja == "") {
      if (e == true) {
        this.datos.forEach(element => {
          if (element.fechaBaja == null || element.fechaBaja == "") {
            if (element != dato) {
              element.porDefecto = false;
            } else {
              element.porDefecto = true;
            }
          }
        });
      }
    } else {
      dato.porDefecto = false;
      e = false;
    }

    this.selectedDatos = [];
  }

  onShowConsultas() {
   // if (sessionStorage.getItem("crearNuevaPlantillaDocumento") == null) {
      this.showConsultas = !this.showConsultas;
    ////}
  }

  restablecer() {
    this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    this.nuevaPlantilla = false;
    this.isNuevo = false;
    this.selectMultiple = false;
    this.selectedDatos = [];
    this.numSelected = 0;
    this.showHistorico = false;
  }
}
