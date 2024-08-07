import { ChangeDetectorRef, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { TurnosItem } from '../../../../../../models/sjcs/TurnosItem';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { ColegiadoItem } from '../../../../../../models/ColegiadoItem';
import { PermutaItem } from '../../../../../../models/guardia/PermutaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { InscripcionesComponent } from '../../../../oficio/inscripciones/busqueda-inscripciones.component';
import { procesos_guardia } from '../../../../../../permisos/procesos_guarida';

@Component({
  selector: 'app-permutas-gestion-guardia-colegiado',
  templateUrl: './permutas-gestion-guardia-colegiado.component.html',
  styleUrls: ['./permutas-gestion-guardia-colegiado.component.scss']
})
export class PermutasGestionGuardiaColegiadoComponent implements OnInit {
  cols:  any = [];
  buscadores = [];
  rowsPerPage: any = [];
  selectMultiple: boolean;
  selectedDatos = [];
  selectedDatosAux = [];
  selectAll;
  numSelected: number = 0;
  selectedItem: number = 10;
  permisoEscritura: boolean;
  progressSpinner;
  msgs;
  permutas= [];;
  permu : PermutaItem = new PermutaItem();
  body: any;
  clickPermuta:boolean = false;
  comboTurnos;
  comboGuardias;
  valueComboTurno;
  valueComboGuardia
  motivos: any;
  permutasAux;
  esLetrado: boolean=true;
  esColegiado: boolean=true;
  validarTambien: boolean=false;
  // SIGARNV-2885 INICIO
  fechaSolicitanteInicio;
  // SIGARNV-2885 FIN
  yaValidada: boolean = false;
  openFicha : boolean = false;
  contPermutas : number = 0;
  constructor(private translateService: TranslateService,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonServices: CommonsService) { }

  //SIGARNV-2885 INICIO
  @Input() guardiaColegiado: GuardiaItem;
  //SIGARNV-2885 FIN
  @Output() refrescarFPermuta = new EventEmitter<any>();
  @Output() refrescarFicha = new EventEmitter<any>();

  async ngOnInit() {
    //this.progressSpinner = true;
    this.esLetrado = JSON.parse(sessionStorage.getItem('isLetrado'));
    this.esColegiado = JSON.parse(sessionStorage.getItem('esColegiado'));
    if (this.persistenceService.getDatos() || this.persistenceService.getDatosColeg()) {
     this.body = this.persistenceService.getDatosColeg() ? this.persistenceService.getDatosColeg() : this.persistenceService.getDatos();
     this.getPermutas();
     this.getComboTurno();
     if(this.valueComboTurno != null || this.valueComboTurno != undefined){
       this.getComboGuardia(this.valueComboTurno);
     }
    //  this.recuperaFechaSolicitante();
     this.getCols();
    }
    await this.commonServices.checkAcceso(procesos_guardia.guardias_colegiados_permutas)
    .then(respuesta => {
      this.permisoEscritura = respuesta;
    }
    ).catch(error => console.error(error)); 
    this.progressSpinner = false 
}

  getCols() {
    //SIGARNV-2885 INICIO
    this.cols = [
      { field: "fechasolicitud", header: "formacion.busquedaInscripcion.fechaSolicitud" },
      { field: "fechaconfirmacion", header: "general.cabecera.confirmacion" },
      { field: "turnoGuardiaSol", header: "dato.jgr.guardia.guardias.turno.sol" }, 
      { field: "LetradoFechSol", header: "dato.letrado.guardia.sol" },
      { field: "turnoGuardiaConf", header: "dato.jgr.guardia.guardias.turno.conf" }, 
      { field: "LetradoFechConf", header: "dato.letrado.guardia.conf" }, 
      // { field: "nombreTurno", header: "dato.jgr.guardia.guardias.turno" },
      // { field: "nombreGuardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      { field: "motivos", header: "dato.jgr.guardia.guardias.motivos" },
      //SIGARNV-2885 FIN
    ];
    this.cols.forEach(it => this.buscadores.push(""))
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
  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

  getPermutas(){
    let permutaItem2 = new PermutaItem();
    permutaItem2.idturno = Number(this.body.idTurno);
    permutaItem2.idguardia = Number(this.body.idGuardia);
    permutaItem2.idpersona = Number(this.body.idPersona);
    let myDate;
    if (this.body.fechadesde == "[object String]" && this.body.fechadesde.includes('/')) {
      let parts = this.body.fechadesde.split('/');
      myDate = new Date(parts[2], parts[1] - 1, parts[0]); 
    }
    else {
      myDate = new Date(this.body.fechadesde);
    }
    permutaItem2.fechasolicitud = myDate;

      //this.progressSpinner = true
      this.sigaServices.post("guardiasColegiado_getPermutasColegiado", permutaItem2).subscribe(
        n => {
          let error = JSON.parse(n.body).error;
          this.permutas = JSON.parse(n.body).permutaItems;
          if(this.permutas != null && this.permutas.length > 0){
            this.permu = this.permutas[0];
            this.contPermutas = this.permutas.length
          }

          this.progressSpinner = false;
          if (error != null && error.description != null) {
            this.showMessage( 'info',  this.translateService.instant("general.message.informacion"), error.description );
          }
        },
        err => {
          //console.log(err);
          this.progressSpinner = false
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }, () => {
          
        }
      );
  }

  isSelectMultiple() {
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
  }


  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    //this.table.reset();
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  checkValidar(){  
    
    let icon = "fa fa-edit";

    this.confirmationService.confirm({
      key: 'valida',
      message: '¿Desea validar las siguientes permutas?',
      icon: icon,
      accept: () => {
        this.validar()

      },
      reject: () => {
        this.msgs = [{
          severity: "info",
          summary: "Cancel",
          detail: this.translateService.instant("general.message.accion.cancelada")
        }];
        //this.restPermutas();

      }
    });
  
}

disableValidar(){
  //this.selectedDatos.length>0 && (this.valueComboGuardia && this.valueComboTurno && this.motivos)
  if(this.valueComboTurno && this.valueComboGuardia && !this.esLetrado && !this.esColegiado && this.permisoEscritura){
    if(this.yaValidada){
      return true;
    }else{
    return false;
    }
  }
  else{
    return true;   
  };
}

comprobarValidados(){
  this.yaValidada = false;
  this.selectedDatos.forEach(row =>{
   if(row.fechaconfirmacion !=undefined && row.fechaconfirmacion != ""){
    this.yaValidada = true;
   }
  
  })
}

  validar(){
     this.progressSpinner = true
    this.sigaServices.post("guardiasColegiado_validarPermuta", this.selectedDatos).subscribe(
      n => {
        sessionStorage.setItem("fechainicioConfirmador",this.selectedDatos[0].fechainicioConfirmador);
        sessionStorage.setItem("fechafinConfirmador",this.selectedDatos[0].fechainicioConfirmador); // El flujo no tiene en cuenta la fecha Fin, reusamos la de Inicio
        this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.restPermutas();
          this.getPermutas();
          this.validarTambien=false;
          this.refrescarFPermuta.emit(true);
          this.progressSpinner = false
          if(n.ok){
            this.validarTambien = false;
            this.refrescarFicha.emit(true);
          }
      },
      err => {
        //console.log(err);
        this.progressSpinner = false
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.validarTambien=false;
      }, () => {
        
      }
    );  
    
  }

  nuevaFila() {
    this.clickPermuta = true;
    this.selectedDatos = [];
  
    // Obtén la información del turno/guardia por el cual estás realizando la búsqueda
    const guardiaTurno = this.body.tipoTurno + " / " + this.body.tipoGuardia;

    // Encuentra el índice en el array comboTurnos donde el nombre coincide con el guardiaTurno
   // const indiceTurnoSeleccionado = this.comboTurnos.findIndex(turnoGuardia => turnoGuardia.label === tipoTurnoInfo);
   this.comboTurnos.forEach((turnoGuardia)=>{
    if(turnoGuardia.label.includes(guardiaTurno)){
      this.valueComboTurno = turnoGuardia.value;
      this.onChangeTurnos();
    }
  });    
  
    // if (indiceTurnoSeleccionado !== -1) {
    //   // Establece el valor predefinido del turno/guardia utilizando el índice encontrado
    //   this.valueComboTurno = this.comboTurnos[indiceTurnoSeleccionado];
    //   console.log("Valor de Combo Turno después de establecer:", this.valueComboTurno);
    //   this.onChangeTurnos(); // Actualiza el combo de guardias según el turno predefinido
    // } else {
    //   console.log("No se encontró el tipo de turno en el array comboTurnos.");
    // }
  
    let dummy = {
      fechaconfirmacion: "",
      fechasolicitud: "",
      nombreTurno: "",
      nombreGuardia: "",
      motivos: "",
      nuevoRegistro: true
    };
    this.permutasAux = this.permutas;
    this.permutas = [dummy, ...this.permutas];
    this.selectedDatos[0] = this.permutas[0];
  }

  checkPermutar(){
 
      let icon = "fa fa-edit";

      this.confirmationService.confirm({
        key: 'perm',
        message: '¿Desea añadir la siguiente Permuta?',
        icon: icon,
        accept: () => {
          this.permutaColegiado();

        },
        reject: () => {
          this.msgs = [{
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant("general.message.accion.cancelada")
          }];
          this.restPermutas();

        }
      });
    
  }

  check(){
    if(this.esColegiado){
      this.checkValidar();
    }else if(!this.esColegiado && !this.esLetrado && this.permisoEscritura){//Si no es letrado, no es colegiado y tiene permiso de escritura
      this.permutas.forEach(dato => {
        if(dato.nuevoRegistro){
          this.validarTambien=true; 
          this.checkPermutar();
        }
      });
      if(!this.validarTambien){
        this.checkValidar();
      }     
    }
  }
  permutaColegiado(){
    let datosConfirmador = this.valueComboGuardia.split('|');
    let permutaItem = new PermutaItem();
    permutaItem.idguardiaConfirmador = datosConfirmador[0].trim();
    permutaItem.fechainicioConfirmador = parseInt(datosConfirmador[4].trim());
    permutaItem.idturnoConfirmador = datosConfirmador[1].trim();
    permutaItem.idpersonaConfirmador = datosConfirmador[2].trim();
    permutaItem.idcalendarioguardiasConfirmad = datosConfirmador[3].trim();

    permutaItem.motivossolicitante = this.motivos;
    permutaItem.idpersonaSolicitante = this.body.idPersona;
    permutaItem.idguardiaSolicitante = this.body.idGuardia;
    permutaItem.idturnoSolicitante = this.body.idTurno;
    permutaItem.fechainicioSolicitante = this.body.fechadesde;
    permutaItem.idcalendarioguardiasSolicitan = this.body.idCalendarioGuardias;
    if(this.validarTambien){
      permutaItem.fechaconfirmacion = new Date();
    } 
    //console.log(permutaItem);

    this.progressSpinner = true
    this.sigaServices.post("guardiasColegiado_permutarGuardia", permutaItem).subscribe(
      n => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.restPermutas();
        this.getPermutas();
        if(this.validarTambien && n.ok){
          this.validarTambien = false;
          this.refrescarFicha.emit(true);
        }
      },
      err => {
        //console.log(err);
        this.progressSpinner = false
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.validarTambien=false;
      }, () => {
        
      }
     
    ); 

    console.log("El valor de valueComboGuardia: " + this.valueComboGuardia);
    console.log("El valor de valueComboTurno: " + this.valueComboTurno);
    /*
    if(this.validarTambien){
      //Buscamos de nuestras permutas la que acabamos de permutar para meterla en el array de seleccionadas y poder validarla
      this.checkValidar();
    }
    */
  }

  restPermutas(){
    this.selectedDatos = [];
    this.clickPermuta = false;
    
      this.permutas = this.permutasAux;
      this.permutasAux = [];
    
  }

  getComboTurno() {

    //this.progressSpinner = true;

    this.sigaServices.getParam("guardiasColegiado_getComboTurnoInscrito",'?idPersona='+ this.body.idPersona).subscribe(
      n => {
        this.comboTurnos = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurnos);
        //this.progressSpinner = false;
        // Preseleccionar el turno si ya hay un valor
      if (this.valueComboTurno) {
        this.onChangeTurnos(); // Llamamos al método para cargar las opciones del Guardia Confirmador
        
      }

      this.progressSpinner = false;

      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  // SIGARNV-2885 INICIO
  recuperaFechaSolicitante(){
    //this.progressSpinner = true;
    
    this.sigaServices.getParam("guardiasColegiado_getFechaSolicitante",'?idPersona='+ this.body.idPersona + '&idCalendarioGuardias=' + this.guardiaColegiado.idCalendarioGuardias + '&idGuardia=' + this.guardiaColegiado.idGuardia).subscribe(
      n => {
        this.fechaSolicitanteInicio = n; //n.fechaInicioSolicitante
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }
  // SIGARNV-2885 FIN

  getComboGuardia(turno) {
    //this.progressSpinner = true;
    let guardiaItem = new GuardiaItem();
    guardiaItem.idTurno = turno;
    guardiaItem.idCalendarioGuardias = this.body.idCalendarioGuardias;
    guardiaItem.fechadesde = new Date(this.body.fechadesde);
    guardiaItem.idGuardia = this.body.idGuardia;
    guardiaItem.idPersona = this.guardiaColegiado.idPersona;
    this.sigaServices.post(
      "guardiasColegiado_getComboGuardiaDestinoInscrito",guardiaItem).subscribe(
        data => {
          this.comboGuardias = JSON.parse(data.body).comboGuardiasFuturasItems; 

          this.commonServices.arregloTildesCombo(this.comboGuardias);
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }
      )
    
  }

  onChangeTurnos() {
    this.valueComboGuardia = "";
    this.comboGuardias = [];

    if (this.valueComboTurno) {
      //preseleccionar el turno en el menu desplegable
      this.getComboGuardia(this.valueComboTurno);
    }
  }

  changeDateFormat(fecha){
   if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[0] + "-" + splitDate[1] + "-" + splitDate[2];
        fecha = new Date(arrayDate);
      
    } else {
      fecha = undefined;
    }

    return fecha;
  }

  clear(){
    this.msgs = [];
  }
}
