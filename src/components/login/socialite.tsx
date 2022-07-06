import { defineComponent, reactive, isVNode, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { MoreOutlined, GithubOutlined } from '@ant-design/icons-vue'
import { getPrefixCls } from '../_utils/props-tools'
import { $g } from '../../utils/global'
import PropTypes from '../_utils/props-types'
import MiDropdown from '../dropdown'
import MiDropdownItem from '../dropdown/item'

export default defineComponent({
    name: 'MiPassportSocialite',
    props: {
        prefixCls: PropTypes.string,
        domain: PropTypes.string,
        items: PropTypes.array
    },
    setup(props) {
        const prefixCls = getPrefixCls('passport-socialite')
        const { t } = useI18n()
        const params = reactive({
            left: [],
            first: {} as any
        })

        const redirect = (url: string) => {
            const domain = props.domain ?? $g.socialites.domain
            const link = `${domain}/${url}`
            window.open(link, '_self')
        }

        const parseItems = () => {
            const items = props.items ?? $g.socialites.items
            const list = []
            items.forEach((item: any, idx: number) => {
                item.callback = item.callback ?? (() => redirect(item.name))
                if (idx === 0) params.first = item
                else list.push(item)
            })
            params.left = list
        }
        parseItems()

        return () => {
            let elem: any = null
            if ($g.isMobile) {
                const icons = []
                const items = [{ ...params.first }].concat(params.left)
                items.forEach((item: any) => {
                    icons.push(
                        <a onClick={(e) => (item.callback ? item.callback(e) : e)}>
                            <MiDropdownItem item={item} />
                        </a>
                    )
                })
                elem = (
                    <div class={`${prefixCls} ${prefixCls}-mobile`}>
                        <div class={`${prefixCls}-line`}></div>
                        <div
                            class={`${prefixCls}-title`}
                            innerHTML={t('passport.login.socialite')}
                        />
                        <div class={`${prefixCls}-cates`}>{...icons}</div>
                    </div>
                )
            } else {
                const title = <MoreOutlined />
                const hasCallback =
                    params.first?.callback && typeof params.first.callback === 'function'
                elem = (
                    <div class={prefixCls}>
                        {t('passport.login.socialite')}
                        <div onClick={(e) => (hasCallback ? params.first.callback(e) : e)}>
                            {params.first ? (
                                isVNode(params.first.icon) ? (
                                    params.first.icon
                                ) : (
                                    h(params.first.icon)
                                )
                            ) : (
                                <GithubOutlined />
                            )}
                        </div>
                        <MiDropdown title={title} items={params.left} />
                    </div>
                )
            }
            return elem
        }
    }
})
