import { Component, OnInit, ViewChild } from '@angular/core';
import { DestinatariosEnviosMasivosItem } from '../../../../../models/DestinatariosEnviosMasivosItem';
import { FichaColegialGeneralesItem } from "../../../../../models/FichaColegialGeneralesItem";
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { Router } from '@angular/router';

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

  @ViewChild('table') table: DataTable;
  selectedDatos

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

    this.sigaServices
      .post("busquedaPer", destinatario.idPersona)
      .subscribe(
        n => {
          let persona = JSON.parse(n["body"]);
          if(persona && persona.colegidoItem){
            this.fichaDestinatario = persona.colegidoItem[0];
            sessionStorage.setItem("personaBody", JSON.stringify(this.fichaDestinatario));
            this.router.navigate(['/fichaColegial']);
            sessionStorage.removeItem("busquedaCensoGeneral")
            sessionStorage.removeItem("esColegiado")
            sessionStorage.setItem("destinatarioCom", JSON.stringify(this.body));
          }else if(persona && persona.noColegidoItem){
            this.fichaDestinatario = persona.noColegidoItem[0];
            sessionStorage.setItem("personaBody", JSON.stringify(this.fichaDestinatario));
            this.router.navigate(['/fichaColegial']);
            sessionStorage.removeItem("busquedaCensoGeneral")
            sessionStorage.removeItem("esColegiado")
            sessionStorage.setItem("destinatarioCom", JSON.stringify(this.body));
          }else{

          }      
        },
        err => {
          console.log(err);
        },

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
          console.log(err);
        },

      );

  }

}
