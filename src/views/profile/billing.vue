<template>
  <div class="bg-[#2a2a2c] rounded-lg p-6 mt-5">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl text-white font-medium">Billing info</h2>
      <button @click="showEdit" class="">
        <img src="/public/edit.svg" alt="Edit">
      </button>
    </div>

    <div class="space-y-6">
      <div class="bg-[#2C2C30] rounded-lg p-6">
        <div class="flex justify-start mb-6">
          <div class="w-32 h-32">
            <img 
              src="/public/qrcode.png" 
              alt="QR Code"
              class="w-full h-full"
            />
          </div>
        </div>

        <form @submit.prevent="save(invoice.id)" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">
              Select plan
              
            </label>
            <input
                type="text"
                readonly
                :value="selectedPlanData.name"
                class="w-full bg-[#1C1C1F] border border-[#3C3C40] rounded-lg px-4 py-2.5 text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">
              Promo code
            </label>
            <input
            v-model.trim="invoiceFormData.promo_code"
              type="text"
              class="w-full bg-[#1C1C1F] border border-[#3C3C40] rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              placeholder="Enter promo code"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-200 mb-2">
              Add payment proof
            </label>
            <input
            @change="handleInvoiceFileChange"
              type="file"
              accept="image/*"
              class="w-full bg-[#1C1C1F] border border-[#3C3C40] rounded-lg px-4 py-2.5 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#7C3AED] file:text-white hover:file:bg-[#6D28D9]"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-2">
                Total amount
              </label>
              <input
                type="text"
                readonly
                :value="calculatedTotalAmount"
                class="w-full bg-[#1C1C1F] border border-[#3C3C40] rounded-lg px-4 py-2.5 text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-2">
                Discount
              </label>
              <input
                type="text"
                readonly
                :value="invoiceFormData.discount_amount"
                class="w-full bg-[#1C1C1F] border border-[#3C3C40] rounded-lg px-4 py-2.5 text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-2">
                Payable amount
              </label>
              <input
                type="text"
                readonly
                :value="invoiceFormData.payable_amount"
                class="w-full bg-[#1C1C1F] border border-[#3C3C40] rounded-lg px-4 py-2.5 text-white"
              />
            </div>
          </div>

          <div v-if="showSubmitButton" class="col-span-3 flex justify-end gap-4">
            <button
              type="button"
              @click="closeModel"
              class="px-6 py-2 rounded-lg border border-[#3C3C40] text-white hover:bg-[#2C2C30]"
            >
              Cancel
            </button>
            <button
              type="submit" @click="submitForm"
              class="px-6 py-2 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
            >
              Update
            </button>
          </div>
        </form>
      </div>

      <div class="space-y-4">
        <h3 class="text-lg font-medium text-white">Recent Invoices</h3>
        <div v-if="invoices.length > 0" class="space-y-4">
          <div 
            v-for="invoice in invoices as Invoice[]" 
            :key="invoice.id"
            class="flex items-center justify-between p-4 bg-[#2C2C30] rounded-lg"
          >
            <div class="flex items-center gap-4">
              <FilesIcon class="w-6 h-6 text-gray-400" />
              <div>
                <p class="text-white">Due Date: {{ formatDate(invoice.due_date) }}</p>
                <p class="text-gray-400">Status: {{ invoice.payment_status }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <button
                @click="showInvoice(invoice)"
                class="text-gray-400 hover:text-white"
              >
                <EyeIcon class="w-5 h-5" />
              </button>
              <button
                @click="showPaymentProof(invoice)"
                class="flex items-center gap-2 text-[#7C3AED] hover:text-[#6D28D9]"
              >
                <UploadIcon class="w-5 h-5" />
                <span>Add Payment Proof</span>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 py-8">
          No invoices found
        </div>
      </div>
    </div>

    <!-- <createInvoiceModal /> -->
    <!-- <invoiceReceiptModal /> -->
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect, onBeforeUnmount } from "vue";
import { useInvoicesStore } from "@/stores/matrix/invoice";
import { useInvoiceConfigrationStore } from '@/stores/matrix/invoiceConfigration';
import { useStrategiesStore } from "@/stores/matrix/strategy";
import { storeToRefs } from "pinia";


import { makeRequest, showToast } from "@/request/request"; // Import your makeRequest function

const invoiceStore = useInvoicesStore();
const invoiceConfigrationStore = useInvoiceConfigrationStore();

const { invoiceConfigrations } = storeToRefs(invoiceConfigrationStore);
const { showAddEditModal, addEditInvoiceData } = storeToRefs(invoiceStore);


const strategiesStore = useStrategiesStore();

const { plans } = storeToRefs(strategiesStore);

const { invoices, selectedPlanData } = storeToRefs(invoiceStore);

const showSubmitButton = ref(false);


const dropdownOptions = computed<any>(() => {
    let temp = strategiesStore.plans || []
    if (temp.length > 0) {
        return temp.map((plan: any) => {
            return {
                id: plan.id,
                label: `${plan.name}`,
            };
        });
    }
    return []
})

const formatDate = (date: string) => {
  return date.replace('T', ' ').replace('Z', '')
}

function closeModel() {
    showAddEditModal.value = false;
    selectedPlanData.value = {}
    showSubmitButton.value = false
}

const submitForm = async () => {

}

onBeforeUnmount(() => {
  closeModel()
})

let promoError = ref("");


let discount_percent = ref(0);


let invoiceFormData = reactive<any>({
    plan_id: 0,
    plan_name: "",
    promo_code: "",
    offer_id: "",
    image: null,
    items: [],
    payable_amount: 0,
    discount_amount: 0,
    total_amount: 0
});



const invoice = computed<any>(() => {
    const invoice = addEditInvoiceData.value
    return invoice
})

watchEffect(() => {
  if(selectedPlanData.value && Object.keys(selectedPlanData.value).length > 0) {
    invoiceFormData.plan_id = selectedPlanData.value.id
    showSubmitButton.value = true
  }
  
})
let offerType = ref("");


const getOfferByPromo = async () => {
    promoError.value = "";

    let offers = await makeRequest("getOfferByPromo", "POST", { "plan_id": Number(invoiceFormData.plan_id), "offer_uuid": invoiceFormData.promo_code }, {}, {}, 0);


    if (!offers) {
        promoError.value = "Invalid Promo Code!";
    } else {
        offerType.value = offers.data.offer_type;

        discount_percent.value = offers.data.offer.discount_percent;
        invoiceFormData.discount_amount = offers.data.offer.discount_amount;
        invoiceFormData.offer_id = offers.data.offer.id;
    }
}



const calculatedTotalAmount = computed(() => {

  const selectedPlan = plans.value.find((plan: any) => plan.id === Number(invoiceFormData.plan_id)) || {};

    if (selectedPlan.invoice_item) {
        // Extract invoice_item IDs from the selected plan
        let invoiceItemIds = selectedPlan.invoice_item.map((item: any) => item.id);

        // Convert the IDs to strings if needed
        invoiceFormData.items = invoiceItemIds

        // Calculate the total amount by summing up all invoice_item amounts
        const totalAmount = selectedPlan.invoice_item.reduce((sum: number, item: any) => sum + item.amount, 0);

        invoiceFormData.total_amount = totalAmount


        if (invoiceFormData.discount_amount > 0) {
            invoiceFormData.payable_amount = totalAmount - invoiceFormData.discount_amount;
            return totalAmount
        } else if (discount_percent.value > 0) {
            invoiceFormData.discount_amount = (discount_percent.value / 100) * totalAmount;
            invoiceFormData.payable_amount = totalAmount - invoiceFormData.discount_amount
            return totalAmount
        } else {
            invoiceFormData.payable_amount = totalAmount;
            invoiceFormData.discount_amount = 0
            return totalAmount
        }



    } else {
        resetInvoiceFormData()
        return 0;
    }

});





const initialInvoiceFormData: any = {
    plan_id: 0,
    plan_name: "",
    promo_code: "",
    offer_id: "",
    image: null,
    items: [],
    payable_amount: 0,
    discount_amount: 0,
    total_amount: 0
};

// Create a function to reset the form data
function resetInvoiceFormData() {
    for (const key in initialInvoiceFormData) {
        invoiceFormData[key] = initialInvoiceFormData[key];

    }
}


const handleInvoiceFileChange = (event: any) => {
    const file = event.target.files[0];
    invoiceFormData.image = file;
};


const save = async (id: number) => {

    if(invoiceFormData.items.length == 0){
        showToast('Selected Plan does not have any invoice items', 'warning')
        return
    }


    const formData = new FormData();
    let offerId = invoiceFormData.offer_id ? invoiceFormData.offer_id : 0

    formData.append('total_amount', invoiceFormData.total_amount);
    formData.append('items', invoiceFormData.items.join(','));
    formData.append('offer_type', offerType.value);
    formData.append('offer_discount', invoiceFormData.discount_amount);
    formData.append('payable_amount', invoiceFormData.payable_amount);
    formData.append('image', invoiceFormData.image);
    formData.append('offer_id', offerId);
    formData.append('plan_id', invoiceFormData.plan_id);




    try {
        if (id > 0) {
            await makeRequest("invoices", "PUT", formData, {}, {}, 0, id);
        } else {
            await makeRequest("invoices", "POST", formData, {}, {}, 0);
        }

        resetInvoiceFormData();
        invoiceFormData.plan_id = 0
        invoiceFormData.image = null
        closeModel();
    } catch (error) {
    }
};

const showEdit = () => {
  showAddEditModal.value = true;
  showSubmitButton.value = true;
}

// Add near other interfaces
interface Invoice {
  id: number;
  due_date: string;
  payment_status: string;
}

const showInvoice = (invoice: Invoice) => {
  // Implement invoice viewing logic
}

const showPaymentProof = (invoice: Invoice) => {
  // Implement payment proof logic
}

</script>
