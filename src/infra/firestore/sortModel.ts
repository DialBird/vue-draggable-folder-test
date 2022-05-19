import {SortModel, sortModelConverter} from "@/domain/entities/SortModel";
import {getFirestore} from "@/infra/setFirebase";
import {collection, doc, getDocs, onSnapshot, setDoc} from "firebase/firestore";

export const getSortModels = async () => {
  const collectionRef = collection(getFirestore(), "sortModels");
  const response = await getDocs(collectionRef);
  return response.docs.map((doc) => doc.data());
};

export const subscribeSortModels = async (subscribe: (sortModels: SortModel[]) => void) => {
  const collectionRef = collection(getFirestore(), "sortModels").withConverter(sortModelConverter);
  onSnapshot(collectionRef, (snap) => {
    subscribe(snap.docs.map((d) => d.data()))
  })
}

export const addSortModel = async (payload: Pick<SortModel, 'name'>) => {
  const { name } = payload
  const _doc = doc(collection(getFirestore(), 'sortModels'))
  await setDoc(_doc, { uid: _doc.id, name })
}