import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MultiSelect } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { CalendarioProgramadoItem } from '../../../../../models/guardia/CalendarioProgramadoItem';
import { GuardiaItem } from '../../../../../models/guardia/GuardiaItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { AcreditacionesItem } from '../../../../../models/sjcs/AcreditacionesItem';
import { ConfiguracionCola, GlobalGuardiasService } from '../../guardiasGlobal.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-filtros-guardia-calendarios',
  templateUrl: './filtros-guardia-calendarios.component.html',
  styleUrls: ['./filtros-guardia-calendarios.component.scss']
})
export class FiltrosGuardiaCalendarioComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros = new CalendarioProgramadoItem();
  filtroAux = new CalendarioProgramadoItem();
  historico: boolean = false;

  isDisabledZona: boolean = true;
  isDisabledMateria: boolean = true;
  resultadosZonas: any;
  resultadosAreas: any;
  @Input() permisoEscritura;
  @Output() isOpen = new EventEmitter<boolean>();
  @Output() filtrosValues = new EventEmitter<CalendarioProgramadoItem>();
  comboTurno = [];
  comboGuardia = [];
  comboConjuntoGuardias = [];
  comboListaGuardias = [];
  comboEstado = [];
  KEY_CODE = {
    ENTER: 13
  }
  emptyFilters = true;
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} etiquetas seleccionadas";

  constructor(private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService,
    private globalGuardiasService: GlobalGuardiasService,
    private datePipe: DatePipe) { }

  ngOnInit() {
   this.emptyFilters = true;
    this.checkFilters();
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }


    this.getComboTurno()
    this.getComboEstado();
    this.getComboConjuntouardia();

    if (sessionStorage.getItem("filtrosBusquedaGuardiasFichaGuardia") != null) {

      this.filtros = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaGuardiasFichaGuardia")
      );
      if (this.filtros  ){
        if (!this.filtros.volver){
          let AnioAnterior = new Date().getFullYear() - 1;
          this.filtros.fechaCalendarioDesde = new Date(AnioAnterior, new Date().getMonth(), new Date().getDate());
          console.log('new Date().getMonth(): ', new Date().getMonth())
          console.log('new Date().getDate(): ', new Date().getDate())
        }
        this.getComboGuardia();
        this.search();
        sessionStorage.removeItem("filtrosBusquedaGuardiasFichaGuardia");
      }
  

     

      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      this.filtros = new CalendarioProgramadoItem();
      if (!this.filtros.volver){
      let AnioAnterior = new Date().getFullYear() - 1;
      this.filtros.fechaCalendarioDesde = new Date(AnioAnterior, new Date().getMonth(), new Date().getDate());
      console.log('new Date().getMonth(): ', new Date().getMonth())
      console.log('new Date().getDate(): ', new Date().getDate())
      }
    }

  }

  getComboTurno() {
    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurno);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboEstado() {
    this.comboEstado = [
      { label: "Pendiente", value: "5" },
      { label: "Programada", value: "1" },
      { label: "En proceso", value: "2" },
      { label: "Procesada con Errores", value: "3" },
      { label: "Generada", value: "4" }
    ];
    /*this.sigaServices.get("busquedaGuardia_estado").subscribe(
      n => {
        this.comboEstado = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboEstado);
      },
      err => {
        console.log(err);
      }
    );*/
  }

  onChangeTurno(event) {
    this.filtros.idGuardia = "";
    this.comboGuardia = [];
    this.checkFilters();
    if (this.filtros.idTurno) {
      this.getComboGuardia();
      //this.getComboListaGuardia();
    } 
  }

  getComboGuardia() {
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + this.filtros.idTurno).subscribe(
        data => {
          this.comboGuardia = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardia);
        },
        err => {
          console.log(err);
        }
      )

  }

  getComboConjuntouardia() {
    this.sigaServices.get(
      "busquedaGuardia_conjuntoGuardia").subscribe(
        data => {
          this.comboConjuntoGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboConjuntoGuardias);
        },
        err => {
          console.log(err);
        }
      )

  }
  
  //SE USA?
  getComboListaGuardia() {
    this.sigaServices.getParam(
      "busquedaGuardia_listasGuardia", "?idTurno=" + this.filtros.idTurno).subscribe(
        data => {
          this.comboListaGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboListaGuardias);
        },
        err => {
          console.log(err);
        }
      )

  }
  fillFechaCalendarioDesde(event) {
    this.checkFilters();
    this.filtros.fechaCalendarioDesde = event;
  }
  fillFechaCalendarioHasta(event) {
    this.checkFilters();
    this.filtros.fechaCalendarioHasta = event;
  }

  getFechaCalendarioHasta(fechaInputDesde, fechainputHasta) {
    if (
      fechaInputDesde != undefined &&
      fechainputHasta != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputDesde).getTime();
      let fechaHasta = new Date(fechainputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechainputHasta = undefined;
    }
    return fechainputHasta;
  }
  getFechaCalendarioDesde(fechaInputesde, fechaInputHasta) {
    if (
      fechaInputesde != undefined &&
      fechaInputHasta != undefined
    ) {
      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputesde).getTime();
      let fechaHasta = new Date(fechaInputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechaInputesde = undefined;
    }
    return fechaInputesde;
  }


  fillFechaProgramadaDesde(event) {
    this.checkFilters();
    this.filtros.fechaProgramadaDesde = event;
  }
  fillFechaProgramadaHasta(event) {
    this.checkFilters();
    this.filtros.fechaProgramadaHasta = event;
  }

  getFechaProgramadaHasta(fechaInputDesde, fechainputHasta) {
    if (
      fechaInputDesde != undefined &&
      fechainputHasta != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputDesde).getTime();
      let fechaHasta = new Date(fechainputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechainputHasta = undefined;
    }
    return fechainputHasta;
  }
  getFechaProgramadaDesde(fechaInputesde, fechaInputHasta) {
    if (
      fechaInputesde != undefined &&
      fechaInputHasta != undefined
    ) {
      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputesde).getTime();
      let fechaHasta = new Date(fechaInputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechaInputesde = undefined;
    }
    return fechaInputesde;
  }


  search() {
    let compareDateOk = -1;
    let compareDateHourOk = -1;
    console.log('search')
    if (this.filtros.fechaCalendarioDesde != undefined && this.filtros.fechaCalendarioHasta != undefined){
     compareDateOk = compareDate(this.changeDateFormat(this.formatDate2(this.filtros.fechaCalendarioDesde).toString()), this.changeDateFormat(this.formatDate2(this.filtros.fechaCalendarioHasta).toString()), true);
    }

    let objDate1 = null;
    let hour1 = null;
    let objDate2 = null;
    let hour2 = null;

    let fechaA = null;
    let fechaB = null;
    if (this.filtros.fechaProgramadaDesde != undefined && this.filtros.fechaProgramadaHasta != undefined){
     fechaA = this.formatDate(this.filtros.fechaProgramadaDesde);
     fechaB = this.formatDate(this.filtros.fechaProgramadaHasta);
    }
    if (fechaA!=undefined && fechaA != null){
      const dayA = fechaA.substr(0, 2) ;

      const monthA = fechaA.substr(3, 2);
      const yearA = fechaA.substr(6, 4);
      const hourA = fechaA.substr(11, 2);
      const minA = fechaA.substr(14, 2);
      const segA = fechaA.substr(17, 2);
      console.log("fecha a:"+ yearA+","+monthA+","+dayA +  "  " + hourA + ":" + minA + ":" + segA);
      objDate1= {  day: dayA,month: monthA, year: yearA};
      hour1={ hour: hourA,minute: minA,second: segA};
    }

    if (fechaB!=undefined && fechaB != null){
      const dayB = fechaB.substr(0, 2) ;
      const monthB = fechaB.substr(3, 2);
      const yearB = fechaB.substr(6, 4);
      const hourB = fechaB.substr(11, 2);
      const minB = fechaB.substr(14, 2);
      const segB = fechaB.substr(17, 2);
      console.log("fecha b:"+ yearB+","+monthB+","+dayB+  "  " + hourB + ":" + minB + ":" + segB);
      objDate2= {  day: dayB,month: monthB, year: yearB};
      hour2={ hour: hourB,minute: minB,second: segB};
   
    }
    if ( fechaA != null && fechaB != null){
        compareDateHourOk = compareDateHour(objDate1, hour1, objDate2, hour2, true);
    }
    //if (compareDateOk == -1 && compareDateHourOk == -1) {
      if (compareDateOk == -1 && compareDateHourOk == -1) {
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux();
      sessionStorage.setItem('filtrosBusquedaGuardias', JSON.stringify(this.filtros));
      this.isOpen.emit(false)
      this.filtrosValues.emit(Object.assign({},this.filtros));
      console.log('search ok', this.filtrosValues)
    }else{
      if (!this.checkFilters() ){
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      }else{
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Rango de fechas incorrecto. Debe cumplir que la fecha desde sea menor o igual que la fecha hasta");
      }
    }

  }

  nuevo() {
    let configuracionCola: ConfiguracionCola = {
      'manual': false,
      'porGrupos': false,
      'idConjuntoGuardia': null,
      "fromCombo": false
    };
     this.globalGuardiasService.emitConf(configuracionCola);
    let dataToSend = {
      'duplicar' : '',
      'tabla': [],
      'turno':'',
      'nombre': '',
      'generado': '',
      'numGuardias': '',
      'listaGuarias': {},
      'fechaDesde': '',
      'fechaHasta': '',
      'fechaProgramacion': null,
      'estado': 'Pendiente',
      'observaciones': '',
      'idCalendarioProgramado': null,
      'idTurno': '',
      'idGuardia': '',
    };
    this.persistenceService.setDatos(dataToSend);

    this.router.navigate(["/fichaProgramacion"]);
    /*if (this.permisoEscritura) {
      this.persistenceService.clearDatos();
      this.router.navigate(["/gestionGuardias"]);
    }*/
  }

  checkFilters() {

    if ((this.filtros.estado == null || this.filtros.estado == undefined) &&
      (this.filtros.fechaCalendarioDesde == null || this.filtros.fechaCalendarioDesde == undefined) &&
      (this.filtros.fechaCalendarioHasta == null || this.filtros.fechaCalendarioHasta == undefined) &&
      (this.filtros.fechaProgramadaDesde == null || this.filtros.fechaProgramadaDesde == undefined) &&
      (this.filtros.fechaProgramadaHasta == null || this.filtros.fechaProgramadaHasta == undefined) &&
      (this.filtros.listaGuardias == null || this.filtros.listaGuardias == undefined) &&
      (this.filtros.idTurno == null || this.filtros.idTurno == undefined) &&
      (this.filtros.idGuardia == null || this.filtros.idGuardia == undefined)) {
      this.emptyFilters = true;
      //this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.filtros.guardia != undefined && this.filtros.guardia != null) {
        this.filtros.guardia = this.filtros.guardia.trim();
      }
      this.emptyFilters = false;
      return true;
    }
  }

  clearFilters() {
    this.filtros = new CalendarioProgramadoItem();
    this.persistenceService.clearFiltros();
    this.isDisabledZona = true;
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

  rest() {
    this.emptyFilters = true;
    this.filtros = new CalendarioProgramadoItem();
    this.isDisabledMateria = true;
  }




  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === this.KEY_CODE.ENTER) {
      this.search();
    }
  }

  focusInputField(multiSelect: MultiSelect) {
    setTimeout(() => {
      multiSelect.filterInputChild.nativeElement.focus();
    }, 300);
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy HH:mm:ss';
      return this.datePipe.transform(date, pattern);
    }
  formatDate2(date) {
    const pattern = 'yyyy-MM-dd';
      return this.datePipe.transform(date, pattern);
    }
    changeDateFormat(date1){
      console.log('date1: ', date1)
      let year = date1.substring(0, 4)
      let month = date1.substring(5,7)
      let day = date1.substring(8, 10)
      let date2 = day + '/' + month + '/' + year;
      return date2;
    }



}


function compareDateHour(dateObj1,hour1,dateObj2,hour2, isAsc){

  let objDate1=new Date(dateObj1.year+'-'+dateObj1.month+"-"+dateObj1.day+
  " "+ hour1.hour +":" + hour1.minute + ":" + hour1.second + ".000Z");
  let objDate2=new Date(dateObj2.year+'-'+dateObj2.month+"-"+dateObj2.day+
  " "+ hour2.hour +":" + hour2.minute + ":" + hour2.second + ".000Z");

  //return (objDate1.getTime() / 1000) > (objDate2.getTime() / 1000) ? true :false;
  return ((objDate1.getTime() / 1000) < (objDate2.getTime() / 1000) ? -1 : 1) * (isAsc ? 1 : -1);
}

function compareDate (fechaA:  any, fechaB:  any, isAsc: boolean){

  let dateA = null;
  let dateB = null;
  if (fechaA!=null){
    const dayA = fechaA.substr(0, 2) ;
    const monthA = fechaA.substr(3, 2);
    const yearA = fechaA.substr(6, 10);
    console.log("fecha a:"+ yearA+","+monthA+","+dayA);
    dateA = new Date(yearA, monthA, dayA);
  }

  if (fechaB!=null){
    const dayB = fechaB.substr(0, 2) ;
    const monthB = fechaB.substr(3, 2);
    const yearB = fechaB.substr(6, 10);
    console.log("fecha b:"+ yearB+","+monthB+","+dayB);
    dateB = new Date(yearB, monthB, dayB);
  }

  console.log("comparacionDate isAsc:"+ isAsc+";");

  return compare(dateA, dateB, isAsc);

}
function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  console.log("comparacion  a:"+ a+"; b:"+ b);

  if (typeof a === "string" && typeof b === "string") {
    console.log("comparacion  de cadenas");
    a = a.toLowerCase();
    b = b.toLowerCase();
  }

  console.log("compare isAsc:"+ isAsc+";");

  if (a==null && b!=null){
    return ( 1 ) * (isAsc ? 1 : -1);
  }
  if (a!=null && b==null){
    return ( -1 ) * (isAsc ? 1 : -1);
  }

  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}