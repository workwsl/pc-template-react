import { Button, Card, Avatar, List, Modal, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { useUserStore, useUserInfo } from '../../store'
import { formatPhone } from '../../utils'
import styles from './index.module.less'

const User = () => {
  const navigate = useNavigate()
  const userInfo = useUserInfo()
  const { logout } = useUserStore()

  // 处理登出
  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '确认退出登录?',
      onOk: () => {
        logout()
        navigate('/', { replace: true })
      },
    })
  }

  const userInfoData = [
    {
      icon: <UserOutlined />,
      label: '用户名',
      value: userInfo?.username || '-',
    },
    {
      icon: <MailOutlined />,
      label: '邮箱',
      value: userInfo?.email || '-',
    },
    {
      icon: <PhoneOutlined />,
      label: '电话',
      value: userInfo?.phone ? formatPhone(userInfo.phone) : '-',
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.userInfo}>
          <Avatar size={64} src={userInfo?.avatar} icon={<UserOutlined />} />
          <h2>{userInfo?.username || '未登录'}</h2>
          <p>{userInfo?.email || '暂无邮箱信息'}</p>
        </div>
      </Card>

      <Card title="个人信息" style={{ marginTop: 16 }}>
        <List
          dataSource={userInfoData}
          renderItem={item => (
            <List.Item>
              <Space>
                {item.icon}
                <span>
                  {item.label}: {item.value}
                </span>
              </Space>
            </List.Item>
          )}
        />
      </Card>

      <div className={styles.buttonGroup}>
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
        {userInfo && (
          <Button danger onClick={handleLogout}>
            退出登录
          </Button>
        )}
      </div>
    </div>
  )
}

export default User
