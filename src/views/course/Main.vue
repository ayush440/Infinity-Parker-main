<template>
  <div class="w-full p-2 sm:mlp-4">
    <div class="flex justify-between items-center m-2">
        <div class="flex items-center">
            <div class="mx-2 text-lg text-[#333333] font-semibold rounded-lg">All Courses </div>
            <LoadingIcon v-if="!showUpdatingData" icon="puff" class="w-6 h-6 pl-1" />
        </div>

    </div>
    <div v-if="showTableData && courses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6 py-3 px-6">
      <div
        v-for="(course, index) in courses"
        :key="course.id"
        class="flex flex-col justify-between w-full bg-white shadow rounded p-4"
      >
        <div @click="openCourse(course)" class="w-full text-[#333333] cursor-pointer">
          <img v-if="Object.keys(thumbnailData).length && thumbnailData[course.id]"
            :src="thumbnailData[course.id]" 
            alt="Course Image" 
            class="w-full h-40 object-cover rounded"
          >
          <h2 class="text-lg font-semibold mt-2">{{ course.title }}</h2>
          <div class="w-full text-ellipsis line-clamp-2 text-sm mt-1">
            {{ course.description }}
            <!-- Other content such as completion, rating, etc. -->
          </div>
        </div>

        <div class="mt-2 flex justify-center items-center w-full">
          <button v-if="course?.purchaged" class="btn-enrolled">  
            Enrolled
          </button>

          <!-- subcribe this course -->
          <button v-else @click="showSubscriptionModal(course)" class="btn-submit flex items-center">  
            <CreditCardIcon class="w-4 h-4 mx-1" /> Enroll in Rs. {{ course.price }}
          </button>

          
        </div>
      </div>
    </div>

    <div v-else-if="!showTableData" class="flex items-center ml-8 mt-4" >
      <LoadingIcon icon="puff" class="w-8 h-8" />
    </div>

    <div v-else class="flex flex-col items-center mt-8" >
      <div class="text-center">Courses not found!!</div>
    </div>
  </div>

  <CourseInvoiceModal />

</template>


<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, computed, onMounted, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter
import { useCourseStore } from '@/stores/matrix/course';
import CourseInvoiceModal from './CourseInvoiceModal.vue';
import { showToast } from '@/request/request';

const router = useRouter();
const courseStore = useCourseStore();

const { courseData, thumbnailData, showCourseData , showInvoiceModal, selectedCourse } = storeToRefs(courseStore);
const { fetchChapters } = courseStore

const courses = computed<any>(() => {
  return courseStore.courses || [];
});

const showTableData = computed(() => {
  const state = courseStore.state['courses'];
  return state && state.loading === false;
})

const showUpdatingData = computed(() => {
    const state = courseStore.state['courses'];
    return state && state.updating === false;
});
    
const openCourse = (course: any = {}) => {
  if(course?.purchaged) {
    fetchChapters(course.id, false);
    courseData.value = course
    showCourseData.value = true
    router.push(`/course/${course.id}`); 
  } else {
    showToast('Please subscribe to access this course', 'warning')
  }
};

const showSubscriptionModal = (course: any) => {
  selectedCourse.value = course
  showInvoiceModal.value = true
}

</script>

<style scoped>
/* Custom styles if needed */
.btn-enrolled {
  @apply flex items-center text-sm m-1 max-h-[3rem] px-4 py-1 border rounded-lg bg-green-500 text-white hover:filter hover:brightness-90 focus:outline-none focus:border-gray-400 focus:ring focus:ring-gray-200;
  
}

.btn-submit {
  @apply flex items-center text-sm m-1 max-h-[3rem] px-4 py-1 border rounded-lg bg-primary text-white hover:filter hover:brightness-90 focus:outline-none focus:border-gray-400 focus:ring focus:ring-gray-200 
  
}
</style>
  