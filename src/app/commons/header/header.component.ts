import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuUser: any = [];
  menuHide: boolean;

  constructor(private router: Router) { }

  ngOnInit() {

    this.menuHide = true;

    this.menuUser = [
      {
        nombre: 'Usuario1',
        dni: '92938293',
        grupo: '',
        institucion: 'Consejo General de la Abogacía Española',
        idioma: 'Español',
        ultimaConex: '16:30 | 22/02/2018'
      },

    ]
  }

  isMenuVisible() {
    this.menuHide = !this.menuHide;
  }

  logout() {
    sessionStorage.removeItem('authenticated')
    this.router.navigate(['/login']);
  }

}
