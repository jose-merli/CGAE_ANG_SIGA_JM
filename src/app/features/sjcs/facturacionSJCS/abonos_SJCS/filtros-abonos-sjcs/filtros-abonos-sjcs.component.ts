import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { ComboItem } from '../../../../../models/ComboItem';
import { FacAbonoItem } from '../../../../../models/sjcs/FacAbonoItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';



@Component({
  selector: 'app-filtros-abonos-sjcs',
  templateUrl: './filtros-abonos-sjcs.component.html',
  styleUrls: ['./filtros-abonos-sjcs.component.scss'],

})
export class FiltrosAbonosSCJSComponent implements OnInit {

  @Output() busqueda = new EventEmitter<boolean>();
  progressSpinner: boolean = false;
  showDatosGenerales: boolean = true;
  showDatosAgrupacion: boolean = true;
  showColegiado: boolean = true;
  showSociedad:boolean = true;
  institucionGeneral:boolean = true;

  comboColegios:ComboItem[] = [];
  comboContabilizado:ComboItem[] = [];
  comboGrupoFacturacion:ComboItem[] = [];
  comboFormaCobroAbono:ComboItem[] = [];
  comboEstados:ComboItem[] = [];
  comboPago:ComboItem[] = [];
  filtros:FacAbonoItem = new FacAbonoItem(); //Complementar atributos
  institucionActual;
  combo;

  isLetrado;
  esColegiado: boolean = false;
  msgs;
  usuarioLogado;
  @Input() idPersona;

  constructor( private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService,
    private sigaStorageService: SigaStorageService) {
   
  }
  usuarioBusquedaExpress = { 

    numColegiado: '', 

    nombreAp: '', 

    idPersona:'' 

  }; 


  ngOnInit() {
    this.getComboContabilizado();
    this.getComboFormaCobroAbono();
    this.getComboGrupoFacturacion();
    this.getComboEstados();
    this.getComboPago();
    
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      this.getComboColegios();
    });

    //Si viene de la ficha Colegiado
    if (sessionStorage.getItem("datosColegiado")) {
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("datosColegiado"));
      sessionStorage.removeItem("datosColegiado");

      this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.nombre;
      this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.numColegiado;
      this.usuarioBusquedaExpress.idPersona = busquedaColegiado.idPersona;
    }
    if (sessionStorage.getItem("buscadorColegiados")) {

      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));

      sessionStorage.removeItem('buscadorColegiados');

      if (busquedaColegiado.nombreSolo != undefined) this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.apellidos + ", " + busquedaColegiado.nombreSolo;
      else this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.apellidos + ", " + busquedaColegiado.nombre;

      this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.nColegiado;
      this.filtros.numColegiado = this.usuarioBusquedaExpress.numColegiado;

      //Asignacion de idPersona según el origen de la busqueda.
      this.idPersona = busquedaColegiado.idPersona;
      if (this.idPersona == undefined) this.idPersona = busquedaColegiado.idpersona;
    }


  }




  clear() {
    this.msgs = [];
  }
  getIdPersona(evento) {
    this.idPersona = evento;
  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    if (this.usuarioBusquedaExpress.numColegiado != undefined && this.usuarioBusquedaExpress.numColegiado != null
      && this.usuarioBusquedaExpress.numColegiado.trim() != "") {
      this.filtros.numColegiado = this.usuarioBusquedaExpress.numColegiado;
      this.filtros.idPersona = this.usuarioBusquedaExpress.idPersona;
    }else{
      this.usuarioBusquedaExpress.numColegiado = " ";
      this.filtros.numColegiado = undefined;
      this.filtros.idPersona = undefined;
      sessionStorage.removeItem("numColegiado");
    }
  }
  fillFecha(event, campo) {
    if(campo==='emisionDesde')
      this.filtros.fechaEmisionDesde = event;
    else if(campo==='emisionHasta')
      this.filtros.fechaEmisionHasta = event;
  }

  getComboColegios() {
    this.progressSpinner = true;

    this.sigaServices.getParam("busquedaCol_colegio", "?idInstitucion=" + this.institucionActual).subscribe(
      n => {
        this.comboColegios = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboColegios);

        if (this.institucionActual == "2000") {
          this.institucionGeneral = true;
        }

        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  getComboContabilizado() {
    this.comboContabilizado.push({value: 'S', label: this.translateService.instant('messages.si') , local: undefined});
    this.comboContabilizado.push({value: 'N', label: this.translateService.instant('general.boton.no') , local: undefined});
  }
  getComboFormaCobroAbono() {
    this.comboFormaCobroAbono.push({value: 'E', label: this.translateService.instant('facturacion.facturas.efectivo') , local: undefined});
    this.comboFormaCobroAbono.push({value: 'B', label: this.translateService.instant('censo.tipoAbono.banco') , local: undefined});
    this.comboFormaCobroAbono.push({value: 'A', label: this.translateService.instant('fichaEventos.datosRepeticion.tipoDiasRepeticion.ambos') , local: undefined});
  }

  onHideDatosGenerales(){
    this.showDatosGenerales = !this.showDatosGenerales
  }
  onHideDatosAgrupacion(){
    this.showDatosAgrupacion = !this.showDatosAgrupacion;
  }

  onHideColegiado(){
    this.showColegiado = !this.showColegiado;
  }

  onHideSociedad(){
    this.showSociedad = !this.showSociedad;
  }
  searchAbonos(){
    if( this.usuarioBusquedaExpress.nombreAp.length > 0)
      this.filtros.numColegiado = this.usuarioBusquedaExpress.numColegiado
    this.busqueda.emit();
  }
  clearFilters(){
    this.filtros = new FacAbonoItem();
    console.log(this.filtros)
  }

  searchAbonosSJCS(){}

  getComboGrupoFacturacion() {
    this.sigaServices.get("combo_comboGrupoFacturacion").subscribe(
      n => {
        this.comboGrupoFacturacion = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboGrupoFacturacion);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboPago() {
    this.sigaServices.get("combo_comboPagosjg").subscribe(
      n => {
        this.comboPago = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboPago);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboEstados() {
    this.sigaServices.get("combo_comboEstadosAbono").subscribe(
      n => {
        this.comboEstados = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboEstados);
      },
      err => {
        console.log(err);
      }
    );
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
  

}
