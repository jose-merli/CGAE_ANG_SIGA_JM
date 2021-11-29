import { Component, OnInit, ViewChild, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { DataTable, ConfirmationService } from '../../../../../../node_modules/primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { Router } from '../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { EJGItem } from '../../../../models/sjcs/EJGItem';
import { DatePipe } from '../../../../../../node_modules/@angular/common';
import { Dialog } from 'primeng/primeng';
import { saveAs } from "file-saver/FileSaver";
import { ComboItem } from '../../../../models/ComboItem';
import { ActasItem } from '../../../../models/sjcs/ActasItem';
import { Location } from '@angular/common';



@Component({
  selector: 'app-tabla-ejg-comision',
  templateUrl: './tabla-ejg-comision.component.html',
  styleUrls: ['./tabla-ejg-comision.component.scss']
})
export class TablaEjgComisionComponent implements OnInit {

  rowsPerPage: any = [];

  cols;
  msgs;

  ponenteCompleto: boolean = false;
  fechaPonenteCompleto: boolean = false;
  selectedItem: number = 10;
  selectAll;
  selectAnioActa;
  selectPonente = false;
  selectResolucionFundamento = false;
  selectedDatos = [];
  selectDatos: EJGItem = new EJGItem();
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  permisoEscritura: boolean = false;
  buscadores = [];
  message;
  initDatos;
  datosItem: EJGItem;
  nuevo: boolean = false;
  progressSpinner: boolean = false;
  disableAddRemesa: boolean = true;
  disableBotonAnadir: boolean = true;

  ejgObject = [];
  datosFamiliares = [];

  comboAnioActa = [];
  comboPonente = [];
  comboRemesa = [];
  comboFundamento = [];
  comboResolucion = [];
  valueComboRemesa;
  valueComboAnioRemesa;
  num: string;

  //Resultados de la busqueda
  @Input() datos;
  @Input() filtro;
  @Input() remesa;
  @Input() acta: ActasItem;

  @ViewChild("table") table: DataTable;
  @Output() searchHistoricalSend = new EventEmitter<boolean>();
  @Output() busqueda = new EventEmitter<boolean>();
  @ViewChild("cd") cdCambioEstado: Dialog;
  @ViewChild("cd1") cdAnadirRemesa: Dialog;
  @ViewChild("cd2") cdEditarSeleccionados: Dialog;

  
  showModalAnadirRemesa = false;
  showModalEditarSeleccionados = false;
  fechaPrueba: any;
  valueAnioActa: any;
  valuePonente: any;
  valueFechaPrueba: any;
  valueResolucion: any;
  valueFundamento: any;
  valueFechaPonente: any;
  resaltadoDatosFechaPonente: boolean = false;
  resaltadoDatosPonente: boolean;
  cambiarResaltarDatos: boolean = false;
  resaltadoDatosFundamento: boolean;
  resaltadoDatosResolucion: boolean;
  obligatoriedadResolucion: any;


  constructor(private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef, private router: Router,
    private sigaServices: SigaServices, private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService, private commonServices: CommonsService,
    private datepipe: DatePipe, private location: Location) {

  }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.selectedDatos = [];

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));

    if (this.persistenceService.getHistorico() != undefined) {
      this.historico = this.persistenceService.getHistorico();
    }

    this.getComboAnioActa();
    this.getComboPonente();
    this.getComboFundamento();
    this.getComboResolucion();
    this.getComboRemesa();
    this.getObligatoriedadResolucion();

    console.log("Acta en el componente tabla -> ", this.acta);

    this.obligatorioFundamento();
  }


  styleObligatorioFechaPonente(event) {
    if (this.resaltadoDatosFechaPonente && this.valuePonente != null) {
      console.log("styleObligatorioFechaPonente");
      return this.commonServices.styleObligatorio(event); 
    }
  }

  muestraCampoObligatorioFechaPonente() {
    console.log("muestraCampoObligatorioFechaPonente");
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatosFechaPonente = true;
  }



  styleObligatorioPonente(event) {
    if (this.resaltadoDatosPonente && this.valueFechaPonente != null) {
      console.log("styleObligatorioPonente");
      return this.commonServices.styleObligatorio(event);
    }
  }

  muestraCampoObligatorioPonente() {
    console.log("muestraCampoObligatorioPonente");
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatosPonente = true;

  }


  styleObligatorioResolucion(event) {
    if (this.resaltadoDatosResolucion && this.valueFundamento != null) {
      console.log("styleObligatorioResolucion");
      return this.commonServices.styleObligatorio(event);
    }
  }

  muestraCampoObligatorioResolucion() {
    console.log("muestraCampoObligatorioResolucion");
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatosResolucion = true;

  }

  styleObligatorioFundamento(evento) {
    if (this.resaltadoDatosFundamento && this.valueResolucion != null) {
      console.log("styleObligatorioFundamento");
      return this.commonServices.styleObligatorio(event);
    }
  }
  obligatorioFundamento(){

    this.sigaServices.get("filtrosejgcomision_obligatorioFundamento")
    .subscribe(
      n => {
        this.num= n;
        console.log(n.body);
      },
      err => {
        console.log(err);
      }
    );
  }

  muestraCampoObligatorioFundamento() {
    console.log("muestraCampoObligatorioFundamento");
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatosFundamento = true;

  }


  checkPonente() {
    console.log("********************************checkPonente");
    console.log(this.valuePonente);
    if (this.valuePonente == null) {
      this.muestraCampoObligatorioPonente();
    }
  }
  checkPonenteFecha() {
    console.log("********************************checkPonente");
    console.log(this.valueFechaPonente);
    if (this.valueFechaPonente == null) {
      this.muestraCampoObligatorioFechaPonente();
    }
  }

  checkResolucion() {
    console.log("********************************checkResolucion");
    if(parseInt(this.num) != 0){
      this.styleObligatorioFundamento(this.valueFundamento);
    }
    if(this.valueResolucion == null){
      this.muestraCampoObligatorioResolucion();
    }
  }

  checkFundamento() {
    console.log("********************************checkFundamento");
    console.log(this.valueFundamento);
    if (this.valueFundamento == null && parseInt(this.num) != 0) {
      this.muestraCampoObligatorioResolucion();
    }
  }

  fillFechaPrueba(event) {
    console.log("********************************fillFechaPrueba");
    console.log(event);
    this.valueFechaPonente = event;
    if (this.valueFechaPonente == null ) {
      this.muestraCampoObligatorioPonente();
    }
  }

  //Se activara cada vez que los @Input cambien de valor (ahora unicamente datos)
  ngOnChanges() {
    this.selectedDatos = [];
  }

  getObligatoriedadResolucion() {
    this.sigaServices.get("obligatoriedadResolucion").subscribe(
      n => {
        this.obligatoriedadResolucion = n.combooItems;
        console.log("****************************************" + this.obligatoriedadResolucion);
      },
      err => {
        console.log(err);
      }
    );
  }

  cancelarGuardarEditados(){
    this.cerrarModalED();
  }


  getComboAnioActa() {
    this.sigaServices.get("filtrosejgcomision_comboAnioActaComision").subscribe(
      n => {
        console.log("******************comboanioacta**********************");
        this.comboAnioActa = n.combooItems;

        if(this.acta != null || this.acta != undefined){
          let comboItem = this.comboAnioActa.find(anioActa => anioActa.label == this.acta.numeroacta);

          let indice = this.comboAnioActa.indexOf(comboItem);

          if(indice != -1){
            this.comboAnioActa[0].label = this.comboAnioActa[indice].label;
            this.comboAnioActa[0].value = this.comboAnioActa[indice].value;
          }
          
          for(; this.comboAnioActa.length > 1;){
            this.comboAnioActa.pop();
          }
        }

      },
      err => {
        console.log(err);
      }
    );
  }

  getComboPonente() {
    this.sigaServices.get("filtrosejgcomision_comboPonenteComision").subscribe(
      n => {
        console.log("******************getComboPonente**********************");
        this.comboPonente = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboResolucion() {
    this.sigaServices.get("filtrosejgcomision_comboResolucionComision").subscribe(
      n => {
        console.log("******************************************getComboResolucion");
        this.comboResolucion = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  openTab(evento) {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    if (!this.selectAll && !this.selectMultiple) {
      // this.progressSpinner = true;

      this.datosEJG(evento.data);

    }
  }

  datosEJG(selected) {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_datosEJG", selected).subscribe(
      n => {
        this.ejgObject = JSON.parse(n.body).ejgItems;
        this.datosItem = this.ejgObject[0];
        this.persistenceService.setDatos(this.datosItem);
        this.persistenceService.setFiltros(this.filtro);
        this.ngOnInit();
        this.consultaUnidadFamiliar(selected);
        this.commonServices.scrollTop();
      },
      err => {
        this.commonServices.scrollTop();
      }
    );
  }

  consultaUnidadFamiliar(selected) {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_unidadFamiliarEJG", selected).subscribe(
      n => {
        this.datosFamiliares = JSON.parse(n.body).unidadFamiliarEJGItems;
        this.persistenceService.setBodyAux(this.datosFamiliares);
        this.router.navigate(['/gestionEjg']);
        this.progressSpinner = false;
        this.commonServices.scrollTop();
      },
      err => {
        console.log(err);
      }
    );
  }

  setItalic(dato) {
    if (dato.fechabaja == null) {
      return false;
    } else {
      return true;
    }
  }

  getCols() {
    this.cols = [
      { field: "turnoDes", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "20%" },
      { field: "turno", header: "dato.jgr.guardia.guardias.turno", width: "10%" },
      { field: "numAnnioProcedimiento", header: "justiciaGratuita.ejg.datosGenerales.numAnnioProcedimiento", width: "5%" },
      { field: "apellidosYNombre", header: "busquedaSanciones.detalleSancion.letrado.literal", width: "20%" },
      { field: "fechaApertura", header: "gratuita.busquedaEJG.literal.fechaApertura", width: "10%" },
      { field: "estadoEJG", header: "justiciaGratuita.ejg.datosGenerales.EstadoEJG", width: "15%" },
      { field: "nombreApeSolicitante", header: "administracion.parametrosGenerales.literal.nombre.apellidos", width: "20%" },
    ];

    this.cols.forEach(it => this.buscadores.push(""));

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

  cancelaAnadirRemesa() {
    this.showModalAnadirRemesa = false;
  }

  checkEditarSeleccionados() {
    //cambiar
    let mess = this.translateService.instant("justiciaGratuita.ejg.message.cambiarEstado");
    let icon = "fa fa-edit";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.editarSeleccionados();
        this.cdEditarSeleccionados.hide();
      },
      reject: () => {
        this.msgs = [{
          severity: "info",
          summary: "Cancel",
          //cambiar
          detail: this.translateService.instant("general.message.accion.cancelada")
        }];

        this.editarSeleccionados();
        this.cdEditarSeleccionados.hide();
      }
    });
  }

  asociarEJGActa(rowData){
    if(this.acta != null){
      this.progressSpinner = true;

      let ejgItem: EJGItem = rowData[0];

      ejgItem.numActa = JSON.parse(JSON.stringify(this.acta.idacta)).toString();
      ejgItem.annioActa = JSON.parse(JSON.stringify(this.acta.anioacta)).toString();

      this.sigaServices.post("busquedaejgcomision_asociarEJGActa", ejgItem).subscribe(
        n => {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          localStorage.setItem('actasItem', JSON.stringify(this.acta));
          this.location.back();
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        },
        () => {
          this.progressSpinner = false;
          this.selectedDatos = [];
        }
      );
    }

  }

  actualizarEJGActa() {
    let data = [];
    let ejg: EJGItem;


    for (let i = 0; this.selectedDatos.length > i; i++) {
      ejg = this.selectedDatos[i];
      console.log("NumActa " + ejg.numActa, ", Annio Acta ", ejg.annioActa, ", Institucion ejg ", ejg.idInstitucion, ", FundamentoJurid" + ejg.fundamentoJuridico + " , ratificaciones " + ejg.tipoEJG + " , numero ejg" + ejg.numero + " , anio ejg" + ejg.annio)
      data.push(ejg);
    }

    if (this.selectAnioActa != false) {
      this.valueAnioActa = "";
      this.deleteAnioActa(data);
    } else {
      this.postAnioActa(data, this.valueAnioActa);
    }

    if (this.selectPonente != false) {
      this.valuePonente = "";
      this.deletePonente(data);
    } else {
      this.postPonente(data, this.valuePonente);
    }

    if (this.selectResolucionFundamento != false) {
      this.valueFundamento = "";
      this.valueResolucion = "";
      this.deleteResolucionFundamento(data);
    } else {
      this.postResolucionFundamento(data, this.valueResolucion, this.valueFundamento);
    }

  }
  postResolucionFundamento(data: any[], valueResolucion: any, valueFundamento: any) {
    throw new Error('Method not implemented.');
  }
  deleteResolucionFundamento(data: any[]) {
    throw new Error('Method not implemented.');
  }
  postPonente(data: any[], valuePonente: any) {
    throw new Error('Method not implemented.');
  }
  deletePonente(data: any[]) {
    throw new Error('Method not implemented.');
  }
  postAnioActa(data: any[], valuePonente: any) {
    throw new Error('Method not implemented.');
  }
  deleteAnioActa(data: any[]) {
    throw new Error('Method not implemented.');
  }

  isSelectMultiple() {
    this.selectAll = false;

    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;

      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
  }

  searchHistorical() {
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.searchHistoricalSend.emit(this.historico);
    this.selectAll = false;

    if (this.selectMultiple) {
      this.selectMultiple = false;
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.permisoEscritura) {
      if (!this.historico) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datos;
          this.numSelected = this.datos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datos.filter((dato) => dato.fechaBaja != undefined && dato.fechaBaja != null);
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      }
    }
  }


  onChangeBorrarAnioActa(event: any) {
    this.valueAnioActa = null;
    this.styleObligatorioPonente(event);
    this.styleObligatorioFechaPonente(event);
    console.log(this.selectAnioActa);
  }



  onChangeBorrarPonenteFecha(event: any) {
    this.valueFechaPonente = null;
    this.valuePonente = null;
    console.log(this.selectPonente);
  }

  onChangeBorrarResolucionFundamento(event: any) {
    this.valueResolucion = null;
    this.valueFundamento = null;
    console.log(this.selectResolucionFundamento);
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  checkPermisos() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
      return false;
    } else {
      return true;
    }
  }

  clear() {
    this.msgs = [];
  }

  comunicar() {

  }


  cerrarDialog() {
    this.cerrarModalED();
  }

  downloadEEJ() {
    this.progressSpinner = true;

    this.sigaServices.postDownloadFiles("gestionejg_descargarExpedientesJG", this.selectedDatos).subscribe(
      data => {

        let blob = null;

        let mime = "application/pdf";
        blob = new Blob([data], { type: mime });
        saveAs(blob, "eejg_2005_2018-01200_45837302G_20210525_131611.pdf");

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
      }
    );

  }

  addRemesa() {
    this.showModalAnadirRemesa = true;

    //Queda pendiente añadir el codigo que gestionaria el desplegable si se accede desde una fecha de remesa.
    //El desplegable tendria que tener el valor de la remesa de la que procede y además deshabilitar el desplegable para que no pueda cambiar de valor.
    if (this.remesa != null) {
      this.valueComboRemesa = this.remesa.descripcion;
    }

  }

  editarSeleccionados() {
    this.showModalEditarSeleccionados = true;
  }

  checkBotonAnadir() {
    if (this.valueComboRemesa == null) {
      this.disableBotonAnadir = true;
    }
    else this.disableBotonAnadir = false;
  }



  checkAnadirRemesa() {
    let mess = this.translateService.instant("justiciaGratuita.ejg.message.anadirExpedienteARemesa");
    let icon = "fa fa-edit";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.anadirRemesa();
        this.cdAnadirRemesa.hide();
        this.cdCambioEstado.hide();
        this.cancelaAnadirRemesa();
      },
      reject: () => {
        this.msgs = [{
          severity: "info",
          summary: "Cancel",
          detail: this.translateService.instant("general.message.accion.cancelada")
        }];
        this.cancelaAnadirRemesa();
        this.cdAnadirRemesa.hide();
        this.cdCambioEstado.hide();
      }
    });
  }

  getComboRemesa() {
    this.sigaServices.get("filtrosejg_comboRemesa").subscribe(
      n => {
        this.comboRemesa = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboRemesa);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboFundamento() {
    this.sigaServices
      .getParam(
        "filtrosejgcomision_comboFundamentoJuridComision", "?idTurno=" + this.filtro.resolucion
      )
      .subscribe(
        n => {
          console.log("******************************************getComboFundamento");
          this.comboFundamento = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboFundamento);
        },
        error => { },
        () => { }
      );
  }



  anadirRemesa() {
    this.progressSpinner = true;

    //El valor del desplegable del modal se encuentra en la variable valueComboRemesa.
    this.selectedDatos.forEach(it => {
      it.numRegRemesa = this.valueComboRemesa;
    });


    this.sigaServices.post("filtrosejg_anadirExpedienteARemesa", this.selectedDatos).subscribe(
      n => {
        this.progressSpinner = false;
        if (JSON.parse(n.body).status == "OK") this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.busqueda.EjgEnRemesa"));
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  actualizaSeleccionados(selectedDatos) {
    if(this.acta != null){
      this.asociarEJGActa(selectedDatos);
    }
    else{
      this.numSelected = selectedDatos.length;
      this.seleccion = false;
      this.checkAddRemesa(selectedDatos);
    }
  }

  checkAddRemesa(selectedDatos) {
    if (this.filtro.estadoEJG == "7" || this.filtro.estadoEJG == "8") {
      this.disableAddRemesa = false;
    }
    else {
      this.disableAddRemesa = true;
    }
  }

  guardarEditados() {

    if(this.valueAnioActa != null){
  
      var array = this.valueAnioActa.split(',');
      var annioActa = parseInt(array[1]);
      var idActa = parseInt(array[2]);
  
  
      this.selectedDatos.forEach(list => { list.annioActa = annioActa;
                                           list.numActa = idActa;})
  
      this.sigaServices.post("filtrosejgcomision_editarActaAnio", this.selectedDatos).subscribe(
        n => {
          this.progressSpinner = false;
          if (JSON.parse(n.body).status == "OK") this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.busqueda.EjgEnRemesa"));
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    }
  
    if(this.selectAnioActa == true){
      this.sigaServices.post("filtrosejgcomision_borrarActaAnio", this.selectedDatos).subscribe(
        n => {
          this.progressSpinner = false;
          if (JSON.parse(n.body).status == "OK") this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.busqueda.EjgEnRemesa"));
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    }
  
    if(this.valuePonente != null && this.valueFechaPonente != null){
  
      this.selectedDatos.forEach(list => { list.ponente = this.valuePonente;
        list.fechaPonenteDesd = this.valueFechaPonente;})
  
      this.sigaServices.post("filtrosejgcomision_editarPonente", this.selectedDatos).subscribe(
        n => {
          this.progressSpinner = false;
          if (JSON.parse(n.body).status == "OK") this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.busqueda.EjgEnRemesa"));
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    }
  
    if(this.selectPonente == true){
      this.sigaServices.post("filtrosejgcomision_borrarPonente", this.selectedDatos).subscribe(
        n => {
          this.progressSpinner = false;
          if (JSON.parse(n.body).status == "OK") this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.busqueda.EjgEnRemesa"));
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    }
  
  
    if(this.valueResolucion != null && (this.valueFundamento != null || parseInt(this.num) == 0)){
  
      this.selectedDatos.forEach(list => { list.idTipoDictamen = this.valueResolucion;
        list.fundamentoJuridico = this.valueFundamento;})
  
      this.sigaServices.post("filtrosejgcomision_editarResolucionFundamento", this.selectedDatos).subscribe(
        n => {
          this.progressSpinner = false;
          if (JSON.parse(n.body).status == "OK") this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.busqueda.EjgEnRemesa"));
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    }
  
    if(this.selectResolucionFundamento == true){
      this.sigaServices.post("filtrosejgcomision_borrarResolucionFundamento", this.selectedDatos).subscribe(
        n => {
          this.progressSpinner = false;
          if (JSON.parse(n.body).status == "OK") this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.busqueda.EjgEnRemesa"));
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    }
    this.cerrarModalED();
  }
cerrarModalED(){
  this.showModalEditarSeleccionados = false;
  this.valueAnioActa = null;
  this.selectAnioActa = false;
  this.valuePonente = null;
  this.valueFechaPonente = null;
  this.selectPonente = false;
  this.valueResolucion = null;
  this.valueFundamento = null;
  this.selectResolucionFundamento = false;
}


}



