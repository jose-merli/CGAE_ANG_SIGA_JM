import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { Message } from 'primeng/components/common/api';
import { procesos_ejg } from '../../../../../permisos/procesos_ejg';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_justiciables } from '../../../../../permisos/procesos_justiciables';


@Component({
  selector: 'app-contrarios-pre-designacion',
  templateUrl: './contrarios-pre-designacion.component.html',
  styleUrls: ['./contrarios-pre-designacion.component.scss']
})
export class ContrariosPreDesignacionComponent implements OnInit {

  msgs: Message[];
  openCon: boolean = false;
  contrariosEJG = [];
  historicoContrario: boolean = false;
  ejg: EJGItem;
  primero;
  selectedItem: number = 10;
  datos;
  cols;
  rowsPerPage;
  selectMultiple: boolean = false;
  selectionMode: string = "single";
  numSelected = 0;
  nuevo: boolean = false;
  eliminar: boolean = false;
  openFicha: boolean = false;
  selectedDatos: any = [];
  selectAll: boolean = false;
  progressSpinner: boolean = false;
  resaltadoDatosGenerales: boolean = false;
  activacionTarjeta: boolean = false;
  permisoContrarios:boolean = false;

  @Input() tengoPermiso: boolean;
  @Input() permisoEscritura: boolean = false;
  
  @Output() opened = new EventEmitter<boolean>();
  @Output() idOpened = new EventEmitter<boolean>();
  
  @ViewChild("table") tabla;
  
  fichaPosible = {
    key: "contrariosPreDesigna",
    activa: false
  }


  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService,
    private router: Router,
    private commonService: CommonsService) { }


  ngOnInit() {

    this.checkAcceso(procesos_ejg.contrarios);
    this.checkTengoPermiso();

    this.getCols();
    this.ejg = this.persistenceService.getDatosEJG();
    if (sessionStorage.getItem('tarjeta') == 'contrariosPreDesigna') {
      this.abreCierraFicha('contrariosPreDesigna');
      let top = document.getElementById("contrariosPreDesigna");
      if (top) {
        top.scrollIntoView();
        top = null;
      }
      sessionStorage.removeItem('tarjeta');
    }

    sessionStorage.removeItem("origin");
    sessionStorage.removeItem("procuradorFicha");
    sessionStorage.removeItem("contrarioEJG");
    

    this.searchContrariosEJG();

  }
  checkAcceso(contrarios: String) {
    this.commonService.checkAcceso(contrarios)
      .then(respuesta => {
        //this.progressSpinner = true;
        if(respuesta==undefined){
          this.permisoContrarios = false
        }
        else{
          this.permisoContrarios = respuesta;
        }

        if(this.permisoEscritura && this.permisoContrarios){
          this.nuevo=true;
          this.eliminar = true;
        }else{
          this.nuevo=false;
          this.eliminar = false;
        }
      }
      ).catch(error => console.error(error));
  }

  checkTengoPermiso(){

    this.commonService.checkAcceso(procesos_justiciables.justiciables).then(respuesta=>{
      this.tengoPermiso = respuesta;
    })
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.datos = this.contrariosEJG;
    if(this.permisoEscritura && this.permisoContrarios){
      this.nuevo=true;
      this.eliminar = true;
    }else{
      this.nuevo=false;
      this.eliminar = false;
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  actualizaSeleccionados() {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (this.selectedDatos != undefined) {
      if (this.selectedDatos.length == undefined) this.numSelected = 1;
      else this.numSelected = this.selectedDatos.length;
    }
  }
  esFichaActiva(key) {

    return this.fichaPosible.activa;
  }

  getCols() {

    this.cols = [
      { field: "nif", header: "justiciaGratuita.oficio.designas.contrarios.identificador" },
      { field: "apellidosnombre", header: "administracion.parametrosGenerales.literal.nombre.apellidos" },
      /* { field: "abogado", header: "justiciaGratuita.oficio.designas.contrarios.abogado" },
      { field: "procurador", header: "justiciaGratuita.oficio.designas.contrarios.procurador" } */
      { field: "direccion", header: "censo.consultaDirecciones.literal.direccion" },
      { field: "rol", header: "administracion.usuarios.literal.rol" }
    ];

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
  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "contrariosPreDesigna" &&
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
  }
  Eliminar() {
    if (!this.permisoEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.existeDesignaAsociado')
			);
		}else if (!this.permisoContrarios) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		} else{
      this.progressSpinner = true;
      let request = [this.selectedDatos.idPersona, this.selectedDatos.anio, this.selectedDatos.numero, this.selectedDatos.idtipoejg]
      this.sigaServices.post("gestionejg_deleteContrarioEJG", request).subscribe(
        data => {
          this.selectedDatos = [];
          this.searchContrariosEJG();
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.progressSpinner = false;
          this.historicoContrario = false;
        },
        err => {
          if (err != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          this.selectMultiple = false;
          this.selectAll = false;
        }
      );
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

  searchContrariosEJG() {
    //this.progressSpinner = true;

    let item = [this.ejg.numero.toString(), this.ejg.annio, this.ejg.tipoEJG, this.historicoContrario];

    this.sigaServices.post("gestionejg_busquedaListaContrariosEJG", item).subscribe(n => {

      //Contrarios segun el valor de historico
      this.contrariosEJG = JSON.parse(n.body);
      //Primer contrario para la cabecera
      this.primero = this.contrariosEJG[0];
      //Datos para la tabla
      this.datos = this.contrariosEJG;

      //Le asignamos a la columna de rol valor CONTRARIO
      this.datos.forEach(element => {
        element.rol = "CONTRARIO";
      }); 

      let error = JSON.parse(n.body).error;
      // if(sessionStorage.getItem("contrarios" &&)!=null)this.router.navigate(["/justiciables"]);
      if (error != null && error.description != null) {
        this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
      }
      //this.progressSpinner = false;
    },
      err => {
      });
      //this.progressSpinner = false;
  }

  NewContrario() {
    if (!this.permisoEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.existeDesignaAsociado')
			);
		}else if (!this.permisoContrarios) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		} else{
      sessionStorage.setItem("origin", "newContrarioEJG");
      sessionStorage.setItem("contrariosEJG", JSON.stringify(this.contrariosEJG));
      this.ejg = this.persistenceService.getDatosEJG();
      sessionStorage.setItem("itemEJG", JSON.stringify(true));
      sessionStorage.setItem("EJGItem", JSON.stringify(this.ejg));
      //this.searchContrarios.emit(true);
      this.router.navigate(["/justiciables"]);
    }
  }

  openTab(evento) {
    let contrario = new JusticiableBusquedaItem();
    let datos;
    contrario.idpersona = evento.idPersona;
    sessionStorage.setItem("personaDesigna", evento.idPersona);
    //this.progressSpinner = true;
    this.sigaServices.post("busquedaJusticiables_searchJusticiables", contrario).subscribe(
      n => {
        datos = JSON.parse(n.body).justiciableBusquedaItems;
        let error = JSON.parse(n.body).error;
        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }

        this.ejg = this.persistenceService.getDatosEJG();
        sessionStorage.setItem("EJGItem", JSON.stringify(this.ejg));
        sessionStorage.setItem("itemEJG", JSON.stringify(true));
        this.persistenceService.setDatosEJG(datos[0]);
        sessionStorage.setItem("origin", "ContrarioEJG");
        this.persistenceService.clearBody();
        sessionStorage.setItem("contrarioEJG", JSON.stringify(evento));
        if (evento.abogado != "" && evento.abogado != null) {
          sessionStorage.setItem("idabogadoFicha", evento.idabogadocontrario);
        }
        // if (evento.procurador != "" && evento.procurador != null) {
        //   sessionStorage.setItem("procuradorFicha", evento.procurador);
        // }

        if (evento.representante != "" && evento.representante != null) {
          let representante = new JusticiableBusquedaItem();
          representante.idpersona = evento.representante;
          this.sigaServices.post("busquedaJusticiables_searchJusticiables", representante).subscribe(
            j => {
              this.persistenceService.setBody(JSON.parse(j.body).justiciableBusquedaItems[0]);
              this.router.navigate(["/gestionJusticiables"]);
            })
        }
        else {
          sessionStorage.setItem("EJGItem", JSON.stringify(this.ejg));
          this.router.navigate(["/gestionJusticiables"]);
        }
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      });
  }

  abreCierra(key) {
    if (
      key == "contrariosPreDesigna"){
    this.openCon = !this.openCon;
      }
  }

  searchHistorical() {
    if (!this.permisoContrarios) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		} else{
      this.historicoContrario = !this.historicoContrario;
      this.selectAll = false;
      this.selectedDatos = [];
      this.searchContrariosEJG();
    }
  }

  isEliminado(dato) {
    return dato.fechaBaja != null;
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      /* if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
        this.selectMultiple = true;
        this.selectionMode = "single";
      } else { */
      this.selectedDatos = this.datos;
      /* this.selectMultiple = false;
      this.selectionMode = "single";
    }
    this.selectionMode = "multiple"; */
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      /*  if (this.historico)
         this.selectMultiple = true;
       this.selectionMode = "multiple"; */
    }
  }

  clear() {
    this.msgs = [];
  }
}
