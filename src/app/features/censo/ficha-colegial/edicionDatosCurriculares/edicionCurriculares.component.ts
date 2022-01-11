import { Component, OnInit, ViewChild } from "@angular/core";
import { esCalendar } from "./../../../../utils/calendar";
import { SigaServices } from "./../../../../_services/siga.service";
import { Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { ControlAccesoDto } from "./../../../../../app/models/ControlAccesoDto";
import { TranslateService } from "../../../../commons/translate/translation.service";

import { FichaColegialEdicionCurricularesItem } from "../../../../models/FichaColegialEdicionCurricularesItem";
import { FichaColegialEdicionCurricularesObject } from "../../../../models/FichaColegialEdicionCurricularesObject";
import { TipoCurricularItem } from "../../../../models/TipoCurricularItem";
import { SubtipoCurricularItem } from "../../../../models/SubtipoCurricularItem";
import { CommonsService } from '../../../../_services/commons.service';
import { RevisionAutLetradoItem } from "../../../../models/RevisionAutLetradoItem";
/*** COMPONENTES ***/

@Component({
  selector: "app-edicionCurriculares",
  templateUrl: "./edicionCurriculares.component.html",
  styleUrls: ["./edicionCurriculares.component.scss"]
})
export class EdicionCurricularesComponent implements OnInit {
  static onlyCheckDatosCV() {
    throw new Error("Method not implemented.");
  }
  isLetrado: boolean;
  cols: any = [];
  datos: any[];
  searchIntegrantes = new FichaColegialEdicionCurricularesObject();
  datosActivos: any[];
  select: any[];
  msgs: Message[] = [];
  es: any = esCalendar;
  verificado: Boolean;
  displayAuditoria: boolean = false;
  motivo: any;
  showGuardarAuditoria: boolean = false;
  guardar: any;
  rowsPerPage: any = [];
  showDatosGenerales: boolean = true;
  pButton;
  historico: boolean = false;
  editar: boolean = false;
  buscar: boolean = false;
  disabled: boolean = false;
  selectMultiple: boolean = false;
  blockCrear: boolean = true;
  selectedItem: number = 10;
  first: number = 0;
  activo: boolean = false;
  dniCorrecto: boolean;
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  categoriaCurricular: any[];
  tipoCurricularCombo: any[];
  subtipoCurricularCombo: any[];
  usuarioBody: any[];
  derechoAcceso: any;
  selectAll: boolean = false;
  update: boolean = true;
  progressSpinner: boolean = false;
  numSelected: number = 0;
  openFicha: boolean = true;
  fichasPosibles: any[];
  tipoCurricular: TipoCurricularItem = new TipoCurricularItem();
  subtipoCurricular: SubtipoCurricularItem = new SubtipoCurricularItem();
  body: FichaColegialEdicionCurricularesItem = new FichaColegialEdicionCurricularesItem();
  datosIntegrantes: FichaColegialEdicionCurricularesObject = new FichaColegialEdicionCurricularesObject();
  fechaCarga: Date;
  fechaBajaCargo: Date;
  columnasTabla: any = [];
  nuevo: Boolean;
  creditosIncorrecto: boolean = false;
  // Obj extras
  bodyInicial: FichaColegialEdicionCurricularesItem = new FichaColegialEdicionCurricularesItem();
  body2: FichaColegialEdicionCurricularesItem = new FichaColegialEdicionCurricularesItem();
  permisos: boolean = true; //true
  @ViewChild("table")
  table;
  selectedDatos;
  tipoCVSelected;
  subtipoCVSelected;

  resaltadoDatos:boolean = false;
disabledAction:boolean = false;
  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private commonService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem("disabledAction") == "true") { // Esto disablea tela de cosas funciona como medio permisos. 
      // Es estado baja colegial (historico?)
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }
    if (sessionStorage.getItem("permisos")) {
      this.permisos = JSON.parse(sessionStorage.getItem("permisos"));
    }
    this.progressSpinner = true;
    this.resaltadoDatos=true;
    if (sessionStorage.getItem("nuevoCurriculo")) {
      this.body = new FichaColegialEdicionCurricularesItem();
      this.body.idPersona = JSON.parse(sessionStorage.getItem("idPersona"));
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.nuevo = true;
      sessionStorage.removeItem("nuevoCurriculo");
    } else {
      this.body = JSON.parse(sessionStorage.getItem("curriculo"));
      this.body = this.body[0];
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.nuevo = false;
    }

    if (sessionStorage.getItem("isLetrado")) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
    // Llamada al rest para obtener la categoría curricular
    this.sigaServices.get("tipoCurricular_categoriaCurricular").subscribe(
      n => {
        this.categoriaCurricular = n.combooItems;
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );

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
      }
    ];
    this.cols = [
      { field: "nif", header: "administracion.usuarios.literal.NIF" },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      { field: "apellidos", header: "Apellidos" },
      { field: "fechaInicioCargo", header: "Fecha de alta - fecha de baja" },
      { field: "cargos", header: "Cargos del integrante" },
      { field: "liquidacionComoSociedad", header: "Liquidación como sociedad" },
      { field: "ejerciente", header: "Ejerciente" },
      { field: "participacion", header: "Participación en la sociedad" }
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
    this.booleanToCertificado();
    this.activateGuardar();
    if (this.nuevo == false) {
      this.getComboSubtipoCurricular(this.body.idTipoCv);
      this.getComboTipoCurricular(this.body.idTipoCv);
    }

    this.onlyCheckDatos();
  }
  abrirFicha() {
    this.onlyCheckDatos();
    this.openFicha = !this.openFicha;
  }

  arreglarFecha(fecha) {
    let fechaNueva = new Date();
    if (fecha != undefined && fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[1] + "/" + splitDate[0] + "/" + splitDate[2];
        fechaNueva = new Date(arrayDate);
      } else {
        fechaNueva = new Date(rawDate);
      }
    } else {
      fechaNueva = undefined;
    }
    return fechaNueva;
  }

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  certificadoToBoolean() {
    if (this.verificado == true) {
      this.body.certificado = "1";
    } else {
      this.body.certificado = "0";
    }
  }

  booleanToCertificado() {
    if (this.body.certificado == "1") {
      this.verificado = true;
    } else {
      this.verificado = false;
    }
  }

  duplicarRegistro() {
    this.body.dateFechaInicio = this.arreglarFecha(this.body.fechaDesde);
    this.body.dateFechaFin = this.arreglarFecha(this.body.fechaHasta);
    this.body.dateFechaMovimiento = this.arreglarFecha(
      this.body.fechaMovimiento
    );
    this.sigaServices
      .postPaginado("fichaDatosCurriculares_insert", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          this.activateGuardar();
          this.showSuccess();
          this.backTo();
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
          this.showFail();
        },
        () => { }
      );
  }

  backTo() {
    sessionStorage.setItem("abrirCurriculares", "true");
    this.router.navigate(["fichaColegial"]);
  }

  // pInputText;
  // transformaFecha(fecha) {
  //   let jsonDate = JSON.stringify(fecha);
  //   let rawDate = jsonDate.slice(1, -1);
  //   if (rawDate.length < 14) {
  //     let splitDate = rawDate.split("/");
  //     let arrayDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];
  //     fecha = new Date((arrayDate += "T00:00:00.001Z"));
  //   } else {
  //     fecha = new Date(fecha);
  //   }
  //   return fecha;
  // }

  // getLetrado() {
  //   this.sigaServices.get("getLetrado").subscribe(
  //     data => {
  //       this.isLetrado = data;
  //     },
  //     err => {
  //       //console.log(err);
  //     }
  //   );
  // }

  solicitaModificacion() {
    if (this.isLetrado == true && this.nuevo == false) {
      return true;
    } else {
      return false;
    }
  }
  solicitaCreacion() {
    if (this.isLetrado == true && this.nuevo == true) {
      return true;
    } else {
      return false;
    }
  }

  comprobarAuditoria() {
    // modo creación

    // mostrar la auditoria depende de un parámetro que varía según la institución
    if(this.body != undefined && this.body != null){
      this.body.motivo = undefined;
    }

    if (!this.isLetrado) {
      this.solicitudGuardarCv();
    } else {
      this.displayAuditoria = true;
    }
  }

  cerrarAuditoria() {
    this.displayAuditoria = false;
  }

  comprobarCampoMotivo() {
    if (
      this.body.motivo != undefined &&
      this.body.motivo != "" &&
      this.body.motivo.trim() != ""
    ) {
      this.showGuardarAuditoria = true;
    } else {
      this.showGuardarAuditoria = false;
    }
  }

  solicitudGuardarCv() {
    this.progressSpinner = true;
    this.resaltadoDatos=false;

    this.certificadoToBoolean();
    this.body.dateFechaInicio = this.arreglarFecha(this.body.fechaDesde);
    this.body.dateFechaFin = this.arreglarFecha(this.body.fechaHasta);
    this.body.dateFechaMovimiento = this.arreglarFecha(
      this.body.fechaMovimiento
    );

    if (this.tipoCVSelected != undefined && this.tipoCVSelected != null) {
      this.body.idTipoCvSubtipo1 = this.tipoCVSelected.value;
      this.body.idInsTipoCvSubtipo1 = this.tipoCVSelected.idInstitucion;
    } else {
      this.body.idTipoCvSubtipo1 = undefined;
      this.body.idInsTipoCvSubtipo1 = undefined;
    }

    if (this.subtipoCVSelected != undefined && this.subtipoCVSelected != null) {
      this.body.idTipoCvSubtipo2 = this.subtipoCVSelected.value;
      this.body.idInsTipoCvSubtipo2 = this.subtipoCVSelected.idInstitucion;
    } else {
      this.body.idTipoCvSubtipo2 = undefined;
      this.body.idInsTipoCvSubtipo2 = undefined;
    }

    if (this.nuevo) {
      this.body.idCv = null;
      this.sigaServices
        .postPaginado(
          "fichaDatosCurriculares_solicitudUpdate",
          "?numPagina=1",
          this.body
        )
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.bodyInicial = JSON.parse(JSON.stringify(this.body));
            this.activateGuardar();
            this.showSuccess(); //Debe mostrar "solicitud realizada correctamente"
            let err = JSON.parse(data["body"]);
            if (err.error.description != "") {
              sessionStorage.setItem("solimodifMensaje", err.error.description);
            }
            this.backTo();
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
            this.showFail();
          },
          () => { }
        );
    } else {
      this.sigaServices
        .postPaginado(
          "fichaDatosCurriculares_solicitudUpdate",
          "?numPagina=1",
          this.body
        )
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.bodyInicial = JSON.parse(JSON.stringify(this.body));
            this.activateGuardar();
            this.showSuccess(); //Debe mostrar "solicitud realizada correctamente"
            let err = JSON.parse(data["body"]);
            if (err.error.description != "") {
              sessionStorage.setItem("solimodifMensaje", err.error.description);
            }
            this.backTo();
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
            this.showFail();
          },
          () => { }
        );
    }
  }

  guardarCv() {
    this.progressSpinner = true;
    this.certificadoToBoolean();
    this.body.dateFechaInicio = this.arreglarFecha(this.body.fechaDesde);
    this.body.dateFechaFin = this.arreglarFecha(this.body.fechaHasta);
    this.body.dateFechaMovimiento = this.arreglarFecha(
      this.body.fechaMovimiento
    );

    if (this.tipoCVSelected != undefined && this.tipoCVSelected != null) {
      this.body.idTipoCvSubtipo1 = this.tipoCVSelected.value;
      this.body.idInsTipoCvSubtipo1 = this.tipoCVSelected.idInstitucion;
    } else {
      this.body.idTipoCvSubtipo1 = undefined;
      this.body.idInsTipoCvSubtipo1 = undefined;
    }

    if (this.subtipoCVSelected != undefined && this.subtipoCVSelected != null) {
      this.body.idTipoCvSubtipo2 = this.subtipoCVSelected.value;
      this.body.idInsTipoCvSubtipo2 = this.subtipoCVSelected.idInstitucion;
    } else {
      this.body.idTipoCvSubtipo2 = undefined;
      this.body.idInsTipoCvSubtipo2 = undefined;
    }

    if (this.nuevo) {
      this.sigaServices
        .postPaginado(
          "fichaDatosCurriculares_insert",
          "?numPagina=1",
          this.body
        )
        .subscribe(
          data => {
            this.progressSpinner = false;
            //Se comprueba si se han realizado cambios en los datos colegiales
            if (
              this.body != this.bodyInicial
            ){
              //IMPORTANTE: LLAMADA PARA REVISION SUSCRIPCIONES (COLASUSCRIPCIONES)
              let peticion = new RevisionAutLetradoItem();
              peticion.idPersona = this.body.idPersona.toString();
              peticion.fechaProcesamiento = this.body.dateFechaInicio;
              this.sigaServices.post("PyS_actualizacionColaSuscripcionesPersona", peticion).subscribe();
            }
            this.bodyInicial = JSON.parse(JSON.stringify(this.body));
            this.activateGuardar();
            this.showSuccess();
            this.backTo();
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
            this.showFail();
          },
          () => { }
        );
    } else {
      this.sigaServices
        .postPaginado(
          "fichaDatosCurriculares_update",
          "?numPagina=1",
          this.body
        )
        .subscribe(
          data => {
            this.progressSpinner = false;
            //Se comprueba si se han realizado cambios en los datos colegiales
            if (
              this.body != this.bodyInicial
            ){
              //IMPORTANTE: LLAMADA PARA REVISION SUSCRIPCIONES (COLASUSCRIPCIONES)
              let peticion = new RevisionAutLetradoItem();
              peticion.idPersona = this.body.idPersona.toString();
              peticion.fechaProcesamiento = new Date();
              this.sigaServices.post("PyS_actualizacionColaSuscripcionesPersona", peticion).subscribe();
            }
            this.bodyInicial = JSON.parse(JSON.stringify(this.body));
            this.activateGuardar();
            this.showSuccess();
            this.backTo();
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
            this.showFail();
          },
          () => { }
        );
    }
    this.resaltadoDatos=false;
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  compruebaRegistro() {
    var a = this.body.creditos;
    if (!Number.isNaN(Number(this.body.creditos)) && !this.onlySpaces(this.body.creditos)) {
      this.creditosIncorrecto = false;
      return true;
    } else {
      if (this.body.creditos == "" || this.onlySpaces(this.body.creditos)) {
        this.creditosIncorrecto = null;
        return false;
      } else {
        this.creditosIncorrecto = true;
        return false;
      }
    }
  }

  onlySpaces(str) {
    let i = 0;
    var ret;
    ret = true;
    while (i < str.length) {
      if (str[i] != " ") {
        ret = false;
      }
      i++;
    }
    return ret;
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }
  
  restablecer() {
    this.onlyCheckDatos();
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.resaltadoDatos=false;

    if (this.nuevo == false) {
      this.getComboSubtipoCurricular(this.body.idTipoCv);
      this.getComboTipoCurricular(this.body.idTipoCv);
    }else{
      this.tipoCVSelected = undefined;
      this.subtipoCVSelected = undefined;
    }
    this.booleanToCertificado();
    this.compruebaRegistro();
  }

  isDisabledCombos() {
    if (this.body.idTipoCv != "" && this.body.idTipoCv != null) {
      return false;
    } else {
      return true;
    }
  }

  activateDuplicar() {
    if (
      this.creditosIncorrecto == true ||
      this.body.fechaDesde == null ||
      this.body.idTipoCv == undefined ||
      this.body.idTipoCv == null ||
      this.body.descripcion == null ||
      this.body.descripcion == ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  activateGuardar() {
    if (JSON.stringify(this.body) == JSON.stringify(this.bodyInicial)) {
      return false;
    } else {
      if (
        this.creditosIncorrecto == true ||
        this.body.fechaDesde == null ||
        this.body.idTipoCv == undefined ||
        this.body.idTipoCv == null ||
        this.body.descripcion == null ||
        this.body.descripcion == ""
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  activateRestablecer() {
    if (JSON.stringify(this.body) == JSON.stringify(this.bodyInicial)) {
      return false;
    } else {
      return true;
    }
  }

  onChangeCategoriaCurricular(event) {
    if (event) {
      this.getComboSubtipoCurricular(event.value);
      this.getComboTipoCurricular(event.value);
      this.body.idTipoCvSubtipo1 = "";
      this.body.idTipoCvSubtipo2 = "";
    }
  }

  onChangeTipoCurricular(event) {
    if (event) {
      this.body.idTipoCvSubtipo1 = event.value.value;
      this.body.idInsTipoCvSubtipo1 = event.value.idInstitucion;
    }
  }

  onChangeSubtipoCurricular(event) {
    if (event) {
      this.body.idTipoCvSubtipo2 = event.value.value;
      this.body.idInsTipoCvSubtipo2 = event.value.idInstitucion;
    }
  }

  //TipoCurricular
  getComboTipoCurricular(idTipoCV) {
    let historico = false;

    if (this.body.fechaHasta != null) {
      historico = true;
    }

    this.sigaServices
      .getParam(
        "tipoCurricular_getCurricularTypeCombo",
        "?idTipoCV=" + idTipoCV +
        "&historico=" +
        historico
      )
      .subscribe(
        n => {
          this.tipoCurricularCombo = [];
          let array = n.combooItems;

          array.forEach(element => {
            let e = { label: element.label, value: { label: element.label, value: element.value, idInstitucion: element.idInstitucion } };
            this.tipoCurricularCombo.push(e);
          });

          this.tipoCVSelected = array.find(x => x.value == this.body.idTipoCvSubtipo1 && x.idInstitucion == this.body.idInsTipoCvSubtipo1);

          this.arregloTildesCombo(this.tipoCurricularCombo);
        },
        error => { },
        () => { }
      );
  }

  //SubtipoCurricular
  getComboSubtipoCurricular(idTipoCV) {
    let historico = false;

    if (this.body.fechaHasta != null) {
      historico = true;
    }



    this.sigaServices
      .getParam(
        "subtipoCurricular_getCurricularSubtypeCombo",
        "?idTipoCV=" + idTipoCV +
        "&historico=" + historico
      )
      .subscribe(
        n => {

          this.subtipoCurricularCombo = [];
          let array = n.combooItems;

          array.forEach(element => {
            let e = { label: element.label, value: { label: element.label, value: element.value, idInstitucion: element.idInstitucion } };
            this.subtipoCurricularCombo.push(e);
          });

          this.subtipoCVSelected = array.find(x => x.value == this.body.idTipoCvSubtipo2 && x.idInstitucion == this.body.idInsTipoCvSubtipo2);

          this.arregloTildesCombo(this.subtipoCurricularCombo);
        },
        error => { },
        () => { }
      );
  }

  changeCategoria() {
    this.tipoCurricular.idTipoCV = this.body.idTipoCv;
    this.subtipoCurricular.idTipoCV = this.body.idTipoCv;
    this.sigaServices
      .postPaginado(
        "tipoCurricular_comboTipoCurricular",
        "?numPagina=1",
        this.tipoCurricular
      )
      .subscribe(
        data => {
          this.tipoCurricularCombo = JSON.parse(data.body).combooItems;
          this.body.idTipoCvSubtipo1 = "";
          this.body.idTipoCvSubtipo2 = "";
        },
        err => {
          //console.log(err);
        }
      );

    this.sigaServices
      .postPaginado(
        "subtipoCurricular_comboSubtipoCurricular",
        "?numPagina=1",
        this.subtipoCurricular
      )
      .subscribe(
        data => {
          this.subtipoCurricularCombo = JSON.parse(data.body).combooItems;
        },
        err => {
          //console.log(err);
        }
      );
  }

  showFailDetallado(message: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: message
    });
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

  fillFechaDesde(event) {
    this.body.fechaDesde = event;
  }

  fillFechaHasta(event) {
    this.body.fechaHasta = event;
  }

  fillFechaMovimiento(event) {
    this.body.fechaMovimiento = event;
  }

  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento==undefined || evento==null || evento=="")){
      return this.commonService.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios(){
    if((this.body.idTipoCv==null || this.body.idTipoCv==undefined || this.body.idTipoCv==="") || 
    (this.body.fechaDesde==null || this.body.fechaDesde==undefined) ||
    (this.body.descripcion==null || this.body.descripcion==undefined || this.body.descripcion==="")){
      this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios')}];
    this.resaltadoDatos=true;
    }
  }

  checkDatos(){
    if(!this.isLetrado){
      if(this.activateGuardar()){
        this.guardarCv();
      }else{
        if((this.body.idTipoCv==null || this.body.idTipoCv==undefined || this.body.idTipoCv==="") || 
        (this.body.fechaDesde==null || this.body.fechaDesde==undefined) ||
        (this.body.descripcion==null || this.body.descripcion==undefined || this.body.descripcion==="")){
          this.muestraCamposObligatorios();
        }else{
          this.guardarCv();
        }
      }
    }else if(this.solicitaModificacion()){
      if(this.activateGuardar()){
        this.comprobarAuditoria()
      }else{
        if((this.body.idTipoCv==null || this.body.idTipoCv==undefined || this.body.idTipoCv==="") || 
        (this.body.fechaDesde==null || this.body.fechaDesde==undefined) ||
        (this.body.descripcion==null || this.body.descripcion==undefined || this.body.descripcion==="")){
          this.muestraCamposObligatorios();
        }else{
          this.comprobarAuditoria();
        }
      }
    }else if(this.solicitaCreacion()){
      if(this.activateGuardar()){
        this.comprobarAuditoria();
      }else{
        if((this.body.idTipoCv==null || this.body.idTipoCv==undefined || this.body.idTipoCv==="") || 
        (this.body.fechaDesde==null || this.body.fechaDesde==undefined) ||
        (this.body.descripcion==null || this.body.descripcion==undefined || this.body.descripcion==="")){
          this.muestraCamposObligatorios();
        }else{
          this.comprobarAuditoria();
        }
      }
    }
  }

  onlyCheckDatos(){
    if((this.body.idTipoCv==null || this.body.idTipoCv==undefined || this.body.idTipoCv==="") || 
    (this.body.fechaDesde==null || this.body.fechaDesde==undefined) ||
    (this.body.descripcion==null || this.body.descripcion==undefined || this.body.descripcion==="")){
    this.resaltadoDatos=true;
    this.abrirFicha();
    }
  }

  onlyCheckDatosCV(){
    if((this.body.idTipoCv==null || this.body.idTipoCv==undefined || this.body.idTipoCv==="") || 
    (this.body.fechaDesde==null || this.body.fechaDesde==undefined) ||
    (this.body.descripcion==null || this.body.descripcion==undefined || this.body.descripcion==="")){
    this.resaltadoDatos=true;
    }
  }
}