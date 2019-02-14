import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { EnviosMasivosItem } from '../../../models/EnviosMasivosItem';
import { EnviosMasivosSearchItem } from '../../../models/EnviosMasivosSearchItem';
import { EnviosMasivosObject } from '../../../models/EnviosMasivosObject';
import { ProgramarItem } from '../../../models/ProgramarItem';
import { TranslateService } from "../../../commons/translate/translation.service";
import { SigaServices } from "./../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Router } from '@angular/router';
import { esCalendar } from "../../../utils/calendar";

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-envios-masivos',
  templateUrl: './envios-masivos.component.html',
  styleUrls: ['./envios-masivos.component.scss'],
  host: {
    "(document:keypress)": "onKeyPress($event)"
  },
})
export class EnviosMasivosComponent implements OnInit {

  body: EnviosMasivosItem = new EnviosMasivosItem();
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
  progressSpinner: boolean = false;
  searchEnviosMasivos: EnviosMasivosObject = new EnviosMasivosObject();
  programarArray: any[];
  bodySearch: EnviosMasivosSearchItem = new EnviosMasivosSearchItem();
  eliminarArray: any[];
  enviosArray: any[];
  currentDate: Date = new Date();
  estado: any;
  loaderEtiquetas: boolean = false;
  fichaBusqueda: boolean = false;

  @ViewChild('table') table: DataTable;
  selectedDatos

  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit() {

    sessionStorage.removeItem("crearNuevoEnvio")
    if (sessionStorage.getItem("ComunicacionDuplicada") != null) {
      this.buscar();
      sessionStorage.removeItem("ComunicacionDuplicada");
    }
    if (sessionStorage.getItem("filtros") != null) {
      this.bodySearch = JSON.parse(sessionStorage.getItem("filtros"));
      this.bodySearch.fechaCreacion = this.bodySearch.fechaCreacion ? new Date(this.bodySearch.fechaCreacion) : null;
      this.bodySearch.fechaProgramacion = this.bodySearch.fechaProgramacion ? new Date(this.bodySearch.fechaProgramacion) : null;
      this.buscar();
    }


    this.getTipoEnvios();
    this.getEstadosEnvios();

    this.selectedItem = 10;

    this.cols = [
      { field: 'descripcion', header: 'Descripción' },
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

  getTipoEnvios() {
    this.sigaServices.get("enviosMasivos_tipo").subscribe(
      data => {
        this.tiposEnvio = data.combooItems;
        this.tiposEnvio.unshift({ label: 'Seleccionar', value: '' });
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.tiposEnvio.map(e => {
          let accents =
            "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
          let accentsOut =
            "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });
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
        this.estados.unshift({ label: 'Seleccionar', value: '' });
        console.log(this.estados)
      },
      err => {
        console.log(err);
      }
    );
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

  buscar() {
    this.showResultados = true;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    sessionStorage.removeItem("enviosMasivosSearch");
    sessionStorage.removeItem("filtros");
    if (sessionStorage.getItem("ComunicacionDuplicada") != null) {
      this.getResultadosComunicacionDuplicada();
      this.showSuccess('Se ha duplicado el envío correctamente');
    } else {
      this.getResultados();
    }

  }

  getResultados() {
    this.sigaServices
      .postPaginado("enviosMasivos_search", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.searchEnviosMasivos = JSON.parse(data["body"]);
          this.datos = this.searchEnviosMasivos.enviosMasivosItem;
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
  getResultadosComunicacionDuplicada() {
    {
      this.bodySearch = new EnviosMasivosSearchItem();
      this.bodySearch.fechaCreacion = new Date();
      this.sigaServices
        .postPaginado("enviosMasivos_search", "?numPagina=1", this.bodySearch)
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.searchEnviosMasivos = JSON.parse(data["body"]);
            this.datos = this.searchEnviosMasivos.enviosMasivosItem;
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
  }

  isButtonDisabled() {
    if (this.bodySearch.fechaCreacion != null) {
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


  enviar(dato) {

    this.enviosArray = [];

    dato.forEach(element => {
      let objEnviar = {
        idEnvio: element.idEnvio
      };
      this.enviosArray.push(objEnviar);
    });

    this.sigaServices.post("enviosMasivos_enviar", this.enviosArray).subscribe(
      data => {
        this.showSuccess('Se ha lanzado el envio correctamente');
      },
      err => {
        this.showFail('Error al procesar el envio');
        console.log(err);
      },
      () => {
      }
    );
  }



  confirmarCancelar(dato) {
    this.eliminarArray = [];
    dato.forEach(element => {
      let objEliminar = {
        idEstado: element.idEstado,
        idEnvio: element.idEnvio,
        fechaProgramacion: new Date(element.fechaProgramada)
      };
      this.eliminarArray.push(objEliminar);
    });
    this.sigaServices.post("enviosMasivos_cancelar", this.eliminarArray).subscribe(
      data => {
        this.showSuccess('Se ha cancelado el envío correctamente');
      },
      err => {
        this.showFail('Error al cancelar el envío');
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
    if (event.keyCode === KEY_CODE.ENTER && this.bodySearch.fechaCreacion != null) {
      this.buscar();
    }
  }

  navigateTo(dato) {
    this.estado = dato[0].idEstado;
    console.log(dato)
    if (!this.selectMultiple && this.estado == 4) {
      // this.body.estado = dato[0].estado;
      this.router.navigate(['/fichaRegistroEnvioMasivo']);
      sessionStorage.setItem("enviosMasivosSearch", JSON.stringify(dato[0]));
      sessionStorage.setItem("filtros", JSON.stringify(this.bodySearch));
    } else if (!this.selectMultiple && this.estado != 4) {
      this.showInfo('El envío está en proceso, no puede editarse')
      this.selectedDatos = [];
    }
  }

  onShowProgamar(dato) {
    this.showProgramar = true;

    if (!this.selectMultiple) {
      this.bodyProgramar.fechaProgramada = dato[0].fechaProgramacion;
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

  addEnvio() {
    this.router.navigate(['/fichaRegistroEnvioMasivo']);
    sessionStorage.removeItem("enviosMasivosSearch")
    sessionStorage.setItem("crearNuevoEnvio", JSON.stringify("true"));
  }

  /*
  función para que no cargue primero las etiquetas de los idiomas*/

  isCargado(key) {
    if (key != this.translateService.instant(key)) {
      this.loaderEtiquetas = false;
      return key
    } else {
      this.loaderEtiquetas = true;
    }

  }

  limpiar() {
    this.bodySearch = new EnviosMasivosSearchItem();
    this.datos = [];
  }

  abreCierraFicha() {
    this.fichaBusqueda = !this.fichaBusqueda;
  }


}


