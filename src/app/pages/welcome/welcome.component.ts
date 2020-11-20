import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(private http: HttpClient) {}
  public balances: any = {
    availableAmount: 0,
    symbol: 'USD'
  };
  public cardsHasOpend = 0;
  public cardsNumLimit = 100;
  public noLogin = true;
  ngOnInit() {
    this.getData();
    this.getData3();
  }
  public getData() {
    this.http
      .post('./assets/api/get.php', {})
      .subscribe((data: any) => {
        if (data.isLogin) {
          this.cardsNumLimit = data.cardsNumLimit;
          this.cardsHasOpend = data.cardsHasOpend;
        }
      });
  }
  public getData3() {
    this.http
      .post('./assets/api/api.php', {
        type: 'balances/default',
        http: 'get'
      })
      .subscribe((data: any) => {
        if (data.symbol) {this.balances = data; }
      });
  }
}
