import type { SortModel } from '@/domain/entities/SortModel'
import { groupBy } from 'lodash'
import { defineStore } from 'pinia'

export const useSortModelStore = defineStore('sortModel', {
  state: () => ({
    sortModelGroupNames: [] as string[],
    sortModelGroups: {} as { [groupName: string]: SortModel[] },
    sortModels: [] as SortModel[],
  }),
  actions: {
    setSortModels(models: SortModel[]) {
      this.sortModels = models
      this.sortModelGroups = groupBy(models, 'groupName')
      // グループ化のために、別コレクションを作る必要があるかも？
      // もしくはドキュメントに groupName と idx（グループを跨いで、上からの順番で）
      this.sortModelGroupNames = Object.keys(this.sortModelGroups)
    },
  },
})
