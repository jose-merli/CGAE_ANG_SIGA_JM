import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { GuardiaColegiadoItem } from '../../../../../models/guardia/GuardiaColegiadoItem';
import { GuardiaItem } from '../../../../../models/guardia/GuardiaItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { MultiSelect } from 'primeng/primeng';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { BusquedaColegiadoExpressComponent } from '../../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.component';
import { ViewChild } from '@angular/core';
import { SigaStorageService } from '../../../../../siga-storage.service';

@Component({
  selector: 'app-filtros-guardia-colegiado',
  templateUrl: './filtros-guardia-colegiado.component.html',
  styleUrls: ['./filtros-guardia-colegiado.component.scss']
})
export class FiltrosGuardiaColegiadoComponent implements OnInit {
  msgs;
  progressSpinner: boolean = false;
  showDatosGenerales: boolean;
  filtros = new GuardiaItem();
  filtroAux = new GuardiaItem();
  comboTurno;
  comboGuardia;
  isDisabledGuardia;
  comboValidar = [
    { label: 'SI', value: 0 },
    { label: 'NO', value: 1 }
  ];
  disabledBusquedaExpress: boolean = false;
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  KEY_CODE = {
    ENTER: 13
  }
  permisos;
  textSelected: String = '{0} opciones seleccionadas';
  textFilter: string = "Seleccionar";
  @Input('permisoEscritura') permisoEscritura = false;
  @Input() dataBuscador = { 
    'guardia': '',
    'turno': '',
    'fechaDesde': '',
    'fechaHasta': ''
}
  @Input() isColegiado: boolean;

  @Output() isOpen = new EventEmitter<boolean>();

  colegInfo;
  numColeg;
  nomColeg;
  vieneDelMenu: boolean = false;
  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService,
    private localStorageService: SigaStorageService) { }

  ngOnInit() {
    if(sessionStorage.getItem("ProcedenciaGuardiasColegiado") == "true"){
      this.persistenceService.clearFiltros();
      this.vieneDelMenu = true;
      sessionStorage.setItem("ProcedenciaGuardiasColegiado", "false");
    }
    sessionStorage.removeItem("volver");
    sessionStorage.removeItem("modoBusqueda");
    this.isColegiado = this.localStorageService.isLetrado;
    this.progressSpinner = true;
    this.showDatosGenerales = true;
    this.getCombos()
    if (this.permisoEscritura != undefined) {
      this.permisos = this.permisoEscritura
    }
    this.progressSpinner = false;
    this.filtros.fechadesde = new Date( new Date().setFullYear(new Date().getFullYear()-1)); 
    if (this.persistenceService.getFiltros() != undefined && !this.vieneDelMenu) {
      this.filtros = this.persistenceService.getFiltros();
      if(this.filtros.fechadesde != null || this.filtros.fechadesde != undefined) {
        this.filtros.fechadesde = new Date(this.filtros.fechadesde);
      }
      if(this.filtros.fechahasta != null || this.filtros.fechahasta != undefined) {
        this.filtros.fechahasta = new Date( this.filtros.fechahasta);
      }
      if (this.filtros.idGuardia != null || this.filtros.idGuardia != undefined) {
        this.getComboGuardia();
      }
      if (this.dataBuscador != null){
        if (this.dataBuscador.guardia != null && this.dataBuscador.guardia != ''){
          this.filtros.idGuardia = [this.dataBuscador.guardia.toString()];
        }
        if(this.dataBuscador.turno != null && this.dataBuscador.turno != ''){
          this.filtros.idTurno = [this.dataBuscador.turno.toString()];
        }
        if(this.dataBuscador.fechaDesde != null && this.dataBuscador.fechaDesde != ''){
          let diaDesde = this.dataBuscador.fechaDesde.split('/')[0];
          let mesDesde = this.dataBuscador.fechaDesde.split('/')[1];
          let anyoDesde = this.dataBuscador.fechaDesde.split('/')[2];
          let fechaDesde = mesDesde + '/' + diaDesde + '/' + anyoDesde;
          this.filtros.fechadesde = new Date(fechaDesde); //MM/dd/yyyy
          console.log(new Date(fechaDesde));
        }
        if(this.dataBuscador.fechaHasta != null && this.dataBuscador.fechaHasta != ''){
          let diaHasta = this.dataBuscador.fechaHasta.split('/')[0];
          let mesHasta = this.dataBuscador.fechaHasta.split('/')[1];
          let anyoHasta = this.dataBuscador.fechaHasta.split('/')[2];
          let fechaHasta = mesHasta + '/' + diaHasta + '/' + anyoHasta;
          this.filtros.fechahasta = new Date(fechaHasta);//MM/dd/yyyy
          console.log(new Date(fechaHasta));
        }
      }
      if(this.filtros.numColegiado != null){
        this.usuarioBusquedaExpress.numColegiado = this.filtros.numColegiado;
      }
      this.search();
  

    this.getCombos()
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }


    /* if (this.isColegiado) {
      this.usuarioBusquedaExpress.numColegiado = this.numColeg
      this.usuarioBusquedaExpress.nombreAp = this.nomColeg
      this.filtros.numColegiado = this.usuarioBusquedaExpress.numColegiado;
    } */

    this.showDatosGenerales = true;
    if (sessionStorage.getItem("buscadorColegiados")) {
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
      sessionStorage.removeItem("buscadorColegiados");

      this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.nombre + " " + busquedaColegiado.apellidos;
      this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.nColegiado;
      this.filtros.numColegiado = this.usuarioBusquedaExpress.numColegiado;
    }
    //this.filtros.fechadesde = new Date( new Date().setFullYear(new Date().getFullYear()-1));
    if(this.filtros.fechahasta == null || this.filtros.fechahasta == undefined){
      this.filtros.fechahasta = "";
    }
  }

  if(this.isColegiado || this.isColegiado == undefined){
    if(this.isColegiado==undefined){
      this.commonServices.getLetrado()
      .then(respuesta => {
        this.isColegiado = respuesta;
        if(this.isColegiado){
          this.getDataLoggedUser();
        }
      });
    }else{
    this.getDataLoggedUser();
    }
  }

  /*if (this.isColegiado && sessionStorage.getItem("origin") == "fichaColegial") {
    sessionStorage.removeItem("origin");
    this.progressSpinner = true
    this.sigaServices.get("usuario_logeado").subscribe(n => {
      const usuario = n.usuarioLogeadoItem;
      const colegiadoItem = new ColegiadoItem();
      colegiadoItem.nif = usuario[0].dni;
      this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
        usr => {
          let usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
          if (usuarioLogado) {
            this.usuarioBusquedaExpress.numColegiado = usuarioLogado.numColegiado;
            this.usuarioBusquedaExpress.nombreAp = usuarioLogado.nombre;
            this.filtros.numColegiado = this.usuarioBusquedaExpress.numColegiado;
            this.search();
          }
          this.progressSpinner = false;
        });
    });
  }*/
}

getDataLoggedUser() {
  this.progressSpinner = true;

  this.sigaServices.get("usuario_logeado").subscribe(n => {

    const usuario = n.usuarioLogeadoItem;
    const colegiadoItem = new ColegiadoItem();
    colegiadoItem.nif = usuario[0].dni;

    this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
      usr => {
        const { numColegiado, nombre } = JSON.parse(usr.body).colegiadoItem[0];
        this.usuarioBusquedaExpress.numColegiado = numColegiado;
        this.usuarioBusquedaExpress.nombreAp = nombre.replace(/,/g,"");

        this.filtros.numColegiado = this.usuarioBusquedaExpress.numColegiado;
        this.progressSpinner = false;

       }, err =>{
        this.progressSpinner = false;
      },
      ()=>{
        this.progressSpinner = false;
        this.search();
      });
    });
}

  changeDateFormat(date1){
    //let date1C = date1;
    // date1 dd/MM/yyyy
   // if (!isNaN(Number(date1))){
    //  date1C = date1.split("/").reverse().join("-");
   // }
   var dateParts = date1.split("/");

   // month is 0-based, that's why we need dataParts[1] - 1
   var date1C = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
    return date1C;
  }
 
  getCombos() {
    this.getComboTurno();
    if (this.filtros.idTurno != null || this.filtros.idTurno != undefined) {
      this.getComboGuardia();
    }

  }

  search() {

    this.isOpen.emit(false);

  }

  getComboTurno() {
    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurno);
      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboGuardia() {
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + this.filtros.idTurno).subscribe(
        data => {
          this.comboGuardia = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardia);
        },
        err => {
          //console.log(err);
        }
      )

  }

  onChangeTurnos(event) {
    this.filtroAux.idTurno = event.value;
    this.filtros.idGuardia = "";
    this.comboGuardia = [];

    if (this.filtros.idTurno.length > 0) {
      this.getComboGuardia();
    }
  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    this.filtros.numColegiado = this.usuarioBusquedaExpress.numColegiado;
  }

  clear() {
    this.msgs = [];
  }

  rest() {
    if (this.isColegiado) {
      this.filtros = new GuardiaItem();
      this.filtros.fechadesde = new Date( new Date().setFullYear(new Date().getFullYear()-1)); 
      this.filtros.numColegiado = this.usuarioBusquedaExpress.numColegiado;
    } else {
      this.usuarioBusquedaExpress.nombreAp = '';
      this.usuarioBusquedaExpress.numColegiado = '';
      this.filtros = new GuardiaItem();
      this.filtros.fechadesde = new Date( new Date().setFullYear(new Date().getFullYear()-1)); 
    }

  }

  fillFechaDesde(event) {
    this.filtros.fechadesde = event;
  }

  fillFechaHasta(event) {
    this.filtros.fechahasta = event;
  }

  fillPendienteValidar(event) {
    this.filtros.validada = event;
  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }
  showMessageError(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  // Control de fechas
  getFechaHastaCalendar(fechaInputDesde, fechainputHasta) {
    if (
      fechaInputDesde != undefined &&
      fechainputHasta != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputDesde).getTime();
      let fechaHasta = new Date(fechainputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechainputHasta = undefined;
    }
    return fechainputHasta;
  }

  getFechaDesdeCalendar(fechaInputesde, fechaInputHasta) {
    if (
      fechaInputesde != undefined &&
      fechaInputHasta != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputesde).getTime();
      let fechaHasta = new Date(fechaInputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechaInputesde = undefined;
    }
    return fechaInputesde;
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

  onChangeGuardia(event) {
    this.filtroAux.idGuardia = event.value;
  }
}
