import { PropType } from 'vue'
import PropTypes from '../../_utils/props-types'

export interface CommonRequestProps {
    url?: String
    method?: String
    params?: Object
    callback?: Function
}

export const languageProps = () => ({
    prefixCls: PropTypes.string,
    dataSource: PropTypes.array,
    dataConfig: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'GET',
                params: {}
            }
        }
    },
    categorySource: PropTypes.array,
    categoryConfig: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'GET',
                params: {}
            }
        }
    },
    addCategoryConfig: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'POST',
                params: {}
            }
        }
    },
    deleteCategoryConfig: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'DELETE',
                params: {}
            }
        }
    },
    addLanguageConfig: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'POST',
                params: {},
                callback: null
            }
        }
    },
    updateLanguageConfig: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'DELETE',
                params: {}
            }
        }
    },
    deleteLanguageConfig: {
        type: Object as PropType<CommonRequestProps>,
        default: () => {
            return {
                url: null,
                method: 'DELETE',
                params: {}
            }
        }
    },
    paginationLocale: PropTypes.any
})
