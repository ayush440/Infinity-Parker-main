<template>
    <div class="flex flex-col lg:flex-row xs:p-1">
      <!-- Sidebar for Chapters -->
      <aside
        class="lg:w-1/3 bg-white m-2 p-4 rounded-lg shadow-md overflow-y-auto max-h-screen lg:max-h-[calc(100vh-4rem)]"
      >
        <!-- abouut course  -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-1">
            <h2 class="text-xl  font-semibold">About the Course: </h2>
            <!-- back button  -->
            
            <router-link to ="/course"
              class="flex items-center text-sm text-indigo-600 bg-indigo-100 py-1 px-2 rounded-xl"
            >
              <RightArrowIcon class="w-4 h-3 mr-1 rotate-180" /> Back
            </router-link >



          </div>
          <h3 class="text-lg text-gray-600 font-medium">{{ course.title }}</h3>
          <p class="text-sm text-gray-600">
            {{ course.description }}
          </p>
        </div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Course Content</h2>
        
        </div>
        <div v-for="(chapter, index) in chapters" :key="index" class="mb-4">
          <!-- Chapter Section -->
          <div
            class="p-3 rounded cursor-pointer transition-all duration-200"
            :class="{
              'bg-blue-100 border-l-4 border-blue-500': selectedChapter === index,
              'bg-gray-100 hover:bg-gray-50': selectedChapter !== index
            }"
            @click="selectChapter(index,chapter)"
          >
            <h3 class="text-base font-medium">
              Chapter {{ index + 1 }}: {{ chapter.title }}
            </h3>            
          </div>
          <!-- Lessons for the Selected Chapter -->
          <ul
            v-if="selectedChapter === index"
            class="mt-2 ml-4 space-y-2 text-sm transition-all duration-300"
          >
            <li
              v-for="(lesson, lessonIndex) in chapter.lessons"
              :key="lessonIndex"
              class="flex items-center overflow-auto p-2 rounded hover:bg-blue-50 transition-all duration-200"
              :class="{
                'bg-blue-200 text-blue-800 font-semibold': currentLesson?.id === lesson.id,
                'text-gray-600': currentLesson?.id !== lesson.id,
              }"
              @click="playLesson(lesson)"
            >
                <div class="w-full">{{ lesson.title }}</div>
            </li>
          </ul>
        </div>
      </aside>
  
      <!-- Main Video Player Section -->
      <main class="flex-1 bg-white mt-2 p-6 rounded-lg shadow-md">
        <h1 class="text-xl font-bold">{{ currentChapter?.title }}</h1>
        <span v-if="Object.keys(currentChapter).length" class="text-sm font-normal text-gray-500 mb-6">Description: {{ currentChapter?.description }} </span>
        
  
        <!-- Video Player -->
        <div v-if="Object.keys(currentLesson).length" class="mb-6">
          <div class="flex items-center flex-wrap text-lg font-semibold mb-2">
            Now Playing: {{ currentLesson?.title }}
          </div>

          <p class="text-sm text-gray-500 mb-4">Lesson: {{ currentLesson?.description }}</p>
          <div class="relative w-full h-64 md:h-96 xl:h-[500px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              class="absolute top-0 left-0 w-full h-full"
              :src="`https://www.youtube.com/embed/${currentVideoId}`"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </div>
  
        <!-- Placeholder for No Video Selected -->
        <div v-else class="text-center mt-6">
          <div v-if="!currentChapter?.id">
            <h2 class="text-lg font-semibold">Welcome to the Course</h2>
            <p class=" text-gray-500 mt-1">{{ course.title }}</p>
          </div>
          <p class="text-center text-gray-400 italic mt-6">
            Select a chapter and lesson to start learning!
          </p>
        </div>
        
      </main>
    </div>


</template>
<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useCourseStore } from '@/stores/matrix/course';
  
  // Access the course store and route
  const courseStore = useCourseStore();

  const { courseData, showCourseData } = storeToRefs(courseStore);

  const { fetchChapters } = courseStore;
  const route = useRoute();
  
  // Reactive variables
  const selectedChapter = ref<number | null>(null);
  const currentLesson = ref<any>({})
  const currentChapter = ref<any>({})

  const chapters = computed<any>(() => {
    return courseStore.chapters || [];
  });

  onMounted(() => {
    if(!showCourseData.value) {
      const courseId = Number(route.params.id) || 0 as number;
      fetchChapters(courseId, false);
    }
  });
    
  // Store course data in a computed property
  const course = computed<any>(() => {
    if(Object.keys(courseData.value).length) {
      return courseData.value || {};
    } else if (chapters.value.length) {
      let courseId = chapters.value[0].course_id
      const course = courseStore.courses.find((course) => course.id === courseId) || {};
      return course;
    } else {
      return {};
    }
    
  });
  
  // Methods
  const selectChapter = (index: number,data: any={}) => {
    currentChapter.value = data
    selectedChapter.value = index;
    // fetchLessons(id);
  };

  const regExp = /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|[^/]+\/))([^&?/\s]{11})/;

  const currentVideoId = computed(() => {
    if(Object.keys(currentLesson.value).length) {
      let url = currentLesson.value.content_link || '';
      const match = url.match(regExp);
      return match ? match[1] : null;
    }
    return '';
  })

  
  const playLesson = ( data: any=0 ) => {
    currentLesson.value = data
  };

</script>
  