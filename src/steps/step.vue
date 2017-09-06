<template>
  <div
    class="hh-step"
    :style="[style,  isLast ? '' : { marginRight: - $parent.stepOffset + 'px' }]"
    :class="['is-' + $parent.direction]">
    <div
      class="hh-step__head"
      :class="['is-' + currentStatus, { 'is-text': !icon }]">
      <div
        class="hh-step__line"
        :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }"
        :class="['is-' + $parent.direction, { 'is-icon': icon }]">
        <i class="hh-step__line-inner" :style="lineStyle"></i>
      </div>

      <span class="hh-step__icon">
        <slot
          v-if="currentStatus !== 'success' && currentStatus !== 'error'"
          name="icon">
          <i v-if="icon" :class="['hh-icon-' + icon]"></i>
          <div v-else>{{ index + 1 }}</div>
        </slot>
        <i
          v-else
          :class="['hh-icon-' + (currentStatus === 'success' ? 'check' : 'close')]">
        </i>
      </span>
    </div>
    <div
      class="hh-step__main"
      :style="{ marginLeft: mainOffset }">
      <div
        class="hh-step__title"
        ref="title"
        :class="['is-' + currentStatus]">
        <slot name="title">{{ title }}</slot>
      </div>
      <div
        class="hh-step__description"
        :class="['is-' + currentStatus]">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .hh-step.is-horizontal,
  .hh-step.is-vertical .hh-step__head,
  .hh-step.is-vertical .hh-step__main,
  .hh-step__line {
    display:  inline-block
  }
  .hh-step {
    position:  relative;
    vertical-align: top
  }
  .hh-step.is-vertical .hh-step__main {
    padding-left: 10px
  }
  .hh-step__line {
    position: absolute;
    border-color: inherit;
    background-color: #bfcbd9
  }
  .hh-step__line.is-vertical {
    width: 2px;
    box-sizing: border-box;
    top: 32px;
    bottom: 0;
    left: 15px
  }
  .hh-step__line.is-horizontal {
    top: 15px;
    height: 2px;
    left: 32px;
    right: 0
  }
  .hh-step__line.is-icon.is-horizontal {
    right: 4px
  }
  .hh-step__line-inner {
    display: block;
    border-width: 1px;
    border-style: solid;
    border-color: inherit;
    transition: all 150ms;
    width: 0;
    height: 0
  }
  .hh-step__icon {
    display: block;
    line-height: 28px
  }
  .hh-step__icon>* {
    line-height: inherit;
    vertical-align: middle
  }
  .hh-step__head {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: transparent;
    text-align: center;
    line-height: 28px;font-size: 28px;
    vertical-align: top;
    transition: all 150ms
  }
  .hh-step__head.is-finish {
    color: #20a0ff;
    border-color: #20a0ff
  }
  .hh-step__head.is-error {
    color: #ff4949;
    border-color: #ff4949
  }
  .hh-step__head.is-success {
    color: #13ce66;
    border-color: #13ce66
  }
  .hh-step__head.is-process,.hh-step__head.is-wait {
    color: #bfcbd9;
    border-color: #bfcbd9
  }

  .hh-step__head.is-text {
    font-size: 14px;
    border-width: 2px;
    border-style: solid
  }
  .hh-step__head.is-text.is-finish {
    color: #fff;
    background-color: #20a0ff;
    border-color: #20a0ff
  }
  .hh-step__head.is-text.is-error {
    color: #fff;
    background-color: #ff4949;
    border-color: #ff4949
  }
  .hh-step__head.is-text.is-success {
    color: #fff;
    background-color: #13ce66;
    border-color: #13ce66
  }
  .hh-step__head.is-text.is-wait {
    color: #bfcbd9;
    background-color: #fff;
    border-color: #bfcbd9
  }
  .hh-step__head.is-text.is-process {
    color: #fff;
    background-color: #bfcbd9;
    border-color: #bfcbd9
  }
  .hh-step__main {
    white-space: normal;
    padding-right: 10px;
    text-align: left
  }

  .hh-step__title {
    font-size: 14px;
    line-height: 32px;
    display: inline-block
  }
  .hh-step__title.is-finish {
    font-weight: 700;
    color: #20a0ff
  }
  .hh-step__title.is-error {
    font-weight: 700;
    color: #ff4949
  }
  .hh-step__title.is-success {
    font-weight: 700;
    color: #13ce66
  }
  .hh-step__title.is-wait {
    font-weight: 400;
    color: #97a8be
  }

  .hh-step__title.is-process {
    font-weight: 700;
    color: #48576a
  }
  .hh-step__description {
    font-size: 12px;
    font-weight: 400;
    line-height: 14px
  }
  .hh-step__description.is-finish {
    color: #20a0ff
  }
  .hh-step__description.is-error {
    color: #ff4949
  }
  .hh-step__description.is-success {
    color: #13ce66
  }
  .hh-step__description.is-wait {
    color: #bfcbd9
  }
  .hh-step__description.is-process {
    color: #8391a5
  }




</style>

<script>
export default {
    name: 'UiStep',

    props: {
        title: String,
        icon: String,
        description: String,
        status: {
            type: String,
            default: 'wait'
        }
    },

    data() {
        return {
            index: -1,
            style: {},
            lineStyle: {},
            mainOffset: 0,
            isLast: false,
            currentStatus: this.status
        };
    },

    beforeCreate() {
        this.$parent.steps.push(this);
    },

    methods: {
        updateStatus(val) {
            const prevChild = this.$parent.$children[this.index - 1];

            if (val > this.index) {
                this.currentStatus = this.$parent.finishStatus;
            }
            else if (val === this.index) {
                this.currentStatus = this.$parent.processStatus;
            }
            else {
                this.currentStatus = 'wait';
            }

            if (prevChild) prevChild.calcProgress(this.currentStatus);
        },

        calcProgress(status) {
            let step = 100;
            const style = {};

            style.transitionDelay = 150 * this.index + 'ms';
            if (status === this.$parent.processStatus) {
                step = 50;
            }
            else if (status === 'wait') {
                step = 0;
                style.transitionDelay = (-150 * this.index) + 'ms';
            }

            this.$parent.direction === 'vertical'
                ? style.height = step + '%'
                : style.width = step + '%';

            this.lineStyle = style;
        },

        adjustPosition() {
            this.style = {};
            this.$parent.stepOffset = this.$el.getBoundingClientRect().width / (this.$parent.steps.length - 1);
        }
    },

    mounted() {
        const parent = this.$parent;
        const isCenter = parent.center;
        const len = parent.steps.length;
        const isLast = this.isLast = parent.steps[parent.steps.length - 1] === this;
        const space = typeof parent.space === 'number'
            ? parent.space + 'px'
            : parent.space
                ? parent.space
                : 100 / (isCenter ? len - 1 : len) + '%';

        if (parent.direction === 'horizontal') {
            this.style = { width: space };
            if (parent.alignCenter) {
                this.mainOffset = -this.$refs.title.getBoundingClientRect().width / 2 + 16 + 'px';
            }
            isCenter && isLast && this.adjustPosition();
        }
        else {
            if (!isLast) {
                this.style = { height: space };
            }
        }

        const unwatch = this.$watch('index', val => {
            this.$watch('$parent.active', this.updateStatus, { immediate: true });
            unwatch();
        });
    }
};
</script>
