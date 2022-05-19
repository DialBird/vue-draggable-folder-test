import { defineStore } from "pinia";

export const useSortModelStore = defineStore("sortModel", {
  state: () => ({
    sortModels: [] as any[],
  }),
  actions: {
    setSortModels(models: any[]) {
      this.sortModels = models
    }
  },
});
