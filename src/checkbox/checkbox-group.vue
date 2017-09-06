<script>
  export default {
      name: 'ElCheckboxGroup',

      componentName: 'ElCheckboxGroup',

      props: {
          value: {}
      },
      watch: {
          value(value) {
              this.$emit('change', value);
          }
      }
  };
</script>

<template>
  <div class="el-checkbox-group">
    <slot></slot>
  </div>
</template>
