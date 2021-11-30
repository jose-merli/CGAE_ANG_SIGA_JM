import { Component, OnInit, ViewChild } from '@angular/core';
import { DestinatariosEnviosMasivosItem } from '../../../../../models/DestinatariosEnviosMasivosItem';
import { FichaColegialGeneralesItem } from "../../../../../models/FichaColegialGeneralesItem";
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { Router } from '@angular/router';
import { Message } from "primeng/components/common/api";

@Component({
  selector: 'app-destinatarios',
  templateUrl: './destinatarios.component.html',
  styleUrls: ['./destinatarios.component.scss']
})
export class DestinatariosComponent implements OnInit {

  openFicha: boolean = false;
  body: DestinatariosEnviosMasivosItem = new DestinatariosEnviosMasivosItem();
  grupos: any[];
  openDestinatario: boolean;
  destinatarios: any = [];
  fichaDestinatario: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  progressSpinner: boolean = false;

  @ViewChild('table') table: DataTable;
  selectedDatos

  msgs: Message[];

  fichasPosibles = [
    {
      key: "configuracion",
      activa: false
    },
    {
      key: "programacion",
      activa: false
    },
    {
      key: "destinatarios",
      activa: false
    },
    {
      key: "documentos",
      activa: false
    },

  ];

  constructor(
    private router: Router,
    // private translateService: TranslateService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    this.getDatos();

    this.getDestinatarios();


  }

  abreCierraFicha() {
    if (this.destinatarios.length > 0) {
      this.openFicha = !this.openFicha;
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

  onOpenDestinatario(d) {
    d.open = !d.open;
  }

  getDatos() {
    if (sessionStorage.getItem("comunicacionesSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("comunicacionesSearch"));
    }
  }

  isValidDNI(dni: string): boolean {
    let DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

    let DNI_REGEX = /^(\d{8})([A-Z])$/;
    let CIF_REGEX = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
    let NIE_REGEX = /^[XYZ]\d{7,8}[A-Z]$/;

    if (DNI_REGEX.test(dni) || CIF_REGEX.test(dni) || NIE_REGEX.test(dni)) {
      return true;
    } else {
      return false;
    }
    // return (
    //   dni &&
    //   typeof dni === "string" &&
    //   /^[0-9]{8}([A-Za-z]{1})$/.test(dni) &&
    //   dni.substr(8, 9).toUpperCase() ===
    //     DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23)
    // );
  }

  navigateTo(destinatario) {
    this.progressSpinner = true;
    this.sigaServices
      .post("busquedaPer", destinatario.idPersona)
      .subscribe(
        n => {
          let persona = JSON.parse(n["body"]);
          if (persona && persona.colegiadoItem) {
            this.fichaDestinatario = persona.colegiadoItem[0];
            sessionStorage.setItem("personaBody", JSON.stringify(this.fichaDestinatario));
            sessionStorage.removeItem("busquedaCensoGeneral")
            sessionStorage.removeItem("esColegiado")
            sessionStorage.setItem("destinatarioCom", JSON.stringify(this.body));
            sessionStorage.setItem('esNuevoNoColegiado', JSON.stringify(false));
            this.router.navigate(['/fichaColegial']);
          } else if (persona && persona.noColegiadoItem) {
            this.fichaDestinatario = persona.noColegiadoItem[0];
            sessionStorage.setItem("personaBody", JSON.stringify(this.fichaDestinatario));
            sessionStorage.removeItem("busquedaCensoGeneral")
            sessionStorage.removeItem("esColegiado")
            sessionStorage.setItem("destinatarioCom", JSON.stringify(this.body));
            sessionStorage.setItem('esNuevoNoColegiado', JSON.stringify(false));
            this.router.navigate(['/fichaColegial']);
          } else {
            this.showFail('Error al cargar el destinatario');
          }
        },
        err => {
          //console.log(err);
        }, () => {
          this.progressSpinner = false;
        }

      );
  }

  getDestinatarios() {
    this.sigaServices
      .post("comunicaciones_destinatarios", this.body.idEnvio)
      .subscribe(
        n => {
          // coger etiquetas de una persona juridica
          this.destinatarios = JSON.parse(n["body"]).destinatarios;
        },
        err => {
          //console.log(err);
        },

    );

  }

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }

}
