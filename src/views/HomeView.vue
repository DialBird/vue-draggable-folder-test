<script lang="ts" setup>
import {subscribeSortModels, updateSortModels} from "@/infra/firestore/sortModel";
import {useSortModelStore} from "@/stores/sortModelStore";
import FormPopover from '@/views/FormPopover.vue'
import {Popover, PopoverButton, PopoverPanel} from '@headlessui/vue'
import {storeToRefs} from "pinia";
import {defineComponent, ref} from "vue";
import draggable from 'vuedraggable'

subscribeSortModels((models) => {
  sortModelStore.setSortModels(models)
})

defineComponent({
  draggable,
})

const sortModelStore = useSortModelStore()
const {sortModels} = storeToRefs(sortModelStore)

const fromIdx = ref<number>()
const toIdx = ref<number>()

const onDragEnter = (e: DragEvent) => {
  const target = e.target as HTMLElement
  if (target.classList.contains('sort-item')) {
    target.classList.remove('dragover')
    target.classList.add('dragover')
    toIdx.value = Number(target.dataset.idx)
  }
}
const onDragLeave = (e: DragEvent) => {
  const target = e.target as HTMLElement
  if (target.classList.contains('sort-item')) {
    target.classList.remove('dragover')
  }
}
const onDragStart = (e: DragEvent) => {
  const target = e.target as HTMLElement
  fromIdx.value = Number(target.dataset.idx)
}
const onDragEnd = () => {
  const lst = document.querySelectorAll('.sort-item')
  for (var l of lst) {
    l.classList.remove('dragover')
  }
  if (fromIdx.value !== undefined && toIdx.value !== undefined) {
    const list = sortModels.value.slice()
    const len = list.length
    const moved = list[fromIdx.value]
    list.splice(fromIdx.value, 1)
    list.splice(toIdx.value, 0, moved)
    updateSortModels({list: list.map((sm, idx) => ({...sm, order: len - idx}))})
  }
  fromIdx.value = undefined
  toIdx.value = undefined
}
</script>

<template>
  <main class="pt-20 w-full">
    <div class="w-[500px] h-[600px] mx-auto rounded shadow-lg p-8">
      <div>
        <h1 class="text-3xl font-bold">
          List
        </h1>
        <ul>
          <li
            v-for="(sm, idx) in sortModels"
            :key="sm.uid"
            :data-idx="idx"
            class="sort-item border-b p-2 rounded-sm hover:bg-gray-100"
            draggable="true"
            @dragstart="onDragStart"
            @dragend.prevent="onDragEnd"
            @dragenter.prevent="onDragEnter"
            @dragleave.prevent="onDragLeave"
            @dragover.prevent
          >
            <p class="select-none pointer-events-none">{{ sm.name }}</p>
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
                  <FormPopover @submit-and-close="close()"/>
                </PopoverPanel>
              </transition>
            </Popover>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.sort-item {
  &.dragover {
    background: rgba(87, 195, 215, 0.2);
  }
}
</style>