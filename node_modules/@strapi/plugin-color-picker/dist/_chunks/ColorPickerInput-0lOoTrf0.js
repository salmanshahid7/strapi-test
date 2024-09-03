"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const designSystem = require("@strapi/design-system");
const icons = require("@strapi/icons");
const reactColorful = require("react-colorful");
const reactIntl = require("react-intl");
const styled = require("styled-components");
const index = require("./index-OJYEuoCq.js");
require("@strapi/helper-plugin");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const React__namespace = /* @__PURE__ */ _interopNamespace(React);
const styled__default = /* @__PURE__ */ _interopDefault(styled);
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
  return React__namespace.useCallback(composeRefs(...refs), refs);
}
const ColorPreview = styled__default.default.div`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-color: ${(props) => props.color};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;
const ColorPicker = styled__default.default(reactColorful.HexColorPicker)`
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
const ColorPickerToggle = styled__default.default(designSystem.BaseButton)`
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
const ColorPickerPopover = styled__default.default(designSystem.Popover)`
  padding: ${({ theme }) => theme.spaces[2]};
  min-height: 270px;
`;
const ColorPickerInput = React__namespace.forwardRef(
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
    const [showColorPicker, setShowColorPicker] = React__namespace.useState(false);
    const colorPickerButtonRef = React__namespace.useRef(null);
    const { formatMessage } = reactIntl.useIntl();
    const color = value || "#000000";
    const handleBlur = (e) => {
      e.preventDefault();
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setShowColorPicker(false);
      }
    };
    const composedRefs = useComposedRefs(forwardedRef, colorPickerButtonRef);
    return /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.Field,
      {
        name,
        id: name,
        error,
        hint: description && formatMessage(description),
        required,
        children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 1, children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.FieldLabel, { action: labelAction, children: formatMessage(intlLabel) }),
          /* @__PURE__ */ jsxRuntime.jsxs(
            ColorPickerToggle,
            {
              ref: composedRefs,
              "aria-label": formatMessage({
                id: index.getTrad("color-picker.toggle.aria-label"),
                defaultMessage: "Color picker toggle"
              }),
              "aria-controls": "color-picker-value",
              "aria-haspopup": "dialog",
              "aria-expanded": showColorPicker,
              "aria-disabled": disabled,
              disabled,
              onClick: () => setShowColorPicker(!showColorPicker),
              children: [
                /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(ColorPreview, { color }),
                  /* @__PURE__ */ jsxRuntime.jsx(
                    designSystem.Typography,
                    {
                      style: { textTransform: "uppercase" },
                      textColor: value ? void 0 : "neutral600",
                      variant: "omega",
                      children: color
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntime.jsx(icons.CarretDown, { "aria-hidden": true })
              ]
            }
          ),
          showColorPicker && /* @__PURE__ */ jsxRuntime.jsx(
            ColorPickerPopover,
            {
              onBlur: handleBlur,
              role: "dialog",
              source: colorPickerButtonRef,
              spacing: 4,
              children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.FocusTrap, { onEscape: () => setShowColorPicker(false), children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  ColorPicker,
                  {
                    color,
                    onChange: (hexValue) => onChange({ target: { name, value: hexValue, type: attribute.type } })
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { paddingTop: 3, paddingLeft: 4, justifyContent: "flex-end", children: [
                  /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingRight: 2, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "omega", as: "label", textColor: "neutral600", children: formatMessage({
                    id: index.getTrad("color-picker.input.format"),
                    defaultMessage: "HEX"
                  }) }) }),
                  /* @__PURE__ */ jsxRuntime.jsx(
                    designSystem.FieldInput,
                    {
                      id: "color-picker-value",
                      "aria-label": formatMessage({
                        id: index.getTrad("color-picker.input.aria-label"),
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
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.FieldHint, {}),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.FieldError, {})
        ] })
      }
    );
  }
);
exports.ColorPickerInput = ColorPickerInput;
//# sourceMappingURL=ColorPickerInput-0lOoTrf0.js.map
