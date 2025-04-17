"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// packages/heyapi/src/client/index.cjs
var require_client = __commonJS({
  "packages/heyapi/src/client/index.cjs"(exports) {
    "use strict";
    var A = async (t, r) => {
      let e = typeof r == "function" ? await r(t) : r;
      if (e) return t.scheme === "bearer" ? `Bearer ${e}` : t.scheme === "basic" ? `Basic ${btoa(e)}` : e;
    };
    var z = (t, r, e) => {
      typeof e == "string" || e instanceof Blob ? t.append(r, e) : t.append(r, JSON.stringify(e));
    };
    var j = (t, r, e) => {
      typeof e == "string" ? t.append(r, e) : t.append(r, JSON.stringify(e));
    };
    var $ = { bodySerializer: (t) => {
      let r = new FormData();
      return Object.entries(t).forEach(([e, a]) => {
        a != null && (Array.isArray(a) ? a.forEach((i) => z(r, e, i)) : z(r, e, a));
      }), r;
    } };
    var R = { bodySerializer: (t) => JSON.stringify(t, (r, e) => typeof e == "bigint" ? e.toString() : e) };
    var k = { bodySerializer: (t) => {
      let r = new URLSearchParams();
      return Object.entries(t).forEach(([e, a]) => {
        a != null && (Array.isArray(a) ? a.forEach((i) => j(r, e, i)) : j(r, e, a));
      }), r.toString();
    } };
    var U = (t) => {
      switch (t) {
        case "label":
          return ".";
        case "matrix":
          return ";";
        case "simple":
          return ",";
        default:
          return "&";
      }
    };
    var _ = (t) => {
      switch (t) {
        case "form":
          return ",";
        case "pipeDelimited":
          return "|";
        case "spaceDelimited":
          return "%20";
        default:
          return ",";
      }
    };
    var D = (t) => {
      switch (t) {
        case "label":
          return ".";
        case "matrix":
          return ";";
        case "simple":
          return ",";
        default:
          return "&";
      }
    };
    var O = ({ allowReserved: t, explode: r, name: e, style: a, value: i }) => {
      if (!r) {
        let s = (t ? i : i.map((l) => encodeURIComponent(l))).join(_(a));
        switch (a) {
          case "label":
            return `.${s}`;
          case "matrix":
            return `;${e}=${s}`;
          case "simple":
            return s;
          default:
            return `${e}=${s}`;
        }
      }
      let o = U(a), n = i.map((s) => a === "label" || a === "simple" ? t ? s : encodeURIComponent(s) : y({ allowReserved: t, name: e, value: s })).join(o);
      return a === "label" || a === "matrix" ? o + n : n;
    };
    var y = ({ allowReserved: t, name: r, value: e }) => {
      if (e == null) return "";
      if (typeof e == "object") throw new Error("Deeply-nested arrays/objects aren\u2019t supported. Provide your own `querySerializer()` to handle these.");
      return `${r}=${t ? e : encodeURIComponent(e)}`;
    };
    var q = ({ allowReserved: t, explode: r, name: e, style: a, value: i }) => {
      if (i instanceof Date) return `${e}=${i.toISOString()}`;
      if (a !== "deepObject" && !r) {
        let s = [];
        Object.entries(i).forEach(([f, u]) => {
          s = [...s, f, t ? u : encodeURIComponent(u)];
        });
        let l = s.join(",");
        switch (a) {
          case "form":
            return `${e}=${l}`;
          case "label":
            return `.${l}`;
          case "matrix":
            return `;${e}=${l}`;
          default:
            return l;
        }
      }
      let o = D(a), n = Object.entries(i).map(([s, l]) => y({ allowReserved: t, name: a === "deepObject" ? `${e}[${s}]` : s, value: l })).join(o);
      return a === "label" || a === "matrix" ? o + n : n;
    };
    var H = /\{[^{}]+\}/g;
    var B = ({ path: t, url: r }) => {
      let e = r, a = r.match(H);
      if (a) for (let i of a) {
        let o = false, n = i.substring(1, i.length - 1), s = "simple";
        n.endsWith("*") && (o = true, n = n.substring(0, n.length - 1)), n.startsWith(".") ? (n = n.substring(1), s = "label") : n.startsWith(";") && (n = n.substring(1), s = "matrix");
        let l = t[n];
        if (l == null) continue;
        if (Array.isArray(l)) {
          e = e.replace(i, O({ explode: o, name: n, style: s, value: l }));
          continue;
        }
        if (typeof l == "object") {
          e = e.replace(i, q({ explode: o, name: n, style: s, value: l }));
          continue;
        }
        if (s === "matrix") {
          e = e.replace(i, `;${y({ name: n, value: l })}`);
          continue;
        }
        let f = encodeURIComponent(s === "label" ? `.${l}` : l);
        e = e.replace(i, f);
      }
      return e;
    };
    var E = ({ allowReserved: t, array: r, object: e } = {}) => (i) => {
      let o = [];
      if (i && typeof i == "object") for (let n in i) {
        let s = i[n];
        if (s != null) {
          if (Array.isArray(s)) {
            o = [...o, O({ allowReserved: t, explode: true, name: n, style: "form", value: s, ...r })];
            continue;
          }
          if (typeof s == "object") {
            o = [...o, q({ allowReserved: t, explode: true, name: n, style: "deepObject", value: s, ...e })];
            continue;
          }
          o = [...o, y({ allowReserved: t, name: n, value: s })];
        }
      }
      return o.join("&");
    };
    var P = (t) => {
      if (!t) return "stream";
      let r = _optionalChain([t, 'access', _2 => _2.split, 'call', _3 => _3(";"), 'access', _4 => _4[0], 'optionalAccess', _5 => _5.trim, 'call', _6 => _6()]);
      if (r) {
        if (r.startsWith("application/json") || r.endsWith("+json")) return "json";
        if (r === "multipart/form-data") return "formData";
        if (["application/", "audio/", "image/", "video/"].some((e) => r.startsWith(e))) return "blob";
        if (r.startsWith("text/")) return "text";
      }
    };
    var I = async ({ security: t, ...r }) => {
      for (let e of t) {
        let a = await A(e, r.auth);
        if (!a) continue;
        let i = _nullishCoalesce(e.name, () => ( "Authorization"));
        switch (e.in) {
          case "query":
            r.query || (r.query = {}), r.query[i] = a;
            break;
          case "header":
          default:
            r.headers.set(i, a);
            break;
        }
        return;
      }
    };
    var S = (t) => W({ baseUrl: t.baseUrl, path: t.path, query: t.query, querySerializer: typeof t.querySerializer == "function" ? t.querySerializer : E(t.querySerializer), url: t.url });
    var W = ({ baseUrl: t, path: r, query: e, querySerializer: a, url: i }) => {
      let o = i.startsWith("/") ? i : `/${i}`, n = (_nullishCoalesce(t, () => ( ""))) + o;
      r && (n = B({ path: r, url: n }));
      let s = e ? a(e) : "";
      return s.startsWith("?") && (s = s.substring(1)), s && (n += `?${s}`), n;
    };
    var C = (t, r) => {
      let e = { ...t, ...r };
      return _optionalChain([e, 'access', _7 => _7.baseUrl, 'optionalAccess', _8 => _8.endsWith, 'call', _9 => _9("/")]) && (e.baseUrl = e.baseUrl.substring(0, e.baseUrl.length - 1)), e.headers = x(t.headers, r.headers), e;
    };
    var x = (...t) => {
      let r = new Headers();
      for (let e of t) {
        if (!e || typeof e != "object") continue;
        let a = e instanceof Headers ? e.entries() : Object.entries(e);
        for (let [i, o] of a) if (o === null) r.delete(i);
        else if (Array.isArray(o)) for (let n of o) r.append(i, n);
        else o !== void 0 && r.set(i, typeof o == "object" ? JSON.stringify(o) : o);
      }
      return r;
    };
    var m = class {
      
      constructor() {
        this._fns = [];
      }
      clear() {
        this._fns = [];
      }
      exists(r) {
        return this._fns.indexOf(r) !== -1;
      }
      eject(r) {
        let e = this._fns.indexOf(r);
        e !== -1 && (this._fns = [...this._fns.slice(0, e), ...this._fns.slice(e + 1)]);
      }
      use(r) {
        this._fns = [...this._fns, r];
      }
    };
    var T = () => ({ error: new m(), request: new m(), response: new m() });
    var N = E({ allowReserved: false, array: { explode: true, style: "form" }, object: { explode: true, style: "deepObject" } });
    var Q = { "Content-Type": "application/json" };
    var w = (t = {}) => ({ ...R, headers: Q, parseAs: "auto", querySerializer: N, ...t });
    var J = (t = {}) => {
      let r = C(w(), t), e = () => ({ ...r }), a = (n) => (r = C(r, n), e()), i = T(), o = async (n) => {
        let s = { ...r, ...n, fetch: _nullishCoalesce(_nullishCoalesce(n.fetch, () => ( r.fetch)), () => ( globalThis.fetch)), headers: x(r.headers, n.headers) };
        s.security && await I({ ...s, security: s.security }), s.body && s.bodySerializer && (s.body = s.bodySerializer(s.body)), (s.body === void 0 || s.body === "") && s.headers.delete("Content-Type");
        let l = S(s), f = { redirect: "follow", ...s }, u = new Request(l, f);
        for (let p of i.request._fns) u = await p(u, s);
        let v = s.fetch, c = await v(u);
        for (let p of i.response._fns) c = await p(c, u, s);
        let h = { request: u, response: c };
        if (c.ok) {
          if (c.status === 204 || c.headers.get("Content-Length") === "0") return { data: {}, ...h };
          let p = _nullishCoalesce((s.parseAs === "auto" ? P(c.headers.get("Content-Type")) : s.parseAs), () => ( "json"));
          if (p === "stream") return { data: c.body, ...h };
          let b = await c[p]();
          return p === "json" && (s.responseValidator && await s.responseValidator(b), s.responseTransformer && (b = await s.responseTransformer(b))), { data: b, ...h };
        }
        let g = await c.text();
        try {
          g = JSON.parse(g);
        } catch (e2) {
        }
        let d = g;
        for (let p of i.error._fns) d = await p(g, c, u, s);
        if (d = d || {}, s.throwOnError) throw d;
        return { error: d, ...h };
      };
      return { buildUrl: S, connect: (n) => o({ ...n, method: "CONNECT" }), delete: (n) => o({ ...n, method: "DELETE" }), get: (n) => o({ ...n, method: "GET" }), getConfig: e, head: (n) => o({ ...n, method: "HEAD" }), interceptors: i, options: (n) => o({ ...n, method: "OPTIONS" }), patch: (n) => o({ ...n, method: "PATCH" }), post: (n) => o({ ...n, method: "POST" }), put: (n) => o({ ...n, method: "PUT" }), request: o, setConfig: a, trace: (n) => o({ ...n, method: "TRACE" }) };
    };
    exports.createClient = J;
    exports.createConfig = w;
    exports.formDataBodySerializer = $;
    exports.jsonBodySerializer = R;
    exports.urlSearchParamsBodySerializer = k;
  }
});

// packages/heyapi/src/client.gen.ts
var import_client = __toESM(require_client());
var client = (0, import_client.createClient)((0, import_client.createConfig)({
  baseUrl: "https://ads.mozilla.org"
}));

// packages/heyapi/src/sdk.gen.ts
var getAds = (options) => {
  return (_nullishCoalesce(options.client, () => ( client))).post({
    url: "/v1/ads",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ..._optionalChain([options, 'optionalAccess', _10 => _10.headers])
    }
  });
};
var getV1T = (options) => {
  return (_nullishCoalesce(options.client, () => ( client))).get({
    url: "/v1/t",
    ...options
  });
};
var getV1Log = (options) => {
  return (_nullishCoalesce(_optionalChain([options, 'optionalAccess', _11 => _11.client]), () => ( client))).get({
    url: "/v1/log",
    ...options
  });
};
var deleteV1DeleteUser = (options) => {
  return (_nullishCoalesce(options.client, () => ( client))).delete({
    url: "/v1/delete_user",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ..._optionalChain([options, 'optionalAccess', _12 => _12.headers])
    }
  });
};
var getV1Images = (options) => {
  return (_nullishCoalesce(options.client, () => ( client))).get({
    url: "/v1/images",
    ...options
  });
};
var getSpocs = (options) => {
  return (_nullishCoalesce(options.client, () => ( client))).post({
    url: "/spocs",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ..._optionalChain([options, 'optionalAccess', _13 => _13.headers])
    }
  });
};
var deleteUser = (options) => {
  return (_nullishCoalesce(options.client, () => ( client))).delete({
    url: "/user",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ..._optionalChain([options, 'optionalAccess', _14 => _14.headers])
    }
  });
};
var getTiles = (options) => {
  return (_nullishCoalesce(_optionalChain([options, 'optionalAccess', _15 => _15.client]), () => ( client))).get({
    url: "/v1/tiles",
    ...options
  });
};











exports.client = client; exports.getAds = getAds; exports.getV1T = getV1T; exports.getV1Log = getV1Log; exports.deleteV1DeleteUser = deleteV1DeleteUser; exports.getV1Images = getV1Images; exports.getSpocs = getSpocs; exports.deleteUser = deleteUser; exports.getTiles = getTiles;
