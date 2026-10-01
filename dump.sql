--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Category" VALUES (1, 'Algebra', '/images/algebra.png', 'Learn the basics and advanced concepts of Algebra.', 'algebra');
INSERT INTO public."Category" VALUES (2, 'Calculus', '/images/calculus.png', 'Master limits, derivatives, and integrals.', 'calculus');
INSERT INTO public."Category" VALUES (3, 'Geometry', '/images/geometry.png', 'Explore shapes, sizes, and properties of space.', 'geometry');
INSERT INTO public."Category" VALUES (4, 'Trigonometry', '/images/trigonometry.png', 'Study relationships involving lengths and angles of triangles.', 'trigonometry');


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Post" VALUES (1, 'Solving Linear Equations', 'Here is a step by step guide to solving linear equations...', 'solving-linear-equations', 1);
INSERT INTO public."Post" VALUES (2, 'Understanding Matrices', 'Matrices are fundamental in linear algebra...', 'understanding-matrices', 1);
INSERT INTO public."Post" VALUES (3, 'Group Theory Basics', 'An introduction to group theory in abstract algebra...', 'group-theory-basics', 1);
INSERT INTO public."Post" VALUES (4, 'Introduction to Limits', 'Limits are the foundation of calculus...', 'intro-to-limits', 2);
INSERT INTO public."Post" VALUES (5, 'Derivatives Explained', 'How to find the rate of change of a function...', 'derivatives-explained', 2);
INSERT INTO public."Post" VALUES (6, 'Integration by Parts', 'A powerful technique for finding complex integrals...', 'integration-by-parts', 2);
INSERT INTO public."Post" VALUES (7, 'Area of a Circle Proof', 'Proving the area of a circle using geometry...', 'area-of-circle-proof', 3);
INSERT INTO public."Post" VALUES (8, 'Pythagorean Theorem', 'Understanding the most famous theorem in geometry...', 'pythagorean-theorem', 3);
INSERT INTO public."Post" VALUES (9, 'Properties of Triangles', 'Classifying triangles by sides and angles...', 'properties-of-triangles', 3);
INSERT INTO public."Post" VALUES (10, 'Sine, Cosine, and Tangent', 'The primary trigonometric functions explained clearly...', 'sine-cosine-tangent', 4);
INSERT INTO public."Post" VALUES (11, 'Trigonometric Identities', 'A complete cheat sheet for all major trig identities...', 'trigonometric-identities', 4);
INSERT INTO public."Post" VALUES (12, 'Unit Circle Mastery', 'How to easily memorize and use the unit circle...', 'unit-circle-mastery', 4);


--
-- Data for Name: PostDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PostDetails" VALUES (1, 'Fichier PDF Test', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Un PDF de démonstration', 'solving-linear-equations-pdf', 1, '2026-09-05 02:17:28.108616', '2026-09-05 02:17:28.108616');
INSERT INTO public."PostDetails" VALUES (2, 'Fichier PDF Test', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Un PDF de démonstration', 'understanding-matrices-pdf', 2, '2026-09-05 02:17:28.108616', '2026-09-05 02:17:28.108616');
INSERT INTO public."PostDetails" VALUES (3, 'Fichier PDF Test', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Un PDF de démonstration', 'group-theory-basics-pdf', 3, '2026-09-05 02:17:28.108616', '2026-09-05 02:17:28.108616');
INSERT INTO public."PostDetails" VALUES (4, 'Fichier PDF Test', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Un PDF de démonstration', 'intro-to-limits-pdf', 4, '2026-09-05 02:17:28.108616', '2026-09-05 02:17:28.108616');
INSERT INTO public."PostDetails" VALUES (5, 'Fichier PDF Test', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Un PDF de démonstration', 'derivatives-explained-pdf', 5, '2026-09-05 02:17:28.108616', '2026-09-05 02:17:28.108616');
INSERT INTO public."PostDetails" VALUES (6, 'Fichier PDF Test', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Un PDF de démonstration', 'integration-by-parts-pdf', 6, '2026-09-05 02:17:28.108616', '2026-09-05 02:17:28.108616');
INSERT INTO public."PostDetails" VALUES (7, 'Fichier PDF Test', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Un PDF de démonstration', 'area-of-circle-proof-pdf', 7, '2026-09-05 02:17:28.108616', '2026-09-05 02:17:28.108616');
INSERT INTO public."PostDetails" VALUES (8, 'Fichier PDF Test', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Un PDF de démonstration', 'pythagorean-theorem-pdf', 8, '2026-09-05 02:17:28.108616', '2026-09-05 02:17:28.108616');
INSERT INTO public."PostDetails" VALUES (9, 'Fichier PDF Test', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Un PDF de démonstration', 'properties-of-triangles-pdf', 9, '2026-09-05 02:17:28.108616', '2026-09-05 02:17:28.108616');
INSERT INTO public."PostDetails" VALUES (10, 'Fichier PDF Test', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Un PDF de démonstration', 'sine-cosine-tangent-pdf', 10, '2026-09-05 02:17:28.108616', '2026-09-05 02:17:28.108616');
INSERT INTO public."PostDetails" VALUES (11, 'Fichier PDF Test', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Un PDF de démonstration', 'trigonometric-identities-pdf', 11, '2026-09-05 02:17:28.108616', '2026-09-05 02:17:28.108616');
INSERT INTO public."PostDetails" VALUES (12, 'Fichier PDF Test', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Un PDF de démonstration', 'unit-circle-mastery-pdf', 12, '2026-09-05 02:17:28.108616', '2026-09-05 02:17:28.108616');


--
-- Data for Name: UnderCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."UnderCategory" VALUES (1, 'Linear Algebra', 'linear-algebra', 1);
INSERT INTO public."UnderCategory" VALUES (2, 'Abstract Algebra', 'abstract-algebra', 1);
INSERT INTO public."UnderCategory" VALUES (3, 'Differential Calculus', 'differential-calculus', 2);
INSERT INTO public."UnderCategory" VALUES (4, 'Integral Calculus', 'integral-calculus', 2);
INSERT INTO public."UnderCategory" VALUES (5, 'Euclidean Geometry', 'euclidean-geometry', 3);
INSERT INTO public."UnderCategory" VALUES (6, 'Analytic Geometry', 'analytic-geometry', 3);
INSERT INTO public."UnderCategory" VALUES (7, 'Basic Trigonometry', 'basic-trigonometry', 4);
INSERT INTO public."UnderCategory" VALUES (8, 'Advanced Trigonometry', 'advanced-trigonometry', 4);


--
-- Data for Name: levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.levels VALUES ('tronc-commun', 'Tronc Commun', '📐');
INSERT INTO public.levels VALUES ('1bac', '1ère Année Bac', '📊');
INSERT INTO public.levels VALUES ('2bac', '2ème Année Bac', '🚀');


--
-- Data for Name: semesters; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.semesters VALUES ('tc-s1', 'tronc-commun', '1er Semestre', 1);
INSERT INTO public.semesters VALUES ('tc-s2', 'tronc-commun', '2ème Semestre', 2);
INSERT INTO public.semesters VALUES ('1bac-s1', '1bac', '1er Semestre', 1);
INSERT INTO public.semesters VALUES ('2bac-s1', '2bac', '1er Semestre', 1);


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.courses VALUES ('tc-c1', 'tc-s1', 'Arithmétique dans IN', '/postdetails/arithmetique', '/exercices/tc/arithmetique', 1);
INSERT INTO public.courses VALUES ('tc-c2', 'tc-s1', 'Calcul vectoriel dans le plan', '/postdetails/vecteurs', '/exercices/tc/vecteurs', 2);
INSERT INTO public.courses VALUES ('tc-c3', 'tc-s1', 'Généralités sur les fonctions', '/postdetails/fonctions', '/exercices/tc/fonctions', 3);
INSERT INTO public.courses VALUES ('tc-c4', 'tc-s2', 'Géométrie dans l''espace', '/postdetails/geometrie', '/exercices/tc/geometrie', 1);
INSERT INTO public.courses VALUES ('tc-c5', 'tc-s2', 'Statistiques', '/postdetails/statistiques', '/exercices/tc/statistiques', 2);
INSERT INTO public.courses VALUES ('1b-c1', '1bac-s1', 'La logique mathématique', '/postdetails/logique', '/exercices/1bac/logique', 1);
INSERT INTO public.courses VALUES ('1b-c2', '1bac-s1', 'Le barycentre dans le plan', '/postdetails/barycentre', '/exercices/1bac/barycentre', 2);


--
-- Data for Name: exam_event; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.exam_event VALUES (1, 'BAC National — Session Normale 2026', '2026-06-02', NULL, '2026-06-05', 'examen_national', '2bac', '2ème BAC', 'Examen du Baccalauréat session normale — mathématiques', NULL, NULL, NULL, true, '2026-08-31 17:23:42.306331', '2026-08-31 17:23:42.306331');
INSERT INTO public.exam_event VALUES (2, 'BAC National — Session Rattrapage 2026', '2026-07-07', NULL, '2026-07-08', 'examen_national', '2bac', '2ème BAC', 'Session de rattrapage du Baccalauréat', NULL, NULL, NULL, true, '2026-08-31 17:23:42.306331', '2026-08-31 17:23:42.306331');
INSERT INTO public.exam_event VALUES (3, 'Examens Régionaux 1ère BAC S1', '2026-01-19', NULL, '2026-01-21', 'examen_regional', '1bac', '1ère BAC', 'Examens régionaux du premier semestre', NULL, NULL, NULL, true, '2026-08-31 17:23:42.306331', '2026-08-31 17:23:42.306331');
INSERT INTO public.exam_event VALUES (4, 'Examens Régionaux 1ère BAC S2', '2026-05-11', NULL, '2026-05-13', 'examen_regional', '1bac', '1ère BAC', 'Examens régionaux du second semestre', NULL, NULL, NULL, true, '2026-08-31 17:23:42.306331', '2026-08-31 17:23:42.306331');
INSERT INTO public.exam_event VALUES (5, 'Examens Régionaux 2ème BAC S1', '2026-01-22', NULL, '2026-01-24', 'examen_regional', '2bac', '2ème BAC', 'Examens régionaux du premier semestre', NULL, NULL, NULL, true, '2026-08-31 17:23:42.306331', '2026-08-31 17:23:42.306331');
INSERT INTO public.exam_event VALUES (6, 'Concours ENSA / ENSA 2026', '2026-07-15', NULL, NULL, 'concours', 'concours', 'Concours Post-BAC', 'Concours d''entrée aux Écoles Nationales des Sciences Appliquées', NULL, NULL, NULL, true, '2026-08-31 17:23:42.306331', '2026-08-31 17:23:42.306331');
INSERT INTO public.exam_event VALUES (7, 'Concours CNC 2026', '2026-07-20', NULL, '2026-07-22', 'concours', 'concours', 'Concours Post-BAC', 'Concours National Commun — Classes Préparatoires', NULL, NULL, NULL, true, '2026-08-31 17:23:42.306331', '2026-08-31 17:23:42.306331');
INSERT INTO public.exam_event VALUES (8, 'Concours ENCG 2026', '2026-07-25', NULL, NULL, 'concours', 'concours', 'Concours Post-BAC', 'Concours d''entrée aux Écoles Nationales de Commerce et de Gestion', NULL, NULL, NULL, true, '2026-08-31 17:23:42.306331', '2026-08-31 17:23:42.306331');


--
-- Data for Name: live_session; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'admin@example.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Admin', 'admin', '2026-04-19 03:25:16.950913');
INSERT INTO public.users VALUES (2, 'ennaouri.mohammed@gmail.com', '$2b$10$tnjQ3JpIEeBmr3OzmhlLHug2VtZ6BGlCt1tp4wuo6o93MlcuvxyQa', 'Admin', 'admin', '2026-04-20 22:56:34.311395');


--
-- Data for Name: live_notification; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: quiz; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: quiz_attempt; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: quiz_question; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 4, true);


--
-- Name: PostDetails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PostDetails_id_seq"', 12, true);


--
-- Name: Post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Post_id_seq"', 12, true);


--
-- Name: UnderCategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UnderCategory_id_seq"', 8, true);


--
-- Name: exam_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exam_event_id_seq', 8, true);


--
-- Name: live_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.live_notification_id_seq', 1, false);


--
-- Name: live_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.live_session_id_seq', 1, false);


--
-- Name: quiz_attempt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quiz_attempt_id_seq', 1, false);


--
-- Name: quiz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quiz_id_seq', 1, false);


--
-- Name: quiz_question_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quiz_question_id_seq', 1, false);


--
-- Name: user_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_progress_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

