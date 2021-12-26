import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { CertificacionesItem } from '../../../../../../models/sjcs/CertificacionesItem';
import { FacturacionItem } from '../../../../../../models/sjcs/FacturacionItem';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../../_services/commons.service';
// import { CertificacionFacItem } from '../../../../../../models/sjcs/CertificacionesItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-facturacion',
  templateUrl: './tarjeta-facturacion.component.html',
  styleUrls: ['./tarjeta-facturacion.component.scss']
})
export class TarjetaFacturacionComponent implements OnInit {
  progressSpinner: boolean = false;
  // datosTablaFact:CertificacionFacItem[];
  selectedDatos = [];
  selectedItem: number = 10;
  rowsPerPage: any = [];
  cols = [];
  msgs;
  selectionMode: String = "multiple";
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  selectAll: boolean = false;
  first: any = 0;
  buscadores = [];
  isNuevo: boolean = false;
  tienePartida: boolean = false;
  partidaPresupuestaria;
  idFacturacion;
  idCertificacion;


  @Input() certificacion;
  @Input() modoEdicion;
  @Output() changeModoEdicion = new EventEmitter<boolean>();
  @ViewChild("tabla") tabla;
  permisos
  datos;
  comboFactByPartida: any;
  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService) { }

  ngOnInit() {
    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaCerTarjetaFacturaciones).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.getCols();
      if (this.modoEdicion && this.certificacion && this.certificacion != null) {
        this.idCertificacion = this.certificacion.idCertificacion
        this.getFactCertificaciones(this.idCertificacion);
      }

    }).catch(error => console.error(error));


  }

  getCols() {

    this.cols = [
      { field: "fechaDesde", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaDesde", width: "10%" },
      { field: "fechaHasta", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaHasta", width: "10%" },
      { field: "nombre", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre", width: "20%" },
      { field: "idGrupo", header: "justiciaGratuita.oficio.turnos.grupofacturacion", width: "10%" },
      { field: "importeOficio", header: "facturacionSJCS.baremosDeGuardia.turno", width: "5%" },
      { field: "importeGuardia", header: "facturacionSJCS.baremosDeGuardia.guardia", width: "5%" },
      { field: "importeEjg", header: "justiciaGratuita.ejg.datosGenerales.EJG", width: "5%" },
      { field: "importeSoj", header: "justiciaGratuita.ejg.busquedaAsuntos.SOJ", width: "5%" },
      { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.total", width: "5%" },
      { field: "importePendiente", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente", width: "5%" },
      { field: "importePagado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.pagado", width: "5%" },
      { field: "regularizacion", header: "facturacionSJCS.fichaCertificacion.regul", width: "5%" },
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

  reabrir() {
    let reabrir: CertificacionesItem[] = []

    for (let fact of this.selectedDatos) {
      let estadoFact = fact.idEstado
      if (this.certificacion.estado == "CERRADA" && estadoFact == "20") {
        let obj: CertificacionesItem = new CertificacionesItem();
        obj.idFacturacion = fact.idFacturacion
        obj.nombre = fact.nombre
        reabrir.push(obj);
      }
    }
    if (reabrir.length != 0) {
      this.sigaServices.post("certificaciones_reabrirfacturacion", reabrir).subscribe(
        data => {
          let error = JSON.parse(data.body).error;
          if (error != undefined && error != null && error.description != null) {
            if (error.code == '200') {
              this.showMessage("success", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            }
          }
          this.restablecer();
          this.progressSpinner = false;
        },
        err => {

          if (err != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
          this.restablecer()
          this.progressSpinner = false;
        }
      )
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
    }

  }

  nuevo() {
    this.isNuevo = true;
    this.progressSpinner = true
    if (this.datos.length == 0) {
      this.getComboFact(false);
    } else {

      this.getComboFact(true)
    }

    this.progressSpinner = false;
    let dummy = {
      fechaDesde: "",
      fechaHasta: "",
      nombre: "",
      idGrupo: "",
      importeOficio: "",
      importeGuardia: "",
      importeEjg: "",
      importeSoj: "",
      importeTotal: "",
      importePendiente: "",
      importePagado: "",
      regularizacion: "",
      nuevoRegistro: true
    };

    this.datos = [dummy, ...this.datos];
  }

  restablecer() {
    this.isNuevo = false;
    this.selectedDatos = []
    this.getFactCertificaciones(this.idCertificacion)
  }

  save() {
    this.isNuevo = false;
    this.progressSpinner = true;

    let factCert: CertificacionesItem = new CertificacionesItem();
    factCert.idCertificacion = this.idCertificacion;
    factCert.idFacturacion = this.idFacturacion;

    this.sigaServices.post("certificaciones_saveFactCertificacion", factCert).subscribe(
      data => {
        let error = JSON.parse(data.body).error;
        if (error != undefined && error != null && error.description != null) {
          if (error.code == '200') {
            this.showMessage("success", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }
        this.restablecer();
        this.progressSpinner = false;
      },
      err => {

        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.restablecer()
        this.progressSpinner = false;
      }
    )
  }

  confirmDelete() {
    let mess = this.translateService.instant(
      "messages.deleteConfirmation"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.deleteFacturacion();
      },
      reject: () => {
        this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }
  deleteFacturacion() {
    if (this.certificacion.idEstadoCertificacion != '5') {
      this.progressSpinner = true;
      let factCert: CertificacionesItem[] = [];
      for (let cert of this.selectedDatos) {
        let certf: CertificacionesItem = new CertificacionesItem();
        certf.idCertificacion = this.idCertificacion;
        certf.idFacturacion = cert.idFacturacion;
        factCert.push(certf)
      }

      this.sigaServices.post("certificaciones_delFactCertificacion", factCert).subscribe(
        data => {
          this.progressSpinner = false;

          const res = JSON.parse(data.body);
          this.restablecer()

          if (res && res.error && res.error != null && res.error.description != null && res.error.code != null && res.error.code.toString() == "500") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description));
          } else {
            if (res.error != null && res.error.description != null && res.error.code != null && res.error.code.toString() == "200") {
              this.showMessage("success", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description));
            }
          }
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.getFactCertificaciones(this.idCertificacion);
        }
      );
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("fichaCertificacionSJCS.tarjetaFacturacion.errEstadoEnviado"));
    }

  }
  selectDesSelectFila() {
    this.numSelected = this.selectedDatos.length;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      // this.selectedDatos = this.datosTablaFact;
      // this.numSelected = this.datosTablaFact.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
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

  getFactCertificaciones(idCertificacion: String) {
    this.progressSpinner = true
    this.sigaServices.post("certificaciones_getFactCertificaciones", idCertificacion).subscribe(
      data => {
        this.datos = JSON.parse(data.body).facturacionItem;
        //this.buscar = true;
        this.progressSpinner = false;
        if (this.datos.length != 0) {
          this.partidaPresupuestaria = this.datos[0].idPartidaPresupuestaria
        }
        let error = JSON.parse(data.body).error;

        if (error != undefined && error != null && error.description != null) {
          if (error.code == '200') {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }

        //this.resetSelect();

      },
      err => {
        if (err.status == '403' || err.status == 403) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        } else {
          if (err != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }
        this.progressSpinner = false;
      }
    );
  }

  getComboFact(tienePartida) {
    let partidaPresupuestaria

    if (tienePartida) {
      partidaPresupuestaria = this.partidaPresupuestaria
      if (partidaPresupuestaria != null) {
        //llama a servicio para cuando la partida presupuestaria NO sea NULL
        this.progressSpinner = true;

        this.sigaServices.getParam("combo_factByPartidaPresu", "?idPartidaPresupuestaria=" + this.partidaPresupuestaria).subscribe(
          data => {
            this.comboFactByPartida = data.combooItems;
            this.commonsService.arregloTildesCombo(this.comboFactByPartida);
            this.progressSpinner = false;
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          }
        );
      } else {
        //llama a servicio para cuando la partida presupuestaria sea NULL
        this.progressSpinner = true;

        this.sigaServices.get("combo_factNull").subscribe(
          data => {
            this.comboFactByPartida = data.combooItems;
            this.commonsService.arregloTildesCombo(this.comboFactByPartida);
            this.progressSpinner = false;
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          }
        );
      }
    } else if (!tienePartida) {
      //llama al servicio para cuando no tenga partida presupuestaria, manda "sinPartida" al back
      //y este realiza el control para que haga la busqueda sin la partida presupuestaria
      partidaPresupuestaria = "sinPartida"
      this.progressSpinner = true;

      this.sigaServices.getParam("combo_factByPartidaPresu", "?idPartidaPresupuestaria=" + partidaPresupuestaria).subscribe(
        data => {
          this.comboFactByPartida = data.combooItems;
          this.commonsService.arregloTildesCombo(this.comboFactByPartida);
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
    }


  }

  onChangePartida(event) {
    this.idFacturacion = event.value
  }


}
