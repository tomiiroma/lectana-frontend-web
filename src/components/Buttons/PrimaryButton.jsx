import "./Buttons.css"

function PrimaryButton({content, className = "", ...props}) {
  return (
  <button className={`PrimaryButton ${className}`} {...props}>
      {content}
    </button>  )
}

export default PrimaryButton