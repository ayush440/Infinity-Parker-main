<template>
  <div class="relative w-full bg-[#2a2a2c] min-h-screen">
    <div class="px-6 py-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-semibold text-white">Dashboard</h1>
        <h2 class="text-xl font-semibold text-white">Total profit</h2>
      </div>

      <!-- Main Grid Layout -->
      <div class="grid grid-cols-12 gap-4">
        <!-- Left Section - Stats Cards -->
        <div class="col-span-12 md:col-span-7 lg:col-span-4 grid grid-cols-2 gap-4">
          <!-- Total Orders -->
          <div class="bg-[#1d1d20] p-4 rounded-lg ">
            <div class="flex flex-col gap-2">
              <div class="">
                <img src="/public/bag2.svg" alt="" class="" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">{{ combinedTotalOrders }}</h3>
                <p class="text-sm text-gray-400">Total orders</p>
              </div>
            </div>
          </div>

          <!-- Strategy Deployed -->
          <div class="bg-[#1d1d20] p-4 rounded-lg">
            <div class="flex flex-col gap-2">
              <div class="">
                <img src="/public/Graph2.svg" alt="" class="" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">{{ totalStrategies }}</h3>
                <p class="text-sm text-gray-400">Strategy deployed</p>
              </div>
            </div>
          </div>

          <!-- Brokers -->
          <div class="bg-[#1d1d20] p-4 rounded-lg">
            <div class="flex flex-col gap-2">
              <div class="">
                <img src="/public/Handshake2.svg" alt="" class="" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">{{ brokersToken.message }}</h3>
                <p class="text-sm text-gray-400">Brokers</p>
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div class="bg-[#1d1d20] p-4 rounded-lg">
            <div class="flex flex-col gap-2">
              <div class="">
                <img src="/public/Social2.svg" alt="" class="" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">
                  <a href="#" class="hover:text-white transition-colors">Connect</a>
                </h3>
                <p class="text-sm text-gray-400">Social media</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Section - Profit Chart -->
        <div class="col-span-12 md:col-span-5 lg:col-span-8">
          <div class="bg-[#1d1d20] rounded-lg py-6">
            <div class="flex justify-between gap-4 ">
              <!-- Donut Chart with Animation -->
              <div class="relative w-[300px] h-[300px] animate-slide-in-left px-4 flex justify-center ml-16 md:ml-0 ">
                <canvas ref="profitChart" class=""></canvas>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <p class="text-sm text-white font-bold ">Profit</p>
                    <p class="text-xl font-bold text-green-400">
                      {{ formatPnL(combinedTotalPnL) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Legend with Animation -->

              <div class="flex-1 animate-slide-in-right hidden lg:block">
                <div class="space-y-4   p-4">
                  <div v-for="(item, index) in displayedChartData" :key="index"
                    class="flex items-center justify-between px-6 py-6 border-b border-gray-600">
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: item.color }"></span>
                      <span class="text-gray-300">{{ item.symbol }}</span>
                    </div>
                    <span
                      :class="{ 'text-green-400': parseFloat(item.pnl) > 0, 'text-red-400': parseFloat(item.pnl) < 0 }">
                      {{ formatPnL(parseFloat(item.pnl)) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="space-y-4 bg-[#1d1d20] mt-3 rounded-md p-4 lg:hidden">
        <div v-for="(item, index) in displayedChartData" :key="index"
          class="flex items-center justify-between px-6 py-6 border-b border-gray-600">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: item.color }"></span>
            <span class="text-gray-300">{{ item.symbol }}</span>
          </div>
          <span :class="{ 'text-green-400': parseFloat(item.pnl) > 0, 'text-red-400': parseFloat(item.pnl) < 0 }">
            {{ formatPnL(parseFloat(item.pnl)) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Positions Table -->
    <div class=" text-white text-2xl mx-8  mb-5 flex justify-between ">

      <p> Positons</p>
      <RouterLink to="/positions"
        class="text-sm text-white px-4 rounded-lg hover:text-white flex items-center gap-2 border border-gray-600 ">
        View All
        <ArrowRightIcon class="w-4 h-4" />
      </RouterLink>
    </div>
    <div class="bg-[#1d1d20] rounded-lg mx-6">


      <!-- <div class="p-4 sm:p-6 border-b">
        <div class="flex justify-between items-center">
          <h2 class="text-lg text-gray-500 font-semibold">Positions</h2>
          <RouterLink to="/positions" 
                    class="text-sm text-gray-500 hover:text-white flex items-center gap-2">
            All
            <ArrowRightIcon class="w-4 h-4" />
          </RouterLink>
        </div>
      </div> -->
      <div class="overflow-x-auto">
        <positionTable :positions="displayedPositions.slice(0, maxDisplayedPositions)" :mode="isTabActive" />
      </div>
      <div v-if="displayedPositions.length > maxDisplayedPositions" class="p-4 text-center">
        <button @click="openPositionsSidebar" class="text-blue-600 hover:white">
          View More
        </button>
      </div>
    </div>
  </div>
  <!-- <sqOffPosition /> -->
  <sqoffManual />
  <SideBar2 :isOpen="isSidebarOpen" @close="closeSidebar" :title="sidebarTitle">
    <div v-if="sidebarContent === 'chart'" class="p-4">
      <positionTable :positions="remainingChartData" :mode="isTabActive" :isChartData="true" />
    </div>
    <div v-else-if="sidebarContent === 'positions'" class="p-4">
      <positionTable :positions="displayedPositions.slice(maxDisplayedPositions)" :mode="isTabActive" />
    </div>
  </SideBar2>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/stores/matrix/profile'
import { useBrokersStore } from '@/stores/matrix/broker'
import { useOrdersStore } from '@/stores/matrix/order'
import { usePositionsStore } from '@/stores/matrix/position'
import { usePaperPositionsStore } from '@/stores/matrix/paperPositions'
import sqOffPosition from '../position/sqOffPosition.vue'
import sqoffManual from '../position/sqoffManual.vue'
import {
  ChartLineIcon,
  NetworkIcon,
  ShoppingCartIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  PieChartIcon,
  DiamondIcon
} from 'lucide-vue-next'

import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js"
import positionTable from './content/positionTable/Main.vue'
import { useManualOrdersStore } from "@/stores/groups/manualOrders"
import SideBar2 from '@/components/sidebar2/main.vue'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, Title)

const profitChart = ref<HTMLCanvasElement | null>(null)
let chart: any = null

const manualOrdersStore = useManualOrdersStore()
const profileStore = useProfileStore()
const brokersStore = useBrokersStore()
const ordersStore = useOrdersStore()
const positionsStore = usePositionsStore()
const paperPositionsStore = usePaperPositionsStore()

const { profile } = storeToRefs(profileStore)
const { brokers } = storeToRefs(brokersStore)
const { positions, strategiesPositions, isTabActive } = storeToRefs(positionsStore)
const { paperPositions } = storeToRefs(paperPositionsStore)

const maxDisplayedPositions = 5
const maxDisplayChartItems = 5
const isSidebarOpen = ref(false)
const sidebarContent = ref<'chart' | 'positions'>('chart')
const sidebarTitle = computed(() => sidebarContent.value === 'chart' ? 'Additional Profit Items' : 'Additional Positions')

const openChartSidebar = () => {
  sidebarContent.value = 'chart'
  isSidebarOpen.value = true
}

const showTableData = computed<boolean>(() => {
  const state = positionsStore.state[positionsStore.endpoint];
  return state && state.loading === false;
})

const openPositionsSidebar = () => {
  sidebarContent.value = 'positions'
  isSidebarOpen.value = true
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

// Combined chart data based on mode
const combinedChartData = computed(() => {
  let data = []

  if (isTabActive.value === 'live') {
    data.push(...Object.entries(strategiesPositions.value).map(([strategyId, data]: any) => ({
      symbol: data.name,
      pnl: data.pnl,
      color: data.color,
      isPaper: false
    })))
  } else if (isTabActive.value === 'paper') {
    data.push(...Object.entries(paperPositionsStore.mainPaperPositions).map(([strategyId, data]: any) => ({
      symbol: data.name,
      pnl: data.pnl,
      color: data.color,
      isPaper: true
    })))
  }

  return data
})

// Split chart data into displayed and remaining items
const displayedChartData = computed(() => {
  return combinedChartData.value.slice(0, maxDisplayChartItems)
})

const remainingChartData = computed(() => {
  return combinedChartData.value.slice(maxDisplayChartItems)
})

const hasMoreChartItems = computed(() => {
  return combinedChartData.value.length > maxDisplayChartItems
})

// Combined total PnL based on mode
const combinedTotalPnL = computed(() => {
  let total = 0

  if (isTabActive.value === 'live') {
    total += Object.values(strategiesPositions.value).reduce((sum: number, strategy: any) => sum + strategy.pnl, 0)
  } else if (isTabActive.value === 'paper') {
    total += Object.values(paperPositionsStore.mainPaperPositions).reduce((sum: number, strategy: any) => sum + strategy.pnl, 0)
  }

  return total
})

// Combined total orders based on mode
const combinedTotalOrders = computed(() => {
  let total = 0

  if (isTabActive.value === 'live') {
    total += ordersStore.totalOrders + manualOrdersStore.totalManualOrders
  }

  return total
})

// Displayed positions based on mode
const displayedPositions = computed(() => {
  let positionsToDisplay = []

  if (isTabActive.value === 'live') {
    positionsToDisplay.push(...positions.value.map((p: any) => ({ ...p, isPaper: false })))
  } else if (isTabActive.value === 'paper') {
    // Check if paperPositions.value is an array before using map
    if (Array.isArray(paperPositions.value)) {
      positionsToDisplay.push(...paperPositions.value.map(p => ({ ...p, isPaper: true })))
    } else {
      console.warn('paperPositions.value is not an array:', paperPositions.value)
      // If it's not an array, you might want to handle it differently, e.g.:
      // positionsToDisplay = Object.values(paperPositions.value).map(p => ({ ...p, isPaper: true }))
    }
  }

  return positionsToDisplay
})

const formatPnL = (pnl: number) => {
  return pnl > 0 ? `+₹${pnl.toFixed(2)}` : `₹${pnl.toFixed(2)}`
}

const createChart = () => {
  if (profitChart.value) {
    const ctx = profitChart.value.getContext('2d')
    if (ctx) {
      chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: displayedChartData.value.map(item => `${item.symbol}${item.isPaper ? ' (Paper)' : ''}`),
          datasets: [{
            data: displayedChartData.value.map(item => item.pnl),
            backgroundColor: displayedChartData.value.map(item => item.color),
            borderWidth: 0,
            borderColor: '#ffffff',
          }]
        },
        options: {
          cutout: '50%',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || ''
                  const value = context.raw as number
                  return `${label}: ${formatPnL(value)}`
                }
              }
            }
          },
        }
      })
    }
  }
}

const updateChart = () => {
  if (chart) {
    chart.data.labels = displayedChartData.value.map(item => `${item.symbol}${item.isPaper ? ' (Paper)' : ''}`)
    chart.data.datasets[0].data = displayedChartData.value.map(item => item.pnl)
    chart.data.datasets[0].backgroundColor = displayedChartData.value.map(item => item.color)
    chart.update()
  }
}

onMounted(async () => {
  await positionsStore.getPositions()
  await paperPositionsStore.getPaperPositions()
  nextTick(() => {
    createChart()
  })
})

watch(() => [strategiesPositions.value, paperPositionsStore.mainPaperPositions, isTabActive.value], updateChart, { deep: true })

interface Broker {
  id: number
  broker_name: string
  broker_token_date: string
  token_status: string
  message: string
  updated_at: string
}

interface BrokerArray extends Array<Broker> { }

const brokersData = computed<BrokerArray>(() => brokers.value)

const brokersToken = computed(() => {
  const totalBrokers = brokersData.value.length
  if (totalBrokers > 0) {
    const today = new Date().toISOString().split("T")[0]
    const tokensGeneratedToday = brokersData.value.filter((broker: any) =>
      broker.broker_token_date.split("T")[0] === today && broker.token_status === "success"
    ).length

    let message = `${tokensGeneratedToday}/${totalBrokers}`
    let color = tokensGeneratedToday > 0 ? "text-emerald-500" : "text-rose-600"

    if (totalBrokers === 1) {
      message = tokensGeneratedToday === 1 ? "1/1" : "0/1"
    }
    return { message, color }
  } else {
    return { message: "0/0", color: "text-slate-500" }
  }
})

const totalStrategies = computed(() => {
  return Object.keys(strategiesPositions.value).length;
});
</script>

<style scoped lang="scss">
.donut-chart-container {
  @apply bg-[#1d1d20] rounded-lg shadow-sm p-4 sm:p-6 border border-white;
  height: 270px;
  /* Fixed height */
}

.donut-chart-wrapper {
  @apply w-1/2 flex flex-col items-center justify-center;
}

.donut-chart {
  @apply h-[200px] w-full max-w-[200px] sm:h-[200px] sm:max-w-[200px];
}

.legend-wrapper {
  @apply max-w-3/4 sm:w-1/2 pl-4 flex flex-col justify-center;
  max-height: 300px;
  /* Fixed max height */
  overflow-y: auto;
}

.legend-item {
  @apply flex items-center mb-2 last:mb-0;
}

.legend-color {
  @apply w-3 h-3 rounded-full mr-2;
}

.legend-name {
  @apply flex-1 text-xs sm:text-sm text-gray-700 truncate sm:max-w-[125px] cursor-pointer;
}

.legend-value {
  @apply text-xs sm:text-sm font-semibold text-gray-900 ml-2;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.ord_pos_div {
  @apply overflow-auto shadow-inner shadow-primary w-full;
  max-height: calc(58vh);
  border-radius: 0 0 8px 8px;

  &::-webkit-scrollbar {
    @apply w-1 h-1;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded;
  }

  &::-webkit-scrollbar-track {
    @apply bg-gray-100;
  }
}

@media (max-width: 640px) {
  .donut-chart {
    height: 100%;
    max-width: 100%;
  }

  .legend-wrapper {
    padding-left: 2px;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .donut-chart-container {

    .donut-chart-wrapper,
    .legend-wrapper {
      width: 50%;
    }
  }
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>