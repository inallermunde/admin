import React from "react"
import { Text, Flex, Box } from "rebass"
import { Input, Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"
import { ReactComponent as InfoIcon } from "../../assets/svg/info.svg"
import Tooltip from "../tooltip"

const StyledInput = styled(Input)`
  ${Typography.Base}
  ${props =>
    props.inline &&
    `
  max-width: 350px;
  flex: 50% 0 0;
  `}
`

export const StyledLabel = styled.div`
  ${Typography.Base}
  ${props =>
    props.boldLabel &&
    `
    font-weight: 500;
  `}
  ${props =>
    props.inline
      ? `
  text-align: right;
  padding-right: 15px;
  `
      : `
  padding-bottom: 10px;
  `}
  
  ${props =>
    props.required &&
    `
  &:after {
    color: rgba(255, 0, 0, 0.5);
    content: " *";
  }
  `}
`

const InputField = React.forwardRef(
  (
    {
      invalid,
      placeholder,
      defaultValue,
      step,
      min,
      max,
      inline,
      label,
      boldLabel,
      name,
      type,
      inputStyle,
      required,
      value,
      deletable,
      onDelete,
      onChange,
      onFocus,
      textAlign,
      disabled,
      withTooltip = false,
      tooltipText,
      tooltipProps = {},
      ...props
    },
    ref
  ) => {
    return (
      <Flex
        alignItems={inline && "center"}
        flexDirection={inline ? "row" : "column"}
        width={props.width}
        {...props}
      >
        {label && (
          <Label
            flex={"30% 0 0"}
            htmlFor={name}
            alignItems="center"
            display={props.start ? "flex" : inline && "inline !important"}
          >
            <StyledLabel
              required={required}
              inline={inline}
              boldLabel={boldLabel}
            >
              {label}
            </StyledLabel>
            {withTooltip ? (
              <Box
                sx={{
                  ":hover svg": { fill: "#454B54" },
                  "& svg": { fill: "#c4c4c4", transition: "fill 0.2s ease-in" },
                }}
                pb="10px"
                ml={2}
              >
                <InfoIcon
                  style={{ display: "flex", cursor: "pointer" }}
                  data-for={tooltipText}
                  data-tip={tooltipText}
                />
                <Tooltip id={tooltipText} {...tooltipProps} />
              </Box>
            ) : null}
          </Label>
        )}
        <StyledInput
          ref={ref}
          defaultValue={defaultValue}
          autoComplete="off"
          inline={inline}
          textAlign={textAlign || "left"}
          variant={invalid ? "invalidInput" : "input"}
          name={name}
          type={type}
          min={min}
          max={max}
          sx={inputStyle}
          value={value}
          step={step || "1"}
          placeholder={placeholder ? placeholder : "Placeholder"}
          onChange={onChange}
          onFocus={onFocus}
          disabled={disabled}
        />
        {deletable && (
          <Text ml={2} onClick={onDelete} sx={{ cursor: "pointer" }}>
            &times;
          </Text>
        )}
      </Flex>
    )
  }
)

export default InputField
