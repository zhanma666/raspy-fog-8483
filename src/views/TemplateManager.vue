<template>
  <div class="template-manager-container pt-md pb-md">
    <header class="header mb-md">
      <div class="container">
        <h1 class="title">论文模板管理</h1>
        <p class="subtitle">管理软考论文写作模板，提高写作效率</p>
      </div>
    </header>
    
    <main class="main-content container">
      <!-- 操作按钮区 -->
      <div class="action-bar mb-md flex-between">
        <div class="filters flex">
          <select v-model="filters.subject" class="form-input mr-md" @change="applyFilters">
            <option value="">全部科目</option>
            <option value="信息系统项目管理师">信息系统项目管理师</option>
            <option value="系统架构设计师">系统架构设计师</option>
            <option value="网络规划设计师">网络规划设计师</option>
            <option value="系统分析师">系统分析师</option>
          </select>
          
          <select v-model="filters.level" class="form-input mr-md" @change="applyFilters">
            <option value="">全部级别</option>
            <option value="高级">高级</option>
            <option value="中级">中级</option>
          </select>
          
          <input 
            v-model="filters.search" 
            type="text" 
            class="form-input" 
            placeholder="搜索模板..." 
            @input="applyFilters"
          />
        </div>
        
        <button class="btn btn-primary" @click="showCreateModal = true">
          <i class="icon-plus"></i> 新建模板
        </button>
      </div>
      
      <!-- 模板列表 -->
      <div class="template-list">
        <div 
          v-for="template in filteredTemplates" 
          :key="template.id" 
          class="template-card card mb-md"
        >
          <div class="card-header flex-between">
            <div>
              <h3 class="m-0">{{ template.title }}</h3>
              <div class="template-meta text-muted">
                <span class="mr-md">{{ template.subject }}</span>
                <span>{{ template.level }}</span>
              </div>
            </div>
            <div class="template-actions">
              <button 
                class="btn btn-secondary btn-sm mr-sm" 
                @click="useTemplate(template)"
              >
                使用
              </button>
              <button 
                class="btn btn-outline btn-sm mr-sm" 
                @click="editTemplate(template)"
                :disabled="isDefaultTemplate(template.id)"
              >
                编辑
              </button>
              <button 
                class="btn btn-outline btn-sm" 
                @click="deleteTemplate(template)"
                :disabled="isDefaultTemplate(template.id)"
              >
                删除
              </button>
            </div>
          </div>
          
          <div class="card-body">
            <p class="template-description mb-md">{{ template.description }}</p>
            
            <div class="template-tags mb-md">
              <span 
                class="tag mr-sm mb-sm" 
                v-for="tag in template.tags" 
                :key="tag"
              >
                {{ tag }}
              </span>
            </div>
            
            <div class="template-stats">
              <div class="stat-item mr-md">
                <span class="stat-label">章节数量:</span>
                <span class="stat-value">{{ template.sections.length }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">创建时间:</span>
                <span class="stat-value">{{ formatDate(template.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 创建/编辑模板模态框 -->
      <div class="modal" v-if="showCreateModal || editingTemplate">
        <div class="modal-content card">
          <div class="card-header flex-between">
            <h3 class="m-0">
              {{ editingTemplate ? '编辑模板' : '创建新模板' }}
            </h3>
            <button class="btn btn-outline" @click="closeModal">&times;</button>
          </div>
          
          <div class="card-body">
            <form @submit.prevent="saveTemplate">
              <div class="form-group mb-md">
                <label class="form-label">模板标题 *</label>
                <input 
                  v-model="currentTemplate.title" 
                  type="text" 
                  class="form-input" 
                  required
                />
              </div>
              
              <div class="form-grid mb-md">
                <div class="form-group">
                  <label class="form-label">考试科目 *</label>
                  <select v-model="currentTemplate.subject" class="form-input" required>
                    <option value="信息系统项目管理师">信息系统项目管理师</option>
                    <option value="系统架构设计师">系统架构设计师</option>
                    <option value="网络规划设计师">网络规划设计师</option>
                    <option value="系统分析师">系统分析师</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">考试级别 *</label>
                  <select v-model="currentTemplate.level" class="form-input" required>
                    <option value="高级">高级</option>
                    <option value="中级">中级</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group mb-md">
                <label class="form-label">描述</label>
                <textarea 
                  v-model="currentTemplate.description" 
                  class="form-input" 
                  rows="3"
                ></textarea>
              </div>
              
              <div class="form-group mb-md">
                <label class="form-label">标签</label>
                <input 
                  v-model="tagInput" 
                  type="text" 
                  class="form-input mb-sm" 
                  placeholder="输入标签，回车添加"
                  @keypress.enter="addTag"
                />
                <div class="tags-container">
                  <span 
                    class="tag mr-sm mb-sm flex-center" 
                    v-for="(tag, index) in currentTemplate.tags" 
                    :key="index"
                  >
                    {{ tag }}
                    <button type="button" class="tag-remove ml-sm" @click="removeTag(index)">×</button>
                  </span>
                </div>
              </div>
              
              <div class="form-group mb-md">
                <div class="flex-between mb-sm">
                  <label class="form-label">模板章节</label>
                  <button type="button" class="btn btn-secondary btn-sm" @click="addSection">
                    <i class="icon-plus"></i> 添加章节
                  </button>
                </div>
                
                <div 
                  class="section-item card mb-sm" 
                  v-for="(section, index) in currentTemplate.sections" 
                  :key="index"
                >
                  <div class="section-header flex-between">
                    <div class="flex-grow">
                      <input 
                        v-model="section.title" 
                        type="text" 
                        class="form-input mb-xs" 
                        :placeholder="'章节标题'"
                        required
                      />
                      <textarea 
                        v-model="section.placeholder" 
                        class="form-input" 
                        :placeholder="'章节提示文字'"
                        rows="2"
                        required
                      ></textarea>
                    </div>
                    <div class="section-actions ml-md">
                      <label class="checkbox-label">
                        <input 
                          type="checkbox" 
                          v-model="section.required"
                        /> 必填
                      </label>
                      <div class="mt-xs">
                        <label class="form-label">字数限制</label>
                        <input 
                          v-model.number="section.wordLimit" 
                          type="number" 
                          class="form-input form-input-sm"
                          placeholder="不限"
                        />
                      </div>
                      <button 
                        type="button" 
                        class="btn btn-outline btn-sm mt-xs w-100" 
                        @click="removeSection(index)"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                  
                  <div class="section-guidance mt-sm">
                    <label class="form-label">写作指导</label>
                    <textarea 
                      v-model="section.guidance" 
                      class="form-input" 
                      :placeholder="'写作指导和注意事项'"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div class="form-actions flex-end">
                <button type="button" class="btn btn-outline mr-md" @click="closeModal">取消</button>
                <button type="submit" class="btn btn-primary">保存模板</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { PaperTemplateManager } from '@/utils/paperTemplateManager';
import type { PaperTemplate } from '@/utils/paperTemplateManager';

// 路由
const router = useRouter();

// 筛选条件
const filters = reactive({
  subject: '',
  level: '',
  search: ''
});

// 模板列表
const templates = ref<PaperTemplate[]>([]);
const filteredTemplates = computed(() => {
  let result = [...templates.value];
  
  if (filters.subject) {
    result = result.filter(t => t.subject === filters.subject);
  }
  
  if (filters.level) {
    result = result.filter(t => t.level === filters.level);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(t => 
      t.title.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower) ||
      t.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );
  }
  
  return result;
});

// 模态框控制
const showCreateModal = ref(false);
const editingTemplate = ref<PaperTemplate | null>(null);

// 当前编辑的模板
const currentTemplate = ref<Omit<PaperTemplate, 'id' | 'createdAt' | 'updatedAt'>>({
  title: '',
  subject: '信息系统项目管理师',
  level: '高级',
  description: '',
  tags: [],
  sections: [
    {
      id: 'title',
      title: '论文标题',
      placeholder: '请输入论文标题...',
      required: true,
      wordLimit: 30
    }
  ]
});

// 标签输入
const tagInput = ref('');

// 加载模板
onMounted(() => {
  loadTemplates();
});

const loadTemplates = () => {
  templates.value = PaperTemplateManager.getAllTemplates();
};

// 应用筛选
const applyFilters = () => {
  // 筛选逻辑在computed属性中实现
};

// 使用模板
const useTemplate = (template: PaperTemplate) => {
  // 将模板保存到本地存储，以便在写作页面使用
  localStorage.setItem('selectedTemplate', JSON.stringify(template));
  // 跳转到写作页面
  router.push('/writing');
};

// 编辑模板
const editTemplate = (template: PaperTemplate) => {
  editingTemplate.value = template;
  currentTemplate.value = {
    title: template.title,
    subject: template.subject,
    level: template.level,
    description: template.description,
    tags: [...template.tags],
    sections: template.sections.map((section: any) => ({ ...section }))
  };
  showCreateModal.value = true;
};

// 删除模板
const deleteTemplate = (template: PaperTemplate) => {
  if (confirm(`确定要删除模板 "${template.title}" 吗？此操作不可撤销。`)) {
    const success = PaperTemplateManager.deleteTemplate(template.id);
    if (success) {
      loadTemplates();
    }
  }
};

// 保存模板
const saveTemplate = () => {
  if (editingTemplate.value) {
    // 更新现有模板
    const updatedTemplate: PaperTemplate = {
      ...currentTemplate.value,
      id: editingTemplate.value.id,
      createdAt: editingTemplate.value.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    const success = PaperTemplateManager.updateTemplate(updatedTemplate);
    if (success) {
      loadTemplates();
      closeModal();
    }
  } else {
    // 创建新模板
    const newTemplate = PaperTemplateManager.createTemplate(currentTemplate.value);
    if (newTemplate) {
      loadTemplates();
      closeModal();
    }
  }
};

// 关闭模态框
const closeModal = () => {
  showCreateModal.value = false;
  editingTemplate.value = null;
  resetCurrentTemplate();
};

// 重置当前模板
const resetCurrentTemplate = () => {
  currentTemplate.value = {
    title: '',
    subject: '信息系统项目管理师',
    level: '高级',
    description: '',
    tags: [],
    sections: [
      {
        id: 'title',
        title: '论文标题',
        placeholder: '请输入论文标题...',
        required: true,
        wordLimit: 30
      }
    ]
  };
  tagInput.value = '';
};

// 添加标签
const addTag = () => {
  if (tagInput.value.trim() && !currentTemplate.value.tags.includes(tagInput.value.trim())) {
    currentTemplate.value.tags.push(tagInput.value.trim());
    tagInput.value = '';
  }
};

// 移除标签
const removeTag = (index: number) => {
  currentTemplate.value.tags.splice(index, 1);
};

// 添加章节
const addSection = () => {
  currentTemplate.value.sections.push({
    id: `section_${Date.now()}`,
    title: '',
    placeholder: '',
    required: false
  });
};

// 移除章节
const removeSection = (index: number) => {
  currentTemplate.value.sections.splice(index, 1);
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
};

// 检查是否为默认模板
const isDefaultTemplate = (id: string) => {
  return PaperTemplateManager.getAllTemplates().some(
    (t: PaperTemplate) => t.id === id && 
    PaperTemplateManager['defaultTemplates'].some((dt: PaperTemplate) => dt.id === id)
  );
};
</script>

<style scoped>
.template-manager-container {
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.action-bar {
  padding: var(--spacing-md);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.filters {
  gap: var(--spacing-sm);
}

.form-input {
  min-width: 150px;
}

.template-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.template-meta {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

.template-description {
  color: var(--text-secondary);
}

.template-tags {
  display: flex;
  flex-wrap: wrap;
}

.tag {
  background-color: var(--primary-light);
  color: var(--primary-color);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
}

.stat-item {
  display: inline-block;
}

.stat-label {
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
}

.stat-value {
  font-weight: var(--font-weight-medium);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.section-item {
  padding: var(--spacing-md);
}

.section-header {
  align-items: flex-start;
}

.section-actions {
  width: 200px;
}

.tag-remove {
  cursor: pointer;
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  color: var(--danger-color);
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tags-container {
  min-height: 40px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs);
}

.form-actions {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
}

.w-100 {
  width: 100%;
}

.mr-md {
  margin-right: var(--spacing-md);
}

.mb-sm {
  margin-bottom: var(--spacing-sm);
}

.mb-md {
  margin-bottom: var(--spacing-md);
}

.mt-xs {
  margin-top: var(--spacing-xs);
}

.mt-sm {
  margin-top: var(--spacing-sm);
}

.mt-md {
  margin-top: var(--spacing-md);
}

.ml-sm {
  margin-left: var(--spacing-sm);
}

.ml-md {
  margin-left: var(--spacing-md);
}

.flex-grow {
  flex-grow: 1;
}

.text-muted {
  color: var(--text-tertiary);
}

.text-center {
  text-align: center;
}

.flex-end {
  justify-content: flex-end;
}

.icon-plus::before {
  content: '+';
  margin-right: var(--spacing-xs);
}
</style>