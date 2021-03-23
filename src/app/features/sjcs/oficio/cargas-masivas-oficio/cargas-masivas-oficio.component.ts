import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { Message, SelectItem } from 'primeng/api';

@Component({
  selector: 'app-cargas-masivas-oficio',
  templateUrl: './cargas-masivas-oficio.component.html',
  styleUrls: ['./cargas-masivas-oficio.component.scss']
})
export class CargasMasivasOficioComponent implements OnInit {
  msgs: Message[] = [];
  progressSpinner: boolean = false;
  
  showCargasMasivas = false;
  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
  }

  onChange(event) {
  }
  
	clear() {
		this.msgs = [];
	}
}
