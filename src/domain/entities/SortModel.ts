import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";

export class SortModel {
  readonly uid: string
  readonly name: string

  constructor({uid, name}: {
    uid: string;
    name: string;
  }) {
    this.uid = uid;
    this.name = name;
  }
}

export function assertSortModel(data: DocumentData): asserts data is SortModel {
  const d = data as Partial<SortModel>; // 補完のためキャスト
  if (
    !(
      typeof d?.uid === "string" &&
      typeof d?.name === "string"
    )
  ) {
    throw new Error("data is not SortModel type");
  }
};

export const sortModelConverter: FirestoreDataConverter<SortModel> = {
  toFirestore(user: WithFieldValue<SortModel>) {
    return user;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): SortModel {
    const data = snapshot.data(options);
    assertSortModel(data);
    return data;
  },
};