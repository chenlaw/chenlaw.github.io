---
title: "ROS2 入门实战指南"
description: "从零开始学习 ROS2，掌握机器人开发的核心概念和实践技巧"
date: 2026-09-18T12:00:00+08:00
slug: ros2-basics
image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=400&fit=crop"
categories: ["机器人"]
tags: ["ROS2", "机器人", "入门", "实战"]
---

## 什么是 ROS2

**ROS2 (Robot Operating System 2)** 是新一代机器人开发框架，相比 ROS1 有重大改进：

- 🚀 **实时性**：支持实时控制
- 🔒 **安全性**：内置安全机制
- 🌐 **分布式**：更好的多机器人支持
- 📦 **模块化**：更清晰的架构

## 核心概念

### 1. Node（节点）

节点是 ROS2 中的基本执行单元，每个节点负责一个特定功能。

```python
import rclpy
from rclpy.node import Node

class MyNode(Node):
    def __init__(self):
        super().__init__('my_node')
        self.get_logger().info('节点已启动！')

def main():
    rclpy.init()
    node = MyNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 2. Topic（话题）

话题是节点间通信的通道，采用发布/订阅模式。

```python
# 发布者
from std_msgs.msg import String

class Publisher(Node):
    def __init__(self):
        super().__init__('publisher')
        self.publisher = self.create_publisher(String, 'topic', 10)
        self.timer = self.create_timer(1.0, self.publish_message)

    def publish_message(self):
        msg = String()
        msg.data = 'Hello ROS2!'
        self.publisher.publish(msg)
        self.get_logger().info(f'发布: {msg.data}')

# 订阅者
class Subscriber(Node):
    def __init__(self):
        super().__init__('subscriber')
        self.subscription = self.create_subscription(
            String,
            'topic',
            self.listener_callback,
            10
        )

    def listener_callback(self, msg):
        self.get_logger().info(f'收到: {msg.data}')
```

### 3. Service（服务）

服务提供同步的请求/响应通信。

```python
from example_interfaces.srv import AddTwoInts

# 服务端
class ServiceServer(Node):
    def __init__(self):
        super().__init__('service_server')
        self.service = self.create_service(
            AddTwoInts, 'add_two_ints', self.add_callback
        )

    def add_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info(
            f'{request.a} + {request.b} = {response.sum}'
        )
        return response

# 客户端
class ServiceClient(Node):
    def __init__(self):
        super().__init__('service_client')
        self.client = self.create_client(AddTwoInts, 'add_two_ints')

    def call_service(self, a, b):
        while not self.client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('等待服务...')

        request = AddTwoInts.Request()
        request.a = a
        request.b = b

        future = self.client.call_async(request)
        rclpy.spin_until_future_complete(self, future)
        return future.result()
```

## 常用命令速查

```bash
# 节点管理
ros2 node list                    # 列出所有节点
ros2 node info <node_name>        # 查看节点信息

# 话题管理
ros2 topic list                   # 列出所有话题
ros2 topic echo <topic_name>      # 查看话题内容
ros2 topic hz <topic_name>        # 查看话题频率
ros2 topic pub <topic> <type> <data>  # 发布消息

# 服务管理
ros2 service list                 # 列出所有服务
ros2 service call <service> <type> <args>  # 调用服务

# 参数管理
ros2 param list <node_name>       # 列出节点参数
ros2 param get <node> <param>     # 获取参数值
ros2 param set <node> <param> <value>  # 设置参数

# 包管理
ros2 pkg list                     # 列出所有包
ros2 pkg executables <pkg>        # 列出包的可执行文件
ros2 run <pkg> <executable>       # 运行节点
```

## 实战：创建完整项目

### 1. 创建工作空间

```bash
# 创建工作空间
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws/src

# 创建包
ros2 pkg create --build-type ament_python my_robot_package
```

### 2. 项目结构

```
my_robot_package/
├── my_robot_package/
│   ├── __init__.py
│   ├── robot_controller.py
│   └── sensor_reader.py
├── resource/
│   └── my_robot_package
├── setup.py
├── setup.cfg
└── package.xml
```

### 3. 编写控制器

```python
# robot_controller.py
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from sensor_msgs.msg import LaserScan
import math

class RobotController(Node):
    def __init__(self):
        super().__init__('robot_controller')

        # 速度发布者
        self.cmd_vel_pub = self.create_publisher(
            Twist, 'cmd_vel', 10
        )

        # 激光雷达订阅者
        self.scan_sub = self.create_subscription(
            LaserScan, 'scan', self.scan_callback, 10
        )

        # 定时器
        self.timer = self.create_timer(0.1, self.control_loop)

        self.get_logger().info('机器人控制器已启动')

    def scan_callback(self, msg):
        # 处理激光雷达数据
        min_distance = min(msg.ranges)
        self.get_logger().debug(f'最近障碍物: {min_distance:.2f}m')

    def control_loop(self):
        # 简单的避障逻辑
        twist = Twist()
        twist.linear.x = 0.2  # 前进速度
        twist.angular.z = 0.0  # 旋转速度

        self.cmd_vel_pub.publish(twist)

def main():
    rclpy.init()
    node = RobotController()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### 4. 配置 setup.py

```python
from setuptools import setup

package_name = 'my_robot_package'

setup(
    name=package_name,
    version='0.1.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='your_name',
    maintainer_email='your@email.com',
    description='ROS2 Robot Controller',
    license='MIT',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'robot_controller = my_robot_package.robot_controller:main',
        ],
    },
)
```

### 5. 编译和运行

```bash
# 编译
cd ~/ros2_ws
colcon build --packages-select my_robot_package

# 加载环境
source install/setup.bash

# 运行节点
ros2 run my_robot_package robot_controller
```

## Launch 文件

Launch 文件可以同时启动多个节点。

```python
# launch/robot.launch.py
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='my_robot_package',
            executable='robot_controller',
            name='controller',
            output='screen',
            parameters=[{
                'max_speed': 0.5,
                'safety_distance': 0.3
            }]
        ),
        Node(
            package='my_robot_package',
            executable='sensor_reader',
            name='sensor',
            output='screen'
        ),
    ])
```

运行：
```bash
ros2 launch my_robot_package robot.launch.py
```

## 调试技巧

### 1. 日志级别

```python
self.get_logger().debug('调试信息')
self.get_logger().info('一般信息')
self.get_logger().warning('警告')
self.get_logger().error('错误')
self.get_logger().fatal('致命错误')
```

### 2. rqt 工具

```bash
# 图形化查看
rqt_graph              # 节点关系图
rqt_console            # 日志控制台
rqt_topic              # 话题监控
rqt_node               # 节点信息
```

### 3. RViz 可视化

```bash
# 启动 RViz
rviz2

# 添加显示项
# - Robot Model
# - Laser Scan
# - Path
# - Map
```

## 常见问题

### Q: 节点无法通信？
```bash
# 检查网络
export ROS_DOMAIN_ID=0

# 检查防火墙
sudo ufw allow 11311
```

### Q: 编译错误？
```bash
# 清理并重新编译
cd ~/ros2_ws
rm -rf build/ install/ log/
colcon build
```

### Q: 找不到包？
```bash
# 确保加载环境
source ~/ros2_ws/install/setup.bash

# 检查包是否存在
ros2 pkg list | grep my_package
```

## 学习路径

1. **基础**：掌握 Node、Topic、Service
2. **进阶**：学习 Action、Parameter、Launch
3. **实战**：完成一个完整项目
4. **深入**：研究底层通信机制

## 参考资源

- [ROS2 官方文档](https://docs.ros.org/)
- [ROS2 设计文档](https://design.ros2.org/)
- [ROS2 Answers](https://answers.ros.org/)

---

**下一篇预告**：使用 ROS2 实现移动机器人的自主导航！
