<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#1E1E1E] relative overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img src="/public/background.jpg" alt="" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
    </div>

    <!-- Main Content -->
    <div class="w-full max-w-2xl mx-auto p-4 relative z-10">
      <!-- Logo -->
   

      <!-- Login Form -->
      <div class="bg-[#1E1E1E] rounded-xl p-8 backdrop-blur-md bg-opacity-95 shadow-2xl">
        <img src="/public/InfinityParker.png" alt="" class=" mx-auto mb-8" />
        <h1 class="text-3xl font-bold text-white text-center mb-2">Log in</h1>
        <p class="text-gray-400 max-w-md mx-auto text-center mb-8">Lorem ipsum dolor sit amet consectetur. Semper eget cursus aliquam enim nibh vel vestibulum</p>

        <form @submit.prevent="login" class="space-y-6">
          <!-- Error Message -->
          <div v-if="error" class="text-red-500 text-center mb-4">⚠️ {{ error }}</div>

          <!-- Email Field -->
          <div class="space-y-2 mx-16">
            <label for="email" class="block text-white">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              v-model.trim="validateSignin.email.$model"
              class="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#8B5CF6]"
              :class="{ 'bg-red-50': validateSignin.email.$error }"
            />
            <div v-if="validateSignin.email.$errors" class="text-red-500 text-sm">
              <div v-for="error of validateSignin.email.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-2 mx-16">
            <label for="password" class="block text-white">Password</label>
            <div class="relative">
              <input
                id="password"
                name="password"
                v-model.trim="validateSignin.password.$model"
                :type="passwordFields.password ? 'text' : 'password'"
                class="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#8B5CF6]"
                :class="{ 'bg-red-50': validateSignin.password.$error }"
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
            <div v-if="validateSignin.password.$errors" class="text-red-500 text-sm">
              <div v-for="error of validateSignin.password.$errors" :key="error.$uid">
                {{ error.$message }}
              </div>
            </div>
          </div>

          <!-- Terms & Conditions -->
          <div class="flex items-center gap-2 mx-16">
            <CheckBox 
              v-model="checkbox" 
              name="T&C" 
              id="T&C"
              class="rounded border-gray-400 text-[#8B5CF6] focus:ring-[#8B5CF6]"
            />
            <label for="T&C" class="text-gray-400 text-sm">
              I agree...
              <a :href="tncUrl" target="_blank" class="text-white hover:underline">T&C</a>
              and
              <a :href="privacyPolicyUrl" target="_blank" class="text-white hover:underline">Privacy policy</a>
            </label>
          </div>

          <!-- Login Button -->
          <div class="flex justify-center items-center mx-16">
  <button
    type="submit"
    :disabled="!checkbox"
    class="py-3 rounded-lg bg-[#8B5CF6] text-white font-medium transition-opacity w-full"
    :class="!checkbox ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'"
  >
    Log in
  </button>
</div>


          <!-- Sign Up Link -->
          <div class="text-center text-gray-400">
  Don't have an account?
  <button 
    @click="handleToggle"
    class="text-white hover:underline bg-transparent border-none p-0 ml-1 cursor-pointer"
  >
    Sign up
  </button>
</div>
          <!-- Forgot Password Link -->
          <div class="text-center">
            <a 
              href="javascript:;" 
              @click="handleForgotPassword" 
              class="text-[#8B5CF6] hover:underline text-sm"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="forgotPassword" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-[#1E1E1E] rounded-xl p-8 w-full max-w-md">
        <div v-if="!forOtpVerify">
          <h2 class="text-2xl font-bold text-white text-center mb-4">Forgot Password</h2>
          <p class="text-gray-400 text-center mb-6">Enter your email to receive an OTP</p>
          
          <form @submit.prevent="requestOtp" class="space-y-6">
            <div class="space-y-2">
              <label class="block text-white">Email</label>
              <input
                type="email"
                v-model.trim="forgotPasswordEmail"
                class="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#8B5CF6]"
              />
            </div>

            <div class="flex justify-end">
              <button 
                type="button"
                @click="handleBackToLogin" 
                class="text-[#8B5CF6] hover:underline"
              >
                Back to Login
              </button>
            </div>

            <button
              type="submit"
              class="w-full py-3 rounded-lg bg-[#8B5CF6] text-white font-medium hover:opacity-90"
            >
              Submit
            </button>
          </form>
        </div>

        <div v-else>
          <h2 class="text-2xl font-bold text-white text-center mb-4">Verify OTP</h2>
          <p class="text-gray-400 text-center mb-6">Please enter the OTP sent to your email</p>

          <form @submit.prevent="verifyOtp" class="space-y-6">
            <div class="space-y-2">
              <label class="block text-white">OTP</label>
              <input
                type="text"
                v-model.trim="otpData.otp"
                @input="otpData.otp = otpData.otp.replace(/[^0-9]/g, '')"
                class="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#8B5CF6]"
                maxlength="6"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-white">New Password</label>
              <div class="relative">
                <input
                  :type="viewPassword ? 'text' : 'password'"
                  v-model.trim="otpData.password"
                  class="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#8B5CF6]"
                />
                <button 
                  type="button"
                  @click="viewPassword = !viewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <EyeOffIcon v-if="viewPassword" class="w-5 h-5 text-gray-500" />
                  <EyeIcon v-else class="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              :disabled="!(otpData.otp && otpData.password)"
              class="w-full py-3 rounded-lg bg-[#8B5CF6] text-white font-medium transition-opacity"
              :class="!(otpData.otp && otpData.password) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { makeRequest, setToken, setisAuthenticated, showToast, state } from '@/request/request'
import logoComp from './logoComp.vue'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import CheckBox from '@/components/checkBox.vue'

const router = useRouter()

const error = ref("")
const checkbox = ref(false)
const forgotPassword = ref(false)
const forOtpVerify = ref(false)
const forgotPasswordEmail = ref("")
const otpData = ref<any>({
  email: "",
  otp: "",
  password: "",
})

const viewPassword = ref(false)

const tncUrl = ref('')
const privacyPolicyUrl = ref('')

const signinData = reactive({
  email: '',
  password: '',
})

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(6) },
}

const validateSignin = useVuelidate(rules, signinData)

const passwordFields = reactive<any>({
  password: false,
})

const handleToggle = () => {
  router.push({ name: 'register' })
}

const handleForgotPassword = () => {
  forgotPassword.value = true
  error.value = ""
}

const handleBackToLogin = () => {
  forgotPassword.value = false
  error.value = ""
}

const togglePasswordVisibility = (field: string) => {
  passwordFields[field] = !passwordFields[field]
}

const login = async () => {
  const isFormCorrect = await validateSignin.value.$validate()
  if (!isFormCorrect) return

  try {
    const response = await makeRequest('login', 'POST', signinData)
    if (response && response.data && response.data.access_token) {
      let token = response.data.access_token
      localStorage.setItem("token", token);
      setToken(token)
      setisAuthenticated(true,response.data.role_name);
      localStorage.setItem("role", response.data.role_name);
      localStorage.setItem("refresh", 'true')
      router.push({ name: 'dashboard' })
    } else {
      error.value = "Invalid response from server"
    }
  } catch (err: any) {
    error.value = err.message || "An error occurred during login"
  }
}

const requestOtp = async () => {
  try {
    const response = await makeRequest('sendForgotOTP', 'POST', { email: forgotPasswordEmail.value })
    if (response) {
      error.value = ""
      forOtpVerify.value = true
    } else {
      error.value = "Failed to send OTP"
    }
  } catch (err: any) {
    error.value = err.message || "An error occurred while sending OTP"
  } finally {
    otpData.value.email = forgotPasswordEmail.value
  }
}


const verifyOtp = async () => {
    try {
          const response = await makeRequest('forgot', 'PUT', otpData.value, {}, {},0) 

          if(response) {
            error.value = "";
            forOtpVerify.value = false
            forgotPassword.value = false
            otpData.value = {}
            router.push({ name: 'login' })
            showToast("Password changed successfully", "success")
          } else {
            error.value = state["forgot"].error.data.message;
          }
    } catch (error: any) {
      error.value = state["forgot"].error.message;
      if (error.value) {
        error.value = state["forgot"].error.data.message;
      }
    }
}

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

onBeforeMount(() => {
  const url = window.location.href
  parsedUrl.value = new URL(url)
  extractDomain()
})
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
    background: url('@/assets/img/loginBg.svg') no-repeat center center;
    background-size: cover;
  } */
}
</style>

