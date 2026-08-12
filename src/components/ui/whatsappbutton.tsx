const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/2348037380434"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float fixed bottom-[max(1.125rem,env(safe-area-inset-bottom))] right-3 z-40 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-[#1d6b4b] text-white shadow-[0_12px_30px_rgba(10,60,39,.3)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#17583e] md:bottom-7 md:right-7"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative z-10 h-[21px] w-[21px]">
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            d="M12.01 0C5.38 0 0 5.38 0 12.01c0 2.12.55 4.17 1.6 6l-1.6 5.9 6-1.5c1.8 1 3.8 1.6 5.9 1.6 6.63 0 12.01-5.38 12.01-12.01S18.64 0 12.01 0z"
          />
          <path
            fill="#FFF"
            d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.4.2-.7.1-1.3-.6-2.2-1.2-3.1-2.4-.4-.5-.3-.6-.1-.8.2-.2.4-.4.5-.6.2-.2.2-.3.3-.5s.1-.4 0-.5c-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6 0 1.6 1.1 3.1 1.3 3.3.2.3 2.2 3.4 5.4 4.7 2.1.9 3 .9 4 .7.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z"
          />
        </svg>
      </div>
    </a>
  );
};

export default WhatsAppButton;
