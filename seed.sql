-- Insert categories
INSERT INTO category (name, thumbnail, description, slug) VALUES 
('Mathematics', 'https://img.freepik.com/free-vector/mathematical-concepts-illustration_114360-4352.jpg', 'All math exams and resources', 'mathematics'),
('Physics', 'https://img.freepik.com/free-vector/physics-concept-illustration_114360-4284.jpg', 'Physics exams and study materials', 'physics'),
('Chemistry', 'https://img.freepik.com/free-vector/chemistry-concept-illustration_114360-4295.jpg', 'Chemistry practice exams', 'chemistry'),
('Biology', 'https://img.freepik.com/free-vector/biology-concept-illustration_114360-4301.jpg', 'Biology study resources', 'biology'),
('History', 'https://img.freepik.com/free-vector/history-concept-illustration_114360-4312.jpg', 'History exams and notes', 'history'),
('Geography', 'https://img.freepik.com/free-vector/geography-concept-illustration_114360-4323.jpg', 'Geography exams and maps', 'geography'),
('Computer Science', 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1887.jpg', 'Programming and CS exams', 'computer-science'),
('English', 'https://img.freepik.com/free-vector/language-concept-illustration_114360-4356.jpg', 'English literature and language', 'english');

-- Insert under_categories for Mathematics
INSERT INTO under_category (name, thumbnail, description, slug, category_id) VALUES
('Algebra', 'https://img.freepik.com/free-vector/algebra-concept_114360-4351.jpg', 'Algebra exercises and exams', 'algebra', 1),
('Calculus', 'https://img.freepik.com/free-vector/calculus-concept_114360-4340.jpg', 'Differential and integral calculus', 'calculus', 1),
('Geometry', 'https://img.freepik.com/free-vector/geometry-concept_114360-4337.jpg', '平面几何 and solid geometry', 'geometry', 1),
('Statistics', 'https://img.freepik.com/free-vector/statistics-concept_114360-4329.jpg', 'Probability and statistics', 'statistics', 1),
('Trigonometry', 'https://img.freepik.com/free-vector/trigonometry-concept_114360-4319.jpg', 'Trigonometry formulas and problems', 'trigonometry', 1);

-- Insert under_categories for Physics
INSERT INTO under_category (name, thumbnail, description, slug, category_id) VALUES
('Mechanics', 'https://img.freepik.com/free-vector/mechanics-concept_114360-4280.jpg', 'Classical mechanics', 'mechanics', 2),
('Electromagnetism', 'https://img.freepik.com/free-vector/electromagnetism-concept_114360-4275.jpg', 'Electricity and magnetism', 'electromagnetism', 2),
('Optics', 'https://img.freepik.com/free-vector/optics-concept_114360-4267.jpg', 'Light and optics', 'optics', 2),
('Thermodynamics', 'https://img.freepik.com/free-vector/thermodynamics-concept_114360-4259.jpg', 'Heat and thermodynamics', 'thermodynamics', 2),
('Waves', 'https://img.freepik.com/free-vector/waves-concept_114360-4251.jpg', 'Sound and wave physics', 'waves', 2);

-- Insert under_categories for Chemistry
INSERT INTO under_category (name, thumbnail, description, slug, category_id) VALUES
('Organic Chemistry', 'https://img.freepik.com/free-vector/organic-chemistry-concept_114360-4290.jpg', 'Organic compounds and reactions', 'organic-chemistry', 3),
('Inorganic Chemistry', 'https://img.freepik.com/free-vector/inorganic-chemistry-concept_114360-4285.jpg', 'Elements and compounds', 'inorganic-chemistry', 3),
('Physical Chemistry', 'https://img.freepik.com/free-vector/physical-chemistry-concept_114360-4278.jpg', 'Chemical thermodynamics', 'physical-chemistry', 3),
('Analytical Chemistry', 'https://img.freepik.com/free-vector/analytical-chemistry-concept_114360-4271.jpg', 'Chemical analysis methods', 'analytical-chemistry', 3);

-- Insert posts for Algebra
INSERT INTO post (name, thumbnail, description, slug, "underCategory_id") VALUES
('Algebra Basics Quiz', 'https://img.freepik.com/free-vector/math-quiz_114360-4350.jpg', 'Test your algebra basics', 'algebra-basics-quiz', 1),
('Linear Equations Practice', 'https://img.freepik.com/free-vector/linear-equations_114360-4348.jpg', 'Practice linear equations', 'linear-equations-practice', 1),
('Quadratic Functions Exam', 'https://img.freepik.com/free-vector/quadratic-functions_114360-4346.jpg', 'Quadratic functions test', 'quadratic-functions-exam', 1),
('Polynomials Worksheet', 'https://img.freepik.com/free-vector/polynomials_114360-4344.jpg', 'Polynomial exercises', 'polynomials-worksheet', 1),
('Factorization Practice', 'https://img.freepik.com/free-vector/factorization_114360-4342.jpg', 'Learn factorization', 'factorization-practice', 1);

-- Insert posts for Calculus
INSERT INTO post (name, thumbnail, description, slug, "underCategory_id") VALUES
('Derivatives Quiz', 'https://img.freepik.com/free-vector/derivatives_114360-4335.jpg', 'Test your derivatives', 'derivatives-quiz', 2),
('Integrals Practice Exam', 'https://img.freepik.com/free-vector/integrals_114360-4333.jpg', 'Integration practice', 'integrals-practice-exam', 2),
('Limits and Continuity', 'https://img.freepik.com/free-vector/limits_114360-4331.jpg', 'Limits and continuity test', 'limits-and-continuity', 2),
('Differential Equations', 'https://img.freepik.com/free-vector/differential-equations_114360-4329.jpg', 'Differential equations solved', 'differential-equations', 2);

-- Insert posts for Geometry
INSERT INTO post (name, thumbnail, description, slug, "underCategory_id") VALUES
('2D Geometry Test', 'https://img.freepik.com/free-vector/2d-geometry_114360-4332.jpg', 'Two-dimensional geometry', '2d-geometry-test', 3),
('3D Geometry Quiz', 'https://img.freepik.com/free-vector/3d-geometry_114360-4330.jpg', 'Three-dimensional shapes', '3d-geometry-quiz', 3),
('Circles and Angles', 'https://img.freepik.com/free-vector/circles-angles_114360-4328.jpg', 'Circle theorems', 'circles-and-angles', 3),
('Triangle Properties', 'https://img.freepik.com/free-vector/triangles_114360-4326.jpg', 'Triangle exercises', 'triangle-properties', 3);

-- Insert posts for Mechanics
INSERT INTO post (name, thumbnail, description, slug, "underCategory_id") VALUES
('Newton Laws Quiz', 'https://img.freepik.com/free-vector/newton-laws_114360-4275.jpg', 'Test Newton laws', 'newton-laws-quiz', 6),
('Kinematics Practice', 'https://img.freepik.com/free-vector/kinematics_114360-4273.jpg', 'Motion calculations', 'kinematics-practice', 6),
('Work and Energy', 'https://img.freepik.com/free-vector/work-energy_114360-4271.jpg', 'Work and energy exam', 'work-and-energy', 6),
('Momentum Problems', 'https://img.freepik.com/free-vector/momentum_114360-4269.jpg', 'Conservation of momentum', 'momentum-problems', 6);

-- Insert post_details for Algebra Basics Quiz
INSERT INTO post_details (name, thumbnail, description, slug, post_id) VALUES
('Algebra Basics Part 1', 'https://img.freepik.com/free-vector/math-quiz-part1_114360-4350.jpg', 'Introduction to algebra', 'algebra-basics-part-1', 1),
('Algebra Basics Part 2', 'https://img.freepik.com/free-vector/math-quiz-part2_114360-4349.jpg', 'Variables and expressions', 'algebra-basics-part-2', 1);

-- Insert post_details for Derivatives Quiz
INSERT INTO post_details (name, thumbnail, description, slug, post_id) VALUES
('Derivatives Part 1', 'https://img.freepik.com/free-vector/derivatives-part1_114360-4335.jpg', 'Basic derivatives', 'derivatives-part-1', 6),
('Derivatives Part 2', 'https://img.freepik.com/free-vector/derivatives-part2_114360-4334.jpg', 'Chain rule', 'derivatives-part-2', 6);

-- Insert post_details for Newton Laws Quiz
INSERT INTO post_details (name, thumbnail, description, slug, post_id) VALUES
('Newton Laws Part 1', 'https://img.freepik.com/free-vector/newton-part1_114360-4275.jpg', 'First law explanation', 'newton-laws-part-1', 16),
('Newton Laws Part 2', 'https://img.freepik.com/free-vector/newton-part2_114360-4274.jpg', 'Second and third law', 'newton-laws-part-2', 16);