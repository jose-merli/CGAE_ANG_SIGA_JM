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

  avisoMail: boolean = false
  emailValido: boolean = true;
  tlf1Valido: boolean = true;
  tlf2Valido: boolean = true;
  faxValido: boolean = true;
  mvlValido: boolean = true;
  edicionEmail: boolean = false;
  myDate = new Date();


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
    this.getComboProvincias();

    this.validateHistorical();
   }

   

   getComboPresidente() {
    this.sigaServices
      .get("filtrosejg_comboPresidente")
      .subscribe(
        n => {
          console.log("************************************************************************************getComboPresidente**************");
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
    this.sigaServices.post("filtrosejg_guardarActa", this.datosFiltro).subscribe(
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


  abrirActa() {
    this.progressSpinner = true;
    this.sigaServices.post("filtrosejg_abrirActa", this.datosFiltro).subscribe(
      data => {

        if(JSON.parse(data.body).status == "OK"){
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

   cerrarActa() {
    this.progressSpinner = true;
    this.sigaServices.post("filtrosejg_cerrarActa", this.datosFiltro).subscribe(
      data => {

        if(JSON.parse(data.body).status == "OK"){
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
    this.sigaServices.post("filtrosejg_getActa", this.datos).subscribe(
      n => {
          console.log("************************************************************************************getActa**************");
          this.datosFiltro = JSON.parse(n.body);
          this.datosFiltro.fechaReunion = new Date(JSON.parse(n.body).fechareunion);
          this.datosFiltro.fechaResolucion = new Date(JSON.parse(n.body).fecharesolucion);

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
      .get("filtrosejg_comboSufijo")
      .subscribe(
        n => {
          console.log("************************************************************************************getComboSufijo**************");
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
          console.log("**************************************************************************************getComboSecretario**************");
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
    if (event != null) {
      this.datosFiltro.fechaResolucion = this.transformDate(event);
    }
  }

  fillFechaReunion(event) {
    if (event != null) {
      this.datosFiltro.fechaReunion = this.transformDate(event);
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  ngAfterViewInit(): void {

  }
  validateHistorical() {
    if (this.persistenceService.getDatos() != undefined) {

      if (this.persistenceService.getDatos().fechabaja != null || this.persistenceService.getDatos().institucionVal != undefined) {
        this.historico = true;
      } else {
        this.historico = false;
      }
    }
  }

  getComboProvincias() {
    this.progressSpinner = true;

    this.sigaServices.get("busquedaComisarias_provinces").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProvincias);
        this.progressSpinner = false;

      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
      }
    );
  }

  anadirEJGPendientesCAJG() {
    this.progressSpinner = true;
    this.sigaServices.post("filtrosejg_anadirEJGPendientesCAJG", this.datos).subscribe(
      n => {
        this.datos = JSON.parse(n.body).actasItems;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      });
  }

  onChangeProvincia() {

   
  }

  onChangePoblacion() {
   
  }

  buscarPoblacion(e) {
  }

  getComboPoblacion(dataFilter) {
   
  }

  checkPermisosSave() {
   
  }

  save() {
    this.progressSpinner = true;
    let url = "";

    if (!this.modoEdicion) {
      url = "gestionComisarias_createComisaria";
      this.callSaveService(url);

    } else {
      url = "gestionComisarias_updateComisarias";
      this.callSaveService(url);
    }

  }

  cambiaMovil() {
  
  }

  callSaveService(url) {
    

  }

  onChangeCodigoPostal() {
    
  }

  isValidCodigoPostal(): boolean {
     return (true
    );
  }

  checkPermisosRest() {
    
  }

  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.changeEmail();

    this.tlf1Valido = true
    this.tlf2Valido = true
    this.faxValido = true
  }

  editEmail() {
    if (this.edicionEmail)
      this.edicionEmail = false;
    else this.edicionEmail = true;
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

  changeEmail() {
    
  }

  changeTelefono1() {
   }

  changeTelefono2() {
    }

  changeFax() {
   }
  onChangeDireccion() {
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
