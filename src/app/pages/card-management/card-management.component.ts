import { HttpClient } from '@angular/common/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, OnInit , TemplateRef} from '@angular/core';
import * as Mock from 'mockjs';
@Component({
  selector: 'app-card-management',
  templateUrl: './card-management.component.html',
  styleUrls: ['./card-management.component.scss'],
})
export class CardManagementComponent implements OnInit {
  constructor(private message: NzMessageService, private http: HttpClient,
              public modalCtr: NzModalService) {}
  public searchTag = '';
  public tag = '';
  public cancreateCard = false; // 是否可以创建信用卡
  public cancreateCardMessage = '创建信用卡'; // 是否可以创建信用卡提醒信息
  public name = Mock.mock('@name').substr(0, 15);
  public creatCardLoading = false;
  public tradeListLoading = false;
  public tradeDate: any = [this.getDate(0), this.getDate(1)];
  public tradePage: any = {
    pageSize: 100,
    pageIndex: 1,
  };
  public showCardTradeDate = false;
  public allCardTradeDate: any = [this.getDate(0), this.getDate(1)];
  public cardListFliterSpent: any = []; // 信用卡列表找消费记录使用
  public cardStatus = '';
  public show = false;
  public newVisible = false;
  public updateTagVisible = false;
  public updateTaging = false;
  public updateTag = '';
  public updateCardId = '';
  public updateCardNum = '';
  public updatetemplateId = '';
  public updateDailylimit: any = 0;
  public dayTradeVisible = false;
  public dailylimit = 300;
  public spentType = 'todaySpent';
  public selectedCardList: any = []; // 选择卡列表
  public MCC = ['3501', '3503', '3504', '3509', '3512', '6545', '4582',
  '5962', '7011', '7012', '7033', '7841', '7911', '7932', '7941', '7991', '7994', '7995'];
  public originData: any = []; // 原始数据
  public dataList: any = [
  ]; // 搜索处理后的数据
  public tradeList: any = {};
  public cardListLoading = false;
  ngOnInit() {
    // if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) ) {
    //   // Safari
    //   // 时间控件有问题
    // } else {

    // }
    this.getCardsListLocal();
    this.checkInsertCardstatus();
  }
  /** 获取卡列表 */
  // public getCardsList() {
  //   this.cardListLoading = true;
  //   this.http
  //     .post('./assets/api/api.php', {
  //       type: 'cards',
  //       http: 'get'
  //     })
  //     .subscribe((data: any) => {
  //       this.cardListLoading = false;
  //       data.items.forEach(v => {
  //         v.willdeleteinday = this.timeFix(v.expirationDate);
  //         v.name = v.description;
  //       });
  //       this.originData = data.items;
  //       this.dataList = [].concat(this.originData);
  //     });
  // }

    /** 获取本地卡列表 */
    public getCardsListLocal() {
      this.cardListLoading = true;
      this.http
        .post('./assets/api/sql.php', {
          type: 'getCardsListLocal',
        })
        .subscribe((data: any) => {
          this.cardListLoading = false;
          if (data.success) {
            this.selectedCardList = [];
            const cardListFliterSpent = [];
            data.list.forEach(v => {
              v.willdeleteinday = this.timeFix(v.willdeleteinday - 0);
              v.todaySpent = 0;
              cardListFliterSpent.push(v.cardId);
            });
            this.originData = data.list;
            this.cardListFliterSpent = cardListFliterSpent;
            this.dataList = [].concat(this.originData);

                      // 获取100条消费记录
            this.getAllCarSpent('todaySpent');
                      // 首页信用卡加上日消费数据
          } else {
            this.message.create('error', data.message);
          }
        });
    }
    /** 获取所有卡周期100条消费记录 */
    public getAllCarSpent(type: string) {
      this.tradePage.pageSize = 100;
      this.spentType = type;
      this.dataList.forEach(v => {
        v.todaySpent = 0;
      });
      if (type === 'todaySpent') {
        this.allCardTradeDate = [this.getDate(0), this.getDate(1)];
        this.tradeDate = [this.getDate(0), this.getDate(1)];
      }
      if (type === 'weekSpent') {
        this.allCardTradeDate = [this.getFirstDayOfWeek(), this.getDate(1)];
        this.tradeDate = [this.getFirstDayOfWeek(), this.getDate(1)];
      }
      if (type === 'monthSpent') {
        this.allCardTradeDate = [this.getFirstDayOfMonth(), this.getDate(1)];
        this.tradeDate = [this.getFirstDayOfMonth(), this.getDate(1)];
      }
      if (type === 'diyTimeSpent') {
          // 自定义查询日期开启
          const allCardTradeDate = this.allCardTradeDate;
          const tradeDate = [null, null];
          if (allCardTradeDate && allCardTradeDate[0]) {
                tradeDate[0] = this.timeFix(allCardTradeDate[0]);
              }
          if (allCardTradeDate && allCardTradeDate[1]) {
                tradeDate[1] = this.timeFix(allCardTradeDate[1]);
              }
          this.tradeDate = [tradeDate[0], tradeDate[1]];
      }
      this.dayTradeFun(0, 'init', true);
    }
  /** 获取卡 详情 */
  public getCardDetails(card: any) {
    this.cardListLoading = true;
    this.http
    .post('./assets/api/api.php', {
      type: 'cards/' + card.id,
      http: 'get'
    })
    .subscribe((data: any) => {
      this.cardListLoading = false;
      card.cardDetails = data.cardDetails;
    });
  }
  /** 操作卡 */
  public actionCard(type: string, card: any, newStatus: string) {
    this.modalCtr.confirm({
      nzTitle: '<i>确定 ' + type + ' 此信用卡?</i>',
      nzContent: '<b>cardId:  ' + card.cardId + '</b><br><b>cardNum:  ' + card.cardNum + '</b>',
      nzOnOk: () => {
        this.cardListLoading = true;
        this.http
        .post('./assets/api/api.php', {
          type: 'cards/' + card.cardId + '/' + type,
          http: 'post'
        })
        .subscribe((data: any) => {
          if (data && data.message) {
            this.cardListLoading = false;
            this.message.create('error', data.message);
          } else {
            // card.status = newStatus;
            this.actionCardLocal(type, card, newStatus);
          }
        });
      },
      nzOkText: '确定',
      nzOnCancel: () => console.log('Cancel'),
      nzCancelText: '取消',
    });
  }
  /** 同步操作卡 */
  public actionCardLocal(type: string, card: any, newStatus: string) {
    this.http
    .post('./assets/api/sql.php', {
      type: 'actionCard',
      data: {type, cardId: card.cardId, newStatus}
    })
    .subscribe((data: any) => {
      this.cardListLoading = false;
      if (data.success) {
        this.message.create('success', data.message);
        card.cardStatus = newStatus;
      } else {
        this.message.create('error', data.message);
      }
    });
  }
  public timeFix(time: any) {
    const t = new Date(time);
    const tt =  `${t.getFullYear()}-${this.zero(t.getMonth() + 1)}-${this.zero(t.getDate())}
    ${this.zero(t.getHours())}:${this.zero(t.getMinutes())}:${this.zero(t.getSeconds())}`;
    return tt;
  }
  public timeFixx(t: any) {
    return  `${t.getFullYear()}-${this.zero(t.getMonth() + 1)}-${this.zero(t.getDate())} 00:00`;
  }
   // 获取这周的周一
  public getFirstDayOfWeek() {
    const date = new Date();
    const weekday = date.getDay() || 7;
    date.setDate(date.getDate() - weekday + 1);
    return this.timeFixx(date);
   }

  // 获取当月第一天
 public getFirstDayOfMonth() {
  const date = new Date();
  date.setDate(1);
  return this.timeFixx(date);
  }

  public getDate(num: number) {
    const now = new Date();
    const t = new Date(new Date(now).getTime() + 86400000 * num);
    // return new Date(t.getFullYear(), t.getMonth() + 1, t.getDate(), 0, 0, 0 ) ; safari 只支持这个
    return `${t.getFullYear()}-${this.zero(t.getMonth() + 1)}-${this.zero(t.getDate())} 00:00`;
  }
  public zero(num: number) {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  }
  /** 检测是否可以创建卡 */
  public checkInsertCardstatus() {
    this.http
    .post('./assets/api/sql.php', {
      type: 'checkInsertCardstatus',
      })
    .subscribe((data: any) => {
      this.cancreateCard = data.success;
      this.cancreateCardMessage = data.message;
    });
  }
  /** 创建 卡 一卡一商户模板 */
  public creatCardLoadOk() {
    this.creatCardLoading = true;
    const mcc = this.MCC[ Math.ceil(Math.random() * 17)];
    const tag = this.tag.replace(/	/g, '');
    const params = {
      symbol: 'USD',
      description: this.name,
      expirationInHours: 24 * 365,
      acceptedCurrencies: 'ALL',
      // nameOnCard: this.name,
      limitationTemplate: {
        name: this.name,
        description: tag,
        windowLimitations: [
          {
            merchantScope_type: 'MCC',
            merchantScope_values: [mcc],
            window: 'DAY',
            amountLimit: this.dailylimit === 0 ? '' : this.dailylimit,
            nonStrict: true
          }
        ],
        chargeLimitations: [
          {
            merchantScope_type: 'MCC',
            merchantScope_values: [mcc],
            min: 0,
            max: 999
          }
        ]
      }
    };
    this.http
    .post('./assets/api/insertCard.php', {
      type: 'cards',
      data:  params
      })
    .subscribe((data: any) => {
      // this.creatCardLoading = false;
      if (data.id) {
        this.insertCard(params, data);
      } else {
        this.creatCardLoading = false;
        this.message.create('error', data.message);
      }
    });
  }
  /** 同步插入卡 */
  public insertCard(postParams: any, getParams: any) {
    const query = Object.assign({}, {
      dailylimit: postParams.limitationTemplate.windowLimitations[0].amountLimit,
      tag: postParams.limitationTemplate.description,
      templateJson: JSON.stringify(postParams.limitationTemplate)
    }, getParams);
    this.http
    .post('./assets/api/sql.php', {
      type: 'insertCard',
      data: query
      })
    .subscribe((data: any) => {
      this.creatCardLoading = false;
      this.newVisible = false;
      if (data.success) {
        this.message.create('success', data.message);
        if ((getParams.cardsHasOpend - 0) < (getParams.cardsNumLimit - 0)) {
         this.cancreateCard = true;
         this.cancreateCardMessage = '还能创建 ' + ((getParams.cardsNumLimit - 0) - (getParams.cardsHasOpend - 0)) + ' 张信用卡';
        } else {
        this.cancreateCard = false;
        this.cancreateCardMessage = '数量超过限制，请联系管理员';
        }

        this.creatCardLoadCancel();
        this.getCardsListLocal();
      } else {
        this.message.create('error', data.message);
      }
    });
  }
  public creatCardLoadCancel() {
    this.tag = '';
    this.name = Mock.mock('@name').substr(0, 15);
    this.dailylimit = 300;
    this.newVisible = false;
  }
  /** 编辑卡 */
  public updateTagOk(card: any) {
    this.updateTaging = true;
    this.http
    .post('./assets/api/sql.php', {
      type: 'updateTag',
      data: {updateTag: this.updateTag, cardId: card}
      })
    .subscribe((data: any) => {
      this.updateTaging = false;
      if (data.success) {
        this.getCardsListLocal();
        this.updateTagVisible = false;
        this.message.create('success', data.message);
      } else {
        this.message.create('error', data.message);
      }
    });

  }
  /** 同步编辑本地卡 */
public updateTagOkLocal() {}
  public updateTagCancel() {
    this.updateTagVisible = false;
    this.updateTag = '';
  }
  /** 编辑商户tag和dailylimit */
  public editCardTag(card: any, updateTagModal: TemplateRef<{}>) {
    const cardObj = Object.assign({}, card);
    this.updateTag = cardObj.tag;
    this.updateDailylimit = cardObj.dailylimit;
    this.updateCardId = cardObj.cardId;
    this.updateCardNum = cardObj.cardNum;
    this.updatetemplateId = cardObj.templateId;
    const editCardTagModal = this.modalCtr.create({
      nzTitle: '编辑Tag和Dailylimit',
      nzClassName: 'createCardModal',
      nzContent: updateTagModal,
      nzMaskClosable: false,
      nzFooter: [
        {
          label: '取消',
          onClick: () => {
            editCardTagModal.close();
          },
        },
        {
          label: '确定',
          disabled: () => {
            if (!this.updateTag || this.updateDailylimit === '') {
              return true;
            } else {
              return false;
            }
          },
          autoLoading: true,
          onClick: () => new Promise((resolve) => {
            const templateObj = JSON.parse(cardObj.templateJson);
            templateObj.description = this.updateTag;
            templateObj.windowLimitations[0].amountLimit = this.updateDailylimit - 0;
            // 修改商户达到修改tag和dailyLimit
            this.http
            .post('./assets/api/api.php', {
              type: 'limitationsTemplates/' + cardObj.templateId,
              http: 'put',
              data:  templateObj
              })
            .subscribe((data: any) => {
              if (data.id) {
                // 第三方修改成功，再来修改本地local
                this.http
                .post('./assets/api/sql.php', {
                  type: 'updateTemplate',
                  data: {
                    updateTag: this.updateTag,
                     updateDailylimit: this.updateDailylimit,
                     templateId: cardObj.templateId,
                     templateJson: JSON.stringify(templateObj)
                    }
                  })
                .subscribe((dataa: any) => {
                  resolve(true);
                  this.updateTagVisible = false;
                  if (dataa.success) {
                    card.tag = this.updateTag;
                    card.dailylimit = this.updateDailylimit;
                    this.message.create('success', dataa.message);
                  } else {
                    this.message.create('error', dataa.message);
                  }
                });
                editCardTagModal.close();
              } else {
                resolve(true);
                this.message.create('error', data.message);
              }
            });
          })
        }
      ],
    });
  }
  /** 选择卡 */
  public selectedCard(card: any) {
    if (card.selected) {
      this.selectedCardList.push(card.cardId);
    } else {
      this.selectedCardList.splice(this.selectedCardList.indexOf(card.cardId), 1);
    }

  }
  /** 查看信用卡流水 */
  public  dayTradeFun(num, type, needReturn?: any) {
    const quarms = [];
    if (this.selectedCardList.length === 1) {
      quarms.push('cardId=' + this.selectedCardList[0]);
    }
    const tradeDate = this.tradeDate;
    if (tradeDate && tradeDate[0]) {
      quarms.push('fromDate=' + new Date(tradeDate[0]).getTime());
    }
    if (tradeDate && tradeDate[1]) {
      quarms.push('toDate=' + new Date(tradeDate[1]).getTime());
    }
    if (type === 'init') {
      this.tradePage.pageIndex = 1;
    }
    if (type === 'index') {
      this.tradePage.pageIndex = num;
    }
    if (type === 'size') {
      this.tradePage.pageIndex = 1;
      this.tradePage.pageSize = num;
    }
    this.tradeListLoading = true;
    const pageIndex =   (this.tradePage.pageIndex - 1) * this.tradePage.pageSize; // mesh 翻页码
    quarms.push('pageIndex=' + pageIndex);
    quarms.push('pageSize=' + this.tradePage.pageSize);
    this.http
    .post('./assets/api/api.php', {
      // type: `charges?cardId=5912381307614154703&pageIndex=${pageIndex}&pageSize=${this.tradePage.pageSize}`,
      type: 'charges?' + quarms.join('&'),
      http: 'get'
    })
    .subscribe((data: any) => {
      this.tradeListLoading = false;
      if (needReturn) {
        //  首页信用卡加上日消费数据
        const cardListFliterSpent = this.cardListFliterSpent;
        data.items.forEach(v => {
          const cardId = v.cardId;
          const amount = v.balanceAmount;
          const indexOf = cardListFliterSpent.indexOf(cardId);
          if (indexOf > -1) {
            this.dataList[indexOf].todaySpent += amount;
          }

        });
        return data;
      }
      const amountTotal: any = {
        symbolType: [],
      };
      data.items.forEach(v => {
        v.createdDate = this.timeFix(v.createdDate);
        // const symbol = v.symbol;
        const symbol = 'USD';
        const amount = v.balanceAmount;
        if (amountTotal.symbolType.indexOf(symbol) < 0) {
          amountTotal.symbolType.push(symbol);
          amountTotal[symbol] = amount;
        } else {
          amountTotal[symbol] += amount;
        }
      });
      data.amountTotal = amountTotal;
      this.tradeList = data;
    });
  }
  public fixTotal(num) {
    return (num.toFixed(2) - 0).toLocaleString();
  }
  /** 流水查询 */
  public tradeListSearch(event) {
    this.tradeDate = [this.timeFix(event[0]), this.timeFix(event[1])];
    this.dayTradeFun(0, 'init');

  }
  public setTradeDate(type: string) {
    if (type === 'all') {
      this.tradeDate = null;
    }
    if (type === 'today') {
      this.tradeDate = [this.getDate(0), this.getDate(1)];
    }
    if (type === 'week') {
      this.tradeDate = [this.getFirstDayOfWeek(), this.getDate(1)];
    }
    if (type === 'month') {
      this.tradeDate = [this.getFirstDayOfMonth(), this.getDate(1)];
    }
    this.dayTradeFun(0, 'init');
  }
  public search() {
    const cardStatus = this.cardStatus;
    const tag = this.searchTag;
    let dateList = [];
    let fliterStatusList = [];
    if (cardStatus) {
      this.originData.forEach(v => {
        if ((cardStatus && v.cardStatus === cardStatus) ) {
          fliterStatusList.push(v);
        }
      });
    } else {
      fliterStatusList = [].concat(this.originData);
    }
    if (tag) {
      fliterStatusList.forEach(v => {
        if ((v.cardNum && v.cardNum.indexOf(tag) > -1) ||
        (v.tag && v.tag.indexOf(tag) > -1)) {
          dateList.push(v);
       }
      });
    } else {
        dateList = fliterStatusList;
    }
    this.dataList = dateList;
  }
}
