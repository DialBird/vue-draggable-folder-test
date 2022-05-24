import type { SortModel } from '@/domain/entities/SortModel'
import { groupBy } from 'lodash'
import { defineStore } from 'pinia'

export const useSortModelStore = defineStore('sortModel', {
  state: () => ({
    sortModelGroupNames: [] as string[],
    sortModels: {} as { [groupName: string]: SortModel[] },
  }),
  actions: {
    setSortModels(models: SortModel[]) {
      this.sortModels = groupBy(models, 'groupName')
      this.sortModelGroupNames = Object.keys(this.sortModels)
    },
  },
})
