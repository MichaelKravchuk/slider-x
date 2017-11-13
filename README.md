## How to use it

<br/>

**create 'Wheel' object**

```html
let wheel = new Wheel();
```

**constructor accepts object with such parameters:**

* `colorSchema` - (array of 12 colors) default ` ['#e67e25', '#e74b3c', '#e71e64', '#94a4a4', '#10a085', '#2780b8', '#884a9d', '#913f6d', '#5fc5ce', '#364c63', '#6cce5f', '#efc31a']`
* `radius` - default `200`
* `countSectors` - default `12`
* `fontSize` - default `12`
* `timeInterval` - default `0.002`
* `speed` - default `0.9`
* `options` - default empty object `{}`
* `canvas` - (DOM object) default `document.getElementById("myCanvas")`
<br/>

## Methods
* `wheel.firstDraw()` - just draws wheel
* `wheel.run()` - Starts the wheel rotation
* `wheel.setResSector(sectorNumber)` - adjustment of the final position
* `wheel.changeOptions(ObjectOptions)` - repaints wheel options when broadcaster changes it 
