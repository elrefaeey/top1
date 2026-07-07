import { useEffect } from "react";
import { nextOrderFromList } from "@/lib/cms/admin-utils";

/** Pre-fills `order` with the next sequence number when creating a new item. */
export function useApplyNextOrder<T extends { order: number }>(
  isNew: boolean,
  items: Array<{ order?: number }> | undefined,
  setForm: React.Dispatch<React.SetStateAction<T>>,
) {
  useEffect(() => {
    if (!isNew || items === undefined) return;
    const order = nextOrderFromList(items);
    setForm((f) => (f.order === order ? f : { ...f, order }));
  }, [isNew, items, setForm]);
}
