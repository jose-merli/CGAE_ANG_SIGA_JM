import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { DatosGeneralesConsultaItem } from '../../../../../models/DatosGeneralesConsultaItem';
import { DestinatariosItem } from '../../../../../models/DestinatariosItem';
import { Location } from "@angular/common";
import { SigaServices } from "./../../../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { Subject } from "rxjs/Subject";
import { ModelosComConsultasItem } from '../../../../../models/ModelosComConsultasItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { ServicioDetalleItem } from '../../../../../models/ServicioDetalleItem';
import { Router } from '@angular/router';
import { QueryBuilderDTO } from '../../../../../models/QueryBuilderDTO';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-datos-generales-consulta",
  templateUrl: "./datos-generales-consulta.component.html",
  styleUrls: ["./datos-generales-consulta.component.scss"]
})
export class DatosGeneralesConsultaComponent implements OnInit {


  openFicha: boolean = true;
  editar: boolean;
  esDuplicar: boolean;
  editMode: boolean = false;
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  body: DatosGeneralesConsultaItem = new DatosGeneralesConsultaItem();
  bodyInicial: DatosGeneralesConsultaItem = new DatosGeneralesConsultaItem();
  bodyDestinatario: DestinatariosItem = new DestinatariosItem();
  modulos: any[];
  objetivos: any[];
  clasesComunicaciones: any[];
  idiomas: any[];
  institucionActual: any;
  msgs: Message[];
  generica: string;
  constructorConsultaExperta: string;
  @Output() emitConstructorConsultaExperta = new EventEmitter<string>();
  listaModelos: any = [];
  progressSpinner: Boolean = false;
  resaltadoDatos: boolean = false;
  @ViewChild("table") table: DataTable;
  selectedDatos;

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "modelos",
      activa: false
    },
    {
      key: "plantillas",
      activa: false
    },
    {
      key: "consultas",
      activa: false
    }
  ];

  private consultasRefresh = new Subject<any>();
  consultasRefresh$ = this.consultasRefresh.asObservable();
  servicioDetalle: ServicioDetalleItem = new ServicioDetalleItem();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.resaltadoDatos=true;
    this.getMode();
    this.getInstitucion();
    this.getDatos();
    this.getModulos();
    this.getClasesComunicaciones();
    this.getObjetivos();

    this.selectedItem = 4;

    this.getIdioma();
    if (sessionStorage.getItem("listadoModelos") != undefined) {
      this.listaModelos = JSON.parse(sessionStorage.getItem("listadoModelos"));
    }

    if(sessionStorage.getItem("servicioDetalle") != undefined){
      this.servicioDetalle = JSON.parse(sessionStorage.getItem("servicioDetalle"));
      this.body.nombre = this.servicioDetalle.descripcion;
      this.body.idModulo = "3";//PONGO CENSO PROVISIONAL COMO MODULO
      this.body.idObjetivo = "3";
      this.cargaComboClaseCom("3");
      this.body.idClaseComunicacion = "1";
      this.generica = 'N';

      if(sessionStorage.getItem("precioDetalle") != undefined){
        let precioDetalle = JSON.parse(sessionStorage.getItem("precioDetalle"));
        this.body.nombre = this.servicioDetalle.descripcion + " " + precioDetalle.descripcionprecio;
      }

    }

    this.cols = [
      {
        field: "consulta",
        header: "informesycomunicaciones.consultas.ficha.consulta"
      },
      {
        field: "finalidad",
        header: "informesycomunicaciones.plantillasenvio.ficha.finalidad"
      },
      {
        field: "tipoEjecucion",
        header: "informesycomunicaciones.consultas.ficha.tipoEjecucion"
      }
    ];

    this.datos = [
      {
        id: "1",
        consulta: "prueba",
        finalidad: "prueba",
        tipoEjecucion: "prueba"
      },
      {
        id: "2",
        consulta: "prueba",
        finalidad: "prueba",
        tipoEjecucion: "prueba"
      }
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

    // this.body.idConsulta = this.consultas[1].value;
  }

  getMode() {
    if (sessionStorage.getItem("soloLectura") === 'true') {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }

  queryBuilderDTO: QueryBuilderDTO = new QueryBuilderDTO();
  subscriptionGuardarDatosConstructor: Subscription;
  estabaPulsadoConsultaExperta: boolean;
  
  emitUsoConstructorConsultaExperta(){
    if(this.estabaPulsadoConsultaExperta == true && this.constructorConsultaExperta == 'constructor'){
      let keyConfirmation = "deletePlantillaDoc";

      this.queryBuilderDTO.consulta = "";
      this.queryBuilderDTO.idconsulta = this.body.idConsulta.toString();

      this.confirmationService.confirm({
        key: keyConfirmation,
        message: "Al cambiar al constructor de consultas eliminara la consulta y empezara de cero, ¿esta seguro?",
        icon: "fa fa-trash-alt",
        accept: () => {
          this.progressSpinner = true;

          this.subscriptionGuardarDatosConstructor = this.sigaServices.post("constructorConsultas_guardarDatosConstructor", this.queryBuilderDTO).subscribe(
            response => {
      
              if (response.status == 500) {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
              } else {
                this.emitConstructorConsultaExperta.emit(this.constructorConsultaExperta);
                this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              }
      
              this.progressSpinner = false;
            },
            err => {
              this.progressSpinner = false;
            },
            () => {}
          );
        },
        reject: () => {
          this.constructorConsultaExperta = 'consultaExperta';
          this.msgs = [
            {
              severity: "info",
              summary: "info",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    }else{
      this.emitConstructorConsultaExperta.emit(this.constructorConsultaExperta);
    }
  }

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "",
      detail: this.translateService.instant(mensaje)
    });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "",
      detail: this.translateService.instant(mensaje)
    });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "info",
      summary: "",
      detail: this.translateService.instant(mensaje)
    });
  }

  clear() {
    this.msgs = [];
  }

  //Inicializa las propiedades necesarias para el dialogo de confirmacion
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      if (sessionStorage.getItem("crearNuevaConsulta") != null) {
        if (this.institucionActual != '2000')
          this.generica = 'N';

        else
          this.generica = 'S';
      }
      this.habilitarBotones();
    },
      err => {
        console.log(err);
      }
    );
  }

  asignaGenerica() {
    this.body.generica = this.generica;
  }

  getIdioma() {
    this.sigaServices.get("etiquetas_lenguaje").subscribe(
      n => {
        this.idiomas = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getClasesComunicaciones() {
    let msg = "Seleccionar todo";
    if (this.body.idModulo != undefined && this.body.idModulo != "") {
      this.cargaComboClaseCom(null);
    } else {
      this.clasesComunicaciones = [];
    }
  }

  cargaComboClaseCom(event) {
    this.onlyCheckDatos();
    if (event != null) {
      if(event.value != null){
        this.body.idModulo = event.value;
      }else if (sessionStorage.getItem("servicioDetalle") != undefined){
        this.body.idModulo = event;
      }
    }

    this.sigaServices
      .getParam(
        "consultas_claseComunicacionesByModulo",
        "?idModulo=" + this.body.idModulo
      )
      .subscribe(
        data => {
          this.clasesComunicaciones = data.combooItems;
          /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
          this.clasesComunicaciones.map(e => {
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
        },
        err => {
          console.log(err);
        }
      );
  }

  getModulos() {
    this.sigaServices.get("consultas_comboModulos").subscribe(
      data => {
        this.modulos = data.combooItems;
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.modulos.map((e) => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  getObjetivos() {
    this.sigaServices.get("consultas_comboObjetivos").subscribe(
      data => {
        this.objetivos = data.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  abreCierraFicha() {
    if(!this.openFicha){
      this.onlyCheckDatos();
    }
    // fichaPosible.activa = !fichaPosible.activa;
    this.openFicha = !this.openFicha;
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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
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

  onRowSelect() {
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    }
  }

  addConsulta() {
    let obj = {
      consulta: null,
      finalidad: null,
      tipoEjecucion: null
    };
    this.datos.push(obj);
    this.datos = [...this.datos];
  }

  backTo() {
    this.location.back();
  }

  getDatos() {
    if (sessionStorage.getItem("consultasSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("consultasSearch"));
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      if (this.body.generica == "Si" || this.body.generica == "S" || this.body.generica == "1") {
        this.generica = "S";
      } else {
        this.generica = "N";
      }
    } else {
      this.editar = true;
    }
  }

  habilitarBotones() {
    if (this.institucionActual != '2000' && (
      (this.body.generica == "Si" && sessionStorage.getItem("esDuplicar") === 'false' || this.body.generica == "Si") ||
      (this.body.generica == "S" && sessionStorage.getItem("esDuplicar") === 'false' || this.body.generica == "S")) ||
      this.body.generica == "1" ||
      (sessionStorage.getItem("soloLectura") == 'true' && sessionStorage.getItem("esDuplicar") === 'false') || sessionStorage.getItem("soloLectura") == 'true') {
      this.editar = false;
    } else {
      this.editar = true;
    }
    if (this.editar == false) {
      this.sigaServices.notifyRefreshEditar();
    }
    // }else{
    //   this.esDuplicar = true;
    //   this.sigaServices.notifyRefreshEditar();
    // }
  }

  confirmEdit() {
    this.onlyCheckDatos();
    let mess = this.translateService.instant("informesYcomunicaciones.consultas.datosGenerales.mensaje.cambio.modeloComunicacion");
    let icon = "fa fa-info";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.progressSpinner = true;
        this.resaltadoDatos=false;
        this.bodyInicial.generica = this.body.generica;
        this.actualizaGenerica();
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

  actualizaGenerica() {
    let cuerpo;
    if (this.listaModelos != undefined) {
      for (let i in this.listaModelos) {
        // if (this.listaModelos[i].generacionExcel == '1') {
        cuerpo = this.listaModelos[i];
        if (this.body.generica == 'S' || this.body.generica == 'SI') {
          cuerpo.idInstitucion = '0'
        } else {
          cuerpo.idInstitucion = '2000';
        }
        this.sigaServices
          .post("modelos_detalle_datosGenerales", cuerpo)
          .subscribe(
            data => {
              this.showSuccess(
                "informesycomunicaciones.modelosdecomunicacion.ficha.correctGuardado"
              );
            },
            err => {
              console.log(err);
              this.showFail(
                "informesycomunicaciones.modelosdecomunicacion.ficha.errorGuardado"
              );
            }, () => {
              this.guardar();
            }
          );
        //}
      }
    }
  }

  guardar() {
    this.onlyCheckDatos();
    this.body.generica = this.generica;
    if (this.bodyInicial.generica == undefined) {
      this.bodyInicial.generica = this.body.generica;
    }
    if (this.body.generica != this.bodyInicial.generica[0]) {
      this.confirmEdit();
    } else {
      if (this.body.generica == 'S' || this.body.generica == 'SI') {
        this.body.idInstitucion = '0'
      } else {
        this.body.idInstitucion = '2000';
      }

      this.progressSpinner = true;
      this.resaltadoDatos=false;

      this.sigaServices.post("consultas_guardarDatosGenerales", this.body).subscribe(
        data => {

          let result = JSON.parse(data["body"]);
          this.body.idConsulta = result.message;
          this.body.sentencia = result.description;
          this.body.idInstitucion = result.infoURL;
          this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          sessionStorage.removeItem("crearNuevaConsulta");
          sessionStorage.setItem("consultaEditable", "S");
          sessionStorage.setItem("consultasSearch", JSON.stringify(this.body));
          this.showSuccess('informesycomunicaciones.consultas.ficha.correctGuardadoConsulta');
          this.sigaServices.notifyRefreshConsulta();
          this.sigaServices.notifyRefreshModelos();
        },
        err => {
          this.showFail(this.translateService.instant('informesycomunicaciones.consultas.ficha.errorGuardadoConsulta'));
          console.log(err);
        },
        () => {
          if(sessionStorage.getItem("servicioDetalle") != undefined || sessionStorage.getItem("precioDetalle") != undefined){
            sessionStorage.setItem("vieneDeNuevaCondicion", "true");
            this.router.navigate(["/fichaServicios"]);
          }
          this.progressSpinner = false;
        }
      );
    }
  }

  restablecer() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.resaltadoDatos=false;
    this.getDatos();
    // this.body.generica = "S";
  }

  activaRestablecer() {
    if (JSON.stringify(this.body) == JSON.stringify(this.bodyInicial)) {
      return false;
    } else {
      return true;
    }
  }

  activaGuardar() {
    if (JSON.stringify(this.body) != JSON.stringify(this.bodyInicial)) {
      if (this.body.nombre != "" && this.body.nombre != undefined && this.body.idModulo != undefined && this.body.idModulo != ""
        && this.body.descripcion != "" && this.body.descripcion != undefined && this.body.idObjetivo != "" && this.body.idObjetivo != undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isButtonDisabled() {
    if (this.body.idModulo != null && this.body.idModulo != '' && this.body.descripcion != null && this.body.descripcion != ''
      && this.body.idObjetivo != null && this.body.idObjetivo != '' && this.body.nombre != null && this.body.nombre != '') {
      return false;
    }
    return true;
  }

  onChangeObjetivo() {
    this.onlyCheckDatos(); 
    //sessionStorage.setItem("consultasSearch", JSON.stringify(this.body));
  }

  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento==undefined || evento==null || evento=="")){
      return this.commonsService.styleObligatorio(evento);
    }
  }
  muestraCamposObligatorios(){
    this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios')}];
    this.resaltadoDatos=true;
  }

  checkDatos(){
    if(!this.activaGuardar()){
      if(JSON.stringify(this.body) != JSON.stringify(this.bodyInicial)){
        this.muestraCamposObligatorios();
      }else{
        if((this.body.idModulo==undefined || this.body.idModulo==null || this.body.idModulo==="") || (this.body.nombre==undefined || this.body.nombre==null || this.body.nombre==="") || (this.body.idObjetivo==undefined || this.body.idObjetivo==null || this.body.idObjetivo==="") || (this.body.descripcion==undefined || this.body.descripcion==null || this.body.descripcion==="")){
          this.muestraCamposObligatorios();
        }else{
          this.guardar();
        }
      }
    }else{
      if((this.body.idModulo==undefined || this.body.idModulo==null || this.body.idModulo==="") || (this.body.nombre==undefined || this.body.nombre==null || this.body.nombre==="") || (this.body.idObjetivo==undefined || this.body.idObjetivo==null || this.body.idObjetivo==="") || (this.body.descripcion==undefined || this.body.descripcion==null || this.body.descripcion==="")){
        this.muestraCamposObligatorios();
      }else{
        this.guardar();
      }
    }
  }

  onlyCheckDatos(){
    if(!this.activaGuardar()){
      if(JSON.stringify(this.body) != JSON.stringify(this.bodyInicial)){
        this.resaltadoDatos=true;
      }else{
        if((this.body.idModulo==undefined || this.body.idModulo==null || this.body.idModulo==="") || (this.body.nombre==undefined || this.body.nombre==null || this.body.nombre==="") || (this.body.idObjetivo==undefined || this.body.idObjetivo==null || this.body.idObjetivo==="") || (this.body.descripcion==undefined || this.body.descripcion==null || this.body.descripcion==="")){
          this.resaltadoDatos=true;
        }
      }
    }else{
      if((this.body.idModulo==undefined || this.body.idModulo==null || this.body.idModulo==="") || (this.body.nombre==undefined || this.body.nombre==null || this.body.nombre==="") || (this.body.idObjetivo==undefined || this.body.idObjetivo==null || this.body.idObjetivo==="") || (this.body.descripcion==undefined || this.body.descripcion==null || this.body.descripcion==="")){
        this.resaltadoDatos=true;
      }
    }
  }
}
