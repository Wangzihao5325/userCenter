import React, { Component } from 'react';
import './App.css';
import bannerImage from './image/banner.png';
import avater from './image/avater.png';
import vip from './image/vip.png';

import fourG from './image/4g.png';
import custom from './image/custom.png';
import global from './image/global.png';
import mobile from './image/mobile.png';
import wifi from './image/wifi.png';
const IconList = [
  { img: mobile, title: '全球国际专线' },
  { img: wifi, title: 'WIFI高级加速通道' },
  { img: fourG, title: '4G特权加速' },
  { img: global, title: '专属智能加速' },
  { img: custom, title: '会员优选客服通道' },
];

const Modal = (props) => {
  return (
    <div className="modal" onClick={props.onClick}>
      <div className="paytype margin1" onClick={props.payWechat}><div className="paytype-text">微信</div></div>
      <div className="paytype margin2" onClick={props.payAli}><div className="paytype-text">支付宝</div></div>
    </div>
  );
}

const Item = (props) => {
  return (
    <div className={`item-container ${props.isSelect ? 'item-select' : 'item-unselect'}`} onClick={props.itemPress}>
      <div className={`package-times ${props.isSelect ? 'select-text' : 'unselect-text'}`}>
        <div className=''>{`${props.name}`}</div>
        <div className={`separator ${props.isSelect ? 'select-sep' : 'unselect-sep'}`} />
      </div>
      <div className={`package-content ${props.isSelect ? 'select-content-text' : 'unselect-content-text'}`}>
        <div style={{ fontSize: 24 }}>{`${props.price}元`}</div>
      </div>
      <div className={`package-content2 ${props.isSelect ? 'select-content-text' : 'unselect-content-text'}`}>
        <div style={{ fontSize: 15 }}>{`${props.intro}`}</div>
      </div>
    </div>
  );
}

const IconItem = (props) => {
  return (
    <div className="icon-wrapper">
      <img src={props.img} className="icon-image" />
      <div className="icon-text">{props.title}</div>
    </div>
  );
}

class App extends Component {
  state = {
    userName: '',
    phone: '',
    list: [],
    selectIndex: -1,
    selectData: { price: 0 },
    isModalShow: false
  }

  componentDidMount() {
    window._unsafe_setState = this._unsafe_setState;
    window._unsafe_user_setState = this._unsafe_user_setState;
    window._unsafe_change_href = this._unsafe_change_href;
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ key: 'getUserInfo' }));
      window.ReactNativeWebView.postMessage(JSON.stringify({ key: 'getPackageList' }));
    }
    /*
        MyFetch(
          'userInfo',
          {
            session_id: sessionId,
            debug: 'towseruruncle'
          },
          (res) => {
            console.log('---userinfo---');
            console.log(res);
          })
    
        MyFetch(
          'getPackageList',
          {
            session_id: sessionId,
            debug: 'towseruruncle'
          },
          (res) => {
            console.log('---packagelist---');
            console.log(res);
          })
          */
  }

  _unsafe_user_setState = (payload) => {
    this.setState({
      ...payload
    });
  }

  _unsafe_setState = (payload) => {
    delete payload.timestamp;
    let data = Object.values(payload);
    this.setState({ list: data });
  }

  _unsafe_change_href = (payload) => {
    //alert(payload.code_url)
    window.location.href = `${payload.code_url}`;
    //https://wxpay.wxutil.com/mch/pay/h5.v2.php
    //window.location.href = 'https://wxpay.wxutil.com/mch/pay/h5.v2.php';
  }

  itemPress(item, index) {
    const { list, selectIndex } = this.state;
    if (index !== selectIndex) {
      let regList = [...list];
      regList[index].isSelect = true;
      if (selectIndex !== -1) {
        regList[selectIndex].isSelect = false;
      }
      this.setState({
        list: regList,
        selectIndex: index,
        selectData: regList[index]
      });
    }
  }

  makeOrder = (payType) => {
    const { selectIndex, selectData } = this.state;
    if (selectIndex > -1) {
      console.log('---here---');
      console.log(selectData);
      window.ReactNativeWebView.postMessage(JSON.stringify({ key: 'makeOrder', data: selectData, payType }));
    }
  }

  showPayTypeSelectModal = () => {
    this.setState({
      isModalShow: true
    }, () => {
      document.addEventListener('touchmove', this.stopTouchMove, { passive: false });
    });
  }

  unshowPayTypeSelectModal = () => {
    this.setState({
      isModalShow: false
    }, () => {
      document.removeEventListener('touchmove', this.stopTouchMove, { passive: false });
    });
  }

  stopTouchMove = (e) => {
    e.preventDefault();
  }

  render() {
    const { userName, phone, list, isModalShow, selectData: { price } } = this.state;
    return (
      <div className="App">
        <div className="banner" >
          <img className="banner-image" src={bannerImage} />
          <img className="avater" src={avater} />
          <img className="vip" src={vip} />
          <div className="user-info">
            {`${userName}(${phone})`}
          </div>
          <div className="guest">你尚未开通会员</div>
        </div>
        <div className="sub-title title1">
          <div>会员套餐</div>
          <div>(仅限移动端使用)</div>
        </div>
        <div>
          {
            list.map((item, index) => {
              return (
                <div key={item.id} className={`item-wrapper ${index % 2 == 0 ? "left" : "right"}`}>
                  <Item {...item} itemPress={() => this.itemPress(item, index)} />
                </div>
              );
            })
          }
        </div>
        <div className="sub-title title1">
          <div>会员套餐</div>
        </div>
        <div>
          {
            IconList.map((item) => {
              return <div className="icon-float-wrapper"><IconItem {...item} /></div>
            })
          }
        </div>
        <div className="submit-button" onClick={this.showPayTypeSelectModal}>
          <div>{`立即支付${price}元`}</div>
        </div>
        {isModalShow &&
          <Modal
            onClick={this.unshowPayTypeSelectModal}
            payAli={() => this.makeOrder("9")}
            payWechat={() => this.makeOrder("3")}
          />
        }
      </div>
    );
  }
}

export default App;
