import { Button, Card, List } from 'antd'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'

const About = () => {
  const navigate = useNavigate()

  const techStack = [
    'React 18.3.1',
    'Ant Design 5.x',
    'React Router 7.x',
    'TypeScript 5.9.3',
    'Vite 7.x',
    'Less',
    'Zustand 5.x',
    'ahooks 3.x',
  ]

  return (
    <div className={styles.container}>
      <Card title="关于">
        <div className={styles.content}>
          <h2>技术栈</h2>
          <List
            dataSource={techStack}
            renderItem={item => <List.Item>{item}</List.Item>}
            bordered
          />
          <div className={styles.buttonGroup}>
            <Button type="primary" onClick={() => navigate('/')}>
              返回首页
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default About
