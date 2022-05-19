import {getFirestore} from "@/infra/setFirebase";
import type { DocumentData } from "firebase/firestore"
import { collection, getDocs, onSnapshot } from "firebase/firestore";

export const getSortModels = async () => {
  const collectionRef = collection(getFirestore(), "sortModels");
  const response = await getDocs(collectionRef);
  return response.docs.map((doc) => doc.data());
};

export const subscribeSortModels = async (subscribe: (sortModels: DocumentData[]) => void) => {
  const collectionRef = collection(getFirestore(), "sortModels");
  onSnapshot(collectionRef, (snap) => {
    subscribe(snap.docs.map((d) => d.data()))
  })
}