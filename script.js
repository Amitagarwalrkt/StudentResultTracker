/**
 * Student Result Processing System - Main Application Controller
 * Terminal-style interface for the student management system
 */

// Global variables
let studentSystem;
let commandHistory = [];
let historyIndex = -1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    studentSystem = new StudentManagementSystem();
    
    const commandInput = document.getElementById('commandInput');
    const output = document.getElementById('output');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close-modal');

    // Setup command input event listeners
    commandInput.addEventListener('keydown', handleKeyDown);
    commandInput.addEventListener('keyup', handleKeyUp);
    
    // Modal event listeners
    closeModal.addEventListener('click', closeModalWindow);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalWindow();
        }
    });

    // Focus on input
    commandInput.focus();
    
    // Show initial menu
    setTimeout(() => {
        executeCommand('menu');
    }, 500);
});

// Handle keyboard input
function handleKeyDown(event) {
    const commandInput = document.getElementById('commandInput');
    
    switch(event.key) {
        case 'Enter':
            event.preventDefault();
            const command = commandInput.value.trim();
            if (command) {
                executeCommand(command);
                commandHistory.unshift(command);
                if (commandHistory.length > 50) {
                    commandHistory.pop();
                }
                historyIndex = -1;
                commandInput.value = '';
            }
            break;
            
        case 'ArrowUp':
            event.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                commandInput.value = commandHistory[historyIndex] || '';
            }
            break;
            
        case 'ArrowDown':
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                commandInput.value = commandHistory[historyIndex] || '';
            } else if (historyIndex === 0) {
                historyIndex = -1;
                commandInput.value = '';
            }
            break;
            
        case 'Tab':
            event.preventDefault();
            autoCompleteCommand(commandInput);
            break;
    }
}

function handleKeyUp(event) {
    // Additional key handling if needed
}

// Auto-complete command suggestions
function autoCompleteCommand(input) {
    const commands = [
        'menu', 'help', 'add', 'delete', 'update', 'display', 'search', 
        'sort', 'top', 'stats', 'undo', 'clear', 'save', 'load', 'exit'
    ];
    
    const currentValue = input.value.toLowerCase();
    const matches = commands.filter(cmd => cmd.startsWith(currentValue));
    
    if (matches.length === 1) {
        input.value = matches[0];
    } else if (matches.length > 1) {
        printOutput(`Available commands: ${matches.join(', ')}`, 'info');
    }
}

// Execute commands
function executeCommand(command) {
    const output = document.getElementById('output');
    
    // Print the command
    printOutput(`student-system:~$ ${command}`, 'command');
    
    const parts = command.toLowerCase().trim().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);
    
    try {
        switch(cmd) {
            case 'menu':
            case 'm':
                showMenu();
                break;
                
            case 'help':
            case 'h':
                showHelp();
                break;
                
            case 'add':
            case 'a':
                if (args.length === 0) {
                    showAddStudentForm();
                } else {
                    printOutput('Use "add" command without parameters to open the form.', 'info');
                }
                break;
                
            case 'delete':
            case 'del':
            case 'd':
                if (args.length === 1) {
                    deleteStudent(parseInt(args[0]));
                } else {
                    printOutput('Usage: delete <roll_number>', 'error');
                }
                break;
                
            case 'update':
            case 'u':
                if (args.length === 1) {
                    showUpdateStudentForm(parseInt(args[0]));
                } else {
                    printOutput('Usage: update <roll_number>', 'error');
                }
                break;
                
            case 'display':
            case 'show':
            case 'list':
            case 'ls':
                displayAllStudents();
                break;
                
            case 'search':
            case 's':
                if (args.length >= 1) {
                    const searchType = args.length > 1 ? args[0] : 'rollno';
                    const query = args.length > 1 ? args.slice(1).join(' ') : args[0];
                    searchStudents(query, searchType);
                } else {
                    printOutput('Usage: search <query> or search <rollno|name> <query>', 'error');
                }
                break;
                
            case 'sort':
                if (args.length >= 1) {
                    const sortBy = args[0] || 'percentage';
                    const algorithm = args[1] || 'bubble';
                    sortStudents(sortBy, algorithm);
                } else {
                    printOutput('Usage: sort <percentage|total|name|rollno> [bubble|selection|insertion]', 'error');
                }
                break;
                
            case 'top':
                const count = args.length > 0 ? parseInt(args[0]) : 5;
                showTopPerformers(count);
                break;
                
            case 'stats':
            case 'statistics':
                showStatistics();
                break;
                
            case 'undo':
                undoLastOperation();
                break;
                
            case 'clear':
                if (args[0] === 'all') {
                    clearAllData();
                } else {
                    clearScreen();
                }
                break;
                
            case 'save':
                saveData();
                break;
                
            case 'load':
                loadData();
                break;
                
            case 'exit':
            case 'quit':
                printOutput('Thank you for using Student Result Processing System!', 'success');
                document.getElementById('commandInput').disabled = true;
                break;
                
            default:
                printOutput(`Unknown command: ${cmd}. Type 'help' for available commands.`, 'error');
        }
    } catch (error) {
        printOutput(`Error: ${error.message}`, 'error');
    }
}

// Print output to terminal
function printOutput(text, type = 'normal') {
    const output = document.getElementById('output');
    const div = document.createElement('div');
    div.className = `command-output ${type}`;
    div.innerHTML = text;
    output.appendChild(div);
    
    // Scroll to bottom
    const terminal = document.getElementById('terminal');
    terminal.scrollTop = terminal.scrollHeight;
}

// Show main menu
function showMenu() {
    const menuText = `
╔══════════════════════════════════════════════════════════════════╗
║                    STUDENT RESULT PROCESSING SYSTEM             ║
║                           MAIN MENU                             ║
╠══════════════════════════════════════════════════════════════════╣
║ 1. Student Records Management                                   ║
║    • add          - Add new student record                      ║
║    • delete <id>  - Delete student by roll number              ║
║    • update <id>  - Update student marks                       ║
║    • display      - Show all student records                   ║
║                                                                 ║
║ 2. Search Operations                                            ║
║    • search <query>     - Search by roll number                ║
║    • search name <name> - Search by student name               ║
║                                                                 ║
║ 3. Sorting & Analysis                                           ║
║    • sort <field> [algorithm] - Sort students                  ║
║      Fields: percentage, total, name, rollno                   ║
║      Algorithms: bubble, selection, insertion                  ║
║    • top [n]      - Show top N performers (default: 5)        ║
║    • stats        - Show system statistics                     ║
║                                                                 ║
║ 4. System Operations                                            ║
║    • undo         - Undo last operation                        ║
║    • save         - Save data to file                          ║
║    • load         - Load data from file                        ║
║    • clear        - Clear screen                               ║
║    • clear all    - Clear all data                             ║
║                                                                 ║
║ 5. Help & Exit                                                  ║
║    • help         - Show detailed help                         ║
║    • menu         - Show this menu                             ║
║    • exit         - Exit the system                            ║
╚══════════════════════════════════════════════════════════════════╝

Total Students: ${studentSystem.getAllStudents().length}
Undo Operations Available: ${studentSystem.undoStack.size()}

Enter command (Tab for auto-complete, ↑↓ for history):`;
    
    printOutput(menuText, 'info');
}

// Show help
function showHelp() {
    const helpText = `
STUDENT RESULT PROCESSING SYSTEM - HELP
========================================

DATA STRUCTURES USED:
• Linked List - Dynamic student record management
• Stack - Undo functionality with operation history
• Arrays - Temporary storage for sorting operations
• Search Algorithms - Linear and Binary search implementation

COMMAND SYNTAX:
• Commands are case-insensitive
• Use Tab for auto-completion
• Use ↑/↓ arrow keys for command history
• Most commands have short aliases (e.g., 'a' for 'add')

DETAILED COMMANDS:

Student Management:
  add                    - Opens form to add new student
  delete <roll_no>       - Delete student (e.g., delete 101)
  update <roll_no>       - Opens form to update student marks
  display / list / ls    - Show all students in table format

Search Operations:
  search <roll_no>       - Search by roll number (e.g., search 101)
  search name <name>     - Search by name (e.g., search name john)

Sorting (implemented algorithms):
  sort percentage bubble    - Sort by percentage using bubble sort
  sort total selection     - Sort by total marks using selection sort
  sort name insertion      - Sort by name using insertion sort
  sort rollno             - Sort by roll number (default: bubble sort)

Analysis:
  top                    - Show top 5 performers
  top 10                 - Show top 10 performers
  stats                  - Show detailed statistics

System:
  undo                   - Undo last add/delete/update operation
  save                   - Save current data to browser storage
  load                   - Reload data from browser storage
  clear                  - Clear terminal screen
  clear all              - Clear all student data (with confirmation)

GRADING SYSTEM:
A+ : 90-100%    A : 80-89%     B+ : 70-79%
B  : 60-69%     C : 50-59%     D  : 40-49%     F : Below 40%

SUBJECTS SUPPORTED:
Mathematics, Physics, Chemistry, English, Computer Science
(You can add marks for any subjects during student entry)

Type 'menu' to return to main menu.`;
    
    printOutput(helpText, 'info');
}

// Show add student form
function showAddStudentForm() {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>Add New Student</h2>
        <form id="addStudentForm">
            <div class="form-group">
                <label for="rollNo">Roll Number:</label>
                <input type="number" id="rollNo" name="rollNo" required min="1">
            </div>
            
            <div class="form-group">
                <label for="studentName">Student Name:</label>
                <input type="text" id="studentName" name="studentName" required>
            </div>
            
            <div class="form-group">
                <label for="mathematics">Mathematics (0-100):</label>
                <input type="number" id="mathematics" name="mathematics" required min="0" max="100">
            </div>
            
            <div class="form-group">
                <label for="physics">Physics (0-100):</label>
                <input type="number" id="physics" name="physics" required min="0" max="100">
            </div>
            
            <div class="form-group">
                <label for="chemistry">Chemistry (0-100):</label>
                <input type="number" id="chemistry" name="chemistry" required min="0" max="100">
            </div>
            
            <div class="form-group">
                <label for="english">English (0-100):</label>
                <input type="number" id="english" name="english" required min="0" max="100">
            </div>
            
            <div class="form-group">
                <label for="computer">Computer Science (0-100):</label>
                <input type="number" id="computer" name="computer" required min="0" max="100">
            </div>
            
            <div class="form-group">
                <button type="submit" class="btn btn-primary">Add Student</button>
                <button type="button" class="btn" onclick="closeModalWindow()">Cancel</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal').style.display = 'block';
    
    // Handle form submission
    document.getElementById('addStudentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const rollNo = parseInt(formData.get('rollNo'));
        const name = formData.get('studentName');
        const marks = {
            mathematics: parseInt(formData.get('mathematics')),
            physics: parseInt(formData.get('physics')),
            chemistry: parseInt(formData.get('chemistry')),
            english: parseInt(formData.get('english')),
            computer: parseInt(formData.get('computer'))
        };
        
        try {
            const student = studentSystem.addStudent(rollNo, name, marks);
            closeModalWindow();
            printOutput(`✓ Student added successfully!`, 'success');
            printOutput(`  Roll No: ${student.rollNo}`, 'info');
            printOutput(`  Name: ${student.name}`, 'info');
            printOutput(`  Total: ${student.total}/500`, 'info');
            printOutput(`  Percentage: ${student.percentage.toFixed(2)}%`, 'info');
            printOutput(`  Grade: ${student.grade}`, 'info');
        } catch (error) {
            printOutput(`Error adding student: ${error.message}`, 'error');
        }
    });
    
    // Focus on first input
    document.getElementById('rollNo').focus();
}

// Show update student form
function showUpdateStudentForm(rollNo) {
    const student = studentSystem.studentList.searchByRollNo(rollNo);
    if (!student) {
        printOutput(`Student with Roll No ${rollNo} not found!`, 'error');
        return;
    }
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h2>Update Student Marks</h2>
        <p><strong>Roll No:</strong> ${student.rollNo}</p>
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Current Grade:</strong> ${student.grade} (${student.percentage.toFixed(2)}%)</p>
        
        <form id="updateStudentForm">
            <div class="form-group">
                <label for="mathematics">Mathematics (current: ${student.marks.mathematics || 0}):</label>
                <input type="number" id="mathematics" name="mathematics" min="0" max="100" value="${student.marks.mathematics || 0}">
            </div>
            
            <div class="form-group">
                <label for="physics">Physics (current: ${student.marks.physics || 0}):</label>
                <input type="number" id="physics" name="physics" min="0" max="100" value="${student.marks.physics || 0}">
            </div>
            
            <div class="form-group">
                <label for="chemistry">Chemistry (current: ${student.marks.chemistry || 0}):</label>
                <input type="number" id="chemistry" name="chemistry" min="0" max="100" value="${student.marks.chemistry || 0}">
            </div>
            
            <div class="form-group">
                <label for="english">English (current: ${student.marks.english || 0}):</label>
                <input type="number" id="english" name="english" min="0" max="100" value="${student.marks.english || 0}">
            </div>
            
            <div class="form-group">
                <label for="computer">Computer Science (current: ${student.marks.computer || 0}):</label>
                <input type="number" id="computer" name="computer" min="0" max="100" value="${student.marks.computer || 0}">
            </div>
            
            <div class="form-group">
                <button type="submit" class="btn btn-primary">Update Marks</button>
                <button type="button" class="btn" onclick="closeModalWindow()">Cancel</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal').style.display = 'block';
    
    // Handle form submission
    document.getElementById('updateStudentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const newMarks = {
            mathematics: parseInt(formData.get('mathematics')),
            physics: parseInt(formData.get('physics')),
            chemistry: parseInt(formData.get('chemistry')),
            english: parseInt(formData.get('english')),
            computer: parseInt(formData.get('computer'))
        };
        
        try {
            const updatedStudent = studentSystem.updateStudent(rollNo, newMarks);
            closeModalWindow();
            printOutput(`✓ Student marks updated successfully!`, 'success');
            printOutput(`  Roll No: ${updatedStudent.rollNo}`, 'info');
            printOutput(`  Name: ${updatedStudent.name}`, 'info');
            printOutput(`  Total: ${updatedStudent.total}/500`, 'info');
            printOutput(`  Percentage: ${updatedStudent.percentage.toFixed(2)}%`, 'info');
            printOutput(`  Grade: ${updatedStudent.grade}`, 'info');
        } catch (error) {
            printOutput(`Error updating student: ${error.message}`, 'error');
        }
    });
}

// Delete student
function deleteStudent(rollNo) {
    try {
        const deletedStudent = studentSystem.deleteStudent(rollNo);
        printOutput(`✓ Student deleted successfully!`, 'success');
        printOutput(`  Roll No: ${deletedStudent.rollNo}`, 'info');
        printOutput(`  Name: ${deletedStudent.name}`, 'info');
        printOutput(`  Grade: ${deletedStudent.grade}`, 'info');
        printOutput(`Use 'undo' command to restore if needed.`, 'warning');
    } catch (error) {
        printOutput(`Error: ${error.message}`, 'error');
    }
}

// Display all students
function displayAllStudents() {
    const students = studentSystem.getAllStudents();
    
    if (students.length === 0) {
        printOutput('No students found. Use "add" command to add students.', 'warning');
        return;
    }
    
    // Create table
    let table = `
<table class="student-table">
    <tr>
        <th>Roll No</th>
        <th>Name</th>
        <th>Math</th>
        <th>Physics</th>
        <th>Chemistry</th>
        <th>English</th>
        <th>Computer</th>
        <th>Total</th>
        <th>Percentage</th>
        <th>Grade</th>
    </tr>`;
    
    students.forEach(student => {
        table += `
        <tr>
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${student.marks.mathematics || 0}</td>
            <td>${student.marks.physics || 0}</td>
            <td>${student.marks.chemistry || 0}</td>
            <td>${student.marks.english || 0}</td>
            <td>${student.marks.computer || 0}</td>
            <td>${student.total}</td>
            <td>${student.percentage.toFixed(2)}%</td>
            <td>${student.grade}</td>
        </tr>`;
    });
    
    table += '</table>';
    
    printOutput(`Found ${students.length} student(s):`, 'info');
    printOutput(table, 'normal');
}

// Search students
function searchStudents(query, searchType = 'rollno') {
    let results = [];
    
    if (searchType.toLowerCase() === 'name') {
        results = studentSystem.searchStudents(query, 'name');
    } else {
        results = studentSystem.searchStudents(query, 'rollNo');
    }
    
    if (results.length === 0) {
        printOutput(`No students found for query: "${query}"`, 'warning');
        return;
    }
    
    printOutput(`Search Results (${results.length} found):`, 'success');
    
    // Display results in table format
    let table = `
<table class="student-table">
    <tr>
        <th>Roll No</th>
        <th>Name</th>
        <th>Total</th>
        <th>Percentage</th>
        <th>Grade</th>
    </tr>`;
    
    results.forEach(student => {
        table += `
        <tr>
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${student.total}/500</td>
            <td>${student.percentage.toFixed(2)}%</td>
            <td>${student.grade}</td>
        </tr>`;
    });
    
    table += '</table>';
    printOutput(table, 'normal');
}

// Sort students
function sortStudents(sortBy = 'percentage', algorithm = 'bubble') {
    const validSortFields = ['percentage', 'total', 'name', 'rollno'];
    const validAlgorithms = ['bubble', 'selection', 'insertion'];
    
    if (!validSortFields.includes(sortBy.toLowerCase())) {
        printOutput(`Invalid sort field: ${sortBy}. Valid options: ${validSortFields.join(', ')}`, 'error');
        return;
    }
    
    if (!validAlgorithms.includes(algorithm.toLowerCase())) {
        printOutput(`Invalid algorithm: ${algorithm}. Valid options: ${validAlgorithms.join(', ')}`, 'error');
        return;
    }
    
    const startTime = performance.now();
    const sortedStudents = studentSystem.getSortedStudents(sortBy.toLowerCase(), algorithm.toLowerCase(), false);
    const endTime = performance.now();
    
    if (sortedStudents.length === 0) {
        printOutput('No students to sort.', 'warning');
        return;
    }
    
    printOutput(`✓ Students sorted by ${sortBy} using ${algorithm} sort algorithm`, 'success');
    printOutput(`  Algorithm executed in ${(endTime - startTime).toFixed(2)}ms`, 'info');
    printOutput(`  Total comparisons: O(n²) for ${sortedStudents.length} records`, 'info');
    
    // Display sorted results
    let table = `
<table class="student-table">
    <tr>
        <th>Rank</th>
        <th>Roll No</th>
        <th>Name</th>
        <th>Total</th>
        <th>Percentage</th>
        <th>Grade</th>
    </tr>`;
    
    sortedStudents.forEach((student, index) => {
        table += `
        <tr>
            <td>${index + 1}</td>
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${student.total}/500</td>
            <td>${student.percentage.toFixed(2)}%</td>
            <td>${student.grade}</td>
        </tr>`;
    });
    
    table += '</table>';
    printOutput(table, 'normal');
}

// Show top performers
function showTopPerformers(count = 5) {
    const topStudents = studentSystem.getTopPerformers(count);
    
    if (topStudents.length === 0) {
        printOutput('No students found.', 'warning');
        return;
    }
    
    printOutput(`🏆 Top ${Math.min(count, topStudents.length)} Performers:`, 'success');
    
    let table = `
<table class="student-table">
    <tr>
        <th>Rank</th>
        <th>Roll No</th>
        <th>Name</th>
        <th>Percentage</th>
        <th>Grade</th>
        <th>Total Marks</th>
    </tr>`;
    
    topStudents.forEach((student, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        table += `
        <tr>
            <td>${medal} ${index + 1}</td>
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${student.percentage.toFixed(2)}%</td>
            <td>${student.grade}</td>
            <td>${student.total}/500</td>
        </tr>`;
    });
    
    table += '</table>';
    printOutput(table, 'normal');
}

// Show statistics
function showStatistics() {
    const stats = studentSystem.getStatistics();
    
    if (stats.totalStudents === 0) {
        printOutput('No students found to generate statistics.', 'warning');
        return;
    }
    
    const statsText = `
📊 SYSTEM STATISTICS
===================
Total Students: ${stats.totalStudents}
Average Percentage: ${stats.averagePercentage.toFixed(2)}%
Highest Percentage: ${stats.highestPercentage.toFixed(2)}%
Lowest Percentage: ${stats.lowestPercentage.toFixed(2)}%

📈 GRADE DISTRIBUTION:
---------------------`;
    
    printOutput(statsText, 'info');
    
    // Grade distribution table
    let gradeTable = `
<table class="student-table">
    <tr>
        <th>Grade</th>
        <th>Count</th>
        <th>Percentage</th>
        <th>Range</th>
    </tr>`;
    
    const gradeRanges = {
        'A+': '90-100%',
        'A': '80-89%',
        'B+': '70-79%',
        'B': '60-69%',
        'C': '50-59%',
        'D': '40-49%',
        'F': 'Below 40%'
    };
    
    Object.entries(gradeRanges).forEach(([grade, range]) => {
        const count = stats.gradeDistribution[grade] || 0;
        const percentage = ((count / stats.totalStudents) * 100).toFixed(1);
        gradeTable += `
        <tr>
            <td>${grade}</td>
            <td>${count}</td>
            <td>${percentage}%</td>
            <td>${range}</td>
        </tr>`;
    });
    
    gradeTable += '</table>';
    printOutput(gradeTable, 'normal');
    
    // Additional statistics
    const additionalStats = `
🔍 DATA STRUCTURE INFORMATION:
-----------------------------
Linked List Size: ${studentSystem.studentList.getSize()} nodes
Undo Stack Size: ${studentSystem.undoStack.size()} operations
Memory Usage: Dynamic allocation using JavaScript objects
Search Complexity: O(n) for linear search, O(log n) for binary search
Sort Complexity: O(n²) for bubble/selection/insertion sort

📁 STORAGE INFORMATION:
----------------------
Data Storage: Browser localStorage
Auto-save: Enabled after each operation
File Operations: Save/Load functionality available`;
    
    printOutput(additionalStats, 'info');
}

// Undo last operation
function undoLastOperation() {
    try {
        const operation = studentSystem.undoLastOperation();
        printOutput(`✓ Successfully undone ${operation.type} operation`, 'success');
        printOutput(`  Operation performed at: ${new Date(operation.timestamp).toLocaleString()}`, 'info');
        
        switch (operation.type) {
            case 'ADD':
                printOutput(`  Removed student: ${operation.data.name} (Roll No: ${operation.data.rollNo})`, 'info');
                break;
            case 'DELETE':
                printOutput(`  Restored student: ${operation.data.name} (Roll No: ${operation.data.rollNo})`, 'info');
                break;
            case 'UPDATE':
                printOutput(`  Reverted marks for Roll No: ${operation.data.rollNo}`, 'info');
                break;
        }
        
        printOutput(`Remaining undo operations: ${studentSystem.undoStack.size()}`, 'warning');
    } catch (error) {
        printOutput(`Error: ${error.message}`, 'error');
    }
}

// Clear screen
function clearScreen() {
    const output = document.getElementById('output');
    const welcomeText = output.querySelector('.welcome-text');
    output.innerHTML = '';
    if (welcomeText) {
        output.appendChild(welcomeText);
    }
    printOutput('Screen cleared. Type "menu" to show main menu.', 'info');
}

// Clear all data
function clearAllData() {
    const confirmed = confirm('⚠️ WARNING: This will delete all student records and cannot be undone!\n\nAre you sure you want to continue?');
    
    if (confirmed) {
        studentSystem.clearAllData();
        printOutput('✓ All student data has been cleared.', 'success');
        printOutput('  - All student records deleted', 'info');
        printOutput('  - Undo history cleared', 'info');
        printOutput('  - Local storage cleared', 'info');
        printOutput('Use "add" command to start adding new students.', 'warning');
    } else {
        printOutput('Operation cancelled.', 'warning');
    }
}

// Save data
function saveData() {
    try {
        studentSystem.saveData();
        printOutput('✓ Data saved successfully to browser storage.', 'success');
        printOutput(`  Saved ${studentSystem.getAllStudents().length} student records`, 'info');
        printOutput(`  Saved ${studentSystem.undoStack.size()} undo operations`, 'info');
    } catch (error) {
        printOutput(`Error saving data: ${error.message}`, 'error');
    }
}

// Load data
function loadData() {
    try {
        const oldCount = studentSystem.getAllStudents().length;
        studentSystem.loadData();
        const newCount = studentSystem.getAllStudents().length;
        
        printOutput('✓ Data loaded successfully from browser storage.', 'success');
        printOutput(`  Loaded ${newCount} student records`, 'info');
        
        if (newCount !== oldCount) {
            printOutput(`  Record count changed from ${oldCount} to ${newCount}`, 'warning');
        }
    } catch (error) {
        printOutput(`Error loading data: ${error.message}`, 'error');
    }
}

// Close modal window
function closeModalWindow() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('commandInput').focus();
}

// Utility function to format numbers
function formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
}

// Utility function to validate marks
function validateMarks(marks) {
    for (const [subject, mark] of Object.entries(marks)) {
        if (mark < 0 || mark > 100) {
            throw new Error(`Invalid marks for ${subject}: ${mark}. Marks must be between 0 and 100.`);
        }
    }
    return true;
}
