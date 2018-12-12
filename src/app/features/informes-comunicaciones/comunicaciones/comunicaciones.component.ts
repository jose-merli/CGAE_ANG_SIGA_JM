import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { ComunicacionesItem } from '../../../models/ComunicacionesItem';
import { ComunicacionesSearchItem } from '../../../models/ComunicacionesSearchItem';
import { ComunicacionesObject } from '../../../models/ComunicacionesObject';
import { TranslateService } from "../../../commons/translate/translation.service";
import { SigaServices } from "./../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Router } from '@angular/router';
import { esCalendar } from "../../../utils/calendar";
import { ProgramarItem } from '../../../models/ProgramarItem';

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-comunicaciones',
  templateUrl: './comunicaciones.component.html',
  styleUrls: ['./comunicaciones.component.scss']
})
export class ComunicacionesComponent implements OnInit {
  body: ComunicacionesItem = new ComunicacionesItem();
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
  tiposEnvio: any[];
  estados: any[];
  clasesComunicaciones: any[];
  es: any = esCalendar;
  showProgramar: boolean = false;
  bodyProgramar: ProgramarItem = new ProgramarItem();
  eliminarArray: any[];
  progressSpinner: boolean = false;
  searchComunicaciones: ComunicacionesObject = new ComunicacionesObject();
  bodySearch: ComunicacionesSearchItem = new ComunicacionesSearchItem();

  @ViewChild('table') table: DataTable;
  selectedDatos


  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit() {
    this.selectedItem = 4;

    this.getTipoEnvios();
    this.getEstadosEnvios();

    if (sessionStorage.getItem("comunicacionesSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("comunicacionesSearch"));
    }

    this.cols = [
      // { field: 'clasesComunicaciones', header: 'Clases de comunicaciones' },
      { field: 'asunto', header: 'Asunto' },
      { field: 'fechaCreacion', header: 'Fecha creación' },
      { field: 'fechaProgramada', header: 'Fecha programación' },
      { field: 'tipoEnvio', header: 'Forma envío' },
      { field: 'estadoEnvio', header: 'Estado' }
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


  getTipoEnvios() {
    this.sigaServices.get("enviosMasivos_tipo").subscribe(
      data => {
        this.tiposEnvio = data.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }


  getEstadosEnvios() {
    this.sigaServices.get("enviosMasivos_estado").subscribe(
      data => {
        this.estados = data.combooItems;
      },
      err => {
        console.log(err);
      }
    );
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

  buscar() {
    this.showResultados = true;
    sessionStorage.removeItem("comunicacionesSearch")
    this.getResultados();

  }

  getResultados() {

    this.sigaServices
      .postPaginado("enviosMasivos_search", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.searchComunicaciones = JSON.parse(data["body"]);
          this.datos = this.searchComunicaciones.comunicacionesItem;
          this.body = this.datos[0];
          this.datos.forEach(element => {
            element.fechaProgramada = new Date(element.fechaProgramada);
            element.fechaCreacion = new Date(element.fechaCreacion);
          });
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => { }
      );
  }




  isButtonDisabled() {
    if (this.body.asunto != '' && this.body.asunto != null) {
      return false;
    }
    return true;
  }

  cancelar(dato) {

    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message: '¿Está seguro de cancelar los' + dato.length + 'envíos seleccionados',
      icon: "fa fa-trash-alt",
      accept: () => {
        this.confirmarCancelar(dato);
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


  confirmarCancelar(dato) {
    this.eliminarArray = [];
    dato.forEach(element => {
      let objEliminar = {
        idEstado: element.idEstado,
        idEnvio: element.idEnvio,
        fechaProgramada: new Date(element.fechaProgramada)
      };
      this.eliminarArray.push(objEliminar);
    });
    this.sigaServices.post("enviosMasivos_cancelar", this.eliminarArray).subscribe(
      data => {
        this.showSuccess('Se ha calcelado el envío correctamente');
      },
      err => {
        this.showFail('Error al calcelar el envío');
        console.log(err);
      },
      () => {
        this.buscar();
        this.table.reset();
      }
    );
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.buscar();
    }
  }


  programar(dato) {
    this.showProgramar = false;
    dato.forEach(element => {
      element.fechaProgramada = new Date(this.bodyProgramar.fechaProgramada)
    });
    this.sigaServices.post("enviosMasivos_programar", dato).subscribe(

      data => {
        this.showSuccess('Se ha programado el envío correctamente');
      },
      err => {
        this.showFail('Error al programar el envío');
        console.log(err);
      },
      () => {
        this.buscar();
        this.table.reset();
      }
    );
  }



  navigateTo(dato) {
    let id = dato[0].id;
    if (!this.selectMultiple) {
      this.router.navigate(['/fichaRegistroComunicacion']);
      sessionStorage.setItem("comunicacionesSearch", JSON.stringify(this.body));
    }
  }

  onShowProgamar(dato) {
    this.showProgramar = !this.showProgramar;
  }


  onAddComunicacion() {
    this.router.navigate(['/fichaRegistroComunicacion']);
    sessionStorage.removeItem("comunicacionesSearch")
  }

}
