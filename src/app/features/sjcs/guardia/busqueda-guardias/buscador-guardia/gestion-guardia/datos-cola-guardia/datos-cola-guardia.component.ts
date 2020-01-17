import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { GuardiaItem } from '../../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { DatePipe } from '../../../../../../../../../node_modules/@angular/common';
import { CommonsService } from '../../../../../../../_services/commons.service';
import { TablaDinamicaColaGuardiaComponent } from '../../../../../../../commons/tabla-dinamica-cola-guardia/tabla-dinamica-cola-guardia.component';
import { TranslateService } from '../../../../../../../commons/translate';

@Component({
  selector: 'app-datos-cola-guardia',
  templateUrl: './datos-cola-guardia.component.html',
  styleUrls: ['./datos-cola-guardia.component.scss']
})
export class DatosColaGuardiaComponent implements OnInit {

  msgs = [];
  openFicha: boolean = false;
  permitirGuardar: boolean = false;
  rowsPerPage;
  cols = [];
  fecha;
  datosInicial;
  body = new GuardiaItem();
  datos;
  nuevo;
  historico: boolean = false;
  progressSpinner: boolean = false;
  updateInscripciones = [];
  selectionMode = "single";
  resumenColaGuardia = "";
  botActivos: boolean = true;
  editable: boolean = true;


  @Input() permisoEscritura: boolean = false;
  @Input() modoEdicion = false;
  @ViewChild(TablaDinamicaColaGuardiaComponent) tabla;

  constructor(private sigaService: SigaServices,
    private persistenceService: PersistenceService,
    public datepipe: DatePipe,
    public commonsService: CommonsService,
    public translateService: TranslateService) { }

  ngOnInit() {
    this.historico = this.persistenceService.getHistorico();

    this.sigaService.datosRedy$.subscribe(
      data => {
        if (data.body)
          data = JSON.parse(data.body)

        this.body.nombre = data.nombre;

        this.body.porGrupos = data.porGrupos;
        // this.selectionMode = data.porGrupos ? "multiple" : "single"
        this.body.idOrdenacionColas = data.idOrdenacionColas;
        this.body.idGuardia = data.idGuardia;
        this.body.idTurno = data.idTurno;
        this.body.idPersonaUltimo = data.idPersonaUltimo;
        this.body.porGrupos = data.porGrupos == "1" ? true : false;
        if (this.body.porGrupos) {
          this.body.ordenacionManual = true;
          this.editable = true;
          this.botActivos = true;
        }
        else {
          this.body.ordenacionManual = false;
          this.isOrdenacionManual();
        }

        this.body.letradosIns = new Date();
        this.getColaGuardia();
      });

  }

  abreCierraFicha() {
    if (this.modoEdicion)
      this.openFicha = !this.openFicha
  }

  disabledSave() {
    if (!this.permisoEscritura || !this.updateInscripciones || this.updateInscripciones.length == 0) {
      return true;
    } else return false;
  }
  save() {
    this.progressSpinner = true;

    if (!this.body.porGrupos && this.body.ordenacionManual) {
      let repes = []
      this.datos.forEach(it => {
        if (repes.length <= 1)
          repes = this.datos.filter(element => {
            if (element.numeroGrupo.trim() == it.numeroGrupo.trim())
              return true;
            return false;
          });
      });
      if (repes.length > 1)
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.guardia.gestion.errorRepiteGrupo"));
      else {
        this.datos = this.datos.map(it => {
          it.orden = 1;
          return it;
        });
        this.callSaveService();

      }
    } else {
      let repes = [];
      let mismoGrupo = []
      let grupoUltimo = this.datos.filter(it => this.body.idPersonaUltimo == it.idPersona);
      let nuevoUltimo;


      this.datos.forEach(it => {
        if (mismoGrupo.length <= 1 && repes.length <= 1) {
          if (!it.numeroGrupo && it.orden || it.numeroGrupo && !it.orden) {
            mismoGrupo.push("Habia un campo vacio");
            mismoGrupo.push("Habia un campo vacio");
          } else {
            mismoGrupo = this.datos.filter(element => {
              if (element.numeroGrupo.trim() == it.numeroGrupo.trim() && element.idPersona == it.idPersona)
                return true;
              return false;
            });
            repes = this.datos.filter(element => {
              if (element.numeroGrupo.trim() == it.numeroGrupo.trim() && element.orden == it.orden)
                return true;
              return false;
            })
          }
        }
      });
      if (mismoGrupo.length > 1 || repes.length > 1)
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.guardia.gestion.errorRepiteGrupo"));
      else {
        if (grupoUltimo.length > 0) {
          nuevoUltimo = grupoUltimo[0];
          grupoUltimo = this.datos.filter(it => it.numeroGrupo == grupoUltimo[0].numeroGrupo);
          grupoUltimo.forEach(it => {
            if (it.orden > nuevoUltimo.orden)
              nuevoUltimo = it;
          })
          if (this.updateInscripciones.filter(it => nuevoUltimo.idPersona == it.idPersona).length > 0)
            this.ultimo(nuevoUltimo)
        }
        this.callSaveService();

      }
    }

    this.progressSpinner = false;

  }
  callSaveService() {
    this.progressSpinner = true;
    this.sigaService.post(
      "gestionGuardias_guardarCola", this.updateInscripciones).subscribe(
        data => {
          this.getColaGuardia();
          this.updateInscripciones = [];
          this.progressSpinner = false;

        },
        err => {
          console.log(err);
          this.progressSpinner = false;

        }
      );
  }

  changeGrupo(dato) {

    let findDato = this.datosInicial.find(item => item.idPersona === dato.idPersona && item.idGrupoGuardiaColegiado === dato.idGrupoGuardiaColegiado);
    if (dato.descripcion != undefined)
      dato.numeroGrupo = dato.numeroGrupo.trim();
    if (findDato != undefined) {
      if (dato.numeroGrupo != findDato.numeroGrupo) {

        let findUpdate = this.updateInscripciones.find(item => item.idPersona === dato.idPersona && item.idGrupoGuardiaColegiado === dato.idGrupoGuardiaColegiado);

        if (findUpdate == undefined) {
          this.updateInscripciones.push(dato);
        }
      }
    }

  }

  changeOrden(dato) {

    let findDato = this.datosInicial.find(item => item.idPersona === dato.idPersona && item.idGrupoGuardiaColegiado === dato.idGrupoGuardiaColegiado);
    if (dato.orden != undefined)
      dato.orden = dato.orden.trim();
    if (findDato != undefined) {
      if (dato.orden != findDato.orden) {

        let findUpdate = this.updateInscripciones.find(item => item.idPersona === dato.idPersona && item.idGrupoGuardiaColegiado === dato.idGrupoGuardiaColegiado);

        if (findUpdate == undefined) {
          this.updateInscripciones.push(dato);
        }
      }
    }

  }

  transformDate(fecha) {
    if (fecha)
      fecha = new Date(fecha).toLocaleDateString();
    this.body.letradosIns = this.datepipe.transform(fecha, 'dd/MM/yyyy')
  }

  getColaGuardia() {
    if (this.body.letradosIns instanceof Date) // Se comprueba si es una fecha por si es necesario cambiar el formato.
      this.transformDate(this.body.letradosIns); // Si no es una fecha es que ya está formateada porque viene del back.
    this.progressSpinner = true;
    this.sigaService.post(
      "busquedaGuardias_getColaGuardia", this.body).subscribe(
        data => {
          this.datos = JSON.parse(data.body).inscripcionesItem;
          this.datos = this.datos.map(it => {
            it.nombreApe = it.apellido1 + " " + it.apellido2 + " " + it.nombre;
            if (!this.body.porGrupos && !this.body.ordenacionManual) {
              it.numeroGrupo = "";
              it.orden = "";
            }
            return it;
          });
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          if (this.datos && this.datos.length > 0)
            this.resumenColaGuardia = this.datos[0].nColegiado + " " + this.datos[0].nombreApe;
          if (this.datosInicial.length > 0)
            this.resumenColaGuardia = this.resumenColaGuardia.concat(" ... " + this.datos[this.datos.length - 1].nColegiado + " " + this.datos[this.datos.length - 1].nombreApe
              + " ... " + this.datos.length, " inscritos");
          this.rest();
          this.progressSpinner = false;

        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
  }

  fillFecha(event) {
    this.body.letradosIns = event;
    this.getColaGuardia();
  }
  ultimo(selected) {
    if (this.permisoEscritura && !this.historico && selected) {
      this.progressSpinner = true;
      this.body.idPersonaUltimo = selected.idPersona;
      this.sigaService.post(
        "busquedaGuardias_getUltimo", this.body).subscribe(
          data => {
            this.getColaGuardia();
          },
          err => {
            console.log(err);
            this.progressSpinner = false;

          }
        );
    }
  }

  isOrdenacionManual() {
    this.sigaService
      .getParam("combossjcs_ordenCola", "?idordenacioncolas=" + this.body.idOrdenacionColas)
      .subscribe(
        n => {
          n.colaOrden.forEach(it => {
            if (it.por_filas == "ORDENACIONMANUAL" && +it.numero != 0)
              this.body.ordenacionManual = true;
          });

          if (!this.body.ordenacionManual) {
            this.botActivos = false;
            this.editable = false;
          } else {
            this.botActivos = true;
            this.editable = true;
          }
        });
  }

  duplicar() {
    this.datos = [JSON.parse(JSON.stringify(this.tabla.selectedDatos)), ...this.datos];
    this.datos[0].numeroGrupo = "";
    this.datos[0].orden = "";
    let menorOrdenCola = 0;
    this.datos.forEach(element => {
      if (+element.ordenCola <= menorOrdenCola)
        menorOrdenCola = +element.ordenCola - 1;
    });
    this.datos[0].ordenCola = menorOrdenCola;
    this.botActivos = false;
  }

  rest() {
    if (this.datosInicial && this.datos && this.tabla && this.tabla.table) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
      this.tabla.table.reset();
      this.tabla.table.sortOrder = 0;
      this.tabla.table.sortField = '';
      this.tabla.selectedDatos = null;
      this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");

      this.updateInscripciones = [];
      // this.tabla.buscadores = this.tabla.buscadores.map(it => it = ""); NO OLVIDAAAAAAAAR!!!!!
    }
  }
  disabledBotones() {
    if (!this.botActivos || !this.tabla || (!this.tabla.selectedDatos || this.tabla.selectedDatos.length == 0))
      return false;
    return true;
  }
  duplicarDisabled() {
    if (this.tabla && this.tabla.selectedDatos && this.updateInscripciones.length == 0 && this.tabla.selectedDatos.length != 0) return false;
    return true;
  }
  disabledUltimo() {
    if (!this.historico && this.permisoEscritura && this.tabla && this.tabla.selectedDatos && this.tabla.selectedDatos.length != 0 && this.updateInscripciones.length == 0) {
      return false;
    }
    return true;
  }
  clear() { }
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}
