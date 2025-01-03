<template>
  <div class="min-h-screen bg-[#2a2a2c] text-white">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-gray-400 p-6">
      <a href="/" class="hover:text-white">Home</a>
      <span>›</span>
      <span>Pricing</span>
    </div>

    <div>
      <h1 class="text-2xl text-white px-6 mb-5">Pricing</h1>
    </div>

    <!-- Pricing Cards Grid -->
    <div class="px-6 py-8 bg-[#1d1d20] mx-5 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Card 1 -->
        <div class="bg-[#2C2C2E] rounded-lg p-6" v-for="plan in strategiesStore.plans || []">
          
          <div class="flex items-center gap-2 mb-2">
            <img src="/public/litvector.png" alt="Professional icon" class="w-4 h-5" />
            <h2 class="text-xl font-medium">{{plan.name}}</h2>
          </div>
          <p class="text-gray-400 text-sm mb-4">Lorem ipsum dolor sit amet consectetur.</p>
          <div class="text-3xl font-bold mb-6">{{ plan?.invoice_item?.amount }}</div>
          
          <div class="space-y-4 mb-8">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Unlimited trading with algo</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Lorem ipsum dolor sit amet yrfkejk consectetur</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Unlimited trading with algo</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span class="text-gray-400">Unlimited trading with algo</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span class="text-gray-400">Unlimited trading with algo oalgo</span>
            </div>
          </div>
          
          <button v-if="profileStore.profile.plan_id === plan.id" @click="upgradePlan(plan)"
            class="w-full py-2 px-4 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-700 transition-colors"
          >
            {{ plan.invoice_item[0]?.amount || 0.00}} ₹
          </button>
          <button v-else
            @click="upgradePlan(plan)"
            class="w-full py-2 px-4 rounded-lg bg-[#8b7eff] text-white hover:bg-[#7a6bff] transition-colors"
          > 
          {{ plan.invoice_item ? plan.invoice_item[0].amount : 0 }} ₹
          </button>
        </div>

        <!-- Card 2 -->
        <!-- <div class="bg-[#2C2C2E] rounded-lg p-6">
          <div class="flex items-center gap-2 mb-2">
            <img src="/public/litvector.png" alt="Professional icon" class="w-4 h-5" />
            <h2 class="text-xl font-medium">Professional</h2>
          </div>
          <p class="text-gray-400 text-sm mb-4">Lorem ipsum dolor sit amet consectetur.</p>
          <div class="text-3xl font-bold mb-6">₹2500</div>
          
          <div class="space-y-4 mb-8">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Unlimited trading with algo</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Lorem ipsumdolor sit amet yrfkejk consectetur</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Unlimited trading with algo</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span class="text-gray-400">Unlimited trading with algo</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span class="text-gray-400">Unlimited trading with algo oalgo</span>
            </div>
          </div>
          
          <button 
            @click="upgradePlan('professional-2500')"
            class="w-full py-2 px-4 rounded-lg bg-[#8b7eff] text-white hover:bg-[#7a6bff] transition-colors"
          >
            Basic Plan
          </button>
        </div> -->

        <!-- Card 3 (Highlighted) -->
        <!-- <div class="bg-[#0a0a29] rounded-lg p-6 border border-[#8b7eff]">
          <div class="flex items-center gap-2 mb-2">
            <img src="/public/litvector.png" alt="Professional icon" class="w-4 h-5" />
            <h2 class="text-xl font-medium">Professional</h2>
          </div>
          <p class="text-gray-400 text-sm mb-4">Lorem ipsum dolor sit amet consectetur.</p>
          <div class="text-3xl font-bold text-[#8b7eff] mb-6">₹3500</div>
          
          <div class="space-y-4 mb-8">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-[#8b7eff] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Unlimited trading with algo</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-[#8b7eff] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Lorem ipsum dolor sit amet yrfkejk consectetur</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-[#8b7eff] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Unlimited trading with algo</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-[#8b7eff] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Lorem ipsum dolor sit amet con sectetur</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span class="text-gray-400">Unlimited trading with algo</span>
            </div>
          </div>
          
          <button 
            @click="upgradePlan('professional-3500')"
            class="w-full py-2 px-4 rounded-lg bg-[#8b7eff] text-white hover:bg-[#7a6bff] transition-colors"
          >
           Pro Plan
          </button>
        </div> -->

        <!-- Card 4 -->
        <!-- <div class="bg-[#2C2C2E] rounded-lg p-6">
          <div class="flex items-center gap-2 mb-2">
            <img src="/public/litvector.png" alt="Professional icon" class="w-4 h-5" />
            <h2 class="text-xl font-medium">Professional</h2>
          </div>
          <p class="text-gray-400 text-sm mb-4">Lorem ipsum dolor sit amet consectetur.</p>
          <div class="text-3xl font-bold mb-6">₹4500</div>
          
          <div class="space-y-4 mb-8">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Unlimited trading with algo</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Lorem ipsum dolor sit amet yrfkejk consectetur</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Unlimited trading with algo</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span class="text-gray-400">Unlimited trading with algo</span>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span class="text-gray-400">Unlimited trading with algo oalgo</span>
            </div>
          </div>
          
          <button 
            @click="upgradePlan('professional-4500')"
            class="w-full py-2 px-4 rounded-lg bg-[#8b7eff] text-white hover:bg-[#7a6bff] transition-colors"
          >
          Enterprise Plan
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useBillingStore } from '@/stores/matrix/billing';
import { useStrategiesStore } from '@/stores/matrix/strategy';
import { useProfileStore } from '@/stores/matrix/profile';
import { useInvoicesStore } from "@/stores/matrix/invoice";


const router = useRouter()
const billingStore = useBillingStore()
const strategiesStore = useStrategiesStore()
const profileStore = useProfileStore();
const invoiceStore = useInvoicesStore();

const { selectedPlanData } = storeToRefs(invoiceStore);

const upgradePlan = (plan : any) => {
  selectedPlanData.value = plan
  // billingStore.setSelectedPlan(plan)
  // billingStore.setRedirectToDropdown(true)
  router.push('/profile')
}
</script>

<style scoped>
/* No additional styles needed - using Tailwind classes */
</style>

