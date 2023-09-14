import { useState, useImperativeHandle, forwardRef } from "react";

export const Alert = forwardRef((props, alertRef) => {
  const DEFAULT_STYLE = "primary";
  const VALID_STYLES = ["primary", "success", "danger", "warning", "info"];
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>();
  const [style, setStyle] = useState<string>(DEFAULT_STYLE);

  useImperativeHandle(alertRef, () => ({
    showAlert(message: string, style?: string) {
      setMessage(message);
      if (style && VALID_STYLES.includes(style)) setStyle(style);
      else setStyle(DEFAULT_STYLE);
      setVisible(true);
    },
  }));

  return (
    visible && (
      <div className={`alert alert-${style} alert-dismissible`}>
        {message}
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={() => setVisible(false)}
        ></button>
      </div>
    )
  );
});
