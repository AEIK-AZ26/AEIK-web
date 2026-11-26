import mongoose, { Schema, Model } from 'mongoose';

/** İştirakçıya verilən sertifikat qeydi — mövcud `certificates` kolleksiyası ilə uyğundur. */
export interface ICertificate {
  code: string;
  name: string;
  nameKey: string;
  event: string;
  date: string;
  role: string;
  status: 'valid' | 'revoked';
  programId: string;
  eventSlug: string;
  ts: number;
}

const CertificateSchema = new Schema<ICertificate>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  nameKey: { type: String, default: '' },
  event: { type: String, default: '' },
  date: { type: String, default: '' },
  role: { type: String, default: 'İştirakçı' },
  status: { type: String, enum: ['valid', 'revoked'], default: 'valid' },
  programId: { type: String, default: '' },
  eventSlug: { type: String, default: '' },
  ts: { type: Number, default: () => Date.now() },
});

CertificateSchema.index({ programId: 1, nameKey: 1 });

export const CertificateModel: Model<ICertificate> =
  mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);
