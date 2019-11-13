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

  provinciaSelecionada: string;


  body: TurnosItems;
  bodyInicial: TurnosItems;
  idPrision;
  isDisabledProvincia: boolean = true;
  perfilesSeleccionadosInicial: any[];
  perfilesSeleccionados: any[];
  perfilesNoSeleccionados: any[];
  numeroPerfilesExistentes: number = 0;
  perfilesNoSeleccionadosInicial: any[];

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
        this.getPerfilesExtistentes();
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
          this.perfilesSeleccionados = JSON.parse(n["body"]).colaOrden;
          this.perfilesSeleccionadosInicial = JSON.parse(
            JSON.stringify(this.perfilesSeleccionados)
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
        }
      );
  }

  arrayObjectIndexOf(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value == obj.value) {
        return i;
      }
    };
    return -1;
  }
  getPerfilesExtistentes() {
    this.progressSpinner = true;
    this.sigaServices.getParam("combossjcs_ordenColaEnvios", "?idordenacioncolas=" + this.turnosItem.idordenacioncolas).subscribe(
      n => {
        // coger etiquetas de una persona juridica
        this.perfilesNoSeleccionados = n.combooItems;
        this.numeroPerfilesExistentes = this.perfilesNoSeleccionados.length;
        this.perfilesNoSeleccionadosInicial = JSON.parse(
          JSON.stringify(this.perfilesNoSeleccionados)
        );
      },
      err => {
        console.log(err);
      },
      () => {
        let i = 0;
        if (this.perfilesSeleccionados != undefined) {
          let perfilesFiltrados = this.perfilesNoSeleccionados;
          this.perfilesNoSeleccionados = [];
          perfilesFiltrados.forEach(element => {
            let find = this.perfilesSeleccionados.find(x => x.value == element.value);
            if (find != undefined) {
              // console.log(perfilesFiltrados[i]);
            } else {
              this.perfilesNoSeleccionados.push(perfilesFiltrados[i]);
            }
            i++;
          });
        }
        this.progressSpinner = false;
      }
    );
  }
  save() {
    this.progressSpinner = true;
    let url = "";

    if (!this.modoEdicion) {
      url = "gestionPrisiones_createPrision";
      this.callSaveService(url);

    } else {
      url = "gestionPrisiones_updatePrision";
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

  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.emailValido = false
    this.edicionEmail = true
    this.tlf1Valido = true
    this.tlf2Valido = true
    this.faxValido = true

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
    if (!this.historico && this.permisoEscritura && (JSON.stringify(this.body) != JSON.stringify(this.bodyInicial))) {
      return false;
    } else {
      return true;
    }
  }

  clear() {
    this.msgs = [];
  }
}
