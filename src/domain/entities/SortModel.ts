import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

export class SortModel {
  constructor(
    readonly uid: string,
    readonly name: string,
    readonly order?: number,
    readonly groupName?: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date,
  ) {}
}

type SortModelOnFirestore = {
  readonly uid: string
  readonly name: string
  readonly createdAt: Timestamp
  readonly updatedAt: Timestamp
  readonly order?: number
  readonly groupName?: string
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
  toFirestore(sortModel: WithFieldValue<SortModel>) {
    return { ...sortModel, updatedAt: Timestamp.now() };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): SortModel {
    const data = snapshot.data(options);
    assertSortModel(data);
    return new SortModel(
      data.uid,
      data.name,
      data.order,
      data.groupName,
      data.createdAt.toDate(),
      data.updatedAt.toDate()
    );
  },
};