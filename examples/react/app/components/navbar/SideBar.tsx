import { MozAdsPlacement } from '@mozilla-services/majc/dist/react'
import { FixedSize } from '@mozilla-services/majc/dist/core'

export default function SideBar() {
  return (
    <div className="flex flex-col justify-between items-center gap-40 pb-20">
      <MozAdsPlacement placementId="mock_pocket_skyscraper_1" fixedSize={FixedSize.Skyscraper} />
    </div>
  )
}
