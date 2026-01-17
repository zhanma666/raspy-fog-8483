// Element Plus 简化实现
// 由于安装问题，我们创建一些基础组件的样式类来模拟Element Plus

// 这里我们可以定义一些常用的Element Plus样式类名映射到我们的设计系统
// 以便将来可以直接替换为真正的Element Plus

export const ElementPlusStyling = {
  // 按钮类型映射
  buttonVariants: {
    primary: 'btn btn-primary',
    success: 'btn btn-success',
    warning: 'btn btn-warning',
    danger: 'btn btn-danger',
    info: 'btn btn-secondary',
    text: 'btn btn-text'
  },
  
  // 尺寸映射
  sizes: {
    large: 'btn-lg',
    default: '',
    small: 'btn-sm'
  },
  
  // 输入框样式
  input: 'form-input',
  
  // 卡片样式
  card: 'card',
  
  // 警告框样式
  alert: {
    success: 'alert alert-success',
    warning: 'alert alert-warning',
    error: 'alert alert-error',
    info: 'alert alert-info'
  }
};

// 初始化Element Plus样式映射
export const initElementPlusStyling = () => {
  // 创建CSS类映射，以便将来无缝迁移到Element Plus
  const style = document.createElement('style');
  style.textContent = `
    /* Element Plus 类名映射到我们的设计系统 */
    .el-button {
      composes: btn;
    }
    
    .el-button--primary {
      composes: btn-primary;
    }
    
    .el-button--success {
      composes: btn-success;
    }
    
    .el-button--warning {
      composes: btn-warning;
    }
    
    .el-button--danger {
      composes: btn-danger;
    }
    
    .el-card {
      composes: card;
    }
    
    .el-input__wrapper {
      composes: form-input;
    }
    
    .el-alert--success {
      composes: alert alert-success;
    }
    
    .el-alert--warning {
      composes: alert alert-warning;
    }
    
    .el-alert--error {
      composes: alert alert-error;
    }
    
    .el-alert--info {
      composes: alert alert-info;
    }
  `;
  document.head.appendChild(style);
};

// 如果浏览器支持的话，初始化样式映射
if (typeof document !== 'undefined') {
  initElementPlusStyling();
}