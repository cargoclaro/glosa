import { cn } from "@/app/shared/utils/cn";

interface IGenericSearchInputProps {
  id?: string;
  ariaLabel?: string;
  type:
    | "text"
    | "number"
    | "checkbox"
    | "select"
    | "date"
    | "email"
    | "password";
  value: string;
  checked?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  step?: string;
  min?: string;
  max?: string;
  options?: { value: string; label: string }[];
  labelClassName?: string;
  inputClassName?: string;
}

const GenericSearchInput: React.FC<IGenericSearchInputProps> = ({
  id,
  ariaLabel,
  type,
  value,
  checked,
  onChange,
  placeholder,
  step,
  min,
  max,
  options = [],
  labelClassName = "",
  inputClassName = "",
}) => {
  const commonProps = {
    id,
    value,
    className: cn(
      "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-cargoClaroOrange focus:border-cargoClaroOrange p-2.5",
      inputClassName
    ),
  };

  return (
    <>
      {id && (
        <label
          htmlFor={id}
          className={cn("w-full mx-2 text-gray-500", labelClassName)}
        >
          {ariaLabel}
        </label>
      )}

      {type === "select" ? (
        <select
          aria-label={ariaLabel}
          onChange={(e) => onChange(e.target.value)}
          {...commonProps}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          step={step}
          min={min}
          max={max}
          checked={checked}
          onChange={(e) =>
            type === "checkbox"
              ? onChange(e.target.checked.toString())
              : onChange(e.target.value)
          }
          placeholder={placeholder}
          {...commonProps}
        />
      )}
    </>
  );
};

export default GenericSearchInput;
