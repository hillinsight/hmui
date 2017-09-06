/**
 * @file Vue-Router Config
 * @author lifayu(fyli@hillinsight.com)
 * @since 16/03/2017
 */
import VueRouter from 'vue-router';
import utils from '@/utils';

import TabBar from './common/tabbar.vue';

const router = new VueRouter({
    mode: 'history',
    base: '/hmui',
    routes: [{
        path: '/',
        redirect: '/site'
    }, {
        path: '/cell',
        component: resolve => require.ensure([], () => resolve(require('./page/cell.vue')), 'cell')
    }, {
        path: '*',
        component: {
            template: '<p style="text-align: center; font-size: 20px; color: #678;">404 Page Not Found</p>'
        }
    }]
});
router.beforeEach(function (to, from, next) {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    else {
        document.title = 'HMUI';
    }
    next();
    utils.hackDocumentTitle();
});
router.afterEach(route => {
});

export default router;
