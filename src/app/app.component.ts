import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
// import { MenubarModule } from 'primeng/menubar';
// import { MenuItem } from 'primeng/api';
import { AuthenticationService } from './_services/authentication.service';
import { Router, ActivatedRoute, RouterStateSnapshot, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  @ViewChild('content')
  content: any;

  cookieValue = 'UNKNOWN';

  hideCookies: boolean = true;
  bottomCookies: string = "-100"




  scroll: boolean = false;
  isScrollReseteable: boolean = false;

  constructor(
    private autenticateService: AuthenticationService, private activatedRoute: ActivatedRoute, private router: Router, private cookieService: CookieService) {

  }

  ngOnInit() {

    // this.activatedRoute.data.subscribe((result: any) => {
    //   this.isScrollReseteable = result.scrollReset;
    //   console.log(result)
    // })

    this.subscribeNavigationEnd();

    if (sessionStorage.getItem('cookies') === 'true') {
      this.bottomCookies = "-100";
    } else {
      this.bottomCookies = "0";
      this.cookieService.set('Test', 'Utilizamos cookies propias y de analítica para mejorar tu experiencia de usuario. Si continúas navegando, consideramos que aceptas su uso.');
      this.cookieValue = this.cookieService.get('Test');
    }
  }

  subscribeNavigationEnd() {
    this.router
      .events
      .filter(e => e instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        if (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((e: any) => {
        this.isScrollReseteable = e.scrollReset;
      });
  }  // outputs my `data`


  isLogged() {
    return this.autenticateService.isAutenticated();
  }

  subirTop(e, content) {

    content.scrollTop = 0;
    if (content.scrollTop === 0) {
      setTimeout(() => {
        this.scroll = false;
      }, 2)
    }

  }


  // @HostListener("window:scroll", ['$event'])
  onWindowScroll(event, content) {
    if (this.isScrollReseteable) {
      this.scroll = true;
    }

    if (content.scrollTop === 0) {
      setTimeout(() => {
        this.scroll = false;
      }, 2)
    }

  }


  navigateTo() {
    this.router.navigate(['/politicaCookies']);
  }

  onHideCookies() {
    sessionStorage.setItem('cookies', 'true');
    this.bottomCookies = '-100';
  }
}