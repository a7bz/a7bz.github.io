import{u as i,l as p,j as f,q as s,s as l,H as v,v as r,E as u}from"./framework.Bd2DxmIr.js";import{u as _,s as g,P as h}from"./theme.CvmiV7ho.js";import{T as k}from"./Tab.u4w2PpEN.js";import{S as y}from"./ShowTab.0Is-Mttk.js";const T={key:1},j={__name:"Tag",props:{single:{type:Boolean,default:!1}},setup(c){const m=_(),{tagsData:t}=g(m),{params:e,site:d}=i();p(()=>{e.value&&(document.title=`分类：${e.value.name} | ${d.value.title}`)});const o=f(()=>Object.keys(t.value).map(a=>({name:a,count:t.value[a].length})).sort((a,n)=>n.count-a.count));return(a,n)=>(s(),l("div",null,[c.single?(s(),v(y,{key:0,icon:"hashtag",name:"标签",data:o.value,hrefKey:"tag"},null,8,["data"])):(s(),l("div",T,[r(k,{type:"tag",data:o.value},null,8,["data"]),r(h,{data:u(t)[u(e).name]},null,8,["data"])]))]))}};export{j as _};