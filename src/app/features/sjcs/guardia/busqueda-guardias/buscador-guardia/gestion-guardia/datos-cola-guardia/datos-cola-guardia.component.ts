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

  @Input() tarjetaColaGuardia;
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
        this.body.idGrupoUltimo = data.idGrupoUltimo;
        this.body.porGrupos = data.porGrupos == "1" ? true : false;
        this.body.letradosIns = new Date();

        if (this.body.porGrupos) {
          this.body.ordenacionManual = true;
          this.editable = true;
          this.botActivos = true;

          this.getColaGuardia();

        }
        else {
          this.body.ordenacionManual = false;
          this.isOrdenacionManual();
        }

      });

  }

  abreCierraFicha() {
    if (this.modoEdicion)
      this.openFicha = !this.openFicha
  }

  disabledSave() {
    if (!this.permisoEscritura || this.historico || !this.updateInscripciones || this.updateInscripciones.length == 0) {
      return true;
    } else return false;
  }
  save() {
    if (this.permisoEscritura && !this.historico) {
      this.progressSpinner = true;
      this.updateInscripciones = this.updateInscripciones.map(it => {
        it.orden = it.orden + "";
        it.numeroGrupo = it.numeroGrupo + "";
        return it;
      })
      this.updateInscripciones = this.updateInscripciones.filter(it => {
        if (it.ordenCola < 1 && (!it.orden || !it.numeroGrupo))
          return false;
        return true;    //Aqui quitamos todas las inscripciones duplicadas a las que le falten datos.
      });               //Estas inscripciones simplemente no se guardaran.
      this.datos = this.datos.filter(it => {
        if (it.ordenCola < 1 && (!it.orden || !it.numeroGrupo))
          return false;
        return true;
      });
      if (!this.body.porGrupos && this.body.ordenacionManual) {
        let repes = []
        this.datos.forEach(it => {
          if (repes.length <= 1)
            repes = this.datos.filter(element => {
              if (element.numeroGrupo == it.numeroGrupo && it.numeroGrupo)
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
        let mismoGrupo = [];
        let grupoUltimo = this.datos.filter(it => this.datos[this.datos.length - 1].numeroGrupo == it.numeroGrupo);
        let nuevoUltimo;
        let ceros: boolean = false;

        this.datos.forEach(it => {
          if (mismoGrupo.length <= 1 && repes.length < 1 && !ceros) {
            if (!it.numeroGrupo && it.orden || it.numeroGrupo && !it.orden) {
              mismoGrupo.push("Habia un campo vacio");
              mismoGrupo.push("Habia un campo vacio");
            } else {
              mismoGrupo = this.datos.filter(element => {
                if (element.numeroGrupo == it.numeroGrupo && element.idPersona == it.idPersona && it.numeroGrupo)
                  return true;
                return false;
              });
              repes = this.datos.filter(element => {
                if (element.numeroGrupo == it.numeroGrupo && element.orden == it.orden &&
                  element.numeroGrupo && it.numeroGrupo && element.idGrupoGuardiaColegiado != it.idGrupoGuardiaColegiado
                  && it.numeroGrupo)
                  return true;
                return false;
              })
              if (it.numeroGrupo == 0 || it.orden == 0)
                ceros = true;
            }
          }
        });

        if (mismoGrupo.length > 1 || repes.length >= 1 || ceros) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.guardia.gestion.errorRepiteGrupo"));
          this.updateInscripciones = this.updateInscripciones.map(it => {
            it.orden = +it.orden;
            it.numeroGrupo = +it.numeroGrupo;
            return it;
          })
        }
        else {
          if (grupoUltimo.length > 0) {
            nuevoUltimo = grupoUltimo[0]; // Por si uno del mmismo grupo que el ultimo tiene un orden mayor que el ultimo
            grupoUltimo.forEach(it => {
              if (it.orden > nuevoUltimo.orden)
                nuevoUltimo = it;
            })
            if (this.updateInscripciones.filter(it => nuevoUltimo.idGrupoGuardiaColegiado == it.idGrupoGuardiaColegiado).length > 0)
              this.ultimo(nuevoUltimo)
          }
          this.callSaveService();

        }
      }

      this.progressSpinner = false;
    }
  }
  callSaveService() {
    if (this.updateInscripciones && this.updateInscripciones.length > 0) {
      this.progressSpinner = true;

      this.sigaService.post(
        "gestionGuardias_guardarCola", this.updateInscripciones).subscribe(
          data => {
            this.getColaGuardia();
            this.updateInscripciones = [];
            this.progressSpinner = false;
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          },
          err => {
            console.log(err);

            if (err.error != undefined && JSON.parse(err.error).error.description != "") {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            }
            this.progressSpinner = false;

          }
        );
    }
  }

  changeGrupo(dato) {
    let findDato;
    if (dato.ordenCola > 0) {
      findDato = this.datosInicial.find(item => item.idPersona === dato.idPersona &&
        item.idGrupoGuardiaColegiado === dato.idGrupoGuardiaColegiado ||
        dato.ordenCola == item.ordenCola);

      if (findDato != undefined) {
        if (dato.numeroGrupo != findDato.numeroGrupo) {

          let findUpdate = this.updateInscripciones.find(item => item.idPersona === dato.idPersona &&
            item.idGrupoGuardiaColegiado === dato.idGrupoGuardiaColegiado ||
            dato.ordenCola == item.ordenCola);

          if (findUpdate == undefined) {
            this.updateInscripciones.push(dato);
          }
        }
      }
    }

  }

  changeOrden(dato) {
    let findDato;
    if (dato.ordenCola > 0) {
      findDato = this.datosInicial.find(item => item.idPersona === dato.idPersona && item.idGrupoGuardiaColegiado === dato.idGrupoGuardiaColegiado ||
        dato.ordenCola == item.ordenCola);

      if (findDato != undefined) {
        if (dato.orden != findDato.orden) {

          let findUpdate = this.updateInscripciones.find(item => item.idPersona === dato.idPersona && item.idGrupoGuardiaColegiado === dato.idGrupoGuardiaColegiado ||
            dato.ordenCola == item.ordenCola);

          if (findUpdate == undefined) {
            this.updateInscripciones.push(dato);
          }
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
            } else {
              it.numeroGrupo = +it.numeroGrupo
              it.order = +it.order
            }
            return it;
          });
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          if (this.datos && this.datos.length > 0)
            this.resumenColaGuardia = this.datos[0].nColegiado + " " + this.datos[0].nombreApe;
          if (this.datosInicial.length > 0)
            this.resumenColaGuardia = this.resumenColaGuardia.concat(" ... " + this.datos[this.datos.length - 1].nColegiado + " " + this.datos[this.datos.length - 1].nombreApe
              + " ... " + this.datos.length, " inscritos");
          else
            this.resumenColaGuardia = "0 inscritos";
          if (this.body.idPersonaUltimo && this.datos.length > 0)
            this.body.idGrupoUltimo = this.datos[this.datos.length - 1].idGrupoGuardia;
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
    if (this.permisoEscritura && !this.historico && selected.ordenCola > 0) {
      this.progressSpinner = true;
      this.body.idPersonaUltimo = selected.idPersona;
      this.body.idGrupoUltimo = selected.idGrupoUltimo;
      let grupo = this.datos.filter(it => selected.idGrupoGuardia == it.idGrupoGuardia);
      if (grupo.length > 1) {
        this.datos.forEach(it => {
          if (it.orden > selected.orden) {
            selected.orden = it.orden + 1;
            this.updateInscripciones.pop();
            this.updateInscripciones.push(selected)
          }
        });
        if (this.updateInscripciones.length > 0)
          this.save();
      }

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
    this.progressSpinner = true;
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

          this.getColaGuardia();
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        });

  }

  duplicar() {
    this.tabla.tabla.sortOrder = 0;
    this.tabla.tabla.sortField = '';
    this.tabla.tabla.reset();
    // Creamos uno igual menos porque no tendra idGrupoguardiacolegiado. Eso y que el orden sera
    // menor o igual que 0 es como se diferencian los duplicados. Al menos hasta que se guarden.
    this.datos = [JSON.parse(JSON.stringify(this.tabla.selectedDatos)), ...this.datos];
    this.datos[0].numeroGrupo = "";
    this.datos[0].orden = "";
    this.datos[0].idGrupoGuardiaColegiado = "";
    let menorOrdenCola = 0;
    this.datos.forEach(element => {
      if (+element.ordenCola <= menorOrdenCola)
        menorOrdenCola = +element.ordenCola - 1;
    });
    this.datos[0].ordenCola = menorOrdenCola;
    this.updateInscripciones.push(this.datos[0]);
    this.botActivos = false;
  }

  rest() {
    if (this.datosInicial && this.datos && this.tabla && this.tabla.tabla) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
      this.tabla.tabla.reset();
      this.tabla.tabla.sortOrder = 0;
      this.tabla.tabla.sortField = '';
      this.tabla.selectedDatos = null;
      this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");

      this.updateInscripciones = [];
      // this.tabla.buscadores = this.tabla.buscadores.map(it => it = ""); NO OLVIDAAAAAAAAR!!!!!
    }
  }
  disabledBotones() {
    if (!this.botActivos || !this.tabla || (!this.updateInscripciones || this.updateInscripciones.length == 0) || (!this.tabla.selectedDatos || this.tabla.selectedDatos.length == 0))
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

  clear() {
    this.msgs = [];
  }
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}
