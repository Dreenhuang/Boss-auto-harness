<template>
  <div class="data-analysis">
    <el-alert
      v-if="authStore.isSuperAdmin"
      title="超级管理员数据权限"
      type="success"
      description="您可以查看和导出所有数据，包括用户数据、内容数据、学习数据等全部统计信息。"
      show-icon
      :closable="false"
      class="permission-alert"
    />

    <!-- 数据概览 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon" style="background: #e6f7ff; color: #1890ff;">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ overview.totalUsers || 0 }}</div>
            <div class="stat-label">总用户数</div>
            <div class="stat-trend up">+{{ overview.userGrowth || 0 }}% 较上月</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon" style="background: #f6ffed; color: #52c41a;">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ overview.totalContent || 0 }}</div>
            <div class="stat-label">内容总数</div>
            <div class="stat-trend up">+{{ overview.contentGrowth || 0 }}% 较上月</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon" style="background: #fff7e6; color: #fa8c16;">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ overview.avgStudyTime || 0 }}min</div>
            <div class="stat-label">平均学习时长</div>
            <div class="stat-trend up">+{{ overview.studyTimeGrowth || 0 }}% 较上月</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon" style="background: #fff1f0; color: #f5222d;">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ overview.completionRate || 0 }}%</div>
            <div class="stat-label">内容完成率</div>
            <div class="stat-trend" :class="overview.completionTrend >= 0 ? 'up' : 'down'">
              {{ overview.completionTrend >= 0 ? '+' : '' }}{{ overview.completionTrend || 0 }}% 较上月
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- ECharts 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="chart-header">
              <span>用户增长趋势</span>
              <el-button
                v-if="authStore.hasPermission('data:export')"
                link
                type="primary"
                @click="handleExport"
              >
                <el-icon><Download /></el-icon>
                导出
              </el-button>
            </div>
          </template>
          <v-chart class="chart" :option="userGrowthOption" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="chart-header">
              <span>内容分类分布</span>
            </div>
          </template>
          <v-chart class="chart" :option="categoryOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- 更多图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="chart-header">
              <span>用户活跃度时段分布</span>
            </div>
          </template>
          <v-chart class="chart" :option="activityOption" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="chart-header">
              <span>学习路径完成率</span>
            </div>
          </template>
          <v-chart class="chart" :option="pathCompletionOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-card class="data-table-card">
      <template #header>
        <div class="table-header">
          <span>详细数据</span>
          <el-button
            v-if="authStore.hasPermission('data:export')"
            type="primary"
            @click="handleExport"
          >
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </div>
      </template>
      <el-table :data="detailData" stripe v-loading="tableLoading">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="newUsers" label="新增用户" width="120" />
        <el-table-column prop="activeUsers" label="活跃用户" width="120" />
        <el-table-column prop="newContent" label="新增内容" width="120" />
        <el-table-column prop="studyTime" label="学习时长(小时)" width="150" />
        <el-table-column prop="completionRate" label="完成率" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.completionRate" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Document, Timer, TrendCharts, Download } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth.js'
import { statsApi } from '../api'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart, RadarChart } from 'echarts/charts'
import {
  GridComponent, TooltipComponent, LegendComponent, TitleComponent,
  ToolboxComponent, DataZoomComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer, LineChart, BarChart, PieChart, RadarChart,
  GridComponent, TooltipComponent, LegendComponent, TitleComponent,
  ToolboxComponent, DataZoomComponent
])

const authStore = useAuthStore()
const overview = ref({})
const detailData = ref([])
const tableLoading = ref(false)

// 用户增长趋势图配置
const userGrowthOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' }
  },
  legend: {
    data: ['新增用户', '活跃用户'],
    bottom: 0
  },
  grid: {
    left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: '{value}' }
  },
  series: [
    {
      name: '新增用户',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 90, 230],
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
      name: '活跃用户',
      type: 'line',
      smooth: true,
      data: [220, 182, 191, 234, 290, 330],
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

// 内容分类分布饼图配置
const categoryOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'center'
  },
  series: [
    {
      name: '内容分类',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      labelLine: { show: false },
      data: [
        { value: 1209, name: '基础概念', itemStyle: { color: '#FF2442' } },
        { value: 864, name: '技术选型', itemStyle: { color: '#FF4D6A' } },
        { value: 691, name: '学习路径', itemStyle: { color: '#FF8095' } },
        { value: 415, name: '框架对比', itemStyle: { color: '#FFB3C1' } },
        { value: 277, name: '其他', itemStyle: { color: '#FFD6DE' } }
      ]
    }
  ]
})

// 用户活跃度时段分布柱状图
const activityOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  grid: {
    left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    axisTick: { alignWithLabel: true }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '活跃用户数',
      type: 'bar',
      barWidth: '60%',
      data: [120, 52, 380, 520, 450, 680, 310],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#FF2442' },
            { offset: 1, color: '#FF8095' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      }
    }
  ]
})

// 学习路径完成率雷达图
const pathCompletionOption = ref({
  tooltip: {},
  radar: {
    indicator: [
      { name: '产品经理入门', max: 100 },
      { name: '需求分析', max: 100 },
      { name: '原型设计', max: 100 },
      { name: '数据分析', max: 100 },
      { name: '项目管理', max: 100 },
      { name: '用户研究', max: 100 }
    ],
    shape: 'polygon',
    splitNumber: 5,
    axisName: {
      color: '#666'
    },
    splitLine: {
      lineStyle: {
        color: ['#eee']
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['#fafafa', '#f5f5f5', '#fafafa', '#f5f5f5', '#fafafa']
      }
    }
  },
  series: [
    {
      name: '完成率',
      type: 'radar',
      data: [
        {
          value: [85, 72, 68, 90, 65, 78],
          name: '平均完成率',
          areaStyle: {
            color: 'rgba(255, 36, 66, 0.2)'
          },
          lineStyle: {
            color: '#FF2442',
            width: 2
          },
          itemStyle: {
            color: '#FF2442'
          }
        }
      ]
    }
  ]
})

async function loadOverview() {
  try {
    const res = await statsApi.getOverview()
    overview.value = res || {}
  } catch (error) {
    console.error('加载概览数据失败:', error)
    // 使用默认数据
    overview.value = {
      totalUsers: 12580,
      userGrowth: 12.5,
      totalContent: 3456,
      contentGrowth: 8.3,
      avgStudyTime: 45.2,
      studyTimeGrowth: 5.1,
      completionRate: 78.6,
      completionTrend: -2.3
    }
  }
}

async function loadDetailData() {
  tableLoading.value = true
  try {
    const res = await statsApi.getUserStats({ days: 30 })
    detailData.value = res?.list || [
      { date: '2026-04-01', newUsers: 123, activeUsers: 2341, newContent: 15, studyTime: 456, completionRate: 82 },
      { date: '2026-04-02', newUsers: 145, activeUsers: 2567, newContent: 12, studyTime: 523, completionRate: 78 },
      { date: '2026-04-03', newUsers: 98, activeUsers: 1987, newContent: 8, studyTime: 389, completionRate: 85 },
      { date: '2026-04-04', newUsers: 167, activeUsers: 2890, newContent: 20, studyTime: 678, completionRate: 75 },
      { date: '2026-04-05', newUsers: 134, activeUsers: 2456, newContent: 10, studyTime: 534, completionRate: 80 }
    ]
  } catch (error) {
    console.error('加载详细数据失败:', error)
  } finally {
    tableLoading.value = false
  }
}

function handleExport() {
  ElMessage.success('数据导出成功')
}

onMounted(() => {
  loadOverview()
  loadDetailData()
})
</script>

<style scoped>
.data-analysis {
  padding-bottom: 24px;
}

.permission-alert {
  margin-bottom: 20px;
}

.stat-row {
  margin-bottom: 20px;
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

.stat-trend {
  font-size: 12px;
  margin-top: 4px;
}

.stat-trend.up {
  color: #52c41a;
}

.stat-trend.down {
  color: #f5222d;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart {
  height: 300px;
  width: 100%;
}

.data-table-card {
  margin-top: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>