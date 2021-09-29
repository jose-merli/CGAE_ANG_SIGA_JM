import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { Location } from "@angular/common";
import { Message } from "primeng/components/common/api";
import { MultiSelect, ConfirmationService } from '../../../../../../../../node_modules/primeng/primeng';
import { Subject } from "rxjs/Subject";
import { DatosGeneralesConsultaItem } from '../../../../../../models/DatosGeneralesConsultaItem';
import { DestinatariosItem } from '../../../../../../models/DestinatariosItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PrisionItem } from '../../../../../../models/sjcs/PrisionItem';
import { TurnosItems } from '../../../../../../models/sjcs/TurnosItems';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { Router } from '@angular/router';

@Component({
  selector: "app-configuracion-colaoficio",
  templateUrl: "./configuracion-colaoficio.component.html",
  styleUrls: ["./configuracion-colaoficio.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class ConfiguracionColaOficioComponent implements OnInit {

  //Resultados de la busqueda
  @Input() modoEdicion;
  @Input() openConfigColaOficio;
  @Output() modoEdicionSend = new EventEmitter<any>();
  @Input() idTurno;
  @Input() turnosItem: TurnosItems;
  @Input() tarjetaConfiguracionColaOficio: string;
  
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  turnosItem2;
  openFicha: boolean = false;
  msgs = [];
  historico: boolean = false;
  sufijos: any[];
  provinciaSelecionada: string;


  body: TurnosItems;
  bodyInicial: TurnosItems;
  idPrision;
  isDisabledProvincia: boolean = true;
  pesosExistentesInicial: any[];
  pesosSeleccionadosInicial: any[];
  pesosExistentes: any[];
  pesosSeleccionados: any[];
  numeroPerfilesExistentes: number = 0;
  perfilesNoSeleccionadosInicial: any[];
  seleccionadasInicial;
  noSeleccionadasInicial;
  comboProvincias;
  comboPoblacion;
  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones;
  codigoPostalValido: boolean = true;
  permisosTarjeta: boolean = true;
  disableAll: boolean = false;
  movilCheck: boolean = false

  visibleMovilValue: boolean = false;
  esDecanoValue: boolean = false;
  isCodigoEjisValue: boolean = false;
  @Output() pesosSeleccionadosTarjeta: string;
  progressSpinner: boolean = false;
  avisoMail: boolean = false

  emailValido: boolean = false;
  tlf1Valido: boolean = true;
  tlf2Valido: boolean = true;
  faxValido: boolean = true;
  mvlValido: boolean = true;
  edicionEmail: boolean = false;
  isLetrado: boolean = false;

  @ViewChild("mailto") mailto;

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "configuracion",
      activa: false
    },
    {
      key: 'configuracioncolaoficio',
      activa: false
    },
  ];

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,private router: Router,
    private translateService: TranslateService, private commonsService: CommonsService, private commonsServices: CommonsService, private confirmationService: ConfirmationService) { }


  ngOnChanges(changes: SimpleChanges) {

    if (this.turnosItem != undefined) {
      if (this.idTurno != undefined) {
        this.turnosItem.idturno = this.idTurno;
        this.body = this.turnosItem;
        this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
        if (this.body.idturno == undefined) {
          this.modoEdicion = false;
        } else {
          if (this.persistenceService.getDatos() != undefined) {
            this.turnosItem = this.persistenceService.getDatos();
          }
          if (this.turnosItem.fechabaja != undefined) {
            this.disableAll = true;
          }
          this.modoEdicion = true;
          this.getPerfilesSeleccionados();
        }

      }
    } else {
      this.getPerfilesSeleccionados();
      this.turnosItem = new TurnosItems();
    }
    if (this.openConfigColaOficio == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('configColaOficio')
      }
    }
  }
  ngOnInit() {
    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true;
    }
//   let isLetrado:boolean = false;

//  this.commonsService.getLetrado().then(respuesta => {​​  isLetrado = respuesta;    }​​);

    this.commonsService.checkAcceso(procesos_oficio.configuracionColaOficio)
    .then(respuesta => {
      this.permisosTarjeta = respuesta;
      this.persistenceService.setPermisos(this.permisosTarjeta);
      if (this.permisosTarjeta == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem(
          "descError",
          this.translateService.instant("generico.error.permiso.denegado")
        );
        this.router.navigate(["/errorAcceso"]);
      }else if(this.persistenceService.getPermisos() != true){
        this.disableAll = true;
      }
    }
    ).catch(error => console.error(error));


    if (this.modoEdicion) {
      this.body = this.turnosItem;
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    } else {

      this.body = new TurnosItems();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.edicionEmail = true;

    }
  }


  validateHistorical() {
    if (this.persistenceService.getDatos() != undefined) {

      if (this.persistenceService.getDatos().fechaBaja != null) {
        this.historico = true;
      } else {
        this.historico = false;
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

  getPerfilesSeleccionados() {
    if (!this.modoEdicion) {
      this.pesosExistentes = [];
      let a = { numero: "4", por_filas: "Antigüedad en la cola", orden: "ascendente" };
      let b = { numero: "0", por_filas: "Apellidos y nombre", orden: "ascendente" };
      let c = { numero: "0", por_filas: "Nº Colegiado", orden: "ascendente" };
      let d = { numero: "0", por_filas: "Edad Colegiado", orden: "ascendente" };
      this.pesosExistentes.push(a);
      this.pesosExistentes.push(b);
      this.pesosExistentes.push(c);
      this.pesosExistentes.push(d);
      this.getPerfilesExtistentes();
      this.pesosExistentesInicial = JSON.parse(
        JSON.stringify(this.pesosExistentes)
      );
    } else {
      this.sigaServices.getParam("combossjcs_ordenCola", "?idordenacioncolas="+this.turnosItem.idordenacioncolas)
        .subscribe(
          n => {
            // coger etiquetas de una persona juridica
            this.pesosExistentes = n.colaOrden;
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
          },
          err => {
            console.log(err);
          }, () => {
            this.getPerfilesExtistentes();
          } 
        );
    }
  }

  arrayObjectIndexOf(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].por_filas == obj.items.por_filas) {
        return i;
      }
    };
    return -1;
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
    // this.turnosItem.pesosSeleccionadosTarjeta = this.pesosSeleccionadosTarjeta;
    this.pesosSeleccionadosInicial = JSON.parse(
      JSON.stringify(this.pesosSeleccionados));
    this.pesosExistentesInicial = JSON.parse(
      JSON.stringify(this.pesosExistentes)
    );
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

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  guardar() {
    this.progressSpinner = true;
    let array: any[] = [];
    let arrayNoSel: any[] = [];
    this.pesosSeleccionados.forEach(element => {
      console.log("Seleccionados"+element.por_filas);
      array.push(element);
    });
    this.pesosExistentes.forEach(element => {
      console.log("No seleccionados"+element.por_filas);
      arrayNoSel.push(element);
    });
    array.forEach(element => {
      if (element.por_filas == "Apellidos y nombre") {
        element.por_filas = "ALFABETICOAPELLIDOS"
      }
      if (element.por_filas == "Antigüedad en la cola") {
        element.por_filas = "ANTIGUEDADCOLA"
      }
      if (element.por_filas == "Nº Colegiado") {
        element.por_filas = "NUMEROCOLEGIADO"
      }
      if (element.por_filas == "Edad Colegiado") {
        element.por_filas = "FECHANACIMIENTO"
      }
    });
    let objPerfiles = {
      pesosSeleccionados: array,
      pesosExistentes: arrayNoSel,
      idOrdenacionColas: this.turnosItem.idordenacioncolas,
      idturno: this.turnosItem.idturno,
    };
    this.sigaServices
      .post("turnos_tarjetaGuardarPesos2", objPerfiles)
      .subscribe(
        n => {
          this.showSuccess(this.translateService.instant("justiciaGratuita.oficio.turnos.guardadopesos"));
          this.pesosExistentesInicial = JSON.parse(JSON.stringify(this.pesosExistentes));
          this.progressSpinner = false;

          this.sigaServices.post("turnos_busquedaFichaTurnos", this.turnosItem).subscribe(
            n => {
              this.turnosItem2 = JSON.parse(n.body).turnosItem[0];
              // if (this.turnosItem.fechabaja != undefined || this.persistenceService.getPermisos() != true) {
              // 	this.turnosItem.historico = true;
              // }
            },
            err => {
              console.log(err);
            }, () => {
              this.persistenceService.setDatos(this.turnosItem2);
              let send = {
                buscar: true,
              }
              this.sigaServices.notifynewIdOrdenacion(send);
            }
          );
        },
        err => {
          this.showFail(this.translateService.instant("justiciaGratuita.oficio.turnos.errorguardadopesos"));
          console.log(err);
          this.progressSpinner = false;

        },
        () => {

          this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
          this.pesosSeleccionadosTarjeta = "";
          this.progressSpinner = false;
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
          this.pesosSeleccionados.forEach(element => {
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
            this.pesosSeleccionadosTarjeta += element.por_filas + " " + element.orden + ","
          });
          this.pesosSeleccionadosTarjeta = this.pesosSeleccionadosTarjeta.substring(0, this.pesosSeleccionadosTarjeta.length - 1);
          this.pesosSeleccionadosInicial = JSON.parse(JSON.stringify(this.pesosSeleccionados));
        }
      );
  }


  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
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

  restablecerPicklist() {
    let pesosFiltrados = Object.assign([], this.pesosSeleccionadosInicial);
    this.pesosSeleccionados = [];
    this.pesosExistentes = [];
    pesosFiltrados.forEach(element => {
      if (element.numero > 0) {
        this.pesosSeleccionados.push(element);
      }
      if (element.numero > 0) {
        this.pesosExistentes.splice(this.pesosExistentes.indexOf(element), 1);
        //this.pesosExistentes.splice(element, 1);
      }
    });
    this.pesosExistentesInicial.forEach(element => {
      let e = { numero: element.numero, por_filas: element.por_filas, orden: element.orden };
      this.pesosExistentes.push(e)
    });
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
    this.pesosSeleccionados.forEach(element => {
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
  }

  rest() {
    this.restablecerPicklist();
  }

  /* abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  } */
  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (
      key == "configColaOficio" &&
      !this.modoEdicion
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.modoEdicion) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }


  disabledSave() {
    if ((JSON.stringify(this.pesosSeleccionados) != JSON.stringify(this.pesosSeleccionadosInicial)) && this.pesosSeleccionados.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  clear() {
    this.msgs = [];
  }
}
