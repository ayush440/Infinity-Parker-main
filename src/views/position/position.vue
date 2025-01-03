<template>
  <div class="min-h-screen bg-[#2a2a2c] p-4 sm:p-6">
    <!-- Mobile Header -->
    <nav class="md:hidden items-center gap-2 text-gray-400 mb-4 sm:mb-6 text-md sm:text-base">
      <span>Home</span>
      <span class="text-gray-600 text-2xl mx-1">›</span>
      <span>Positions</span>
    </nav>
    <div class="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800">
      <div class="flex items-center gap-2">
        <button class="text-white" @click="$router.back()">
          <ChevronLeft class="h-5 w-5" />
        </button>
        <h1 class="text-xl text-white">Positions</h1>
      </div>
    </div>

    <!-- Desktop Breadcrumb -->
    <nav class="hidden md:flex items-center gap-2 text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
      <span>Home</span>
      <span class="text-gray-600">›</span>
      <span>Positions</span>
    </nav>

    <!-- Desktop Header -->
    <h1 class="hidden md:block text-white text-xl sm:text-2xl mb-4 sm:mb-6">Positions</h1>

    <!-- Search and Filters -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-t-lg bg-[#1c1c1f] gap-4 sm:gap-0">
      <!-- Search -->
      <div class="flex w-full sm:w-auto">
        <div class="relative flex-1 sm:flex-none sm:w-64">
          <input 
            type="text" 
            placeholder="Search" 
            v-model="searchQuery"
            class="w-full bg-[#1c1c1f] text-white pl-10 pr-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-[#7C3AED]" 
          />
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button 
          @click="showFilterModal = true" 
          class="ml-2 lg:hidden bg-[#1d1d20] text-white p-2 rounded-lg hover:bg-[#2a2a2c]"
        >
          <SlidersHorizontal class="w-5 h-5" />
        </button>
      </div>

      <!-- Desktop Filters -->
      <div class="hidden lg:flex items-center gap-6">
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

    <!-- Desktop Table -->
    <div class="hidden md:block bg-[#1d1d20] rounded-b-lg overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="text-gray-400 text-sm border-b border-gray-700">
            <th class="py-4 px-6 text-left font-medium w-[25%]">Strategy</th>
            <th class="py-4 px-6 text-left font-medium w-[15%]">Side</th>
            <th class="py-4 px-6 text-center font-medium w-[15%]">QTY</th>
            <th class="py-4 px-6 text-right font-medium w-[15%]">PNL</th>
            <th class="py-4 px-6 text-center font-medium w-[15%]">Status</th>
            <th class="py-4 px-6 text-right font-medium w-[15%]">Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="position in filteredPositions" :key="position.id">
            <!-- Main Row -->
            <tr class="group">
              <td colspan="6" class="p-0">
                <div 
                  class="grid grid-cols-6 cursor-pointer hover:bg-[#262626] transition-colors"
                  :class="{ 'bg-[#262626]': expandedRow === position.id }" 
                  @click="toggleExpand(position.id)"
                >
                  <div class="py-4 px-6 text-white">
                    {{ position.strategy?.name || 'Multidisciplinary' }}
                  </div>
                  <div class="py-4 px-6 text-white">
                    {{ position.side }}
                  </div>
                  <div class="py-4 px-6 text-center text-white">
                    {{ position.quantity }}/25
                  </div>
                  <div 
                    class="py-4 px-6 text-right"
                    :class="calculatePnL(position) >= 0 ? 'text-green-400' : 'text-red-400'"
                  >
                    {{ calculatePnL(position) >= 0 ? '+' : '' }}{{ calculatePnL(position) }}
                  </div>
                  <div class="py-4 px-6 flex justify-center">
                    <span 
                      class="px-3 py-1 rounded-full text-xs font-medium"
                      :class="position.status === 'OPEN' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'"
                    >
                      {{ position.status.toLowerCase() }}
                    </span>
                  </div>
                  <div class="py-4 px-6 text-right">
                    <button 
                      v-if="position.status === 'OPEN'"
                      @click.stop="openSquareOffModal(position)"
                      class="inline-flex items-center gap-2 px-5 rounded-full border border-[#7C3AED] bg-[#1d1d20]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20 transition-colors"
                    >
                      <span>Square Off</span>
                      <img src="/public/off.png" alt="Square Off" class="w-4 h-4">
                    </button>
                    <span v-else class="text-gray-500 text-sm">
                      Closed at {{ formatTime(position.updated_at) }}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
            
            <!-- Expanded Details -->
            <tr v-if="expandedRow === position.id" class="bg-[#262626] border-t border-gray-700/50">
              <td colspan="6" class="py-6">
                <div class="grid grid-cols-5 gap-6 px-6">
                  <div class="space-y-2">
                    <div class="text-gray-400 text-sm font-medium">Script</div>
                    <div class="text-white">{{ position.strategy?.script || 'Nifty36FDWTE72' }}</div>
                  </div>
                  <div class="space-y-2">
                    <div class="text-gray-400 text-sm font-medium">Broker</div>
                    <div class="text-white">{{ position.broker?.broker_name || 'DHAN2DS2E28G' }}</div>
                  </div>
                  <div class="space-y-2">
                    <div class="text-gray-400 text-sm font-medium">Buy price</div>
                    <div class="text-white">
                      ₹{{ position.buy_price }}
                      <span class="text-gray-400 text-sm">({{ formatTime(position.buy_time) }})</span>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="text-gray-400 text-sm font-medium">Sell price</div>
                    <div class="text-white">
                      ₹{{ position.sell_price }}
                      <span class="text-gray-400 text-sm">({{ formatTime(position.sell_time) }})</span>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="text-gray-400 text-sm font-medium">LTP</div>
                    <div class="text-white">{{ getLtp(position) }}</div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Mobile View -->
    <div class="md:hidden bg-[#1d1d20]">
      <div class="flex justify-between items-start mb-2 bg-[#262626] w-[95%] mx-auto rounded-lg p-3 px-10">
        <div class="text-[#9C9393]">Strategy</div>
        <div class="text-[#9C9393]">PNL</div>
        <div class="text-[#9C9393]">Action</div>
      </div>

      <div 
        v-for="position in filteredPositions" 
        :key="position.id"
        class="py-2 pl-8 flex items-center justify-between w-[95%] mx-auto cursor-pointer border-b border-[#343437]"
        @click="showPositionDetails(position)"
      >
        <div class="text-white">{{ position.strategy?.name || 'Multidisciplinary' }}</div>
        <div :class="calculatePnL(position) >= 0 ? 'text-green-400' : 'text-red-400'">
          {{ calculatePnL(position) >= 0 ? '+' : '' }}{{ calculatePnL(position) }}
        </div>
        <div class="flex items-center gap-2">
          <button 
            v-if="position.status === 'OPEN'"
            @click.stop="openSquareOffModal(position)"
            class="flex items-center gap-1 px-2 py-1 rounded-full border border-[#7C3AED] bg-[#1d1d20]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20 transition-colors"
          >
            <img src="/public/off.png" alt="Square Off" class="w-4 h-4">
          </button>
          <span v-else class="text-gray-500 text-sm">Closed</span>
          <ChevronRight class="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Mobile Filter Modal -->
    <Transition name="modal">
      <div v-if="showFilterModal" class="fixed inset-0 z-50 md:hidden">
        <div 
          class="absolute inset-0 bg-black/25" 
          @click="showFilterModal = false"
        ></div>
        <div class="absolute bottom-0 left-0 right-0 bg-[#1d1d20] rounded-t-2xl p-6">
          <h3 class="text-lg font-medium text-white mb-4">Filter Positions</h3>
          <div class="space-y-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="filters.all" 
                @change="handleFilterChange('all')"
                class="form-checkbox rounded-lg bg-[#2C2C2E] border-gray-600 text-[#7C3AED]" 
              />
              <span class="text-white">All</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="filters.open"
                @change="handleFilterChange('open')"
                class="form-checkbox rounded-lg bg-[#2C2C2E] border-gray-600 text-[#7C3AED]" 
              />
              <span class="text-white">Open</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="filters.closed"
                @change="handleFilterChange('closed')"
                class="form-checkbox rounded-lg bg-[#2C2C2E] border-gray-600 text-[#7C3AED]" 
              />
              <span class="text-white">Closed</span>
            </label>
          </div>
          <button 
            @click="showFilterModal = false"
            class="w-full bg-[#7C3AED] text-white px-4 py-2 rounded-lg mt-6 hover:bg-[#6D28D9] transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Transition>

    <!-- Mobile Position Details Modal -->
    <Transition name="slide-up">
      <div 
        v-if="selectedPosition" 
        class="fixed inset-x-0 bottom-0 z-50 bg-[#2a2a2c] rounded-t-2xl md:hidden"
        style="max-height: 80vh; overflow-y: auto;"
      >
        <div class="relative rounded-lg">
          <div class="sticky top-0 flex justify-between p-3 rounded-t-lg items-center mb-6 bg-[#1d1d20]">
            <h3 class="text-lg font-bold text-white">
              {{ selectedPosition.strategy?.name || 'Multidisciplinary' }}
            </h3>
            <button @click="selectedPosition = null" class="text-gray-400">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4 px-3 pb-6">
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">Script</span>
              <span class="text-white">{{ selectedPosition.strategy?.script || 'Nifty36FDWTE72' }}</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">Broker</span>
              <span class="text-white">{{ selectedPosition.broker?.broker_name || 'DHAN2DS2E28G' }}</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">Side</span>
              <span class="text-white">{{ selectedPosition.side || '--' }}</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">QTY</span>
              <span class="text-white">{{ selectedPosition.quantity || '0' }}/25</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">Buy price</span>
              <span class="text-white">
                ₹{{ selectedPosition.buy_price }} 
                ({{ formatTime(selectedPosition.buy_time) }})
              </span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">Sell price</span>
              <span class="text-white">
                ₹{{ selectedPosition.sell_price }} 
                ({{ formatTime(selectedPosition.sell_time) }})
              </span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">LTP</span>
              <span class="text-white">{{ getLtp(selectedPosition) }}</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">PNL</span>
              <span :class="calculatePnL(selectedPosition) >= 0 ? 'text-green-400' : 'text-red-400'">
                {{ calculatePnL(selectedPosition) >= 0 ? '+' : '' }}{{ calculatePnL(selectedPosition) }}
              </span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">Status</span>
              <span :class="selectedPosition.status === 'OPEN' ? 'text-green-400' : 'text-red-400'">
                {{ selectedPosition.status || '--' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <sqOffPosition />
    <sqoffManual />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { SearchIcon, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-vue-next'
import { usePositionsStore } from '@/stores/matrix/position'
import { useManualPositionsStore } from '@/stores/groups/manualPosition'
import { useProfileStore } from '@/stores/matrix/profile'
import { usePaperPositionsStore } from "@/stores/matrix/paperPositions"
import { useTickerStore } from '@/stores/matrix/ticker/ticker'
import sqOffPosition from './sqOffPosition.vue'
import sqoffManual from './sqoffManual.vue'

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
  buy_price: number;
  sell_price: number;
  buy_time: string;
  sell_time: string;
  status: string;
  instrument_token: string;
  last_price: number;
  updated_at: string;
  broker_id: number;
  strategy_id: number;
}

// State
const selectedPosition = ref<Position | null>(null)
const searchQuery = ref('')
const expandedRow = ref<number | null>(null)
const showFilterModal = ref(false)
const filters = ref({
  all: true,
  open: false,
  closed: false
})

// Store instances
const profileStore = useProfileStore()
const positionsStore = usePositionsStore()
const manualPositionsStore = useManualPositionsStore()
const paperPositionsStore = usePaperPositionsStore()
const tickerStore = useTickerStore()

// Store state
const { profile } = storeToRefs(profileStore)
const { positions } = storeToRefs(positionsStore)
const { manualPositions } = storeToRefs(manualPositionsStore)
const { paperPositions } = storeToRefs(paperPositionsStore)
const { showSqOffModal } = storeToRefs(positionsStore)

// Methods
function showPositionDetails(position: any) {
  selectedPosition.value = position
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
  positionsStore.dataForSqOff.broker_id = position.broker_id
  positionsStore.dataForSqOff.strategy_id = position.strategy_id
  positionsStore.dataForSqOff.position_id = position.id
}

function getLtp(position: any) {
  const ltp = tickerStore.getLastPrice(position.instrument_token)
  return ltp || position.last_price
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

  return Number(pnl.toFixed(2))
}

function formatTime(time: string) {
  if (!time) return '09:20AM'
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

// Computed
const filteredPositions = computed(() => {
  let filtered = [...positions.value, ...manualPositions.value]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(position =>
      position.strategy?.name?.toLowerCase().includes(query) ||
      position.broker?.broker_name?.toLowerCase().includes(query)
    )
  }

  if (!filters.value.all) {
    if (filters.value.open) filtered = filtered.filter(p => p.status === 'OPEN')
    if (filters.value.closed) filtered = filtered.filter(p => p.status === 'CLOSED')
  }

  return filtered
})
</script>

<style scoped>
.form-checkbox {
  @apply rounded border-gray-600 text-[#7C3AED] focus:ring-[#7C3AED] focus:ring-offset-0 focus:ring-offset-transparent;
}

.modal-enter-active,
.modal-leave-active,
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 767px) {
  .fixed {
    -webkit-overflow-scrolling: touch;
  }
}

@screen sm {
  .grid {
    @apply gap-6;
  }
}

@screen lg {
  .grid {
    @apply gap-8;
  }
}
</style>