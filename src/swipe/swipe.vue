<template>
    <div class="hh-swipe" :class="{animate: animate}">
        <div class="hh-swipe-wrapper" ref="wrapper">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
    .hh-swipe {
        position: relative;
        overflow: hidden;
        &.animate {
            .hh-swipe-wrapper {
                transition: transform .3s ease-in;
            }
        }
    }

    .hh-swipe-wrapper {
        display: flex;
        position: relative;
        height: 100%;
        width: 100%;
        box-sizing: content-box;
        transform: translate3d(0, 0, 0);
    }
</style>
<script>
    import Hammer from 'hammerjs';
    function getStyle(element) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(element);
        }
        return element.currentStyle;
    }
    export default{
        name: 'HSwipe',
        data() {
            return {
                currentIndex: 0,
                offset: 0,
                animate: false
            };
        },
        methods: {
            _init() {
                let hammer = new Hammer.Manager(this.$el);
                hammer.add(new Hammer.Pan({
                    direction: Hammer.DIRECTION_HORIZONTAL,
                    threshold: 10
                }));
                hammer.on('panstart panmove panend pancancel', Hammer.bindFn(this.onPan, this));

                setTimeout(() => {
                    this.show(this.currentIndex);
                }, 0);
            },
            onPan(e) {
                this.animate = false;
                let delta = e.deltaX;
                if ((delta > 0 && this.currentIndex === 0) || (delta < 0 && this.currentIndex === this.$children.length - 1)) {
                    delta = delta * 0.3;
                }
                let offset = this.offset - delta;

                let translate = 'translate3d(' + (offset * -1) + 'px, 0px, 0px)';
                this.$refs.wrapper.style.transform = translate;
                this.$refs.wrapper.style.mozTransform = translate;
                this.$refs.wrapper.style.webkitTransform = translate;

                if (e.type === 'panend' || e.type === 'pancancel') {
                    let percent = delta / this.$el.offsetWidth * 100;
                    if (Math.abs(percent) > 20 && e.type === 'panend') {
                        this.currentIndex += (delta < 0) ? 1 : -1;
                    }
                    this.show(this.currentIndex);
                }
            },
            show(idx, animate = true) {
                this.animate = animate;
                let children = this.$children;
                if (idx > children.length - 1) {
                    idx = children.length - 1;
                }
                if (idx < 0) {
                    idx = 0;
                }
                let offset = 0;
                if (idx !== 0 && children.length - 1 === idx) {
                    let width = 0;
                    for (let i = 0; i < children.length; i++) {
                        width += children[i].$el.offsetWidth;
                    }
                    offset = width - parseInt(getStyle(this.$el).width);
                }
                else {
                    for (let i = 0; i < idx; i++) {
                        offset += children[i].$el.offsetWidth;
                    }
                }
                let translate = 'translate3d(' + (offset * -1) + 'px, 0px, 0px)';
                this.$refs.wrapper.style.transform = translate;
                this.$refs.wrapper.style.mozTransform = translate;
                this.$refs.wrapper.style.webkitTransform = translate;
                this.offset = offset;
                this.currentIndex = idx;

                this.$nextTick(() => {
                    children.forEach((child, i) => {
                        child.active = idx === i;
                    });
                });

                this.$emit('change', this.currentIndex);
            },
            showSwipeItem(child) {
                let idx = this.$children.findIndex(item => {
                    return item === child;
                });
                if (idx !== -1) {
                    this.show(idx);
                }
            }
        },
        mounted() {
            this._init();
        }
    };
</script>
