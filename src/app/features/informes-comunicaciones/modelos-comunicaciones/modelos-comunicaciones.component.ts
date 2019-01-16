import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { ModelosComunicacionesItem } from '../../../models/ModelosComunicacionesItem';
import { TranslateService } from "../../../commons/translate/translation.service";
import { SigaServices } from "./../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Router } from '@angular/router';
export enum KEY_CODE {
  ENTER = 13
}



@Component({
  selector: 'app-modelos-comunicaciones',
  templateUrl: './modelos-comunicaciones.component.html',
  styleUrls: ['./modelos-comunicaciones.component.scss'],
  host: {
    "(document:keypress)": "onKeyPress($event)"
  },
})
export class ModelosComunicacionesComponent implements OnInit {

  body: ModelosComunicacionesItem = new ModelosComunicacionesItem;
  bodySearch: ModelosComunicacionesItem = new ModelosComunicacionesItem;
  colegios: any[];
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
  msgs: Message[];
  clasesComunicaciones: any[];
  progressSpinner: boolean = false;


  @ViewChild('table') table: DataTable;
  selectedDatos


  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit() {

    this.bodySearch.preseleccionar = 'SI';

    sessionStorage.removeItem("crearNuevoModelo");

    if (sessionStorage.getItem("filtrosModelos") != null) {
      this.bodySearch = JSON.parse(sessionStorage.getItem("filtrosModelos"));
      this.buscar();
    }


    this.selectedItem = 10;
    this.getComboColegios();
    this.getComboClases();
    // this.body.visible = true;



    this.cols = [
      { field: 'claseComunicacion', header: 'Clase comunicación' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'institucion', header: 'Institución' },
      { field: 'orden', header: 'Orden' },
      { field: 'preseleccionar', header: 'Preseleccionado', width: '20%' }
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


  getComboColegios() {
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboClases() {
    this.sigaServices.get("comunicaciones_claseComunicaciones").subscribe(
      n => {
        this.clasesComunicaciones = n.combooItems;
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
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    sessionStorage.removeItem("modelosSearch")
    sessionStorage.removeItem("filtrosModelos");
    this.getResultados();
  }


  getResultados(){
    let service = "modelos_search";
    if(this.showHistorico){
      service = "modelos_search_historico";
    }
    this.sigaServices.postPaginado(service, "?numPagina=1", this.bodySearch).subscribe(

      data => {
        this.progressSpinner = false;
        let object = JSON.parse(data["body"]);
        this.datos = object.modelosComunicacionItem;
      },
      err => {
        this.showFail('Error al programar el envío');
        console.log(err);
      },
      () => {
        this.table.reset();
      }
    );
  }

  getResultadosHistorico(){
    this.sigaServices.postPaginado("modelos_search_historico", "?numPagina=1", this.bodySearch).subscribe(

      data => {
        this.progressSpinner = false;
        let object = JSON.parse(data["body"]);
        this.datos = object.modelosComunicacionItem;
      },
      err => {
        this.showFail('Error al programar el envío');
        console.log(err);
      },
      () => {
        this.table.reset();
      }
    );
  }

  isButtonDisabled() {
    if (this.body.nombre != '' && this.body.nombre != null) {
      return false;
    }
    return true;
  }

  getHistorico(key) {
    if (key == 'visible') {
      this.showHistorico = true;      
    } else if (key == 'hidden') {
      this.showHistorico = false;
    }
    this.getResultados();
  }

  onDuplicar() {
    let modelo = {
      idModeloComunicacion: this.selectedDatos[0].idModeloComunicacion,
      idInstitucion: this.selectedDatos[0].idInstitucion
    }

    this.sigaServices.post("modelos_duplicar", modelo).subscribe(
      data => {
        this.showSuccess('Se ha duplicado correctamente');
      },
      err => {
        this.showFail('Error al duplicar el modelo');
        console.log(err);
      },
      () => {
        this.table.reset();
      }
    );
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
      let modelo = {
        idModeloComunicacion: dato[0].idModeloComunicacion,
        idInstitucion: dato[0].idInstitucion
      }
  
      this.sigaServices.post("modelos_borrar", modelo).subscribe(
        data => {
          this.showSuccess('Se ha borrado correctamente');
        },
        err => {
          this.showFail('Error al borrado el modelo');
          console.log(err);
        },
        () => {
          this.table.reset();
        }
      );

      //let x = this.datos.indexOf(dato);
      //this.datos.splice(x, 1);
      this.selectedDatos = [];
      this.selectMultiple = false;
      this.showSuccess('Se ha eliminado el modelo correctamente')
    } else {
      this.selectedDatos = [];
      this.showSuccess('Se han eliminado los destinatarios correctamente')
    }
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
    this.body = dato[0];
    if (!this.selectMultiple) {
      this.router.navigate(['/fichaModeloComunicaciones']);
      sessionStorage.setItem("modelosSearch", JSON.stringify(this.body));
      sessionStorage.setItem("filtrosModelos", JSON.stringify(this.bodySearch));
    }

  }



  addModelo() {
    this.router.navigate(['/fichaModeloComunicaciones']);
    sessionStorage.removeItem("modelosSearch")
    sessionStorage.setItem("crearNuevoModelo", JSON.stringify("true"));
  }





}
