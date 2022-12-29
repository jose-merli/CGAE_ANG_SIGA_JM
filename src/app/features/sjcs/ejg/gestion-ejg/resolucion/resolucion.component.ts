import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { ResolucionEJGItem } from '../../../../../models/sjcs/ResolucionEJGItem';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { Router } from "@angular/router";
import { ConfirmationService } from 'primeng/api';
import { saveAs } from "file-saver/FileSaver";
import { ActasItem } from '../../../../../models/sjcs/ActasItem';
import { t } from '@angular/core/src/render3';
import { procesos_ejg } from '../../../../../permisos/procesos_ejg';

@Component({
  selector: 'app-resolucion',
  templateUrl: './resolucion.component.html',
  styleUrls: ['./resolucion.component.scss']
})
export class ResolucionComponent implements OnInit {
  @Input() modoEdicion;
  permisoEscritura: boolean = false;
  @Input() tarjetaResolucion: string;

  //[x : string] : any;

  openFicha: boolean = false;
  nuevo;
  body: EJGItem;
  bodyInicial: ResolucionEJGItem = new ResolucionEJGItem();
  resolucion: ResolucionEJGItem = new ResolucionEJGItem();
  msgs;
  comboActaAnnio = [];
  comboResolucion = [];
  comboFundamentoJurid = [];
  comboOrigen = [];
  comboPonente = [];
  isDisabledFundamentosJurid: boolean = true;
  fundamentoJuridicoDesc: String;
  ResolDesc: String;
  progressSpinner: boolean = false;
  habilitarActas: boolean = false;
  perfilCJG:boolean = false;
  usuario: any[] = [];
  resaltadoDatosGenerales: boolean = false;

  fichaPosible = {
    key: "resolucion",
    activa: false
  }

  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() newEstado = new EventEmitter();
  @Input() openTarjetaResolucion;


  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsServices: CommonsService, private translateService: TranslateService,
    private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit() {
    if (this.persistenceService.getDatos()) {
      this.modoEdicion = true;
      this.nuevo = false;
      this.body = this.persistenceService.getDatos();
      this.getResolucion(this.body);
      this.getHabilitarActasComision();
    } else {
      this.modoEdicion = false;
      this.nuevo = true;
      this.resolucion = new ResolucionEJGItem();
    }
    this.getComboPonente();
    this.getComboOrigen();
    this.checkPerfil();

    this.commonsServices.checkAcceso(procesos_ejg.resolucion)
      .then(respuesta => {
        this.permisoEscritura = respuesta;
      }
      ).catch(error => console.error(error));
  }

  checkPerfil(){
    this.sigaServices.get("usuario_logeado").subscribe(n => {
      this.usuario = n.usuarioLogeadoItem;
      if (this.usuario[0].idPerfiles.indexOf("CJG") > -1 ) {
        this.perfilCJG = true;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaResolucion == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  esFichaActiva(key) {

    return this.fichaPosible.activa;
  }
  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "resolucion" &&
      !this.activacionTarjeta
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  getResolucion(selected) {
    //this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getResolucion", selected).subscribe(
      n => {
        if (n.body != "") {
          this.resolucion = JSON.parse(n.body);
          this.bodyInicial = JSON.parse(n.body);
        } else { 
          this.resolucion = new ResolucionEJGItem(); 
          this.resolucion.requiereNotificarProc = true;
          this.resolucion.turnadoRatificacion = true;
          this.bodyInicial.requiereNotificarProc = true;
          this.bodyInicial.turnadoRatificacion = true;
        }
        if (this.resolucion.fechaPresentacionPonente != undefined)
          this.resolucion.fechaPresentacionPonente = new Date(this.resolucion.fechaPresentacionPonente);
        if (this.resolucion.fechaResolucionCAJG != undefined)
          this.resolucion.fechaResolucionCAJG = new Date(this.resolucion.fechaResolucionCAJG);
        if (this.resolucion.fechaRatificacion != undefined)
          this.resolucion.fechaRatificacion = new Date(this.resolucion.fechaRatificacion);
        if (this.resolucion.fechaNotificacion != undefined)
          this.resolucion.fechaNotificacion = new Date(this.resolucion.fechaNotificacion);

        this.getComboActaAnnio();
        if (this.resolucion.idTiporatificacionEJG != undefined) this.getComboFundamentoJurid();
        this.getComboResolucion();

        //Se desbloquea el desplegable de fundamento juridico si hay una resolucion seleccionada al inciar la tarjeta.
        if (this.resolucion.idTiporatificacionEJG != undefined && this.resolucion.idTiporatificacionEJG != null) this.isDisabledFundamentosJurid = false;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );
  }
  getComboResolucion() {
    this.sigaServices.get("filtrosejg_comboResolucion").subscribe(
      n => {
        this.comboResolucion = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboResolucion);
        let resol = this.comboResolucion.find(
          item => item.value == this.resolucion.idTiporatificacionEJG
        );
        if (resol != undefined)
          this.ResolDesc = resol.label;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboActaAnnio() {

    if(this.resolucion.annioActa != undefined && this.resolucion.idActa != undefined){
      this.sigaServices.getParam("gestionejg_comboActaAnnio", `?anioacta=${this.resolucion.annioActa}&idacta=${this.resolucion.idActa}`).subscribe(
        n => {
          this.comboActaAnnio = n.combooItems;
          this.commonsServices.arregloTildesCombo(this.comboActaAnnio);
        },
        err => {
        }
      );
    }

  
  }

  getHabilitarActasComision() {
    this.sigaServices.get("gestionejg_getHabilitarActa").subscribe(
      n => {
        this.habilitarActas = n;
      },
      err => {
      }
    )
  }

  onChangeResolucion() {
    this.comboFundamentoJurid = [];
    if (this.resolucion.idTiporatificacionEJG != undefined && this.resolucion.idTiporatificacionEJG != null) {
      this.isDisabledFundamentosJurid = false;
      this.resolucion.idFundamentoJuridico = null;
      this.getComboFundamentoJurid();
    } else {
      this.isDisabledFundamentosJurid = true;
      this.resolucion.idFundamentoJuridico = null;
    }
  }
  getComboFundamentoJurid() {
    this.sigaServices
      .getParam(
        "filtrosejg_comboFundamentoJurid",
        "?resolucion=" + this.resolucion.idTiporatificacionEJG
      )
      .subscribe(
        n => {
          this.comboFundamentoJurid = n.combooItems;
          this.commonsServices.arregloTildesCombo(this.comboFundamentoJurid);

          let fJuridico = this.comboFundamentoJurid.find(
            item => item.value == this.resolucion.idFundamentoJuridico
          );
          if (fJuridico != undefined)
            this.fundamentoJuridicoDesc = fJuridico.label;
        },
        error => { },
        () => { }
      );
  }
  getComboPonente() {
    this.sigaServices.get("filtrosejg_comboPonente").subscribe(
      n => {
        this.comboPonente = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboPonente);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboOrigen() {
    this.sigaServices.get("gestionejg_comboOrigen").subscribe(
      n => {
        this.comboOrigen = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboOrigen);
      },
      err => {
      }
    );
  }

  setCabecera() {
    let resol = this.comboResolucion.find(
      item => item.value == this.resolucion.idTiporatificacionEJG
    );
    if (resol != undefined) {
      this.ResolDesc = resol.label;
    }

    let fJuridico = this.comboFundamentoJurid.find(
      item => item.value == this.resolucion.idFundamentoJuridico
    );
    if (fJuridico != undefined)
      this.fundamentoJuridicoDesc = fJuridico.label;
  }

  disabledSave() {
    if (this.nuevo) {
      /*if (this.resolucion.fechaApertura != undefined) { 
        return false;
      } else {
        return true;
      }
      COMPROBAR LOS CAMPOS OBLIGATORIOS (EN PPIO NO HAY)
      */
    } else {
      if (this.permisoEscritura) {
        return false;
        /*if (this.resolucion.fechaApertura != undefined) {
          return false;
        } else {
          return true;
        }*/
      } else {
        return true;
      }
    }
  }


  checkPermisosSave() {
    
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disabledSave()) {
        this.msgs = this.commonsServices.checkPermisoAccion();
      } else {
        if(this.perfilCJG){
            //Se recupera la propiedad "edtablecomision" del ultimo estado del EJG
            let ejg = this.persistenceService.getDatos();
            this.progressSpinner = true;
            this.sigaServices.post("gestionejg_getEditResolEjg", ejg).subscribe(
              n => {
                //Se comprueba si el ultimo estado introducido tiene "edtablecomision" == 1 (resolucion editable)
                if(n.body == "true"){
                  this.save();
                }
                else{
                  //REVISAR: SUSTITUIR POR ETIQUETA
                  this.showMessage('error', 'Error', "El ultimo estado del EJG no permite editar resoluciones (editableComsion)");
                  this.progressSpinner = false;
                }
              },
              err => {
                //console.log(err);
                this.progressSpinner = false;
              }
            );
        }else{
          this.save();
        }
  

      }
    }
  }
  save() {
    this.progressSpinner = true;

    //this.body.nuevoEJG=!this.modoEdicion;

    this.resolucion.anio = Number(this.body.annio);
    this.resolucion.idTipoEJG = Number(this.body.tipoEJG);
    this.resolucion.numero = Number(this.body.numero);

    //Se debe extraer los valores que necesitamos del id del elemento del combo de actas seleccionado.
    if (this.resolucion.idAnnioActa != null) {
      //REVISAR POSIBLE MEJORA
      // let annioIdActa = this.resolucion.idAnnioActa.split("-")[0];
      // this.resolucion.idActa = Number(annioIdActa.split("/")[1]);
      // this.resolucion.annioActa = Number(annioIdActa.split("/")[0]);
      let array = this.resolucion.idAnnioActa.split(',');
      this.resolucion.annioActa = parseInt(array[1]);
      this.resolucion.idActa = parseInt(array[0]);
    }
    else {
      this.resolucion.idActa = null;
      this.resolucion.annioActa = null;
    }

    this.sigaServices.post("gestionejg_guardarResolucion", this.resolucion).subscribe(
      n => {
        this.progressSpinner = false;
        if (n.statusText == 'OK') {

          //Para que se actualicen los estados presentados en la tarjeta de estados
          this.newEstado.emit(null);

          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          //Para que se actualice la informacion si fuera necesario
          this.getResolucion(this.persistenceService.getDatos());
          this.setCabecera();
        } else {
          this.showMessage('error', 'Error', this.translateService.instant('general.message.error.realiza.accion'));
        }
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }
  checkPermisosConfirmRest() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.confirmRest();
    }
  }
  confirmRest() {
    let mess = this.translateService.instant(
      "justiciaGratuita.ejg.message.restablecerResolucion"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      key: "cd",
      accept: () => {
        this.rest()
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancelar",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  rest() {
    this.resolucion = JSON.parse(JSON.stringify(this.bodyInicial));
    this.isDisabledFundamentosJurid = (this.resolucion.idTiporatificacionEJG == null);
    if(this.resolucion.idTiporatificacionEJG != null){
      this.getComboFundamentoJurid();
    }
    if (this.resolucion.fechaPresentacionPonente != undefined)
      this.resolucion.fechaPresentacionPonente = new Date(this.resolucion.fechaPresentacionPonente);
    if (this.resolucion.fechaResolucionCAJG != undefined)
      this.resolucion.fechaResolucionCAJG = new Date(this.resolucion.fechaResolucionCAJG);
    if (this.resolucion.fechaRatificacion != undefined)
      this.resolucion.fechaRatificacion = new Date(this.resolucion.fechaRatificacion);
    if (this.resolucion.fechaNotificacion != undefined)
      this.resolucion.fechaNotificacion = new Date(this.resolucion.fechaNotificacion);
  }

  checkPermisosOpenActa() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.openActa();
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;

    }
  }

  openActa() {
    if(this.bodyInicial.idAnnioActa != null){
      let acta: ActasItem = new ActasItem();

      
    //Se escoge la acta guardada, no la que se tenga seleccionada en el desplegable sin guardar.
      this.sigaServices.get("institucionActual").subscribe(n => {
        acta.idinstitucion = n.value;

        acta.idacta = this.bodyInicial.idActa.toString();
        acta.anioacta = this.bodyInicial.annioActa.toString();
        acta.numeroacta = this.comboActaAnnio.find(
          el => el.value == this.bodyInicial.idAnnioActa
        ).label.split(" -")[0];

        localStorage.setItem('actasItem', JSON.stringify(acta));
        //Se crea una variable de entorno para el caso en el cual se vuelva desde la ficha de acta al EJG.
        sessionStorage.setItem("EJGItem", JSON.stringify(this.persistenceService.getDatos()));

        this.router.navigate(["/fichaGestionActas"]);
      });
      
    }
    else{
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("sjcs.actas.noActa"));
    }
  }

  clear() {
    this.msgs = [];
  }

  fillFechaPresPonente(event) {
    if (event != null){
      this.resolucion.fechaPresentacionPonente = new Date(event);
    }
    else{
      this.resolucion.fechaPresentacionPonente = null;
    }
  }

  fillFechaResCAJG(event) {
    if (event != null){
       this.resolucion.fechaResolucionCAJG = new Date(event);
    }
    else{
      this.resolucion.fechaResolucionCAJG = null;
    }
  }

  fillFechaResol(event) {
    let actaannio = this.comboActaAnnio.find(
      item => item.value == this.resolucion.idAnnioActa
    );
    let fechaActa = actaannio.label.split("-")[1];

    //Reasignamos la fecha al traerse del back en formato string
    //No se realiza directamente ya que la conversion de new Date con strings se realiza desde MM/DD/YYYY y se nos devuelve DD/MM/YYY desde el back
    if(!(fechaActa.trim() == "")){
      var dateParts = fechaActa.split("/");
      // var dateParts = fechaActa.split("/");

      //Escogemos actualizar esta fecha de resolucion basandonos en el comentario presente en su columna
      //en la BBDD en la tabla (SCS_EJG_RESOLUCION)
      this.resolucion.fechaResolucionCAJG = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    }
  }

  fillFechaNotif(event) {
    if (event != null){
      this.resolucion.fechaNotificacion = new Date(event);
    }
    else{
      this.resolucion.fechaNotificacion = null;
    }
  }

  fillFechaResFirme(event) {
    if (event != null) {
      this.resolucion.fechaRatificacion = new Date(event);
    }
    else{
      this.resolucion.fechaRatificacion = null;
    }
  }

  onChangeCheckT(event) {
    this.resolucion.turnadoRatificacion = event;
  }

  onChangeCheckR(event) {
    this.resolucion.requiereNotificarProc = event;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  descargarDocumentoResolucion() {
    this.progressSpinner = true;

    this.sigaServices.postDownloadFiles("gestionejg_descargarDocumentoResolucion", this.resolucion.docResolucion).subscribe(
      n => {
        this.progressSpinner = false;

        let blob = new Blob([n], { type: "application/zip" });
        saveAs(blob, this.resolucion.docResolucion);
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.general.error.ficheroNoExiste"));
      }
    );
  }
}
