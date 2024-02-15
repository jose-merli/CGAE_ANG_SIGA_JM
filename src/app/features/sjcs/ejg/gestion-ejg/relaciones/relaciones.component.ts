import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { Router } from '@angular/router';
import { RelacionesItem } from '../../../../../models/sjcs/RelacionesItem';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { OldSigaServices } from '../../../../../_services/oldSiga.service';
import { FichaSojItem } from '../../../../../models/sjcs/FichaSojItem';

@Component({
  selector: 'app-relaciones',
  templateUrl: './relaciones.component.html',
  styleUrls: ['./relaciones.component.scss']
})
export class RelacionesComponent implements OnInit {

  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Input() tarjetaRelaciones: string;
  @Input() openTarjetaRelaciones;
  @Input() permisoEscritura: boolean = false;
  @Output() guardadoSend = new EventEmitter<boolean>();
  
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  noAsociaSOJ: boolean = false;
  noAsociaASI: boolean = false;
  progressSpinner: boolean = false;
  art27: boolean = false;

  cols;
  msgs;
  rowsPerPage: any = [];
  selectedItem: number = 10;
  selectAll;
  selectedDatos: any[] = [];
  buscadores = [];
  numSelected = 0;
  relaciones = [];

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private router: Router,
    public oldSigaServices: OldSigaServices) { }

  ngOnInit() {
    this.progressSpinner = true;
    this.getCols();
    this.getRelaciones();
  }

  abreCierraFicha() {
    this.openTarjetaRelaciones = !this.openTarjetaRelaciones;
  }

  onChangeRowsPerPages() {

  }

  clear() {
    this.msgs = [];
  }

  onChangeSelectAll() {
    if (this.permisoEscritura) {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
      if (this.selectAll) {
        this.selectMultiple = true;
        this.selectedDatos = [...this.relaciones];
        this.numSelected = this.selectedDatos.length;
      }
    }
  }
  
  deleteRelacion() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.confirmationService.confirm({
        key: "delRelacion",
        message: this.translateService.instant("justiciaGratuita.ejg.message.eliminarRelacion"),
        icon: "fa fa-edit",
        accept: () => {
          this.delete()
        },
        reject: () => {
          this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
        }
      });
    }
  }

  editRelacion(dato) {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      let identificador = dato.sjcs;
      switch (identificador) {
        case 'ASISTENCIA':
          sessionStorage.setItem("idAsistencia",dato.anio+"/"+dato.numero);
          sessionStorage.setItem("vieneDeFichaDesigna", "true");
          this.router.navigate(["/fichaAsistencia"]);
          break;
        case 'SOJ':
          let us = this.oldSigaServices.getOldSigaUrl('detalleSOJ') + '?idInstitucion=' + dato.idinstitucion + '&anio=' + dato.anio + '&numero=' + dato.numero + '&idTipoSoj=' + dato.idTipoSOJ;
          us = encodeURI(us);
          sessionStorage.setItem("url", JSON.stringify(us));
          sessionStorage.removeItem("reload");
          sessionStorage.setItem("reload", "si");
          let detalleSOJ: any = new FichaSojItem();
          detalleSOJ.numero = dato.numero;
          detalleSOJ.idInstitucion = dato.idinstitucion;
          detalleSOJ.anio = dato.anio;
          detalleSOJ.idTipoSoj = dato.idtipo;
          detalleSOJ.idTurno = dato.idturno;
          detalleSOJ.idPersona = dato.idpersonajg;
          detalleSOJ.idGuardia = dato.idGuardia;
          sessionStorage.setItem("sojItemLink", JSON.stringify(detalleSOJ));
          this.router.navigate(['/detalle-soj']);
          break;
        case 'DESIGNACIÓN':
          let desItem: any = new DesignaItem();
          desItem.ano = dato.anio;
          desItem.numero = dato.numero;
          desItem.idInstitucion = dato.idinstitucion;
          desItem.idTurno = dato.idturno;
          desItem.codigo = dato.codigo;
          desItem.descripcionTipoDesigna = dato.destipo
          desItem.fechaEntradaInicio = dato.fechaasunto;
          desItem.nombreTurno = dato.descturno;
          desItem.nombreProcedimiento = dato.dilnigproc.split('-')[2];
          desItem.nombreColegiado = dato.letrado;
          desItem.ano = 'D' + desItem.ano + '/' + desItem.codigo;
          let request = [desItem.ano, desItem.idTurno, desItem.numero];
          this.sigaServices.post("designaciones_busquedaDesignacionActual", request).subscribe(
            data => {
              let datos = JSON.parse(data.body);
              //Se cambia el valor del campo ano para que se procese de forma adecuada 
              //En la ficha en las distintas tarjetas para obtener sus valores
              datos.descripcionTipoDesigna = desItem.descripcionTipoDesigna;
              datos.fechaEntradaInicio = desItem.fechaEntradaInicio;
              datos.nombreColegiado = desItem.nombreColegiado;
              datos.nombreTurno = desItem.nombreTurno;
              datos.idInstitucion = desItem.idInstitucion;
              datos.idTurno = desItem.idTurno;
              desItem = datos;
              desItem.anio = desItem.ano;
              desItem.idProcedimiento = desItem.idPretension;
              desItem.numProcedimiento = desItem.numProcedimiento;
              desItem.ano = 'D' + desItem.anio + '/' + desItem.codigo;
              if(this.art27) {
                sessionStorage.setItem("Art27", "true");
              } 
              sessionStorage.setItem('designaItemLink', JSON.stringify(desItem));
              sessionStorage.setItem("nuevaDesigna", "false");
              this.router.navigate(['/fichaDesignaciones']);
            });
          break;
        default:
          //Introducir en la BBDD
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No se puede realizar la accion de eliminar. Tipo de Asunto incorrecto.");
          break;
      }
    }
  }

  asociarAsistencia() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.persistenceService.setDatosEJG(this.datos);
      sessionStorage.setItem("EJG", JSON.stringify(this.datos));
      sessionStorage.setItem("radioTajertaValue", 'asi');
      this.router.navigate(["/busquedaAsuntos"]);
    }
  }

  asociarSOJ() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.persistenceService.setDatosEJG(this.datos);
      sessionStorage.setItem("EJG", JSON.stringify(this.datos));
      sessionStorage.setItem("radioTajertaValue", 'soj');
      this.router.navigate(["/busquedaAsuntos"]);
    }
  }

  asociarDesignacion() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.persistenceService.setDatosEJG(this.datos);
      sessionStorage.setItem("radioTajertaValue", 'des');
      sessionStorage.setItem("EJG", JSON.stringify(this.datos));
      this.router.navigate(["/busquedaAsuntos"]);
    }
  }

  crearDesignacion() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {

      this.persistenceService.setDatosEJG(this.datos);
      sessionStorage.setItem("nuevaDesigna", "true");
      sessionStorage.setItem("EJG", JSON.stringify(this.datos));
      sessionStorage.setItem("nombreInteresado", this.datos.nombreApeSolicitante);
      if (this.art27) {
        sessionStorage.setItem("Art27", "true");
      }
      //Comprobamos si tiene una asistencia
      if(this.noAsociaASI){
        let asistencia = this.relaciones.find((relacion) => relacion.sjcs == 'ASISTENCIA');
        let idAsistencia = asistencia.idsjcs.replace('A', '');
        this.progressSpinner = true;
        this.sigaServices.getParam("busquedaGuardias_buscarTarjetaAsistencia", "?anioNumero=" + idAsistencia).subscribe(
          n => {
            this.progressSpinner = false;
            if(n != undefined){
              sessionStorage.setItem('asistenciaUnica', JSON.stringify(n.tarjetaAsistenciaItems[0]));
              this.router.navigate(["/fichaDesignaciones"]);
            }
          }, err => { this.progressSpinner = false; }
        );
      }else{
        this.router.navigate(["/fichaDesignaciones"]);
      }
    }
  }

  private getRelaciones() {
    this.guardadoSend.emit(false);
    this.sigaServices.post("gestionejg_getRelaciones", this.datos).subscribe(
      n => {
        this.relaciones = JSON.parse(n.body).relacionesItem;
        this.noAsociaASI = false;
        this.noAsociaSOJ = false;
        this.relaciones.forEach(relacion => {
          switch (relacion.sjcs) {
            case 'ASISTENCIA':
              this.noAsociaASI = true;
              break;
            case 'SOJ':
              this.noAsociaSOJ = true;
              break;
            case 'DESIGNACIÓN':
              if(relacion.art27){
                this.art27 = true;
              }
              this.guardadoSend.emit(true);
              break;
          }
        });
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  private delete() {
    this.progressSpinner = true;
    for (let dato of this.selectedDatos) {
      let identificador = dato.sjcs;
      switch (identificador) {
        case 'ASISTENCIA':
          let relacion: RelacionesItem = new RelacionesItem();
          relacion.idinstitucion = dato.idinstitucion;
          relacion.numero = dato.numero;
          relacion.anio = dato.anio;
          this.sigaServices.post("gestionejg_borrarRelacionAsistenciaEJG", relacion).subscribe(
            n => {
              this.progressSpinner = false;
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              this.getRelaciones();
            },
            err => {
              this.progressSpinner = false;
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            }
          );
          break;
        case 'SOJ':
          let relacionSOJ: RelacionesItem = new RelacionesItem();
          relacionSOJ.idinstitucion = dato.idinstitucion;
          relacionSOJ.numero = dato.numero;
          relacionSOJ.anio = dato.anio;
          relacionSOJ.idtipo = dato.idtipo;
          this.sigaServices.post("gestionejg_borrarRelacionSojEJG", relacionSOJ).subscribe(
            n => {
              this.progressSpinner = false;
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              this.getRelaciones();
            },
            err => {
              this.progressSpinner = false;
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            }
          );
          break;
        case 'DESIGNACIÓN':
          let request = [dato.idinstitucion, dato.numero, dato.anio, dato.idturno, this.datos.annio, this.datos.numero, this.datos.tipoEJG]
          this.sigaServices.post("gestionejg_borrarRelacion", request).subscribe(
            n => {
              this.progressSpinner = false;
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              this.getRelaciones();
            },
            err => {
              this.progressSpinner = false;
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            }
          );
          break;
        default:
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No se puede realizar la accion de eliminar. Tipo de Asunto incorrecto.");
          this.progressSpinner = false;
          break;
      }
    }
    this.selectedDatos = [];
  }

  private getCols() {
    this.cols = [
      { field: "sjcs", header: "justiciaGratuita.oficio.designas.interesados.identificador", width: '6%' },
      { field: "anio", header: "justiciaGratuita.maestros.calendarioLaboralAgenda.anio", width: "3%" },
      { field: "codigo", header: "justiciaGratuita.sjcs.designas.DatosIden.numero", width: "3%" },
      { field: "fechaasunto", header: "dato.jgr.guardia.saltcomp.fecha", width: '6%' },
      { field: "descturno", header: "dato.jgr.guardia.guardias.turnoguardiatramitacion", width: '6%' },
      { field: "letrado", header: "justiciaGratuita.sjcs.designas.colegiado", width: '6%' },
      { field: "interesado", header: "justiciaGratuita.sjcs.designas.datosInteresados", width: '6%' },
      { field: "resolucion", header: "justiciaGratuita.maestros.fundamentosResolucion.resolucion", width: '6%' },
      { field: "dilnigproc", header: 'justiciaGratuita.ejg.busquedaAsuntos.diliNumProc', width: '6%' },
    ];

    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 }
    ];
  }

  private showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}