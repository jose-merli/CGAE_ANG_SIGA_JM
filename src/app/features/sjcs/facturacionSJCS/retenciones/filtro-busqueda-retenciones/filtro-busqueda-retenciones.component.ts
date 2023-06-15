import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MultiSelect, SelectItem } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { RetencionesRequestDto } from '../../../../../models/sjcs/RetencionesRequestDTO';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TIPOBUSQUEDA } from '../retenciones.component';
import { Router } from '@angular/router';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { RetencionesService } from '../retenciones.service';
import { BusquedaColegiadoExpressComponent } from '../../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.component';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-filtro-busqueda-retenciones',
  templateUrl: './filtro-busqueda-retenciones.component.html',
  styleUrls: ['./filtro-busqueda-retenciones.component.scss']
})
export class FiltroBusquedaRetencionesComponent implements OnInit {

  modoBusqueda: string = TIPOBUSQUEDA.RETENCIONES;
  filtros: RetencionesRequestDto = new RetencionesRequestDto();
  showDestinatarios: boolean = false;
  showDatosGenerales: boolean = false;
  obligatorio: boolean = false;
  msgs = [];
  progressSpinner: boolean = false;
  comboTiposRetencion: SelectItem[] = [];
  comboDestinatarios: SelectItem[] = [];
  comboPagos: SelectItem[] = [];
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: '',
    idPersona: ''
  };

  @Input() isLetrado: boolean;
  @Input() permisoEscritura: boolean;
  @Input() disabledLetradoFicha: boolean;

  @Output() buscarRetencionesEvent = new EventEmitter<RetencionesRequestDto>();
  @Output() buscarRetencionesAplicadasEvent = new EventEmitter<RetencionesRequestDto>();
  @Output() modoBusquedaEvent = new EventEmitter<string>();
  @ViewChild(BusquedaColegiadoExpressComponent) buscador : BusquedaColegiadoExpressComponent;
  usuarioLogado: any;
  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private router: Router,
    private sigaStorageService: SigaStorageService,
    private retencionesService: RetencionesService,
    private sigaService: SigaServices) { }

  ngOnInit() {
    sessionStorage.removeItem("volver");
    sessionStorage.removeItem("modoBusqueda");
    this.isLetrado = this.sigaStorageService.isLetrado;

    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('buscadorColegiados')) {
      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
      this.filtros.ncolegiado = nColegiado;
      setTimeout(()=>{
        if(this.buscador){
          this.buscador.isBuscar(this.usuarioBusquedaExpress);
        }
      },500) 
    }

    if(this.sigaStorageService.idPersona
      && this.sigaStorageService.isLetrado){
      this.isLetrado = true;
      this.filtros.ncolegiado = this.sigaStorageService.numColegiado;
      this.filtros.nombreApellidoColegiado = this.sigaStorageService.nombreApe;
      this.usuarioBusquedaExpress.numColegiado = this.filtros.ncolegiado;
      this.usuarioBusquedaExpress.nombreAp = this.filtros.nombreApellidoColegiado
    }

    if (this.isLetrado) {

      // this.filtros.nombreApellidoColegiado = this.sigaStorageService.nombreApe;
      // this.filtros.ncolegiado = this.sigaStorageService.numColegiado;
      // this.filtros.idPersona = this.sigaStorageService.idPersona;
      // this.showDestinatarios = true;
        this.getDataLoggedUser();
      

    } else {

      if (sessionStorage.getItem('buscadorColegiados')) {

        if (sessionStorage.getItem("desdeNuevoFiltroRetenciones")) {
          sessionStorage.removeItem("desdeNuevoFiltroRetenciones");
          this.retencionesService.modoEdicion = false;
          this.router.navigate(['/fichaRetencionJudicial']);
        } else {

          const { nombre, apellidos, nColegiado, idPersona } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

          this.filtros.nombreApellidoColegiado = `${apellidos}, ${nombre}`;
          this.filtros.ncolegiado = nColegiado;
          this.filtros.idPersona = idPersona;
          this.usuarioBusquedaExpress.numColegiado = this.filtros.ncolegiado;
          this.usuarioBusquedaExpress.nombreAp = this.filtros.nombreApellidoColegiado 

          sessionStorage.removeItem('buscadorColegiados');
          this.showDestinatarios = true;
        }
      }

    }

    if (this.retencionesService.filtrosRetenciones && this.retencionesService.filtrosRetenciones != null
      && Object.keys(this.retencionesService.filtrosRetenciones).length > 0) {
       
      this.usuarioBusquedaExpress.numColegiado = this.retencionesService.filtrosRetenciones.ncolegiado;
      this.usuarioBusquedaExpress.nombreAp = this.retencionesService.filtrosRetenciones.nombreApellidoColegiado

      this.filtros = JSON.parse(JSON.stringify(this.retencionesService.filtrosRetenciones));
      
      this.filtros.nombreApellidoColegiado = this.retencionesService.filtrosRetenciones.nombreApellidoColegiado;
      this.filtros.ncolegiado = this.retencionesService.filtrosRetenciones.ncolegiado;
      this.filtros.idPersona = this.retencionesService.filtrosRetenciones.idPersona;

      if (this.filtros.modoBusqueda && this.filtros.modoBusqueda != null && this.filtros.modoBusqueda.length > 0) {
        this.modoBusqueda = this.filtros.modoBusqueda;
        this.modoBusquedaEvent.emit(this.modoBusqueda);
      }

      if (this.filtros.fechainicio && this.filtros.fechainicio != null) {
        this.filtros.fechainicio = new Date(this.filtros.fechainicio);
      }


      if (this.filtros.fechaFin && this.filtros.fechaFin != null) {
        this.filtros.fechaFin = new Date(this.filtros.fechaFin);
      }

      if (this.filtros.fechaAplicacionDesde && this.filtros.fechaAplicacionDesde != null) {
        this.filtros.fechaAplicacionDesde = new Date(this.filtros.fechaAplicacionDesde);
      }

      if (this.filtros.fechaAplicacionHasta && this.filtros.fechaAplicacionHasta != null) {
        this.filtros.fechaAplicacionHasta = new Date(this.filtros.fechaAplicacionHasta);
      }
      

      if (this.hayDestinatariosRellenos()) {
        this.showDestinatarios = true;
      }

      if (this.hayDatosGeneralesRellenos()) {
        this.showDatosGenerales = true;
      }
      //this.retencionesService.filtrosRetenciones = new RetencionesRequestDto();
    }

    if(this.usuarioBusquedaExpress.numColegiado != null && this.usuarioBusquedaExpress.numColegiado != undefined && this.usuarioBusquedaExpress.numColegiado != ""){
			this.filtros.ncolegiado =this.usuarioBusquedaExpress.numColegiado;
			this.filtros.nombreApellidoColegiado = this.usuarioBusquedaExpress.nombreAp;
      this.buscar();
		  }

    this.getComboTiposRetencion();
    this.getComboDestinatarios();
    this.getComboPagos();
  }

  getDataLoggedUser() {
    this.progressSpinner = true;
  
    this.sigaService.get("usuario_logeado").subscribe(n => {
  
    const usuario = n.usuarioLogeadoItem;
    const colegiadoItem = new ColegiadoItem();
    colegiadoItem.nif = usuario[0].dni;
  
    this.sigaService.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
      usr => {
      const { numColegiado, nombre , idPersona} = JSON.parse(usr.body).colegiadoItem[0];
      this.usuarioBusquedaExpress.numColegiado = numColegiado;
      this.usuarioBusquedaExpress.nombreAp = nombre.replace(/,/g, "");
      this.usuarioBusquedaExpress.idPersona = idPersona;
      this.filtros.ncolegiado = numColegiado;
      this.filtros.nombreApellidoColegiado = nombre.replace(/,/g, "");
      this.filtros.idPersona = idPersona;

      this.usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
      this.buscar();
      this.progressSpinner = false;
      }, err => {
      this.progressSpinner = false;
      },
      () => {
      this.progressSpinner = false;
      setTimeout(() => {
        //this.isBuscar();
      }, 5);
      });
    });

    this.progressSpinner = false;
}

  changeFilters() {
    this.filtros.modoBusqueda = this.modoBusqueda;
    this.modoBusquedaEvent.emit(this.modoBusqueda);

    if (this.hayDestinatariosRellenos() || this.hayDatosGeneralesRellenos()) {
      this.buscar();
    }
  }

  onHideDestinatarios() {
    this.showDestinatarios = !this.showDestinatarios;
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  focusInputField(someMultiselect: MultiSelect) {
    setTimeout(() => {
      someMultiselect.filterInputChild.nativeElement.focus();
    }, 300);
  }

  onChangeMultiSelect(event, filtro) {
    if (undefined != event.value && event.value.length == 0) {
      this.filtros[filtro] = undefined;
    }
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

  recuperarColegiado(event) {
    /* if (event != undefined) {
      this.filtros.nombreApellidoColegiado = event.nombreAp;
      this.filtros.ncolegiado = event.nColegiado;
    } else {
      this.filtros.nombreApellidoColegiado = undefined;
      this.filtros.ncolegiado = undefined;
    } */
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
		this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
		this.filtros.ncolegiado = event.nColegiado;
		this.filtros.nombreApellidoColegiado = event.nombreAp; 
  }

  recuperarIdPersona(event) {
    if (event != undefined && event != '') {
      this.filtros.idPersona = event;
    } else {
      this.filtros.idPersona = undefined;
    }
  }

  getComboTiposRetencion() {
    this.comboTiposRetencion = [
      {
        label: this.translateService.instant("facturacionSJCS.retenciones.porcentual"),
        value: 'P'
      },
      {
        label: this.translateService.instant("facturacionSJCS.retenciones.importeFijo"),
        value: 'F'
      },
      {
        label: this.translateService.instant("facturacionSJCS.retenciones.tramosLEC"),
        value: 'L'
      }
    ];
  }

  getComboDestinatarios() {

    this.progressSpinner = true;

    this.sigaServices.get("retenciones_comboDestinatarios").subscribe(
      data => {
        if (data.error != null && data.error.description != null) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(data.error.description.toString()));
        } else {
          this.comboDestinatarios = data.combooItems;
          this.commonsService.arregloTildesCombo(this.comboDestinatarios);
        }
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );

  }

  getComboPagos() {

    this.progressSpinner = true;

    this.sigaServices.get("retenciones_comboPagos").subscribe(
      data => {
        if (data.error != null && data.error.description != null) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(data.error.description.toString()));
        } else {
          this.comboPagos = data.combooItems;
          this.commonsService.arregloTildesCombo(this.comboPagos);
        }
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );

  }

  fillFechaDede(event, fecha) {

    this.filtros[fecha] = event;

    if (fecha === 'fechainicio' && this.filtros.fechaFin < this.filtros.fechainicio) {
      this.filtros.fechaFin = undefined;
    } else if (fecha === 'fechaAplicacionDesde' && this.filtros.fechaAplicacionHasta < this.filtros.fechaAplicacionDesde) {
      this.filtros.fechaAplicacionHasta = undefined;
    }
  }

  fillFechaHasta(event, fecha) {
    this.filtros[fecha] = event;
  }

  buscar() {

    /* if (!this.hayDestinatariosRellenos() && !this.hayDatosGeneralesRellenos()) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    } else { */

      if (this.modoBusqueda == TIPOBUSQUEDA.RETENCIONES) {
        this.retencionesService.filtrosRetenciones = JSON.parse(JSON.stringify(this.filtros));
        this.buscarRetencionesEvent.emit(this.filtros);
      } else if (this.modoBusqueda == TIPOBUSQUEDA.RETENCIONESAPLICADAS) {
        this.retencionesService.filtrosRetenciones = JSON.parse(JSON.stringify(this.filtros));
        this.buscarRetencionesAplicadasEvent.emit(this.filtros);
      }

    //}
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.buscar();
    }
  }

  limpiar() {
    /* this.usuarioBusquedaExpress = {
      numColegiado: '',
      nombreAp: ''
    }; */
    
    this.retencionesService.filtrosRetenciones = new RetencionesRequestDto();
    this.filtros  = new RetencionesRequestDto();

    if (!this.sigaStorageService.isLetrado) {
			this.usuarioBusquedaExpress = {
        numColegiado: "",
        nombreAp: "",
        idPersona: ""
		  }
    } else {
      this.filtros.nombreApellidoColegiado = this.usuarioBusquedaExpress.nombreAp;
      this.filtros.ncolegiado = this.usuarioBusquedaExpress.numColegiado;
      this.filtros.idPersona = this.usuarioBusquedaExpress.idPersona;
    }
  }

  botonBuscarColegiadoExpress() {
    if (sessionStorage.getItem("desdeNuevoFiltroRetenciones")) {
      sessionStorage.removeItem("desdeNuevoFiltroRetenciones");
    }
  }

  nuevo() {
    sessionStorage.setItem("desdeNuevoFiltroRetenciones", "true");
    this.router.navigate(["/buscadorColegiados"]);
  }

  hayDatosGeneralesRellenos(): boolean {

    if (
      (this.filtros && this.filtros != null) &&
      ((this.filtros.tiposRetencion && this.filtros.tiposRetencion != null && this.filtros.tiposRetencion.toString().length > 0) ||
        (this.filtros.idDestinatarios && this.filtros.idDestinatarios != null && this.filtros.idDestinatarios.toString().length > 0) ||
        (this.filtros.fechainicio && this.filtros.fechainicio != null) ||
        (this.filtros.fechaFin && this.filtros.fechaFin != null) ||
        (this.filtros.idPagos && this.filtros.idPagos != null && this.filtros.idPagos.toString().length > 0) ||
        (this.filtros.fechaAplicacionDesde && this.filtros.fechaAplicacionDesde != null) ||
        (this.filtros.fechaAplicacionHasta && this.filtros.fechaAplicacionHasta != null))
    ) {
      return true;
    }

    return false;
  }

  hayDestinatariosRellenos(): boolean {

    if (((this.filtros && this.filtros != null)) && this.filtros.idPersona && this.filtros.idPersona != null && this.filtros.idPersona.length > 0) {
      return true;
    }

    return false;
  }

}
