use school;


INSERT INTO classes
(className,subjects) VALUES
('First','[{"sub":"English","maxMarks":100}]'),
('Second','[{"sub":"English","maxMarks":100},{"sub":"Maths","maxMarks":100},{"sub":"EVS","maxMarks":100}]'),
('Third','[{"sub":"English","maxMarks":100},{"sub":"Maths","maxMarks":100},{"sub":"EVS","maxMarks":100},{"sub":"science","maxMarks":100},{"sub":"Social Study","maxMarks":200}]'),
('Forth','[{"sub":"English","maxMarks":100},{"sub":"Maths","maxMarks":100},{"sub":"science","maxMarks":100},{"sub":"Social Study","maxMarks":200},{"sub":"Yoga","maxMarks":50},{"sub":"Music","maxMarks":50}]');


INSERT INTO students
(firstName,lastName,phoneNumber,emailId,classId) VALUES
("Naman","Sanura","8828457724","namansanura@gmail.com",4),
("Napkor","Peter","9828457724","napkor@gmail.com",3),
("Alex","Baker","7828457724","baker@gmail.com",2),
("Bob","Reigh","4828457724","bob12@gmail.com",1),
("Rock","Carter","9928457724","carter21@gmail.com",4),
("Mark","Painter","8858457724","markpainter@gmail.com",3),
("Arena","carle","4828457724","carlearena@gmail.com",2),
("zack","geil","9428457724","geilzach12@gmail.com",1),
("Maria","Thomas","7828457724","thomasmaria@gmail.com",4),
("Thomas","Cook","7728457724","cookthomas@gmail.com",3),
("Jack","zuker","9028457724","zukerjack@gmail.com",2),
("peret","popper","8888457724","popperpeter@gmail.com",1);


INSERT INTO marksheets
(classId,studentId,marks) VALUES
(4,1,'[{"sub":"English","maxMarks":100,"marks":75},{"sub":"Maths","maxMarks":100,"marks":85},{"sub":"science","maxMarks":100,"marks":90},{"sub":"Social Study","maxMarks":200,"marks":85},{"sub":"Yoga","maxMarks":50,"marks":40},{"sub":"Music","maxMarks":50,"marks":38}]');
