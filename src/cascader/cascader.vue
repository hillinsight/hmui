<template>
    <div :class="classes" v-clickoutside="handleClose">
        <div class="h-cascader-modal" v-show="visible" @click="toggleOpen"></div>
        <div :class="[prefixCls + '-rel']" @click="toggleOpen">
            <slot>
                <mt-field
                        ref="input"
                        :readonly="!filterable"
                        :disabled="disabled"
                        :value="displayInputRender"
                        @input="handleInput"
                        :size="size"
                        :placeholder="placeholder"
                        :disableClear="true"
                ></mt-field>
                <div
                    :class="[prefixCls + '-label']"
                    v-show="filterable && query === ''"
                    @click="handleFocus">{{ displayRender }}</div>
                <i class="mintui h-icon-circle-close" :class="[prefixCls + '-arrow']" v-show="showCloseIcon" @click.stop="clearSelect"></i>
                <i class="mintui h-icon-arrow-down" :class="[prefixCls + '-arrow']"></i>
            </slot>
        </div>

        <transition name="slide-up">
            <h-drop v-show="visible">
                <div>
                    <h-caspanel
                        v-show="!filterable || (filterable && query === '')"
                        ref="caspanel"
                        :prefix-cls="prefixCls"
                        :data="data"
                        :disabled="disabled"
                        :change-on-select="changeOnSelect"
                        :trigger="trigger"
                        :isneedall="isneedall"
                        :root="root"
                    ></h-caspanel>
                    <div :class="[prefixCls + '-dropdown']" v-show="filterable && query !== '' && querySelections.length">
                        <ul :class="[selectPrefixCls + '-dropdown-list']">
                            <li
                                :class="[selectPrefixCls + '-item', {
                                    [selectPrefixCls + '-item-disabled']: item.disabled
                                }]"
                                v-for="(item, index) in querySelections"
                                :key="item.value"
                                @click="handleSelectItem(index)" v-html="item.display"></li>
                        </ul>
                    </div>
                    <ul v-show="filterable && query !== '' && !querySelections.length" :class="[prefixCls + '-not-found-tip']"><li>{{ notFoundText }}</li></ul>
                </div>
            </h-drop>
        </transition>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .slide-up-enter-active, .slide-up-appear {
         animation-duration: .3s;
         animation-fill-mode: both;
         animation-play-state: paused;
     }
    .slide-up-leave-active {
         animation-duration: .3s;
         animation-fill-mode: both;
         animation-play-state: paused;
     }
    .slide-up-enter-active, .slide-up-appear {
         animation-name: HSlideUpIn;
         animation-play-state: running;
     }
    .slide-up-leave-active {
         animation-name: HSlideUpOut;
         animation-play-state: running;
     }
    @keyframes HSlideUpIn {
        0% {
            opacity: 0;
            transform-origin: 0% 0%;
            transform: scaleY(.8);
        }
        100% {
            opacity: 1;
            transform-origin: 0% 0%;
            transform: scaleY(1);
        }
    }
    @keyframes HSlideUpOut {
        0% {
            opacity: 1;
            transform-origin: 0% 0%;
            transform: scaleY(1);
        }
        100% {
            opacity: 0;
            transform-origin: 0% 0%;
            transform: scaleY(.8);
        }
    }
    .slide-up-enter-active {
        opacity: 0;
        animation-timing-function: ease-in-out;
    }
    .slide-up-leave-active {
        animation-timing-function: ease-in-out;
    }

</style>
<script>
    import './cascader.less';
    import HDrop from '../dropdown/dropdown.vue';
    import HCaspanel from './caspanel.vue';
    import clickoutside from '../utils/clickoutside';
    import { oneOf } from '../utils/assist';
    import Emitter from '../mixins/emitter';

    const prefixCls = 'h-cascader';
    const selectPrefixCls = 'h-select';

    export default {
        name: 'HCascader',
        componentName: 'HCascader',
        mixins: [ Emitter ],
        components: { HDrop, HCaspanel },
        directives: { clickoutside },
        props: {
            data: {
                type: Array,
                default() {
                    return [];
                }
            },
            value: {
                type: Array,
                default() {
                    return [];
                }
            },
            disabled: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: true
            },
            placeholder: {
                type: String
            },
            size: {
                validator(value) {
                    return oneOf(value, ['small', 'large']);
                }
            },
            trigger: {
                validator(value) {
                    return oneOf(value, ['click', 'hover']);
                },
                default: 'click'
            },
            changeOnSelect: {
                type: Boolean,
                default: false
            },
            renderFormat: {
                type: Function,
                default(label) {
                    return label.join(' / ');
                }
            },
            loadData: {
                type: Function
            },
            filterable: {
                type: Boolean,
                default: false
            },
            notFoundText: {
                type: String
            },
            isneedall: {
                type: Boolean,
                default: false
            },
            root: {}
        },
        data() {
            return {
                prefixCls: prefixCls,
                selectPrefixCls: selectPrefixCls,
                visible: false,
                selected: [],
                tmpSelected: [],
                updatingValue: false, // to fix set value in changeOnSelect type
                currentValue: this.value,
                query: '',
                validDataStr: '',
                isLoadedChildren: false // #950
            };
        },
        computed: {
            classes() {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-show-clear`]: this.showCloseIcon,
                        [`${prefixCls}-size-${this.size}`]: !!this.size,
                        [`${prefixCls}-visible`]: this.visible,
                        [`${prefixCls}-disabled`]: this.disabled,
                        [`${prefixCls}-not-found`]: this.filterable && this.query !== '' && !this.querySelections.length
                    }
                ];
            },
            showCloseIcon() {
                return this.currentValue && this.currentValue.length && this.clearable && !this.disabled;
            },
            displayRender() {
                let label = [];
                for (let i = 0; i < this.selected.length; i++) {
                    label.push(this.selected[i].label);
                }
                return this.renderFormat(label, this.selected);
            },
            displayInputRender() {
                return this.filterable ? '' : this.displayRender;
            },
            querySelections() {
                let selections = [];
                function getSelections(arr, label, value) {
                    for (let i = 0; i < arr.length; i++) {
                        let item = arr[i];
                        item.__label = label ? label + ' / ' + item.label : item.label;
                        item.__value = value ? value + ',' + item.value : item.value;

                        if (item.children && item.children.length) {
                            getSelections(item.children, item.__label, item.__value);
                            delete item.__label;
                            delete item.__value;
                        }
                        else {
                            selections.push({
                                label: item.__label,
                                value: item.__value,
                                display: item.__label,
                                item: item,
                                disabled: !!item.disabled
                            });
                        }
                    }
                }
                getSelections(this.data);
                selections = selections.filter(item => item.label.indexOf(this.query) > -1).map(item => {
                    item.display = item.display.replace(new RegExp(this.query, 'g'), `<span>${this.query}</span>`);
                    return item;
                });
                return selections;
            }
        },
        methods: {
            clearSelect() {
                if (this.disabled) return false;
                const oldVal = JSON.stringify(this.currentValue);
                this.currentValue = this.selected = this.tmpSelected = [];
                this.handleClose();
                this.emitValue(this.currentValue, oldVal);
                //                this.$broadcast('on-clear');
                this.broadcast('HCaspanel', 'on-clear');
            },
            handleClose() {
                this.visible = false;
            },
            toggleOpen() {
                if (this.disabled) return false;
                if (this.visible) {
                    if (!this.filterable) this.handleClose();
                }
                else {
                    this.onFocus();
                }
            },
            onFocus() {
                this.visible = true;
                if (!this.currentValue.length) {
                    this.broadcast('HCaspanel', 'on-clear');
                }
            },
            updateResult(result) {
                this.tmpSelected = result;
            },
            updateSelected(init = false) {
                if (!this.changeOnSelect || init) {
                    this.broadcast('HCaspanel', 'on-find-selected', {
                        value: this.currentValue
                    });
                }
            },
            emitValue(val, oldVal) {
                if (JSON.stringify(val) !== oldVal) {
                    this.$emit('on-change', this.currentValue, JSON.parse(JSON.stringify(this.selected)));
                    this.$nextTick(() => {
                        this.dispatch('FormItem', 'on-form-change', {
                            value: this.currentValue,
                            selected: JSON.parse(JSON.stringify(this.selected))
                        });
                    });
                }
            },
            handleInput(val) {
                this.query = val;
            },
            handleSelectItem(index) {
                const item = this.querySelections[index];

                if (item.item.disabled) return false;
                this.query = '';
                this.$refs.input.currentValue = '';
                const oldVal = JSON.stringify(this.currentValue);
                this.currentValue = item.value.split(',');
                this.emitValue(this.currentValue, oldVal);
                this.handleClose();
            },
            handleFocus() {
                this.$refs.input.focus();
            },
            // 排除 loading 后的 data，避免重复触发 updateSelect
            getValidData(data) {
                function deleteData(item) {
                    const newitem = Object.assign({}, item);
                    if ('loading' in newitem) {
                        delete newitem.loading;
                    }
                    if ('__value' in newitem) {
                        delete newitem.__value;
                    }
                    if ('__label' in newitem) {
                        delete newitem.__label;
                    }
                    if ('children' in newitem && newitem.children.length) {
                        newitem.children = newitem.children.map(i => deleteData(i));
                    }
                    return newitem;
                }

                return data.map(item => deleteData(item));
            }
        },
        created() {
            this.validDataStr = JSON.stringify(this.getValidData(this.data));
            this.$on('on-result-change', (params) => {
                // lastValue: is click the final val
                // fromInit: is this emit from update value
                const lastValue = params.lastValue;
                const changeOnSelect = params.changeOnSelect;
                const fromInit = params.fromInit;
                if (lastValue || changeOnSelect) {
                    const oldVal = JSON.stringify(this.currentValue);
                    this.selected = this.tmpSelected;
                    let newVal = [];
                    this.selected.forEach((item) => {
                        newVal.push(item.value);
                    });

                    if (!fromInit) {
                        this.updatingValue = true;
                        this.currentValue = newVal;
                        this.emitValue(this.currentValue, oldVal);
                    }
                }
                if (lastValue && !fromInit) {
                    console.log('----lastValue && !fromInit----');
                    this.handleClose();
                }
            });
        },
        mounted() {
            this.updateSelected(true);
        },
        watch: {
            visible(val) {
                if (val) {
                    if (this.currentValue.length) {
                        this.updateSelected();
                    }
                }
                else {
                    if (this.filterable) {
                        this.query = '';
                        this.$refs.input.currentValue = '';
                    }
                }
                this.$emit('on-visible-change', val);
            },
            value(val) {
                this.currentValue = val;
                if (!val.length) this.selected = [];
            },
            currentValue() {
                this.$emit('input', this.currentValue);
                if (this.updatingValue) {
                    this.updatingValue = false;
                    return;
                }
                this.updateSelected(true);
            },
            data: {
                deep: true,
                handler() {
                    const validDataStr = JSON.stringify(this.getValidData(this.data));
                    if (validDataStr !== this.validDataStr) {
                        this.validDataStr = validDataStr;
                        if (!this.isLoadedChildren) {
                            this.$nextTick(() => this.updateSelected());
                        }
                        this.isLoadedChildren = false;
                    }
                }
            }
        }
    };
</script>
