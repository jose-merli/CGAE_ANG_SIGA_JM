import { Component, OnInit, ViewChild } from "@angular/core";
import { esCalendar } from "../../../../../utils/calendar";
import { SigaServices } from "./../../../../../_services/siga.service";
import { Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { ControlAccesoDto } from "./../../../../../../app/models/ControlAccesoDto";
import { DatosIntegrantesItem } from "../../../../../models/DatosIntegrantesItem";
import { DatosLiquidacionIntegrantesItem } from "../../../../../models/DatosLiquidacionIntegrantesItem";
import { DatosIntegrantesObject } from "../../../../../models/DatosIntegrantesObject";
import { TranslateService } from "./../../../../../commons/translate/translation.service";
import { ColegiadoItem } from "../../../../../models/ColegiadoItem";
import { ColegiadoObject } from "../../../../../models/ColegiadoObject";
import { DatePipe } from "@angular/common";
import { DatosIntegrantesLiquidacionObject } from "../../../../../models/DatosIntegrantesLiquidacionObject";

/*** COMPONENTES ***/

@Component({
  selector: "app-detalleIntegrante",
  templateUrl: "./detalleIntegrante.component.html",
  styleUrls: ["./detalleIntegrante.component.scss"]
})
export class DetalleIntegranteComponent implements OnInit {
  cols: any = [];
  datos: any[] = [];
  nuevaFecha;
  sortO: number = 1;
  sortF: string = "";
  isVolver: boolean = true;
  isCrear: boolean = false;
  isEditar: boolean = true;
  isEliminar: boolean = true;
  fechaMinima: Date;
  searchIntegrantes = new DatosIntegrantesObject();
  datosActivos: any[];
  select: any[];
  msgs: Message[] = [];
  es: any = esCalendar;
  rowsPerPage: any = [];
  showDatosGenerales: boolean = true;
  pButton;
  historico: boolean = false;
  editar: boolean = false;
  buscar: boolean = false;
  disabledRadio: boolean = false;
  disabled: boolean = false;
  selectMultiple: boolean = false;
  block: boolean = true;
  isDisablednifCif: boolean = true;
  isDisabledNombre: boolean = true;
  isDisabledApellidos1: boolean = true;
  isDisabledApellidos2: boolean = true;
  isDisabledTipoColegio: boolean = true;
  isDisabledProvincia: boolean = true;
  isDisabledNumColegio: boolean = true;
  isDisabledColegio: boolean = true;
  selectedItem: number = 10;
  first: number = 0;
  activo: boolean = false;
  dniCorrecto: boolean;
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisosTree: any;
  descripcionCargo: any;
  descripcionProvincia: any;
  descripcionTipoColegio: any;
  idInstColegio: any;
  permisosArray: any[];
  usuarioBody: any[];
  cargosArray: any[];
  colegiosArray: any[];
  provinciasArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean;
  selectAll: boolean = false;
  update: boolean = true;
  progressSpinner: boolean = false;
  numSelected: number = 0;
  masFiltros: boolean = false;
  openFicha: boolean = false;
  disabledAction: boolean = false;
  fichasPosibles: any[];
  Liquidacion: DatosLiquidacionIntegrantesItem;
  LiquidacionActiveAnt: DatosIntegrantesItem = new DatosIntegrantesItem();
  body: DatosIntegrantesItem = new DatosIntegrantesItem();
  datosIntegrantes: DatosIntegrantesObject = new DatosIntegrantesObject();
  searchLiquidacion :  DatosIntegrantesLiquidacionObject = new DatosIntegrantesLiquidacionObject();
  fechaCarga: Date;
  fechaBajaCargo: Date;
  columnasTabla: any = [];
  // Obj extras
  body1: DatosIntegrantesItem = new DatosIntegrantesItem();
  body2: DatosIntegrantesItem = new DatosIntegrantesItem();
  esColegiado: boolean = false;
  colegio: String;
  colegios: any[] = [];
  idInstitucion: any;

  colegiadoSearch: ColegiadoObject = new ColegiadoObject();
  datosColegiados: any[] = [];

  nColegiado: any[] = [];

  @ViewChild("table")
  table;
  selectedDatos;
  idPersona: any;
  observaciones: any;
  isGuardar: boolean = false;
  registroAnteriorMod: any;
  datosLiquidacion: DatosLiquidacionIntegrantesItem[];

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    public datepipe: DatePipe,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem("historicoInt") != null) {
      this.historico = true;
    }

    if (sessionStorage.getItem("disabledAction") == "true") {
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }

    sessionStorage.removeItem("historicoInt");
    sessionStorage.removeItem("newIntegrante");

    sessionStorage.setItem("editarIntegrante", "true");
    this.body = JSON.parse(sessionStorage.getItem("integrante"));

    // creacion
    if (
      sessionStorage.getItem("nIntegrante") != null ||
      sessionStorage.getItem("nIntegrante") != undefined
    ) {
      this.beanNewIntegrante();
      this.getComboColegios();
    }
    // modificacion
    else {
            
      if(this.body.flagSocio != undefined && this.body.flagSocio !=  null){
        if(this.body.flagSocio == "1"){
          this.body.socio = true;
        }else{
          this.body.socio = false;
        }

      }
             
      // CRISTINA
      // if(this.body.sociedad != undefined && this.body.sociedad !=  null){
      //   if(this.body.sociedad == "SI"){
      //     this.checked = false;
      //   }else{
      //     this.checked = true;
      //   }
      // }

      if(this.body.descripcionCargo != undefined && this.body.descripcionCargo !=  null){
            this.body.cargo = this.body.descripcionCargo;
      }
      var a = JSON.parse(sessionStorage.getItem("integrante"));
      // caso de que la persona integrante colegiada
      if (
        a.ejerciente != null &&
        a.ejerciente != "NO COLEGIADO" &&
        a.ejerciente != "SOCIEDAD"
      ) {
        this.esColegiado = true;
      } else {
        // caso de que la persona integrante sea no colegiada
        this.esColegiado = false;
      }

      if (a.fechaCargo != null || a.fechaCargo != undefined) {
        this.fechaCarga = a.fechaCargo;
      }
      if (a.fechaBajaCargo != null || a.fechaBajaCargo != undefined) {
        this.fechaBajaCargo = a.fechaBajaCargo;
      }

      if (this.body.idPersona != null) {
        if (this.esColegiado) {
          this.sigaServices
            .post(
              "fichaColegialOtrasColegiaciones_getLabelColegios",
              this.body.idPersonaComponente
            )
            .subscribe(
              n => {
                this.colegios = JSON.parse(n["body"]).comboColegiadoItems;
                // console.log("colegiaciones", this.colegios);

                this.colegios.forEach(element => {
                  this.nColegiado.push({
                    idInstitucion: element.value,
                    nColegiado: element.nColegiado
                  });
                  if (this.body.colegio == element.value && element.nColegiado != "" && element.nColegiado != undefined) {
                    this.body.numColegiado = element.nColegiado;
                  }
                });

                if (this.colegios.length == 1) {
                  this.isDisabledTipoColegio = true;
                  this.isDisabledColegio = true;
                  this.isDisabledProvincia = false;
                  this.isDisabledNumColegio = true;
                  // this.progressSpinner = true;
                  // this.getProvinciaByIdColegio(this.colegios[0].value);
                  this.body.numColegiado = this.colegios[0].nColegiado;
                } else {
                  this.isDisabledTipoColegio = true;
                  this.isDisabledColegio = false;
                  this.isDisabledProvincia = false;
                  this.isDisabledNumColegio = true;
                }
              },
              err => {
                console.log(err);
              }
            );
        }
      } else {
        this.getComboColegios();
      }

      if (this.historico) {
        this.todoDisable();
      } else {
        this.ajustarPantallaParaAsignar();
      }
    }

    this.editar = this.body.editar;
    this.editar = true;
    this.fichasPosibles = [
      {
        key: "identificacion",
        activa: this.editar
      },
      {
        key: "colegiacion",
        activa: this.editar
      },
      {
        key: "vinculacion",
        activa: this.editar
      },
      {
        key: "historicoLiquidacion",
        activa: this.editar
      }
    ];
    this.cols = [
      { field: "fechaInicio", header: "facturacionSJCS.facturacionesYPagos.fecha" },
      { field: "sociedad", header: "cen.integrantes.liqSJCS" },
      { field: "observaciones", header: "general.description" }
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

    //Combos

    this.getComboProvincias();
    this.getComboTipoColegio();
    this.getComboTiposCargos();

    this.getHistoricoLiquidacion();
  }

  borrar() {
    //•	Eliminar: borrará el último registro solo si el colegiado no está en un pago con fecha posterior o igual a la fecha del último registro.
    //comprobar que el colegiado tiene algún pago con fecha posterior o igual a la fecha de registro --> fecha inicio de la tabla this.datos
    //si devuelve >0 o true significa que tiene pagos y no se puede eliminar
    this.sigaServices.postPaginado("integrantes_buscarPagosColegiados","?idPersona=" + this.body.idPersona,this.datosLiquidacion[0]).subscribe(
      data => { 
        let ok = data.body;
        if(ok){
          this.sigaServices.postPaginado("integrantes_eliminarLiquidacion","?idPersona=" + this.body.idPersona,this.datosLiquidacion[0]).subscribe(
            data => { 
              let ok = data.body;
              if(ok){
                this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                this.getHistoricoLiquidacion();
              }
            },
            err => {
              this.progressSpinner = false;
              if (null != err.error && JSON.parse(err.error).error.description != "") {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
              } else {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
              }
            },
            () => {
              this.volver();
            }
          );
        }else{
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("No se puede eliminar porque el colegiado tiene pagos con fecha posterior o igual a la fecha del registro"));

        }
      },
      err => {
        this.progressSpinner = false;
        if (null != err.error && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
      () => {
        this.volver();
      }
    );
  }

  volver() {
    this.search();
      this.isVolver = !this.isVolver;
      this.isCrear = !this.isCrear;
      this.isEditar = !this.isEditar;
      this.isEliminar = !this.isEliminar;
  }

  showMessage(severity, summary, msg) {
		this.msgs = [];
		this.msgs.push({
			severity: severity,
			summary: summary,
			detail: msg
		});
	}

  crear() {
    this.isGuardar = true;
    this.isCrear = true;
    this.isEliminar = true;
   
     if (this.datosLiquidacion == null ||this.datosLiquidacion == undefined ||this.datosLiquidacion.length == 0) {
      this.fechaMinima = new Date();
       this.datosLiquidacion = [];
       //fecha minima es hoy
     }else { 
       //entra por aquí porque en this.datos hay un alta
      //  this.datosLiquidacion =  JSON.parse(JSON.stringify(this.datos));
       this.fechaMinima = JSON.parse(JSON.stringify(this.datosLiquidacion[0].fechaInicio));    
    }

    let nuevaLinea = new DatosLiquidacionIntegrantesItem();

    if(this.body && this.body != null && this.body.sociedad == "SI"){
      nuevaLinea.sociedad = "Baja";
    }else{
      nuevaLinea.sociedad = "Alta";
    }

    this.datosLiquidacion.unshift(nuevaLinea); 

  }

  // formatDate(date) {
  //   const pattern = 'dd/MM/yyyy';
  //   return this.datepipe.transform(date, pattern);
  // }
  
  getHistoricoLiquidacion(){
    this.Liquidacion = new DatosLiquidacionIntegrantesItem();
    this.Liquidacion.idComponente = this.body.idComponente;
    this.Liquidacion.idPersona = this.body.idPersona;
    this.Liquidacion.idInstitucion = this.body.idInstitucion;
    this.Liquidacion.sociedad = this.body.sociedad;


    this.sigaServices.post("integrantes_listadoHistoricoLiquidacion",this.Liquidacion).subscribe(
      data => {
        
        // this.searchLiquidacion = data.body;
        this.datosLiquidacion = JSON.parse(data.body).datosLiquidacionItem;
        
        this.datosLiquidacion.forEach(element => {
          element.fechaInicio = new Date(element.fechaInicio); 
          
          if(element.sociedad == "1"){
            element.sociedad = "Alta";
          }else{
            element.sociedad = "Baja";
          }

          element.idPersona = this.body.idPersona;
          element.idComponente = this.body.idComponente;
          element.idInstitucion = this.body.idInstitucion;
        });

        this.progressSpinner = false;       
      },
      err => {
        this.progressSpinner = false;     
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  getComboColegios() {
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;
        this.arregloTildesCombo(this.colegios);
      },
      err => {
        console.log(err);
      }
    );
  }

  getProvinciaByIdColegio(idInstitucion) {
    this.body.valor = idInstitucion;
    this.sigaServices.post("integrantes_provinciaColegio", this.body).subscribe(
      data => {
        this.body.idProvincia = JSON.parse(data["body"]).valor;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  onChangeColegio(event) {
    //this.progressSpinner = true;

    if (event) {
      //this.getProvinciaByIdColegio(event);

      if (this.nColegiado.length > 1) {
        this.nColegiado.forEach(element => {
          if (element.idInstitucion == event) {
            this.body.numColegiado = element.nColegiado;
          }
        });
      }
    }
  }

  getComboProvincias() {
    this.sigaServices.get("integrantes_provincias").subscribe(
      n => {
        this.provinciasArray = n.combooItems;
        this.arregloTildesCombo(this.provinciasArray);
        this.actualizarDescripcionProvincia();
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTipoColegio() {
    this.sigaServices.get("integrantes_tipoColegio").subscribe(
      n => {
        this.colegiosArray = n.combooItems;
        this.arregloTildesCombo(this.colegiosArray);

        // si estamos en un integrante que ya existe
        if (this.body.completo) {
          if (this.esColegiado) {
            // se asigna el tipo de colegio "Abogacias"
            this.body.idTipoColegio = this.colegiosArray.find(
              item => item.value === "1"
            ).value;
          } else {
            // se quita el tipo de colegio "Abogacias"
            this.colegiosArray.splice(1, 1);
          }
        }

        console.log(this.colegiosArray);
        this.actualizarDescripcionTipoColegio();
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTiposCargos() {
    this.sigaServices.get("integrantes_cargos").subscribe(
      n => {
        this.cargosArray = n.combooItems;
        this.arregloTildesCombo(this.cargosArray);
        this.actualizarDescripcionCargo();
      },
      err => {
        console.log(err);
      }
    );
  }

  verMasFiltros() {
    this.masFiltros = !this.masFiltros;
  }
  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }
  backTo() {
    sessionStorage.removeItem("nIntegrante");
    sessionStorage.removeItem("integrante");
    sessionStorage.setItem("editarIntegrante", "true");
    this.router.navigate(["fichaPersonaJuridica"]);
  }
  pInputText;
  transformaFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(fecha);
    }
    return fecha;
  }

  arreglarFechas() {
    if (this.fechaCarga != undefined) {
      this.body.fechaCargo = this.transformaFecha(this.fechaCarga);
    }
    if (this.fechaBajaCargo != undefined) {
      this.body.fechaBajaCargo = this.transformaFecha(this.fechaBajaCargo);
    }
  }

  beanNewIntegrante() {
    var ir = null;
    this.body = new DatosIntegrantesItem();
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));

    ir = JSON.parse(sessionStorage.getItem("nIntegrante"));
    this.body.completo = ir[0].completo;

    // creacion de un nuevo integrante ya existente
    if (ir[0].completo) {
      if (ir[0].idPersona != null) {
        this.body.idPersona = ir[0].idPersona;
        this.body.idPersonaIntegrante = ir[0].idPersona;
      }

      if (ir[0].fechaAlta != null) {
        this.body.fechaCargo = ir[0].fechaAlta;
        this.fechaCarga = ir[0].fechaAlta;
      } else if (ir[0].fechaConstitucion != null) {
        this.body.fechaCargo = ir[0].fechaConstitucion;
        this.fechaCarga = ir[0].fechaConstitucion;
      }
      if (ir[0].fechaBajaCargo != null) {
        this.body.fechaBajaCargo = ir[0].fechaBajaCargo;
        this.fechaBajaCargo = ir[0].fechaBajaCargo;
      }
      if (ir[0].nif != null) {
        this.body.nifCif = ir[0].nif;
      }
      if (ir[0].nombre != null) {
        this.body.nombre = ir[0].nombre;
      } else if (ir[0].denominacion != null) {
        //this.body.nombre = ir[0].denominacion;
        let denominacion = ir[0].denominacion;
        this.body.nombre = denominacion.substring(0, denominacion.indexOf(" "));
        this.body.apellidos1 = denominacion.substring(
          denominacion.indexOf(" "),
          denominacion.length
        );
      }

      if (ir[0].apellidos != null) {
        this.body.apellidos = ir[0].apellidos;
      }
      if (ir[0].primerApellido != null) {
        this.body.apellidos1 = ir[0].primerApellido;
      }
      if (ir[0].segundoApellido != null) {
        this.body.apellidos2 = ir[0].segundoApellido;
      }
      if (ir[0].nombre != null && ir[0].apellidos) {
        this.body.nombreCompleto = ir[0].nombre + " " + ir[0].apellidos;
      }

      if (ir[0].numeroColegiado != null) {
        this.body.numColegiado = ir[0].numeroColegiado;
      } else if (ir[0].numColegiado != null) {
        this.body.numColegiado = ir[0].numColegiado;
      }

      // caso de que la persona integrante colegiada
      if (
        ir[0].situacion != null &&
        ir[0].situacion != "NO COLEGIADO" &&
        ir[0].situacion != "SOCIEDAD"
      ) {
        this.esColegiado = true;

        if (ir[0].colegio != null && ir[0].colegio != undefined) {
          this.body.idInstitucion = ir[0].colegio.value;
          this.body.idInstitucionIntegrante = ir[0].numeroInstitucion;

          this.body.colegio = ir[0].colegio.value;
        } else {
          this.body.idInstitucion = ir[0].idInstitucion;
          this.body.idInstitucionIntegrante = ir[0].numeroInstitucion;

          this.body.colegio = ir[0].numeroInstitucion;
        }

        if (ir[0].idProvincia != null) {
          this.body.idProvincia = ir[0].idProvincia;
        }

        if (ir[0].numeroInstitucion != null) {
          this.body.numeroInstitucion = ir[0].numeroInstitucion;
        }
      } else {
        // caso de que la persona integrante sea no colegiada
        this.esColegiado = false;

        this.body.numeroInstitucion = ir[0].numeroInstitucion;
        this.body.idInstitucion = ir[0].idInstitucion;
      }

      this.body.idPersonaPadre = this.usuarioBody[0].idPersona;
      this.body.tipoIdentificacion = ir[0].tipoIdentificacion;

      this.ajustarPantallaParaAsignar();
    }
    // creacion de un nuevo integrante desde 0
    else {
      this.body = new DatosIntegrantesItem();
      this.body.nifCif = ir[0].nifCif;
      this.body.idPersonaPadre = this.usuarioBody[0].idPersona;
      this.body.tipoIdentificacion = ir[0].tipoIdentificacion;
      this.body.nombre = ir[0].nombre;
      this.body.apellidos1 = ir[0].apellidos1;
      this.body.apellidos2 = ir[0].apellidos2;

      this.ajustarPantallaPara();
    }
  }
  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
    }
  }

  ajustarPantallaPara() {
    this.isDisablednifCif = true;
    this.isDisabledNombre = false;
    this.isDisabledApellidos1 = false;
    this.isDisabledApellidos2 = false;
    this.isDisabledTipoColegio = false;
    //this.isDisabledProvincia = false;

    if (this.body.idTipoColegio == "41" || this.body.idTipoColegio == "1") {
      this.isDisabledNumColegio = true;
    } else {
      this.isDisabledNumColegio = false;
    }

    if (this.esColegiado) {
      this.isDisabledTipoColegio = true;
      this.isDisabledColegio = true;
      this.isDisabledProvincia = false;
      this.isDisabledNumColegio = true;
    } else {
      this.isDisabledTipoColegio = false;
      this.isDisabledColegio = false;
      this.isDisabledProvincia = false;
      this.isDisabledNumColegio = false;
    }
  }

  ajustarPantallaParaAsignar() {
    this.isDisablednifCif = true;
    this.isDisabledNombre = true;
    this.isDisabledApellidos1 = true;
    this.isDisabledApellidos2 = true;
    if (!this.esColegiado) {
      this.isDisabledTipoColegio = false;
      this.isDisabledColegio = true;
      this.isDisabledProvincia = false;
      this.isDisabledNumColegio = false;
    }
  }

  todoDisable() {
    this.isDisablednifCif = true;
    this.isDisabledNombre = true;
    this.isDisabledApellidos1 = true;
    this.isDisabledApellidos2 = true;
    this.isDisabledTipoColegio = true;
    this.isDisabledColegio = true;
    this.isDisabledProvincia = true;
    this.isDisabledNumColegio = true;
  }

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = !fichaPosible.activa;
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
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

  search() {
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    this.selectAll = false;
    this.sigaServices
      .postPaginado("busquedaPerJuridica_history", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.searchIntegrantes = JSON.parse(data["body"]);
          this.datos = this.searchIntegrantes.datosIntegrantesItem;
          this.table.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => { }
      );
  }

  guardar() {
    //this.progressSpinner = true;
    if (
      sessionStorage.getItem("nIntegrante") != null ||
      sessionStorage.getItem("nIntegrante") != undefined
    ) {
      this.Integrante();
    } else {
      this.updateIntegrante();
    }
  }

  

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail(message: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: message
    });
  }

  clear() {
    this.msgs = [];
  }

  updateIntegrante() {
    let updateIntegrante = new DatosIntegrantesItem();
    updateIntegrante = this.body;
    let isParticipacionNumerico = false;
    if (this.fechaCarga != undefined && this.fechaCarga != null) {
      this.arreglarFechas();
      updateIntegrante.fechaCargo = this.body.fechaCargo;
    } else {
      updateIntegrante.fechaCargo = undefined;
    }
    if (this.fechaBajaCargo != undefined && this.fechaBajaCargo != null) {
      this.arreglarFechas();
      updateIntegrante.fechaBajaCargo = this.body.fechaBajaCargo;
    } else {
      updateIntegrante.fechaBajaCargo = undefined;
    }
    if (this.body.cargo != undefined && this.body.cargo != null) {
      updateIntegrante.cargo = this.body.cargo;
    } else {
      updateIntegrante.cargo = "";
    }
    if (this.body.idCargo != undefined && this.body.idCargo != null) {
      updateIntegrante.idCargo = this.body.idCargo;
    } else {
      updateIntegrante.idCargo = "";
    }
    if (this.body.numColegiado != undefined && this.body.numColegiado != null) {
      updateIntegrante.numColegiado = this.body.numColegiado;
    }
    if (this.body.socio != undefined && this.body.socio != null) {
      if(this.body.socio){
        updateIntegrante.flagSocio = "1";
      }else{
        updateIntegrante.flagSocio = "0";
      }
    }

    // CRISTINA
    // if (this.checked != undefined && this.checked != null) {
    //   if(this.checked){
    //     updateIntegrante.sociedad = "SI";
    //   }else{
    //     updateIntegrante.sociedad = "NO";
    //   }
    // }
    if (
      this.body.capitalSocial != undefined &&
      this.body.capitalSocial != null
    ) {
      // comprueba si es numérico + permite el 0 como valor y que este vacio el campo
      if (
        this.body.capitalSocial ||
        this.body.capitalSocial == undefined ||
        this.body.capitalSocial == 0
      ) {
        isParticipacionNumerico = true;
        updateIntegrante.capitalSocial = this.body.capitalSocial;
      } else {
        isParticipacionNumerico = false;
      }
    } else {
      isParticipacionNumerico = true;
      updateIntegrante.capitalSocial = undefined;
    }
    if (this.body.idPersona != undefined && this.body.idPersona != null) {
      updateIntegrante.idPersona = this.body.idPersona;
    }
    if (this.body.idComponente != undefined && this.body.idComponente != null) {
      updateIntegrante.idComponente = this.body.idComponente;
    }
    if (
      this.body.idPersonaComponente != undefined &&
      this.body.idPersonaComponente != null
    ) {
      updateIntegrante.idPersonaComponente = this.body.idPersonaComponente;
    }

    if (this.body.idProvincia != undefined && this.body.idProvincia != null) {
      updateIntegrante.idProvincia = this.body.idProvincia;
    }

    if (this.body.colegio != undefined && this.body.colegio != null) {
      updateIntegrante.colegio = this.body.colegio;
    }

    let numParticipacion = this.body.capitalSocial;

    if (
      (isParticipacionNumerico && numParticipacion <= 100) ||
      updateIntegrante.capitalSocial == undefined
    ) {
      this.sigaServices
        .postPaginado("integrantes_update", "?numPagina=1", updateIntegrante)
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.showSuccess();
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
            this.backTo();
          }
        );
    } else {
      this.showFail(
        "El campo Participación debe ser numérico y menor o igual que 100"
      );

      this.progressSpinner = false;
    }
  }

  Integrante() {
    let newIntegrante = new DatosIntegrantesItem();
    let isParticipacionNumerico = false;

    if (this.body.completo) {
      if (this.body.nombre != undefined && this.body.nombre != null) {
        newIntegrante.nombre = this.body.nombre;
      } else {
        newIntegrante.nombre = "";
      }
      if (this.body.apellidos1 != undefined && this.body.apellidos1 != null) {
        newIntegrante.apellidos1 = this.body.apellidos1;
      } else {
        newIntegrante.apellidos1 = "";
      }
      if (this.body.apellidos2 != undefined && this.body.apellidos2 != null) {
        newIntegrante.apellidos2 = this.body.apellidos2;
      } else {
        newIntegrante.apellidos2 = "";
      }
      if (this.body.nifCif != undefined && this.body.nifCif != null) {
        newIntegrante.nifCif = this.body.nifCif;
      } else {
        newIntegrante.nifCif = "";
      }
      if (this.body.socio != undefined && this.body.socio != null) {
        if(this.body.socio){
          newIntegrante.flagSocio = "1";
        }else{
          newIntegrante.flagSocio = "0";
        }
      } else {
        newIntegrante.flagSocio = "";
      }

      // CRISTINA
      // if (this.checked != undefined && this.checked != null) {
      //   if(this.checked){
      //     newIntegrante.sociedad = "SI";
      //   }else{
      //     newIntegrante.sociedad = "NO";
      //   }
      // } else {
      //   newIntegrante.sociedad = "";
      // }

      if (
        this.body.tipoIdentificacion != undefined &&
        this.body.tipoIdentificacion != null
      ) {
        newIntegrante.tipoIdentificacion = this.body.tipoIdentificacion;
      } else {
        newIntegrante.tipoIdentificacion = "";
      }
      if (this.fechaCarga != undefined && this.fechaCarga != null) {
        this.arreglarFechas();
        newIntegrante.fechaCargo = this.body.fechaCargo;
      } else {
        newIntegrante.fechaCargo = undefined;
      }
      if (this.fechaBajaCargo != undefined && this.fechaBajaCargo != null) {
        this.arreglarFechas();
        newIntegrante.fechaBajaCargo = this.body.fechaBajaCargo;
      } else {
        newIntegrante.fechaBajaCargo = undefined;
      }
      if (this.body.cargo != undefined && this.body.cargo != null) {
        newIntegrante.cargo = this.body.cargo;
      } else {
        newIntegrante.cargo = "";
      }
      if (this.body.idCargo != undefined && this.body.idCargo != null) {
        newIntegrante.idCargo = this.body.idCargo;
      } else {
        newIntegrante.idCargo = "";
      }
      if (
        this.body.capitalSocial != undefined &&
        this.body.capitalSocial != null
      ) {
        if (
          this.body.capitalSocial ||
          this.body.capitalSocial == undefined ||
          this.body.capitalSocial == 0
        ) {
          isParticipacionNumerico = true;
          newIntegrante.capitalSocial = this.body.capitalSocial;
        } else {
          isParticipacionNumerico = false;
        }
      } else {
        isParticipacionNumerico = true;
        newIntegrante.capitalSocial = undefined;
      }
      if (
        this.body.idComponente != undefined &&
        this.body.idComponente != null
      ) {
        newIntegrante.idComponente = this.body.idComponente;
      } else {
        newIntegrante.idComponente = "";
      }
      if (
        this.body.idPersonaPadre != undefined &&
        this.body.idPersonaPadre != null
      ) {
        newIntegrante.idPersonaPadre = this.body.idPersonaPadre;
      } else {
        newIntegrante.idPersonaPadre = "";
      }
      if (
        this.body.idPersonaIntegrante != undefined &&
        this.body.idPersonaIntegrante != null
      ) {
        newIntegrante.idPersonaIntegrante = this.body.idPersonaIntegrante;
      } else {
        newIntegrante.idPersonaIntegrante = "";
      }
      if (
        this.body.idInstitucionIntegrante != undefined &&
        this.body.idInstitucionIntegrante != null
      ) {
        newIntegrante.idInstitucionIntegrante = this.body.idInstitucionIntegrante;
      } else {
        newIntegrante.idInstitucionIntegrante = this.body.colegio;
      }
      if (
        this.body.idTipoColegio != undefined &&
        this.body.idTipoColegio != null
      ) {
        newIntegrante.idTipoColegio = this.body.idTipoColegio;
      } else {
        newIntegrante.idTipoColegio = "";
      }
      if (this.body.idProvincia != undefined && this.body.idProvincia != null) {
        newIntegrante.idProvincia = this.body.idProvincia;
      } else {
        newIntegrante.idProvincia = "";
      }
      if (
        this.body.numColegiado != undefined &&
        this.body.numColegiado != null
      ) {
        newIntegrante.numColegiado = this.body.numColegiado;
      } else {
        newIntegrante.numColegiado = "";
      }
      if (this.body.tipo != undefined && this.body.tipo != null) {
        newIntegrante.tipo = this.body.tipo;
      } else {
        newIntegrante.tipo = "";
      }
      if (!this.esColegiado) {
        if (
          this.body.numeroInstitucion != undefined &&
          this.body.numeroInstitucion != null
        ) {
          newIntegrante.colegio = this.body.numeroInstitucion;
        }

        if (
          this.body.idInstitucion != null &&
          this.body.idInstitucion != undefined
        ) {
          newIntegrante.colegio = this.body.idInstitucion;
        }
      }

      if (
        this.esColegiado &&
        this.body.colegio != undefined &&
        this.body.colegio != null
      ) {
        newIntegrante.colegio = this.body.colegio;
      }
      let numParticipacion = this.body.capitalSocial;
      if (
        (isParticipacionNumerico && numParticipacion <= 100) ||
        newIntegrante.capitalSocial == undefined
      ) {
        this.sigaServices
          .postPaginado("integrantes_insert", "?numPagina=1", newIntegrante)
          .subscribe(
            data => {
              this.progressSpinner = false;
            },
            err => {
              console.log(err);
              this.progressSpinner = false;
            },
            () => {
              this.backTo();
            }
          );
      } else {
        this.showFail(
          "El campo Participación debe ser numérico y menor o igual que 100"
        );
      }
    } else {
      if (this.body.nombre != undefined && this.body.nombre != null) {
        newIntegrante.nombre = this.body.nombre;
      } else {
        newIntegrante.nombre = "";
      }
      if (this.body.apellidos1 != undefined && this.body.apellidos1 != null) {
        newIntegrante.apellidos1 = this.body.apellidos1;
      } else {
        newIntegrante.apellidos1 = "";
      }
      if (this.body.apellidos2 != undefined && this.body.apellidos2 != null) {
        newIntegrante.apellidos2 = this.body.apellidos2;
      } else {
        newIntegrante.apellidos2 = "";
      }
      if (this.body.nifCif != undefined && this.body.nifCif != null) {
        newIntegrante.nifCif = this.body.nifCif;
      } else {
        newIntegrante.nifCif = "";
      }
      if (
        this.body.tipoIdentificacion != undefined &&
        this.body.tipoIdentificacion != null
      ) {
        newIntegrante.tipoIdentificacion = this.body.tipoIdentificacion;
      } else {
        newIntegrante.tipoIdentificacion = "";
      }
      if (this.fechaCarga != undefined && this.fechaCarga != null) {
        this.arreglarFechas();
        newIntegrante.fechaCargo = this.body.fechaCargo;
      } else {
        newIntegrante.fechaCargo = undefined;
      }
      if (this.fechaBajaCargo != undefined && this.fechaBajaCargo != null) {
        this.arreglarFechas();
        newIntegrante.fechaBajaCargo = this.body.fechaBajaCargo;
      } else {
        newIntegrante.fechaBajaCargo = undefined;
      }
      if (this.body.cargo != undefined && this.body.cargo != null) {
        newIntegrante.cargo = this.body.cargo;
      } else {
        newIntegrante.cargo = "";
      }
      if (this.body.idCargo != undefined && this.body.idCargo != null) {
        newIntegrante.idCargo = this.body.idCargo;
      } else {
        newIntegrante.idCargo = "";
      }
      if (
        this.body.capitalSocial != undefined &&
        this.body.capitalSocial != null
      ) {
        if (
          this.body.capitalSocial ||
          this.body.capitalSocial == undefined ||
          this.body.capitalSocial == 0
        ) {
          isParticipacionNumerico = true;
          newIntegrante.capitalSocial = this.body.capitalSocial;
        } else {
          isParticipacionNumerico = false;
        }
      } else {
        isParticipacionNumerico = true;
        newIntegrante.capitalSocial = undefined;
      }
      if (
        this.body.idComponente != undefined &&
        this.body.idComponente != null
      ) {
        newIntegrante.idComponente = this.body.idComponente;
      } else {
        newIntegrante.idComponente = "";
      }
      if (
        this.body.idPersonaPadre != undefined &&
        this.body.idPersonaPadre != null
      ) {
        newIntegrante.idPersonaPadre = this.body.idPersonaPadre;
      } else {
        newIntegrante.idPersonaPadre = "";
      }
      if (
        this.body.idPersonaIntegrante != undefined &&
        this.body.idPersonaIntegrante != null
      ) {
        newIntegrante.idPersonaIntegrante = this.body.idPersonaIntegrante;
      } else {
        newIntegrante.idPersonaIntegrante = "";
      }
      if (
        this.body.idInstitucionIntegrante != undefined &&
        this.body.idInstitucionIntegrante != null
      ) {
        newIntegrante.idInstitucionIntegrante = this.body.idInstitucionIntegrante;
      } else {
        newIntegrante.idInstitucionIntegrante = this.body.colegio;
      }
      if (
        this.body.idTipoColegio != undefined &&
        this.body.idTipoColegio != null
      ) {
        newIntegrante.idTipoColegio = this.body.idTipoColegio;
      } else {
        newIntegrante.idTipoColegio = "";
      }
      if (this.body.idProvincia != undefined && this.body.idProvincia != null) {
        newIntegrante.idProvincia = this.body.idProvincia;
      } else {
        newIntegrante.idProvincia = "";
      }
      if (
        this.body.numColegiado != undefined &&
        this.body.numColegiado != null
      ) {
        newIntegrante.numColegiado = this.body.numColegiado;
      } else {
        newIntegrante.numColegiado = "";
      }
      if (this.body.tipo != undefined && this.body.tipo != null) {
        newIntegrante.tipo = this.body.tipo;
      } else {
        newIntegrante.tipo = "";
      }
      let numParticipacion = this.body.capitalSocial;
      if (
        (isParticipacionNumerico && numParticipacion <= 100) ||
        newIntegrante.capitalSocial == undefined
      ) {
        this.sigaServices
          .postPaginado("integrantes_insert", "?numPagina=1", newIntegrante)
          .subscribe(
            data => {
              this.progressSpinner = false;
            },
            err => {
              console.log(err);
              this.progressSpinner = false;
            },
            () => {
              this.backTo();
            }
          );
      } else {
        this.showFail(
          "El campo Participación debe ser numérico y menor o igual que 100"
        );
      }
    }
  }
  actualizarDescripcionCargo() {
    this.descripcionCargo = this.cargosArray.find(
      item => item.value === this.body.idCargo
    );
  }
  actualizarDescripcionTipoColegio() {
    this.descripcionTipoColegio = this.colegiosArray.find(
      item => item.value === this.body.idTipoColegio
    );
  }
  actualizarDescripcionProvincia() {
    this.descripcionProvincia = this.provinciasArray.find(
      item => item.value === this.body.idProvincia
    );

    // console.log("dde", this.descripcionProvincia);
  }

  onChange(event) {
    // console.log("fo", event.replace(".", ","));
    this.body.capitalSocial = event.replace(",", ".");
  }

  fillFechaCarga(event) {
    this.fechaCarga = event;
  }

  detectFechaCargaInput(event) {
    this.fechaCarga = event;
  }

  fillFechaBajaCargo(event) {
    this.fechaBajaCargo = event;
  }

  detectFechaBajaCargoInput(event) {
    this.fechaBajaCargo = event;
  }

  arregloTildesCombo(combo) {
    combo.map(e => {
      let accents =
        "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
      let accentsOut =
        "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
      let i;
      let x;
      for (i = 0; i < e.label.length; i++) {
        if ((x = accents.indexOf(e.label[i])) != -1) {
          e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
          return e.labelSinTilde;
        }
      }
    });
  }

  //NUEVOOOO
  onChangeCalendar(event) {
    this.nuevaFecha = event;
    this.isVolver = false;
    // if (this.datos.length > 1) {
    //   this.datos.forEach((value: any, key: number) => {
    //     if (
    //       value.recursoRetencion == this.retencionActiveAnt.recursoRetencion &&
    //       value.fechaInicio == this.retencionActiveAnt.fechaInicio
    //     ) {
    //       this.datos[key].fechaFin = this.datepipe.transform(
    //         new Date(event - 86400000),
    //         "dd/MM/yyyy"
    //       );          
    //     }
    //   });
    // }

    // if //(
    //   //this.body.descripcionLiquidacion != "" &&
    //   //this.body.descripcionLiquidacion != undefined
    // ) {
    //   this.isEditar = false;
    //   this.isCrear = true;
    // }

   
  }

  guardarLiquidacion(){

    this.registroAnteriorMod = new DatosLiquidacionIntegrantesItem();
    if (this.datosLiquidacion != null && this.datosLiquidacion != undefined && this.datosLiquidacion.length != 0) {
    
      this.registroAnteriorMod = JSON.parse(JSON.stringify(this.datosLiquidacion[0]));
    }
    this.registroAnteriorMod.anterior = true;

    this.Liquidacion = new DatosLiquidacionIntegrantesItem();
    this.Liquidacion.fechaInicio= new Date(this.nuevaFecha);
    this.Liquidacion.observaciones = this.observaciones;//.toString();
    this.Liquidacion.idComponente = this.body.idComponente;
    this.Liquidacion.idPersona = this.body.idPersona;
    this.Liquidacion.idInstitucion = this.body.idInstitucion;


    if(this.datosLiquidacion[0].sociedad == "SI"){
      this.Liquidacion.sociedad = "1";
    }else{
      this.Liquidacion.sociedad = "0";
    }

     this.Liquidacion.anterior = false;
    
    let arr = [];
    arr.push(this.Liquidacion);
    arr.push(this.registroAnteriorMod);

    if(this.Liquidacion.fechaInicio != null && this.Liquidacion.fechaInicio != undefined){
      this.sigaServices.post("integrantes_insertHistoricoLiquidacion",arr).subscribe(
        data => {
          let ok = data.body;
          this.isGuardar = false;
          this.progressSpinner = false;
     
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.getHistoricoLiquidacion();
          
        },
        err => {
          this.progressSpinner = false;
          if (null != err.error && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
           this.isGuardar = false;
        },
        () => {
          this.progressSpinner = false;
           this.isGuardar = false;
        }
      );
    }else{
      console.log("No está la fecha seleccionada");
      this.isGuardar = false;
    }
  }
}
