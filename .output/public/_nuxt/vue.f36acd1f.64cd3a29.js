import{B as o,r as u,C as f,i as d,D as v,E as i,G as l,H as h,I as m}from"./entry.9eb3698e.js";function U(t,a={}){const e=a.head||o();if(e)return e.ssr?e.push(t,a):p(e,t,a)}function p(t,a,e={}){const s=u(!1),n=u({});f(()=>{n.value=s.value?{}:h(a)});const r=t.push(n.value,e);return d(n,c=>{r.patch(c)}),m()&&(v(()=>{r.dispose()}),i(()=>{s.value=!0}),l(()=>{s.value=!1})),r}export{U as u};