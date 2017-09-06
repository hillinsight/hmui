<template>
    <router-link class="mint-tab-item" :to="to">
        <div class="mint-tab-item-icon"><slot name="icon"></slot></div>
        <div class="mint-tab-item-label"><slot></slot></div>
    </router-link>
</template>
<style lang="less" rel="stylesheet/less" scoped>
</style>
<script>
    export default{
        name: 'h-tab-item',
        props: {
            to: {
                type: [String, Object],
                required: true
            }
        }
    };
</script>
