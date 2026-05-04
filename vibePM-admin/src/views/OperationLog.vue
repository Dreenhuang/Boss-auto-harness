<template>
  <div class="operation-log">
    <el-alert
      v-if="authStore.isSuperAdmin"
      title="操作日志"
      type="info"
      description="记录所有管理员的操作行为，支持按模块、操作类型、时间范围筛选查询。"
      show-icon
      :closable="false"
      class="permission-alert"
    />

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="操作模块">
          <el-select v-model="searchForm.module" placeholder="全部" clearable style="width: 150px">
            <el-option label="用户管理" value="user" />
            <el-option label="角色权限" value="role" />
            <el-option label="内容管理" value="content" />
            <el-option label="系统设置" value="system" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="searchForm.action" placeholder="全部" clearable style="width: 150px">
            <el-option label="创建" value="create" />
            <el-option label="更新" value="update" />
            <el-option label="删除" value="delete" />
            <el-option label="审核" value="audit" />
            <el-option label="登录" value="login" />
            <el-option label="清空" value="clear" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
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
          <span>日志列表</span>
          <el-button
            v-if="authStore.hasPermission('log:clear')"
            type="danger"
            @click="handleClear"
          >
            <el-icon><Delete /></el-icon>
            清空日志
          </el-button>
        </div>
      </template>

      <el-table :data="logList" stripe v-loading="loading">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="createdAt" label="操作时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="module" label="模块" width="120">
          <template #default="{ row }">
            <el-tag :type="getModuleType(row.module)" size="small">
              {{ getModuleLabel(row.module) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" width="100">
          <template #default="{ row }">
            <el-tag :type="getActionType(row.action)" size="small">
              {{ getActionLabel(row.action) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip />
        <el-table-column prop="ip" label="IP地址" width="130" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
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

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="日志详情" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="操作ID">{{ currentLog?.id }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ formatDate(currentLog?.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="操作人">{{ currentLog?.operator }}</el-descriptions-item>
        <el-descriptions-item label="操作模块">{{ getModuleLabel(currentLog?.module) }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">{{ getActionLabel(currentLog?.action) }}</el-descriptions-item>
        <el-descriptions-item label="操作描述">{{ currentLog?.description }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ currentLog?.ip }}</el-descriptions-item>
        <el-descriptions-item label="用户代理">{{ currentLog?.userAgent }}</el-descriptions-item>
        <el-descriptions-item label="详细数据">
          <pre class="json-preview">{{ JSON.stringify(currentLog?.details, null, 2) }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Delete } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth.js'
import { logApi } from '../api'

const authStore = useAuthStore()
const loading = ref(false)

const searchForm = reactive({
  module: '',
  action: '',
  dateRange: []
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const logList = ref([])
const detailVisible = ref(false)
const currentLog = ref(null)

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

function getModuleType(module) {
  const types = { user: 'primary', role: 'warning', content: 'success', system: 'info' }
  return types[module] || 'info'
}

function getModuleLabel(module) {
  const labels = { user: '用户管理', role: '角色权限', content: '内容管理', system: '系统设置' }
  return labels[module] || module
}

function getActionType(action) {
  const types = { create: 'success', update: 'primary', delete: 'danger', audit: 'warning', login: 'info', clear: 'danger' }
  return types[action] || 'info'
}

function getActionLabel(action) {
  const labels = { create: '创建', update: '更新', delete: '删除', audit: '审核', login: '登录', clear: '清空' }
  return labels[action] || action
}

async function loadData() {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      module: searchForm.module,
      action: searchForm.action
    }
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    const res = await logApi.getList(params)
    logList.value = res.list || []
    pagination.total = res.total || 0
  } catch (error) {
    console.error('加载日志失败:', error)
    ElMessage.error('加载日志失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  loadData()
}

function resetSearch() {
  searchForm.module = ''
  searchForm.action = ''
  searchForm.dateRange = []
  pagination.page = 1
  loadData()
}

function handleDetail(row) {
  currentLog.value = row
  detailVisible.value = true
}

function handleClear() {
  ElMessageBox.confirm('确定要清空所有操作日志吗？此操作不可恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await logApi.clear()
      ElMessage.success('日志已清空')
      loadData()
    } catch (error) {
      ElMessage.error('清空日志失败')
    }
  }).catch(() => {})
}

function handlePageChange() {
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.operation-log {
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

.json-preview {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
}
</style>