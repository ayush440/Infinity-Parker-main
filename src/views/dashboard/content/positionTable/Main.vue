<template>
  <div class="w-full bg-[#1D1D20] p-6 rounded-lg">
    <!-- Desktop Header -->
    <div class="hidden md:flex justify-between items-center p-4 rounded-t-lg bg-[#1c1c1f] mb-1">
      <!-- Search and Strategy Section -->
      <div class="flex items-center gap-4">
        <!-- Search Input -->
        <div class="relative flex items-center">
          <input
            type="text"
            placeholder="Search strategy"
            v-model="searchQuery"
            @input="handleSearch"
            class="w-64 bg-[#1c1c1f] text-white pl-10 pr-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-[#7C3AED]"
          />
          <SearchIcon class="absolute left-3 h-5 w-5 text-gray-400" />
        </div>

        <!-- Strategy Dropdown -->
        <div class="relative">
          <button 
            @click="toggleStrategyDropdown"
            class="flex items-center gap-2 px-4 py-2 bg-[#1c1c1f] text-white border border-gray-700 rounded-md hover:border-[#7C3AED] transition-colors"
          >
            {{ selectedStrategy || 'Strategies' }}
            <ChevronDownIcon class="h-4 w-4" :class="{ 'rotate-180': showStrategyDropdown }" />
          </button>
          <div 
            v-if="showStrategyDropdown" 
            class="absolute z-10 mt-2 w-56 bg-[#1c1c1f] border border-gray-700 rounded-md shadow-lg"
          >
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
              class="form-checkbox rounded bg-[#2C2C2E] border-gray-600 text-[#7C3AED]" 
            />
            <span class="text-gray-400">All</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="filters.open"
              @change="handleFilterChange('open')"
              class="form-checkbox rounded bg-[#2C2C2E] border-gray-600 text-[#7C3AED]" 
            />
            <span class="text-gray-400">Open</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="filters.closed"
              @change="handleFilterChange('closed')"
              class="form-checkbox rounded bg-[#2C2C2E] border-gray-600 text-[#7C3AED]" 
            />
            <span class="text-gray-400">Closed</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Mobile Header -->
    <div class="md:hidden space-y-4 mb-4">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-white">Positions</h2>
        <button 
          @click="showFilterModal = true"
          class="bg-[#1d1d20] text-white p-2 rounded-lg hover:bg-[#2a2a2c]"
        >
          <SlidersHorizontal class="w-5 h-5" />
        </button>
      </div>
      <div class="relative">
        <input
          type="text"
          placeholder="Search strategy"
          v-model="searchQuery"
          @input="handleSearch"
          class="w-full bg-[#1c1c1f] text-white pl-10 pr-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-[#7C3AED]"
        />
        <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
    </div>

    <!-- Desktop View -->
    <div class="hidden md:block space-y-2">
      <!-- Table Header -->
      <div class="grid grid-cols-8 gap-4 px-4 py-3 text-sm font-medium text-gray-400">
        <div class="col-span-2">STRATEGY NAME</div>
        <div>QUANTITY</div>
        <div>SIDE</div>
        <div>TIME</div>
        <div>P&L</div>
        <div>STATUS</div>
        <div>ACTION</div>
      </div>

      <!-- Strategy Groups -->
      <template v-if="filteredPositions.length > 0">
        <div v-for="(group, strategyId) in groupedFilteredPositions" :key="strategyId" class="mb-4">
          <!-- Strategy Header -->
          <div class="flex justify-between items-center px-4 py-3 bg-[#262626] rounded-t-lg text-white">
            <h3 class="font-semibold text-lg">{{ group.name }}</h3>
            <div :class="getPnLColor(group.pnl)" class="font-bold">
              {{ formatPnL(group.pnl) }}
            </div>
          </div>

          <!-- Position Rows -->
          <div v-for="position in group.positions" :key="position.id" class="relative">
            <!-- Main Row -->
            <div
              class="grid grid-cols-8 gap-4 px-4 py-3 cursor-pointer bg-[#1d1d20] text-white hover:bg-[#2a2a2c] transition-colors"
              :class="{ 'rounded-b-none': expandedRows[position.id] }"
              @click="toggleExpand(position.id)"
            >
              <div class="col-span-2 truncate">{{ group.name }}</div>
              <div>{{ position.quantity }}</div>
              <div>{{ position.side }}</div>
              <div>{{ formatTime(position.updated_at) }}</div>
              <div :class="getPnLColor(position.pnl)">{{ formatPnL(position.pnl) }}</div>
              <div>
                <span 
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="position.status === 'OPEN' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'"
                >
                  {{ position.status.toLowerCase() }}
                </span>
              </div>
              <div>
                <div class="flex items-center justify-end">
                <ChevronDownIcon 
                  v-if="expandedRows[position.id]" 
                  class="w-5 h-5 text-gray-400" 
                />
                <ChevronRightIcon 
                  v-else 
                  class="w-5 h-5 text-gray-400" 
                />
              </div>
                <button
                    v-if="position.status === 'OPEN'"
                    @click.stop="openSquareOffModal(position)"
                    class="inline-flex items-center gap-2 px-3  rounded-full border border-[#7C3AED] bg-[#1d1d20]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20 transition-colors"
                  >
                    Square Off
                   <img src="/public/off.png" alt="">
                  </button>
                <span v-else class="text-gray-500 text-sm">
                  Closed at {{ formatTime(position.updated_at) }}
                </span>
              </div>
             
            </div>

            <!-- Expanded Details -->
            <div 
              v-if="expandedRows[position.id]" 
              class="grid grid-cols-8 gap-4 px-4 py-6 bg-[#262626] rounded-b-lg"
            >
              <!-- Strategy -->
              <div class="col-span-2">
                <p class="text-sm font-medium text-gray-500 mb-1">Strategy</p>
                <p class="text-sm text-white truncate">{{ position.tradingsymbol }}</p>
              </div>
              
              <!-- Broker -->
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Broker</p>
                <p class="text-sm text-white truncate">{{ position.broker?.broker_name }}</p>
              </div>
              
              <!-- Scripts -->
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Scripts</p>
                <p class="text-sm text-white truncate">{{ group.script }}</p>
              </div>
              
              <!-- Buy Price -->
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Buy Price</p>
                <p class="text-sm text-white">{{ position.buy_price }}</p>
              </div>
              
              <!-- Sell Price -->
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Sell Price</p>
                <p class="text-sm text-white">{{ position.sell_price }}</p>
              </div>
              
              <!-- P&L -->
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">P&L</p>
                <p :class="['text-sm', getPnLColor(position.pnl)]">
                  {{ formatPnL(position.pnl) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Loading State -->
      <div v-else-if="!showTableData" class="flex justify-center py-8">
        <LoadingIcon icon="puff" class="w-8 h-8 text-[#7C3AED]" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8 text-gray-400">
        No positions found
      </div>
    </div>

    <!-- Mobile View -->
    <div class="md:hidden space-y-4">
      <template v-if="filteredPositions.length > 0">
        <div v-for="(group, strategyId) in groupedFilteredPositions" :key="strategyId" class="mb-4">
          <div v-for="position in group.positions" :key="position.id" 
               class="bg-[#1d1d20] p-4 rounded-lg border-t border-gray-700">
            <!-- Position Header -->
            <div class="flex justify-between items-center mb-2">
              <div class="text-white font-medium">{{ position.tradingsymbol }}</div>
              <div :class="getPnLColor(position.pnl)">{{ formatPnL(position.pnl) }}</div>
            </div>

            <!-- Position Details -->
            <div class="flex justify-between items-center text-sm text-gray-400 mb-2">
              <div>{{ position.quantity }} | {{ position.side }}</div>
              <div>{{ formatTime(position.updated_at) }}</div>
            </div>

            <!-- Status and Actions -->
            <div class="flex justify-between items-center">
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="position.status === 'OPEN' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'"
              >
                {{ position.status.toLowerCase() }}
              </span>
              <button
                v-if="position.status === 'OPEN'"
                @click.stop="openSquareOffModal(position)"
                class="flex items-center gap-1 px-3 py-1 rounded-full border border-[#7C3AED] bg-[#1d1d20] text-[#7C3AED] text-sm hover:bg-[#7C3AED]/10 transition-colors"
              >
                Square Off
                <img src="/public/off.png" alt="Square Off" class="w-4 h-4">
              </button>
              <span v-else class="text-gray-500 text-sm">
                Closed at {{ formatTime(position.updated_at) }}
              </span>
            </div>

            <!-- Expandable Details -->
            <div 
              @click="toggleExpand(position.id)" 
              class="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400 flex items-center justify-center cursor-pointer"
            >
              <span>{{ expandedRows[position.id] ? 'Hide' : 'Show' }} Details</span>
              <ChevronDownIcon v-if="expandedRows[position.id]" class="w-4 h-4 ml-1" />
              <ChevronRightIcon v-else class="w-4 h-4 ml-1" />
            </div>

            <!-- Expanded Content -->
            <div v-if="expandedRows[position.id]" class="mt-3 space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Broker:</span>
                <span class="text-white">{{ position.broker?.broker_name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Script:</span>
                <span class="text-white">{{ group.script }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Buy Price:</span>
                <span class="text-white">{{ position.buy_price }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Sell Price:</span>
                <span class="text-white">{{ position.sell_price }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Mobile Loading State -->
      <div v-else-if="!showTableData" class="flex justify-center py-8">
        <LoadingIcon icon="puff" class="w-8 h-8 text-[#7C3AED]" />
      </div>

      <!-- Mobile Empty State -->
      <div v-else class="text-center py-8 text-gray-400">
        No positions found
      </div>
    </div>
  </div>

  <!-- Mobile Filter Modal -->
  <Transition name="modal">
    <div v-if="showFilterModal" class="fixed inset-0 z-50 md:hidden">
      <div class="absolute inset-0 bg-black/25" @click="showFilterModal = false"></div>
      <div class="absolute bottom-0 left-0 right-0 bg-[#1d1d20] rounded-t-2xl p-6">
        <h3 class="text-lg font-medium text-white mb-4">Filter Positions</h3>
        
        <!-- Filter Options -->
        <div class="space-y-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="filters.all" 
              @change="handleFilterChange('all')"
              class="form-checkbox rounded bg-[#2C2C2E] border-gray-600 text-[#7C3AED]" 
            />
            <span class="text-white">All</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="filters.open"
              @change="handleFilterChange('open')"
              class="form-checkbox rounded bg-[#2C2C2E] border-gray-600 text-[#7C3AED]" 
            />
            <span class="text-white">Open</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="filters.closed"
              @change="handleFilterChange('closed')"
              class="form-checkbox rounded bg-[#2C2C2E] border-gray-600 text-[#7C3AED]" 
            />
            <span class="text-white">Closed</span>
          </label>
        </div>

        <!-- Strategy Selection -->
        <div class="mt-6">
          <h4 class="text-white font-medium mb-2">Select Strategy</h4>
          <select 
            v-model="selectedStrategy" 
            @change="selectStrategy"
            class="w-full bg-[#2C2C2E] text-white border border-gray-600 rounded-lg px-3 py-2 focus:border-[#7C3AED] focus:outline-none"
          >
            <option value="">All Strategies</option>
            <option v-for="strategy in uniqueStrategies" :key="strategy" :value="strategy">
              {{ strategy }}
            </option>
          </select>
        </div>

        <!-- Apply Button -->
        <button
          @click="showFilterModal = false"
          class="w-full bg-[#7C3AED] text-white px-4 py-2 rounded-lg mt-6 hover:bg-[#6D28D9] transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ChevronRightIcon, ChevronDownIcon, RefreshCwIcon, SearchIcon, SlidersHorizontal } from 'lucide-vue-next'
import { usePositionsStore } from '@/stores/matrix/position'
import { useProfileStore } from '@/stores/matrix/profile'
import { usePaperPositionsStore } from "@/stores/matrix/paperPositions"
import { useManualPositionsStore } from'@/stores/groups/manualPosition'
import { useStrategiesStore } from '@/stores/matrix/strategy'

const props = defineProps<{
  positions: any[]
  mode: 'paper' | 'live' | 'both'
}>()

const paperPositionsStore = usePaperPositionsStore()
const profileStore = useProfileStore()
const positionsStore = usePositionsStore()
const manualPositionsStore = useManualPositionsStore()
const strategiesStore = useStrategiesStore()

const { profile } = storeToRefs(profileStore)
const { positions, strategiesPositions } = storeToRefs(positionsStore)
const { paperPositions } = storeToRefs(paperPositionsStore)
const { showSqOffModal, dataForSqOff, showCloseModal } = storeToRefs(positionsStore)
const { showManualSqOffModal, manualDataForSqOff, showManualCloseModal } = storeToRefs(manualPositionsStore)
const { strategies } = storeToRefs(strategiesStore)

const expandedRows = ref<any>({})
const searchQuery = ref('')
const showStrategyDropdown = ref(false)
const selectedStrategy = ref('')
const filters = ref({
  all: true,
  open: false,
  closed: false
})
const showFilterModal = ref(false)

const uniqueStrategies = computed(() => {
  const strategies = new Set(props.positions.map(p => p.strategy?.name || 'Multidisciplinary'))
  return Array.from(strategies)
})

const filteredPositions = computed(() => {
  let filtered = [...props.positions]

  if (selectedStrategy.value) {
    filtered = filtered.filter(p => 
      (p.strategy?.name || 'Multidisciplinary') === selectedStrategy.value
    )
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      (p.strategy?.name || '').toLowerCase().includes(query) ||
      (p.broker?.broker_name || '').toLowerCase().includes(query) ||
      (p.tradingsymbol || '').toLowerCase().includes(query)
    )
  }

  if (!filters.value.all) {
    if (filters.value.open) filtered = filtered.filter(p => p.status === 'OPEN')
    if (filters.value.closed) filtered = filtered.filter(p => p.status === 'CLOSED')
  }

  return filtered
})

const groupedFilteredPositions = computed(() => {
  return groupPositionsByStrategyId(filteredPositions.value)
})

const showTableData = computed<boolean>(() => {
  const state = positionsStore.state[positionsStore.endpoint]
  return state && state.loading === false
})

function handleFilterChange(type: 'all' | 'open' | 'closed') {
  if (type === 'all') {
    filters.value.open = false
    filters.value.closed = false
  } else {
    filters.value.all = false
  }
}

function selectStrategy(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  selectedStrategy.value = value;
  showFilterModal.value = false;
}

// function selectStrategy(strategy: string) {
//   selectedStrategy.value = strategy
//   showFilterModal.value = false
// }

function handleSearch() {
  // The filtering is handled by the computed property
}

function toggleStrategyDropdown() {
  showStrategyDropdown.value = !showStrategyDropdown.value
}

function toggleExpand(id: number) {
  expandedRows.value[id] = !expandedRows.value[id]
}

function formatPnL(pnl: number) {
  if(!pnl) return '₹0.00'
  return pnl > 0 ? `+₹${pnl.toFixed(2)}` : `₹${pnl.toFixed(2)}`
}

function getPnLColor(pnl: number) {
  if (pnl > 0) return 'text-green-600'
  if (pnl < 0) return 'text-red-600'
  return ''
}

function squareOff(position: any) {
  if (!position || typeof position !== 'object') {
    console.error('Invalid position object:', position)
    return
  }

  if (position.id && position.strategy_id && position.broker_id) {
    showSqOffModal.value = true
    dataForSqOff.value = {
      position_id: position.id,
      strategy_id: position.strategy_id,
      broker_id: position.broker_id
    }
  } else if (position.id) {
    showManualSqOffModal.value = true
    manualDataForSqOff.value = {
      position_id: position.id
    }
  } else {
    console.warn('Unable to determine position type:', position)
  }
}

function openSquareOffModal(position: any) {
  showSqOffModal.value = true
  positionsStore.selectedPosition = position
}

function formatTime(time: string) {
  if (!time) return '09:20 AM'
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

function groupPositionsByStrategyId(positions: any[]) {
  const groupedPositions: { [key: string]: any } = {}

  positions.forEach((position: any) => {
    const { strategy_id } = position
    const strategy = position.strategy || strategies.value.find((s: any) => s.id === strategy_id)

    if (!groupedPositions[strategy_id]) {
      groupedPositions[strategy_id] = {
        color: strategy?.color || '#000000',
        color2: strategy?.color2 || '#FFFFFF',
        pnl: 0,
        name: strategy?.name || 'Unknown Strategy',
        image_url: strategy?.image_url || '',
        script: strategy?.script || '',
        positions: [],
      }
    }

    groupedPositions[strategy_id].pnl += position.pnl
    groupedPositions[strategy_id].positions.push(position)
  })

  return groupedPositions
}

watch(() => props.positions, (newPositions) => {
  expandedRows.value = {}
}, { deep: true })

const totalPnL = computed(() => {
  return filteredPositions.value.reduce((sum: number, position: any) => sum + position.pnl, 0)
})

const positionCount = computed(() => {
  return filteredPositions.value.length
})

defineExpose({
  totalPnL,
  positionCount
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 767px) {
  .fixed {
    -webkit-overflow-scrolling: touch;
  }
}
</style>

