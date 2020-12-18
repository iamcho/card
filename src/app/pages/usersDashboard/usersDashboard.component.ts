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
  public fromDate = '0';
  public toDate = '0';
  public showTestBtn = false;
  public result: any = {};
  constructor(private message: NzMessageService, private http: HttpClient) {}

  ngOnInit() {
    const show = localStorage.getItem('admin');
    if (show && show === 'admin') {
      this.showTestBtn = true;
    }
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
  const  intNum: any = num - 0;
  return (intNum.toFixed(2) - 0).toLocaleString();
}
public timeFix(time: any) {
  const t = new Date(time - 0);
  const tt =  `${t.getFullYear()}-${this.zero(t.getMonth() + 1)}-${this.zero(t.getDate())}
  ${this.zero(t.getHours())}:${this.zero(t.getMinutes())}:${this.zero(t.getSeconds())}`;
  return tt;
}

public zero(num: number) {
  if (num < 10) {
    return '0' + num;
  }
  return num;
}
// public getChargeRepot() {
//   const quarms = [];
//   // quarms.push('fromDate=' + new Date().getTime());
//   // quarms.push('toDate=' + new Date().getTime());
//   quarms.push('pageIndex=' + this.pageIndex);
//   quarms.push('pageSize=' + this.pageSize);
//   this.http
//   .post('./assets/api/api.php', {
//     // type: `charges?cardId=5912381307614154703&pageIndex=${pageIndex}&pageSize=${this.tradePage.pageSize}`,
//     type: 'charges?' + quarms.join('&'),
//     http: 'get'
//   })
//   .subscribe((data: any) => {
//     this.userListLoading = false;
//     console.error(data);
// });
// }
/** 获取订单 */
public getCharge() {
  console.log('getCharge');
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
    this.userListLoading = false;
    console.error(data);
});
}
}
