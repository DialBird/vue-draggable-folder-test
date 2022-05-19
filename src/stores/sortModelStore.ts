import type {SortModel} from "@/domain/entities/SortModel";
import {defineStore} from "pinia";

export const useSortModelStore = defineStore("sortModel", {
  state: () => ({
    sortModels: [] as SortModel[],
  }),
  actions: {
    setSortModels(models: SortModel[]) {
      this.sortModels = models
    }
  },
});
