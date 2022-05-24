<script lang="ts" setup>
import { subscribeSortModels, updateSortModels } from '@/infra/firestore/sortModel'
import { useSortModelStore } from '@/stores/sortModelStore'
import FormPopover from '@/views/FormPopover.vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import {cloneDeep, groupBy} from "lodash";
import { storeToRefs } from 'pinia'
import { defineComponent, ref } from 'vue'
import draggable from 'vuedraggable'

subscribeSortModels((models) => {
  sortModelStore.setSortModels(models)
})

defineComponent({
  draggable,
})

const sortModelStore = useSortModelStore()
const { sortModelGroupNames, sortModels } = storeToRefs(sortModelStore)

const fromIdx = ref<number>()
const toIdx = ref<number>()

const onDragEnter = (e: DragEvent) => {
  const target = e.target as HTMLElement
  target.classList.remove('dragover')
  target.classList.add('dragover')
  toIdx.value = Number(target.dataset.idx)
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
  target.style.opacity = '0.1'
}
const onDragEnd = (e: DragEvent) => {
  const target = e.target as HTMLElement
  target.style.opacity = '1'
  const lst = document.querySelectorAll('.sort-item')
  for (var l of lst) {
    l.classList.remove('dragover')
  }
  fromIdx.value = undefined
  toIdx.value = undefined
}
const onDragEnterSpan = (e: DragEvent) => {
  const target = e.target as HTMLElement
  target.classList.remove('dragover')
  target.classList.add('dragover')
}
const onDragLeaveSpan = (e: DragEvent) => {
  const target = e.target as HTMLElement
  target.classList.remove('dragover')
}
const onDropList = (e: DragEvent) => {
  // グループを作成して
  const target = e.target as HTMLElement
  const toIdx = Number(target.dataset.idx)
  console.log('drop list')
}

const calcToIdx = (idx: number, groupName?: string) => {}
const onDropSpan = (e: DragEvent) => {
  const target = e.target as HTMLElement
  const toIdx = Number(target.dataset.idx)
  const toGroupName = target.dataset.groupName

  // グループが作られたら、一番上に移動しつつ、
  if (fromIdx.value !== undefined && !isNaN(toIdx)) {
    const groups = cloneDeep(groupBy(sortModels.value, 'groupName'))
    const len = list.length
    const moved = list[fromIdx.value]
    list.splice(fromIdx.value, 1)
    list.splice(toIdx, 0, moved)
    updateSortModels({ list: list.map((sm, idx) => ({ ...sm, order: len - idx })) })
  }
  fromIdx.value = undefined
}
</script>

<template>
  <main class="pt-20 w-full">
    <div class="w-[500px] h-[600px] mx-auto rounded shadow-lg p-8">
      <div>
        <h1 class="text-3xl font-bold">List</h1>
        <ul>
          <li v-for="(groupName, groupIdx) in sortModelGroupNames" :key="groupIdx" :data-group-name="groupName">
            <p class="text-lg font-bold">{{ groupName !== 'undefined' ? groupName : '' }}</p>
            <ul>
              <li
                v-for="(sm, idx) in sortModels[groupName]"
                :key="sm.uid"
                class="sort-item relative h-[44px] border-b p-2 rounded-sm hover:bg-gray-100"
                draggable="true"
                @dragstart="onDragStart"
                @dragend.prevent="onDragEnd"
                @dragenter.prevent="onDragEnter"
                @dragleave.prevent="onDragLeave"
                @dragover.prevent
                @drop.stop="onDropList"
              >
                <span
                  v-if="fromIdx !== undefined && fromIdx > idx"
                  :data-group-name="groupName === 'undefined' ? undefined : groupName"
                  :data-idx="idx"
                  class="sort-pin block absolute top-0 left-0 w-full border-t-2 border-blue-600 opacity-0"
                  @drop.stop="onDropSpan"
                  @dragenter.prevent.stop="onDragEnterSpan"
                  @dragleave.prevent.stop="onDragLeaveSpan"
                />
                <p class="select-none pointer-events-none">{{ sm.name }}</p>
                <span
                  v-if="fromIdx !== undefined && fromIdx < idx"
                  :data-group-name="groupName === 'undefined' ? undefined : groupName"
                  :data-idx="idx"
                  class="sort-pin block absolute bottom-0 left-0 w-full border-t-2 border-blue-600 opacity-0"
                  @drop.stop="onDropSpan"
                  @dragenter.prevent.stop="onDragEnterSpan"
                  @dragleave.prevent.stop="onDragLeaveSpan"
                />
              </li>
            </ul>
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
    <div ref="dragGhostRef" class="h-[20px] w-[20px] bg-red-200" />
  </main>
</template>

<style lang="scss">
.sort-item {
  &.dragover {
    background: rgba(13, 168, 196, 0.05);
  }
}

.sort-pin {
  &.dragover {
    opacity: 1;
  }

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 0;
    height: 10px;
    width: 100%;
  }

  &::after {
    content: '';
    position: absolute;
    top: -6px;
    left: -8px;
    height: 10px;
    box-sizing: border-box;
    width: 10px;
    border-radius: 5px;
    border: 2px solid blue;
  }
}
</style>
