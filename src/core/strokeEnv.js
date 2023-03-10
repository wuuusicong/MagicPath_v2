import paper from 'paper'
import {v4 as uuid} from "uuid";

class StrokeEnv {
  constructor(canvas, fabric) {
    if(!StrokeEnv.instance) {
      this.canvas = canvas;
      this.fabric = fabric;

      this.stroke = null;
      this.points = null;
      this.strokePath = null;
      this.elements = null;
      this.element = null;
      this.elementsGroup = null;


      let mypaper = new paper.PaperScope()
      mypaper.setup(document.getElementById('canvas'))
      this.mypaper = mypaper

      StrokeEnv.instance = this;
    }
    return StrokeEnv.instance;

  }
  createStroke(path) {
    this.strokePath = path;
  }
  clearStroke() {
    this.strokePath&&this.canvas.remove(this.strokePath.path);
    this.points = null;
    this.elements.forEach(item => this.canvas.remove(item))
    console.log('清除stroke')
  }
  getPoints() {
    const pathData = this.strokePath.path.path.join(' ')
    let strokePath2 = new this.mypaper.Path(pathData)
    this.points =  dataStroke(strokePath2, this.categroy)
  }
  injectData() {
    const data = new Array(this.category).map((item,index) =>index);
  }
  dataChannel_Scale() {

  }
  dataChannel_Color() {

  }
  dataChannel_others() {

  }

//   activeObject.clone((cloned) => {
//   this.canvas.discardActiveObject();
//   // 间距设置
//   const grid = 10;
//   cloned.set({
//                left: cloned.left + grid,
//   top: cloned.top + grid,
//   id: uuid(),
// });
// this.canvas.add(cloned);
// this.canvas.setActiveObject(cloned);
// this.canvas.requestRenderAll();
// });
  async setElements_v2() {
    if(!this.points) return;
    const activeObject = this.canvas.getActiveObject();
    if (activeObject.length === 0) return;

    const category = this.points.length;
    let elements = []
    for(let i = 0; i < category; i++) {
     await activeObject.clone((cloned) => {
        cloned.set({
          left: this.points[i].x,
          top:  this.points[i].y,
          id: uuid(),
        });

        elements.push(cloned)
      })
    }
    this.elements = elements;
  }
  clearELements() {
    this.elements && this.elements.map(item => {
      this.canvas.remove(item)
    })
  }
  groupElements() {
    if(!this.elements) return;
    this.elementsGroup = new this.fabric.Group([...this.elements])
    this.elementsGroup.set('id', uuid());
    this.canvas.add(this.elementsGroup)
    this.canvas.requestRenderAll()
  }
  // bug 对复制后的东西无法进行缩放。或者缩放就有失真问题。
  setElements (ele) {
    if(!this.points) return;
    this.clearELements();
    this.elements = this.points.map(point => {
      // console.log(this.fabric.util["object"].clone(ele))
      let item = this.fabric.util["object"].clone(ele)
      item.set({
        id:uuid()
      })
      item.left = point.x;
      item.top = point.y
      return item;
    });
  }

  setSVGElements(url) {
    if(!this.points) return;
    this.elements = this.points.map(point => {
      const defaultPosition = {
        left: point.x,
        top: point.y,
        // shadow: '',
        // fontFamily: '1-1',
      };
      fabric.loadSVGFromURL(url, (objects, options) => {
        return  fabric.util.groupSVGElements(objects, {
          ...options,
          ...defaultPosition,
          // id: uuid(),
          name: 'svg元素',
        });
      });
    })
  }
  setInitElements () {
    if(!this.points) return;
    this.elements = this.points.map(point => {
      const defaultPosition = {
        left: point.x,
        top: point.y,
        // shadow: '',
        // fontFamily: '1-1',
      };
      return  new fabric.Circle({
        radius: 5,
        ...defaultPosition
      })
    })
  }
  drawElements (){
    if(!this.elements) {
      console.log('无elements');
      return;
    }
    console.log('this.elements', this.elements)
    this.elements.forEach(item => {
      this.canvas.add(item)
      this.canvas.requestRenderAll()
    })
  }
  setCategory(category) {
    this.category = category
  }
  clearStrokeEnv () {

  }

}
function dataStroke(path,category) {
  let category1 = category || 5
  console.log('path',path)
  const pathLen = path.length
  let gapPoint = Array.from(({length:category1+1})).map((item, index) => {
    let offset = index / category1 * pathLen;
    return path.getPointAt(offset)
  })
  console.log(gapPoint)
  path.remove()
  return gapPoint
}

export  default StrokeEnv;
