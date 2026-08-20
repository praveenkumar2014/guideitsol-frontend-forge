/**
 * GUIDESOFT Content Protection Guard
 * Disables right-click, developer inspect key shortcuts, and text copying/clipping
 * while preserving interactive form inputs, search fields, and admin controls.
 */

export function setupContentProtection() {
  if (typeof window === "undefined") return () => {};

  // 1. Prevent Right-Click Context Menu
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const isInteractive = (target: HTMLElement | null): boolean => {
    if (!target) return false;
    return Boolean(
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target instanceof HTMLButtonElement ||
      target.closest("button") ||
      target.closest("a") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest("select") ||
      target.closest("[role='button']") ||
      target.closest("[role='tab']") ||
      target.isContentEditable,
    );
  };

  const isFormInput = (target: HTMLElement | null): boolean => {
    if (!target) return false;
    return Boolean(
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target.isContentEditable,
    );
  };

  // 2. Prevent Copy, Cut, and Dragging
  const handleCopyOrCut = (e: ClipboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (!isFormInput(target)) {
      e.preventDefault();
      return false;
    }
  };

  const handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLElement | null;
    if (!isFormInput(target)) {
      e.preventDefault();
      return false;
    }
  };

  const handleSelectStart = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (!isInteractive(target)) {
      e.preventDefault();
      return false;
    }
  };

  // 3. Block Developer Tools & Inspection Shortcut Keys
  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    const isInput =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable;

    const key = e.key.toUpperCase();
    const isCtrlOrMeta = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const isAlt = e.altKey;

    // F12 (DevTools)
    if (e.key === "F12") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I / Cmd+Option+I (Inspect Element)
    if ((isCtrlOrMeta && isShift && key === "I") || (e.metaKey && isAlt && key === "I")) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+J / Cmd+Option+J (Console)
    if ((isCtrlOrMeta && isShift && key === "J") || (e.metaKey && isAlt && key === "J")) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+C / Cmd+Option+C (Inspect Picker)
    if ((isCtrlOrMeta && isShift && key === "C") || (e.metaKey && isAlt && key === "C")) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U / Cmd+Option+U (View Source)
    if ((isCtrlOrMeta && key === "U") || (e.metaKey && isAlt && key === "U")) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page)
    if (isCtrlOrMeta && key === "S" && !isInput) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Copy / Cut prevention outside inputs
    if (isCtrlOrMeta && (key === "C" || key === "X" || key === "A") && !isInput) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  window.addEventListener("contextmenu", handleContextMenu, { capture: true });
  document.addEventListener("contextmenu", handleContextMenu, { capture: true });
  window.addEventListener("copy", handleCopyOrCut, { capture: true });
  document.addEventListener("copy", handleCopyOrCut, { capture: true });
  window.addEventListener("cut", handleCopyOrCut, { capture: true });
  document.addEventListener("cut", handleCopyOrCut, { capture: true });
  window.addEventListener("dragstart", handleDragStart, { capture: true });
  document.addEventListener("dragstart", handleDragStart, { capture: true });
  window.addEventListener("selectstart", handleSelectStart, { capture: true });
  document.addEventListener("selectstart", handleSelectStart, { capture: true });
  window.addEventListener("keydown", handleKeyDown, { capture: true });
  document.addEventListener("keydown", handleKeyDown, { capture: true });

  return () => {
    window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
    document.removeEventListener("contextmenu", handleContextMenu, { capture: true });
    window.removeEventListener("copy", handleCopyOrCut, { capture: true });
    document.removeEventListener("copy", handleCopyOrCut, { capture: true });
    window.removeEventListener("cut", handleCopyOrCut, { capture: true });
    document.removeEventListener("cut", handleCopyOrCut, { capture: true });
    window.removeEventListener("dragstart", handleDragStart, { capture: true });
    document.removeEventListener("dragstart", handleDragStart, { capture: true });
    window.removeEventListener("selectstart", handleSelectStart, { capture: true });
    document.removeEventListener("selectstart", handleSelectStart, { capture: true });
    window.removeEventListener("keydown", handleKeyDown, { capture: true });
    document.removeEventListener("keydown", handleKeyDown, { capture: true });
  };
}

if (typeof window !== "undefined") {
  setupContentProtection();
}
