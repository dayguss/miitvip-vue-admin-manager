import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { Layout } from 'ant-design-vue'
import PropTypes from '../_utils/props-types'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'
import { $g } from '../../utils/global'
import { $storage } from '../../utils/storage'
import { $tools } from '../../utils/tools'
import { mutations } from '../../store/types'
import MiLayoutSideLogo from './logo'
import MiLayoutSideMenu from '../menu'

export const layoutSideProps = () => ({
    prefixCls: String,
    logo: PropTypes.any,
    menu: PropTypes.any
})

const MiLayoutSider = defineComponent({
    name: 'MiLayoutSide',
    inheritAttrs: false,
    slots: ['logo', 'menu'],
    props: layoutSideProps(),
    setup(props, { slots }) {
        const store = useStore()
        const prefixCls = getPrefixCls('layout-side', props.prefixCls)
        const init = ref<boolean>(true)
        const setCollapsed = (collapse: boolean) => {
            if (init.value) {
                const collapsed = $storage.get($g.caches.storages.collapsed)
                collapse = $tools.isValid(collapse) ? collapsed : false
                init.value = !init.value
            }
            $g.menus.collapsed = collapse
            store.commit(`layout/${mutations.layout.collapsed}`, collapse)
        }
        const getLogo = () => {
            let logo = getPropSlot(slots, props, 'logo')
            if (!logo && !$g.isMobile) logo = <MiLayoutSideLogo />
            return logo
        }
        const getMenu = () => {
            return (
                getPropSlot(slots, props, 'menu') ?? (
                    <MiLayoutSideMenu class={`${prefixCls}-menu`} items={$g.menus.items} />
                )
            )
        }
        return () => (
            <Layout.Sider
                class={`${prefixCls}${$g.menus.collapsed ? ` ${prefixCls}-collapsed` : ''}`}
                width={$g.menus.width}
                breakpoint="lg"
                collapsed={$g.menus.collapsed}
                onBreakpoint={setCollapsed}
                trigger={null}
                collapsible={true}>
                {getLogo()}
                {getMenu()}
            </Layout.Sider>
        )
    }
})
export default MiLayoutSider
