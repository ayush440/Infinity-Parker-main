import { ref } from 'vue'
import { defineStore } from 'pinia'
import { makeRequest, state } from '@/request/request'

export const useStrategiesStore = defineStore('strategies', () => {
  const endpoint = 'plan_strategy'
  const wait =0
  const strategies = ref<any>([])
  const plans = ref<any>([])
  const stratgyJoinedPlans = ref([]) 
  const showMessage = ref<boolean>(false)
  const message = ref<string>('')
  
  const strategyName =ref<any>('')


  const getStrategies = async () => {
    const response = await makeRequest(endpoint, 'GET', {}, {}, { }, wait)

    try {
      if(response.data) {
        strategies.value = response.data.strategies.sort((a: any, b: any) => b.id - a.id) || []
        plans.value = response.data.plans || []
        stratgyJoinedPlans.value = response.data.strategy_joined || []
      }
    } catch (error) {
      throw error
    }
  }

  const getStrategiesById = async (id: number) => {
    return strategies.value.find((strategy: any) => strategy.id === id); 
  }

  const findStrategyById = (id: number) => {
    return strategies.value.find((strategy: any) => strategy.id === id);
};
  
  getStrategies()

  return {
    strategies,
    state,
    plans,
    stratgyJoinedPlans,
    getStrategies,
    getStrategiesById,
    findStrategyById,
    endpoint,
    showMessage,
    message,
    strategyName
        
  }
})
