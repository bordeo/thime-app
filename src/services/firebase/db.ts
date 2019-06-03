import { HumanResource } from "./../../types/HumanResource";
import { db, auth } from "./firebase";
import { Day } from "../../types/Day";
import { User } from "firebase";
import { globalFacility } from "../../utils/globals";

export const onceGetUser = async (
  uid: string
): Promise<firebase.database.DataSnapshot> =>
  db.ref(`/users/${uid}`).once("value");

export const onceGetUserFacility = (
  uid: string,
  cb?: (a: firebase.database.DataSnapshot, b?: string) => any
): Promise<firebase.database.DataSnapshot> =>
  db.ref(`/users/${uid}/facility`).once("value", cb);

export const doCreateUser = (
  uid: string,
  email: string,
  facility: string
): Promise<User> =>
  db.ref(`/users/${uid}`).set({
    email,
    facility
  });

export const onceGetUsers = (): Promise<firebase.database.DataSnapshot> =>
  db.ref("/users").once("value");

export const doCreateDay = (
  day: Day
): Promise<firebase.database.DataSnapshot> => {
  return db.ref(`/facilities/${globalFacility}/days/${day.id}`).set({
    ...day
  });
};

export const doDeleteDay = (id: string): Promise<void> =>
  db.ref(`/facilities/${globalFacility}/days/${id}`).remove();

export const onceGetDay = (
  day: string
): Promise<firebase.database.DataSnapshot> =>
  db.ref(`/facilities/${globalFacility}/days/${day}`).once("value");

export const onGetDay = (
  day: string,
  cb: (a: firebase.database.DataSnapshot | null, b?: string) => any
) => db.ref(`/facilities/${globalFacility}/days/${day}`).on("value", cb);

export const offGetDay = (
  day: string,
  cb?: (a: firebase.database.DataSnapshot | null, b?: string) => any
) => db.ref(`/facilities/${globalFacility}/days/${day}`).off("value", cb);

export const onceGetDaysOfMonth = (
  month: string,
  year: string
): Promise<firebase.database.DataSnapshot> =>
  db
    .ref(`/facilities/${globalFacility}/days`)
    .orderByKey()
    .startAt(`${year}-${month}-01`)
    .endAt(`${year}-${month}-31`)
    .once("value");

export const onGetDaysOfMonth = (
  month: string,
  year: string,
  cb: (a: firebase.database.DataSnapshot | null, b?: string) => any
) =>
  db
    .ref(`/facilities/${globalFacility}/days`)
    .orderByKey()
    .startAt(`${year}-${month}-01`)
    .endAt(`${year}-${month}-31`)
    .on("value", cb);

export const offGetDaysOfMonth = (
  month: string,
  year: string,
  cb?: (a: firebase.database.DataSnapshot | null, b?: string) => any
) =>
  db
    .ref(`/facilities/${globalFacility}/days`)
    .orderByKey()
    .startAt(`${year}-${month}-01`)
    .endAt(`${year}-${month}-31`)
    .off("value", cb);

export const doCreateHumanResource = (
  humanResource: HumanResource
): Promise<firebase.database.DataSnapshot> => {
  return db.ref(`/facilities/${globalFacility}/humanResources/${humanResource.id}`).set({
    ...humanResource
  });
};

export const doRemoveHumanResource = (
  humanResource: HumanResource
): Promise<firebase.database.DataSnapshot> => {
  return db
    .ref(`/facilities/${globalFacility}/humanResources/${humanResource.id}`)
    .remove();
};

export const onceGetHumanResource = (
  hResource: HumanResource
): Promise<firebase.database.DataSnapshot> =>
  db.ref(`/facilities/${globalFacility}/humanResources/${hResource.id}`).once("value");

export const onceGetHumanResources = (): Promise<
  firebase.database.DataSnapshot
> => db.ref(`/facilities/${globalFacility}/humanResources`).once("value");

export const onGetHumanResources = (
  cb: (a: firebase.database.DataSnapshot | null, b?: string) => any,
  errCb: Object | null
) => db.ref(`/facilities/${globalFacility}/humanResources`).on("value", cb, errCb);

export const offGetHumanResources = (
  cb?: (a: firebase.database.DataSnapshot | null, b?: string) => any
) => db.ref(`/facilities/${globalFacility}/humanResources`).off("value", cb);

export const doCreateHour = (
  day: string,
  hr: HumanResource,
  unit: number,
  total: number
): Promise<firebase.database.DataSnapshot> => {
  return db
    .ref(`/facilities/${globalFacility}/days/${day}/hours/${hr.id}`)
    .set({ ...hr, unit, total });
};

export const doRemoveHour = (
  day: string,
  hr: HumanResource
): Promise<firebase.database.DataSnapshot> => {
  return db.ref(`/facilities/${globalFacility}/days/${day}/hours/${hr.id}`).remove();
};
