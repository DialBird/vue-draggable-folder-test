<script lang="ts" setup>
import {subscribeSortModels} from "@/infra/firestore/sortModel";
import {useSortModelStore} from "@/stores/sortModelStore";
import FormPopover from '@/views/FormPopover.vue'
import {Popover, PopoverButton, PopoverPanel} from '@headlessui/vue'
import {storeToRefs} from "pinia";

subscribeSortModels((models) => {
  sortModelStore.setSortModels(models)
})

const sortModelStore = useSortModelStore()
const {sortModels} = storeToRefs(sortModelStore)
</script>

<template>
  <main class="pt-20 w-full">
    <div class="w-[500px] h-[600px] mx-auto rounded shadow-lg p-8">
      <div>
        <h1 class="text-3xl font-bold">
          List
        </h1>
        <ul>
          <li v-for="s in sortModels" :key="s.uid" class="border p-2 rounded-sm">
            <p>{{ s.name }}</p>
          </li>
          <li class="hover:bg-gray-100 transition relative">
            <Popover v-slot="{ close }">
              <PopoverButton class="w-full p-2 text-left">+ Add</PopoverButton>
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-out"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <PopoverPanel class="absolute bg-white w-[200px] rounded shadow-md p-2">
                  <FormPopover @submit-and-close="close()" />
                </PopoverPanel>
              </transition>
            </Popover>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>
