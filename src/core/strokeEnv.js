import paper from 'paper';
import { v4 as uuid } from 'uuid';
import * as d3 from 'd3';

const initLength = 100;
const initRectStyle = {
  width: initLength,
  height: initLength,
  fill: null,
  stroke: 'black',
  strokeWidth: 1,
  strokeDashArray: [9, 2],
};
class StrokeEnv {
  constructor(canvas, fabric) {
    if (!StrokeEnv.instance) {
      this.canvas = canvas;
      this.fabric = fabric;

      this.stroke = null;
      this.points = null;
      this.strokePath = null;
      this.elements = null;
      this.element = null;
      this.elementsGroup = null;
      this.rectContainer = [];

      this.fakeData = [5, 10, 2, 20, 1, 8];
      this.boundingBox = [];

      let mypaper = new paper.PaperScope();
      mypaper.setup(document.getElementById('canvas'));
      this.mypaper = mypaper;

      StrokeEnv.instance = this;
    }
    return StrokeEnv.instance;
  }
  createStroke(path) {
    this.strokePath = path;
  }
  clearStroke() {
    this.strokePath && this.canvas.remove(this.strokePath.path);
    this.points = null;
    this.elements.forEach((item) => this.canvas.remove(item));
    console.log('清除stroke');
  }
  getPoints() {
    const pathData = this.strokePath.path.path.join(' ');
    let strokePath2 = new this.mypaper.Path(pathData);
    console.log('strokePath2', strokePath2);
    console.log('strokePath2', strokePath2.data);
    this.points = dataStroke(strokePath2, this.categroy);
  }
  injectData() {
    const data = new Array(this.category).map((item, index) => index);
  }
  dataChannel_Scale() {}
  dataChannel_Color() {}
  dataChannel_others() {}

  dataScale_() {
    const fakeData = this.fakeData;
    let scale = d3
      .scaleLinear()
      .domain([d3.min(fakeData), d3.max(fakeData)])
      .range([1, 2]); //待改
    return scale;
  }

  set_scaleEle(ele, ratio) {
    ele.scaleX = ele.scaleX * ratio;
    ele.scaleY = ele.scaleX * ratio;
  }
  groupScale() {}

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
    if (!this.points) return;
    const activeObject = this.canvas.getActiveObject();
    if (activeObject.length === 0) return;

    const scale = this.dataScale_();
    const category = this.points.length;
    let elements = [];
    // console.log('scale',scale)
    for (let i = 0; i < category; i++) {
      await activeObject.clone((cloned) => {
        cloned.set({
          scaleX: cloned.scaleX * scale(this.fakeData[i]),
          scaleY: cloned.scaleY * scale(this.fakeData[i]),
        });
        const transform_width = (cloned.scaleX * cloned.width) / 2;
        const transform_height = (cloned.scaleY * cloned.height) / 2;
        // console.log('scale(this.fakeData[i])',scale(this.fakeData[i]))
        cloned.set({
          left: this.points[i].x - transform_width,
          top: this.points[i].y - transform_height,
          id: uuid(),
        });

        elements.push(cloned);
      });
    }
    this.elements = elements;
  }
  clearELements() {
    this.elements &&
      this.elements.map((item) => {
        this.canvas.remove(item);
      });
  }
  groupElements() {
    if (!this.elements) return;
    this.elementsGroup = new this.fabric.Group([...this.elements]);
    this.elementsGroup.set('id', uuid());
    this.canvas.add(this.elementsGroup);
    this.canvas.requestRenderAll();
  }
  // bug 对复制后的东西无法进行缩放。或者缩放就有失真问题。
  setElements(ele) {
    if (!this.points) return;
    this.clearELements();
    this.elements = this.points.map((point) => {
      // console.log(this.fabric.util["object"].clone(ele))
      let item = this.fabric.util['object'].clone(ele);
      item.set({
        id: uuid(),
      });
      item.left = point.x;
      item.top = point.y;
      return item;
    });
  }

  setSVGElements(url) {
    if (!this.points) return;
    this.elements = this.points.map((point) => {
      const defaultPosition = {
        left: point.x,
        top: point.y,
        // shadow: '',
        // fontFamily: '1-1',
      };
      fabric.loadSVGFromURL(url, (objects, options) => {
        return fabric.util.groupSVGElements(objects, {
          ...options,
          ...defaultPosition,
          // id: uuid(),
          name: 'svg元素',
        });
      });
    });
  }
  setInitElements() {
    if (!this.points) return;
    this.elements = this.points.map((point) => {
      const initLength = initRectStyle.width;
      const defaultPosition = {
        left: point.x - initLength / 2,
        top: point.y - initLength / 2,
        // shadow: '',
        // fontFamily: '1-1',
      };
      return new fabric.Rect({
        ...initRectStyle,
        id: uuid(),
        ...defaultPosition,
      });
    });
    this.boundingBox = this.elements;
  }
  drawElements() {
    if (!this.elements) {
      console.log('无elements');
      return;
    }
    console.log('this.elements', this.elements);
    this.elements.forEach((item) => {
      // this.canvas.setActiveObject(item)
      this.canvas.add(item);
    });
    this.canvas.requestRenderAll();
    this.bindMove();
  }
  setCategory(category) {
    this.category = category;
  }
  clearStrokeEnv() {}
  binScale() {}
  bindMove() {
    if (!this.elements) {
      console.log('无elements');
      return;
    }
    let tmpEles = this.elements.map((item) => {
      return {
        x: item.getCenterPoint().x,
        y: item.getCenterPoint().y,
      };
    });
    console.log('tmpEles', tmpEles);
    this.elements.forEach((item, index) => {
      // console.log('item',item)
      // console.log(this.canvas.getAbsoluteCoords(item));
      item.on('scaling', (item2) => {
        console.log('scaling', item2);
      });
      item.on('moving', (item2) => {
        console.log('item', item.getCenterPoint());
        console.log('moving', item2);
        const tmpLeft = item2.e.offsetX - tmpEles[index].x;
        const tmpTop = item2.e.offsetY - tmpEles[index].y;
        console.log('tmpLeft', tmpLeft);
        console.log('tmpTop', tmpTop);

        this.moveAll(index, tmpLeft, tmpTop);
      });
    });
  }
  moveAll(target, tmpLeft, tmpTop) {
    this.elements.forEach((item, index) => {
      if (index === target) return;
      item.set({
        left: this.points[index].x + tmpLeft,
        top: this.points[index].y + tmpTop,
      });
    });
  }
}
function dataStroke(path, category) {
  let category1 = category || 5;
  console.log('path', path);
  const pathLen = path.length;
  let gapPoint = Array.from({ length: category1 + 1 }).map((item, index) => {
    let offset = (index / category1) * pathLen;
    return path.getPointAt(offset);
  });
  console.log(gapPoint);
  path.remove();
  return gapPoint;
}

export default StrokeEnv;
