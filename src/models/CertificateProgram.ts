import mongoose, { Schema, Model } from 'mongoose';

export interface ICertificateElementDoc {
  key: string;
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  weight: number;
  align: string;
  letterSpacing: number;
  lineHeight: number;
  visible: boolean;
}

/** Admin paneldən yaradılan sertifikat proqramı (tədbir məlumatı + dizayn). */
export interface ICertificateProgram {
  id: string;
  slug: string;
  title: string;
  date: string;
  guests: string[];
  active: boolean;
  /** Dizayn teması: classic (haşiyəli) və ya ribbon (künc lentli). */
  theme: string;
  frameColor: string;
  accentColor: string;
  logoUrl: string;
  logoUrls: string[];
  elements: ICertificateElementDoc[];
  /** Köhnə versiyadan qalan sahə — yeni dizayn şablon şəkil istifadə etmir. */
  templateUrl?: string;
  ts: number;
  updatedAt: number;
}

const ElementSchema = new Schema<ICertificateElementDoc>(
  {
    key: { type: String, required: true },
    text: { type: String, default: '' },
    x: { type: Number, default: 50 },
    y: { type: Number, default: 50 },
    size: { type: Number, default: 32 },
    color: { type: String, default: '#20365C' },
    weight: { type: Number, default: 500 },
    align: { type: String, default: 'center' },
    letterSpacing: { type: Number, default: 0 },
    lineHeight: { type: Number, default: 1.4 },
    visible: { type: Boolean, default: true },
  },
  { _id: false }
);

const CertificateProgramSchema = new Schema<ICertificateProgram>({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  date: { type: String, default: '' },
  guests: { type: [String], default: [] },
  active: { type: Boolean, default: false },
  theme: { type: String, default: 'classic' },
  frameColor: { type: String, default: '#1D3B66' },
  accentColor: { type: String, default: '#2F5F9E' },
  logoUrl: { type: String, default: '' },
  logoUrls: { type: [String], default: [] },
  elements: { type: [ElementSchema], default: [] },
  templateUrl: { type: String, default: '', required: false },
  ts: { type: Number, default: () => Date.now() },
  updatedAt: { type: Number, default: () => Date.now() },
});

CertificateProgramSchema.index({ active: 1, ts: -1 });

export const CertificateProgramModel: Model<ICertificateProgram> =
  mongoose.models.CertificateProgram ||
  mongoose.model<ICertificateProgram>('CertificateProgram', CertificateProgramSchema);
