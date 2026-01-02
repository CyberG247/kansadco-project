const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/2348037380434"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 transition-transform duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <div className="w-16 h-16 filter drop-shadow-xl">
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#25D366"
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