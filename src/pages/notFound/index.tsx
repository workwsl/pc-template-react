import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <Result
        status="404"
        title="404"
        subTitle="抱歉,您访问的页面不存在"
        extra={
          <div className={styles.buttonGroup}>
            <Button type="primary" onClick={() => navigate('/')}>
              返回首页
            </Button>
            <Button onClick={() => navigate(-1)}>返回上一页</Button>
          </div>
        }
      />
    </div>
  )
}

export default NotFound
