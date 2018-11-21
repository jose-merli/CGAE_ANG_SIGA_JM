import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { ConsultasItem } from '../../../models/ConsultasItem';
import { TranslateService } from "../../../commons/translate/translation.service";
import { SigaServices } from "./../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Router } from '@angular/router';
export enum KEY_CODE {
  ENTER = 13
}


@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.scss']
})

export class ConsultasComponent implements OnInit {
  body: ConsultasItem = new ConsultasItem();
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  showResultados: boolean = false;
  msgs: Message[];
  modulos: any[];
  objetivos: any[];
  clasesComunicaciones: any[];


  @ViewChild('table') table: DataTable;
  selectedDatos


  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit() {
    this.selectedItem = 4;

    this.cols = [
      { field: 'modulo', header: 'Módulo' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'objetivo', header: 'Objetivo' },
      { field: 'clasesComunicaciones', header: 'Clases de comunicaciones' },
      { field: 'generica', header: 'Genérica' }
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

  onBuscar() {
    this.showResultados = true;
    this.getResultados();
  }

  getResultados() {
    this.datos = [
      { id: '1', nombre: 'Isabel Salinero', modulo: 'prueba' }
    ]
  }

  isButtonDisabled() {
    if (this.body.nombre != '' && this.body.nombre != null) {
      return false;
    }
    return true;
  }

  onDuplicar() {

  }

  onBorrar(dato) {
    this.confirmationService.confirm({
      message: this.translateService.instant("messages.deleteConfirmation"),
      icon: "fa fa-trash-alt",
      accept: () => {
        this.onConfirmarBorrar(dato);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  onConfirmarBorrar(dato) {
    if (!this.selectAll) {
      let x = this.datos.indexOf(dato);
      this.datos.splice(x, 1);
      this.selectedDatos = [];
      this.selectMultiple = false;
      this.showSuccess('Se ha eliminado el destinatario correctamente')
    } else {
      this.selectedDatos = [];
      this.showSuccess('Se han eliminado los destinatarios correctamente')
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.onBuscar();
    }
  }

  navigateTo(dato) {
    let id = dato[0].id;
    if (!this.selectMultiple) {
      this.router.navigate(['/fichaConsulta', id]);
    }

  }
}
