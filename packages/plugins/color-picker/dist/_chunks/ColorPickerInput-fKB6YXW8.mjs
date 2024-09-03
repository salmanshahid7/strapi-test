import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { BaseButton, Popover, Field, Flex, FieldLabel, Typography, FocusTrap, Box, FieldInput, FieldHint, FieldError } from "@strapi/design-system";
import { CarretDown } from "@strapi/icons";
import { HexColorPicker } from "react-colorful";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { g as getTrad } from "./index-uOrtnJpz.mjs";
import "@strapi/helper-plugin";
function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => refs.forEach((ref) => setRef(ref, node));
}
function useComposedRefs(...refs) {
  return React.useCallback(composeRefs(...refs), refs);
}
const ColorPreview = styled.div`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-color: ${(props) => props.color};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;
const ColorPicker = styled(HexColorPicker)`
  && {
    width: 100%;
    aspect-ratio: 1.5;
  }

  .react-colorful__pointer {
    width: ${({ theme }) => theme.spaces[3]};
    height: ${({ theme }) => theme.spaces[3]};
  }

  .react-colorful__saturation {
    border-radius: ${({ theme }) => theme.spaces[1]};
    border-bottom: none;
  }

  .react-colorful__hue {
    border-radius: 10px;
    height: ${({ theme }) => theme.spaces[3]};
    margin-top: ${({ theme }) => theme.spaces[2]};
  }
`;
const ColorPickerToggle = styled(BaseButton)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    width: ${({ theme }) => theme.spaces[2]};
    height: ${({ theme }) => theme.spaces[2]};
  }

  svg > path {
    fill: ${({ theme }) => theme.colors.neutral500};
    justify-self: flex-end;
  }
`;
const ColorPickerPopover = styled(Popover)`
  padding: ${({ theme }) => theme.spaces[2]};
  min-height: 270px;
`;
const ColorPickerInput = React.forwardRef(
  ({
    attribute,
    description,
    disabled = false,
    error,
    intlLabel,
    labelAction,
    name,
    onChange,
    required = false,
    value = ""
  }, forwardedRef) => {
    const [showColorPicker, setShowColorPicker] = React.useState(false);
    const colorPickerButtonRef = React.useRef(null);
    const { formatMessage } = useIntl();
    const color = value || "#000000";
    const handleBlur = (e) => {
      e.preventDefault();
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setShowColorPicker(false);
      }
    };
    const composedRefs = useComposedRefs(forwardedRef, colorPickerButtonRef);
    return /* @__PURE__ */ jsx(
      Field,
      {
        name,
        id: name,
        error,
        hint: description && formatMessage(description),
        required,
        children: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 1, children: [
          /* @__PURE__ */ jsx(FieldLabel, { action: labelAction, children: formatMessage(intlLabel) }),
          /* @__PURE__ */ jsxs(
            ColorPickerToggle,
            {
              ref: composedRefs,
              "aria-label": formatMessage({
                id: getTrad("color-picker.toggle.aria-label"),
                defaultMessage: "Color picker toggle"
              }),
              "aria-controls": "color-picker-value",
              "aria-haspopup": "dialog",
              "aria-expanded": showColorPicker,
              "aria-disabled": disabled,
              disabled,
              onClick: () => setShowColorPicker(!showColorPicker),
              children: [
                /* @__PURE__ */ jsxs(Flex, { children: [
                  /* @__PURE__ */ jsx(ColorPreview, { color }),
                  /* @__PURE__ */ jsx(
                    Typography,
                    {
                      style: { textTransform: "uppercase" },
                      textColor: value ? void 0 : "neutral600",
                      variant: "omega",
                      children: color
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(CarretDown, { "aria-hidden": true })
              ]
            }
          ),
          showColorPicker && /* @__PURE__ */ jsx(
            ColorPickerPopover,
            {
              onBlur: handleBlur,
              role: "dialog",
              source: colorPickerButtonRef,
              spacing: 4,
              children: /* @__PURE__ */ jsxs(FocusTrap, { onEscape: () => setShowColorPicker(false), children: [
                /* @__PURE__ */ jsx(
                  ColorPicker,
                  {
                    color,
                    onChange: (hexValue) => onChange({ target: { name, value: hexValue, type: attribute.type } })
                  }
                ),
                /* @__PURE__ */ jsxs(Flex, { paddingTop: 3, paddingLeft: 4, justifyContent: "flex-end", children: [
                  /* @__PURE__ */ jsx(Box, { paddingRight: 2, children: /* @__PURE__ */ jsx(Typography, { variant: "omega", as: "label", textColor: "neutral600", children: formatMessage({
                    id: getTrad("color-picker.input.format"),
                    defaultMessage: "HEX"
                  }) }) }),
                  /* @__PURE__ */ jsx(
                    FieldInput,
                    {
                      id: "color-picker-value",
                      "aria-label": formatMessage({
                        id: getTrad("color-picker.input.aria-label"),
                        defaultMessage: "Color picker input"
                      }),
                      style: { textTransform: "uppercase" },
                      value,
                      placeholder: "#000000",
                      onChange
                    }
                  )
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(FieldHint, {}),
          /* @__PURE__ */ jsx(FieldError, {})
        ] })
      }
    );
  }
);
export {
  ColorPickerInput
};
//# sourceMappingURL=ColorPickerInput-fKB6YXW8.mjs.map
