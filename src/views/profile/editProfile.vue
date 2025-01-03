<template>
  <div class="bg-[#2a2a2c] rounded-lg p-6">
    <div class="flex items-center justify-between mb-6 ">
      <h2 class="text-xl text-white font-medium">Personal detail</h2>
      <button 
        @click="toggleEdit" 
        class=""
      >
        <img v-if="!isEditing" src="/public/edit.svg" alt="Edit">
      </button>
    </div>

    <form @submit.prevent="submitForm" class="grid grid-cols-3 gap-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-200 mb-2">Full name</label>
        <input
          type="text"
          id="name"
          v-model="profileData.name"
          :disabled="!isEditing"
          class="w-full disabled:bg-[#222222] bg-[#2C2C30] border border-[#3C3C40] rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          :placeholder="profile?.name"
        />
      </div>

      <div>
        <label for="number" class="block text-sm font-medium text-gray-200 mb-2">Number</label>
        <input
          type="text"
          id="number"
          v-model="profileData.mobile"
          :disabled="!isEditing"
          class="w-full disabled:bg-[#222222] bg-[#2C2C30] border border-[#3C3C40] rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-200 mb-2">Email</label>
        <input
          type="email"
          id="email"
          v-model="profileData.email"
          :disabled="!isEditing"
          class="w-full disabled:bg-[#222222] bg-[#2C2C30] border border-[#3C3C40] rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
        />
      </div>

      <div>
        <label for="address" class="block text-sm font-medium text-gray-200 mb-2">Address</label>
        <input 
          type="text"
          id="address"
          v-model="profileData.address"
          :disabled="!isEditing"
          class="py-2.5 w-full disabled:bg-[#222222] bg-[#2C2C30] border border-[#3C3C40] rounded-lg px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
        />
      </div>

      <div class="flex justify-end gap-4 items-center mt-8" v-if="isEditing">
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
import { ref, watch } from 'vue'
import { makeRequest } from '@/request/request'

interface Profile {
  name?: string
  mobile?: string
  email?: string
  address?: string | { street?: string }
  image?: File | null
}

const props = defineProps<{
  profile?: Profile
}>()

const isEditing = ref(false)
const profileData = ref({
  name: '',
  mobile: '',
  email: '',
  address: '',
  image: null as File | null
})

const getAddressString = (address: string | { street?: string } | null | undefined): string => {
  if (typeof address === 'string') {
    return address.trim();
  }

  if (address && typeof address === 'object') {
    return address.street?.trim() || ''; 
  }

  return ''; 
};


watch(() => props.profile, (newProfile) => {
  if (newProfile) {
    profileData.value = {
      name: newProfile.name || '',
      mobile: newProfile.mobile || '',
      email: newProfile.email || '',
      address: getAddressString(newProfile.address),
      image: null
    }
  }
}, { immediate: true, deep: true })

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value && props.profile) {
    // Reset form when canceling edit
    profileData.value = {
      name: props.profile.name || '',
      mobile: props.profile.mobile || '',
      email: props.profile.email || '',
      address: getAddressString(props.profile.address),
      image: null
    }
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    profileData.value.image = target.files[0]
  }
}

const submitForm = async () => {
  try {
    const formData = new FormData()
    Object.entries(profileData.value).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value)
      }
    })
    
    await makeRequest('updateUser', 'PUT', formData)
    isEditing.value = false
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}
</script>