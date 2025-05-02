import PropTypes from 'prop-types'

const Modal = ({
    isOpen,
    onClose,
    children,
    hideWrap = false,
    position,
    enableClose = true
}) => {
    if (!isOpen) return null

    const positionClasses = {
        center: 'items-center justify-center',
        top: 'items-start justify-center',
        bottom: 'items-end justify-center',
        left: 'items-center justify-start',
        right: 'items-center justify-end',
    }

    const handleWrapClick = () => {
        if (enableClose) {
            onClose()
        }
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex ${positionClasses[position] || 'items-center justify-center'
                } ${hideWrap ? 'bg-transparent' : 'bg-[rgba(0,0,0,0.65)]'}`}
            onClick={handleWrapClick}
        >
            <div
                className="laptop:max-w-full ipad-h:max-w-3xl mobile:max-w-sm max-h-[90vh] overflow-auto rounded-lg shadow-lg m-2 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}

export default Modal

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    children: PropTypes.node,
    hideWrap: PropTypes.bool,
    enableClose: PropTypes.bool,
    position: PropTypes.oneOf(['center', 'top', 'bottom', 'left', 'right'])
}