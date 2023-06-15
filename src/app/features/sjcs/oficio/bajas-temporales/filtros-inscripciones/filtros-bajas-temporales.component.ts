import { Component, OnInit, Input, HostListener, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { BajasTemporalesItem } from '../../../../../models/sjcs/BajasTemporalesItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { SigaStorageService } from '../../../../../siga-storage.service';


@Component({
  selector: 'app-filtros-bajas-temporales',
  templateUrl: './filtros-bajas-temporales.component.html',
  styleUrls: ['./filtros-bajas-temporales.component.scss']
})
export class FiltrosBajasTemporales implements OnInit {

  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  filtroAux: BajasTemporalesItem = new BajasTemporalesItem();
  disabledestado: boolean = false;
  msgs: any[] = [];
  filtros: BajasTemporalesItem = new BajasTemporalesItem();
  comboTipo = [
    { label: "Vacaciones", value: "V" },
    { label: "Maternidad", value: "M" },
    { label: "Baja", value: "B" },
    { label: "Suspensión por sanción", value: "S" }
  ];

  usuarioBusquedaExpress = {​​​​​​​​​
    numColegiado: '',
    nombreAp: ''
  }​​​​​​​​​;

  nuevaBaja = true;
  progressSpinner = false;
  comboEstado: any;

  @Input() permisos;
  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un boStón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();
  isLetrado: boolean = false;
  usuarioLogado;

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private localStorageService: SigaStorageService) { }

  ngOnInit() {   
    sessionStorage.removeItem("volver");
    sessionStorage.removeItem("modoBusqueda");
    this.clearFilters();

    this.isLetrado = this.localStorageService.isLetrado;

    this.getComboEstado();

    if (this.persistenceService.getHistorico() != undefined) {
      this.filtros.historico = this.persistenceService.getHistorico();
      // this.isBuscar();
    }
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisos = this.persistenceService.getPermisos();
    }
    
    if(sessionStorage.getItem("buscadorColegiados")){​​

      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));

      this.usuarioBusquedaExpress.nombreAp=busquedaColegiado.nombre+" "+busquedaColegiado.apellidos;

      this.usuarioBusquedaExpress.numColegiado=busquedaColegiado.nColegiado;

      this.isBuscar();
    }​​

    if(sessionStorage.getItem("colegiadoRelleno")){
      const { numColegiado, nombre } = JSON.parse(sessionStorage.getItem("datosColegiado"));
      this.usuarioBusquedaExpress.numColegiado = numColegiado;
      this.usuarioBusquedaExpress.nombreAp = nombre.replace(/,/g,"");

      this.isBuscar();

      sessionStorage.removeItem("colegiadoRelleno");
      sessionStorage.removeItem("datosColegiado");
    }​​

    if(this.isLetrado){
      this.getDataLoggedUser();
    }
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

          this.usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
          this.progressSpinner = false;

         }, err =>{
          this.progressSpinner = false;
        },
        ()=>{
          this.progressSpinner = false;
          this.isBuscar();
        });
      });
}

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  checkFilters() {
      if((this.filtros.tipo == null ||
          this.filtros.tipo == undefined) &&
      (this.filtros.validado == null ||
          this.filtros.validado == undefined) &&
      (this.filtros.fechasolicitudhasta == null ||
          this.filtros.fechasolicitudhasta == undefined) &&
      (this.filtros.fechasolicituddesde == null ||
          this.filtros.fechasolicituddesde == undefined) &&
      (this.filtros.fechahasta == null ||
          this.filtros.fechahasta == undefined )&&
      (this.filtros.fechadesde == null ||
          this.filtros.fechadesde == undefined )&&
      (this.filtros.nombre == null ||
          this.filtros.nombre == undefined ) &&
      (this.usuarioBusquedaExpress.nombreAp  == null ||
        this.usuarioBusquedaExpress.nombreAp  == undefined ||
        this.usuarioBusquedaExpress.nombreAp  == "" )){
        this.showSearchIncorrect();
        return false;
      } else {
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
    if(this.usuarioBusquedaExpress.nombreAp != undefined && this.usuarioBusquedaExpress.nombreAp  != ""){
      this.filtros.nombre = this.usuarioBusquedaExpress.nombreAp;
      if(this.usuarioBusquedaExpress.numColegiado!= null && this.usuarioBusquedaExpress.numColegiado  != ""){
        this.filtros.ncolegiado = this.usuarioBusquedaExpress.numColegiado;
      }else{
        this.filtros.ncolegiado = null;
      }
    }else{
      this.filtros.nombre = null;
    }

    if (this.checkFilters()) {
        this.persistenceService.setFiltros(this.filtros);
        this.persistenceService.setFiltrosAux(this.filtros);
        this.filtroAux = this.filtros;
        this.busqueda.emit(false);
        this.nuevaBaja = false
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

  fillFechaSolicitudDesdeCalendar(event) {
    this.filtros.fechasolicituddesde = this.transformaFecha(event); 
  }

  fillFechaHastaSolicitudCalendar(event) {
    this.filtros.fechasolicitudhasta = this.transformaFecha(event);
  }
  
  
  fillFechaDesdeCalendar(event) {
    this.filtros.fechadesde = this.transformaFecha(event);
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
        "oficio.busqueda.error.busquedageneral"
      )
    });
  }

  clearFilters() {
    if(this.isLetrado){
      this.filtros.validado = undefined;
      this.filtros.fechadesde = undefined;
      this.filtros.fechahasta = undefined;
      this.filtros.fechasolicituddesde = undefined;
      this.filtros.fechasolicitudhasta = undefined;
      this.filtros.tipo = undefined;
      this.filtroAux = undefined;
    }else{
      this.filtros.validado = undefined;
      this.filtros.fechadesde = undefined;
      this.filtros.fechahasta = undefined;
      this.filtros.fechasolicituddesde = undefined;
      this.filtros.fechasolicitudhasta = undefined;
      this.filtros.tipo = undefined;
      this.filtros.ncolegiado = undefined;
      this.filtros.nombre = undefined;
      this.usuarioBusquedaExpress.nombreAp = undefined;
      this.usuarioBusquedaExpress.numColegiado = undefined;
    }
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

  getComboEstado(){
    this.progressSpinner=true;

      this.sigaServices.get("bajasTemporales_comboEstado").subscribe(
        n => {
          this.comboEstado = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboEstado);
          this.progressSpinner=false;
        },
        err => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          this.progressSpinner=false;
        }
      );
  }

  updateColegiado(event) {
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.filtros.ncolegiado =  this.usuarioBusquedaExpress.numColegiado;
    this.filtros.nombre = this.usuarioBusquedaExpress.nombreAp;
    this.persistenceService.setFiltrosAux(this.filtros);
  }
  
  nuevaBajaTemporal(){
    if(this.usuarioBusquedaExpress.numColegiado!= undefined && this.usuarioBusquedaExpress.nombreAp != null 
      && this.usuarioBusquedaExpress.numColegiado != ""){
      sessionStorage.setItem("nuevo","true");
      sessionStorage.setItem("nCol",this.usuarioBusquedaExpress.numColegiado);
      sessionStorage.setItem("nombCol",this.usuarioBusquedaExpress.nombreAp);
      sessionStorage.removeItem("buscadorColegiados");
      this.isBuscar();
    }else{
      this.router.navigate(["/buscadorColegiados"]);
      sessionStorage.setItem("nuevo","true");
    }
  }
}
