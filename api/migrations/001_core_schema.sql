CREATE DATABASE IF NOT EXISTS mother_teresa_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mother_teresa_erp;

CREATE TABLE IF NOT EXISTS branches (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  code VARCHAR(30) NOT NULL UNIQUE,
  address TEXT NULL,
  phone VARCHAR(40) NULL,
  email VARCHAR(190) NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'United Arab Emirates',
  currency CHAR(3) NOT NULL DEFAULT 'AED',
  timezone VARCHAR(80) NOT NULL DEFAULT 'Asia/Dubai',
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS roles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  is_system TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS permissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  module VARCHAR(100) NOT NULL,
  action VARCHAR(60) NOT NULL,
  slug VARCHAR(170) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_permissions_module (module)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id BIGINT UNSIGNED NOT NULL,
  permission_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  branch_id BIGINT UNSIGNED NULL,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(40) NULL,
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('active','inactive','locked') NOT NULL DEFAULT 'active',
  last_login_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lead_sources (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS leads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_code VARCHAR(40) NOT NULL UNIQUE,
  branch_id BIGINT UNSIGNED NULL,
  source_id BIGINT UNSIGNED NULL,
  assigned_user_id BIGINT UNSIGNED NULL,
  full_name VARCHAR(160) NOT NULL,
  mobile VARCHAR(40) NULL,
  whatsapp VARCHAR(40) NULL,
  email VARCHAR(190) NULL,
  nationality VARCHAR(100) NULL,
  current_location VARCHAR(160) NULL,
  preferred_country VARCHAR(100) NULL,
  preferred_course VARCHAR(190) NULL,
  preferred_intake VARCHAR(100) NULL,
  highest_qualification VARCHAR(160) NULL,
  academic_score VARCHAR(50) NULL,
  english_test VARCHAR(50) NULL,
  english_score VARCHAR(50) NULL,
  budget VARCHAR(100) NULL,
  funding_preference VARCHAR(100) NULL,
  work_experience VARCHAR(100) NULL,
  priority ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  status VARCHAR(80) NOT NULL DEFAULT 'New',
  notes TEXT NULL,
  utm_source VARCHAR(120) NULL,
  utm_medium VARCHAR(120) NULL,
  utm_campaign VARCHAR(160) NULL,
  utm_content VARCHAR(160) NULL,
  utm_term VARCHAR(160) NULL,
  landing_page VARCHAR(255) NULL,
  referrer VARCHAR(255) NULL,
  device VARCHAR(120) NULL,
  first_visit_at DATETIME NULL,
  lost_reason VARCHAR(160) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_leads_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  CONSTRAINT fk_leads_source FOREIGN KEY (source_id) REFERENCES lead_sources(id) ON DELETE SET NULL,
  CONSTRAINT fk_leads_assignee FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_leads_status (status),
  INDEX idx_leads_mobile (mobile),
  INDEX idx_leads_email (email),
  INDEX idx_leads_country (preferred_country),
  INDEX idx_leads_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lead_status_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_id BIGINT UNSIGNED NOT NULL,
  from_status VARCHAR(80) NULL,
  to_status VARCHAR(80) NOT NULL,
  changed_by BIGINT UNSIGNED NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lsh_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  CONSTRAINT fk_lsh_user FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_lsh_lead_created (lead_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS followups (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_id BIGINT UNSIGNED NOT NULL,
  assigned_user_id BIGINT UNSIGNED NULL,
  followup_at DATETIME NOT NULL,
  type ENUM('call','whatsapp','email','meeting','video_call','office_visit') NOT NULL,
  outcome VARCHAR(160) NULL,
  notes TEXT NULL,
  next_action VARCHAR(255) NULL,
  status ENUM('pending','completed','missed','cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_followups_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  CONSTRAINT fk_followups_user FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_followup_schedule (status, followup_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS students (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_code VARCHAR(40) NOT NULL UNIQUE,
  lead_id BIGINT UNSIGNED NULL UNIQUE,
  branch_id BIGINT UNSIGNED NULL,
  counselor_id BIGINT UNSIGNED NULL,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NULL,
  mobile VARCHAR(40) NULL,
  date_of_birth DATE NULL,
  nationality VARCHAR(100) NULL,
  passport_number VARCHAR(80) NULL,
  preferred_country VARCHAR(100) NULL,
  preferred_course VARCHAR(190) NULL,
  intake VARCHAR(100) NULL,
  journey_stage VARCHAR(80) NOT NULL DEFAULT 'Registered',
  status ENUM('active','completed','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_students_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  CONSTRAINT fk_students_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  CONSTRAINT fk_students_counselor FOREIGN KEY (counselor_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_students_stage (journey_stage)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS student_education (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  qualification VARCHAR(160) NOT NULL,
  institution VARCHAR(190) NULL,
  board_university VARCHAR(190) NULL,
  country VARCHAR(100) NULL,
  specialization VARCHAR(190) NULL,
  start_year SMALLINT NULL,
  end_year SMALLINT NULL,
  percentage DECIMAL(5,2) NULL,
  cgpa DECIMAL(4,2) NULL,
  backlogs SMALLINT NOT NULL DEFAULT 0,
  status VARCHAR(60) NULL,
  CONSTRAINT fk_education_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS student_tests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  test_type VARCHAR(80) NOT NULL,
  test_date DATE NULL,
  overall_score VARCHAR(30) NULL,
  listening_score VARCHAR(30) NULL,
  reading_score VARCHAR(30) NULL,
  writing_score VARCHAR(30) NULL,
  speaking_score VARCHAR(30) NULL,
  reference_number VARCHAR(120) NULL,
  expiry_date DATE NULL,
  result_json JSON NULL,
  CONSTRAINT fk_tests_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS countries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  iso_code CHAR(2) NOT NULL UNIQUE,
  slug VARCHAR(140) NOT NULL UNIQUE,
  short_description TEXT NULL,
  full_description LONGTEXT NULL,
  hero_image VARCHAR(255) NULL,
  average_tuition VARCHAR(120) NULL,
  cost_of_living VARCHAR(120) NULL,
  visa_information LONGTEXT NULL,
  seo_title VARCHAR(190) NULL,
  seo_description VARCHAR(320) NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS universities (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  country_id BIGINT UNSIGNED NULL,
  name VARCHAR(190) NOT NULL,
  slug VARCHAR(210) NOT NULL UNIQUE,
  logo VARCHAR(255) NULL,
  cover_image VARCHAR(255) NULL,
  city VARCHAR(140) NULL,
  website VARCHAR(255) NULL,
  ranking VARCHAR(120) NULL,
  description LONGTEXT NULL,
  application_fee DECIMAL(12,2) NULL,
  partner_status ENUM('partner','non_partner','prospect') NOT NULL DEFAULT 'non_partner',
  commission_type VARCHAR(60) NULL,
  commission_amount DECIMAL(12,2) NULL,
  agreement_expiry DATE NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  CONSTRAINT fk_uni_country FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL,
  INDEX idx_uni_country (country_id),
  INDEX idx_uni_partner (partner_status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS intakes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS courses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  university_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(220) NOT NULL,
  slug VARCHAR(240) NOT NULL,
  qualification_level VARCHAR(100) NULL,
  subject_area VARCHAR(140) NULL,
  duration VARCHAR(80) NULL,
  tuition_fee DECIMAL(12,2) NULL,
  application_fee DECIMAL(12,2) NULL,
  minimum_percentage DECIMAL(5,2) NULL,
  ielts_requirement VARCHAR(30) NULL,
  pte_requirement VARCHAR(30) NULL,
  work_experience VARCHAR(100) NULL,
  scholarship TEXT NULL,
  description LONGTEXT NULL,
  application_deadline DATE NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  UNIQUE KEY uq_course_uni_slug (university_id, slug),
  CONSTRAINT fk_courses_uni FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
  INDEX idx_courses_search (qualification_level, subject_area, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS course_shortlists (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  shortlisted_by BIGINT UNSIGNED NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_shortlist (student_id, course_id),
  CONSTRAINT fk_shortlist_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_shortlist_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT fk_shortlist_user FOREIGN KEY (shortlisted_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS applications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_code VARCHAR(50) NOT NULL UNIQUE,
  student_id BIGINT UNSIGNED NOT NULL,
  university_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NULL,
  intake_id BIGINT UNSIGNED NULL,
  assigned_user_id BIGINT UNSIGNED NULL,
  status VARCHAR(100) NOT NULL DEFAULT 'Documents Pending',
  submission_date DATE NULL,
  application_fee DECIMAL(12,2) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_app_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_app_uni FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE RESTRICT,
  CONSTRAINT fk_app_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
  CONSTRAINT fk_app_intake FOREIGN KEY (intake_id) REFERENCES intakes(id) ON DELETE SET NULL,
  CONSTRAINT fk_app_user FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_app_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS application_status_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id BIGINT UNSIGNED NOT NULL,
  from_status VARCHAR(100) NULL,
  to_status VARCHAR(100) NOT NULL,
  changed_by BIGINT UNSIGNED NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ash_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  CONSTRAINT fk_ash_user FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS offers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id BIGINT UNSIGNED NOT NULL,
  offer_type ENUM('conditional','unconditional') NOT NULL,
  received_date DATE NULL,
  conditions TEXT NULL,
  tuition_fee DECIMAL(12,2) NULL,
  deposit_amount DECIMAL(12,2) NULL,
  deadline DATE NULL,
  document_path VARCHAR(255) NULL,
  student_decision ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  CONSTRAINT fk_offers_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS visas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  country_id BIGINT UNSIGNED NULL,
  assigned_user_id BIGINT UNSIGNED NULL,
  visa_type VARCHAR(120) NULL,
  application_date DATE NULL,
  appointment_date DATE NULL,
  biometrics_date DATE NULL,
  reference_number VARCHAR(140) NULL,
  visa_fee DECIMAL(12,2) NULL,
  status VARCHAR(80) NOT NULL DEFAULT 'Documentation',
  rejection_reason TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_visa_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_visa_country FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL,
  CONSTRAINT fk_visa_user FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_visa_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS visa_status_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  visa_id BIGINT UNSIGNED NOT NULL,
  from_status VARCHAR(80) NULL,
  to_status VARCHAR(80) NOT NULL,
  changed_by BIGINT UNSIGNED NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_vsh_visa FOREIGN KEY (visa_id) REFERENCES visas(id) ON DELETE CASCADE,
  CONSTRAINT fk_vsh_user FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS document_types (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(140) NOT NULL UNIQUE,
  category VARCHAR(100) NULL,
  has_expiry TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS documents (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  application_id BIGINT UNSIGNED NULL,
  document_type_id BIGINT UNSIGNED NULL,
  file_name VARCHAR(255) NOT NULL,
  storage_path VARCHAR(255) NOT NULL,
  reference_number VARCHAR(140) NULL,
  issue_date DATE NULL,
  expiry_date DATE NULL,
  verification_status ENUM('uploaded','verification_pending','verified','rejected') NOT NULL DEFAULT 'uploaded',
  verified_by BIGINT UNSIGNED NULL,
  verified_at DATETIME NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_documents_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_documents_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL,
  CONSTRAINT fk_documents_type FOREIGN KEY (document_type_id) REFERENCES document_types(id) ON DELETE SET NULL,
  CONSTRAINT fk_documents_verifier FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_documents_status (verification_status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS appointments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_id BIGINT UNSIGNED NULL,
  student_id BIGINT UNSIGNED NULL,
  staff_id BIGINT UNSIGNED NULL,
  type VARCHAR(100) NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NULL,
  mode VARCHAR(60) NULL,
  status ENUM('scheduled','confirmed','completed','cancelled','no_show') NOT NULL DEFAULT 'scheduled',
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appointments_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  CONSTRAINT fk_appointments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
  CONSTRAINT fk_appointments_staff FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_appointment_time (starts_at, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tasks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  branch_id BIGINT UNSIGNED NULL,
  assigned_user_id BIGINT UNSIGNED NULL,
  related_type VARCHAR(80) NULL,
  related_id BIGINT UNSIGNED NULL,
  title VARCHAR(190) NOT NULL,
  description TEXT NULL,
  priority ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  due_at DATETIME NULL,
  status ENUM('pending','in_progress','completed','overdue') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  CONSTRAINT fk_tasks_user FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_tasks_due (status, due_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS communications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lead_id BIGINT UNSIGNED NULL,
  student_id BIGINT UNSIGNED NULL,
  user_id BIGINT UNSIGNED NULL,
  channel ENUM('phone','whatsapp','email','sms','note','meeting') NOT NULL,
  direction ENUM('inbound','outbound','internal') NOT NULL DEFAULT 'internal',
  subject VARCHAR(190) NULL,
  message TEXT NULL,
  status VARCHAR(60) NULL,
  sent_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comms_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  CONSTRAINT fk_comms_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_comms_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_comms_timeline (student_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS invoices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(60) NOT NULL UNIQUE,
  student_id BIGINT UNSIGNED NOT NULL,
  branch_id BIGINT UNSIGNED NULL,
  issue_date DATE NOT NULL,
  due_date DATE NULL,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax DECIMAL(12,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  paid DECIMAL(12,2) NOT NULL DEFAULT 0,
  status ENUM('draft','issued','part_paid','paid','overdue','cancelled') NOT NULL DEFAULT 'draft',
  CONSTRAINT fk_invoice_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  CONSTRAINT fk_invoice_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  INDEX idx_invoice_status (status, due_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS invoice_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_id BIGINT UNSIGNED NOT NULL,
  description VARCHAR(190) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_items_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  receipt_number VARCHAR(60) NOT NULL UNIQUE,
  invoice_id BIGINT UNSIGNED NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  branch_id BIGINT UNSIGNED NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'AED',
  payment_method VARCHAR(60) NOT NULL,
  transaction_reference VARCHAR(140) NULL,
  paid_at DATETIME NOT NULL,
  notes TEXT NULL,
  CONSTRAINT fk_payment_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
  CONSTRAINT fk_payment_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  CONSTRAINT fk_payment_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  INDEX idx_payment_date (paid_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS expenses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  branch_id BIGINT UNSIGNED NULL,
  category VARCHAR(120) NOT NULL,
  vendor VARCHAR(190) NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'AED',
  payment_mode VARCHAR(60) NULL,
  expense_date DATE NOT NULL,
  invoice_reference VARCHAR(140) NULL,
  attachment_path VARCHAR(255) NULL,
  notes TEXT NULL,
  CONSTRAINT fk_expenses_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  INDEX idx_expense_date (expense_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS agents (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company VARCHAR(190) NULL,
  contact_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NULL,
  phone VARCHAR(40) NULL,
  country VARCHAR(100) NULL,
  commission_structure VARCHAR(190) NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS commissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  university_id BIGINT UNSIGNED NULL,
  course_id BIGINT UNSIGNED NULL,
  agent_id BIGINT UNSIGNED NULL,
  tuition_amount DECIMAL(12,2) NULL,
  commission_percentage DECIMAL(6,2) NULL,
  expected_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  received_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  invoice_number VARCHAR(100) NULL,
  payment_date DATE NULL,
  CONSTRAINT fk_comm_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  CONSTRAINT fk_comm_uni FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE SET NULL,
  CONSTRAINT fk_comm_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
  CONSTRAINT fk_comm_agent FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS employees (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL UNIQUE,
  branch_id BIGINT UNSIGNED NULL,
  employee_code VARCHAR(50) NOT NULL UNIQUE,
  department VARCHAR(120) NULL,
  designation VARCHAR(120) NULL,
  joining_date DATE NULL,
  salary DECIMAL(12,2) NULL,
  working_hours VARCHAR(100) NULL,
  reporting_manager_id BIGINT UNSIGNED NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_employee_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  CONSTRAINT fk_employee_manager FOREIGN KEY (reporting_manager_id) REFERENCES employees(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS attendance (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id BIGINT UNSIGNED NOT NULL,
  attendance_date DATE NOT NULL,
  check_in DATETIME NULL,
  check_out DATETIME NULL,
  status VARCHAR(60) NOT NULL,
  source VARCHAR(60) NOT NULL DEFAULT 'manual',
  UNIQUE KEY uq_attendance_day (employee_id, attendance_date),
  CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS leaves (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id BIGINT UNSIGNED NOT NULL,
  leave_type VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NULL,
  manager_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  hr_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(190) NOT NULL,
  message TEXT NULL,
  link VARCHAR(255) NULL,
  read_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_unread (user_id, read_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  module VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  record_type VARCHAR(120) NULL,
  record_id BIGINT UNSIGNED NULL,
  description TEXT NOT NULL,
  old_values JSON NULL,
  new_values JSON NULL,
  ip_address VARCHAR(64) NULL,
  device VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_activity_record (record_type, record_id, created_at),
  INDEX idx_activity_user (user_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cms_pages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(190) NOT NULL,
  slug VARCHAR(190) NOT NULL UNIQUE,
  page_type VARCHAR(100) NOT NULL DEFAULT 'page',
  status ENUM('draft','scheduled','published') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cms_created FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_cms_updated FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cms_sections (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_id BIGINT UNSIGNED NOT NULL,
  section_key VARCHAR(120) NOT NULL,
  section_type VARCHAR(100) NOT NULL,
  position INT NOT NULL DEFAULT 0,
  content_json JSON NOT NULL,
  is_enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cms_section (page_id, section_key),
  CONSTRAINT fk_sections_page FOREIGN KEY (page_id) REFERENCES cms_pages(id) ON DELETE CASCADE,
  INDEX idx_sections_order (page_id, is_enabled, position)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS services (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(190) NOT NULL,
  slug VARCHAR(190) NOT NULL UNIQUE,
  thumbnail VARCHAR(255) NULL,
  banner VARCHAR(255) NULL,
  short_description TEXT NULL,
  content LONGTEXT NULL,
  benefits_json JSON NULL,
  process_json JSON NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS testimonials (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(160) NOT NULL,
  photo VARCHAR(255) NULL,
  country VARCHAR(120) NULL,
  university VARCHAR(190) NULL,
  course VARCHAR(190) NULL,
  testimonial TEXT NOT NULL,
  rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
  video_url VARCHAR(255) NULL,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blogs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(240) NOT NULL UNIQUE,
  category VARCHAR(120) NULL,
  featured_image VARCHAR(255) NULL,
  excerpt TEXT NULL,
  content LONGTEXT NOT NULL,
  author_id BIGINT UNSIGNED NULL,
  publish_at DATETIME NULL,
  status ENUM('draft','scheduled','published') NOT NULL DEFAULT 'draft',
  CONSTRAINT fk_blogs_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS faqs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(120) NOT NULL,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS banners (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  image VARCHAR(255) NOT NULL,
  heading VARCHAR(220) NULL,
  description TEXT NULL,
  cta_text VARCHAR(120) NULL,
  cta_url VARCHAR(255) NULL,
  position INT NOT NULL DEFAULT 0,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS menus (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  menu_group VARCHAR(80) NOT NULL,
  parent_id BIGINT UNSIGNED NULL,
  label VARCHAR(140) NOT NULL,
  url VARCHAR(255) NOT NULL,
  position INT NOT NULL DEFAULT 0,
  is_enabled TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_menu_parent FOREIGN KEY (parent_id) REFERENCES menus(id) ON DELETE CASCADE,
  INDEX idx_menu_group (menu_group, is_enabled, position)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS media (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  uploaded_by BIGINT UNSIGNED NULL,
  folder VARCHAR(140) NULL,
  file_name VARCHAR(255) NOT NULL,
  storage_path VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  file_size BIGINT UNSIGNED NOT NULL DEFAULT 0,
  alt_text VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_media_user FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_media_folder (folder)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS form_submissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  form_key VARCHAR(120) NOT NULL,
  lead_id BIGINT UNSIGNED NULL,
  payload_json JSON NOT NULL,
  ip_address VARCHAR(64) NULL,
  user_agent VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_forms_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  INDEX idx_form_key_date (form_key, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS seo_meta (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type VARCHAR(100) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  route VARCHAR(255) NOT NULL,
  seo_title VARCHAR(190) NULL,
  meta_description VARCHAR(320) NULL,
  keywords TEXT NULL,
  canonical_url VARCHAR(255) NULL,
  og_title VARCHAR(190) NULL,
  og_image VARCHAR(255) NULL,
  twitter_image VARCHAR(255) NULL,
  UNIQUE KEY uq_seo_route (route)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS website_settings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(160) NOT NULL UNIQUE,
  setting_value LONGTEXT NULL,
  value_type VARCHAR(60) NOT NULL DEFAULT 'string',
  is_public TINYINT(1) NOT NULL DEFAULT 0,
  updated_by BIGINT UNSIGNED NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_settings_user FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
