import{_ as D,r as k,q as o,s as r,B as e,z as _,E as a,D as p,x as v,U as m,V as h,v as i}from"./chunks/framework.OdgUePS5.js";import{u as S,s as w,P as f}from"./chunks/theme.DXPFjUlh.js";const B={class:"archives s-card"},C={class:"title"},N={key:0,class:"num"},P={key:0,class:"num"},V={class:"archives-list"},y={__name:"Article",setup(g){const s=k(0),c=S(),{postsData:l,starData:n}=w(c);return(z,t)=>{var d,u;return o(),r("div",B,[e("div",C,[e("div",{class:_(["item",s.value==0?"activate":""]),onClick:t[0]||(t[0]=x=>s.value=0)},[t[2]||(t[2]=e("h1",{class:"name"},"全部文章",-1)),(d=a(l))!=null&&d.length?(o(),r("sup",N,p(a(l).length),1)):v("",!0)],2),e("div",{class:_(["item",s.value==1?"activate":""]),onClick:t[1]||(t[1]=x=>s.value=1)},[t[3]||(t[3]=e("h1",{class:"name"},"星标文章",-1)),(u=a(n))!=null&&u.length?(o(),r("sup",P,p(a(n).length)+'">',1)):v("",!0)],2)]),e("div",V,[m(i(f,{data:a(l),"un-show-excerpt":""},null,8,["data"]),[[h,s.value==0]]),m(i(f,{data:a(n),"un-show-excerpt":""},null,8,["data"]),[[h,s.value==1]])])])}}},$=D(y,[["__scopeId","data-v-981d8c39"]]),O=JSON.parse('{"title":"全部文章","description":"","frontmatter":{"title":"全部文章","aside":false},"headers":[],"relativePath":"pages/article.md","filePath":"pages/article.md"}'),b={name:"pages/article.md"},j=Object.assign(b,{setup(g){return(s,c)=>(o(),r("div",null,[i($)]))}});export{O as __pageData,j as default};
