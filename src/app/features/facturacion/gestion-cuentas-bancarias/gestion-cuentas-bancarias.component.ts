import { Input } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable } from 'primeng/primeng';
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

  // url;

  /* constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("gestionCuentasBancarias");
  } */
  @Input() datos;
  @ViewChild("table") table: DataTable;
  msgs;
  cols;
  body: CuentasBancariasItem = new CuentasBancariasItem();
  selectedDatos = [];
  selectedItem;
  selectMultiple;
  permisoEscritura;
  selectAll;
  historico;
  rowsPerPage: any = [];
  buscadores = [];
  numSelected: number;
  listaCuentasBancarias: CuentasBancariasItem[];

  constructor(private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef, private router: Router,
    private sigaServices: SigaServices, private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService, private commonServices: CommonsService) {
  }

  ngOnInit() {
    this.getCols();
  }

  getCols() {
    this.cols = [
      { field: "nombre", header: "censo.tipoAbono.banco", width: "30%" },
      { field: "iban", header: "censo.mutualidad.literal.iban", width: "15%" },
      { field: "descripcion", header: "general.boton.description", width: "30%" },
      { field: "comisionImporte", header: "facturacion.cuentasBancarias.comisionImporte", width: "15%" },
      { field: "sjcs", header: "menu.justiciaGratuita", width: "5%" },
      { field: "numUsos", header: "facturacion.cuentasBancarias.numUsos", width: "5%" },
      { field: "numFicheros", header: "facturacion.cuentasBancarias.numFicheros", width: "5%" },
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
  nuevo() { }

  searchHistorical() {
    this.sigaServices.get("facturacionPyS_getCuentasBancarias").subscribe(
      data => {
        this.listaCuentasBancarias = data.cuentasBancariasITem;
      },
      err => {
        console.log(err);
      },
    );
  }

  consultarEditar() { }
  confirmDelete() { }

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
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}
