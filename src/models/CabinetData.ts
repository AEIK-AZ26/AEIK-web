import mongoose, { Schema, Model } from 'mongoose';

// 1. Member
export interface IMember {
  id: string;
  name: string;
  ts: number;
}
const MemberSchema = new Schema<IMember>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  ts: { type: Number, default: () => Date.now() }
});
export const MemberModel: Model<IMember> = mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);

// 2. Attendance
export interface IAttendance {
  key: string;
  v: '+' | '-' | '';
  m: string;
  mo: number;
}
const AttendanceSchema = new Schema<IAttendance>({
  key: { type: String, required: true, unique: true },
  v: { type: String, enum: ['+', '-', ''], required: true },
  m: { type: String, required: true },
  mo: { type: Number, required: true }
});
export const AttendanceModel: Model<IAttendance> = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);

// 3. Project
export interface IProject {
  id: string;
  name: string;
  type: 'Dövri' | 'Böyük';
  stage: 'Planlaşma' | 'Hazırlıq' | 'İcrada' | 'Tamamlandı';
  members: number;
  owner: string;
  guest?: string;
  note?: string;
  ts: number;
}
const ProjectSchema = new Schema<IProject>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Dövri', 'Böyük'], default: 'Dövri' },
  stage: { type: String, enum: ['Planlaşma', 'Hazırlıq', 'İcrada', 'Tamamlandı'], default: 'Planlaşma' },
  members: { type: Number, default: 0 },
  owner: { type: String, default: '' },
  guest: { type: String, default: '' },
  note: { type: String, default: '' },
  ts: { type: Number, default: () => Date.now() }
});
export const ProjectModel: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

// 4. Calendar Event
export interface IEvent {
  id: string;
  pid: string;
  date: string;
  time?: string;
  note?: string;
  ts: number;
}
const EventSchema = new Schema<IEvent>({
  id: { type: String, required: true, unique: true },
  pid: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, default: '' },
  note: { type: String, default: '' },
  ts: { type: Number, default: () => Date.now() }
});
export const EventModel: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

// 5. Drive Link
export interface ILink {
  linkId: string;
  url: string;
}
const LinkSchema = new Schema<ILink>({
  linkId: { type: String, required: true, unique: true },
  url: { type: String, default: '' }
});
export const LinkModel: Model<ILink> = mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);

// 6. Generic Item (Posts, Partners, Results, Meetings, Tasks, Notes)
export interface IItem {
  id: string;
  sec: 'posts' | 'partners' | 'results' | 'meetings' | 'tasks' | 'notes';
  title: string;
  status?: string;
  meta?: string;
  text?: string;
  text2?: string;
  date?: string;
  plat?: string;
  proj?: string;
  who?: string;
  link?: string;
  ptype?: string;
  contact?: string;
  next?: string;
  val?: string;
  area?: string;
  ts: number;
}
const ItemSchema = new Schema<IItem>({
  id: { type: String, required: true, unique: true },
  sec: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, default: '' },
  meta: { type: String, default: '' },
  text: { type: String, default: '' },
  text2: { type: String, default: '' },
  date: { type: String, default: '' },
  plat: { type: String, default: '' },
  proj: { type: String, default: '' },
  who: { type: String, default: '' },
  link: { type: String, default: '' },
  ptype: { type: String, default: '' },
  contact: { type: String, default: '' },
  next: { type: String, default: '' },
  val: { type: String, default: '' },
  area: { type: String, default: '' },
  ts: { type: Number, default: () => Date.now() }
});
export const ItemModel: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
