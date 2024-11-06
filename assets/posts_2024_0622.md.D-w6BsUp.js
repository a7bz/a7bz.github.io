import{_ as a,s as i,S as e,q as n}from"./chunks/framework.OdgUePS5.js";const t="/assets/image/2024/other/rosSetUdev-0622/vmware_UXutHu2uyk.png",p="/assets/image/2024/other/rosSetUdev-0622/vmware_XTmNJvWDLV.png",l="/assets/image/2024/other/rosSetUdev-0622/vmware_Hh5Mo3zDPb.png",h="/assets/image/2024/other/rosSetUdev-0622/vmware_wMHqP2Z6X9.png",b=JSON.parse('{"title":"ros -设置权限和串口别名规则","description":"","frontmatter":{"icon":"host","date":"2024-06-22T00:00:00.000Z","category":["ros"]},"headers":[],"relativePath":"posts/2024/0622.md","filePath":"posts/2024/other/rosSetUdev-0622.md"}'),d={name:"posts/2024/0622.md"};function r(o,s,k,c,u,g){return n(),i("div",null,s[0]||(s[0]=[e('<h1 id="ros-设置权限和串口别名规则" tabindex="-1">ros -设置权限和串口别名规则 <a class="header-anchor" href="#ros-设置权限和串口别名规则" aria-label="Permalink to &quot;ros -设置权限和串口别名规则&quot;">​</a></h1><p>在使用多个设备时，尤其是接入传感器和其他串口设备时，设备每次插入的串口名可能会发生变化。如果每次都需要手动查看串口名并修改配置文件，显得尤为麻烦。为了简化这个过程，我们可以通过设置规则文件来为设备配置别名，并解决设备权限问题。</p><h2 id="解决权限问题" tabindex="-1">解决权限问题 <a class="header-anchor" href="#解决权限问题" aria-label="Permalink to &quot;解决权限问题&quot;">​</a></h2><p>接入传感器，查看设备信息</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ls</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -l</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /dev/ttyUSB0</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p><img src="'+t+`" alt="设备信息" loading="lazy"></p><p>只有读写权限无执行权限</p><p>新建一个 ttyUSB.sh 脚本文件</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">touch</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ttyUSB.sh</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>打开该文件，写入以下内容，保存</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;KERNEL==&quot;ttyUSB*&quot;, MODE:=&quot;0777&quot;, GROUP:=&quot;dialout&quot;&#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/etc/udev/rules.d/ttyUSB.rules</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">service</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> udev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reload</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sleep</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">service</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> udev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> restart</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> udevadm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> trigger</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>给予脚本执行权限并运行</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> chmod</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 777</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ttyUSB.sh</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>运行脚本</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ttyUSB.sh</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>将当前用户添加进 <strong>dialout</strong> 组:</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> usermod</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -a</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -G</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dialout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $USER</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p><strong>$USER</strong> 是当前用户的环境变量，执行完后需要重启会话或者重新登录才能生效。</p><p>再次查看设备信息</p><p><img src="`+p+'" alt="设备信息" loading="lazy"></p><p>已经拥有执行权限</p><p>设置好规则后，以后任何 ttyUSB 设备都会自动获得 777 权限，无需手动调整。</p><h2 id="设置串口别名" tabindex="-1">设置串口别名 <a class="header-anchor" href="#设置串口别名" aria-label="Permalink to &quot;设置串口别名&quot;">​</a></h2><p>为了避免串口名称随设备插拔而变化，我们可以为每个串口设备设置一个唯一的别名。首先，我们需要查看设备的信息。</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">udevadm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> info</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --attribute-walk</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --name=/dev/ttyUSB0</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>找到 <strong>idVendor</strong> 、<strong>idProduct</strong> 和 <strong>serial</strong> 这几个属性，这些属性可以帮助我们唯一标识设备。</p><p><img src="'+l+`" alt="设备属性" loading="lazy"></p><p>新建一个 wheeltec_udev.sh</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">touch</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> wheeltec_udev.sh</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>编写 wheeltec_udev.sh 脚本</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &#39;KERNEL==&quot;ttyUSB*&quot;, ATTRS{idVendor}==&quot;10c4&quot;, ATTRS{idProduct}==&quot;ea60&quot;, ATTRS{serial}==&quot;0003&quot;, GROUP:=&quot;dialout&quot;, SYMLINK+=&quot;wheeltec_FDI_IMU_GNSS&quot;&#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/etc/udev/rules.d/wheeltec_fdi_imu_gnss.rules</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">service</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> udev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reload</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sleep</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">service</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> udev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> restart</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> udevadm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> trigger</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p><code>KERNEL==&quot;ttyUSB*&quot;</code>: <code>KERNEL</code>是指设备的内核名称，<code>ttyUSB*</code>适用于所有以<code>ttyUSB</code>开头的设备，通常指的是通过 USB 连接的串行设备。 <code>ATTRS{idVendor}==&quot;10c4&quot;, ATTRS{idProduct}==&quot;ea60&quot;</code>: 精确匹配特定厂商和产品的设备 <code>ATTRS{serial}==&quot;0003&quot;</code>: 设备序列号(<code>serial</code>)为<code>0003</code> 区分同一型号但具有不同序列号的多个设备。 <code>GROUP:=&quot;dialout&quot;</code>:设备文件的所属组为<code>dialout</code>。属于<code>dialout</code>组的用户都将有权访问此设备 <code>SYMLINK+=&quot;wheeltec_FDI_IMU_GNSS&quot;</code>:设置别名<code>wheeltec_FDI_IMU_GNSS</code></p><p>给脚本文件授权</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> chmod</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 777</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> wheeltec_udev.sh</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>运行脚本</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> wheeltec_udev.sh</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p><img src="`+h+'" alt="执行结果" loading="lazy"></p><p>别名设置成功</p>',38)]))}const m=a(d,[["render",r]]);export{b as __pageData,m as default};
