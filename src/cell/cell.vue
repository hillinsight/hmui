<template>
    <div class="h-cell" :class="{'h-cell-link': !!to && islink}">
        <div class="item-content" @click="router">
            <div class="item-content-inner">
                <div class="item-media" v-if="$slots.media">
                    <slot name="media"></slot>
                </div>
                <div class="item-inner" v-if="type=='media'">
                    <div class="item-title-row">
                        <div class="item-title"><slot name="title">{{title}}</slot></div>
                        <div class="item-after"><slot name="description">{{description}}</slot></div>
                    </div>
                    <div class="item-subtitle" v-if="subtitle"><slot name="subtitle">{{subtitle}}</slot></div>
                    <div class="item-text" v-if="text"><slot name="text">{{text}}</slot></div>
                </div>
                <div class="item-inner" v-if="type=='normal'">
                    <div class="item-title"><slot name="title">{{title}}</slot></div>
                    <div class="item-after"><slot name="description">{{description}}</slot></div>
                </div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .h-cell {
        position: relative;
        .item-content {
            border-bottom: 1px solid #eee;
            padding: .5rem .5rem .5rem 0;
            margin-left: .5rem;
        }
        .item-content-inner {
            display: flex;
            align-items: center;
        }
        .item-media {
            margin-right: 6px;
        }
        .item-inner {
            width: 100%;
            display: flex;
            align-items: center;
            flex: 1;
        }
        .item-title {
            font-size: 16/20rem;
            color: #333;
            margin: 4px 0;
            width: 100%;
            flex: 1;
        }
        .item-after {
            font-size: 12px;
            color: #999;
        }
        &:last-child {
            .item-content {
                border: none;
            }
        }
    }
    .h-cell-link {
        .item-content-inner {
            padding-right: 1rem;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUM0QzFDNzMyREM0MTFFNUJDNTI4OTMzMEE0RjBENzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUM0QzFDNzQyREM0MTFFNUJDNTI4OTMzMEE0RjBENzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1QzRDMUM3MTJEQzQxMUU1QkM1Mjg5MzMwQTRGMEQ3MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QzRDMUM3MjJEQzQxMUU1QkM1Mjg5MzMwQTRGMEQ3MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pjs2Bb4AAAItSURBVHjazJhbK0RRGIb3DIOU/AG5kUTOgxmHceFGKf6BO+Vf+E8KKYcYg3FuMpNIDhFJXJAcp/GtvKumrzVs+zBrvfU2u689q6d3rb33+lYgl8tZvymZ3JOX7eQp8gT50fJA0Wj4z3tKbY5VR14hV5ObyWLkZ6sICtq4p4V8CjihevIWucoUQJFUmtUayTvkShMAL5DiGqs3IMlK3YBSgwrIZkBWmAAoIRMKyG2/IIMO/hMjbygepCS53ARAoQHyOqu1YbrLTADMAXJbASmSDOkGlOpTQHaQN72CdAuYBeQuq4cBWaIbUEJGC0Am3UIGPVoqMsk9Vu/CwxTQDSj0iSQPWD2C6Q7oBhT6AmRKAZkwAVDoowBkn+LdqQVQ6A2QhwrIuAmAEjKi2KrF/jPdfgIKveI7Pcfq/eSMCYBSD4pakymA0+RxVrsn15oAOEMeY7Vbcif5ys4ApT7CzZJHWO2G3I1fSyfgPHmY1a7x6bvT/ZpZUMBdOoHzI8El8pCiK+wq8CQXNcFlBdw51tyD00G9SnAVHV++zgDn6hzHiwTjCrgTTKvrQya3Ca5jA5CvY3IP+UlnTxJEb8zhjpDck1cL20mCAcBFWD2D2ovOvjiERojDpTGtnsL9N8EQegt+LJrC5vRN59lMORp0DrePNH2BswvYivXVzuoHSO7dz+2QHcAa6+eMOl87WHOffm8m7QCK7foog+tFi2mZACg3npPkRUxrtkitgvUtwAA5A3LWdzPizwAAAABJRU5ErkJggg==);
            background-size: 0.7rem;
            background-repeat: no-repeat;
            background-position: right center;
        }
        &:active {
            background-color: #f7f7f7;
        }
    }
    .media-list {
        .h-cell {
            .item-inner {
                display: block;
            }
            .item-subtitle {
                font-size: 14/20rem;
                color: #3d4145;
                margin: 4px 0;
            }
            .item-text {
                font-size: 12/20rem;
                color: #5f646e;
            }
            .item-title-row {
                display: flex;
            }
        }
    }
</style>
<script>
    export default{
        props: {
            to: {
                type: [String, Object]
            },
            islink: {
                type: Boolean,
                default: false
            },
            title: {
                type: String
            },
            description: {
                type: String
            },
            subtitle: {
                type: String
            },
            text: {
                type: String
            }
        },
        data() {
            return {
            };
        },
        computed: {
            type() {
                return this.$parent.type || 'normal';
            }
        },
        methods: {
            router() {
                if (typeof this.to === 'string') {
                    this.$router.push(this.to);
                }
                else if (typeof this.to === 'object') {
                    if (this.to.replace) {
                        this.$router.replace(this.to);
                    }
                    else {
                        this.$router.push(this.to);
                    }
                }
            }
        },
        mounted() {
        }
    };
</script>
