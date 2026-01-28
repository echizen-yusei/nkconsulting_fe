import { useState } from "react";

function useDisclosure({
  defaultOpen = false,
}: {
  defaultOpen?: boolean;
} = {}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return { isOpen, onOpen, onClose, action: setIsOpen };
}

export default useDisclosure;
