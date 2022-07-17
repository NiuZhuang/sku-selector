## SKU 选择器

[SKU selector - codesandbox 预览](https://codesandbox.io/s/sku-calculator-fcf6tg)

### 需求：

- 多 SKU 在选择时，每一个可能连通的规格组合，都应该亮起来；
- 只有不能连接的规格，才灰掉禁用。

### 方案：

1. 数据结构
    - 构建一个图数据结构
    - 以 specs 规格的 id 为节点，记录能够连通的其他所有 specs 节点
    - 水平方向(specs)/垂直方向(spus)，两者都有连通的可能性
    - 该邻接表包含：每个节点，可连通的所有其他节点
    - 再构建一个非连通的邻接表，记录不可连通的其他节点。

2. 其他数据结构
    - selectedOptions: 已选中的 specs 节点
    - disabledOptions: 无法连通的 specs 节点

3. 操作逻辑

每当选中一个节点，该操作属于以下 3 种逻辑的某一种：

- 选中；在 selectedOptions 新增一个节点
- 反选；在 selectedOptions 删除该一个节点
- 替换同类；在 selectedOptions 删除其同类节点，新增该节点

然后根据 selectedOptions，找出所有不可连通的节点 disabledOptions。

