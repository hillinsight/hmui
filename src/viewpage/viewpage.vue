<template>
    <div class="h-viewpage">
        <template v-if="ready">
            <div class="h-viewpage-error" v-if="!!error">
                <img src="./img/4.png" width="180" height="140">
                <p>{{error.message}}</p>
            </div>
            <div class="h-viewpage-empty" v-else-if="empty">
                <img src="./img/4.png" width="180" height="140">
                <p>暂无数据</p>
            </div>
            <template v-else>
                <div class="h-viewpage-header" v-if="$slots.header">
                    <slot name="header"></slot>
                </div>
                <div class="h-viewpage-inner">
                    <div class="h-viewpage-inner-container">
                        <slot></slot>
                    </div>
                </div>
                <div class="h-viewpage-footer" v-if="$slots.footer">
                    <slot name="footer"></slot>
                </div>
            </template>
        </template>
        <div class="h-viewpage-loading" v-else>
            <mt-spinner type="double-bounce" color="#4C85CA"></mt-spinner>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
    .h-viewpage {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border-top: 1px solid #eee;
    }
    .h-viewpage-inner {
        position: relative;
        height: 100%;
        flex: 1;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    .h-viewpage-inner-container {
        max-width: 750px;
        margin: 0 auto;
        overflow: hidden;
    }
    .h-viewpage-footer {
    }
    .h-viewpage-error,
    .h-viewpage-loading,
    .h-viewpage-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 80vh;
        justify-content: center;
        color: #999;
    }
</style>
<script>
    export default {
        name: 'Viewpage',
        componentName: 'Viewpage',
        props: {
            ready: {
                type: Boolean,
                default: true
            },
            empty: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                error: null
            };
        },
        mounted() {
            this.$on('error', message => {
                if (message) {
                    this.error = {
                        message: message
                    };
                }
                else {
                    this.error = null;
                }
            });
            // fix 下拉回弹
            let el = $('.h-viewpage-inner', this.$el)[0];
            el.addEventListener('touchstart', function (e) {
                document.body.scrollTop = 1;
            //                let st = this.scrollTop;
            //                if (st <= 0) {
            //                    this.scrollTop = 1;
            //                }
            //                if (st + this.offsetHeight >= this.scrollHeight) {
            //                    this.scrollTop = this.scrollHeight - this.offsetHeight - 1;
            //                }
            }, false);
        }
    };
</script>
