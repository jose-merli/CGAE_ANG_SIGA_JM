import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { BajasTemporalesItem } from '../../../../../models/sjcs/BajasTemporalesItem';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-filtros-bajas-temporales',
  templateUrl: './filtros-bajas-temporales.component.html',
  styleUrls: ['./filtros-bajas-temporales.component.scss']
})
export class FiltrosBajasTemporales implements OnInit {

  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  filtroAux: BajasTemporalesItem = new BajasTemporalesItem();
  isDisabledMateria: boolean = true;
  isDisabledSubZona: boolean = true;
  turnos: any[] = [];
  disabledFechaHasta:boolean = true;
  disabledFechaSolicitudHasta:boolean = true;
  partidoJudicial: string;
  resultadosPoblaciones: any;
  disabledestado: boolean = false;
  msgs: any[] = [];
  filtros: BajasTemporalesItem = new BajasTemporalesItem();
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
  comboTipo = [
    { label: "Vacaciones", value: "V" },
    { label: "Maternidad", value: "M" },
    { label: "Baja", value: "B" },
    { label: "Suspensión por sanción", value: "S" }
  ];
  comboEstados = [
    { label:"Denegado", value:"0"},
    { label:"Validado", value:"1"},
    { label:"Pendiente", value:"2"},
  ]

  usuarioBusquedaExpress = {​​​​​​​​​
    numColegiado: '',
    nombreAp: ''
  }​​​​​​​​​;

  
  showModalNuevaBaja = false;


  @Input() permisos;
  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService) { }

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
    
    if(sessionStorage.getItem("buscadorColegiados")){​​

      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));

      this.usuarioBusquedaExpress.nombreAp=busquedaColegiado.nombre+" "+busquedaColegiado.apellidos;

      this.usuarioBusquedaExpress.numColegiado=busquedaColegiado.nColegiado;

    }​​

  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  checkFilters() {
    // quita espacios vacios antes de buscar
    // if (this.filtros.abreviatura != undefined && this.filtros.abreviatura != null) {
    //   this.filtros.abreviatura = this.filtros.abreviatura.trim();
    // }
    // if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
    //   this.filtros.nombre = this.filtros.nombre.trim();
    // }
    return true;

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
  fillFechaSolicitudDesdeCalendar(event) {
    if(event != null){
      this.filtros.fechasolicituddesde = this.transformaFecha(event);
      this.disabledFechaSolicitudHasta = false;
    }else{
      this.filtros.fechasolicitudhasta = undefined;
      this.disabledFechaSolicitudHasta = true;
    }
  
  }

  fillAfechaDeCalendar(event) {
    this.filtros.fechadesde = this.transformaFecha(event);
    if(this.filtros.fechadesde != undefined){
      this.filtros.estado = undefined;
      this.disabledestado = true;
    }else{
      this.disabledestado = false;
    }
  }

  fillFechaHastaCalendar(event) {
    this.filtros.fechahasta = this.transformaFecha(event);
  }

  fillFechaHastaSolicitudCalendar(event) {
    this.filtros.fechasolicitudhasta = this.transformaFecha(event);
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
    this.filtros.fechadesde = undefined;
    this.filtros.fechahasta = undefined;
    this.filtros.fechasolicituddesde = undefined;
    this.filtros.fechasolicitudhasta = undefined;
    this.filtros.tipo = undefined;
    this.disabledFechaHasta = true;
    this.disabledFechaSolicitudHasta = true;
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
