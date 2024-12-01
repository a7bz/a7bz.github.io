import{_ as s,p as a,q as i,I as n,B as e,s as l,C as t,E as p,x as r,F as d,y as h,z as o,v as k,Q as u,u as c,r as m,l as g,d as E,N as b,X as y,P as v,D as F,S as f}from"./chunks/framework.DHRXswU1.js";const q={key:0,class:"link-list"},C={class:"link-type-list"},B={class:"title"},L={class:"name"},_={key:0,class:"name-count"},x={class:"all-link"},D=["href"],j={class:"cover"},U=["src","alt"],w={class:"data"},z={class:"desc"},P={key:1,class:"s-card empty"},S=s({__name:"LinkList",props:{listData:{type:[Array,String],default:()=>[]},showCount:{type:Boolean,default:!0},useFriendsLink:{type:Boolean,default:!1}},setup:s=>(c,m)=>{const g=a("LazyLoader"),E=a("empty");return i(),n(u,{name:"fade",mode:"out-in"},{default:e((()=>{var a,n;return[(null==(a=s.listData)?void 0:a.length)?(i(),l("div",q,[t("div",C,[t("div",B,[t("h2",L,[m[1]||(m[1]=t("span",{class:"name-text"},"友链",-1)),s.showCount?(i(),l("span",_,"（"+p((null==(n=s.listData)?void 0:n.length)||0)+"）",1)):r("",!0)])]),t("div",x,[(i(!0),l(d,null,h(s.listData,((a,n)=>(i(),l("a",{key:n,class:o(["link-card","s-card"]),href:null==a?void 0:a.url,target:"_blank",rel:"noreferrer"},[t("div",j,[k(g,{useFriendsLink:a.avatar||a.ico||a.image},{default:e((()=>[t("img",{src:a.avatar||a.ico||a.image,class:o(["cover-img",{"cf-friends-avatar":s.useFriendsLink}]),alt:(null==a?void 0:a.name)||"cover",onLoad:m[0]||(m[0]=s=>s.target.classList.add("loaded"))},null,42,U)])),_:2},1032,["useFriendsLink"])]),t("div",w,[t("span",{class:o(["name",{"cf-friends-name":s.useFriendsLink}])},p(a.name||a.title),3),t("span",z,p(a.desc||a.description),1)])],8,D)))),128))])])])):(i(),l("div",P,[k(E,{description:"友链加载中..."})]))]})),_:1})}},[["__scopeId","data-v-75ecf9c1"]]),A={__name:"Link",setup(s){const{theme:a}=c(),n=m([]);return g((()=>{var s,i;fetch(null==(i=null==(s=a.value)?void 0:s.blog)?void 0:i.friendsLink).then((s=>s.json())).then((s=>{n.value=s.content||s.data}))})),(s,a)=>(i(),l("div",null,[k(S,{listData:n.value,useFriendsLink:""},null,8,["listData"])]))}},I={class:"form-container s-card"},R={class:"form-item"},K={key:0},V={class:"form-item"},W={key:0},O={class:"form-item"},H={key:0},N={class:"form-item"},J={key:0},Q=s({__name:"ApplyLink",setup(s){const{theme:a}=c(),n=E({name:"",url:"",image:"",description:""}),e=E({name:"",url:"",image:"",description:""});async function d(){var s,i;if(function(){let s=!0;e.name=n.name?"":"名称不能为空",e.url=n.url?"":"请输入有效的URL",e.image=n.image?"":"请输入有效的图片URL",e.description=n.description?"":"描述不能为空";for(const a in e)e[a]&&(s=!1);return s}()){const e=new FormData;e.append("name",n.name),e.append("url",n.url),e.append("image",n.image),e.append("description",n.description);const l=await fetch((null==(i=null==(s=a.value)?void 0:s.blog)?void 0:i.qexo)+"/pub/ask_friend",{method:"POST",body:e,redirect:"follow"});if(l.ok){const s=await l.json();alert(s.msg),n.name="",n.url="",n.image="",n.description=""}else alert("提交失败，请重试。")}}return(s,a)=>(i(),l("div",I,[t("form",{onSubmit:v(d,["prevent"])},[t("div",R,[a[4]||(a[4]=t("label",{for:"name"},"名称:",-1)),b(t("input",{id:"name","onUpdate:modelValue":a[0]||(a[0]=s=>n.name=s),required:"",placeholder:"请输入名称"},null,512),[[y,n.name]]),e.name?(i(),l("span",K,p(e.name),1)):r("",!0)]),t("div",V,[a[5]||(a[5]=t("label",{for:"url"},"链接:",-1)),b(t("input",{id:"url","onUpdate:modelValue":a[1]||(a[1]=s=>n.url=s),type:"url",required:"",placeholder:"请输入有效的URL"},null,512),[[y,n.url]]),e.url?(i(),l("span",W,p(e.url),1)):r("",!0)]),t("div",O,[a[6]||(a[6]=t("label",{for:"image"},"图片URL:",-1)),b(t("input",{id:"image","onUpdate:modelValue":a[2]||(a[2]=s=>n.image=s),type:"url",required:"",placeholder:"请输入图片URL"},null,512),[[y,n.image]]),e.image?(i(),l("span",H,p(e.image),1)):r("",!0)]),t("div",N,[a[7]||(a[7]=t("label",{for:"description"},"描述:",-1)),b(t("textarea",{id:"description","onUpdate:modelValue":a[3]||(a[3]=s=>n.description=s),required:"",placeholder:"请输入描述"},null,512),[[y,n.description]]),e.description?(i(),l("span",J,p(e.description),1)):r("",!0)]),a[8]||(a[8]=t("div",{style:{display:"flex","justify-content":"center"}},[t("button",{type:"submit",class:"submit-btn"},"提交")],-1))],32)]))}},[["__scopeId","data-v-57b66acb"]]),T={class:"details custom-block"},X=JSON.parse('{"title":"友情链接","description":"记录分享一些笔记","frontmatter":{"title":"友情链接","aside":false,"comment":true,"head":[["link",{"rel":"canonical","href":"https://blog.a7bz.cn/pages/link"}]],"description":"记录分享一些笔记"},"headers":[],"relativePath":"pages/link.md","filePath":"pages/link.md"}'),G={name:"pages/link.md"},M=Object.assign(G,{setup:s=>(s,a)=>(i(),l("div",null,[k(A),a[1]||(a[1]=t("h1",{id:"友情链接申请",tabindex:"-1"},[F("友情链接申请 "),t("a",{class:"header-anchor",href:"#友情链接申请","aria-label":'Permalink to "友情链接申请"'},"​")],-1)),a[2]||(a[2]=t("p",null,"欢迎交换友链，本站友链目前提交表单审核后添加，如果你想加入友链，请填写下方表单或按指定格式留言。",-1)),t("details",T,[a[0]||(a[0]=t("summary",null,"友链申请",-1)),k(Q)]),a[3]||(a[3]=f('<h3 id="留言格式" tabindex="-1">留言格式 <a class="header-anchor" href="#留言格式" aria-label="Permalink to &quot;留言格式&quot;">​</a></h3><div class="language-json vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>\n<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;title&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;网站或个人昵称&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>\n<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;url&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;完整的主页地址&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>\n<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;avatar&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;头像链接&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>\n<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;desc&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;网站或个人简介&quot;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h3 id="我的友链信息" tabindex="-1">我的友链信息 <a class="header-anchor" href="#我的友链信息" aria-label="Permalink to &quot;我的友链信息&quot;">​</a></h3><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-kKiWg" id="tab-mPhz_UH" checked><label data-title="json" for="tab-mPhz_UH">json</label><input type="radio" name="group-kKiWg" id="tab--4BWKIS"><label data-title="yml" for="tab--4BWKIS">yml</label></div><div class="blocks"><div class="language-json vp-adaptive-theme active line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>\n<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;title&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;荒芜&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>\n<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;url&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;https://blog.a7bz.cn/&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>\n<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;avatar&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;https://blog.a7bz.cn/logo.png&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>\n<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;desc&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;记录分享一些笔记&quot;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><div class="language-yml vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">yml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">title</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">荒芜</span></span>\n<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">https://blog.a7bz.cn/</span></span>\n<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">avatar</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">https://blog.a7bz.cn/logo.png</span></span>\n<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">desc</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">记录分享一些笔记</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div></div></div>',4))]))});export{X as __pageData,M as default};
