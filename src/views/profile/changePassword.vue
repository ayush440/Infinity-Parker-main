<template>
  <div class="bg-[#2a2a2c] rounded-lg mt-6 p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl text-white font-medium">Change password</h2>
    </div>

    <form @submit.prevent="submitChangePassword" class="grid grid-col gap-2 ">
      <div >
        <label for="current_password" class="block text-sm font-medium text-gray-200 mb-2">
          Current password
        </label>
        <div class="relative">
          <input
            :type="passwordFields.showCurrentPassword ? 'text' : 'password'"
            id="current_password"
            v-model.trim="validate.current_password.$model"
            :class="{ 'border-red-500': validate.current_password.$error }"
            class="w-full bg-[#2C2C30] border border-[#3C3C40] rounded-lg pl-4 pr-12 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            placeholder="Enter current password"
            autocomplete="off"
          />
          <button 
            type="button"
            @click="togglePasswordVisibility('showCurrentPassword')"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <EyeIcon v-if="!passwordFields.showCurrentPassword" class="w-5 h-5" />
            <EyeOffIcon v-else class="w-5 h-5" />
          </button>
        </div>
        <div v-if="validate.current_password.$error" class="mt-2 text-red-500 text-sm">
          {{ validate.current_password.$errors[0]?.$message }}
        </div>
      </div>

      <div>
        <label for="new_password" class="block text-sm font-medium text-gray-200 mb-2">
          New password
        </label>
        <div class="relative">
          <input
            :type="passwordFields.showNewPassword ? 'text' : 'password'"
            id="new_password"
            v-model.trim="validate.new_password.$model"
            :class="{ 'border-red-500': validate.new_password.$error }"
            class="w-full bg-[#2C2C30] border border-[#3C3C40] rounded-lg pl-4 pr-12 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            placeholder="Enter new password"
            autocomplete="off"
          />
          <button 
            type="button"
            @click="togglePasswordVisibility('showNewPassword')"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <EyeIcon v-if="!passwordFields.showNewPassword" class="w-5 h-5" />
            <EyeOffIcon v-else class="w-5 h-5" />
          </button>
        </div>
        <div v-if="validate.new_password.$error" class="mt-2 text-red-500 text-sm">
          {{ validate.new_password.$errors[0]?.$message }}
        </div>
      </div>

      <div>
        <label for="confirm_password" class="block text-sm font-medium text-gray-200 mb-2">
          Confirm password
        </label>
        <div class="relative">
          <input
            :type="passwordFields.showConfirmPassword ? 'text' : 'password'"
            id="confirm_password"
            v-model.trim="validate.confirm_password.$model"
            :class="{ 'border-red-500': validate.confirm_password.$error }"
            class="w-full bg-[#2C2C30] border border-[#3C3C40] rounded-lg pl-4 pr-12 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            placeholder="Confirm password"
            autocomplete="off"
          />
          <button 
            type="button"
            @click="togglePasswordVisibility('showConfirmPassword')"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <EyeIcon v-if="!passwordFields.showConfirmPassword" class="w-5 h-5" />
            <EyeOffIcon v-else class="w-5 h-5" />
          </button>
        </div>
        <div v-if="validate.confirm_password.$error" class="mt-2 text-red-500 text-sm">
          Password and Confirm Password should match
        </div>
      </div>

      <div class="col-span-3 flex justify-end gap-4">
        <button
          type="button"
          @click="resetForm"
          class="px-6 py-2 rounded-lg border border-[#3C3C40] text-white hover:bg-[#2C2C30]"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-6 py-2 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
        >
          Update
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
import { required, minLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { makeRequest, showToast } from '@/request/request'

const passwordFields = reactive({
  showCurrentPassword: false,
  showNewPassword: false,
  showConfirmPassword: false
})

const changePassData = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const rules = {
  current_password: { required },
  new_password: {
    required,
    minLength: minLength(6)
  },
  confirm_password: {
    required,
    sameAsPassword: (value: string) => value === changePassData.new_password
  }
}

const validate = useVuelidate(rules, changePassData)

const togglePasswordVisibility = (field: keyof typeof passwordFields) => {
  passwordFields[field] = !passwordFields[field]
}

const resetForm = () => {
  changePassData.current_password = ''
  changePassData.new_password = ''
  changePassData.confirm_password = ''
  validate.value.$reset()
}

const submitChangePassword = async () => {
  try {
    validate.value.$touch()
    if (validate.value.$invalid) {
      showToast('Please check the filled form!')
      return
    }

    await makeRequest('changePassword', 'PUT', changePassData)
    resetForm()
    showToast('Password updated successfully!', 'success')
  } catch (error) {
    console.error('Error changing password:', error)
    showToast('Failed to update password', 'error')
  }
}
</script>