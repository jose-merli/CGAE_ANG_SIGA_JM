import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { TarjetaDatosCurricularesComponent } from './tarjta-datos-curriculares/tarjeta-datos-curriculares.component';

@Component({
  selector: 'app-carga-masiva-procuradores',
  templateUrl: './carga-masiva-procuradores.component.html',
  styleUrls: ['./carga-masiva-procuradores.component.scss']
})
export class CargaMasivaProcuradoresComponent implements OnInit {

  msgs;
  progressSpinner: boolean = false;
  @ViewChild(TarjetaDatosCurricularesComponent) ficheroModelo;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
  }

	clear() {
		this.msgs = [];
	}

}
