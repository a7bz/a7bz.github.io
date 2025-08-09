---
icon: router
date: 2024-07-12
category:
  - 代码
tag:
  - js
  - autojs
---

# autojs 横竖屏监听

```js
"ui";

let currentOrientation = context.resources.configuration.orientation;

ui.layout(
  <vertical gravity="center">
    <text text="{{currentOrientation}}" />
  </vertical>
);

function onConfigurationChanged(newConfig) {
  if (newConfig.orientation != currentOrientation) {
    if (newConfig.orientation == 2) {
      log("横屏");
    } else {
      log("竖屏");
    }
  }
  currentOrientation = newConfig.orientation;
}

context.registerComponentCallbacks({
  onConfigurationChanged: onConfigurationChanged,
});
```
