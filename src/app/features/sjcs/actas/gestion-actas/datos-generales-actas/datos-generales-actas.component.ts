import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { ActasItem } from '../../../../../models/sjcs/ActasItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { DatePipe } from '@angular/common';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-datos-generales-actas',
  templateUrl: './datos-generales-actas.component.html',
  styleUrls: ['./datos-generales-actas.component.scss'],
  providers: [ConfirmationService]
})
export class DatosGeneralesActasComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  valueResolucion: Date;
  valueReunion: Date;
  valueAnio: String;
  valueNumero: String;
  valuePresidente: String;
  valueSecretario: String;
  annio: String;
  numero: String;
  miembros: String;
  observaciones: String;
  expedientes: String;
  expedientesActa: String;
  inicio: String;
  inicioAux: Date;
  fin: String;
  finAux: Date;
  numeroEjgAsociadosActa: Number;
  fechaResolucion: Date;
  fechaReunion: Date;



  @Input() permisoEscritura;

  datosFiltro: ActasItem = new ActasItem();  
  restablecerDatosFiltro: ActasItem = new ActasItem();  
  comboPresidente = [];
  comboSecretario = [];
  comboSufijo = [];

  //Resultados de la busqueda
  @Input() datos: ActasItem;
  @Input() modoEdicion;
  @Output() modoEdicionSend = new EventEmitter<any>();

  event = new EventEmitter<any>();

  codigoPostalValido: boolean = true;

  openFicha: boolean = true;
  historico: boolean = false;
  isDisabledProvincia: boolean = true;

  movilCheck: boolean = false

  body: ActasItem;
  bodyInicial: ActasItem;
  idComisaria;
  provinciaSelecionada: string;

  anioNum :String;
  comboProvincias;
  comboPoblacion;
  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones;


  visibleMovilValue: boolean = false;
  esDecanoValue: boolean = false;
  isCodigoEjisValue: boolean = false;
  disabledAnio : boolean = true;
  progressSpinner: boolean = false;

  disabledSave: boolean = true;
  editable : boolean = true;
  fechaActualAux : Date;
  fechaActual: String;

  controlComboSufijo : boolean = true;
  
  nombrePresidente;
  numCompleto: String;


  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices, private confirmationService: ConfirmationService,
    private translateService: TranslateService, private commonsService: CommonsService) {
     }

  ngOnInit() {
    console.log("Este es el objeto que se supone tiene los datos de la tabla", this.datos);
    console.log(this.datos)
    if(this.datos.anioacta == null || this.datos.anioacta == undefined ){
      this.datosFiltro.anioacta = this.getAnio();
      this.getNumActa();
      this.getComboPresidente();
    }else{
      this.editable = false;
      this.numCompleto= this.datos.numeroacta
      this.numAnio();
      this.getActa();
    }
    this.getComboSufijo();
    this.getComboSecretario();
    this.onDisabledSave();
    this.getFechaActual();
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()

    }
    
   }
   numAnio(){
     this.anioNum = this.translateService.instant("justiciaGratuita.maestros.calendarioLaboralAgenda.anio") +"/"+this.translateService.instant("gratuita.busquedaAsistencias.literal.numero");
   }
   getNumActa(){
    this.sigaServices
    .get("filtrosacta_getNumAca")
    //.get("filtrosejg_comboPresidente")
    .subscribe(
      n => {
       this.datosFiltro.numeroacta = n;
      },
      err => {
        console.log(err);
      }
    );
   }

   onChangeSufijo(){
    console.log(this.datosFiltro.sufijo);
    this.progressSpinner = true;
      this.sigaServices.post("filtrosacta_getNumAca", this.datosFiltro).subscribe(
        data => {
          this.datosFiltro.numeroacta = data.body;
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  
  }
  getAnio(){
    let fechaActual = new Date();
    let anio = fechaActual.getFullYear().toString()
    return anio;
  }
   getFechaActual(){
    this.fechaActualAux = new Date();
    this.fechaActual = this.numero2Cifras(this.fechaActualAux.getHours()) + ":"+ this.numero2Cifras(this.fechaActualAux.getMinutes());
    this.inicio = this.fechaActual;
    this.fin = this.fechaActual;
   }

   

   getComboPresidente() {
    this.sigaServices
      .get("filtrosejgcomision_comboPresidente")
      //.get("filtrosejg_comboPresidente")
      .subscribe(
        n => {
          this.comboPresidente = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboPresidente);
          this.nombrePresidente = this.comboPresidente.find(presidente => presidente.value == this.datosFiltro.idpresidente);
        },
        err => {
          console.log(err);
        }
      );
  }

  guardarActaDialogo() {

    this.confirmationService.confirm({
      message: '¿Estas seguro que quieres guardar el acta?',
      accept: () => {
        console.log("aceptado guardar acta");
        this.guardarActa();
      },
      reject: () => {
        console.log("rechazado guardar acta");
      }
  });
}

  guardarActa() {
    this.progressSpinner = true;
    this.datosFiltro.horainicio = this.inicio;
    this.datosFiltro.horafin = this.fin;
    this.sigaServices.post("filtrosacta_guardarActa", this.datosFiltro).subscribe(
      data => {

        if(JSON.parse(data.body).status == "OK"){
          this.datosFiltro.idacta = JSON.parse(data.body).error.url;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }else{
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(data.body).error.description);
        }

        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }


  restablecer() {

    this.datosFiltro =JSON.parse(JSON.stringify(this.restablecerDatosFiltro));
  }

  abrirActaDialogo() {

    this.confirmationService.confirm({
      message: '¿Estas seguro que quieres abrir el acta?',
      accept: () => {
        console.log("aceptado abrir acta");
        this.abrirActa();
      },
      reject: () => {
        console.log("rechazado abrir acta");
      }
  });
}

  abrirActa() {
    this.progressSpinner = true;
    this.sigaServices.post("filtrosacta_abrirActa", this.datosFiltro).subscribe(
      data => {

        if(JSON.parse(data.body).status == "OK"){
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.datosFiltro.fecharesolucion = null;
        }else{
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(data.body).error.description);

        }

        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  cerrarActaDialogo() {

    this.confirmationService.confirm({
      message: '¿Estas seguro que quieres cerrar el acta?',
      accept: () => {
        console.log("aceptado cerrar acta");
        this.cerrarActa();
      },
      reject: () => {
        console.log("rechazado cerrar acta");
      }
  });
}

   cerrarActa() {
    this.progressSpinner = true;
    this.sigaServices.post("filtrosacta_cerrarActa", this.datosFiltro).subscribe(
      data => {

        if(JSON.parse(data.body).status == "OK"){

          if(this.datosFiltro.fecharesolucion == null){
            this.datosFiltro.fecharesolucion = new Date();
          }
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }else{
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(data.body).error.description);

        }

        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }



  getActa() {
    let acta = {
      'anioacta': this.datos.anioacta,
      'idinstitucion': this.datos.idInstitucion,
      'idacta': this.datos.idacta
    };
    this.sigaServices.post("filtrosacta_getActa", acta).subscribe(
      n => {
          this.datosFiltro = JSON.parse(n.body);
          this.datosFiltro.fechareunion = new Date(JSON.parse(n.body).fechareunion);
          if(JSON.parse(n.body).fecharesolucion == null){
            this.datosFiltro.fecharesolucion = null;
          }else{
          this.datosFiltro.fecharesolucion = new Date(JSON.parse(n.body).fecharesolucion);
          } 
          this.inicioAux = new Date(JSON.parse(n.body).horainicioreunion);
          this.inicio = this.numero2Cifras(this.inicioAux.getHours()) + ":"+ this.numero2Cifras(this.inicioAux.getMinutes());
          this.finAux = new Date(JSON.parse(n.body).horafinreunion);
          this.fin = this.numero2Cifras(this.finAux.getHours()) + ":"+this.numero2Cifras(this.finAux.getMinutes());
          this.restablecerDatosFiltro = JSON.parse(JSON.stringify(this.datosFiltro));  
          this.getComboPresidente(); 
         //let date: Date = new Date(JSON.parse(n.body).horainicioreunion);
         //this.datosFiltro.horaInicio =  this.datePipe.transform((new Date(JSON.parse(n.body).horainicioreunion)));
         //this.datosFiltro.horaFin = this.datePipe.transform((new Date(JSON.parse(n.body).horafinreunion)));
        },
        err => {
          console.log(err);
        }
      );
  }

  numero2Cifras(numero: number){
    let n: String = null;
    if(numero < 10){
      n = "0" + numero.toString();
    }else{
      n=numero.toString();
    }
    return n;
  }



  getComboSufijo() {
    this.sigaServices
      .get("filtrosacta_comboSufijo")
      .subscribe(
        n => {
          if(n.error.code == 404 && n.error.description == 'Empty'){
            this.controlComboSufijo = false
          }else{
            this.comboSufijo = n.combooItems;
            this.datosFiltro.sufijo = this.comboSufijo[0].value;
            this.commonsService.arregloTildesCombo(this.comboSufijo);
          }

        },
        err => {
          console.log(err);
        }
      );
  }

  getComboSecretario() {
    this.sigaServices
      .get("filtrosejgcomision_comboSecretario")
      //.get("filtrosejg_comboSecretario")
      .subscribe(
        n => {
          this.comboSecretario = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboSecretario);
        },
        err => {
          console.log(err);
        }
      );
  }


  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    return fecha;
  }


  fillFechaResolucion(event) {
      this.datosFiltro.fecharesolucion = this.transformDate(event);
  }

  fillFechaReunion(event) {
      this.datosFiltro.fechareunion = this.transformDate(event);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  anadirEJGPendientesCAJG() {
    this.progressSpinner = true;
    this.sigaServices.post("filtrosacta_anadirEJGPendientesCAJG", this.datosFiltro).subscribe(
      data => {

        if(JSON.parse(data.body).status == "OK"){
          this.datosFiltro.pendientes = JSON.parse(data.body).error.description;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }else{
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(data.body).error.description);
        }

        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      });
  }


  openOutlook(dato) {
    let correo = dato.email;
    this.commonsService.openOutlook(correo);
  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  onDisabledSave() {
    if (this.datos.idacta != undefined && this.datos.idacta != "") {
      this.disabledSave = false;
    } else {
      this.disabledSave = true;
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

  clear() {
    this.msgs = [];
  }

 }
