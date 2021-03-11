import { Component, OnInit, Input, HostListener, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { TurnosItems } from '../../../../../models/sjcs/TurnosItems';
import { InscripcionesItems } from '../../../../../models/sjcs/InscripcionesItems';
import { CommonsService } from '../../../../../../app/_services/commons.service';

@Component({
  selector: 'app-filtrosinscripciones',
  templateUrl: './filtros-inscripciones.component.html',
  styleUrls: ['./filtros-inscripciones.component.scss']
})
export class FiltrosInscripciones implements OnInit {
  
  progressSpinner: boolean = false;
  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  filtroAux: InscripcionesItems = new InscripcionesItems();
  isDisabledMateria: boolean = true;
  isDisabledSubZona: boolean = true;
  turnos: any[] = [];
  disabledFechaHasta:boolean = true;
  partidoJudicial: string;
  resultadosPoblaciones: any;
  disabledestado: boolean = false;
  msgs: any[] = [];
  filtros: InscripcionesItems = new InscripcionesItems();
  jurisdicciones: any[] = [];
  areas: any[] = [];
  tiposturno: any[] = [];
  zonas: any[] = [];
  subzonas: any[] = [];
  materias: any[] = [];
  partidas: any[] = [];
  partidasJudiciales: any[] = [];
  grupofacturacion: any[] = [];
  comboPJ;
  comboEstados = [
    { label: "Pendiente de Alta", value: "0" },
    { label: "Alta", value: "1" },
    { label: "Pendiente de Baja", value: "2" },
    { label: "Baja", value: "3" },
    { label: "Denegada", value: "4" }
  ];
  usuarioBusquedaExpress = {​​​​​​​​​
    numColegiado: '',
    nombreAp: ''
  }​​​​​​​​​;

  textSelected: String = 'general.boton.seleccionar';
  @Input() permisos;
  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService) { }

  ngOnInit() {   
    if (this.persistenceService.getHistorico() != undefined) {
      this.filtros.historico = this.persistenceService.getHistorico();
      // this.isBuscar();
    }
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisos = this.persistenceService.getPermisos();
    }
    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      this.isBuscar();
    }

    this.sigaServices.get("inscripciones_comboTurnos").subscribe(
      n => {
        this.turnos = n.combooItems;
        let turnoInscripcion = JSON.parse(sessionStorage.getItem("idTurno"));
				if(turnoInscripcion != null && turnoInscripcion != undefined){
          this.turnos.forEach(turnoCombo =>{ 
            if(turnoCombo.value == turnoInscripcion){
              this.filtros.idturno = turnoCombo;
              
            }
          });
				}
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
      },
      err => {
        console.log(err);
      },()=>{
        if (sessionStorage.getItem("idTurno") != undefined) {
          this.filtros.idturno = JSON.parse(
            sessionStorage.getItem("idTurno")
          );
          this.isBuscar();
          sessionStorage.setItem("idTurno",undefined);
        }
      }
    );

    if(sessionStorage.getItem("buscadorColegiados")){​​

      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));

      this.usuarioBusquedaExpress.nombreAp=busquedaColegiado.nombre+" "+busquedaColegiado.apellidos;

      this.usuarioBusquedaExpress.numColegiado=busquedaColegiado.nColegiado;

    }​​

  }


  newInscripcion() {
    this.persistenceService.setFiltros(this.filtros);
    let isLetrado:boolean = false;
    if (
      sessionStorage.getItem("isLetrado") != null &&
      sessionStorage.getItem("isLetrado") != undefined
    ) {
      isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
    this.progressSpinner = true;
    /* this.persistenceService.setDatos(evento);
    sessionStorage.setItem("ncolegiado", JSON.stringify(evento)); */
    if(isLetrado)   this.router.navigate(["/gestionInscripciones"]);
    //EN PROCESO
    else this.router.navigate(["/gestionInscripciones"]);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  checkFilters() {
    if((this.filtros.estado == null ||
        this.filtros.estado == undefined) &&
      (this.filtros.abreviatura == null ||
        this.filtros.abreviatura == undefined ) &&
      (this.filtros.idturno == null ||
        this.filtros.idturno == undefined ) &&
      (this.filtros.fechadesde == null ||
        this.filtros.fechadesde == undefined ) &&
      (this.filtros.afechade == null ||
        this.filtros.afechade == undefined ) &&
      (this.filtros.abreviatura == null ||
        this.filtros.abreviatura == undefined ) &&
      ((<HTMLInputElement>document.querySelector("input[formControlName='nombreAp']")) != null) &&
      ((<HTMLInputElement>document.querySelector("input[formControlName='nombreAp']")).value == null ||
        (<HTMLInputElement>document.querySelector("input[formControlName='nombreAp']")).value == undefined ||
        (<HTMLInputElement>document.querySelector("input[formControlName='nombreAp']")).value == "")){
    this.showSearchIncorrect();
    return false;
    }
    else{
      // quita espacios vacios antes de buscar
      if (this.filtros.abreviatura != undefined && this.filtros.abreviatura != null) {
        this.filtros.abreviatura = this.filtros.abreviatura.trim();
      }
      if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
        this.filtros.nombre = this.filtros.nombre.trim();
      }

      return true;
    }
  }
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  isBuscar() {
    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux()
      this.busqueda.emit(false)
      this.commonsService.scrollTablaFoco('tablaFoco');
    }
  }

  transformaFecha(fecha) {
    if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(fecha);
      }
    } else {
      fecha = undefined;
    }

    return fecha;
  }

  fillFechaDesdeCalendar(event) {
    if(event != null){
      this.filtros.fechadesde = this.transformaFecha(event);
      this.disabledFechaHasta = false;
    }else{
      this.filtros.fechahasta = undefined;
      this.disabledFechaHasta = true;
    }
  
  }

  fillAfechaDeCalendar(event) {
    this.filtros.afechade = this.transformaFecha(event);
    if(this.filtros.afechade != undefined){
      this.filtros.estado = undefined;
      this.disabledestado = true;
    }else{
      this.disabledestado = false;
    }
  }

  fillFechaHastaCalendar(event) {
    this.filtros.fechahasta = this.transformaFecha(event);
  }

  showSearchIncorrect() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "cen.busqueda.error.busquedageneral"
      )
    });
  }

  clearFilters() {
    this.filtros.estado = undefined;
    this.filtros.idturno = undefined; 
    this.filtros.fechadesde = undefined;
    this.filtros.fechahasta = undefined;
    this.filtros.afechade = undefined;
    this.disabledestado = false;
    this.disabledFechaHasta = true;
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }

  clear() {
    this.msgs = [];
  }

}
