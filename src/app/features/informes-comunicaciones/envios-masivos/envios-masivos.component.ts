import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { EnviosMasivosItem } from '../../../models/EnviosMasivosItem';
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
  styleUrls: ['./envios-masivos.component.scss']
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

    if (sessionStorage.getItem("enviosMasivosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
    }

    this.getTipoEnvios();
    this.getEstadosEnvios();

    this.selectedItem = 10;

    this.cols = [
      { field: 'asunto', header: 'Asunto' },
      { field: 'fechaCreacion', header: 'Fecha creación' },
      { field: 'fechaProgramacion', header: 'Fecha programación' },
      { field: 'formaEnvio', header: 'Forma envío' },
      { field: 'estado', header: 'Estado' }
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
      n => {
        this.tiposEnvio = n.combooItems;

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
      n => {
        this.estados = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
      para poder filtrar el dato con o sin estos caracteres*/
        this.estados.map(e => {
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
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    sessionStorage.removeItem("enviosMasivosSearch")
    this.getResultados();
  }

  getResultados() {
    let searchObject = new EnviosMasivosItem();
    this.sigaServices
      .postPaginado("enviosMasivos_search", "?numPagina=1", searchObject)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.searchEnviosMasivos = JSON.parse(data["body"]);
          this.datos = this.searchEnviosMasivos.enviosMasivosItem;
          if (this.datos.length == 1) {
            this.body = this.datos[0];
          }
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => { }
      );
  }

  isButtonDisabled() {
    if (this.body.descripcion != '' && this.body.descripcion != null) {
      return false;
    }
    return true;
  }

  onDuplicar() {

  }

  onBorrar(dato) {
    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message: 'h',
      icon: "fa fa-trash-alt",
      accept: () => {
        this.onConfirmarBorrar(dato);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            // detail: this.translateService.instant(
            //   "general.message.accion.cancelada"
            // )
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
      this.router.navigate(['/fichaRegistroEnvioMasivo']);
      sessionStorage.setItem("enviosMasivosSearch", JSON.stringify(this.body));
    }
  }

  onShowProgamar(dato) {
    this.showProgramar = true;

    if (!this.selectMultiple) {
      this.bodyProgramar.fechaProgramar = dato[0].fechaProgramacion;
    }
  }

  onCancelProgramar(dato) {
    this.programarArray = [];
    this.showProgramar = false;
    dato.array.forEach(element => {
      let objProgramar = {
        idInstitucion: element.idInstitucion,
        idEnvio: element.idEnvio
      };
      this.programarArray.push(objProgramar);
    });
    this.sigaServices.post("enviosMasivos_cancelar", this.programarArray).subscribe(
      data => {
        this.showSuccess('Se ha programado el envío correctamente');
      },
      err => {
        this.showFail('Error al programar el envío');
        console.log(err);
      },
    );
  }

  onProgramar(dato) {
    this.showProgramar = false;
    this.programarArray = [];
    dato.array.forEach(element => {
      let objProgramar = {
        idInstitucion: element.idInstitucion,
        idEstado: element.idEstado,
        idEnvio: element.idEnvio,
        fechaProgramacion: element.fechaProgramar
      };
      this.programarArray.push(objProgramar);
    });

    this.sigaServices.post("enviosMasivos_programar", this.programarArray).subscribe(
      data => {
        this.showSuccess('Se ha programado el envío correctamente');
      },
      err => {
        this.showFail('Error al programar el envío');
        console.log(err);
      },
    );
  }
  onAddEnvio() {
    this.router.navigate(['/fichaRegistroEnvioMasivo']);
    sessionStorage.removeItem("enviosMasivosSearch")
    sessionStorage.setItem("crearNuevoEnvio", JSON.stringify("true"));
  }


}