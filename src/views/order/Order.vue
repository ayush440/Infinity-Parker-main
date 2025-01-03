<template>
  <PlaceOrder 
    :isOpen="isOpen" 
    :toggleModal="toggleModal"
    :strategies="[]"
  />
  <div class="min-h-screen bg-[#2a2a2c]">
    <!-- Mobile Header -->

    <nav class=" md:hidden items-center gap-2 text-gray-400 mb-4 p-6 sm:mb-6 text-md sm:text-base">
      <span>Home</span>
      <span class="text-gray-600 text-2xl mx-1">›</span>
      <span>Orders</span>
    </nav>
    <div class="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800">
      <div class="flex items-center gap-2">
        <button class="text-white" @click="$router.back()">
          <ChevronLeft class="h-5 w-5" />
        </button>
        <h1 class="text-xl text-white">Order</h1>
      </div>
      <button @click="toggleModal" class="bg-[#8b7eff] text-white px-4 py-1.5 rounded-lg text-sm">
        Place order
      </button>
    </div>

    <!-- Desktop Breadcrumb -->
    <div class="hidden md:flex items-center gap-2 text-gray-400 px-6 py-3 mt-3">
      <span>Home</span>
      <span>›</span>
      <span>Order</span>
    </div>

    <!-- Desktop Header -->
    <div class="hidden md:flex justify-between items-center px-6 py-4">
      <h1 class="text-2xl text-white">Order</h1>
      <button @click="toggleModal" class="bg-[#8b7eff] text-white px-4 py-1 rounded-lg">
        Place order
      </button>
    </div>

    <!-- Main Content -->
    <div class="px-4 md:px-6">
      <!-- Search and Filters -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center rounded-t-lg mx-auto md:pr-6 py-4 bg-[#1d1d20] gap-4">
        <!-- Search Bar -->
        <div class="relative w-full md:w-64 px-4 md:px-0 md:ml-5">
          <input 
            v-model="searchQuery"
            type="search" 
            placeholder="Search" 
            class="w-full bg-[#1d1d20] text-white border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none"
          />
          <Search class="absolute left-7 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        
        <!-- Desktop Filters -->
        <div class="hidden md:flex items-center gap-4">
          <span class="text-gray-400">Showing order type:</span>
          <div class="flex gap-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="filters.successful" type="checkbox" class="form-checkbox rounded-lg bg-[#2C2C2E] border-gray-600 text-[#7C5CFC]" />
              <span class="text-white">Successful</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="filters.pending" type="checkbox" class="form-checkbox rounded-lg bg-[#2C2C2E] border-gray-600 text-[#7C5CFC]" />
              <span class="text-white">Pending</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="filters.rejected" type="checkbox" class="form-checkbox rounded-lg bg-[#2C2C2E] border-gray-600 text-[#7C5CFC]" />
              <span class="text-white">Rejected</span>
            </label>
          </div>
        </div>

        <!-- Mobile Filter Button -->
        <div class="md:hidden flex justify-between items-center w-full px-4">
          <span class="text-gray-400">Showing order type:</span>
          <button 
            @click="showFilterModal = true"
            class="flex items-center gap-2 text-white bg-[#2C2C2E] px-3 py-1.5 rounded-lg"
          >
            <SlidersHorizontal class="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block bg-[#2C2C2E] rounded-b-lg overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-gray-400 bg-[#262626]">
              <th class="text-left p-4 font-normal">Strategy</th>
              <th class="text-left p-4 font-normal">Broker</th>
              <th class="text-left p-4 font-normal">Time</th>
              <th class="text-left p-4 font-normal">Script</th>
              <th class="text-left p-4 font-normal">Side</th>
              <th class="text-left p-4 font-normal">QTY</th>
              <th class="text-left p-4 font-normal">Price</th>
              <th class="text-left p-4 font-normal">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <template v-if="filteredOrders.length > 0">
              <tr 
                v-for="order in filteredOrders" 
                :key="order.serialNo" 
                class="text-white bg-[#1d1d20]"
              >
                <td class="p-4">{{ order.strategy?.name || '--' }}</td>
                <td class="p-4">{{ order.broker?.broker_name || '--' }}</td>
                <td class="p-4">{{ formatTime(order.created_at) || '--' }}</td>
                <td class="p-4">{{ order.tradingsymbol || '--' }}</td>
                <td class="p-4">{{ order.transaction_type || '--' }}</td>
                <td class="p-4">{{ order.quantity || '0' }}/25</td>
                <td class="p-4">₹{{ order.status === 'COMPLETE' && (order.order_type === 'MARKET' || order.order_type === 'MKT') ? 
                  order.average_price : order.price }}</td>
                <td class="p-4">
                  <span :class="getStatusClasses(order.status)">
                    {{ order.status || '--' }}
                  </span>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="8" class="p-4 text-center text-gray-400">
                No Orders Found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Order List -->
      <div class="md:hidden bg-[#1d1d20] rounded-b-lg ">
        <template v-if="filteredOrders.length > 0">
              <div class="flex justify-between items-start mb-2 bg-[#262626] w-[95%] mx-auto rounded-lg p-3 px-10">
                <div class="text-[#9C9393]">
                  Strategy
                </div>
                <div class="text-[#9C9393]">
                  Price
                </div>
                <div class="text-[#9C9393]">
                  Status
                </div>
              </div>
          <div 
            v-for="order in filteredOrders" 
            :key="order.serialNo"
            class=" py-2 pl-10 flex items-center justify-between w-[95%] mx-auto cursor-pointer border-b border-[#343437]"
            @click="showOrderDetails(order)"
          >
            <div class="flex-1">
              <div class="flex justify-between items-start mb-2">
                <span class="text-white">{{ order.strategy?.name || '--' }}</span>
                <div class="text-gray-400">₹{{ order.status === 'COMPLETE' && (order.order_type === 'MARKET' || order.order_type === 'MKT') ? 
                order.average_price : order.price }}</div>
                <span :class="getStatusClasses(order.status)">
                  {{ order.status || '--' }}
                </span>
              </div>
              
            </div>
            <ChevronRight class="text-gray-400 w-5 h-5 ml-4" />
          </div>
        </template>
        <div v-else class="p-4 text-center text-gray-400">
          No Orders Found
        </div>
      </div>
    </div>

    <!-- Mobile Filter Modal -->
    <Transition name="modal">
      <div v-if="showFilterModal" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/25" @click="showFilterModal = false"></div>
        <div class="absolute bottom-0 left-0 right-0 bg-[#1d1d20] rounded-t-2xl p-6">
          <h3 class="text-lg font-medium text-white mb-4">Filter Orders</h3>
          <div class="space-y-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="filters.successful" type="checkbox" class="form-checkbox rounded-lg bg-[#2C2C2E] border-gray-600 text-[#7C5CFC]" />
              <span class="text-white">Successful</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="filters.pending" type="checkbox" class="form-checkbox rounded-lg bg-[#2C2C2E] border-gray-600 text-[#7C5CFC]" />
              <span class="text-white">Pending</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="filters.rejected" type="checkbox" class="form-checkbox rounded-lg bg-[#2C2C2E] border-gray-600 text-[#7C5CFC]" />
              <span class="text-white">Rejected</span>
            </label>
          </div>
          <button
            @click="showFilterModal = false"
            class="w-full bg-[#8b7eff] text-white px-4 py-2 rounded-lg mt-6"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Transition>

    <!-- Order Details Modal -->
    <Transition name="slide-up">
      <div v-if="selectedOrder" class="fixed inset-x-0 bottom-0 z-50 bg-[#2a2a2c] rounded-t-2xl md:hidden" style="max-height: 80vh; overflow-y: auto;">
        <div class="relative rounded-lg">
          <div class="sticky top-0 flex justify-between p-3 rounded-t-lg items-center mb-6 bg-[#1d1d20]">
            <h3 class="text-lg font-bold text-white">{{ selectedOrder.strategy?.name || 'Multidisciplinary' }}</h3>
            <button @click="selectedOrder = null" class="text-gray-400">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <div class="space-y-4 px-3 pb-6">
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">Broker</span>
              <span class="text-white">{{ selectedOrder.broker?.broker_name || '--' }}</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">Time</span>
              <span class="text-white">{{ formatTime(selectedOrder.created_at) || '--' }}</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">Script</span>
              <span class="text-white">{{ selectedOrder.tradingsymbol || '--' }}</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">Side</span>
              <span class="text-white">{{ selectedOrder.transaction_type || '--' }}</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">QTY</span>
              <span class="text-white">{{ selectedOrder.quantity || '0' }}/25</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">Price</span>
              <span class="text-white">₹{{ selectedOrder.status === 'COMPLETE' && (selectedOrder.order_type === 'MARKET' || selectedOrder.order_type === 'MKT') ? 
                selectedOrder.average_price : selectedOrder.price }}</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2 border-[#343437]">
              <span class="text-gray-400">Status</span>
              <span :class="getStatusClasses(selectedOrder.status)">
                {{ selectedOrder.status || '--' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-vue-next'
import { useOrdersStore } from '@/stores/matrix/order'
import { useManualOrdersStore } from '@/stores/groups/manualOrders'
import PlaceOrder from '@/components/PlaceOrder.vue'

interface Order {
  strategy?: { name: string };
  broker?: { broker_name: string };
  created_at: string;
  tradingsymbol?: string;
  transaction_type?: string;
  quantity?: number;
  status?: string;
  order_type?: string;
  average_price?: number;
  price?: number;
}

// Store initialization
const ordersStore = useOrdersStore()
const manualOrdersStore = useManualOrdersStore()
const isOpen = ref(false)
const showFilterModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const toggleModal = () => isOpen.value = !isOpen.value

// Search and filter state
const searchQuery = ref('')
const filters = ref({
  successful: true,
  pending: true,
  rejected: true
})

// Status styling function
const getStatusClasses = (status: string | undefined) => {
  const baseClasses = 'px-3 py-2 rounded-lg text-xs'
  switch (status) {
    case 'COMPLETE':
      return `${baseClasses} bg-green-500/20 text-green-500`
    case 'PENDING':
      return `${baseClasses} bg-[#92400E]/20 text-[#F59E0B]`
    case 'REJECTED':
      return `${baseClasses} bg-red-500/20 text-red-500`
    default:
      return baseClasses
  }
}

// Order details handler
const showOrderDetails = (order: any) => {
  selectedOrder.value = order
}

// Computed properties
const orders = computed(() => {
  return ordersStore.orders.map((order: Order, index: number) => ({
    ...order,
    serialNo: `order-${index}`
  }))
})

const manualOrders = computed(() => {
  return manualOrdersStore.manualOrders.map((manualOrder: Order, index: number) => ({
    ...manualOrder,
    serialNo: `manualOrder-${index}`
  }))
})

const mergedOrders = computed(() => {
  const allOrders = [...orders.value, ...manualOrders.value]
  if (!allOrders.length) {
    return []
  }
  return allOrders.sort((a, b) => {
    const dateA = new Date(a.updated_at).getTime()
    const dateB = new Date(b.updated_at).getTime()
    return dateB - dateA
  })
})

const filteredOrders = computed(() => {
  return mergedOrders.value.filter(order => {
    const matchesSearch = !searchQuery.value || 
      order.tradingsymbol?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.broker?.broker_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.strategy?.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesFilter = 
      (order.status === 'COMPLETE' && filters.value.successful) ||
      (order.status === 'PENDING' && filters.value.pending) ||
      (order.status === 'REJECTED' && filters.value.rejected)
    
    return matchesSearch && matchesFilter
  })
})

// Utility functions
const formatTime = (dateString: string) => {
  if (!dateString) return '--'
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.overflow-x-auto {
  overflow-x: auto;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1C1C1E;
}

::-webkit-scrollbar-thumb {
  background: #4A4A4A;
  border-radius: 4px;
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
/* Slide Up Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Ensure smooth scrolling on mobile */
@media (max-width: 767px) {
  .fixed {
    -webkit-overflow-scrolling: touch;
  }
}
</style>

