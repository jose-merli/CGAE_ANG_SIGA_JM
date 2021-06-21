import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { DataTable } from 'primeng/datatable';
import { CommonsService } from '../../../../../_services/commons.service';
import { Router } from '@angular/router';
import { RelacionesItem } from '../../../../../models/sjcs/RelacionesItem';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-relaciones',
  templateUrl: './relaciones.component.html',
  styleUrls: ['./relaciones.component.scss']
})
export class RelacionesComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaRelaciones: string;

  openFicha: boolean = false;
  nuevo;
  body: EJGItem;
  bodyInicial;
  rowsPerPage: any = [];
  cols;
  msgs;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  buscadores = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  relaciones: RelacionesItem[] = [];
  nRelaciones: number;
  progressSpinner: boolean;
  historico: boolean;
  resaltadoDatosGenerales: boolean = false;
  datosFamiliares: any;
  tipoRelacion: String;

  @ViewChild("table") table: DataTable;


  valueComboEstado = "";
  fechaEstado = new Date();

  fichaPosible = {
    key: "relaciones",
    activa: false
  }

  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Input() openTarjetaRelaciones;

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateServices: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private commonsServices: CommonsService,
    private datePipe: DatePipe,
    private router: Router) { }

  ngOnInit() {
    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.nuevo = false;
      this.modoEdicion = true;
      this.getRelaciones();
    } else {
      this.nuevo = true;
      this.modoEdicion = true;
    }
    this.getCols();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaRelaciones == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  esFichaActiva(key) {

    return this.fichaPosible.activa;
  }
  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "relaciones" &&
      !this.activacionTarjeta
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  getRelaciones() {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_getRelaciones", this.body).subscribe(
      n => {
        this.relaciones = JSON.parse(n.body).relacionesItem;
        this.nRelaciones = this.relaciones.length;
        //obtiene el tipo en caso de devolver solo 1.
        if (this.relaciones.length == 1) {
          this.tipoRelacion = this.relaciones[0].sjcs;
        }
        // this.nExpedientes = this.expedientesEcon.length;
        // this.persistenceService.setFiltrosAux(this.expedientesEcon);
        // this.router.navigate(['/gestionEjg']);
        let pre = new RelacionesItem();
        pre.sjcs = "PRE-DESIGNACION";
        this.relaciones.push(pre);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
        this.showMessage("error", this.translateServices.instant("general.message.incorrect"), this.translateServices.instant("general.mensaje.error.bbdd"));
      }
    );
  }
  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  checkPre(dato) {
    if (dato.sjcs == "PRE-DESIGNACION") return true;
    else return false;
  }
  openTab(evento) {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    if (!this.selectAll && !this.selectMultiple) {
      // this.progressSpinner = true;
      // this.datosEJG();
      if (evento.sjcs == "PRE-DESIGNACION") {
        this.navigateToFichaPre();
      }

    } else {
      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }
    }
  }
  getCols() {
    this.cols = [
      { field: "sjcs", header: "menu.justiciaGratuita", width: "5%" },
      { field: "anio", header: "justiciaGratuita.maestros.calendarioLaboralAgenda.anio", width: "3%" },
      { field: "numero", header: "justiciaGratuita.sjcs.designas.DatosIden.numero", width: "3%" },
      { field: "descturno", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "10%" },
      { field: "letrado", header: "justiciaGratuita.sjcs.designas.colegiado", width: "10%" },
      { field: "interesado", header: "justiciaGratuita.justiciables.literal.interesados", width: "10%" },
      { field: "datosinteres", header: "justiciaGratuita.justiciables.literal.datosInteres", width: "10%" },
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
  isSelectMultiple() {
    this.selectAll = false;
    if (this.permisoEscritura) {
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
  }

  onChangeSelectAll() {
    if (this.permisoEscritura) {
      if (!this.historico) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares;
          this.numSelected = this.datosFamiliares.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares.filter(
            (dato) => dato.fechaBaja != undefined && dato.fechaBaja != null
          );
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      }
    }
  }
  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
  }

  confirmDelete() {
    let mess = this.translateServices.instant(
      "justiciaGratuita.ejg.message.eliminarRelacion"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.delete()
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancelar",
            detail: this.translateServices.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }
  delete() {
    this.progressSpinner = true;

    //this.relaciones.nuevoEJG=!this.modoEdicion;
    let data = [];
    let ejg: EJGItem;

    for (let i = 0; this.selectedDatos.length > i; i++) {
      ejg = this.selectedDatos[i];
      ejg.fechaEstadoNew = this.fechaEstado;
      ejg.estadoNew = this.valueComboEstado;

      data.push(ejg);
    }
    this.sigaServices.post("gestionejg_borrarRelacion", data).subscribe(
      n => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateServices.instant("general.message.correct"), this.translateServices.instant("general.message.accion.realizada"));
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
        this.showMessage("error", this.translateServices.instant("general.message.incorrect"), this.translateServices.instant("general.mensaje.error.bbdd"));
      }
    );
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

  checkPermisosConsultEditRelacion() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.consultEditRelacion();
    }
  }
  consultEditRelacion() {
    this.progressSpinner = true;

    //this.body.nuevoEJG=!this.modoEdicion;

    this.sigaServices.post("gestionejg_consultEditRelacion", this.body).subscribe(
      n => {
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  checkPermisosDelete() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.confirmDelete();
    }
  }

  checkPermisosCrearDesignacion() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.crearDesignacion();
    }
  }
  crearDesignacion() {
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionEjg"]);
  }

  checkPermisosAsociarDesignacion() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarDesignacion();
    }
  }
  asociarDesignacion() {
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionEjg"]);
  }

  checkPermisosAsociarSOJ() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarSOJ();
    }
  }
  asociarSOJ() {
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionEjg"]);
  }

  checkPermisosAsociarAsistencia() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarAsistencia();
    }
  }

  navigateToFichaPre() {
    let found = false;
    sessionStorage.removeItem("Designa");
    this.progressSpinner = true;
    //Comprobamos si entre la relaciones hay una designacion
    this.relaciones.forEach(element => {
      if (element.sjcs == "DESIGNACIÓN") {
        found = true;
        sessionStorage.setItem("Designa", JSON.stringify(element));
        let designaItem: DesignaItem = new DesignaItem();
        //designaItem.idInstitucion = parseInt(element.idinstitucion.toString());
        //designaItem.idTurno = parseInt(element.idturno.toString());
        designaItem.ano = parseInt(element.anio.toString());
        designaItem.codigo = element.numero.toString();

        if (designaItem.numColegiado == "") {
          designaItem.numColegiado = null;
        }
        this.sigaServices.post("designaciones_busqueda", designaItem).subscribe(
          n => {
            let datos = JSON.parse(n.body);
            let error;

            if (datos[0] != null && datos[0] != undefined) {
              if (datos[0].error != null) {
                error = datos[0].error;
              }
            }

            datos.forEach(designa => {
              designa.factConvenio = designa.ano;
              designa.anio = designa.ano;
              designa.ano = 'D' + designa.ano + '/' + designa.codigo;
              //  element.fechaEstado = new Date(element.fechaEstado);
              designa.fechaEstado = this.formatDate(designa.fechaEstado);
              designa.fechaFin = this.formatDate(designa.fechaFin);
              designa.fechaAlta = this.formatDate(designa.fechaAlta);
              designa.fechaEntradaInicio = this.formatDate(designa.fechaEntradaInicio);
              if (designa.estado == 'V') {
                designa.sufijo = designa.estado;
                designa.estado = 'Activo';
              } else if (designa.estado == 'F') {
                designa.sufijo = designa.estado;
                designa.estado = 'Finalizado';
              } else if (designa.estado == 'A') {
                designa.sufijo = designa.estado;
                designa.estado = 'Anulada';
              }
              designa.nombreColegiado = designa.apellido1Colegiado + " " + designa.apellido2Colegiado + ", " + designa.nombreColegiado;
              if (designa.nombreInteresado != null) {
                designa.nombreInteresado = designa.apellido1Interesado + " " + designa.apellido2Interesado + ", " + designa.nombreInteresado;
              }
              if (designa.art27 == "1") {
                designa.art27 = "Si";
              } else {
                designa.art27 = "No";
              }

              const params = {
                anio: designa.factConvenio,
                idTurno: designa.idTurno,
                numero: designa.numero,
                historico: false
              };

              this.getDatosAdicionales(designa);
            });
          },
          err => {
            this.progressSpinner = false;
          }
        );
      }
    });
    if(found==false)    this.router.navigate(["/ficha-pre-designacion"]);
  }


  getDatosAdicionales(item) {
    this.progressSpinner = true;
    let desginaAdicionales = new DesignaItem();
    let anio = item.ano.split("/");
    desginaAdicionales.ano = Number(anio[0].substring(1, 5));
    desginaAdicionales.numero = item.numero;
    desginaAdicionales.idTurno = item.idTurno;
    this.sigaServices.post("designaciones_getDatosAdicionales", desginaAdicionales).subscribe(
      n => {

        let datosAdicionales = JSON.parse(n.body);
        if (datosAdicionales[0] != null && datosAdicionales[0] != undefined) {
          item.delitos = datosAdicionales[0].delitos;
          item.fechaOficioJuzgado = datosAdicionales[0].fechaOficioJuzgado;
          item.observaciones = datosAdicionales[0].observaciones;
          item.fechaRecepcionColegio = datosAdicionales[0].fechaRecepcionColegio;
          item.defensaJuridica = datosAdicionales[0].defensaJuridica;
          item.fechaJuicio = datosAdicionales[0].fechaJuicio;
        }
        this.getDatosPre(item);

      },
      err => {
        this.progressSpinner = false;
      }, () => {
      }
    );
  }

  getDatosPre(item) {
    /* let designaProcedimiento = new DesignaItem();
    let data = sessionStorage.getItem("designaItem"); */
    /* if (dato.idTipoDesignaColegio != null && dato.idTipoDesignaColegio != undefined && this.comboTipoDesigna != undefined) {
      this.comboTipoDesigna.forEach(element => {
        if (element.value == dato.idTipoDesignaColegio) {
          dato.descripcionTipoDesigna = element.label;
        }
      });
    } */
    let dataProcedimiento: DesignaItem = new DesignaItem();
    dataProcedimiento.ano = item.factConvenio;
    dataProcedimiento.idPretension = item.idPretension;
    dataProcedimiento.idTurno = item.idTurno;
    dataProcedimiento.numero = item.numero;
    this.sigaServices.post("designaciones_busquedaProcedimiento", dataProcedimiento).subscribe(
      n => {
        let datosProcedimiento = JSON.parse(n.body);
        if (datosProcedimiento.length == 0) {
          item.nombreProcedimiento = "";
          item.idProcedimiento = "";
        } else {
          item.nombreProcedimiento = datosProcedimiento[0].nombreProcedimiento;
          item.idProcedimiento = dataProcedimiento.idPretension;
        }

        let designaModulo = new DesignaItem();
        /* let dataModulo = JSON.parse(data); */
        let dataModulo  = new DesignaItem();
        dataModulo.idProcedimiento = item.idProcedimiento;
        dataModulo.idTurno = item.idTurno;
        dataModulo.ano = item.factConvenio;
        dataModulo.numero = item.numero
        this.sigaServices.post("designaciones_busquedaModulo", dataModulo).subscribe(
          n => {
            let datosModulo = JSON.parse(n.body);
            if (datosModulo.length == 0) {
              item.modulo = "";
              item.idModulo = "";
            } else {
              item.modulo = datosModulo[0].modulo;
              item.idModulo = datosModulo[0].idModulo;
            }
            this.sigaServices.post("designaciones_busquedaJuzgado", item.idJuzgado).subscribe(
              n => {
                item.nombreJuzgado = n.body;
                sessionStorage.setItem("Designa", JSON.stringify(item));
                this.router.navigate(["/ficha-pre-designacion"]);

              },
              err => {
                this.progressSpinner = false;
                item.nombreJuzgado = "";
                sessionStorage.setItem("Designa", JSON.stringify(item));
                this.router.navigate(["/ficha-pre-designacion"]);
              }, () => {
                
              });
          },
          err => {
            this.progressSpinner = false;

            console.log(err);
          }, () => {
            this.progressSpinner = false;
          });
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        this.progressSpinner = false;
      });
  }


  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datePipe.transform(date, pattern);
  }

  asociarAsistencia() {
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionEjg"]);
  }
}