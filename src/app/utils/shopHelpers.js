export const OWNER_NAME = "Tanvir";
export const DEFAULT_SHOP_NAME = "Tanvir Electric Shop";

export const CATEGORY_LABELS = {
  lighting: "Bulb / Lighting",
  wiring: "Wire",
  mobile: "Mobile (Charger, Battery)",
  tv_audio: "TV / Audio (Remote, Handsfree)",
  fan: "Fan Materials",
  other: "Other (Switch, etc.)",
};

export const UNIT_LABELS = {
  piece: "Piece",
  meter: "Meter",
  dozen: "Dozen",
};

export const TX_TYPE_LABELS = {
  cash_sale: "Cash Sale",
  credit_sale: "Udhaar Sale",
  payment: "Wasool (Payment)",
};

export function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getId(item) {
  return item?._id || item?.id;
}
