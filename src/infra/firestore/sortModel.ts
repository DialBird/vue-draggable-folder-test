import {SortModel, sortModelConverter} from "@/domain/entities/SortModel";
import {getFirestore} from "@/infra/setFirebase";
import {collection, getDocs, onSnapshot} from "firebase/firestore";

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