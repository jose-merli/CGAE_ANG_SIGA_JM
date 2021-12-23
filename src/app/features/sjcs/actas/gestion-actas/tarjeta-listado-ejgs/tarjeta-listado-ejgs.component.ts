import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef, SimpleChanges, ViewChildren } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { ConfirmationService, Paginator } from 'primeng/primeng';
import { CommonsService } from '../../../../../_services/commons.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { ActasItem } from '../../../../../models/sjcs/ActasItem';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
@Component({
  selector: 'app-tarjeta-listado-ejgs',
  templateUrl: './tarjeta-listado-ejgs.component.html',
  styleUrls: ['./tarjeta-listado-ejgs.component.scss']
})
export class TarjetaListadoEjgsComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  msgs;
  page: number = 0;
  selectedBefore;
  abreviatura;

  body;

  openFicha: boolean = true;
  selectedItem: number = 10;
  selectAll: boolean = false;
  selectedDatos: EJGItem[] = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  guardado: boolean = false;


  message;

  initDatos;
  progressSpinner: boolean = false;
  buscadores = []
  actaDatosEntradaItem;
  resaltadoEJGsAsociados: boolean = false;
  modoEdicion: boolean = false;
  ejgTotales;
  ejgs;

  //Resultados de la busqueda
  @Input() datos: ActasItem;

  @Input() permisos;

  @Output() search = new EventEmitter<boolean>();
  @Output() expedientesEvent = new EventEmitter<string>();
  @ViewChild("tabla") tabla;
  @Input() openGen;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  fichasPosibles = [
    {
      key: "generales",
      activa: true
    },
    {
      key: "configuracion",
      activa: false
    },
  ];

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private router: Router,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
    console.log("this.datos -> ", this.datos);
    if(this.datos.numeroacta != null && this.datos.numeroacta != undefined && (this.datos.fecharesolucion == null || this.datos.fecharesolucion == undefined)){
      this.guardado = true;
    }
    this.getAbreviatura();
    this.getCols();
    this.resaltadoEJGsAsociados = true;
  }

  getAbreviatura() {
    this.sigaServices
      .get("filtrosacta_getAbreviatura")
      .subscribe(
        n => {
          this.abreviatura = n.abreviatura;

          if(this.datos.anioacta != null && this.datos.anioacta != undefined){
            this.getEJG(this.datos);
          }

        },
        err => {
          console.log(err);
        }
      );
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    console.log(changes.tabla);
    this.selectedDatos = [];
    if (this.openGen == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('EJGsAsociados');
      }
    } 
  }

  abreCierraFicha(key) {
    this.resaltadoEJGsAsociados = true;
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (
      key == "EJGsAsociados" &&
      !this.modoEdicion
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.modoEdicion) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);    
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  selectedRow(selectedDatos) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
      if (this.numSelected == 1) {
        this.selectMultiple = false;
      } else {
        this.selectMultiple = true;
      }
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.editElementDisabled();
      this.selectedDatos = this.ejgs;
      this.numSelected = this.ejgs.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
    this.selectMultiple = true;
  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    this.cols = [
      { field: "numAnnioProcedimiento", header: "justiciaGratuita.remesas.ficha.identificadorEJG", display: "table-cell" },
      { field: "estadoEJG", header: "justiciaGratuita.ejg.datosGenerales.EstadoEJG", display: "table-cell" },
      { field: "apellidosYNombre", header: "justiciaGratuita.ejg.datosGenerales.Ponente", display: "table-cell" },
      { field: "turnoDes", header: "justiciaGratuita.remesas.ficha.TurnoGuardiaEJG", display: "table-cell" },
      { field: "turno", header: "justiciaGratuita.sjcs.designas.DatosIden.turno", display: "table-cell" },
      { field: "fechaApertura", header: "censo.resultadosSolicitudesModificacion.literal.fecha", display: "table-cell" },
      { field: "nombreApeSolicitante", header: "justiciaGratuita.justiciables.rol.solicitante", display: "table-cell" },
      { field: "resolucion", header: "justiciaGratuita.maestros.fundamentosResolucion.resolucion", display: "table-cell" }
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

  getEJG(acta:ActasItem){
    this.progressSpinner = true;
    if(acta.numeroacta.toString().includes("/")){
      let numActa = acta.numeroacta.split("/");
      this.actaDatosEntradaItem =
      {
        'annioActa': acta.anioacta,
        'numActa': numActa[1]
      };
    }
    else{
      this.actaDatosEntradaItem =
      {
        'annioActa': acta.anioacta,
        'numActa': acta.numeroacta
      };
    }
    this.sigaServices.post("filtrosejgcomision_busquedaEJGActaComision", this.actaDatosEntradaItem).subscribe(
      n => {
        console.log("Dentro del servicio del padre que llama al getEJGRemesa");
        this.ejgs = JSON.parse(n.body).ejgItems;

        this.ejgTotales = this.ejgs.length;
        this.expedientesEvent.emit(this.ejgTotales)
        this.ejgs.forEach(element => {
          element.numAnnioProcedimiento = this.abreviatura + "-" + element.numAnnioProcedimiento;
        });

        console.log("Contenido de la respuesta del back --> ", this.ejgs);
        this.progressSpinner = false;

        if (this.ejgs.length == 200) {
          console.log("Dentro del if del mensaje con mas de 200 resultados");
          this.showMessage('info', this.translateService.instant("general.message.informacion"), this.translateService.instant("general.message.consulta.resultados"));
        }

      },
      err => {
        this.progressSpinner = false;
        let error = err;
        console.log(err);
      },
      () => {
        
      });
  }

  asociarEJG() {
    sessionStorage.setItem('actasItem', JSON.stringify(this.datos));
    this.router.navigate(["/ejg-comision"]);
  }

  consultarEditarEJG(rowData){
    this.progressSpinner = true;
    
    this.sigaServices.post("gestionejg_datosEJG", rowData).subscribe(
      n => {
        let ejgObject = JSON.parse(n.body).ejgItems;
        this.persistenceService.setDatos(ejgObject[0]);
        this.consultaUnidadFamiliar(rowData);
        this.commonsService.scrollTop();
      },
      err => {
        this.commonsService.scrollTop();
      }
    );
  }

  consultaUnidadFamiliar(selected) {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_unidadFamiliarEJG", selected).subscribe(
      n => {
        let datosFamiliares = JSON.parse(n.body).unidadFamiliarEJGItems;
        this.persistenceService.setBodyAux(datosFamiliares);
        sessionStorage.setItem('actasItem', JSON.stringify(this.datos));
        this.router.navigate(['/gestionEjg']);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  editElementDisabled() {
    this.ejgs.forEach(element => {
      element.editable = false
      element.overlayVisible = false;
    });
  }

  actualizaSeleccionados(selectedDatos) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
      if (this.numSelected == 1) {
        this.selectMultiple = false;
      } else {
        this.selectMultiple = true;
      }
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

  clear() {
    this.msgs = [];
  }
  

}
