"use client";
import { useState, useRef, useEffect } from "react";

const Chevron = ({ rotated }: { rotated: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform duration-200 ${rotated ? "rotate-180" : "rotate-0"}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

type DropdownItem = { label: string; value: string; color?: string };

type ViewDropdownProps = {
  items: DropdownItem[];
  defaultValue?: string | string[];
  listType?: "single" | "checklist";
  checklistLabel?: string;
  onChange?: (value: string | string[]) => void;
  width?: string;
  closeOn?: unknown;
};

const ViewDropdown = ({
  items,
  defaultValue,
  listType = "single",
  checklistLabel = "Select items",
  onChange,
  width = "w-40",
  closeOn,
}: ViewDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | string[]>(
    listType === "checklist"
      ? Array.isArray(defaultValue)
        ? defaultValue
        : []
      : (defaultValue as string) || items[0].value
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const toggle = () => setIsOpen((prev) => !prev);

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    onChange?.(selected);
  }, [selected, onChange]);

  useEffect(() => {
    setIsOpen(false);
  }, [closeOn]);

  useEffect(() => {
    if (!isOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) setIsOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen]);

  const handleSelect = (value: string) => {
    if (listType === "checklist") {
      setSelected((prev) => {
        const arr = Array.isArray(prev) ? prev : [];
        const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
        return next;
      });
    } else {
      setSelected(value);
      setIsOpen(false);
    }
  };

  const getLabel = () => {
    if (listType === "checklist") return checklistLabel;
    const selectedItem = items.find((i) => i.value === selected);
    return selectedItem?.label || "Select...";
  };

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={toggle}
        className={`flex items-center justify-start cursor-pointer 
        border border-blue-400 bg-white text-black rounded px-3 py-1 
        transition-all duration-200 hover:bg-blue-50 text-left overflow-hidden ${width}`}
      >
        <span className="truncate flex-1 text-left">{getLabel()}</span>
        <div className="ml-1 flex-shrink-0">
          <Chevron rotated={isOpen} />
        </div>
      </button>

      {isOpen && (
        <div
          className={`absolute mt-1 left-0 rounded border border-blue-500 bg-white shadow-lg z-50
            transform origin-top transition-all duration-200 ease-out animate-slideDown`}
          style={{
            width: buttonRef.current ? `${buttonRef.current.offsetWidth}px` : "auto",
          }}
        >
          {items.map((item) => {
            const isSelected =
              listType === "checklist"
                ? Array.isArray(selected) && selected.includes(item.value)
                : selected === item.value;

            return (
              <div
                key={item.value}
                onClick={() => handleSelect(item.value)}
                className="px-3 py-2 cursor-pointer hover:bg-blue-100 text-blue-700 whitespace-nowrap flex items-center gap-2"
                style={{ color: item.color || "inherit" }}
              >
                {listType === "checklist" && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelect(item.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewDropdown;
