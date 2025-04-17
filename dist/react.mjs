"use client";import{E as h,L as A,r as m,t as P,u as g}from"./chunk-P2K5VAZF.mjs";import"./chunk-57T3EAOB.mjs";import{useLayoutEffect as x,useRef as b}from"react";import{createContext as v,useContext as y,useEffect as w,useState as L}from"react";var M;try{M=new m({name:"react.hooks.useMozAdsPlacement"})}catch(e){console.debug(`DefaultLogger for react.hooks.useMozAdsPlacement could not be instantiated: ${e}`)}var f=class{placements={};async getPlacementWithContent(t){let o=this.placements[t.placementId];if(o)return o;try{let r=await A({placements:{[t.placementId]:t}});this.placements={...this.placements,...r}}catch(r){return M?.error(`Unable to fetch ads; ${r.message}`,{type:"placementComponent.adLoad.failure",eventLabel:"ad_load_error",errorId:r?.name}),t.onError?.({error:r}),t}return this.placements[t.placementId]}},R=v(new f),z=({placementId:e,iabContent:t,fixedSize:o,onError:r})=>{let[l,s]=L({placementId:e,iabContent:t,fixedSize:o}),d=y(R),c=async()=>{s(await d.getPlacementWithContent({placementId:e,iabContent:t,fixedSize:o,onError:r}))};return w(()=>{c()},[e]),l};import{jsx as C}from"react/jsx-runtime";var E;try{E=new m({name:"react.components.MozAdsPlacement"})}catch(e){console.debug(`DefaultLogger for react.components.MozAdsPlacement could not be instantiated: ${e}`)}function q({placementId:e,iabContent:t,fixedSize:o,onClick:r,onReport:l,onError:s,onLoad:d}){let{width:c,height:u}=o||{},p={width:c&&`${c}px`,height:u&&`${u}px`};try{let n=z({placementId:e,iabContent:t,fixedSize:o,onError:s}),i=b(null);return x(()=>{i.current&&h(i.current,{placement:n,onClick:a=>{g(n),r?.(a)},onReport:a=>{l?.(a)},onError:a=>{s?.(a)},onLoad:a=>{P.observe(n),d?.(a)}})},[n]),C("div",{ref:i,style:p})}catch(n){try{E?.error(`An unexpected error has occured when rendering ${e}: ${n?.message}`,{type:"placementComponent.render.error",eventLabel:"render_error",placementId:e,errorId:n?.name}),s?.({error:n})}catch{}return C("div",{style:p})}}export{q as MozAdsPlacement,f as MozAdsPlacementContextState,R as mozAdsPlacementContext,z as useMozAdsPlacement};
