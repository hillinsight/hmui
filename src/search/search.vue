<template>
    <div class="h-search">
        <div class="h-searchbar">
            <div class="h-searchbar-inner">
                <i class="h-icon-search-1" @click="handleClick"></i>
                <input
                        ref="input"
                        type="text"
                        v-model="currentValue"
                        :placeholder="placeholder"
                        class="h-searchbar-core" @keyup.enter="handleClick">
                <i class="h-icon-circle-close" @click="currentValue = ''" v-show="currentValue != ''"></i>
            </div>
            <a
                    class="h-searchbar-cancel"
                    @click="handleCancel"
                    v-show="currentValue != ''"
                    v-text="cancelText">
            </a>
        </div>

    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .h-icon-search-1, .h-icon-circle-close {
        margin-top: 3px;
    }

    .h-icon-search-1 {
        color: #999;
    }

    .h-icon-circle-close {
        font-size: 16px;
        color: #ccc;
    }
</style>
<script>
    /**
     * h-search
     * @module components/search
     * @desc 搜索框
     * @param {string} value - 绑定值
     * @param {string} [cancel-text=取消] - 取消按钮文字
     * @param {string} [placeholder=取消] - 搜索框占位内容
     * @param {boolean} [autofocus=false] - 自动 focus
     *
     *
     * @example
     * <h-search :value.sync="value"></h-search>
     */
    export default {
        name: 'h-search',
        data() {
            return {
                currentValue: this.value || ''
            };
        },
        watch: {
            currentValue(val) {
                this.$emit('input', val);
            },

            value(val) {
                this.currentValue = val;
            }
        },
        props: {
            value: String,
            autofocus: Boolean,
            cancelText: {
                default: '取消'
            },
            placeholder: {
                default: '搜索'
            },
            onIconClick: Function,
            cancelable: {
                type: Boolean,
                default: false
            }

        },
        methods: {
            handleClick() {
                this.onIconClick();
            },
            handleCancel() {
                this.currentValue = '';
                if (this.cancelable) {
                    this.handleClick();
                }
            }
        }
    };
</script>

<style lang="css">

    .h-search {
        height: 100%;
        height: 100vh;
        overflow: hidden;
    }

    .h-searchbar {
        position: relative;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        background-color: #d9d9d9;
        box-sizing: border-box;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        padding: 8px 10px;
        z-index: 1;
    }

    .h-searchbar-inner {
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        background-color: #fff;
        border-radius: 2px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        height: 28px;
        padding: 4px 6px;
    }

    .h-searchbar-inner .mintui-search {
        font-size: 12px;
        color: #d9d9d9;
    }

    .h-searchbar-core {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border: 0;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        outline: 0;
    }

    .h-searchbar-cancel {
        /*color: #26a2ff;*/
        margin-left: 10px;
        text-decoration: none;
    }


</style>
