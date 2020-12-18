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
    symbol: 'USD',
    yesterdaySpent: 0,
    totalSpent: 0
  };
  public cardsHasOpend = 0;
  public cardsNumLimit = 100;
  public noLogin = true;
  ngOnInit() {
    this.getData();
  }
  public getData() {
    this.http
      .post('./assets/api/get.php', {})
      .subscribe((data: any) => {
        if (data.isLogin) {
          this.cardsNumLimit = data.cardsNumLimit;
          this.cardsHasOpend = data.cardsHasOpend;
          this.balances.yesterdaySpent = data.yesterdaySpent;
          this.balances.totalSpent = data.totalSpent;
          this.balances.availableAmount = data.maxMoney;
        }
      });
  }

}
