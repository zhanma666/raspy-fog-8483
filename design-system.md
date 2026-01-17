# 软考高级论文写作系统 - 设计系统

## 概述
本项目采用统一的设计系统，确保各页面具有一致的视觉风格和用户体验。设计系统包含颜色、间距、字体、组件等规范。

## 设计变量

### 颜色系统
- **主色调 (软考蓝)**: `var(--primary-color: #1890ff)`
- **辅助色 (成功绿)**: `var(--secondary-color: #52c41a)`
- **警告色**: `var(--warning-color: #faad14)`
- **危险色**: `var(--danger-color: #f5222d)`
- **信息色**: `var(--info-color: #177ddc)`

### 中性色
- **主要文字**: `var(--text-primary: #262626)`
- **次要文字**: `var(--text-secondary: #595959)`
- **占位文字**: `var(--text-tertiary: #8c8c8c)`
- **禁用文字**: `var(--text-disabled: #bfbfbf)`

### 背景色
- **主要背景**: `var(--bg-primary: #ffffff)`
- **次要背景**: `var(--bg-secondary: #fafafa)`
- **三级背景**: `var(--bg-tertiary: #f5f5f5)`

### 边框色
- **边框色**: `var(--border-color: #d9d9d9)`
- **浅边框**: `var(--border-light: #f0f0f0)`

### 阴影
- **小阴影**: `var(--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08))`
- **中阴影**: `var(--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12))`
- **大阴影**: `var(--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15))`

### 圆角
- **极小圆角**: `var(--radius-xs: 2px)`
- **小圆角**: `var(--radius-sm: 4px)`
- **中圆角**: `var(--radius-md: 8px)`
- **大圆角**: `var(--radius-lg: 12px)`

### 间距
- **极小间距**: `var(--spacing-xs: 4px)`
- **小间距**: `var(--spacing-sm: 8px)`
- **中间距**: `var(--spacing-md: 16px)`
- **大间距**: `var(--spacing-lg: 24px)`
- **极大间距**: `var(--spacing-xl: 32px)`

### 字体
- **极小字体**: `var(--font-size-xs: 12px)`
- **小字体**: `var(--font-size-sm: 13px)`
- **基础字体**: `var(--font-size-base: 14px)`
- **中字体**: `var(--font-size-md: 16px)`
- **大字体**: `var(--font-size-lg: 18px)`
- **极大字体**: `var(--font-size-xl: 20px)`
- **超大字体**: `var(--font-size-xxl: 24px)`

## 组件规范

### 按钮(Button)
- `.btn`: 基础按钮
- `.btn-primary`: 主要按钮
- `.btn-secondary`: 次要按钮
- `.btn-success`: 成功按钮
- `.btn-warning`: 警告按钮
- `.btn-danger`: 危险按钮

### 卡片(Card)
- `.card`: 基础卡片
- `.card-header`: 卡片头部
- `.card-body`: 卡片主体
- `.card-footer`: 卡片底部

### 表单元素
- `.form-group`: 表单组
- `.form-label`: 表单标签
- `.form-input`: 表单输入框

### 提示信息
- `.alert`: 基础提示
- `.alert-success`: 成功提示
- `.alert-warning`: 警告提示
- `.alert-error`: 错误提示
- `.alert-info`: 信息提示

## 工具类

### 间距类
- `.mt-{size}`: 上边距 (xs, sm, md, lg, xl)
- `.mb-{size}`: 下边距 (xs, sm, md, lg, xl)
- `.ml-{size}`: 左边距 (xs, sm, md, lg, xl)
- `.mr-{size}`: 右边距 (xs, sm, md, lg, xl)

### 布局类
- `.flex-center`: 居中对齐
- `.flex-between`: 两端对齐
- `.flex-column`: 垂直排列
- `.text-center`: 文字居中
- `.text-left`: 文字左对齐
- `.text-right`: 文字右对齐

## 使用示例

### HTML示例
```html
<div class="card">
  <div class="card-header">
    <h3>标题</h3>
  </div>
  <div class="card-body">
    <p>这里是卡片内容</p>
    <button class="btn btn-primary">主要按钮</button>
    <button class="btn btn-secondary">次要按钮</button>
  </div>
</div>
```

### Vue组件示例
```vue
<template>
  <div class="card mb-md">
    <div class="card-body">
      <h3 class="title">功能卡片</h3>
      <p class="subtitle">这里是功能描述</p>
      <button class="btn btn-primary" @click="handleClick">操作按钮</button>
    </div>
  </div>
</template>

<style scoped>
/* 组件特定样式可写在这里 */
</style>
```

## 响应式设计
设计系统内置响应式支持，在移动设备上会自动调整布局。断点如下：
- 平板及以下: `max-width: 768px`