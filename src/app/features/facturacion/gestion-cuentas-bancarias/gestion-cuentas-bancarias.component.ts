import { Input } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable, Message, ProgressSpinner } from 'primeng/primeng';
import { TranslateService } from '../../../commons/translate';
import { CuentasBancariasItem } from '../../../models/CuentasBancariasItem';
import { CommonsService } from '../../../_services/commons.service';
import { PersistenceService } from '../../../_services/persistence.service';
import { SigaServices } from '../../../_services/siga.service';
//import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-gestion-cuentas-bancarias',
  templateUrl: './gestion-cuentas-bancarias.component.html',
  styleUrls: ['./gestion-cuentas-bancarias.component.scss'],

})
export class GestionCuentasBancariasComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;

  // Tabla

  datos: CuentasBancariasItem[];
  cols: any[];
  first: number = 0;
  selectedItem: number = 10;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  buscadores = [];

  @ViewChild("table") table: DataTable;
  selectedDatos = [];
  
  permisoEscritura: boolean = true;

  historico;
  allCuentasBancarias: CuentasBancariasItem[];

  constructor(private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef, private router: Router,
    private sigaServices: SigaServices, private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService, private commonServices: CommonsService) {
  }

  ngOnInit() { 
    this.historico = false;
    this.getCols();
    this.cargarDatos();
  }

   getCols() {
    this.cols = [
      { field: "nombre", header: "censo.tipoAbono.banco", width: "35%" },
      { field: "iban", header: "censo.mutualidad.literal.iban", width: "10%" },
      { field: "comisionDescripcion", header: "general.boton.description", width: "10%" },
      { field: "comisionImporte", header: "facturacion.cuentasBancarias.comisionImporte", width: "10%" },
      { field: "sjcs", header: "menu.justiciaGratuita", width: "10%" },
      { field: "numUsos", header: "facturacion.cuentasBancarias.numUsos", width: "10%" },
      { field: "numFicheros", header: "facturacion.cuentasBancarias.numFicheros", width: "15%" },
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

  clear() {
    this.msgs = [];
  }

  onChangeSelectAll() {
      if (this.selectAll) {
        this.selectMultiple = true;
        this.selectedDatos = this.datos;
        this.numSelected = this.datos.length;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectMultiple = false;
      }
  }

  openTab(selectedRow) {
    let cuentaBancariaItem: CuentasBancariasItem = selectedRow;
    sessionStorage.setItem("cuentaBancariaItem", JSON.stringify(cuentaBancariaItem));
    this.router.navigate(["/fichaCuentaBancaria"]);
  }

  isNuevo() {
    if (sessionStorage.getItem("cuentaBancariaItem")) {
      sessionStorage.removeItem("cuentaBancariaItem");
    }

    this.persistenceService.clearDatos();
    sessionStorage.setItem("Nuevo", "true");
    this.router.navigate(["/fichaCuentaBancaria"]);
  }

  cargarDatos() {
    this.allCuentasBancarias = [];
    this.sigaServices.get("facturacionPyS_getCuentasBancarias").subscribe(
      data => {
        this.allCuentasBancarias = data.cuentasBancariasITem;
        this.cargarListaCuentasBancarias();
      },
      err => {
        console.log(err);
      },
    );
  }

  mostrarOcultarHistoricos() {
    this.historico = !this.historico;
    this.cargarListaCuentasBancarias();
    this.selectedDatos = [];
  }

  cargarListaCuentasBancarias() {
    this.datos = [];

    this.allCuentasBancarias.forEach( cuenta => {
      
      if (this.historico) {
        if (cuenta.fechaBaja != null) {
          this.datos.push(cuenta);
        }
      } else {
        if (cuenta.fechaBaja == null) {
          this.datos.push(cuenta);
        }
      }

    });
  }

  consultarEditar() { }

  confirm() {
    this.confirmationService.confirm({
        message: 'Se va a proceder a dar de baja la cuenta seleccionada ¿Desea continuar?',
        header: null,
        icon: null,
        accept: async () => {
            this.confirmDelete();
        }
    });
  }

  confirmDelete() { 
    this.progressSpinner = true;
    this.sigaServices.post("facturacionPyS_borrarCuentasBancarias", this.selectedDatos)
    .subscribe( 
      n => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.cargarDatos();
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
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
