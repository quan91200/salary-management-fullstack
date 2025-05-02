import { Link } from "react-router-dom"
import { createContext, useContext, useState } from "react"
import PropTypes from "prop-types"

const DropdownContext = createContext()

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false)

    const toggleOpen = () => {
        setOpen(prev => !prev)
    }

    return (
        <DropdownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropdownContext.Provider>
    )
}

const Trigger = ({ children, className }) => {
    const { open, setOpen, toggleOpen } = useContext(DropdownContext)

    return (
        <div className="cursor-pointer group">
            <div
                className={`${className}`}
                onClick={toggleOpen}
            >
                {children}
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-50"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </div>
    )
}

const Content = ({
    align = 'right',
    width = '48',
    contentClasses = 'py-1 bg-white',
    children,
}) => {
    const { open, setOpen } = useContext(DropdownContext)

    let alignmentClasses = 'origin-top'

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0'
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0'
    }

    let widthClasses = ''

    if (width === '48') {
        widthClasses = 'w-48'
    }

    return open ? (
        <div
            className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
            onClick={() => setOpen(false)}
        >
            <div
                className={`rounded ${contentClasses}`}
            >
                {children}
            </div>
        </div>
    ) : null
}

const DropdownLink = ({ className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={
                'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none' +
                className
            }
        >
            {children}
        </Link>
    )
}

// Prop types validation
Dropdown.propTypes = {
    children: PropTypes.node.isRequired,
}

Trigger.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
}

Content.propTypes = {
    align: PropTypes.oneOf(['left', 'right']),
    width: PropTypes.oneOf(['48']),
    contentClasses: PropTypes.string,
    children: PropTypes.node.isRequired,
}

DropdownLink.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
}

Dropdown.Trigger = Trigger
Dropdown.Content = Content
Dropdown.Link = DropdownLink

export default Dropdown