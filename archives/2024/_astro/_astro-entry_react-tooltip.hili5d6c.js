import{g as co,r as p,R as Ee}from"./index.pNoFJhTY.js";const Ie=Math.min,_e=Math.max,ut=Math.round,at=Math.floor,me=e=>({x:e,y:e}),ao={left:"right",right:"left",bottom:"top",top:"bottom"},uo={start:"end",end:"start"};function xt(e,t,n){return _e(e,Ie(t,n))}function Je(e,t){return typeof e=="function"?e(t):e}function Se(e){return e.split("-")[0]}function et(e){return e.split("-")[1]}function Xt(e){return e==="x"?"y":"x"}function At(e){return e==="y"?"height":"width"}function pt(e){return["top","bottom"].includes(Se(e))?"y":"x"}function Ot(e){return Xt(pt(e))}function fo(e,t,n){n===void 0&&(n=!1);const o=et(e),l=Ot(e),r=At(l);let s=l==="x"?o===(n?"end":"start")?"right":"left":o==="start"?"bottom":"top";return t.reference[r]>t.floating[r]&&(s=ft(s)),[s,ft(s)]}function po(e){const t=ft(e);return[Et(e),t,Et(t)]}function Et(e){return e.replace(/start|end/g,t=>uo[t])}function mo(e,t,n){const o=["left","right"],l=["right","left"],r=["top","bottom"],s=["bottom","top"];switch(e){case"top":case"bottom":return n?t?l:o:t?o:l;case"left":case"right":return t?r:s;default:return[]}}function ho(e,t,n,o){const l=et(e);let r=mo(Se(e),n==="start",o);return l&&(r=r.map(s=>s+"-"+l),t&&(r=r.concat(r.map(Et)))),r}function ft(e){return e.replace(/left|right|bottom|top/g,t=>ao[t])}function vo(e){return{top:0,right:0,bottom:0,left:0,...e}}function Yt(e){return typeof e!="number"?vo(e):{top:e,right:e,bottom:e,left:e}}function dt(e){return{...e,top:e.y,left:e.x,right:e.x+e.width,bottom:e.y+e.height}}function $t(e,t,n){let{reference:o,floating:l}=e;const r=pt(t),s=Ot(t),i=At(s),c=Se(t),a=r==="y",m=o.x+o.width/2-l.width/2,d=o.y+o.height/2-l.height/2,x=o[i]/2-l[i]/2;let f;switch(c){case"top":f={x:m,y:o.y-l.height};break;case"bottom":f={x:m,y:o.y+o.height};break;case"right":f={x:o.x+o.width,y:d};break;case"left":f={x:o.x-l.width,y:d};break;default:f={x:o.x,y:o.y}}switch(et(t)){case"start":f[s]-=x*(n&&a?-1:1);break;case"end":f[s]+=x*(n&&a?-1:1);break}return f}const yo=async(e,t,n)=>{const{placement:o="bottom",strategy:l="absolute",middleware:r=[],platform:s}=n,i=r.filter(Boolean),c=await(s.isRTL==null?void 0:s.isRTL(t));let a=await s.getElementRects({reference:e,floating:t,strategy:l}),{x:m,y:d}=$t(a,o,c),x=o,f={},h=0;for(let y=0;y<i.length;y++){const{name:E,fn:g}=i[y],{x:_,y:S,data:R,reset:O}=await g({x:m,y:d,initialPlacement:o,placement:x,strategy:l,middlewareData:f,rects:a,platform:s,elements:{reference:e,floating:t}});m=_??m,d=S??d,f={...f,[E]:{...f[E],...R}},O&&h<=50&&(h++,typeof O=="object"&&(O.placement&&(x=O.placement),O.rects&&(a=O.rects===!0?await s.getElementRects({reference:e,floating:t,strategy:l}):O.rects),{x:m,y:d}=$t(a,x,c)),y=-1)}return{x:m,y:d,placement:x,strategy:l,middlewareData:f}};async function Gt(e,t){var n;t===void 0&&(t={});const{x:o,y:l,platform:r,rects:s,elements:i,strategy:c}=e,{boundary:a="clippingAncestors",rootBoundary:m="viewport",elementContext:d="floating",altBoundary:x=!1,padding:f=0}=Je(t,e),h=Yt(f),E=i[x?d==="floating"?"reference":"floating":d],g=dt(await r.getClippingRect({element:(n=await(r.isElement==null?void 0:r.isElement(E)))==null||n?E:E.contextElement||await(r.getDocumentElement==null?void 0:r.getDocumentElement(i.floating)),boundary:a,rootBoundary:m,strategy:c})),_=d==="floating"?{...s.floating,x:o,y:l}:s.reference,S=await(r.getOffsetParent==null?void 0:r.getOffsetParent(i.floating)),R=await(r.isElement==null?void 0:r.isElement(S))?await(r.getScale==null?void 0:r.getScale(S))||{x:1,y:1}:{x:1,y:1},O=dt(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:i,rect:_,offsetParent:S,strategy:c}):_);return{top:(g.top-O.top+h.top)/R.y,bottom:(O.bottom-g.bottom+h.bottom)/R.y,left:(g.left-O.left+h.left)/R.x,right:(O.right-g.right+h.right)/R.x}}const wo=e=>({name:"arrow",options:e,async fn(t){const{x:n,y:o,placement:l,rects:r,platform:s,elements:i,middlewareData:c}=t,{element:a,padding:m=0}=Je(e,t)||{};if(a==null)return{};const d=Yt(m),x={x:n,y:o},f=Ot(l),h=At(f),y=await s.getDimensions(a),E=f==="y",g=E?"top":"left",_=E?"bottom":"right",S=E?"clientHeight":"clientWidth",R=r.reference[h]+r.reference[f]-x[f]-r.floating[h],O=x[f]-r.reference[f],z=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a));let k=z?z[S]:0;(!k||!await(s.isElement==null?void 0:s.isElement(z)))&&(k=i.floating[S]||r.floating[h]);const q=R/2-O/2,ee=k/2-y[h]/2-1,ie=Ie(d[g],ee),oe=Ie(d[_],ee),W=ie,ne=k-y[h]-oe,C=k/2-y[h]/2+q,M=xt(W,C,ne),B=!c.arrow&&et(l)!=null&&C!==M&&r.reference[h]/2-(C<W?ie:oe)-y[h]/2<0,j=B?C<W?C-W:C-ne:0;return{[f]:x[f]+j,data:{[f]:M,centerOffset:C-M-j,...B&&{alignmentOffset:j}},reset:B}}}),go=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var n,o;const{placement:l,middlewareData:r,rects:s,initialPlacement:i,platform:c,elements:a}=t,{mainAxis:m=!0,crossAxis:d=!0,fallbackPlacements:x,fallbackStrategy:f="bestFit",fallbackAxisSideDirection:h="none",flipAlignment:y=!0,...E}=Je(e,t);if((n=r.arrow)!=null&&n.alignmentOffset)return{};const g=Se(l),_=Se(i)===i,S=await(c.isRTL==null?void 0:c.isRTL(a.floating)),R=x||(_||!y?[ft(i)]:po(i));!x&&h!=="none"&&R.push(...ho(i,y,h,S));const O=[i,...R],z=await Gt(t,E),k=[];let q=((o=r.flip)==null?void 0:o.overflows)||[];if(m&&k.push(z[g]),d){const W=fo(l,s,S);k.push(z[W[0]],z[W[1]])}if(q=[...q,{placement:l,overflows:k}],!k.every(W=>W<=0)){var ee,ie;const W=(((ee=r.flip)==null?void 0:ee.index)||0)+1,ne=O[W];if(ne)return{data:{index:W,overflows:q},reset:{placement:ne}};let C=(ie=q.filter(M=>M.overflows[0]<=0).sort((M,B)=>M.overflows[1]-B.overflows[1])[0])==null?void 0:ie.placement;if(!C)switch(f){case"bestFit":{var oe;const M=(oe=q.map(B=>[B.placement,B.overflows.filter(j=>j>0).reduce((j,ce)=>j+ce,0)]).sort((B,j)=>B[1]-j[1])[0])==null?void 0:oe[0];M&&(C=M);break}case"initialPlacement":C=i;break}if(l!==C)return{reset:{placement:C}}}return{}}}};async function bo(e,t){const{placement:n,platform:o,elements:l}=e,r=await(o.isRTL==null?void 0:o.isRTL(l.floating)),s=Se(n),i=et(n),c=pt(n)==="y",a=["left","top"].includes(s)?-1:1,m=r&&c?-1:1,d=Je(t,e);let{mainAxis:x,crossAxis:f,alignmentAxis:h}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...d};return i&&typeof h=="number"&&(f=i==="end"?h*-1:h),c?{x:f*m,y:x*a}:{x:x*a,y:f*m}}const xo=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var n,o;const{x:l,y:r,placement:s,middlewareData:i}=t,c=await bo(t,e);return s===((n=i.offset)==null?void 0:n.placement)&&(o=i.arrow)!=null&&o.alignmentOffset?{}:{x:l+c.x,y:r+c.y,data:{...c,placement:s}}}}},Eo=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:o,placement:l}=t,{mainAxis:r=!0,crossAxis:s=!1,limiter:i={fn:E=>{let{x:g,y:_}=E;return{x:g,y:_}}},...c}=Je(e,t),a={x:n,y:o},m=await Gt(t,c),d=pt(Se(l)),x=Xt(d);let f=a[x],h=a[d];if(r){const E=x==="y"?"top":"left",g=x==="y"?"bottom":"right",_=f+m[E],S=f-m[g];f=xt(_,f,S)}if(s){const E=d==="y"?"top":"left",g=d==="y"?"bottom":"right",_=h+m[E],S=h-m[g];h=xt(_,h,S)}const y=i.fn({...t,[x]:f,[d]:h});return{...y,data:{x:y.x-n,y:y.y-o}}}}};function he(e){return Ut(e)?(e.nodeName||"").toLowerCase():"#document"}function G(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function fe(e){var t;return(t=(Ut(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function Ut(e){return e instanceof Node||e instanceof G(e).Node}function ue(e){return e instanceof Element||e instanceof G(e).Element}function se(e){return e instanceof HTMLElement||e instanceof G(e).HTMLElement}function Bt(e){return typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof G(e).ShadowRoot}function tt(e){const{overflow:t,overflowX:n,overflowY:o,display:l}=J(e);return/auto|scroll|overlay|hidden|clip/.test(t+o+n)&&!["inline","contents"].includes(l)}function _o(e){return["table","td","th"].includes(he(e))}function Rt(e){const t=Tt(),n=J(e);return n.transform!=="none"||n.perspective!=="none"||(n.containerType?n.containerType!=="normal":!1)||!t&&(n.backdropFilter?n.backdropFilter!=="none":!1)||!t&&(n.filter?n.filter!=="none":!1)||["transform","perspective","filter"].some(o=>(n.willChange||"").includes(o))||["paint","layout","strict","content"].some(o=>(n.contain||"").includes(o))}function So(e){let t=We(e);for(;se(t)&&!mt(t);){if(Rt(t))return t;t=We(t)}return null}function Tt(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function mt(e){return["html","body","#document"].includes(he(e))}function J(e){return G(e).getComputedStyle(e)}function ht(e){return ue(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function We(e){if(he(e)==="html")return e;const t=e.assignedSlot||e.parentNode||Bt(e)&&e.host||fe(e);return Bt(t)?t.host:t}function Zt(e){const t=We(e);return mt(t)?e.ownerDocument?e.ownerDocument.body:e.body:se(t)&&tt(t)?t:Zt(t)}function Qe(e,t,n){var o;t===void 0&&(t=[]),n===void 0&&(n=!0);const l=Zt(e),r=l===((o=e.ownerDocument)==null?void 0:o.body),s=G(l);return r?t.concat(s,s.visualViewport||[],tt(l)?l:[],s.frameElement&&n?Qe(s.frameElement):[]):t.concat(l,Qe(l,[],n))}function Qt(e){const t=J(e);let n=parseFloat(t.width)||0,o=parseFloat(t.height)||0;const l=se(e),r=l?e.offsetWidth:n,s=l?e.offsetHeight:o,i=ut(n)!==r||ut(o)!==s;return i&&(n=r,o=s),{width:n,height:o,$:i}}function Ct(e){return ue(e)?e:e.contextElement}function Pe(e){const t=Ct(e);if(!se(t))return me(1);const n=t.getBoundingClientRect(),{width:o,height:l,$:r}=Qt(t);let s=(r?ut(n.width):n.width)/o,i=(r?ut(n.height):n.height)/l;return(!s||!Number.isFinite(s))&&(s=1),(!i||!Number.isFinite(i))&&(i=1),{x:s,y:i}}const Ao=me(0);function Jt(e){const t=G(e);return!Tt()||!t.visualViewport?Ao:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Oo(e,t,n){return t===void 0&&(t=!1),!n||t&&n!==G(e)?!1:t}function Ae(e,t,n,o){t===void 0&&(t=!1),n===void 0&&(n=!1);const l=e.getBoundingClientRect(),r=Ct(e);let s=me(1);t&&(o?ue(o)&&(s=Pe(o)):s=Pe(e));const i=Oo(r,n,o)?Jt(r):me(0);let c=(l.left+i.x)/s.x,a=(l.top+i.y)/s.y,m=l.width/s.x,d=l.height/s.y;if(r){const x=G(r),f=o&&ue(o)?G(o):o;let h=x,y=h.frameElement;for(;y&&o&&f!==h;){const E=Pe(y),g=y.getBoundingClientRect(),_=J(y),S=g.left+(y.clientLeft+parseFloat(_.paddingLeft))*E.x,R=g.top+(y.clientTop+parseFloat(_.paddingTop))*E.y;c*=E.x,a*=E.y,m*=E.x,d*=E.y,c+=S,a+=R,h=G(y),y=h.frameElement}}return dt({width:m,height:d,x:c,y:a})}const Ro=[":popover-open",":modal"];function eo(e){return Ro.some(t=>{try{return e.matches(t)}catch{return!1}})}function To(e){let{elements:t,rect:n,offsetParent:o,strategy:l}=e;const r=l==="fixed",s=fe(o),i=t?eo(t.floating):!1;if(o===s||i&&r)return n;let c={scrollLeft:0,scrollTop:0},a=me(1);const m=me(0),d=se(o);if((d||!d&&!r)&&((he(o)!=="body"||tt(s))&&(c=ht(o)),se(o))){const x=Ae(o);a=Pe(o),m.x=x.x+o.clientLeft,m.y=x.y+o.clientTop}return{width:n.width*a.x,height:n.height*a.y,x:n.x*a.x-c.scrollLeft*a.x+m.x,y:n.y*a.y-c.scrollTop*a.y+m.y}}function Co(e){return Array.from(e.getClientRects())}function to(e){return Ae(fe(e)).left+ht(e).scrollLeft}function Lo(e){const t=fe(e),n=ht(e),o=e.ownerDocument.body,l=_e(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),r=_e(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight);let s=-n.scrollLeft+to(e);const i=-n.scrollTop;return J(o).direction==="rtl"&&(s+=_e(t.clientWidth,o.clientWidth)-l),{width:l,height:r,x:s,y:i}}function ko(e,t){const n=G(e),o=fe(e),l=n.visualViewport;let r=o.clientWidth,s=o.clientHeight,i=0,c=0;if(l){r=l.width,s=l.height;const a=Tt();(!a||a&&t==="fixed")&&(i=l.offsetLeft,c=l.offsetTop)}return{width:r,height:s,x:i,y:c}}function No(e,t){const n=Ae(e,!0,t==="fixed"),o=n.top+e.clientTop,l=n.left+e.clientLeft,r=se(e)?Pe(e):me(1),s=e.clientWidth*r.x,i=e.clientHeight*r.y,c=l*r.x,a=o*r.y;return{width:s,height:i,x:c,y:a}}function Pt(e,t,n){let o;if(t==="viewport")o=ko(e,n);else if(t==="document")o=Lo(fe(e));else if(ue(t))o=No(t,n);else{const l=Jt(e);o={...t,x:t.x-l.x,y:t.y-l.y}}return dt(o)}function oo(e,t){const n=We(e);return n===t||!ue(n)||mt(n)?!1:J(n).position==="fixed"||oo(n,t)}function Do(e,t){const n=t.get(e);if(n)return n;let o=Qe(e,[],!1).filter(i=>ue(i)&&he(i)!=="body"),l=null;const r=J(e).position==="fixed";let s=r?We(e):e;for(;ue(s)&&!mt(s);){const i=J(s),c=Rt(s);!c&&i.position==="fixed"&&(l=null),(r?!c&&!l:!c&&i.position==="static"&&!!l&&["absolute","fixed"].includes(l.position)||tt(s)&&!c&&oo(e,s))?o=o.filter(m=>m!==s):l=i,s=We(s)}return t.set(e,o),o}function $o(e){let{element:t,boundary:n,rootBoundary:o,strategy:l}=e;const s=[...n==="clippingAncestors"?Do(t,this._c):[].concat(n),o],i=s[0],c=s.reduce((a,m)=>{const d=Pt(t,m,l);return a.top=_e(d.top,a.top),a.right=Ie(d.right,a.right),a.bottom=Ie(d.bottom,a.bottom),a.left=_e(d.left,a.left),a},Pt(t,i,l));return{width:c.right-c.left,height:c.bottom-c.top,x:c.left,y:c.top}}function Bo(e){const{width:t,height:n}=Qt(e);return{width:t,height:n}}function Po(e,t,n){const o=se(t),l=fe(t),r=n==="fixed",s=Ae(e,!0,r,t);let i={scrollLeft:0,scrollTop:0};const c=me(0);if(o||!o&&!r)if((he(t)!=="body"||tt(l))&&(i=ht(t)),o){const d=Ae(t,!0,r,t);c.x=d.x+t.clientLeft,c.y=d.y+t.clientTop}else l&&(c.x=to(l));const a=s.left+i.scrollLeft-c.x,m=s.top+i.scrollTop-c.y;return{x:a,y:m,width:s.width,height:s.height}}function It(e,t){return!se(e)||J(e).position==="fixed"?null:t?t(e):e.offsetParent}function no(e,t){const n=G(e);if(!se(e)||eo(e))return n;let o=It(e,t);for(;o&&_o(o)&&J(o).position==="static";)o=It(o,t);return o&&(he(o)==="html"||he(o)==="body"&&J(o).position==="static"&&!Rt(o))?n:o||So(e)||n}const Io=async function(e){const t=this.getOffsetParent||no,n=this.getDimensions;return{reference:Po(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,...await n(e.floating)}}};function Wo(e){return J(e).direction==="rtl"}const jo={convertOffsetParentRelativeRectToViewportRelativeRect:To,getDocumentElement:fe,getClippingRect:$o,getOffsetParent:no,getElementRects:Io,getClientRects:Co,getDimensions:Bo,getScale:Pe,isElement:ue,isRTL:Wo};function Mo(e,t){let n=null,o;const l=fe(e);function r(){var i;clearTimeout(o),(i=n)==null||i.disconnect(),n=null}function s(i,c){i===void 0&&(i=!1),c===void 0&&(c=1),r();const{left:a,top:m,width:d,height:x}=e.getBoundingClientRect();if(i||t(),!d||!x)return;const f=at(m),h=at(l.clientWidth-(a+d)),y=at(l.clientHeight-(m+x)),E=at(a),_={rootMargin:-f+"px "+-h+"px "+-y+"px "+-E+"px",threshold:_e(0,Ie(1,c))||1};let S=!0;function R(O){const z=O[0].intersectionRatio;if(z!==c){if(!S)return s();z?s(!1,z):o=setTimeout(()=>{s(!1,1e-7)},100)}S=!1}try{n=new IntersectionObserver(R,{..._,root:l.ownerDocument})}catch{n=new IntersectionObserver(R,_)}n.observe(e)}return s(!0),r}function Fo(e,t,n,o){o===void 0&&(o={});const{ancestorScroll:l=!0,ancestorResize:r=!0,elementResize:s=typeof ResizeObserver=="function",layoutShift:i=typeof IntersectionObserver=="function",animationFrame:c=!1}=o,a=Ct(e),m=l||r?[...a?Qe(a):[],...Qe(t)]:[];m.forEach(g=>{l&&g.addEventListener("scroll",n,{passive:!0}),r&&g.addEventListener("resize",n)});const d=a&&i?Mo(a,n):null;let x=-1,f=null;s&&(f=new ResizeObserver(g=>{let[_]=g;_&&_.target===a&&f&&(f.unobserve(t),cancelAnimationFrame(x),x=requestAnimationFrame(()=>{var S;(S=f)==null||S.observe(t)})),n()}),a&&!c&&f.observe(a),f.observe(t));let h,y=c?Ae(e):null;c&&E();function E(){const g=Ae(e);y&&(g.x!==y.x||g.y!==y.y||g.width!==y.width||g.height!==y.height)&&n(),y=g,h=requestAnimationFrame(E)}return n(),()=>{var g;m.forEach(_=>{l&&_.removeEventListener("scroll",n),r&&_.removeEventListener("resize",n)}),d?.(),(g=f)==null||g.disconnect(),f=null,c&&cancelAnimationFrame(h)}}const Ho=Eo,zo=go,Vo=wo,Wt=(e,t,n)=>{const o=new Map,l={platform:jo,...n},r={...l.platform,_c:o};return yo(e,t,{...l,platform:r})};var ro={exports:{}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/(function(e){(function(){var t={}.hasOwnProperty;function n(){for(var r="",s=0;s<arguments.length;s++){var i=arguments[s];i&&(r=l(r,o(i)))}return r}function o(r){if(typeof r=="string"||typeof r=="number")return r;if(typeof r!="object")return"";if(Array.isArray(r))return n.apply(null,r);if(r.toString!==Object.prototype.toString&&!r.toString.toString().includes("[native code]"))return r.toString();var s="";for(var i in r)t.call(r,i)&&r[i]&&(s=l(s,i));return s}function l(r,s){return s?r?r+" "+s:r+s:r}e.exports?(n.default=n,e.exports=n):window.classNames=n})()})(ro);var Ko=ro.exports;const _t=co(Ko);var jt={};const qo="react-tooltip-core-styles",Xo="react-tooltip-base-styles",Mt={core:!1,base:!1};function Ft({css:e,id:t=Xo,type:n="base",ref:o}){var l,r;if(!e||typeof document>"u"||Mt[n]||n==="core"&&typeof process<"u"&&(!((l=process==null?void 0:jt)===null||l===void 0)&&l.REACT_TOOLTIP_DISABLE_CORE_STYLES)||n!=="base"&&typeof process<"u"&&(!((r=process==null?void 0:jt)===null||r===void 0)&&r.REACT_TOOLTIP_DISABLE_BASE_STYLES))return;n==="core"&&(t=qo),o||(o={});const{insertAt:s}=o;if(document.getElementById(t))return void console.warn(`[react-tooltip] Element with id '${t}' already exists. Call \`removeStyle()\` first`);const i=document.head||document.getElementsByTagName("head")[0],c=document.createElement("style");c.id=t,c.type="text/css",s==="top"&&i.firstChild?i.insertBefore(c,i.firstChild):i.appendChild(c),c.styleSheet?c.styleSheet.cssText=e:c.appendChild(document.createTextNode(e)),Mt[n]=!0}const Ht=async({elementReference:e=null,tooltipReference:t=null,tooltipArrowReference:n=null,place:o="top",offset:l=10,strategy:r="absolute",middlewares:s=[xo(Number(l)),zo({fallbackAxisSideDirection:"start"}),Ho({padding:5})],border:i})=>{if(!e)return{tooltipStyles:{},tooltipArrowStyles:{},place:o};if(t===null)return{tooltipStyles:{},tooltipArrowStyles:{},place:o};const c=s;return n?(c.push(Vo({element:n,padding:5})),Wt(e,t,{placement:o,strategy:r,middleware:c}).then(({x:a,y:m,placement:d,middlewareData:x})=>{var f,h;const y={left:`${a}px`,top:`${m}px`,border:i},{x:E,y:g}=(f=x.arrow)!==null&&f!==void 0?f:{x:0,y:0},_=(h={top:"bottom",right:"left",bottom:"top",left:"right"}[d.split("-")[0]])!==null&&h!==void 0?h:"bottom",S=i&&{borderBottom:i,borderRight:i};let R=0;if(i){const O=`${i}`.match(/(\d+)px/);R=O?.[1]?Number(O[1]):1}return{tooltipStyles:y,tooltipArrowStyles:{left:E!=null?`${E}px`:"",top:g!=null?`${g}px`:"",right:"",bottom:"",...S,[_]:`-${4+R}px`},place:d}})):Wt(e,t,{placement:"bottom",strategy:r,middleware:c}).then(({x:a,y:m,placement:d})=>({tooltipStyles:{left:`${a}px`,top:`${m}px`},tooltipArrowStyles:{},place:d}))},zt=(e,t)=>!("CSS"in window&&"supports"in window.CSS)||window.CSS.supports(e,t),Vt=(e,t,n)=>{let o=null;const l=function(...r){const s=()=>{o=null,n||e.apply(this,r)};n&&!o&&(e.apply(this,r),o=setTimeout(s,t)),n||(o&&clearTimeout(o),o=setTimeout(s,t))};return l.cancel=()=>{o&&(clearTimeout(o),o=null)},l},Kt=e=>e!==null&&!Array.isArray(e)&&typeof e=="object",St=(e,t)=>{if(e===t)return!0;if(Array.isArray(e)&&Array.isArray(t))return e.length===t.length&&e.every((l,r)=>St(l,t[r]));if(Array.isArray(e)!==Array.isArray(t))return!1;if(!Kt(e)||!Kt(t))return e===t;const n=Object.keys(e),o=Object.keys(t);return n.length===o.length&&n.every(l=>St(e[l],t[l]))},Yo=e=>{if(!(e instanceof HTMLElement||e instanceof SVGElement))return!1;const t=getComputedStyle(e);return["overflow","overflow-x","overflow-y"].some(n=>{const o=t.getPropertyValue(n);return o==="auto"||o==="scroll"})},qt=e=>{if(!e)return null;let t=e.parentElement;for(;t;){if(Yo(t))return t;t=t.parentElement}return document.scrollingElement||document.documentElement},Go=typeof window<"u"?p.useLayoutEffect:p.useEffect,Uo="DEFAULT_TOOLTIP_ID",Zo={anchorRefs:new Set,activeAnchor:{current:null},attach:()=>{},detach:()=>{},setActiveAnchor:()=>{}},Qo=p.createContext({getTooltipData:()=>Zo});function lo(e=Uo){return p.useContext(Qo).getTooltipData(e)}var Be={tooltip:"core-styles-module_tooltip__3vRRp",fixed:"core-styles-module_fixed__pcSol",arrow:"core-styles-module_arrow__cvMwQ",noArrow:"core-styles-module_noArrow__xock6",clickable:"core-styles-module_clickable__ZuTTB",show:"core-styles-module_show__Nt9eE",closing:"core-styles-module_closing__sGnxF"},bt={tooltip:"styles-module_tooltip__mnnfp",arrow:"styles-module_arrow__K0L3T",dark:"styles-module_dark__xNqje",light:"styles-module_light__Z6W-X",success:"styles-module_success__A2AKt",warning:"styles-module_warning__SCK0X",error:"styles-module_error__JvumD",info:"styles-module_info__BWdHW"};const Jo=({forwardRef:e,id:t,className:n,classNameArrow:o,variant:l="dark",anchorId:r,anchorSelect:s,place:i="top",offset:c=10,events:a=["hover"],openOnClick:m=!1,positionStrategy:d="absolute",middlewares:x,wrapper:f,delayShow:h=0,delayHide:y=0,float:E=!1,hidden:g=!1,noArrow:_=!1,clickable:S=!1,closeOnEsc:R=!1,closeOnScroll:O=!1,closeOnResize:z=!1,openEvents:k,closeEvents:q,globalCloseEvents:ee,imperativeModeOnly:ie,style:oe,position:W,afterShow:ne,afterHide:C,content:M,contentWrapperRef:B,isOpen:j,defaultIsOpen:ce=!1,setIsOpen:ve,activeAnchor:D,setActiveAnchor:Oe,border:ot,opacity:nt,arrowColor:rt,role:vt="tooltip"})=>{var je;const V=p.useRef(null),Re=p.useRef(null),F=p.useRef(null),U=p.useRef(null),ye=p.useRef(null),[de,yt]=p.useState({tooltipStyles:{},tooltipArrowStyles:{},place:i}),[X,lt]=p.useState(!1),[we,ge]=p.useState(!1),[N,Me]=p.useState(null),Fe=p.useRef(!1),He=p.useRef(null),{anchorRefs:ze,setActiveAnchor:st}=lo(t),Te=p.useRef(!1),[pe,Ve]=p.useState([]),be=p.useRef(!1),Ce=m||a.includes("click"),Ke=Ce||k?.click||k?.dblclick||k?.mousedown,Le=k?{...k}:{mouseenter:!0,focus:!0,click:!1,dblclick:!1,mousedown:!1};!k&&Ce&&Object.assign(Le,{mouseenter:!1,focus:!1,click:!0});const qe=q?{...q}:{mouseleave:!0,blur:!0,click:!1,dblclick:!1,mouseup:!1};!q&&Ce&&Object.assign(qe,{mouseleave:!1,blur:!1});const te=ee?{...ee}:{escape:R||!1,scroll:O||!1,resize:z||!1,clickOutsideAnchor:Ke||!1};ie&&(Object.assign(Le,{mouseenter:!1,focus:!1,click:!1,dblclick:!1,mousedown:!1}),Object.assign(qe,{mouseleave:!1,blur:!1,click:!1,dblclick:!1,mouseup:!1}),Object.assign(te,{escape:!1,scroll:!1,resize:!1,clickOutsideAnchor:!1})),Go(()=>(be.current=!0,()=>{be.current=!1}),[]);const $=u=>{be.current&&(u&&ge(!0),setTimeout(()=>{be.current&&(ve?.(u),j===void 0&&lt(u))},10))};p.useEffect(()=>{if(j===void 0)return()=>null;j&&ge(!0);const u=setTimeout(()=>{lt(j)},10);return()=>{clearTimeout(u)}},[j]),p.useEffect(()=>{if(X!==Fe.current)if(ye.current&&clearTimeout(ye.current),Fe.current=X,X)ne?.();else{const u=(w=>{const b=w.match(/^([\d.]+)(ms|s)$/);if(!b)return 0;const[,I,H]=b;return Number(I)*(H==="ms"?1:1e3)})(getComputedStyle(document.body).getPropertyValue("--rt-transition-show-delay"));ye.current=setTimeout(()=>{ge(!1),Me(null),C?.()},u+25)}},[X]);const it=u=>{yt(w=>St(w,u)?w:u)},Xe=(u=h)=>{F.current&&clearTimeout(F.current),we?$(!0):F.current=setTimeout(()=>{$(!0)},u)},ke=(u=y)=>{U.current&&clearTimeout(U.current),U.current=setTimeout(()=>{Te.current||$(!1)},u)},Ye=u=>{var w;if(!u)return;const b=(w=u.currentTarget)!==null&&w!==void 0?w:u.target;if(!b?.isConnected)return Oe(null),void st({current:null});h?Xe():$(!0),Oe(b),st({current:b}),U.current&&clearTimeout(U.current)},Ne=()=>{S?ke(y||100):y?ke():$(!1),F.current&&clearTimeout(F.current)},De=({x:u,y:w})=>{var b;const I={getBoundingClientRect:()=>({x:u,y:w,width:0,height:0,top:w,left:u,right:u,bottom:w})};Ht({place:(b=N?.place)!==null&&b!==void 0?b:i,offset:c,elementReference:I,tooltipReference:V.current,tooltipArrowReference:Re.current,strategy:d,middlewares:x,border:ot}).then(H=>{it(H)})},$e=u=>{if(!u)return;const w=u,b={x:w.clientX,y:w.clientY};De(b),He.current=b},Ge=u=>{var w;if(!X)return;const b=u.target;b.isConnected&&(!((w=V.current)===null||w===void 0)&&w.contains(b)||[document.querySelector(`[id='${r}']`),...pe].some(I=>I?.contains(b))||($(!1),F.current&&clearTimeout(F.current)))},ct=Vt(Ye,50,!0),P=Vt(Ne,50,!0),Z=u=>{P.cancel(),ct(u)},v=()=>{ct.cancel(),P()},A=p.useCallback(()=>{var u,w;const b=(u=N?.position)!==null&&u!==void 0?u:W;b?De(b):E?He.current&&De(He.current):D?.isConnected&&Ht({place:(w=N?.place)!==null&&w!==void 0?w:i,offset:c,elementReference:D,tooltipReference:V.current,tooltipArrowReference:Re.current,strategy:d,middlewares:x,border:ot}).then(I=>{be.current&&it(I)})},[X,D,M,oe,i,N?.place,c,d,W,N?.position,E]);p.useEffect(()=>{var u,w;const b=new Set(ze);pe.forEach(T=>{b.add({current:T})});const I=document.querySelector(`[id='${r}']`);I&&b.add({current:I});const H=()=>{$(!1)},re=qt(D),le=qt(V.current);te.scroll&&(window.addEventListener("scroll",H),re?.addEventListener("scroll",H),le?.addEventListener("scroll",H));let K=null;te.resize?window.addEventListener("resize",H):D&&V.current&&(K=Fo(D,V.current,A,{ancestorResize:!0,elementResize:!0,layoutShift:!0}));const Q=T=>{T.key==="Escape"&&$(!1)};te.escape&&window.addEventListener("keydown",Q),te.clickOutsideAnchor&&window.addEventListener("click",Ge);const L=[],Ue=T=>{X&&T?.target===D||Ye(T)},so=T=>{X&&T?.target===D&&Ne()},Lt=["mouseenter","mouseleave","focus","blur"],kt=["click","dblclick","mousedown","mouseup"];Object.entries(Le).forEach(([T,ae])=>{ae&&(Lt.includes(T)?L.push({event:T,listener:Z}):kt.includes(T)&&L.push({event:T,listener:Ue}))}),Object.entries(qe).forEach(([T,ae])=>{ae&&(Lt.includes(T)?L.push({event:T,listener:v}):kt.includes(T)&&L.push({event:T,listener:so}))}),E&&L.push({event:"pointermove",listener:$e});const Nt=()=>{Te.current=!0},Dt=()=>{Te.current=!1,Ne()};return S&&!Ke&&((u=V.current)===null||u===void 0||u.addEventListener("mouseenter",Nt),(w=V.current)===null||w===void 0||w.addEventListener("mouseleave",Dt)),L.forEach(({event:T,listener:ae})=>{b.forEach(wt=>{var Ze;(Ze=wt.current)===null||Ze===void 0||Ze.addEventListener(T,ae)})}),()=>{var T,ae;te.scroll&&(window.removeEventListener("scroll",H),re?.removeEventListener("scroll",H),le?.removeEventListener("scroll",H)),te.resize?window.removeEventListener("resize",H):K?.(),te.clickOutsideAnchor&&window.removeEventListener("click",Ge),te.escape&&window.removeEventListener("keydown",Q),S&&!Ke&&((T=V.current)===null||T===void 0||T.removeEventListener("mouseenter",Nt),(ae=V.current)===null||ae===void 0||ae.removeEventListener("mouseleave",Dt)),L.forEach(({event:wt,listener:Ze})=>{b.forEach(io=>{var gt;(gt=io.current)===null||gt===void 0||gt.removeEventListener(wt,Ze)})})}},[D,A,we,ze,pe,k,q,ee,Ce,h,y]),p.useEffect(()=>{var u,w;let b=(w=(u=N?.anchorSelect)!==null&&u!==void 0?u:s)!==null&&w!==void 0?w:"";!b&&t&&(b=`[data-tooltip-id='${t}']`);const I=new MutationObserver(H=>{const re=[],le=[];H.forEach(K=>{if(K.type==="attributes"&&K.attributeName==="data-tooltip-id"&&(K.target.getAttribute("data-tooltip-id")===t?re.push(K.target):K.oldValue===t&&le.push(K.target)),K.type==="childList"){if(D){const Q=[...K.removedNodes].filter(L=>L.nodeType===1);if(b)try{le.push(...Q.filter(L=>L.matches(b))),le.push(...Q.flatMap(L=>[...L.querySelectorAll(b)]))}catch{}Q.some(L=>{var Ue;return!!(!((Ue=L?.contains)===null||Ue===void 0)&&Ue.call(L,D))&&(ge(!1),$(!1),Oe(null),F.current&&clearTimeout(F.current),U.current&&clearTimeout(U.current),!0)})}if(b)try{const Q=[...K.addedNodes].filter(L=>L.nodeType===1);re.push(...Q.filter(L=>L.matches(b))),re.push(...Q.flatMap(L=>[...L.querySelectorAll(b)]))}catch{}}}),(re.length||le.length)&&Ve(K=>[...K.filter(Q=>!le.includes(Q)),...re])});return I.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-tooltip-id"],attributeOldValue:!0}),()=>{I.disconnect()}},[t,s,N?.anchorSelect,D]),p.useEffect(()=>{A()},[A]),p.useEffect(()=>{if(!B?.current)return()=>null;const u=new ResizeObserver(()=>{setTimeout(()=>A())});return u.observe(B.current),()=>{u.disconnect()}},[M,B?.current]),p.useEffect(()=>{var u;const w=document.querySelector(`[id='${r}']`),b=[...pe,w];D&&b.includes(D)||Oe((u=pe[0])!==null&&u!==void 0?u:w)},[r,pe,D]),p.useEffect(()=>(ce&&$(!0),()=>{F.current&&clearTimeout(F.current),U.current&&clearTimeout(U.current)}),[]),p.useEffect(()=>{var u;let w=(u=N?.anchorSelect)!==null&&u!==void 0?u:s;if(!w&&t&&(w=`[data-tooltip-id='${t}']`),w)try{const b=Array.from(document.querySelectorAll(w));Ve(b)}catch{Ve([])}},[t,s,N?.anchorSelect]),p.useEffect(()=>{F.current&&(clearTimeout(F.current),Xe(h))},[h]);const Y=(je=N?.content)!==null&&je!==void 0?je:M,xe=X&&Object.keys(de.tooltipStyles).length>0;return p.useImperativeHandle(e,()=>({open:u=>{if(u?.anchorSelect)try{document.querySelector(u.anchorSelect)}catch{return void console.warn(`[react-tooltip] "${u.anchorSelect}" is not a valid CSS selector`)}Me(u??null),u?.delay?Xe(u.delay):$(!0)},close:u=>{u?.delay?ke(u.delay):$(!1)},activeAnchor:D,place:de.place,isOpen:!!(we&&!g&&Y&&xe)})),we&&!g&&Y?Ee.createElement(f,{id:t,role:vt,className:_t("react-tooltip",Be.tooltip,bt.tooltip,bt[l],n,`react-tooltip__place-${de.place}`,Be[xe?"show":"closing"],xe?"react-tooltip__show":"react-tooltip__closing",d==="fixed"&&Be.fixed,S&&Be.clickable),onTransitionEnd:u=>{ye.current&&clearTimeout(ye.current),X||u.propertyName!=="opacity"||(ge(!1),Me(null),C?.())},style:{...oe,...de.tooltipStyles,opacity:nt!==void 0&&xe?nt:void 0},ref:V},Y,Ee.createElement(f,{className:_t("react-tooltip-arrow",Be.arrow,bt.arrow,o,_&&Be.noArrow),style:{...de.tooltipArrowStyles,background:rt?`linear-gradient(to right bottom, transparent 50%, ${rt} 50%)`:void 0},ref:Re})):null},en=({content:e})=>Ee.createElement("span",{dangerouslySetInnerHTML:{__html:e}}),on=Ee.forwardRef(({id:e,anchorId:t,anchorSelect:n,content:o,html:l,render:r,className:s,classNameArrow:i,variant:c="dark",place:a="top",offset:m=10,wrapper:d="div",children:x=null,events:f=["hover"],openOnClick:h=!1,positionStrategy:y="absolute",middlewares:E,delayShow:g=0,delayHide:_=0,float:S=!1,hidden:R=!1,noArrow:O=!1,clickable:z=!1,closeOnEsc:k=!1,closeOnScroll:q=!1,closeOnResize:ee=!1,openEvents:ie,closeEvents:oe,globalCloseEvents:W,imperativeModeOnly:ne=!1,style:C,position:M,isOpen:B,defaultIsOpen:j=!1,disableStyleInjection:ce=!1,border:ve,opacity:D,arrowColor:Oe,setIsOpen:ot,afterShow:nt,afterHide:rt,role:vt="tooltip"},je)=>{const[V,Re]=p.useState(o),[F,U]=p.useState(l),[ye,de]=p.useState(a),[yt,X]=p.useState(c),[lt,we]=p.useState(m),[ge,N]=p.useState(g),[Me,Fe]=p.useState(_),[He,ze]=p.useState(S),[st,Te]=p.useState(R),[pe,Ve]=p.useState(d),[be,Ce]=p.useState(f),[Ke,Le]=p.useState(y),[qe,te]=p.useState(null),[$,it]=p.useState(null),Xe=p.useRef(ce),{anchorRefs:ke,activeAnchor:Ye}=lo(e),Ne=P=>P?.getAttributeNames().reduce((Z,v)=>{var A;return v.startsWith("data-tooltip-")&&(Z[v.replace(/^data-tooltip-/,"")]=(A=P?.getAttribute(v))!==null&&A!==void 0?A:null),Z},{}),De=P=>{const Z={place:v=>{var A;de((A=v)!==null&&A!==void 0?A:a)},content:v=>{Re(v??o)},html:v=>{U(v??l)},variant:v=>{var A;X((A=v)!==null&&A!==void 0?A:c)},offset:v=>{we(v===null?m:Number(v))},wrapper:v=>{var A;Ve((A=v)!==null&&A!==void 0?A:d)},events:v=>{const A=v?.split(" ");Ce(A??f)},"position-strategy":v=>{var A;Le((A=v)!==null&&A!==void 0?A:y)},"delay-show":v=>{N(v===null?g:Number(v))},"delay-hide":v=>{Fe(v===null?_:Number(v))},float:v=>{ze(v===null?S:v==="true")},hidden:v=>{Te(v===null?R:v==="true")},"class-name":v=>{te(v)}};Object.values(Z).forEach(v=>v(null)),Object.entries(P).forEach(([v,A])=>{var Y;(Y=Z[v])===null||Y===void 0||Y.call(Z,A)})};p.useEffect(()=>{Re(o)},[o]),p.useEffect(()=>{U(l)},[l]),p.useEffect(()=>{de(a)},[a]),p.useEffect(()=>{X(c)},[c]),p.useEffect(()=>{we(m)},[m]),p.useEffect(()=>{N(g)},[g]),p.useEffect(()=>{Fe(_)},[_]),p.useEffect(()=>{ze(S)},[S]),p.useEffect(()=>{Te(R)},[R]),p.useEffect(()=>{Le(y)},[y]),p.useEffect(()=>{Xe.current!==ce&&console.warn("[react-tooltip] Do not change `disableStyleInjection` dynamically.")},[ce]),p.useEffect(()=>{typeof window<"u"&&window.dispatchEvent(new CustomEvent("react-tooltip-inject-styles",{detail:{disableCore:ce==="core",disableBase:ce}}))},[]),p.useEffect(()=>{var P;const Z=new Set(ke);let v=n;if(!v&&e&&(v=`[data-tooltip-id='${e}']`),v)try{document.querySelectorAll(v).forEach(w=>{Z.add({current:w})})}catch{console.warn(`[react-tooltip] "${v}" is not a valid CSS selector`)}const A=document.querySelector(`[id='${t}']`);if(A&&Z.add({current:A}),!Z.size)return()=>null;const Y=(P=$??A)!==null&&P!==void 0?P:Ye.current,xe=new MutationObserver(w=>{w.forEach(b=>{var I;if(!Y||b.type!=="attributes"||!(!((I=b.attributeName)===null||I===void 0)&&I.startsWith("data-tooltip-")))return;const H=Ne(Y);De(H)})}),u={attributes:!0,childList:!1,subtree:!1};if(Y){const w=Ne(Y);De(w),xe.observe(Y,u)}return()=>{xe.disconnect()}},[ke,Ye,$,t,n]),p.useEffect(()=>{C?.border&&console.warn("[react-tooltip] Do not set `style.border`. Use `border` prop instead."),ve&&!zt("border",`${ve}`)&&console.warn(`[react-tooltip] "${ve}" is not a valid \`border\`.`),C?.opacity&&console.warn("[react-tooltip] Do not set `style.opacity`. Use `opacity` prop instead."),D&&!zt("opacity",`${D}`)&&console.warn(`[react-tooltip] "${D}" is not a valid \`opacity\`.`)},[]);let $e=x;const Ge=p.useRef(null);if(r){const P=r({content:$?.getAttribute("data-tooltip-content")||V||null,activeAnchor:$});$e=P?Ee.createElement("div",{ref:Ge,className:"react-tooltip-content-wrapper"},P):null}else V&&($e=V);F&&($e=Ee.createElement(en,{content:F}));const ct={forwardRef:je,id:e,anchorId:t,anchorSelect:n,className:_t(s,qe),classNameArrow:i,content:$e,contentWrapperRef:Ge,place:ye,variant:yt,offset:lt,wrapper:pe,events:be,openOnClick:h,positionStrategy:Ke,middlewares:E,delayShow:ge,delayHide:Me,float:He,hidden:st,noArrow:O,clickable:z,closeOnEsc:k,closeOnScroll:q,closeOnResize:ee,openEvents:ie,closeEvents:oe,globalCloseEvents:W,imperativeModeOnly:ne,style:C,position:M,isOpen:B,defaultIsOpen:j,border:ve,opacity:D,arrowColor:Oe,setIsOpen:ot,afterShow:nt,afterHide:rt,activeAnchor:$,setActiveAnchor:P=>it(P),role:vt};return Ee.createElement(Jo,{...ct})});typeof window<"u"&&window.addEventListener("react-tooltip-inject-styles",e=>{e.detail.disableCore||Ft({css:":root{--rt-color-white:#fff;--rt-color-dark:#222;--rt-color-success:#8dc572;--rt-color-error:#be6464;--rt-color-warning:#f0ad4e;--rt-color-info:#337ab7;--rt-opacity:0.9;--rt-transition-show-delay:0.15s;--rt-transition-closing-delay:0.15s}.core-styles-module_tooltip__3vRRp{position:absolute;top:0;left:0;pointer-events:none;opacity:0;will-change:opacity}.core-styles-module_fixed__pcSol{position:fixed}.core-styles-module_arrow__cvMwQ{position:absolute;background:inherit}.core-styles-module_noArrow__xock6{display:none}.core-styles-module_clickable__ZuTTB{pointer-events:auto}.core-styles-module_show__Nt9eE{opacity:var(--rt-opacity);transition:opacity var(--rt-transition-show-delay)ease-out}.core-styles-module_closing__sGnxF{opacity:0;transition:opacity var(--rt-transition-closing-delay)ease-in}",type:"core"}),e.detail.disableBase||Ft({css:`
.styles-module_tooltip__mnnfp{padding:8px 16px;border-radius:3px;font-size:90%;width:max-content}.styles-module_arrow__K0L3T{width:8px;height:8px}[class*='react-tooltip__place-top']>.styles-module_arrow__K0L3T{transform:rotate(45deg)}[class*='react-tooltip__place-right']>.styles-module_arrow__K0L3T{transform:rotate(135deg)}[class*='react-tooltip__place-bottom']>.styles-module_arrow__K0L3T{transform:rotate(225deg)}[class*='react-tooltip__place-left']>.styles-module_arrow__K0L3T{transform:rotate(315deg)}.styles-module_dark__xNqje{background:var(--rt-color-dark);color:var(--rt-color-white)}.styles-module_light__Z6W-X{background-color:var(--rt-color-white);color:var(--rt-color-dark)}.styles-module_success__A2AKt{background-color:var(--rt-color-success);color:var(--rt-color-white)}.styles-module_warning__SCK0X{background-color:var(--rt-color-warning);color:var(--rt-color-white)}.styles-module_error__JvumD{background-color:var(--rt-color-error);color:var(--rt-color-white)}.styles-module_info__BWdHW{background-color:var(--rt-color-info);color:var(--rt-color-white)}`,type:"base"})});export{on as Tooltip};