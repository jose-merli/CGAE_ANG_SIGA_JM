import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../../_services/commons.service';
import { GuardiaItem } from '../../../../../../../models/guardia/GuardiaItem';
import { datos_combos } from '../../../../../../../utils/datos_combos';
import { endpoints_guardia } from '../../../../../../../utils/endpoints_guardia';
import { TranslateService } from '../../../../../../../commons/translate';

const asc = "ascendente"
const desc = "descendente"

const ordManual = "Ordenación Manual"


@Component({
  selector: 'app-datos-conf-cola',
  templateUrl: './datos-conf-cola.component.html',
  styleUrls: ['./datos-conf-cola.component.scss']
})
export class DatosConfColaComponent implements OnInit {

  @Input() datos = [];
  @Input() modoEdicion: boolean = false;
  @Input() permisoEscritura: boolean;
  @Output() modoEdicionSend = new EventEmitter<any>();

  body: GuardiaItem = new GuardiaItem();
  bodyInicial;
  pesosExistentes: any[];
  pesosExistentesInicial: any[];
  pesosSeleccionados: any[];
  pesosSeleccionadosInicial: any[];
  idGuardia;
  idTurno;
  openFicha: boolean = false;
  historico: boolean = false;
  ordenacion = "";
  numeroletradosguardia = "";
  msgs = [];
  progressSpinner: boolean = false;

  isDisabledGuardia: boolean = true;
  constructor(private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
    this.historico = this.persistenceService.getHistorico();
    if (this.persistenceService.getDatos()) {
      this.idGuardia = this.persistenceService.getDatos().idGuardia;
      this.idTurno = this.persistenceService.getDatos().idTurno;
    }
    if (this.modoEdicion) this.getResumen();

    this.sigaServices.datosRedy$.subscribe(
      data => {
        if (data.body)
          data = JSON.parse(data.body)

        this.body.letradosGuardia = data.letradosGuardia;
        this.body.idOrdenacionColas = data.idOrdenacionColas;
        this.body.porGrupos = data.porGrupos == "1" ? true : false;
        this.body.rotarComponentes = data.rotarComponentes;
        this.body.idGuardia = this.idGuardia;
        this.body.idTurno = this.idTurno;
        this.getPerfilesSeleccionados();
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));

      })
  }

  abreCierraFicha() {
    if (this.modoEdicion)
      this.openFicha = !this.openFicha;
  }

  disabledSave() {
    if (!this.historico && this.body.letradosGuardia
      && ((JSON.stringify(this.body) != JSON.stringify(this.bodyInicial))
        || (JSON.stringify(this.pesosSeleccionados) != JSON.stringify(this.pesosSeleccionadosInicial)))) {
      return false;
    } else return true;

  }


  getResumen() {
    this.body = JSON.parse(JSON.stringify(this.persistenceService.getDatos()));
    this.sigaServices.post("busquedaGuardias_resumenConfCola", this.body)
      .subscribe(data => {
        if (data.body)
          data = JSON.parse(data.body);
        this.numeroletradosguardia = data.letradosIns;
        this.ordenacion = data.idOrdenacionColas;
      },
        err => {
          console.log(err);
        })
  }

  rest() {
    this.pesosExistentes = JSON.parse(JSON.stringify(this.pesosExistentesInicial));
    this.pesosSeleccionados = JSON.parse(JSON.stringify(this.pesosSeleccionadosInicial));
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  cambioExistentes(event) {
    let noexiste = this.pesosExistentes.find(item => item === event.items)
    if (noexiste == undefined) {
      event.items.forEach(element => {
        let e = { numero: element.numero, por_filas: element.por_filas, orden: element.orden };
        if (element.por_filas == ordManual && this.body.porGrupos) {
          let find = this.pesosExistentes.findIndex(x => x.por_filas == element.por_filas);
          if (find != undefined) {
            this.pesosExistentes.splice(find, 1);
            this.pesosSeleccionados = [element, ...this.pesosSeleccionados];
          }
        }
        else if (element.por_filas == ordManual) {

        }
        else if (e.orden == asc) {
          e.orden = desc;
          e.numero = "0";
          this.pesosExistentes.push(e);
        }
        else {
          e.orden = asc
          e.numero = "0";
          this.pesosExistentes.push(e);
        }
      });
    }
  }


  cambioSeleccionados(event) {
    event.items.forEach(element => {
      let find = this.pesosExistentes.findIndex(x => x.por_filas == event.items[0].por_filas);
      if (find != -1) {
        this.pesosExistentes.splice(find, 1);
      }
    });
    if (this.pesosSeleccionados) {
      if (this.pesosSeleccionados[0]) {
        this.pesosSeleccionados[0].numero = "5";
      }
      if (this.pesosSeleccionados[1]) {
        this.pesosSeleccionados[1].numero = "4";
      }
      if (this.pesosSeleccionados[2]) {
        this.pesosSeleccionados[2].numero = "3";
      }
      if (this.pesosSeleccionados[3]) {
        this.pesosSeleccionados[3].numero = "2";
      }
      if (this.pesosSeleccionados[4]) {
        this.pesosSeleccionados[4].numero = "1";
      }
    }
  }

  getPerfilesSeleccionados() {
    if (!this.modoEdicion) {
      this.pesosExistentes = [];

      this.pesosExistentes = datos_combos.pesos_existentes;
      this.getPerfilesExistentes();

    } else {
      this.sigaServices
        .getParam("combossjcs_ordenCola", "?idordenacioncolas=" + this.body.idOrdenacionColas)
        .subscribe(
          n => {
            // coger etiquetas de una persona juridica
            this.pesosExistentes = n.colaOrden;
            this.pesosExistentes.forEach(element => {
              if (element.por_filas == "ALFABETICOAPELLIDOS") {
                element.por_filas = "Apellidos y nombre";
              }
              else if (element.por_filas == "ANTIGUEDADCOLA") {
                element.por_filas = "Antigüedad en la cola";
              }
              else if (element.por_filas == "NUMEROCOLEGIADO") {
                element.por_filas = "Nº Colegiado";
              }
              else if (element.por_filas == "FECHANACIMIENTO") {
                element.por_filas = "Edad Colegiado";
              }

              if (element.orden == "asc") {
                element.orden = asc;
              }
              else if (element.orden == "desc") {
                element.orden = desc;
              }
            });

          },
          err => {
            console.log(err);
          }, () => {
            this.getPerfilesExistentes();

          }
        );
    }
  }
  getPerfilesExistentes() {

    let pesosFiltrados = Object.assign([], this.pesosExistentes);
    this.pesosSeleccionados = [];

    if (this.body.porGrupos) {
      let existe = this.pesosSeleccionados.findIndex(it => it.por_filas == ordManual);
      if (existe)
        this.pesosSeleccionados.push({
          numero: "5",
          por_filas: ordManual,
          orden: ""
        });
    }
    else {
      let existe = this.pesosExistentes.findIndex(it => it.por_filas == ordManual);
      if (existe)
        this.pesosExistentes.push({
          numero: "0",
          por_filas: ordManual,
          orden: ""
        });
    }

    pesosFiltrados.forEach(element => {
      if (element.numero > 0) {
        this.pesosSeleccionados.push(element);
        this.pesosExistentes.splice(this.pesosExistentes.indexOf(element), 1);
      }
    });
    this.pesosExistentes.forEach(element => {
      let e = { numero: element.numero, por_filas: element.por_filas, orden: element.orden };
      if (!e.orden) {
        element.orden = asc;
      }
      if (e.orden != "desc") {
        e.orden = desc;
        this.pesosExistentes.push(e)
      }
    });



    this.pesosExistentesInicial = JSON.parse(JSON.stringify(this.pesosExistentes));
    this.pesosSeleccionadosInicial = JSON.parse(JSON.stringify(this.pesosSeleccionados));

  }
  moverSeleccionados(event) {
    if (this.pesosSeleccionados != undefined) {
      if (this.body.porGrupos && this.pesosSeleccionados[0].por_filas != ordManual) {
        [this.pesosSeleccionados[0], this.pesosSeleccionados[1]] = [this.pesosSeleccionados[1], this.pesosSeleccionados[0]]
      }
      if (this.pesosSeleccionados[0] != undefined) {
        this.pesosSeleccionados[0].numero = "5";
      }
      if (this.pesosSeleccionados[1] != undefined) {
        this.pesosSeleccionados[1].numero = "4";
      }
      if (this.pesosSeleccionados[2] != undefined) {
        this.pesosSeleccionados[2].numero = "3";
      }
      if (this.pesosSeleccionados[3] != undefined) {
        this.pesosSeleccionados[3].numero = "2";
      }
      if (this.pesosSeleccionados[4] != undefined) {
        this.pesosSeleccionados[4].numero = "1";
      }
    }
  }
  cambiaGrupo() {
    if (this.body.porGrupos) {
      this.pesosSeleccionados = this.pesosSeleccionados.filter(it => {
        return it.por_filas != ordManual;
      });
      this.pesosExistentes = this.pesosExistentes.filter(it => {
        return it.por_filas != ordManual;
      });
      this.pesosSeleccionados = [({
        numero: "5",
        por_filas: ordManual,
        orden: ""
      }), ...this.pesosSeleccionados];

    }
    // else {
    //   this.pesosExistentes = this.pesosExistentes.filter(it => {
    //     return it.por_filas != ordManual;
    //   });
    //   this.pesosSeleccionados = this.pesosSeleccionados.filter(it => {
    //     return it.por_filas != ordManual;
    //   });
    //   this.pesosExistentes.push({
    //     numero: "0",
    //     por_filas: ordManual,
    //     orden: ""
    //   });
    // }
  }
  save() {
    let montag = [0, 0, 0, 0, 0];
    this.pesosSeleccionados.forEach(element => {
      if (element.por_filas == "Apellidos y nombre") {
        montag[0] = element.numero;
        if (element.por_filas == desc) montag[0] = -montag[0];
      }
      else if (element.por_filas == "Antigüedad en la cola") {
        montag[1] = element.numero;
        if (element.por_filas == desc) montag[3] = -montag[0];
      }
      else if (element.por_filas == "Nº Colegiado") {
        montag[2] = element.numero;
        if (element.por_filas == desc) montag[2] = -montag[0];
      }
      else if (element.por_filas == "Edad Colegiado") {
        montag[3] = element.numero;
        if (element.por_filas == desc) montag[2] = -montag[0];
      } else {
        montag[4] = element.numero;
      }

    });
    this.body.filtros = montag.toString();
    this.callSaveService();
  }

  callSaveService() {
    this.progressSpinner = true
    this.sigaServices.post("busquedaGuardias_updateGuardia", this.body).subscribe(
      data => {
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.pesosExistentesInicial = this.pesosExistentes;
        this.pesosSeleccionadosInicial = this.pesosSeleccionados;
        this.modoEdicion = true;
        this.progressSpinner = false;
      },
      err => {

        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;

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
  clear() { }
}
