<template>
  <label class="h-radio">
    <span class="h-radio__input"
      :class="{
        'is-disabled': disabled,
        'is-checked': model === label
      }"
    >
      <slot name="inner">
        <span class="h-radio__inner"></span>
      </slot>
      <input
        class="h-radio__original"
        :value="label"
        type="radio"
        v-model="model"
        :name="name"
        :disabled="disabled">
    </span>
    <span class="h-radio__label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import './radio.less';
  import Emitter from '../mixins/emitter';

  export default {
      name: 'HRadio',

      mixins: [Emitter],

      componentName: 'HRadio',

      props: {
          value: {},
          label: {},
          disabled: Boolean,
          name: String
      },

      data() {
          return {
          };
      },

      computed: {
          isGroup() {
              let parent = this.$parent;
              while (parent) {
                  if (parent.$options.componentName !== 'HRadioGroup') {
                      parent = parent.$parent;
                  }
                  else {
                      this._radioGroup = parent;
                      return true;
                  }
              }
              return false;
          },

          model: {
              get() {
                  return this.isGroup ? this._radioGroup.value : this.value;
              },

              set(val) {
                  if (this.isGroup) {
                      this.dispatch('HRadioGroup', 'input', [val]);
                  }
                  else {
                      this.$emit('input', val);
                  }
              }
          }
      }
  };
</script>
