import{u as a,l as e,j as t,q as s,s as o,I as l,v as n,G as r}from"./framework.iVhOg0Zp.js";import{u,s as m,P as c}from"./theme.Bt1zNJlr.js";import{S as i}from"./ShowTab._2TqGfbg.js";import{T as p}from"./Tab.C4LiFehq.js";const d={key:1},v={__name:"Category",props:{single:{type:Boolean,default:!1}},setup(v){const y=u(),{categoryData:f}=m(y),{params:g,site:j}=a();e((()=>{g.value&&(document.title=`分类：${g.value.name} | ${j.value.title}`)}));const h=t((()=>Object.keys(f.value).map((a=>({name:a,count:f.value[a].length}))).sort(((a,e)=>e.count-a.count))));return(a,e)=>(s(),o("div",null,[v.single?(s(),l(i,{key:0,icon:"folder",name:"分类",data:h.value,hrefKey:"category"},null,8,["data"])):(s(),o("div",d,[n(p,{home:"",type:"category",data:h.value},null,8,["data"]),n(c,{data:r(f)[r(g).name]},null,8,["data"])]))]))}};export{v as _};