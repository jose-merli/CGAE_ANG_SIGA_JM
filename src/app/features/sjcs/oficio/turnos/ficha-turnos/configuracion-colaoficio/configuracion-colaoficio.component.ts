import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { Location } from "@angular/common";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Subject } from "rxjs/Subject";
import { DatosGeneralesConsultaItem } from '../../../../../../models/DatosGeneralesConsultaItem';
import { DestinatariosItem } from '../../../../../../models/DestinatariosItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PrisionItem } from '../../../../../../models/sjcs/PrisionItem';
import { TurnosItems } from '../../../../../../models/sjcs/TurnosItems';
@Component({
  selector: "app-configuracion-colaoficio",
  templateUrl: "./configuracion-colaoficio.component.html",
  styleUrls: ["./configuracion-colaoficio.component.scss"]
})
export class ConfiguracionColaOficioComponent implements OnInit {

  //Resultados de la busqueda
  @Input() modoEdicion;
  @Output() modoEdicionSend = new EventEmitter<any>();

  @Input() turnosItem: TurnosItems;

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

  permisoEscritura: boolean = true;
  movilCheck: boolean = false

  visibleMovilValue: boolean = false;
  esDecanoValue: boolean = false;
  isCodigoEjisValue: boolean = false;
  pesosSeleccionadosTarjeta: String;
  progressSpinner: boolean = false;
  avisoMail: boolean = false

  emailValido: boolean = false;
  tlf1Valido: boolean = true;
  tlf2Valido: boolean = true;
  faxValido: boolean = true;
  mvlValido: boolean = true;
  edicionEmail: boolean = false;

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

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private translateService: TranslateService, private commonsServices: CommonsService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (this.turnosItem != undefined) {
      if (this.turnosItem.idturno != undefined) {
        // this.getPerfilesExtistentes();
        this.getPerfilesSeleccionados();
        this.body = this.turnosItem;
        this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
        if (this.body.idturno == undefined) {
          this.modoEdicion = false;
        } else {
          this.modoEdicion = true;
        }
      }
    } else {
      this.turnosItem = new TurnosItems();
    }

  }
  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()

    }



    this.getComboProvincias();

    this.validateHistorical();

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

  getComboProvincias() {
    this.progressSpinner = true;

    this.sigaServices.get("busquedaPrisiones_provinces").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboProvincias);
        this.progressSpinner = false;

      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
      }
    );
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
    this.pesosSeleccionadosInicial = JSON.parse(
      JSON.stringify(this.pesosSeleccionados));
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
      array.push(element);
    });
    this.pesosExistentes.forEach(element => {
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
      .post("turnos_tarjetaGuardarPesos", objPerfiles)
      .subscribe(
        n => {
          this.showSuccess(this.translateService.instant("justiciaGratuita.oficio.turnos.guardadopesos"));
          this.seleccionadasInicial = JSON.parse(JSON.stringify(this.pesosSeleccionados));
          this.noSeleccionadasInicial = JSON.parse(JSON.stringify(this.pesosExistentes));
          this.progressSpinner = false;

        },
        err => {
          this.showFail(this.translateService.instant("justiciaGratuita.oficio.turnos.errorguardadopesos"));
          console.log(err);
          this.progressSpinner = false;

        },
        () => {
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

        }
      );
  }


  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  save() {
    this.progressSpinner = true;
    let url = "";

    if (!this.modoEdicion) {
      url = "";
      this.callSaveService(url);

    } else {
      url = "";
      this.callSaveService(url);
    }

  }

  callSaveService(url) {

    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.idPrision = JSON.parse(data.body).id;
          let send = {
            modoEdicion: this.modoEdicion,
            idPrision: this.idPrision
          }
          this.body.idturno = this.idPrision
          this.persistenceService.setDatos(this.body);
          this.modoEdicionSend.emit(send);
        }

        this.bodyInicial = JSON.parse(JSON.stringify(this.body));

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
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
  rest() {
    this.pesosExistentes = JSON.parse(JSON.stringify(this.pesosExistentesInicial));
    this.pesosSeleccionados = JSON.parse(JSON.stringify(this.pesosSeleccionadosInicial));
    this.arreglaOrden();
  }

  editEmail() {
    if (this.edicionEmail)
      this.edicionEmail = false;
    else this.edicionEmail = true;
  }

  openOutlook(dato) {
    let correo = dato.email;
    this.commonsServices.openOutlook(correo);
  }

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  }
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
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
    if (!this.historico && this.permisoEscritura && (JSON.stringify(this.pesosExistentes) != JSON.stringify(this.pesosExistentesInicial ||
      JSON.stringify(this.pesosSeleccionados) != JSON.stringify(this.pesosSeleccionadosInicial)))) {
      return false;
    } else {
      return true;
    }
  }

  clear() {
    this.msgs = [];
  }
}
