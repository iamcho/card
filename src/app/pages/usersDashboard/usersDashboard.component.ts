import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-users-dashboard',
  templateUrl: './usersDashboard.component.html',
  styleUrls: ['./usersDashboard.component.scss'],
})
export class UsersDashboardComponent implements OnInit {
  public userListLoading = false;
  public userList: any = [];
  public yesterdayusernameList:any = [];
  public yesterdayspentList:any = [];
  public cardusernameList:any = [];
  public cardStatusList:any = [];
  public chargeList: any = [];
  public fromDate: any = '0';
  public toDate: any = '0';
  public yeaterdayTotal:any = '0';
  public chargesTotal:any = '0';
  public showTestBtn = false;
  public result: any = {};
  public canHidden = true;
  public chargeLoading = false;
  public showCharge = false;
  // public deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
  constructor(private message: NzMessageService, private http: HttpClient) { }

  ngOnInit() {
    const t = new Date();
    this.toDate = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0).getTime();
    this.getChargeDetail();
    this.getUserList();
  }
  /** 获取账单信息 */
  public getChargeDetail() {
    this.http
      .post('./assets/api/sql.php', {
        type: 'getChargeDetail',
      })
      .subscribe((data: any) => {
        if (data.success) {
          this.result = data.list[0];
          this.fromDate = this.result.lastUpdateTime;
          this.yeaterdayTotal = this.result.yeaterdayTotal;
          this.chargesTotal = this.result.chargesTotal;
          if ((this.toDate - 0) > (this.fromDate - 0)) {
            this.canHidden = false;
          } else {
            this.canHidden = true;
          }
        } else {
          this.message.create('error', data.message);
        }
      });
  }
  /** 获取所有用户 */
  public getUserList() {
    this.userListLoading = true;
    this.http
      .post('./assets/api/sql.php', {
        type: 'getUserList',
      })
      .subscribe((data: any) => {
        this.userListLoading = false;
        if (data.success) {
          this.userList = data.list;
          this.getYesterdaySpent();
          this.searchCardStatus();
        } else {
          this.message.create('error', data.message);
        }
      });
  }
  /** 获取昨日用户消费 */
  public getYesterdaySpent(){
    this.userListLoading = true;
    this.http
    .post('./assets/api/sql.php', {
      type: 'getYesterdaySpent',
    })
    .subscribe((data: any) => {
      this.userListLoading = false;
      if (data.success) {
        this.yesterdayusernameList = data.list.map(v=>v.username);
        this.yesterdayspentList = data.list.map(v=>v.yesterSpent);

      } else {
        this.message.create('error', data.message);
      }
    });
  }
  public getYesterdayByUsername(username:any){
    let index:any = this.yesterdayusernameList.indexOf(username);
    if(index>-1){
      return parseFloat(parseFloat(this.yesterdayspentList[index]).toFixed(2)).toLocaleString();
      
    }
    return 0;
  }
  public fixTotal(num) {
    const intNum: any = num - 0;
    return (intNum.toFixed(2) - 0).toLocaleString();
  }
  public timeFix(time: any) {
    const t = new Date(time - 0);
    const tt = `${t.getFullYear()}-${this.zero(t.getMonth() + 1)}-${this.zero(t.getDate())}
  ${this.zero(t.getHours())}:${this.zero(t.getMinutes())}:${this.zero(t.getSeconds())}`;
    return tt;
  }

  public zero(num: number) {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  }
  /** 更新时间 */
  public updateSet(ft: any, tt: any) {
    this.http
      .post('./assets/api/sql.php', {
        type: 'updateSet',
        data: {
          fromT: ft,
          yesterdayTo: tt,
        }
      })
      .subscribe((data: any) => {
        if (data.success) {
          this.fromDate = tt;
          if ((this.toDate - 0) > (this.fromDate - 0)) {
            this.canHidden = false;
          } else {
            this.canHidden = true;
          }
        }
      });
  }
  /** 获取订单 */
  public getCharge() {
    this.userListLoading = true;
    this.http
      .post('./assets/api/updateCharges.php', {
        // type: `charges?cardId=5912381307614154703&pageIndex=${pageIndex}&pageSize=${this.tradePage.pageSize}`,
        type: 'charges?',
        pageIndex: 0,
        pageSize: 100,
        fromDate: this.fromDate,
        toDate: this.toDate,
      })
      .subscribe((data: any) => {
        if (data.success) {
          this.message.create('success', data.message);
          this.getUserList();
          this.updateSet(this.fromDate, this.toDate);
        } else {
          this.userListLoading = false;
          this.message.create('error', data.message);
        }
      });
  }
  public getAllCharge(username: string) {
    this.showCharge = true;
    this.chargeLoading = true;
    this.http
      .post('./assets/api/sql.php', {
        type: 'getUserCharts',
        data: { username }
      })
      .subscribe((data: any) => {
        this.chargeLoading = false;
        if (data.success) {
          this.chargeList = data.list;
        } else {
          this.message.create('error', data.message);
        }
      });
  }
  public searchCardStatus() {
    this.http
      .post('./assets/api/sql.php', {
        type: 'searchCardStatusUser',
        data: { }
      })
      .subscribe((data: any) => {
        if (data.success) {
          this.cardusernameList = data.list.map(v=>v.username);
          this.cardStatusList = data.list.map(v=>{
            return `(正常:${v.ACTIVE}-暂停${v.SUSPENDED}-过期${v.EXPIRED}-注销${v.CANCELED})`
          });
        } else {
          this.message.create('error', data.message);
        }
      });
  }
  public getCardStatus(username: any){
    let index:any = this.cardusernameList.indexOf(username);
    if(index>-1){
      return this.cardStatusList[index];
      
    }
    return '';
  }
  time2local(unixTimestamp){
    if(unixTimestamp){
      return new Date(unixTimestamp-0).toLocaleString();
    }else{
      return '-'
    }
  }
}
