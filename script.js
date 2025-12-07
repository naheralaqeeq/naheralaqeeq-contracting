// ========================================
// INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  initScrollEffects();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initFormHandling();
  initBackToTop();
  initStatsCounter();
  initLogoHome();
});

// ========================================
// LOGO HOME BUTTON
// ========================================

function initLogoHome() {
  const logo = document.getElementById("logoHome");

  if (logo) {
    logo.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================

function initHeaderScroll() {
  const header = document.getElementById("header");

  if (!header) return;

  let ticking = false;

  const updateHeaderState = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Apply minimized sticky effect when scrolled past 50px
    if (scrollTop > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderState);
        ticking = true;
      }
    },
    { passive: true }
  );
}

// ========================================
// MOBILE MENU
// ========================================

function initMobileMenu() {
  const menuToggle = document.getElementById("mobileMenuToggle");
  const nav = document.getElementById("mainNav");

  // Guard against missing elements
  if (!menuToggle || !nav) return;

  // Ensure nav has proper accessibility attributes
  nav.setAttribute("role", "navigation");
  nav.setAttribute("aria-label", "Main menu");
  nav.setAttribute("aria-hidden", "true");

  const navLinks = nav.querySelectorAll("a");

  const setMenuState = (isOpen) => {
    menuToggle.classList.toggle("active", isOpen);
    nav.classList.toggle("active", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    nav.setAttribute("aria-hidden", isOpen ? "false" : "true");
  };

  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    const isOpen = nav.classList.contains("active");
    setMenuState(!isOpen);
  });

  // Close menu when clicking nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      setMenuState(false);
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInsideNav = nav.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);

    if (
      !isClickInsideNav &&
      !isClickOnToggle &&
      nav.classList.contains("active")
    ) {
      setMenuState(false);
    }
  });

  // Close on Escape key for accessibility
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("active")) {
      setMenuState(false);
      menuToggle.focus();
    }
  });
}

// ========================================
// SMOOTH SCROLLING
// ========================================

function initSmoothScroll() {
  // Handle all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");

      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Handle buttons with data-scroll-to attribute
  document.querySelectorAll("[data-scroll-to]").forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-scroll-to");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

function initScrollEffects() {
  const revealElements = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const revealPoint = 100;

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add("active");
      }
    });
  };

  // Initial check
  revealOnScroll();

  // Check on scroll with throttling
  let scrollTimeout;
  window.addEventListener("scroll", function () {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(revealOnScroll);
  });
}

// ========================================
// STATS COUNTER ANIMATION
// ========================================

function initStatsCounter() {
  const statItems = document.querySelectorAll(".stat-item");
  let hasAnimated = false;

  const animateCounters = () => {
    if (hasAnimated) return;

    const windowHeight = window.innerHeight;
    const statsSection = document.querySelector(".stats");

    if (!statsSection) return;

    const statsSectionTop = statsSection.getBoundingClientRect().top;

    if (statsSectionTop < windowHeight - 100) {
      hasAnimated = true;

      statItems.forEach((item) => {
        const target = parseInt(item.getAttribute("data-target"));
        const numberElement = item.querySelector(".stat-number");
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
          current += increment;

          if (current < target) {
            numberElement.textContent =
              Math.floor(current) + (target === 100 ? "%" : "+");
            requestAnimationFrame(updateCounter);
          } else {
            numberElement.textContent = target + (target === 100 ? "%" : "+");
          }
        };

        updateCounter();
      });
    }
  };

  // Initial check
  animateCounters();

  // Check on scroll
  window.addEventListener("scroll", animateCounters);
}

// ========================================
// FORM HANDLING
// ========================================

function initFormHandling() {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        project: document.getElementById("project").value,
        message: document.getElementById("message").value,
      };

      // Validate form
      if (!validateForm(formData)) {
        return;
      }

      // Show success message
      showFormMessage(
        "success",
        `Thank you, ${formData.name}! We've received your message. Our team will contact you shortly at ${formData.email}`
      );

      // Reset form
      contactForm.reset();

      // In a real application, you would send this data to a server
      // sendFormData(formData);
    });

    // Add input validation feedback
    const inputs = contactForm.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateInput(this);
      });

      input.addEventListener("input", function () {
        if (this.classList.contains("error")) {
          validateInput(this);
        }
      });
    });
  }
}

function validateForm(data) {
  let isValid = true;

  // Name validation
  if (data.name.trim().length < 2) {
    showInputError("name", "Please enter a valid name");
    isValid = false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showInputError("email", "Please enter a valid email address");
    isValid = false;
  }

  // Phone validation
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(data.phone) || data.phone.length < 8) {
    showInputError("phone", "Please enter a valid phone number");
    isValid = false;
  }

  // Message validation
  if (data.message.trim().length < 10) {
    showInputError(
      "message",
      "Please enter a message with at least 10 characters"
    );
    isValid = false;
  }

  return isValid;
}

function validateInput(input) {
  const value = input.value.trim();
  let isValid = true;
  let errorMessage = "";

  if (input.hasAttribute("required") && value === "") {
    isValid = false;
    errorMessage = "This field is required";
  } else if (input.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = "Please enter a valid email address";
    }
  } else if (input.type === "tel") {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value) || value.length < 8) {
      isValid = false;
      errorMessage = "Please enter a valid phone number";
    }
  }

  if (!isValid) {
    showInputError(input.id, errorMessage);
  } else {
    clearInputError(input.id);
  }

  return isValid;
}

function showInputError(inputId, message) {
  const input = document.getElementById(inputId);
  const formGroup = input.closest(".form-group");

  input.classList.add("error");

  // Remove existing error message
  const existingError = formGroup.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // Add new error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.color = "#ef4444";
  errorDiv.style.fontSize = "0.85rem";
  errorDiv.style.marginTop = "0.25rem";
  errorDiv.textContent = message;
  formGroup.appendChild(errorDiv);
}

function clearInputError(inputId) {
  const input = document.getElementById(inputId);
  const formGroup = input.closest(".form-group");

  input.classList.remove("error");

  const errorMessage = formGroup.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

function showFormMessage(type, message) {
  // Create message element
  const messageDiv = document.createElement("div");
  messageDiv.className = `form-message ${type}`;
  messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === "success" ? "#10b981" : "#ef4444"};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
        max-width: 90%;
        text-align: center;
    `;
  messageDiv.textContent = message;

  // Add animation (only once)
  if (!document.getElementById("formMessageStyle")) {
    const style = document.createElement("style");
    style.id = "formMessageStyle";
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(messageDiv);

  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.style.animation = "slideDown 0.3s ease-out reverse";
    setTimeout(() => {
      messageDiv.remove();
      style.remove();
    }, 300);
  }, 5000);
}

// ========================================
// BACK TO TOP BUTTON
// ========================================

function initBackToTop() {
  const backToTopButton = document.getElementById("backToTop");

  if (backToTopButton) {
    window.addEventListener(
      "scroll",
      throttle(function () {
        if (window.pageYOffset > 300) {
          backToTopButton.classList.add("visible");
        } else {
          backToTopButton.classList.remove("visible");
        }
      }, 150)
    );

    backToTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ========================================
// LAZY LOADING FOR IMAGES (Optional)
// ========================================

function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log(
  "%c🏗️ Naher Alaqeeq Building Contracting LLC",
  "font-size: 16px; font-weight: bold; color: #d4a574;"
);
console.log(
  "%c16+ Years of Excellence in Construction",
  "font-size: 12px; color: #1a3a52;"
);
