import { defineComponent, reactive, ref } from 'vue'
import { menuManagementProps, type MenusDataItem } from './props'
import { getPrefixCls } from '../../_utils/props-tools'
import { $request } from '../../../utils/request'
import { $tools } from '../../../utils/tools'
import { $g } from '../../../utils/global'
import { useI18n } from 'vue-i18n'
import * as AntdvIcons from '@ant-design/icons-vue'
import {
    Table,
    message,
    ConfigProvider,
    Popconfirm,
    Button,
    Input,
    TreeSelect,
    Row,
    Col,
    Drawer,
    RadioGroup,
    Form,
    FormItem,
    InputNumber,
    Switch,
    FormInstance,
    Empty
} from 'ant-design-vue'

export default defineComponent({
    name: 'MiMenuManagement',
    inheritAttrs: false,
    props: menuManagementProps(),
    setup(props) {
        const prefixCls = getPrefixCls('menus', props.prefixCls)
        const btnCls = `${$g.prefix}btn`
        const formCls = `${$g.prefix}form`
        const { t } = useI18n()
        const addOrUpdateformRef = ref<FormInstance>()
        const params = reactive({
            loading: false,
            table: {
                loading: false,
                columns: [
                    {
                        title: t('menus.name'),
                        key: 'name',
                        dataIndex: 'name',
                        minWidth: 120
                    },
                    {
                        title: t('menus.type'),
                        key: 'type',
                        dataIndex: 'type',
                        width: 120,
                        customRender: (record: any) => {
                            return record.record.type === 1
                                ? t('menus.top')
                                : record.record.type === 2
                                ? t('menus.top')
                                : t('menus.unknow')
                        }
                    },
                    {
                        title: t('menus.icon'),
                        key: 'icon',
                        dataIndex: 'icon',
                        align: 'center',
                        width: 100,
                        customRender: (record: any) => {
                            // eslint-disable-next-line import/namespace
                            const IconTag = AntdvIcons[record.record.icon]
                            return <IconTag />
                        }
                    },
                    {
                        title: t('menus.page'),
                        key: 'page',
                        dataIndex: 'page',
                        minWidth: 120
                    },
                    {
                        title: t('menus.path'),
                        key: 'path',
                        dataIndex: 'path',
                        minWidth: 120
                    },
                    {
                        title: t('menus.sort'),
                        key: 'sort',
                        dataIndex: 'sort',
                        width: 80
                    },
                    {
                        title: t('opt'),
                        key: 'action',
                        dataIndex: 'action',
                        align: 'right',
                        minWidth: 150
                    }
                ] as any,
                dataSource: [] as MenusDataItem[],
                pagination: {
                    page: 1,
                    size: 10
                }
            },
            search: {
                key: ''
            },
            deleteIds: [] as any,
            openDrawer: false,
            isEdit: false,
            types: [
                { label: t('menus.top'), value: 1 },
                { label: t('menus.sub'), value: 2 }
            ],
            form: {
                validate: {
                    name: '',
                    sub_name: '',
                    pid: null,
                    type: 1,
                    path: '',
                    page: '',
                    redirect: '',
                    icon: '',
                    sort: 1,
                    lang: '',
                    is_router: true,
                    is_blank: false,
                    is_hide: false
                },
                rules: {
                    name: [{ required: true, message: t('menus.placeholder.name') }],
                    page: [{ required: true, message: t('menus.placeholder.page') }]
                }
            },
            menus: {
                tree: [] as MenusDataItem[]
            }
        })

        const getMenus = () => {
            if (props.data.url) {
                if (params.table.loading) return
                params.table.loading = true
                const condition = Object.assign(params.table.pagination, props.data.params || {})
                $request[(props.data.method || 'GET').toLowerCase()](props.data.url, condition)
                    .then((res: any) => {
                        params.table.loading = false
                        if (res) {
                            if (res?.ret?.code === 200) {
                                params.menus.tree = getMenusTreeData(res?.data)
                                params.table.dataSource = params.menus.tree as any[]
                                if (props.data.callback) props.data.callback(res?.data)
                            } else message.error(res?.ret?.message)
                        }
                    })
                    .catch((err: any) => {
                        params.table.loading = false
                        message.error(err.message)
                    })
            }
        }

        const getMenusTreeData = (data: any): MenusDataItem[] => {
            const top = [] as MenusDataItem[]
            for (let i = 0, l = data.length; i < l; i++) {
                const cur = data[i]
                const temp = {
                    ...cur,
                    title: cur.name,
                    value: cur.id
                } as MenusDataItem
                if (cur.children) temp.children = getMenusTreeData(cur.children)
                top.push(temp)
            }
            return top
        }

        const batchDelete = () => {
            if (params.deleteIds.length <= 0) {
                message.error(t('delete-select'))
                return
            }
            if (params.loading) return
            params.loading = true
            if (props.deleteMenu.url) {
                $request[(props.deleteMenu.method || 'DELETE').toLowerCase()](
                    $tools.replaceUrlParams(props.deleteMenu.url, {
                        id: params.deleteIds.join(',')
                    }),
                    props.deleteMenu.params
                )
                    .then((res: any) => {
                        params.loading = false
                        if (res) {
                            if (res?.ret?.code === 200) {
                                message.success(t('success'))
                                getMenus()
                            } else message.error(res?.ret?.message)
                        }
                    })
                    .catch((err: any) => {
                        params.loading = false
                        message.error(err.message)
                    })
            }
        }

        const searchInput = () => {}

        const searchReset = () => {}

        const search = () => {}

        const openAddOrUpdateDrawer = () => {
            params.openDrawer = !params.openDrawer
            if (params.openDrawer) {
                if (params.isEdit) {
                }
            }
        }

        const addOrUpdate = () => {
            if (addOrUpdateformRef.value) {
                addOrUpdateformRef.value.validate().then(() => {
                    if (params.loading) return
                    params.loading = true
                    if (params.isEdit) {
                        // update
                    } else {
                        // create
                        if (props.addMenu.url) {
                            $request[(props.addMenu.method || 'POST').toLowerCase()](
                                props.addMenu.url,
                                Object.assign(
                                    {},
                                    { ...params.form.validate },
                                    { ...props.addMenu.params }
                                )
                            )
                                .then((res: any) => {
                                    params.loading = false
                                    if (res?.ret?.code === 200) {
                                        openAddOrUpdateDrawer()
                                        getMenus()
                                        message.success(t('success'))
                                        if (props.addMenu.callback) props.addMenu.callback()
                                    } else message.error(res?.ret?.message)
                                })
                                .catch((err: any) => {
                                    params.loading = false
                                    message.error(err?.message)
                                })
                        }
                    }
                })
            }
        }

        getMenus()

        const renderIconsBtn = () => {
            return (
                <div>
                    <AntdvIcons.AimOutlined />
                </div>
            )
        }

        const renderActionBtns = () => {
            const btns = (
                <>
                    <Popconfirm
                        title={t('delete-confirm')}
                        style={{ zIndex: Date.now() }}
                        okText={t('ok')}
                        onConfirm={() => batchDelete()}
                        cancelText={t('cancel')}>
                        <Button
                            type="primary"
                            danger={true}
                            style={{ marginRight: $tools.convert2Rem(8) }}>
                            {t('batch-delete')}
                        </Button>
                    </Popconfirm>
                    <Button class={`${btnCls}-success`} onClick={openAddOrUpdateDrawer}>
                        {t('menus.add')}
                    </Button>
                </>
            )
            const searchBtn = props.data.url ? (
                <Col xs={24} md={12}>
                    <div class={`${prefixCls}-btns-l`}>
                        <Input
                            placeholder={t('menus.placeholder.search')}
                            onInput={searchInput}
                            onPressEnter={search}
                            v-model:value={params.search.key}
                        />
                        <Button
                            class={`${btnCls}-info`}
                            onClick={search}
                            style={{ marginRight: $tools.convert2Rem(8) }}
                            v-slots={{
                                icon: () => {
                                    return <AntdvIcons.SearchOutlined />
                                }
                            }}>
                            {t('seek')}
                        </Button>
                        <Button
                            class={`${btnCls}-info`}
                            onClick={searchReset}
                            v-slots={{
                                icon: () => {
                                    return <AntdvIcons.ReloadOutlined />
                                }
                            }}>
                            {t('reset')}
                        </Button>
                    </div>
                </Col>
            ) : null
            return (
                <Row class={`${prefixCls}-btns${props.data.url ? '' : ' no-search'}`}>
                    {searchBtn}
                    <Col xs={24} md={12}>
                        <div class={`${prefixCls}-btns-r`}>{btns}</div>
                    </Col>
                </Row>
            )
        }

        const renderDrawer = () => {
            const subMenu =
                params.form.validate.type === 2 ? (
                    <FormItem label={t('menus.up')} name="pid">
                        <TreeSelect
                            v-model:value={params.form.validate.pid}
                            placeholder={t('menus.placeholder.up')}
                            allowClear={true}
                            dropdownClassName={`${prefixCls}-drawer-select`}
                            treeData={params.menus.tree}
                            treeDefaultExpandAll={true}></TreeSelect>
                    </FormItem>
                ) : null
            return (
                <Drawer
                    visible={params.openDrawer}
                    zIndex={Date.now()}
                    onClose={openAddOrUpdateDrawer}
                    title={t('menus.add')}
                    width={580}
                    v-slots={{
                        extra: () => {
                            return (
                                <>
                                    <Button
                                        style={{ marginRight: $tools.convert2Rem(8) }}
                                        onClick={openAddOrUpdateDrawer}>
                                        {t('cancel')}
                                    </Button>
                                    <Button type="primary" onClick={addOrUpdate}>
                                        {t('ok')}
                                    </Button>
                                </>
                            )
                        }
                    }}
                    class={`${$g.prefix}drawer`}>
                    <Form
                        class={`${formCls} ${formCls}-theme`}
                        model={params.form.validate}
                        rules={params.form.rules}
                        ref={addOrUpdateformRef}
                        labelCol={{ style: { width: $tools.convert2Rem(120) } }}>
                        <FormItem label={t('menus.type')} name="type">
                            <RadioGroup
                                options={params.types}
                                v-model:value={params.form.validate.type}></RadioGroup>
                        </FormItem>
                        <FormItem label={t('menus.name')} name="name">
                            <Input
                                v-model:value={params.form.validate.name}
                                autocomplete="off"
                                maxlength={60}
                                placeholder={t('menus.placeholder.name')}
                            />
                        </FormItem>
                        {subMenu}
                        <FormItem label={t('menus.subname')} name="sub_name">
                            <Input
                                v-model:value={params.form.validate.sub_name}
                                autocomplete="off"
                                maxlength={60}
                                placeholder={t('menus.placeholder.subname')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.path')} name="path">
                            <Input
                                v-model:value={params.form.validate.path}
                                autocomplete="off"
                                placeholder={t('menus.placeholder.path')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.page')} name="page">
                            <Input
                                v-model:value={params.form.validate.page}
                                autocomplete="off"
                                placeholder={t('menus.placeholder.page')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.icon')} name="icon">
                            <Input
                                v-model:value={params.form.validate.icon}
                                autocomplete="off"
                                suffix={renderIconsBtn}
                                placeholder={t('menus.placeholder.icon')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.router')} name="is_router">
                            <Switch
                                v-model:checked={params.form.validate.is_router}
                                checked-children={t('yes')}
                                un-checked-children={t('no')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.open')} name="is_blank">
                            <Switch
                                v-model:checked={params.form.validate.is_blank}
                                checked-children={t('external')}
                                un-checked-children={t('internal')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.sort')} name="sort">
                            <InputNumber v-model:value={params.form.validate.sort} min={1} />
                        </FormItem>
                        <FormItem label={t('menus.hide')} name="is_hide">
                            <Switch
                                v-model:checked={params.form.validate.is_hide}
                                checked-children={t('yes')}
                                un-checked-children={t('no')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.lang')} name="lang">
                            <Input
                                v-model:value={params.form.validate.lang}
                                autocomplete="off"
                                placeholder={t('menus.placeholder.lang')}
                            />
                        </FormItem>
                        <FormItem label={t('menus.redirect')} name="redirect">
                            <Input
                                v-model:value={params.form.validate.redirect}
                                autocomplete="off"
                                placeholder={t('menus.placeholder.redirect')}
                            />
                        </FormItem>
                    </Form>
                </Drawer>
            )
        }

        const renderTable = () => {
            return (
                <ConfigProvider
                    locale={props.paginationLocale}
                    renderEmpty={() => <Empty description={t('no-data')} />}>
                    {renderActionBtns()}
                    <Table
                        columns={params.table.columns}
                        rowSelection={{}}
                        dataSource={params.table.dataSource}
                        pagination={{
                            showLessItems: true,
                            showQuickJumper: true,
                            responsive: true
                        }}
                        scroll={{ x: '100%' }}
                    />
                    {renderDrawer()}
                </ConfigProvider>
            )
        }

        return () => <div class={prefixCls}>{renderTable()}</div>
    }
})
