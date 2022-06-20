import { defineComponent, computed, ref, createVNode, reactive } from 'vue'
import { useStore } from 'vuex'
import { RouterLink, useRouter } from 'vue-router'
import { Form, Row, Col, Button, Popover, Input } from 'ant-design-vue'
import { MailOutlined, UserOutlined } from '@ant-design/icons-vue'
import { passportProps } from '../_utils/props-passport'
import { getPrefixCls, tuple, getPropSlot } from '../_utils/props-tools'
import { $tools } from '../../utils/tools'
import { $g } from '../../utils/global'
import { api } from '../../utils/api'
import { useI18n } from 'vue-i18n'
import { $request } from '../../utils/request'
import { $storage } from '../../utils/storage'
import PropTypes from '../_utils/props-types'
import MiLayout from '../layout'
import MiModal from '../modal'
import MiPassword from '../password'
import MiCaptcha from '../captcha'
import MiPassportSocialite from '../login/socialite'

const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head']

export default defineComponent({
    name: 'MiRegister',
    inheritAttrs: false,
    props: Object.assign({...passportProps()}, {
        redirectTo: PropTypes.string,
        binding: PropTypes.bool.def(false),
        passwordMinLength: PropTypes.number.def(6),
        passwordMaxLength: PropTypes.number.def(32),
        passwordComplexity: PropTypes.bool.def(true),
        passwordComplexityTip: PropTypes.string,
        passwordLevel: PropTypes.object,
        passwordRepeat: PropTypes.bool.def(true),
        usernameVerifyAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        usernameVerifyMethod: PropTypes.oneOf(tuple(...METHODS)).def('post'),
        emailVerifyAction: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        emailVerifyMethod: PropTypes.oneOf(tuple(...METHODS)).def('post'),
        loginLink: PropTypes.string,
        usernameTip: PropTypes.any,
        onAfterRegister: PropTypes.func
    }),
    slots: ['content', 'usernameTip', 'footer'],
    setup(props, {slots, emit}) {
        const { t } = useI18n()
        const store = useStore()
        const router = useRouter()
        const prefixCls = getPrefixCls('passport', props.prefixCls)
        const formRef = ref(null)
        const isMobile = computed(() => store.getters['layout/mobile'])

        const checkUserName = async (_rule: any, value: string) => {
            if ($tools.isEmpty(value)) {
                return Promise.reject(t('passport.register.account'))
            } else {
                if (!$g.regExp.username.test(value)) {
                    return Promise.reject(t('passport.register.format'))
                } else {
                    if (props.usernameVerifyAction) {
                        return await $request[props.usernameVerifyMethod](props.usernameVerifyAction, {
                            value, binding: props.binding
                        }).then((res: any) => {
                            if (res.ret.code !== 1) return Promise.reject(res.ret.message)
                            else return Promise.resolve()
                        }).catch((err: any) => {
                            if (err.status) {
                                const content = `[ ${err.status} ] ${err.statusText}`
                                MiModal.error({content})
                                return Promise.reject(content)
                            } else return Promise.reject(err)
                        })
                    } else return Promise.resolve()
                }
            }
        }

        const checkEmail = async (_rule: any, value: string) => {
            if ($tools.isEmpty(value)) {
                return Promise.reject(t('passport.email'))
            } else {
                if (!$tools.checkEmail(value)) {
                    return Promise.reject(t('passport.register.email-valid'))
                } else {
                    if (props.emailVerifyAction) {
                        return await $request[props.emailVerifyMethod](props.emailVerifyAction, {
                            value, binding: props.binding
                        }).then((res: any) => {
                            if (res.ret.code !== 1) return Promise.reject(res.ret.message)
                            else return Promise.resolve()
                        }).catch((err: any) => {
                            if (err.status) {
                                const content = `[ ${err.status} ] ${err.statusText}`
                                MiModal.error({content})
                                return Promise.reject(content)
                            } else return Promise.reject(err)
                        })
                    } else return Promise.resolve()
                }
            }
        }

        const checkCaptcha = () => {
            if (!params.captcha) return Promise.reject(t('passport.verify'))
            else return Promise.resolve()
        }

        const params = reactive({
            loading: false,
            passwordManualVerify: false,
            captcha: null,
            form: {
                validate: {
                    url: null,
                    username: '',
                    email: '',
                    password: '',
                    repeat: '',
                    captcha: false,
                    uuid: null
                },
                rules: {
                    username: [
                        {
                            required: true,
                            validator: checkUserName,
                            trigger: props.usernameVerifyAction ? 'blur' : 'change'
                        }
                    ],
                    email: [
                        {
                            required: true,
                            validator: checkEmail,
                            trigger: props.emailVerifyAction ? 'blur' : 'change'
                        }
                    ],
                    captcha: [{required: true, validator: checkCaptcha}]
                }
            }
        })

        const captchaVerify = (data: any) => {
            if (data?.uuid) params.form.validate.uuid = data.uuid
            params.captcha = true
            formRef.value.validateFields(['captcha'])
            emit('captchaSuccess', data)
        }

        const register = () => {
            if (params.loading) return
            params.loading = true
            params.passwordManualVerify = true
            const reset = () => {
                params.loading = false
                params.passwordManualVerify = false
            }
            formRef.value.validate().then(() => {
                if (
                    !params.form.validate.captcha ||
                    (params.form.validate.captcha && params.captcha)
                ) {
                    api.register = props.action
                    params.form.validate.url = api.register
                    if (typeof props.action === 'string') {
                        store.dispatch('passport/register', params.form.validate).then((res: any) => {
                            reset()
                            if (
                                props.onAfterRegister &&
                                typeof props.onAfterRegister === 'function'
                            ) {
                                // custom
                                props.onAfterRegister(res)
                            } else {
                                if (res.ret.code === 1) {
                                    $storage.set($g.caches.storages.email, params.form.validate.email)
                                    if (props.redirectTo) {
                                        if ($g.regExp.url.test(props.redirectTo)) {
                                            window.location.href = props.redirectTo
                                        } else router.push({path: '/'})
                                    }
                                } else MiModal.error(res.ret.message)
                            }
                        }).catch((err: any) => {
                            reset()
                            MiModal.error(err.message)
                        })
                    } else if (typeof props.action === 'function') {
                        reset()
                        props.action(params.form.validate)
                    }
                } else reset()
            }).catch(() => reset())
        }

        const renderMask = () => {
            return isMobile.value ? null : (
                <div class={`${prefixCls}-mask`} />
            )
        }

        const renderTitle = () => {
            return (
                <div class={`${prefixCls}-title`}>
                    <span innerHTML={props.title ?? $g.site} />
                    <sup>
                        <RouterLink to={{path: '/'}}>
                            <img src={$g.avatar} class={`${prefixCls}-logo`} alt={$g.powered} />
                        </RouterLink>
                    </sup>
                </div>
            )
        }

        const renderUserName = () => {
            const content = renderUserNameTip()
            const defaultInput = (
                <Input prefix={createVNode(UserOutlined)}
                    v-model:value={params.form.validate.username}
                    maxlength={16}
                    autocomplete="off"
                    placeholder={t('passport.username')} />
            )
            let template = defaultInput
            if (content) {
                template = (
                    <Popover placement="top"
                        trigger={['focus']}
                        content={content}>
                        {defaultInput}
                    </Popover>
                )
            }
            return (
                <Form.Item name="username">
                    {template}
                </Form.Item>
            )
        }

        const renderUserNameTip = () => {
            const cls = `${prefixCls}-register-tips`
            return getPropSlot(slots, props, 'usernameTip') ?? (
                <div class={`${cls}${isMobile.value ? `${cls}-mobile` : ''}`}>
                    <p innerHTML={t('passport.register.tips.special')} />
                    <p innerHTML={t('passport.register.tips.structure')} />
                    <p innerHTML={t('passport.register.tips.start')} />
                    <p innerHTML={t('passport.register.tips.length')} />
                </div>
            )
        }

        const renderEmail = () => {
            return (
                <Form.Item name="email">
                    <Input type="email"
                        prefix={createVNode(MailOutlined)}
                        v-model:value={params.form.validate.email}
                        maxlength={256}
                        autocomplete="off"
                        placeholder={t('passport.email')} />
                </Form.Item>
            )
        }

        const renderPassword = () => {
            return (
                <MiPassword repeat={props.passwordRepeat}
                    manualVerify={params.passwordManualVerify}
                    v-model:value={params.form.validate.password}
                    v-model:repeatValue={params.form.validate.repeat}
                    minLength={props.passwordMinLength}
                    maxLength={props.passwordMaxLength}
                    complexity={props.passwordComplexity}
                    complexityTip={props.passwordComplexityTip}
                    level={props.passwordLevel} />
            )
        }

        const renderCaptcha = () => {
            return props.openCaptcha ? (
                <Form.Item name="captcha">
                    <MiCaptcha width="100%"
                        radius={props.captchaRadius}
                        image={props.captchaImage}
                        bgColor={props.captchaBackground}
                        textColor={props.captchaTextColor}
                        maxTries={props.captchaMaxTries}
                        themeColor={props.captchaThemeColor}
                        initParams={props.captchaInitParams}
                        initAction={props.captchaInitAction}
                        checkParams={props.captchaCheckParams}
                        checkAction={props.captchaCheckAction}
                        verifyParams={props.captchaVerifyParams}
                        verifyAction={props.captchaVerifyAction}
                        onInit={props.onCaptchaInit}
                        onChecked={props.onCaptchaChecked}
                        onSuccess={captchaVerify} />
                </Form.Item>
            ) : null
        }

        const renderButton = () => {
            const cls = `${prefixCls}-submit`
            const login = isMobile.value ? (
                <Button size="large"
                    class={`${cls} ${cls}-register`}>
                    <RouterLink to={{path: 'register'}}>
                        {t('passport.has-account')}{t('passport.register.sign')}
                    </RouterLink>
                </Button>
            ) : null
            return (
                <>
                    <Button class={cls} onClick={register}>
                        {props.binding ? t('passport.binding') : t('passport.register.title')}
                    </Button>
                    {login}
                </>
            )
        }

        const renderSocialiteRegister = () => {
            const link = !props.loginLink ? (
                <RouterLink to={{path: 'login'}}>
                    {t('passport.login.title')}
                </RouterLink>
            ) : (
                <a href={props.loginLink} innerHTML={t('passport.login.title')} />
            )
            const cls = `${prefixCls}-socialite`
            return (
                <Form.Item class={`${cls}`}>
                    {
                        !isMobile.value ? (
                            <div class={`${cls}-link`}>
                                {t('passport.has-account')}
                                {link}
                            </div>
                        ) : null
                    }
                    <MiPassportSocialite />
                </Form.Item>
            )
        }

        const renderForm = () => {
            const cls = getPrefixCls('form')
            return (
                <div class={`${prefixCls}-form`}>
                    <Form layout="vertical"
                        class={cls}
                        ref={formRef}
                        model={params.form.validate}
                        rules={Object.assign({}, params.form.rules, props.rules)}>
                        {renderUserName()}
                        {renderEmail()}
                        {renderPassword()}
                        {renderCaptcha()}
                        {renderButton()}
                        {renderSocialiteRegister()}
                    </Form>
                </div>
            )
        }

        return () => (
            <div class={`${prefixCls}${isMobile.value ? `${prefixCls}-mobile` : ''}`}
                style={{
                    backgroundImage: `url(${props.background ?? $g.background.default})`
                }}>
                    <Row class={`${prefixCls}-content`} align={isMobile.value ? 'top' : 'middle'}>
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
})