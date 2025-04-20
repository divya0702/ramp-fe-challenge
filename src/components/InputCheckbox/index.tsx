import classNames from "classnames"
import { useRef, useEffect } from "react"
import { InputCheckboxComponent } from "./types"
import { useCheckboxContext } from "../../hooks/checkBoxContext"

export const InputCheckbox: InputCheckboxComponent = ({
  id,
  checked = false,
  disabled,
  onChange,
}) => {
  const { current: inputId } = useRef(`RampInputCheckbox-${id}`)
  const { checkboxValues, setCheckboxValue } = useCheckboxContext()

  const checkboxValue = checkboxValues[id] ?? checked

  useEffect(() => {
    if (checkboxValues[id] === undefined) {
      setCheckboxValue(String(id), checked)
    }
  }, [id, checked, checkboxValues, setCheckboxValue])

  const handleChange = () => {
    const newValue = !checkboxValue
    setCheckboxValue(String(id), newValue)
    onChange?.(newValue)
  }

  return (
    <div className="RampInputCheckbox--container" data-testid={inputId}>
      <label
        htmlFor={inputId}
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": checkboxValue,
          "RampInputCheckbox--label-disabled": disabled,
        })}
      />
      <input
        id={inputId}
        type="checkbox"
        className="RampInputCheckbox--input"
        checked={checkboxValue}
        disabled={disabled}
        onChange={handleChange}
      />
    </div>
  )
}
