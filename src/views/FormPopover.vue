<script lang="ts" setup>
import {addSortModel} from "@/infra/firestore/sortModel";
import {ref} from "vue";

const emit = defineEmits(['submit-and-close'])

const inputName = ref('')
const onS = async () => {
  if (!inputName.value) return

  await addSortModel({name: inputName.value})
  emit('submit-and-close')
}

</script>

<template>
  <div class="flex flex-col gap-4">
    <input v-model="inputName" class="input input-bordered input-sm w-full"
           placeholder="name"
           type="text" @click.prevent.stop
           @keydown.stop
    />
    <button class="btn btn-sm" @click.stop="onS">
      Submit
    </button>
  </div>

</template>