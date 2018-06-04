import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
// import { MenubarModule } from 'primeng/menubar';
// import { MenuItem } from 'primeng/api';
import { AuthenticationService } from './_services/authentication.service';
import { Router, ActivatedRoute, RouterStateSnapshot, NavigationEnd } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  @ViewChild('content')
  content: any;




  scroll: boolean = false;
  isScrollReseteable: boolean = false;

  constructor(
    private autenticateService: AuthenticationService, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {

    // this.activatedRoute.data.subscribe((result: any) => {
    //   this.isScrollReseteable = result.scrollReset;
    //   console.log(result)
    // })

    this.subscribeNavigationEnd()
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
        console.log(this.isScrollReseteable)
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
}