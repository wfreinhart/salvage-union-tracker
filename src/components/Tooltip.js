import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);

  const updatePosition = () => {
    if (tooltipRef.current && containerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let left = containerRect.left + containerRect.width / 2 - tooltipRect.width / 2;
      let top = containerRect.bottom;

      // Adjust horizontal position if tooltip goes off-screen
      if (left < 10) {
        left = 10;
      } else if (left + tooltipRect.width > windowWidth - 10) {
        left = windowWidth - tooltipRect.width - 10;
      }

      // Adjust vertical position if tooltip goes off-screen
      if (top + tooltipRect.height > windowHeight - 10) {
        // If there's not enough space below, position above
        top = containerRect.top - tooltipRect.height - 10;
      }

      // Ensure the tooltip stays within the viewport
      top = Math.max(10, Math.min(windowHeight - tooltipRect.height - 10, top));

      setPosition({ top, left });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isVisible, content]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] p-2 bg-gray-800 text-white text-xs rounded shadow-lg w-64 max-w-xs break-words"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;