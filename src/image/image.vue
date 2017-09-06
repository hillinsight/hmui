<template>
    <div class="h-image" :style="styles">
        <img :src="value" v-if="value" @error="onerror">
        <img :src="placeholder" v-else>
    </div>
</template>
<style rel="stylesheet" lang="less" scoped>
    .h-image {
        display: inline-block;
        img {
            width: 100%;
            height: 100%;
        }
    }
</style>
<script>
    let placeholder = '';
    export function setPlaceholder(value) {
        placeholder = value;
    }

    export default {
        props: {
            width: [Number, String],
            height: [Number, String],
            value: String,
            placeholder: {
                type: String,
                default: placeholder
            }
        },
        data() {
            return {
            };
        },
        computed: {
            styles() {
                let st = {};
                if (this.width) {
                    st.width = this.width + 'px';
                }
                if (this.height) {
                    st.height = this.height + 'px';
                }
                return st;
            }
        },
        methods: {
            onerror() {
                this.$emit('input', '')
            }
        },
        mounted() {
        }
    };
</script>

