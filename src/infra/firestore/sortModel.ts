import {SortModel, sortModelConverter} from "@/domain/entities/SortModel";
import {getFirestore} from "@/infra/setFirebase";
import {collection, doc, getDocs, onSnapshot, setDoc, Timestamp, writeBatch} from "firebase/firestore";

export const getSortModels = async () => {
  const collectionRef = collection(getFirestore(), "sortModels");
  const response = await getDocs(collectionRef);
  return response.docs.map((doc) => doc.data());
};

const getSorterNumber = (sm: SortModel): number => {
  const time = sm.updatedAt || sm.createdAt
  return time ? time.getTime() : -1
}
const sorter = (a: SortModel, b: SortModel): number => {
  const aOrder = a.order || -1
  const bOrder = b.order || -1
  const aN = getSorterNumber(a)
  const bN = getSorterNumber(b)
  if (aOrder === bOrder) {
    return bN - aN
  } else {
    return bOrder - aOrder
  }
}

export const subscribeSortModels = async (subscribe: (sortModels: SortModel[]) => void) => {
  const collectionRef = collection(getFirestore(), "sortModels").withConverter(sortModelConverter);
  onSnapshot(collectionRef, (snap) => {
    subscribe(snap.docs.map((d) => d.data()).sort(sorter))
  })
}

export const addSortModel = async (payload: Pick<SortModel, 'name'>) => {
  const {name} = payload
  const _doc = doc(collection(getFirestore(), 'sortModels'))
  const now = Timestamp.now()
  await setDoc(_doc, {uid: _doc.id, name, createdAt: now, updatedAt: now})
}

export const updateSortModels = async (payload: { list: SortModel[] }) => {
  const {list} = payload
  const batch = writeBatch(getFirestore())
  list.forEach((l) => {
    const ref = doc(getFirestore(), `sortModels/${l.uid}`).withConverter(sortModelConverter)
    batch.set(ref, l, { merge: true })
  })
  await batch.commit()

}