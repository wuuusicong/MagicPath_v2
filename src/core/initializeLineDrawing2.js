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
import paper from 'paper';

function initializeStrokeDrawing(canvas, defaultPosition) {
  let canvas1 = canvas.c;
  let canvas2 = canvas.d;
  let isDrawingLineMode = false;
  let myPaper = new paper.PaperScope();
  console.log('canvas',canvas)
  myPaper.setup(canvas2)
  let path = new myPaper.Path()
  console.log('myPaper',myPaper)
  let isArrow;
  canvas1.on('mouse:down',(event) => {
    console.log('isDrawingLineMode',!isDrawingLineMode)
    if (!isDrawingLineMode) return;
    console.log(event)
    let point = new myPaper.Point(event.pointer.x, event.pointer.y)
    console.log(point)
    path = new myPaper.Path({
      segments: [point],
      strokeColor: 'black',
      // Select the path, so we can see its segment points:
      fullySelected: true
    });
    path.strokeWidth = 10
  })

  canvas1.on('mouse:move', (event) => {
    console.log('isDrawingLineMode',!isDrawingLineMode)
    if (!isDrawingLineMode) return;
    let point = new myPaper.Point(event.pointer.x, event.pointer.y)
    path.add(point)
  })

  canvas1.on('mouse:up', (event) => {
      console.log('isDrawingLineMode',!isDrawingLineMode)
      if (!isDrawingLineMode) return;
      path.simplify(10);
      let point = new myPaper.Point(event.pointer.x, event.pointer.y)
      path.add(point)
      path.fullySelected = true;
      path.smooth()
      path = new myPaper.Path()
    })



  return {
    setArrow(params) {
      isArrow = params;
    },
    setMode(params) {
      isDrawingLineMode = params;
    },
  };
}

function initializeLineDrawing(canvas, defaultPosition) {
  let isDrawingLine = false;
  let isDrawingLineMode = false;
  let isArrow = false;
  let lineToDraw;
  let pointer;
  let pointerPoints;
  canvas.on('mouse:down', (o) => {
    if (!isDrawingLineMode) return;

    isDrawingLine = true;
    pointer = canvas.getPointer(o.e);
    pointerPoints = [pointer.x, pointer.y, pointer.x, pointer.y];

    const NodeHandler = isArrow ? Arrow : fabric.Line;
    lineToDraw = new NodeHandler(pointerPoints, {
      strokeWidth: 2,
      stroke: '#000000',
      ...defaultPosition,
      id: uuid(),
    });

    lineToDraw.selectable = false;
    lineToDraw.evented = false;
    lineToDraw.strokeUniform = true;
    canvas.add(lineToDraw);
  });

  canvas.on('mouse:move', (o) => {
    if (!isDrawingLine) return;
    pointer = canvas.getPointer(o.e);

    if (o.e.shiftKey) {
      // calc angle
      const startX = pointerPoints[0];
      const startY = pointerPoints[1];
      const x2 = pointer.x - startX;
      const y2 = pointer.y - startY;
      const r = Math.sqrt(x2 * x2 + y2 * y2);
      let angle = (Math.atan2(y2, x2) / Math.PI) * 180;
      angle = parseInt(((angle + 7.5) % 360) / 15) * 15;

      const cosx = r * Math.cos((angle * Math.PI) / 180);
      const sinx = r * Math.sin((angle * Math.PI) / 180);

      lineToDraw.set({
        x2: cosx + startX,
        y2: sinx + startY,
      });
    } else {
      lineToDraw.set({
        x2: pointer.x,
        y2: pointer.y,
      });
    }
    canvas.renderAll();
  });

  canvas.on('mouse:up', () => {
    if (!isDrawingLine) return;
    lineToDraw.setCoords();
    isDrawingLine = false;
  });

  return {
    setArrow(params) {
      isArrow = params;
    },
    setMode(params) {
      isDrawingLineMode = params;
    },
  };
}

export default initializeStrokeDrawing;
