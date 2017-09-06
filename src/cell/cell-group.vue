<template>
    <div class="h-cell-group">
        <div class="content-block-title" v-if="title">
            <slot name="title">{{title}}</slot>
        </div>
        <div class="list-block" :class="{'media-list': type=='media'}">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .h-cell-group {
        .content-block-title {
            margin: .75rem .5rem .25rem;
            color: #666;
        }
        .list-block {
            background: #fff;
            border: 1px solid #eee;
            border-left: none;
            border-right: none;
        }
    }
</style>
<script>
    export default{
        props: {
            title: {
                type: String
            },
            type: { // 可选值： normal, media
                type: String,
                default() {
                    return 'normal';
                }
            }
        },
        data() {
            return {
            };
        }
    };
</script>
