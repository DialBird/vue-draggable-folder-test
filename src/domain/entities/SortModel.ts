import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue,
} from "firebase/firestore";

export class SortModel {
  readonly uid: string
  readonly name: string
  readonly order?: number
  readonly createdAt?: Date
  readonly updatedAt?: Date

  constructor({uid, name, order, createdAt, updatedAt}: {
    uid: string;
    name: string;
    order?: number;
    createdAt?: Date
    updatedAt?: Date
  }) {
    this.uid = uid;
    this.name = name;
    this.order = order;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

type SortModelOnFirestore = {
  readonly uid: string
  readonly name: string
  readonly createdAt: Timestamp
  readonly updatedAt: Timestamp
  readonly order?: number
}

export function assertSortModel(data: DocumentData): asserts data is SortModelOnFirestore {
  const d = data as Partial<SortModel>; // 補完のためキャスト
  if (
    !(
      typeof d?.uid === "string" &&
      typeof d?.name === "string"
    )
  ) {
    throw new Error("data is not SortModel type");
  }
}

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
    return new SortModel({
      uid: data.uid,
      name: data.name,
      order: data.order,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    });
  },
};