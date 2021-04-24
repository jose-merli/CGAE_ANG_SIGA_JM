import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActuacionDesignaItem } from '../../../../../../../models/sjcs/ActuacionDesignaItem';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../../_services/commons.service';
import { procesos_oficio } from '../../../../../../../permisos/procesos_oficio';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../../commons/translate/translation.service';
import { ColegiadoItem } from '../../../../../../../models/ColegiadoItem';

@Component({
  selector: 'app-ficha-actuacion',
  templateUrl: './ficha-actuacion.component.html',
  styleUrls: ['./ficha-actuacion.component.scss']
})
export class FichaActuacionComponent implements OnInit {

  rutas: string[] = ['SJCS', 'Designaciones', 'Actuaciones', 'Ficha Actuación'];

  tarjetaFija = {
    nombre: "Resumen Actuación",
    icono: 'fas fa-clipboard',
    imagen: '',
    detalle: false,
    fixed: true,
    campos: [
      {
        "key": "Año/Número designación",
        "value": ""
      },
      {
        "key": "Letrado",
        "value": ""
      },
      {
        "key": "Número Actuación",
        "value": ""
      },
      {
        "key": "Fecha Actuación",
        "value": ""
      }
    ],
    enlaces: []
  };

  listaTarjetas = [
    {
      id: 'sjcsDesigActuaOfiDatosGen',
      nombre: "Datos Generales",
      imagen: "",
      icono: 'far fa-address-book',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Juzgado",
          "value": ""
        },
        {
          "key": "Módulo",
          "value": ""
        },
        {
          "key": "Acreditación",
          "value": ""
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiJustifi',
      nombre: "Justificación",
      imagen: "",
      icono: 'fa fa-gavel',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Fecha Justificación",
          "value": ""
        },
        {
          "key": "Estado",
          "value": ""
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiDatFac',
      nombre: "Datos Facturación",
      imagen: "",
      icono: 'fa fa-usd',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Partida Presupuestaria",
          "value": ""
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiRela',
      nombre: "Relaciones",
      imagen: "",
      icono: 'fas fa-link',
      fixed: false,
      detalle: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Relaciones",
          "value": ""
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiHist',
      nombre: "Histórico",
      imagen: "",
      icono: 'fas fa-table',
      fixed: false,
      detalle: true,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigActuaOfiDoc',
      nombre: "Documentación",
      imagen: "",
      icono: 'fa fa-briefcase',
      fixed: false,
      detalle: false,
      opened: false,
      campos: [
        {
          "key": "Número total de Documentos",
          "value": ""
        },
      ]
    },
  ];

  actuacionDesigna: any;
  isNewActDesig: boolean = false;
  progressSpinner: boolean = false;
  isAnulada: boolean = false;
  permisoEscritura;
  usuarioLogado;

  constructor(private location: Location, private sigaServices: SigaServices, private commonsService: CommonsService, private router: Router, private translateService: TranslateService) { }

  ngOnInit() {

    if (sessionStorage.getItem("actuacionDesigna")) {
      let actuacion = JSON.parse(sessionStorage.getItem("actuacionDesigna"));
      sessionStorage.removeItem("actuacionDesigna");
      this.actuacionDesigna = actuacion;
      console.log("🚀 ~ file: ficha-actuacion.component.ts ~ line 149 ~ FichaActuacionComponent ~ ngOnInit ~ this.actuacionDesigna", this.actuacionDesigna)

      // Se rellenan la tarjeta resumen
      this.tarjetaFija.campos[0].value = this.actuacionDesigna.designaItem.ano;
      this.tarjetaFija.campos[1].value = `${this.actuacionDesigna.designaItem.numColegiado} ${this.actuacionDesigna.designaItem.nombreColegiado}`;
      this.tarjetaFija.campos[2].value = this.actuacionDesigna.actuacion.numeroAsunto;
      this.tarjetaFija.campos[3].value = this.actuacionDesigna.actuacion.fechaActuacion;

      // Se rellenan los campos de la tarjeta de Datos Generales plegada
      this.listaTarjetas[0].campos[0].value = this.actuacionDesigna.actuacion.nombreJuzgado;
      this.listaTarjetas[0].campos[1].value = this.actuacionDesigna.actuacion.modulo;
      this.listaTarjetas[0].campos[2].value = this.actuacionDesigna.actuacion.acreditacion;

      // Se rellenan los campos de la tarjeta de Justificación plegada
      this.listaTarjetas[1].campos[0].value = this.actuacionDesigna.actuacion.fechaJustificacion;
      this.listaTarjetas[1].campos[1].value = this.actuacionDesigna.actuacion.validada ? 'Validada' : 'Pendiente de validar';

      if (actuacion.isNew) {
        //this.getNewId(actuacion.designaItem);
        this.isNewActDesig = true;
      }
      this.progressSpinner = true;
      this.commonsService.checkAcceso(procesos_oficio.designa)
        .then(respuesta => {
          this.permisoEscritura = respuesta;

          if (this.permisoEscritura == undefined) {
            sessionStorage.setItem("codError", "403");
            sessionStorage.setItem(
              "descError",
              this.translateService.instant("generico.error.permiso.denegado")
            );
            this.router.navigate(["/errorAcceso"]);
          }
          this.progressSpinner = false;
          if (!this.permisoEscritura) {
            this.getDataLoggedUser();
          }

        })
        .catch(error => console.error(error));

    }

  }

  ngAfterViewInit() {

    this.goTop();

    this.listaTarjetas.forEach(tarj => {
      let tarjTmp = {
        id: tarj.id,
        ref: document.getElementById(tarj.id),
        nombre: tarj.nombre
      };

      this.tarjetaFija.enlaces.push(tarjTmp);
    });

  }

  isOpenReceive(event) {
    let tarjTemp = this.listaTarjetas.find(tarj => tarj.id == event);

    if (tarjTemp.detalle) {
      tarjTemp.opened = true;
    }

  }

  goTop() {
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  backTo() {
    this.location.back();
  }

  getNewId(designaItem: any) {

    this.progressSpinner = true;

    let actuacionRequest = {
      anio: designaItem.ano.toString().split('/')[0].replace('D', ''),
      idTurno: designaItem.idTurno,
      numero: designaItem.codigo,
    };

    this.sigaServices.post("actuaciones_designacion_newId", actuacionRequest).subscribe(
      data => {
        const idMax = JSON.parse(data.body).idMax;

        if (idMax != null) {
          this.actuacionDesigna.actuacion.numeroAsunto = idMax;
        }
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        if (this.isNewActDesig) {
          this.listaTarjetas.forEach(tarj => {
            if (tarj.id != 'sjcsDesigActuaOfiDatosGen') {
              tarj.detalle = false;
            } else {
              tarj.opened = true;
            }
          });
        }
      }
    );

  }

  changeDataTarjeta(event) {

    let tarjeta = this.listaTarjetas.find(el => el.id == event.tarjeta);

    if (event.tarjeta == 'sjcsDesigActuaOfiJustifi') {
      tarjeta.campos[0].value = event.fechaJusti;
      tarjeta.campos[1].value = event.estado;
    }

  }

  getDataLoggedUser() {

    this.progressSpinner = true;

    this.sigaServices.get("usuario_logeado").subscribe(n => {

      const usuario = n.usuarioLogeadoItem;
      const colegiadoItem = new ColegiadoItem();
      colegiadoItem.nif = usuario[0].dni;

      this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
        usr => {
          this.usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
          console.log("🚀 ~ file: ficha-actuacion.component.ts ~ line 307 ~ FichaActuacionComponent ~ this.sigaServices.get ~  this.usuarioLogado", this.usuarioLogado)
          this.progressSpinner = false;
        });

    });

  }


}
