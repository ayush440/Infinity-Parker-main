<template>
  <!-- logo-topbar -->
  <div class="logo-topbar bg-[#1d1d20] flex justify-between items-center relative p-2 pb-1">
    <div class="flex items-center">
      <div class="flex items-center">
        <div class="cursor-pointer ml-2 rounded-lg transition duration-200 dark:text-tableText z-50"
          :class="{ 'rotate-0': !toggle, 'rotate-[180deg]': toggle }">
          <MenuIcon 
            v-if="!toggle" 
            class="m-2 w-6 h-6 transition transition-delay-300 hover:scale-110 text-white"
            @click="toggleMenu" 
          />
          <XIcon 
            v-else 
            @click="toggleMenu"
            class="m-2 w-6 h-6 transition transition-delay-300 hover:scale-110 text-white"
            :class="{ 'rotate-0': toggle, 'rotate-[180deg]': !toggle }" 
          />
        </div>
      </div>
      <RouterLink to="/">
        <img src="/public/InfinityParker.png" @load="handleImageLoad" @error="handleImageError" class="w-24" />
        <img v-if="imgName" :src="'' + imgName + '.png'" @load="handleImageLoad" @error="handleImageError"
          class="w-[228px] h-16" :class="{ 'hidden': !imgLoad }" />
        <div v-if="!imgLoad"
          class="flex h-16 w-full font-bold justify-center border border-red-600 items-center mt-[-5px] text-3xl text-gray-600 dark:text-tableText">
          {{ domainName }}
        </div>
      </RouterLink>
    </div>

    <div class="flex gap-2">
      <button @click="openAddBrokerModal"
        class="flex items-center gap-1 bg-[#1d1d20] border border-gray-600 hover:bg-[#7A6DFF] text-white px-2 rounded-xl my-1 transition-colors duration-200">
        <PlusIcon class="w-4 h-4" />
        <span class="text-sm font-medium">Add broker</span>
      </button>

      <PopupDropdown :isOpen="showProfileModal" @close="closeProfileModal" class="profile-popup" dropdownClass="dropdown-1 top-[100%] right-0 shadow-lg border border-third-light dark:border-third">
        <template #dropdown-toggle>
          <div @click="toggleProfileModal">
            <img class="w-12 h-12 rounded-full cursor-pointer"
              :src="profile.profile_picture_url ? profile.profile_picture_url : images['profile']" alt=""  />
          </div>
        </template>
        <template #dropdown-body>
          <div @click="clickProfile" class="profile-option">
            View Profile
          </div>
          <div @click="clickRefresh" class="profile-option">
            Terms & Conditions
          </div>
          <div class="profile-option" @click="handleLogout">
            Logout
          </div>
        </template>
      </PopupDropdown>
    </div>
  </div>

  <AddEdit v-if="showAddEditModal" />
  
  <teleport to="body">
    <div class="visible lg:hidden h-full bg-[#1d1d20] text-[#888888]">
      <transition name="slide-fade">
        <div v-if="toggle" @click.self="closeLogoTopbar"
          class="fixed h-full w-full menuBar overflow-y-scroll top-0 left-0"
          :style="{ zIndex: zIndexValue + 2 }">
          <div ref="logoTopbar"
            class="bg-[#1d1d20] overflow-y-auto overflow-x-hidden h-full menuBar-shadow w-[250px] transform"
            :class="{ 'translate-x-0': toggle, '-translate-x-full': !toggle }">

            <div class="pb-4 ml-1 flex flex-col shadow">
              <div class="unselectable flex flex-col p-1 pt-8 pl-2">
                <div class="flex items-center cursor-pointer">
                  <img class="w-12 h-12 rounded-full"
                    :src="profile.profile_picture_url ? profile.profile_picture_url : images['profile']"
                    alt="" />
                  <div class="ml-2">
                    <div class="font-bold text-[#EFEFEF]">{{ profile?.name }}</div>
                    <div class="dark:text-tableText">
                      {{ profile?.user_role }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ul class="flex flex-col p-1 mt-4 pl-2" v-if="navlinks.length > 0 && allRoutes.length > 0">
              <routeName v-for="(navData, index) in navlinks" :key="index" :item="navData"
                :route="findRoutes(navData.name)"  />
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { logout } from '@/request/request'
import { images } from '@/assets/img'
import { useNavlinksStore } from '@/stores/navlinks'
import { useProfileStore } from '@/stores/matrix/profile'
import { useNotificationsStore } from '@/stores/matrix/notification'
import { useStrategiesStore } from '@/stores/matrix/strategy'
import { useLogoStore } from '@/stores/utils/logo'
import { useBrokersStore } from '@/stores/matrix/broker'
import { PlusIcon, MenuIcon, XIcon } from 'lucide-vue-next'
import AddEdit from '@/views/broker/addEdit.vue'
import PopupDropdown from '@/components/PopupDropdown.vue'
import routeName from './routeName.vue'

const router = useRouter()

const notificationStore = useNotificationsStore()
const strategiesStore = useStrategiesStore()
const navlinkStore = useNavlinksStore()
const profileStore = useProfileStore()
const logoStore = useLogoStore()
const brokerStore = useBrokersStore()

const { notificationsData } = storeToRefs(notificationStore)
const { strategies } = storeToRefs(strategiesStore)
const { navlinks, mobileToggle } = storeToRefs(navlinkStore)
const { profile } = storeToRefs(profileStore)
const { logoData } = storeToRefs(logoStore)
const { showAddEditModal } = storeToRefs(brokerStore)

const toggle = ref(false)
const showProfileModal = ref(false)
const imgName = ref('')
const imgLoad = ref(false)

const allRoutes = computed(() => router.getRoutes())

const domainName = computed(() => logoData.value)

const findRoutes = (name: string) => {
  return allRoutes.value.find((route) => route.name === name)
}

onBeforeMount(() => {
  const url = window.location.href
  getDomain(url)
})

function handleImageLoad() {
  imgLoad.value = true
}

function handleImageError() {
  imgLoad.value = false
}

const getDomain = (url: string) => {
  const parsedUrl = new URL(url)
  let count = 0, newHostname = ''
  let urlHostNameArray = parsedUrl.hostname.split(".")

  for (let i = 0; i < urlHostNameArray.length; i++) {
    if (urlHostNameArray[i] == "www" && count == 0) {
      continue
    } else if (count == 0) {
      count = 1
    } else {
      newHostname += urlHostNameArray[i] + "_"
    }
  }

  imgName.value = newHostname.slice(0, -1)
}

watchEffect(() => {
  if (!mobileToggle.value) {
    toggle.value = false
  }
})

const notifications = computed(() => {
  if (
    notificationsData.value &&
    strategies.value &&
    strategies.value.length > 0 &&
    notificationsData.value.length > 0
  ) {
    const strategyMap = new Map(strategies.value.map((strategy: { id: any }) => [strategy.id, strategy]))
    return notificationsData.value.map((notification: { strategy_id: unknown }) => ({
      ...notification,
      strategy: strategyMap.get(notification.strategy_id) || null,
    }))
  }
  return []
})

const clickProfile = () => {
  router.push({ name: 'profile' })
  showProfileModal.value = false
  closeLogoTopbar()
}

const clickRefresh = () => {
  window.location.reload()
}

const closeProfileModal = () => {
  showProfileModal.value = false
}

const toggleProfileModal = () => {
  showProfileModal.value = !showProfileModal.value
}

const toggleMenu = () => {
  toggle.value = !toggle.value
  mobileToggle.value = !mobileToggle.value
}

function getHighestZIndex() {
  const elements = [...document.querySelectorAll('body *')] as HTMLElement[]
  const zIndexes = elements.map(el => parseFloat(window.getComputedStyle(el).zIndex))
    .filter(zIndex => !isNaN(zIndex))
  return Math.max(0, ...zIndexes)
}

const zIndexValue = computed(() => getHighestZIndex() + 1)

const closeLogoTopbar = () => {
  toggle.value = false
  mobileToggle.value = false
}

const handleLogout = async () => {
  try {
    await logout()
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const openAddBrokerModal = () => {
  showAddEditModal.value = true
}
</script>

<style lang="scss" scoped>
@media (max-width: 1020px) {
  .menuBar {
    display: block;
  }
}

.menuBar-shadow {
  box-shadow: 0 1px 30px 1px rgba(0, 0, 0, 0.4);
}

.profile-option {
  @apply flex items-center gap-2 px-4 py-2 text-sm text-white transition-all duration-150 hover:bg-[#343437] cursor-pointer rounded-md;
}

.icon-size {
  @apply m-1 h-4 w-4;
}

.menuBar {
  transition: transform 0.7s ease-in-out;
  
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.7s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
}

.profile-popup {
  position: relative;
}
</style>