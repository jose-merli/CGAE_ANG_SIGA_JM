import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { ConsultasItem } from '../../../models/ConsultasItem';
import { ConsultasSearchItem } from '../../../models/ConsultasSearchItem';
import { ConsultasObject } from '../../../models/ConsultasObject';
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
  progressSpinner: boolean = false;
  msgs: Message[];
  modulos: any[];
  objetivos: any[];
  clasesComunicaciones: any[];
  searchConsultas: ConsultasObject = new ConsultasObject();
  bodySearch: ConsultasSearchItem = new ConsultasSearchItem();
  eliminarArray: any[];
  duplicarArray: any[];
  selectedInstitucion: any;
  institucionActual: any;
  eliminar: boolean = false;



  @ViewChild('table') table: DataTable;
  selectedDatos


  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit() {


    this.bodySearch.generica = 'S';

    this.getInstitucion();

    sessionStorage.removeItem("crearNuevaConsulta");

    if (sessionStorage.getItem("filtrosConsulta") != null) {
      this.bodySearch = JSON.parse(sessionStorage.getItem("filtrosConsulta"));
      this.buscar();
    }

    this.getCombos();
    this.selectedItem = 4;

    this.cols = [
      { field: 'modulo', header: 'Módulo' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'objetivo', header: 'Objetivo' },
      { field: 'claseComunicacion', header: 'Clases de comunicaciones' },
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


  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });
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



  getCombos() {
    this.sigaServices.get("consultas_comboObjetivos").subscribe(
      data => {
        this.objetivos = data.combooItems;
      },
      err => {
        console.log(err);
      }),

      this.sigaServices.get("consultas_comboModulos").subscribe(
        data => {
          this.modulos = data.combooItems;
        },
        err => {
          console.log(err);
        }),

      this.sigaServices.get("consultas_claseComunicaciones").subscribe(
        data => {
          this.clasesComunicaciones = data.combooItems;
        },
        err => {
          console.log(err);
        })

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
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    sessionStorage.removeItem("consultasSearch");
    sessionStorage.removeItem("filtrosConsulta");
    this.getResultados();

  }

  getResultados() {
    this.sigaServices
      .postPaginado("consultas_search", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.searchConsultas = JSON.parse(data["body"]);
          this.datos = this.searchConsultas.consultaItem;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.table.reset();
        }
      );
  }



  duplicar(dato) {

    this.duplicarArray = [];
    dato.forEach(element => {
      let objDuplicar = {
        idConsulta: element.idConsulta,
        idInstitucion: element.idInstitucion
      }
      this.duplicarArray.push(objDuplicar);
    });
    this.sigaServices.post("consultas_duplicar", this.duplicarArray).subscribe(
      data => {
        this.showSuccess('Se ha duplicado la consulta correctamente');
      },
      err => {
        this.showFail('Error al duplicado la consulta');
        console.log(err);
      },
      () => {
        this.table.reset();
        this.buscar();

      }
    );
  }


  borrar(dato) {

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
        idConsulta: element.idConsulta,
        idInstitucion: element.idInstitucion
      }
      this.eliminarArray.push(objEliminar);
    });
    this.sigaServices.post("consultas_borrar", this.eliminarArray).subscribe(
      data => {
        let noBorrar = JSON.parse(data["body"]).message
        if (noBorrar == "noBorrar") {
          this.showInfo('No puede eliminarse la consulta');
        } else {
          this.showSuccess('Se ha eliminado la consulta correctamente');
        }


      },
      err => {
        this.showFail('Error al eliminar la consulta');
        console.log(err);
      },
      () => {
        this.table.reset();
        this.buscar();

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

  navigateTo(dato) {
    let id = dato[0].id;
    console.log(dato)
    this.selectedInstitucion = dato[0].idInstitucion;
    if (!this.selectMultiple) {
      if ((this.selectedInstitucion == this.institucionActual && dato[0].generica == "No") ||
        (this.institucionActual == 2000 && dato[0].generica == "Si")) {
        this.router.navigate(['/fichaConsulta']);
        sessionStorage.setItem("consultasSearch", JSON.stringify(dato[0]));
        sessionStorage.setItem("filtrosConsulta", JSON.stringify(this.bodySearch));
      } else {
        this.selectedDatos = [];
        this.showInfo('No puede editarse la consulta')
      }
    } else {
      if ((this.selectedInstitucion == this.institucionActual && dato[0].generica == "No") ||
        (this.institucionActual == 2000 && dato[0].generica == "Si")) {
        this.eliminar = true;
      } else {
        this.eliminar = false;
      }
    }
  }



  addConsulta() {
    this.router.navigate(['/fichaConsulta']);
    sessionStorage.removeItem("consultasSearch")
    sessionStorage.setItem("crearNuevaConsulta", JSON.stringify("true"));
  }

  isButtonDisabled() {
    if (this.bodySearch.idModulo != null && this.bodySearch.idModulo != '') {
      return false;
    }
    return true;
  }

  limpiar() {
    this.bodySearch = new ConsultasSearchItem();
    this.bodySearch.generica = 'S'
  }



}
