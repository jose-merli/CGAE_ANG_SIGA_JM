import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef, SimpleChanges, ViewChildren } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { ConfirmationService, Paginator } from 'primeng/primeng';
import { CommonsService } from '../../../../../_services/commons.service';
import { RemesasBusquedaObject } from '../../../../../models/sjcs/RemesasBusquedaObject';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { ComboItem } from '../../../../administracion/parametros/parametros-generales/parametros-generales.component';
import { RemesasItem } from '../../../../../models/sjcs/RemesasItem';

@Component({
  selector: 'app-tarjeta-ejgs',
  templateUrl: './tarjeta-ejgs.component.html',
  styleUrls: ['./tarjeta-ejgs.component.scss']
})

export class TarjetaEjgsComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  msgs;
  page: number = 0;
  selectedBefore;


  body;

  openFicha: boolean = false;
  selectedItem: number = 10;
  selectAll: boolean = false;
  selectedDatos: any[] = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;

  message;

  initDatos;
  progressSpinner: boolean = false;
  buscadores = []
  estadoRemesa: ComboItem[] = [{ value: "con_inci", label: "Expedientes con incidencias"},{ value: "sin_inci", label:  "Expedientes sin incidencias"},{ value: "inci_env", label: "Expedientes con incidencias antes del envío"},{ value: "desp_env", label:  "Expedientes con incidencias después del envío"}, { value: "inci_no_re", label: "Expedientes con incidencias y no en nueva remesa"}];
  estadoRemesaSeleccionado;
  resaltadoEJGsAsociados: boolean = false;
  modoEdicion: boolean = false;

  //Resultados de la busqueda
  @Input() datos;

  @Input() permisos;

  @Output() search = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;
  remesasDatosEntradaItem;
  @Input() remesaTabla;
  @Input() remesaItem: RemesasItem = new RemesasItem();
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
    if(this.remesaTabla != null){
      this.getEJGRemesa(this.remesaTabla);
    }

    this.getCols();
    this.resaltadoEJGsAsociados = true;
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

    setTimeout(() => {
      console.log(this.tabla);
      if(this.openFicha) {
        this.tabla.filterConstraints['inCollection'] = function inCollection(value: any, filter: any): boolean{
          // value = array con los datos de la fila actual
          // filter = valor del filtro por el que se va a buscar en el array value
    
          let incidencias = value.split("/");
    
          if (filter === undefined || filter === null) {
            return true;
          }
    
          if (incidencias === undefined || incidencias === null || incidencias.length === 0) {
              return false;
          }
    
          for (let i = 0; i < incidencias.length; i++) {
            switch (filter) {
    
              case "con_inci":
                if(incidencias[0] == "1"){
                  return true;
                }
                break;
    
              case "sin_inci":
                if(incidencias[0] == "0"){
                  return true;
                }
                break;
            
              case "inci_env":
                if(incidencias[0] == "1" && incidencias[1] == "1"){
                  return true;
                }
                break;
    
              case "desp_env":
                if(incidencias[0] == "1" && incidencias[2] == "1"){
                  return true;
                }
                break;
            
              default:
                if(incidencias[0] == "1" && incidencias[3] == "0"){
                  return true;
                }
                break;
            }
          }
          return false;
        }
      }
    }, 1000);
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
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
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
      { field: "identificadorEJG", header: "justiciaGratuita.remesas.ficha.identificadorEJG", display: "table-cell" },
      { field: "turnoGuardiaEJG", header: "justiciaGratuita.remesas.ficha.TurnoGuardiaEJG", display: "table-cell" },
      { field: "anioEJG", header: "justiciaGratuita.oficio.justificacionExpres.anioEJG", display: "table-cell" },
      { field: "numeroEJG", header: "justiciaGratuita.oficio.justificacionExpres.numeroEJG", display: "table-cell" },
      { field: "estadoEJG", header: "justiciaGratuita.ejg.datosGenerales.EstadoEJG", display: "table-cell" },
      { field: "solicitante", header: "justiciaGratuita.justiciables.rol.solicitante", display: "table-cell" },
      { field: "nuevaRemesa", header: "justiciaGratuita.remesas.ficha.EnNuevaRemesa", display: "table-cell" },
      { field: "estadoRemesa", header: "justiciaGratuita.remesas.ficha.EstadoEJGDentroRemesa", display: "table-cell" },
      { field: "incidencias", header: "", width: "0.001%"}
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

  getEJGRemesa(remesa, padre?){
    this.progressSpinner = true;
    this.remesasDatosEntradaItem =
    {
      'idRemesa': (remesa.idRemesa != null && remesa.idRemesa != undefined) ? remesa.idRemesa.toString() : remesa.idRemesa,
      'comboIncidencia': (this.estadoRemesaSeleccionado != null && this.estadoRemesaSeleccionado != undefined) ? this.estadoRemesaSeleccionado.toString() : this.estadoRemesaSeleccionado
    };
    this.sigaServices.post("ficharemesas_getEJGRemesa", this.remesasDatosEntradaItem).subscribe(
      n => {
        console.log("Dentro del servicio del padre que llama al getEJGRemesa");
        this.datos = JSON.parse(n.body).ejgRemesa;

        this.datos.forEach(element => {
          if(element.nuevaRemesa == 0){
            element.nuevaRemesa = "No";
          }else{
            element.nuevaRemesa = "Si";
          }
          
        });

        if(padre){
          this.remesaItem.incidencias = "0 / 0";
        }

        console.log("Contenido de la respuesta del back --> ", this.datos);
        this.progressSpinner = false;

        if (this.datos.length == 200) {
          console.log("Dentro del if del mensaje con mas de 200 resultados");
          this.showMessage('info', this.translateService.instant("general.message.informacion"), "La consulta devuelve más de 200 resultados.");
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

  openTab(evento) {

    let paginacion = {
      paginacion: this.tabla.first,
      selectedItem: this.selectedItem
    };

    this.persistenceService.setPaginacion(paginacion);
    this.progressSpinner = true;
    this.persistenceService.setDatos(evento);
    this.router.navigate(["/fichaRemesasEnvio"]);
    localStorage.setItem('remesaItem', JSON.stringify(this.selectedDatos));
    localStorage.setItem('ficha', "registro");
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  editElementDisabled() {
    this.datos.forEach(element => {
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
