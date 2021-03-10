import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RoutesRecognized } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';

@Component({
  selector: 'app-filtro-designaciones',
  templateUrl: './filtro-designaciones.component.html',
  styleUrls: ['./filtro-designaciones.component.scss']
})
export class FiltroDesignacionesComponent implements OnInit {
  
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  
  expanded = true;

  @Input() datePickers;
  @Input() inputs1;
  @Input() selectores1;
  @Input() modoBusqueda;

  progressSpinner: boolean = false;
  showDesignas: boolean = false;
  showJustificacionExpress: boolean = false;


  datePickers1 = [];
  datePickers2 = [];

  radioTarjeta: String = 'designas';

  constructor(private router: Router, private translateService: TranslateService) { }

  cForm = new FormGroup({
    NIF: new FormControl(''),
    Apellidos: new FormControl(''),
    Nombre: new FormControl(''),
  });

  ngOnInit(): void {
    this.progressSpinner=true;
    this.showDesignas = true;

    this.checkLastRoute();

    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('usuarioBusquedaExpress')) {
      this.usuarioBusquedaExpress = JSON.parse(sessionStorage.getItem('usuarioBusquedaExpress'));
    }

    if(this.datePickers!=undefined){
      for (let i = 0; i < this.datePickers.length; i++) {
        this.datePickers1 = this.datePickers[0];
        this.datePickers2 = this.datePickers[1];
      }
    }
  }

  changeFilters() {
    this.showDesignas=!this.showDesignas;
    this.showJustificacionExpress=!this.showJustificacionExpress;
  }

  checkLastRoute() {
    this.progressSpinner=false;
    // this.router.events
    //   .filter(e => e instanceof RoutesRecognized)
    //   .pairwise()
    //   .subscribe((event: any[]) => {
    //     if (event[0].urlAfterRedirects == "/pantallaBuscadorColegiados") {
    //       sessionStorage.setItem("esBuscadorColegiados", "true");
    //     } else {
    //       sessionStorage.setItem("esBuscadorColegiados", "false");
    //     }
    //   });
  }
}
