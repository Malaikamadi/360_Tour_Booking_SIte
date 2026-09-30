"""
NHIH 360° Discovery Tour - Database Seed Script
Populates database with official Sierra Leone Ministry of Health directorates,
programmes, units, agencies, spaces, default accounts, and initial discovery records.
"""
from datetime import date, time, timedelta, datetime
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, create_tables
from app.models.models import (
    User, Programme, StakeholderGroup, Space, Engagement,
    Booking, DataSource, OperationalChallenge, IssueValueCase,
    Assessment, IntegrationRequirement
)
from app.core.security import get_password_hash


def seed_database():
    create_tables()
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Programme).count() > 0:
            print("[INFO] Database already contains records. Skipping seed.")
            return

        print("[INFO] Seeding database with Sierra Leone Ministry of Health data...")

        # -------------------------------------------------------------------
        # 1. Stakeholder Groups
        # -------------------------------------------------------------------
        group_directorates = StakeholderGroup(
            name="Ministry Directorates",
            description="Policy, planning, governance and clinical directorates at Ministry of Health HQ",
        )
        group_programmes = StakeholderGroup(
            name="Priority Health Programmes",
            description="Vertical and integrated health programmes (Malaria, TB, HIV, Immunization, RCH)",
        )
        group_agencies = StakeholderGroup(
            name="Health Agencies & Parastatals",
            description="Autonomous agencies, logistics entities, and surveillance authorities (NPHA, NMSA, Stats SL)",
        )
        group_units = StakeholderGroup(
            name="Specialized Units & Support Services",
            description="HRH, Digital Health, Laboratory, Monitoring & Evaluation units",
        )
        db.add_all([group_directorates, group_programmes, group_agencies, group_units])
        db.flush()

        # -------------------------------------------------------------------
        # 2. Programmes, Directorates, Units & Agencies
        # -------------------------------------------------------------------
        programmes_data = [
            {
                "name": "Directorate of Policy, Planning & Information (DPPI)",
                "programme_type": "directorate",
                "description": "Custodian of health policy, planning, NHIH, and sector-wide health information systems.",
                "contact_person": "Dr. Francis Smart",
                "contact_email": "dppi.director@mohs.gov.sl",
                "contact_phone": "+232 76 100 200",
            },
            {
                "name": "National Malaria Control Programme (NMCP)",
                "programme_type": "programme",
                "description": "Responsible for malaria epidemiological surveillance, case management, and bed net distribution data.",
                "contact_person": "Dr. Matthew Jusu",
                "contact_email": "nmcp.lead@mohs.gov.sl",
                "contact_phone": "+232 78 200 300",
            },
            {
                "name": "Expanded Programme on Immunization (EPI)",
                "programme_type": "programme",
                "description": "Manages nationwide vaccination registries, cold-chain monitoring, and coverage tracking.",
                "contact_person": "Dr. Fatmata Kamara",
                "contact_email": "epi.surveillance@mohs.gov.sl",
                "contact_phone": "+232 77 300 400",
            },
            {
                "name": "Directorate of Reproductive & Child Health (RCH)",
                "programme_type": "directorate",
                "description": "Maternal, newborn, child, and adolescent health reporting, emergency obstetric care, and registry records.",
                "contact_person": "Dr. Mariama Kargbo",
                "contact_email": "rch.director@mohs.gov.sl",
                "contact_phone": "+232 79 400 500",
            },
            {
                "name": "Directorate of Disease Prevention and Control (DPC)",
                "programme_type": "directorate",
                "description": "Oversees integrated disease surveillance (e-IDSR), epidemic response, and community surveillance.",
                "contact_person": "Dr. Alie Wurie",
                "contact_email": "dpc.lead@mohs.gov.sl",
                "contact_phone": "+232 88 500 600",
            },
            {
                "name": "Pharmacy and Supplies Directorate (PSD)",
                "programme_type": "directorate",
                "description": "Oversees essential medicines, pharmaceutical supply chain, stock status reporting via mSupply.",
                "contact_person": "Pharm. Michael Sesay",
                "contact_email": "pharmacy.director@mohs.gov.sl",
                "contact_phone": "+232 76 600 700",
            },
            {
                "name": "Human Resources for Health Directorate (HRH)",
                "programme_type": "directorate",
                "description": "Manages healthcare worker establishment, iHRIS staffing records, payroll verification, and deployment data.",
                "contact_person": "Ibrahim Conteh",
                "contact_email": "hrh.director@mohs.gov.sl",
                "contact_phone": "+232 78 700 800",
            },
            {
                "name": "National HIV/AIDS Secretariat (NAS)",
                "programme_type": "agency",
                "description": "National coordination of HIV prevention, ART tracking, viral load surveillance, and donor data.",
                "contact_person": "Abdul Rahman Bangura",
                "contact_email": "nas.coordination@mohs.gov.sl",
                "contact_phone": "+232 77 800 900",
            },
            {
                "name": "National Public Health Agency (NPHA)",
                "programme_type": "agency",
                "description": "Public health emergency operations, reference laboratory data, and genomic surveillance.",
                "contact_person": "Dr. Foday Sesay",
                "contact_email": "npha.operations@mohs.gov.sl",
                "contact_phone": "+232 88 900 100",
            },
            {
                "name": "National Medical Supplies Agency (NMSA)",
                "programme_type": "agency",
                "description": "Procurement, warehousing, and last-mile distribution of free healthcare medicines across districts.",
                "contact_person": "Dr. James Senessie",
                "contact_email": "nmsa.logistics@mohs.gov.sl",
                "contact_phone": "+232 76 999 888",
            },
            {
                "name": "Directorate of Primary Health Care (PHC)",
                "programme_type": "directorate",
                "description": "Peripheral health units (PHU) network, community health workers (CHW) reporting, and district health management.",
                "contact_person": "Dr. Patricia Bah",
                "contact_email": "phc.director@mohs.gov.sl",
                "contact_phone": "+232 78 111 222",
            },
            {
                "name": "Environmental Health and Sanitation Directorate",
                "programme_type": "directorate",
                "description": "WASH in health facilities, medical waste surveillance, and vector control data.",
                "contact_person": "Joseph Momoh",
                "contact_email": "envhealth@mohs.gov.sl",
                "contact_phone": "+232 77 222 333",
            },
        ]

        created_programmes = []
        for p in programmes_data:
            prog = Programme(**p)
            db.add(prog)
            created_programmes.append(prog)
        db.flush()

        # -------------------------------------------------------------------
        # 3. Spaces
        # -------------------------------------------------------------------
        spaces_data = [
            Space(
                name="NHIH Intelligence War Room",
                location="5th Floor, Youyi Building, Brookfields, Freetown",
                capacity=16,
                is_active=True,
            ),
            Space(
                name="DPPI Strategic Boardroom",
                location="Ground Floor, DPPI Annexe, Youyi Building",
                capacity=24,
                is_active=True,
            ),
            Space(
                name="MoH Executive Conference Suite",
                location="4th Floor, Ministry of Health Headquarters, Freetown",
                capacity=35,
                is_active=True,
            ),
            Space(
                name="NHIH Virtual Engagement Suite (Teams)",
                location="Virtual / Microsoft Teams HD Meeting",
                capacity=100,
                is_active=True,
            ),
        ]
        db.add_all(spaces_data)
        db.flush()

        # -------------------------------------------------------------------
        # 4. Users (Admin, Staff, Programme User)
        # -------------------------------------------------------------------
        admin_user = User(
            email="admin@nhih.gov.sl",
            password_hash=get_password_hash("Admin123!"),
            full_name="NHIH System Administrator",
            role="nhih_admin",
            phone="+232 76 000 001",
            is_active=True,
        )
        staff_user = User(
            email="staff@nhih.gov.sl",
            password_hash=get_password_hash("Staff123!"),
            full_name="NHIH Discovery Lead",
            role="nhih_staff",
            phone="+232 76 000 002",
            is_active=True,
        )
        programme_user = User(
            email="dppi.lead@mohs.gov.sl",
            password_hash=get_password_hash("Program123!"),
            full_name="DPPI Programme Lead",
            role="programme_user",
            programme_id=created_programmes[0].id,
            phone="+232 76 100 200",
            is_active=True,
        )
        db.add_all([admin_user, staff_user, programme_user])
        db.flush()

        # -------------------------------------------------------------------
        # 5. Initial Seed Engagements & Bookings
        # -------------------------------------------------------------------
        # Engagement 1: NMCP (In Progress - Day 2 done)
        nmcp_prog = next(p for p in created_programmes if "Malaria" in p.name)
        eng1 = Engagement(
            programme_id=nmcp_prog.id,
            stakeholder_group_id=group_programmes.id,
            engagement_type="full_360",
            status="in_progress",
            day1_complete=True,
            day2_complete=True,
            day3_complete=False,
            day1_notes="Presented NHIH mandate and HOS architecture. Directorate confirmed full alignment and designated 4 focal persons to the Health Intelligence TWG.",
            day2_notes="Mapped NMCP primary databases: DHIS2 aggregate monthly malaria module and mSupply ACT stock reports. Identified district level reporting delay in Koinadugu.",
            summary="NMCP exhibits rich clinical data in DHIS2; critical need to link facility stock consumption in mSupply with fever incidence data.",
        )
        db.add(eng1)
        db.flush()

        booking1 = Booking(
            booking_reference="NHIH-7A2F-89B1",
            engagement_id=eng1.id,
            programme_id=nmcp_prog.id,
            space_id=spaces_data[0].id,
            engagement_type="full_360",
            requested_date=date.today() - timedelta(days=2),
            start_time=time(9, 30),
            end_time=time(13, 0),
            location=spaces_data[0].name,
            contact_person="Dr. Matthew Jusu",
            contact_email="nmcp.lead@mohs.gov.sl",
            contact_phone="+232 78 200 300",
            participant_count=8,
            status="confirmed",
            additional_requirements="Requires projection screen for DHIS2 and mSupply live queries.",
            created_by_user_id=staff_user.id,
        )
        db.add(booking1)

        # Engagement 2: PSD / Pharmacy (Completed)
        psd_prog = next(p for p in created_programmes if "Pharmacy" in p.name)
        eng2 = Engagement(
            programme_id=psd_prog.id,
            stakeholder_group_id=group_directorates.id,
            engagement_type="full_360",
            status="completed",
            day1_complete=True,
            day2_complete=True,
            day3_complete=True,
            day1_notes="Introduced HOS logistics data pipelines. High buy-in from Chief Pharmacist.",
            day2_notes="Reviewed mSupply warehouse database vs peripheral PHU paper tally books. Noted discrepancies in stock-out logging.",
            day3_notes="Final consolidation completed. Signed roadmap for weekly mSupply automated extraction into the NHIH lakehouse.",
            summary="PSD successfully mapped. Integration pipeline to mSupply scheduled for Sprint 3.",
        )
        db.add(eng2)
        db.flush()

        booking2 = Booking(
            booking_reference="NHIH-3C4D-99E2",
            engagement_id=eng2.id,
            programme_id=psd_prog.id,
            space_id=spaces_data[1].id,
            engagement_type="full_360",
            requested_date=date.today() - timedelta(days=7),
            start_time=time(10, 0),
            end_time=time(14, 0),
            location=spaces_data[1].name,
            contact_person="Pharm. Michael Sesay",
            contact_email="pharmacy.director@mohs.gov.sl",
            contact_phone="+232 76 600 700",
            participant_count=6,
            status="completed",
            created_by_user_id=staff_user.id,
        )
        db.add(booking2)

        # Engagement 3: EPI (Upcoming Confirmed)
        epi_prog = next(p for p in created_programmes if "Immunization" in p.name)
        eng3 = Engagement(
            programme_id=epi_prog.id,
            stakeholder_group_id=group_programmes.id,
            engagement_type="full_360",
            status="planned",
            day1_complete=False,
            day2_complete=False,
            day3_complete=False,
            summary="Upcoming 360 engagement to assess electronic immunization registry (EIR) and cold-chain temperature telemetry.",
        )
        db.add(eng3)
        db.flush()

        booking3 = Booking(
            booking_reference="NHIH-5E8A-12C4",
            engagement_id=eng3.id,
            programme_id=epi_prog.id,
            space_id=spaces_data[0].id,
            engagement_type="full_360",
            requested_date=date.today() + timedelta(days=3),
            start_time=time(9, 0),
            end_time=time(12, 30),
            location=spaces_data[0].name,
            contact_person="Dr. Fatmata Kamara",
            contact_email="epi.surveillance@mohs.gov.sl",
            contact_phone="+232 77 300 400",
            participant_count=10,
            status="confirmed",
            additional_requirements="Participants will join from WHO and UNICEF country offices.",
            created_by_user_id=admin_user.id,
        )
        db.add(booking3)

        # Engagement 4: NMSA (Pending Approval)
        nmsa_prog = next(p for p in created_programmes if "NMSA" in p.name)
        booking4 = Booking(
            booking_reference="NHIH-9F0B-44D8",
            programme_id=nmsa_prog.id,
            space_id=spaces_data[2].id,
            engagement_type="full_360",
            requested_date=date.today() + timedelta(days=6),
            start_time=time(11, 0),
            end_time=time(15, 0),
            location=spaces_data[2].name,
            contact_person="Dr. James Senessie",
            contact_email="nmsa.logistics@mohs.gov.sl",
            contact_phone="+232 76 999 888",
            participant_count=12,
            status="pending",
            additional_requirements="Discussion on central medical stores warehouse inventory feed.",
        )
        db.add(booking4)

        # -------------------------------------------------------------------
        # 6. Data Sources Discovered
        # -------------------------------------------------------------------
        sources = [
            DataSource(
                engagement_id=eng1.id,
                programme_id=nmcp_prog.id,
                name="DHIS2 Routine Malaria Aggregate",
                system_type="DHIS2",
                description="Monthly clinical OPD/IPD malaria cases, RDT test positivity, and ACT dispensed by facility.",
                data_format="Digital Aggregate",
                data_frequency="Monthly",
                data_owner="NMCP M&E Unit",
                integration_status="partially_integrated",
            ),
            DataSource(
                engagement_id=eng1.id,
                programme_id=nmcp_prog.id,
                name="Mass Net Distribution Tracker (LLIN)",
                system_type="Excel Spreadsheets",
                description="Campaign-based enumeration sheets collected by community volunteers during universal coverage campaigns.",
                data_format="Excel / CSV",
                data_frequency="Quarterly",
                data_owner="NMCP Vector Control",
                integration_status="not_integrated",
            ),
            DataSource(
                engagement_id=eng2.id,
                programme_id=psd_prog.id,
                name="mSupply Central & District Warehouse System",
                system_type="mSupply",
                description="Inventory management, stock-on-hand, consumption rates, and batch expiry tracking.",
                data_format="SQL Database / API",
                data_frequency="Daily / Real-time",
                data_owner="PSD Logistics Lead",
                integration_status="partially_integrated",
            ),
            DataSource(
                engagement_id=eng2.id,
                programme_id=psd_prog.id,
                name="PHU Paper Stock Tally Cards",
                system_type="Paper Ledger",
                description="Physical bin cards maintained by peripheral health unit in-charges for daily drug disbursements.",
                data_format="Paper Ledger",
                data_frequency="Daily",
                data_owner="District Pharmacists",
                integration_status="not_integrated",
            ),
            DataSource(
                programme_id=epi_prog.id,
                name="Electronic Immunization Registry (EIR)",
                system_type="DHIS2 Tracker",
                description="Individual child vaccine schedules, BCG/Penta/Measles doses, and dropout tracking.",
                data_format="FHIR / JSON",
                data_frequency="Real-time",
                data_owner="EPI Data Manager",
                integration_status="planned",
            ),
            DataSource(
                programme_id=created_programmes[4].id, # DPC
                name="e-IDSR (Electronic Disease Surveillance & Response)",
                system_type="DHIS2 e-IDSR",
                description="Immediate alerts for epidemic-prone conditions (Cholera, Viral Hemorrhagic Fevers, Lassa, Measles).",
                data_format="SMS / Mobile Web",
                data_frequency="Immediate / Weekly",
                data_owner="Directorate of Disease Prevention",
                integration_status="partially_integrated",
            ),
            DataSource(
                programme_id=created_programmes[6].id, # HRH
                name="iHRIS Integrated Health Worker Database",
                system_type="iHRIS",
                description="Civil service cadre, licensed clinical staff, facility postings, and vacancy status.",
                data_format="Relational Database",
                data_frequency="Monthly",
                data_owner="HRH Planning Officer",
                integration_status="not_integrated",
            ),
        ]
        db.add_all(sources)

        # -------------------------------------------------------------------
        # 7. Operational Challenges & Issues
        # -------------------------------------------------------------------
        challenges = [
            OperationalChallenge(
                engagement_id=eng1.id,
                programme_id=nmcp_prog.id,
                title="Delayed Facility Monthly Reporting in Remote Chiefdoms",
                description="Over 35 peripheral health units in Koinadugu and Falaba districts submit monthly summary forms 25 days late due to network blackout.",
                severity="high",
                status="open",
            ),
            OperationalChallenge(
                engagement_id=eng2.id,
                programme_id=psd_prog.id,
                title="Stock-out Alert Disconnect Between mSupply and DHIS2",
                description="Facility clinicians continue recording malaria treatments in DHIS2 even when mSupply registers zero ACT stock on hand.",
                severity="critical",
                status="open",
            ),
            OperationalChallenge(
                engagement_id=eng2.id,
                programme_id=psd_prog.id,
                title="Paper-to-Digital Reconciliation Friction at District Stores",
                description="District stores require 3-4 days at month-end to reconcile paper requisition slips into mSupply.",
                severity="medium",
                status="in_progress",
            ),
        ]
        db.add_all(challenges)

        issues = [
            IssueValueCase(
                engagement_id=eng1.id,
                programme_id=nmcp_prog.id,
                title="Value Case: Real-time Triangulation of Incidence vs ACT Stock",
                description="Connecting DHIS2 malaria positivity with mSupply stock consumption will prevent regional stock-outs during peak rainy season transmissions.",
                case_type="value_case",
                priority="high",
                status="open",
            ),
            IssueValueCase(
                engagement_id=eng2.id,
                programme_id=psd_prog.id,
                title="Issue: Lack of Unified Facility Registry Codes in mSupply",
                description="mSupply uses legacy facility names while DHIS2 uses Master Facility List (MFL) UUIDs, causing automated matching errors.",
                case_type="issue",
                priority="critical",
                status="in_progress",
                resolution="DPPI to supply Master Facility List crosswalk table to PSD team.",
            ),
        ]
        db.add_all(issues)

        # -------------------------------------------------------------------
        # 8. Assessments & Findings
        # -------------------------------------------------------------------
        assessments = [
            Assessment(
                engagement_id=eng1.id,
                assessment_type="Data Architecture & Governance Review",
                findings="NMCP has strong protocol governance and high routine reporting completeness (88%). Key vulnerability is offline latency and siloed logistics data.",
                recommendations="Establish automated daily API sync between DHIS2 Malaria Tracker and NHIH Lakehouse. Introduce SMS-based zero-reporting fallback for isolated PHUs.",
                assessed_by="NHIH Discovery Lead",
                assessed_date=date.today() - timedelta(days=1),
            ),
            Assessment(
                engagement_id=eng2.id,
                assessment_type="Logistics Intelligence Readiness",
                findings="mSupply system architecture is mature at central and district warehouses. However, last-mile facility data is disconnected.",
                recommendations="Deploy lightweight mobile consumption logging for PHU in-charges. Map all mSupply facility IDs to National MFL standards.",
                assessed_by="NHIH Lead Architect",
                assessed_date=date.today() - timedelta(days=6),
            ),
        ]
        db.add_all(assessments)

        db.commit()
        print("[INFO] Database successfully seeded with full Sierra Leone MoH dataset!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to seed database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
