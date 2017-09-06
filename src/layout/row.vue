<template>
    <div class="hh-row"
         :style="style"
         :class="[
            justify !== 'start' ? 'is-justify-' + justify : '',
            align !== 'top' ? 'is-align-' + align : '',
            'hh-row--flex'
        ]"
    >
        <slot></slot>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
    .hh-row:after,.hh-row:before{
        display:table;content:""
    }
    .hh-row:after{clear:both}
    .hh-row{position:relative;box-sizing:border-box}
    .hh-row--flex{display:flex}
    .hh-row--flex:after,.hh-row--flex:before{display:none}
    .hh-row--flex.is-align-bottom{align-items:flex-end}
    .hh-row--flex.is-align-middle{align-items:center}
    .hh-row--flex.is-justify-space-around{justify-content:space-around}
    .hh-row--flex.is-justify-space-between{justify-content:space-between}
    .hh-row--flex.is-justify-end{justify-content:flex-end}
    .hh-row--flex.is-justify-center{justify-content:center}
</style>
<script>
  export default {
      name: 'HRow',

      props: {
          gutter: Number,
          type: String,
          justify: {
              type: String,
              default: 'start'
          },
          align: {
              type: String,
              default: 'top'
          }
      },

      computed: {
          style() {
              var ret = {};

              if (this.gutter) {
                  ret.marginLeft = `-${this.gutter / 2}px`;
                  ret.marginRight = ret.marginLeft;
              }

              return ret;
          }
      }
  };
</script>
