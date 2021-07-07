import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { EstadoEJGItem } from '../../../../../models/sjcs/EstadoEJGItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/api';
import { DataTable } from "primeng/datatable";
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.scss']
})
export class EstadosComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaEstados: string;

  openFicha: boolean = false;
  nuevo;
  body: EJGItem;
  bodyInicial;
  rowsPerPage: any = [];
  cols;
  msgs;
  item: EJGItem;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  buscadores = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  estados:any[] = [];
  guardar:boolean = false;
  
  datosEstados: any[] = [];
  checkEstados: any[] = [];
  comboEstadoEJG = [];
  valueComboEstado: string = "";
  observacionesEstado: string = "";
  fechaEstado: Date = new Date();
  showModalAnadirEstado: boolean;

  datosFamiliares = [];

  selectionMode: string = "single";
  editMode: boolean;

  progressSpinner: boolean = false;
  editaEstado: boolean = false;
  resaltadoDatosGenerales: boolean = false;
  fichaPosible = {
    key: "estados",
    activa: false
  }

  inserCol: any[] = [];

  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Input() openTarjetaEstados;
  //@Output() busqueda = new EventEmitter<boolean>();

  @ViewChild("table")
  table: DataTable;
  creaEstado: boolean = false;
  numSelectedEstados: number;
  restablecer: boolean;

  //[x: string]: any;


  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonsServices: CommonsService,
    private translateService: TranslateService, private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.persistenceService.getDatos()) {
      this.nuevo = false;
      this.modoEdicion = true;
      this.body = this.persistenceService.getDatos();
      this.item = this.body;
      this.getEstados(this.item);
      this.getCols();
    } else {
      this.nuevo = true;
      this.modoEdicion = false;
      this.item = new EJGItem();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaEstados == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  getEstados(selected) {
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getEstados", selected).subscribe(
      n => {
        this.estados = JSON.parse(n.body).estadoEjgItems;
        this.datosEstados = this.estados;
        // this.nExpedientes = this.expedientesEcon.length;
        // this.persistenceService.setFiltrosAux(this.expedientesEcon);
        // this.router.navigate(['/gestionEjg']);
        this.checkEstados = JSON.parse(JSON.stringify(this.estados));
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
      }
    );
    for(let i in this.datosEstados){
      this.datosEstados[i].isMod = false;
    }
  }
  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }
  openTab(evento) {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    if (!this.selectAll && !this.selectMultiple) {
    } else {
      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }
    }
  }
  getCols() {
    this.cols = [
      { field: "fechaInicio", header: "censo.nuevaSolicitud.fechaEstado", width: "10%" },
      { field: "fechaModificacion", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "10%" },
      { field: "descripcion", header: "censo.fichaIntegrantes.literal.estado", width: "15%" },
      { field: "observaciones", header: "gratuita.mantenimientoLG.literal.observaciones", width: "25%" },
      { field: "automatico", header: "administracion.auditoriaUsuarios.literal.Automatico", width: "10%" },
      { field: "propietario", header: "justiciaGratuita.ejg.documentacion.Propietario", width: "5%" },
      { field: "user", header: "menu.administracion.auditoria.usuarios", width: "25%" },
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
          this.selectedDatos = this.datosFamiliares;
          this.numSelected = this.datosFamiliares.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares.filter(
            (dato) => dato.fechaBaja != undefined && dato.fechaBaja != null
          );
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      }
    }
  }
  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }
  confirmDelete() {
    let mess = this.translateService.instant(
      "justiciaGratuita.ejg.message.eliminarEstado"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.delete();

      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancelar",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
        this.activarRestablecerEstados();
      }
    });
  }
  

  delete() {
    this.progressSpinner = true;


    for (let i = 0; this.selectedDatos.length > i; i++) {
      if (this.selectedDatos[i].automatico != "0") {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("areasmaterias.materias.ficha.eliminarError"));
        return;
      }
      
    }


    this.sigaServices.post("gestionejg_borrarEstado", this.selectedDatos).subscribe(
      n => {
        console.log(n);
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.getEstados(this.item);
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
    this.activarRestablecerEstados();
  }

  getComboEstado() {
    this.progressSpinner = true;

    this.sigaServices.get("filtrosejg_comboEstadoEJG").subscribe(
      n => {
        this.comboEstadoEJG = n.combooItems;
        //this.commonServices.arregloTildesCombo(this.comboEstadoEJG);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  changeEstado() {

    this.showModalAnadirEstado = true;
    this.getComboEstado();

  }

  nuevaFila() {
    this.guardar = true;
    this.creaEstado = true;
    this.editaEstado = false;
    this.restablecer = true;

    //this.datosEstados = JSON.parse(JSON.stringify(this.estados));
    let dummy = {
      fechaInicio: "",
      fechaModificacion:"",
      descripcion: "",
      observaciones: "",
      automatico:"",
      propietario:"",
      user:"",
      nuevoRegistro: true,
      isMod: true
    };
    
    this.datosEstados = [dummy, ...this.datosEstados];
    this.datosEstados[0].isMod = false;
    this.getComboEstado();
  }

  cancelaAnadirEstado() {
    this.showModalAnadirEstado = false;
  }

  checkAnadirEstado() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      let mess;
    if(this.creaEstado == true){
     mess = this.translateService.instant("justiciaGratuita.ejg.datosGenerales.AddEstado");
  }else{
    mess = this.translateService.instant("general.message.aceptar");
  }
    let icon = "fa fa-edit";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.anadirEstado();
        
      },
      reject: () => {
        this.msgs = [{
          severity: "info",
          summary: "Cancel",
          detail: this.translateService.instant("general.message.accion.cancelada")
        }];
        this.activarRestablecerEstados();

      }
    });
    }
    
  }

  anadirEstado() {

    if(this.creaEstado == true){
      let estadoNew = new EstadoEJGItem();

      estadoNew.fechaInicio = this.fechaEstado;
      estadoNew.idEstadoejg = this.valueComboEstado;
      estadoNew.observaciones = this.observacionesEstado;
   
      estadoNew.numero = this.item.numero;
      estadoNew.anio = this.item.annio;
      estadoNew.idinstitucion = this.item.idInstitucion;
      estadoNew.idtipoejg = this.item.tipoEJG;
   
   
   
       this.progressSpinner = true;
   
       this.sigaServices.post("gestionejg_nuevoEstado", estadoNew).subscribe(
         n => {
           this.progressSpinner = false;
           this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
           this.getEstados(this.item);
         },
         err => {
           console.log(err);
           this.progressSpinner = false;
           //this.busqueda.emit(false);
           this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
         }
       );
       this.creaEstado = false;
    }else{
      console.log("edita")
      
       this.progressSpinner = true;
       this.selectedDatos[0].fechaInicio=this.fechaEstado;
       this.selectedDatos[0].idEstadoejg=this.valueComboEstado;
       this.selectedDatos[0].observaciones=this.observacionesEstado;
 
     this.sigaServices.post("gestionejg_editarEstado", this.selectedDatos[0]).subscribe(
       n => {
         this.progressSpinner = false;
         this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
         this.getEstados(this.item);
       },
       err => {
         console.log(err);
         this.progressSpinner = false;
         //this.busqueda.emit(false);
         this.selectedDatos=[];
         this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
       }
     ); 
     
    }

    this.activarRestablecerEstados();

  }

  searchHistorical() {
    this.item.historico = !this.item.historico;
    this.historico = !this.historico;
    if (this.historico) {
      this.editMode = false;
      this.nuevo = false;
      this.selectAll = false;
      this.numSelected = 0;
    }
    this.selectMultiple = false;
    this.selectionMode = "single";
    this.persistenceService.setHistorico(this.historico);
    this.getEstados(this.item);


  }

  esFichaActiva(key) {
    return this.fichaPosible.activa;
  }
  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "estados" &&
      !this.activacionTarjeta
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
    this.getEstados(this.item);
  }
  checkPermisosDelete() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (!this.permisoEscritura || (!this.selectMultiple && !this.selectAll) || this.selectedDatos.length == 0) {
        this.msgs = this.commonsServices.checkPermisoAccion();
      } else {
        this.confirmDelete();
      }
    }
  }
  checkPermisosActivate() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      //this.activate();
    }
  }

  styleObligatorio(resaltado, evento) {
    if (resaltado = 'estados') {
      if ((evento == null || evento == undefined || evento == "") && resaltado == "estados" && this.resaltadoDatosGenerales) {
        return "camposObligatorios";
      }
    }
    else {
      if (this.resaltadoDatosGenerales && (evento == undefined || evento == null || evento == "")) {
        return this.commonsServices.styleObligatorio(evento);
      }
    }
  }
  onRowSelectEstados(i) {
    let indice = parseInt(i);
    this.restablecer = true;
    this.editaEstado = false;
    
    if (!this.creaEstado) {
      if(this.datosEstados[indice] != undefined && this.datosEstados[indice].automatico != 1 && this.datosEstados[indice].fechabaja == null){
        this.editaEstado = true;
        this.guardar = true;
        for(let j = 0;j <= this.datosEstados.length;j++){
          if(j == indice){
            this.datosEstados[indice].isMod = true;
            this.getComboEstado();
          }else{
            this.datosEstados[j].isMod = false;
          }
        }
        

      } else {
        this.editaEstado = false;
        this.datosEstados[indice].isMod = false;
        this.restablecer = true;

      }
    } 
  }

  activarRestablecerEstados() {
      this.restablecer = false;
      this.editaEstado = false;
      this.creaEstado = false;
      this.guardar = false;
      this.selectedDatos = [];
      this.getEstados(this.item);
    
  }

  onChangeObservaciones(event){
    this.observacionesEstado = event.target.value;
  }
}
