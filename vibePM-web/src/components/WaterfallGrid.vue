<template>
  <div class="waterfall-wrapper" ref="wrapperRef">
    <div class="waterfall-container" :style="containerStyle">
      <div
        v-for="(column, colIndex) in columns"
        :key="colIndex"
        class="waterfall-column"
        :style="{ width: `${columnWidth}px` }"
      >
        <div
          v-for="item in column"
          :key="item.id"
          class="waterfall-item"
          :style="{ animationDelay: `${item._index * 0.05}s` }"
        >
          <slot :item="item" :index="item._index" />
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span class="loading-text">加载中...</span>
    </div>

    <!-- 没有更多 -->
    <div v-else-if="!hasMore && items.length > 0" class="no-more-tip">
      没有更多内容了
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading && items.length === 0" class="empty-state">
      <slot name="empty">
        <Icon icon="ri:inbox-line" class="empty-icon" />
        <p class="empty-text">暂无内容</p>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: true
  },
  columnGap: {
    type: Number,
    default: 10
  },
  itemGap: {
    type: Number,
    default: 10
  },
  minColumnWidth: {
    type: Number,
    default: 160
  },
  maxColumns: {
    type: Number,
    default: 4
  }
})

const emit = defineEmits(['load-more', 'item-click'])

const wrapperRef = ref(null)
const containerWidth = ref(0)

// 计算列数
const columnCount = computed(() => {
  if (!containerWidth.value) return 2
  const count = Math.floor(containerWidth.value / (props.minColumnWidth + props.columnGap))
  return Math.max(1, Math.min(count, props.maxColumns))
})

// 计算每列宽度
const columnWidth = computed(() => {
  if (!containerWidth.value || columnCount.value <= 0) return props.minColumnWidth
  const totalGap = (columnCount.value - 1) * props.columnGap
  return Math.floor((containerWidth.value - totalGap) / columnCount.value)
})

// 容器样式
const containerStyle = computed(() => ({
  gap: `${props.columnGap}px`
}))

// 瀑布流分配算法 - 按高度均衡分配
const columns = computed(() => {
  const cols = Array.from({ length: columnCount.value }, () => [])
  const colHeights = new Array(columnCount.value).fill(0)

  props.items.forEach((item, index) => {
    // 找到当前高度最小的列
    const minHeightIndex = colHeights.indexOf(Math.min(...colHeights))

    // 添加项目到该列
    cols[minHeightIndex].push({
      ...item,
      _index: index,
      _colIndex: minHeightIndex
    })

    // 更新列高度（使用预估高度或实际高度）
    const itemHeight = item._height || item.height || 300
    const heightValue = typeof itemHeight === 'string'
      ? parseInt(itemHeight.replace('px', ''))
      : itemHeight
    colHeights[minHeightIndex] += heightValue + props.itemGap
  })

  return cols
})

// 监听容器宽度变化
let resizeObserver = null

// 滚动监听 - 检测是否滚动到底部
let scrollHandler = null
const SCROLL_THRESHOLD = 200 // 距离底部200px时触发加载

const updateContainerWidth = () => {
  if (wrapperRef.value) {
    containerWidth.value = wrapperRef.value.clientWidth
  }
}

// 检查是否需要加载更多
const checkScrollPosition = () => {
  if (!wrapperRef.value || props.loading || !props.hasMore) return

  const { scrollTop, scrollHeight, clientHeight } = wrapperRef.value
  const distanceToBottom = scrollHeight - scrollTop - clientHeight

  if (distanceToBottom < SCROLL_THRESHOLD) {
    emit('load-more')
  }
}

onMounted(() => {
  updateContainerWidth()

  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width
      }
    })
    if (wrapperRef.value) {
      resizeObserver.observe(wrapperRef.value)
    }
  } else {
    window.addEventListener('resize', updateContainerWidth)
  }

  // 添加滚动监听
  if (wrapperRef.value) {
    scrollHandler = () => checkScrollPosition()
    wrapperRef.value.addEventListener('scroll', scrollHandler, { passive: true })
    // 初始检查一次
    checkScrollPosition()
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  } else {
    window.removeEventListener('resize', updateContainerWidth)
  }

  // 移除滚动监听
  if (wrapperRef.value && scrollHandler) {
    wrapperRef.value.removeEventListener('scroll', scrollHandler)
  }
})

// 暴露方法
const scrollToTop = () => {
  if (wrapperRef.value) {
    wrapperRef.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

defineExpose({
  scrollToTop,
  updateContainerWidth
})
</script>

<style scoped>
.waterfall-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.waterfall-wrapper::-webkit-scrollbar {
  display: none;
}

.waterfall-container {
  display: flex;
  align-items: flex-start;
  padding: 12px;
}

.waterfall-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.waterfall-item {
  animation: fadeInUp 0.4s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 12px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f0f0f0;
  border-top-color: #ff2442;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 12px;
  color: #999;
}

/* 没有更多 */
.no-more-tip {
  text-align: center;
  font-size: 12px;
  color: #ddd;
  padding: 40px 0 20px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.empty-icon {
  font-size: 64px;
  color: #e5e5e5;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #ccc;
}
</style>
