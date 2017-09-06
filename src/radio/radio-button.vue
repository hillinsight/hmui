<script>
  export default {
      name: 'HRadioButton',

      props: {
          label: {},
          disabled: Boolean,
          name: String
      },
      computed: {
          value: {
              get() {
                  return this._radioGroup.value;
              },
              set(value) {
                  this._radioGroup.$emit('input', value);
              }
          },
          _radioGroup() {
              let parent = this.$parent;
              while (parent) {
                  if (parent.$options.componentName !== 'HRadioGroup') {
                      parent = parent.$parent;
                  }
                  else {
                      return parent;
                  }
              }
              return false;
          },
          activeStyle() {
              return {
                  backgroundColor: this._radioGroup.fill,
                  borderColor: this._radioGroup.fill,
                  color: this._radioGroup.textColor
              };
          },
          size() {
              return this._radioGroup.size;
          }
      }
  };
</script>

<template>
  <label
    class="h-radio-button"
    :class="[
      size ? 'h-radio-button--' + size : '',
      { 'is-active': value === label }
    ]"
  >
    <input
      class="h-radio-button__orig-radio"
      :value="label"
      type="radio"
      v-model="value"
      :name="name"
      :disabled="disabled">
    <span class="h-radio-button__inner" :style="value === label ? activeStyle : null">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
