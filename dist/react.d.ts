import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import react__default from 'react';

interface MozAdsConfig {
    gppEnabled: boolean;
    gppReadyTimeout: number;
}

interface MozAdsConfigProviderProps {
    children?: react__default.ReactNode;
    config?: Partial<MozAdsConfig>;
}
declare const MozAdsConfigProvider: ({ children, config, }: MozAdsConfigProviderProps) => react_jsx_runtime.JSX.Element;

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
/**
 * An object containing attribution configuration for enabled ads.
 */
type Attributions = {
    /**
     * Advertising partner associated with the ad.
     */
    partner_id: string;
    conversion?: Task;
};
type Task = {
    /**
     * DAP task ID.
     */
    task_id: string;
    /**
     * DAP data type of the task.
     */
    vdaf: string;
    /**
     * DAP data size of the task.
     */
    bits?: number;
    /**
     * DAP legnth of the task.
     */
    length: number;
    /**
     * DAP time precision. Determines rounding of dates in DAP report.
     */
    time_precision: number;
    /**
     * Measurement to be used when a default report is sent.
     */
    default_measurement?: number;
    /**
     * Index allocated to be used when a non-default report is sent.
     */
    index: number;
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
    attributions?: Attributions;
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

declare global {
    var __gpp: GPPFunction | undefined;
}
interface GPPCommand {
    addEventListener: GPPAddEventListenerCallback;
    getField: GPPGetFieldCallback;
    getSection: GPPGetSectionCallback;
    hasSection: GPPHasSectionCallback;
    ping: GPPPingCallback;
    removeEventListener: GPPRemoveEventListenerCallback;
}
type GPPAddEventListenerCallback = (data: GPPEvent, success: boolean) => void;
type GPPGetFieldCallback = (data: unknown | null, success: boolean) => void;
type GPPGetSectionCallback = (data: unknown[] | null, success: boolean) => void;
type GPPHasSectionCallback = (data: boolean, success: boolean) => void;
type GPPPingCallback = (data: GPPPing, success: boolean) => void;
type GPPRemoveEventListenerCallback = (data: boolean, success: boolean) => void;
interface GPPEvent {
    eventName: GPPEventNameType;
    listenerId: number;
    data: unknown;
    pingData: GPPPing;
}
interface GPPPing {
    gppVersion: string;
    cmpStatus: string;
    cmpDisplayStatus: string;
    signalStatus: string;
    supportedAPIs: string[];
    cmpId: number;
    sectionList: number[];
    applicableSections: number[];
    gppString: string;
    parsedSections: Record<string, unknown[]>;
}
type GPPFunction = <K extends keyof GPPCommand>(command: K, callback: GPPCommand[K], parameter?: unknown, version?: string) => K extends "addEventListener" ? GPPEvent : void;
type GPPEventNameType = "listenerRegistered" | "listenerRemoved" | "cmpStatus" | "cmpDisplayStatus" | "signalStatus" | "error" | "sectionChange";
type IABContentTaxonomyType = "IAB-1.0" | "IAB-2.0" | "IAB-2.1" | "IAB-2.2" | "IAB-3.0";
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

interface MozAdsPlacementProps extends MozAdsPlacementConfig {
    config?: Partial<MozAdsConfig>;
}
declare function MozAdsPlacement({ config, placementId, iabContent, fixedSize, onClick, onReport, onError, onLoad, }: MozAdsPlacementProps): react_jsx_runtime.JSX.Element;

declare const mozAdsConfigContext: react.Context<Partial<MozAdsConfig>>;
declare const useMozAdsConfig: () => Partial<MozAdsConfig>;

declare class MozAdsPlacementContextState {
    placements: MozAdsPlacements;
    getPlacementWithContent(placement: MozAdsPlacementConfig): Promise<MozAdsPlacementWithContent>;
}
declare const mozAdsPlacementContext: react.Context<MozAdsPlacementContextState>;
declare const useMozAdsPlacement: ({ config, placementId, iabContent, fixedSize, onError, }: MozAdsPlacementProps) => MozAdsPlacementWithContent;

export { MozAdsConfigProvider, type MozAdsConfigProviderProps, MozAdsPlacement, MozAdsPlacementContextState, type MozAdsPlacementProps, mozAdsConfigContext, mozAdsPlacementContext, useMozAdsConfig, useMozAdsPlacement };
