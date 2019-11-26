import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../../_services/commons.service';

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

  body;
  pesosExistentes: any[];
  pesosExistentesInicial: any[];
  pesosSeleccionados: any[];
  pesosSeleccionadosInicial: any[];
  checkGrupos: boolean;
  checkComponentes: boolean;
  openFicha: boolean = true;
  historico: boolean = false;
  isDisabledGuardia: boolean = true;
  constructor(private persistenceService: PersistenceService,
    private sigaService: SigaServices,
    private commonServices: CommonsService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
    this.historico = this.persistenceService.getHistorico()
  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

  disabledSave() {
    return false;
  }



  rest() {
    this.pesosExistentes = JSON.parse(JSON.stringify(this.pesosExistentesInicial));
    this.pesosSeleccionados = JSON.parse(JSON.stringify(this.pesosSeleccionadosInicial));
    this.arreglaOrden();
  }
  arreglaOrden() {
    let pesosFiltrados = Object.assign([], this.pesosExistentes);
    this.pesosSeleccionados = [];
    pesosFiltrados.forEach(element => {
      if (element.numero > 0) {
        this.pesosSeleccionados.push(element);
      }
      if (element.numero > 0) {
        this.pesosExistentes.splice(this.pesosExistentes.indexOf(element), 1);
        //this.pesosExistentes.splice(element, 1);
      }
    });
    this.pesosExistentes.forEach(element => {
      let e = { numero: element.numero, por_filas: element.por_filas, orden: element.orden };
      if (e.orden == undefined || e.orden == null) {
        element.orden = "ascendente";
      }
      if (e.orden != "desc") {
        e.orden = "descendente";
        this.pesosExistentes.push(e)
      }
    });
  }

  cambioExistentes(event) {
    let noexiste = this.pesosExistentes.find(item => item === event.items)
    if (noexiste == undefined) {
      event.items.forEach(element => {
        let e = { numero: element.numero, por_filas: element.por_filas, orden: element.orden };
        if (e.orden == "ascendente") {
          e.orden = "descendente";
          e.numero = "0";
          this.pesosExistentes.push(e);
        } else {
          e.orden = "ascendente"
          e.numero = "0";
          this.pesosExistentes.push(e);
        }
      });
    }
  }
  cambioSeleccionados(event) {
    event.items.forEach(element => {
      let find = this.pesosExistentes.findIndex(x => x.por_filas == event.items[0].por_filas);
      if (find != undefined) {
        // element.orden = "desc"
        this.pesosExistentes.splice(find, 1);
      } else {
        // this.pesosSeleccionados.push(perfilesFiltrados);
      }
    });
    if (this.pesosSeleccionados != undefined) {
      if (this.pesosSeleccionados[0] != undefined) {
        this.pesosSeleccionados[0].numero = "4";
      }
      if (this.pesosSeleccionados[1] != undefined) {
        this.pesosSeleccionados[1].numero = "3";
      }
      if (this.pesosSeleccionados[2] != undefined) {
        this.pesosSeleccionados[2].numero = "2";
      }
      if (this.pesosSeleccionados[3] != undefined) {
        this.pesosSeleccionados[3].numero = "1";
      }
    }
  }

  getPerfilesSeleccionados() {
    this.sigaServices
      .post("combossjcs_ordenCola", this.turnosItem)
      .subscribe(
        n => {
          // coger etiquetas de una persona juridica
          this.pesosExistentes = JSON.parse(n["body"]).colaOrden;
          this.pesosExistentes.forEach(element => {
            if (element.por_filas == "ALFABETICOAPELLIDOS") {
              element.por_filas = "Apellidos y nombre"
            }
            if (element.por_filas == "ANTIGUEDADCOLA") {
              element.por_filas = "Antigüedad en la cola"
            }
            if (element.por_filas == "NUMEROCOLEGIADO") {
              element.por_filas = "Nº Colegiado"
            }
            if (element.por_filas == "FECHANACIMIENTO") {
              element.por_filas = "Edad Colegiado"
            }
            if (element.orden == "asc") {
              element.orden = "ascendente"
            }
            if (element.orden == "desc") {
              element.orden = "descendente"
            }
          });

          this.pesosExistentesInicial = JSON.parse(
            JSON.stringify(this.pesosExistentes)
          );

          //por cada perfil seleccionado lo eliminamos de la lista de existentes
          // if (this.perfilesSeleccionados && this.perfilesSeleccionados.length && this.perfilesNoSeleccionadosInicial) {
          //   this.perfilesSeleccionados.forEach(element => {
          //     let x = this.arrayObjectIndexOf(this.perfilesNoSeleccionados, element);
          //     if (x > -1) {
          //       this.perfilesNoSeleccionados.splice(x, 1);
          //     }
          //   });
          //   this.perfilesNoSeleccionados = [...this.perfilesNoSeleccionados]
          // }
        },
        err => {
          console.log(err);
        }, () => {
          this.getPerfilesExtistentes();
        }
      );
  }
  getPerfilesExtistentes() {

    let pesosFiltrados = Object.assign([], this.pesosExistentes);
    this.pesosSeleccionados = [];
    pesosFiltrados.forEach(element => {
      if (element.numero > 0) {
        this.pesosSeleccionados.push(element);
      }
      if (element.numero > 0) {
        this.pesosExistentes.splice(this.pesosExistentes.indexOf(element), 1);
        //this.pesosExistentes.splice(element, 1);
      }
    });
    this.pesosExistentes.forEach(element => {
      let e = { numero: element.numero, por_filas: element.por_filas, orden: element.orden };
      if (e.orden == undefined || e.orden == null) {
        element.orden = "ascendente";
      }
      if (e.orden != "desc") {
        e.orden = "descendente";
        this.pesosExistentes.push(e)
      }
    });
    this.pesosSeleccionadosTarjeta = "";
    this.pesosSeleccionados.forEach(element => {
      this.pesosSeleccionadosTarjeta += element.por_filas + " " + element.orden + ","
    });
    this.pesosSeleccionadosTarjeta = this.pesosSeleccionadosTarjeta.substring(0, this.pesosSeleccionadosTarjeta.length - 1);
    this.pesosSeleccionadosInicial = JSON.parse(
      JSON.stringify(this.pesosSeleccionados));
  }
  moverSeleccionados(event) {
    if (this.pesosSeleccionados != undefined) {
      if (this.pesosSeleccionados[0] != undefined) {
        this.pesosSeleccionados[0].numero = "4";
      }
      if (this.pesosSeleccionados[1] != undefined) {
        this.pesosSeleccionados[1].numero = "3";
      }
      if (this.pesosSeleccionados[2] != undefined) {
        this.pesosSeleccionados[2].numero = "2";
      }
      if (this.pesosSeleccionados[3] != undefined) {
        this.pesosSeleccionados[3].numero = "1";
      }
    }
  }
  save() { }
}
