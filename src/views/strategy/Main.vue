<template>
  <EditModal />
  <div class="w-full h-full md:h-full bg-[#2a2a2c]">
    <nav class="flex items-center gap-2 text-gray-400 p-6 -mb-6">
      <span>Home</span>
      <span class="text-gray-600">›</span>
      <span>Strategy</span>
    </nav>

    <div class="flex justify-between items-center p-6">
      <h1 class="text-white text-2xl ">Strategy</h1>
      <!-- Mobile Filter Button -->
      <div class="md:hidden flex items-center ">
        <button @click="showFilterModal = true" class="bg-[#1d1d20] text-white p-2 rounded-lg">
          <SlidersHorizontal class="w-5 h-5" />
        </button>
      </div>
    </div>
    
    <div class="flex flex-col rounded-lg ml-2 mr-2 sm:ml-4 sm:mr-4 mt-2">
      <!-- Filters Container -->
      <div class="flex flex-col md:flex-row justify-between items-start p-4">
        <!-- Desktop and Tablet Filters -->
        <div class="hidden md:flex md:flex-col lg:flex-row md:items-start lg:items-center md:space-y-4 lg:space-y-0 w-full lg:w-auto">
          <div class="flex md:flex-col lg:flex-row md:space-y-2 lg:space-y-0 lg:space-x-3 w-full lg:w-auto">
            <span class="text-gray-300 mr-4">Showing strategies type:</span>
            <div class="flex md:flex-col lg:flex-row md:space-y-2 lg:space-y-0 lg:space-x-3">
              <label class="flex items-center space-x-2">
                <input type="checkbox" 
                       v-model="filters.all" 
                       @change="handleAllChange"
                       class="form-checkbox rounded border-gray-600 bg-transparent" />
                <span class="text-gray-300 text-sm">All</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" 
                       v-model="filters.myStrategies" 
                       @change="handleStrategyTypeChange"
                       class="form-checkbox rounded border-gray-600 bg-transparent" />
                <span class="text-gray-300 text-sm">My strategies</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" 
                       v-model="filters.otherStrategies" 
                       @change="handleStrategyTypeChange"
                       class="form-checkbox rounded border-gray-600 bg-transparent" />
                <span class="text-gray-300 text-sm">Other strategies</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Desktop and Tablet Symbol Filters -->
        <div class="hidden md:flex md:flex-col lg:flex-row md:items-start lg:items-center md:space-y-4 lg:space-y-0 md:mt-4 lg:mt-0 w-full lg:w-auto">
          <div class="flex md:flex-col lg:flex-row md:space-y-2 lg:space-y-0 lg:space-x-3 w-full lg:w-auto">
            <span class="text-gray-300 mr-4">Symbols:</span>
            <div class="flex md:flex-col lg:flex-row md:space-y-2 lg:space-y-0 lg:space-x-3">
              <label class="flex items-center space-x-2">
                <input type="checkbox" 
                       v-model="filters.symbols.ALL" 
                       @change="handleSymbolAllChange"
                       class="form-checkbox rounded border-gray-600 bg-transparent" />
                <span class="text-gray-300 text-sm">All</span>
              </label>
              <label v-for="symbol in availableSymbols" 
                     :key="symbol"
                     class="flex items-center space-x-2">
                <input type="checkbox" 
                       v-model="filters.symbols[symbol]" 
                       @change="handleSymbolChange"
                       class="form-checkbox rounded border-gray-600 bg-transparent" />
                <span class="text-gray-300 text-sm">{{ symbol }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Strategy Count -->
      <div class="px-4 text-gray-400 text-sm">
        {{ filteredStrategies.length }} Strategies
      </div>

      <!-- Strategy Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <div v-for="strategy in filteredStrategies" 
             :key="strategy.id" 
             class="bg-[#1d1d20] rounded-lg p-4">
          <!-- Tags -->
          <div class="flex gap-2 mb-4 text-black">
            <span :class="[
              'px-3 py-1 text-xs rounded-xl font-medium bg-opacity-70',
              getSymbolClass(strategy.script)
            ]">
              {{ strategy.script }}
            </span>
            <span :class="[
              'px-3 py-1 text-xs rounded-xl font-medium',
              strategy.risk === 'Low risk' ? 'bg-[#2e7d3283] text-green-600' : 'bg-[#d32f2f67] text-red-600'
            ]">
              {{ strategy.risk }}
            </span>
          </div>

          <!-- Strategy Name and Toggle -->
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-medium text-white">{{ strategy.name }}</h3>
            <div class="flex items-center">
              <button v-if="strategy.is_deployed" @click="showEdit(strategy)">
                <img src="/public/edit.svg" alt="Edit">
              </button>
            </div>
          </div>

          <!-- Strategy Details -->
          <div class="grid grid-cols-2 gap-4 mb-6 bg-[#1d1d20] border border-gray-600 rounded-lg p-8">
            <div class="flex flex-col items-center border-r border-gray-600 pr-4">
              <div class="w-12 h-12 p-2 mb-2 border border-gray-600 rounded-xl flex items-center justify-center">
                <Monitor class="w-6 h-6 text-gray-400" />
              </div>
              <span class="text-sm text-gray-400">Option</span>
              <span :class="[ 
                'text-base font-medium', 
                strategy.option_type === 'Buy' ? 'text-green-500' : 'text-red-500' 
              ]">{{ strategy.option_type }}</span>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 p-2 mb-2 border border-gray-600 rounded-xl flex items-center justify-center">
                <IndianRupee class="w-6 h-6 text-gray-400" />
              </div>
              <span class="text-sm text-gray-400">Capital required</span>
              <span class="text-base font-medium text-white">{{ strategy.capital_required }}K</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button 
              v-if="!strategy.is_deployed"
              @click="deployStrategy(strategy)"
              class="w-full py-2.5 rounded-md text-sm font-medium bg-[#1d1d20] border border-[#8b7eff] hover:bg-[#8b7eff] text-[#8b7eff] hover:text-white transition-colors"
            >
              Deploy
            </button>
            <template v-else>
              <button 
                @click="removeStrategy(strategy)"
                class="w-full py-2.5 rounded-md text-sm font-medium border border-[#cd201f] text-[#cd201f] hover:bg-[#cd201f] hover:text-white transition-colors"
              >
                Remove
              </button>
              <button 
                disabled
                class="w-full py-2.5 rounded-md text-sm font-medium bg-[#1d1d20] border border-gray-700 text-gray-400 cursor-not-allowed"
              >
                Deployed
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Filter Modal -->
  <Transition name="modal">
    <div v-if="showFilterModal" class="fixed inset-0 z-50 md:hidden">
      <div class="absolute inset-0 bg-black/25" @click="showFilterModal = false"></div>
      <div class="absolute bottom-0 left-0 right-0 bg-[#1d1d20] rounded-t-2xl p-6">
        <h3 class="text-lg font-medium text-white mb-4">Filter Strategies</h3>
        <div class="space-y-4">
          <div>
            <h4 class="text-gray-300 mb-2">Strategy Type:</h4>
            <label class="flex items-center space-x-2 mb-2">
              <input type="checkbox" v-model="filters.all" @change="handleAllChange"
                     class="form-checkbox rounded border-gray-600 bg-transparent" />
              <span class="text-gray-300 text-sm">All</span>
            </label>
            <label class="flex items-center space-x-2 mb-2">
              <input type="checkbox" v-model="filters.myStrategies" @change="handleStrategyTypeChange"
                     class="form-checkbox rounded border-gray-600 bg-transparent" />
              <span class="text-gray-300 text-sm">My strategies</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="filters.otherStrategies" @change="handleStrategyTypeChange"
                     class="form-checkbox rounded border-gray-600 bg-transparent" />
              <span class="text-gray-300 text-sm">Other strategies</span>
            </label>
          </div>
          <div>
            <h4 class="text-gray-300 mb-2">Symbols:</h4>
            <label class="flex items-center space-x-2 mb-2">
              <input type="checkbox" v-model="filters.symbols.ALL" @change="handleSymbolAllChange"
                     class="form-checkbox rounded border-gray-600 bg-transparent" />
              <span class="text-gray-300 text-sm">All</span>
            </label>
            <div v-for="symbol in availableSymbols" :key="symbol" class="mb-2">
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="filters.symbols[symbol]" @change="handleSymbolChange"
                       class="form-checkbox rounded border-gray-600 bg-transparent" />
                <span class="text-gray-300 text-sm">{{ symbol }}</span>
              </label>
            </div>
          </div>
        </div>
        <button @click="showFilterModal = false" class="w-full bg-[#7C3AED] text-white px-4 py-2 rounded-lg mt-6">
          Apply Filters
        </button>
      </div>
    </div>
  </Transition>

  <AddMatrixJoiner />
  <Message />
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue"
import { storeToRefs } from "pinia"
import { useStrategiesStore } from '@/stores/matrix/strategy'
import { useProfileStore } from "@/stores/matrix/profile"
import { Monitor, IndianRupee, SlidersHorizontal } from 'lucide-vue-next'
import AddMatrixJoiner from ".././matrixJoiner/addEditMatrixJoiner.vue"
import Message from './message.vue'
import { makeRequest } from "@/request/request"
import { useMatrixJoinersStore } from '@/stores/matrix/matrixJoiner'
import EditModal from "./EditModal.vue"

// Store initialization
const strategiesStore = useStrategiesStore()
const matrixJoinerStore = useMatrixJoinersStore();
const profileStore = useProfileStore()
const { strategies, plans, stratgyJoinedPlans } = storeToRefs(strategiesStore)

// Available trading symbols (without ALL)
const availableSymbols = ['NIFTY', 'BANKNIFTY', 'STOCKS', 'SENSEX']

const matrixJoinersStore = useMatrixJoinersStore()
const { showAddEditModal, addEditMatrixJoinerData, showDeleteConfirmationModal, idForDelete } = storeToRefs(matrixJoinersStore)

const showFilterModal = ref(false)

const showEdit = (data: any) => {
  showAddEditModal.value = true
  addEditMatrixJoinerData.value = data
}

interface Strategy {
  id: number;
  name: string;
  script: string;
  risk: string;
  option_type: string;
  capital_required: number;
  is_deployed: boolean;
  is_active: boolean;
}

interface JoinedStrategy {
  id: number;
  strategy_id: number;
  lots: number;
  re_entry: number;
  is_active: boolean;
}

interface FilterSymbols {
  ALL: boolean;
  [key: string]: boolean;
}

interface Filters {
  all: boolean;
  myStrategies: boolean;
  otherStrategies: boolean;
  symbols: FilterSymbols;
}

const filters = ref<Filters>({
  all: true,
  myStrategies: false,
  otherStrategies: false,
  symbols: {
    ...availableSymbols.reduce((acc, symbol) => {
      acc[symbol] = false;
      return acc;
    }, { ALL: true } as FilterSymbols)
  }
});




// Handle "All Strategies" checkbox change
const handleAllChange = () => {
  if (filters.value.all) {
    filters.value.myStrategies = false
    filters.value.otherStrategies = false
  }
}

// Handle strategy type checkbox changes
const handleStrategyTypeChange = () => {
  if (filters.value.myStrategies || filters.value.otherStrategies) {
    filters.value.all = false
  }
  
  if (!filters.value.myStrategies && !filters.value.otherStrategies) {
    filters.value.all = true
  }
}

// Handle "All Symbols" checkbox change
const handleSymbolAllChange = () => {
  if (filters.value.symbols.ALL) {
    // If ALL is checked, uncheck all other symbols
    availableSymbols.forEach(symbol => {
      filters.value.symbols[symbol] = false
    })
  }
}

// Handle individual symbol checkbox changes
const handleSymbolChange = () => {
  // If any individual symbol is checked, uncheck ALL
  const hasIndividualSelection = availableSymbols.some(symbol => filters.value.symbols[symbol])
  if (hasIndividualSelection) {
    filters.value.symbols.ALL = false
  }
  
  // If no individual symbols are checked, check ALL
  const noSymbolsSelected = availableSymbols.every(symbol => !filters.value.symbols[symbol])
  if (noSymbolsSelected) {
    filters.value.symbols.ALL = true
  }
}

// Get user ID for filtering
const userId = computed(() => profileStore.profile?.id)

// Add this computed property to get the user's current plan
const your_plan = computed(() => {
  return profileStore.profile.plan_name;
})

// Add this ref for the selected plan
let selectedPlan = ref(0);

// Add this watchEffect to set the initial selected plan
watchEffect(() => {
  if (plans.value.length > 0 && your_plan.value) {
    selectedPlan.value = plans.value.find((plan: any) => plan.name === your_plan.value)?.id || 0;
  }
})

// Modify the strategiesData computed property
const strategiesData = computed(() => {
  const selectedPlanData = plans.value.find(
    (plan: any) => plan.id.toString() === selectedPlan.value.toString()
  );
  if (selectedPlanData && selectedPlanData.strategies) {
    return strategies.value.filter((strategy: any) => {
      return selectedPlanData.strategies.hasOwnProperty(strategy.id.toString())
    })
  } else {
    return [];
  }
});

// Update the mergedStrategies computed property to use strategiesData
const mergedStrategies = computed(() => {
  let data = strategiesData.value || []
  return data.map((strategy: Strategy) => {
    const joinedStrategy = stratgyJoinedPlans.value.find(
      (joined: JoinedStrategy) => joined.strategy_id === strategy.id
    ) as JoinedStrategy | undefined
    if (joinedStrategy) {
      return {
        ...strategy,
        lots: joinedStrategy.lots,
        re_entry: joinedStrategy.re_entry,
        is_deployed: true,
        is_active: joinedStrategy.is_active
      }
    }
    return {
      ...strategy,
      is_deployed: false,
      is_active: false
    }
  })
})

// Filtered strategies based on all filters
const filteredStrategies = computed(() => {
  let filtered = mergedStrategies.value

  // Apply strategy type filters
  if (!filters.value.all) {
    if (filters.value.myStrategies) {
      filtered = filtered.filter((strategy: Strategy) => strategy.is_deployed)
    }
    if (filters.value.otherStrategies) {
      filtered = filtered.filter((strategy: Strategy) => strategy.is_deployed === false)
    }
    if (!filters.value.myStrategies && !filters.value.otherStrategies) {
      filtered = []
    }
  }

  // Apply symbol filters
  if (!filters.value.symbols.ALL) {
    filtered = filtered.filter((strategy: Strategy) => 
      Object.entries(filters.value.symbols)
        .some(([symbol, isSelected]) => 
          symbol !== 'ALL' && isSelected && strategy.script === symbol
        )
    )
  }

  return filtered
})

// Get symbol class for styling
const getSymbolClass = (symbol: string) => {
  const symbolClasses: Record<string, string> = {
    'NIFTY': 'bg-[#8B5E34] text-white',
    'BANKNIFTY': 'bg-[#4A4AFF] text-white',
    'STOCKS': 'bg-[#2E7D32] text-white',
    'SENSEX': 'bg-[#D32F2F] text-white'
  }
  return symbolClasses[symbol] || 'bg-gray-600 text-white'
}

// Handle strategy deployment
const deployStrategy = async (strategy: any) => {
  try {
    matrixJoinerStore.addEditMatrixJoinerData = {
      strategy_id: strategy.id,
      broker_id: 0,
      lots: 0,
      re_entry: 0,
      is_active: false,
      id: 0
    };
    
    matrixJoinerStore.showAddEditModal = true
    await strategiesStore.getStrategies()
  } catch (error) {
    console.error('Failed to deploy strategy:', error)
  }
}

// Handle strategy removal
const removeStrategy = async (strategy: Strategy) => {
  try {
    const joinedStrategy = stratgyJoinedPlans.value.find(
      (joined: JoinedStrategy) => joined.strategy_id === strategy.id
    ) as JoinedStrategy | undefined
    if (joinedStrategy) {
      await matrixJoinerStore.deleteMatrixJoiner(joinedStrategy.id)
      await strategiesStore.getStrategies()
    }
  } catch (error) {
    console.error('Failed to remove strategy:', error)
  }
}

// Handle strategy activation/deactivation
const handleStrategyToggle = async (strategy: any) => {
  try {
    const res = await makeRequest('plan_strategy', 'PUT', {is_active: !strategy.is_active}, {}, {}, 0, strategy.id)
    console.log(res)
    strategy.is_active = !strategy.is_active
  } catch (error) {
    console.error('Failed to update strategy:', error)
    strategy.is_active = !strategy.is_active
  }
}

// Initialize data
strategiesStore.getStrategies()
</script>

<style scoped>
.mobile-device-table {
  @apply h-[calc(100vh-194px)] w-full overflow-scroll;
}

.form-checkbox {
  @apply rounded border-gray-600 text-[#7C3AED] focus:ring-[#7C3AED] focus:ring-offset-0 focus:ring-offset-transparent;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Ensure smooth scrolling on mobile */
@media (max-width: 767px) {
  .fixed {
    -webkit-overflow-scrolling: touch;
  }
}
</style>

