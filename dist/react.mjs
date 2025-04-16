"use client";import {
  DefaultLogger,
  defaultImpressionObserver,
  fetchAds,
  recordClick,
  renderPlacement
} from "./chunk-6BAS6WKN.mjs";
import "./chunk-YTI6ZYLM.mjs";

// packages/react/src/components/MozAdsPlacement.tsx
import { useLayoutEffect, useRef } from "react";

// packages/react/src/hooks/useMozAdsPlacement.ts
import { createContext, useContext, useEffect, useState } from "react";
var logger;
try {
  logger = new DefaultLogger({ name: "react.hooks.useMozAdsPlacement" });
} catch (error) {
  console.debug(`DefaultLogger for react.hooks.useMozAdsPlacement could not be instantiated: ${error}`);
}
var MozAdsPlacementContextState = class {
  placements = {};
  async getPlacementWithContent(placement) {
    const cachedPlacementWithContent = this.placements[placement.placementId];
    if (cachedPlacementWithContent) {
      return cachedPlacementWithContent;
    }
    try {
      const placementsWithContent = await fetchAds({
        placements: {
          [placement.placementId]: placement
        }
      });
      this.placements = {
        ...this.placements,
        ...placementsWithContent
      };
    } catch (error) {
      logger?.error(`Unable to fetch ads; ${error.message}`, {
        type: "placementComponent.adLoad.failure",
        eventLabel: "ad_load_error",
        errorId: error?.name
      });
      placement.onError?.({
        error
      });
      return placement;
    }
    return this.placements[placement.placementId];
  }
};
var mozAdsPlacementContext = createContext(new MozAdsPlacementContextState());
var useMozAdsPlacement = ({
  placementId,
  iabContent,
  fixedSize,
  onError
}) => {
  const [placement, setPlacement] = useState({
    placementId,
    iabContent,
    fixedSize
  });
  const context = useContext(mozAdsPlacementContext);
  const getData = async () => {
    setPlacement(await context.getPlacementWithContent({
      placementId,
      iabContent,
      fixedSize,
      onError
    }));
  };
  useEffect(() => {
    getData();
  }, [placementId]);
  return placement;
};

// packages/react/src/components/MozAdsPlacement.tsx
import { jsx } from "react/jsx-runtime";
var logger2;
try {
  logger2 = new DefaultLogger({ name: "react.components.MozAdsPlacement" });
} catch (error) {
  console.debug(`DefaultLogger for react.components.MozAdsPlacement could not be instantiated: ${error}`);
}
function MozAdsPlacement({
  placementId,
  iabContent,
  fixedSize,
  onClick,
  onReport,
  onError,
  onLoad
}) {
  const { width, height } = fixedSize || {};
  const style = {
    width: width && `${width}px`,
    height: height && `${height}px`
  };
  try {
    const placement = useMozAdsPlacement({
      placementId,
      iabContent,
      fixedSize,
      onError
    });
    const containerRef = useRef(null);
    useLayoutEffect(() => {
      if (containerRef.current) {
        renderPlacement(containerRef.current, {
          placement,
          onClick: (event) => {
            recordClick(placement);
            onClick?.(event);
          },
          onReport: (event) => {
            onReport?.(event);
          },
          onError: (event) => {
            onError?.(event);
          },
          onLoad: (event) => {
            defaultImpressionObserver.observe(placement);
            onLoad?.(event);
          }
        });
      }
    }, [placement]);
    return /* @__PURE__ */ jsx("div", { ref: containerRef, style });
  } catch (error) {
    try {
      logger2?.error(`An unexpected error has occured when rendering ${placementId}: ${error?.message}`, {
        type: "placementComponent.render.error",
        eventLabel: "render_error",
        placementId,
        errorId: error?.name
      });
      onError?.({
        error
      });
    } catch {
    }
    return /* @__PURE__ */ jsx("div", { style });
  }
}
export {
  MozAdsPlacement,
  MozAdsPlacementContextState,
  mozAdsPlacementContext,
  useMozAdsPlacement
};
