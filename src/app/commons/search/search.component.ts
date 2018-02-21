import { Component } from '@angular/core';
import { TestService } from '../../_services/test.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  respuestaServidor;
  name: string = "";
  lastName: string = "";
  address: string = "";
  constructor(
    private _testService: TestService) {

  }

  getTestServletForm() {
    if (this.name != "") {
      this.getTestServletByName();
    } else {
      this.getTestServlet();
    }

  }

  getTestServlet() {
    this._testService.getTestServlet().subscribe(res => {
      this.respuestaServidor = res;
    })
  }

  getTestServletByName() {
    this._testService.getTestServletByName(this.name).subscribe(res => {
      this.respuestaServidor = res;
    })
  }

  getTestServletByForm() {
    this._testService.getTestServletByForm(this.name, this.lastName, this.address).subscribe(res => {
      this.respuestaServidor = res;
    })
  }

}
