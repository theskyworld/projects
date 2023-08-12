import storage from "good-storage";

export function load(key : any) {
  return storage.get(key, []);
}
