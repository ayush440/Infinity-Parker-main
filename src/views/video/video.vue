<template>
  <div class="min-h-screen bg-[#2a2a2c]">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-gray-400 p-6">
      <a href="/" class="hover:text-white">Home</a>
      <span>›</span>
      <span>Tutorials</span>
    </div>

    <div>
      <h1 class="text-2xl text-white pl-6 mb-5">Tutorials</h1>
    </div>

    <!-- Search Bar -->
    <div class="px-6 py-4 bg-[#1d1d20] mx-5 rounded-t-lg">
      <div class="relative">
        <input 
          type="search" 
          placeholder="Search" 
          class="w-lg  bg-[#1d1d20] text-white border border-gray-600 rounded-lg  pl-10 pr-4 py-2 "
        />
        <svg 
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Video Grid -->
    <div class="px-6 py-4 bg-[#1d1d20] mx-5 rounded-b-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        <!-- Video Cards -->
        <div
          v-if="showTableData && videos.length > 0"
          v-for="(item, i) in videos"
          :key="i"
          class="bg-[#2C2C2E] rounded-lg overflow-hidden hover:transform hover:scale-[1.02] transition-transform duration-200"
        >
          <div class="relative aspect-video cursor-pointer group" @click="playVideo(item)">
            <videosList :videoId="item.url" />
           
          </div>
          
          <div class="p-4">
            <h3 
              class="text-white font-medium text-lg mb-2 line-clamp-2 cursor-pointer hover:text-[#8b7eff]"
              @click="playVideo(item)"
            >
              {{ item.title }}
            </h3>
            <p class="text-gray-400 text-sm mb-3 line-clamp-2">
              {{ item.description }}
            </p>
            
          </div>
        </div>

        <!-- Loading State -->
        <div 
          v-else-if="!showTableData"
          class="col-span-full flex justify-center items-center py-12"
        >
          <LoadingIcon icon="puff" class="w-8 h-8" />
        </div>

        <!-- Empty State -->
        <div 
          v-else 
          class="col-span-full text-center py-12 text-gray-400"
        >
          No videos found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useVideosStore } from '@/stores/matrix/video'
import videosList from './videosList.vue'

const videosStore = useVideosStore()

interface Video {
  id: number
  url: string
  title: string
  description: string
}

const videos = computed<Video[]>(() => {
  return videosStore.videos || []
})

const showTableData = computed<boolean>(() => {
  const state = videosStore.state[videosStore.endpoint]
  return state && state.loading === false
})

const playVideo = (video: Video) => {
  window.open(video.url, '_blank')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Add hover effects */
.group:hover .group-hover\:bg-black\/40 {
  background-color: rgba(0, 0, 0, 0.4);
}

.group:hover .group-hover\:bg-white\/50 {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>

