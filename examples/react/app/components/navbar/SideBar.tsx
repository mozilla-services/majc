import { MozAdsPlacement } from "@mozilla/majc/dist/react"
import { FixedSize } from "@mozilla/majc/dist/core"

export default function SideBar() {
  return (
    <div className="flex flex-col justify-between items-center gap-40 pb-20">
      <MozAdsPlacement placementId="mock_pocket_skyscraper_1" fixedSize={FixedSize.Skyscraper} />
    </div>
  )
}
