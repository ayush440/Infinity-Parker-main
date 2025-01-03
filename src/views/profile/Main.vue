<template>
  <div class="flex items-center gap-2 text-gray-400 px-6 py-3 mt-3">
    <span>Home</span>
    <span>›</span>
    <span>Profile</span>
  </div>
  <!-- Header -->
  <div class="flex justify-between items-center px-6 py-4">
    <h1 class="text-2xl text-white">Profile</h1>
  </div>
  <div class="rounded-lg m-4 bg-[#1d1d20] text-white">
    <!-- Profile Header -->
    <div class="mx-auto px-4 py-8">
      <div class="mb-8">
        <div class="flex items-center gap-6">
          <div class="relative">
            <img
              :src="profile.profile_picture_url"
              alt="Profile"
              class="w-24 h-24 rounded-full object-cover border-4 border-[#2C2C30]"
            />
            <div 
              class="absolute -bottom-2 -right-2 bg-[#7C3AED] rounded-full p-2 cursor-pointer"
              @click="triggerFileInput"
            >
              <CameraIcon class="w-4 h-4" />
            </div>
            <input
              type="file"
              ref="fileInput"
              @change="handleFileChange"
              accept="image/*"
              class="hidden"
            />
          </div>
          <div>
            <h1 class="text-2xl font-bold mb-1">{{ profile.name }}</h1>
            <p class="text-gray-400">{{ profile.user_role }}</p>
            <p class="text-gray-400 flex items-center gap-2 mt-1">
              <MailIcon class="w-4 h-4" />
              {{ profile.email }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-[#2C2C30] mb-8 ">
        <div class="flex justify-evenly">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="scrollToSection(tab.id)"
            class="pb-4 relative"
            :class="selectedTab === tab.id ? 'text-white' : 'text-gray-400'"
          >
            <div class="flex items-center gap-2">
              <component :is="tab.icon" class="w-5 h-5 hidden md:flex" />
              {{ tab.name }}
            </div>
            <div
              v-if="selectedTab === tab.id"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]"
            ></div>
          </button>
        </div>
      </div>

      <!-- Mobile Tab Select -->
      <div class="md:hidden mb-6">
        <select
          v-model="selectedTab"
          @change="scrollToSection(selectedTab)"
          class="w-full bg-[#2C2C30] border border-[#3C3C40] rounded-lg px-4 py-2 text-white"
        >
          <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
            {{ tab.name }}
          </option>
        </select>
      </div>

      <!-- Content Sections -->
      <div class="">
        <!-- Main Content -->
        <div class="space-y-8" id="personal">
          <editprofilevue :profile="profile" />
        </div>

        <div class="space-y-8" id="social">
          <socialvue />
        </div>

        <div class="space-y-8" id="billing">
          <billing :profile="profile" />
        </div>

        <div class="space-y-8" id="password">
          <changepasswordvue :profile="profile" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import {
  UserIcon,
  UsersIcon,
  CreditCardIcon,
  LockIcon,
  MailIcon,
  CameraIcon
} from 'lucide-vue-next'
import { useProfileStore } from '@/stores/matrix/profile'
import { useInvoiceConfigrationStore } from '@/stores/matrix/invoiceConfigration'
import { images } from '@/assets/img'

// Components
import editprofilevue from './editProfile.vue'
import socialvue from './social.vue'
import changepasswordvue from './changePassword.vue'
import billing from './billing.vue'
import quote from './quote.vue'

// Store
const profileStore = useProfileStore()
const invoiceConfigrationStore = useInvoiceConfigrationStore()
const { invoiceConfigrations } = storeToRefs(invoiceConfigrationStore)
const { profile } = storeToRefs(profileStore)

// Route
const route = useRoute()
const item = ref(route.params.item)

// Tabs Configuration
const tabs = ref([
  { id: 'personal', name: 'Personal Info', icon: UserIcon },
  { id: 'social', name: 'Social Info', icon: UsersIcon },
  { id: 'billing', name: 'Billing Info', icon: CreditCardIcon },
  { id: 'password', name: 'Change Password', icon: LockIcon }
])

const selectedTab = ref('personal')

const scrollToSection = (id: string) => {
  selectedTab.value = id
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Profile picture upload
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadError = ref('')

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    isUploading.value = true
    uploadError.value = ''

    try {
      await profileStore.updateProfilePicture(file)
    } catch (error) {
      uploadError.value = 'Failed to upload profile picture. Please try again.'
      console.error('Error uploading profile picture:', error)
    } finally {
      isUploading.value = false
    }
  }
}
</script>

<style lang="scss" scoped>
.min-h-screen {
  @apply bg-[#1C1C1F];
  scroll-behavior: smooth;
}

select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  appearance: none;
}
</style>

