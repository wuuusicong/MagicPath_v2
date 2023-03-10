<template>
  <div style="display: inline-block">
    <Divider plain orientation="left">{{ $t('title_template') }}</Divider>
    <Tooltip
      :content="item.label"
      v-for="(item, i) in list"
      :key="i + '-bai1-button'"
      placement="top"
    >
      <img
        class="tmpl-img"
        :alt="item.label"
        v-lazy="item.src"
        @click="insertImgFile(item.src)"
      />
    </Tooltip>
  </div>
</template>

<script>
  import select from '@/mixins/select';
  import { downFontByJSON } from '@/utils/utils';
  import {v4 as uuid} from "uuid";

  export default {
    name: 'ToolBar',
    mixins: [select],
    data() {
      return {
        jsonFile: null,
        list: [
          {
            label: 'test1',
            src: './test/test1.png',
          },
          {
            label: 'test2',
            src: './test/test2.png',
          }
        ],
      };
    },
    methods: {
      insertImgFile(file) {
        const imgEl = document.createElement('img');
        imgEl.src = file || this.imgFile;
        // 插入页面
        document.body.appendChild(imgEl);
        imgEl.onload = () => {
          // 创建图片对象
          const imgInstance = new this.fabric.Image(imgEl, {
            id: uuid(),
            name: '图片1',
            left:0,
            top:0
          });
          // 设置缩放
          this.canvas.c.add(imgInstance);
          this.canvas.c.setActiveObject(imgInstance);
          this.canvas.c.renderAll();
          // 删除页面中的图片元素
          imgEl.remove();
          // this.canvas.c.setOverlayImage(imgEl.src, this.canvas.c.renderAll.bind(this.canvas.c));

          // this.canvas.c.overlayImage = imgEl.src
          // this.canvas.c.backgroundColor = 'red'
          console.log(imgEl.width)
          this.canvas.editor.editorWorkspace.setSize(imgEl.width, imgEl.height);
        };
      },
    },
  };
</script>

<style scoped lang="less">
  .tmpl-img {
    width: 94px;
    cursor: pointer;
    margin-right: 5px;
  }
</style>
