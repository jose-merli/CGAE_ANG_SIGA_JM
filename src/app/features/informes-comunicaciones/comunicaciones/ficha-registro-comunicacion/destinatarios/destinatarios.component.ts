import { Component, OnInit, ViewChild } from '@angular/core';
import { DestinatariosItem } from '../../../../../models/DestinatariosItem';
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";

@Component({
  selector: 'app-destinatarios',
  templateUrl: './destinatarios.component.html',
  styleUrls: ['./destinatarios.component.scss']
})
export class DestinatariosComponent implements OnInit {

  openFicha: boolean = false;
  body: DestinatariosItem = new DestinatariosItem();
  grupos: any[];
  openDestinatario: boolean;
  destinatarios: any[];

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
    // private router: Router,
    // private translateService: TranslateService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    this.getDatos();

    this.destinatarios = [
      {
        id: '1',
        idGrupo: '1',
        nif: '29182234C',
        nombre: 'Isabel',
        apellido1: 'Salinero',
        apellido2: '',
        open: false,
      },
      {
        id: '2',
        idGrupo: '2',
        nif: '344344Y',
        nombre: 'Ana',
        apellido1: 'FSF',
        apellido2: '',
        open: false,
      }
    ]
  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
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

}