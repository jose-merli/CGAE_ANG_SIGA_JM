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
import { ModulosItem } from '../../../../../../models/sjcs/ModulosItem';
@Component({
  selector: "app-datos-generales-consulta",
  templateUrl: "./datos-generales-consulta.component.html",
  styleUrls: ["./datos-generales-consulta.component.scss"]
})
export class DatosGeneralesTurnosComponent implements OnInit {

  openFicha: boolean = true;
  body: TurnosItems = new TurnosItems();
  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  msgs;
  // jurisdicciones;
  procedimientos;
  textFilter;
  showTarjeta: boolean = true;
  esComa: boolean = false;
  textSelected: String = "{label}";
  permisoEscritura: boolean = true;
  jurisdicciones: any[] = [];
  areas: any[] = [];
  tiposturno: any[] = [];
  zonas: any[] = [];
  subzonas: any[] = [];
  materias: any[] = [];
  partidas: any[] = [];
  partidoJudicial: string;
  grupofacturacion: any[] = [];
  partidasJudiciales: any[] = [];
  isDisabledMateria: boolean = false;
  comboPJ
  tipoturnoDescripcion;
  MateriaDescripcion
  isDisabledSubZona: boolean = false;
  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "configuracion",
      activa: false
    },
  ];
  @Output() modoEdicionSend = new EventEmitter<any>();

  @ViewChild("importe") importe;
  //Resultados de la busqueda
  @Input() turnosItem: TurnosItems;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.turnosItem != undefined) {
      if (this.turnosItem.idturno != undefined) {
        this.body = this.turnosItem;
        this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
        this.getCombos();
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

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }
  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()
    }
    if (this.turnosItem != undefined) {
      this.body = this.turnosItem;
      this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
    } else {
      this.turnosItem = new TurnosItems();
    }
    if (this.body.idturno == undefined) {
      this.modoEdicion = false;
    } else {
      this.modoEdicion = true;
    }
    this.getCombos();
  }

  getCombos() {
    this.sigaServices.get("fichaZonas_getPartidosJudiciales").subscribe(
      n => {
        this.comboPJ = n.combooItems;

      },
      err => {
        console.log(err);
      }
    );


    this.sigaServices.get("fichaAreas_getJurisdicciones").subscribe(
      n => {
        this.jurisdicciones = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.jurisdicciones.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        console.log(err);
      }
    );

    this.sigaServices.get("combossjcs_comboAreas").subscribe(
      n => {
        this.areas = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.areas.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        console.log(err);
      }, () => {
        if (this.turnosItem.idarea != null) {

          this.sigaServices
            .getParam(
              "combossjcs_comboMaterias",
              "?idArea=" + this.turnosItem.idarea)
            .subscribe(
              n => {
                // this.isDisabledPoblacion = false;
                this.materias = n.combooItems;
              },
              error => { },
              () => {

              }
            );
        }
      }
    );

    this.sigaServices.get("combossjcs_comboTiposTurno").subscribe(
      n => {
        this.tiposturno = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.tiposturno.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        console.log(err);
      }, () => {
        for (let i = 0; i < this.tiposturno.length; i++) {
          if (this.tiposturno[i].value == this.turnosItem.idtipoturno) {
            this.tipoturnoDescripcion = this.tiposturno[i].label
          }

        }
      }
    );

    this.sigaServices.get("combossjcs_comboZonas").subscribe(
      n => {
        this.zonas = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.zonas.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        console.log(err);
      }, () => {
        if (this.turnosItem.idzona != null) {
          this.sigaServices
            .getParam(
              "fichaZonas_searchSubzones",
              "?idZona=" + this.turnosItem.idzona
            )
            .subscribe(
              n => {
                this.partidasJudiciales = n.zonasItems;
              },
              err => {
                console.log(err);

              }, () => {
                this.getPartidosJudiciales();
              }
            );

          this.sigaServices
            .getParam(
              "combossjcs_comboSubZonas",
              "?idZona=" + this.turnosItem.idzona)
            .subscribe(
              n => {
                // this.isDisabledPoblacion = false;
                this.subzonas = n.combooItems;
              },
              error => { },
              () => {
                // this.partidoJudicial = this.turnosItem.zona + "," + this.turnosItem.subzona;
                this.body = this.turnosItem;
                this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
              }
            );
        }
      }
    );
    this.sigaServices.get("combossjcs_comboPartidasPresupuestaria").subscribe(
      n => {
        this.partidas = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.partidas.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        console.log(err);
      }
    );

    this.sigaServices.get("combossjcs_comboGruposFacturacion").subscribe(
      n => {
        this.grupofacturacion = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.grupofacturacion.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        console.log(err);
      }, () => {
        this.body = this.turnosItem;
        this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
        if (this.turnosItem.idturno == undefined) {
          this.modoEdicion = false;
        } else {
          this.modoEdicion = true;
        }
      }
    );
    //   } else {
    //     this.body = this.turnosItem;
    //     this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
    //     if (this.turnosItem.idturno == undefined) {
    //       this.modoEdicion = false;
    //     } else {
    //       this.modoEdicion = true;
    //     }
    //   }
    // } else {
    //   this.turnosItem = new TurnosItems();
    // }
  }

  onChangeArea() {

    this.turnosItem.idmateria = "";
    this.materias = [];

    if (this.turnosItem.idarea != undefined && this.turnosItem.idarea != "") {
      this.isDisabledMateria = false;
      this.getComboMaterias();
    } else {
      this.isDisabledMateria = true;
    }

  }
  onChangeZona() {

    this.turnosItem.idsubzona = "";
    this.subzonas = [];

    if (this.turnosItem.idzona != undefined && this.turnosItem.idzona != "") {
      this.isDisabledSubZona = false;
      this.getComboSubZonas();
      this.partidoJudicial = "";
    } else {
      this.isDisabledSubZona = true;
      this.partidoJudicial = "";
    }

  }

  onChangeTipoturno() {
    for (let i = 0; i < this.tiposturno.length; i++) {
      if (this.tiposturno[i].value == this.turnosItem.idtipoturno) {
        this.tipoturnoDescripcion = this.tiposturno[i].label
      }
    }
  }

  getPartidosJudiciales() {

    for (let i = 0; i < this.partidasJudiciales.length; i++) {
      this.partidasJudiciales[i].partidosJudiciales = [];
      this.partidasJudiciales[i].jurisdiccion.forEach(partido => {
        let findPartido = this.comboPJ.find(x => x.value === partido);

        this.partidoJudicial = this.partidasJudiciales[i].nombrePartidosJudiciales;

        if (findPartido != undefined) {
          // this.partidasJudiciales[i].partidosJudiciales.push(findPartido);
        }

      });
    }
  }

  partidoJudiciales() {
    if (this.turnosItem.idsubzona != null || this.turnosItem.idsubzona != undefined) {
      this.sigaServices
        .getParam(
          "fichaZonas_searchSubzones",
          "?idZona=" + this.turnosItem.idzona
        )
        .subscribe(
          n => {
            this.partidasJudiciales = n.zonasItems;
          },
          err => {
            console.log(err);

          }, () => {
            this.getPartidosJudiciales();
          }
        );
    } else {
      this.isDisabledSubZona = true;
    }

  }
  getComboMaterias() {
    this.sigaServices
      .getParam(
        "combossjcs_comboMaterias",
        "?idArea=" + this.turnosItem.idarea)
      .subscribe(
        n => {
          // this.isDisabledPoblacion = false;
          this.materias = n.combooItems;
        },
        error => { },
        () => {
          if (this.turnosItem.idarea != null) {
            this.isDisabledMateria = false;
          }
        }
      );
  }

  getComboSubZonas() {
    this.sigaServices
      .getParam(
        "combossjcs_comboSubZonas",
        "?idZona=" + this.turnosItem.idzona)
      .subscribe(
        n => {
          // this.isDisabledPoblacion = false;
          this.subzonas = n.combooItems;
        },
        error => { },
        () => {

        }
      );
  }

  arreglaCombos() {
    this.sigaServices.get("combossjcs_comboAreas").subscribe(
      n => {
        this.areas = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.areas.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        console.log(err);
      }, () => {
        if (this.turnosItem.idarea != null) {

          this.sigaServices
            .getParam(
              "combossjcs_comboMaterias",
              "?idArea=" + this.turnosItem.idarea)
            .subscribe(
              n => {
                // this.isDisabledPoblacion = false;
                this.materias = n.combooItems;
              },
              error => { },
              () => {
                if (this.turnosItem.idarea != null) {
                  this.isDisabledMateria = false;
                }
              }
            );
        }
      }
    );

    this.sigaServices.get("combossjcs_comboZonas").subscribe(
      n => {
        this.zonas = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.zonas.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        console.log(err);
      }, () => {
        if (this.turnosItem.idzona != null) {
          this.sigaServices
            .getParam(
              "fichaZonas_searchSubzones",
              "?idZona=" + this.turnosItem.idzona
            )
            .subscribe(
              n => {
                this.partidasJudiciales = n.zonasItems;
              },
              err => {
                console.log(err);

              }, () => {
                if (this.turnosItem.idzona != null) {
                  this.isDisabledSubZona = false;
                }
                this.getPartidosJudiciales();
              }
            );

          this.sigaServices
            .getParam(
              "combossjcs_comboSubZonas",
              "?idZona=" + this.turnosItem.idzona)
            .subscribe(
              n => {
                // this.isDisabledPoblacion = false;
                this.subzonas = n.combooItems;
              },
              error => { },
              () => {
                // this.partidoJudicial = this.turnosItem.zona + "," + this.turnosItem.subzona;
                this.body = this.turnosItem;
                this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
              }
            );
        }
      }
    );
  }

  rest() {
    if (this.turnosItem != undefined) {
      this.turnosItem = JSON.parse(JSON.stringify(this.bodyInicial));
      this.arreglaCombos();
    }

  }

  save() {
    this.progressSpinner = true;
    let url = "";
    if (!this.modoEdicion) {
      url = "turnos_createnewTurno";
      this.callSaveService(url);
    } else {
      url = "turnos_updateDatosGenerales";
      this.callSaveService(url);
    }
  }

  callSaveService(url) {
    this.sigaServices.post(url, this.turnosItem).subscribe(
      data => {
        this.esComa = false;
        if (!this.modoEdicion) {
          this.modoEdicion = true;
          let turnos = JSON.parse(data.body);
          // this.modulosItem = JSON.parse(data.body);
          this.turnosItem.idturno = turnos.id;
          let send = {
            modoEdicion: this.modoEdicion,
            idturno: this.turnosItem.idturno
          }
          this.modoEdicionSend.emit(send);
        }
        for (let i = 0; i < this.tiposturno.length; i++) {
          if (this.tiposturno[i].value == this.turnosItem.idtipoturno) {
            this.tipoturnoDescripcion = this.tiposturno[i].label
          }
        }
        for (let i = 0; i < this.subzonas.length; i++) {
          if (this.subzonas[i].value == this.turnosItem.idsubzona) {
            this.turnosItem.subzona = this.subzonas[i].label
          }
        }
        this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
        this.persistenceService.setDatos(this.turnosItem);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.body = this.turnosItem;
        this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
      }
    );

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

  disabledSave() {
    if (this.turnosItem.nombre != undefined) this.turnosItem.nombre = this.turnosItem.nombre.trim();
    if ((JSON.stringify(this.turnosItem) != JSON.stringify(this.bodyInicial))) {
      return false;
    } else {
      return true;
    }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
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
}
