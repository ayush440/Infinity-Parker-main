<script setup lang="ts">
import { ref, computed } from 'vue';
import config from '../../../matrixcnfg';
import { storeToRefs } from 'pinia'
import { useCourseStore } from '@/stores/matrix/course';
import { makeRequest, state, showToast } from '@/request/request'

const courseStore = useCourseStore()
const { showInvoiceModal, selectedCourse } = storeToRefs(courseStore)


const course = computed(() => selectedCourse.value || {});

function closeModel() {
  showInvoiceModal.value = false
}

// State for form inputs
const formData = ref<any>({
  tradingviewId: '',
  transactionId: '',
  paymentScreenshot: null,
});

// Handle file input
const handleFileUpload = (event: any) => {
  formData.value.paymentScreenshot = event.target.files[0]; // Store the uploaded file in formData
};

// Form validation
const isFormValid = computed<boolean>(() => {
  return (
    formData.value.transactionId.trim() !== '' &&
    formData.value.paymentScreenshot !== null
  );
});

// Submit form
const submitForm = async () => {
  if (isFormValid.value) {

    const submissionData = new FormData();

    submissionData.append('item_id', course.value.id);
    submissionData.append('type', 'course');
    // submissionData.append('tv_id', '');
    submissionData.append('transaction_id', formData.value.transactionId);
    submissionData.append('payment_proof', formData.value.paymentScreenshot);

    try {
      const response = await makeRequest('purchasedCourses', 'POST', submissionData);

    } catch (error) {
      // console.error('Error submitting form:', error);
    }

    // Reset form
    formData.value.tradingviewId = '';
    formData.value.transactionId = '';
    formData.value.paymentScreenshot = null;

    closeModel();
  } else {
    showToast("Please check the filled form!")
  }
};


const baseUrl = computed<string>(() => {
  if(config.env == "production") {
    const currentRootUrl = window.location.origin;
    return `${currentRootUrl}/digital`
  } else {
    return 'http://194.163.161.83:5002/digital'
  }
});

</script>

<template>
  <Modal1 size="lg" :show="showInvoiceModal" @close="closeModel">
    <template #header>
      <h1 class="font-semibold text-ellipsis max-w-[300px] md:max-w-[400px] text-center text-[23px]">{{ course.title }}</h1>
    </template>
    <template #body>
      <div class="flex flex-col items-start text-[14px] px-4 my-4">
        <p class="text-[15px]">Amount To Be Paid</p>
        <p class="w-full h-[33px] px-4 py-1.5 border border-primary bg-secondary rounded-md" >
            {{ course.price }}
        </p>
      </div>
     
      <div class="mt-2 px-4">
        <a v-if="course.payment_link" :href="course.payment_link" target="_blank" class="flex items-center cursor-pointer text-[16px] text-sky-600 underline">Payment Link
          <RightArrowIcon class="w-3 h-3 mt-0.5 mx-1" />
        </a>

        <img v-if="baseUrl" :src="`${baseUrl}/user/${course.payment_qr}`" alt="">
        <!-- <upiGenerator /> -->
      
        <!-- <div class="flex flex-col mt-2 text-[13px] my-1 space-y-1">
          <label class="text-[14px]" for="">Enter Tradingview User Id</label>
          <input v-model="formData.tradingviewId" type="text"  class="w-full px-4 py-1.5 border border-primary bg-secondary rounded-md"/>
        </div> -->

        <div class="flex flex-col mt-4 text-[13px] space-y-1">
          <label class="text-[14px]" for="">Enter Transaction Id</label>
          <input v-model="formData.transactionId" type="text"  class="w-full px-4 py-1.5 border border-primary bg-secondary rounded-md"/>
        </div>

        <div class="mt-4 text-[13px]">
          <p class="text-[14px]">Upload Payment Screenshot</p>
          <div class="relative mt-2">
            <input type="file" @change="handleFileUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div
              class="flex flex-col items-center justify-center w-full py-2 border-2 border-dashed border-primary border-opacity-45 rounded-lg"
            >
              <div class="flex flex-col items-center">
                <span class="text-[13px] text-gray-600">{{ formData.paymentScreenshot ? formData.paymentScreenshot.name : 'Upload here' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex w-full mt-3">
        <button
        type="submit"
          class="btn-submit w-full flex items-center justify-center"
          :disabled="!isFormValid"
          @click="submitForm"
        >
          Submit
        </button>
      </div>
    </template>
  </Modal1>
</template>

<style scoped></style>
