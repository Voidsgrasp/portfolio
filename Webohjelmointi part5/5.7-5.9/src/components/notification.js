const Notification = ({message, type}) => {


    const error = {
        color: 'red',
        background: 'lightgrey',
        font_size: 10,
        border_style: 'solid',
        border_radius: 3,
        padding: 7,
        margin_bottom: 17
      }
      
      const success = {
        color: 'green',
        background: 'lightgrey',
        font_size: 10,
        border_style: 'solid',
        border_radius: 3,
        padding: 7,
        margin_bottom: 17
      }

    if (message === null) {
        return null
    }

    if (type === 'error') {
        return (
            <div className="error" style={error}>
                {message}
            </div>
        )
    }
    return (
        <div className="success" style={success}>
            {message}
        </div>
    )
}

export default Notification

