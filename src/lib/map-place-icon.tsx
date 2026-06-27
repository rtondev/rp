import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { CategoryIcon } from "@/lib/category-icons";

export function createCategoryPlaceIcon(iconName?: string | null) {
  const html = renderToStaticMarkup(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 9999,
        background: "var(--surface)",
        border: "2px solid var(--accent)",
        boxShadow: "0 2px 10px rgba(0,0,0,.18)",
        color: "var(--accent)",
      }}
    >
      <CategoryIcon name={iconName} size={16} weight="fill" />
    </div>,
  );

  return L.divIcon({
    className: "",
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}
