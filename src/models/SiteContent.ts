import mongoose, { Schema, Model } from 'mongoose';

export type SiteSection = 'announcement' | 'news' | 'membership' | 'project' | 'about' | 'plan';

export interface ISiteContent {
  id: string;
  sec: SiteSection;
  title: string;
  subtitle?: string;
  text?: string;
  body?: string;
  image?: string;
  link?: string;
  date?: string;
  status: 'published' | 'draft';
  order?: number;
  meta?: string;
  ts: number;
}

const SiteContentSchema = new Schema<ISiteContent>({
  id: { type: String, required: true, unique: true },
  sec: {
    type: String,
    required: true,
    enum: ['announcement', 'news', 'membership', 'project', 'about', 'plan'],
  },
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, default: '' },
  text: { type: String, default: '' },
  body: { type: String, default: '' },
  image: { type: String, default: '' },
  link: { type: String, default: '' },
  date: { type: String, default: '' },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  order: { type: Number, default: 0 },
  meta: { type: String, default: '' },
  ts: { type: Number, default: () => Date.now() },
});

export const SiteContentModel: Model<ISiteContent> =
  mongoose.models.SiteContent || mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
