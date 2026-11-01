import {mapAsync,filterAsync} from "@/lib/database/async-arrays";
import 'server-only';
import { studentDb } from '../student/db';
import type { Category } from './types';
async function activeChain(table: string, id: string) { const d = studentDb(), seen = new Set<string>(); let cursor: string | null = id; while (cursor) {
    if (seen.has(cursor))
        return false;
    seen.add(cursor);
    const row = (await d.prepare('SELECT active,parent_id FROM ' + table + ' WHERE id=?').get(cursor));
    if (!row || !row.active)
        return false;
    cursor = row.parent_id ? String(row.parent_id) : null;
} return true; }
export async function learningCategories(): Promise<Category[]> { const d = studentDb(); return (await mapAsync((await filterAsync((await d.prepare('SELECT * FROM categories WHERE active=1 ORDER BY position,name').all()), async r => (await activeChain('categories', String(r.id))))), async r => ({ slug: String(r.id), name: String(r.name), description: String(r.description), icon: String(r.icon), position: Number(r.position), parentId: r.parent_id ? String(r.parent_id) : null, topics: (await d.prepare('SELECT title FROM topics WHERE category_id=? AND active=1 ORDER BY position,title').all(String(r.id))).map(t => String(t.title)) }))); }
export async function learningCategory(slug: string) { return (await learningCategories()).find(c => c.slug === slug); }
export async function categoryTopics(categoryId: string) { return (await filterAsync((await studentDb().prepare('SELECT * FROM topics WHERE category_id=? AND active=1 ORDER BY position,title').all(categoryId)), async r => (await activeChain('topics', String(r.id))))); }
export async function courseVisible(courseId: string | null, studentId?: string) { if (!courseId)
    return true; const row = (await studentDb().prepare("SELECT data,category_id FROM learning_content WHERE id=? AND kind='course' AND status='published'").get(courseId)); if (!row || row.category_id && !(await activeChain('categories', String(row.category_id))))
    return false; const data = JSON.parse(String(row.data)); return data.visibility !== 'enrolled' || !!studentId && !!(await studentDb().prepare('SELECT 1 FROM learning_enrolments WHERE student_id=? AND course_id=?').get(studentId, courseId)); }
export async function lessonVisible(id: string, studentId?: string) { const d = studentDb(), row = (await d.prepare('SELECT l.*,t.active topic_active,c.active category_active FROM lessons l JOIN topics t ON t.id=l.topic_id JOIN categories c ON c.id=t.category_id WHERE l.id=? AND l.published=1 AND l.archived=0').get(id)); return row && row.topic_active && row.category_active && (await activeChain('topics', String(row.topic_id))) && (await activeChain('categories', String((await d.prepare('SELECT category_id FROM topics WHERE id=?').get(String(row.topic_id)))!.category_id))) && (!row.module_id || !!(await d.prepare("SELECT 1 FROM learning_content WHERE id=? AND kind='module' AND status='published' AND parent_id=?").get(String(row.module_id), String(row.course_id)))) && (await courseVisible(row.course_id ? String(row.course_id) : null, studentId)) ? row : null; }
