import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export interface CreatePatientInput {
  firstName: string;
  lastName: string;
  documentId?: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  birthDate?: string;
  notes?: string;
}

export interface UpdatePatientInput {
  firstName?: string;
  lastName?: string;
  documentId?: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  birthDate?: string;
  notes?: string;
  isActive?: boolean;
}

export class PatientService {
  /**
   * Create a new patient profile
   */
  static async createPatient(data: CreatePatientInput) {
    try {
      return await prisma.patient.create({
        data: {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          documentId: data.documentId?.trim() || null,
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          whatsappNumber: data.whatsappNumber?.trim() || data.phone.trim(),
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
          notes: data.notes?.trim() || null,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = (error.meta?.target as string[])?.join(', ') || 'email/documentId';
        throw new ApiError(409, `A patient with this ${target} already exists.`);
      }
      throw error;
    }
  }

  /**
   * Retrieve all patients with optional search filter and pagination
   */
  static async getAllPatients(search?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: Prisma.PatientWhereInput = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { documentId: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          procedures: {
            orderBy: { nextControlDate: 'asc' },
          },
        },
      }),
      prisma.patient.count({ where }),
    ]);

    return {
      data: patients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieve a single patient by ID
   */
  static async getPatientById(id: number) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        procedures: {
          orderBy: { procedureDate: 'desc' },
        },
      },
    });

    if (!patient) {
      throw new ApiError(404, `Patient with ID ${id} not found.`);
    }

    return patient;
  }

  /**
   * Update an existing patient profile
   */
  static async updatePatient(id: number, data: UpdatePatientInput) {
    await this.getPatientById(id);

    try {
      return await prisma.patient.update({
        where: { id },
        data: {
          ...(data.firstName !== undefined && { firstName: data.firstName.trim() }),
          ...(data.lastName !== undefined && { lastName: data.lastName.trim() }),
          ...(data.documentId !== undefined && { documentId: data.documentId?.trim() || null }),
          ...(data.email !== undefined && { email: data.email.trim().toLowerCase() }),
          ...(data.phone !== undefined && { phone: data.phone.trim() }),
          ...(data.whatsappNumber !== undefined && { whatsappNumber: data.whatsappNumber?.trim() || null }),
          ...(data.birthDate !== undefined && {
            birthDate: data.birthDate ? new Date(data.birthDate) : null,
          }),
          ...(data.notes !== undefined && { notes: data.notes?.trim() || null }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = (error.meta?.target as string[])?.join(', ') || 'email/documentId';
        throw new ApiError(409, `Another patient already uses this ${target}.`);
      }
      throw error;
    }
  }
}
