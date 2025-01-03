import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBillingStore = defineStore('billing', () => {
  const selectedPlan = ref('')
  const redirectToDropdown = ref(false)

  const setSelectedPlan = (plan : any) => {
    selectedPlan.value = plan
  }

  const setRedirectToDropdown = (value: boolean) => {
    redirectToDropdown.value = value
  }

  return {
    selectedPlan,
    redirectToDropdown,
    setSelectedPlan,
    setRedirectToDropdown
  }
})

