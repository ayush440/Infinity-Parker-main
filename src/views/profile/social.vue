<template>
  <div class="bg-[#2a2a2c] rounded-lg mt-6 p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl text-white font-medium">Social info</h2>
      <button 
        @click="toggleEdit" 
        class=""
      >
      <img v-if="!isEditing" src="/public/edit.svg" alt="">
      </button>
    </div>

    <form @submit.prevent="submitSocialForm" class="grid grid-cols-3 gap-4">
      <div>
        <label for="trading_view_id" class="block text-sm font-medium text-gray-200 mb-2">
          Tradingview ID
        </label>
        <input
          type="text"
          id="trading_view_id"
          v-model="socialData.trading_view_id"
          :disabled="!isEditing"
          class=" disabled:bg-[#222222] w-full bg-[#2C2C30] border border-[#3C3C40] rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          :placeholder="social.trading_view_id"
        />
      </div>

      <div>
        <label for="api" class="block text-sm font-medium text-gray-200 mb-2">
          Telegram API
        </label>
        <input
          type="text"
          id="api"
          v-model="socialData.api"
          :disabled="!isEditing"
          class="disabled:bg-[#222222] w-full bg-[#2C2C30] border border-[#3C3C40] rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          :placeholder="social.api"
        />
      </div>

      <div>
        <label for="chat_id" class="block text-sm font-medium text-gray-200 mb-2">
          Telegram Chat ID
        </label>
        <input
          type="text"
          id="chat_id"
          v-model="socialData.chat_id"
          :disabled="!isEditing"
          class=" disabled:bg-[#222222] w-full bg-[#2C2C30] border border-[#3C3C40] rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          :placeholder="social.chat_id"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-200 mb-2">Status</label>
        <div class="flex items-center">
          <ButtonSwitch
            v-model="socialData.status"
            :disabled="!isEditing"
          />
        </div>
      </div>

      <div class="flex justify-end gap-4 col-span-2" v-if="isEditing">
        <button
          type="button"
          @click="toggleEdit"
          class="px-6 py-2 rounded-lg border border-[#3C3C40] text-white hover:bg-[#2C2C30]"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-6 py-2 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
        >
          Update
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { makeRequest } from '@/request/request'
import { useSocialStore } from '@/stores/matrix/social'

const socialStore = useSocialStore()

interface Social {
  id?: number
  api?: string
  chat_id?: string
  status?: boolean
  trading_view_id?: string
  trading_view_message?: string
}

const social = computed<Social>(() => {
  return (socialStore.social as Social) || {
    api: '',
    chat_id: '',
    status: false,
    trading_view_id: '',
    trading_view_message: ''
  };
})

const isEditing = ref(false)

const socialData = ref<Social>({
  api: '',
  chat_id: '',
  status: false,
  trading_view_id: '',
  trading_view_message: ''
})

watch(social, (newSocial) => {
  socialData.value = {
    api: newSocial.api || '',
    chat_id: newSocial.chat_id || '',
    status: newSocial.status || false,
    trading_view_id: newSocial.trading_view_id || '',
    trading_view_message: newSocial.trading_view_message || ''
  }
}, { immediate: true })

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    // Reset form when canceling edit
    socialData.value = {
      api: social.value.api || '',
      chat_id: social.value.chat_id || '',
      status: social.value.status || false,
      trading_view_id: social.value.trading_view_id || '',
      trading_view_message: social.value.trading_view_message || ''
    }
  }
}

const submitSocialForm = async () => {
  try {
    // Update trading_view_id
    await makeRequest(
      'updateUser',
      'PUT',
      { trading_view_id: socialData.value.trading_view_id },
      {},
      {},
      0,
      null
    )

    // Update social data
    const method = Object.keys(socialStore.social).length > 2 ? 'PUT' : 'POST'
    
    const payload = {
      ...socialData.value,
      trading_view_message: 
        social.value.trading_view_id !== socialData.value.trading_view_id
          ? 'updated'
          : ''
    }

    await makeRequest(
      socialStore.endpoint,
      method,
      payload,
      {},
      {},
      0,
      social.value.id
    )

    isEditing.value = false
  } catch (error) {
    console.error('Error updating social info:', error)
  }
}
</script>