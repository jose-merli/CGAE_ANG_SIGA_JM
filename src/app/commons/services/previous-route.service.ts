import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class PreviousRouteService {

  public previousUrl: BehaviorSubject<string>;

  private currentUrl: string;

  constructor(private router: Router) {

    this.currentUrl = this.router.url;
    this.previousUrl = new BehaviorSubject(null);

    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.previousUrl.next(this.currentUrl);
        this.currentUrl = event.urlAfterRedirects;
      });

  }

}

