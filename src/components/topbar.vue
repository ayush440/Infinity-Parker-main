<template>
  <div :class="[isDashboard ? 'flex' : 'md:flex']" class="border border-gray-600 bg-[#1D1D20] w-full justify-between items-center flex-wrap space-y-1 pl-4 md:pl-10 pr-2 md:pr-4 py-3 md:py-4 hidden md:flex">
    <!-- Page Name -->
     
    <div class="unselectable capitalize font-bold text-lg sm:text-2xl text-white dark:text-tableText flex items-center gap-4"> 
      <span>Hello {{ profile?.name }} 👋</span>

      <!-- Toggle Switch -->
      <div>
        <div 
          class="relative inline-flex items-center rounded-full cursor-pointer w-[160px] h-[32px] bg-[#1D1D20] border border-gray-500" 
          @click="toggleMode"
        >
          <div 
            class="absolute w-[80px] h-[32px] bg-[#8B7EFF] rounded-full transition-transform duration-300 ease-in-out" 
            :class="[isTabActive === 'live' ? 'translate-x-[80px]' : '']"
          ></div>
          <span 
            class="relative z-10 w-[80px] text-center text-sm font-medium transition-colors duration-300" 
            :class="[isTabActive === 'paper' ? 'text-white' : 'text-gray-500']"
          >
            Paper
          </span>
          <span 
            class="relative z-10 w-[80px] text-center text-sm font-medium transition-colors duration-300" 
            :class="[isTabActive === 'live' ? 'text-white' : 'text-gray-500']"
          >
            Live
          </span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4 pt-0 pr-6 2xl:pr-2">
      <!-- Connected Broker or Add Broker Button -->
      <div  @click="tokenGenerate(brokers[0]) "  v-if="brokers[0]" class="flex items-center gap-2 bg-[#1d1d20] border border-gray-600 px-4 py-2 rounded-lg cursor-pointer">
        <img 
          :src="getBrokerLogo(brokers[0].broker_name)" 
          :alt="brokers[0].broker_name"
          class="w-5 h-5"
          @error="handleImageError"
        />
        <span class="text-sm font-medium text-white">{{ brokers[0].broker_name }}</span>
        <button 
          @click="showAddEditModal = true"
          class="ml-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <EditIcon class="w-4 h-4" />
        </button>
        <!-- <button @click="tokenGenerate(brokers[0]) " class="text-white">Sync</button> -->
      </div>
      <button 
        v-else
        @click="showAddEditModal = true"
        class=" items-center gap-2 bg-[#1d1d20] border border-gray-600 hover:bg-[#7A6DFF] text-white px-4 py-2 rounded-lg transition-colors duration-200 hidden md:flex"
      >
        <PlusIcon class="w-4 h-4" />
        <span class="text-sm font-medium">Add broker</span>
      </button>

      <div class="hidden md:flex items-center gap-2">
        <!-- Notification -->
        <PopupDropdown :isOpen="showNotificationModal" @close="closeNotificationModal" dropdownClass="dropdown-1 top-[100%] shadow-lg border border-third-light dark:border-third">
          <template #dropdown-toggle>
            <div class="p-2 2xl:p-2.5 mx-1 bg-[#1D1D20] border border-gray-500 rounded-lg" @click="toggleNotificationModal">
              <BellIcon class="w-4 h-4 2xl:w-5 2xl:h-5 cursor-pointer text-white" />
            </div>
          </template>

          <template #dropdown-body>
            <div class="max-h-[320px] overflow-y-scroll text-gray-600 dark:text-white text-center p-2">
              <div v-if="notifications.length > 0" class="cursor-pointer relative" v-for="notification in notifications" :key="notification.id">
                <div class="ml-2 overflow-hidden">
                  <div class="flex items-center">
                    <a href="javascript:;" class="font-medium truncate mr-5">{{notification.heading}}</a>
                    <div class="text-xs text-slate-400 ml-auto whitespace-nowrap">
                      {{notification.time}}
                    </div>
                  </div>
                  <div class="text-left truncate text-slate-400 mt-0.5">
                    Strategy: {{ notification.strategy ? notification.strategy.name : 'N/A' }}
                  </div>
                  <div class="text-left truncate text-slate-400 mt-0.5">
                    Exchange: {{ notification.exchange }}
                  </div>
                  <div class="text-left truncate text-slate-400 mt-0.5">
                    Side: {{ notification.side }}
                  </div>
                  <div class="text-left truncate text-slate-400 mt-0.5">
                    Symbol: {{ notification.tradingsymbol }}
                  </div>
                  <div class="text-left truncate text-slate-400 mt-0.5">
                    {{notification.message}}
                  </div>
                </div>
              </div>
              <span v-else>
                You have no notifications
              </span>
            </div>
          </template>
        </PopupDropdown>

        <!-- Profile -->
        <PopupDropdown :isOpen="showProfileModal" @close="closeProfileModal" dropdownClass="dropdown-1 max-w-56 top-[100%] right-[70%] shadow-lg border border-third-light dark:border-third">
          <template #dropdown-toggle>
            <div class="flex">
              <div class="p-2 2xl:p-2.5 mx-1 bg-[#1D1D20] border border-gray-500 rounded-lg" @click="toggleProfileModal">
                <UserIcon class="w-4 h-4 2xl:w-5 2xl:h-5 cursor-pointer text-white" />
              </div>
            </div>
          </template>
          <template #dropdown-body id="dropdown">
            <div @click="clickProfile" class="profile-option">
              View Profile
            </div>
            <div @click="clickRefresh" class="profile-option">
              Terms & Conditions
            </div>
            <div class="profile-option" @click="logout">
              Logout
            </div>
          </template>
        </PopupDropdown>
      </div>
    </div>
  </div>
  
  <!-- Add Broker Modal -->
  <AddEdit v-if="showAddEditModal" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useProfileStore } from '@/stores/matrix/profile'
import { useNotificationsStore } from '@/stores/matrix/notification'
import { useStrategiesStore } from '@/stores/matrix/strategy'
import { useNavlinksStore } from '@/stores/navlinks'
import { usePositionsStore } from '@/stores/matrix/position'
import { useBrokersStore } from '@/stores/matrix/broker'
import AddEdit from '@/views/broker/addEdit.vue'
import PopupDropdown from '@/components/PopupDropdown.vue'
import { BellIcon, UserIcon, PlusIcon, EditIcon } from 'lucide-vue-next'
import { logout, makeRequest } from '@/request/request'
import { images } from '@/assets/img'

const router = useRouter()
const route = useRoute()
const notificationStore = useNotificationsStore()
const strategiesStore = useStrategiesStore()
const navlinksStore = useNavlinksStore()
const profileStore = useProfileStore()
const positionsStore = usePositionsStore()
const brokersStore = useBrokersStore()

const { navlinks } = storeToRefs(navlinksStore)
const { notificationsData } = storeToRefs(notificationStore)
const { strategies } = storeToRefs(strategiesStore)
const { profile } = storeToRefs(profileStore)
const { isTabActive } = storeToRefs(positionsStore)
const { showAddEditModal, brokers } = storeToRefs(brokersStore)

const toggleMode = () => {
  isTabActive.value = isTabActive.value === 'live' ? 'paper' : 'live'
}

const isDashboard = computed(() => {
  return route.name === 'dashboard'
})

const showNotificationModal = ref(false)
const showProfileModal = ref(false)

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

const closeNotificationModal = () => {
  showNotificationModal.value = false
}

const toggleNotificationModal = () => {
  showNotificationModal.value = !showNotificationModal.value
}

const closeProfileModal = () => {
  showProfileModal.value = false
}

const toggleProfileModal = () => {
  showProfileModal.value = !showProfileModal.value
}

const clickProfile = () => {
  router.push({ name: 'profile' })
  showProfileModal.value = false
}

const clickRefresh = () => {
  window.location.reload()
}

const tokenGenerate = async (broker: any): Promise<void> => {
  try {
    const response = await makeRequest("generateToken", "GET", {}, {}, {}, 0, broker.id)
    if (response.data && ["zerodha", "upstox", "gopocket"].includes(broker.broker_name)) {
      window.open(response.data.redirect_url, '_blank')
    }
  } catch (error) {
    console.error("Error in token generation:", error)
  }
}

interface Broker {
  id: number;
  broker_name: string;
}

const connectedBroker = computed(() => {
  return brokers.value[0] as Broker | undefined
})

watch(connectedBroker, (newValue) => {
  console.log('Connected Broker:', newValue)
})

const getBrokerLogo = (brokerName: string) => {
  return images[brokerName] || '/path/to/default-logo.png'
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/path/to/default-logo.png'
}
</script>

<style scoped>
.profile-option {
  @apply flex items-center gap-2 px-4 py-2 text-sm text-white transition-all duration-150 hover:bg-[#343437] cursor-pointer rounded-md;
}

.icon-size {
  @apply w-4 h-4;
}
</style>

