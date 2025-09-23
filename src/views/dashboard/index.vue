<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import chroma from 'chroma-js'
import * as echarts from 'echarts'
import { NNumberAnimation } from 'naive-ui'
import { onMounted, watch, ref, computed, onUnmounted } from 'vue'

import { ScrollContainer } from '@/components'
import { toRefsPreferencesStore } from '@/stores'
import twc from '@/utils/tailwindColor'

import type { ECharts } from 'echarts'

defineOptions({
  name: 'Dashboard',
})

const { sidebarMenu, navigationMode, themeColor, isDark } = toRefsPreferencesStore()

const cardList = ref(generateCardData())

const revenueChart = ref<HTMLDivElement | null>(null)
let revenueChartInstance: ECharts | null = null
let revenueChartResizeHandler: (() => void) | null = null

const revenueBarChart = ref<HTMLDivElement | null>(null)
let revenueBarChartInstance: ECharts | null = null
let revenueBarChartResizeHandler: (() => void) | null = null

const revenueBarChart2 = ref<HTMLDivElement | null>(null)
let revenueBarChart2Instance: ECharts | null = null
let revenueBarChart2ResizeHandler: (() => void) | null = null

const monthlyRadarChart = ref<HTMLDivElement | null>(null)
let monthlyRadarChartInstance: ECharts | null = null
let monthlyRadarChartResizeHandler: (() => void) | null = null

const highestRevenueChart = ref<HTMLDivElement | null>(null)
let highestRevenueChartInstance: ECharts | null = null
let highestRevenueChartResizeHandler: (() => void) | null = null
let collapseResizeTimeout: ReturnType<typeof setTimeout> | null = null

const CHART_CONFIG = {
  MONTHS: Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
}

const getBusinessLinesConfig = () =>
  [
    {
      name: '主要收入',
      color: themeColor.value,
      dataRange: { min: 30000, max: 85000 },
    },
    {
      name: '核心业务',
      color: twc.cyan[500],
      dataRange: { min: 25000, max: 75000 },
    },
    {
      name: '辅助收入',
      color: twc.lime[500],
      dataRange: { min: 15000, max: 50000 },
    },
    {
      name: '订阅收入',
      color: twc.orange[500],
      dataRange: { min: 10000, max: 35000 },
    },
    {
      name: '广告收入',
      color: twc.pink[500],
      dataRange: { min: 8000, max: 25000 },
    },
  ] as const

const barChartSelectedLegend = ref(getBusinessLinesConfig()[0].name)

const revenueChartSelected = ref<Record<string, boolean>>(
  Object.fromEntries(getBusinessLinesConfig().map((line) => [line.name, true])),
)

const highestChartSelected = ref<'max' | 'min'>('max')

function generateCardData() {
  const now = new Date()
  const currentMonth = now.getMonth() + 1

  const baseUserCount = 10000 + Math.floor(Math.random() * 5000)
  const todayVisits = Math.floor(
    5000 + Math.random() * 8000 + Math.sin((now.getHours() / 24) * Math.PI) * 2000,
  )
  const monthlySales = Math.floor(1500000 + Math.random() * 1000000 + (currentMonth / 12) * 500000)
  const pendingOrders = Math.floor(150 + Math.random() * 200)

  return [
    {
      title: '用户总数',
      value: baseUserCount,
      percentage: parseFloat((3.2 + Math.random() * 4).toFixed(2)),
      iconClass: 'iconify ph--users-bold text-indigo-50 dark:text-indigo-150',
      iconBgClass:
        'text-indigo-500/5 bg-indigo-400 ring-4 ring-indigo-200 dark:bg-indigo-650 dark:ring-indigo-500/30 transition-all',
      precision: 0,
      description: `${currentMonth}月新增 ${Math.floor(100 + Math.random() * 200)} 人`,
    },
    {
      title: '今日访问',
      value: todayVisits,
      percentage: parseFloat((-2 + Math.random() * 20).toFixed(2)),
      iconClass: 'iconify ph--eye-bold text-blue-50 dark:text-blue-150',
      iconBgClass:
        'text-blue-500/5 bg-blue-400 ring-4 ring-blue-200 dark:bg-blue-650 dark:ring-blue-500/30 transition-all',
      precision: 0,
      description: '较昨日变化',
    },
    {
      title: `${currentMonth}月销售额`,
      value: monthlySales,
      percentage: parseFloat((5 + Math.random() * 10).toFixed(2)),
      iconClass: 'iconify ph--currency-dollar-bold text-emerald-50 dark:text-emerald-150',
      iconBgClass:
        'text-emerald-500/5 bg-emerald-400 ring-4 ring-emerald-200 dark:bg-emerald-650 dark:ring-emerald-500/30 transition-all',
      precision: 2,
      description: '本月累计收入',
    },
    {
      title: '待处理订单',
      value: pendingOrders,
      percentage: parseFloat((-8 + Math.random() * 6).toFixed(2)),
      iconClass: 'iconify ph--shopping-cart-bold text-orange-50 dark:text-orange-150',
      iconBgClass:
        'text-orange-500/5 bg-orange-400 ring-4 ring-orange-200 dark:bg-orange-650 dark:ring-orange-500/30 transition-all',
      precision: 0,
      description: '需要及时处理',
    },
  ]
}

const generateRandomData = (
  baseMin: number,
  baseMax: number,
  trend: 'up' | 'down' | 'stable' = 'stable',
) => {
  const data = []
  let currentBase = (baseMin + baseMax) / 2

  for (let i = 0; i < 12; i++) {
    if (trend === 'up') {
      currentBase += (baseMax - baseMin) * 0.03
    } else if (trend === 'down') {
      currentBase -= (baseMax - baseMin) * 0.02
    }

    const baseVariation = (baseMax - baseMin) * 0.6 * (Math.random() - 0.5)
    const seasonalFactor = Math.sin((i * Math.PI) / 6) * (baseMax - baseMin) * 0.15
    const randomSpike = Math.random() > 0.8 ? (baseMax - baseMin) * 0.2 * (Math.random() - 0.5) : 0

    const variation = baseVariation + seasonalFactor + randomSpike
    const value = Math.max(baseMin * 0.3, Math.min(90000, currentBase + variation))
    data.push(Math.round(value))
  }
  return data
}

const businessLinesWithData = computed(() =>
  getBusinessLinesConfig().map((line) => ({
    ...line,
    data: generateRandomData(line.dataRange.min, line.dataRange.max, 'up'),
  })),
)

const createTooltipConfig = (formatter?: any) => ({
  trigger: 'axis',
  backgroundColor: isDark.value ? twc.neutral[750] : '#fff',
  borderWidth: 0,
  padding: 8,
  extraCssText: 'box-shadow: none;',
  textStyle: {
    color: isDark.value ? twc.neutral[400] : twc.neutral[600],
    fontSize: 12,
  },
  axisPointer: {
    type: 'none',
  },
  ...(formatter && { formatter }),
})

const chartDataManager = {
  getMonths: () => CHART_CONFIG.MONTHS,

  getAllLines: () => businessLinesWithData.value,

  getLineByName: (name: string) => {
    return businessLinesWithData.value.find((line) => line.name === name)
  },

  getAllNames: () => {
    return businessLinesWithData.value.map((line) => line.name)
  },

  getAllColors: () => {
    return businessLinesWithData.value.map((line) => line.color)
  },

  getHighestRevenueLine: () => {
    return businessLinesWithData.value.reduce((prev, current) => {
      const prevTotal = prev.data.reduce((sum, value) => sum + value, 0)
      const currentTotal = current.data.reduce((sum, value) => sum + value, 0)
      return prevTotal > currentTotal ? prev : current
    })
  },

  getLowestRevenueLine: () => {
    return businessLinesWithData.value.reduce((prev, current) => {
      const prevTotal = prev.data.reduce((sum, value) => sum + value, 0)
      const currentTotal = current.data.reduce((sum, value) => sum + value, 0)
      return prevTotal < currentTotal ? prev : current
    })
  },

  getCurrentMonthData: (month: number) => {
    return businessLinesWithData.value.map((line) => ({
      name: line.name,
      value: line.data[month],
      color: line.color,
    }))
  },
}

function initRevenueChart() {
  if (!revenueChart.value) return

  const chart = echarts.init(revenueChart.value)

  const option = {
    title: [
      {
        text: '收入概览',
        left: 0,
        top: 0,
        textStyle: {
          fontSize: 18,
          color: isDark.value ? twc.neutral[400] : twc.neutral[600],
          fontWeight: 'normal',
        },
      },
      {
        text: '总收入趋势与增长分析',
        left: 0,
        top: 28,
        textStyle: {
          fontSize: 14,
          color: isDark.value ? twc.neutral[500] : twc.neutral[450],
          fontWeight: 'normal',
        },
      },
    ],
    tooltip: createTooltipConfig((params: any) => {
      const date = params[0].axisValue
      let result = `<div>${date}数据</div>`
      params.forEach((item: any) => {
        const value = item.value.toLocaleString()
        result += `
        <div style="display: flex; align-items: center; margin-top: 4px;">
          <span style="display:inline-block; margin-right:4px; width:10px; height:10px; border-radius:50%; background-color:${item.color};"></span>
          <span style="margin-right: 10px">${item.seriesName}</span>
          <span>${value}</span>
        </div>
      `
      })
      return result
    }),
    legend: {
      top: 6,
      right: 22,
      itemGap: 16,
      icon: 'circle',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: isDark.value ? twc.neutral[400] : twc.neutral[600],
        fontSize: 14,
      },
      data: chartDataManager.getAllNames(),
      selected: revenueChartSelected.value,
    },
    grid: {
      left: 20,
      right: 20,
      top: 72,
      bottom: 0,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartDataManager.getMonths(),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: isDark.value ? twc.neutral[400] : twc.neutral[600],
        fontSize: 12,
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100000,
      interval: 10000,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: isDark.value ? twc.neutral[400] : twc.neutral[600],
        fontSize: 11,
        formatter(value: number) {
          if (value === 0) return '0'
          return `${(value / 1000).toFixed(0)},000`
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          width: 1,
        },
      },
    },
    series: businessLinesWithData.value.map((line, idx) => ({
      name: line.name,
      type: 'line',
      data: line.data,
      symbol: 'circle',
      showSymbol: false,
      smooth: true,
      lineStyle: {
        color: line.color,
        width: idx < 2 ? 2 : 1,
        type: idx < 2 ? 'solid' : 'dashed',
      },
      itemStyle: {
        color: line.color,
      },
      emphasis: {
        focus: 'series',
        symbolSize: 6,
        itemStyle: {
          color: line.color,
          borderColor: line.color,
          borderWidth: 2,
        },
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: chroma(line.color).alpha(0.12).hex() },
            { offset: 1, color: chroma(line.color).alpha(0.02).hex() },
          ],
        },
      },
    })),

    animationDuration: 1000,
    animationEasing: 'cubicOut' as const,
    animationDelay(idx: number) {
      return idx * 100
    },
  }

  chart.setOption(option)

  chart.on('legendselectchanged', (params: any) => {
    if (params?.selected) {
      revenueChartSelected.value = params.selected
    }
  })

  revenueChartInstance = chart
  revenueChartResizeHandler = () => chart.resize()
  window.addEventListener('resize', revenueChartResizeHandler, { passive: true })
}

function initRevenueBarChart() {
  if (!revenueBarChart.value) return

  const chart = echarts.init(revenueBarChart.value)

  const option = {
    color: chartDataManager.getAllColors(),
    grid: { left: 5, right: 5, top: 60, bottom: 0, containLabel: false },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartDataManager.getMonths(),
      show: false,
    },
    yAxis: {
      type: 'value',
      min: 0,
      show: false,
    },
    legend: {
      top: 6,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 16,
      inactiveColor: isDark.value ? twc.neutral[400] : twc.neutral[350],
      inactiveBorderColor: isDark.value ? twc.neutral[400] : twc.neutral[350],
      textStyle: {
        color: isDark.value ? twc.neutral[400] : twc.neutral[600],
        fontSize: 13,
      },
      selectedMode: 'single',
      selected: Object.fromEntries(
        businessLinesWithData.value.map((line) => [
          line.name,
          line.name === barChartSelectedLegend.value,
        ]),
      ),
      data: businessLinesWithData.value.map((line) => ({
        name: line.name,
        icon: 'circle',
        itemStyle: {
          borderColor: line.color,
        },
      })),
    },
    series: businessLinesWithData.value.map((line) => ({
      name: line.name,
      type: 'line',
      stack: 'Total',
      data: line.data,
      symbol: 'circle',
      symbolSize: 6,
      showSymbol: true,
      lineStyle: {
        width: 2,
      },
      itemStyle: {
        borderColor: isDark.value ? twc.neutral[800] : twc.neutral[50],
        borderWidth: 2,
      },
      emphasis: {
        focus: 'series',
        symbolSize: 6,
        itemStyle: {
          color: line.color,
          borderColor: line.color,
          borderWidth: 2,
        },
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: chroma(line.color).alpha(0.12).hex() },
            { offset: 1, color: chroma(line.color).alpha(0.02).hex() },
          ],
        },
      },
    })),
    tooltip: createTooltipConfig((params: any) => {
      const color = params[0].color
      const date = params[0].axisValue
      const value = params[0].value.toLocaleString()
      let result = `<div>${date}数据</div>`
      params.forEach((item: any) => {
        result += `
        <div style="display: flex; align-items: center; margin-top: 4px;">
          <span style="display:inline-block; margin-right:4px; width:10px; height:10px; border-radius:50%; background-color:${color};"></span>
          <span style="margin-right: 10px">${item.seriesName}</span>
          <span>${value}</span>
        </div>
      `
      })
      return result
    }),

    animationDuration: 1000,
    animationEasing: 'cubicOut' as const,
    animationDelay(idx: number) {
      return idx * 100
    },
  }

  chart.setOption(option)

  revenueBarChartInstance = chart
  revenueBarChartResizeHandler = () => chart.resize()
  window.addEventListener('resize', revenueBarChartResizeHandler, { passive: true })

  chart.on('legendselectchanged', (params: any) => {
    barChartSelectedLegend.value = params.name

    if (revenueBarChart2Instance) {
      const selectedLine = chartDataManager.getLineByName(params.name)
      if (!selectedLine) return

      revenueBarChart2Instance.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none',
          },
          backgroundColor: isDark.value ? twc.neutral[750] : '#fff',
          borderWidth: 0,
          padding: 8,
          extraCssText: 'box-shadow: none;',
          textStyle: {
            color: isDark.value ? twc.neutral[400] : twc.neutral[600],
            fontSize: 12,
          },
          formatter(params: any) {
            const date = params[0].axisValue
            const seriesName = params[0].seriesName
            const value = params[0].value.toLocaleString()
            let result = `<div>${date}数据</div>`
            params.forEach(() => {
              result += `
        <div style="display: flex; align-items: center; margin-top: 4px;">
          <span style="display:inline-block; margin-right:4px; width:10px; height:10px; border-radius:50%; background-color:${selectedLine.color};"></span>
          <span style="margin-right: 10px">${seriesName}</span>
          <span>${value}</span>
        </div>
      `
            })
            return result
          },
        },
        series: [
          {
            name: params.name,
            type: 'bar',
            barWidth: '60%',
            data: selectedLine.data,
            itemStyle: {
              color: chroma(selectedLine.color).alpha(0.15).hex(),
              borderWidth: 0,
              borderRadius: [3, 3, 0, 0],
            },
            emphasis: {
              itemStyle: {
                color: chroma(selectedLine.color).alpha(0.3).hex(),
                borderWidth: 0,
              },
            },
          },
        ],
      })
    }
  })
}

function initRevenueBarChart2() {
  if (!revenueBarChart2.value) return

  const chart = echarts.init(revenueBarChart2.value)

  const selectedLine = chartDataManager.getLineByName(barChartSelectedLegend.value)
  if (!selectedLine) return

  const option = {
    color: chartDataManager.getAllColors(),
    grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: false },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none',
      },
      backgroundColor: isDark.value ? twc.neutral[750] : '#fff',
      borderWidth: 0,
      padding: 8,
      extraCssText: 'box-shadow: none;',
      textStyle: {
        color: isDark.value ? twc.neutral[400] : twc.neutral[600],
        fontSize: 12,
      },
      formatter(params: any) {
        const date = params[0].axisValue
        const value = params[0].value.toLocaleString()
        const seriesName = params[0].seriesName
        let result = `<div>${date}数据</div>`
        params.forEach(() => {
          result += `
        <div style="display: flex; align-items: center; margin-top: 4px;">
          <span style="display:inline-block; margin-right:4px; width:10px; height:10px; border-radius:50%; background-color:${selectedLine.color};"></span>
          <span style="margin-right: 10px">${seriesName}</span>
          <span>${value}</span>
        </div>
      `
        })
        return result
      },
    },
    xAxis: {
      type: 'category',
      data: chartDataManager.getMonths(),
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        name: barChartSelectedLegend.value,
        type: 'bar',
        barWidth: '60%',
        data: selectedLine.data,
        itemStyle: {
          color: chroma(selectedLine.color).alpha(0.15).hex(),
          borderWidth: 0,
          borderRadius: [3, 3, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: chroma(selectedLine.color).alpha(0.3).hex(),
            borderWidth: 0,
          },
        },
      },
    ],

    animationDuration: 1000,
    animationEasing: 'cubicOut' as const,
    animationDelay(idx: number) {
      return idx * 50
    },
  }

  chart.setOption(option)

  revenueBarChart2Instance = chart
  revenueBarChart2ResizeHandler = () => chart.resize()
  window.addEventListener('resize', revenueBarChart2ResizeHandler, { passive: true })
}

function initMonthlyRadarChart() {
  if (!monthlyRadarChart.value) return

  const now = new Date()
  const currentMonth = now.getMonth()

  const currentMonthData = chartDataManager.getCurrentMonthData(currentMonth)

  const chart = echarts.init(monthlyRadarChart.value)

  const option = {
    title: [
      {
        text: '当月各业务收入',
        left: 0,
        top: 0,
        textStyle: {
          fontSize: 15,
          color: isDark.value ? twc.neutral[400] : twc.neutral[600],
          fontWeight: 'normal',
        },
      },
      {
        text: `${currentMonth + 1}月数据对比`,
        left: 0,
        top: 28,
        textStyle: {
          fontSize: 14,
          color: isDark.value ? twc.neutral[500] : twc.neutral[450],
          fontWeight: 'normal',
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none',
      },
      backgroundColor: isDark.value ? twc.neutral[750] : '#fff',
      borderWidth: 0,
      padding: 8,
      extraCssText: 'box-shadow: none;',
      textStyle: {
        color: isDark.value ? twc.neutral[400] : twc.neutral[600],
        fontSize: 12,
      },
      formatter(params: any) {
        const color = params[0].color.slice(0, -2)
        const date = params[0].axisValue
        const value = params[0].data.value
        let result = `<div>${date}</div>`
        params.forEach(() => {
          result += `
        <div style="display: flex; align-items: center; margin-top: 4px;">
          <span style="display:inline-block; margin-right:8px; width:10px; height:10px; border-radius:50%; background-color:${color};"></span>
          <span>${value}</span>
        </div>
      `
        })
        return result
      },
    },
    grid: {
      left: 10,
      right: 5,
      top: 100,
      bottom: -10,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      show: false,
      data: chartDataManager.getAllNames(),
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          type: 'dashed',
        },
      },
      axisLabel: {
        color: isDark.value ? twc.neutral[400] : twc.neutral[600],
        fontSize: 12,
        formatter(value: number) {
          if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k`
          }
          return value
        },
      },
    },
    series: [
      {
        type: 'bar',
        barWidth: '50%',
        data: currentMonthData.map((item) => ({
          value: item.value,
          itemStyle: {
            color: chroma(item.color).alpha(0.35).hex(),
            borderRadius: [3, 3, 0, 0],
          },
        })),
        label: {
          show: true,
          position: 'top',
          distance: 10,
          color: isDark.value ? twc.neutral[400] : twc.neutral[600],
          fontSize: 12,
          formatter(params: any) {
            const index = params.dataIndex
            return `${chartDataManager.getAllNames()[index]}`
          },
        },
      },
    ],
    animationDuration: 1000,
    animationEasing: 'cubicOut' as const,
  }

  chart.setOption(option)
  monthlyRadarChartInstance = chart
  monthlyRadarChartResizeHandler = () => chart.resize()
  window.addEventListener('resize', monthlyRadarChartResizeHandler, { passive: true })
}

function initHighestRevenueChart() {
  if (!highestRevenueChart.value) return

  const highestLine = chartDataManager.getHighestRevenueLine()
  const lowestLine = chartDataManager.getLowestRevenueLine()

  const chartData = [
    {
      legendName: '最高',
      legendValue: 'max',
      businessName: highestLine.name,
      color: highestLine.color,
      data: highestLine.data,
    },
    {
      legendName: '最低',
      legendValue: 'min',
      businessName: lowestLine.name,
      color: lowestLine.color,
      data: lowestLine.data,
    },
  ] as const

  const chart = echarts.init(highestRevenueChart.value)

  const legendSelected: Record<string, boolean> = {
    max: highestChartSelected.value === 'max',
    min: highestChartSelected.value === 'min',
  }

  const option = {
    title: [
      {
        text: '年度最高业务收入',
        left: 0,
        top: 0,
        textStyle: {
          fontSize: 15,
          color: isDark.value ? twc.neutral[400] : twc.neutral[600],
          fontWeight: 'normal',
        },
      },
      {
        text: `{a|${legendSelected.max ? chartData[0].businessName : chartData[1].businessName}}`,
        left: 0,
        top: 24,
        textStyle: {
          rich: {
            a: {
              fontSize: 14,
              color: legendSelected.max ? chartData[0].color : chartData[1].color,
              backgroundColor: chroma(legendSelected.max ? chartData[0].color : chartData[1].color)
                .alpha(0.1)
                .hex(),
              padding: [4, 6],
              borderRadius: 2,
              lineHeight: 22,
            },
          },
        },
      },
    ],
    color: [chartData[0].color, chartData[1].color],
    grid: { left: -30, right: -30, top: 70, bottom: 0, containLabel: false },
    xAxis: {
      type: 'category',
      data: chartDataManager.getMonths(),
      show: false,
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          type: 'dashed',
        },
      },
    },
    legend: {
      top: 6,
      right: 22,
      orient: 'horizontal',
      itemGap: 16,
      icon: 'circle',
      itemWidth: 12,
      itemHeight: 12,
      inactiveBorderWidth: 0,
      inactiveColor: isDark.value ? twc.neutral[400] : twc.neutral[350],
      inactiveBorderColor: isDark.value ? twc.neutral[400] : twc.neutral[350],
      textStyle: {
        color: isDark.value ? twc.neutral[400] : twc.neutral[600],
        fontSize: 14,
      },
      data: chartData.map((item) => ({
        name: item.legendName,
        itemStyle: {
          borderColor: item.color,
          borderWidth: 0,
        },
      })),
      selectedMode: 'single',
      selected: Object.fromEntries(
        chartData.map((item) => [item.legendName, legendSelected[item.legendValue] ?? false]),
      ),
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      backgroundColor: isDark.value ? twc.neutral[750] : '#fff',
      borderWidth: 0,
      padding: 8,
      extraCssText: 'box-shadow: none;',
      textStyle: {
        color: isDark.value ? twc.neutral[400] : twc.neutral[600],
        fontSize: 12,
      },
      formatter(params: any) {
        const color = params[0].color
        const date = params[0].axisValue
        const value = params[0].value.toLocaleString()

        const chartItem = chartData.find((item) => item.legendName === params[0].seriesName)
        const realName = chartItem ? chartItem.businessName : params[0].seriesName
        let result = `<div>${date}数据</div>`
        result += `
          <div style="display: flex; align-items: center; margin-top: 4px;">
            <span style="display:inline-block; margin-right:4px; width:10px; height:10px; border-radius:50%; background-color:${color};"></span>
            <span style="margin-right: 10px">${realName}</span>
            <span>${value}</span>
          </div>
        `
        return result
      },
    },
    series: chartData.map((item) => ({
      name: item.legendName,
      type: 'line',
      step: 'middle',
      data: item.data,
      left: 0,
      symbol: 'circle',
      symbolSize: 6,
      showSymbol: true,
      lineStyle: {
        width: 2,
        color: item.color,
      },
      itemStyle: {
        color: item.color,
        borderColor: isDark.value ? twc.neutral[800] : twc.neutral[50],
        borderWidth: 2,
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: chroma(item.color).alpha(0.12).hex() },
            { offset: 1, color: chroma(item.color).alpha(0.02).hex() },
          ],
        },
      },
    })),
    animationDuration: 1000,
    animationEasing: 'cubicOut' as const,
    animationDelay(idx: number) {
      return idx * 100
    },
  }

  chart.setOption(option)
  highestRevenueChartInstance = chart
  highestRevenueChartResizeHandler = () => chart.resize()
  window.addEventListener('resize', highestRevenueChartResizeHandler, { passive: true })

  chart.on('legendselectchanged', (params: any) => {
    const chartItem = chartData.find((item) => item.legendName === params.name)
    if (!chartItem) return
    const isHighest = chartItem.legendValue === 'max'
    highestChartSelected.value = isHighest ? 'max' : 'min'
    chart.setOption({
      title: [
        {
          text: isHighest ? '年度最高收入业务' : '年度最低收入业务',
        },
        {
          text: `{a|${chartItem.businessName}}`,
          textStyle: {
            rich: {
              a: {
                color: chartItem.color,
                backgroundColor: chroma(chartItem.color).alpha(0.1).hex(),
              },
            },
          },
        },
      ],
    })
  })
}

onMounted(() => {
  initRevenueChart()
  initRevenueBarChart()
  initRevenueBarChart2()
  initMonthlyRadarChart()
  initHighestRevenueChart()
})

onUnmounted(() => {
  if (revenueChartInstance) {
    if (revenueChartResizeHandler) {
      window.removeEventListener('resize', revenueChartResizeHandler)
      revenueChartResizeHandler = null
    }
    revenueChartInstance.dispose()
    revenueChartInstance = null
  }

  if (revenueBarChartInstance) {
    if (revenueBarChartResizeHandler) {
      window.removeEventListener('resize', revenueBarChartResizeHandler)
      revenueBarChartResizeHandler = null
    }
    revenueBarChartInstance.dispose()
    revenueBarChartInstance = null
  }

  if (revenueBarChart2Instance) {
    if (revenueBarChart2ResizeHandler) {
      window.removeEventListener('resize', revenueBarChart2ResizeHandler)
      revenueBarChart2ResizeHandler = null
    }
    revenueBarChart2Instance.dispose()
    revenueBarChart2Instance = null
  }

  if (monthlyRadarChartInstance) {
    if (monthlyRadarChartResizeHandler) {
      window.removeEventListener('resize', monthlyRadarChartResizeHandler)
      monthlyRadarChartResizeHandler = null
    }
    monthlyRadarChartInstance.dispose()
    monthlyRadarChartInstance = null
  }

  if (highestRevenueChartInstance) {
    if (highestRevenueChartResizeHandler) {
      window.removeEventListener('resize', highestRevenueChartResizeHandler)
      highestRevenueChartResizeHandler = null
    }
    highestRevenueChartInstance.dispose()
    highestRevenueChartInstance = null
  }

  if (collapseResizeTimeout !== null) {
    clearTimeout(collapseResizeTimeout)
    collapseResizeTimeout = null
  }
})

function resizeAllCharts() {
  if (revenueChartInstance) revenueChartInstance.resize()
  if (revenueBarChartInstance) revenueBarChartInstance.resize()
  if (revenueBarChart2Instance) revenueBarChart2Instance.resize()
  if (monthlyRadarChartInstance) monthlyRadarChartInstance.resize()
  if (highestRevenueChartInstance) highestRevenueChartInstance.resize()
}

watchDebounced([() => sidebarMenu.value, () => navigationMode.value], resizeAllCharts, {
  debounce: 300,
  deep: true,
})

watch([isDark, themeColor], () => {
  if (revenueChartInstance) {
    if (revenueChartResizeHandler) {
      window.removeEventListener('resize', revenueChartResizeHandler)
      revenueChartResizeHandler = null
    }
    revenueChartInstance.dispose()
    revenueChartInstance = null
  }

  if (revenueBarChartInstance) {
    if (revenueBarChartResizeHandler) {
      window.removeEventListener('resize', revenueBarChartResizeHandler)
      revenueBarChartResizeHandler = null
    }
    revenueBarChartInstance.dispose()
    revenueBarChartInstance = null
  }

  if (revenueBarChart2Instance) {
    if (revenueBarChart2ResizeHandler) {
      window.removeEventListener('resize', revenueBarChart2ResizeHandler)
      revenueBarChart2ResizeHandler = null
    }
    revenueBarChart2Instance.dispose()
    revenueBarChart2Instance = null
  }

  if (monthlyRadarChartInstance) {
    if (monthlyRadarChartResizeHandler) {
      window.removeEventListener('resize', monthlyRadarChartResizeHandler)
      monthlyRadarChartResizeHandler = null
    }
    monthlyRadarChartInstance.dispose()
    monthlyRadarChartInstance = null
  }

  if (highestRevenueChartInstance) {
    if (highestRevenueChartResizeHandler) {
      window.removeEventListener('resize', highestRevenueChartResizeHandler)
      highestRevenueChartResizeHandler = null
    }
    highestRevenueChartInstance.dispose()
    highestRevenueChartInstance = null
  }

  initRevenueChart()
  initRevenueBarChart()
  initRevenueBarChart2()
  initMonthlyRadarChart()
  initHighestRevenueChart()
})
</script>
<template>
  <ScrollContainer wrapper-class="flex flex-col gap-y-4 max-sm:gap-y-2">
    <div class="grid grid-cols-1 gap-4 max-sm:gap-2 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="{
          title,
          value,
          precision,
          percentage,
          description,
          iconBgClass,
          iconClass,
        } in cardList"
        :key="title"
        class="flex items-center justify-between gap-x-4 overflow-hidden rounded bg-naive-card p-6 shadow-xs transition-[background-color]"
      >
        <div class="flex-1">
          <span class="text-sm font-medium text-neutral-450">{{ title }}</span>
          <div class="mt-1 mb-1.5 flex gap-x-4 text-2xl text-neutral-700 dark:text-neutral-400">
            <NNumberAnimation
              :to="value"
              show-separator
              :precision="precision"
            />
          </div>
          <div class="flex items-center">
            <div
              class="flex items-center gap-x-0.5 rounded-xs px-1.5 py-0.5 text-xs transition-[background-color,color]"
              :class="
                percentage > 0
                  ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                  : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
              "
            >
              <span
                :class="percentage > 0 ? 'iconify ph--arrow-up' : 'iconify ph--arrow-down'"
              ></span>
              <span class="font-medium">{{ Math.abs(percentage) }}%</span>
            </div>
            <span class="ml-2 text-neutral-500 dark:text-neutral-400">{{ description }}</span>
          </div>
        </div>
        <div>
          <div
            class="grid place-items-center rounded-full p-3"
            :class="iconBgClass"
          >
            <span
              class="size-7"
              :class="iconClass"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 overflow-hidden max-sm:gap-2 lg:grid-cols-12">
      <div class="col-span-1 lg:col-span-8">
        <div
          class="rounded bg-naive-card px-5 pt-5 pb-4.5 shadow-xs transition-[background-color]"
          style="height: 400px"
        >
          <div
            ref="revenueChart"
            class="h-full"
          />
        </div>
      </div>
      <div class="col-span-1 lg:col-span-4">
        <div
          class="flex flex-col rounded bg-naive-card px-5 pt-5 pb-4.5 shadow-xs transition-[background-color]"
          style="height: 400px"
        >
          <div
            ref="revenueBarChart"
            class="flex-1"
          />
          <div
            ref="revenueBarChart2"
            style="height: 150px"
          />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-4 overflow-hidden max-sm:gap-2 lg:grid-cols-12">
      <div class="col-span-1 lg:col-span-5">
        <div
          class="rounded bg-naive-card px-5 pt-5 pb-3 shadow-xs transition-[background-color]"
          style="height: 340px"
        >
          <div
            ref="monthlyRadarChart"
            class="h-full"
          />
        </div>
      </div>
      <div class="col-span-1 lg:col-span-7">
        <div
          class="rounded bg-naive-card p-5 shadow-xs transition-[background-color]"
          style="height: 340px; position: relative"
        >
          <div
            ref="highestRevenueChart"
            class="h-full"
          />
        </div>
      </div>
    </div>
  </ScrollContainer>
</template>
