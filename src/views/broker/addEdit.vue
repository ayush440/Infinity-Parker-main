<template>
  <Modal1 size="3xl" :show="showAddEditModal" @close="closeModel">
    <template #header>
      <div class="flex items-center justify-between w-full  ">
        <h2 class="text-xl font-semibold text-gray-50">
          {{ broker.id ? `Edit Broker Info` : `Add Broker Info` }}
        </h2>
      </div>
    </template>

    <template #body>
      <form 
        class="p-6 grid sm:grid-cols-1 md:grid-cols-2 gap-6 bg-[#2a2a2c]" 
        :class="formData && formData.broker_name === 'iifl' ? 'lg:grid-cols-2' : 'lg:grid-cols-3'"
        @submit.prevent="save(broker.id || 0)"
      >
        <!-- Broker Name Input -->
        <div class="space-y-2 " >
          <label for="broker_name" class="block text-sm font-medium   text-gray-200">
            Select Broker*
          </label>
          <div class="relative ">
            <SingleSelect 
              v-model.trim="validate.broker_name.$model" 
              imageShow 
              placeholder="Select a broker"
              class="w-full bg-[#1d1d20] border border-gray-700 rounded-lg "
            >
              <option value="">Choose a broker</option>
              <option key="zerodha" value="zerodha" image="zerodha">Zerodha</option>
              <option key="alice" value="alice" image="alice">Alice</option>
              <option key="angel" value="angel" image="angel">Angel</option>
              <option key="iifl" value="iifl" image="iifl">IIFL</option>
              <option key="upstox" value="upstox" image="upstox">Upstox</option>
              <option key="dhan" value="dhan" image="dhan">Dhan</option>
              <option key="shoonya" value="shoonya" image="shoonya">Shoonya</option>
              <option key="swastika" value="swastika" image="swastika">Swastika</option>
              <option key="gopocket" value="gopocket" image="gopocket">Go Pocket</option>
              <option key="moswal" value="moswal" image="moswal">Motilal Oswal</option>
              <option key="mhtrade" value="mhtrade" image="mhtrade">MH Trade</option>
            </SingleSelect>
          </div>
          <template v-if="validate.broker_name.$error">
            <div v-for="(error, index) in validate.broker_name.$errors" :key="index" class="text-red-500 text-sm">
              {{ error.$message }}
            </div>
          </template>
        </div>

        <!-- Broker User ID -->
        <div class="space-y-2">
          <label for="broker_userid" class="block text-sm font-medium text-gray-200">
            <span v-if="formData.broker_name === 'mhtrade' || formData.broker_name === 'dhan'">Broker Client Id*</span>
            <span v-else>Broker User Id*</span>
          </label>
          <input
            id="broker_userid"
            v-model.trim="validate.broker_userid.$model"
            type="text"
            :disabled="Boolean(broker.id && !formData.is_editable)"
            name="broker_userid"
            class="w-full bg-[#1d1d20] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:ring-2 focus:ring-gray-600"
            :class="[
              { 'border-red-500': validate.broker_userid.$error },
              {'cursor-not-allowed bg-gray-700': (broker.id) && (!formData.is_editable)}
            ]"
            :placeholder="formData.broker_name !== 'mhtrade' ? 'enter broker user id' : 'enter client id'"
          />
          <span v-if="validate.broker_userid.$error">
            <div v-for="(error, index) in validate.broker_userid.$errors" :key="index" class="text-red-500 text-sm">
              {{ error.$message }}
            </div>
          </span>
        </div>

        <template v-if="formData.broker_name !== 'dhan'">
          <!-- Broker Pin -->
          <div v-if="formData.broker_name !== 'shoonya' && formData.broker_name !== 'gopocket' && formData.broker_name !== 'iifl' && formData.broker_name !== 'moswal'" 
            class="space-y-2"
          >
            <label for="broker_pin" class="block text-sm font-medium text-gray-200">
              <span v-if="formData.broker_name !== 'mhtrade'">Broker Pin*</span>
              <span v-else>Verification*</span>
            </label>
            <input 
              v-if="dummyBrokerPin.show" 
              id="broker_pin" 
              v-model.trim="dummyBrokerPin.data" 
              type="text" 
              name="broker_pin"
              class="w-full bg-[#1d1d20] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:ring-2 focus:ring-gray-600"
              :placeholder="formData.broker_name !== 'mhtrade' ? 'Enter broker pin' : 'Enter verification code'"
            />
            <input 
              v-else 
              id="broker_pin" 
              v-model.trim="validate.broker_pin.$model" 
              type="text" 
              name="broker_pin"
              class="w-full bg-[#1d1d20] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:ring-2 focus:ring-gray-600"
              :class="{ 'border-red-500': validate.broker_pin.$error }"
              :placeholder="formData.broker_name !== 'mhtrade' ? 'Enter broker pin' : 'Enter verification code'"
            />
            <span v-if="validate.broker_pin.$error">
              <div v-for="(error, index) in validate.broker_pin.$errors" :key="index" class="text-red-500 text-sm">
                {{ error.$message }}
              </div>
            </span>
          </div>

          <!-- Mobile Number -->
          <div v-if="formData.broker_name === 'upstox' || formData.broker_name === 'gopocket'" class="space-y-2">
            <label for="mobile" class="block text-sm font-medium text-gray-200">
              Mobile Number
            </label>
            <input 
              id="mobile" 
              v-model.trim="mobileNumber" 
              type="text" 
              name="mobile"
              class="w-full bg-[#1d1d20] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:ring-2 focus:ring-gray-600"
              :class="{ 'border-red-500': validate.broker_pin.$error && mobileNumber.length !== 10 }"
              placeholder="10 digit mobile number"
            />
            <span v-if="validate.broker_pin.$error && mobileNumber.length !== 10">
              <div class="text-red-500 text-sm">Value should be 10 digits</div>
            </span>
          </div>

          <!-- Broker QR Key -->
          <div v-if="formData.broker_name !== 'mhtrade' && formData.broker_name !== 'iifl'" class="space-y-2">
            <label for="broker_qr_key" class="block text-sm font-medium text-gray-200">
              Broker Qr Key*
            </label>
            <input
              id="broker_qr_key"
              v-model.trim="validate.broker_qr_key.$model"
              type="text"
              name="broker_qr_key"
              class="w-full bg-[#1d1d20] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:ring-2 focus:ring-gray-600"
              :class="{ 'border-red-500': validate.broker_qr_key.$error }"
              placeholder="enter broker qr key"
            />
            <span v-if="validate.broker_qr_key.$error">
              <div v-for="(error, index) in validate.broker_qr_key.$errors" :key="index" class="text-red-500 text-sm">
                {{ error.$message }}
              </div>
            </span>
          </div>

          <!-- Broker API -->
          <div v-if="formData.broker_name !== 'mhtrade' && formData.broker_name !== 'swastika'" class="space-y-2">
            <label for="broker_api" class="block text-sm font-medium text-gray-200">
              Broker Api*
            </label>
            <input
              id="broker_api"
              v-model.trim="validate.broker_api.$model"
              type="text"
              name="broker_api"
              class="w-full bg-[#1d1d20] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:ring-2 focus:ring-gray-600"
              :class="{ 'border-red-500': validate.broker_api.$error }"
              placeholder="enter broker api"
            />
            <span v-if="validate.broker_api.$error">
              <div v-for="(error, index) in validate.broker_api.$errors" :key="index" class="text-red-500 text-sm">
                {{ error.$message }}
              </div>
            </span>
          </div>

          <!-- Broker API Secret -->
          <div v-if="formData.broker_name !== 'mhtrade' && formData.broker_name !== 'shoonya' && formData.broker_name !== 'swastika'" class="space-y-2">
            <label for="broker_api_secret" class="block text-sm font-medium text-gray-200">
              <span v-if="formData.broker_name === 'moswal'">Provide DOB*</span>
              <span v-else>Broker Api Secret*</span>
            </label>
            <input
              id="broker_api_secret"
              v-model.trim="validate.broker_api_secret.$model"
              type="text"
              name="broker_api_secret"
              class="w-full bg-[#1d1d20] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:ring-2 focus:ring-gray-600"
              :class="{ 'border-red-500': validate.broker_api_secret.$error }"
              :placeholder="formData.broker_name === 'moswal'? 'Format dd/mm/yyyy(30/01/1990)' : 'enter broker api secret'"
            />
            <span v-if="validate.broker_api_secret.$error">
              <div v-for="(error, index) in validate.broker_api_secret.$errors" :key="index" class="text-red-500 text-sm">
                {{ error.$message }}
              </div>
            </span>
          </div>
        </template>

        <!-- Broker Password -->
        <div v-if="formData.broker_name !== 'dhan' && formData.broker_name !== 'iifl'" class="space-y-2">
          <label for="broker_password" class="block text-sm font-medium text-gray-200">
            <span v-if="formData.broker_name === 'mhtrade'">Password*</span>
            <span v-else-if="formData.broker_name === 'upstox'">Redirect Url*</span>
            <span v-else-if="formData.broker_name === 'swastika'">Company Source Name*</span>
            <span v-else>Broker Password*</span>
          </label>
          <input
            id="broker_password"
            v-model.trim="validate.broker_password.$model"
            type="text"
            name="broker_password"
            class="w-full bg-[#1d1d20] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:ring-2 focus:ring-gray-600"
            :class="{ 'border-red-500': validate.broker_password.$error }"
            :placeholder="formData.broker_name === 'upstox' ? 'Enter redirect url' : formData.broker_name === 'swastika' ? 'Enter company source name' : 'Enter password'"
          />
          <span v-if="validate.broker_password.$error">
            <div v-for="(error, index) in validate.broker_password.$errors" :key="index" class="text-red-500 text-sm">
              {{ error.$message }}
            </div>
          </span>
        </div>

        <!-- Access Token for Dhan -->
        <div v-if="formData.broker_name === 'dhan'" class="space-y-2">
          <label for="broker_token" class="block text-sm font-medium text-gray-200">
            Access Token*
          </label>
          <input
            id="broker_token"
            v-model.trim="validate.broker_token.$model"
            type="text"
            name="broker_token"
            class="w-full bg-[#1d1d20] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:ring-2 focus:ring-gray-600"
            :class="{ 'border-red-500': validate.broker_token.$error }"
            placeholder="enter access token"
          />
          <span v-if="validate.broker_token.$error" class="text-red-500 text-sm">
            Value is required
          </span>
        </div>

        <!-- Account Active Switch -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-200 mb-2">
            Account Active
          </label>
          <ButtonSwitch 
            id="is_active" 
            name="is_active" 
            v-model.trim="validate.is_active.$model" 
          />
          <span v-if="validate.is_active.$error">
            <div v-for="(error, index) in validate.is_active.$errors" :key="index" class="text-red-500 text-sm">
              {{ error.$message }}
            </div>
          </span>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end items-center gap-4 md:col-span-2" 
          :class="formData && formData.broker_name === 'iifl' ? 'lg:col-span-2' : 'lg:col-span-3'"
        >
          <button 
            type="button" 
            class="px-10 py-2 text-sm font-medium text-[#8B7EFF] bg-white rounded-lg hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600" 
            @click="closeModel"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-10 py-2 text-sm font-medium text-white bg-[#8B7EFF] rounded-lg hover:bg-indigo-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            @click="submitForm"
          >
            Submit
          </button>
        </div>
      </form>
    </template>
  </Modal1>
</template>

<script setup lang="ts">
import { showToast } from '@/request/request'
import { useBrokersStore } from '@/stores/matrix/broker'
import { storeToRefs } from 'pinia'
import { toRefs, computed, reactive, watch, ref } from 'vue'
import { required, minLength, integer } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const brokersStore = useBrokersStore()

const { showAddEditModal, editBrokerData } = storeToRefs(brokersStore)
const { addEditBroker } = brokersStore

function closeModel() {
  editBrokerData.value = {}
  showAddEditModal.value = false
  mobileNumber.value = ''
  dummyBrokerPin.value.show = false
  resetValidation()
}
interface Broker {
  id?: number
  broker_name?: string
  broker_password?: string
  broker_userid?: string
  broker_pin?: string
  broker_qr_key?: string
  broker_api?: string
  broker_api_secret?: any

  app_name?: string
  client_code?: string
  client_password?: string
  provide_dob?: string
  ocp_apim_sub_key?: string
  encry_key?: string
  user_key?: string
  app_source?: string

  broker_token?: string

  is_active?: boolean
  is_editable?: boolean
}

const broker = computed<Broker>(() => {
  const broker = editBrokerData.value
  return broker
})

const mobileNumber = ref('')

let formData = reactive({
  broker_name: '',
  broker_password: '',
  broker_userid: '',
  broker_pin: '',
  broker_qr_key: '',
  broker_api: '',
  broker_api_secret: '',

  broker_token: '',

  is_active: true,
  is_editable: false
})

watch(broker, (newBroker, oldBroker) => {
  if (newBroker !== oldBroker) {

    formData.broker_name = newBroker.broker_name !== undefined ? newBroker.broker_name : ''
    formData.broker_password =
      newBroker.broker_password !== undefined ? newBroker.broker_password : ''
    formData.broker_userid = newBroker.broker_userid !== undefined ? newBroker.broker_userid : ''
    // formData.broker_pin = newBroker.broker_pin !== undefined ? newBroker.broker_pin : ''
    formData.broker_api = newBroker.broker_api !== undefined ? newBroker.broker_api : ''
    formData.broker_api_secret = newBroker.broker_api_secret !== undefined ? newBroker.broker_api_secret : ''
    formData.broker_token = newBroker.broker_token !== undefined ? newBroker.broker_token : ''

    formData.broker_qr_key = newBroker.broker_qr_key !== undefined ? newBroker.broker_qr_key : ''

    if(broker.value.id && newBroker.broker_name == 'upstox' && newBroker.broker_pin && newBroker.broker_pin.includes(':')) {
      let temp = newBroker.broker_pin !== undefined ? newBroker.broker_pin : ''
      let data = temp.split(':')
      formData.broker_pin = data[0]
      mobileNumber.value = data[1]
    } else if (broker.value.id && ( newBroker.broker_name == 'gopocket') && newBroker.broker_pin) {
      let temp = newBroker.broker_pin !== undefined ? newBroker.broker_pin : ''
      mobileNumber.value = temp
    } else {
      formData.broker_pin = newBroker.broker_pin !== undefined ? newBroker.broker_pin : ''
    }


    formData.is_active = newBroker.is_active !== undefined ? newBroker.is_active : broker.value?.id? false: true
    formData.is_editable = newBroker.is_editable !== undefined ? newBroker.is_editable : false
  }
})

const rules = {
  broker_userid: {
    required,
    minLength: minLength(5)
  },
  broker_name: {
    required
  },
  broker_password: {
    required: (value: any) => {
      return formData.broker_name !== 'iifl' && formData.broker_name !== 'dhan' && value === ''  ? false : true
    }
  },

  broker_pin: {
    required: (value: any) => {
      return (formData.broker_name !== 'iifl' && formData.broker_name !== 'dhan' && formData.broker_name !== 'shoonya' && formData.broker_name !== 'gopocket' && formData.broker_name !== 'moswal' ) && value === ''  ? false : true
    },
  },
  broker_qr_key: {
    required: (value: any) => {
      return ((formData.broker_name !== 'iifl' && formData.broker_name !== 'dhan' ) && formData.broker_name !== 'mhtrade') && value === ''  ? false : true
    },
  },
  broker_api: { 
    required: (value: any) => {
      return ((formData.broker_name !== 'dhan' ) && formData.broker_name !== 'mhtrade' && formData.broker_name !== 'swastika') && value === ''  ? false : true
    },
  },
  broker_api_secret: { 
    required: (value: any) => {
      return ((formData.broker_name !== 'dhan' && formData.broker_name !== 'shoonya' ) && formData.broker_name !== 'mhtrade' && formData.broker_name !== 'swastika') && value === ''  ? false : true
    },
  },

  // dhan details
  broker_token: {
    required: (value: any) => {
      return formData.broker_name == 'dhan' && value === ''  ? false : true
    }
  },

  

  is_active: {},
  is_editable: {}
}

let validate = useVuelidate(rules, toRefs(formData))

const submitForm = async () => {
  validate.value.$touch()
  // if (!validate.value.$invalid) {
  //   showAddEditModal.value = false
  // }
}

function resetValidation() {
  validate = useVuelidate(rules, toRefs(formData))
}

const dummyBrokerPin = ref<any>({
  show : false,
  data : ''
})

const save = async (id: number) => {
  validate.value.$touch()
  if (validate.value.$invalid) {
    showToast("Please check the filled form!")
  } else {
    if(formData.broker_name === 'dhan' || formData.broker_name === 'iifl') {
      formData.broker_password = 'temp1234'
    }
    if(formData.broker_name=='upstox') {
      dummyBrokerPin.value.show = true
      dummyBrokerPin.value.data = formData.broker_pin
      formData.broker_pin  = formData.broker_pin + ':' + mobileNumber.value
    } else if(formData.broker_name=='gopocket') {
      dummyBrokerPin.value.show = true
      dummyBrokerPin.value.data = formData.broker_pin
      formData.broker_pin  = mobileNumber.value
    }
    formData.is_active = formData.is_active ? true : false
    
    await addEditBroker(id, formData)
    showAddEditModal.value = false
    mobileNumber.value = ''
    dummyBrokerPin.value.show = false
    editBrokerData.value = {}
    resetValidation()
  }
}
</script>
