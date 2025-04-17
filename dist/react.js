"use client";"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } var _class;var _chunkOJS6LTHOjs = require('./chunk-OJS6LTHO.js');require('./chunk-34ONY7SM.js');var _react = require('react');var M;try{M=new (0, _chunkOJS6LTHOjs.r)({name:"react.hooks.useMozAdsPlacement"})}catch(e){console.debug(`DefaultLogger for react.hooks.useMozAdsPlacement could not be instantiated: ${e}`)}var f= (_class =class{constructor() { _class.prototype.__init.call(this); }__init() {this.placements={}}async getPlacementWithContent(t){let o=this.placements[t.placementId];if(o)return o;try{let r=await _chunkOJS6LTHOjs.L.call(void 0, {placements:{[t.placementId]:t}});this.placements={...this.placements,...r}}catch(r){return _optionalChain([M, 'optionalAccess', _ => _.error, 'call', _2 => _2(`Unable to fetch ads; ${r.message}`,{type:"placementComponent.adLoad.failure",eventLabel:"ad_load_error",errorId:_optionalChain([r, 'optionalAccess', _3 => _3.name])})]),_optionalChain([t, 'access', _4 => _4.onError, 'optionalCall', _5 => _5({error:r})]),t}return this.placements[t.placementId]}}, _class),R= exports.mozAdsPlacementContext =_react.createContext.call(void 0, new f),z= exports.useMozAdsPlacement =({placementId:e,iabContent:t,fixedSize:o,onError:r})=>{let[l,s]=_react.useState.call(void 0, {placementId:e,iabContent:t,fixedSize:o}),d=_react.useContext.call(void 0, R),c=async()=>{s(await d.getPlacementWithContent({placementId:e,iabContent:t,fixedSize:o,onError:r}))};return _react.useEffect.call(void 0, ()=>{c()},[e]),l};var _jsxruntime = require('react/jsx-runtime');var E;try{E=new (0, _chunkOJS6LTHOjs.r)({name:"react.components.MozAdsPlacement"})}catch(e){console.debug(`DefaultLogger for react.components.MozAdsPlacement could not be instantiated: ${e}`)}function q({placementId:e,iabContent:t,fixedSize:o,onClick:r,onReport:l,onError:s,onLoad:d}){let{width:c,height:u}=o||{},p={width:c&&`${c}px`,height:u&&`${u}px`};try{let n=z({placementId:e,iabContent:t,fixedSize:o,onError:s}),i=_react.useRef.call(void 0, null);return _react.useLayoutEffect.call(void 0, ()=>{i.current&&_chunkOJS6LTHOjs.E.call(void 0, i.current,{placement:n,onClick:a=>{_chunkOJS6LTHOjs.u.call(void 0, n),_optionalChain([r, 'optionalCall', _6 => _6(a)])},onReport:a=>{_optionalChain([l, 'optionalCall', _7 => _7(a)])},onError:a=>{_optionalChain([s, 'optionalCall', _8 => _8(a)])},onLoad:a=>{_chunkOJS6LTHOjs.t.observe(n),_optionalChain([d, 'optionalCall', _9 => _9(a)])}})},[n]),_jsxruntime.jsx.call(void 0, "div",{ref:i,style:p})}catch(n){try{_optionalChain([E, 'optionalAccess', _10 => _10.error, 'call', _11 => _11(`An unexpected error has occured when rendering ${e}: ${_optionalChain([n, 'optionalAccess', _12 => _12.message])}`,{type:"placementComponent.render.error",eventLabel:"render_error",placementId:e,errorId:_optionalChain([n, 'optionalAccess', _13 => _13.name])})]),_optionalChain([s, 'optionalCall', _14 => _14({error:n})])}catch (e2){}return _jsxruntime.jsx.call(void 0, "div",{style:p})}}exports.MozAdsPlacement = q; exports.MozAdsPlacementContextState = f; exports.mozAdsPlacementContext = R; exports.useMozAdsPlacement = z;
