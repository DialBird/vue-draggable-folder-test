<script lang="ts" setup>
import {subscribeSortModels} from "@/infra/firestore/sortModel";
import {useSortModelStore} from "@/stores/sortModelStore";
import {storeToRefs} from "pinia";

subscribeSortModels((models) => {
  sortModelStore.setSortModels(models)
})

const sortModelStore = useSortModelStore()
const { sortModels } = storeToRefs(sortModelStore)
</script>

<template>
  <main class="pt-20 w-full">
    <div class="w-[500px] h-[600px] mx-auto rounded shadow-lg p-8">
      <div>
        <h1 class="text-3xl font-bold">
          Hello world!
        </h1>
        <p v-for="s in sortModels" :key="s.uid">{{ s.name }}</p>
      </div>
    </div>
  </main>
</template>
