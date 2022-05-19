import type {Firestore} from "firebase/firestore";

let db: Firestore;

export function setDb({_db}: { _db: Firestore }) {
  db = _db;
}

export function getFirestore(): Firestore {
  return db;
}
