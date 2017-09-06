<template>
    <li :class="classes">
        <slot>
            {{ data.label }}
        </slot>
        <i v-if="showArrow" class="mintui h-icon-arrow-right"></i>
        <i v-if="showLoading" class="mintui h-icon-load h-load-loop"></i>
    </li>
</template>
<script>
    export default {
        name: 'HCasitem',
        componentName: 'HCasitem',
        props: {
            data: Object,
            prefixCls: String,
            tmpItem: Object,
            isroot: Boolean
        },
        computed: {
            classes() {
                return [
                    `${this.prefixCls}-menu-item`,
                    {
                        [`${this.prefixCls}-menu-item-active`]: this.tmpItem.value === this.data.value,
                        [`${this.prefixCls}-menu-item-disabled`]: this.data.disabled
                    }
                ];
            },
            showArrow() {
                return !this.isroot && ((this.data.children && this.data.children.length) || ('loading' in this.data && !this.data.loading));
            },
            showLoading() {
                return 'loading' in this.data && this.data.loading;
            }
        }
    };
</script>
