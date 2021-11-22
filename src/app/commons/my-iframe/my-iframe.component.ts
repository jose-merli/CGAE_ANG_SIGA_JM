import {
  Component,
  OnInit,
  AfterViewInit,
  Pipe,
  PipeTransform
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Input } from "@angular/core";
import { OldSigaServices } from "../../_services/oldSiga.service";
// import '../../../../SIGA.js'

declare var ajusteAlto: any;

@Component({
  selector: "app-my-iframe",
  templateUrl: "./my-iframe.component.html",
  styleUrls: ["./my-iframe.component.scss"]
})
export class MyIframeComponent implements OnInit, AfterViewInit {
  @Input() url;
  // @ViewChild('iframe') iframe: ElementRef;

  // loading = true;

  constructor(
    private service: OldSigaServices
  ) {}

  ngOnInit() {

    //ajusteAlto('mainWorkArea');
    // this.service.get(this.url).subscribe(blob => {
    //   // this.loading = false;
    //   this.iframe.nativeElement.src = blob;
    // });
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }
}


@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}