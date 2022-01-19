import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from 'primeng/primeng';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Message } from 'primeng/components/common/message';
import { FacAbonoItem } from '../../../../../models/sjcs/FacAbonoItem';
import { DatePipe } from '@angular/common';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { DatosColegiadosItem } from '../../../../../models/DatosColegiadosItem';


@Component({
  selector: 'app-tabla-abonos-sjcs',
  templateUrl: './tabla-abonos-sjcs.component.html',
  styleUrls: ['./tabla-abonos-sjcs.component.scss'],

})
export class TablaAbonosSCJSComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  permisoEscritura: boolean = true;

  //Resultados de la busqueda
  @Input() datos: FacAbonoItem[];
  @Input() filtro;
  @Output() busqueda = new EventEmitter<boolean>();
  
  // Elementos para la tabla
  @ViewChild("table") table: DataTable;
  rowsPerPage = [];
  selectedItem: number = 10;
  selectedDatos = [];
  cols = [];
  buscadores = [];
  selectAll: boolean;
  selectMultiple: boolean;
  disabledNuevo : boolean = false;
  enabledSave:boolean = false;
  editar:boolean = false;


  constructor(
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.getCols();
  }

  // Se actualiza cada vez que cambien los inputs
  ngOnChanges() {
    this.selectedDatos = [];
    console.log("CA")
  }

  // Definición de las columnas
  getCols() {
    this.cols = [
      { field: "numeroAbono", header: this.translateService.instant("facturacionSJCS.tabla.abonosSJCS.numeroAbono"), width: "10%" },
      { field: "fechaEmision", header: this.translateService.instant("facturacion.facturas.fechaEmision"), width: "10%" },
      { field: "nombrePago", header: this.translateService.instant("facturacionSJCS.tabla.abonosSJCS.pagoSJCS"), width: "20%" },
      { field: "ncolident", header: this.translateService.instant("facturacion.facturas.numeroColegiadoIdentificador"), width: "10%" },
      { field: "nombreCompleto", header: this.translateService.instant("facturacion.productos.Cliente"), width: "20%" },
      { field: "esSociedad", header: this.translateService.instant("facturacionSJCS.filtros.abonosSJCS.sociedad"), width: "10%" },
      { field: "importeTotal", header: this.translateService.instant("facturacionSJCS.facturacionesYPagos.importeTotal"), width: "10%" }, 
      { field: "importePendientePorAbonar", header: this.translateService.instant("facturacion.facturas.importePendiente"), width: "10%" },
      { field: "estadoNombre", header: this.translateService.instant("censo.fichaIntegrantes.literal.estado"), width: "10%" }, 
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
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 30,
        value: 30
      },
    ];
  }

  // Abrir ficha de fichero de devoluciones
  openTab(evento) {
    console.log("evento -> ", evento);

    this.progressSpinner = true;

    this.persistenceService.setDatos(evento);
    
    sessionStorage.setItem('filtrosAbonosSJCS', JSON.stringify(this.filtro));
    sessionStorage.setItem('abonosSJCSItem', JSON.stringify(evento));

    this.router.navigate(["/fichaAbonosSJCS"]);


  }

  navigateToCliente(selectedRow:FacAbonoItem) {
    
    if (selectedRow.ncolident) {
      
      this.progressSpinner = true;

      sessionStorage.setItem("consulta", "true");
      let filtros = { idPersona: selectedRow.idPersona };

      this.sigaServices.postPaginado("busquedaColegiados_searchColegiadoFicha", "?numPagina=1", filtros).toPromise().then(
        n => {
          let results: DatosColegiadosItem[] = JSON.parse(n.body).colegiadoItem;
          
          if (results != undefined && results.length != 0) {
            let datosColegiado: DatosColegiadosItem = results[0];

            
            sessionStorage.setItem("abonosSJCSItem", JSON.stringify(selectedRow));
            sessionStorage.setItem("volver", "true");

            sessionStorage.setItem("personaBody", JSON.stringify(datosColegiado));
            sessionStorage.setItem("filtrosAbonosSJCS", JSON.stringify(filtros));
            sessionStorage.setItem("solicitudAprobada", "true");
            sessionStorage.setItem("origin", "Cliente");
          }
        },
        err => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      ).then(() => this.progressSpinner = false).then(() => {
        if (sessionStorage.getItem("personaBody")) {
          this.router.navigate(["/fichaColegial"]);
        } 
      });
    }
    
  }

  // Resultados por página
  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  // Checkbox de seleccionar todo
  onChangeSelectAll(): void {
      if (this.selectAll) {
        this.selectMultiple = true;
        this.selectedDatos = this.datos;
      } else {
        this.selectedDatos = [];
        this.selectMultiple = false;
      }
  }


  // FUnciones de utilidad

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
