<template>
    <span class="h-cascader-caspanel">
        <ul v-if="data && data.length" :class="[prefixCls + '-menu']">
            <template v-if="isneedall">
                 <slot name="isneedall">
                    <h-casitem
                            :prefix-cls="prefixCls"
                            :data="root"
                            :tmp-item="tmpItem"
                            :isroot="true"
                            @click.native.stop="handleClickItem(root,true)"
                            @mouseenter.native.stop="handleHoverItem(root)">
                        全部
                    </h-casitem>
                </slot>
            </template>
            <h-casitem
                v-for="item in data"
                :key="item.value"
                :prefix-cls="prefixCls"
                :data="item"
                :tmp-item="tmpItem"
                @click.native.stop="handleClickItem(item)"
                @mouseenter.native.stop="handleHoverItem(item)"></h-casitem>
        </ul>
        <h-caspanel v-if="sublist && sublist.length"
                       :prefix-cls="prefixCls"
                       :data="sublist"
                       :disabled="disabled"
                       :trigger="trigger"
                       :change-on-select="changeOnSelect"
                       :isneedall="isneedall"
                       :root="rootData"></h-caspanel>
    </span>
</template>
<script>
    import HCasitem from './casitem.vue';
    import Emitter from '../mixins/emitter';
    import { findComponentUpward } from '../utils/assist';
    // import u from 'underscore';
    export default {
        name: 'HCaspanel',
        componentName: 'HCaspanel',

        mixins: [ Emitter ],
        components: { HCasitem },
        props: {
            data: {
                type: Array,
                default() {
                    return [];
                }
            },
            disabled: Boolean,
            changeOnSelect: Boolean,
            trigger: String,
            prefixCls: String,
            isneedall: Boolean,
            root: {}
        },
        data() {
            return {
                tmpItem: {},
                result: [],
                sublist: [],
                rootData: {},
                currentValue: [],
                isChange: false
            };
        },
        watch: {
            data() {
                this.sublist = [];
            }
        },
        methods: {
            handleClickItem(item, isroot = false) {
                if (this.trigger !== 'click' && item.children) return;
                this.handleTriggerItem(item, false, true, isroot);
            },
            handleHoverItem(item) {
                if (this.trigger !== 'hover' || !item.children) return;
                this.handleTriggerItem(item, false, true);
            },
            handleTriggerItem(item, fromInit = false, fromUser = false, isroot = false) {
                if (item.disabled) return;

                if (item.loading !== undefined && !item.children.length) {
                    const cascader = findComponentUpward(this, 'HCascader');
                    if (cascader && cascader.loadData) {
                        cascader.loadData(item, () => {
                            // todo
                            if (fromUser) {
                                cascader.isLoadedChildren = true;
                            }
                            this.handleTriggerItem(item);
                        });
                        return;
                    }
                }

                // return value back recursion  // 向上递归，设置临时选中值（并非真实选中）
                const backItem = this.getBaseItem(item);
                this.tmpItem = backItem;
                this.emitUpdate([backItem]);
                this.rootData = item;
                if (item.children && item.children.length && !isroot) {
                    this.sublist = item.children;
                    this.dispatch('HCascader', 'on-result-change', {
                        lastValue: (item.value === this.currentValue[this.currentValue.length - 1]),
                        //                        lastValue: false,
                        changeOnSelect: this.changeOnSelect,
                        fromInit: fromInit
                    });
                }
                else {
                    this.sublist = [];
                    this.dispatch('HCascader', 'on-result-change', {
                        lastValue: true,
                        changeOnSelect: this.changeOnSelect,
                        fromInit: fromInit
                    });
                }
            },
            updateResult(item) {
                this.result = [this.tmpItem].concat(item);
                this.emitUpdate(this.result);
            },
            getBaseItem(item) {
                let backItem = Object.assign({}, item);
                if (backItem.children) {
                    delete backItem.children;
                }

                return backItem;
            },
            emitUpdate(result) {
                if (this.$parent.$options.name === 'HCaspanel') {
                    this.$parent.updateResult(result);
                }
                else {
                    this.$parent.$parent.updateResult(result);
                }
            }
        },
        mounted() {
            this.$on('on-find-selected', (params) => {
                const val = params.value;
                let value = [...val];

                this.currentValue = [...val];
                for (let i = 0; i < value.length; i++) {
                    for (let j = 0; j < this.data.length; j++) {
                        if (value[i] === this.data[j].value) {
                            this.handleTriggerItem(this.data[j], true);
                            value.splice(0, 1);
                            this.$nextTick(() => {
                                this.broadcast('HCaspanel', 'on-find-selected', {
                                    value: value
                                });
                            });
                            return false;
                        }
                    }
                }
            });
            this.$on('on-clear', () => {
                this.sublist = [];
                this.tmpItem = {};
            });
        }
    };
</script>
