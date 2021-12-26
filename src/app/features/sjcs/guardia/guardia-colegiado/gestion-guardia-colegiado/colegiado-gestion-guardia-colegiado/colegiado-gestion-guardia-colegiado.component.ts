import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColegiadoItem } from '../../../../../../models/ColegiadoItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-colegiado-gestion-guardia-colegiado',
  templateUrl: './colegiado-gestion-guardia-colegiado.component.html',
  styleUrls: ['./colegiado-gestion-guardia-colegiado.component.scss']
})
export class ColegiadoGestionGuardiaColegiadoComponent implements OnInit {

  msgs;
  progressSpinner;
  colegiado;
  colegiadoItem;
  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private router: Router) { }

  ngOnInit() {
    this.progressSpinner = true;
    if(this.persistenceService.getDatos()){
      this.colegiado = this.persistenceService.getDatos();
      this.getColegiado();
    }
    this.progressSpinner = false

  }

  navigateTofichaColegiado(){
    this.router.navigate(['/fichaColegial']);
  }

  getColegiado(){
    this.sigaServices
      .postPaginado('busquedaColegiados_searchColegiadoFicha', '?numPagina=1', this.colegiado)
      .subscribe(
        (data) => {
          this.colegiadoItem = JSON.parse(data['body']).colegiadoItem[0];
         
        },
        (err) => {
          //console.log(err);
        }, () => {
        });

  }
  navigateToFichaColegiado(){
    sessionStorage.setItem('personaBody', JSON.stringify(this.colegiadoItem));
    sessionStorage.setItem('esNuevoNoColegiado', JSON.stringify(false));
    sessionStorage.setItem('esColegiado', 'true');
    sessionStorage.setItem("originGuardiaColeg", "true");
    this.router.navigate(['/fichaColegial']);
  }

  clear(){
    this.msgs = [];
  }
}
