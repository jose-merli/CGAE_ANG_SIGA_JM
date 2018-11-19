import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Router } from '@angular/router';
import { TranslateService } from "../../../commons/translate/translation.service";
import { SigaServices } from "./../../../_services/siga.service";
import { PlantillaEnvioSearchItem } from '../../../models/PlantillaEnvioSearchItem';
export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-plantillas-envio',
  templateUrl: './plantillas-envio.component.html',
  styleUrls: ['./plantillas-envio.component.scss']
})
export class PlantillasEnvioComponent implements OnInit {

  fichaBusqueda: boolean = true;
  msgs: Message[];
  comboTipoEnvio: any = [];
  filtro: PlantillaEnvioSearchItem = new PlantillaEnvioSearchItem();
  tipoEnvioSelected: any;


  //variables tabla
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  showResultados: boolean = false;
  showHistorico: boolean = false;



  @ViewChild('table') table: DataTable;
  selectedDatos

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService, private router: Router) { }


  ngOnInit() {


    this.configTabla();

    this.comboTipoEnvio = [{ label: '', value: '' }, { label: 'SMS', value: '1' }, { label: 'email', value: '2' }, { label: 'carta', value: '3' }]


  }



  configTabla() {


    this.cols = [
      { field: 'nombre', header: 'Nombre', width: '25%' },
      { field: 'tipoEnvio', header: 'Tipo de envío', width: '25%' },
      { field: 'descripcion', header: 'Descripción' },
    ];

    //numero de filas predeterminadas a mostrar
    this.selectedItem = 10;

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




  getResultados() {

    this.datos = [
      { id: '1', nombre: 'Plantilla test', tipoEnvio: 'SMS', descripcion: 'descripcion' },
      { id: '2', nombre: 'Plantilla test', tipoEnvio: 'Buro fax', descripcion: 'descripcion' },
      { id: '3', nombre: 'Plantilla test', tipoEnvio: 'Paloma mensajera', descripcion: 'descripcion' },
      { id: '4', nombre: 'Plantilla test', tipoEnvio: 'Telequinesis', descripcion: 'descripcion' }
    ]
    console.log(this.datos);

  }



  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }


  isSelectMultiple() {
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

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  detallePlantilla(item) {

    //sessionStorage.setItem("filtros", JSON.stringify(item));
    let id = item[0].id;
    if (!this.selectMultiple) {
      this.router.navigate(["/detallePlantillas", id]);
    }
  }

  onBuscar() {
    this.showResultados = true;
    this.getResultados();
  }


  onChangeTipoEnvio(event) {

    if (event.value) {
      this.tipoEnvioSelected = event.value;

    }

  }

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }

  abreCierraFicha() {
    this.fichaBusqueda = !this.fichaBusqueda;
  }

}
