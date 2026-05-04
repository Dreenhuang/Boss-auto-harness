<template>
  <div class="prompt-manage">
    <el-alert
      v-if="authStore.isSuperAdmin"
      title="提示词管理"
      type="info"
      description="管理系统中所有AI提示词模板，支持自定义修改。提示词用于AI图片生成、内容摘要、学习引导等功能。"
      show-icon
      :closable="false"
      class="permission-alert"
    />

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="全部" clearable style="width: 150px">
            <el-option label="全部" value="all" />
            <el-option label="AI生成" value="ai" />
            <el-option label="系统" value="system" />
            <el-option label="通用" value="general" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="名称/标识" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="success" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新建提示词
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 提示词列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="table-header">
          <span>提示词列表</span>
          <el-tag type="info">共 {{ pagination.total }} 条</el-tag>
        </div>
      </template>

      <el-table :data="promptList" stripe v-loading="loading">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="key" label="标识" width="150">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.key }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category)" size="small">
              {{ getCategoryLabel(row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="content" label="内容预览" min-width="250" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="content-preview">{{ row.content.substring(0, 80) }}...</span>
          </template>
        </el-table-column>
        <el-table-column prop="is_active" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.is_active"
              @change="(val) => toggleStatus(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        class="pagination"
        @change="handlePageChange"
      />
    </el-card>

    <!-- 编辑/创建弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑提示词' : '新建提示词'"
      width="700px"
      destroy-on-close
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标识(key)" prop="key" v-if="!isEdit">
          <el-input v-model="form.key" placeholder="唯一标识，如：image_generation" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="提示词名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="选择分类">
            <el-option label="AI生成" value="ai" />
            <el-option label="系统" value="system" />
            <el-option label="通用" value="general" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="提示词用途描述" />
        </el-form-item>
        <el-form-item label="提示词内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="8"
            placeholder="输入提示词内容，可用 {变量名} 表示动态变量"
          />
        </el-form-item>
        <el-form-item label="变量">
          <div class="variables-area">
            <el-tag
              v-for="(v, i) in form.variables"
              :key="i"
              closable
              @close="removeVariable(i)"
              class="variable-tag"
            >
              {{ v }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="variableInputRef"
              v-model="inputValue"
              size="small"
              style="width: 120px"
              @keyup.enter="addVariable"
              @blur="addVariable"
            />
            <el-button v-else size="small" @click="showInput">
              <el-icon><Plus /></el-icon> 添加变量
            </el-button>
          </div>
          <div class="form-tip">变量格式：在提示词内容中使用 {变量名} 占位</div>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.is_active" active-text="启用" inactive-text="禁用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth.js'
import { promptApi } from '../api'

const authStore = useAuthStore()
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const inputVisible = ref(false)
const inputValue = ref('')
const variableInputRef = ref(null)

const searchForm = reactive({
  category: 'all',
  keyword: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const form = reactive({
  key: '',
  name: '',
  category: 'general',
  description: '',
  content: '',
  variables: [],
  is_active: true
})

const rules = {
  key: [{ required: true, message: '请输入标识', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  content: [{ required: true, message: '请输入提示词内容', trigger: 'blur' }]
}

const promptList = ref([])

function getCategoryType(category) {
  const types = { ai: 'success', system: 'warning', general: 'info' }
  return types[category] || 'info'
}

function getCategoryLabel(category) {
  const labels = { ai: 'AI生成', system: '系统', general: '通用' }
  return labels[category] || category
}

async function loadData() {
  loading.value = true
  try {
    const params = {
      category: searchForm.category === 'all' ? '' : searchForm.category,
      keyword: searchForm.keyword
    }
    const res = await promptApi.getList(params)
    promptList.value = res || []
    pagination.total = res?.length || 0
  } catch (error) {
    console.error('加载提示词失败:', error)
    ElMessage.error('加载提示词失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  loadData()
}

function resetSearch() {
  searchForm.category = 'all'
  searchForm.keyword = ''
  loadData()
}

function handleCreate() {
  isEdit.value = false
  Object.assign(form, {
    key: '',
    name: '',
    category: 'general',
    description: '',
    content: '',
    variables: [],
    is_active: true
  })
  dialogVisible.value = true
}

function handleEdit(row) {
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    key: row.key,
    name: row.name,
    category: row.category,
    description: row.description,
    content: row.content,
    variables: row.variables || [],
    is_active: row.is_active
  })
  dialogVisible.value = true
}

async function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除提示词 "${row.name}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await promptApi.delete(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

async function toggleStatus(row, val) {
  try {
    await promptApi.update(row.id, { is_active: val })
    ElMessage.success(val ? '已启用' : '已禁用')
  } catch (error) {
    row.is_active = !val
    ElMessage.error('状态更新失败')
  }
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value) {
      await promptApi.update(form.id, {
        name: form.name,
        category: form.category,
        description: form.description,
        content: form.content,
        variables: form.variables,
        is_active: form.is_active
      })
      ElMessage.success('更新成功')
    } else {
      await promptApi.create({
        key: form.key,
        name: form.name,
        category: form.category,
        description: form.description,
        content: form.content,
        variables: form.variables,
        is_active: form.is_active
      })
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitLoading.value = false
  }
}

function showInput() {
  inputVisible.value = true
  nextTick(() => {
    variableInputRef.value?.focus()
  })
}

function addVariable() {
  if (inputValue.value) {
    form.variables.push(inputValue.value)
    inputValue.value = ''
  }
  inputVisible.value = false
}

function removeVariable(index) {
  form.variables.splice(index, 1)
}

function handlePageChange() {
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.prompt-manage {
  padding-bottom: 24px;
}

.permission-alert {
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.content-preview {
  color: #999;
  font-size: 13px;
}

.variables-area {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.variable-tag {
  margin-right: 0;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>