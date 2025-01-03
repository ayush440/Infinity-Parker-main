<template>
  <div ref="dropdownRef" :id="id" class="relative multiselect-dropdown" tabindex="0">
    <div @click="toggleDropdown" class="w-full px-4 py-2 text-[#9ca3af] focus:outline-1 focus:outline-primary rounded"
         :class="{ 'cursor-not-allowed opacity-80': disabled, 'cursor-pointer': !disabled }">
      <div class="flex items-center justify-between">
        <span v-if="!selectedOptions.length">{{ placeholder }}</span>
        <span v-else>{{ selectedOptions.length }} item(s) selected</span>
        <svg
          class="w-5 h-5 ml-2 text-primary transition-transform transform"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
    <transition name="fade">
      <div v-if="isOpen && !disabled" class="absolute z-10 mt-[2px] w-full max-h-56 overflow-auto text-nowrap bg-[#222222] text-white rounded-md">
        <div v-if="options.length" v-for="option in options" :key="option.id" class="w-full cursor-pointer">
          <label class="flex m-0 items-center py-[2px] pl-4 cursor-pointer font-normal text-base text-tableText">
            <input 
              type="checkbox"  
              v-model="selectedOptions"
              :value="option.id" 
              class="mr-4 w-4 h-4 text-indigo-500"
            />
            <div class="flex m-0 items-center text-[#9ca3af]">
              <div v-if="iconShow && option.icon" class="mr-4">
                <component :is="option.icon" class="w-4 h-4" />
              </div>
              <div v-else-if="imageShow && option.image" class="mr-4">
                <img :src="images[option.image]" class="w-4 h-4" />
              </div>
              <div>{{ option.label }}</div>
            </div>
          </label>
        </div>
        <div v-else class="w-full cursor-pointer">
          <label class="flex items-center m-0 py-[2px] pl-4 cursor-pointer">
            <span class="">Options not available</span>
          </label>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { images } from '@/assets/img/index';
import { ref, computed, watch, onUnmounted, onMounted, type PropType } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default: () => `MultiSelect-${Math.random().toString(16).slice(2)}`
  },
  initialOptions: {
    type: Array as PropType<{ id: number; label: string; icon?: string; image?: string }[]>,
    default: () => [],
  },
  selected: {
    type: Function as PropType<(option: any) => void>,
    required: true,
  },
  iconShow: {
    type: Boolean,
    default: false,
  },
  imageShow: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Select',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const isOpen = ref(false);
const selectedOptions = ref([]);
const dropdownRef = ref<HTMLElement | null>(null);

const options = computed(() => {
  return props.initialOptions;
});

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

watch(selectedOptions, (newSelectedOptions, oldSelectedOptions) => {
  if (newSelectedOptions !== oldSelectedOptions) {
    props.selected(newSelectedOptions);
  }
});

const handleClickOutside = (event: MouseEvent) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.rotate-180 {
  transform: rotate(180deg);
}

.multiselect-dropdown {
  span, svg {
    @apply font-normal text-base;
  }
}
</style>