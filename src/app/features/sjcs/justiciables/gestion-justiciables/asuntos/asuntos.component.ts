import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_justiciables } from '../../../../../permisos/procesos_justiciables';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { DatePipe } from '@angular/common'
import { Session } from 'protractor';

@Component({
  selector: 'app-asuntos',
  templateUrl: './asuntos.component.html',
  styleUrls: ['./asuntos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsuntosComponent implements OnInit, OnChanges {

  rowsPerPage: any = [];
  cols = [];
  msgs;
  progressSpinner: boolean = false;
  bodyInicial;
  justiciableItem: JusticiableItem;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;

  permisoEscritura: boolean = true;
  datos = [];
  datosInicio: boolean = false;

  idPersona;

  @Input() body: JusticiableItem;
  @Input() showTarjeta;
  @Input() modoEdicion;
  @Input() fromJusticiable;
  @Input() tarjetaDatosAsuntos;

  @ViewChild("table") table: DataTable;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<String>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateServices: TranslateService,
    private sigaStorageService: SigaStorageService,
    private persistenceService: PersistenceService,
    private router: Router,
    private datepipe: DatePipe) { }

  ngOnInit() {
    this.getCols();

  }

  // Comprobar Permisos De Designación
  checkPermisosCrearDesignacion() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.crearDesignacion();
    }
  }

  // Crear una nueva designación.
  crearDesignacion() {
    this.progressSpinner = true;
    //Recogemos los datos de nuevo de la capa de persistencia para captar posibles cambios realizados en el resto de tarjetas
    this.body = this.persistenceService.getDatos();
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    //Utilizamos el bodyInicial para no tener en cuenta cambios que no se hayan guardado.
    sessionStorage.setItem("justiciable", JSON.stringify(this.bodyInicial));
    sessionStorage.setItem("nuevaDesigna", "true");
    this.progressSpinner = false;
    this.router.navigate(["/fichaDesignaciones"]);
  }

  // Comprobar Asociar Designación
  checkPermisosAsociarDesignacion() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarDesignacion();
    }
  }

  // Asociar Designacion
  asociarDesignacion() {
    //Utilizamos el bodyInicial para no tener en cuenta cambios que no se hayan guardado.
    sessionStorage.setItem("radioTajertaValue", 'des');
    let justiciableDes = JSON.stringify(this.body);
    sessionStorage.setItem("justiciable", justiciableDes);
    this.router.navigate(["/busquedaAsuntos"]);

  }

  // Permisos para crear EJG
  checkPermisosCrearEJG() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.crearEJG();
    }
  }

  // Crear EJG
  crearEJG() {
    if (sessionStorage.getItem("EJGItem")) {
      sessionStorage.removeItem("EJGItem");
    }
    sessionStorage.setItem("justiciable", JSON.stringify(this.body));
    this.persistenceService.clearDatos();
    sessionStorage.setItem("Nuevo", "true");
    this.router.navigate(["/gestionEjg"]);
  }

  // Permisos para Asociar EJG
  checkPermisosAsociarEJG() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarEJG();
    }
  }

  // Asociar EJG
  asociarEJG() {
    sessionStorage.setItem("justiciable", JSON.stringify(this.body));
    sessionStorage.setItem("radioTajertaValue", 'ejg');
    this.router.navigate(["/busquedaAsuntos"]);

  }



  // Permiso para crear Asistencia
  checkPermisosCrearAsistencia() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.crearAsistencia();
    }
  }

  // Crear Asistencia
  crearAsistencia() {
    sessionStorage.setItem("justiciable", JSON.stringify(this.body));
    sessionStorage.setItem("nuevaAsistencia", "true");
    this.router.navigate(["/fichaAsistencia"]);
  }

  // Permiso Asociar Asistencia
  checkPermisosAsociarAsistencia() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarAsistencia();
    }

  }

  // Asociar Asistencia
  asociarAsistencia() {
    sessionStorage.setItem("radioTajertaValue", 'asi');
    sessionStorage.setItem("justiciable", JSON.stringify(this.body));
    this.router.navigate(["/busquedaAsuntos"]);
  }

  // Permisos para asociar SOJ
  checkPermisosAsociarSOJ() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarSOJ();
    }
  }

  // Asociar SOJ
  asociarSOJ() {
    sessionStorage.setItem("radioTajertaValue", 'soj');
    let justiciable = JSON.stringify(this.body);
    sessionStorage.setItem("justiciable", justiciable);
    this.router.navigate(["/busquedaAsuntos"]);
  }

  // Permisos para asociar SOJ
  checkPermisosCrearSOJ() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.crearSOJ();
    }
  }

  // Crear SOJ
  crearSOJ() {
    let justiciable = JSON.stringify(this.body);
    sessionStorage.setItem("justiciable", justiciable);
    this.router.navigate(["/soj"]);
  }

  ngOnChanges(changes: SimpleChanges) {

    //Se comprueba si es el justiciable que cargado al principio, si no es la misma se vuelve a restablecer los valores 
    if (this.idPersona != undefined && this.idPersona != null &&
      this.idPersona != this.body.idpersona) {
      this.showTarjeta = false;
      this.datos = undefined;
      this.datosInicio = undefined;
    }

    //Se almacena el idpersona del justiciable cargado en la ficha de justiciable
    if (this.body != undefined && this.body.idpersona == undefined) {
      this.showTarjeta = false;
    } else if (this.body == undefined) {
      this.showTarjeta = false;
      this.body = new JusticiableItem();
    } else {
      this.idPersona = this.body.idpersona;
    }

    if (this.tarjetaDatosAsuntos == true) this.showTarjeta = this.tarjetaDatosAsuntos;

    if (this.body.idpersona != null || this.body.idpersona != undefined) {
      this.ngOnInit();
    }
    

  }

  onHideTarjeta() {
    if (this.modoEdicion) {
      this.showTarjeta = !this.showTarjeta;

      if (!this.datosInicio) {
        this.datosInicio = true;
      }
    }
    this.opened.emit(this.showTarjeta);   // Emit donde pasamos el valor de la Tarjeta Asuntos.
    this.idOpened.emit('Asuntos'); // Constante para abrir la Tarjeta de Asuntos.
  }

  getCols() {

    let headerRol = "";
    let fieldRol = "";
    let widthRol = "";

    if (this.fromJusticiable) {
      fieldRol = "rol";
      headerRol = "administracion.usuarios.literal.rol";
      widthRol = "5%";
    } else {
      fieldRol = "interesado";
      headerRol = "justiciaGratuita.justiciables.literal.interesados";
      widthRol = "20%";

    }

    this.cols = [
      { field: "asunto", header: "justiciaGratuita.justiciables.literal.asuntos", width: "7%" },
      { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "7%" },
      { field: "turnoGuardia", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "10%" },
      { field: "letrado", header: "justiciaGratuita.justiciables.literal.colegiado", width: "15%" },
      { field: fieldRol, header: headerRol, width: widthRol },
      { field: "datosInteres", header: "justiciaGratuita.justiciables.literal.datosInteres", width: "20%" }

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

    // Recoger los valores del Justiciable
    if (this.body.idpersona == null || this.body.idpersona == undefined) {
      if (JSON.parse(sessionStorage.getItem("Familiar"))) {
        let justiciableUF = JSON.parse(sessionStorage.getItem("Familiar"));
        this.body.idpersona = justiciableUF.uf_idPersona;
        //sessionStorage.removeItem("Familiar");
      }
    }
    this.search();

  }

  search() {
    this.progressSpinner = true;

    this.sigaServices.post("gestionJusticiables_searchAsuntosJusticiable", this.body.idpersona).subscribe(
      n => {

        this.datos = JSON.parse(n.body).asuntosJusticiableItems;
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      });
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

  clear() {
    this.msgs = [];
  }

  openTab(dato) {
    let identificador = dato.tipo;
    switch (identificador) {
      case 'A':
        sessionStorage.setItem("idAsistencia", dato.anio + "/" + dato.numero);
        sessionStorage.setItem("vieneDeFichaJusticiable", "true");
        this.router.navigate(["/fichaAsistencia"]);

        break;

      case 'D':
        let desItem: any = new DesignaItem();

        desItem.ano = dato.anio;
        desItem.numero = dato.numero;
        desItem.codigo = dato.codigo;
        desItem.idTurno = dato.clave;
        /*desItem.idInstitucion = dato.idinstitucion;
        desItem.codigo = dato.codigo;
        desItem.descripcionTipoDesigna = dato.destipo
        desItem.fechaEntradaInicio = dato.fechaasunto;
        desItem.nombreTurno = dato.descturno;
        desItem.nombreProcedimiento = dato.dilnigproc.split('-')[2];
        desItem.nombreColegiado = dato.letrado;*/
        desItem.ano = 'D' + desItem.ano + '/' + desItem.codigo;
        let request = [desItem.ano, desItem.idTurno, desItem.numero];
        this.sigaServices.post("designaciones_busquedaDesignacionActual", request).subscribe(
          data => {
            let datos = JSON.parse(data.body);
            //Se cambia el valor del campo ano para que se procese de forma adecuada 
            //En la ficha en las distintas tarjetas para obtener sus valores
            //
            /*datos.descripcionTipoDesigna = desItem.descripcionTipoDesigna;
            datos.fechaEntradaInicio = desItem.fechaEntradaInicio;
            datos.nombreColegiado = desItem.nombreColegiado;
            datos.nombreProcedimiento = desItem.nombreProcedimiento;
            datos.nombreTurno = desItem.nombreTurno;
            datos.idInstitucion = desItem.idInstitucion;
            datos.idTurno = desItem.idTurno;*/

            desItem = datos;
            desItem.anio = desItem.ano;
            desItem.fechaEntradaInicio = this.datepipe.transform(new Date(datos.fechaEntradaInicio), 'dd/MM/yyyy');
            desItem.ano = 'D' + desItem.anio + '/' + desItem.codigo;

            sessionStorage.setItem("vieneDeFichaJusticiable", "true");
            sessionStorage.setItem('designaItemLink', JSON.stringify(desItem));
            sessionStorage.setItem("nuevaDesigna", "false");
            this.router.navigate(['/fichaDesignaciones']);
          });
        break;
      case 'E':
        this.progressSpinner = true;
        let ejgItem = new EJGItem();
        ejgItem.annio = dato.anio;
        // ejgItem.numero = dato.numero;
        ejgItem.numero = dato.numero;
        ejgItem.idInstitucion = dato.idinstitucion;
        ejgItem.tipoEJG = dato.clave;

        let result;
        // al no poder obtener todos los datos del EJG necesarios para obtener su informacion
        //se hace una llamada a al base de datos pasando las claves primarias y obteniendo los datos necesarios
        this.sigaServices.post("filtrosejg_busquedaEJG", ejgItem).subscribe(
          n => {
            result = JSON.parse(n.body).ejgItems;
            sessionStorage.setItem("EJGItemDesigna", JSON.stringify(result[0]));
            let error = JSON.parse(n.body).error;

            this.progressSpinner = false;
            if (error != null && error.description != null) {
              this.showMessage("info", this.translateServices.instant("general.message.informacion"), error.description);
            }
          },
          err => {
            this.progressSpinner = false;
            //console.log(err);
          },
          () => {
            this.router.navigate(["/gestionEjg"]);
          }
        );
        break;

      default:
        //Introducir en la BBDD
        this.showMessage("error", this.translateServices.instant("general.message.incorrect"), "No se puede abrir el Tipo de Asunto, es incorrecto.");
        break;
    }

  }
}
