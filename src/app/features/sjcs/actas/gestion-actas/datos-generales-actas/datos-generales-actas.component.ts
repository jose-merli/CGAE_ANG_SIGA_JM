import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { ActasItem } from '../../../../../models/sjcs/ActasItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-datos-generales-actas',
  templateUrl: './datos-generales-actas.component.html',
  styleUrls: ['./datos-generales-actas.component.scss']
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
  inicio: Date;
  fin: Date;
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

  codigoPostalValido: boolean = true;

  openFicha: boolean = true;
  historico: boolean = false;
  isDisabledProvincia: boolean = true;

  movilCheck: boolean = false

  body: ActasItem;
  bodyInicial: ActasItem;
  idComisaria;
  provinciaSelecionada: string;


  comboProvincias;
  comboPoblacion;
  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones;


  visibleMovilValue: boolean = false;
  esDecanoValue: boolean = false;
  isCodigoEjisValue: boolean = false;

  progressSpinner: boolean = false;

  


  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private translateService: TranslateService, private commonsService: CommonsService) {
     }

  ngOnInit() {
    console.log("Este es el objeto que se supone tiene los datos de la tabla" + this.datos);
    this.getComboPresidente();
    this.getComboSufijo();
    this.getComboSecretario();
    this.getActa();
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()

    }
   }

   

   getComboPresidente() {
    this.sigaServices
      .get("filtrosejg_comboPresidente")
      .subscribe(
        n => {
          this.comboPresidente = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboPresidente);
        },
        err => {
          console.log(err);
        }
      );
  }

  guardarActa() {
    this.progressSpinner = true;
    this.sigaServices.post("filtrosejgacta_guardarActa", this.datosFiltro).subscribe(
      n => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      },
      err => {
        console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      },
      () => {
      }
    );
  }


  restablecer() {

    this.datosFiltro =JSON.parse(JSON.stringify(this.restablecerDatosFiltro));
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
    this.sigaServices
    this.sigaServices.post("filtrosacta_getActa", this.datos).subscribe(
      n => {
          this.datosFiltro = JSON.parse(n.body);
          this.datosFiltro.fechareunion = new Date(JSON.parse(n.body).fechareunion);
          if(JSON.parse(n.body).fecharesolucion == null){
            this.datosFiltro.fecharesolucion = null;
          }else{
          this.datosFiltro.fecharesolucion = new Date(JSON.parse(n.body).fecharesolucion);
          }
          this.restablecerDatosFiltro = JSON.parse(JSON.stringify(this.datosFiltro));
         //let date: Date = new Date(JSON.parse(n.body).horainicioreunion);
         //this.datosFiltro.horaInicio =  this.datePipe.transform((new Date(JSON.parse(n.body).horainicioreunion)));
         //this.datosFiltro.horaFin = this.datePipe.transform((new Date(JSON.parse(n.body).horafinreunion)));
        },
        err => {
          console.log(err);
        }
      );
  }



  getComboSufijo() {
    this.sigaServices
      .get("filtrosacta_comboSufijo")
      .subscribe(
        n => {
          this.comboSufijo = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboSufijo);
        },
        err => {
          console.log(err);
        }
      );
  }

  getComboSecretario() {
    this.sigaServices
      .get("filtrosejg_comboSecretario")
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

  disabledSave() {
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
