import { useState } from "react";
import Collapsible from "react-collapsible";
import { isMobile } from "react-device-detect";

type AccordionChild = { children: React.ReactNode; title: string };

export default function Accordion({ children, title }: AccordionChild) {
  const [open, isOpen] = useState(!isMobile);

  return (
    <Collapsible
      trigger={open ? `${title} ^ Close` : `${title} \u02C5 Expand`}
      open={open}
      onOpening={() => isOpen(true)}
      onClose={() => isOpen(false)}
    >
      {children}
    </Collapsible>
  );
}
