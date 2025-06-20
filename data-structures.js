/**
 * Student Result Processing System - Data Structures Implementation
 * Core data structures: Linked List, Stack, Arrays with sorting and searching
 */

// Node class for Linked List
class StudentNode {
    constructor(rollNo, name, marks) {
        this.rollNo = rollNo;
        this.name = name;
        this.marks = marks; // Object with subject marks
        this.total = 0;
        this.percentage = 0;
        this.grade = '';
        this.next = null;
        this.calculateResults();
    }

    calculateResults() {
        // Calculate total marks
        this.total = Object.values(this.marks).reduce((sum, mark) => sum + mark, 0);
        
        // Calculate percentage (assuming max marks per subject is 100)
        const numSubjects = Object.keys(this.marks).length;
        this.percentage = (this.total / (numSubjects * 100)) * 100;
        
        // Assign grade
        this.grade = this.calculateGrade(this.percentage);
    }

    calculateGrade(percentage) {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C';
        if (percentage >= 40) return 'D';
        return 'F';
    }
}

// Linked List implementation for Student Records
class StudentLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // Add student to the beginning of the list
    addStudent(rollNo, name, marks) {
        const newStudent = new StudentNode(rollNo, name, marks);
        
        // Check for duplicate roll number
        if (this.searchByRollNo(rollNo)) {
            throw new Error(`Student with Roll No ${rollNo} already exists!`);
        }
        
        newStudent.next = this.head;
        this.head = newStudent;
        this.size++;
        return newStudent;
    }

    // Delete student by roll number
    deleteStudent(rollNo) {
        if (!this.head) {
            throw new Error("No students found!");
        }

        // If head node is to be deleted
        if (this.head.rollNo === rollNo) {
            const deletedStudent = this.head;
            this.head = this.head.next;
            this.size--;
            return deletedStudent;
        }

        let current = this.head;
        while (current.next && current.next.rollNo !== rollNo) {
            current = current.next;
        }

        if (!current.next) {
            throw new Error(`Student with Roll No ${rollNo} not found!`);
        }

        const deletedStudent = current.next;
        current.next = current.next.next;
        this.size--;
        return deletedStudent;
    }

    // Update student marks
    updateStudent(rollNo, newMarks) {
        const student = this.searchByRollNo(rollNo);
        if (!student) {
            throw new Error(`Student with Roll No ${rollNo} not found!`);
        }

        const oldMarks = { ...student.marks };
        student.marks = { ...student.marks, ...newMarks };
        student.calculateResults();
        
        return { student, oldMarks };
    }

    // Linear search by roll number
    searchByRollNo(rollNo) {
        let current = this.head;
        while (current) {
            if (current.rollNo === rollNo) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    // Linear search by name (case-insensitive)
    searchByName(name) {
        const results = [];
        let current = this.head;
        const searchName = name.toLowerCase();
        
        while (current) {
            if (current.name.toLowerCase().includes(searchName)) {
                results.push(current);
            }
            current = current.next;
        }
        return results;
    }

    // Convert linked list to array for sorting
    toArray() {
        const students = [];
        let current = this.head;
        while (current) {
            students.push(current);
            current = current.next;
        }
        return students;
    }

    // Get all students
    getAllStudents() {
        return this.toArray();
    }

    // Get student count
    getSize() {
        return this.size;
    }

    // Clear all students
    clear() {
        this.head = null;
        this.size = 0;
    }
}

// Stack implementation for Undo functionality
class UndoStack {
    constructor(maxSize = 50) {
        this.stack = [];
        this.maxSize = maxSize;
    }

    // Push operation to stack
    push(operation) {
        if (this.stack.length >= this.maxSize) {
            this.stack.shift(); // Remove oldest operation
        }
        this.stack.push({
            ...operation,
            timestamp: new Date().toISOString()
        });
    }

    // Pop operation from stack
    pop() {
        if (this.isEmpty()) {
            throw new Error("No operations to undo!");
        }
        return this.stack.pop();
    }

    // Check if stack is empty
    isEmpty() {
        return this.stack.length === 0;
    }

    // Get stack size
    size() {
        return this.stack.length;
    }

    // Peek at top operation without removing
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.stack[this.stack.length - 1];
    }

    // Clear all operations
    clear() {
        this.stack = [];
    }
}

// Sorting Algorithms
class SortingAlgorithms {
    // Bubble Sort - O(n²) time complexity
    static bubbleSort(arr, compareFunction) {
        const n = arr.length;
        const sortedArr = [...arr]; // Create a copy
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (compareFunction(sortedArr[j], sortedArr[j + 1]) > 0) {
                    // Swap elements
                    [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]];
                }
            }
        }
        return sortedArr;
    }

    // Selection Sort - O(n²) time complexity
    static selectionSort(arr, compareFunction) {
        const n = arr.length;
        const sortedArr = [...arr]; // Create a copy
        
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                if (compareFunction(sortedArr[j], sortedArr[minIndex]) < 0) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                [sortedArr[i], sortedArr[minIndex]] = [sortedArr[minIndex], sortedArr[i]];
            }
        }
        return sortedArr;
    }

    // Insertion Sort - O(n²) time complexity, but efficient for small datasets
    static insertionSort(arr, compareFunction) {
        const n = arr.length;
        const sortedArr = [...arr]; // Create a copy
        
        for (let i = 1; i < n; i++) {
            const key = sortedArr[i];
            let j = i - 1;
            
            while (j >= 0 && compareFunction(sortedArr[j], key) > 0) {
                sortedArr[j + 1] = sortedArr[j];
                j--;
            }
            sortedArr[j + 1] = key;
        }
        return sortedArr;
    }
}

// Search Algorithms
class SearchAlgorithms {
    // Linear Search - O(n) time complexity
    static linearSearch(arr, target, compareFunction) {
        for (let i = 0; i < arr.length; i++) {
            if (compareFunction(arr[i], target) === 0) {
                return i;
            }
        }
        return -1;
    }

    // Binary Search - O(log n) time complexity (requires sorted array)
    static binarySearch(arr, target, compareFunction) {
        let left = 0;
        let right = arr.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const comparison = compareFunction(arr[mid], target);
            
            if (comparison === 0) {
                return mid;
            } else if (comparison < 0) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
}

// File operations simulation using localStorage
class FileOperations {
    static saveToFile(data, filename = 'student_data') {
        try {
            localStorage.setItem(filename, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to file:', error);
            return false;
        }
    }

    static loadFromFile(filename = 'student_data') {
        try {
            const data = localStorage.getItem(filename);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from file:', error);
            return null;
        }
    }

    static deleteFile(filename = 'student_data') {
        try {
            localStorage.removeItem(filename);
            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
}

// Main Student Management System
class StudentManagementSystem {
    constructor() {
        this.studentList = new StudentLinkedList();
        this.undoStack = new UndoStack();
        this.loadData();
    }

    // Add new student
    addStudent(rollNo, name, marks) {
        try {
            const student = this.studentList.addStudent(rollNo, name, marks);
            
            // Push to undo stack
            this.undoStack.push({
                type: 'ADD',
                data: { rollNo, name, marks }
            });
            
            this.saveData();
            return student;
        } catch (error) {
            throw error;
        }
    }

    // Delete student
    deleteStudent(rollNo) {
        try {
            const deletedStudent = this.studentList.deleteStudent(rollNo);
            
            // Push to undo stack
            this.undoStack.push({
                type: 'DELETE',
                data: {
                    rollNo: deletedStudent.rollNo,
                    name: deletedStudent.name,
                    marks: deletedStudent.marks
                }
            });
            
            this.saveData();
            return deletedStudent;
        } catch (error) {
            throw error;
        }
    }

    // Update student
    updateStudent(rollNo, newMarks) {
        try {
            const result = this.studentList.updateStudent(rollNo, newMarks);
            
            // Push to undo stack
            this.undoStack.push({
                type: 'UPDATE',
                data: {
                    rollNo: rollNo,
                    oldMarks: result.oldMarks,
                    newMarks: newMarks
                }
            });
            
            this.saveData();
            return result.student;
        } catch (error) {
            throw error;
        }
    }

    // Undo last operation
    undoLastOperation() {
        try {
            const operation = this.undoStack.pop();
            
            switch (operation.type) {
                case 'ADD':
                    // Remove the added student
                    this.studentList.deleteStudent(operation.data.rollNo);
                    break;
                    
                case 'DELETE':
                    // Re-add the deleted student
                    this.studentList.addStudent(
                        operation.data.rollNo,
                        operation.data.name,
                        operation.data.marks
                    );
                    break;
                    
                case 'UPDATE':
                    // Restore old marks
                    this.studentList.updateStudent(
                        operation.data.rollNo,
                        operation.data.oldMarks
                    );
                    break;
            }
            
            this.saveData();
            return operation;
        } catch (error) {
            throw error;
        }
    }

    // Get sorted students
    getSortedStudents(sortBy = 'percentage', algorithm = 'bubble', ascending = false) {
        const students = this.studentList.toArray();
        
        const compareFunction = (a, b) => {
            let result = 0;
            switch (sortBy) {
                case 'rollNo':
                    result = a.rollNo - b.rollNo;
                    break;
                case 'name':
                    result = a.name.localeCompare(b.name);
                    break;
                case 'total':
                    result = a.total - b.total;
                    break;
                case 'percentage':
                default:
                    result = a.percentage - b.percentage;
                    break;
            }
            return ascending ? result : -result;
        };

        switch (algorithm) {
            case 'bubble':
                return SortingAlgorithms.bubbleSort(students, compareFunction);
            case 'selection':
                return SortingAlgorithms.selectionSort(students, compareFunction);
            case 'insertion':
                return SortingAlgorithms.insertionSort(students, compareFunction);
            default:
                return SortingAlgorithms.bubbleSort(students, compareFunction);
        }
    }

    // Get top N performers
    getTopPerformers(n = 5) {
        const sortedStudents = this.getSortedStudents('percentage', 'bubble', false);
        return sortedStudents.slice(0, n);
    }

    // Search functionality
    searchStudents(query, searchBy = 'rollNo') {
        if (searchBy === 'rollNo') {
            const student = this.studentList.searchByRollNo(parseInt(query));
            return student ? [student] : [];
        } else if (searchBy === 'name') {
            return this.studentList.searchByName(query);
        }
        return [];
    }

    // Get all students
    getAllStudents() {
        return this.studentList.getAllStudents();
    }

    // Get system statistics
    getStatistics() {
        const students = this.studentList.getAllStudents();
        if (students.length === 0) {
            return {
                totalStudents: 0,
                averagePercentage: 0,
                highestPercentage: 0,
                lowestPercentage: 0,
                gradeDistribution: {}
            };
        }

        const percentages = students.map(s => s.percentage);
        const grades = students.map(s => s.grade);
        
        const gradeDistribution = {};
        grades.forEach(grade => {
            gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
        });

        return {
            totalStudents: students.length,
            averagePercentage: percentages.reduce((sum, p) => sum + p, 0) / percentages.length,
            highestPercentage: Math.max(...percentages),
            lowestPercentage: Math.min(...percentages),
            gradeDistribution
        };
    }

    // Save data to localStorage
    saveData() {
        const data = {
            students: this.studentList.getAllStudents().map(student => ({
                rollNo: student.rollNo,
                name: student.name,
                marks: student.marks
            })),
            undoHistory: this.undoStack.stack
        };
        FileOperations.saveToFile(data);
    }

    // Load data from localStorage
    loadData() {
        const data = FileOperations.loadFromFile();
        if (data && data.students) {
            // Reconstruct the linked list
            data.students.forEach(studentData => {
                try {
                    this.studentList.addStudent(
                        studentData.rollNo,
                        studentData.name,
                        studentData.marks
                    );
                } catch (error) {
                    // Skip duplicate entries during load
                    console.warn(`Skipping duplicate student: ${studentData.rollNo}`);
                }
            });

            // Restore undo history
            if (data.undoHistory) {
                this.undoStack.stack = data.undoHistory;
            }
        }
    }

    // Clear all data
    clearAllData() {
        this.studentList.clear();
        this.undoStack.clear();
        FileOperations.deleteFile();
    }
}
