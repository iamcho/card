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
  public chargeList: any = [];
  public fromDate: any = '0';
  public toDate: any = '0';
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
        } else {
          this.message.create('error', data.message);
        }
      });
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
  public destory(username: string) {
    this.message.create('error', '开发中');
    return;
    this.http
      .post('./assets/api/sql.php', {
        type: 'destoryUser',
        data: { username }
      })
      .subscribe((data: any) => {
        // if (data.success) {
        //   this.chargeList = data.list;
        // } else {
        //   this.message.create('error', data.message);
        // }
      });
  }
  time2local(unixTimestamp){
    if(unixTimestamp){
      return new Date(unixTimestamp).toLocaleString();
    }else{
      return '-'
    }
  }
}
