import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { ConfirmationService } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../commons/translate';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { Router } from '@angular/router';
import { SigaConstants } from '../../../../../utils/SigaConstants';
import { Dialog } from 'primeng/primeng';
import { UnidadFamiliarEJGItem } from '../../../../../models/sjcs/UnidadFamiliarEJGItem';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { FichaSojItem } from '../../../../../models/sjcs/FichaSojItem';
import { ContrarioItem } from '../../../../../models/guardia/ContrarioItem';
@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss']
})
export class DatosGeneralesComponent implements OnInit, OnChanges {

  bodyInicial;
  progressSpinner: boolean = false;

  edadAdulta: number = 18;
  modoEdicion: boolean = false;
  msgs;
  comboTipoPersona;
  comboTipoIdentificacion;
  comboNacionalidad;
  comboIdiomas;
  comboSexo;
  comboEstadoCivil;
  comboRegimenConyugal;
  comboProfesion;
  comboMinusvalia;
  nuevoJusticiable: boolean = false;
  showConfirmacion: boolean = false;
  vieneDeJusticiable: boolean = false;
  creaNuevoJusticiable: boolean = false;
  idPersonaAntiguoJusticiable;

  justiciableBusquedaItem: JusticiableBusquedaItem;

  permisoEscritura: boolean = true;
  personaRepetida: boolean = false;
  modoRepre: boolean = false;
  searchJusticiable: boolean = false;
  nuevoInteresado: boolean = false;
  nuevoContrario: boolean = false;
  nuevoAsistido: boolean = false;
  nuevoContrarioAsistencia: boolean = false;
  nuevaUniFamiliar: boolean = false;
  nuevoContrarioEJG: boolean = false;
  nuevoSoj: boolean = false;

  @ViewChild("cdGeneralesUpdate") cdGeneralesUpdate: Dialog;
  @ViewChild("cdGeneralesSave") cdGeneralesSave: Dialog;

  @Output() modoEdicionSend = new EventEmitter<any>();
  @Output() notifySearchJusticiableByNif = new EventEmitter<any>();
  @Output() newJusticiable = new EventEmitter<any>();
  @Output() searchJusticiableOverwritten = new EventEmitter<any>();
  @Output() opened = new EventEmitter<Boolean>();  // Evento para abrir la tarjeta
  @Output() idOpened = new EventEmitter<String>(); // Evento para pasar la Información.
  @Output() actualizaAsunto = new EventEmitter<JusticiableItem>();
  @Output() bodyChange = new EventEmitter<JusticiableItem>();

  @Input() showTarjeta;
  @Input() fromJusticiable;
  @Input() fromUniFamiliar: boolean = false;
  @Input() body: JusticiableItem;
  @Input() modoRepresentante;
  @Input() checkedViewRepresentante;
  @Input() tarjetaDatosGenerales;  // Tarjeta Datos Generales para comprobar su estado.

  confirmationSave: boolean = false;
  confirmationUpdate: boolean = false;
  nuevoRepresentante: boolean = false;
  tipoPersona;
  guardaOpcion: String;
  menorEdadJusticiable: boolean = false;

  generalBody: UnidadFamiliarEJGItem;
  initialBody: UnidadFamiliarEJGItem;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location) { 


    }

  ngOnInit() {

    this.progressSpinner = true;

    if (sessionStorage.getItem("origin") == "newRepresentante") {
      this.nuevoRepresentante = true;
    } else if (sessionStorage.getItem("origin") == "newInteresado" || sessionStorage.getItem("origin") == "Interesado") {
      this.nuevoInteresado = true;
    } else if (sessionStorage.getItem("origin") == "newContrario" || sessionStorage.getItem("origin") == "Contrario") {
      this.nuevoContrario = true;
    } else if (sessionStorage.getItem("origin") == "newAsistido") {
      this.nuevoAsistido = true;
    } else if (sessionStorage.getItem("origin") == "newContrarioAsistencia" || sessionStorage.getItem("origin") == "Asistencia") {
      this.nuevoContrarioAsistencia = true;
    } else if (sessionStorage.getItem("origin") == "UnidadFamiliar") {
      this.nuevaUniFamiliar = true;
    } else if (sessionStorage.getItem("origin") == "newContrarioEJG" || sessionStorage.getItem("origin") == "ContrarioEJG") {
      this.nuevoContrarioEJG = true;
    } else if (sessionStorage.getItem("origin") == "newSoj") {
      this.nuevoSoj = true;
    }else {
      this.vieneDeJusticiable = true;
    }

    if (this.body != undefined && this.body.idpersona != undefined) {
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.parseFechas();
    } else {
      this.body = new JusticiableItem();
      if (sessionStorage.getItem("nif")) {
        this.body.nif = sessionStorage.getItem("nif");
        this.compruebaDNI();
        sessionStorage.removeItem("nif");
      }
    }

    //Obligatorio pais españa
    this.body.idpaisdir1 = "191";

    if (this.body.idpersona == undefined) {
      this.modoEdicion = false;
      this.body.fechaalta = new Date();
    } else {
      this.modoEdicion = true;
    }

    this.sigaServices.guardarDatosSolicitudJusticiable$.subscribe((data) => {
      this.body.autorizaavisotelematico = data.autorizaavisotelematico;
      this.body.asistidoautorizaeejg = data.asistidoautorizaeejg;
      this.body.asistidosolicitajg = data.asistidosolicitajg;
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    });

    this.getCombos();

    this.progressSpinner = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.progressSpinner = true;

    if (this.body != undefined) {
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.parseFechas();
    } else {
      this.body = new JusticiableItem();
    }

    //Obligatorio pais españa
    this.body.idpaisdir1 = "191";

    if (this.body.idpersona == undefined) {
      this.modoEdicion = false;
      this.body.fechaalta = new Date();
    } else {
      this.modoEdicion = true;
    }

    this.styleObligatorio(this.body.nombre);
    if (this.body.nif != undefined && this.body.nif != null && this.body.nif != "") {
      this.compruebaDNI();
    }

    // Comprobar que la tarjeta general venga rellena y la mostramos.
    if (this.tarjetaDatosGenerales == true) this.showTarjeta = this.tarjetaDatosGenerales;

    this.progressSpinner = false;
  }

  parseFechas() {
    if (this.body.fechanacimiento != undefined && this.body.fechanacimiento != null) {
      this.calculateAge();
      let fechaNacimiento = new Date(this.body.fechanacimiento);
      this.body.fechanacimiento = fechaNacimiento;
    }

    if (this.body.fechaalta != undefined && this.body.fechaalta != null) {
      let fechaAlta = new Date(this.body.fechaalta);
      this.body.fechaalta = fechaAlta;
    }

  }

  getCombos() {
    this.getComboSexo();
    this.getComboEstadoCivil();
    this.getComboTipoPersona();
    this.getComboIdiomas();
    this.getComboTiposIdentificacion();
    this.getComboProfesion();
    this.getComboRegimenConyugal();
    this.getComboMinusvalia();
  }

  checkInteresado(justiciable) {
    let interesados: any = sessionStorage.getItem("interesados");
    if (interesados != "") interesados = JSON.parse(interesados);
    let exist = false;

    let filtros: JusticiableBusquedaItem = new JusticiableBusquedaItem();

    if (this.persistenceService.getFiltrosAux() != undefined) {
      filtros = this.persistenceService.getFiltrosAux();
    }
    else filtros = this.persistenceService.getFiltros();

    if (interesados == "" || (filtros != null && filtros.idRol == "1")) exist = false;
    else {
      //Comprobamos que el justiciable no esta ya en la designacion
      interesados.forEach(element => {
        if (element.idPersona == justiciable.idpersona) exist = true;
      });
    }

    return !exist;
  }

  insertInteresado(justiciable) {
    this.progressSpinner = true;

    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    let datosInteresado = JSON.parse(sessionStorage.getItem("fichaJusticiable"));
    let idPersona;
    if(datosInteresado == null || datosInteresado.idPersona == null){
      idPersona = justiciable.idPersona;
    }else{
      idPersona = datosInteresado.idpersona;
    }
    // let request = [designa.idInstitucion, justiciable.idpersona, designa.ano, designa.idTurno, designa.numero];
    let request = [designa.idInstitucion, justiciable.idpersona, designa.ano, designa.idTurno, designa.numero, this.creaNuevoJusticiable, idPersona];

    this.sigaServices.post("designaciones_insertInteresado", request).subscribe(
      data => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        sessionStorage.removeItem('origin');
        sessionStorage.setItem('tarjeta', 'sjcsDesigInt');
        sessionStorage.setItem("creaInsertaJusticiableDesigna", "true");
        this.location.back();
      },
      err => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      }
    );
  }

  checkContrario(justiciable) {

    let contrarios: any = sessionStorage.getItem("contrarios");
    
    //Si ediamos el contrario como nuevo, recuperamos la informacion del objeto de sesion body
    if(this.creaNuevoJusticiable && (contrarios == null || contrarios == undefined)){
      contrarios = sessionStorage.getItem("body");
    }

    let exist = false;
    if (contrarios != "") contrarios = JSON.parse(contrarios);

    if (contrarios == null || contrarios == undefined || contrarios == "") exist = false;
    else {
      //Comprobamos que el justiciable no esta ya en la designacion
      if(this.creaNuevoJusticiable){
        if (contrarios.idPersona == justiciable.idpersona) exist = true;
      }else{
        contrarios.forEach(element => {
          if (element.idPersona == justiciable.idpersona) exist = true;
        });
      }
    }

    return !exist;
  }

  insertContrario(justiciable) {
    this.progressSpinner = true;

    let designa: any = JSON.parse(sessionStorage.getItem("designaItemLink"));
    let datosInteresado = JSON.parse(sessionStorage.getItem("fichaJusticiable"));

    // let request = [designa.idInstitucion, justiciable.idpersona, designa.ano, designa.idTurno, designa.numero];
    let request = [designa.idInstitucion, justiciable.idpersona, designa.ano, designa.idTurno, designa.numero, this.creaNuevoJusticiable, datosInteresado.idpersona];
    
    this.sigaServices.post("designaciones_insertContrario", request).subscribe(
      data => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        sessionStorage.removeItem('origin');
        sessionStorage.setItem('tarjeta', 'sjcsDesigContra');
        this.router.navigate(["/fichaDesignaciones"]);
      },
      err => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      }
    );
  }

  asociarAsistido(justiciable: JusticiableItem) {

    let idAsistencia = sessionStorage.getItem("asistenciaAsistido");
    if (idAsistencia) {
      this.sigaServices.postPaginado("busquedaGuardias_asociarAsistido", "?anioNumero=" + idAsistencia + "&actualizaDatos='S'", justiciable).subscribe(
        data => {
          this.progressSpinner = false;
          let result = JSON.parse(data["body"]);
          if (result.error) {
            this.showMessage('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.showMessage('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.router.navigate(["/fichaAsistencia"]);
          }
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
  }

  asociarContrarioAsistencia(justiciable: JusticiableItem) {

    let idAsistencia = sessionStorage.getItem("idAsistencia");
    sessionStorage.setItem('tarjeta', 'idAsistenciaContrarios');
    let justiciables: JusticiableItem[] = []
    justiciables.push(justiciable);

    if (idAsistencia) {
      //Si estamos editando un justiciable como nuevo
      if (this.creaNuevoJusticiable) {
        let contrarios: ContrarioItem[] = [];
        let contrarioI: ContrarioItem;

        //Recupero el justiciable antiguo editado
        let fichaJusticiable = JSON.parse(sessionStorage.getItem("fichaJusticiable"));

        let request = [idAsistencia, justiciable.idpersona, fichaJusticiable.idpersona];

        contrarios.push(contrarioI);

        this.sigaServices.post("busquedaGuardias_actualizarContrario", request).subscribe(
          data => {
            this.progressSpinner = false;
            let result = JSON.parse(data["body"]);
            if (result.error) {
              this.showMessage('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
            } else {
              this.showMessage('success', this.translateService.instant("general.message.accion.realizada"), '');
              this.router.navigate(["/fichaAsistencia"]);
            }
          },
          err => {
            this.progressSpinner = false;
          }
        );
      }

      //Creamos un justiciable desde cero
      else {
        this.sigaServices.postPaginado("busquedaGuardias_asociarContrario", "?anioNumero=" + idAsistencia, justiciables).subscribe(
          data => {
            this.progressSpinner = false;
            let result = JSON.parse(data["body"]);
            if (result.error) {
              this.showMessage('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
            } else {
              this.showMessage('success', this.translateService.instant("general.message.accion.realizada"), '');

              this.router.navigate(["/fichaAsistencia"]);
            }
          },
          err => {
            this.progressSpinner = false;
          }
        );
      }
    }
  }

  checkContrarioEJG(justiciable) {

    let contrarios: any = sessionStorage.getItem("contrariosEJG");

    //Si ediamos el contrario como nuevo, recuperamos la informacion del objeto de sesion contrarioEJG
    if(this.creaNuevoJusticiable && (contrarios == null || contrarios == undefined)){
      contrarios = sessionStorage.getItem("contrarioEJG");
    }

    let exist = false;
    if (contrarios != "") contrarios = JSON.parse(contrarios);

    if (contrarios == null || contrarios == undefined || contrarios == "") exist = false;
    else {
      //Comprobamos que el justiciable no esta ya en la designacion
      if(this.creaNuevoJusticiable){
        if (contrarios.idPersona == justiciable.idpersona) exist = true;
      } else{
        contrarios.forEach(element => {
          if (element.idPersona == justiciable.idpersona) exist = true;
        });
      }
    }

    return !exist;
  }

  insertContrarioEJG(justiciable) {
    this.progressSpinner = true;

    let ejg: EJGItem = this.persistenceService.getDatosEJG();

    // let request = [justiciable.idpersona, ejg.annio, ejg.tipoEJG, ejg.numero];
    let request = [justiciable.idpersona, ejg.annio, ejg.tipoEJG, ejg.numero, this.creaNuevoJusticiable, this.idPersonaAntiguoJusticiable];

    this.sigaServices.post("gestionejg_insertContrarioEJG", request).subscribe(
      data => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        sessionStorage.removeItem('origin');
        sessionStorage.setItem('tarjeta', 'contrariosPreDesigna');
        this.router.navigate(["/gestionEjg"]);
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      }
    );
  }

  checkUniFamiliar(justiciable) {
    let datosFamiliares: any = sessionStorage.getItem("datosFamiliares");
    if (datosFamiliares != "") datosFamiliares = JSON.parse(datosFamiliares);
    let exist = false;

    if (datosFamiliares == "" || datosFamiliares == null || datosFamiliares == undefined) 
      exist = false;
    else {
      //Comprobamos que el justiciable no esta ya en la designacion
      datosFamiliares.forEach(element => {
        if (element.uf_idPersona == justiciable.idpersona && element.fechaBaja == null) exist = true;
      });
    }

    return !exist;
  }

  insertUniFamiliar(justiciable) {
    this.progressSpinner = true;

    let ejg: EJGItem = this.persistenceService.getDatosEJG();
    let request = [ejg.idInstitucion, justiciable.idpersona, ejg.annio, ejg.tipoEJG, ejg.numero, this.creaNuevoJusticiable, this.idPersonaAntiguoJusticiable];

    this.sigaServices.post("gestionejg_insertFamiliarEJG", request).subscribe(
      data => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        //Para que se abra la tarjeta de unidad familiar y se haga scroll a ella
        sessionStorage.removeItem('origin');
        sessionStorage.setItem('tarjeta', 'unidadFamiliar');
        ejg.nombreApeSolicitante = this.body.apellido1 + " " + this.body.apellido2 + ", " + this.body.nombre;
        this.persistenceService.setDatosEJG(ejg);
        this.router.navigate(["/gestionEjg"]);
      },
      err => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error != null) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      }
    );
  }

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disabledSave()) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.save();
      }
    }
  }

  save() {

    this.progressSpinner = true;
    let url = "";
    this.body.validacionRepeticion = true;
    this.idPersonaAntiguoJusticiable = this.body.idpersona;

    if ((this.body.edad != undefined && JSON.parse(this.body.edad) < this.edadAdulta && this.body.idrepresentantejg != undefined) || this.body.edad == undefined
      || (this.body.edad != undefined && JSON.parse(this.body.edad) >= this.edadAdulta)) {
      this.menorEdadJusticiable = false;

    } else {
      this.menorEdadJusticiable = true;
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.asociarRepresentante.menorJusticiable"));
    }

    if (!this.modoEdicion) {
      //Si es menor no se guarda la fecha nacimiento hasta que no se le asocie un representante
      if (this.menorEdadJusticiable) {
        this.body.fechanacimiento = undefined;
        this.body.edad = undefined;
      }

      url = "gestionJusticiables_createJusticiable";
      this.validateCampos(url);
    } else {

      if (!this.menorEdadJusticiable) {
        url = "gestionJusticiables_updateJusticiable";
        //Comprueba que si autorizaavisotelematico el correo no se pueda borrar
        if (this.bodyInicial.autorizaavisotelematico == "1") {
          if (!(this.body.correoelectronico != undefined && this.body.correoelectronico != "")) {
            this.progressSpinner = false;
            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.justiciables.message.necesarioCorreoElectronico.recibirNotificaciones"));
          } else {
            if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1 && !this.vieneDeJusticiable && this.body.nif != null) {
              this.callConfirmationUpdate();
            } else {
              let url = "gestionJusticiables_updateJusticiable";
              this.validateCampos(url);
            }
          }
        } else {
          //Si tiene mas de un asunto preguntamos el dialog de guardar en todos o como nuevo
          if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1 && !this.vieneDeJusticiable && this.body.nif != null) {
            this.callConfirmationUpdate();
          } else {
            //Si no tiene mas asuntos directamente guardamos sin preguntar
            let url = "gestionJusticiables_updateJusticiable";
            this.validateCampos(url);
          }
        }
      } else {
        this.progressSpinner = false;
      }
    }
  }

  asociarJusticiable() {
    let icon = "fa fa-edit";
    /*let message = "¿ Deseas asociar el justiciable ?";//this.translateService.instant("justiciaGratuita.justiciables.message.cambiarTelefonoPreferente");

    this.confirmationService.confirm({
      key: "cdAsociarJusticiable",
      message: message,
      icon: icon,
      accept: () => {*/
        // Asociar para Interesados.
        if (this.nuevoInteresado) {
          if (this.checkInteresado(this.body)) {
            this.insertInteresado(this.body);
          } else {
            if(this.guardaOpcion != "s"){
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.interesados.existente"));
            }
          }
          
          // Asociar para Contrarios.
        } else if (this.nuevoContrario) {
          if (this.checkContrario(this.body)) {
            this.insertContrario(this.body);
          } else {
            if(this.guardaOpcion != "s"){
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.existente"));
            }
          }
          
          // Asociar para Asistido
        } else if (this.nuevoAsistido) {
          this.asociarAsistido(this.body);
          
          // Asociar para Nuevo Contrario Asistencia
        } else if (this.nuevoContrarioAsistencia) {
          if (this.checkContrario(this.body)) {
            this.asociarContrarioAsistencia(this.body);
          } else {
            if(this.guardaOpcion != "s"){
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.existente"));
            }
          }
         
          // Asociar para Nuevo Contrario EJG
        } else if (this.nuevoContrarioEJG) {
          if (this.checkContrarioEJG(this.body)) {
            this.insertContrarioEJG(this.body);
          } else {
            if(this.guardaOpcion != "s"){
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.existente"));
            }
          }
        }
        
        // Asociar para Nueva Unidad Familiar
        else if (this.nuevaUniFamiliar) {
          if (this.checkUniFamiliar(this.body)) {
            this.insertUniFamiliar(this.body);
          } else {
            if(this.guardaOpcion != "s"){
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.uniFamiliar.existente"));
            }
          }
        
        // Asociar para Nuevo Representante
        }else if (this.modoRepre) {
          this.persistenceService.clearBody();
          this.persistenceService.setBody(this.body);
          //sessionStorage.setItem("newRepresentante",JSON.stringify(evento));
          //this.router.navigate(["/gestionJusticiables"]);
          if (sessionStorage.getItem("fichaJust") != null) {
            sessionStorage.setItem("origin", sessionStorage.getItem("fichaJust"));
            sessionStorage.removeItem("fichaJust");
          }
        } else {
          let filtros: JusticiableBusquedaItem = new JusticiableBusquedaItem();
          if (filtros.idRol == "2") {
            let fichasPosibles = this.persistenceService.getFichasPosibles();
            fichasPosibles[6].activa = true;
            fichasPosibles[7].activa = true;
            this.persistenceService.setFichasPosibles(fichasPosibles);
          }
        }
      /*},
      reject: () => {
        this.showMessage("info", "Cancelada", this.translateService.instant("general.message.accion.cancelada"));
      }
    });*/
  }

  asociarSOJ(justiciable){
    let itemSojJusticiable = new FichaSojItem();
    if (sessionStorage.getItem("sojAsistido")) {
      let itemSoj = JSON.parse(sessionStorage.getItem("sojAsistido"));
      itemSojJusticiable.anio = itemSoj.anio;
      itemSojJusticiable.idTipoSoj = itemSoj.idTipoSoj;
      itemSojJusticiable.numero = itemSoj.numero;
      itemSojJusticiable.actualizaDatos = "S"; 
      itemSojJusticiable.justiciable = justiciable; 
    }
    if (itemSojJusticiable != undefined || itemSojJusticiable != null ) {
      this.sigaServices.post("gestionSoj_asociarSOJ", itemSojJusticiable).subscribe(
        data => {
          this.progressSpinner = false;
          let result = JSON.parse(data["body"]);
          if (result.error) {
            this.showMessage('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.showMessage('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.router.navigate(["/detalle-soj"]);
          }
        },
        err => {
          this.showMessage('error', this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          this.progressSpinner = false;
        }
      );
    }
  }

  validateCampos(url) {

    if (this.body.nombre != null && this.body.nombre != undefined) {
      this.body.nombre = this.body.nombre.trim();
    }

    if (this.body.apellido1 != null && this.body.apellido1 != undefined) {
      this.body.apellido1 = this.body.apellido1.trim();
    }

    if (this.body.apellido2 != null && this.body.apellido2 != undefined) {
      this.body.apellido2 = this.body.apellido2.trim();
    }

    if (this.body.codigopostal != null && this.body.codigopostal != undefined) {
      this.body.codigopostal = this.body.codigopostal.trim();
    }

    if (this.body.nif != null && this.body.nif != undefined) {
      this.body.nif = this.body.nif.trim();
    }

    if (this.body.direccion != null && this.body.direccion != undefined) {
      this.body.direccion = this.body.direccion.trim();
    }

    if (this.body.escaleradir != null && this.body.escaleradir != undefined) {
      this.body.escaleradir = this.body.escaleradir.trim();
    }

    if (this.body.pisodir != null && this.body.pisodir != undefined) {
      this.body.pisodir = this.body.pisodir.trim();
    }

    if (this.body.puertadir != null && this.body.puertadir != undefined) {
      this.body.puertadir = this.body.puertadir.trim();
    }

    if (this.body.puertadir != null && this.body.puertadir != undefined) {
      this.body.puertadir = this.body.puertadir.trim();
    }

    if (this.body.correoelectronico != null && this.body.correoelectronico != undefined) {
      this.body.correoelectronico = this.body.correoelectronico.trim();
    }

    if (this.body.fax != null && this.body.fax != undefined) {
      this.body.fax = this.body.fax.trim();
    }
    this.callSaveService(url);
  }

  callSaveService(url) {

    if (this.body.edad != undefined) {
      this.body.edad = this.body.edad;
    }

    if (!(this.body.fechanacimiento instanceof Date)) {
      this.body.fechanacimiento = null;
    }

    this.body.tipojusticiable = SigaConstants.SCS_JUSTICIABLE;
    this.body.validacionRepeticion = true;
    this.sigaServices.post(url, this.body).subscribe(
      data => {
        this.progressSpinner = false;

        //Si se manda un mensaje igual a C significa que el nif del justiciable introducido esta repetido 
        if (JSON.parse(data.body).error.message != "C") {

          if (!this.modoEdicion) {
            this.modoEdicion = true;
            let idJusticiable = JSON.parse(data.body).id;
            this.body.idpersona = idJusticiable;
            this.body.idinstitucion = this.authenticationService.getInstitucionSession();

            if (!this.modoRepresentante) {
              //Si estamos en la creacion de Datos Generales 
              if (sessionStorage.getItem("EJGItem")) {
                let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
                sessionStorage.setItem("EJGItem", JSON.stringify(ejg));
                this.persistenceService.setDatos(ejg);
              }
              //Si se esta editando Datos Generales desde su tarjeta en ejg
              else if (this.persistenceService.getDatos()) {
                let ejg: EJGItem = this.persistenceService.getDatos();
                this.persistenceService.setDatos(ejg);
              }

              this.newJusticiable.emit(this.body);
            }
          } else {
            if (this.modoRepresentante) {
              if (this.persistenceService.getBody() != undefined) {
                let representante = this.persistenceService.getBody();
                representante.nif = this.body.nif;
                this.persistenceService.setBody(representante);
              }
            }
          }

          if (this.modoRepresentante && !this.checkedViewRepresentante) {
            this.persistenceService.setBody(this.body);
            this.sigaServices.notifyGuardarDatosGeneralesRepresentante(this.body);
          } else if (this.modoRepresentante && this.checkedViewRepresentante) {
            this.sigaServices.notifyGuardarDatosGeneralesRepresentante(this.body);
          } else {
            this.bodyInicial = JSON.parse(JSON.stringify(this.body));
            this.sigaServices.notifyGuardarDatosGeneralesJusticiable(this.body);
          }

          if (!this.menorEdadJusticiable) {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          }
          this.preAsociarJusticiable();
        } else {
          this.callConfirmationSave(JSON.parse(data.body).id);
          // this.personaRepetida = true;
        }
        this.bodyChange.emit(this.body);
      },
      err => {
        this.progressSpinner = false;
        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
          if (JSON.parse(err.error).error.code == "600") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          }
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
      () => {
        //Actualizamos la Tarjeta Asuntos
        this.persistenceService.setDatos(this.body);
        this.actualizaAsunto.emit(this.body);
        sessionStorage.removeItem("nuevoJusticiable");
        if(this.vieneDeJusticiable && this.nuevoJusticiable){
          sessionStorage.setItem("origin", "Nuevo");
          this.router.navigate(["/gestionJusticiables"], { queryParams: { rp: "2" } });
        }
      }
    );
  }

  preAsociarJusticiable() {
    // Asociar solo si viene de EJG, Asistencia o Designa
    if (this.persistenceService.getDatosEJG() || sessionStorage.getItem("itemAsistencia") || sessionStorage.getItem("itemDesignas")) {
      this.asociarJusticiable();
      if (sessionStorage.getItem("itemAsistencia")) {
        sessionStorage.removeItem("itemAsistencia");
      }
      if (sessionStorage.getItem("itemDesignas")) {
        sessionStorage.removeItem("itemDesignas");
      }
    }else if(this.nuevoSoj){
      this.asociarSOJ(this.body);
    }
  }

  callConfirmationSave(id) {
    this.progressSpinner = false;
    this.confirmationSave = true;
    this.confirmationService.confirm({
      key: "cdGeneralesSave",
      message: this.translateService.instant("gratuita.personaJG.mensaje.existeJusticiable.pregunta.crearNuevo"),
      icon: "fa fa-search ",
      accept: () => {
        this.confirmationSave = false;
        this.progressSpinner = true;
        let url = "gestionJusticiables_createJusticiable";
        //Ya estavalidada la repeticion y puede crear al justiciable
        this.body.validacionRepeticion = true;
        this.callSaveService(url);
        this.cdGeneralesSave.hide();
      },
      reject: () => {
      }
    });
  }

  callConfirmationUpdate() {
    this.progressSpinner = false;
    this.confirmationUpdate = true;
    this.showConfirmacion = true;
  }

  reject() {

    if (this.confirmationUpdate) {
      this.confirmationUpdate = false;
      this.progressSpinner = true;
      this.modoEdicion = false;
      let url = "gestionJusticiables_createJusticiable";
      this.body.asuntos = undefined;
      this.body.datosAsuntos = [];
      this.body.numeroAsuntos = undefined;
      this.body.ultimoAsunto = undefined;
      //Ya estavalidada la repeticion y puede crear al justiciable
      this.body.validacionRepeticion = true;
      this.body.asociarRepresentante = true;
      this.validateCampos(url);
      this.cdGeneralesUpdate.hide();
    } else if (this.confirmationSave) {
      this.confirmationSave = false;

      this.progressSpinner = true;
      let url = "gestionJusticiables_createJusticiable";
      //Ya esta validada la repeticion y puede crear al justiciable
      this.body.validacionRepeticion = true;
      this.body.asociarRepresentante = true;
      this.callSaveService(url);
      this.cdGeneralesSave.hide();
    }
  }

  getComboMinusvalia() {
    this.sigaServices.get("gestionJusticiables_comboMinusvalias").subscribe(
      n => {
        this.comboMinusvalia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboMinusvalia);
      }
    );
  }

  getComboProfesion() {
    this.sigaServices.get("gestionJusticiables_comboProfesiones").subscribe(
      n => {
        this.comboProfesion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProfesion);
      }
    );
  }

  getComboRegimenConyugal() {
    this.comboRegimenConyugal = [
      { label: "Indeterminado", value: "I" },
      { label: "Gananciales", value: "G" },
      { label: "Separación de bienes", value: "S" }
    ];

    this.commonsService.arregloTildesCombo(this.comboRegimenConyugal);

    // Asignar por defecto el regimen conyugal(Indeterminado).
    if (sessionStorage.getItem("nuevoJusticiable")) {
      this.body.regimenConyugal = this.comboRegimenConyugal[0].value;
      this.nuevoJusticiable = true;
    }
  }

  getComboTipoPersona() {
    this.comboTipoPersona = [
      { label: "Física", value: "F" },
      { label: "Jurídica", value: "J" }
    ];
    // Asignar por defecto el Valor Física.
    if (sessionStorage.getItem("nuevoJusticiable")) {
      this.body.tipopersonajg = this.comboTipoPersona[0].value;
      this.tipoPersona = this.comboTipoPersona[0].value;
      this.nuevoJusticiable = true;
    }
    this.commonsService.arregloTildesCombo(this.comboTipoPersona);
  }

  getComboSexo() {
    this.comboSexo = [
      { label: "Hombre", value: "H" },
      { label: "Mujer", value: "M" },
      { label: "No Consta", value: "N" }
    ];

    // Asignar por defecto el sexo(No-Consta).
    if (sessionStorage.getItem("nuevoJusticiable")) {
       this.body.sexo = this.comboSexo[2].value;
       this.nuevoJusticiable = true;
    }
  }

  getComboTiposIdentificacion() {
    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      n => {
        this.comboTipoIdentificacion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoIdentificacion);
      }
    );
  }

  getComboEstadoCivil() {
    this.sigaServices.get("fichaColegialGenerales_estadoCivil").subscribe(
      n => {
        this.comboEstadoCivil = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboEstadoCivil);
        // Asignar por defecto el estado civil(Desconocido).
        if (sessionStorage.getItem("nuevoJusticiable")) {
          this.body.idestadocivil = this.comboEstadoCivil[1].value;
          this.nuevoJusticiable = true;
        }
      }
    );
  }

  getComboIdiomas() {
    this.sigaServices.get("etiquetas_lenguaje").subscribe(
      n => {
        this.comboIdiomas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboIdiomas);
      }
    );
  }

  compruebaDNI() {

    if (this.body.nif != undefined && this.body.nif.trim() != "" && this.body.nif != null) {
      if (this.commonsService.isValidDNI(this.body.nif)) {
        this.body.idtipoidentificacion = "10";
        return true;
      } else if (this.commonsService.isValidPassport(this.body.nif)) {
        this.body.idtipoidentificacion = "30";
        return true;
      } else if (this.commonsService.isValidNIE(this.body.nif)) {
        this.body.idtipoidentificacion = "40";
        return true;
      } else if (this.commonsService.isValidCIF(this.body.nif)) {
        this.body.idtipoidentificacion = "20";
        return true;
      } else {
        this.body.idtipoidentificacion = "30";
        return true;
      }
    } else {
      this.body.idtipoidentificacion = undefined;
    }
  }

  getLabelbyFilter(string): string {
    /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, para poder filtrar el dato con o sin estos caracteres*/
    let labelSinTilde = string;
    let accents = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
    let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    let i;
    let x;
    for (i = 0; i < string.length; i++) {
      if ((x = accents.indexOf(string.charAt(i))) != -1) {
        labelSinTilde = string.replace(string.charAt(i), accentsOut[x]);
        return labelSinTilde;
      }
    }
    return labelSinTilde;
  }

  checkPermisosRest() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
  }

  rest() {
    if (this.modoEdicion) {
      if (this.bodyInicial != undefined) this.body = JSON.parse(JSON.stringify(this.bodyInicial));
      this.parseFechas();
    } else {
      this.body = new JusticiableItem();
    }
    this.body.idpaisdir1 = "191";
  }

  fillFechaNacimiento(event) {
    if (event != null && event != undefined) {
      this.body.fechanacimiento = event;
      this.calculateAge();
    } else {
      this.body.edad = undefined;
    }
  }

  calculateAge() {
    let hoy = new Date();
    let cumpleanos = new Date(this.body.fechanacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }

    if (edad < 0) {
      this.body.edad = "0";
    } else {
      this.body.edad = JSON.stringify(edad);
    }
  }

  searchJusticiableByNif() {

    if (this.body.nif.trim() != undefined && this.body.nif.trim() != "") {
      let bodyBusqueda = new JusticiableBusquedaItem();
      bodyBusqueda.nif = this.body.nif;
      this.notifySearchJusticiableByNif.emit(bodyBusqueda);
    }
  }

  search() {
    this.persistenceService.clearBody();
    this.router.navigate(["/justiciables"], { queryParams: { rp: "2" } });
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

  disabledSave() {
    if (this.body.nombre != undefined && this.body.nombre.trim() != "" &&
      this.body.apellido1 != undefined && this.body.apellido1.trim() != "" &&
      this.body.tipopersonajg != undefined && this.body.tipopersonajg != "") {

      if(this.body.telefonos != null && this.body.telefonos.length > 0){
        for (let i = 0; i < this.body.telefonos.length; i++){
          if(this.body.telefonos[i].numeroTelefono === undefined || this.body.telefonos[i].numeroTelefono === ""){
            this.body.telefonos.splice(i, 1);
          }
        }
      }

      return false;
    } else {
      return true;
    }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta; // Funcionalidad para mostrar contenido de la Tarjeta pulsando a la misma.
    this.opened.emit(this.showTarjeta);   // Emit donde pasamos el valor de la Tarjeta Resumen.
    this.idOpened.emit('datosGenerales'); // Constante para abrir la Tarjeta de Resumen.
  }

  styleObligatorio(evento) {
    if ((evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }
  muestraCamposObligatorios() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
  }

  guardar(){
    if(this.guardaOpcion=="s"){
      
      this.progressSpinner = true;
      this.confirmationUpdate = false;
      let url = "gestionJusticiables_updateJusticiable";
      this.validateCampos(url);
      
    }else if(this.guardaOpcion=="n"){

      //Creamos un nuevo justiciable y actualizamos la relacion de Asunto del justiciable antiguo por el nuevo
      this.modoEdicion = false;
      this.modoRepresentante = true;  
      this.confirmationSave = false;
      this.confirmationUpdate = false;
      this.progressSpinner = true;
      let url = "gestionJusticiables_createJusticiable";
     
      //Ya esta validada la repeticion y puede crear al justiciable
      this.body.validacionRepeticion = true;
      this.body.asociarRepresentante = true;
      this.showConfirmacion = false;
      
      //Indicamos que venimos como nuevo Justiciable editando
      this.creaNuevoJusticiable = true;
      this.callSaveService(url);
    }
    this.showConfirmacion = false;
  }

  cancelar(){
    this.showConfirmacion = false;
  }
}