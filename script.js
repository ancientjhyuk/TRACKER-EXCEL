let previousReservations = []; // To store previous state before clearing

// Function to save reservations to local storage
function saveReservationsToLocalStorage(reservations) {
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Function to load reservations from local storage
function loadReservationsFromLocalStorage() {
    const savedReservations = JSON.parse(localStorage.getItem('reservations'));
    return savedReservations ? savedReservations : [];
}

// Function to render the reservation table
function renderReservations() {
    const reservations = loadReservationsFromLocalStorage();
    const tableBody = document.getElementById('reservationTableBody');
    tableBody.innerHTML = '';

    reservations.forEach(reservation => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${reservation.date}</td>
            <td>${reservation.timestamp}</td>
            <td>${reservation.agentName}</td>
            <td>${reservation.icName}</td>
            <td>Largay Travel</td>
            <td>${reservation.transactionType}</td>
            <td>${reservation.ticketNumber}</td>
            <td>${reservation.pnr}</td>
            <td>${reservation.customerInteraction}</td>
            <td>${reservation.urgency}</td>
            <td>${reservation.routeType}</td>
            <td>${reservation.airportCode}</td>
            <td>${reservation.tagging}</td>
            <td>${reservation.description}</td>
            <td><button class="deleteButton">Delete</button></td>
        `;
        tableBody.appendChild(newRow);
    });
}

// Handle form submission for new reservation
document.getElementById('reservationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const reservation = {
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toLocaleTimeString(),
        agentName: document.getElementById('agentName').value,
        icName: document.getElementById('icName').value,
        transactionType: document.getElementById('transactionType').value,
        ticketNumber: document.getElementById('ticketNumber').value,
        pnr: document.getElementById('pnr').value,
        customerInteraction: document.getElementById('customerInteraction').value,
        urgency: document.getElementById('urgency').value,
        routeType: document.getElementById('routeType').value,
        airportCode: document.getElementById('airportCode').value,
        tagging: document.getElementById('tagging').value,
        description: document.getElementById('description').value,
    };

    // Save the new reservation
    const reservations = loadReservationsFromLocalStorage();
    reservations.push(reservation);
    saveReservationsToLocalStorage(reservations);

    // Render the updated reservation table
    renderReservations();

    // Clear form inputs after submission
    document.getElementById('reservationForm').reset();
    localStorage.removeItem('reservationFormData');
});

// Clear all reservations functionality
document.getElementById('clearAllButton').addEventListener('click', function() {
    // Save the current state of reservations before clearing
    previousReservations = loadReservationsFromLocalStorage();

    // Clear reservations from local storage
    localStorage.removeItem('reservations');

    // Clear the displayed table
    const tableBody = document.getElementById('reservationTableBody');
    tableBody.innerHTML = '';

    // Show Undo button after clearing reservations
    document.getElementById('undoLastActionButton').style.display = 'inline-block';

    alert('All reservations have been cleared.');
});

// Undo last action (restore deleted reservations)
document.getElementById('undoLastActionButton').addEventListener('click', function() {
    // Restore the previous reservations from the backup
    saveReservationsToLocalStorage(previousReservations);

    // Render the restored reservation table
    renderReservations();

    // Hide the Undo button after undoing
    document.getElementById('undoLastActionButton').style.display = 'none';
});

// Event delegation for delete buttons
document.getElementById('reservationTableBody').addEventListener('click', function(event) {
    if (event.target.classList.contains('deleteButton')) {
        const row = event.target.parentElement.parentElement;
        const index = Array.from(row.parentNode.children).indexOf(row);

        // Save the previous reservations before removing the selected one (for undo functionality)
        previousReservations = loadReservationsFromLocalStorage();

        // Remove the reservation from storage
        const reservations = loadReservationsFromLocalStorage();
        reservations.splice(index, 1);
        saveReservationsToLocalStorage(reservations);

        // Remove the row from the table
        row.remove();

        // Show the Undo button after a delete action
        document.getElementById('undoLastActionButton').style.display = 'inline-block';
    }
});

// Function to copy the reservation table to clipboard in tab-separated format
function copyTableToExcel() {
    const table = document.getElementById('reservationTableBody');
    const rows = Array.from(table.rows);

    // Convert rows to tab-separated values, excluding only the action button
    const csvContent = rows.map(row => {
        const cells = Array.from(row.cells).slice(0, -1).map(cell => cell.textContent).join('\t');
        return cells;
    }).join('\n');

    // Create a temporary textarea to copy the content
    const textarea = document.createElement('textarea');
    textarea.value = csvContent;
    document.body.appendChild(textarea);
    
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    alert('Table copied to clipboard! You can now paste it into Excel.');
}

// Add event listener for the "Copy to Excel" button
document.getElementById('copyButton').addEventListener('click', copyTableToExcel);

// Load and render reservations on page load
window.onload = function() {
    renderReservations();
};
