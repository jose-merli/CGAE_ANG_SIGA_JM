import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
    this.isLetrado = this.sigaStorageService.isLetrado;
    
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      this.getComboColegios();
    });

    if (this.isLetrado) {
      this.getDataLoggedUser();
    } else {
      if (sessionStorage.getItem('buscadorColegiados')) {

        const { nombre, apellidos, nColegiado, idPersona } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

        this.usuarioBusquedaExpress.nombreAp= `${apellidos}, ${nombre}`;
        this.usuarioBusquedaExpress.numColegiado = nColegiado;
        this.usuarioBusquedaExpress.idPersona  = this.sigaStorageService.idPersona;
        this.filtros.idPersona = idPersona;

        sessionStorage.removeItem('buscadorColegiados');
      }
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
          const { numColegiado, nombre, idPersona } = JSON.parse(usr.body).colegiadoItem[0];
          this.usuarioBusquedaExpress.numColegiado = numColegiado;
          this.usuarioBusquedaExpress.nombreAp = nombre.replace(/,/g,"");
          this.usuarioBusquedaExpress.idPersona = idPersona;
          this.filtros.idPersona = idPersona;
          this.usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
          this.progressSpinner = false;

         }, err =>{
          this.progressSpinner = false;
        },
        ()=>{
          this.progressSpinner = false;
        });
      });
}

  isColegiado() {

    this.esColegiado = true;

    this.usuarioBusquedaExpress.numColegiado = this.sigaStorageService.numColegiado;
    this.usuarioBusquedaExpress.idPersona  = this.sigaStorageService.idPersona;
    this.usuarioBusquedaExpress.nombreAp = this.sigaStorageService.nombreApe;
    this.filtros.idPersona = this.sigaStorageService.idPersona;
  }

  clear() {
    this.msgs = [];
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
    if( this.usuarioBusquedaExpress.numColegiado.length > 0)
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
