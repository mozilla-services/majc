"use client";"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } var _class;





var _chunkGDMCIJCHjs = require('./chunk-GDMCIJCH.js');
require('./chunk-JNV5QPPX.js');

// packages/react/src/components/MozAdsPlacement.tsx
var _react = require('react');

// packages/react/src/hooks/useMozAdsPlacement.ts

var logger;
try {
  logger = new (0, _chunkGDMCIJCHjs.DefaultLogger)({ name: "react.hooks.useMozAdsPlacement" });
} catch (error) {
  console.debug(`DefaultLogger for react.hooks.useMozAdsPlacement could not be instantiated: ${error}`);
}
var MozAdsPlacementContextState = (_class = class {constructor() { _class.prototype.__init.call(this); }
  __init() {this.placements = {}}
  async getPlacementWithContent(placement) {
    const cachedPlacementWithContent = this.placements[placement.placementId];
    if (cachedPlacementWithContent) {
      return cachedPlacementWithContent;
    }
    try {
      const placementsWithContent = await _chunkGDMCIJCHjs.fetchAds.call(void 0, {
        placements: {
          [placement.placementId]: placement
        }
      });
      this.placements = {
        ...this.placements,
        ...placementsWithContent
      };
    } catch (error) {
      _optionalChain([logger, 'optionalAccess', _ => _.error, 'call', _2 => _2(`Unable to fetch ads; ${error.message}`, {
        type: "placementComponent.adLoad.failure",
        eventLabel: "ad_load_error",
        errorId: _optionalChain([error, 'optionalAccess', _3 => _3.name])
      })]);
      _optionalChain([placement, 'access', _4 => _4.onError, 'optionalCall', _5 => _5({
        error
      })]);
      return placement;
    }
    return this.placements[placement.placementId];
  }
}, _class);
var mozAdsPlacementContext = _react.createContext.call(void 0, new MozAdsPlacementContextState());
var useMozAdsPlacement = ({
  placementId,
  iabContent,
  fixedSize,
  onError
}) => {
  const [placement, setPlacement] = _react.useState.call(void 0, {
    placementId,
    iabContent,
    fixedSize
  });
  const context = _react.useContext.call(void 0, mozAdsPlacementContext);
  const getData = async () => {
    setPlacement(await context.getPlacementWithContent({
      placementId,
      iabContent,
      fixedSize,
      onError
    }));
  };
  _react.useEffect.call(void 0, () => {
    getData();
  }, [placementId]);
  return placement;
};

// packages/react/src/components/MozAdsPlacement.tsx
var _jsxruntime = require('react/jsx-runtime');
var logger2;
try {
  logger2 = new (0, _chunkGDMCIJCHjs.DefaultLogger)({ name: "react.components.MozAdsPlacement" });
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
    const containerRef = _react.useRef.call(void 0, null);
    _react.useLayoutEffect.call(void 0, () => {
      if (containerRef.current) {
        _chunkGDMCIJCHjs.renderPlacement.call(void 0, containerRef.current, {
          placement,
          onClick: (event) => {
            _chunkGDMCIJCHjs.recordClick.call(void 0, placement);
            _optionalChain([onClick, 'optionalCall', _6 => _6(event)]);
          },
          onReport: (event) => {
            _optionalChain([onReport, 'optionalCall', _7 => _7(event)]);
          },
          onError: (event) => {
            _optionalChain([onError, 'optionalCall', _8 => _8(event)]);
          },
          onLoad: (event) => {
            _chunkGDMCIJCHjs.defaultImpressionObserver.observe(placement);
            _optionalChain([onLoad, 'optionalCall', _9 => _9(event)]);
          }
        });
      }
    }, [placement]);
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { ref: containerRef, style });
  } catch (error) {
    try {
      _optionalChain([logger2, 'optionalAccess', _10 => _10.error, 'call', _11 => _11(`An unexpected error has occured when rendering ${placementId}: ${_optionalChain([error, 'optionalAccess', _12 => _12.message])}`, {
        type: "placementComponent.render.error",
        eventLabel: "render_error",
        placementId,
        errorId: _optionalChain([error, 'optionalAccess', _13 => _13.name])
      })]);
      _optionalChain([onError, 'optionalCall', _14 => _14({
        error
      })]);
    } catch (e) {
    }
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style });
  }
}





exports.MozAdsPlacement = MozAdsPlacement; exports.MozAdsPlacementContextState = MozAdsPlacementContextState; exports.mozAdsPlacementContext = mozAdsPlacementContext; exports.useMozAdsPlacement = useMozAdsPlacement;
