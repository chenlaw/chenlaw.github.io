---
title: "Python 数据处理高级技巧"
description: "掌握这些 Python 数据处理技巧，让你的代码更优雅、更高效"
date: 2026-09-18T11:00:00+08:00
slug: python-tips
image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=400&fit=crop"
categories: ["编程"]
tags: ["Python", "数据处理", "技巧", "性能优化"]
---

## 引言

Python 是数据科学领域的主流语言，但写出**优雅且高效**的代码需要技巧。本文将分享几个实用的高级技巧。

## 1. 列表推导式的进阶用法

### 基础用法回顾

```python
# 基础过滤
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [x**2 for x in numbers if x % 2 == 0]
```

### 嵌套推导式

```python
# 矩阵转置
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
transposed = [[row[i] for row in matrix] for i in range(3)]
# [[1, 4, 7], [2, 5, 8], [3, 6, 9]]

# 展平嵌套列表
nested = [[1, 2], [3, 4], [5, 6]]
flat = [item for sublist in nested for item in sublist]
# [1, 2, 3, 4, 5, 6]
```

### 条件表达式

```python
# 根据条件返回不同结果
scores = [85, 92, 78, 95, 88]
grades = ['A' if s >= 90 else 'B' if s >= 80 else 'C' for s in scores]
# ['B', 'A', 'C', 'A', 'B']
```

## 2. defaultdict 的妙用

### 分组数据

```python
from collections import defaultdict

# 按类别分组
data = [
    ("apple", 1), ("banana", 2), ("apple", 3),
    ("orange", 4), ("banana", 5)
]

grouped = defaultdict(list)
for key, value in data:
    grouped[key].append(value)

print(dict(grouped))
# {'apple': [1, 3], 'banana': [2, 5], 'orange': [4]}
```

### 计数统计

```python
from collections import defaultdict, Counter

# 统计词频
words = ["apple", "banana", "apple", "orange", "banana", "apple"]
word_count = defaultdict(int)
for word in words:
    word_count[word] += 1

# 或者直接用 Counter
word_count = Counter(words)
print(word_count.most_common(2))
# [('apple', 3), ('banana', 2)]
```

### 树形结构

```python
from collections import defaultdict

# 创建嵌套字典
tree = lambda: defaultdict(tree)

t = tree()
t['a']['b']['c'] = 1
t['a']['b']['d'] = 2
t['x']['y'] = 3

print(dict(t))
```

## 3. 字典的高级操作

### 安全获取值

```python
config = {"host": "localhost", "port": 8080}

# 使用 get 避免 KeyError
host = config.get("host", "127.0.0.1")
timeout = config.get("timeout", 30)  # 返回默认值 30

# 链式获取（Python 3.8+）
value = config.get("nested", {}).get("key", "default")
```

### 合并字典

```python
dict1 = {"a": 1, "b": 2}
dict2 = {"b": 3, "c": 4}

# Python 3.9+ 使用 | 操作符
merged = dict1 | dict2
# {'a': 1, 'b': 3, 'c': 4}

# 旧版本使用 ** 解包
merged = {**dict1, **dict2}
```

### 字典推导式

```python
# 创建映射
names = ["alice", "bob", "charlie"]
name_lengths = {name: len(name) for name in names}
# {'alice': 5, 'bob': 3, 'charlie': 7}

# 过滤字典
scores = {"alice": 85, "bob": 92, "charlie": 78}
high_scores = {k: v for k, v in scores.items() if v >= 85}
# {'alice': 85, 'bob': 92}
```

## 4. itertools 工具箱

### 排列组合

```python
from itertools import combinations, permutations, product

# 组合
list(combinations([1, 2, 3], 2))
# [(1, 2), (1, 3), (2, 3)]

# 排列
list(permutations([1, 2, 3], 2))
# [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]

# 笛卡尔积
list(product([1, 2], ['a', 'b']))
# [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
```

### 链式迭代

```python
from itertools import chain

list1 = [1, 2, 3]
list2 = [4, 5, 6]
list3 = [7, 8, 9]

# 高效连接多个迭代器
for item in chain(list1, list2, list3):
    print(item)
```

### 分组迭代

```python
from itertools import groupby

data = [
    {"name": "Alice", "dept": "Engineering"},
    {"name": "Bob", "dept": "Sales"},
    {"name": "Charlie", "dept": "Engineering"},
    {"name": "David", "dept": "Sales"},
]

# 先排序
data.sort(key=lambda x: x["dept"])

# 按部门分组
for dept, group in groupby(data, key=lambda x: x["dept"]):
    print(f"{dept}: {[p['name'] for p in group]}")
```

## 5. 性能优化技巧

### 生成器表达式

```python
# 列表推导式 - 立即创建所有元素
squares_list = [x**2 for x in range(1000000)]  # 占用大量内存

# 生成器表达式 - 按需生成
squares_gen = (x**2 for x in range(1000000))   # 几乎不占内存

# 处理大数据集时使用生成器
def process_large_file(filename):
    with open(filename) as f:
        for line in f:
            yield line.strip()
```

### 使用 map 和 filter

```python
# 列表推导式
squares = [x**2 for x in range(10) if x % 2 == 0]

# 函数式写法（有时更快）
squares = list(map(lambda x: x**2, filter(lambda x: x % 2 == 0, range(10))))

# 使用 operator 模块更快
from operator import mul
result = list(map(mul, [1, 2, 3], [4, 5, 6]))
# [4, 10, 18]
```

### 局部变量优化

```python
import math

def calculate_distances(points):
    # 将方法绑定到局部变量，减少属性查找
    sqrt = math.sqrt
    return [sqrt(x**2 + y**2) for x, y in points]
```

## 实战案例：数据清洗管道

```python
from collections import defaultdict
from itertools import chain

def clean_data(raw_data):
    """数据清洗管道"""
    # 1. 过滤无效数据
    valid = (item for item in raw_data if item is not None)

    # 2. 标准化
    normalized = (item.strip().lower() for item in valid)

    # 3. 去重
    seen = set()
    unique = (item for item in normalized
              if item not in seen and not seen.add(item))

    # 4. 分组
    grouped = defaultdict(list)
    for item in unique:
        category = item[0]  # 按首字母分组
        grouped[category].append(item)

    return dict(grouped)

# 使用示例
raw = [" Apple", "banana", "APPLE", None, " orange", "banana"]
result = clean_data(raw)
# {'a': ['apple'], 'b': ['banana'], 'o': ['orange']}
```

## 总结

掌握这些技巧能让你的 Python 代码：
- ✅ 更简洁易读
- ✅ 更高效
- ✅ 更 Pythonic

**记住**：代码是写给人看的，顺便让机器执行。

---

**参考资源**：
- [Python 官方文档](https://docs.python.org/3/)
- [itertools 模块详解](https://docs.python.org/3/library/itertools.html)
- [Python 性能优化指南](https://wiki.python.org/moin/PythonSpeed/PerformanceTips)
