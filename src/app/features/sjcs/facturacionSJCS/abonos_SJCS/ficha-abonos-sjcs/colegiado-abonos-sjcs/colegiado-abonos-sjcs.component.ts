import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';
import { DatePipe } from '@angular/common';
import {ConfirmationService} from 'primeng/api';
import { FacAbonoItem } from '../../../../../../models/sjcs/FacAbonoItem';
import { DatosColegiadosItem } from '../../../../../../models/DatosColegiadosItem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-colegiado-abonos-sjcs',
  templateUrl: './colegiado-abonos-sjcs.component.html',
  styleUrls: ['./colegiado-abonos-sjcs.component.scss'],
  providers: [ConfirmationService]
})
export class ColegiadoAbonosSJCSComponent implements OnInit {

  openFicha: boolean = true;
  msgs = [];
  @Input() datos: FacAbonoItem;

  abonoItem: FacAbonoItem;  
  restablecerDatosFiltro: FacAbonoItem = new FacAbonoItem();  

  progressSpinner:boolean = false;
  comp:number=0;
  irpf:number=0;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices, private confirmationService: ConfirmationService,
    private translateService: TranslateService, private commonsService: CommonsService, private router: Router) {
     }

  ngOnInit() {
    console.log("si va")
    console.log(this.datos)

    
   }
   abreCierraFicha(){
    this.openFicha = !this.openFicha
  }
  

  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    return fecha;
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
  comunicar(){}


  navigateToCliente() {
    if (this.datos.idPersona) {
      this.progressSpinner = true;

    sessionStorage.setItem("consulta", "true");
    let filtros = { idPersona: this.datos.idPersona };

    this.sigaServices.postPaginado("busquedaColegiados_searchColegiadoFicha", "?numPagina=1", filtros).toPromise().then(
      n => {
        let results: DatosColegiadosItem[] = JSON.parse(n.body).colegiadoItem;
        
        if (results != undefined && results.length != 0) {
          let datosColegiado: DatosColegiadosItem = results[0];

          sessionStorage.setItem("abonosSJCSItem", JSON.stringify(this.datos));
          sessionStorage.setItem("volver", "true");

          sessionStorage.setItem("personaBody", JSON.stringify(datosColegiado));
          sessionStorage.setItem("filtrosAbonosSJCS", JSON.stringify(filtros));
          sessionStorage.setItem("solicitudAprobada", "true");
          sessionStorage.setItem("origin", "Cliente");
        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).then(() => this.progressSpinner = false).then(() => {
      if (sessionStorage.getItem("personaBody")) {
        this.router.navigate(["/fichaColegial"]);
      } 
    });
    }
  }

 }
