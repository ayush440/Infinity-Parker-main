<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="w-[700px] h-[637px] bg-[#1c1c1f] rounded-lg shadow-xl flex flex-col">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 class="text-xl text-white font-medium">Place order</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-white">
            <XIcon class="h-5 w-5" />
          </button>
        </div>
  
        <!-- Modal Body -->
        <div class="flex-1 p-6 overflow-y-auto">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Strategy & Trading Symbol -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-white mb-2">Strategy</label>
                <select 
                  v-model="formData.strategy"
                  class="w-full bg-[#262626] text-white rounded-lg border border-gray-700 p-3 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                >
                  <option value="" disabled>Select strategy</option>
                  <option v-for="strategy in matrixJoinersStore.matrixJoiners" :key="strategy.id" :value="strategy.id">
                    {{ strategyStore.findStrategyById(strategy.strategy_id).name }}
                    
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-white mb-2">Trading symbol</label>
                <input 
                  type="text" 
                  v-model="formData.tradingSymbol"
                  readonly
                  class="w-full bg-[#262626] text-white rounded-lg border border-gray-700 p-3"
                />
              </div>
            </div>
  
            <!-- Transaction & Variety -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-white mb-2">Transaction</label>
                <select 
                  v-model="formData.transaction"
                  class="w-full bg-[#262626] text-white rounded-lg border border-gray-700 p-3 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                >
                  <option value="" disabled>Select transaction</option>
                  <option value="BUY">Buy</option>
                  <option value="SELL">Sell</option>
                </select>
              </div>
              <div>
                <label class="block text-white mb-2">Variety</label>
                <select 
                  v-model="formData.variety"
                  class="w-full bg-[#262626] text-white rounded-lg border border-gray-700 p-3 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                >
                  <option value="" disabled>Select variety</option>
                  <option value="REGULAR">Regular</option>
                  <option value="AMO">AMO</option>
                  <option value="ICEBERG">Iceberg</option>
                  <option value="AUCTION">Auction</option>
                </select>
              </div>
            </div>
  
            <!-- Order Type & Product -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-white mb-2">Order type</label>
                <select 
                  v-model="formData.orderType"
                  class="w-full bg-[#262626] text-white rounded-lg border border-gray-700 p-3 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                >
                  <option value="" disabled>Select order type</option>
                  <option value="MARKET">Market</option>
                  <option value="LIMIT">Limit</option>
                  <option value="SL_LIMIT">SL-Limit</option>
                  <option value="SL_MARKET">SL-Market</option>
                </select>
              </div>
              <div>
                <label class="block text-white mb-2">Product</label>
                <select 
                  v-model="formData.product"
                  class="w-full bg-[#262626] text-white rounded-lg border border-gray-700 p-3 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                >
                  <option value="" disabled>Select product</option>
                  <option value="MIS">MIS</option>
                  <option value="NRML">NRML</option>
                  <option value="CNC">CNC</option>
                </select>
              </div>
            </div>
  
            <!-- Validity & Quantity -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-white mb-2">Validity</label>
                <select 
                  v-model="formData.validity"
                  class="w-full bg-[#262626] text-white rounded-lg border border-gray-700 p-3 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                >
                  <option value="" disabled>Select validity</option>
                  <option value="DAY">Day</option>
                  <option value="IOC">IOC</option>
                  <option value="TTL">TTL</option>
                </select>
              </div>
              <div>
                <label class="block text-white mb-2">Quantity</label>
                <input 
                  type="number" 
                  v-model="formData.quantity"
                  class="w-full bg-[#262626] text-white rounded-lg border border-gray-700 p-3 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                />
              </div>
            </div>
  
            <!-- Price & Trigger Price -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-white mb-2">Price</label>
                <input 
                  type="number" 
                  v-model="formData.price"
                  step="0.05"
                  class="w-full bg-[#262626] text-white rounded-lg border border-gray-700 p-3 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                />
              </div>
              <div>
                <label class="block text-white mb-2">Trigger price</label>
                <input 
                  type="number" 
                  v-model="formData.triggerPrice"
                  step="0.05"
                  class="w-full bg-[#262626] text-white rounded-lg border border-gray-700 p-3 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                />
              </div>
            </div>
  
            <!-- PNL Track Toggle -->
            <div class="flex items-center justify-between">
              <span class="text-white">PNL track</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="formData.pnlTrack" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
              </label>
            </div>
          </form>
        </div>
  
        <!-- Modal Footer -->
        <div class="p-6 border-t border-gray-800 flex justify-end gap-4">
          <button 
            @click="closeModal"
            class="px-6 py-2 rounded-lg border border-gray-700 text-white hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="handleSubmit"
            class="px-6 py-2 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue'
  import { XIcon } from 'lucide-vue-next'
  import { useMatrixJoinersStore } from '@/stores/matrix/matrixJoiner'
import { useStrategiesStore } from '@/stores/matrix/strategy'
  
  const matrixJoinersStore = useMatrixJoinersStore()
  const strategyStore = useStrategiesStore()
  
  const props = defineProps<{
    isOpen: boolean
    toggleModal: () => void

    strategies: Array<{ id: number; name: string }>
    tradingSymbol?: string
  }>()
  
  const emit = defineEmits(['close', 'submit'])
  
  const formData = ref({
    strategy: '',
    tradingSymbol: props.tradingSymbol || '',
    transaction: '',
    variety: '',
    orderType: '',
    product: '',
    validity: '',
    quantity: '',
    price: '',
    triggerPrice: '',
    pnlTrack: false
  })
  
  function closeModal() {
    props.toggleModal()
  }
  
  function handleSubmit() {
    emit('submit', formData.value)
    
  }
  </script>
  
  <style scoped>
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  </style>