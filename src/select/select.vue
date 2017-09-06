<template>
    <label>
        <select class="h-select" :class="{'h-select-block':type==='block'}" :disabled="disabled" v-model="model" :value="value" @change="change"><slot></slot></select>
    </label>
</template>
<style>
    .h-select {
        -webkit-appearance: none;
        background: url(../img/arrow_down.png) right center no-repeat #f8f8f8;
        background-size: 16px 16px;
        background-origin: content-box;
        height: 32px;
        line-height: 32px;
        border: 1px solid #ddd;
        padding: 0 10px;
        display: inline-block;
        border-radius: 3px;
        outline: none;
        color: #666;
        font-size: 14px;
    }
    .h-select-block {
        display: block;
        width: 100%;
    }
</style>
<script>
    export default{
        props: {
            value: {
            },
            disabled: Boolean,
            type: String
        },
        data() {
            return {
            };
        },
        computed: {
            model: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('input', val);
                }
            }
        },
        methods: {
            change(e) {
                this.$emit('change', this.value, e);
            }
        }
    };
</script>
