<template>
  <div
    class="hh-steps"
    :class="['is-' + direction, center ? 'is-center' : '']">
    <slot></slot>
  </div>
</template>

<style>
  .hh-steps {
    font-size: 0
  }
  .hh-steps>:last-child .hh-step__line {
    display: none
  }
  .hh-steps.is-horizontal {
    white-space: nowrap
  }
  .hh-steps.is-horizontal.is-center {
    text-align: center
  }
</style>

<script>
export default {
    name: 'UiSteps',
    props: {
        space: [Number, String],
        active: Number,
        direction: {
            type: String,
            default: 'horizontal'
        },
        alignCenter: Boolean,
        center: Boolean,
        finishStatus: {
            type: String,
            default: 'finish'
        },
        processStatus: {
            type: String,
            default: 'process'
        }
    },

    data() {
        return {
            steps: [],
            stepOffset: 0
        };
    },

    watch: {
        active(newVal, oldVal) {
            this.$emit('change', newVal, oldVal);
        },

        steps(steps) {
            steps.forEach((child, index) => {
                child.index = index;
            });
        }
    }
};
</script>
