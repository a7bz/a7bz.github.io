import{_ as a,q as s,s as e,C as t,E as n,F as l,y as i,A as r}from"./framework.CNl8piqG.js";const p={class:"cat-or-tag"},c={class:"title"},f={class:"title-name"},o={class:"title-num"},d={class:"type-lists"},m=["href"],y={class:"name"},u={class:"num"},g=a({__name:"ShowTab",props:{icon:{type:String,default:""},name:{type:String,default:""},hrefKey:{type:String,default:""},prefix:{type:String,default:"pages"},data:{type:Array,default:[]}},setup:a=>(g,h)=>(s(),e("div",p,[t("div",c,[t("h1",f,"全部"+n(a.name),1),t("span",o,"共有"+n(a.data.length)+"个"+n(a.name),1)]),t("div",d,[(s(!0),e(l,null,i(a.data,((l,i)=>(s(),e("a",{key:i,href:`/${a.prefix}/${a.hrefKey}/${l.name}`,class:"type-item s-card"},[t("i",{class:r(`iconfont icon-${a.icon}`)},null,2),t("span",y,n(l.name),1),t("span",u,n(l.count),1)],8,m)))),128))])]))},[["__scopeId","data-v-85a2a95f"]]);export{g as S};
