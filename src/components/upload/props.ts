import PropTypes from '../_utils/props-types'

export const uploadProps = () => ({
    prefixCls: PropTypes.string,
    type: PropTypes.string.def('image'),
    multiple: PropTypes.bool.def(false),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(80),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(120)
})
