import React, { Component } from 'react'
import { Card, Form, Icon, Input, Button, Checkbox, Row, Col, message } from 'antd'
import { fetchLoginGetcode, fetchLogin, fetchLoginAdmin, fetchLoginAdminInfo } from 'src/http/api'
import { setItem, getItem } from 'src/utils/minix'
const FormItem = Form.Item;
import "./index.less"
import { userInfo } from 'os';
/**
 * TODO:
 * 1. 记录用户名和密码功能
 * 2. 如果用户已经是登录状态的话，下次直接登录
 */
class Login extends Component {
  constructor() {
    super()
    this.state = {
      // 能否获取验证码
      isGetCode: true,
      // 倒计时
      countdown: 10,
      // 验证码
      codeImg: '',
      // 登录loading
      loginLoading: false,
      // 验证码loading
      codeLoading: false,
      // 是否记住密码
      isChecked: false,
    }
  }
  componentDidMount = () => {
    // this.setUserInfo();
  }
  // 在组件卸载时结束通过return结束callback中的setState
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  }
  // 写入用户名
  setUserInfo = () => {
    const userInfo = getItem('userInfo') || {};
    const isChecked = getItem('isChecked') || false;
    this.setState({ isChecked });
    if (isChecked) {
      this.props.form.setFieldsValue({
        user_name: userInfo.user_name,
      });
    }
  }
  // 提交登录信息
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      const { remember, captcha_code, ...params } = values;
      this.setState({ loginLoading: true });
      /**
       * FIXME: 对细节部分进行的处理
       *  1. 由于自己在路由跳转时进行了异步的ajax（axios）请求
       *  2. 在请求的回调函数中调用了this.setState();
       *  3. 当路由切换时，组件已经被卸载了，此时异步操作callback还在执行，所以setState无法获取到state中的值
       */
      fetchLoginAdmin(params, (res) => {
        message.warning(res.success);
        this.setState({ loginLoading: false }, () => {
          fetchLoginAdminInfo({}, res => {
            setItem('userInfo', res.data)
            setItem('isChecked', this.state.isChecked);
            this.props.history.push(`/index/dashboard`);
          })
        });
      }, err => {
        this.setState({ loginLoading: false })
      })
    });
  }
  // 获取验证码
  getCode = () => {
    this.setState({ codeLoading: true })
    fetchLoginGetcode({}, (res) => {
      this.setState({
        codeImg: res.code,
        isGetCode: false,
        codeLoading: false
      });
      this.timeDown();
    })
  }
  // 倒计时
  timeDown = () => {
    let { countdown } = this.state;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (countdown <= 0) {
        this.setState({ countdown: 10, isGetCode: true });
        return clearInterval(this.timer);
      }
      countdown--;
      this.setState({ countdown });
    }, 1000)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login f-c">
        <div className="login-card">
          <Card
            // title="Login System"
            cover={
              <img
                alt="example"
                src={this.state.codeImg || "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}
              />
            }
            bordered={true}
            style={{ width: 400 }}
            hoverable
          >
            <Form onSubmit={this.handleSubmit}>
              <FormItem hasFeedback>
                {getFieldDecorator('user_name', {
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input
                    prefix={
                      <Icon
                        type="user"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />}
                    placeholder="usename"
                  />
                )}
              </FormItem>
              <FormItem hasFeedback>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your password!' }],
                })(
                  <Input
                    prefix={
                      <Icon
                        type="lock"
                        style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="password"
                  />
                )}
              </FormItem>
              <FormItem hasFeedback>
                {getFieldDecorator('captcha_code', {
                  rules: [{ required: true, message: 'Please input verification code!' }],
                })(
                  <Input
                    prefix={
                      <Icon
                        type="key"
                        style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="verification code"
                  />
                )}
              </FormItem>
              <FormItem>
                {this.state.isGetCode
                  ?
                  <Button type="primary" onClick={this.getCode} loading={this.state.codeLoading}>获取验证码</Button>
                  :
                  <Button type="primary" disabled>
                    <span>{this.state.countdown}</span>
                    后继续获取
                  </Button>
                }
              </FormItem>
              <FormItem>
                {/* {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: this.state.isChecked,
                })(
                  <Checkbox onChange={(e) => this.setState({ isChecked: e.target.checked })}>Remember me</Checkbox>
                )} */}
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={this.state.loginLoading}
                >
                  Login
                </Button>
              </FormItem>
            </Form>
          </Card>
        </div>
      </div>
    )
  }
}
export default Form.create()(Login);