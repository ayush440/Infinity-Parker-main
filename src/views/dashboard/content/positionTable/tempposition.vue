<template>
    <div class="min-h-screen bg-[#2a2a2c] p-6">
      <!-- Header Section -->
      <nav class="flex items-center gap-2 text-gray-400 mb-6">
        <span>Home</span>
        <span class="text-gray-600">›</span>
        <span>Positions</span>
      </nav>
  
      <h1 class="text-white text-2xl mb-6">Positions</h1>
  
      <!-- Search and Filters Section -->
      <div class="flex justify-between items-center p-4 rounded-t-lg bg-[#1c1c1f] mb-1">
        <div class="flex items-center gap-4">
          <!-- Search with button -->
          <div class="relative flex items-center">
            <input
              type="text"
              placeholder="Search strategy"
              v-model="searchQuery"
              class="w-64 bg-[#1c1c1f] text-white pl-10 pr-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-[#7C3AED]"
            />
            <SearchIcon class="absolute left-3 h-5 w-5 text-gray-400" />
            <button 
              @click="handleSearch"
              class="ml-2 px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D31D9] transition-colors"
            >
              Search
            </button>
          </div>
  
          <!-- Strategy Dropdown -->
          <div class="relative">
            <button 
              @click="toggleStrategyDropdown"
              class="flex items-center gap-2 px-4 py-2 bg-[#1c1c1f] text-white border border-gray-700 rounded-md"
            >
              Strategies
              <ChevronDownIcon class="h-4 w-4" :class="{ 'rotate-180': showStrategyDropdown }" />
            </button>
            <div v-if="showStrategyDropdown" class="absolute z-10 mt-2 w-56 bg-[#1c1c1f] border border-gray-700 rounded-md shadow-lg">
              <div class="py-1">
                <button
                  v-for="strategy in uniqueStrategies"
                  :key="strategy"
                  @click="selectStrategy(strategy)"
                  class="block w-full px-4 py-2 text-left text-white hover:bg-[#2a2a2c]"
                >
                  {{ strategy }}
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Status Filters -->
        <div class="flex items-center gap-6">
          <span class="text-gray-400">Showing position type:</span>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="filters.all" 
                @change="handleFilterChange('all')"
                class="form-checkbox" 
              />
              <span class="text-gray-400">All</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="filters.open"
                @change="handleFilterChange('open')"
                class="form-checkbox" 
              />
              <span class="text-gray-400">Open</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="filters.closed"
                @change="handleFilterChange('closed')"
                class="form-checkbox" 
              />
              <span class="text-gray-400">Closed</span>
            </label>
          </div>
        </div>
      </div>
  
      <!-- Table Section -->
      <div class="bg-[#1d1d20] rounded-b-lg overflow-hidden">
        <table class="w-full border-collapse">
          <thead>
            <tr class="text-gray-400 text-sm border-b border-gray-700">
              <th class="py-4 px-6 text-left font-medium">Strategy</th>
              <th class="py-4 px-6 text-left font-medium">Side</th>
              <th class="py-4 px-6 text-center font-medium">QTY</th>
              <th class="py-4 px-6 text-right font-medium">PNL</th>
              <th class="py-4 px-6 text-center font-medium">Status</th>
              <th class="py-4 px-6 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="position in filteredPositions" :key="position.id">
              <tr class="border-b border-gray-700/50">
                <td colspan="6" class="p-0">
                  <div 
                    class="grid grid-cols-6 cursor-pointer hover:bg-[#262626] transition-colors" 
                    :class="{'bg-[#262626]': expandedRow === position.id}"
                    @click="toggleExpand(position.id)"
                  >
                    <div class="py-4 px-6 text-white">{{ position.strategy?.name || 'Multidisciplinary' }}</div>
                    <div class="py-4 px-6 text-white">{{ position.side }}</div>
                    <div class="py-4 px-6 text-center text-white">{{ position.quantity }}/25</div>
                    <div class="py-4 px-6 text-right" :class="Number(calculatePnL(position)) >= 0 ? 'text-green-400' : 'text-red-400'">
                      {{ Number(calculatePnL(position)) >= 0 ? '+' : '' }}{{ calculatePnL(position) }}
                    </div>
                    <div class="py-4 px-6 flex justify-center">
                      <span 
                        class="px-3 py-1 rounded-full text-xs font-medium inline-block min-w-[4rem] text-center"
                        :class="position.status === 'OPEN' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'"
                      >
                        {{ position.status.toLowerCase() }}
                      </span>
                    </div>
                    <div class="py-4 px-6 text-right">
                      <button
                        v-if="position.status === 'OPEN'"
                        @click.stop="openSquareOffModal(position)"
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7C3AED] bg-[#1d1d20]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20 transition-colors"
                      >
                        Square Off
                        <ChevronDownIcon class="w-4 h-4" :class="{'rotate-180': expandedRow === position.id}" />
                      </button>
                      <span v-else class="text-gray-500 text-sm">
                        Closed at {{ formatTime(position.updated_at) }}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
              <!-- Expanded Row -->
              <tr v-if="expandedRow === position.id" class="bg-[#262626]">
                <td colspan="6">
                  <div class="grid grid-cols-5 gap-6 p-6">
                    <div class="space-y-1">
                      <div class="text-gray-400 text-sm">Script</div>
                      <div class="text-white">{{ position.strategy?.script || 'Nifty36FDWTE72' }}</div>
                    </div>
                    <div class="space-y-1">
                      <div class="text-gray-400 text-sm">Broker</div>
                      <div class="text-white">{{ position.broker?.broker_name || 'DHAN2DS2E28G' }}</div>
                    </div>
                    <div class="space-y-1">
                      <div class="text-gray-400 text-sm">Buy price</div>
                      <div class="text-white">₹{{ position.buy_price }} ({{ formatTime(position.buy_time) }})</div>
                    </div>
                    <div class="space-y-1">
                      <div class="text-gray-400 text-sm">Sell price</div>
                      <div class="text-white">₹{{ position.sell_price }} ({{ formatTime(position.sell_time) }})</div>
                    </div>
                    <div class="space-y-1">
                      <div class="text-gray-400 text-sm">LTP</div>
                      <div class="text-white">{{ getLtp(position) }}</div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  
    <sqOffPosition />
    <sqoffManual />
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SearchIcon, ChevronDownIcon } from 'lucide-vue-next'
  import { usePositionsStore } from '@/stores/matrix/position'
  import { useManualPositionsStore } from '@/stores/groups/manualPosition'
  import { useProfileStore } from '@/stores/matrix/profile'
  import { usePaperPositionsStore } from "@/stores/matrix/paperPositions"
  import { useTickerStore } from '@/stores/matrix/ticker/ticker'
  import sqOffPosition from '@/views/position/sqOffPosition.vue'
  import sqoffManual from '@/views/position/sqoffManual.vue'
  
  // Store references
  const profileStore = useProfileStore()
  const positionsStore = usePositionsStore()
  const manualPositionsStore = useManualPositionsStore()
  const paperPositionsStore = usePaperPositionsStore()
  const tickerStore = useTickerStore()
  
  // State
  const searchQuery = ref('')
  const expandedRow = ref<number | null>(null)
  const showStrategyDropdown = ref(false)
  const selectedStrategy = ref('')
  const filters = ref({
    all: true,
    open: false,
    closed: false
  })
  
  // Store state
  const { profile } = storeToRefs(profileStore)
  const { positions } = storeToRefs(positionsStore)
  const { manualPositions } = storeToRefs(manualPositionsStore)
  const { paperPositions } = storeToRefs(paperPositionsStore)
  const { showSqOffModal } = storeToRefs(positionsStore)
  
  // Computed
  interface Position {
    id: number;
    strategy?: {
      name: string;
      script: string;
    };
    broker?: {
      broker_name: string;
    };
    side: string;
    quantity: number;
    status: string;
    buy_price: number;
    sell_price: number;
    buy_time: string;
    sell_time: string;
    updated_at: string;
  }
  
  const uniqueStrategies = computed(() => {
    const strategies = new Set(positions.value.map((p: Position) => p.strategy?.name || 'Multidisciplinary'))
    return Array.from(strategies) as string[]
  })
  
  const filteredPositions = computed<Position[]>(() => {
    let filtered = [...positions.value] as Position[]
  
    // Apply strategy filter
    if (selectedStrategy.value) {
      filtered = filtered.filter(p => 
        (p.strategy?.name || 'Multidisciplinary') === selectedStrategy.value
      )
    }
  
    // Apply search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(p => 
        (p.strategy?.name || '').toLowerCase().includes(query) ||
        (p.broker?.broker_name || '').toLowerCase().includes(query)
      )
    }
  
    // Apply status filters
    if (!filters.value.all) {
      if (filters.value.open) filtered = filtered.filter(p => p.status === 'OPEN')
      if (filters.value.closed) filtered = filtered.filter(p => p.status === 'CLOSED')
    }
  
    return filtered
  })
  
  // Methods
  function handleSearch() {
    // Trigger search with current query
    console.log('Searching for:', searchQuery.value)
  }
  
  function toggleStrategyDropdown() {
    showStrategyDropdown.value = !showStrategyDropdown.value
  }
  
  function selectStrategy(strategy: string) {
    selectedStrategy.value = strategy
    showStrategyDropdown.value = false
  }
  
  function handleFilterChange(type: 'all' | 'open' | 'closed') {
    if (type === 'all') {
      filters.value.open = false
      filters.value.closed = false
    } else {
      filters.value.all = false
    }
  }
  
  function toggleExpand(positionId: number) {
    expandedRow.value = expandedRow.value === positionId ? null : positionId
  }
  
  function openSquareOffModal(position: any) {
    showSqOffModal.value = true
    positionsStore.selectedPosition = position
  }
  
  function calculatePnL(position: any) {
    const ltp = getLtp(position)
    let pnl = 0
  
    if (position.status === "CLOSED") {
      if (position.sell_price && position.buy_price) {
        pnl = position.sell_price * position.quantity - position.buy_price * position.quantity
      }
    } else if (position.status === "OPEN") {
      if (position.side === 'BUY' && position.buy_price && ltp) {
        pnl = (ltp - position.buy_price) * position.quantity
      } else if (position.side === 'SELL' && position.sell_price && ltp) {
        pnl = (position.sell_price - ltp) * position.quantity
      }
    }
  
    return pnl.toFixed(2)
  }
  
  function getLtp(position: any) {
    const ltp = tickerStore.getLastPrice(position.instrument_token)
    return ltp || position.last_price
  }
  
  function formatTime(time: string) {
    if (!time) return '09:20 AM'
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
  </script>
  
  <style scoped>
  .form-checkbox {
    @apply rounded border-gray-600 text-[#7C3AED] focus:ring-[#7C3AED] focus:ring-offset-0 focus:ring-offset-transparent;
  }
  </style>