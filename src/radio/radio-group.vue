<script>
  export default {
      name: 'HRadioGroup',

      componentName: 'HRadioGroup',

      props: {
          value: [String, Number],
          size: String,
          fill: {
              type: String,
              default: '#4c85ca'
          },
          textColor: {
              type: String,
              default: '#fff'
          }
      },
      watch: {
          value(value) {
              this.$emit('change', value);
          }
      }
  };
</script>

<template>
  <div class="h-radio-group">
    <slot></slot>
  </div>
</template>
