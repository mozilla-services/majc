import * as react_jsx_runtime from 'react/jsx-runtime';
import { h as MozAdsPlacementConfig, e as MozAdsPlacements, M as MozAdsPlacementWithContent } from './types-B24rG9Wh.js';
import * as react from 'react';
import './types.gen-D4NshL2B.js';

declare function MozAdsPlacement({ placementId, iabContent, fixedSize, onClick, onReport, onError, onLoad, }: MozAdsPlacementConfig): react_jsx_runtime.JSX.Element;

declare class MozAdsPlacementContextState {
    placements: MozAdsPlacements;
    getPlacementWithContent(placement: MozAdsPlacementConfig): Promise<MozAdsPlacementWithContent>;
}
declare const mozAdsPlacementContext: react.Context<MozAdsPlacementContextState>;
declare const useMozAdsPlacement: ({ placementId, iabContent, fixedSize, onError, }: MozAdsPlacementConfig) => MozAdsPlacementWithContent;

export { MozAdsPlacement, MozAdsPlacementContextState, mozAdsPlacementContext, useMozAdsPlacement };
