import { HostListener, Input, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
@Component({
  selector: 'app-ficha',
  templateUrl: './ficha.component.html',
  styleUrls: ['./ficha.component.scss']
})
export class FichaComponent implements OnInit {
  @Input() rutas;
  @Input() tarjetaFija;
  @Input() listaTarjetas;
  
  stickyElementoffset = 0;
  scrollOffset = 0;
  enableSticky = false;
  navbarHeight = 0;
  scrollWidth = 0;
  
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('parent') private parent: ElementRef;
  @ViewChild('navbar') private navbarElement: ElementRef;
  @ViewChild('content') private content: ElementRef;
  @ViewChild('main') private main: ElementRef;

  constructor(private renderer: Renderer2) { };

  ngOnInit() {

  }
  ngAfterViewInit() {
    this.stickyElementoffset = this.navbarElement.nativeElement.getBoundingClientRect().top;
    console.log("offset navbar: " + this.stickyElementoffset);
    this.navbarHeight = this.navbarElement.nativeElement.clientHeight;
    console.log("height navbar: ", this.navbarHeight);
    this.scrollWidth = this.main.nativeElement.clientHeight - this.parent.nativeElement.clientHeight;
    console.log("scrollWidth: ", this.scrollWidth);
  }

  @HostListener("scroll", ['$event'])
  manageScroll($event: Event, navbar) {
    this.scrollOffset = $event.srcElement['scrollTop'];
    console.log("scroll top: ", this.scrollOffset);
    this.setSticky();
  }

  setSticky() {
    if (this.scrollOffset >= this.stickyElementoffset) {
      this.enableSticky = true;
      this.renderer.setStyle(this.content.nativeElement, "padding-top", this.navbarHeight + "px");
      this.renderer.setStyle(this.navbarElement.nativeElement, "right", this.scrollWidth + "px");
    } else {
      this.enableSticky = false;
      this.renderer.setStyle(this.content.nativeElement, "padding-top", "0px");
      this.renderer.setStyle(this.navbarElement.nativeElement, "right", this.scrollWidth + "px");
    }
  }
}
