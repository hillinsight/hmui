/**
 * @file 对keep-alive进行扩充完善
 *
 * @author lifayu(fyli@hillinsight.com)
 * @since 26/05/2017
 */

// 串行加载
function loadSequence(vm, datasource, store) {
    let deferred = $.Deferred().resolve(store);
    $.each(datasource, (i, item) => {
        deferred = deferred.then(load.bind(null, vm, item, store));
    });
    return deferred.promise();
}

// 并行加载
function loadParallel(vm, datasource, store) {
    let workers = [];
    Object.keys(datasource).forEach(key => {
        let unit = datasource[key];
        if (typeof unit === 'function') {
            workers.push(load(vm, {
                retrieve: unit,
                name: key
            }, store));
        }
        else if (Array.isArray(unit)) {
            workers.push(load(vm, unit, store));
        }
        else {
            store[key] = unit;
            workers.push($.Deferred().resolve(store));
        }
    });

    let deferred = $.Deferred();
    const len = workers.length;
    if (len === 0) {
        deferred.resolve(store);
        return deferred.promise();
    }
    let count = 0;
    workers.forEach(work => {
        work.then(() => {
            count++;
            if (len === count) {
                deferred.resolve(store);
            }
        }, (e) => {
            deferred.reject(e);
        });
    });
    return deferred.promise();
}

function loadData(vm, datasource, store) {
    let value = datasource.retrieve.call(vm, vm.$route, store);
    function handleStore(data) {
        if (datasource.name) {
            store[datasource.name] = data;
        }
        else {
            store = data;
        }
        return store;
    }

    if (value && value.promise) {
        return value.then(data => {
            return handleStore(data);
        }, ex => {
            console.warn('[keepalive] get some error when load data', ex);
        });
    }
    else {
        return $.Deferred().resolve(handleStore(value));
    }
}

function load(vm, datasource, store) {
    if (typeof datasource === 'function') {
        return loadData(vm, {
            retrieve: datasource
        }, store);
    }

    // 当一个对象中有`retrieve`属性就认为是一个数据获取配置项
    if (typeof datasource.retrieve === 'function') {
        return loadData(vm, datasource, store);
    }

    if (Array.isArray(datasource)) {
        return loadSequence(vm, datasource, store);
    }

    return loadParallel(vm, datasource, store);
}

export default {
    data() {
        return {
            datasource: {}
        };
    },
    methods: {
        /**
         * 初始化数据，需要各自页面进行实现
         * @param {Boolean} change 内容是否需要变化
         * @abstract
         */
        fetchData(change) {},
        _loadDatasource() {
            load(this, this.$options.datasource, {}).then(data => {
                Object.keys(data).forEach(key => {
                    this.$set(this.datasource, key, data[key]);
                });
                this._changed = this.$options.refreshable;
                // console.log('[keepalive]', 'load datasource completed');
            }, () => {
                this._changed = true;
                this.$emit('dataerror');
                // console.log('[keepalive] LOAD DATA ERROR', arguments);
            });
            this.fetchData();
        }
    },
    activated() {
        // console.log('[keepalive] changed', this._changed);
        // console.log('[keepalive] position', this._savedPosition);
        // console.log('[keepalive] fullPath', this._fullPath);
        // console.log('[keepalive]', 'activated');
        if (this._changed) {
            this._loadDatasource();
        }

        this._fullPath = this.$route.fullPath;
        try {
            $(this.$el).scrollTop(this._savedPosition);
        }
        catch (e) {
            console.warn('[keepalive]', '缺少根元素，你可能在根元素上设置了v-if指令');
        }
    },
    /**
     * 路由发生变化之后触发
     */
    routeChange() {},
    /**
     * activated的时候是否需要重新获取数据，也就是是否需要重新调用`fetchData`方法
     *
     * @type boolean
     */
    refreshable: false,
    datasource: {},
    // 页面离开的时候将滚动条位置进行记录
    beforeRouteLeave(to, from, next) {
        this._savedPosition = $(this.$el).scrollTop();
        // this._changed = this.$options.refreshable;
        next();
    },
    mounted() {
        this._changed = true;
        // 缓存页面滚动位置
        this._savedPosition = 0;
        // 缓存当前路径
        this._fullPath = '';
    },
    watch: {
        $route() {
            if (!this._inactive && this._fullPath !== this.$route.fullPath) {
                // console.log('[keepalive]', 'route change');
                // 重置数据
                let data = this.$options.data.apply(this);
                for (let key in data) {
                    if (key !== '_savedPosition' && data.hasOwnProperty(key)) {
                        this[key] = data[key];
                    }
                }

                this.$options.routeChange.apply(this);
                this._savedPosition = 0;
                this._fullPath = this.$route.fullPath;
                this._changed = false;

                this._loadDatasource();
            }
        }
    }
};
