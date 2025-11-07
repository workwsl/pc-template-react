import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'
import { EyeInvisibleOutlined, EyeOutlined, UserOutlined, LockOutlined } from '@ant-design/icons'
import { useRequest, useTitle } from '@/hooks'
import { UserAPI } from '@/services'
import { useUserStore } from '@/store'
import styles from './index.module.less'

interface LoginFormValues {
  username: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useUserStore()
  const [form] = Form.useForm<LoginFormValues>()

  // 设置页面标题
  useTitle('登录')

  // 获取登录前的路径，登录成功后跳转回去
  const from = (location.state as { from?: string })?.from || '/'

  // 登录请求
  const { run: handleLogin, loading } = useRequest(
    async (values: LoginFormValues) => {
      const response = await UserAPI.login(values)
      return response
    },
    {
      manual: true,
      onSuccess: data => {
        // 登录成功，保存用户信息
        login(data.token, data.userInfo)
        message.success('登录成功')
        // 跳转到登录前的页面或首页
        setTimeout(() => {
          navigate(from, { replace: true })
        }, 500)
      },
      onError: error => {
        const errorMessage = error instanceof Error ? error.message : '登录失败，请检查用户名和密码'
        message.error(errorMessage)
      },
    }
  )

  // 表单提交
  const onFinish = async (values: LoginFormValues) => {
    handleLogin(values)
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginPage_content}>
        {/* Logo 区域 */}
        <div className={styles.loginPage_logoSection}>
          <div className={styles.loginPage_logo}>👤</div>
          <h1 className={styles.loginPage_title}>欢迎登录</h1>
          <p className={styles.loginPage_subtitle}>请输入您的账号和密码</p>
        </div>

        {/* 表单区域 */}
        <Form form={form} onFinish={onFinish} layout="vertical" className={styles.loginPage_form}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              autoComplete="username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="current-password"
              size="large"
              iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className={styles.loginPage_submitButton}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
