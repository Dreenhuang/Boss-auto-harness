<template>
  <div class="content-manage">
    <el-alert
      v-if="authStore.isSuperAdmin"
      title="超级管理员内容权限"
      type="success"
      description="您可以查看、创建、编辑、删除、审核所有内容，拥有完整的内容管理权限。"
      show-icon
      :closable="false"
      class="permission-alert"
    />

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="标题/作者" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
            <el-option label="待审核" value="pending" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="来源">
          <el-select v-model="searchForm.source" placeholder="全部" clearable style="width: 120px">
            <el-option label="手动创建" value="manual" />
            <el-option label="AI生成" value="ai" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="table-card">
      <template #header>
        <div class="table-header">
          <span>内容列表</span>
          <div class="table-actions">
            <el-button
              v-if="authStore.hasPermission('content:create')"
              type="primary"
              @click="handleAdd"
            >
              <el-icon><Plus /></el-icon>
              发布内容
            </el-button>
            <el-button
              v-if="authStore.hasPermission('content:create')"
              type="success"
              @click="handleAIGenerate"
            >
              <el-icon><MagicStick /></el-icon>
              AI批量生成
            </el-button>
            <el-button
              v-if="authStore.hasPermission('content:audit')"
              type="warning"
              :disabled="!selectedIds.length"
              @click="handleBatchAudit"
            >
              <el-icon><Check /></el-icon>
              批量审核
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="contentList" stripe v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="内容" min-width="300">
          <template #default="{ row }">
            <div class="content-cell">
              <img :src="row.image || row.cover" alt="cover" class="content-cover" />
              <div class="content-info">
                <div class="content-title">{{ row.title }}</div>
                <div class="content-meta">
                  <span>{{ row.author }}</span>
                  <span>{{ row.category }}</span>
                  <el-tag v-if="row.ai_generated" type="success" size="small">AI</el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览量" width="100" />
        <el-table-column prop="likes" label="点赞数" width="100" />
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="authStore.hasPermission('content:edit')"
              link
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="authStore.hasPermission('content:audit') && row.status === 'pending'"
              link
              type="success"
              @click="handleAudit(row, 'published')"
            >
              通过
            </el-button>
            <el-button
              v-if="authStore.hasPermission('content:audit') && row.status === 'pending'"
              link
              type="warning"
              @click="handleAudit(row, 'rejected')"
            >
              驳回
            </el-button>
            <el-button
              v-if="authStore.hasPermission('content:edit') && row.status === 'draft'"
              link
              type="primary"
              @click="handleSchedule(row)"
            >
              定时发布
            </el-button>
            <el-button
              v-if="authStore.hasPermission('content:delete')"
              link
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
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

    <!-- 发布/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑内容' : '发布内容'"
      width="800px"
      destroy-on-close
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="输入内容标题" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="form.author" placeholder="作者名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="选择分类">
            <el-option label="基础概念" value="基础概念" />
            <el-option label="技术选型" value="技术选型" />
            <el-option label="学习路径" value="学习路径" />
            <el-option label="框架对比" value="框架对比" />
            <el-option label="实战方案" value="实战方案" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="选择类型">
            <el-option label="推荐" value="recommend" />
            <el-option label="实战方案" value="practice" />
            <el-option label="技术模型" value="tech" />
            <el-option label="AI指标" value="ai" />
            <el-option label="入门指南" value="guide" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="form.image" placeholder="图片URL">
            <template #append>
              <el-button @click="handleGenerateImage">AI生成</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="10"
            placeholder="支持Markdown格式"
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            placeholder="输入标签"
          />
        </el-form-item>
        <el-form-item label="发布方式">
          <el-radio-group v-model="publishMode">
            <el-radio label="now">立即发布</el-radio>
            <el-radio label="schedule">定时发布</el-radio>
            <el-radio label="draft">保存草稿</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="publishMode === 'schedule'" label="发布时间">
          <el-date-picker
            v-model="form.scheduled_at"
            type="datetime"
            placeholder="选择发布时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          {{ isEdit ? '保存' : '发布' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- AI批量生成弹窗 -->
    <el-dialog v-model="aiDialogVisible" title="AI批量生成内容" width="500px">
      <el-form :model="aiForm" label-width="100px">
        <el-form-item label="提示词模板">
          <el-select v-model="aiForm.prompt_key" placeholder="选择提示词模板">
            <el-option
              v-for="p in promptList"
              :key="p.key"
              :label="p.name"
              :value="p.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生成数量">
          <el-slider v-model="aiForm.count" :min="1" :max="20" show-stops />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="aiForm.category" placeholder="选择分类">
            <el-option label="基础概念" value="基础概念" />
            <el-option label="技术选型" value="技术选型" />
            <el-option label="学习路径" value="学习路径" />
            <el-option label="框架对比" value="框架对比" />
            <el-option label="实战方案" value="实战方案" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="aiForm.type" placeholder="选择类型">
            <el-option label="推荐" value="recommend" />
            <el-option label="实战方案" value="practice" />
            <el-option label="技术模型" value="tech" />
            <el-option label="AI指标" value="ai" />
            <el-option label="入门指南" value="guide" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="aiDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAIGenerateSubmit" :loading="aiLoading">
          开始生成
        </el-button>
      </template>
    </el-dialog>

    <!-- 定时发布弹窗 -->
    <el-dialog v-model="scheduleDialogVisible" title="设置定时发布" width="400px">
      <el-form :model="scheduleForm" label-width="100px">
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="scheduleForm.scheduled_at"
            type="datetime"
            placeholder="选择发布时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="scheduleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleScheduleSubmit" :loading="scheduleLoading">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Check, MagicStick } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth.js'
import { contentApi, promptApi } from '../api'

const authStore = useAuthStore()
const loading = ref(false)
const submitLoading = ref(false)
const aiLoading = ref(false)
const scheduleLoading = ref(false)
const dialogVisible = ref(false)
const aiDialogVisible = ref(false)
const scheduleDialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const publishMode = ref('now')

const searchForm = reactive({ keyword: '', status: '', source: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const contentList = ref([])
const selectedIds = ref([])
const promptList = ref([])

const form = reactive({
  id: null,
  title: '',
  author: '管理员',
  category: '',
  type: 'recommend',
  image: '',
  content: '',
  tags: [],
  scheduled_at: ''
})

const aiForm = reactive({
  prompt_key: '',
  count: 5,
  category: '',
  type: 'recommend'
})

const scheduleForm = reactive({
  id: null,
  scheduled_at: ''
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

function getStatusType(status) {
  const types = { published: 'success', draft: 'info', pending: 'warning', rejected: 'danger', approved: 'primary' }
  return types[status] || 'info'
}

function getStatusLabel(status) {
  const labels = { published: '已发布', draft: '草稿', pending: '待审核', rejected: '已驳回', approved: '已通过' }
  return labels[status] || status
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

async function loadData() {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword,
      status: searchForm.status,
      source: searchForm.source
    }
    const res = await contentApi.getList(params)
    contentList.value = res.list || []
    pagination.total = res.total || 0
  } catch (error) {
    console.error('加载内容失败:', error)
    ElMessage.error('加载内容失败')
  } finally {
    loading.value = false
  }
}

async function loadPrompts() {
  try {
    const res = await promptApi.getList()
    promptList.value = res || []
  } catch (error) {
    console.error('加载提示词失败:', error)
  }
}

function handleSearch() {
  pagination.page = 1
  loadData()
}

function resetSearch() {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.source = ''
  pagination.page = 1
  loadData()
}

function handleSelectionChange(selection) {
  selectedIds.value = selection.map(item => item.id)
}

function handleAdd() {
  isEdit.value = false
  publishMode.value = 'now'
  Object.assign(form, {
    id: null,
    title: '',
    author: '管理员',
    category: '',
    type: 'recommend',
    image: '',
    content: '',
    tags: [],
    scheduled_at: ''
  })
  dialogVisible.value = true
}

function handleEdit(row) {
  isEdit.value = true
  publishMode.value = 'now'
  Object.assign(form, {
    id: row.id,
    title: row.title,
    author: row.author,
    category: row.category,
    type: row.type || 'recommend',
    image: row.image || row.cover,
    content: row.content,
    tags: row.tags || [],
    scheduled_at: row.scheduled_at || ''
  })
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const data = {
      title: form.title,
      author: form.author,
      category: form.category,
      type: form.type,
      image: form.image,
      content: form.content,
      tags: form.tags
    }

    if (publishMode.value === 'draft') {
      data.status = 'draft'
    } else if (publishMode.value === 'schedule') {
      data.status = 'approved'
      data.scheduled_at = form.scheduled_at
    } else {
      data.status = 'published'
    }

    if (isEdit.value) {
      await contentApi.update(form.id, data)
      ElMessage.success('更新成功')
    } else {
      await contentApi.create(data)
      ElMessage.success('发布成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitLoading.value = false
  }
}

function handleAudit(row, status) {
  const action = status === 'published' ? '通过' : '驳回'
  ElMessageBox.confirm(`确定要${action}该内容吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await contentApi.audit(row.id, status)
      ElMessage.success(`${action}成功`)
      loadData()
    } catch (error) {
      ElMessage.error(`${action}失败`)
    }
  }).catch(() => {})
}

function handleBatchAudit() {
  ElMessageBox.prompt('请输入审核意见', '批量审核', {
    confirmButtonText: '通过',
    cancelButtonText: '驳回',
    distinguishCancelAndClose: true
  }).then(async ({ value }) => {
    try {
      await contentApi.batchAudit(selectedIds.value, 'published')
      ElMessage.success('批量通过成功')
      loadData()
    } catch (error) {
      ElMessage.error('批量审核失败')
    }
  }).catch(async (action) => {
    if (action === 'cancel') {
      try {
        await contentApi.batchAudit(selectedIds.value, 'rejected')
        ElMessage.success('批量驳回成功')
        loadData()
      } catch (error) {
        ElMessage.error('批量审核失败')
      }
    }
  })
}

function handleDelete(row) {
  ElMessageBox.confirm('确定要删除该内容吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(async () => {
    try {
      await contentApi.delete(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

function handleSchedule(row) {
  scheduleForm.id = row.id
  scheduleForm.scheduled_at = ''
  scheduleDialogVisible.value = true
}

async function handleScheduleSubmit() {
  if (!scheduleForm.scheduled_at) {
    ElMessage.warning('请选择发布时间')
    return
  }
  scheduleLoading.value = true
  try {
    await contentApi.schedule(scheduleForm.id, scheduleForm.scheduled_at)
    ElMessage.success('定时发布已设置')
    scheduleDialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('设置失败')
  } finally {
    scheduleLoading.value = false
  }
}

function handleAIGenerate() {
  aiForm.prompt_key = promptList.value[0]?.key || ''
  aiForm.count = 5
  aiDialogVisible.value = true
}

async function handleAIGenerateSubmit() {
  if (!aiForm.prompt_key) {
    ElMessage.warning('请选择提示词模板')
    return
  }
  aiLoading.value = true
  try {
    await contentApi.aiGenerate({
      prompt_key: aiForm.prompt_key,
      count: aiForm.count,
      category: aiForm.category,
      type: aiForm.type
    })
    ElMessage.success(`成功生成 ${aiForm.count} 条内容草稿`)
    aiDialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('生成失败')
  } finally {
    aiLoading.value = false
  }
}

function handleGenerateImage() {
  ElMessage.info('AI图片生成功能开发中')
}

function handlePageChange() {
  loadData()
}

onMounted(() => {
  loadData()
  loadPrompts()
})
</script>

<style scoped>
.content-manage {
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

.table-actions {
  display: flex;
  gap: 12px;
}

.content-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.content-cover {
  width: 80px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
}

.content-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.content-title {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}

.content-meta {
  font-size: 12px;
  color: #999999;
  display: flex;
  gap: 12px;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>