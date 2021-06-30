import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  constructor(private message: NzMessageService, private http: HttpClient, public modalCtr: NzModalService) {}
  isCollapsed = false;
  public loginModalvisible = false;
  public createUserModalvisible = false;
  public updateUserModalvisible = false;
  public updateMoneyModalvisible = false;
  public changePsdModalvisible = false;

  public loginLoading = false;
  public createLoading = false;
  public changePsdLoading = false;
  public username = 'hiswift';
  public isLogin = false;
  public updateLoading = false;
  public updateMoneyLoading = false;


  public isAdmin = false;
  public isLoginNm = '';
  public password = 'hiswift';

  public usr = '';
  public pwd = '';
  public pwd2 = '';
  public host = 'https://integrations.meshpayments.com';
  public keyy = '';
  public secret = '';

  public oldPwd = '';
  public changePwd = '';
  public changePwd2 = '';

  public maxMoney = 500;
  public updateMoney = 500;

  public updateUsr = '';
  public updatecardNum = 0;
  public showCount = true;
  public deadline:any;

  ngOnInit(): void {
    // this.getBJtime();
    this.getStatus();
  }
  public getBJtime(){
    const timezone = 8; //目标时区时间，东八区
    const offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
    const nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    const targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    const now = "现在北京时间：" + targetDate;
    return targetDate;
  }
  // public countdownFinish() {
  //   console.error(this.showCount);
  //   this.showCount = false;
  //   console.error(this.showCount);

  // }
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
          // keyy: this.keyy,
          // secret: this.secret,
          maxMoney: this.maxMoney
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
  /** 修改密码 */
  public changePsdOk(){
    if (this.changePwd2 !== this.changePwd) {
      this.message.create('error', '请确认新密码是否一致');
      return;
    }
    this.changePsdLoading = true;
    this.http
      .post('./assets/api/sql.php', {
        type: 'changePsd',
        data: {
          oldPwd: this.oldPwd.replace(/	/g, ''),
          changePwd: this.changePwd.replace(/	/g, ''),
          isLoginNm:this.isLoginNm
        }
      })
      .subscribe((data: any) => {
        this.changePsdLoading = false;
        if (data.success) {
          this.changePsdModalvisible = false;
          this.message.create('success', data.message);
          this.logout();
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
    /** 充值金额 */
    public updateMaxMoney() {
      this.updateMoneyLoading = true;
      this.http
        .post('./assets/api/sql.php', {
          type: 'updateMoney',
          data: {
            updateUsr: this.updateUsr,
            updateMoney: this.updateMoney - 0,
          }
        })
        .subscribe((data: any) => {
          this.updateMoneyLoading = false;
          if (data.success) {
            this.updateMoneyModalvisible = false;
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
    /** 获取用户余额 */
    public getMaxMoney() {
      this.updateMoneyLoading = true;
      this.http
        .post('./assets/api/sql.php', {
          type: 'getMaxMoney',
          data: {
            updateUsr: this.updateUsr,
          }
        })
        .subscribe((data: any) => {
          this.updateMoneyLoading = false;
          if (data.success) {
            this.message.create('success', data.message);
          } else {
            this.message.create('error', data.message);
          }
        });
    }
}
