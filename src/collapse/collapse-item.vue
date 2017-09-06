<template>
    <div class="h-collapse-item" :class="{'is-active': isActive}">
        <div class="h-collapse-item-header" @click="handleHeaderClick">
            <div class="h-collapse-item-title">
                <slot name="title">{{title}}</slot>
            </div>
            <i v-if="!$parent.disabled" class="h-collapse-item-arrow" :class="{'h-icon-arrow-up': isActive, 'h-icon-arrow-down': !isActive}"></i>
        </div>
        <div class="h-collapse-item-wrap" v-show="isActive">
            <div class="h-collapse-item-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
    .h-collapse-item {
        background: #fff;
    }
    .h-collapse-item-header {
        display: flex;
        padding: .5rem;
    }
    .h-collapse-item-title {
        width: 100%;
        flex: 1;
        align-items: center;
        font-size: .7rem;
        height: 1rem;
        line-height: 1rem;
        &:before {
            content: '';
            display: inline-block;
            width: 2px;
            height: .75rem;
            background: #59aec6;
            margin-right: 5px;
            vertical-align: text-bottom;
        }
    }
    .h-collapse-item-arrow {
        line-height: 1rem;
        color: #59aec6;
    }
    .h-collapse-item-content {
        /*overflow: hidden;*/
    }
</style>
<script>
    import Emitter from '../mixins/emitter';

    export default{
        name: 'HCollapseItem',
        componentName: 'HCollapseItem',
        mixins: [Emitter],
        props: {
            title: String,
            name: {
                type: [String, Number],
                default() {
                    return this._uid;
                }
            }
        },
        data() {
            return {
                contentWrapStyle: {
                    height: 'auto',
                    display: 'block'
                },
                contentHeight: 0
            };
        },
        computed: {
            isActive() {
                return this.$parent.disabled || this.$parent.activeNames.indexOf(this.name) > -1;
            }
        },
        methods: {
            handleHeaderClick() {
                if (!this.$parent.disabled) {
                    this.dispatch('HCollapse', 'item-click', this);
                }
            }
        }
    };
</script>
