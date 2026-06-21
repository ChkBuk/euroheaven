"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import AIAssistant from "@/components/AIAssistant";

// Routes where the floating chat bubble should NOT appear. The booking
// wizard and admin pages need every pixel for their own controls — the
// bottom-right bubble can overlap the wizard's Continue button on
// short viewports.
const HIDDEN_PATHS = ["/book", "/admin", "/auth"];

function BotIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M12 4v4" />
      <circle cx="12" cy="3" r="1" fill="currentColor" />
      <circle cx="9" cy="14" r="1" fill="currentColor" />
      <circle cx="15" cy="14" r="1" fill="currentColor" />
      <path d="M9 18h6" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 0 1-1.27-4.39c0-4.54 3.7-8.24 8.26-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.23 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.4-.42-.56-.42-.14 0-.31-.02-.48-.02-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.88 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28z" />
    </svg>
  );
}

function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.33.27.54l.06 1.78c.02.57.6.94 1.12.71l1.98-.87c.16-.07.34-.08.51-.04.91.25 1.88.38 2.92.38 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm6 7.46-2.94 4.67a1.5 1.5 0 0 1-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.67a1.5 1.5 0 0 1 2.17-.4l2.34 1.75c.21.16.51.16.72 0l3.16-2.4c.42-.32.97.18.69.63z" />
    </svg>
  );
}

export default function FloatingChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  if (
    pathname &&
    HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return null;
  }

  const phoneForWhatsApp = site.phone.replace(/[^\d]/g, "");
  const whatsappUrl = `https://wa.me/${phoneForWhatsApp}`;
  const messengerUrl = "https://m.me/euroheaven";

  type Option = {
    label: string;
    icon: (p: { className?: string }) => ReactNode;
    bg: string;
  } & (
    | { kind: "link"; href: string; external: boolean }
    | { kind: "action"; onClick: () => void }
  );

  const options: Option[] = [
    {
      kind: "action",
      label: "Chat with AI Assistant",
      icon: BotIcon,
      bg: "bg-[#00B2E3] hover:bg-[#00A0CC]",
      onClick: () => {
        setOpen(false);
        setAiOpen(true);
      },
    },
    {
      kind: "link",
      label: "Chat on WhatsApp",
      href: whatsappUrl,
      icon: WhatsAppIcon,
      bg: "bg-[#25D366] hover:bg-[#1FB959]",
      external: true,
    },
    {
      kind: "link",
      label: "Chat on Messenger",
      href: messengerUrl,
      icon: MessengerIcon,
      bg: "bg-[#0084FF] hover:bg-[#0073E0]",
      external: true,
    },
  ];

  return (
    <>
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />

      {/* Mobile: bottom-20 keeps the FAB clear of the MobileCTA bar.
          Desktop (lg+): bottom-24 lifts the FAB above the footer's
          bottom strip so it cannot intercept clicks on Privacy /
          Terms / Staff Login when the user is scrolled all the way
          down. */}
      <div className="fixed right-4 md:right-6 bottom-20 lg:bottom-24 z-40 flex flex-col items-end gap-3">
        <div
          className={cn(
            "flex flex-col items-end gap-3 transition-all duration-300",
            open && !aiOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-3 pointer-events-none"
          )}
          aria-hidden={!open || aiOpen}
        >
          {options.map((opt, i) => {
            const Icon = opt.icon;
            const sharedClass = cn(
              "inline-flex items-center gap-3 pl-4 pr-5 h-12 w-60 rounded-full text-white font-medium shadow-xl transition-transform hover:scale-[1.03]",
              opt.bg
            );
            const sharedStyle = {
              transitionDelay: open ? `${i * 60}ms` : "0ms",
              transitionProperty: "transform, background-color",
            };
            const inner = (
              <>
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm md:text-base whitespace-nowrap">
                  {opt.label}
                </span>
              </>
            );
            if (opt.kind === "action") {
              return (
                <button
                  key={opt.label}
                  onClick={opt.onClick}
                  className={sharedClass}
                  style={sharedStyle}
                  tabIndex={open ? 0 : -1}
                >
                  {inner}
                </button>
              );
            }
            return (
              <a
                key={opt.label}
                href={opt.href}
                target={opt.external ? "_blank" : undefined}
                rel={opt.external ? "noopener noreferrer" : undefined}
                className={sharedClass}
                style={sharedStyle}
                tabIndex={open ? 0 : -1}
              >
                {inner}
              </a>
            );
          })}
        </div>

        <button
          onClick={() => {
            if (aiOpen) {
              setAiOpen(false);
              return;
            }
            setOpen((v) => !v);
          }}
          aria-label={
            aiOpen
              ? "Close AI assistant"
              : open
                ? "Close chat menu"
                : "Open chat menu"
          }
          aria-expanded={open || aiOpen}
          className={cn(
            "w-14 h-14 rounded-full bg-accent text-white grid place-items-center shadow-2xl hover:scale-[1.05] transition-transform",
            aiOpen && "opacity-0 pointer-events-none"
          )}
        >
          {open ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>
    </>
  );
}
