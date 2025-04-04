'use client'

import { FixedSize, MozAdsPlacement } from '@mozilla-services/majc/dist/react'
import SideBar from '../navbar/SideBar'
import ArticleContent from './ArticleContent'
import ArticleHeader from './ArticleHeader'

export interface ArticleProps {
  iabCategories?: string[]
}

export default function Article({ iabCategories }: ArticleProps) {
  return (
    <div>
      <div className="flex flex-col items-center gap-5">
        <MozAdsPlacement placementId="mock_pocket_billboard_1" iabContentCategoryIds={iabCategories} fixedSize={FixedSize.Billboard} />
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
        <MozAdsPlacement placementId="mock_pocket_billboard_2" iabContentCategoryIds={iabCategories} />
      </div>
    </div>
  )
}
