/* eslint-disable radix */
/* eslint-disable no-mixed-operators */
/*
 * @Author: 秦少卫
 * @Date: 2023-01-06 23:40:09
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-08 00:16:19
 * @Description: 线条绘制
 */

import { v4 as uuid } from 'uuid';
import { fabric } from 'fabric';
import Arrow from '@/core/objects/Arrow';
import paper from 'paper'
import StrokeEnv from "@/core/strokeEnv";

function initializeLineDrawing(canvas, fabric) {
  let isDrawingLine = false;
  let isDrawingLineMode = false;
  let isArrow = false;
  let strokePath;
  canvas.freeDrawingBrush.width = 5

  let drawStrokeEnv = new StrokeEnv()
  console.log('drawStrokeEnv', drawStrokeEnv)

  canvas.on('mouse:down', (o) => {
    // if(strokePath&&isDrawingLineMode) canvas.remove(strokePath.path)
    if(drawStrokeEnv.strokePath&&isDrawingLineMode) drawStrokeEnv.clearStroke()

    if (!isDrawingLineMode) return;
    // canvas.freeDrawingBrush.color = 'pink'
    isDrawingLine = true;
    });
  // canvas.on('mouse:move', (o) => {
  //
  //   canvas.renderAll();
  // });

  canvas.on('mouse:up', () => {
    // lineToDraw.setCoords();
    // isDrawingLine = false;

  });

  canvas.on('path:created', opt => {

    drawStrokeEnv.createStroke(opt)
    drawStrokeEnv.getPoints()
    drawStrokeEnv.setInitElements();
    drawStrokeEnv.drawElements();
    // strokePath = opt;
    // console.log(232332323)
    // console.log(opt.path)
    // console.log(opt.path.toSVG())
    // const pathData = opt.path.path.join(' ')
    // console.log(pathData)
    // let mypaper = new paper.PaperScope()
    // mypaper.setup(document.getElementById('canvas'))
    // console.log(mypaper)
    // let strokePath2 = new mypaper.Path(pathData)
    //
    // // console.log('strokePath',strokePath)
    // let elePoints = dataStroke(strokePath2)
    // test_drawIcon(canvas,elePoints, fabric)

    // console.log(new mypaper.Path('M100,50c0,27.614-22.386,50-50,50S0,77.614,0,50S22.386,0,50,0S100,22.386,100,50'))
    // strokePath = opt;
  })


  // canvas.on('path:created', opt => {
  //   strokePath = opt;
  //   console.log(232332323)
  //   console.log(opt.path)
  //   console.log(opt.path.toSVG())
  //   const pathData = opt.path.path.join(' ')
  //   console.log(pathData)
  //   let mypaper = new paper.PaperScope()
  //   mypaper.setup(document.getElementById('canvas'))
  //   console.log(mypaper)
  //   let strokePath2 = new mypaper.Path(pathData)
  //
  //   // console.log('strokePath',strokePath)
  //   let elePoints = dataStroke(strokePath2)
  //   test_drawIcon(canvas,elePoints, fabric)
  //
  //   // console.log(new mypaper.Path('M100,50c0,27.614-22.386,50-50,50S0,77.614,0,50S22.386,0,50,0S100,22.386,100,50'))
  //   // strokePath = opt;
  // })

  return {
    setArrow(params) {
      isArrow = params;
    },
    setMode(params) {
      isDrawingLineMode = params;
    },
  };
}

function dataStroke(path,category=5) {
  console.log('path',path)
  const pathLen = path.length
  let gapPoint = Array.from(({length:category+1})).map((item, index) => {
    let offset = index / category * pathLen;
    return path.getPointAt(offset)
  })
  console.log(gapPoint)
  path.remove()
  return gapPoint
}
function test_drawIcon(canvas,gapPoint, fabric) {
  gapPoint.forEach(point => {
    const defaultPosition = {
      left: point.x,
      top: point.y,
      // shadow: '',
      // fontFamily: '1-1',
    };
    const url = './svg/146.svg';

    const item = new fabric.Circle({
      radius:5,
      ...defaultPosition
    })
    canvas.add(item);
    canvas.requestRenderAll();
    // fabric.loadSVGFromURL(url, (objects, options) => {
    //   const item = fabric.util.groupSVGElements(objects, {
    //     ...options,
    //     ...defaultPosition,
    //     // id: uuid(),
    //     name: 'svg元素',
    //   });
    //   canvas.add(item);
    //   canvas.requestRenderAll();
    // });
  })
}
// function initializeLineDrawing(canvas, defaultPosition) {
//   let isDrawingLine = false;
//   let isDrawingLineMode = false;
//   let isArrow = false;
//   let lineToDraw;
//   let pointer;
//   let pointerPoints;
//   canvas.on('mouse:down', (o) => {
//     if (!isDrawingLineMode) return;
//     isDrawingLine = true;
//     pointer = canvas.getPointer(o.e);
//     pointerPoints = [pointer.x, pointer.y, pointer.x, pointer.y];
//
//     const NodeHandler = isArrow ? Arrow : fabric.Line;
//     lineToDraw = new NodeHandler(pointerPoints, {
//       strokeWidth: 2,
//       stroke: '#000000',
//       ...defaultPosition,
//       id: uuid(),
//     });
//
//     lineToDraw.selectable = false;
//     lineToDraw.evented = false;
//     lineToDraw.strokeUniform = true;
//     canvas.add(lineToDraw);
//   });
//
//   canvas.on('mouse:move', (o) => {
//     if (!isDrawingLine) return;
//
//     pointer = canvas.getPointer(o.e);
//
//     if (o.e.shiftKey) {
//       // calc angle
//       const startX = pointerPoints[0];
//       const startY = pointerPoints[1];
//       const x2 = pointer.x - startX;
//       const y2 = pointer.y - startY;
//       const r = Math.sqrt(x2 * x2 + y2 * y2);
//       let angle = (Math.atan2(y2, x2) / Math.PI) * 180;
//       angle = parseInt(((angle + 7.5) % 360) / 15) * 15;
//
//       const cosx = r * Math.cos((angle * Math.PI) / 180);
//       const sinx = r * Math.sin((angle * Math.PI) / 180);
//
//       lineToDraw.set({
//         x2: cosx + startX,
//         y2: sinx + startY,
//       });
//     } else {
//       lineToDraw.set({
//         x2: pointer.x,
//         y2: pointer.y,
//       });
//     }
//
//     canvas.renderAll();
//   });
//
//   canvas.on('mouse:up', () => {
//     if (!isDrawingLine) return;
//     lineToDraw.setCoords();
//     isDrawingLine = false;
//   });
//
//   return {
//     setArrow(params) {
//       isArrow = params;
//     },
//     setMode(params) {
//       isDrawingLineMode = params;
//     },
//   };
// }

export default initializeLineDrawing;
