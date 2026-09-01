/* ==========================================================================
   Atul Kumar Yadav - Developer Portfolio Core JavaScript
   Theme Switcher, Typing Animation, Navigation, Modals & Event Handlers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // 1. GLOBAL TOAST NOTIFICATION SYSTEM
  // ========================================================================
  const toastContainer = document.getElementById('toast-container');

  window.showToast = function (message, duration = 3000) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--accent-cyan);"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // ========================================================================
  // 2. THEME SWITCHER (Dark & Light Mode)
  // ========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme');
      const nextTheme = active === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      window.showToast(`Switched to ${nextTheme.toUpperCase()} theme`);
    });
  }

  // ========================================================================
  // 3. NAVBAR SCROLL & MOBILE DRAWER
  // ========================================================================
  const navbar = document.getElementById('navbar');
  const scrollProgressBar = document.getElementById('scroll-progress');
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = docHeight > 0 ? (scrollPos / docHeight) * 100 : 0;

    // Scroll Progress Bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercentage}%`;
    }

    // Navbar style on scroll
    if (navbar) {
      if (scrollPos > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll to Top button visibility
    if (scrollToTopBtn) {
      if (scrollPos > 400) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }

    // Active link highlighting based on section scroll
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Menu
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ========================================================================
  // 4. HERO SECTION TYPING ANIMATION
  // ========================================================================
  const typedTarget = document.getElementById('typed-text');
  const phrases = [
    'Core Java & Backend Systems.',
    'Data Structures & Algorithms.',
    'OOPs & Scalable Architectures.',
    'C Systems & File Databases.',
    'Enterprise Software Solutions.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const delayBetweenPhrases = 1800;

  function typeEffect() {
    if (!typedTarget) return;

    const current = phrases[phraseIndex];

    if (isDeleting) {
      typedTarget.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTarget.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeEffect, delayBetweenPhrases);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeEffect, 400);
    } else {
      setTimeout(typeEffect, isDeleting ? deleteSpeed : typeSpeed);
    }
  }

  typeEffect();

  // ========================================================================
  // 5. STAT COUNTER ANIMATION
  // ========================================================================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let counted = false;

  function countStats() {
    if (counted) return;
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        let count = 0;
        const speed = target / 25;

        const updateCount = () => {
          count += speed;
          if (count < target) {
            stat.textContent = Math.ceil(count) + (target >= 100 ? '+' : '');
            requestAnimationFrame(updateCount);
          } else {
            stat.textContent = target + (target >= 100 ? '+' : '');
          }
        };
        updateCount();
      });
      counted = true;
    }
  }

  window.addEventListener('scroll', countStats);
  countStats();

  // ========================================================================
  // 6. PROJECT FILTER TABS
  // ========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ========================================================================
  // 7. SOURCE CODE MODAL SYSTEM
  // ========================================================================
  const codeModal = document.getElementById('code-modal');
  const modalProjectTitle = document.getElementById('modal-project-title');
  const modalCodeContent = document.getElementById('modal-code-content');
  const closeCodeModal = document.getElementById('close-code-modal');
  const modalDoneBtn = document.getElementById('modal-done-btn');
  const modalCopyCodeBtn = document.getElementById('modal-copy-code-btn');

  const sourceCodeSnippets = {
    'undo-redo': {
      title: 'Undo-Redo System (Java Stack DSA)',
      code: `import java.util.Stack;

/**
 * Undo-Redo System Implementation in Java
 * Demonstrates LIFO Data Structure application for state restoration.
 * @author Atul Kumar Yadav
 */
public class UndoRedoManager<T> {
    private final Stack<T> undoStack;
    private final Stack<T> redoStack;
    private T currentState;

    public UndoRedoManager(T initialState) {
        this.undoStack = new Stack<>();
        this.redoStack = new Stack<>();
        this.currentState = initialState;
        this.undoStack.push(initialState);
    }

    public void applyAction(T newState) {
        undoStack.push(newState);
        redoStack.clear(); // Clear redo history on new action
        this.currentState = newState;
        System.out.println("Action Applied: " + newState);
    }

    public T undo() {
        if (undoStack.size() <= 1) {
            System.out.println("Nothing to undo!");
            return currentState;
        }
        T popped = undoStack.pop();
        redoStack.push(popped);
        this.currentState = undoStack.peek();
        return this.currentState;
    }

    public T redo() {
        if (redoStack.isEmpty()) {
            System.out.println("Nothing to redo!");
            return currentState;
        }
        T restored = redoStack.pop();
        undoStack.push(restored);
        this.currentState = restored;
        return this.currentState;
    }

    public T getCurrentState() {
        return currentState;
    }
}`
    },
    'parking': {
      title: 'Parking Management System (Java OOP & File I/O)',
      code: `import java.io.*;
import java.util.*;

/**
 * Automated Vehicle Parking System
 * Architecture: Object Oriented Parking Slot Allocation & Persistent File Logs
 * @author Atul Kumar Yadav
 */
class Vehicle implements Serializable {
    private String plateNumber;
    private String vehicleType;
    private long entryTimestamp;

    public Vehicle(String plateNumber, String vehicleType) {
        this.plateNumber = plateNumber;
        this.vehicleType = vehicleType;
        this.entryTimestamp = System.currentTimeMillis();
    }
    public String getPlateNumber() { return plateNumber; }
    public String getVehicleType() { return vehicleType; }
    public long getEntryTimestamp() { return entryTimestamp; }
}

public class ParkingSlotManager {
    private static final int MAX_SLOTS = 20;
    private Map<Integer, Vehicle> activeSlots = new HashMap<>();
    private final File dataFile = new File("parking_records.dat");

    public synchronized int allocateSlot(Vehicle vehicle) {
        for (int i = 1; i <= MAX_SLOTS; i++) {
            if (!activeSlots.containsKey(i)) {
                activeSlots.put(i, vehicle);
                saveRecordsToFile();
                return i;
            }
        }
        return -1; // Parking full
    }

    public synchronized double releaseSlotAndBill(int slotId, double hourlyRate) {
        if (!activeSlots.containsKey(slotId)) return 0.0;
        Vehicle v = activeSlots.remove(slotId);
        long durationMs = System.currentTimeMillis() - v.getEntryTimestamp();
        double hours = Math.max(1.0, durationMs / (1000.0 * 3600.0));
        saveRecordsToFile();
        return hours * hourlyRate;
    }

    private void saveRecordsToFile() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(dataFile))) {
            oos.writeObject(activeSlots);
        } catch (IOException e) {
            System.err.println("File I/O Error: " + e.getMessage());
        }
    }
}`
    },
    'library': {
      title: 'Library Management System (C Language with Structs & File I/O)',
      code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/**
 * Library Management System in C
 * Utilizes Structs, Binary File Streams, and Fast Linear Lookup
 * @author Atul Kumar Yadav
 */

struct Book {
    int bookId;
    char title[100];
    char author[50];
    int isIssued;
    char issuedToStudent[20];
};

void addBook(const char* filename, struct Book b) {
    FILE *fp = fopen(filename, "ab");
    if (fp == NULL) {
        perror("Error opening database file");
        return;
    }
    fwrite(&b, sizeof(struct Book), 1, fp);
    fclose(fp);
    printf("✓ Book '%s' saved successfully.\\n", b.title);
}

void issueBook(const char* filename, int bookId, const char* studentRoll) {
    FILE *fp = fopen(filename, "rb+");
    if (fp == NULL) return;

    struct Book b;
    int found = 0;

    while (fread(&b, sizeof(struct Book), 1, fp) == 1) {
        if (b.bookId == bookId && b.isIssued == 0) {
            b.isIssued = 1;
            strncpy(b.issuedToStudent, studentRoll, sizeof(b.issuedToStudent) - 1);
            fseek(fp, -((long)sizeof(struct Book)), SEEK_CUR);
            fwrite(&b, sizeof(struct Book), 1, fp);
            found = 1;
            printf("✓ Book ID %d issued to %s.\\n", bookId, studentRoll);
            break;
        }
    }
    fclose(fp);
    if (!found) printf("Book not available or not found.\\n");
}`
    }
  };

  document.querySelectorAll('.open-code-modal').forEach((btn) => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const snippet = sourceCodeSnippets[projKey];
      if (snippet && codeModal) {
        modalProjectTitle.textContent = snippet.title;
        modalCodeContent.textContent = snippet.code;
        codeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeCodeModalHandler() {
    if (codeModal) {
      codeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeCodeModal) closeCodeModal.addEventListener('click', closeCodeModalHandler);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeCodeModalHandler);
  if (codeModal) {
    codeModal.addEventListener('click', (e) => {
      if (e.target === codeModal) closeCodeModalHandler();
    });
  }

  if (modalCopyCodeBtn) {
    modalCopyCodeBtn.addEventListener('click', () => {
      if (modalCodeContent) {
        navigator.clipboard.writeText(modalCodeContent.textContent).then(() => {
          window.showToast('Source code copied to clipboard!');
        });
      }
    });
  }

  // ========================================================================
  // 8. RESUME MODAL SYSTEM
  // ========================================================================
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const closeResumeModal = document.getElementById('close-resume-modal');
  const copyResumeTextBtn = document.getElementById('btn-copy-resume-text');

  if (openResumeBtn && resumeModal) {
    openResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeResumeModalHandler() {
    if (resumeModal) {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeResumeModal) closeResumeModal.addEventListener('click', closeResumeModalHandler);
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModalHandler();
    });
  }

  if (copyResumeTextBtn) {
    copyResumeTextBtn.addEventListener('click', () => {
      const resumeText = `ATUL KUMAR YADAV
Phone: +91-7488868176 | Email: atulkumar4760083@gmail.com | LinkedIn: https://linkedin.com/in/atul-kumar-yadav-461980301

SUMMARY:
Enthusiastic Computer Science graduate with a strong foundation in Java, OOPs, C, and Data Structures Algorithms. Skilled in problem-solving and developing efficient solutions. Passionate about learning new technologies and seeking an opportunity to contribute to a dynamic organization while enhancing technical expertise.

TECHNICAL SKILLS:
- Languages: Java, C, SQL, HTML, CSS, JavaScript
- Core Java: OOP, Exception Handling, Multithreading, JDBC
- Data Structures & Algorithms: Arrays, Linked List, Stack, Queue, Searching & Sorting
- Databases: MySQL
- Tools & OS: Linux, VS Code, Eclipse, Git/GitHub
- Networking: TCP/IP, OSI Model, DNS, HTTP/HTTPS

PROJECTS:
1. Parking Management System | Java
   - Developed a Java-based console application to automate vehicle entry, exit, and parking slot allocation.
   - Applied OOP principles for modular and scalable design; implemented file handling for persistent record management.
   - Reduced manual overhead by digitizing end-to-end parking operations.
2. Library Management System | C
   - Built a file-based record management system to handle book records, issue, and return operations.
   - Used structures, functions, and file handling for efficient data storage and retrieval.
3. Undo-Redo System | Java, Data Structures
   - Implemented Undo/Redo functionality using Stack Data Structure, demonstrating practical DSA application.

EDUCATION:
- Master of Computer Applications (MCA) | Noida Institute of Engineering and Technology (2025 – 2027)
- Bachelor of Computer Applications (BCA) | Patliputra University, Patna, Bihar (2022 – 2025)
- Class XII – BSEB | R.B.D Inter College, Bihar (2021 – 2022)

CERTIFICATIONS:
- Java Programming – SimpliLearn
- Data Structures & Algorithms – Programming Classes
- C Programming – Programming Classes
- Linux – Infosys Springboard

SOFT SKILLS:
Problem Solving • Analytical Thinking • Communication • Team Collaboration • Time Management`;

      navigator.clipboard.writeText(resumeText).then(() => {
        window.showToast('Full resume copied to clipboard!');
      });
    });
  }

  // ========================================================================
  // 9. COPY-TO-CLIPBOARD HANDLERS
  // ========================================================================
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          window.showToast(`Copied "${textToCopy}" to clipboard!`);
        });
      }
    });
  });

  // ========================================================================
  // 10. CONTACT FORM SUBMISSION
  // ========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value;
      const email = document.getElementById('form-email')?.value;
      const subject = document.getElementById('form-subject')?.value;
      const message = document.getElementById('form-message')?.value;

      if (!name || !email || !message) {
        window.showToast('Please fill in all required fields.');
        return;
      }

      // Simulate sending and construct mailto fallback
      const mailtoLink = `mailto:atulkumar4760083@gmail.com?subject=${encodeURIComponent(
        subject || 'Inquiry from Portfolio'
      )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      window.showToast('Thank you! Opening your email client to send message...');
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 1000);

      contactForm.reset();
    });
  }

  // Keyboard shortcut: Esc to close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCodeModalHandler();
      closeResumeModalHandler();
    }
  });

});
