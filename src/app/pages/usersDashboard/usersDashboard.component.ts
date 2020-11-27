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
  public userChargesUpdateTime = '2020/01/01 12:30:00';
  public userList: any = [];
  constructor(private message: NzMessageService, private http: HttpClient) {}

  ngOnInit() {
    this.getUserList();
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
}
