<template>
    <div class="hh-swipe-item" @click="handleClick" :class="{'hh-swipe-item-active': active}">
        <slot></slot>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
    .hh-swipe-item {
        flex-shrink: 0;
        width: 100%;
        transform: translate3d(0, 0, 0);
        transition: transform .35s ease-in;
    }
    .hh-swipe-item-active {
    }
</style>
<script>
export default{
    name: 'HSwipeItem',
    data() {
        return {
            active: false
        };
    },
    methods: {
        handleClick() {
            this.$parent.showSwipeItem(this);
        }
    }
};
</script>
