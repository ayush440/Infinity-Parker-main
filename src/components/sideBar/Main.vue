<template>
  <div class="relative">
    <div 
      :class="[
        'fixed inset-y-0 left-0 z-40 bg-[#1d1d20] shadow-lg transform transition-all duration-300 ease-in-out overflow-hidden',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
        'md:w-[68px]',
        'xl:w-64'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex-shrink-0 p-3 xl:p-4 xl:py-3 border-b border-gray-200">
          <div class="flex items-center justify-center xl:justify-start">
            <RouterLink to="/" class="relative flex items-center justify-center w-16 sm:w-20 xl:w-[233px] h-16 xl:h-[70px] overflow-hidden">
              <img 
                src="/public/InfinityParker.png" 
                alt="Logo"
                class="hidden xl:block w-full h-full max-h-20 object-contain"
              />
              <img 
                src="/public/InfinityParker.png" 
                alt="Logo Tablet"
                class="hidden sm:block xl:hidden w-full h-full max-h-20 object-contain"
              />
            </RouterLink>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto scrollbar-hide">
          <div class="px-2 space-y-2 py-4">
            <router-link 
              v-for="item in navlinks" 
              :key="item.name" 
              :to="{ name: item.name }" 
              :class="[ 
                'flex items-center px-4 py-2 text-[#888888] rounded-lg transition-colors duration-200',
                $route.name === item.name ? 'bg-[#8b7eff] text-white' : 'hover:bg-[#494479] hover:text-white'
              ]"
              @click="closeSidebar"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span class="ml-3 truncate xl:inline hidden">{{ item.title }}</span>
            </router-link>
          </div>
          <div class=" hidden relative   mx-4 rounded-xl bg-gradient-to-br from-[#8B7EFF] to-[#B6A4FE] p-5 xl:flex  flex-col justify-between transform transition-all duration-300 hover:scale-[1.02]">
            <div class="text-white z-10">
              <h3 class="text-xl font-semibold mb-1 ">{{ userPlanName }}</h3>
              <p class="text-sm opacity-90">Your Current Plan Expires in</p>
              <p class="text-sm font-medium">{{ daysUntilExpire }} days</p>
            </div>
            
           
            <button 
              @click="handleUpgrade"
              class="w-full bg-white text-[#8B7EFF] py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors mt-4 z-10"
            >
              Upgrade Now
            </button>
            <div class="absolute top-0 left-0 "><img src="/public/cardbg.png" alt=""></div>
          </div>
          
        </nav>

        <!-- Elite Subscription Box -->
        <div class=" ">
         
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed, onMounted, onUnmounted, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useNavlinksStore } from '@/stores/navlinks'
import { useLogoStore } from '@/stores/utils/logo'
import { useProfileStore } from '@/stores/matrix/profile'

const router = useRouter()
const isOpen = ref(false)
const showProfileMenu = ref(false)
const isXlScreen = ref(false)

// Check screen size
const checkScreenSize = () => {
  isXlScreen.value = window.innerWidth >= 1280
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
  showProfileMenu.value = false
}

const handleUpgrade = () => {
  router.push('/pricing')
}


const route = useRoute()
const navlinkStore = useNavlinksStore()
const logoStore = useLogoStore()
const profileStore = useProfileStore()

const { navlinks } = storeToRefs(navlinkStore)
const { logoData } = storeToRefs(logoStore)
const { profile } = storeToRefs(profileStore)

const allRoutes = computed(() => router.getRoutes())

const findRoutes = (name: string) => {
  return allRoutes.value.find((route) => route.name === name)
}

onBeforeMount(() => {
  const url = window.location.href
  getDomain(url)
})

const imgName = ref('')
const imgName2 = ref('')
const imgLoad = ref(false)
const imgLoad2 = ref(false)

const domainName = computed(() => {
  return logoData.value
})

function handleImageLoad() {
  imgLoad.value = true
}

function handleImageError(error: any) {
  imgLoad.value = false
}

function handleImageLoad2() {
  imgLoad2.value = true
}

function handleImageError2(error: any) {
  imgLoad2.value = false
}

const getDomain = (url: string) => {
  const parsedUrl = new URL(url)
  let count = 0, newHostname = ''
  let urlHostNameArray = parsedUrl.hostname.split(".")

  for (let i = 0; i < urlHostNameArray.length; i++) {
    if(urlHostNameArray[i] == "www" && count == 0){
      continue
    } else if(count == 0){
      count = 1
    } else {
      newHostname += urlHostNameArray[i] + "_"
    }
  }

  imgName.value = newHostname.slice(0, -1)
  imgName2.value = newHostname + "small_logo"
}

const daysUntilExpire = computed(() => {
  if (!profile.value.expire_at) return 0;
  const now = new Date();
  const expireDate = new Date(profile.value.expire_at);
  const diffTime = expireDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
})

const userPlanName = computed(() => {
  return profile.value.plan_name || "N/A"; 
});




</script>

<style scoped>
.menu ul {
  transition: all 0.3s ease;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.transform {
  will-change: transform;
}
</style>

