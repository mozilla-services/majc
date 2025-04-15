import * as react_jsx_runtime from 'react/jsx-runtime';
import { i as MozAdsPlacementConfig, e as MozAdsPlacements, M as MozAdsPlacementWithContent } from './types-CO1lAqrl.js';
import * as react from 'react';

declare function MozAdsPlacement({ placementId, iabContent, fixedSize, onClick, onReport, onError, onLoad, }: MozAdsPlacementConfig): react_jsx_runtime.JSX.Element;

declare class MozAdsPlacementContextState {
    placements: MozAdsPlacements;
    getPlacementWithContent(placement: MozAdsPlacementConfig): Promise<MozAdsPlacementWithContent>;
}
declare const mozAdsPlacementContext: react.Context<MozAdsPlacementContextState>;
declare const useMozAdsPlacement: ({ placementId, iabContent, fixedSize, onError, }: MozAdsPlacementConfig) => MozAdsPlacementWithContent;

export { MozAdsPlacement, MozAdsPlacementContextState, mozAdsPlacementContext, useMozAdsPlacement };
