import 'dotenv/config';
import {
  PrismaClient,
  UserRole,
  NotificationChannel,
  TreatmentStatus,
  AppointmentStatus,
  ReminderStatus,
  PatientProcedure,
} from '@prisma/client';

export type TreatmentLog = PatientProcedure;

const prisma = new PrismaClient();

// Helper date utilities for calculating relative timelines
const now = new Date();
const daysAgo = (days: number): Date => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date;
};
const daysFromNow = (days: number): Date => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date;
};

async function main() {
  console.log('🌱 Starting DentaCare Connect database seeding...');

  // ---------------------------------------------------------------------------
  // 1. Clean existing records in reverse relation order
  // ---------------------------------------------------------------------------
  console.log('🧹 Purging existing test records...');
  await prisma.reminder.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patientProcedure.deleteMany();
  await prisma.procedure.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  // ---------------------------------------------------------------------------
  // 2. Seed Users (Administrative Staff, Dental Assistants & Dentists)
  // ---------------------------------------------------------------------------
  console.log('👤 Seeding clinic staff users...');
  // Standard bcrypt hash representation for test password 'Password123!'
  const mockPasswordHash = '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ek5SVOmNIxQRnFhum';

  const adminUser = await prisma.user.create({
    data: {
      email: 'sarah.johnson@dentacare.com',
      password: mockPasswordHash,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: UserRole.ADMIN,
      phone: '+15550100001',
    },
  });

  const dentalAssistant = await prisma.user.create({
    data: {
      email: 'alex.rivera@dentacare.com',
      password: mockPasswordHash,
      firstName: 'Alex',
      lastName: 'Rivera',
      role: UserRole.DENTAL_ASSISTANT,
      phone: '+15550100002',
    },
  });

  const leadDentist = await prisma.user.create({
    data: {
      email: 'michael.chen@dentacare.com',
      password: mockPasswordHash,
      firstName: 'Michael',
      lastName: 'Chen',
      role: UserRole.DENTIST,
      phone: '+15550100003',
    },
  });

  console.log(`   ✓ Created 3 staff users: Admin, Dental Assistant, Dentist`);

  // ---------------------------------------------------------------------------
  // 3. Seed Procedures (Common Dental Procedures & Follow-up Intervals)
  // ---------------------------------------------------------------------------
  console.log('🦷 Seeding dental procedure catalog...');

  const rootCanal = await prisma.procedure.create({
    data: {
      name: 'Root Canal Follow-up',
      code: 'ENDO-01',
      description: 'Endodontic pulp treatment follow-up to evaluate periapical healing and coronal restoration seal.',
      defaultFollowUpDays: 14,
      category: 'Endodontics',
    },
  });

  const orthodonticAdjustment = await prisma.procedure.create({
    data: {
      name: 'Orthodontic Adjustment',
      code: 'ORTHO-01',
      description: 'Monthly bracket alignment, wire retensioning, and bite progression assessment.',
      defaultFollowUpDays: 30,
      category: 'Orthodontics',
    },
  });

  const implantCheckup = await prisma.procedure.create({
    data: {
      name: 'Dental Implant Checkup',
      code: 'IMPL-01',
      description: 'Surgical implant post-op review to inspect osseointegration and peri-implant tissue stability.',
      defaultFollowUpDays: 7,
      category: 'Implantology',
    },
  });

  const routineCleaning = await prisma.procedure.create({
    data: {
      name: 'Routine Cleaning & Prophylaxis',
      code: 'PREV-01',
      description: 'Semi-annual ultrasonic calculus removal, polishing, and comprehensive periodontal evaluation.',
      defaultFollowUpDays: 180,
      category: 'Preventive',
    },
  });

  const toothExtraction = await prisma.procedure.create({
    data: {
      name: 'Complex Tooth Extraction',
      code: 'SURG-01',
      description: 'Surgical dental extraction requiring socket healing evaluation and clot formation verification.',
      defaultFollowUpDays: 3,
      category: 'Oral Surgery',
    },
  });

  console.log(`   ✓ Created 5 procedure types with automated follow-up intervals`);

  // ---------------------------------------------------------------------------
  // 4. Seed Patients (Varied profiles & preferred communication channels)
  // ---------------------------------------------------------------------------
  console.log('👥 Seeding patient clinical profiles...');

  const patient1 = await prisma.patient.create({
    data: {
      firstName: 'Carlos',
      lastName: 'Mendoza',
      email: 'carlos.mendoza@example.com',
      phone: '+15551234501',
      preferredChannel: NotificationChannel.WHATSAPP,
      clinicalNotes: 'Mild dental anxiety. Prefers quick WhatsApp communication.',
      dateOfBirth: new Date('1988-04-12'),
      gender: 'Male',
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      firstName: 'Emily',
      lastName: 'Watson',
      email: 'emily.watson@example.com',
      phone: '+15551234502',
      preferredChannel: NotificationChannel.EMAIL,
      clinicalNotes: 'Frequent business traveler; prefers formal email reminders.',
      dateOfBirth: new Date('1992-09-24'),
      gender: 'Female',
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      firstName: 'David',
      lastName: 'Rodriguez',
      email: 'david.rodriguez@example.com',
      phone: '+15551234503',
      preferredChannel: NotificationChannel.SMS,
      clinicalNotes: 'History of post-surgical swelling. High priority follow-up.',
      dateOfBirth: new Date('1975-11-05'),
      gender: 'Male',
    },
  });

  const patient4 = await prisma.patient.create({
    data: {
      firstName: 'Sophia',
      lastName: 'Martinez',
      email: 'sophia.martinez@example.com',
      phone: '+15551234504',
      preferredChannel: NotificationChannel.WHATSAPP,
      clinicalNotes: 'Under active orthodontic treatment (Clear aligners).',
      dateOfBirth: new Date('2001-02-18'),
      gender: 'Female',
    },
  });

  const patient5 = await prisma.patient.create({
    data: {
      firstName: 'Robert',
      lastName: 'Taylor',
      email: 'robert.taylor@example.com',
      phone: '+15551234505',
      preferredChannel: NotificationChannel.EMAIL,
      clinicalNotes: 'Routine preventive care patient with healthy dentition.',
      dateOfBirth: new Date('1964-07-30'),
      gender: 'Male',
    },
  });

  const patient6 = await prisma.patient.create({
    data: {
      firstName: 'Jessica',
      lastName: 'Chen',
      email: 'jessica.chen@example.com',
      phone: '+15551234506',
      preferredChannel: NotificationChannel.WHATSAPP,
      clinicalNotes: 'Root canal completed on tooth #19. Highly responsive to reminders.',
      dateOfBirth: new Date('1995-12-14'),
      gender: 'Female',
    },
  });

  const patient7 = await prisma.patient.create({
    data: {
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'marcus.vance@example.com',
      phone: '+15551234507',
      preferredChannel: NotificationChannel.SMS,
      clinicalNotes: 'Lower third molar extraction; smooth recovery reported.',
      dateOfBirth: new Date('1983-08-03'),
      gender: 'Male',
    },
  });

  console.log(`   ✓ Created 7 patient records across WhatsApp, Email, and SMS channels`);

  // ---------------------------------------------------------------------------
  // 5. Seed Patient Procedures / Treatment Logs & Diverse Timelines
  // ---------------------------------------------------------------------------
  console.log('📋 Linking patient procedures with realistic timelines...');

  // Timeline Case 1: DUE TODAY
  // Patient 1 (Carlos): Extraction performed 3 days ago, 3-day follow-up interval -> Due today
  const treatmentDueToday = await prisma.patientProcedure.create({
    data: {
      patientId: patient1.id,
      procedureId: toothExtraction.id,
      performedById: leadDentist.id,
      procedureDate: daysAgo(3),
      followUpDueDate: daysAgo(0), // Due today
      status: TreatmentStatus.PENDING_FOLLOWUP,
      notes: 'Surgical extraction of tooth #30. Post-op check required today for clotting check.',
    },
  });

  // Timeline Case 2: OVERDUE & UNRESPONSIVE (7 days overdue)
  // Patient 2 (Emily): Root canal done 21 days ago, 14-day follow-up -> Due 7 days ago
  const treatmentOverdueUnresponsive = await prisma.patientProcedure.create({
    data: {
      patientId: patient2.id,
      procedureId: rootCanal.id,
      performedById: leadDentist.id,
      procedureDate: daysAgo(21),
      followUpDueDate: daysAgo(7), // 7 days overdue
      status: TreatmentStatus.OVERDUE,
      notes: 'Root canal therapy on tooth #14. Critical to inspect crown temporary seal before final restoration.',
    },
  });

  // Timeline Case 3: OVERDUE & ESCALATED (3 days overdue)
  // Patient 3 (David): Implant placed 10 days ago, 7-day follow-up -> Due 3 days ago
  const treatmentOverdueEscalated = await prisma.patientProcedure.create({
    data: {
      patientId: patient3.id,
      procedureId: implantCheckup.id,
      performedById: leadDentist.id,
      procedureDate: daysAgo(10),
      followUpDueDate: daysAgo(3), // 3 days overdue
      status: TreatmentStatus.OVERDUE,
      notes: 'Implant placement on area #11. Patient has not confirmed follow-up stitch removal.',
    },
  });

  // Timeline Case 4: UPCOMING (Due in 20 days)
  // Patient 4 (Sophia): Ortho adjustment 10 days ago, 30-day follow-up -> Due in 20 days
  const treatmentUpcomingNear = await prisma.patientProcedure.create({
    data: {
      patientId: patient4.id,
      procedureId: orthodonticAdjustment.id,
      performedById: leadDentist.id,
      procedureDate: daysAgo(10),
      followUpDueDate: daysFromNow(20),
      status: TreatmentStatus.PENDING_FOLLOWUP,
      notes: 'Upper arch wire replacement (0.016 NiTi). Next activation scheduled for next month.',
    },
  });

  // Timeline Case 5: UPCOMING LONG-TERM (Due in 150 days)
  // Patient 5 (Robert): Cleaning 30 days ago, 180-day follow-up -> Due in 150 days
  const treatmentUpcomingLong = await prisma.patientProcedure.create({
    data: {
      patientId: patient5.id,
      procedureId: routineCleaning.id,
      performedById: dentalAssistant.id,
      procedureDate: daysAgo(30),
      followUpDueDate: daysFromNow(150),
      status: TreatmentStatus.PENDING_FOLLOWUP,
      notes: 'Routine prophylaxis. Recommended 6-month recall for calculus assessment.',
    },
  });

  // Timeline Case 6: FOLLOW-UP APPOINTMENT CONFIRMED (Due in 1 day)
  // Patient 6 (Jessica): Root canal 13 days ago -> Due tomorrow, appointment booked
  const treatmentScheduled = await prisma.patientProcedure.create({
    data: {
      patientId: patient6.id,
      procedureId: rootCanal.id,
      performedById: leadDentist.id,
      procedureDate: daysAgo(13),
      followUpDueDate: daysFromNow(1),
      status: TreatmentStatus.FOLLOWUP_SCHEDULED,
      notes: 'Root canal tooth #19. Patient booked follow-up control via portal.',
    },
  });

  // Timeline Case 7: COMPLETED FOLLOW-UP
  // Patient 7 (Marcus): Extraction 10 days ago, follow-up done 7 days ago
  const treatmentCompleted = await prisma.patientProcedure.create({
    data: {
      patientId: patient7.id,
      procedureId: toothExtraction.id,
      performedById: leadDentist.id,
      procedureDate: daysAgo(10),
      followUpDueDate: daysAgo(7),
      status: TreatmentStatus.COMPLETED,
      notes: 'Tooth #32 extraction. Socket healed with good granulation tissue.',
    },
  });

  console.log(`   ✓ Created 7 patient treatment logs with varied follow-up timelines`);

  // ---------------------------------------------------------------------------
  // 6. Seed Appointments
  // ---------------------------------------------------------------------------
  console.log('📅 Seeding follow-up control appointments...');

  // Appointment for Patient 1: Pending confirmation for today
  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      patientProcedureId: treatmentDueToday.id,
      userId: dentalAssistant.id,
      scheduledAt: new Date(new Date().setHours(16, 0, 0, 0)), // Today at 16:00
      durationMinutes: 20,
      status: AppointmentStatus.PENDING,
      notes: 'Post-op clot inspection requested via automated follow-up reminder.',
    },
  });

  // Appointment for Patient 6: Confirmed for tomorrow at 10:00 AM
  const confirmedAppointment = await prisma.appointment.create({
    data: {
      patientId: patient6.id,
      patientProcedureId: treatmentScheduled.id,
      userId: leadDentist.id,
      scheduledAt: new Date(daysFromNow(1).setHours(10, 0, 0, 0)),
      durationMinutes: 30,
      status: AppointmentStatus.CONFIRMED,
      notes: 'Follow-up root canal assessment and crown preparation review.',
    },
  });

  // Appointment for Patient 7: Completed 7 days ago
  await prisma.appointment.create({
    data: {
      patientId: patient7.id,
      patientProcedureId: treatmentCompleted.id,
      userId: leadDentist.id,
      scheduledAt: new Date(daysAgo(7).setHours(11, 30, 0, 0)),
      durationMinutes: 15,
      status: AppointmentStatus.COMPLETED,
      notes: 'Surgical sutures removed. Patient released with normal oral hygiene instructions.',
    },
  });

  console.log(`   ✓ Created appointments across PENDING, CONFIRMED, and COMPLETED states`);

  // ---------------------------------------------------------------------------
  // 7. Seed Multi-Channel Reminders & Retry/Escalation Tracking
  // ---------------------------------------------------------------------------
  console.log('📲 Seeding multi-channel reminders and escalation tracking...');

  // 1. WhatsApp Reminder for Patient 1 (Due Today - Sent)
  await prisma.reminder.create({
    data: {
      patientId: patient1.id,
      patientProcedureId: treatmentDueToday.id,
      channel: NotificationChannel.WHATSAPP,
      status: ReminderStatus.SENT,
      scheduledFor: daysAgo(0),
      sentAt: daysAgo(0),
      bookingUrl: 'http://localhost:3000/portal/book?token=dc-token-carlos-due-today',
      bookingToken: 'dc-token-carlos-due-today',
      messageContent: 'Hi Carlos, Dr. Chen would like to check your healing after your tooth extraction. Please tap the link to confirm your follow-up slot today.',
      retryCount: 0,
      maxRetries: 3,
      isEscalated: false,
    },
  });

  // 2. Email Reminder for Patient 2 (Overdue & Unresponsive - Escalated!)
  await prisma.reminder.create({
    data: {
      patientId: patient2.id,
      patientProcedureId: treatmentOverdueUnresponsive.id,
      channel: NotificationChannel.EMAIL,
      status: ReminderStatus.FAILED,
      scheduledFor: daysAgo(7),
      sentAt: daysAgo(7),
      bookingUrl: 'http://localhost:3000/portal/book?token=dc-token-emily-overdue-escalated',
      bookingToken: 'dc-token-emily-overdue-escalated',
      messageContent: 'Dear Emily Watson, your Root Canal follow-up control was due on ' + daysAgo(7).toLocaleDateString() + '. Please schedule your appointment immediately.',
      retryCount: 3,
      maxRetries: 3,
      isEscalated: true,
      escalatedAt: daysAgo(2),
      escalationNotes: 'Patient has not responded to 3 consecutive email reminder dispatches. Flagged for manual outreach by Dental Assistant Alex Rivera.',
    },
  });

  // 3. SMS Reminder for Patient 3 (Overdue Surgical Implant - Escalated!)
  await prisma.reminder.create({
    data: {
      patientId: patient3.id,
      patientProcedureId: treatmentOverdueEscalated.id,
      channel: NotificationChannel.SMS,
      status: ReminderStatus.DELIVERED,
      scheduledFor: daysAgo(3),
      sentAt: daysAgo(3),
      bookingUrl: 'http://localhost:3000/portal/book?token=dc-token-david-implant-escalated',
      bookingToken: 'dc-token-david-implant-escalated',
      messageContent: 'DentaCare Alert: David, your Dental Implant post-op checkup is 3 days overdue. Call +15550100002 or book at http://localhost:3000/portal/book?token=dc-token-david-implant-escalated',
      retryCount: 2,
      maxRetries: 3,
      isEscalated: true,
      escalatedAt: daysAgo(1),
      escalationNotes: 'Implant post-op review overdue. SMS delivered but no booking activity detected. Flagged for urgent clinic phone call.',
    },
  });

  // 4. WhatsApp Reminder for Patient 4 (Upcoming in 18 days - Queued/Pending)
  await prisma.reminder.create({
    data: {
      patientId: patient4.id,
      patientProcedureId: treatmentUpcomingNear.id,
      channel: NotificationChannel.WHATSAPP,
      status: ReminderStatus.PENDING,
      scheduledFor: daysFromNow(18),
      bookingUrl: 'http://localhost:3000/portal/book?token=dc-token-sophia-ortho-upcoming',
      bookingToken: 'dc-token-sophia-ortho-upcoming',
      messageContent: 'Hello Sophia, your monthly Orthodontic Adjustment will be due soon. Tap here to reserve your preferred chair time.',
      retryCount: 0,
      maxRetries: 3,
      isEscalated: false,
    },
  });

  // 5. Email Reminder for Patient 5 (Long-term recall in 143 days - Queued/Pending)
  await prisma.reminder.create({
    data: {
      patientId: patient5.id,
      patientProcedureId: treatmentUpcomingLong.id,
      channel: NotificationChannel.EMAIL,
      status: ReminderStatus.PENDING,
      scheduledFor: daysFromNow(143),
      bookingUrl: 'http://localhost:3000/portal/book?token=dc-token-robert-cleaning-recall',
      bookingToken: 'dc-token-robert-cleaning-recall',
      messageContent: 'Dear Robert, it will soon be time for your semi-annual dental prophylaxis and checkup.',
      retryCount: 0,
      maxRetries: 3,
      isEscalated: false,
    },
  });

  // 6. WhatsApp Reminder for Patient 6 (Delivered & Read -> Booked)
  await prisma.reminder.create({
    data: {
      patientId: patient6.id,
      patientProcedureId: treatmentScheduled.id,
      appointmentId: confirmedAppointment.id,
      channel: NotificationChannel.WHATSAPP,
      status: ReminderStatus.READ,
      scheduledFor: daysAgo(2),
      sentAt: daysAgo(2),
      bookingUrl: 'http://localhost:3000/portal/book?token=dc-token-jessica-scheduled',
      bookingToken: 'dc-token-jessica-scheduled',
      messageContent: 'Hello Jessica, reminder for your Root Canal follow-up control scheduled for tomorrow at 10:00 AM.',
      retryCount: 0,
      maxRetries: 3,
      isEscalated: false,
    },
  });

  // 7. SMS Reminder for Patient 7 (Historical Completed Follow-up)
  await prisma.reminder.create({
    data: {
      patientId: patient7.id,
      patientProcedureId: treatmentCompleted.id,
      channel: NotificationChannel.SMS,
      status: ReminderStatus.DELIVERED,
      scheduledFor: daysAgo(8),
      sentAt: daysAgo(8),
      bookingUrl: 'http://localhost:3000/portal/book?token=dc-token-marcus-completed',
      bookingToken: 'dc-token-marcus-completed',
      messageContent: 'Marcus, this is DentaCare. Please book your post-extraction checkup at: http://localhost:3000/portal/book?token=dc-token-marcus-completed',
      retryCount: 0,
      maxRetries: 3,
      isEscalated: false,
    },
  });

  console.log(`   ✓ Created 7 multi-channel reminders (Email, WhatsApp, SMS) with retry & escalation logs`);
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
