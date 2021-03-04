import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-asistencia-expres',
  templateUrl: './asistencia-expres.component.html',
  styleUrls: ['./asistencia-expres.component.scss']
})
export class AsistenciaExpresComponent implements OnInit {
  msgs: Message[] = [];
  show = false;
  cFormValidity = true;
  modoBusqueda = 'b';
  rutas: string[] = ['SJCS', 'Guardia', 'Asistencias'];
  radios = [
    { label: 'Búsqueda de Asistencias', value: 'a' },
    { label: 'Asistencia Exprés', value: 'b' }
  ];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.queryParamMap.get('searchMode') != null &&
      this.activatedRoute.snapshot.queryParamMap.get('searchMode') != undefined
      && this.activatedRoute.snapshot.queryParamMap.get('searchMode') != ''
      && this.activatedRoute.snapshot.queryParamMap.get('searchMode') == 'a') {

      this.modoBusqueda = 'a';

    }
  }
  showResponse() {
    this.show = true;
  }
  hideResponse() {
    this.show = false;
  }
  saveForm($event) {
    this.cFormValidity = $event;
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  isDisabled() {
    return this.modoBusqueda == 'a';
  }

}
