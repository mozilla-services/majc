import { MozAdsPlacement } from '@mozilla/majc/dist/react'
import { FixedSize } from '@mozilla/majc/dist/core'
import SideBar from '../navbar/SideBar'
import ArticleContent from './ArticleContent'
import ArticleHeader from './ArticleHeader'

export default function Article() {
  return (
    <div>
      <div className="flex flex-col items-center gap-5">
        <MozAdsPlacement placementId="mock_pocket_billboard_1" fixedSize={FixedSize.Billboard} iabContent={{ taxonomy: 'IAB-1.0', categoryIds: ['IAB1-1', 'IAB1-2', 'IAB2-1'] }} />
        <hr className="w-full h-1 bg-gray-100 border-0 rounded-sm bg-gray-700" />
      </div>
      <div className="pt-10">
        <ArticleHeader />
      </div>
      <div className="flex flex-row pt-10 gap-10">
        <div className="w-3/4">
          <ArticleContent />
        </div>
        <div className="w-1/4">
          <SideBar />
        </div>
      </div>
      <div className="flex flex-col items-center gap-5 pb-10">
        <hr className="w-full h-1 bg-gray-100 border-0 rounded-sm bg-gray-700" />
        <MozAdsPlacement placementId="mock_pocket_billboard_2" />
      </div>
    </div>
  )
}
