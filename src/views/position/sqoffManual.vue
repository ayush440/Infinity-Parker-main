<template>
  <!-- Square Off Modal -->
  <Modal1 
    size="lg" 
    :popup="true" 
    :show="showSqOffModal" 
    @close="showSqOffModal = false"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <template #body>

      <div class="flex justify-center  absolute top-0 z-50 w-full mx-auto m-16 ">
          <div class="w-20 h-20 rounded-2xl  bg-[#2a2a2c] border-2 border-white flex items-center justify-center">
            <CheckIcon class="w-10 h-10 text-white border border-white rounded-full p-2" />
          </div>
        </div>
      <div class="relative bg-[#1C1C1C] rounded-xl p-6 w-full mt-24 ">
        <!-- Close button -->
        <button 
          @click="showSqOffModal = false"
          class="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <XIcon class="w-6 h-6" />
        </button>

        <!-- Icon -->
        

        <!-- Content -->
        <div class="text-center">
          <h2 class="text-2xl font-semibold text-white mb-3 mt-10">
            Confirmation required
          </h2>
          <p class="text-gray-400 text-lg mb-8">
            Are you sure you want to square off this position?
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-4 justify-center">
          <button
            type="button"
            @click="showSqOffModal = false"
            class="px-8 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="confirm"
            class="px-8 py-2 rounded-lg bg-[#7C3AED] text-white font-medium hover:bg-[#6D28D9] transition-colors"
          >
            Square off
          </button>
        </div>
      </div>
    </template>
  </Modal1>

  <!-- Close Modal -->
  <Modal1 
    size="lg" 
    :popup="true" 
    :show="showCloseModal" 
    @close="showCloseModal = false"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <template #body>
      <div class="relative bg-[#1C1C1C] rounded-xl p-6 w-[440px]">
        <button 
          @click="showCloseModal = false"
          class="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <XIcon class="w-6 h-6" />
        </button>

        <div class="flex justify-center mb-6">
          <div class="w-20 h-20 rounded-2xl border-2 border-white/20 flex items-center justify-center">
            <CheckIcon class="w-10 h-10 text-white" />
          </div>
        </div>

        <div class="text-center">
          <h2 class="text-2xl font-semibold text-white mb-3">
            Confirmation required
          </h2>
          <p class="text-gray-400 text-lg mb-8">
            Are you sure you want to close this position?
          </p>
        </div>

        <div class="flex gap-4 justify-center">
          <button
            type="button"
            @click="showCloseModal = false"
            class="px-8 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="confirmClose"
            class="px-8 py-3 rounded-lg bg-[#7C3AED] text-white font-medium hover:bg-[#6D28D9] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </template>
  </Modal1>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePositionsStore } from "@/stores/matrix/position";
import { XIcon, CheckIcon } from 'lucide-vue-next';

const positionsStore = usePositionsStore();
const { showSqOffModal, showCloseModal } = storeToRefs(positionsStore);
const { sqOffPosition, closePosition } = positionsStore;

async function confirm() {
  let message: any = sqOffPosition();
  if (message) {
    showSqOffModal.value = false;
  }
}

async function confirmClose() {
  let message: any = closePosition();
  if (message) {
    showCloseModal.value = false;
  }
}
</script>