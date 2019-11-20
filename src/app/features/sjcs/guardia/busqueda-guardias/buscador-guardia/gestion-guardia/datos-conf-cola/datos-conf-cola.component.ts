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
  pesosExistentes;
  pesosExistentesInicial;
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
    this.getCols();
    this.historico = this.persistenceService.getHistorico()
  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

  disabledSave() {
    return false;
  }

  getCols() {
    // if (!this.modoEdicion)
    //   this.cols = [
    //     { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
    //     { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu" },
    //   ];
    // else
    //   this.cols = [
    //     { field: "vinculacion", header: "justiciaGratuita.guardia.gestion.vinculacion" },
    //     { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
    //     { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu" },
    //   ];
  }

  rest() {

  }
  // getPerfilesSeleccionados() {
  //   this.sigaServices
  //     .post("combossjcs_ordenCola", this.turnosItem)
  //     .subscribe(
  //       n => {
  //         // coger etiquetas de una persona juridica
  //         this.pesosExistentes = JSON.parse(n["body"]).colaOrden;
  //         this.pesosExistentes.forEach(element => {
  //           if (element.por_filas == "ALFABETICOAPELLIDOS") {
  //             element.por_filas = "Apellidos y nombre"
  //           }
  //           if (element.por_filas == "ANTIGUEDADCOLA") {
  //             element.por_filas = "Antigüedad en la cola"
  //           }
  //           if (element.por_filas == "NUMEROCOLEGIADO") {
  //             element.por_filas = "Nº Colegiado"
  //           }
  //           if (element.por_filas == "FECHANACIMIENTO") {
  //             element.por_filas = "Edad Colegiado"
  //           }
  //           if (element.orden == "asc") {
  //             element.orden = "ascendente"
  //           }
  //           if (element.orden == "desc") {
  //             element.orden = "descendente"
  //           }
  //         });

  //         this.pesosExistentesInicial = JSON.parse(
  //           JSON.stringify(this.pesosExistentes)
  //         );

  //       },
  //       err => {
  //         console.log(err);
  //       }, () => {
  //         this.getPerfilesExtistentes();
  //       }
  //     );
  // }

  // getPerfilesExtistentes() {

  //   let pesosFiltrados = Object.assign([], this.pesosExistentes);
  //   this.pesosSeleccionados = [];
  //   pesosFiltrados.forEach(element => {
  //     if (element.numero > 0) {
  //       this.pesosSeleccionados.push(element);
  //     }
  //     if (element.numero > 0) {
  //       this.pesosExistentes.splice(this.pesosExistentes.indexOf(element), 1);
  //       //this.pesosExistentes.splice(element, 1);
  //     }
  //   });
  //   this.pesosExistentes.forEach(element => {
  //     let e = { numero: element.numero, por_filas: element.por_filas, orden: element.orden };
  //     if (e.orden == undefined || e.orden == null) {
  //       element.orden = "ascendente";
  //     }
  //     if (e.orden != "desc") {
  //       e.orden = "descendente";
  //       this.pesosExistentes.push(e)
  //     }
  //   });
  //   this.pesosSeleccionadosTarjeta = "";
  //   this.pesosSeleccionados.forEach(element => {
  //     this.pesosSeleccionadosTarjeta += element.por_filas + " " + element.orden + ","
  //   });
  //   this.pesosSeleccionadosTarjeta = this.pesosSeleccionadosTarjeta.substring(0, this.pesosSeleccionadosTarjeta.length - 1);
  //   this.pesosSeleccionadosInicial = JSON.parse(
  //     JSON.stringify(this.pesosSeleccionados));
  // }

  save() { }
}
