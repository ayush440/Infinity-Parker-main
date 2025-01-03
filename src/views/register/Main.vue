<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#1E1E1E] relative overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img src="/public/registerbg.jpg" alt="" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
    </div>

    <!-- Main Content -->
    <div class="w-full max-w-3xl mx-auto p-4 relative z-10">
      <!-- Form Container -->
      <div class="bg-[#1E1E1E] rounded-xl p-8 backdrop-blur-md bg-opacity-95 shadow-2xl">
        <!-- Logo -->
        <img src="/public/InfinityParker.png" alt="" class="mx-auto mb-8" />
        
        <h1 class="text-3xl font-bold text-white text-center mb-2">Create an account</h1>
        <p class="text-gray-400 max-w-md mx-auto text-center mb-8">
          Lorem ipsum dolor sit amet consectetur. Semper eget cursus aliquam enim nibh vel vestibulum
        </p>

        <!-- Error Message -->
        <div v-if="error" class="text-red-500 text-center mb-4">⚠️ {{ error }}</div>

        <!-- Registration Form -->
        <form v-if="!receivedOtp" @submit.prevent="signUp" class="space-y-6">
          <!-- Full Name -->
          <div class="space-y-2 mx-20 ">
            <label class="block text-white">Full name</label>
            <input
              v-model="validateSignUp.name.$model"
              type="text"
              class="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#8B5CF6]"
              placeholder="Enter your full name"
            />
          </div>

          <!-- Email -->
          <div class="space-y-2 mx-20">
            <label class="block text-white">Email</label>
            <input
              v-model="validateSignUp.email.$model"
              type="email"
              class="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#8B5CF6]"
              placeholder="Enter your email"
            />
          </div>

          <!-- Number -->
          <div class="space-y-2 mx-20">
            <label class="block text-white">Number</label>
            <input
              v-model="validateSignUp.mobile.$model"
              type="text"
              @input="signUpData.mobile = signUpData.mobile.replace(/[^0-9]/g, '')"
              class="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#8B5CF6]"
              placeholder="Enter your mobile number"
            />
          </div>

          <!-- Password -->
          <div class="space-y-2 mx-20">
            <label class="block text-white">Password</label>
            <div class="relative">
              <input
                v-model="validateSignUp.password.$model"
                :type="passwordFields.password ? 'text' : 'password'"
                class="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#8B5CF6]"
                placeholder="Create a password"
              />
              <button 
                type="button"
                @click="togglePasswordVisibility('password')"
                class="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <EyeOffIcon v-if="passwordFields.password" class="w-5 h-5 text-gray-500" />
                <EyeIcon v-else class="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="space-y-2 mx-20">
            <label class="block text-white">Confirm password</label>
            <div class="relative">
              <input
                v-model="validateSignUp.confirm_password.$model"
                :type="passwordFields.confirm_password ? 'text' : 'password'"
                class="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#8B5CF6]"
                placeholder="Confirm your password"
              />
              <button 
                type="button"
                @click="togglePasswordVisibility('confirm_password')"
                class="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <EyeOffIcon v-if="passwordFields.confirm_password" class="w-5 h-5 text-gray-500" />
                <EyeIcon v-else class="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <span v-if="signUpData.confirm_password.length > 3 && !characterMatch" class="text-red-500 text-sm">
              Password not matching
            </span>
          </div>

          <!-- Terms & Conditions -->
          <div class="flex items-center gap-2 mx-20">
            <CheckBox 
              v-model="checkbox" 
              name="T&C" 
              id="T&C"
              class="rounded border-gray-400 text-[#8B5CF6] focus:ring-[#8B5CF6]"
            />
            <label class="text-gray-400 text-sm">
              I agree...
              <a :href="tncUrl" target="_blank" class="text-white hover:underline">T&C</a>
              and
              <a :href="privacyPolicyUrl" target="_blank" class="text-white hover:underline">Privacy policy</a>
            </label>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center items-center mx-20">
            <button
            type="submit"
            :disabled="!checkbox || !characterMatch"
            class="w-full py-3 rounded-lg bg-[#8B5CF6] text-white font-medium transition-opacity"
            :class="(!checkbox || !characterMatch) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'"
          >
            Sign up
          </button>
</div>

         

          <!-- Login Link -->
          <div class="text-center text-gray-400">
            Already have an account?
            <button 
              @click="handleToggle"
              class="text-white hover:underline bg-transparent border-none p-0 ml-1 cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>

        <!-- OTP Verification Form -->
        <form v-else @submit.prevent="verifyOtp" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-white">Enter OTP</label>
            <input
              type="text"
              v-model.trim="otpData.otp"
              @input="otpData.otp = otpData.otp.replace(/[^0-9]/g, '')"
              class="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#8B5CF6]"
              placeholder="Enter the OTP sent to your email"
              maxlength="6"
            />
          </div>

          <button
            type="submit"
            :disabled="!otpData.otp || otpData.otp.length < 5"
            class="w-full py-3 rounded-lg bg-[#8B5CF6] text-white font-medium transition-opacity"
            :class="(!otpData.otp || otpData.otp.length < 5) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'"
          >
            Verify OTP
          </button>

          <button
            @click="receivedOtp = false"
            type="button"
            class="w-full py-3 rounded-lg bg-gray-200 text-gray-900 font-medium hover:bg-gray-300"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watchEffect, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { makeRequest, showToast, state } from '@/request/request'
import { setToken } from '@/utils/auth'
import logoComp from '../login/logoComp.vue'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import CheckBox from '@/components/checkBox.vue'

const router = useRouter()

const error = ref("")
const checkbox = ref(false)
const otpSent = ref(false)

const receivedOtp = ref(false)

// confirm_password:"sandeep"
// email:"admin323325@gmail.com"
// isAgree:true
// mobile:"9916290333"
// mobile_prefix:"+91"
// name:"kuldeep3432"
// password:"sandeep"

const signUpData = reactive({
  name: '',
  email: '',
  mobile_prefix: '+91',
  mobile: '',
  password: '',
  confirm_password: '',
  isAgree: false,
})

const rules = {
  name: { required },
  email: { required, email },
  mobile: { required },
  mobile_prefix: {  },
  password: { required, minLength: minLength(6) },
  confirm_password: { required, minLength: minLength(6) },
  isAgree: { required },
}

const validateSignUp = useVuelidate(rules, signUpData)

watchEffect (() => {
  if(signUpData.password && signUpData.confirm_password && signUpData.confirm_password.length ) {
    
  }
})

const passwordFields = reactive<any>({
  password: false,
})

const handleToggle = () => {
  router.push({ name: 'login' })
}

const togglePasswordVisibility = (field: string) => {
  passwordFields[field] = !passwordFields[field]
}

const otpData =  ref({
  email : '',
  otp : '',
})

const idForOtpVerify = ref<number>(0)

const signUp = async () => {
  const isFormCorrect = await validateSignUp.value.$validate()
  if (!isFormCorrect) return

  try {
    signUpData.isAgree = checkbox.value
    const response = await makeRequest('register', 'POST', signUpData)
    if (response) {
        otpData.value.email = signUpData.email
        idForOtpVerify.value = response.data
        error.value = ""
        receivedOtp.value = true
    } else {
      error.value = state["register"].error.data.message
    }

    // if (response && response.data && response.data.access_token) {
    //   setToken(response.data.access_token)
    //   showToast("Registration successful", "success")
    //   router.push({ name: 'login' })
    // } else {
    //   error.value = "Invalid response from server"
    // }
  } catch (err: any) {
    error.value = err.message || "An error occurred during registration"
  }
}

const verifyOtp = async () => {
  try {
      const response = await makeRequest('verifyOTP', 'PUT', otpData.value, {}, {}, 0, idForOtpVerify.value)
      if (response) {
        error.value = ""
        router.push({ name: 'login' })
      } else {
        error.value = state["verifyOTP"].error.data.message
      }
  } catch (err: any) {
      error.value = state["verifyOTP"].error.message || err.message
  }
}

onBeforeMount(() => {
  const url = window.location.href
  // Add any necessary initialization logic here
  parsedUrl.value = new URL(url)
  extractDomain()
})

const parsedUrl = ref<URL | null>(null)
const extractedDomainName = ref('')

function extractDomain() {
  if (!parsedUrl.value) return

  const hostname = parsedUrl.value.hostname
  const domain = hostname.replace(/^www\./i, '')

  extractedDomainName.value = domain.split('.').slice(0, 2).join('_')

  tncUrl.value = `/images/tnc/${extractedDomainName.value}_tnc.html`
  privacyPolicyUrl.value = `/images/privacy_policy/${extractedDomainName.value}_privacy_policy.html`

  checkUrl(tncUrl.value, "tnc")
  checkUrl(privacyPolicyUrl.value, "privacy_policy")
}

const tncUrl = ref('')
const privacyPolicyUrl = ref('')

async function checkUrl(url: string, name: string) {
  try {
    const response = await fetch(url, { method: 'HEAD' })

    const contentType = response.headers.get("Content-Type")
    const contentLength = response.headers.get("Content-Length")
    
    if (contentType !== 'text/html' || !contentLength || parseInt(contentLength, 10) < 100) {
      if (name === "tnc") {
        tncUrl.value = '../../tnc.html'
      } else if (name === "privacy_policy") {
        privacyPolicyUrl.value = '../../privacy_policy.html'
      }
    }
  } catch (error) {
    if (name === "tnc") {
      tncUrl.value = '../../tnc.html'
    } else if (name === "privacy_policy") {
      privacyPolicyUrl.value = '../../privacy_policy.html'
    }
  }
}

const characterMatch = computed(() => {
  if(signUpData.password && signUpData.confirm_password && signUpData.confirm_password.length > 3 ) {
    const password = signUpData.password;
    const confirmPassword = signUpData.confirm_password;

    return confirmPassword.split("").every((char, index) => char === password[index]);
  } 

  return false
  
});
</script>

<style scoped>
.submit-btn button {
  backdrop-filter: none !important;
  background-image: none !important;
}

.input-box label {
  @apply text-black font-normal;
}

.input-box input {
  @apply w-full px-2 py-1 bg-white box-border border border-gray-50 rounded focus:outline-1 focus:outline-gray-200;
}

.dark .input-box label {
  @apply text-tableText;
}

.animated-background {
  width: 50vw;
  height: calc(100vh - 50px);
  background: url('@/assets/img/loginBg.svg') no-repeat center center;
  background-size: cover; 
  animation: backgroundAnimation 10s infinite alternate;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

@keyframes backgroundAnimation {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

.text-color {
  @apply text-black dark:text-white;
}

@media screen and (max-width: 1020px) {
  /* .login-page {
    background: url('@/assets/img/bg.webp') no-repeat center center;
    background-size: cover;
  } */
}
</style>

