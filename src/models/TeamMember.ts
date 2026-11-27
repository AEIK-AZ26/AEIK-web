import mongoose, { Schema, Model } from 'mongoose';

/** `/komanda` səhifəsinin layihə rəhbərləri — menecer panelindən idarə olunur. */
export interface ITeamMember {
  id: string;
  name: string;
  role: string;
  project: string;
  text: string;
  image: string;
  email?: string;
  order: number;
  status: 'published' | 'draft';
  ts: number;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  role: { type: String, default: '' },
  project: { type: String, default: '' },
  text: { type: String, default: '' },
  image: { type: String, default: '' },
  email: { type: String, default: '' },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  ts: { type: Number, default: () => Date.now() },
});

export const TeamMemberModel: Model<ITeamMember> =
  mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
