USE mother_teresa_erp;

INSERT IGNORE INTO branches (id, name, code, address, phone, email, country, currency, timezone)
VALUES (1, 'Dubai Main Branch', 'DXB-01', 'Dubai, United Arab Emirates', '+971 4 388 9200', 'admissions@mothertheresa.edu', 'United Arab Emirates', 'AED', 'Asia/Dubai');

INSERT IGNORE INTO roles (id, name, slug, description, is_system) VALUES
(1, 'Super Admin', 'super-admin', 'Full platform access', 1),
(2, 'Director / Management', 'management', 'Management dashboards and consolidated reports', 1),
(3, 'Branch Manager', 'branch-manager', 'Manage assigned branch', 1),
(4, 'Counsellor', 'counsellor', 'Lead counselling, student and admission workflows', 1),
(5, 'Telecaller', 'telecaller', 'Calling lists and lead follow-ups', 1),
(6, 'Admission Officer', 'admission-officer', 'Application processing', 1),
(7, 'Visa Officer', 'visa-officer', 'Visa case processing', 1),
(8, 'Accounts Staff', 'accounts', 'Finance and collections', 1),
(9, 'Website Content Manager', 'content-manager', 'CMS content publishing', 1),
(10, 'Student', 'student', 'Student self-service access', 1);

INSERT IGNORE INTO permissions (module, action, slug)
SELECT module_name, action_name, CONCAT(module_name, '.', action_name)
FROM (
  SELECT 'dashboard' module_name UNION ALL SELECT 'leads' UNION ALL SELECT 'students' UNION ALL
  SELECT 'applications' UNION ALL SELECT 'documents' UNION ALL SELECT 'visas' UNION ALL
  SELECT 'finance' UNION ALL SELECT 'tasks' UNION ALL SELECT 'reports' UNION ALL SELECT 'cms' UNION ALL
  SELECT 'settings' UNION ALL SELECT 'users' UNION ALL SELECT 'branches'
) modules
CROSS JOIN (
  SELECT 'view' action_name UNION ALL SELECT 'create' UNION ALL SELECT 'edit' UNION ALL
  SELECT 'delete' UNION ALL SELECT 'export' UNION ALL SELECT 'publish'
) actions;

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions WHERE module IN ('dashboard','leads','students','applications','documents','visas','tasks','reports') AND action IN ('view','create','edit','export');

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 9, id FROM permissions WHERE module = 'cms' AND action IN ('view','create','edit','publish');

INSERT IGNORE INTO users (id, branch_id, name, email, phone, password_hash, status)
VALUES (1, 1, 'Dr. Sarah Jenkins', 'counselor@mothertheresa.edu', '+971 50 555 0147', '$2y$10$ZkuVI7duYF0diH6Yalcowev/XX8WfFolI29RHbxeK0CIPiE02Moqu', 'active');

INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (1, 1), (1, 4), (1, 9);

INSERT IGNORE INTO employees (id, user_id, branch_id, employee_code, department, designation, joining_date, working_hours)
VALUES (1, 1, 1, 'MTEGT-EMP-001', 'Admissions', 'Senior Global Admissions Director', '2024-01-15', '09:00–18:00');

INSERT IGNORE INTO lead_sources (id, name, slug) VALUES
(1, 'Website', 'website'), (2, 'Landing Page', 'landing-page'), (3, 'Google Ads', 'google-ads'),
(4, 'Meta Ads', 'meta-ads'), (5, 'WhatsApp', 'whatsapp'), (6, 'Walk-in', 'walk-in'),
(7, 'Referral', 'referral'), (8, 'Educational Fair', 'educational-fair'), (9, 'Organic Search', 'organic-search'), (10, 'Other', 'other');

INSERT IGNORE INTO leads (id, lead_code, branch_id, source_id, assigned_user_id, full_name, mobile, whatsapp, email, preferred_country, preferred_course, preferred_intake, highest_qualification, priority, status, notes, created_at) VALUES
(1, 'MTEGT-L-2026-0001', 1, 1, 1, 'Fatima Al-Maktoum', '+971 52 443 1198', '+971 52 443 1198', 'fatima.m@example.com', 'United Kingdom', 'International Business', 'September 2027', 'Grade 12', 'high', 'New', 'Requested a counseling callback through the website.', '2026-08-12 09:15:00'),
(2, 'MTEGT-L-2026-0002', 1, 3, 1, 'Rohan Gupta', '+91 98765 43210', '+91 98765 43210', 'rohan.g@example.com', 'Germany', 'Biomedical Technology', 'October 2027', 'Bachelor''s', 'medium', 'Counselling Scheduled', 'Initial eligibility profile completed.', '2026-08-11 12:40:00'),
(3, 'MTEGT-L-2026-0003', 1, 7, 1, 'Emily Chen', '+1 416 555 0192', '+1 416 555 0192', 'emily.chen@example.com', 'United States', 'UI/UX Design', 'Fall 2027', 'Grade 12', 'urgent', 'Interested', 'Portfolio review required before shortlisting.', '2026-08-10 15:10:00'),
(4, 'MTEGT-L-2026-0004', 1, 5, 1, 'Arjun Menon', '+971 55 240 8820', '+971 55 240 8820', 'arjun.m@example.com', 'Canada', 'Data Analytics', 'January 2028', 'Bachelor''s', 'medium', 'Follow-up', 'Funding discussion scheduled.', '2026-08-09 10:25:00'),
(5, 'MTEGT-L-2026-0005', 1, 9, 1, 'Sara Khan', '+971 50 822 7710', '+971 50 822 7710', 'sara.k@example.com', 'Australia', 'Biotechnology', 'February 2028', 'Grade 12', 'medium', 'Registered', 'Converted after aptitude and counseling session.', '2026-08-08 14:30:00');

INSERT IGNORE INTO lead_status_history (lead_id, from_status, to_status, changed_by, notes, created_at) VALUES
(1, NULL, 'New', 1, 'Lead created from website.', '2026-08-12 09:15:00'),
(2, 'Contacted', 'Counselling Scheduled', 1, 'Video counseling confirmed.', '2026-08-12 10:10:00'),
(3, 'Contacted', 'Interested', 1, 'Student requested design program shortlist.', '2026-08-11 16:00:00');

INSERT IGNORE INTO followups (id, lead_id, assigned_user_id, followup_at, type, notes, next_action, status) VALUES
(1, 1, 1, '2026-08-12 16:00:00', 'call', 'First qualification call.', 'Schedule counseling if eligible.', 'pending'),
(2, 4, 1, '2026-08-13 11:00:00', 'whatsapp', 'Share fee comparison.', 'Confirm funding preference.', 'pending'),
(3, 2, 1, '2026-08-14 14:30:00', 'video_call', 'Academic eligibility review.', 'Prepare shortlist.', 'pending');

INSERT IGNORE INTO students (id, student_code, lead_id, branch_id, counselor_id, full_name, email, mobile, nationality, preferred_country, preferred_course, intake, journey_stage) VALUES
(1, 'MTEGT-2026-00001', 5, 1, 1, 'Sara Khan', 'sara.k@example.com', '+971 50 822 7710', 'Indian', 'Australia', 'Biotechnology', 'February 2028', 'Application'),
(2, 'MTEGT-2026-00002', NULL, 1, 1, 'Aarav Sharma', 'student@mothertheresa.edu', '+971 50 892 4112', 'Indian', 'Canada', 'Computer Science & AI', 'Fall 2027', 'Offer');

INSERT IGNORE INTO countries (id, name, iso_code, slug, short_description, average_tuition, cost_of_living, is_published) VALUES
(1, 'United Kingdom', 'GB', 'study-in-uk', 'Globally recognised degrees and diverse study pathways.', 'GBP 18,000–38,000/year', 'GBP 12,000–18,000/year', 1),
(2, 'Canada', 'CA', 'study-in-canada', 'Career-focused education and welcoming campuses.', 'CAD 20,000–45,000/year', 'CAD 15,000–22,000/year', 1),
(3, 'Australia', 'AU', 'study-in-australia', 'International programs with flexible study options.', 'AUD 24,000–48,000/year', 'AUD 21,000–29,000/year', 1),
(4, 'United States', 'US', 'study-in-usa', 'Broad academic choice and research opportunities.', 'USD 25,000–60,000/year', 'USD 14,000–24,000/year', 1),
(5, 'Germany', 'DE', 'study-in-germany', 'Applied learning, research, and value-focused routes.', 'EUR 3,000–25,000/year', 'EUR 11,000–15,000/year', 1),
(6, 'United Arab Emirates', 'AE', 'study-in-uae', 'International universities at a global crossroads.', 'AED 45,000–120,000/year', 'AED 36,000–70,000/year', 1);

INSERT IGNORE INTO universities (id, country_id, name, slug, city, ranking, partner_status, status) VALUES
(1, 2, 'University of Toronto', 'university-of-toronto', 'Toronto', 'Planning dataset — verify current ranking', 'prospect', 'active'),
(2, 4, 'Massachusetts Institute of Technology', 'massachusetts-institute-of-technology', 'Cambridge', 'Planning dataset — verify current ranking', 'non_partner', 'active'),
(3, 5, 'Technical University of Munich', 'technical-university-of-munich', 'Munich', 'Planning dataset — verify current ranking', 'prospect', 'active');

INSERT IGNORE INTO courses (id, university_id, name, slug, qualification_level, subject_area, duration, tuition_fee, minimum_percentage, ielts_requirement, status) VALUES
(1, 1, 'Computer Science and Artificial Intelligence', 'computer-science-ai', 'Bachelor', 'Computing & AI', '4 years', 48000, 80, '6.5', 'active'),
(2, 2, 'Data Science', 'data-science', 'Bachelor', 'Computing & AI', '4 years', 57500, 90, '7.0', 'active'),
(3, 3, 'Robotics and Artificial Intelligence', 'robotics-ai', 'Master', 'Engineering', '2 years', 6000, 75, '6.5', 'active');

INSERT IGNORE INTO intakes (id, name, start_date, status) VALUES
(1, 'Fall 2027', '2027-09-01', 'active'), (2, 'January 2028', '2028-01-10', 'active'), (3, 'February 2028', '2028-02-05', 'active');

INSERT IGNORE INTO applications (id, application_code, student_id, university_id, course_id, intake_id, assigned_user_id, status, submission_date, application_fee, notes) VALUES
(1, 'MTEGT-A-2026-0001', 2, 1, 1, 1, 1, 'University Processing', '2026-07-20', 180, 'Documents verified; awaiting university decision.'),
(2, 'MTEGT-A-2026-0002', 2, 2, 2, 1, 1, 'Submitted', '2026-08-01', 250, 'Submission acknowledgement received.'),
(3, 'MTEGT-A-2026-0003', 1, 3, 3, 3, 1, 'Documents Pending', NULL, 0, 'Transcript and language test pending.');

INSERT IGNORE INTO visas (id, student_id, country_id, assigned_user_id, visa_type, status) VALUES
(1, 2, 2, 1, 'Study Permit', 'Documentation');

INSERT IGNORE INTO tasks (id, branch_id, assigned_user_id, related_type, related_id, title, description, priority, due_at, status) VALUES
(1, 1, 1, 'lead', 1, 'Call new UK enquiry', 'Confirm academic profile and preferred intake.', 'urgent', '2026-08-12 16:00:00', 'pending'),
(2, 1, 1, 'application', 1, 'Check Toronto application update', 'Review portal for university correspondence.', 'high', '2026-08-13 10:00:00', 'in_progress'),
(3, 1, 1, 'student', 2, 'Verify financial documents', 'Review uploaded sponsor and bank documents.', 'medium', '2026-08-14 12:00:00', 'pending');

INSERT IGNORE INTO invoices (id, invoice_number, student_id, branch_id, issue_date, due_date, subtotal, total, paid, status) VALUES
(1, 'MTEGT-INV-2026-001', 2, 1, '2026-07-10', '2026-08-10', 6500, 6500, 4000, 'part_paid'),
(2, 'MTEGT-INV-2026-002', 1, 1, '2026-08-05', '2026-09-05', 4500, 4500, 1500, 'part_paid');

INSERT IGNORE INTO payments (id, receipt_number, invoice_id, student_id, branch_id, amount, currency, payment_method, transaction_reference, paid_at) VALUES
(1, 'MTEGT-RCP-2026-001', 1, 2, 1, 4000, 'AED', 'Bank', 'DEMO-BANK-7812', '2026-07-10 11:30:00'),
(2, 'MTEGT-RCP-2026-002', 2, 1, 1, 1500, 'AED', 'Card', 'DEMO-CARD-2241', '2026-08-05 15:20:00');

INSERT IGNORE INTO document_types (name, category, has_expiry) VALUES
('Passport', 'Identity', 1), ('Photograph', 'Identity', 0), ('Transcript', 'Academic', 0),
('Degree Certificate', 'Academic', 0), ('IELTS', 'Language', 1), ('PTE', 'Language', 1),
('Statement of Purpose', 'Application', 0), ('Letter of Recommendation', 'Application', 0),
('Offer Letter', 'Admission', 0), ('Visa', 'Visa', 1), ('Financial Document', 'Finance', 1), ('Other', 'Other', 0);

INSERT IGNORE INTO cms_pages (id, title, slug, page_type, status, published_at, created_by, updated_by)
VALUES (1, 'Homepage', 'home', 'homepage', 'published', '2026-08-12 12:00:00', 1, 1);

INSERT IGNORE INTO website_settings (setting_key, setting_value, value_type, is_public, updated_by) VALUES
('website.title', 'Mother Teresa Educational Global Trust', 'string', 1, 1),
('contact.email', 'admissions@mothertheresa.edu', 'string', 1, 1),
('contact.phone', '+971 4 388 9200', 'string', 1, 1),
('contact.address', 'Dubai, United Arab Emirates', 'string', 1, 1);

INSERT IGNORE INTO activity_logs (user_id, module, action, record_type, record_id, description, ip_address, device, created_at) VALUES
(1, 'leads', 'create', 'lead', 1, 'Website enquiry created and assigned to Dr. Sarah Jenkins.', '127.0.0.1', 'Demo browser', '2026-08-12 09:15:00'),
(1, 'applications', 'status_change', 'application', 1, 'Application moved from Submitted to University Processing.', '127.0.0.1', 'Demo browser', '2026-08-12 10:30:00'),
(1, 'tasks', 'create', 'task', 3, 'Financial document verification task created.', '127.0.0.1', 'Demo browser', '2026-08-12 11:10:00');
