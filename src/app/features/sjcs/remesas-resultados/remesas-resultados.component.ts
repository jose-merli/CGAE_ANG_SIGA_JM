import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-remesas-resultados',
  templateUrl: './remesas-resultados.component.html',
  styleUrls: ['./remesas-resultados.component.scss']
})
export class RemesasResultadosComponent implements OnInit {

  ngOnInit() { }

  search(){
    alert("boton buscar clicado");
  }

}