import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { SigaServices } from "../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { DestinatariosEnviosMasivosItem } from '../../../../../models/DestinatariosEnviosMasivosItem';
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";

@Component({
  selector: 'app-destinatario-indv-envio-masivo',
  templateUrl: './destinatario-indv-envio-masivo.component.html',
  styleUrls: ['./destinatario-indv-envio-masivo.component.scss']
})
export class DestinatarioIndvEnvioMasivoComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;
  noEditar: boolean = false;
  openFicha: boolean = false;
  openDestinatario: boolean;
  body: DestinatariosEnviosMasivosItem = new DestinatariosEnviosMasivosItem();
  eliminarArray: any[];

  showDirecciones: boolean = false;

  //tabla
  datos: any[];
  datos2: any[];
  datosInit: any[];
  cols: any[];
  cols2: any[];
  first: number = 0;
  first2: number = 0;
  selectedItem: number;
  selectedItem2: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];

  @ViewChild('table') table: DataTable;
  selectedDatos;
  @ViewChild('table2') table2: DataTable;
  selectedDatos2;

  fichasPosibles = [
    {
      key: "configuracion",
      activa: false
    },
    {
      key: "programacion",
      activa: false
    },
    {
      key: "destinatarios",
      activa: false
    },
    {
      key: "destinatariosIndv",
      activa: false
    },
    {
      key: "destinatariosList",
      activa: false
    },
    {
      key: "documentos",
      activa: false
    }
  ];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    private router: Router,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {

    this.selectedItem = 10;
    this.selectedDatos = [];
    this.selectedItem2 = 10;
    this.selectedDatos2 = [];

    this.cols = [
      {
        field: "nombreCompleto",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: 'correoElectronico',
        header: 'censo.datosDireccion.literal.correo'
      },
      {
        field: 'movil',
        header: 'censo.datosDireccion.literal.movil'
      },
      {
        field: 'domicilio',
        header: 'solicitudModificacion.especifica.domicilio.literal'
      }
    ];

    this.cols2 = [
      {
        field: "domicilio",
        header: "solicitudModificacion.especifica.domicilio.literal"
      },
      {
        field: 'movil',
        header: 'censo.datosDireccion.literal.movil'
      },
      {
        field: 'correoElectronico',
        header: 'censo.datosDireccion.literal.correo'
      },
      {
        field: 'cp',
        header: 'censo.ws.literal.codigopostal'
      }
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

    this.getDatos();
    if (sessionStorage.getItem("destinatarioIndv") != null && sessionStorage.getItem("AddDestinatarioIndvBack") != null) {

      let persona = JSON.parse(sessionStorage.getItem("destinatarioIndv"));
      sessionStorage.removeItem("destinatarioIndv");
      sessionStorage.removeItem("AddDestinatarioIndvBack");
      this.obtenerDirecciones(persona);
    }
  }

  obtenerDirecciones(persona) {

    this.sigaServices.post("enviosMasivos_direccionesDestinatarioIndv", persona.nif).subscribe(result => {
      this.showDirecciones = true;
      let busqueda = JSON.parse(result["body"]);
      this.datos2 = busqueda.datosDireccionesItem;

    }, error => {
      this.showDirecciones = false;
      let err = JSON.parse(error.error);
      if (err.error.code == 400) {
        let msg = this.translateService.instant("informesYcomunicaciones.enviosMasivos.destinatarioIndv.mensaje.noDirecciones");
        this.showInfo(msg);
      }
      else
        //console.log(error);
    })
  }

  getDatos() {
    if (sessionStorage.getItem("enviosMasivosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
      this.getResultados();
      if (this.body.idEstado != '1' && this.body.idEstado != '4') {
        this.noEditar = true;
      }
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  actualizaDeSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }
  
  desasociar(dato) {
    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message: this.translateService.instant("informesYcomunicaciones.enviosMasivos.destinatarioIndv.mensaje.desasociar.destinatarios"),
      icon: "fa fa-trash-alt",
      accept: () => {
        this.confirmarDesasociar(dato);
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

  confirmarDesasociar(dato) {
    this.eliminarArray = [];
    dato.forEach(element => {
      let objEliminar = {
        idPersona: element.idPersona,
        idEnvio: this.body.idEnvio
      };
      this.eliminarArray.push(objEliminar);
    });
    this.sigaServices
      .post("enviosMasivos_desAsociarDestinatariosIndv", this.eliminarArray)
      .subscribe(
        data => {
          let msg = this.translateService.instant("informesYcomunicaciones.enviosMasivos.destinatarioIndv.mensaje.borrar.destinatarios.ok");
          this.showSuccess(msg);
          this.selectedDatos = [];
        },
        err => {
          this.showFail(
            this.translateService.instant("informesYcomunicaciones.enviosMasivos.destinatarioIndv.mensaje.error.borrar.destinatarios"));
          //console.log(err);
        },
        () => {
          this.getResultados();
        }
      );
  }

  addDestinatario() {
    this.numSelected = 0;
    sessionStorage.setItem("AddDestinatarioIndv", "true");

    sessionStorage.removeItem("menuProcede");
    sessionStorage.removeItem("migaPan");
    sessionStorage.removeItem("migaPan2");

    let migaPan = this.translateService.instant("menu.informesYcomunicaciones.enviosMasivos");
    let migaPan2 = this.translateService.instant("informesycomunicaciones.enviosMasivos.ficha.fichaEnviosMasivos");
    let menuProcede = this.translateService.instant("menu.informesYcomunicaciones");

    sessionStorage.setItem("migaPan", migaPan);
    sessionStorage.setItem("migaPan2", migaPan2);
    sessionStorage.setItem("menuProcede", menuProcede);

    this.router.navigate(["/busquedaGeneral"]);
  }

  asociarDireccion(direccion) {
    let destinatario = {
      idPersona: direccion[0].idPersona,
      idEnvio: this.body.idEnvio,
      idDireccion: direccion[0].idDireccion
    };
    this.sigaServices.post("enviosMasivos_asociarDestinatariosIndv", destinatario).subscribe(result => {
      this.showSuccess(this.translateService.instant("informesYcomunicaciones.enviosMasivos.destinatarioIndv.mensaje.destinatario.añadido"));
      this.showDirecciones = false;
      this.selectMultiple = false;
      this.getResultados();
    }, error => {
      //console.log(error);
    })
  }

  getResultados() {

    this.sigaServices.post("enviosMasivos_destinatariosIndv", this.body.idEnvio).subscribe(
      data => {
        let busqueda = JSON.parse(data["body"]);
        this.datos = busqueda.destinatarios;
        this.datosInit = JSON.parse(JSON.stringify(this.datos));
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      },
      () => { }
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

  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevoEnvio") == null) {
      this.openFicha = !this.openFicha;
      if (this.openFicha) {
        this.getDatos();
      }
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  onOpenDestinatario(d) {
    d.open = !d.open;
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

}
