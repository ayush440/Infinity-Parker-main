import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavlinksStore = defineStore('navlink', () => {

  const mobileToggle = ref<boolean>(false)

  const navlinks = ref<any>([
    {
      icon: 'HomeIcon',
      name: 'dashboard',
      title: 'Dashboard',
      permission: 'dashboard'
    },
    {
      icon: 'CommandIcon',
      name: 'mystrategies',
      title: 'My Strategies',
      permission: 'Read_domain_strategy_joiner'
    },
    {
      icon: 'InboxIcon',
      name: 'strategies',
      title: 'Strategies',
      permission: 'Read_strategy'
    },
    // {
    //   icon: 'UsersIcon',
    //   name: 'brokers',
    //   title: 'Brokers',
    //   permission: 'Read_broker'
    // },
    {
      icon: 'CreditCardIcon',
      name: 'positions',
      title: 'Positions',
      permission: 'Read_domain_position'
    },
    {
      icon: 'OrdersIcon',
      name: 'orders',
      title: 'Orders',
      permission: 'Read_domain_order'
    },
    
    
    {
      icon: 'VideoIcon',
      name: 'videos',
      title: 'Tutorials',
      permission: 'Read_videos'
    },
    {
      icon: 'PricingIcons',
      name: 'pricing',
      title: 'Pricing',
      permission: 'Read_videos'
    },

    

    // {
    //   icon: 'BookOpenIcon',
    //   name: 'courses',
    //   title: 'Courses',
    // }
  ])


  // console.log("print navlinks", navlinks);
  
  return {
    navlinks,
    mobileToggle
  }
})

