import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList, ChangeDetectorRef, SimpleChanges, Input } from '@angular/core';
import { TranslateService } from '../../../../../../commons/translate';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { procesos_maestros } from '../../../../../../permisos/procesos_maestros';
import { Router } from '@angular/router';
import { MultiSelect } from '../../../../../../../../node_modules/primeng/primeng';
import { TiposActuacionObject } from '../../../../../../models/sjcs/TiposActuacionObject';
import { PartidasPresupuestarias } from '../../../../maestros/partidas/partidasPresupuestarias/partidasPresupuestarias.component';
import { TablaPartidasComponent } from '../../../../maestros/partidas/gestion-partidas/gestion-partidaspresupuestarias.component';
// import { FiltrosTurnos } from './filtros-turnos/filtros-turnos.component';
// import { TablaTurnosComponent } from './gestion-turnos/gestion-turnos.component';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { InscripcionesItems } from '../../../../../../models/sjcs/InscripcionesItems';
import { Location } from '@angular/common';
import { EJGItem } from '../../../../../../models/sjcs/EJGItem';
import { Message } from 'primeng/components/common/api';
import { procesos_ejg } from '../../../../../../permisos/procesos_ejg';
import { ContrariosPreDesignacionComponent } from './contrarios-pre-designacion/contrarios-pre-designacion.component';
import { DefensaJuridicaComponent } from './defensa-juridica/defensa-juridica.component';
import { ProcuradorPreDesignacionComponent } from './procurador-pre-designacion/procurador-pre-designacion.component';

@Component({
  selector: 'app-ficha-pre-designacion',
  templateUrl: './ficha-pre-designacion.component.html',
  styleUrls: ['./ficha-pre-designacion.component.scss']
})
export class FichaPreDesignacionComponent implements OnInit {

  buscar: boolean = false;
  body: EJGItem;

  iconoTarjetaResumen = "clipboard";



  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*la particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
  ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
  el hijo lo declaramos como @ViewChild(ChildComponent)).*/
  @ViewChild(ContrariosPreDesignacionComponent) contrariosPreDesigna;
  @ViewChild(DefensaJuridicaComponent) defensaJuridica;
  @ViewChild(ProcuradorPreDesignacionComponent) procuradorPreDesigna;




  datosTarjetaResumen;



  //Variables asociadas a los enlaces de la tarjeta resumen
  enlacesTarjetaResumen = [];
  manuallyOpened: boolean;
  openTarjetaDefensaJuridica: boolean;
  openTarjetaContrariosPreDesigna: boolean;
  openTarjetaProcuradorPreDesigna: boolean;

  msgs: Message[];
  permisoEscritura: boolean = true;

  permisoContrarios;
  permisoProcurador;
  permisoDefensaJuridica;
  permisoResumen;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router,
    private location: Location) { }

  ngOnInit() {
    this.progressSpinner = true;
    //Comprobar si el ejg tiene alguna designacion asignada.
    //Si es asi, esta ficha sera unicamente de consulta, no edicion.
    //if()
    if (sessionStorage.getItem("EJGItem")) {
      this.body = JSON.parse(sessionStorage.getItem("EJGItem"));
      sessionStorage.removeItem("EJGItem");
      this.persistenceService.setDatos(this.body);
    }
    else this.body = this.persistenceService.getDatos();
    this.checkAcceso();
    this.cargaInicial();
  }

  checkAcceso() {
    this.commonsService.checkAcceso(procesos_ejg.preDesignacion)
      .then(respuesta => {
        this.permisoEscritura = respuesta;
      }).catch(error => console.error(error));

    if (this.permisoEscritura == undefined) {
      sessionStorage.setItem("codError", "403");
      sessionStorage.setItem(
        "descError",
        this.translateService.instant("generico.error.permiso.denegado")
      );
      this.progressSpinner = false;
      this.router.navigate(["/errorAcceso"]);
    } else {
      this.obtenerAccesoTarjetas();
      this.progressSpinner = false;
    }
  }

  obtenerAccesoTarjetas() {
    let recibidos = 0;
    this.commonsService.checkAcceso(procesos_ejg.preDesResumen)
      .then(respuesta => {
        this.permisoResumen = respuesta;
        recibidos++;
        if(recibidos==4)this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    this.commonsService.checkAcceso(procesos_ejg.defensaJuridica)
      .then(respuesta => {
        this.permisoDefensaJuridica = respuesta;
        recibidos++;
        if(recibidos==4)this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    this.commonsService.checkAcceso(procesos_ejg.procurador)
      .then(respuesta => {
        this.permisoProcurador = respuesta;
        recibidos++;
        if(recibidos==4)this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    this.commonsService.checkAcceso(procesos_ejg.contrarios)
      .then(respuesta => {
        this.permisoContrarios = respuesta;
        recibidos++;
        if(recibidos==4)this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));
  }

  cargaInicial() {
    //Comprobar si el EJG tiene alguna designacion asignada.
    //Si es asi, esta ficha sera unicamente de consulta, no edicion.
    this.checkEJGDesignas();
    //Actualmente se presentan los mismos datos que en la ficha de EJG.
    this.iniciarTarjetaResumen();
  }

  iniciarTarjetaResumen() {

    this.datosTarjetaResumen = [
      {
        label: "Año/Numero EJG",
        value: this.body.numAnnioProcedimiento
      },
      {
        label: "Solicitante",
        value: this.body.nombreApeSolicitante
      },
      {
        label: "Estado EJG",
        value: this.body.estadoEJG
      },
      {
        label: "Designado",
        value: this.body.apellidosYNombre
      },
      {
        label: "Dictamen",
        value: this.body.dictamenSing
      },
      {
        label: "CAJG",
        value: this.body.resolucion
      },
      {
        label: "Impugnación",
        value: this.body.impugnacion
      },
    ];
  }

  enviarEnlacesTarjeta() {
    this.enlacesTarjetaResumen = []

    setTimeout(() => {

      let enlaces
      
      if (this.permisoDefensaJuridica != undefined) {
        enlaces = {
          label: "justiciaGratuita.ejg.preDesigna.defensaJuridica",
          value: document.getElementById("defensaJuridica"),
          nombre: "defensaJuridica",
        };

        this.enlacesTarjetaResumen.push(enlaces);
      }

      if (this.permisoContrarios != undefined) {
        enlaces = {
          label: "justiciaGratuita.ejg.preDesigna.contrarios",
          value: document.getElementById("contrariosPreDesigna"),
          nombre: "contrariosPreDesigna",
        };

        this.enlacesTarjetaResumen.push(enlaces);
      }

      if (this.permisoProcurador != undefined) {
        enlaces = {
          label: "justiciaGratuita.oficio.designas.contrarios.procurador",
          value: document.getElementById("procuradorPreDesigna"),
          nombre: "procuradorPreDesigna",
        };

        this.enlacesTarjetaResumen.push(enlaces);
      }
    }, 5);
  }

  backTo() {
    //Variable de entorno que guarda toda la informacion perteneciente a la designacion asociada al EJG si la hubiera.
    sessionStorage.removeItem("Designa");
    this.location.back();
  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }

  checkEJGDesignas() {
    this.sigaServices.post("gestionejg_getEjgDesigna", this.body).subscribe(
      n => {
        let ejgDesignas = JSON.parse(n.body).ejgDesignaItems;
        if (ejgDesignas.length == 0) this.permisoEscritura = true;
        else this.permisoEscritura = false;
      }
    );
  }

  clear() {
    this.msgs = [];
  }

  isOpenReceive(event) {

    if (event != undefined) {
      switch (event) {
        // case "defensaJuridica":
        //   this.openTarjetaDefensaJuridica = true;
        //   break;
        // case "contrariosPreDesigna":
        //   this.openTarjetaContrariosPreDesigna = true;
        //   break;
        // case "procuradorPreDesigna":
        //   this.openTarjetaProcuradorPreDesigna = true;
        //   break;
        case "defensaJuridica":
          this.defensaJuridica.openDef = true;
          break;
        case "contrariosPreDesigna":
          this.contrariosPreDesigna.openCon = true;
          break;
        case "procuradorPreDesigna":
          this.procuradorPreDesigna.openPro = true;
          break;
      }
    }
  }

}
