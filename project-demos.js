/* ==========================================================================
   Project Interactive Demos Logic
   1. Undo-Redo Stack Visualizer
   2. Parking Management System Simulator
   3. Library Management System Console Emulator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // 1. UNDO - REDO SYSTEM (DSA Stack Simulation)
  // ========================================================================
  const initialDocText = "Welcome to Atul's Portfolio!";
  let undoStack = [initialDocText];
  let redoStack = [];

  const docStateView = document.getElementById('doc-state-view');
  const undoStackContainer = document.getElementById('undo-stack-container');
  const redoStackContainer = document.getElementById('redo-stack-container');
  const stackInput = document.getElementById('stack-action-input');
  const btnPush = document.getElementById('btn-stack-push');
  const btnUndo = document.getElementById('btn-stack-undo');
  const btnRedo = document.getElementById('btn-stack-redo');
  const btnResetStack = document.getElementById('reset-stack-demo');

  function renderStacks() {
    // Render Document View
    const currentText = undoStack.length > 0 ? undoStack[undoStack.length - 1] : "(Empty document)";
    if (docStateView) {
      docStateView.textContent = currentText;
    }

    // Render Undo Stack (LIFO: last item is top)
    if (undoStackContainer) {
      if (undoStack.length === 0) {
        undoStackContainer.innerHTML = '<div class="stack-placeholder">Undo stack empty</div>';
      } else {
        undoStackContainer.innerHTML = undoStack
          .map((item, idx) => {
            const isTop = idx === undoStack.length - 1;
            return `<div class="stack-item ${isTop ? 'active-top' : ''}">${escapeHtml(item)}</div>`;
          })
          .join('');
      }
    }

    // Render Redo Stack
    if (redoStackContainer) {
      if (redoStack.length === 0) {
        redoStackContainer.innerHTML = '<div class="stack-placeholder">Redo stack empty</div>';
      } else {
        redoStackContainer.innerHTML = redoStack
          .map((item, idx) => {
            const isTop = idx === redoStack.length - 1;
            return `<div class="stack-item ${isTop ? 'active-top' : ''}">${escapeHtml(item)}</div>`;
          })
          .join('');
      }
    }

    // Buttons state
    if (btnUndo) btnUndo.disabled = undoStack.length <= 1;
    if (btnRedo) btnRedo.disabled = redoStack.length === 0;
  }

  function handleStackPush() {
    if (!stackInput) return;
    const val = stackInput.value.trim();
    if (!val) return;

    // Push new state, clear redo stack
    undoStack.push(val);
    redoStack = [];
    stackInput.value = '';
    renderStacks();
    window.showToast?.('Pushed new state to Undo Stack!');
  }

  function handleStackUndo() {
    if (undoStack.length > 1) {
      const popped = undoStack.pop();
      redoStack.push(popped);
      renderStacks();
      window.showToast?.('Undo operation: popped state moved to Redo Stack.');
    }
  }

  function handleStackRedo() {
    if (redoStack.length > 0) {
      const popped = redoStack.pop();
      undoStack.push(popped);
      renderStacks();
      window.showToast?.('Redo operation: state restored.');
    }
  }

  function handleResetStack() {
    undoStack = [initialDocText];
    redoStack = [];
    if (stackInput) stackInput.value = '';
    renderStacks();
    window.showToast?.('Stack visualizer reset to initial state.');
  }

  if (btnPush) btnPush.addEventListener('click', handleStackPush);
  if (stackInput) {
    stackInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleStackPush();
    });
  }
  if (btnUndo) btnUndo.addEventListener('click', handleStackUndo);
  if (btnRedo) btnRedo.addEventListener('click', handleStackRedo);
  if (btnResetStack) btnResetStack.addEventListener('click', handleResetStack);

  renderStacks();


  // ========================================================================
  // 2. PARKING MANAGEMENT SYSTEM SIMULATION
  // ========================================================================
  let parkingSlots = [
    { id: 101, type: 'Car', occupied: true, plate: 'UP16-CZ-4412', entryTime: new Date(Date.now() - 3600000 * 2.5) },
    { id: 102, type: 'Car', occupied: false, plate: null, entryTime: null },
    { id: 103, type: 'Bike', occupied: true, plate: 'BR01-XY-8899', entryTime: new Date(Date.now() - 3600000 * 1.2) },
    { id: 104, type: 'Bike', occupied: false, plate: null, entryTime: null },
    { id: 105, type: 'EV', occupied: false, plate: null, entryTime: null },
    { id: 106, type: 'EV', occupied: false, plate: null, entryTime: null },
  ];

  const rates = {
    Car: 40,
    Bike: 20,
    EV: 50
  };

  const parkingGrid = document.getElementById('parking-grid');
  const parkingLog = document.getElementById('parking-log');
  const parkingStatsBadge = document.getElementById('parking-stats-badge');
  const btnParkVehicle = document.getElementById('btn-park-vehicle');
  const vehicleNumberInput = document.getElementById('vehicle-number-input');
  const vehicleTypeSelect = document.getElementById('vehicle-type-select');

  function renderParkingLot() {
    if (!parkingGrid) return;

    let availableCount = 0;
    parkingGrid.innerHTML = parkingSlots
      .map((slot) => {
        if (!slot.occupied) availableCount++;
        const icon = slot.type === 'Car' ? '🚗' : slot.type === 'Bike' ? '🏍️' : '⚡';

        return `
          <div class="parking-slot ${slot.occupied ? 'occupied' : 'available'}">
            <div class="slot-number">Slot #${slot.id} (${slot.type})</div>
            <div class="slot-icon">${icon}</div>
            <div class="slot-info">
              ${slot.occupied ? `<strong>${slot.plate}</strong><br><small>Parked</small>` : '<em>[Empty Slot]</em>'}
            </div>
            ${slot.occupied ? `<button class="btn-slot-exit" onclick="window.exitVehicle(${slot.id})">Exit & Pay</button>` : ''}
          </div>
        `;
      })
      .join('');

    if (parkingStatsBadge) {
      parkingStatsBadge.textContent = `Available: ${availableCount}/${parkingSlots.length} Slots`;
    }
  }

  function handleParkVehicle() {
    if (!vehicleNumberInput || !vehicleTypeSelect) return;
    const plate = vehicleNumberInput.value.trim().toUpperCase();
    const type = vehicleTypeSelect.value;

    if (!plate) {
      window.showToast?.('Please enter a vehicle registration number!');
      return;
    }

    // Find first free slot of matching type or any free slot
    let freeSlot = parkingSlots.find((s) => !s.occupied && s.type === type);
    if (!freeSlot) {
      freeSlot = parkingSlots.find((s) => !s.occupied);
    }

    if (!freeSlot) {
      if (parkingLog) parkingLog.innerHTML = `<span style="color:#ef4444;">⚠️ Parking Full! No empty slots available.</span>`;
      window.showToast?.('Parking lot is currently full!');
      return;
    }

    freeSlot.occupied = true;
    freeSlot.plate = plate;
    freeSlot.entryTime = new Date();
    vehicleNumberInput.value = '';

    if (parkingLog) {
      parkingLog.innerHTML = `✓ <strong>Ticket Issued:</strong> ${plate} parked at Slot #${freeSlot.id} (${type}) at ${freeSlot.entryTime.toLocaleTimeString()}`;
    }
    renderParkingLot();
    window.showToast?.(`Vehicle ${plate} parked in Slot #${freeSlot.id}`);
  }

  window.exitVehicle = function (slotId) {
    const slot = parkingSlots.find((s) => s.id === slotId);
    if (!slot || !slot.occupied) return;

    const rate = rates[slot.type] || 30;
    // Simulate elapsed hours
    const elapsedHours = Math.max(1, Math.round((Date.now() - slot.entryTime.getTime()) / 3600000));
    const fee = elapsedHours * rate;

    const plate = slot.plate;
    slot.occupied = false;
    slot.plate = null;
    slot.entryTime = null;

    if (parkingLog) {
      parkingLog.innerHTML = `💸 <strong>Checkout:</strong> ${plate} exited Slot #${slot.id}. Duration: ~${elapsedHours} hr(s) | Total Fee: ₹${fee} (Paid)`;
    }
    renderParkingLot();
    window.showToast?.(`Checkout complete for ${plate}: ₹${fee}`);
  };

  if (btnParkVehicle) btnParkVehicle.addEventListener('click', handleParkVehicle);
  renderParkingLot();


  // ========================================================================
  // 3. LIBRARY MANAGEMENT SYSTEM C CONSOLE EMULATOR
  // ========================================================================
  let libraryBooks = [
    { id: 101, title: 'Data Structures with C', author: 'Reema Thareja', status: 'Available' },
    { id: 102, title: 'Core Java Volume I', author: 'Cay S. Horstmann', status: 'Available' },
    { id: 103, title: 'Operating System Concepts', author: 'Silberschatz', status: 'Issued to Student #MCA-25' },
    { id: 104, title: 'Computer Networks', author: 'Andrew S. Tanenbaum', status: 'Available' },
  ];

  const libBooksBody = document.getElementById('lib-books-body');
  const libSearchInput = document.getElementById('lib-search-input');
  const libBtnSearch = document.getElementById('lib-btn-search');
  const libStatusLog = document.getElementById('lib-status-log');

  function renderLibraryBooks(filter = '') {
    if (!libBooksBody) return;

    const query = filter.toLowerCase();
    const filtered = libraryBooks.filter(
      (b) => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      libBooksBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No matching books found in database.</td></tr>`;
      return;
    }

    libBooksBody.innerHTML = filtered
      .map((b) => {
        const isAvail = b.status === 'Available';
        return `
          <tr>
            <td><strong>#${b.id}</strong></td>
            <td>${escapeHtml(b.title)}</td>
            <td>${escapeHtml(b.author)}</td>
            <td>
              <span class="book-status-tag ${isAvail ? 'status-available' : 'status-issued'}">
                ${isAvail ? 'Available' : 'Issued'}
              </span>
            </td>
            <td>
              ${
                isAvail
                  ? `<button class="btn-lib-action btn-issue" onclick="window.issueBook(${b.id})"><i class="fa-solid fa-hand-holding-hand"></i> Issue</button>`
                  : `<button class="btn-lib-action btn-return" onclick="window.returnBook(${b.id})"><i class="fa-solid fa-rotate-left"></i> Return</button>`
              }
            </td>
          </tr>
        `;
      })
      .join('');
  }

  window.issueBook = function (id) {
    const book = libraryBooks.find((b) => b.id === id);
    if (!book) return;
    book.status = `Issued to Student #MCA-27`;
    renderLibraryBooks(libSearchInput ? libSearchInput.value : '');
    if (libStatusLog) {
      libStatusLog.innerHTML = `[FILE I/O] Updated record: "${book.title}" successfully issued to Student #MCA-27.`;
    }
    window.showToast?.(`Issued "${book.title}"`);
  };

  window.returnBook = function (id) {
    const book = libraryBooks.find((b) => b.id === id);
    if (!book) return;
    book.status = 'Available';
    renderLibraryBooks(libSearchInput ? libSearchInput.value : '');
    if (libStatusLog) {
      libStatusLog.innerHTML = `[FILE I/O] Book #${book.id} "${book.title}" returned into inventory. File synced.`;
    }
    window.showToast?.(`Returned "${book.title}" into library.`);
  };

  if (libBtnSearch && libSearchInput) {
    libBtnSearch.addEventListener('click', () => renderLibraryBooks(libSearchInput.value));
    libSearchInput.addEventListener('input', () => renderLibraryBooks(libSearchInput.value));
  }

  renderLibraryBooks();

  // Helper
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

});
