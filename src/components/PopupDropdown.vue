<template>
  <div :id="id" ref="dropdownCont">
    <!-- header -->
    <div ref="dropdownBtn">
      <slot name="dropdown-toggle"></slot>
    </div>
  
    <!-- body -->
    <teleport to="body">
      <transition name="dropdown-slide">
        <div v-if="isOpen" ref="dropdown" :style="dropdownStyle" 
             class="dropdown-body p-2 w-80   border-[#343437] bg-[#1d1d20] rounded-md shadow-lg"
             :class="[dropdownClass]">
          <slot name="dropdown-body"></slot>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: false,
    default: false
  },
  id: {
    type: String,
    required: false,
    default: `dropdown-${Math.random().toString(16).slice(2)}`
  },
  dropdownClass: {
    type: String,
    required: false,
    default: ''
  }
});

const dropdownCont = ref<HTMLElement | null>(null);
const dropdown = ref<HTMLElement | null>(null);
const dropdownBtn = ref<HTMLElement | null>(null);
const emit = defineEmits(['close', 'click:outside']);

const isMobile = ref(false);
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
};

const dropdownStyle = computed(() => {
  if (!dropdownBtn.value || !dropdown.value) return {};

  const btnRect = dropdownBtn.value.getBoundingClientRect();
  const dropdownRect = dropdown.value.getBoundingClientRect();

  let top = btnRect.bottom + window.scrollY;
  let left = btnRect.left + window.scrollX;

  // Ensure the dropdown stays within viewport bounds
  if (top + dropdownRect.height > windowHeight.value) {
    top = btnRect.top + window.scrollY - dropdownRect.height;
  }

  if (left + dropdownRect.width > windowWidth.value) {
    left = windowWidth.value - dropdownRect.width;
  }

  return {
    position: 'fixed' as const,
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 99999,
  };
});

const clickHandler = (event: MouseEvent) => {
  if (dropdown.value && !dropdown.value.contains(event.target as Node) &&
      dropdownBtn.value && !dropdownBtn.value.contains(event.target as Node)) {
    emit('close');
  }
};

const handleClickOutside = () => {
  document.addEventListener('click', clickHandler);
};

const removeListener = () => {
  document.removeEventListener('click', clickHandler);
};

const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden';
};

const unlockBodyScroll = () => {
  document.body.style.overflow = '';
};

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      handleClickOutside();
      lockBodyScroll();
    });
  } else {
    removeListener();
    unlockBodyScroll();
  }
});

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  removeListener();
  unlockBodyScroll();
});
</script>

<style scoped lang="scss">
.dropdown-body {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 767px) {
  .dropdown-body {
    width: 60vw;
    max-width: 60vw;
  }
}
</style>