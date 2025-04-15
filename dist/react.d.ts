import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';

/**
 * An object containing callback URLs for interactions with an ad.
 */
type AdCallbacks = {
    /**
     * This URL should be requested with an HTTP GET when the ad is clicked. Response should be ignored.
     */
    click: string | null;
    /**
     * This URL should be requested with an HTTP GET when half of the ad is visible in the viewport for 1 second. If the ad's pixel size is greater that 242500 (970 * 250) only 30% visibility is required. Response should be ignored.
     */
    impression: string | null;
    /**
     * This URL may be issued by a client on behalf of a user to report an ad that is inappropriate or otherwise unsatisfying. Response should be ignored. The reason parameter is required with this action.
     */
    report?: string | null;
};
type AdFormatBase = {
    /**
     * The format type of the ad.
     */
    format?: string;
    /**
     * The target destination URL of the ad.
     */
    url?: string;
    callbacks?: AdCallbacks;
};
/**
 * Client-side enforced frequency capping information.
 */
type SpocFrequencyCaps = {
    /**
     * A key that identifies the frequency cap.
     */
    cap_key?: string;
    /**
     * Number of times to show the same ad during a one day period.
     */
    day?: number;
};
/**
 * Ranking information for personalized content.
 */
type SpocRanking = {
    /**
     * The priority in the ranking. Reranking of ads should prefer priority before personalization.
     */
    priority?: number;
    /**
     * A map of model names to scores for personalization.
     */
    personalization_models?: {
        [key: string]: number;
    };
    /**
     * The overall score for the item.
     */
    item_score?: number;
};
type ImageAd = AdFormatBase & {
    /**
     * URL of the ad image.
     */
    image_url?: string;
    /**
     * Alt text to describe the ad image.
     */
    alt_text?: string;
    /**
     * The block key generated for the advertiser.
     */
    block_key?: string;
};
type Spoc = AdFormatBase & {
    /**
     * URL of the ad image.
     */
    image_url?: string;
    /**
     * Title of the sponsored content.
     */
    title?: string;
    /**
     * The domain where the content is hosted.
     */
    domain?: string;
    /**
     * A short excerpt from the sponsored content.
     */
    excerpt?: string;
    /**
     * The name of the sponsor.
     */
    sponsor?: string;
    /**
     * An optional override for the sponsor name.
     */
    sponsored_by_override?: string | null;
    /**
     * The block key generated for the advertiser.
     */
    block_key?: string;
    caps?: SpocFrequencyCaps;
    ranking?: SpocRanking;
};
type UaTile = AdFormatBase & {
    /**
     * URL of the ad image.
     */
    image_url?: string;
    /**
     * The name displayed under the tile.
     */
    name?: string;
    /**
     * The block key generated for the advertiser.
     */
    block_key?: string;
};

type IABContentTaxonomyType = 'IAB-1.0' | 'IAB-2.0' | 'IAB-2.1' | 'IAB-2.2' | 'IAB-3.0';
interface IABContent {
    taxonomy: IABContentTaxonomyType;
    categoryIds: string[];
}
type MozAdsPlacements = Record<string, MozAdsPlacementConfig | MozAdsPlacementWithContent>;
interface MozAdsRenderPlacementEvent {
    placement?: MozAdsPlacementWithContent;
}
interface MozAdsRenderPlacementReportEvent extends MozAdsRenderPlacementEvent {
    reason: string;
}
interface MozAdsRenderPlacementErrorEvent extends MozAdsRenderPlacementEvent {
    error: Error;
}
interface MozAdsPlacementConfig {
    placementId: string;
    fixedSize?: MozAdsSize;
    iabContent?: IABContent;
    onClick?: (event: MozAdsRenderPlacementEvent) => void;
    onReport?: (event: MozAdsRenderPlacementReportEvent) => void;
    onError?: (event: MozAdsRenderPlacementErrorEvent) => void;
    onLoad?: (event: MozAdsRenderPlacementEvent) => void;
}
interface MozAdsPlacementWithContent extends MozAdsPlacementConfig {
    content?: MozAdsContent;
}
type MozAdsContent = ImageAd | Spoc | UaTile;
interface MozAdsSize {
    width: number;
    height: number;
}

declare function MozAdsPlacement({ placementId, iabContent, fixedSize, onClick, onReport, onError, onLoad, }: MozAdsPlacementConfig): react_jsx_runtime.JSX.Element;

declare class MozAdsPlacementContextState {
    placements: MozAdsPlacements;
    getPlacementWithContent(placement: MozAdsPlacementConfig): Promise<MozAdsPlacementWithContent>;
}
declare const mozAdsPlacementContext: react.Context<MozAdsPlacementContextState>;
declare const useMozAdsPlacement: ({ placementId, iabContent, fixedSize, onError, }: MozAdsPlacementConfig) => MozAdsPlacementWithContent;

export { MozAdsPlacement, MozAdsPlacementContextState, mozAdsPlacementContext, useMozAdsPlacement };
