import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { OldSigaServices } from '../../../../../../_services/oldSiga.service';
import { Location } from '@angular/common';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { TranslateService } from '../../../../../../commons/translate';
import { Router } from '@angular/router';

@Component({
    selector: 'add-expediente',
    templateUrl: './add-expediente.component.html'
  })
  export class AddExpedienteComponent implements OnInit{

    progressSpinner:boolean = false;
    url;
    datos;

    constructor(public oldSigaServices: OldSigaServices, private sigaServices: SigaServices,
      private location: Location, private persistenceService: PersistenceService) {
        oldSigaServices.getOldSigaUrl("url");
      }

    ngOnInit() {
      if (this.persistenceService.getDatos()) {
        this.datos = this.persistenceService.getDatos();
      }
    }

    goBack() {
      this.progressSpinner = true;
    
    this.sigaServices.post("gestionejg_datosEJG", this.datos).subscribe(
      n => {
        let ejgObject = JSON.parse(n.body).ejgItems;
        let datosItem = ejgObject[0];
        this.persistenceService.setDatos(datosItem);
        this.consultaUnidadFamiliar(this.datos);
        this.location.back();
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
    }

    consultaUnidadFamiliar(selected) {
      this.progressSpinner = true;
  
      this.sigaServices.post("gestionejg_unidadFamiliarEJG", selected).subscribe(
        n => {
          let datosFamiliares = JSON.parse(n.body).unidadFamiliarEJGItems;
          this.persistenceService.setBodyAux(datosFamiliares);
          this.location.back();
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
  }