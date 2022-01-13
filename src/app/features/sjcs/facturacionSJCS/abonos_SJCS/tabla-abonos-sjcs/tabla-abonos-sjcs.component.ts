import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from 'primeng/primeng';
import { PersistenceService } from '../../../../../_services/persistence.service';



@Component({
  selector: 'app-tabla-abonos-sjcs',
  templateUrl: './tabla-abonos-sjcs.component.html',
  styleUrls: ['./tabla-abonos-sjcs.component.scss'],

})
export class TablaAbonosSCJSComponent implements OnInit {


  constructor( private changeDetectorRef: ChangeDetectorRef, private router: Router, private persistenceService: PersistenceService) { }

  ngOnInit() {

  }



}
