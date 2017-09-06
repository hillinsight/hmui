<template>
    <div class="hh-col" :class="classes" :style="style"><slot></slot></div>
</template>
<style lang="less" rel="stylesheet/less">
    .loop(@counter) when (@counter > 0) {
        .loop((@counter - 1));
        .hh-col-@{counter} {
            box-sizing: border-box;
            width: calc(1 / 24 * @counter * 100%);
        }
        .hh-col-offset-@{counter} {
            margin-left: calc(1 / 24 * @counter * 100%);
        }
        .hh-col-pull-@{counter} {
            position: relative;
            right: calc(1 / 24 * @counter * 100%);
        }
        .hh-col-push-@{counter} {
            position: relative;
            left: calc(1 / 24 * @counter * 100%);
        }
    }
    .loop(24);
</style>
<script>
export default {
    name: 'HCol',

    props: {
        span: {
            type: Number,
            default: 24
        },
        offset: Number,
        pull: Number,
        push: Number
    },

    computed: {
        gutter() {
            return this.$parent.gutter;
        },

        style() {
            let ret = {};

            if (this.gutter) {
                ret.paddingLeft = this.gutter / 2 + 'px';
                ret.paddingRight = ret.paddingLeft;
            }

            return ret;
        },
        classes() {
            let classList = [];

            ['span', 'offset', 'pull', 'push'].forEach(prop => {
                if (this[prop]) {
                    classList.push(
                        prop !== 'span'
                            ? `hh-col-${prop}-${this[prop]}`
                            : `hh-col-${this[prop]}`
                    );
                }
            });
            return classList;
        }
    }
};
</script>