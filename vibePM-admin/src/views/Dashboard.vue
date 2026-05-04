<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon" style="background: #e6f7ff; color: #1890ff;">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalUsers || '12,580' }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon" style="background: #f6ffed; color: #52c41a;">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.newUsersToday || '1,234' }}</div>
            <div class="stat-label">今日新增</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon" style="background: #fff7e6; color: #fa8c16;">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalContent || '3,456' }}</div>
            <div class="stat-label">内容总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon" style="background: #fff1f0; color: #f5222d;">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.dailyActiveRate || '89.5' }}%</div>
            <div class="stat-label">日活跃度</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- ECharts 图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="chart-header">
              <span>近7天数据趋势</span>
            </div>
          </template>
          <v-chart class="chart" :option="trendOption" autoresize />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="chart-header">
              <span>用户来源分布</span>
            </div>
          </template>
          <v-chart class="chart" :option="sourceOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- 权限提示（仅超级管理员可见） -->
    <el-alert
      v-if="authStore.isSuperAdmin"
      title="超级管理员权限已激活"
      type="success"
      description="您拥有系统的所有功能模块访问权限和操作权限，包括用户管理、角色配置、权限分配、系统设置、数据管理等核心功能。"
      show-icon
      :closable="false"
      class="permission-alert"
    />

    <!-- 功能模块权限展示 -->
    <el-card class="permission-card">
      <template #header>
        <div class="card-header">
          <span>权限概览</span>
          <el-tag v-if="authStore.isSuperAdmin" type="danger">全部权限</el-tag>
          <el-tag v-else type="info">部分权限</el-tag>
        </div>
      </template>

      <el-table :data="permissionList" style="width: 100%">
        <el-table-column prop="module" label="功能模块" width="150" />
        <el-table-column prop="permission" label="权限项" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.has" type="success">已授权</el-tag>
            <el-tag v-else type="info">未授权</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 快捷操作 -->
    <el-card class="quick-actions">
      <template #header>
        <span>快捷操作</span>
      </template>
      <el-row :gutter="16">
        <el-col :span="4">
          <el-button
            type="primary"
            class="action-btn"
            :disabled="!authStore.hasPermission('user:create')"
            @click="$router.push('/users')"
          >
            <el-icon><Plus /></el-icon>
            添加用户
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            type="success"
            class="action-btn"
            :disabled="!authStore.hasPermission('content:create')"
            @click="$router.push('/content')"
          >
            <el-icon><DocumentAdd /></el-icon>
            发布内容
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            type="warning"
            class="action-btn"
            :disabled="!authStore.hasPermission('role:view')"
            @click="$router.push('/roles')"
          >
            <el-icon><Key /></el-icon>
            角色管理
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            type="info"
            class="action-btn"
            :disabled="!authStore.hasPermission('data:export')"
            @click="handleExport"
          >
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { User, UserFilled, Document, TrendCharts, Plus, DocumentAdd, Key, Download } from '@element-plus/icons-vue'
import { useAuthStore, PERMISSIONS } from '../stores/auth.js'
import { statsApi } from '../api'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent, TooltipComponent, LegendComponent, TitleComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer, LineChart, PieChart,
  GridComponent, TooltipComponent, LegendComponent, TitleComponent
])

const authStore = useAuthStore()
const stats = ref({})

// 近7天趋势图
const trendOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['新增用户', '活跃用户数'],
    bottom: 0
  },
  grid: {
    left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '新增用户',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210],
      itemStyle: { color: '#FF2442' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 36, 66, 0.3)' },
            { offset: 1, color: 'rgba(255, 36, 66, 0.05)' }
          ]
        }
      }
    },
    {
      name: '活跃用户数',
      type: 'line',
      smooth: true,
      data: [220, 182, 191, 234, 290, 330, 310],
      itemStyle: { color: '#1890ff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
          ]
        }
      }
    }
  ]
})

// 用户来源饼图
const sourceOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}\n{d}%'
      },
      data: [
        { value: 4350, name: '直接访问', itemStyle: { color: '#FF2442' } },
        { value: 3100, name: '搜索引擎', itemStyle: { color: '#FF4D6A' } },
        { value: 2340, name: '社交媒体', itemStyle: { color: '#FF8095' } },
        { value: 1350, name: '推荐链接', itemStyle: { color: '#FFB3C1' } },
        { value: 580, name: '其他', itemStyle: { color: '#FFD6DE' } }
      ]
    }
  ]
})

const permissionList = computed(() => [
  { module: '仪表盘', permission: '查看仪表盘', has: authStore.hasPermission(PERMISSIONS.DASHBOARD_VIEW) },
  { module: '用户管理', permission: '查看用户列表', has: authStore.hasPermission(PERMISSIONS.USER_VIEW) },
  { module: '用户管理', permission: '创建用户', has: authStore.hasPermission(PERMISSIONS.USER_CREATE) },
  { module: '用户管理', permission: '编辑用户', has: authStore.hasPermission(PERMISSIONS.USER_EDIT) },
  { module: '用户管理', permission: '删除用户', has: authStore.hasPermission(PERMISSIONS.USER_DELETE) },
  { module: '用户管理', permission: '禁用/启用用户', has: authStore.hasPermission(PERMISSIONS.USER_BAN) },
  { module: '角色权限', permission: '查看角色', has: authStore.hasPermission(PERMISSIONS.ROLE_VIEW) },
  { module: '角色权限', permission: '创建角色', has: authStore.hasPermission(PERMISSIONS.ROLE_CREATE) },
  { module: '角色权限', permission: '编辑角色', has: authStore.hasPermission(PERMISSIONS.ROLE_EDIT) },
  { module: '角色权限', permission: '删除角色', has: authStore.hasPermission(PERMISSIONS.ROLE_DELETE) },
  { module: '内容管理', permission: '查看内容', has: authStore.hasPermission(PERMISSIONS.CONTENT_VIEW) },
  { module: '内容管理', permission: '创建内容', has: authStore.hasPermission(PERMISSIONS.CONTENT_CREATE) },
  { module: '内容管理', permission: '编辑内容', has: authStore.hasPermission(PERMISSIONS.CONTENT_EDIT) },
  { module: '内容管理', permission: '删除内容', has: authStore.hasPermission(PERMISSIONS.CONTENT_DELETE) },
  { module: '内容管理', permission: '审核内容', has: authStore.hasPermission(PERMISSIONS.CONTENT_AUDIT) },
  { module: '数据统计', permission: '查看数据', has: authStore.hasPermission(PERMISSIONS.DATA_VIEW) },
  { module: '数据统计', permission: '导出数据', has: authStore.hasPermission(PERMISSIONS.DATA_EXPORT) },
  { module: '系统设置', permission: '查看设置', has: authStore.hasPermission(PERMISSIONS.SYSTEM_VIEW) },
  { module: '系统设置', permission: '编辑设置', has: authStore.hasPermission(PERMISSIONS.SYSTEM_EDIT) },
  { module: '操作日志', permission: '查看日志', has: authStore.hasPermission(PERMISSIONS.LOG_VIEW) },
  { module: '操作日志', permission: '清空日志', has: authStore.hasPermission(PERMISSIONS.LOG_CLEAR) }
])

async function loadStats() {
  try {
    const res = await statsApi.getOverview()
    stats.value = res || {}
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const handleExport = () => {
  ElMessage.success('数据导出成功')
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  padding-bottom: 24px;
}

.stat-row {
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 16px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #999999;
  margin-top: 4px;
}

.chart-row {
  margin-bottom: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart {
  height: 280px;
  width: 100%;
}

.permission-alert {
  margin-bottom: 24px;
}

.permission-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quick-actions {
  margin-bottom: 24px;
}

.action-btn {
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.action-btn .el-icon {
  font-size: 24px;
}
</style>