export default {
    site: 'makeit.vip',
    ok: 'OK',
    cancel: 'Cancel',
    type: 'Type',
    'kind-tips': 'Kind Tips',
    'built-in': 'Built-In',
    customize: 'Customize',
    understood: 'Understood',
    activate: 'Go to activate',
    success: 'Success',
    add: 'Add',
    'add-now': 'Add it now',
    edit: 'Edit',
    delete: 'Delete',
    reset: 'Reset',
    'batch-delete': 'Batch Delete',
    'delete-confirm': 'Are you sure you want to delete the current selection?',
    'delete-select': 'Please select the items to delete',
    opt: 'Operations',
    key: 'Key',
    auth: 'The resource requires authentication ( Unauthorized )',
    seek: 'Search',
    yes: 'Yes',
    no: 'No',
    external: 'External',
    internal: 'Internal',
    step: {
        prev: 'Previous',
        next: 'Next'
    },
    week: {
        mon: 'Monday',
        tues: 'Tuesday',
        wed: 'Wednesday',
        thur: 'Thursday',
        fri: 'Friday',
        sat: 'Saturday',
        sun: 'Sunday'
    },
    'no-data': 'No data yet',
    theme: {
        light: 'Light',
        dark: 'Dark'
    },
    notice: {
        'good-day': 'Good Day',
        'no-bugs': 'No Bugs',
        'no-meeting': 'No Meeting',
        'no-business': 'No business needs',
        fine: 'Everything is find'
    },
    search: {
        name: 'Search',
        searching: 'Searching ···',
        key: 'Please enter keywords',
        components: 'Search Components',
        fail: {
            message: 'Search could not be completed without source data',
            code: 'Error code: ',
            reason: 'Wrong reason: ',
            api: 'Unknowable error'
        }
    },
    page: {
        prefix: 'No.',
        prev: 'previous page',
        next: 'next page',
        unit: '',
        strip: '',
        total: 'Total:'
    },
    screenfull: {
        error: 'Full screen failed, please refresh and try again',
        capture: 'No content to display in full screen',
        support: 'The current browser does not support full screen operation'
    },
    captcha: {
        loading: 'Loading verification code ···',
        init: 'Initializing verification code ···',
        'init-error': 'Error in init, please try again later',
        click: 'Click the button to verify',
        checking: 'Intelligent detection ···',
        pass: 'Approved',
        tip: 'Error message',
        error: 'Error {num} times in a row, please try again later',
        move: 'Move the slider',
        drag: 'Drag the circle slider',
        dragging: 'Drag the slider to flatten the floating image correctly',
        close: 'Close verification',
        refresh: 'Refresh verification',
        feedback: 'Help feedback',
        provide: 'makeit.vip provide technical support',
        success: 'It took {take} seconds to complete the image stitching verification',
        flatten: 'Drag the slider',
        verify: 'To complete verification'
    },
    password: {
        lv1: 'Weak',
        lv2: 'General',
        lv3: 'Good',
        lv4: 'Great',
        tip: 'Must contain two or more combinations of letters, numbers and special characters.',
        placeholder: 'Please enter password',
        repeat: 'Please enter the password again',
        strong: 'password strength',
        size: '{min}-{max} characters, case sensitive, no spaces before or after.',
        format: 'Letters, numbers, English and special characters.',
        different: 'Different passwords',
        setting: 'Please set your password',
        least: 'At least {min} characters'
    },
    anchor: {
        text: 'Anchor Link',
        close: 'Close Anchor Link',
        stick: {
            yes: 'Enable suspension',
            no: 'Cancel suspension'
        }
    },
    passport: {
        forget: 'Forget password',
        remember: 'Remember Me',
        'no-account': 'No account? ',
        'has-account': 'Already have account? ',
        verify: 'Please click the button to verify',
        username: 'Please enter username / email address / mobile number',
        email: 'Please input the email address',
        password: 'Please enter the password',
        binding: 'bind now',
        code: 'please enter verification code',
        sent: 'Verification code has been sent',
        'resend-downtime': 'Resend after {sec}s',
        'resend-tip': 'The verification code has been sent to {email}',
        resend: 'Resend',
        update: 'Update Password',
        success: 'Password reset successful',
        illegal: 'The operation is not allowed',
        login: {
            title: 'Log in',
            sign: 'Sign up now',
            socialite: 'Others',
            back: 'Back to login'
        },
        register: {
            title: 'Register',
            sign: 'go to login',
            account: 'Please set up a user account',
            'email-valid': 'please enter a valid email address',
            format: 'Only letters + numbers are allowed, 4-16 characters, and start with a letter',
            go: 'Go to register',
            tips: {
                special:
                    "<span class='red'>&lt; Note &gt;</span> Login username, once set, it can't be changed.",
                structure:
                    "- Consists of <span class='theme'>letters</span>、<span class='theme'>numbers</span> or <span class='theme'>underscores</span>.",
                start: "- Only <span class='theme'>start with a letter</span>, for example: makeit.",
                length: "- Username length is <span class='theme'>4-16</span> characters."
            }
        }
    },
    history: {
        close: {
            all: 'close all',
            left: 'close left',
            right: 'close right',
            other: 'close other'
        }
    },
    language: {
        'zh-cn': 'Simplified Chinese',
        'en-us': 'English',
        current: 'Current Language: ',
        system: 'Built-in',
        add: 'Add',
        'add-now': 'Not found, go to language management',
        'add-title': 'Add language configuration',
        'update-title': 'Update language configuration',
        'add-language': 'Add Language',
        'display-language': 'Name',
        management: 'Languages',
        'is-default': 'Default',
        default: 'Set as default',
        'default-tip':
            'The default language will be used as the data base for the new language, and the new language will generate a set of content consistent with the current language configuration of the default language, omitting the language configuration operation of different language but with the same Key value.',
        'default-language': 'Default',
        'no-data': 'No data yet',
        error: {
            key: {
                empty: 'Please input the language keywords',
                exist: 'The keyword is repeated, please re-input',
                error: 'Keyword is incorrect, please re-input'
            },
            language: 'Please input a language display name',
            'no-data': 'Please select the language first and then set as default',
            'is-default': 'Please select the default language option',
            default: 'It is currently the default language, no need to set it again'
        },
        placeholder: {
            key: 'For example, the keywords in simplified Chinese are: zh-cn',
            language: 'Language display name, such as: Simplified Chinese',
            search: 'Please input the Key value of the keyword to be searched or the language content',
            current: 'Please select language',
            config: {
                key: 'Please input a keyword for language configuration, such as: makeit.vip',
                value: 'Please input the display name corresponding to the language configuration keyword, such as: makeit.vip'
            }
        }
    },
    menus: {
        add: 'Add new',
        name: 'Name',
        subname: 'Subname',
        up: 'Parent menu',
        app: 'App',
        type: 'Type',
        icon: 'Icon',
        path: 'Path',
        attrs: 'Attribute',
        top: 'A menu',
        sub: 'Submenu',
        btn: 'Button',
        lang: 'Language key',
        page: 'Page',
        redirect: 'Default jump link',
        sort: 'Sort key',
        open: 'Open way',
        router: 'Routing menu',
        placeholder: {
            search: 'Please input the name of the menu to be searched',
            name: 'Please input the name of menu, such as Dashboard',
            subname: 'Please input the subname of menu like Dashboard',
            path: 'Please input the path of menu，such as /dashboard',
            page: 'Please input the page component of menu，such as /views/dashboard',
            redirect: 'Please input the default redirect address of menu',
            icon: 'Please select the menu icon',
            up: 'Please select the parent menu',
            lang: 'Please input the language key of menu'
        }
    }
}
