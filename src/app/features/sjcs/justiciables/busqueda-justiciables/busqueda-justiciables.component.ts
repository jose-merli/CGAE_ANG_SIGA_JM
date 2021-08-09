import { Component, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { FiltroJusticiablesComponent } from './filtro-justiciables/filtro-justiciables.component';
import { TablaJusticiablesComponent } from './tabla-justiciables/tabla-justiciables.component';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { TranslateService } from '../../../../commons/translate';
import { Router, ActivatedRoute } from '@angular/router';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';
import { JusticiableBusquedaItem } from '../../../../models/sjcs/JusticiableBusquedaItem';
import { Location } from '@angular/common';
import { procesos_justiciables } from '../../../../permisos/procesos_justiciables';

@Component({
  selector: 'app-busqueda-justiciables',
  templateUrl: './busqueda-justiciables.component.html',
  styleUrls: ['./busqueda-justiciables.component.scss']
})
export class BusquedaJusticiablesComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error("Method not implemented.");
  }

  buscar: boolean = false;
  datos;

  progressSpinner: boolean = false;

  @ViewChild(FiltroJusticiablesComponent) filtros;
  @ViewChild(TablaJusticiablesComponent) tabla;

  msgs;

  fichasPosibles = [
    {
      origen: "justiciables",
      activa: true
    },
    {
      key: "generales",
      activa: true
    },
    {
      key: "personales",
      activa: true
    },
    {
      key: "solicitud",
      activa: false
    },
    {
      key: "representante",
      activa: false
    },
    {
      key: "asuntos",
      activa: false
    },
    {
      key: "abogado",
      activa: false
    },
    {
      key: "procurador",
      activa: false
    }

  ];

  permisoEscritura;
  modoRepresentante: boolean = false;
  searchJusticiable: boolean = false;
  nuevoInteresado: boolean = false;
  nuevoContrario: boolean = false;
  nuevoAsistido: boolean = false;
  nuevoContrarioAsistencia: boolean = false;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router,
    private activatedRoute: ActivatedRoute, private location: Location) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {

      if (params.rp == "1") {
        this.modoRepresentante = true;
      } else if (params.rp == "2") {
        this.searchJusticiable = true;
      }

    });

    if(sessionStorage.getItem("origin")=="newInteresado"){
      sessionStorage.removeItem('origin');
      this.nuevoInteresado=true;
    }

    if(sessionStorage.getItem("origin")=="newContrario"){
      sessionStorage.removeItem('origin');
      this.nuevoContrario=true;
    }

    if(sessionStorage.getItem("origin")=="newAsistido"){
      sessionStorage.removeItem('origin');
      this.nuevoAsistido=true;
    }

    if(sessionStorage.getItem("origin")=="newContrarioAsistencia"){
      sessionStorage.removeItem('origin');
      this.nuevoContrarioAsistencia=true;
    }

    this.persistenceService.setFichasPosibles(this.fichasPosibles);

    this.commonsService.checkAcceso(procesos_justiciables.justiciables)
      .then(respuesta => {

        this.permisoEscritura = respuesta;

        this.persistenceService.setPermisos(this.permisoEscritura);

        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
      ).catch(error => console.error(error));

  }


  isOpenReceive(event) {
    this.search(event);
  }


  search(event) {

    if (!this.modoRepresentante) {
      this.filtros.filtros = this.persistenceService.getFiltros()
    }

    this.progressSpinner = true;

    this.sigaServices.post("busquedaJusticiables_searchJusticiables", this.filtros.filtros).subscribe(
      n => {

        this.datos = JSON.parse(n.body).justiciableBusquedaItems;
        let error = JSON.parse(n.body).error;
        this.buscar = true;
        this.progressSpinner = false;

        if (this.tabla != undefined) {
          this.tabla.tabla.sortOrder = 0;
          this.tabla.tabla.sortField = '';
          this.tabla.tabla.reset();
          this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
        }

        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      });
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  backTo() {
    this.location.back();

  }

}
