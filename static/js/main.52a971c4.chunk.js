(this["webpackJsonphistory-viewer"]=this["webpackJsonphistory-viewer"]||[]).push([[0],{16:function(e,n,t){},31:function(e,n,t){},32:function(e,n,t){},33:function(e,n,t){"use strict";t.r(n);var r=t(1),c=t.n(r),o=t(11),a=t.n(o),i=(t(16),t(3)),l=t(0),s=function(e){var n=e.topic,t=e.selectItem;return Object(l.jsxs)(l.Fragment,{children:[n.name,Object(l.jsx)("ul",{children:n.items.map((function(e){return Object(l.jsx)("li",{children:Object(l.jsx)("a",{href:"#".concat(n.name,"/").concat(e.name),onClick:function(n){n.preventDefault(),t(e)},children:e.name})},"navlink-".concat(e.name))}))})]})},u=function(e){var n=e.topics,t=e.selectItem;return Object(l.jsx)(l.Fragment,{children:n.map((function(e){return Object(l.jsx)(s,{topic:e,selectItem:t},"topic-".concat(e.name))}))})},d=t(4),f=t(2),h=function e(n){return"text"===n.type?n.data:"tag"===n.type?n.children.map((function(n){return e(n)})).join("\n"):""};t(31);var m=function(e){var n=e.initialItem,t=e.onClickUrl,o=Object(r.useState)(),a=Object(i.a)(o,2),s=a[0],u=a[1];Object(r.useEffect)((function(){if(void 0!==n&&void 0===s){var e=new Headers;e.append("pragma","no-cache"),e.append("cache-control","no-cache"),fetch(n.publishUrl,{headers:e}).then((function(e){return e.text()})).then((function(e){u(e)}))}}),[s]);var d=c.a.useCallback((function(e){if("tag"===e.type){var n=e;if("a"===n.tagName)return Object(l.jsx)("a",{style:{cursor:"pointer"},onClick:function(){return t(n.attribs.href)},children:Object(f.b)(n.children)})}}),[t]);if(void 0===n)return null;if(void 0===s)return Object(l.jsx)("div",{children:"Loading"});var h=Object(f.a)(s,{replace:d});return Object(l.jsx)("div",{id:"reader",children:h})},v=(t(32),function(){var e,n=Object(r.useState)(),t=Object(i.a)(n,2),o=t[0],a=t[1],s=Object(r.useState)(),v=Object(i.a)(s,2),b=v[0],j=v[1],p=c.a.useMemo((function(){return void 0!==o&&void 0!==b?function(e,n){var t,r=Object(d.a)(e);try{for(r.s();!(t=r.n()).done;){var c=t.value;if(c.items.some((function(e){return e===n})))return c}}catch(o){r.e(o)}finally{r.f()}throw Error("No topic found")}(o,b):void 0}),[b]);return Object(r.useEffect)((function(){void 0===o&&function(){var e=new Headers;return e.append("pragma","no-cache"),e.append("cache-control","no-cache"),fetch("https://docs.google.com/document/d/e/2PACX-1vQvXnfWjCvELzplW7pWR4SU63EJpGZ38b5tq7G2JKHqY6qf8RJOnabaYDSwXGsvbC8CTqq3ieXlzvnR/pub?embedded=true",{headers:e}).then((function(e){return e.text()})).then((function(e){console.log(e);var n=Object(f.c)(e);if(0===n.length)throw new Error("Hiba a f\u0151tartalomjegyz\xe9k feldolgoz\xe1sa k\xf6zben! html");var t=n[0];console.log(t);var r=t.children.find((function(e){return"tag"===e.type&&"body"===e.name}));if(console.log(r),void 0===r)throw new Error("Hiba a f\u0151tartalomjegyz\xe9k feldolgoz\xe1sa k\xf6zben! body");var c,o=[],a={name:"",items:[]},i={name:"",publishUrl:"",realUrl:""},l=function(){0!==i.name.length&&0!==i.publishUrl.length&&0!==i.realUrl.length&&(a.items.push(i),console.log("Persisting item: ",i.name))},s=function(){l(),0!==a.name.length&&(o.push(a),console.log("Persisting topic: ",a.name))},u=Object(d.a)(r.children);try{for(u.s();!(c=u.n()).done;){var m=c.value;if("tag"===m.type){var v=m;if("h1"===v.name){s();var b=h(v);a={name:b,items:[]},i={name:"",publishUrl:"",realUrl:""},console.log("Reading topic: ",a.name)}else if("h2"===v.name)l(),i={name:h(v),publishUrl:"",realUrl:""},console.log("Reading item: ",i.name);else if("p"===v.name){var j=h(v).replace(/\/$/,"");j.startsWith("https://docs.google.com/document/d/e/")?(console.log("Found publish url..."),i.publishUrl=j):j.startsWith("https://docs.google.com/document/d/")&&(console.log("Found real url..."),i.realUrl=j)}}}}catch(p){u.e(p)}finally{u.f()}return s(),o}))}().then((function(e){a(e),j(e[0].items[0])}))}),[o]),void 0===o?Object(l.jsx)(l.Fragment,{children:"Loading"}):Object(l.jsxs)("div",{id:"content",children:[Object(l.jsx)("h1",{children:null===p||void 0===p?void 0:p.name}),Object(l.jsx)("hr",{}),Object(l.jsx)(m,{initialItem:b,onClickUrl:function(e){if(void 0!==o){var n=e.match(/id%3D(.*)&sa.*/),t=(null!==n&&void 0!==n?n:["","-"])[1];console.log(t);var r=function(e,n){var t,r=Object(d.a)(e);try{for(r.s();!(t=r.n()).done;){var c,o=t.value,a=Object(d.a)(o.items);try{for(a.s();!(c=a.n()).done;){var i=c.value;if(i.realUrl.endsWith(n))return i}}catch(l){a.e(l)}finally{a.f()}}}catch(l){r.e(l)}finally{r.f()}}(o,t);console.log(r),r&&j(r)}}},null!==(e=null===b||void 0===b?void 0:b.realUrl)&&void 0!==e?e:"not-selected"),Object(l.jsx)("hr",{}),Object(l.jsx)(u,{topics:o,selectItem:function(e){j(e)}})]})}),b=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,34)).then((function(n){var t=n.getCLS,r=n.getFID,c=n.getFCP,o=n.getLCP,a=n.getTTFB;t(e),r(e),c(e),o(e),a(e)}))};a.a.render(Object(l.jsx)(c.a.StrictMode,{children:Object(l.jsx)(v,{})}),document.getElementById("root")),b()}},[[33,1,2]]]);
//# sourceMappingURL=main.52a971c4.chunk.js.map