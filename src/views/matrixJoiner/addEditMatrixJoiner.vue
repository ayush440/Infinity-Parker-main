<template>
  <div v-if="showAddEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="w-[400px] bg-[#1c1c1f] rounded-lg shadow-xl">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-6">
        <h2 class="text-xl text-white font-medium">
          {{ matrixJoiner.id ? 'Edit Joiner Info' : 'Add Joiner Info' }}
        </h2>
        <button @click="closeModel" class="text-gray-400 hover:text-white">
          <XIcon class="h-5 w-5" />
        </button>
      </div>

      <!-- Modal Body -->
      <form class="p-6 space-y-6" @submit.prevent="save(matrixJoiner.id || 0)">
        <!-- Broker Selection -->
        <div v-if="!matrixJoiner.id">
          <label class="block text-white mb-2 font-medium">Broker</label>
          <MultiselectDropdown 
            :initialOptions="dropdownOptions" 
            imageShow 
            :selected="handleSelectedBroker"
            class="bg-[#262626] border border-gray-700 rounded-lg text-white"
          />
        </div>

        <!-- Lot Size -->
        <div>
          <label class="block text-white mb-2 font-medium">Lot Size</label>
          <div class="flex items-center bg-[#262626] rounded-lg border border-gray-700">
            <button 
              type="button"
              @click="decrementLots"
              class="p-3 text-[#7C3AED] hover:bg-gray-700/50 rounded-l-lg"
            >
              <MinusIcon class="h-5 w-5" />
            </button>
            <input
              v-model.number="validate.lots.$model"
              type="number"
              class="flex-1 bg-transparent text-white text-center border-0 focus:ring-0"
              :class="{ 'border-red-500': validate.lots.$error }"
            />
            <button 
              type="button"
              @click="incrementLots"
              class="p-3 text-[#7C3AED] hover:bg-gray-700/50 rounded-r-lg"
            >
              <PlusIcon class="h-5 w-5" />
            </button>
          </div>
          <div v-if="validate.lots.$error" class="text-red-500 text-sm mt-1">
            {{ validate.lots.$errors[0]?.$message }}
          </div>
        </div>

        <!-- Re-entry -->
        <div>
          <label class="block text-white mb-2 font-medium">Re-entry</label>
          <div class="flex items-center bg-[#262626] rounded-lg border border-gray-700">
            <button 
              type="button"
              @click="decrementReEntry"
              class="p-3 text-[#7C3AED] hover:bg-gray-700/50 rounded-l-lg"
            >
              <MinusIcon class="h-5 w-5" />
            </button>
            <input
              v-model.number="validate.re_entry.$model"
              type="number"
              class="flex-1 bg-transparent text-white text-center border-0 focus:ring-0"
              :class="{ 'border-red-500': validate.re_entry.$error }"
            />
            <button 
              type="button"
              @click="incrementReEntry"
              class="p-3 text-[#7C3AED] hover:bg-gray-700/50 rounded-r-lg"
            >
              <PlusIcon class="h-5 w-5" />
            </button>
          </div>
          <div v-if="validate.re_entry.$error" class="text-red-500 text-sm mt-1">
            {{ validate.re_entry.$errors[0]?.$message }}
          </div>
        </div>

        <!-- Status Toggle -->
        <div>
          <label class="block text-white mb-2 font-medium">Status</label>
          <ButtonSwitch
            v-model="validate.is_active.$model"
            class="[&>*]:!bg-[#7C3AED]"
            @update:modelValue="(value: boolean) => formData.is_active = value"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="closeModel"
            class="px-6 py-2 rounded-lg border border-gray-700 text-white hover:bg-gray-700/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XIcon, MinusIcon, PlusIcon } from 'lucide-vue-next'
import { showToast } from '@/request/request'
import { useMatrixJoinersStore } from '@/stores/matrix/matrixJoiner'
import { useBrokersStore } from '@/stores/matrix/broker'
import { storeToRefs } from 'pinia'
import { toRefs, computed, reactive, watch, ref } from 'vue'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const matrixJoinersStore = useMatrixJoinersStore()
const brokersStore = useBrokersStore()

const { showAddEditModal, addEditMatrixJoinerData, joinStrategyId } = storeToRefs(matrixJoinersStore)
const { addEditMatrixJoiner } = matrixJoinersStore

interface MatrixJoiner {
  id?: number
  broker_id?: number
  strategy_id?: number
  lots?: number
  re_entry?: number
  is_active?: boolean
}

interface Broker {
  id?: any
  broker_name?: string
  broker_userid?: string
}

const dropdownOptions = computed(() => {
  return (brokersStore.brokers || []).map((broker: Broker) => ({
    id: broker.id,
    label: `${broker.broker_name}-(${broker.broker_userid})`,
    image: broker.broker_name
  }))
})

const selectedBrokerOptions = ref([])
const matrixJoiner = computed<MatrixJoiner>(() => addEditMatrixJoinerData.value)

const formData = reactive({
  id: 0,
  broker_id: 0,
  strategy_id: 0,
  lots: 0,
  re_entry: 0,
  is_active: false
})

const handleSelectedBroker = (option: any) => {
  selectedBrokerOptions.value = option
}

watch(matrixJoiner, (newMatrixJoiner, oldMatrixJoiner) => {
  if (newMatrixJoiner !== oldMatrixJoiner) {
    formData.strategy_id = newMatrixJoiner.strategy_id ?? 0
    formData.broker_id = newMatrixJoiner.broker_id ?? 0
    formData.lots = newMatrixJoiner.lots ?? 0
    formData.re_entry = newMatrixJoiner.re_entry ?? 0
    formData.is_active = newMatrixJoiner.is_active ?? false
  }
})

const rules = {
  id: { required },
  broker_id: {},
  strategy_id: {},
  lots: { required },
  re_entry: { required },
  is_active: { required }
}

let validate = useVuelidate(rules, toRefs(formData))

function closeModel() {
  addEditMatrixJoinerData.value = {}
  showAddEditModal.value = false
  resetValidation()
}

function resetValidation() {
  validate = useVuelidate(rules, toRefs(formData))
}

const incrementLots = () => {
  const currentValue = Number(validate.value.lots.$model);
  if (!isNaN(currentValue)) {
    formData.lots = currentValue + 1;
  }
}

const decrementLots = () => {
  const currentValue = Number(validate.value.lots.$model);
  if (!isNaN(currentValue) && currentValue > 0) {
    formData.lots = currentValue - 1;
  }
}

const incrementReEntry = () => {
  const currentValue = Number(validate.value.re_entry.$model);
  if (!isNaN(currentValue)) {
    formData.re_entry = currentValue + 1;
  }
}

const decrementReEntry = () => {
  const currentValue = Number(validate.value.re_entry.$model);
  if (!isNaN(currentValue) && currentValue > 0) {
    formData.re_entry = currentValue - 1;
  }
}

const save = async (id: number) => {
  validate.value.$touch()
  if (validate.value.$invalid) {
    showToast("Please check the filled form!")
    return
  }

  if (joinStrategyId.value) {
    formData.strategy_id = joinStrategyId.value
  }

  if (selectedBrokerOptions.value.length > 0) {
    for (const brokerId of selectedBrokerOptions.value) {
      formData.broker_id = parseInt(brokerId)
      await addEditMatrixJoiner(id, formData)
    }
    addEditMatrixJoinerData.value = {}
    joinStrategyId.value = 0
    selectedBrokerOptions.value = []
    resetValidation()
  } else {
    await addEditMatrixJoiner(id, formData)
    addEditMatrixJoinerData.value = {}
    resetValidation()
  }
  
  showAddEditModal.value = false
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
