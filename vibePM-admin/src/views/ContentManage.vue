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
            <el-option label="待审核" value="pending" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
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

      <el-table :data="contentList" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="内容" min-width="300">
          <template #default="{ row }">
            <div class="content-cell">
              <img :src="row.cover" alt="cover" class="content-cover" />
              <div class="content-info">
                <div class="content-title">{{ row.title }}</div>
                <div class="content-meta">
                  <span>{{ row.author }}</span>
                  <span>{{ row.category }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览量" width="100" />
        <el-table-column prop="likes" label="点赞数" width="100" />
        <el-table-column prop="createTime" label="发布时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
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
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Check } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

const searchForm = reactive({ keyword: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const contentList = ref([])
const selectedIds = ref([])

const mockContent = [
  { id: 1, title: 'API 就像餐厅服务员：三分钟读懂接口原理', author: '技术小白', category: '基础概念', cover: 'https://picsum.photos/seed/api1/100/80', status: 'published', views: 1205, likes: 89, createTime: '2026-04-01 10:00:00' },
  { id: 2, title: '2026年全栈开发选型指南', author: '架构师老王', category: '技术选型', cover: 'https://picsum.photos/seed/wp2/100/80', status: 'pending', views: 892, likes: 56, createTime: '2026-04-05 14:30:00' },
  { id: 3, title: 'React vs Vue：2026年该选哪一个？', author: '效率达人阿强', category: '框架对比', cover: 'https://picsum.photos/seed/rv3/100/80', status: 'published', views: 3421, likes: 234, createTime: '2026-04-08 09:15:00' },
  { id: 4, title: '从零开始：18天掌握 AI 产品经理技能树', author: '职场导师Lily', category: '学习路径', cover: 'https://picsum.photos/seed/ai4/100/80', status: 'rejected', views: 567, likes: 45, createTime: '2026-04-12 16:45:00' },
  { id: 5, title: '电商网站全栈选型指南', author: '技术宅小明', category: '技术选型', cover: 'https://picsum.photos/seed/ec5/100/80', status: 'published', views: 231, likes: 23, createTime: '2026-04-15 11:20:00' }
]

function getStatusType(status) {
  const types = { published: 'success', pending: 'warning', rejected: 'danger' }
  return types[status] || 'info'
}

function getStatusLabel(status) {
  const labels = { published: '已发布', pending: '待审核', rejected: '已驳回' }
  return labels[status] || status
}

function loadData() {
  contentList.value = mockContent
  pagination.total = mockContent.length
}

function handleSearch() {
  ElMessage.success('搜索完成')
  loadData()
}

function resetSearch() {
  searchForm.keyword = ''
  searchForm.status = ''
  loadData()
}

function handleSelectionChange(selection) {
  selectedIds.value = selection.map(item => item.id)
}

function handleAdd() {
  ElMessage.info('发布内容功能开发中')
}

function handleEdit(row) {
  ElMessage.info(`编辑内容: ${row.title}`)
}

function handleAudit(row, status) {
  const action = status === 'published' ? '通过' : '驳回'
  ElMessageBox.confirm(`确定要${action}该内容吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = status
    ElMessage.success(`${action}成功`)
  }).catch(() => {})
}

function handleDelete(row) {
  ElMessageBox.confirm('确定要删除该内容吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(() => {
    const index = contentList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      contentList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

function handleBatchAudit() {
  ElMessage.success(`批量审核 ${selectedIds.value.length} 条内容`)
}

onMounted(() => {
  loadData()
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
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
