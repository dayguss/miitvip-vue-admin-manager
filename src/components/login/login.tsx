import { defineComponent, ref, reactive, createVNode, SlotsType } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Form, Row, Col, Input, Checkbox, Button, message, FormInstance } from 'ant-design-vue'
import {
    UserOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    LockOutlined,
    UnlockOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons-vue'
import { getPrefixCls, getPropSlot } from '../_utils/props-tools'
import { passportProps } from '../_utils/props-passport'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { useI18n } from 'vue-i18n'
import { useWindowResize } from '../../hooks/useWindowResize'
import { api } from '../../utils/api'
import PropTypes from '../_utils/props-types'
import MiLayout from '../layout'
import MiCaptcha from '../captcha'
import MiPassportSocialite from './socialite'

const Login = defineComponent({
    name: 'MiLogin',
    inheritAttrs: false,
    props: Object.assign(
        { ...passportProps() },
        {
            action: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
            registerLink: PropTypes.string,
            forgetPasswordLink: PropTypes.string,
            onAfterLogin: PropTypes.func,
            socialiteLogin: PropTypes.bool.def(false),
            socialiteLoginDomain: PropTypes.string
        }
    ),
    emits: ['captchaSuccess'],
    slots: Object as SlotsType<{
        content: any
    }>,
    setup(props, { slots, emit }) {
        const { t } = useI18n()
        const prefixCls = getPrefixCls('passport', props.prefixCls)
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const formRef = ref<FormInstance>()
        const { width } = useWindowResize()

        const validateCaptcha = () => {
            if (!params.captcha) return Promise.reject(t('passport.verify'))
            else return Promise.resolve()
        }

        const params = reactive({
            loading: false,
            captcha: false,
            password: true,
            submitting: false,
            form: {
                validate: {
                    username: '',
                    password: '',
                    remember: false,
                    captcha:
                        props.openCaptcha && (props.captchaInitAction || props.captchaVerifyAction)
                            ? true
                            : false,
                    cuid: null,
                    url: null
                },
                rules: {
                    username: [{ required: true, message: t('passport.username') }],
                    password: [{ required: true, message: t('passport.password') }],
                    captcha: [{ required: true, validator: validateCaptcha }]
                }
            }
        }) as { [index: string]: any }
        !params.form.validate.captcha && delete params.form.validate.cuid

        const captchaVerify = (data: any) => {
            if (data?.cuid) params.form.validate.cuid = data.cuid
            params.captcha = true
            if (formRef.value) formRef.value.validateFields(['captcha'])
            emit('captchaSuccess', data)
        }

        const login = () => {
            if (params.loading) return
            params.loading = true
            if (formRef.value) {
                formRef.value
                    .validate()
                    .then(() => {
                        if (
                            !params.form.validate.captcha ||
                            (params.form.validate.captcha && params.captcha)
                        ) {
                            if (typeof props.action === 'string') {
                                api.login = props.action
                                params.form.validate.url = api.login
                                store
                                    .dispatch('passport/login', params.form.validate)
                                    .then((res: any) => {
                                        params.loading = false
                                        if (
                                            props.onAfterLogin &&
                                            typeof props.onAfterLogin === 'function'
                                        ) {
                                            // custom
                                            props.onAfterLogin(res)
                                        } else {
                                            // default
                                            if (res.ret.code === 200) {
                                                let redirect = route.query.redirect
                                                if (redirect) {
                                                    redirect = redirect.toString()
                                                    if ($g.regExp.url.test(redirect))
                                                        window.location.href = redirect
                                                    else router.push({ path: redirect })
                                                } else router.push({ path: '/' })
                                            } else message.error(res.ret.message)
                                        }
                                    })
                                    .catch(() => (params.loading = false))
                            } else if (typeof props.action === 'function') {
                                params.loading = false
                                props.action(params.form.validate)
                            }
                        } else params.loading = false
                    })
                    .catch(() => (params.loading = false))
            }
        }

        const renderMask = () => {
            return width.value < $g.devices.mobile ? null : <div class={`${prefixCls}-mask`} />
        }

        const renderTitle = () => {
            return (
                <div class={`${prefixCls}-title`}>
                    <span innerHTML={props.title ?? $g.site} />
                    <sup>
                        <RouterLink to={{ path: '/' }}>
                            <img src={$g.avatar} class={`${prefixCls}-logo`} alt={$g.powered} />
                        </RouterLink>
                    </sup>
                </div>
            )
        }

        const renderForm = () => {
            const cls = getPrefixCls('form')
            return (
                <div class={`${prefixCls}-form`}>
                    <Form
                        layout="vertical"
                        class={cls}
                        ref={formRef}
                        model={params.form.validate}
                        rules={Object.assign({}, params.form.rules, props.rules)}>
                        {renderUserName()}
                        {renderPassword()}
                        {renderCaptcha()}
                        {renderRememberBtn()}
                        {renderButton()}
                        {renderSocialiteLogin()}
                    </Form>
                </div>
            )
        }

        const renderUserName = () => {
            return (
                <Form.Item name="username">
                    <Input
                        prefix={createVNode(UserOutlined)}
                        v-model:value={params.form.validate.username}
                        maxlength={64}
                        autocomplete="off"
                        onPressEnter={login}
                        placeholder={t('passport.username')}
                    />
                </Form.Item>
            )
        }

        const renderPassword = () => {
            let password: any = null
            if (params.password) {
                const suffix = (
                    <EyeInvisibleOutlined onClick={() => (params.password = !params.password)} />
                )
                password = (
                    <Input
                        type="password"
                        maxlength={32}
                        prefix={createVNode(LockOutlined)}
                        suffix={suffix}
                        autocomplete="off"
                        onPressEnter={login}
                        v-model:value={params.form.validate.password}
                        placeholder={t('passport.password')}
                    />
                )
            } else {
                const suffix = <EyeOutlined onClick={() => (params.password = !params.password)} />
                password = (
                    <Input
                        type="text"
                        maxlength={32}
                        prefix={createVNode(UnlockOutlined)}
                        suffix={suffix}
                        autocomplete="off"
                        onPressEnter={login}
                        v-model:value={params.form.validate.password}
                        placeholder={t('passport.password')}
                    />
                )
            }
            return <Form.Item name="password">{password}</Form.Item>
        }

        const renderCaptcha = () => {
            if (props.openCaptcha) {
                return (
                    <Form.Item name="captcha" class={`${prefixCls}-captcha`}>
                        <MiCaptcha
                            width="100%"
                            radius={props.captchaRadius}
                            image={props.captchaImage}
                            bgColor={props.captchaBackground}
                            textColor={props.captchaTextColor}
                            maxTries={props.captchaMaxTries}
                            themeColor={props.captchaThemeColor}
                            initParams={props.captchaInitParams}
                            initAction={props.captchaInitAction}
                            initMethod={props.captchaInitMethod}
                            checkParams={props.captchaCheckParams}
                            checkAction={props.captchaCheckAction}
                            checkMethod={props.captchaCheckMethod}
                            verifyParams={props.captchaVerifyParams}
                            verifyAction={props.captchaVerifyAction}
                            verifyMethod={props.captchaVerifyMethod}
                            onInit={props.onCaptchaInit}
                            onChecked={props.onCaptchaChecked}
                            onSuccess={captchaVerify}
                        />
                    </Form.Item>
                )
            }
            return null
        }

        const renderRememberBtn = () => {
            const cls = `${prefixCls}-forget`
            const title = t('passport.forget')
            const link = props.forgetPasswordLink ? (
                <a href={props.forgetPasswordLink} class={`${cls}`}>
                    <QuestionCircleOutlined />
                    {title}
                </a>
            ) : (
                <RouterLink to={{ path: '/passport/forget' }} class={`${cls}`}>
                    <QuestionCircleOutlined />
                    {title}
                </RouterLink>
            )
            return (
                <Form.Item class={`${prefixCls}-remember`}>
                    <Checkbox v-model:checked={params.form.validate.remember}>
                        {t('passport.remember')}
                    </Checkbox>
                    {link}
                </Form.Item>
            )
        }

        const renderButton = () => {
            const cls = `${prefixCls}-submit`
            const register =
                width.value < $g.devices.mobile ? (
                    <Button size="large" class={`${cls} ${cls}-register`}>
                        <RouterLink to={{ path: 'register' }}>
                            {t('passport.no-account')}
                            {t('passport.login.sign')}
                        </RouterLink>
                    </Button>
                ) : null
            return (
                <>
                    <Button class={cls} type="primary" onClick={login} loading={params.loading}>
                        {t('passport.login.title')}
                    </Button>
                    {register}
                </>
            )
        }

        const renderSocialiteLogin = () => {
            const link = !props.registerLink ? (
                <RouterLink to={{ path: 'register' }}>{t('passport.register.title')}</RouterLink>
            ) : (
                <a href={props.registerLink} innerHTML={t('passport.register.title')} />
            )
            const cls = `${prefixCls}-socialite`
            return (
                <Form.Item class={`${cls}`}>
                    {width.value >= $g.devices.mobile ? (
                        <div class={`${cls}-link`}>
                            {t('passport.no-account')}
                            {link}
                        </div>
                    ) : null}
                    <MiPassportSocialite />
                </Form.Item>
            )
        }

        return () => {
            if (props.socialiteLogin) {
                const socialite = route.params.socialite
                const token = route.params.token
                const url = $tools.replaceUrlParams(api.authorize, { socialite })
                store
                    .dispatch('passport/authorize', { url, token })
                    .then((res: any) => {
                        if (res?.ret?.code === 200) router.push({ path: '/' })
                        else router.push({ path: '/login' })
                    })
                    .catch((err: any) => message.error(err.message))
            }
            return props.socialiteLogin ? null : (
                <div
                    class={`${prefixCls}${
                        width.value < $g.devices.mobile ? ` ${prefixCls}-mobile` : ''
                    }`}
                    style={{
                        backgroundImage: `url(${props.background ?? $g.background.default})`
                    }}>
                    <Row
                        class={`${prefixCls}-content`}
                        align={width.value < $g.devices.mobile ? 'top' : 'middle'}>
                        <Col class={`${prefixCls}-box`} xs={24} sm={18} md={12} lg={12}>
                            {renderMask()}
                            {renderTitle()}
                            {getPropSlot(slots, props, 'content') ?? renderForm()}
                        </Col>
                    </Row>
                    {getPropSlot(slots, props, 'footer') ?? <MiLayout.Footer />}
                </div>
            )
        }
    }
})

Login.Socialite = MiPassportSocialite
export default Login as typeof Login & {
    readonly Socialite: typeof MiPassportSocialite
}
