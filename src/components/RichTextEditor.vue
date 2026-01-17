<template>
  <div class="rich-text-editor">
    <div class="editor-toolbar" role="toolbar">
      <div class="toolbar-group">
        <button 
          type="button"
          class="btn btn-secondary toolbar-btn"
          :class="{ 'btn-primary': editor?.isActive('bold') }"
          @click="editor?.chain().focus().toggleBold().run()"
          title="粗体"
        >
          <strong>B</strong>
        </button>
        <button 
          type="button"
          class="btn btn-secondary toolbar-btn"
          :class="{ 'btn-primary': editor?.isActive('italic') }"
          @click="editor?.chain().focus().toggleItalic().run()"
          title="斜体"
        >
          <em>I</em>
        </button>
        <button 
          type="button"
          class="btn btn-secondary toolbar-btn"
          :class="{ 'btn-primary': editor?.isActive('underline') }"
          @click="editor?.chain().focus().toggleUnderline().run()"
          title="下划线"
        >
          <u>U</u>
        </button>
      </div>
      
      <div class="toolbar-group">
        <button 
          type="button"
          class="btn btn-secondary toolbar-btn"
          :class="{ 'btn-primary': editor?.isActive('heading', { level: 1 }) }"
          @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
          title="标题1"
        >
          H1
        </button>
        <button 
          type="button"
          class="btn btn-secondary toolbar-btn"
          :class="{ 'btn-primary': editor?.isActive('heading', { level: 2 }) }"
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          title="标题2"
        >
          H2
        </button>
        <button 
          type="button"
          class="btn btn-secondary toolbar-btn"
          :class="{ 'btn-primary': editor?.isActive('heading', { level: 3 }) }"
          @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
          title="标题3"
        >
          H3
        </button>
      </div>
      
      <div class="toolbar-group">
        <button 
          type="button"
          class="btn btn-secondary toolbar-btn"
          :class="{ 'btn-primary': editor?.isActive('bulletList') }"
          @click="editor?.chain().focus().toggleBulletList().run()"
          title="无序列表"
        >
          •
        </button>
        <button 
          type="button"
          class="btn btn-secondary toolbar-btn"
          :class="{ 'btn-primary': editor?.isActive('orderedList') }"
          @click="editor?.chain().focus().toggleOrderedList().run()"
          title="有序列表"
        >
          1.
        </button>
        <button 
          type="button"
          class="btn btn-secondary toolbar-btn"
          @click="editor?.chain().focus().toggleBlockquote().run()"
          title="引用"
        >
          "
        </button>
      </div>
      
      <div class="toolbar-group">
        <button 
          type="button"
          class="btn btn-secondary toolbar-btn"
          @click="editor?.chain().focus().undo().run()"
          title="撤销"
        >
          ↶
        </button>
        <button 
          type="button"
          class="btn btn-secondary toolbar-btn"
          @click="editor?.chain().focus().redo().run()"
          title="重做"
        >
          ↷
        </button>
      </div>
    </div>
    
    <div class="editor-content" :class="{ 'readonly': readonly }">
      <editor-content 
        :editor="editor" 
        class="editor-body"
      />
    </div>
    
    <div class="editor-footer mt-sm">
      <div class="word-count">
        <span>字数: {{ wordCount }}</span>
        <span class="ml-md">段落: {{ paragraphCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

// 定义props
interface Props {
  modelValue?: string;
  readonly?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  readonly: false,
  placeholder: '请输入内容...'
});

// 定义emit
const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [value: string];
}>();

// 编辑器实例
const editor = ref<Editor | null>(null);

// 字数统计
const wordCount = computed(() => {
  if (!editor.value) return 0;
  return editor.value.storage.characterCount.characters();
});

// 段落数统计
const paragraphCount = computed(() => {
  if (!editor.value) return 0;
  return editor.value.state.doc.content.childCount;
});

// 监听编辑器内容变化
watch(
  () => editor.value?.getHTML(), 
  (html) => {
    if (html !== undefined) {
      emit('update:modelValue', html);
      emit('change', html);
    }
  },
  { immediate: true }
);

// 初始化编辑器
onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue,
    editable: !props.readonly,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Underline,
    ],
    onUpdate: () => {
      if (editor.value) {
        emit('update:modelValue', editor.value.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'editor-input',
        placeholder: props.placeholder,
      }
    }
  });
});

// 销毁编辑器
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

// 监听只读状态变化
watch(
  () => props.readonly,
  (readonly) => {
    if (editor.value) {
      editor.value.setEditable(!readonly);
    }
  }
);

// 监听外部传入内容变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && newValue !== editor.value.getHTML()) {
      editor.value.commands.setContent(newValue, false);
    }
  }
);
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background-color: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
}

.toolbar-group {
  display: flex;
  gap: var(--spacing-xs);
}

.toolbar-btn {
  min-width: auto;
  padding: var(--spacing-xs) var(--spacing-sm);
  height: auto;
  line-height: 1;
}

.editor-content {
  min-height: 200px;
  padding: var(--spacing-md);
  background: var(--bg-primary);
}

.editor-content.readonly {
  background-color: var(--bg-tertiary);
}

.editor-body {
  min-height: 150px;
}

.editor-body :deep(.ProseMirror) {
  min-height: 150px;
  outline: none;
}

.editor-body :deep(.ProseMirror p.is-empty::before) {
  content: attr(data-placeholder);
  float: left;
  color: var(--text-tertiary);
  pointer-events: none;
  user-select: none;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>