<template>
  <div class="user-manage">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="用户名/手机号/ID"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="正常" value="active" />
            <el-option label="禁用" value="banned" />
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
          <span>用户列表</span>
          <div class="table-actions">
            <el-button
              v-if="authStore.hasPermission('user:create')"
              type="primary"
              @click="handleAdd"
            >
              <el-icon><Plus /></el-icon>
              添加用户
            </el-button>
            <el-button
              v-if="authStore.hasPermission('user:delete')"
              type="danger"
              :disabled="!selectedIds.length"
              @click="handleBatchDelete"
            >
              <el-icon><Delete /></el-icon>
              批量删除
            </el-button>
          </div>
        </div>
      </template>

      <!-- 数据表格 -->
      <el-table
        :data="userList"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="用户" min-width="200">
          <template #default="{ row }">
            <div class="user-cell">
              <img :src="row.avatar" alt="avatar" class="user-avatar-small" />
              <div class="user-info-cell">
                <div class="user-name">{{ row.name }}</div>
                <div class="user-phone">{{ row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'super_admin' ? 'danger' : 'info'">
              {{ getRoleLabel(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="studyDays" label="学习天数" width="100" />
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="authStore.hasPermission('user:edit')"
              link
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="authStore.hasPermission('user:ban')"
              link
              :type="row.status === 'active' ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button
              v-if="authStore.hasPermission('user:delete')"
              link
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        class="pagination"
        @change="handlePageChange"
      />
    </el-card>

    <!-- 添加/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="form.name" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option
              v-for="role in authStore.getRoles()"
              :key="role.name"
              :label="role.label"
              :value="role.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="active">正常</el-radio>
            <el-radio label="banned">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Delete } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 用户列表
const userList = ref([])
const selectedIds = ref([])

// 弹窗
const dialogVisible = ref(false)
const dialogType = ref('add')
const form = reactive({
  id: null,
  name: '',
  phone: '',
  role: 'viewer',
  status: 'active'
})

// 模拟数据
const mockUsers = [
  { id: 1, name: '张三', phone: '138****1234', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zhang&backgroundColor=b6e3f4', role: 'admin', status: 'active', studyDays: 15, createTime: '2026-04-01 10:00:00' },
  { id: 2, name: '李四', phone: '139****5678', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Li&backgroundColor=c0aede', role: 'editor', status: 'active', studyDays: 8, createTime: '2026-04-05 14:30:00' },
  { id: 3, name: '王五', phone: '137****9012', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Wang&backgroundColor=d1d4f9', role: 'viewer', status: 'banned', studyDays: 3, createTime: '2026-04-10 09:15:00' },
  { id: 4, name: '赵六', phone: '136****3456', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zhao&backgroundColor=ffd5dc', role: 'viewer', status: 'active', studyDays: 22, createTime: '2026-04-12 16:45:00' },
  { id: 5, name: '钱七', phone: '135****7890', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Qian&backgroundColor=ffdfbf', role: 'editor', status: 'active', studyDays: 12, createTime: '2026-04-15 11:20:00' }
]

// 获取角色标签
function getRoleLabel(role) {
  const labels = {
    super_admin: '超级管理员',
    admin: '管理员',
    editor: '内容编辑',
    viewer: '数据查看员'
  }
  return labels[role] || role
}

// 加载数据
function loadData() {
  userList.value = mockUsers
  pagination.total = mockUsers.length
}

// 搜索
function handleSearch() {
  ElMessage.success('搜索完成')
  loadData()
}

// 重置搜索
function resetSearch() {
  searchForm.keyword = ''
  searchForm.status = ''
  loadData()
}

// 选择变化
function handleSelectionChange(selection) {
  selectedIds.value = selection.map(item => item.id)
}

// 添加用户
function handleAdd() {
  dialogType.value = 'add'
  form.id = null
  form.name = ''
  form.phone = ''
  form.role = 'viewer'
  form.status = 'active'
  dialogVisible.value = true
}

// 编辑用户
function handleEdit(row) {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 切换状态
function handleToggleStatus(row) {
  const action = row.status === 'active' ? '禁用' : '启用'
  ElMessageBox.confirm(`确定要${action}该用户吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = row.status === 'active' ? 'banned' : 'active'
    ElMessage.success(`${action}成功`)
  }).catch(() => {})
}

// 删除用户
function handleDelete(row) {
  ElMessageBox.confirm('确定要删除该用户吗？此操作不可恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(() => {
    const index = userList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      userList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

// 批量删除
function handleBatchDelete() {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 个用户吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(() => {
    userList.value = userList.value.filter(item => !selectedIds.value.includes(item.id))
    selectedIds.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}

// 提交表单
function handleSubmit() {
  if (dialogType.value === 'add') {
    const newUser = {
      id: Date.now(),
      ...form,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${form.name}&backgroundColor=b6e3f4`,
      studyDays: 0,
      createTime: new Date().toLocaleString()
    }
    userList.value.unshift(newUser)
    ElMessage.success('添加成功')
  } else {
    const index = userList.value.findIndex(item => item.id === form.id)
    if (index > -1) {
      userList.value[index] = { ...userList.value[index], ...form }
      ElMessage.success('更新成功')
    }
  }
  dialogVisible.value = false
}

// 分页变化
function handlePageChange() {
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.user-manage {
  padding-bottom: 24px;
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

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-info-cell {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}

.user-phone {
  font-size: 12px;
  color: #999999;
  margin-top: 2px;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
