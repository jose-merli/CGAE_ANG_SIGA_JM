import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SigaServices } from '../../_services/siga.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuUser: any = [];
  menuHide: boolean;

  constructor(private router: Router, private sigaServices: SigaServices) { }

  ngOnInit() {

    this.menuHide = true;

    this.sigaServices.get("usuario_logeado").subscribe(n => {
      this.menuUser = n.usuarioLogeadoItem;
    });
    /*this.menuUser = [
      {
        nombre: 'Usuario1',
        dni: '92938293',
        grupo: '',
        institucion: 'Consejo General de la Abogacía Española',
        idioma: 'Español',
        ultimaConex: '16:30 | 22/02/2018'
      },

    ]*/
  }

  isMenuVisible() {
    this.menuHide = !this.menuHide;
  }

  logout() {
    sessionStorage.removeItem('authenticated')
    this.router.navigate(['/login']);
  }

}
