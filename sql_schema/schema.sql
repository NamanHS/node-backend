CREATE DATABASE school;

use school;

CREATE TABLE classes(
    classId INTEGER AUTO_INCREMENT PRIMARY KEY,
    className VARCHAR(20) UNIQUE NOT NULL,
    subjects JSON
);


CREATE TABLE students (
    studentId INTEGER AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(20) NOT NULL,
    lastName VARCHAR(20) NOT NULL,
    phoneNumber VARCHAR(15) NOT NULL,
    emailId VARCHAR(50) NOT NULL,
    classId INTEGER NOT NULL,
    FOREIGN KEY(classId) REFERENCES classes(classId)
);


CREATE TABLE marksheets(
    marksheetId INTEGER AUTO_INCREMENT PRIMARY KEY,
    classId INTEGER NOT NULL,
    studentId INTEGER UNIQUE NOT NULL,
    marks JSON,
    FOREIGN KEY(classId) REFERENCES classes(classId) ON DELETE CASCADE,
    FOREIGN KEY(studentId) REFERENCES students(studentId) ON DELETE CASCADE
);