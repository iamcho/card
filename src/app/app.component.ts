import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;
  public loginModalvisible = false;
  public createUserModalvisible = false;
  public updateUserModalvisible = false;
  public loginLoading = false;
  public createLoading = false;
  public username = 'hiswift';
  public isLogin = false;
  public updateLoading = false;
  public isAdmin = false;
  public isLoginNm = '';
  public password = 'hiswift';

  public usr = '';
  public pwd = '';
  public pwd2 = '';
  public host = 'https://integrations.meshpayments.com';
  public keyy = '';
  public secret = '';



  public updateUsr = '';
  public updatecardNum = 0;


  constructor(private message: NzMessageService, private http: HttpClient, public modalCtr: NzModalService) {}

  ngOnInit(): void {
    this.getStatus();
  }
  public login() {
    this.loginLoading = true;
    this.http
    .post('./assets/api/login.php', {
      data: {username: this.username, password: this.password}
    })
    .subscribe((data: any) => {
      if (data.success) {
        this.message.create('success', data.message);
        window.location.reload();
        // this.username = '';
        // this.password = '';
        // this.loginModalvisible = false;
        // this.getStatus();
      } else {

        this.loginLoading = false;
        this.message.create('error', data.message);
      }
    });
  }
  public logout() {
    this.http
    .post('./assets/api/logout.php', {})
    .subscribe(() => {
      this.username = '';
      this.password = '';
      this.isLoginNm = '';
      this.isLogin = false;
      this.isAdmin = false;
      this.message.create('success', '退出成功');
    });
  }
  /** 添加用户 */
  public addUser() {
    if (this.pwd !== this.pwd2) {
      this.message.create('error', '请确认密码');
      return;
    }
    this.createLoading = true;
    this.http
      .post('./assets/api/sql.php', {
        type: 'addUser',
        data: {
          usr: this.usr,
          pwd: this.pwd,
          host : this.host,
          keyy: this.keyy,
          secret: this.secret,
        }
      })
      .subscribe((data: any) => {
        this.createLoading = false;
        if (data.success) {
          this.createUserModalvisible = false;
          this.message.create('success', data.message);
        } else {
          this.message.create('error', data.message);
        }
      });
  }
    /** 获取用户 */
    public getStatus() {
      this.http
        .post('./assets/api/get.php', {})
        .subscribe((data: any) => {
          if (data.isLogin) {
          this.isLoginNm = data.username;
          this.isLogin = data.isLogin;
          this.isAdmin = data.isAdmin;
         } else {
          this.message.create('error', '请先登录');
         }
        });
    }
    /** 更新用户 */
    public updateUser() {
      this.updateLoading = true;
      this.http
        .post('./assets/api/sql.php', {
          type: 'updateUser',
          data: {
            updateUsr: this.updateUsr,
            updatecardNum: this.updatecardNum,
          }
        })
        .subscribe((data: any) => {
          this.updateLoading = false;
          if (data.success) {
            this.updateUserModalvisible = false;
            this.message.create('success', data.message);
          } else {
            this.message.create('error', data.message);
          }
        });
    }
    /** 获取用户信息 */
    public getUserCounts() {
      this.updateLoading = true;
      this.http
        .post('./assets/api/sql.php', {
          type: 'getUserCounts',
          data: {
            updateUsr: this.updateUsr,
          }
        })
        .subscribe((data: any) => {
          this.updateLoading = false;
          if (data.success) {
            this.updatecardNum = data.cardsNumLimit;
            this.message.create('success', data.message);
          } else {
            this.message.create('error', data.message);
          }
        });
    }
}