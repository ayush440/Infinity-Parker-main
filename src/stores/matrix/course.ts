import { defineStore } from 'pinia';
import { state, makeRequest } from '@/request/request';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

// Define types for lesson, chapter, and course
interface Lesson {
  id?: number;
  title?: string;
  videoUrl?: string;
}

interface Chapter {
  id?: number;
  title?: string;
  lessons?: Lesson[];
}

// title: "",
//       description: "",
//       content_link: "",
//       chapters: [],
//       price: 0,
//       is_live: false,
//       content_image: null,
//       payment_qr: null,
//       payment_link: '',
//       validity: ''

interface Course {
  id?: string;
  title?: string;
  description?: string;
  content_link?: string;
  chapters?: Chapter[];
  price?: number;
  is_live?: boolean;
  content_image?: string;
  payment_qr?: string;
  payment_link?: string;
  validity?: string;
}

export const useCourseStore = defineStore('courseStore', () => {
  const route = useRoute();

  const courses = ref<Course[]>([]); // Reactive state for storing courses
  const courseData = ref<Course>({});
  const thumbnailData = ref<any>({});
  const showCourseData = ref<boolean>(false);
  const endpoint = 'courses'
  const chapters = ref<Chapter[]>([]);
  const chapterData = ref<Chapter>({});

  const lessons = ref([])

  const showInvoiceModal = ref(false)

  const selectedCourse = ref<any>({})

	const purchasedCourses = ref<any>([])

  // Fetch all courses
  const fetchCourses = async (refresh=false) => {
    if(refresh){
      state[endpoint]={ loading: true, data: null, error: {}, updating:false }
    }

    try {
      const response = await makeRequest(endpoint, 'GET', {}, {}, { } ) //await axios.get(baseUrl, { headers: { descriptionization: `${token}` } });
      if(response.data) {
        courses.value = response.data;
        updateThumbnail()
      }
      
    } catch (error) {
      console.error('Error fetching courses:', error);
    }

  };

  const getPurchasedCourses = async () => {
    try {
        const response = await makeRequest('purchasedCourses', 'GET', {}, {}, {}, 0)
        if (response.data){
          purchasedCourses.value = response.data || []
        } else {
            purchasedCourses.value = [];
        }
      } catch (error) {
        throw error
      }
	}


  const fetchChapters = async (idData: number = 0, auto=true) => {
    try {
      let id = idData
      if(auto) {
        const courseId = Number(route.params.id) || 0 as number;
        id = courseId
      } else {
        chapters.value = []
      }
      
      const response = await makeRequest('chapters', 'GET', {}, {}, { }, 0, id )
      if(response.data) {
        chapters.value = response.data;
      }
      
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } 
  };


  const updateThumbnail = () => {
    if(courses.value.length) {
      courses.value.forEach((course: any) => {
        const [id, link] = [course.id, course.content_link];
        const videoId = link.split("v=")[1]?.split("&")[0];
        if (videoId) {
          thumbnailData.value[id] = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      });
    }
  };

  fetchCourses()
	// getPurchasedCourses()
	

  return {
    state,
    courses,
    courseData,
    thumbnailData,
    showCourseData,

    chapters,
    chapterData,

    selectedCourse,

		purchasedCourses,

    lessons,
    showInvoiceModal,

    fetchCourses,
    fetchChapters,
		getPurchasedCourses
  };
});
